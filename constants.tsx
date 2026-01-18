
import { Role, Resident, Household, Petition, SecurityEvent, Notification, AuditLog, HouseholdStatus, LegalDocument, Camera, NeighborhoodInfo, User } from './types';
import React from 'react';
import { 
  Users, 
  Home, 
  ShieldCheck, 
  MessageSquare, 
  Bell, 
  LayoutDashboard, 
  History,
  Settings,
  UserCog
} from 'lucide-react';

export const COLORS = {
  primary: '#800000', // Đỏ đô
  secondary: '#001F3F', // Xanh đậm
  white: '#FFFFFF',
  accent: '#1e40af', // Blue accent
};

export const INITIAL_NEIGHBORHOOD_INFO: NeighborhoodInfo = {
  name: 'Khu phố 25',
  representative: 'Nguyễn Thị Hồng Thủy',
  phone: '0773735317',
  policeOfficer: 'Trần Hữu Hùng',
  policePhone: '0988897709',
  ward: 'Phường Long Trường',
  city: 'Thành phố Hồ Chí Minh'
};

export const HOUSEHOLD_STATUSES: HouseholdStatus[] = [
  'Hộ bình thường',
  'Hộ kinh doanh',
  'Hộ nghèo',
  'Hộ cận nghèo',
  'Hộ cho thuê',
  'Gia đình chính sách'
];

export const RELATIONSHIPS = [
  'Chủ hộ',
  'Vợ',
  'Chồng',
  'Con',
  'Cha',
  'Mẹ',
  'Anh',
  'Chị',
  'Em',
  'Cháu',
  'Ông',
  'Bà',
  'Con dâu',
  'Con rể',
  'Khác'
];

export const INITIAL_USERS: User[] = [
  { id: 'u-1', username: 'admin', password: '123', role: Role.ADMIN, fullName: 'Quản trị viên Hệ thống' },
  { id: 'u-2', username: 'editor1', password: '123', role: Role.EDITOR, fullName: 'Nguyễn Thị Hồng Thủy', position: 'Trưởng Khu phố 25' },
  { id: 'u-3', username: 'editor2', password: '123', role: Role.EDITOR, fullName: 'Trần Hữu Hùng', position: 'Công an khu vực' },
  { id: 'u-4', username: 'viewer', password: '123', role: Role.VIEW, fullName: 'Lê Văn Tốt' ,  position: 'Trưởng Ban CTMT' }
];

export const MOCK_USER: {[key: string]: User} = {
  admin: INITIAL_USERS[0],
  truongkhu: INITIAL_USERS[1],
  congan: INITIAL_USERS[2],
  citizen: INITIAL_USERS[3]
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} />, roles: [Role.ADMIN, Role.EDITOR, Role.VIEW] },
  { id: 'households', label: 'Hộ gia đình', icon: <Home size={20} />, roles: [Role.ADMIN, Role.EDITOR, Role.VIEW] },
  { id: 'residents', label: 'Dân cư', icon: <Users size={20} />, roles: [Role.ADMIN, Role.EDITOR, Role.VIEW] },
  { id: 'security', label: 'An ninh - Trật tự', icon: <ShieldCheck size={20} />, roles: [Role.ADMIN, Role.EDITOR, Role.VIEW] },
  { id: 'petitions', label: 'Phản ánh - Kiến nghị', icon: <MessageSquare size={20} />, roles: [Role.ADMIN, Role.EDITOR, Role.VIEW] },
  { id: 'notifications', label: 'Thông báo - Văn bản', icon: <Bell size={20} />, roles: [Role.ADMIN, Role.EDITOR, Role.VIEW] },
  { id: 'user-management', label: 'Quản lý người dùng', icon: <UserCog size={20} />, roles: [Role.ADMIN] },
  { id: 'logs', label: 'Nhật ký hệ thống', icon: <History size={20} />, roles: [Role.ADMIN] },
  { id: 'settings', label: 'Cài đặt', icon: <Settings size={20} />, roles: [Role.ADMIN] },
];

export const MOCK_RESIDENTS: Resident[] = Array.from({ length: 50 }, (_, i) => {
  const isHead = i % 4 === 0;
  return {
    id: `res-${i}`,
    householdId: `HD-${(Math.floor(i / 4) + 1).toString().padStart(4, '0')}`,
    fullName: isHead ? `Chủ hộ ${(Math.floor(i / 4) + 1)}` : `Thành viên ${i + 1}`,
    dob: '1990-01-01',
    gender: i % 2 === 0 ? 'Nam' : 'Nữ',
    idNumber: `07909000${i.toString().padStart(4, '0')}`,
    type: i % 10 === 0 ? 'Tạm trú' : 'Thường trú',
    address: `Số ${i + 1}, Đường số 1, Long Trường, TP. HCM`,
    currentAddress: `Số ${i + 1}, Đường số 1, Long Trường, TP. HCM`,
    phoneNumber: isHead ? `0909000${i.toString().padStart(3, '0')}` : '',
    job: 'Lao động tự do',
    relationship: isHead ? 'Chủ hộ' : (i % 4 === 1 ? 'Vợ' : (i % 4 === 2 ? 'Con' : 'Cháu'))
  }
});

