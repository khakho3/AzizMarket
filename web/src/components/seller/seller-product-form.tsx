"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CategoryRequestModal } from "@/components/seller/category-request-modal";
import { DeliveryForm } from "@/components/seller/delivery-form";
import { ImageUploader } from "@/components/seller/image-uploader";
import { PaymentOptionsSelector } from "@/components/seller/payment-options-selector";
import { SpecificationEditor } from "@/components/seller/specification-editor";
import { useCategories } from "@/context/category-context";
import { useProducts } from "@/context/product-context";
import { useAdmin } from "@/context/admin-context";
import { currentSeller } from "@/data/current-seller";
import type { DeliveryInformation, Product, ProductCondition, ProductPaymentOption, ProductSpecification, ProductStatus } from "@/types";
import { slugify } from "@/utils/slugify";

const conditions: ProductCondition[] = ["New", "Used", "Refurbished"];

export function SellerProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const { products, addProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  const { sellerRecords } = useAdmin();
  const existing = productId ? products.find((product) => product.id === productId && product.seller.id === currentSeller.id) : undefined;
  const [name, setName] = useState(existing?.name ?? "");
  const [shortDescription, setShortDescription] = useState(existing?.shortDescription ?? existing?.description.slice(0, 140) ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [price, setPrice] = useState(existing?.price.toString() ?? "");
  const [previousPrice, setPreviousPrice] = useState(existing?.previousPrice?.toString() ?? "");
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState(existing?.minimumOrderQuantity?.toString() ?? "1");
  const [stock, setStock] = useState(existing?.stock.toString() ?? "");
  const [lowStockThreshold, setLowStockThreshold] = useState(existing?.lowStockThreshold?.toString() ?? "5");
  const [condition, setCondition] = useState<ProductCondition>(conditions.includes(existing?.condition ?? "New") ? existing?.condition ?? "New" : "New");
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? "");
  const [subcategoryId, setSubcategoryId] = useState(existing?.subcategoryId ?? "");
  const [images, setImages] = useState(existing?.images ?? []);
  const [paymentOptions, setPaymentOptions] = useState<ProductPaymentOption[]>(existing?.paymentOptions ?? existing?.paymentTypes.map((type) => ({ type })) ?? [{ type: "Full Payment" }]);
  const [delivery, setDelivery] = useState<DeliveryInformation>(existing?.delivery ?? { location: `${existing?.location ?? "Cape Coast"}, Central`, deliveryAvailable: true, pickupAvailable: true, standardDeliveryFee: 35, expressDeliveryFee: 60, estimatedDeliveryDays: 3 });
  const [specifications, setSpecifications] = useState<ProductSpecification[]>(existing?.specifications ?? [{ label: "", value: "" }]);
  const [requestOpen, setRequestOpen] = useState(false);
  const [error, setError] = useState("");
  const mainCategories = categories.filter((category) => category.isActive && !category.parentCategoryId);
  const subcategories = useMemo(() => categories.filter((category) => category.isActive && category.parentCategoryId === categoryId), [categories, categoryId]);
  const discount = previousPrice && price && Number(previousPrice) > Number(price) ? Math.round(((Number(previousPrice) - Number(price)) / Number(previousPrice)) * 100) : 0;
  const sellerStatus = sellerRecords.find((seller) => seller.sellerId === currentSeller.id)?.status ?? "Active";

  if (productId && !existing) return <div className="rounded-2xl bg-white p-12 text-center"><h1 className="text-2xl font-black">Product not found</h1><p className="mt-2 text-sm text-slate-500">This product does not belong to the current seller.</p><Link href="/seller/products" className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Back to products</Link></div>;
  if (!existing && ["Suspended", "Banned", "Rejected"].includes(sellerStatus)) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-12 text-center"><h1 className="text-2xl font-black text-amber-900">Product creation unavailable</h1><p className="mt-2 text-sm text-amber-800">Your seller account is {sellerStatus}. Existing active orders remain available, but new products cannot be added.</p><Link href="/seller" className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Return to dashboard</Link></div>;

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const action = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status = (action?.value ?? "Draft") as ProductStatus;
    const category = mainCategories.find((item) => item.id === categoryId);
    const subcategory = subcategoryId ? subcategories.find((item) => item.id === subcategoryId) : undefined;
    if (!name.trim() || !shortDescription.trim() || !description.trim()) return setError("Complete all required product information.");
    if (!category) return setError("Select a valid active main category.");
    if (subcategoryId && !subcategory) return setError("Select a valid subcategory.");
    if (Number(price) <= 0 || Number(stock) < 0 || Number(minimumOrderQuantity) < 1) return setError("Enter valid pricing, stock and minimum order values.");
    if (!paymentOptions.length) return setError("Select at least one payment option.");
    const id = existing?.id ?? `product-${window.crypto.randomUUID()}`;
    const createdAt = existing?.createdAt ?? new Date().toISOString();
    const effectiveStatus = Number(stock) === 0 && status === "Active" ? "Out of Stock" : status;
    const cleanSpecifications = specifications.filter((item) => item.label.trim() && item.value.trim());
    const product: Product = {
      id,
      sellerId: currentSeller.id,
      name: name.trim(),
      slug: existing?.slug ?? `${slugify(name)}-${id.slice(-6)}`,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      categoryId: category.id,
      subcategoryId: subcategory?.id,
      images: images.length ? images : [category.image, "/products/detail-green.svg", "/products/detail-amber.svg"],
      price: Number(price),
      previousPrice: previousPrice ? Number(previousPrice) : undefined,
      currency: "GHS",
      stock: Number(stock),
      minimumOrderQuantity: Number(minimumOrderQuantity),
      lowStockThreshold: Number(lowStockThreshold),
      rating: existing?.rating ?? 0,
      reviewCount: existing?.reviewCount ?? 0,
      condition,
      location: delivery.location.split(",")[0],
      paymentTypes: paymentOptions.map((option) => option.type),
      paymentOptions,
      seller: currentSeller,
      specifications: cleanSpecifications,
      reviews: existing?.reviews ?? [],
      deliveryInfo: `${delivery.deliveryAvailable ? `${delivery.estimatedDeliveryDays}-day delivery from ${delivery.location}` : "Delivery unavailable"}${delivery.pickupAvailable ? "; pickup available" : ""}.`,
      delivery,
      status: effectiveStatus,
      views: existing?.views ?? 0,
      sales: existing?.sales ?? 0,
      isActive: effectiveStatus === "Active",
      featured: existing?.featured ?? false,
      createdAt,
      updatedAt: new Date().toISOString(),
    };
    if (existing) updateProduct(existing.id, product); else addProduct(product);
    router.push("/seller/products");
  }

  const input = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";
  return <>
    <div><Link href="/seller/products" className="text-sm font-bold text-emerald-700">← Back to products</Link><h1 className="mt-3 text-3xl font-black text-slate-950">{existing ? "Edit product" : "Add a product"}</h1><p className="mt-2 text-sm text-slate-500">Build a complete listing and choose when it becomes visible to buyers.</p></div>
    <form onSubmit={save} className="mt-8 space-y-6">
      {error ? <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</div> : null}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="text-lg font-black">1. Basic information</h2><div className="mt-5 grid gap-5"><label className="text-sm font-bold">Product name<input required value={name} onChange={(event) => setName(event.target.value)} className={input} /></label><label className="text-sm font-bold">Short description<input required maxLength={160} value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} className={input} /><span className="mt-1 block text-right text-[10px] text-slate-400">{shortDescription.length}/160</span></label><label className="text-sm font-bold">Full description<textarea required rows={6} value={description} onChange={(event) => setDescription(event.target.value)} className={input} /></label></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="flex items-center justify-between"><h2 className="text-lg font-black">2. Category information</h2><button type="button" onClick={() => setRequestOpen(true)} className="text-xs font-bold text-emerald-700">Request New Category</button></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Main category<select required value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setSubcategoryId(""); }} className={input}><option value="">Select category</option>{mainCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="text-sm font-bold">Subcategory<select value={subcategoryId} onChange={(event) => setSubcategoryId(event.target.value)} disabled={!subcategories.length} className={`${input} disabled:bg-slate-100`}><option value="">{subcategories.length ? "Select subcategory" : "No subcategories available"}</option>{subcategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="text-lg font-black">3. Pricing</h2><div className="mt-5 grid gap-5 sm:grid-cols-3"><label className="text-sm font-bold">Product price (GH₵)<input required type="number" min="0.01" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className={input} /></label><label className="text-sm font-bold">Previous price<input type="number" min="0" step="0.01" value={previousPrice} onChange={(event) => setPreviousPrice(event.target.value)} className={input} /><span className="mt-1 block text-xs text-emerald-700">{discount ? `${discount}% discount` : "No discount"}</span></label><label className="text-sm font-bold">Minimum order quantity<input required type="number" min="1" value={minimumOrderQuantity} onChange={(event) => setMinimumOrderQuantity(event.target.value)} className={input} /></label></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="text-lg font-black">4. Stock and condition</h2><div className="mt-5 grid gap-5 sm:grid-cols-3"><label className="text-sm font-bold">Available quantity<input required type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} className={input} /></label><label className="text-sm font-bold">Low-stock warning<input type="number" min="0" value={lowStockThreshold} onChange={(event) => setLowStockThreshold(event.target.value)} className={input} /></label><label className="text-sm font-bold">Condition<select value={condition} onChange={(event) => setCondition(event.target.value as ProductCondition)} className={input}>{conditions.map((item) => <option key={item}>{item}</option>)}</select></label></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><ImageUploader images={images} onChange={setImages} onError={setError} /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><PaymentOptionsSelector value={paymentOptions} onChange={setPaymentOptions} /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><DeliveryForm value={delivery} onChange={setDelivery} /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><SpecificationEditor specifications={specifications} onChange={setSpecifications} /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="text-lg font-black">9. Product status</h2><p className="mt-2 text-sm text-slate-500">Drafts stay private. Submitted products wait for review. “Make Active” is a frontend-only mock admin action.</p><div className="mt-5 flex flex-wrap justify-end gap-3"><Link href="/seller/products" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600">Cancel</Link><button type="submit" value="Draft" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black">Save as Draft</button><button type="submit" value="Pending Review" className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950">Submit for Review</button><button type="submit" value="Active" className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white">Make Active (test)</button></div></section>
    </form>
    <CategoryRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
  </>;
}
