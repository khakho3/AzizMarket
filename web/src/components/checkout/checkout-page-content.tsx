"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { CartIcon, ShieldIcon } from "@/components/common/icons";
import { Container } from "@/components/common/container";
import { EmptyState } from "@/components/common/empty-state";
import { AddressForm } from "@/components/checkout/address-form";
import { CheckoutSection } from "@/components/checkout/checkout-section";
import { DeliveryMethodSelector } from "@/components/checkout/delivery-method-selector";
import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentAgreementSelector } from "@/components/checkout/payment-agreement-selector";
import {
  PaymentMethodSelector,
  type PaymentDetailsState,
} from "@/components/checkout/payment-method-selector";
import { useCart } from "@/context/cart-context";
import { useProducts } from "@/context/product-context";
import { deliveryMethods } from "@/data/checkout";
import {
  cartItemsToOrderItems,
  createOrderId,
  getStoredOrders,
  saveOrder,
} from "@/services/order-storage";
import type {
  BuyerDetails,
  DeliveryAddress,
  DeliveryMethodId,
  Order,
  PaymentAgreement,
  PaymentMethod,
  PaymentStatus,
} from "@/types";
import { areAllSellersNearBuyer } from "@/utils/delivery";

const depositPercentage = 30;
const inputClass = "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";

