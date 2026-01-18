
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { Users, Home, ShieldAlert, CheckCircle2, UserCheck, TrendingUp } from 'lucide-react';
import { COLORS, HOUSEHOLD_STATUSES } from '../constants';
import { Resident, Household, Petition } from '../types';

interface DashboardProps {
  residents: Resident[];
  households: Household[];
  petitions: Petition[];
  neighborhoodName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ residents, households, petitions, neighborhoodName }) => {
  const stats = [
    { title: 'Tổng nhân khẩu', value: residents.length, icon: <Users className="text-blue-600" />, trend: 'Dữ liệu thời gian thực' },
    { title: 'Hộ gia đình', value: households.length, icon: <Home className="text-green-600" />, trend: 'Đã xác thực' },
    { title: 'Phản ánh mới', value: petitions.filter(p => p.status === 'Chờ xử lý').length, icon: <ShieldAlert className="text-amber-600" />, trend: 'Cần xử lý ngay' },
    { title: 'Đã hoàn thành', value: petitions.filter(p => p.status === 'Đã hoàn thành').length, icon: <CheckCircle2 className="text-emerald-600" />, trend: 'Hiệu quả xử lý' },
  ];

  const genderData = [
    { name: 'Nam', value: residents.filter(r => r.gender === 'Nam').length },
    { name: 'Nữ', value: residents.filter(r => r.gender === 'Nữ').length },
  ];

  const residenceTypeData = [
    { name: 'Thường trú', value: residents.filter(r => r.type === 'Thường trú').length },
    { name: 'Tạm trú', value: residents.filter(r => r.type === 'Tạm trú').length },
    { name: 'Tạm vắng', value: residents.filter(r => r.type === 'Tạm vắng').length },
  ];

  const statusData = HOUSEHOLD_STATUSES.map(status => ({
    name: status,
    value: households.filter(h => h.status === status).length
  }));

  const PIE_COLORS = [COLORS.primary, COLORS.secondary, '#1e40af', '#10b981', '#f59e0b', '#8b5cf6'];
  const GENDER_COLORS = ['#3b82f6', '#ec4899']; // Blue for Men, Pink for Women

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">{stat.icon}</div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.trend}</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Population Growth Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Biến động nhân khẩu - {neighborhoodName}</h3>
            <TrendingUp size={18} className="text-slate-400" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'T10', in: 5, out: 2 },
                { month: 'T11', in: 8, out: 4 },
                { month: 'T12', in: 12, out: 1 },
                { month: 'T1', in: 4, out: 3 },
                { month: 'T2', in: 6, out: 5 },
                { month: 'T3', in: 15, out: 2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="in" name="Nhập khẩu" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="out" name="Chuyển đi" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                <Legend iconType="circle" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Household Status Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Phân loại Hộ - {neighborhoodName}</h3>
            <Home size={18} className="text-slate-400" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={statusData} margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={120} 
                  style={{ fontSize: '11px', fontWeight: 600, fill: '#475569' }} 
                />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" name="Số hộ" radius={[0, 4, 4, 0]} barSize={20}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Residence Type Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Cơ cấu cư trú</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={residenceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {residenceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Cơ cấu giới tính</h3>
            <UserCheck size={18} className="text-slate-400" />
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Notifications / Tasks Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Ghi chú & Nhiệm vụ hôm nay tại {neighborhoodName}</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border-l-4 border-red-800">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-800">
              <ShieldAlert size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">Tuần tra đêm phối hợp Tổ dân phố</p>
              <p className="text-xs text-slate-500">22:00 - 00:00 • Phụ trách: Ban điều hành {neighborhoodName}</p>
            </div>
            <button className="text-[10px] font-bold uppercase text-red-800 bg-white px-3 py-1.5 rounded-lg border border-red-200 shadow-sm">Chi tiết</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
