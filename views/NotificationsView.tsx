
import React, { useState } from 'react';
import { Role, Notification, LegalDocument } from '../types';
import { 
  Bell, 
  FileText, 
  AlertCircle, 
  Calendar, 
  User, 
  Search, 
  ChevronRight, 
  Plus,
  Trash2,
  Bookmark,
  X,
  ExternalLink,
  Info,
  Download,
  BookOpen,
  Megaphone,
  Clock
} from 'lucide-react';
import { MOCK_LEGAL_DOCUMENTS } from '../constants';

interface NotificationsViewProps {
  userRole: Role;
  notices: Notification[];
  neighborhoodName: string;
  wardCity: string;
  onAdd: (n: Omit<Notification, 'id' | 'date' | 'author'>) => void;
  onDelete: (id: string) => void;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ userRole, notices, neighborhoodName, wardCity, onAdd, onDelete }) => {
  const [legalDocs, setLegalDocs] = useState<LegalDocument[]>(MOCK_LEGAL_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingDoc, setViewingDoc] = useState<LegalDocument | null>(null);
  const [viewingNotice, setViewingNotice] = useState<Notification | null>(null);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [isAddNoticeModalOpen, setIsAddNoticeModalOpen] = useState(false);

  // Form states
  const [noticeFormData, setNoticeFormData] = useState({
    title: '',
    content: '',
    isUrgent: false
  });

  const [docFormData, setDocFormData] = useState<Omit<LegalDocument, 'id'>>({
    title: '',
    description: '',
    category: 'Luật',
    publishDate: new Date().toISOString().split('T')[0]
  });

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManage = userRole === Role.ADMIN || userRole === Role.EDITOR;

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(noticeFormData);
    setIsAddNoticeModalOpen(false);
    setNoticeFormData({ title: '', content: '', isUrgent: false });
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: LegalDocument = {
      ...docFormData,
      id: `doc-${Date.now()}`
    };
    setLegalDocs([...legalDocs, newDoc]);
    setIsAddDocModalOpen(false);
    setDocFormData({ title: '', description: '', category: 'Luật', publishDate: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLegalDocs(legalDocs.filter(doc => doc.id !== id));
  };

  const openExternalLink = (url?: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert("Văn bản nội bộ hoặc đường dẫn đang được cập nhật.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Thông báo & Văn bản</h2>
          <p className="text-slate-500">Hệ thống thông tin {neighborhoodName} • {wardCity}</p>
        </div>
        
        {canManage && (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAddNoticeModalOpen(true)}
              className="flex items-center gap-2 bg-red-800 text-white px-5 py-3 rounded-xl hover:bg-red-900 transition-all shadow-lg font-bold text-sm active:scale-95"
            >
              <Plus size={18} />
              Đăng thông báo
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Tìm kiếm thông báo, văn bản chỉ đạo..." 
                   className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800/20 text-sm outline-none"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           <div className="space-y-4">
              {filteredNotices.map(notice => (
                <div key={notice.id} className={`bg-white p-6 rounded-3xl shadow-sm border ${notice.isUrgent ? 'border-red-100 bg-red-50/10' : 'border-slate-100'} hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden group`}>
                   {notice.isUrgent && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-800"></div>}
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                         {notice.isUrgent ? (
                           <span className="flex items-center gap-1 px-2 py-0.5 bg-red-800 text-white text-[9px] font-black uppercase rounded">
                             <AlertCircle size={10} /> Khẩn
                           </span>
                         ) : (
                           <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded">
                             Thông báo
                           </span>
                         )}
                         <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {notice.date}
                         </span>
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${notice.isUrgent ? 'text-red-900' : 'text-slate-800'}`}>{notice.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{notice.content}</p>
                      
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                            <User size={12} /> {notice.author}
                         </div>
                         <button 
                          onClick={() => setViewingNotice(notice)}
                          className="text-[10px] font-bold text-red-800 flex items-center gap-1 hover:underline active:scale-95 transition-transform"
                         >
                            Xem toàn văn <ChevronRight size={12} />
                         </button>
                      </div>
                   </div>
                   {canManage && (
                     <button 
                      onClick={() => onDelete(notice.id)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 transition-all"
                     >
                        <Trash2 size={18} />
                     </button>
                   )}
                </div>
              ))}
              {filteredNotices.length === 0 && (
                <div className="py-20 text-center text-slate-400 font-medium bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  Không tìm thấy thông báo nào phù hợp.
                </div>
              )}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  Văn bản pháp lý
                </h3>
                {canManage && (
                  <button 
                    onClick={() => setIsAddDocModalOpen(true)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-800 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <div className="space-y-1">
                 {legalDocs.map((doc) => (
                   <button 
                     key={doc.id} 
                     onClick={() => setViewingDoc(doc)}
                     className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center justify-between group transition-all border-b border-slate-50 last:border-0"
                   >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-700 group-hover:text-red-800 truncate transition-colors">{doc.title}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter mt-0.5">{doc.category}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {canManage && (
                          <span 
                            onClick={(e) => handleDeleteDoc(doc.id, e)}
                            className="p-1 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 transition-all"
                          >
                            <Trash2 size={12} />
                          </span>
                        )}
                        <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                   </button>
                 ))}
              </div>
              <button className="w-full mt-4 py-2 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">TẤT CẢ VĂN BẢN</button>
           </div>

           <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Bookmark size={18} className="text-red-500" />
                    Lưu ý quan trọng
                 </h3>
                 <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                       <p className="text-xs text-slate-300 leading-relaxed">Cư dân vui lòng thực hiện định danh điện tử mức độ 2 trước ngày 30/06.</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                       <p className="text-xs text-slate-300 leading-relaxed">Phí vệ sinh môi trường tháng 03/2024 bắt đầu thu từ ngày 25 hàng tháng.</p>
                    </div>
                 </div>
              </div>
              <Bell className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
           </div>
        </div>
      </div>

      {/* View Modal */}
      {viewingNotice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
             <div className={`p-8 ${viewingNotice.isUrgent ? 'bg-red-800' : 'bg-slate-900'} text-white relative`}>
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase opacity-70 tracking-widest">Chi tiết thông báo</span>
                      {viewingNotice.isUrgent && (
                        <span className="px-2 py-0.5 bg-white text-red-800 text-[8px] font-black uppercase rounded">Khẩn cấp</span>
                      )}
                   </div>
                   <h3 className="text-2xl font-bold tracking-tight leading-tight">{viewingNotice.title}</h3>
                </div>
                <button 
                  onClick={() => setViewingNotice(null)} 
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  <X size={24} />
                </button>
             </div>
             
             <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-slate-100">
                   <div className="text-slate-400 flex items-center gap-2 text-xs font-medium">
                      <Calendar size={14} className="text-slate-300" />
                      Ngày đăng: <span className="text-slate-600 font-bold">{viewingNotice.date}</span>
                   </div>
                   <div className="text-slate-400 flex items-center gap-2 text-xs font-medium">
                      <User size={14} className="text-slate-300" />
                      Người đăng: <span className="text-slate-600 font-bold uppercase">{viewingNotice.author}</span>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
                     {viewingNotice.content}
                   </p>
                </div>
             </div>

             <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setViewingNotice(null)} 
                  className="flex-1 py-4 bg-white text-slate-600 border border-slate-200 font-bold rounded-2xl hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Đóng
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Add Notice Modal */}
      {isAddNoticeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleAddNotice} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="p-6 border-b flex items-center justify-between bg-red-800 text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Megaphone size={20} />
                Đăng thông báo mới
              </h3>
              <button type="button" onClick={() => setIsAddNoticeModalOpen(false)} className="p-2 hover:bg-red-700 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tiêu đề thông báo</label>
                <input required type="text" value={noticeFormData.title} onChange={e => setNoticeFormData({...noticeFormData, title: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none" placeholder="VD: Thông báo họp..." />
              </div>
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                <input type="checkbox" id="urgent" checked={noticeFormData.isUrgent} onChange={e => setNoticeFormData({...noticeFormData, isUrgent: e.target.checked})} className="w-4 h-4" />
                <label htmlFor="urgent" className="text-sm font-bold text-red-900 cursor-pointer">Thông báo KHẨN CẤP</label>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nội dung chi tiết</label>
                <textarea required rows={6} value={noticeFormData.content} onChange={e => setNoticeFormData({...noticeFormData, content: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none resize-none text-sm" placeholder="Nhập nội dung..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button type="button" onClick={() => setIsAddNoticeModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
              <button type="submit" className="flex-1 py-3 bg-red-800 text-white font-bold hover:bg-red-900 rounded-xl shadow-lg">Đăng bản tin</button>
            </div>
          </form>
        </div>
      )}

      {/* View Doc Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
             <div className="p-8 bg-[#001F3F] text-white relative">
                <h3 className="text-2xl font-bold">{viewingDoc.title}</h3>
                <button onClick={() => setViewingDoc(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
             </div>
             <div className="p-8 space-y-6">
                <p className="text-slate-700 leading-relaxed">{viewingDoc.description}</p>
                <button onClick={() => openExternalLink(viewingDoc.url)} className="w-full py-4 bg-red-800 text-white font-bold rounded-2xl">Xem bản đầy đủ</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsView;
