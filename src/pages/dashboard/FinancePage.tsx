import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { useNotification } from '../../context/NotificationContext';
import { useI18n } from '../../context/I18nContext';
import { CreditCard, CheckCircle, Receipt, DollarSign, Download, ExternalLink, Printer } from 'lucide-react';

interface PaymentInvoice {
  id: string;
  receiptNo: string;
  studentName: string;
  month: string;
  amountMAD: number;
  paymentMethod: 'CMI_CARD' | 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';
  status: 'PAID' | 'PENDING';
  date: string;
}

const INITIAL_INVOICES: PaymentInvoice[] = [
  { id: 'inv_101', receiptNo: 'REC-2026-0089', studentName: 'مريم بنجلون (Maryam Benjelloun)', month: 'يناير / Janvier 2026', amountMAD: 3200, paymentMethod: 'CMI_CARD', status: 'PAID', date: '2026-01-05' },
  { id: 'inv_102', receiptNo: 'REC-2026-0090', studentName: 'أمين الفاسي (Amine El Fassi)', month: 'يناير / Janvier 2026', amountMAD: 3500, paymentMethod: 'CMI_CARD', status: 'PAID', date: '2026-01-08' },
  { id: 'inv_103', receiptNo: 'REC-2026-0091', studentName: 'ياسمين العلمي (Yasmine Lalami)', month: 'يناير / Janvier 2026', amountMAD: 2800, paymentMethod: 'CHEQUE', status: 'PENDING', date: '2026-01-10' },
  { id: 'inv_104', receiptNo: 'REC-2026-0092', studentName: 'سعد التازي (Saad Tazi)', month: 'يناير / Janvier 2026', amountMAD: 2400, paymentMethod: 'CASH', status: 'PAID', date: '2026-01-12' },
];

export const FinancePage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { logActivity } = useAuth();
  const { addNotification } = useNotification();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [invoices, setInvoices] = useState<PaymentInvoice[]>(INITIAL_INVOICES);
  const [showCmiGateway, setShowCmiGateway] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('مريم بنجلون');
  const [amountInput, setAmountInput] = useState('3200');

  const handleSimulateCmiPayment = () => {
    const newReceiptNo = `REC-2026-00${Math.floor(100 + Math.random() * 900)}`;
    const newInv: PaymentInvoice = {
      id: `inv_${Date.now()}`,
      receiptNo: newReceiptNo,
      studentName: selectedStudent,
      month: 'فبراير / Février 2026',
      amountMAD: Number(amountInput),
      paymentMethod: 'CMI_CARD',
      status: 'PAID',
      date: new Date().toISOString().slice(0, 10),
    };

    setInvoices([newInv, ...invoices]);
    setShowCmiGateway(false);

    logActivity('CMI_PAYMENT_SUCCESS', 'FINANCE', `Paiement en ligne CMI réussi: ${newReceiptNo} (${amountInput} MAD)`);
    addNotification(
      'FINANCE',
      'تم استلام الدفع الإلكتروني عبر CMI',
      'Paiement CMI Confirmé',
      `تم استلام مبلغ ${amountInput} درهم وإنسخ وصل الدفع ${newReceiptNo}.`,
      `Paiement de ${amountInput} DH reçu avec succès.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Title & CMI Gateway Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? 'إدارة الواجبات والربط المالي CMI' : 'Gestion Financière & Gateway CMI'}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {isAr
              ? `معرف التاجر CMI للمؤسسة: ${currentTenant?.cmiMerchantId || 'CMI-MAROC-889900'}`
              : `Identifiant Marchand CMI : ${currentTenant?.cmiMerchantId || 'CMI-MAROC-889900'}`}
          </p>
        </div>

        <button
          onClick={() => setShowCmiGateway(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
        >
          <CreditCard className="w-4 h-4" />
          <span>{isAr ? 'تجربة أداء CMI المغربي المباشر' : 'Tester le Paiement CMI En Ligne'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-500">{isAr ? 'مجموع المداخيل الشهرية' : 'Recettes Mensuelles Total'}</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">11,900 MAD</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">85% عبر بوابة CMI الرقمية</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-500">{isAr ? 'إيصالات الدفع المسلمة' : 'Reçus Générés'}</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">248 Reçus</div>
          <div className="text-[10px] text-slate-400">{isAr ? 'موقعة رقمياً ومحمية' : 'Inviolables & Horodatés'}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-500">{isAr ? 'البطاقات البنكية المقبولة' : 'Cartes Bancaires Acceptées'}</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">Visa, MasterCard, CMI</div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">{isAr ? 'معتمدة من البنوك المغربية' : 'Certifié par le CMI Maroc'}</div>
        </div>
      </div>

      {/* Invoices & Receipts Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? 'سجل السندات وإيصالات الأداء' : 'Historique des Reçus de Paiement'}</span>
          </h3>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isAr ? 'طباعة القائمة' : 'Imprimer'}</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase">
              <tr>
                <th className="p-3 text-start">{isAr ? 'رقم الوصل' : 'N° Reçu'}</th>
                <th className="p-3 text-start">{isAr ? 'التلميذ' : 'Élève'}</th>
                <th className="p-3 text-start">{isAr ? 'الشهر المستحق' : 'Période'}</th>
                <th className="p-3 text-start">{isAr ? 'المبلغ (درهم)' : 'Montant'}</th>
                <th className="p-3 text-start">{isAr ? 'وسيلة الأداء' : 'Mode Paiement'}</th>
                <th className="p-3 text-start">{isAr ? 'الحالة' : 'Statut'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{inv.receiptNo}</td>
                  <td className="p-3 text-slate-900 dark:text-white">{inv.studentName}</td>
                  <td className="p-3 text-slate-500">{inv.month}</td>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{inv.amountMAD} MAD</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
                      {inv.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {inv.status === 'PAID' ? (isAr ? 'مؤدى بالكامل' : 'Payé') : isAr ? 'معلق' : 'En attente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CMI Payment Modal Simulation */}
      {showCmiGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {isAr ? 'بوابة الأداء CMI - Centre Monétique Interbancaire' : 'Portail CMI Maroc'}
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                256-bit SSL
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-bold">
                  {isAr ? 'التلميذ المعني بالواجب الشهر:' : 'Élève concerné:'}
                </label>
                <input
                  type="text"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-bold">
                  {isAr ? 'المبلغ المستحق (درهم مغربي):' : 'Montant à payer (MAD):'}
                </label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-emerald-600 font-bold"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 space-y-1">
                <div>• {isAr ? 'التأكيد الفوري عبر إشعار SMS لولي الأمر' : 'Notification SMS immédiate au tuteur'}</div>
                <div>• {isAr ? 'إرسال الوصل الرقمي PDF تلقائياً' : 'Génération immédiate du reçu PDF'}</div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowCmiGateway(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  onClick={handleSimulateCmiPayment}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  {isAr ? 'تأكيد الأداء الإلكتروني CMI' : 'Valider le Paiement'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