export const MOCK_HOUSEHOLDS: Household[] = Array.from({ length: 15 }, (_, i) => ({
  id: `HD-${(i + 1).toString().padStart(4, '0')}`,
  headName: `Chủ hộ ${i + 1}`,
  memberCount: 4,
  address: `Khu phố 25, Long Trường`,
  lastUpdate: '2024-03-20',
  status: HOUSEHOLD_STATUSES[i % HOUSEHOLD_STATUSES.length]
}));

export const MOCK_PETITIONS: Petition[] = [
  { id: 'p-1', title: 'Đèn đường hỏng tại hẻm 1130', content: 'Đèn đường đã hỏng 1 tuần qua, bóng đèn cháy khét, gây khó khăn cho việc di chuyển ban đêm.', sender: 'Nguyễn Văn X', senderPhone: '0987654321', status: 'Đang xử lý', createdAt: '2024-03-22', category: 'Hành chính', reply: 'Đã tiếp nhận và chuyển cho đơn vị chiếu sáng đô thị xử lý trong tuần này.' },
  { id: 'p-2', title: 'Tụ tập gây mất an ninh', content: 'Có nhóm thanh niên lạ mặt thường xuyên tụ tập uống rượu và hò hét gây ồn ào tại đầu hẻm 18 đường số 4 sau 23h.', sender: 'Lê Thị Y', senderPhone: '0123456789', status: 'Đã hoàn thành', createdAt: '2024-03-21', category: 'An ninh', reply: 'Lực lượng dân phòng đã tăng cường tuần tra và nhắc nhở, nhóm thanh niên đã giải tán.' },
];

export const MOCK_SECURITY: SecurityEvent[] = [
  { id: 's-1', title: 'Tuần tra đêm phối hợp', type: 'Tuần tra', time: '2024-03-26 22:00', description: 'Đội dân phòng phối hợp công an phường tuần tra toàn bộ các hẻm tại Đường số 4.', status: 'Sắp tới' },
  { id: 's-2', title: 'Xử lý cây xanh đổ ngã', type: 'Sự cố', time: '2024-03-20 18:30', description: 'Mưa lớn gây đổ cây tại đường NDT, đã được dọn dẹp giải tỏa giao thông.', status: 'Hoàn tất' },
  { id: 's-3', title: 'Cảnh báo lừa đảo qua mạng', type: 'Cảnh báo', time: '2024-03-24 09:00', description: 'Xuất hiện tình trạng giả danh cán bộ phường để thu tiền phí vệ sinh.', status: 'Đang diễn ra' },
];

