export interface User {
  uid: string
  email: string
  name: string
  role: "manager" | "employee" | "driver"
  createdAt: string
  profileImage?: string
}

export interface UserData {
  name: string
  email: string
  role: "manager" | "employee" | "driver"
  createdAt: string
  profileImage?: string
}

export interface ParkingRecord {
  id: string
  plateNumber: string
  entryTime: string
  exitTime?: string
  status: "parked" | "completed"
  duration?: number
  amount?: number
  employeeId: string
  employeeName: string
}

export interface SiteConfig {
  siteName: string
  siteLogo: string
  backgroundColor: string
  primaryColor: string
  secondaryColor: string
  parkingRate: number
  additionalRate: number
}

export interface PricingConfig {
  firstHourRate: number
  additionalHourRate: number
  dailyMaxRate?: number
  weeklyRate?: number
  monthlyRate?: number
}

export interface ReportFilter {
  startDate: string
  endDate: string
  employeeId?: string
  status?: "all" | "parked" | "completed"
  plateNumber?: string
}

export interface DashboardStats {
  totalCustomers: number
  totalRevenue: number
  currentlyParked: number
  todayRevenue: number
  weeklyRevenue: number
  monthlyRevenue: number
}

export interface ChartData {
  name: string
  value: number
  date?: string
}