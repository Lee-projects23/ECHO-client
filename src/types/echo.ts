export type ViewMode =
  | 'welcome'
  | 'home'
  | 'dashboard'
  | 'maintenance'
  | 'maintenance-detail'
  | 'raised-activity'
  | 'raise-new-activity'
  | 'activity-detail'
  | 'work-history'
  | 'bill-book'
  | 'payments'
  | 'pay-now'
  | 'group-chat'
  | 'documents'
  | 'profile'
  | 'help';

export type Language = 'en' | 'ta' | 'hi';

export interface Site {
  site_id: string;
  name: string;
  address: string;
  areaSqFt: number;
  type: string;
}

export interface ClientProfile {
  client_id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  gstin: string;
  gstAddress: string;
  avatarUrl: string;
  registeredSites: Site[];
}

export type MaintenanceStatus =
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Awaiting Verification';

export interface MaintenanceRecord {
  maintenance_id: string;
  site_id: string;
  siteName: string;
  siteAddress: string;
  maintenanceType: string;
  description: string;
  employee_id: string;
  employeeName: string;
  employeeRole: string;
  date: string;
  time: string;
  status: MaintenanceStatus;
  cost: number;
  beforePhoto?: string;
  afterPhoto?: string;
  notes: string;
}

export type ActivityStatus =
  | 'Raised'
  | 'Acknowledged'
  | 'Assigned to Employee'
  | 'Work In Progress'
  | 'Work Completed'
  | 'Awaiting Admin Verification'
  | 'Resolved'
  | 'Closed';

export interface ActivityTimelineEvent {
  timestamp: string;
  title: string;
  description?: string;
  actor?: string;
}

export interface RaisedActivity {
  activity_id: string;
  code: string; // e.g. RA-00482
  client_id: string;
  site_id: string;
  siteName: string;
  problem: string;
  description: string;
  clientNotes?: string;
  date: string;
  time: string;
  status: ActivityStatus;
  timeline: ActivityTimelineEvent[];
  photos: string[];
  voiceNote?: {
    duration: string;
    url?: string;
    recordedAt: string;
  };
  assignedEmployee?: string;
}

export type QuotationStatus =
  | 'Draft'
  | 'Sent'
  | 'Viewed'
  | 'Pending Review'
  | 'Accepted'
  | 'Rejected'
  | 'Expired';

export interface Quotation {
  quotation_id: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  description: string;
  amount: number;
  status: QuotationStatus;
  items: {
    item: string;
    qty: number;
    unitPrice: number;
    total: number;
  }[];
}

export type InvoiceStatus =
  | 'Pending'
  | 'Partially Paid'
  | 'Paid'
  | 'Overdue';

export interface Invoice {
  invoice_id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  service: string;
  subtotal: number;
  tax: number;
  amount: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  items: {
    description: string;
    amount: number;
  }[];
}

export interface Bill {
  bill_id: string;
  billNumber: string;
  date: string;
  service: string;
  amount: number;
  status: 'Settled' | 'Processing';
}

export interface Voucher {
  voucher_id: string;
  voucherNumber: string;
  date: string;
  type: string;
  amount: number;
  status: 'Approved' | 'Disbursed';
  remarks?: string;
}

export interface PaymentTransaction {
  payment_id: string;
  transactionId: string;
  invoiceNumber: string;
  invoice_id: string;
  date: string;
  time: string;
  amount: number;
  method: string;
  status: 'Success' | 'Failed';
  referenceNote?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'admin' | 'employee';
  text: string;
  timestamp: string;
  attachment?: {
    type: 'image' | 'document' | 'audio';
    name: string;
    url?: string;
    size?: string;
    duration?: string;
  };
}

export interface ChatGroup {
  groupId: string;
  name: string;
  siteName: string;
  adminName: string;
  assignedEmployees: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline: boolean;
  messages: ChatMessage[];
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'Quotation' | 'Invoice' | 'Bill' | 'Agreement' | 'Report' | 'Receipt';
  referenceNo: string;
  date: string;
  fileSize: string;
  downloadUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  targetView: ViewMode;
  targetId?: string;
}