export const MOCK_CAMERAS: Camera[] = [
  { id: 'cam-01', name: 'CAM 01', location: 'Hẻm 5 - Đầu hẻm 43', streamUrl: 'https://picsum.photos/seed/cam1/800/450', status: 'online', lastActive: '2024-03-25 14:00' },
  { id: 'cam-02', name: 'CAM 02', location: 'Hẻm 10 - Đầu hẻm 63', streamUrl: 'https://picsum.photos/seed/cam2/800/450', status: 'online', lastActive: '2024-03-25 14:00' },
  { id: 'cam-03', name: 'CAM 03', location: 'Hẻm 15 - Đầu đường số 4', streamUrl: 'https://picsum.photos/seed/cam3/800/450', status: 'online', lastActive: '2024-03-25 14:00' },
  { id: 'cam-04', name: 'CAM 04', location: 'Hẻm 20 - Cuối hẻm 1130', streamUrl: 'https://picsum.photos/seed/cam4/800/450', status: 'online', lastActive: '2024-03-25 14:00' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n-1', title: 'Lịch họp tổ dân phố tháng 4/2024', content: 'Kính mời bà con tham dự cuộc họp định kỳ để triển khai công tác an ninh và vệ sinh môi trường quý I/2026.', author: 'Trưởng khu phố', date: '2026-01-10', isUrgent: true },
  { id: 'n-2', title: 'Thông báo tiêm chủng mở rộng', content: 'Tiêm chủng định kỳ cho trẻ em từ 0-5 tuổi tại Trạm Y tế Long Trường vào thứ 4 tuần tới.', author: 'Ban điều hành', date: '2026-01-25', isUrgent: false },
  { id: 'n-3', title: 'Kế hoạch cắt điện bảo trì', content: 'Điện lực Thủ Thiêm thông báo cắt điện tạm thời để nâng cấp trạm biến áp hẻm 63 từ 08h-11h ngày 28/01.', author: 'Điện lực Thủ Thiêm', date: '2024-03-25', isUrgent: true },
];

export const MOCK_LEGAL_DOCUMENTS: LegalDocument[] = [
  { 
    id: 'doc-1', 
    title: 'Luật Cư trú 2020', 
    description: 'Luật số 68/2020/QH14 được Quốc hội ban hành ngày 13/11/2020, quy định về thực hiện quyền tự do cư trú của công dân. Điểm nổi bật là xóa bỏ sổ hộ khẩu giấy, thay thế bằng quản lý dân cư thông qua số định danh cá nhân và Cơ sở dữ liệu quốc gia về dân cư. Luật quy định chi tiết về điều kiện đăng ký thường trú, tạm trú và thông báo lưu trú trực tuyến.', 
    category: 'Luật', 
    publishDate: '2020-11-13',
    url: 'https://vbpl.vn/TW/Pages/vbpq-thuoctinh.aspx?ItemID=145325',
    pdfUrl: 'https://vbpl.vn/bocongan/Pages/vbpq-van-ban-goc.aspx?ItemID=145325'
  },
  { 
    id: 'doc-2', 
    title: 'Nghị định 144/2021/NĐ-CP', 
    description: 'Quy định xử phạt vi phạm hành chính trong lĩnh vực an ninh, trật tự, an toàn xã hội; phòng, chống tệ nạn xã hội; phòng cháy và chữa cháy; cứu nạn, cứu hộ; phòng, chống bạo lực gia đình. Nghị định này thay thế Nghị định 167/2013, tăng mức xử phạt đối với các hành vi như gây tiếng ồn nơi công cộng, không thực hiện khai báo cư trú, và vi phạm các quy định về trật tự đô thị.', 
    category: 'Nghị định', 
    publishDate: '2021-12-31',
    url: 'https://vbpl.vn/TW/Pages/vbpq-thuoctinh.aspx?ItemID=152292',
    pdfUrl: 'https://vbpl.vn/chinhphu/Pages/vbpq-van-ban-goc.aspx?ItemID=152292'
  },
  { 
    id: 'doc-3', 
    title: 'Quy tắc ứng xử KP25', 
    description: 'Bộ quy tắc ứng xử văn minh được xây dựng riêng cho cư dân Khu phố 25, Long Trường. Nội dung bao gồm: 1. Giữ gìn vệ sinh chung, bỏ rác đúng giờ quy định. 2. Không gây tiếng ồn, hát karaoke sau 22h đêm. 3. Tích cực tham gia các phong trào toàn dân bảo vệ an ninh Tổ quốc. 4. Đoàn kết, giúp đỡ láng giềng trong hoạn nạn. 5. Chấp hành nghiêm chỉnh việc khai báo tạm trú cho khách lưu trú qua đêm.', 
    category: 'Quy định địa phương', 
    publishDate: '2024-01-01',
    url: '#',
    pdfUrl: '#'
  },
  { 
    id: 'doc-4', 
    title: 'Hướng dẫn khai báo số', 
    description: 'Tài liệu hướng dẫn chi tiết cho cư dân thực hiện dịch vụ công trực tuyến qua Cổng dịch vụ công Quốc gia và ứng dụng VNeID. Bao gồm: Các bước đăng ký tài khoản định danh điện tử VNeID mức độ 2; Quy trình thông báo lưu trú trực tuyến; Đăng ký tạm trú, tạm vắng qua mạng. Chuyển đổi từ hồ sơ giấy sang hồ sơ điện tử giúp minh bạch hóa và đẩy nhanh tiến độ xử lý thủ tục hành chính.', 
    category: 'Hướng dẫn', 
    publishDate: '2023-05-15',
    url: 'https://dichvucong.bocongan.gov.vn/',
    pdfUrl: '#'
  },
];

export const MOCK_LOGS: AuditLog[] = [
  { id: 'l-1', userId: '1', userName: 'Admin', action: 'Cập nhật dân cư', timestamp: '2026-01-19 10:00:23', details: 'Thay đổi địa chỉ thường trú của Nguyễn Văn A' },
  { id: 'l-2', userId: '2', userName: 'editor1', action: 'Phản hồi kiến nghị', timestamp: '2026-01-16 11:15:10', details: 'Trả lời phản ánh p-1 của cư dân' },
];
