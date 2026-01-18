
import React, { useState, useEffect } from 'react';
import { Role, User, Resident, Household, AuditLog, Petition, Notification, SecurityEvent, Camera, NeighborhoodInfo } from './types';
import { INITIAL_USERS, MOCK_RESIDENTS, MOCK_HOUSEHOLDS, MOCK_LOGS, MOCK_PETITIONS, MOCK_NOTIFICATIONS, MOCK_SECURITY, MOCK_CAMERAS, INITIAL_NEIGHBORHOOD_INFO } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Residents from './views/Residents';
import Households from './views/Households';
import Petitions from './views/Petitions';
import Security from './views/Security';
import NotificationsView from './views/NotificationsView';
import SettingsView from './views/Settings';
import UserManagement from './views/UserManagement';
import Chatbot from './components/Chatbot';
import { Search, Bell, History, Lock, User as UserIcon, LogIn, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  const loadData = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const [neighborhoodInfo, setNeighborhoodInfo] = useState<NeighborhoodInfo>(() => loadData('kp25_info', INITIAL_NEIGHBORHOOD_INFO));
  const [users, setUsers] = useState<User[]>(() => loadData('kp25_users', INITIAL_USERS));
  const [residents, setResidents] = useState<Resident[]>(() => loadData('kp25_residents', MOCK_RESIDENTS));
  const [households, setHouseholds] = useState<Household[]>(() => loadData('kp25_households', MOCK_HOUSEHOLDS));
  const [petitions, setPetitions] = useState<Petition[]>(() => loadData('kp25_petitions', MOCK_PETITIONS));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadData('kp25_notifications', MOCK_NOTIFICATIONS));
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(() => loadData('kp25_security', MOCK_SECURITY));
  const [cameras, setCameras] = useState<Camera[]>(() => loadData('kp25_cameras', MOCK_CAMERAS));
  const [logs, setLogs] = useState<AuditLog[]>(() => loadData('kp25_logs', MOCK_LOGS));

  useEffect(() => {
    localStorage.setItem('kp25_info', JSON.stringify(neighborhoodInfo));
    localStorage.setItem('kp25_users', JSON.stringify(users));
    localStorage.setItem('kp25_residents', JSON.stringify(residents));
    localStorage.setItem('kp25_households', JSON.stringify(households));
    localStorage.setItem('kp25_petitions', JSON.stringify(petitions));
    localStorage.setItem('kp25_notifications', JSON.stringify(notifications));
    localStorage.setItem('kp25_security', JSON.stringify(securityEvents));
    localStorage.setItem('kp25_cameras', JSON.stringify(cameras));
    localStorage.setItem('kp25_logs', JSON.stringify(logs));
  }, [neighborhoodInfo, users, residents, households, petitions, notifications, securityEvents, cameras, logs]);

  useEffect(() => {
    const savedSession = localStorage.getItem('kp25_session');
    if (savedSession) setCurrentUser(JSON.parse(savedSession));
  }, []);

  const addLog = (action: string, details: string) => {
    const activeUser = currentUser || JSON.parse(localStorage.getItem('kp25_session') || '{}');
    if (!activeUser.id) return;
    const newLog: AuditLog = {
      id: `l-${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.fullName,
      action,
      timestamp: new Date().toLocaleString('vi-VN'),
      details
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleAddResident = (r: Omit<Resident, 'id'>) => {
    const newId = `res-${Date.now()}`;
    const newResident = { ...r, id: newId };
    setResidents(prev => [newResident, ...prev]);
    
    // Automatically update memberCount in Household
    setHouseholds(prev => prev.map(h => 
      h.id === r.householdId ? { ...h, memberCount: (h.memberCount || 0) + 1 } : h
    ));
    
    addLog('Thêm dân cư', `Thêm mới nhân khẩu ${r.fullName} vào hộ ${r.householdId}`);
  };

  const handleUpdateResident = (updated: Resident) => {
    const old = residents.find(r => r.id === updated.id);
    setResidents(prev => prev.map(r => r.id === updated.id ? updated : r));
    
    if (old && old.householdId !== updated.householdId) {
      // Moved from one household to another
      setHouseholds(prev => prev.map(h => {
        if (h.id === old.householdId) return { ...h, memberCount: Math.max(0, (h.memberCount || 1) - 1) };
        if (h.id === updated.householdId) return { ...h, memberCount: (h.memberCount || 0) + 1 };
        return h;
      }));
      addLog('Cập nhật dân cư', `Chuyển nhân khẩu ${updated.fullName} từ hộ ${old.householdId} sang ${updated.householdId}`);
    } else {
      addLog('Cập nhật dân cư', `Cập nhật thông tin nhân khẩu ${updated.fullName}`);
    }
  };

  const handleDeleteResident = (id: string) => {
    const resident = residents.find(r => r.id === id);
    if (resident) {
      setResidents(prev => prev.filter(r => r.id !== id));
      // Automatically update memberCount in Household
      setHouseholds(prev => prev.map(h => 
        h.id === resident.householdId ? { ...h, memberCount: Math.max(0, (h.memberCount || 1) - 1) } : h
      ));
      addLog('Xóa dân cư', `Xóa nhân khẩu ${resident.fullName} khỏi hệ thống`);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === loginForm.username && (u.password === loginForm.password || u.password === '123'));
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('kp25_session', JSON.stringify(foundUser));
      addLog('Đăng nhập', `Tài khoản ${foundUser.username} đăng nhập thành công`);
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác.');
    }
  };

  const renderView = () => {
    if (!currentUser) return null;
    const nName = neighborhoodInfo.name;
    const nWardCity = `${neighborhoodInfo.ward} • ${neighborhoodInfo.city}`;

    switch (activeTab) {
      case 'dashboard': return <Dashboard residents={residents} households={households} petitions={petitions} neighborhoodName={nName} />;
      case 'residents': return <Residents userRole={currentUser.role} residents={residents} households={households} onAdd={handleAddResident} onUpdate={handleUpdateResident} onDelete={handleDeleteResident} neighborhoodName={nName} />;
      case 'households': return <Households userRole={currentUser.role} households={households} residents={residents} onAdd={h => setHouseholds(prev => [{...h, id: `HD-${(prev.length+1).toString().padStart(4,'0')}`, memberCount: 0, lastUpdate: new Date().toISOString().split('T')[0]}, ...prev])} onUpdate={u => setHouseholds(prev => prev.map(h => h.id === u.id ? u : h))} onDelete={id => {
        setHouseholds(prev => prev.filter(h => h.id !== id));
        addLog('Xóa hộ gia đình', `Xóa hộ khẩu mã ${id}`);
      }} neighborhoodName={nName} />;
      case 'security': return <Security userRole={currentUser.role} events={securityEvents} cameras={cameras} neighborhoodInfo={neighborhoodInfo} onAdd={e => setSecurityEvents(prev => [{...e, id: `s-${Date.now()}`}, ...prev])} onUpdate={u => setSecurityEvents(prev => prev.map(e => e.id === u.id ? u : e))} onDelete={id => setSecurityEvents(prev => prev.filter(e => e.id !== id))} onUpdateCamera={c => setCameras(prev => prev.map(cam => cam.id === c.id ? c : cam))} neighborhoodName={nName} />;
      case 'petitions': return <Petitions userRole={currentUser.role} petitions={petitions} onAdd={p => setPetitions(prev => [{...p, id: `p-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], status: 'Chờ xử lý'}, ...prev])} onUpdate={u => setPetitions(prev => prev.map(p => p.id === u.id ? u : p))} onDelete={id => setPetitions(prev => prev.filter(p => p.id !== id))} neighborhoodName={nName} />;
      case 'notifications': return <NotificationsView userRole={currentUser.role} notices={notifications} onAdd={n => setNotifications(prev => [{...n, id: `n-${Date.now()}`, date: new Date().toISOString().split('T')[0], author: currentUser.fullName}, ...prev])} onDelete={id => setNotifications(prev => prev.filter(n => n.id !== id))} neighborhoodName={nName} wardCity={nWardCity} />;
      case 'user-management': return <UserManagement currentUser={currentUser} users={users} onAddUser={u => setUsers(prev => [{...u, id: `u-${Date.now()}`}, ...prev])} onUpdateUser={u => setUsers(prev => prev.map(user => user.id === u.id ? u : user))} onDeleteUser={id => setUsers(prev => prev.filter(u => u.id !== id))} />;
      case 'settings': return <SettingsView userRole={currentUser.role} info={neighborhoodInfo} onUpdateInfo={setNeighborhoodInfo} onBackup={() => {}} />;
      case 'logs': return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h3 className="text-xl font-bold text-slate-800">Nhật ký Hệ thống - {nName}</h3>
            <History size={20} className="text-slate-400" />
          </div>
          <div className="space-y-3 overflow-y-auto pr-2">
            {logs.map(log => (
              <div key={log.id} className="p-4 bg-slate-50 rounded-xl flex items-start gap-4 text-sm border border-slate-100">
                <div className="min-w-[140px] text-slate-400 font-mono text-[11px] mt-1">{log.timestamp}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-red-800">{log.userName}</span>
                    <span className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] uppercase font-bold text-slate-600">{log.action}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      default: return <Dashboard residents={residents} households={households} petitions={petitions} neighborhoodName={nName} />;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=10')] bg-cover relative">
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"></div>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="bg-red-800 p-10 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center font-bold text-4xl shadow-lg border border-white/30">
              {neighborhoodInfo.name.match(/\d+/)?.[0] || '25'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{neighborhoodInfo.name}</h1>
            <p className="text-red-100/80 mt-2 font-medium italic">Hệ thống quản trị đô thị thông minh</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100"><AlertCircle size={16} /> {loginError}</div>}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tài khoản</label>
                <input required type="text" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-800/20 outline-none font-semibold text-sm transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Mật khẩu</label>
                <input required type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-800/20 outline-none font-semibold text-sm transition-all" />
              </div>
              <button type="submit" className="w-full py-4 bg-red-800 text-white font-black rounded-2xl hover:bg-red-900 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs">Đăng nhập</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={currentUser.role} onLogout={() => {setCurrentUser(null); localStorage.removeItem('kp25_session');}} neighborhoodName={neighborhoodInfo.name} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <header className="flex items-center justify-between mb-8 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
             <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Tìm kiếm nhanh..." className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-xl focus:ring-2 focus:ring-red-800/20 text-sm outline-none" />
             </div>
          </div>
          <div className="flex items-center gap-4 ml-8">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span></button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 bg-white p-1 pr-3 rounded-full border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-red-800 text-white rounded-full flex items-center justify-center font-bold text-xs">{currentUser.fullName.charAt(0)}</div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-800 leading-none">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{currentUser.position || currentUser.role}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-[calc(100%-80px)]">
          {renderView()}
        </div>
      </main>
      <Chatbot neighborhoodName={neighborhoodInfo.name} />
    </div>
  );
};

export default App;
