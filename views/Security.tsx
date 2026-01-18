
import React, { useState } from 'react';
import { Role, SecurityEvent, Camera as CameraType, NeighborhoodInfo } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  CheckCircle2, 
  Info,
  Plus,
  MoreVertical,
  Camera,
  Activity,
  X,
  Trash2,
  Edit2,
  Video,
  Monitor,
  Radio,
  Eye,
  Settings2,
  Link2
} from 'lucide-react';

interface SecurityProps {
  userRole: Role;
  events: SecurityEvent[];
  cameras: CameraType[];
  neighborhoodName: string;
  neighborhoodInfo: NeighborhoodInfo;
  onAdd: (e: Omit<SecurityEvent, 'id'>) => void;
  onUpdate: (e: SecurityEvent) => void;
  onDelete: (id: string) => void;
  onUpdateCamera: (c: CameraType) => void;
}

const Security: React.FC<SecurityProps> = ({ userRole, events, cameras, neighborhoodName, neighborhoodInfo, onAdd, onUpdate, onDelete, onUpdateCamera }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Incident' | 'Patrol'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isConfigCameraOpen, setIsConfigCameraOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SecurityEvent | null>(null);
  const [showActionsId, setShowActionsId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<SecurityEvent, 'id'>>({
    title: '',
    type: 'Sự cố',
    time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    description: '',
    status: 'Sắp tới'
  });

  const typeMap: {[key: string]: any} = {
    'Sự cố': { icon: <AlertTriangle size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    'Tuần tra': { icon: <ShieldCheck size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    'Cảnh báo': { icon: <Activity size={16} />, color: 'text-red-600', bg: 'bg-red-50' },
  };

  const statusMap: {[key: string]: any} = {
    'Hoàn tất': 'bg-emerald-100 text-emerald-700',
    'Đang diễn ra': 'bg-red-100 text-red-700 animate-pulse',
    'Sắp tới': 'bg-slate-100 text-slate-600',
  };

  const filtered = events.filter(e => {
    const matchesTab = activeTab === 'All' || 
                      (activeTab === 'Incident' && e.type !== 'Tuần tra') || 
                      (activeTab === 'Patrol' && e.type === 'Tuần tra');
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      onUpdate({ ...editingEvent, ...formData });
    } else {
      onAdd(formData);
    }
    setIsAddModalOpen(false);
    setEditingEvent(null);
  };

  const canManage = userRole === Role.ADMIN || userRole === Role.EDITOR;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">An ninh - Trật tự</h2>
          <p className="text-slate-500">Giám sát sự cố và lịch tuần tra {neighborhoodName}</p>
        </div>
        
        <div className="flex gap-2">
           <button onClick={() => setIsCameraModalOpen(true)} className="flex items-center gap-2 bg-white text-slate-600 px-5 py-3 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm border border-slate-200 shadow-sm active:scale-95">
             <Camera size={18} /> Xem Camera
           </button>
           {canManage && (
             <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-red-800 text-white px-5 py-3 rounded-xl hover:bg-red-900 transition-all font-bold text-sm shadow-lg active:scale-95">
               <Plus size={18} /> Tạo bản tin an ninh
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                 <button onClick={() => setActiveTab('All')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'All' ? 'bg-white shadow-sm text-red-800' : 'text-slate-500'}`}>Tất cả</button>
                 <button onClick={() => setActiveTab('Incident')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'Incident' ? 'bg-white shadow-sm text-red-800' : 'text-slate-500'}`}>Sự cố & Cảnh báo</button>
                 <button onClick={() => setActiveTab('Patrol')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'Patrol' ? 'bg-white shadow-sm text-red-800' : 'text-slate-500'}`}>Lịch tuần tra</button>
              </div>
              <div className="relative flex-1 w-full">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input type="text" placeholder="Tìm kiếm sự kiện..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800/20 text-sm outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
           </div>

           <div className="space-y-4">
              {filtered.map(event => (
                <div key={event.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex gap-6 relative group overflow-visible">
                   <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${typeMap[event.type].bg} ${typeMap[event.type].color} shadow-sm border border-slate-100`}>
                      {typeMap[event.type].icon}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${statusMap[event.status]}`}>{event.status}</span>
                         <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-2">{event.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">{event.description}</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <div className="flex items-center gap-1.5"><MapPin size={12} className="text-red-800" /> {neighborhoodName}</div>
                         <div className="flex items-center gap-1.5"><Info size={12} className="text-blue-800" /> {event.type}</div>
                      </div>
                   </div>
                   {canManage && (
                     <div className="relative">
                       <button onClick={() => setShowActionsId(showActionsId === event.id ? null : event.id)} className="text-slate-300 hover:text-slate-600 h-fit p-1 rounded-lg hover:bg-slate-50 transition-colors">
                         <MoreVertical size={20} />
                       </button>
                       {showActionsId === event.id && (
                         <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                            <button onClick={() => {setEditingEvent(event); setFormData(event); setIsAddModalOpen(true); setShowActionsId(null);}} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"><Edit2 size={12} /> Sửa</button>
                            <button onClick={() => {onDelete(event.id); setShowActionsId(null);}} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={12} /> Xóa</button>
                         </div>
                       )}
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-red-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><Radio size={20} className="animate-pulse" /> Đường dây nóng</h3>
                 <p className="text-red-100 text-sm mb-6 opacity-80">Liên hệ ngay khi có sự cố khẩn cấp.</p>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-red-700/50 pb-2">
                       <span className="text-xs font-bold uppercase tracking-tighter">Công an khu vực</span>
                       <span className="font-mono font-bold">{neighborhoodInfo.policePhone}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-red-700/50 pb-2">
                       <span className="text-xs font-bold uppercase tracking-tighter">Trưởng {neighborhoodName}</span>
                       <span className="font-mono font-bold">{neighborhoodInfo.phone}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                       <span className="text-xs font-bold uppercase tracking-tighter">Cấp cứu/PCCC</span>
                       <span className="font-mono font-bold text-lg text-yellow-300">115 / 114</span>
                    </div>
                 </div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><CheckCircle2 size={18} className="text-emerald-500" /> Thống kê nhanh</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 uppercase">Sự cố mới</span>
                    <span className="text-xl font-black text-slate-800">{events.filter(e => e.type !== 'Tuần tra').length}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl text-red-600">
                    <span className="text-xs font-bold uppercase">Cảnh báo cao</span>
                    <span className="text-xl font-black">{events.filter(e => e.type === 'Cảnh báo' && e.status === 'Đang diễn ra').length}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Camera Modal */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-800 animate-in zoom-in flex flex-col max-h-[90vh]">
             <div className="p-4 bg-slate-800 flex items-center justify-between text-white border-b border-slate-700 shrink-0">
                <h3 className="font-bold text-sm flex items-center gap-2"><Monitor size={18} /> Giám sát Camera Trực tuyến</h3>
                <button onClick={() => setIsCameraModalOpen(false)} className="p-2 hover:bg-slate-700 rounded-xl transition-colors"><X size={20} /></button>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto bg-black flex-1">
                {cameras.map(cam => (
                   <div key={cam.id} className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden group border border-slate-700 shadow-inner">
                      <img src={cam.streamUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" alt={cam.name} />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                         <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[9px] font-black rounded-lg uppercase tracking-widest border border-white/10">{cam.name} • {cam.location}</span>
                         {cam.status === 'online' && <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="p-6 border-b flex items-center justify-between bg-red-800 text-white">
              <h3 className="font-bold text-lg">{editingEvent ? 'Cập nhật bản tin' : 'Tạo bản tin an ninh mới'}</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-red-700 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tiêu đề</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Loại</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-3 bg-slate-50 border-none rounded-xl">
                    <option value="Sự cố">Sự cố</option>
                    <option value="Tuần tra">Tuần tra</option>
                    <option value="Cảnh báo">Cảnh báo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thời gian</label>
                  <input required type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nội dung</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl resize-none"></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl">Hủy</button>
              <button type="submit" className="flex-1 py-3 bg-red-800 text-white font-bold hover:bg-red-900 rounded-xl shadow-lg">Lưu bản tin</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Security;
