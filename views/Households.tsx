
import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Edit2, Trash2, Eye, Users as UsersIcon, UserPlus, X, Home, Tag, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';
import { Household, Resident, Role, HouseholdStatus } from '../types';
import { HOUSEHOLD_STATUSES } from '../constants';

interface HouseholdsProps {
  userRole: Role;
  households: Household[];
  residents: Resident[];
  neighborhoodName: string;
  // Fix: Exclude memberCount from the required fields for adding a new household as it's initialized with 0 by the parent component
  onAdd: (h: Omit<Household, 'id' | 'lastUpdate' | 'memberCount'>) => void;
  onUpdate: (h: Household) => void;
  onDelete: (id: string) => void;
}

const Households: React.FC<HouseholdsProps> = ({ userRole, households, residents, neighborhoodName, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{headName: string; address: string; status: HouseholdStatus}>({
    headName: '',
    address: '',
    status: 'Hộ bình thường'
  });

  const itemsPerPage = 8;
  const canEdit = userRole === Role.ADMIN || userRole === Role.EDITOR;

  // Filter and then Sort by ID ascending (HD-0001, HD-0002...)
  const filtered = households
    .filter(h => 
      h.headName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      h.id.includes(searchTerm) ||
      h.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenAdd = () => {
    setEditingHousehold(null);
    setFormData({ headName: '', address: '', status: 'Hộ bình thường' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (h: Household) => {
    setEditingHousehold(h);
    setFormData({ headName: h.headName, address: h.address, status: h.status });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHousehold) {
      onUpdate({ ...editingHousehold, ...formData, lastUpdate: new Date().toISOString().split('T')[0] });
    } else {
      // Fix: Now correctly matches the updated onAdd signature
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  const getMembers = (householdId: string) => {
    return residents.filter(r => r.householdId === householdId);
  };

  const getStatusStyle = (status: HouseholdStatus) => {
    switch (status) {
      case 'Hộ bình thường': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Hộ kinh doanh': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Hộ nghèo': return 'bg-red-100 text-red-700 border-red-200';
      case 'Hộ cận nghèo': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Hộ cho thuê': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Gia đình chính sách': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      onDelete(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const householdToDelete = households.find(h => h.id === confirmDeleteId);
  const membersToDelete = confirmDeleteId ? getMembers(confirmDeleteId) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Hộ gia đình</h2>
          <p className="text-slate-500">{neighborhoodName} có {households.length} hộ dân đăng ký</p>
        </div>
        
        {canEdit && (
          <button 
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 bg-red-800 text-white px-4 py-2.5 rounded-xl hover:bg-red-900 transition-colors shadow-lg"
          >
            <Plus size={18} />
            <span className="font-semibold">Đăng ký Hộ mới</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo mã hộ, tên chủ hộ, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition-all text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã Hộ</th>
                <th className="px-6 py-4">Chủ hộ</th>
                <th className="px-6 py-4">Số nhân khẩu</th>
                <th className="px-6 py-4">Tình trạng</th>
                <th className="px-6 py-4">Địa chỉ</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentItems.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-red-800">{h.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{h.headName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <UsersIcon size={14} className="text-slate-400" />
                      <span className="font-medium text-slate-600">{getMembers(h.id).length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusStyle(h.status)}`}>
                      {h.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-[150px] truncate">{h.address}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedHousehold(h)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                        <Eye size={16} />
                      </button>
                      {canEdit && (
                        <>
                          <button 
                            onClick={() => handleOpenEdit(h)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Sửa">
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(h.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 italic">
                    Không tìm thấy hộ gia đình nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
          <p className="text-sm text-slate-500">Trang {currentPage} / {totalPages || 1}</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-white transition-colors"><ChevronLeft size={16} /></button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-white transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedHousehold && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-800 text-white rounded-xl"><Home size={20} /></div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Chi tiết Hộ: {selectedHousehold.id}</h3>
                  <p className="text-xs text-slate-500">Chủ hộ: {selectedHousehold.headName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedHousehold(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Địa chỉ</p>
                  <p className="text-sm font-semibold text-slate-700">{selectedHousehold.address}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Tổng nhân khẩu</p>
                  <p className="text-sm font-semibold text-slate-700">{getMembers(selectedHousehold.id).length} người</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Tình trạng</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusStyle(selectedHousehold.status)}`}>
                    {selectedHousehold.status}
                  </span>
                </div>
              </div>
              
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <UsersIcon size={16} />
                Danh sách thành viên
              </h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {getMembers(selectedHousehold.id).length > 0 ? getMembers(selectedHousehold.id).map(m => {
                  const isHead = m.fullName === selectedHousehold.headName || m.relationship === 'Chủ hộ';
                  return (
                    <div key={m.id} className="p-3 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                           isHead ? 'bg-red-800 text-white' : 'bg-slate-100 text-slate-500'
                         }`}>
                           {m.fullName.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-800">{m.fullName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                               <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${
                                 isHead ? 'text-red-800' : 'text-slate-400'
                               }`}>
                                 {isHead ? <ShieldCheck size={10} /> : <Heart size={10} />}
                                 {m.relationship || (isHead ? 'Chủ hộ' : 'Thành viên')}
                               </div>
                               <span className="text-[10px] text-slate-300 italic">• {m.dob} • {m.gender}</span>
                            </div>
                         </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">{m.type}</span>
                    </div>
                  )
                }) : (
                  <p className="text-slate-400 text-sm italic py-4 text-center border-2 border-dashed rounded-xl">Hộ chưa có thành viên đăng ký</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{editingHousehold ? 'Cập nhật Hộ khẩu' : 'Đăng ký Hộ mới'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên chủ hộ</label>
                <input 
                  required
                  type="text" 
                  value={formData.headName}
                  onChange={e => setFormData({...formData, headName: e.target.value})}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                  placeholder="Nhập họ và tên..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Địa chỉ</label>
                <input 
                  required
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                  placeholder="Số nhà, hẻm, đường..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tình trạng hộ</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as HouseholdStatus})}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-800 outline-none cursor-pointer"
                >
                  {HOUSEHOLD_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
              <button type="submit" className="flex-1 py-3 bg-red-800 text-white font-bold hover:bg-red-900 rounded-xl transition-colors shadow-lg">Lưu thông tin</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
          <div className="bg-white w-full max-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa Hộ khẩu?</h3>
              <p className="text-slate-500 text-sm mb-4">
                Bạn đang thực hiện xóa hộ <span className="font-bold text-red-800">{confirmDeleteId}</span> của <span className="font-bold text-slate-700">{householdToDelete?.headName}</span>.
              </p>
              
              {membersToDelete.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3 text-left">
                  <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                  <div>
                    <p className="text-amber-800 text-xs font-bold uppercase mb-1">Cảnh báo hệ thống</p>
                    <p className="text-amber-700 text-xs leading-relaxed">
                      Hộ này đang có <strong>{membersToDelete.length} nhân khẩu</strong>. Xóa hộ sẽ khiến các nhân khẩu này trở thành trạng thái "Không thuộc hộ nào".
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg active:scale-95"
                >
                  Xác nhận xóa vĩnh viễn
                </button>
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Households;
