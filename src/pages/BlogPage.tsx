import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { useI18n } from '../context/I18nContext';
import { Search, Calendar, User, ArrowRight, Tag, BookOpen, X, Share2, Sparkles } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const BlogPage: React.FC = () => {
  const { locale, openDemoModal } = useI18n();
  const isAr = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const articles = [
    {
      id: 'massar-guide-2026',
      category: 'massar',
      categoryLabel: isAr ? 'دليل مسار' : 'Guide MASSAR',
      title: isAr
        ? 'كيفية ربط غيابات ونقط التلاميذ مع منظومة مسار في 3 دقائق بدون أخطاء'
        : 'Guide MASSAR 2026 : Synchroniser les notes et absences sans aucune erreur',
      excerpt: isAr
        ? 'خطوات عملية واضحة لتفادي مشاكل إعادة الإدخال اليدوي، معالجة معاملات المواد، واستخراج البيانات دون ضغط الصيانة.'
        : 'Guide pratique pour automatiser le transfert des absences et bulletins de notes vers la plateforme officielle du Ministère.',
      date: '18 Mars 2026',
      author: isAr ? 'ياسين الخياري - مهندس مسار' : 'Yassine El Khiari - Expert MASSAR',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      content: isAr
        ? `تعتبر منظومة "مسار" التابعة لوزارة التربية الوطنية بالمغرب الركيزة الأساسية للإدارة التربوية، إلا أن إدخال النقط والغيابات يدوياً يستهلك مئات الساعات من طاقم المدرسة الخاصة ويسبب أخطاء بشرية متكررة.

في هذا الدليل، نستعرض كيف أتاحت وحدة الربط المباشر لـ "إديوفورا" مع بروتوكول مسار الجديد إمكانية استيراد واستخراج اللوائح والنتائج بضغطة زر واحدة:

1. مزامنة أوراق المراقبة المستمرة بدون الحاجة لإعادة كتابة الأرقام.
2. المطابقة التلقائية لأسماء التلاميذ ورقم مسار الوطني CNE.
3. معالجة الغيابات اليومية وتصديرها مباشرة للسجلات الرسمية.
4. ضمان سرية المعطيات وتوافقها التام مع المعايير الوزارية.`
        : `Le système MASSAR du Ministère de l'Éducation Nationale est incontournable au Maroc. Cependant, la saisie manuelle des bulletins et des retards génère une surcharge de travail considérable pour les secrétariats.

Dans cet article, nous expliquons comment le module de synchronisation automatisé d'Eduvora résout définitivement ce problème :

1. Importation et exportation instantanée des fiches de contrôle continu.
2. Correspondance automatique des identifiants CNE des élèves.
3. Envoi des absences quotidiennes sans double saisie.
4. Garantie de conformité avec les référentiels du Ministère.`,
    },
    {
      id: 'cmi-finance-reduction',
      category: 'finance',
      categoryLabel: isAr ? 'المالية والأداء' : 'Finance & CMI',
      title: isAr
        ? 'استراتيجيات تحسين تحصيل الواجبات المدرسية وتقليل الديون المتأخرة بنسبة 65%'
        : 'Dématérialisation CMI : Comment réduire le taux d’impayés de scolarité de 65%',
      excerpt: isAr
        ? 'تحليل تطبيقي لأهمية تفعيل الأداء الإلكتروني عبر البطاقات المغربية والتذكير التلقائي عبر تطبيق الواتساب.'
        : 'Analyse des meilleures pratiques pour optimiser la trésorerie des écoles privées grâce au paiement par carte marocaine et relances WhatsApp.',
      date: '10 Février 2026',
      author: isAr ? 'أمين بنسعيد - خبير مالي' : 'Amine Bensaid - Fondateur',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      content: isAr
        ? `تعتبر المتأخرات المالية واستيفاء واجبات الدراسة الشهرية من أعقد التحديات التي تجابه مدراء ومحاسبي المدارس الخاصة بالمغرب.

أظهرت دراسة أجرتها إديوفورا على +100 مدرسة شريكة أن اعتماد حلول الأداء الذكية يحقق نتائج فورية:

- التذكير التلقائي قبل تاريخ 5 من كل شهر عبر الواتساب يرفع استجابة الآباء بنسبة 40%.
- إتاحة خيار الأداء الإلكتروني CMI عبر تطبيق الهواتف يتيح للأبناء والسيدات الأداء في أي وقت دون تنقل للمؤسسة.
- إصدار الوصل الرقمي المشفر فوراً يعزز الشفافية والثقة بين المدرسة والأسرة.`
        : `Le recouvrement des mensualités de scolarité constitue le nerf de la guerre pour la santé financière d'une école privée.

Une étude menée auprès de 100 établissements partenaires montre que la digitalisation des paiements transforme la trésorerie :

- Les relances programmées WhatsApp réduisent le délai moyen de paiement de 12 jours.
- Le paiement en ligne CMI permet aux parents de régler l'écolage à tout moment en 30 secondes.
- L'émission automatique du reçu numéroté renforce la confiance des familles.`,
    },
    {
      id: 'parent-app-engagement',
      category: 'parent',
      categoryLabel: isAr ? 'تطبيق الأولياء' : 'App Parents',
      title: isAr
        ? 'تطبيق الآباء الذكي: كيف تبني علاقة ثقة وشفافية مع أسر التلاميذ بالمغرب؟'
        : 'Application Mobile Parents : Transformer la relation école-famille au Maroc',
      excerpt: isAr
        ? 'كيف يساهم الإشعار الفوري بالغياب والنقاط في إشراك الآباء في المسار التربوي لأبنائهم وتعزيز سمعة المدرسة.'
        : 'Comment l’information en temps réel sur mobile renforce l’engagement des parents et valorise l’image de l’établissement.',
      date: '28 Janvier 2026',
      author: isAr ? 'د. هدى التازي' : 'Dr. Houda Tazi',
      readTime: '4 min',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
      content: isAr
        ? `يرغب ولي الأمر الحديث في الاطلاع اللحظي على كل ما يخص تمدرس أبنائه. لم تعد دفاتر النجارة الورقية والمكالمات الهاتفية كافية.

يوفر تطبيق Eduvora Parent للأسر تجربة فريدة:
- الاطلاع الفوري على الغيابات والتأخرات فور تسجيل الأستاذ للحصة.
- تتبع واجبات المنزل ودروس الدعم للحد من الإهمال.
- متابعة مسار حافلة النقل المدرسي عبر خريطة الجي بي إس لراحة بال تام.`
        : `Les familles d'aujourd'hui exigent un suivi fluide et instantané de la scolarité de leurs enfants. 

L'application Eduvora Parent offre une expérience rassurante :
- Notification d'absence dès les premières minutes du cours.
- Consultation du cahier de texte et devoirs à la maison.
- Géolocalisation du bus scolaire pour éviter l'attente inutile.`,
    },
    {
      id: 'cndp-security-law',
      category: 'security',
      categoryLabel: isAr ? 'الأمان و CNDP' : 'Sécurité & CNDP',
      title: isAr
        ? 'حماية معطيات الأطفال والتلاميذ: دليل الامتثال لقانون CNDP رقم 09-08'
        : 'Conformité CNDP Loi 09-08 : Protéger les données des élèves mineurs au Maroc',
      excerpt: isAr
        ? 'الشروط القانونية والتقنية لتخزين صور وبيانات ونقاط القاصرين في خوادم سحابية آمنة بالمغرب.'
        : 'Les exigences légales et techniques pour l’hébergement et le traitement sécurisé des données scolaires.',
      date: '15 Décembre 2025',
      author: isAr ? 'المستشار القانوني لإديوفورا' : 'Équipe Juridique Eduvora',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      content: isAr
        ? `تلزم اللجنة الوطنية لحماية المعطيات ذات الطابع الشخصي (CNDP) جميع المدارس الخاصة بالتصريح المسبق والتأكد من تشفير بيانات التلاميذ.

في هذا المقال نوضح كيف تضمن إديوفورا حماية مؤسستك من المسؤوليات القانونية:
- خوادم آمنة ومشفرة بمعايير AES-256.
- أخذ موافقة الآباء الصريحة لاستخدام صور الأنشطة المدرسية.
- إدارة صلاحيات الموظفين والأساتذة بحيث لا يتم تسريب أي وثيقة رسمية.`
        : `La CNDP impose des règles strictes aux établissements scolaires concernant la collecte et l'archivage des données nominatives des mineurs.

Eduvora garantit une protection juridique et technique intégrale :
- Chiffrement AES-256 des bases de données scolaires.
- Gestion stricte des autorisations d'accès du personnel.
- Sauvegardes sécurisées conformes aux dispositions de la loi 09-08.`,
    },
  ];

  const categories = [
    { id: 'all', label: isAr ? 'جميع المقالات' : 'Tous les articles' },
    { id: 'massar', label: isAr ? 'مسار MASSAR' : 'MASSAR' },
    { id: 'finance', label: isAr ? 'المالية و CMI' : 'Finance' },
    { id: 'parent', label: isAr ? 'تطبيق الآباء' : 'App Parents' },
    { id: 'security', label: isAr ? 'الأمان و CNDP' : 'Sécurité & CNDP' },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeArticle = articles.find((a) => a.id === activeArticleId);

  return (
    <PageLayout
      title={isAr ? 'مدونة إديوفورا للتعليم الخاص' : 'Blog EdTech Eduvora Maroc'}
      seoTitle={isAr ? 'مدونة إديوفورا - أدلة مسار والإدارة المدرسية' : 'Blog Eduvora - Guides MASSAR & Gestion Scolaire Maroc'}
      seoDescription={
        isAr
          ? 'مقالات وأدلة تطبيقية لمدراء ومحاسبي المدارس الخاصة بالمغرب: الربط بمسار، الأداء الإلكتروني CMI، وحماية المعطيات CNDP.'
          : 'Articles et guides pratiques pour directeurs et fondateurs d’écoles privées au Maroc : MASSAR, CMI et conformité CNDP.'
      }
      badge={isAr ? 'مقالات وأدلة تعليمية' : 'Ressources & Guides'}
      subtitle={
        isAr
          ? 'نشارككم خبراتنا الميدانية وأحدث الإرشادات التقنية والقانونية لتطوير مؤسستكم التعليمية.'
          : 'Retrouvez nos analyses et conseils pour moderniser la gestion de votre établissement privé.'
      }
      breadcrumbs={[{ label: isAr ? 'المدونة' : 'Blog' }]}
    >
      <div className="space-y-10">
        {/* Search & Category Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث في المقالات...' : 'Rechercher un article...'}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Article Cards Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => setActiveArticleId(art.id)}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:shadow-xl transition duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-16/9 rounded-2xl overflow-hidden relative">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold">
                      {art.categoryLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {art.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>{isAr ? 'اقرأ المقال كاملاً' : 'Lire l’article complet'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title={isAr ? 'لم نجد مقالات تطابق بحثك' : 'Aucun article trouvé'}
            description={
              isAr
                ? 'جرب البحث بكلمات مفتاحية أخرى مثل مسار، الأداء، CNDP، أو اختر جميع المقالات.'
                : 'Essayez de chercher d’autres termes comme MASSAR, CMI, CNDP ou réinitialisez les filtres.'
            }
            actionText={isAr ? 'عرض كافة المقالات' : 'Voir tous les articles'}
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          />
        )}

        {/* Article Viewer Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative space-y-6">
              <button
                onClick={() => setActiveArticleId(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {activeArticle.categoryLabel}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeArticle.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>{activeArticle.author}</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                </div>
              </div>

              <div className="aspect-16/9 rounded-2xl overflow-hidden">
                <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>

              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
                {activeArticle.content}
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveArticleId(null);
                    openDemoModal(`Blog article: ${activeArticle.title}`);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
                >
                  {isAr ? 'احجز تجربتك للمدرسة' : 'Demander une démonstration'}
                </button>
                <button
                  onClick={() => setActiveArticleId(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  {isAr ? 'إغلاق' : 'Fermer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
