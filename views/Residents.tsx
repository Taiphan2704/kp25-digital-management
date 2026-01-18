
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  User as UserIcon, 
  MapPin, 
  Briefcase, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Heart,
  FilterX,
  UserRound,
  Baby,
  UserCheck,
  Home
} from 'lucide-react';
import { Resident, Role, Household, HouseholdStatus } from '../types';
import { RELATIONSHIPS, HOUSEHOLD_STATUSES } from '../constants';

interface ResidentsProps {
  userRole: Role;
  residents: Resident[];
  households: Household[];
  neighborhoodName: string;
  onAdd: (r: Omit<Resident, 'id'>) => void;
  onUpdate: (r: Resident) => void;
  onDelete: (id: string) => void;
}

const Residents: React.FC<ResidentsProps> = ({ userRole, residents, households, neighborhoodName, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    gender: 'Tất cả',
    type: 'Tất cả',
    ageGroup: 'Tất cả',
    householdStatus: 'Tất cả' as HouseholdStatus | 'Tất cả'
  });

  const [formData, setFormData] = useState<Omit<Resident, 'id'>>({
    fullName: '',
    dob: '',
    gender: 'Nam',
    idNumber: '', 
    householdId: households.length > 0 ? households[0].id : '',
    type: 'Thường trú',
    address: '',
    currentAddress: '',
    phoneNumber: '',
    job: '',
    relationship: 'Khác'
  });

  const itemsPerPage = 10;
  const canEdit = userRole === Role.ADMIN || userRole === Role.EDITOR;

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const filtered = useMemo(() => {
    return residents.filter(r => {
      const matchesSearch = 
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.householdId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.currentAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.idNumber.includes(searchTerm);

      const matchesGender = filters.gender === 'Tất cả' || r.gender === filters.gender;
      const matchesType = filters.type === 'Tất cả' || r.type === filters.type;
      
      const age = calculateAge(r.dob);
      let matchesAge = true;
      if (filters.ageGroup === 'Trẻ em') matchesAge = age < 18;
      else if (filters.ageGroup === 'Lao động') matchesAge = age >= 18 && age < 60;
      else if (filters.ageGroup === 'Người cao tuổi') matchesAge = age >= 60;

      let matchesHStatus = true;
      if (filters.householdStatus !== 'Tất cả') {
        const hh = households.find(h => h.id === r.householdId);
        matchesHStatus = hh?.status === filters.householdStatus;
      }

      return matchesSearch && matchesGender && matchesType && matchesAge && matchesHStatus;
    });
  }, [residents, searchTerm, filters, households]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenAdd = () => {
    setEditingResident(null);
    setFormData({
      fullName: '',
      dob: '1990-01-01',
      gender: 'Nam',
      idNumber: '',
      householdId: households.length > 0 ? households[0].id : '',
      type: 'Thường trú',
      address: '',
      currentAddress: '',
      phoneNumber: '',
      job: '',
      relationship: 'Con'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: Resident) => {
    setEditingResident(r);
    setFormData({ ...r });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResident) {
      onUpdate({ ...editingResident, ...formData });
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Dân cư</h2>
          <p className="text-slate-500">{neighborhoodName} hiện có {residents.length} nhân khẩu</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-semibold ${isFilterPanelOpen ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
            <Filter size={18} /> Lọc nâng cao
          </button>
          {canEdit && (
            <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-red-800 text-white px-4 py-2.5 rounded-xl hover:bg-red-900 transition-colors shadow-lg active:scale-95">
              <Plus size={18} /> Thêm nhân khẩu
            </button>
          )}
        </div>
      </div>

      {isFilterPanelOpen && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-top-4 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Giới tính</label>
              <select value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})} className="w-full p-2.5 bg-slate-50 rounded-xl text-sm font-semibold outline-none">
                <option value="Tất cả">Tất cả</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Độ tuổi</label>
              <select value={filters.ageGroup} onChange={e => setFilters({...filters, ageGroup: e.target.value})} className="w-full p-2.5 bg-slate-50 rounded-xl text-sm font-semibold outline-none">
                <option value="Tất cả">Tất cả</option>
                <option value="Trẻ em">Trẻ em (&lt;18)</option>
                <option value="Lao động">Lao động (18-60)</option>
                <option value="Người cao tuổi">Người cao tuổi (&gt;60)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Cư trú</label>
              <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="w-full p-2.5 bg-slate-50 rounded-xl text-sm font-semibold outline-none">
                <option value="Tất cả">Tất cả</option>
                <option value="Thường trú">Thường trú</option>
                <option value="Tạm trú">Tạm trú</option>
                <option value="Tạm vắng">Tạm vắng</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => setFilters({gender:'Tất cả', type:'Tất cả', ageGroup:'Tất cả', householdStatus:'Tất cả'})} className="w-full py-2.5 text-red-800 text-xs font-bold border border-red-100 rounded-xl hover:bg-red-50">Xóa bộ lọc</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Tìm tên, mã hộ, CCCD, địa chỉ hiện nay..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm" />
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Họ và tên</th>
                <th className="px-6 py-4">Giới tính</th>
                <th className="px-6 py-4">Tuổi</th>
                <th className="px-6 py-4">Hộ khẩu / Quan hệ</th>
                <th className="px-6 py-4">Nơi ở hiện nay</th>
                <th className="px-6 py-4">Cư trú</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentItems.map((res) => {
                const age = calculateAge(res.dob);
                return (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{res.fullName}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">{res.idNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${res.gender === 'Nam' ? 'text-blue-600 bg-blue-50' : 'text-pink-600 bg-pink-50'}`}>{res.gender}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">{age} tuổi</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-red-800">{res.householdId}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{res.relationship || 'Thành viên'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-[150px] truncate">{res.currentAddress}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${res.type === 'Thường trú' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{res.type}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100">
                         <button onClick={() => setSelectedResident(res)} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg" title="Xem chi tiết"><Eye size={16} /></button>
                         {canEdit && (
                           <>
                             <button onClick={() => handleOpenEdit(res)} className="p-1.5 text-amber-600 bg-amber-50 rounded-lg" title="Sửa"><Edit2 size={16} /></button>
                             <button onClick={() => setConfirmDeleteId(res.id)} className="p-1.5 text-red-600 bg-red-50 rounded-lg" title="Xóa"><Trash2 size={16} /></button>
                           </>
                         )}
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-50 flex items-center justify-between border-t shrink-0">
          <p className="text-sm text-slate-500">Trang {currentPage} / {totalPages || 1}</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-1.5 border rounded-lg disabled:opacity-30 hover:bg-white transition-colors"><ChevronLeft size={16} /></button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 border rounded-lg disabled:opacity-30 hover:bg-white transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      {selectedResident && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">Chi tiết nhân khẩu</h3>
              <button onClick={() => setSelectedResident(null)} className="p-1 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 border-b pb-6">
                <div className="w-16 h-16 bg-red-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold">{selectedResident.fullName.charAt(0)}</div>
                <div>
                  <p className="text-xl font-bold text-slate-800">{selectedResident.fullName}</p>
                  <p className="text-sm text-slate-500 font-mono">{selectedResident.idNumber || 'Chưa cập nhật CCCD'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Mã Hộ khẩu</p><p className="font-bold text-red-800">{selectedResident.householdId}</p></div>
                <div><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Quan hệ</p><p className="font-bold">{selectedResident.relationship}</p></div>
                <div><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ngày sinh</p><p className="font-bold">{selectedResident.dob}</p></div>
                <div><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Giới tính</p><p className="font-bold">{selectedResident.gender}</p></div>
                <div className="col-span-2"><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Nơi ở hiện nay</p><p className="font-bold text-slate-700">{selectedResident.currentAddress}</p></div>
                <div className="col-span-2"><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Địa chỉ thường trú</p><p className="font-bold text-slate-700">{selectedResident.address}</p></div>
                <div><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Nghề nghiệp</p><p className="font-bold">{selectedResident.job || 'Tự do'}</p></div>
                <div><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Điện thoại</p><p className="font-bold">{selectedResident.phoneNumber || 'N/A'}</p></div>
              </div>
              <div className="pt-4">
                <button onClick={() => setSelectedResident(null)} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-auto">
            <div className="p-6 bg-red-800 text-white flex justify-between items-center">
              <h3 className="font-bold">{editingResident ? 'Cập nhật dân cư' : 'Thêm nhân khẩu mới'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Họ và tên</label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-red-800/20" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">CCCD / Mã định danh</label>
                <input type="text" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Ngày sinh</label>
                <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Giới tính</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Mã Hộ gia đình</label>
                <select required value={formData.householdId} onChange={e => setFormData({...formData, householdId: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none">
                  <option value="">-- Chọn mã hộ --</option>
                  {households.map(h => <option key={h.id} value={h.id}>{h.id} - {h.headName}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quan hệ chủ hộ</label>
                <select value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none">
                  {RELATIONSHIPS.map(rel => <option key={rel} value={rel}>{rel}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Cư trú</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none">
                  <option value="Thường trú">Thường trú</option>
                  <option value="Tạm trú">Tạm trú</option>
                  <option value="Tạm vắng">Tạm vắng</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nơi ở hiện nay</label>
                <input required type="text" value={formData.currentAddress} onChange={e => setFormData({...formData, currentAddress: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-red-800/20" placeholder="Nhập địa chỉ đang sinh sống..." />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Đ/c Thường trú</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-red-800/20" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Điện thoại</label>
                <input type="tel" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nghề nghiệp</label>
                <input type="text" value={formData.job} onChange={e => setFormData({...formData, job: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none" />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
              <button type="submit" className="flex-1 py-3 bg-red-800 text-white font-bold rounded-xl shadow-lg hover:bg-red-900 transition-colors">Lưu thông tin</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">Xác nhận xóa?</h3>
            <p className="text-slate-500 mb-6 text-sm">Bạn có chắc chắn muốn xóa nhân khẩu này khỏi hệ thống vĩnh viễn?</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => { onDelete(confirmDeleteId); setConfirmDeleteId(null); }} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg active:scale-95">Xóa vĩnh viễn</button>
              <button onClick={() => setConfirmDeleteId(null)} className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Hủy bỏ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Residents;
