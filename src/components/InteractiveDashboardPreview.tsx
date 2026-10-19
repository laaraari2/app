import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  CheckCircle2,
  RefreshCw,
  Bell,
  TrendingUp,
  CreditCard,
  Building2,
  Send,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const InteractiveDashboardPreview: React.FC = () => {
  const { locale, dir, openDemoModal } = useI18n();
  const [activeTab, setActiveTab] = useState<'overview' | 'massar' | 'whatsapp' | 'finance'>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [sentAlert, setSentAlert] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Campus Maarif');

  const handleSyncMassar = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
    }, 1200);
  };

  const handleSendAlert = () => {
    setSentAlert(true);
    setTimeout(() => {
      setSentAlert(false);
    }, 3000);
  };

  const isAr = locale === 'ar';

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 dark:border-slate-700 glow-primary">
      {/* Top OS Window Header */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-slate-400 ms-3 hidden sm:inline">
            app.eduvora.ma/dashboard/{selectedBranch.toLowerCase().replace(' ', '-')}
          </span>
        </div>

        {/* Branch Selector */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-xs text-slate-400 hidden md:inline">
            {isAr ? 'المؤسسة:' : 'Établissement:'}
          </span>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Campus Maarif">
              {isAr ? 'فرع المعاريف (الدار البيضاء)' : 'Campus Maarif (Casablanca)'}
            </option>
            <option value="Campus Souissi">
              {isAr ? 'فرع السويسي (الرباط)' : 'Campus Souissi (Rabat)'}
            </option>
            <option value="Campus Gueliz">
              {isAr ? 'فرع جليز (مراكش)' : 'Campus Guéliz (Marrakech)'}
            </option>
          </select>
          <div className="flex items-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse me-1.5" />
            MASSAR Live
          </div>
        </div>
      </div>

      {/* Dashboard Nav Tabs */}
      <div className="bg-slate-900/90 px-4 pt-3 border-b border-slate-800 flex flex-wrap gap-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {isAr ? 'لوحة المراقبة العامة' : 'Aperçu Général'}
        </button>

        <button
          onClick={() => setActiveTab('massar')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-all ${
            activeTab === 'massar'
              ? 'bg-blue-600 text-white font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {isAr ? 'مزامنة مسار (MASSAR)' : 'Synchronisation MASSAR'}
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-blue-600 text-white font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          {isAr ? 'إشعارات الأولياء (WhatsApp/SMS)' : 'Alertes Parents'}
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-all ${
            activeTab === 'finance'
              ? 'bg-blue-600 text-white font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          {isAr ? 'المستحقات والأداء الإلكتروني' : 'Recouvrement CMI'}
        </button>
      </div>

      {/* Main Interactive Tab Content */}
      <div className="p-4 sm:p-6 bg-slate-900/60 min-h-[340px]">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>{isAr ? 'إجمالي التلاميذ' : 'Effectif Élèves'}</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">1,248</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                  <span>↑ 12%</span>
                  <span>{isAr ? 'مقارنة بالدورة الماضية' : 'vs trimestre dernier'}</span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>{isAr ? 'نسبة الحضور اليوم' : 'Taux Présence'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-white">98.2%</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {isAr ? '12 غياب مسجل فقط' : '12 absences enregistrées'}
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>{isAr ? 'تحصيل الواجبات' : 'Frais Recouvrés'}</span>
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-xl font-bold text-emerald-400">94.8%</div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  {isAr ? '+320K درهم عبر CMI' : '+320K DH en ligne'}
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>{isAr ? 'مزامنة مسار' : 'Sync MASSAR'}</span>
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">100%</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {isAr ? 'آخر تحديث: منذ 5 دقائق' : 'Màj: il y a 5 min'}
                </div>
              </div>
            </div>

            {/* Quick Live Feed */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {isAr ? 'نشاط المؤسسة في الوقت الفعلي' : 'Flux d’activité en temps réel'}
                </h4>
                <span className="text-[11px] text-blue-400 cursor-pointer hover:underline" onClick={() => openDemoModal('Aperçu général du tableau de bord')}>
                  {isAr ? 'عرض اللوحة الكاملة ←' : 'Voir tout le tableau ←'}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-slate-200">
                      {isAr
                        ? 'تم إدخال 34 نقطة فرض الفيزياء (الثانية باكالوريا)'
                        : 'Saisie de 34 notes de Physique (2ème Bac)'}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">09:42</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-slate-200">
                      {isAr
                        ? 'أداء واجبي تمدرس (3,200 درهم) عبر بطاقة بنكية'
                        : 'Paiement en ligne de 2 écolages (3 200 DH)'}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">09:35</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-slate-200">
                      {isAr
                        ? 'إرسال 14 إشعار غياب تلقائي عبر واتساب للآباء'
                        : 'Envoi de 14 avis d’absence WhatsApp aux parents'}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">09:10</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'massar' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {isAr ? 'وحدة مزامنة مسار الرسمية' : 'Module Officiel de Sync MASSAR'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">
                  {isAr
                    ? 'تتيح هذه الوحدة ربط بيانات الحضور، النقط، ولوائح التلاميذ بين إديوفورا ومنظومة مسار التابعة لوزارة التربية الوطنية بنقرة واحدة.'
                    : 'Transférez automatiquement les notes, absences et données d’élèves avec le portail officiel MASSAR du Ministère de l’Éducation.'}
                </p>
              </div>

              <button
                onClick={handleSyncMassar}
                disabled={isSyncing}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing
                  ? isAr
                    ? 'جاري الربط مع مسار...'
                    : 'Mise à jour MASSAR...'
                  : isAr
                  ? 'مزامنة 1,248 تلميذ الآن'
                  : 'Lancer la Sync MASSAR'}
              </button>
            </div>

            {syncSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isAr
                      ? 'تمت المزامنة بنجاح! تم نقل 1,248 ملف تلميذ و 3,450 نقطة لمسار دون أي خطأ.'
                      : 'Sync réussie ! 1 248 dossiers élèves et 3 450 notes synchronisés avec MASSAR.'}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">0.8 sec</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">{isAr ? 'الغيابات والـتأخرات' : 'Absences & Retards'}</span>
                <span className="font-bold text-white text-sm">{isAr ? 'محدثة تلقائياً' : 'Mise à jour auto'}</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">{isAr ? 'نقط المراقبة المستمرة' : 'Notes Contrôle Continu'}</span>
                <span className="font-bold text-emerald-400 text-sm">{isAr ? 'جاهزة للنقل' : 'Prêt à l’import'}</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">{isAr ? 'بيانات التسجيل وإعادة التسجيل' : 'Données Inscriptions'}</span>
                <span className="font-bold text-blue-400 text-sm">{isAr ? 'مطابقة 100%' : 'Conforme 100%'}</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'whatsapp' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  {isAr ? 'مرسل إشعارات الواتساب للآباء' : 'Envoi d’Alertes WhatsApp aux Parents'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">
                  {isAr
                    ? 'إرسال تنبيهات الحضور والغياب، وصل الأداء، واستعمالات الزمن مباشرة لرقم الواتساب الخاص بولي الأمر.'
                    : 'Envoyez immédiatement les avis d’absence, reçus de paiement et avis de réunion aux parents via WhatsApp.'}
                </p>
              </div>

              <button
                onClick={handleSendAlert}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20"
              >
                <Send className="w-4 h-4" />
                {isAr ? 'تجربة إرسال رسالة توضيحية' : 'Tester un envoi d’alerte'}
              </button>
            </div>

            {sentAlert && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-xs text-blue-300 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>
                  {isAr
                    ? 'تم إرسال الرسالة النموذجية بنجاح إلى ولي الأمر عبر WhatsApp API!'
                    : 'Message WhatsApp envoyé avec succès au parent via l’API Eduvora !'}
                </span>
              </motion.div>
            )}

            {/* Simulated WhatsApp Bubble */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2 max-w-md mx-auto sm:mx-0">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-semibold text-emerald-400">Eduvora Parent Bot 🟢</span>
                <span>WhatsApp Business</span>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-lg text-slate-200">
                <p className="font-medium text-white mb-1">
                  {isAr ? 'السيد/السيدة العلمي المحترم(ة)،' : 'M./Mme El Alami,'}
                </p>
                <p>
                  {isAr
                    ? 'نحيطكم علماً بأن ابنكم (أمين العلمي - المستوى 2 إعدادي) سجل تأخراً لمدة 15 دقيقة في حصة الرياضيات لهذا اليوم 09:15.'
                    : 'Nous vous informons que votre enfant (Amine El Alami - 2ème AC) a enregistré un retard de 15 min en cours de Mathématiques ce jour à 09h15.'}
                </p>
                <p className="text-[10px] text-emerald-400 mt-2 font-mono">
                  {isAr ? 'مرفق رابط الاطلاع على التقرير بالكامل 🔗' : 'Lien du rapport complet 🔗'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'finance' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  {isAr ? 'الأداء الإلكتروني بواسطة البطاقات البنكية (CMI)' : 'Paiement en ligne sécurisé (CMI Maroc)'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">
                  {isAr
                    ? 'ربط مباشر مع جميع الأبناك المغربية مع توليد وصل إبراء رقمي فوري يرسل لولي الأمر عبر البريد الإلكتروني والواتساب.'
                    : 'Intégration directe avec les banques marocaines (CMI) et émission automatique de reçus de scolarité numérotés.'}
                </p>
              </div>

              <button
                onClick={() => openDemoModal('Démonstration du module CMI et Finance')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-900/20"
              >
                {isAr ? 'طلب تجربة الوحدة المالية' : 'Démo du Module Finance'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">{isAr ? 'الواصلات المصدرة هذا الشهر' : 'Reçus émis ce mois'}</span>
                  <span className="text-base font-bold text-white">842 {isAr ? 'وصل' : 'reçus'}</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 font-medium px-2 py-1 rounded text-[11px]">
                  100% {isAr ? 'مطبوقة' : 'Conforme'}
                </span>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">{isAr ? 'نسبة الأداء الإلكتروني' : 'Taux paiement en ligne'}</span>
                  <span className="text-base font-bold text-emerald-400">76.4%</span>
                </div>
                <span className="text-slate-500 text-[11px] font-mono">CMI / Carte marocaine</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Footer Bar */}
      <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isAr ? 'خوادم سحابية آمنة في المغرب (CNDP Compliant)' : 'Cloud Sécurisé Maroc (Conforme CNDP)'}
          </span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-white" onClick={() => openDemoModal()}>
          <span>{isAr ? 'تجربة المنصة الكاملة' : 'Essayer la démo complète'}</span>
          {dir === 'rtl' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
      </div>
    </div>
  );
};
