import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Role } from '../types';
import { LogOut, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  userRole: Role;
  onLogout: () => void;
  neighborhoodName: string;
  // Thêm props mới để điều khiển menu trên mobile
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, onLogout, neighborhoodName, isOpen, onClose }) => {
  return (
    <>
      {/* 1. Lớp phủ đen (Overlay) - Chỉ hiện trên Mobile khi menu mở */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] md:hidden"
          onClick={onClose}
        />
      )}

      {/* 2. Sidebar chính */}
      <aside className={`
        w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-[50]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center font-bold text-xl shrink-0">
              {neighborhoodName.match(/\d+/)?.[0] || 'KP'}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight truncate max-w-[140px]">{neighborhoodName}</h1>
              <p className="text-xs text-slate-400">Quản lý số</p>
            </div>
          </div>
          {/* Nút đóng menu chỉ hiện trên mobile */}
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            if (!item.roles.includes(userRole)) return null;
            
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose(); // Đóng menu sau khi chọn trên mobile
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-red-800 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;