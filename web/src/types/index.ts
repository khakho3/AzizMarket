export type UserRole = "buyer" | "seller" | "admin";

export type PaymentType =
  | "Full Payment"
  | "Partial Payment"
  | "Pre-order"
  | "Payment on Delivery";

export type ProductCondition =
  | "Brand New"
  | "Used - Like New"
  | "Used - Good"
  | "New"
  | "Used"
  | "Refurbished";

export type ProductStatus =
  | "Draft"
  | "Pending Review"
  | "Active"
  | "Inactive"
  | "Rejected"
  | "Suspended"
  | "Pending Changes"
  | "Out of Stock";

export type SellerStatus = "Pending Verification" | "Verified" | "Rejected" | "Active" | "Suspended" | "Banned";
export type BuyerStatus = "Active" | "Suspended" | "Banned";

export type PaymentAgreement = PaymentType;

export type PaymentMethod =
  | "Mobile Money"
  | "Card"
  | "Bank Transfer"
  | "Cash on Delivery";

export type OrderStatus =
  | "Order Placed"
  | "Payment Pending"
  | "Payment Confirmed"
  | "Seller Accepted"
  | "Preparing Order"
  | "Ready for Delivery"
  | "Out for Delivery"
  | "Delivered"
  | "Completed"
  | "Cancelled"
  | "Disputed"
  | "Refunded";

export type PaymentStatus =
  | "Pending"
  | "Partially Paid"
  | "Paid"
  | "Pay on Delivery"
  | "Refunded";

export type AdminPaymentStatus = "Pending" | "Successful" | "Failed" | "Partially Paid" | "Refunded" | "Partially Refunded" | "On Hold";

export type DeliveryStatus =
  | "Awaiting Fulfilment"
  | "Preparing"
  | "Ready for Dispatch"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  parentCategoryId?: string;
  createdAt: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface Seller {
  id: string;
  userId: string;
  storeName: string;
  description: string;
  initials: string;
  profileImage?: string;
  location: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  verified: boolean;
  joinedAt: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  logo?: string;
  banner?: string;
  status?: "Active" | "Inactive" | "Suspended";
}

export interface Store {
  sellerId: string;
  storeName: string;
  logo: string;
  banner: string;
  description: string;
  phone: string;
  email: string;
  region: string;
  city: string;
  address: string;
  deliveryInformation: string;
  businessHours: string;
  returnPolicy: string;
  status: "Active" | "Inactive";
}

export interface DeliveryInformation {
  location: string;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  estimatedDeliveryDays: number;
}

export interface ProductPaymentOption {
  type: PaymentType;
  depositPercentage?: number;
  instructions?: string;
  expectedAvailabilityDate?: string;
  cancellationConditions?: string;
  commitmentDepositInformation?: string;
  deliveryFeeRequirements?: string;
}

export interface Product {
  id: string;
  sellerId?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  subcategoryId?: string;
  images: string[];
  price: number;
  previousPrice?: number;
  currency: "GHS";
  stock: number;
  minimumOrderQuantity?: number;
  lowStockThreshold?: number;
  rating: number;
  reviewCount: number;
  condition: ProductCondition;
  location: string;
  paymentTypes: PaymentType[];
  paymentOptions?: ProductPaymentOption[];
  seller: Seller;
  specifications: ProductSpecification[];
  reviews: ProductReview[];
  deliveryInfo: string;
  delivery?: DeliveryInformation;
  status?: ProductStatus;
  views?: number;
  sales?: number;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
  rejectionReason?: string;
  requestedChanges?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  previousPrice?: number;
  quantity: number;
  availableStock: number;
  sellerId: string;
  sellerName: string;
  paymentTypes: PaymentType[];
  location: string;
  deliveryInfo: string;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  deliveryCost: number;
  platformFee: number;
  total: number;
}

export interface BuyerDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  region: string;
  city: string;
  area: string;
  street: string;
  instructions: string;
}

export type DeliveryMethodId = "standard" | "express" | "pickup";

export interface DeliveryMethod {
  id: DeliveryMethodId;
  name: string;
  description: string;
  estimatedPeriod: string;
  price: number;
}

export interface OrderItem extends CartItem {
  unitPrice: number;
}

export interface OrderTimelineStep {
  label: OrderStatus;
  description: string;
  date?: string;
  state: "completed" | "current" | "upcoming";
}