export function CheckoutPageContent() {
  const router = useRouter();
  const { items, subtotal, platformFee, clearCart } = useCart();
  const { reduceStock } = useProducts();
  const [buyer, setBuyer] = useState<BuyerDetails>({ fullName: "", email: "", phone: "" });
  const [address, setAddress] = useState<DeliveryAddress>({ region: "", city: "", area: "", street: "", instructions: "" });
  const [deliveryMethodId, setDeliveryMethodId] = useState<DeliveryMethodId>("standard");
  const [agreement, setAgreement] = useState<PaymentAgreement>("Full Payment");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Mobile Money");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsState>({ mobileNetwork: "", mobileNumber: "", cardholderName: "", cardNumber: "", expiryDate: "", cvv: "" });
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const availableAgreements = useMemo<PaymentAgreement[]>(() => {
    const agreements: PaymentAgreement[] = ["Full Payment", "Partial Payment", "Pre-order", "Payment on Delivery"];
    return agreements.filter((candidate) =>
      items.every((item) => item.paymentTypes.includes(candidate)),
    );
  }, [items]);
  const deliveryMethod = deliveryMethods.find((method) => method.id === deliveryMethodId) ?? deliveryMethods[0];
  const sellersAreNearby = areAllSellersNearBuyer(items, address.city);
  const localDelivery = sellersAreNearby && deliveryMethodId !== "pickup";
  const deliveryFee = deliveryMethodId === "pickup" || sellersAreNearby ? 0 : deliveryMethod.price;
  const discount = items.reduce(
    (total, item) => total + Math.max(0, (item.previousPrice ?? item.price) - item.price) * item.quantity,
    0,
  );
  const total = subtotal + deliveryFee + platformFee;
  const amountPayableNow =
    agreement === "Partial Payment"
      ? subtotal * (depositPercentage / 100) + deliveryFee + platformFee
      : agreement === "Payment on Delivery"
        ? deliveryFee + platformFee
        : total;
  const remainingBalance = Math.max(0, total - amountPayableNow);

  if (!items.length) {
    return (
      <Container className="py-12 sm:py-16">
        <EmptyState
          icon={<CartIcon className="size-8" />}
          title="Your cart is empty"
          description="Add at least one product before starting checkout. Your selected products will remain available after refreshing."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      </Container>
    );
  }

  function validatePaymentDetails(): string {
    if (paymentMethod === "Mobile Money" && (!paymentDetails.mobileNetwork || !paymentDetails.mobileNumber.trim())) {
      return "Select a mobile money network and enter a demonstration phone number.";
    }
    if (paymentMethod === "Card" && (!paymentDetails.cardholderName.trim() || !paymentDetails.cardNumber.trim() || !paymentDetails.expiryDate.trim() || !paymentDetails.cvv.trim())) {
      return "Complete all demonstration card fields before placing the order.";
    }
    if (!availableAgreements.includes(agreement)) {
      return "The selected payment agreement is not supported by every item in your cart.";
    }
    return "";
  }

  function handleAgreementChange(nextAgreement: PaymentAgreement) {
    setAgreement(nextAgreement);
    if (nextAgreement !== "Payment on Delivery" && paymentMethod === "Cash on Delivery") {
      setPaymentMethod("Mobile Money");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const paymentError = validatePaymentDetails();
    if (paymentError) {
      setError(paymentError);
      return;
    }

    setPlacingOrder(true);
    const existingOrders = getStoredOrders();
    const id = createOrderId(existingOrders);
    const paymentStatus: PaymentStatus =
      paymentMethod === "Bank Transfer"
        ? "Pending"
        : agreement === "Partial Payment"
          ? "Partially Paid"
          : agreement === "Payment on Delivery"
            ? "Pay on Delivery"
            : "Paid";
    const amountPaid = paymentMethod === "Bank Transfer" ? 0 : amountPayableNow;
    const estimatedDays = deliveryMethodId === "express" ? 2 : deliveryMethodId === "pickup" ? 1 : 5;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);

    const order: Order = {
      id,
      createdAt: new Date().toISOString(),
      buyer,
      deliveryAddress: address,
      deliveryMethod: { ...deliveryMethod, price: deliveryFee },
      paymentAgreement: agreement,
      paymentMethod,
      items: cartItemsToOrderItems(items),
      status: paymentStatus === "Pending" ? "Payment Pending" : "Order Placed",
      paymentStatus,
      deliveryStatus: "Awaiting Fulfilment",
      subtotal,
      deliveryFee,
      localDelivery,
      platformFee,
      discount,
      total,
      amountPaid,
      remainingBalance: paymentMethod === "Bank Transfer" ? total : remainingBalance,
      currency: "GHS",
      estimatedDeliveryDate: estimatedDate.toISOString(),
      timeline: [{ status: paymentStatus === "Pending" ? "Payment Pending" : "Order Placed", description: "The buyer placed the order.", createdAt: new Date().toISOString(), actor: "Buyer" }],
    };

    saveOrder(order);
    reduceStock(items.map((item) => ({ productId: item.productId, quantity: item.quantity })));
    clearCart();
    router.push(`/checkout/success?orderId=${encodeURIComponent(id)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50/60 py-10 sm:py-14">
      <Container className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] xl:gap-10">
        <div className="space-y-5">
          <CheckoutSection number={1} title="Contact information" description="We will use these details for order and delivery updates.">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><label htmlFor="buyer-name" className="text-sm font-bold text-slate-800">Full name</label><input id="buyer-name" required autoComplete="name" value={buyer.fullName} onChange={(event) => setBuyer({ ...buyer, fullName: event.target.value })} placeholder="Hassan Abdul Aziz" className={inputClass} /></div>
              <div><label htmlFor="buyer-email" className="text-sm font-bold text-slate-800">Email address</label><input id="buyer-email" type="email" required autoComplete="email" value={buyer.email} onChange={(event) => setBuyer({ ...buyer, email: event.target.value })} placeholder="you@example.com" className={inputClass} /></div>
              <div><label htmlFor="buyer-phone" className="text-sm font-bold text-slate-800">Phone number</label><input id="buyer-phone" type="tel" required autoComplete="tel" value={buyer.phone} onChange={(event) => setBuyer({ ...buyer, phone: event.target.value })} placeholder="+233 24 000 0000" className={inputClass} /></div>
            </div>
          </CheckoutSection>
          <CheckoutSection number={2} title="Delivery address"><AddressForm address={address} onChange={setAddress} /></CheckoutSection>
          <CheckoutSection number={3} title="Delivery method"><DeliveryMethodSelector value={deliveryMethodId} onChange={setDeliveryMethodId} isLocalDelivery={sellersAreNearby} buyerCity={address.city} /></CheckoutSection>
          <CheckoutSection number={4} title="Payment agreement" description="Only agreements supported by every product in your cart are shown."><PaymentAgreementSelector available={availableAgreements} value={agreement} amountPayableNow={amountPayableNow} remainingBalance={remainingBalance} depositPercentage={depositPercentage} onChange={handleAgreementChange} /></CheckoutSection>
          <CheckoutSection number={5} title="Payment method"><PaymentMethodSelector agreement={agreement} method={paymentMethod} details={paymentDetails} onMethodChange={setPaymentMethod} onDetailsChange={setPaymentDetails} /></CheckoutSection>
          {error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">{error}</p> : null}
          <button type="submit" disabled={placingOrder} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-4 text-sm font-black text-white hover:bg-emerald-800 disabled:bg-slate-400"><ShieldIcon className="size-5" /> {placingOrder ? "Placing order…" : `Place Order · ${new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(amountPayableNow)}`}</button>
          <p className="text-center text-xs leading-5 text-slate-500">By placing this mock order, you confirm the delivery and payment agreement details above. No real payment will be processed.</p>
        </div>
        <OrderSummary items={items} subtotal={subtotal} deliveryFee={deliveryFee} platformFee={platformFee} discount={discount} total={total} amountPayableNow={amountPayableNow} remainingBalance={remainingBalance} agreement={agreement} isLocalDelivery={localDelivery} />
      </Container>
    </form>
  );
}
