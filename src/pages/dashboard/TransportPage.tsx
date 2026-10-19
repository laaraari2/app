import React from 'react';
import { useTenant } from '../../context/TenantContext';
import { useI18n } from '../../context/I18nContext';
import { Bus, MapPin, Navigation, ShieldCheck, PhoneCall, AlertCircle } from 'lucide-react';

interface BusFleetItem {
  id: string;
  busNumber: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  route: string;
  studentsCount: number;
  status: 'IN_TRANSIT' | 'ARRIVED' | 'MAINTENANCE';
  currentLocation: string;
}

const MOCK_FLEET: BusFleetItem[] = [
  { id: 'b1', busNumber: 'حافلة رقم 01', plateNumber: '78910-أ-6', driverName: 'محمد البقالي (M. Baqali)', driverPhone: '0661998877', route: 'حي المعاريف ↔ CFC ↔ عين دياب', studentsCount: 28, status: 'IN_TRANSIT', currentLocation: 'شارع غاندي - Casablanca (تتبع حي)' },
  { id: 'b2', busNumber: 'حافلة رقم 02', plateNumber: '45612-ب-6', driverName: 'الحسن العمراني (H. Amrani)', driverPhone: '0662334455', route: 'بوسكورة ↔ كاليفورنيا ↔ CFC', studentsCount: 32, status: 'ARRIVED', currentLocation: 'المؤسسة - موقف الحافلات الرئيسية' },
  { id: 'b3', busNumber: 'حافلة رقم 03', plateNumber: '12399-ج-6', driverName: 'ياسين المودن (Y. El Moudene)', driverPhone: '0663778899', route: 'الحي الحسني ↔ الألفة ↔ CFC', studentsCount: 24, status: 'IN_TRANSIT', currentLocation: 'شارع ابن تاشفين (سرعة 35 km/h)' },
];

export const TransportPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bus className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span>{isAr ? 'نظام تتبع النقل المدرسي GPS وإدار المسارات' : 'Suivi GPS Flotte Transport Scolaire'}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {isAr
              ? `الأسطول المعتمد لمؤسسة: ${currentTenant?.nameAr}`
              : `Flotte sous contrôle pour ${currentTenant?.nameFr}`}
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-300 dark:border-amber-800">
          <Navigation className="w-4 h-4 animate-pulse text-amber-600" />
          <span>{isAr ? 'تتبع الأقمار الاصطناعية نشط' : 'Télématique GPS Active'}</span>
        </span>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_FLEET.map((bus) => (
          <div key={bus.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Bus className="w-5 h-5 text-amber-500" />
                <span>{bus.busNumber}</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  bus.status === 'IN_TRANSIT'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {bus.status === 'IN_TRANSIT'
                  ? isAr ? 'في الطريق (مباشر)' : 'En Route (Live)'
                  : isAr ? 'وصلت للمؤسسة' : 'Arrivé'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>{isAr ? 'الترقيم الرسمي:' : 'Matricule:'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{bus.plateNumber}</span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>{isAr ? 'السائق المسؤول:' : 'Chauffeur:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{bus.driverName}</span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>{isAr ? 'عدد التلاميذ:' : 'Élèves à bord:'}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{bus.studentsCount} élèves</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'الموقع الحالي GPS:' : 'Localisation GPS:'}</div>
                <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{bus.currentLocation}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <a
                href={`tel:${bus.driverPhone}`}
                className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 hover:underline"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{bus.driverPhone}</span>
              </a>
              <span className="text-[10px] text-slate-400">{isAr ? 'إشعار الآباء عبر الواتساب' : 'SMS Parents Auto'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
