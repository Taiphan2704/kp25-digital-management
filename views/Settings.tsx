
import React, { useState, useEffect } from 'react';
import { NeighborhoodInfo, Role } from '../types';
import { 
  Settings as SettingsIcon, 
  MapPin, 
  User, 
  Phone, 
  Save, 
  Download, 
  Database, 
  ShieldCheck, 
  Users, 
  Home, 
  MessageSquare, 
  Bell,
  RefreshCcw,
  CheckCircle2,
  ShieldAlert,
  Bot,
  Key,
  ExternalLink,
  Info,
  Sparkles,
  Globe
} from 'lucide-react';

interface SettingsProps {
  userRole: Role;
  info: NeighborhoodInfo;
  onUpdateInfo: (info: NeighborhoodInfo) => void;
  onBackup: (type: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ userRole, info, onUpdateInfo, onBackup }) => {
  const [formData, setFormData] = useState<NeighborhoodInfo>({ ...info });
  const [isSaved, setIsSaved] = useState(false);
  const [backupLoading, setBackupLoading] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  
  // Kiểm tra môi trường AI Studio
  const isAIStudio = !!(window as any).aistudio;

  useEffect(() => {
    const checkKey = async () => {
      try {
        if (isAIStudio && (window as any).aistudio?.hasSelectedApiKey) {
          const selected = await (window as any).aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } else if (import.meta.env.VITE_API_KEY && import.meta.env.VITE_API_KEY !== 'nhap_ma_api_key_cua_ban_tai_day') {
           setHasKey(true);
        }
      } catch (e) {
        console.error("Lỗi kiểm tra API Key:", e);
      }
    };
    checkKey();
  }, [isAIStudio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateInfo(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleOpenKeySelector = async () => {
    try {
      if ((window as any).aistudio?.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
        setHasKey(true);
      }
    } catch (e) {
      alert("Không thể mở trình chọn Key. Vui lòng thử lại.");
    }
  };

  const handleBackupClick = (type: string) => {
    setBackupLoading(type);
    setTimeout(() => {
      onBackup(type);
      setBackupLoading(null);
    }, 1000);
  };

  const backupOptions = [
    { id: 'all', label: 'Toàn bộ dữ liệu', icon: <Database size={18} />, color: 'bg-red-800' },
    { id: 'households', label: 'Hộ gia đình', icon: <Home size={18} />, color: 'bg-blue-600' },
    { id: 'residents', label: 'Nhân khẩu', icon: <Users size={18} />, color: 'bg-emerald-600' },
    { id: 'security', label: 'An ninh - Trật tự', icon: <ShieldCheck size={18} />, color: 'bg-amber-600' },
    { id: 'petitions', label: 'Phản ánh - Kiến nghị', icon: <MessageSquare size={18} />, color: 'bg-indigo-600' },
    { id: 'notifications', label: 'Thông báo - Văn bản', icon: <Bell size={18} />, color: 'bg-slate-600' },
  ];

  if (userRole !== Role.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <ShieldCheck size={64} className="mb-4 opacity-20" />
        <p className="font-bold">Bạn không có quyền truy cập trang này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cài đặt Hệ thống</h2>
          <p className="text-slate-500">Quản lý cấu hình khu phố và an toàn dữ liệu</p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl font-bold text-sm border border-emerald-100 animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 size={18} /> Đã lưu cấu hình thành công!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <SettingsIcon size={20} className="text-red-800" />
              Thông tin Khu phố
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tên Khu phố / Tổ dân phố</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-800/20 focus:border-red-800 outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Trưởng khu phố</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      value={formData.representative} 
                      onChange={e => setFormData({...formData, representative: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-800/20 focus:border-red-800 outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">SĐT Trưởng Khu phố</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-800/20 focus:border-red-800 outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Công an khu vực</label>
                  <div className="relative">
                    <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      value={formData.policeOfficer} 
                      onChange={e => setFormData({...formData, policeOfficer: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-800/20 focus:border-red-800 outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">SĐT Công an khu vực</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      value={formData.policePhone} 
                      onChange={e => setFormData({...formData, policePhone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-800/20 focus:border-red-800 outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phường / Xã</label>
                  <input 
                    type="text" 
                    value={formData.ward} 
                    onChange={e => setFormData({...formData, ward: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-800/20 focus:border-red-800 outline-none text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Quận / Huyện / Thành phố</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-800/20 focus:border-red-800 outline-none text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-red-800 text-white py-4 rounded-2xl font-bold hover:bg-red-900 transition-all shadow-lg active:scale-[0.98]"
            >
              <Save size={18} />
              Lưu thay đổi thông tin
            </button>
          </form>
        </section>

        <section className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Bot size={20} className="text-red-800" />
                Cấu hình Trí tuệ nhân tạo (AI)
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className={`rounded-2xl p-5 border ${hasKey ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl ${hasKey ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {hasKey ? <CheckCircle2 size={20} /> : <Key size={20} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái AI</p>
                    <p className={`text-sm font-bold ${hasKey ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {hasKey ? 'Sẵn sàng hoạt động' : 'Chưa thiết lập API Key'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hệ thống AI chỉ hoạt động khi khu phố cung cấp mã API Key riêng (Gemini). Điều này giúp bảo mật dữ liệu và tách biệt chi phí cho từng đơn vị.
                </p>
              </div>

              <div className="space-y-4">
                {isAIStudio ? (
                  <button 
                    onClick={handleOpenKeySelector}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]"
                  >
                    <Sparkles size={18} />
                    {hasKey ? 'Thay đổi Gemini API Key' : 'Kết nối Gemini API Key'}
                  </button>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                    <Globe size={20} className="text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-blue-900">Đang chạy trên môi trường Web/Render</p>
                      <p className="text-[11px] text-blue-700 leading-relaxed">
                        Vui lòng truy cập trang quản trị **Render Dashboard**, tìm mục **Environment Variables** và thiết lập biến `API_KEY` cho khu phố này.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-red-800 transition-colors py-2 border border-slate-100 rounded-xl"
                  >
                    <ExternalLink size={14} />
                    Hướng dẫn đăng ký Key & Thanh toán
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Database size={20} className="text-blue-600" />
                Sao lưu & Bảo vệ dữ liệu
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {backupOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleBackupClick(option.id)}
                    disabled={!!backupLoading}
                    className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-red-800/30 hover:bg-slate-100/50 transition-all group"
                  >
                    <div className={`w-10 h-10 ${option.color} text-white rounded-xl flex items-center justify-center`}>
                      {backupLoading === option.id ? <RefreshCcw size={18} className="animate-spin" /> : option.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">{option.label}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Xuất file JSON</p>
                    </div>
                    <Download size={14} className="ml-auto text-slate-300 group-hover:text-red-800 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
