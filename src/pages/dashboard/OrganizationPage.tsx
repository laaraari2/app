import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useI18n } from '../../context/I18nContext';
import {
  Building2,
  MapPin,
  School,
  Layers,
  DoorOpen,
  Plus,
  CheckCircle2,
  Search,
  Filter,
  Users,
} from 'lucide-react';

interface CampusItem {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  isMain: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
  buildingsCount: number;
  roomsCount: number;
}

interface RoomItem {
  id: string;
  code: string;
  name: string;
  campusName: string;
  buildingName: string;
  type: 'CLASSROOM' | 'LABORATORY' | 'COMPUTER_LAB' | 'LIBRARY' | 'SPORTS' | 'AUDITORIUM';
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

const INITIAL_CAMPUSES: CampusItem[] = [
  { id: 'camp-1', name: 'Campus Principal - Marrakech Guéliz', code: 'CP-MAR', city: 'Marrakech', address: 'Avenue Mohammed VI, Guéliz', phone: '0524445566', isMain: true, status: 'ACTIVE', buildingsCount: 4, roomsCount: 38 },
  { id: 'camp-2', name: 'Campus Casablanca - Casa Anfa CFC', code: 'CP-CFC', city: 'Casablanca', address: 'Casablanca Finance City, Tour Horizon', phone: '0522889900', isMain: false, status: 'ACTIVE', buildingsCount: 2, roomsCount: 24 },
  { id: 'camp-3', name: 'Campus Rabat - Agdal Excellence', code: 'CP-RAB', city: 'Rabat', address: 'Avenue Fal Ould Oumeir, Agdal', phone: '0537778899', isMain: false, status: 'ACTIVE', buildingsCount: 2, roomsCount: 18 },
];

const INITIAL_ROOMS: RoomItem[] = [
  { id: 'rm-1', code: 'S-101', name: 'قاعة ابن رشد - Cours Général', campusName: 'Campus Marrakech Guéliz', buildingName: 'Bâtiment A (Lycée)', type: 'CLASSROOM', capacity: 32, status: 'OCCUPIED' },
  { id: 'rm-2', code: 'LAB-PHYS-2', name: 'مختبر الفيزياء والكيمياء المتقدم', campusName: 'Campus Marrakech Guéliz', buildingName: 'Bâtiment B (Sciences)', type: 'LABORATORY', capacity: 26, status: 'AVAILABLE' },
  { id: 'rm-3', code: 'INFO-1', name: 'مختبر الإعلاميات والذكاء الاصطناعي', campusName: 'Campus Marrakech Guéliz', buildingName: 'Bâtiment B (Sciences)', type: 'COMPUTER_LAB', capacity: 30, status: 'AVAILABLE' },
  { id: 'rm-4', code: 'BIB-CENT', name: 'المكتبة والمركز البيداغوجي (CDI)', campusName: 'Campus Marrakech Guéliz', buildingName: 'Bâtiment C (Administration)', type: 'LIBRARY', capacity: 60, status: 'AVAILABLE' },
  { id: 'rm-5', code: 'S-202', name: 'قاعة الخوارزمي - Mathématiques', campusName: 'Campus Casablanca - CFC', buildingName: 'Bâtiment 1', type: 'CLASSROOM', capacity: 28, status: 'OCCUPIED' },
  { id: 'rm-6', code: 'AMPHI-A', name: 'المدرج الكبير للمؤتمرات والندوات', campusName: 'Campus Casablanca - CFC', buildingName: 'Bâtiment 1', type: 'AUDITORIUM', capacity: 150, status: 'AVAILABLE' },
];

export const OrganizationPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'CAMPUSES' | 'ROOMS'>('CAMPUSES');
  const [campuses, setCampuses] = useState<CampusItem[]>(INITIAL_CAMPUSES);
  const [rooms, setRooms] = useState<RoomItem[]>(INITIAL_ROOMS);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span>{isAr ? 'البنية التحتية والمقرات والقاعات' : 'Infrastructures, Campus & Salles'}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {isAr
              ? `إدارة المقرات، الأجنحة، والمختبرات والقاعات لمؤسسة ${currentTenant?.nameAr}`
              : `Gestion du patrimoine immobilier et répartition des salles pour ${currentTenant?.nameFr}`}
          </p>
        </div>

        <div className="flex border-b-0 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('CAMPUSES')}
            className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'CAMPUSES'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {isAr ? 'المقرات والمركبات' : 'Campus Scolaires'}
          </button>
          <button
            onClick={() => setActiveTab('ROOMS')}
            className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'ROOMS'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {isAr ? 'دليل القاعات والمختبرات' : 'Salles & Laboratoires'}
          </button>
        </div>
      </div>

      {/* TAB 1: CAMPUSES */}
      {activeTab === 'CAMPUSES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campuses.map((camp) => (
            <div
              key={camp.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                  {camp.code}
                </span>
                {camp.isMain && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {isAr ? 'المقر الرئيسي' : 'Siège Principal'}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{camp.name}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{camp.city} • {camp.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'الأجنحة والعمارات:' : 'Bâtiments:'}</span>
                  <span className="font-black text-sm text-slate-900 dark:text-white">{camp.buildingsCount}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'القاعات والمختبرات:' : 'Salles de cours:'}</span>
                  <span className="font-black text-sm text-amber-600">{camp.roomsCount}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="font-mono text-slate-500">{camp.phone}</span>
                <button className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer">
                  {isAr ? 'معاينة المخطط' : 'Plan des Locaux'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ROOMS */}
      {activeTab === 'ROOMS' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="p-3 text-start">{isAr ? 'رقم القاعة' : 'Code Salle'}</th>
                  <th className="p-3 text-start">{isAr ? 'اسم القاعة والمرفق' : 'Désignation'}</th>
                  <th className="p-3 text-start">{isAr ? 'المقر والجناح' : 'Campus & Bâtiment'}</th>
                  <th className="p-3 text-start">{isAr ? 'النوع' : 'Type'}</th>
                  <th className="p-3 text-start">{isAr ? 'الطاقة الاستيعابية' : 'Capacité'}</th>
                  <th className="p-3 text-end">{isAr ? 'الحالة الحالية' : 'Disponibilité'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {rooms.map((rm) => (
                  <tr key={rm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">{rm.code}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{rm.name}</td>
                    <td className="p-3 text-slate-500">
                      <div>{rm.campusName}</div>
                      <div className="text-[10px] text-slate-400">{rm.buildingName}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                        {rm.type}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{rm.capacity} {isAr ? 'مقعد' : 'places'}</td>
                    <td className="p-3 text-end">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rm.status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {rm.status === 'AVAILABLE'
                          ? isAr ? 'شاغرة ومتاحة' : 'Disponible'
                          : isAr ? 'قيد الدرس حالياً' : 'Occupée'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
