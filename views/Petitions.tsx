
import React, { useState } from 'react';
import { Role, Petition } from '../types';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquarePlus, 
  X, 
  Trash2, 
  Reply, 
  History, 
  Tag, 
  User, 
  Phone,
  Search,
  Eye,
  AlertTriangle,
  Info
} from 'lucide-react';

interface PetitionsProps {
  userRole: Role;
  petitions: Petition[];
  neighborhoodName: string;
  onAdd: (p: Omit<Petition, 'id' | 'createdAt' | 'status'>) => void;
  onUpdate: (p: Petition) => void;
  onDelete: (id: string) => void;
}

const Petitions: React.FC<PetitionsProps> = ({ userRole, petitions, neighborhoodName, onAdd, onUpdate, onDelete }) => {
  const [activeFilter, setActiveFilter] = useState<string>('Tất cả');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedPetition, setSelectedPetition] = useState<Petition | null>(null);
  const [viewingPetition, setViewingPetition] = useState<Petition | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Omit<Petition, 'id' | 'createdAt' | 'status'>>({
    title: '',
    content: '',
    category: 'Hành chính',
    sender: '',
    senderPhone: ''
  });

  const [processStatus, setProcessStatus] = useState<Petition['status']>('Đang xử lý');
  const [processReply, setProcessReply] = useState('');

  const statusMap: {[key: string]: any} = {
    'Chờ xử lý': { icon: <Clock size={16} />, color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
    'Đang xử lý': { icon: <History size={16} />, color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
    'Đã hoàn thành': { icon: <CheckCircle size={16} />, color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
    'Đã hủy': { icon: <AlertCircle size={16} />, color: 'bg-slate-100 text-slate-700', border: 'border-slate-200' },
  };

  const categoryMap: {[key: string]: any} = {
    'Hành chính': { color: 'bg-slate-100 text-slate-600', icon: <Info size={10} /> },
    'An ninh': { color: 'bg-red-100 text-red-700', icon: <AlertTriangle size={10} /> },
    'Môi trường': { color: 'bg-green-100 text-green-700', icon: <Tag size={10} /> },
    'Khác': { color: 'bg-slate-100 text-slate-500', icon: <Tag size={10} /> },
  };

  const filtered = petitions
    .filter(p => activeFilter === 'Tất cả' || p.status === activeFilter)
    .filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setIsAddModalOpen(false);
    setFormData({ title: '', content: '', category: 'Hành chính', sender: '', senderPhone: '' });
  };

  const handleOpenProcess = (p: Petition) => {
    setSelectedPetition(p);
    setProcessStatus(p.status);
    setProcessReply(p.reply || '');
    setIsProcessModalOpen(true);
  };

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPetition) {
      onUpdate({ ...selectedPetition, status: processStatus, reply: processReply });
    }
    setIsProcessModalOpen(false);
    setSelectedPetition(null);
  };

  const handleDelete = () => {
    if (confirmDeleteId) {
      onDelete(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const canManage = userRole === Role.ADMIN || userRole === Role.EDITOR;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Phản ánh & Kiến nghị</h2>
          <p className="text-slate-500">{neighborhoodName} • Tiếp nhận ý kiến cư dân</p>
        </div>
        
        {userRole === Role.VIEW && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-red-800 text-white px-5 py-3 rounded-xl hover:bg-red-900 transition-all shadow-lg active:scale-95"
          >
            <MessageSquarePlus size={20} />
            <span className="font-bold">Gửi phản ánh mới</span>
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-4">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full md:w-auto">
          {['Tất cả', 'Chờ xử lý', 'Đang xử lý', 'Đã hoàn thành', 'Đã hủy'].map(status => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === status 
                  ? 'bg-white text-red-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung phản ánh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800/20 text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md hover:border-slate-200 transition-all group">
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusMap[p.status].color} border ${statusMap[p.status].border} flex items-center gap-1.5`}>
                  {statusMap[p.status].icon}
                  {p.status}
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${categoryMap[p.category].color}`}>
                  {categoryMap[p.category].icon}
                  {p.category}
                </span>
                <span className="text-xs text-slate-400 font-medium ml-auto flex items-center gap-1.5">
                  <Clock size={12} />
                  {p.createdAt}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2 leading-tight">{p.title}</h3>
              <p className="text-slate-600 text-sm mb-5 leading-relaxed line-clamp-2">{p.content}</p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><User size={12} /></div>
                  {p.sender}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                   <Phone size={12} />
                   {p.senderPhone}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-6 min-w-[160px]">
              <button 
                onClick={() => setViewingPetition(p)}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
              >
                <Eye size={14} />
                Xem chi tiết
              </button>
              {canManage && (
                <>
                  <button 
                    onClick={() => handleOpenProcess(p)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-slate-900 transition-all shadow-sm"
                  >
                    <Reply size={14} />
                    Xử lý & Phản hồi
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(p.id)}
                    className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-red-100 transition-all border border-red-100"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <MessageSquarePlus size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-medium">Không có phản ánh nào phù hợp</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewingPetition && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
             <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div>
                   <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Chi tiết phản ánh</span>
                   <h3 className="text-lg font-bold mt-1">{viewingPetition.title}</h3>
                </div>
                <button onClick={() => setViewingPetition(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
             </div>
             <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nội dung từ cư dân:</p>
                   <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{viewingPetition.content}</p>
                </div>
                
                {viewingPetition.reply ? (
                   <div className="space-y-2">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Phản hồi từ Ban quản lý:</p>
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                         <p className="text-emerald-900 text-sm leading-relaxed italic font-medium">"{viewingPetition.reply}"</p>
                      </div>
                   </div>
                ) : (
                   <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-sm">
                      <Clock size={18} />
                      Ban quản lý chưa có phản hồi cho yêu cầu này.
                   </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Người gửi</p>
                      <p className="text-sm font-bold text-slate-800">{viewingPetition.sender}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Ngày gửi</p>
                      <p className="text-sm font-bold text-slate-800">{viewingPetition.createdAt}</p>
                   </div>
                </div>
             </div>
             <div className="p-4 bg-slate-50">
                <button onClick={() => setViewingPetition(null)} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">Đóng</button>
             </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h3>
              <p className="text-slate-500 text-sm mb-8">Hành động này sẽ gỡ bỏ phản ánh khỏi hệ thống vĩnh viễn.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleDelete} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">Xác nhận xóa</button>
                <button onClick={() => setConfirmDeleteId(null)} className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Quay lại</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals Add/Process */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="p-6 border-b flex items-center justify-between bg-red-800 text-white">
              <h3 className="font-bold text-lg">Gửi phản ánh - kiến nghị</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-red-700 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tiêu đề phản ánh</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none" placeholder="VD: Đèn đường hỏng, Rác thải..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phân loại</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none">
                    <option value="Hành chính">Hành chính</option>
                    <option value="An ninh">An ninh</option>
                    <option value="Môi trường">Môi trường</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Số điện thoại</label>
                  <input required type="tel" value={formData.senderPhone} onChange={e => setFormData({...formData, senderPhone: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none" placeholder="09xxx..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Họ và tên người gửi</label>
                <input required type="text" value={formData.sender} onChange={e => setFormData({...formData, sender: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none" placeholder="Nhập tên của bạn..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nội dung chi tiết</label>
                <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none resize-none" placeholder="Mô tả cụ thể sự việc..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
              <button type="submit" className="flex-1 py-3 bg-red-800 text-white font-bold hover:bg-red-900 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2">
                <Send size={18} />
                Gửi phản ánh
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Process Modal */}
      {isProcessModalOpen && selectedPetition && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <form onSubmit={handleProcessSubmit} className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex items-center justify-between bg-slate-900 text-white">
              <h3 className="font-bold text-lg">Xử lý & Phản hồi</h3>
              <button type="button" onClick={() => setIsProcessModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tiêu đề: {selectedPetition.title}</p>
                <p className="text-sm text-slate-700">"{selectedPetition.content}"</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Trạng thái mới</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Chờ xử lý', 'Đang xử lý', 'Đã hoàn thành', 'Đã hủy'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setProcessStatus(s as any)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                        processStatus === s 
                          ? 'bg-red-800 text-white border-red-800' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nội dung phản hồi cư dân</label>
                <textarea rows={4} value={processReply} onChange={e => setProcessReply(e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-800 outline-none resize-none" placeholder="Nhập câu trả lời..."></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button type="button" onClick={() => setIsProcessModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">Đóng</button>
              <button type="submit" className="flex-1 py-3 bg-slate-800 text-white font-bold hover:bg-red-900 rounded-xl transition-colors shadow-lg">Cập nhật</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Petitions;