export interface Order {
  id: string;
  createdAt: string;
  buyer: BuyerDetails;
  deliveryAddress: DeliveryAddress;
  deliveryMethod: DeliveryMethod;
  paymentAgreement: PaymentAgreement;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  subtotal: number;
  deliveryFee: number;
  localDelivery?: boolean;
  platformFee: number;
  discount: number;
  total: number;
  amountPaid: number;
  remainingBalance: number;
  currency: "GHS";
  estimatedDeliveryDate: string;
  trackingNumber?: string;
  updatedAt?: string;
  notes?: string;
  timeline?: OrderUpdate[];
  buyerId?: string;
  underReview?: boolean;
  sellerPaymentOnHold?: boolean;
  refundedAmount?: number;
  internalNotes?: AdminNote[];
}

export interface OrderUpdate {
  status: OrderStatus;
  description: string;
  createdAt: string;
  actor: "Buyer" | "Seller" | "Admin" | "System";
}

export interface SellerOrderItem extends OrderItem {
  sellerSubtotal: number;
}

export interface SellerOrder extends Omit<Order, "items"> {
  items: SellerOrderItem[];
  sellerSubtotal: number;
  platformCommission: number;
  sellerEarnings: number;
}

export type EarningsStatus = "Available" | "Pending" | "Withdrawn" | "Refunded";

export type WithdrawalStatus = "Pending" | "Approved" | "Processing" | "Paid" | "Rejected" | "Completed";

export interface EarningsTransaction {
  id: string;
  orderId: string;
  productName: string;
  grossAmount: number;
  commission: number;
  sellerAmount: number;
  status: EarningsStatus;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  method: "Mobile Money" | "Bank";
  accountLabel: string;
  status: WithdrawalStatus;
  createdAt: string;
  processedAt?: string;
  reason?: string;
}

export interface Message {
  id: string;
  sender: "buyer" | "seller";
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  buyerName: string;
  buyerInitials: string;
  productId: string;
  productName: string;
  productImage: string;
  sellerId: string;
  unreadCount: number;
  messages: Message[];
  updatedAt: string;
}

export interface CategoryRequest {
  id: string;
  sellerId: string;
  suggestedName: string;
  description: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  rejectionReason?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
  initials: string;
  permissions: string[];
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: BuyerStatus;
  joinedAt: string;
  lastActiveAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  buyerName: string;
  sellerNames: string[];
  method: PaymentMethod;
  agreement: PaymentAgreement;
  amount: number;
  status: AdminPaymentStatus;
  createdAt: string;
}

export interface CommissionTransaction {
  id: string;
  orderId: string;
  sellerId: string;
  sellerName: string;
  grossAmount: number;
  percentage: number;
  commissionAmount: number;
  sellerEarnings: number;
  status: "Pending" | "Earned" | "Refunded";
  createdAt: string;
}

export type DisputeStatus = "Open" | "Under Review" | "Waiting for Buyer" | "Waiting for Seller" | "Resolved for Buyer" | "Resolved for Seller" | "Partially Resolved" | "Closed";

export interface DisputeHistoryEntry {
  id: string;
  status: DisputeStatus;
  description: string;
  actor: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  reason: string;
  amount: number;
  status: DisputeStatus;
  buyerStatement: string;
  sellerStatement: string;
  openedAt: string;
  updatedAt: string;
  history: DisputeHistoryEntry[];
  adminNotes: AdminNote[];
}

export interface AdminNote {
  id: string;
  adminId: string;
  text: string;
  createdAt: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  actionType: string;
  entityType: "order" | "product" | "category" | "seller" | "buyer" | "payment" | "withdrawal" | "dispute" | "settings";
  entityId: string;
  reason: string;
  previousValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface MarketplaceSettings {
  marketplaceName: string;
  supportEmail: string;
  defaultCommissionPercentage: number;
  categoryCommissionPercentages: Record<string, number>;
  sellerCommissionPercentages: Record<string, number>;
  autoApproveProducts: boolean;
  requireSellerVerification: boolean;
  orderCancellationHours: number;
  paymentAgreements: PaymentType[];
  standardDeliveryFee: number;
  emailNotifications: boolean;
  maintenanceMode: boolean;
  termsPlaceholder: string;
}
