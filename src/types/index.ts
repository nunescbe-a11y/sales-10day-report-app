export type RegionType = 'India' | 'Export';

export type StatusCategory = 
  | 'Dispatched' 
  | 'Pending Dispatch' 
  | 'Delivered / Saled' 
  | 'Partial Supply' 
  | 'Order Placed';

export interface StatusOption {
  id: string;
  text: string;
  label?: string;
  category: StatusCategory;
}

export interface SaleItem {
  id: string;
  slNo: number;
  inqDate: string; // YYYY-MM-DD
  recPayDate: string; // YYYY-MM-DD
  region: RegionType;
  item: string;
  comName: string;
  purCost: number;
  lanCost: number;
  sellCost: number;
  advanPay: number;
  balance: number;
  packingCharges: number;
  forwardingCharges: number;
  gst: number; // percentage, e.g. 18
  gstAmount?: number; // computed or user-customized GST amount in INR
  overallAmount: number;
  grossProfit?: number; // computed or user-edited gross profit
  purchaserName: string; // Rep name: yazhini, naveena, janani, etc.
  itemStatus: string; // descriptive status from user
  statusCategory: StatusCategory;
  cycleId: string; // e.g. '2026-10-C2', '2026-10-C3'
  isDraft?: boolean; // true if saved in half / incomplete
  notes?: string;
  updatedAt: string;
}

export interface ReportingCycle {
  id: string;
  name: string;
  month: string;
  cycleNumber: 1 | 2 | 3;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface SalesRep {
  id: string;
  username: string; // login username
  password: string; // employee password
  name: string; // normalized name matching Excel
  displayName: string;
  email: string;
  pin: string; // quick PIN fallback
  avatarColor: string;
  avatarUrl?: string; // profile photo image path or base64 data URL
  targetAmount: number;
}

export type CurrentUserRole = 'MD' | string;

export interface UserSession {
  isAuthenticated: boolean;
  role: 'MD' | 'EMPLOYEE';
  repId: string; // 'MD' or rep name
  repName: string;
  isDeviceLocked: boolean;
}

export interface CelebrationState {
  isActive: boolean;
  message: string;
  employeeName: string;
}
