
export enum Role {
  ADMIN = 'admin',
  EDITOR = 'editor', // Trưởng khu phố, Công an khu vực
  VIEW = 'view'     // Người dùng / Dân cư
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
  fullName: string;
  position?: string;
}

export interface NeighborhoodInfo {
  name: string;
  representative: string; // Trưởng khu phố
  phone: string;          // SĐT Trưởng khu phố
  policeOfficer: string;  // Công an khu vực
  policePhone: string;    // SĐT Công an khu vực
  ward: string;
  city: string;
}

export interface Resident {
  id: string;
  householdId: string;
  fullName: string;
  dob: string;
  gender: 'Nam' | 'Nữ';
  idNumber: string;
  type: 'Thường trú' | 'Tạm trú' | 'Tạm vắng';
  address: string;
  currentAddress: string; // Nơi ở hiện nay
  phoneNumber: string;
  job: string;
  relationship?: string; // Quan hệ với chủ hộ (Vợ, Con, Cháu, ...)
}

export type HouseholdStatus = 'Hộ bình thường' | 'Hộ kinh doanh' | 'Hộ nghèo' | 'Hộ cận nghèo' | 'Hộ cho thuê' | 'Gia đình chính sách';

export interface Household {
  id: string;
  headName: string;
  memberCount: number;
  address: string;
  lastUpdate: string;
  status: HouseholdStatus;
}

export interface Petition {
  id: string;
  title: string;
  content: string;
  sender: string;
  senderPhone: string;
  status: 'Chờ xử lý' | 'Đang xử lý' | 'Đã hoàn thành' | 'Đã hủy';
  createdAt: string;
  category: 'Hành chính' | 'An ninh' | 'Môi trường' | 'Khác';
  reply?: string; // Phản hồi từ ban quản lý
}

export interface SecurityEvent {
  id: string;
  title: string;
  type: 'Sự cố' | 'Tuần tra' | 'Cảnh báo';
  time: string;
  description: string;
  status: 'Hoàn tất' | 'Đang diễn ra' | 'Sắp tới';
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  streamUrl: string; // URL thực tế (HLS/WebRTC/iFrame)
  status: 'online' | 'offline';
  lastActive: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  isUrgent: boolean;
}

export interface LegalDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  publishDate: string;
  url?: string;
  pdfUrl?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}
