
import React, { useState } from 'react';
import { User, Role } from '../types';
import { 
  UserCog, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Key, 
  Shield, 
  X, 
  Check, 
  AlertTriangle,
  User as UserIcon,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface UserManagementProps {
  currentUser: User;
  users: User[];
  onAddUser: (u: Omit<User, 'id'>) => void;
  onUpdateUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser, users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    fullName: '',
    username: '',
    password: '',
    role: Role.VIEW,
    position: ''
  });

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ fullName: '', username: '', password: '', role: Role.VIEW, position: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({ ...u });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser({ ...editingUser, ...formData });
    } else {
      onAddUser(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (confirmDeleteId) {
      onDeleteUser(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.ADMIN: return <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded"><ShieldAlert size={10} /> Admin</span>;
      case Role.EDITOR: return <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded"><Shield size={10} /> Editor</span>;
      case Role.VIEW: return <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded"><UserCheck size={10} /> View</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý người dùng</h2>
          <p className="text-slate-500">Cấp phát tài khoản và phân quyền cán bộ/cư dân</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-red-800 text-white px-5 py-3 rounded-xl hover:bg-red-900 transition-all shadow-lg font-bold text-sm active:scale-95"
        >
          <Plus size={18} />
          Thêm người dùng mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên, tài khoản, chức vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-800/20 outline-none text-sm font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Họ và tên / Chức vụ</th>
                <th className="px-6 py-4">Tài khoản (Username)</th>
                <th className="px-6 py-4">Quyền truy cập</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center font-bold uppercase">
                        {u.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{u.fullName} {u.id === currentUser.id && <span className="text-[10px] text-red-800 ml-1">(Tôi)</span>}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{u.position || 'Cư dân'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Key size={14} className="text-slate-300" />
                       <span className="font-mono font-bold text-slate-600">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(u.role)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(u)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Chỉnh sửa">
                        <Edit2 size={16} />
                      </button>
                      {u.id !== currentUser.id && (
                        <button 
                          onClick={() => setConfirmDeleteId(u.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Xóa tài khoản">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="p-6 border-b flex items-center justify-between bg-[#001F3F] text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserCog size={20} />
                {editingUser ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Họ và tên</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-800/20 outline-none font-semibold text-sm" placeholder="VD: Nguyễn Văn A..." />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Chức vụ / Vị trí</label>
                <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-800/20 outline-none font-semibold text-sm" placeholder="VD: Trưởng khu phố, Công an hẻm 25..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tên đăng nhập</label>
                  <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-800/20 outline-none font-bold font-mono text-sm" placeholder="username" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Mật khẩu</label>
                  <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-800/20 outline-none font-bold font-mono text-sm" placeholder="********" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Quyền hạn truy cập</label>
                <div className="grid grid-cols-3 gap-2">
                  {[Role.ADMIN, Role.EDITOR, Role.VIEW].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({...formData, role})}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${
                        formData.role === role 
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                 <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                 <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                   Cẩn trọng khi cấp quyền <strong>ADMIN</strong>. Tài khoản này có thể thay đổi cấu hình hệ thống và xóa dữ liệu vĩnh viễn.
                 </p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-2xl transition-colors">Hủy</button>
              <button type="submit" className="flex-1 py-3 bg-[#001F3F] text-white font-bold hover:opacity-90 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                <Check size={18} />
                {editingUser ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa tài khoản?</h3>
              <p className="text-slate-500 text-sm mb-8">Người dùng này sẽ không thể đăng nhập vào hệ thống sau khi bị xóa.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleDelete} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg">Xác nhận xóa vĩnh viễn</button>
                <button onClick={() => setConfirmDeleteId(null)} className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
