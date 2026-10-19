import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { useI18n } from '../context/I18nContext';
import { Building2, ShieldCheck, Users, Trophy, Target, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const { locale, openDemoModal } = useI18n();
  const isAr = locale === 'ar';

  const team = [
    {
      name: isAr ? 'أمين بنسعيد' : 'Amine Bensaid',
      role: isAr ? 'المؤسس والرئيس التنفيذي' : 'Fondateur & CEO',
      bio: isAr
        ? 'مهندس تدبير التكنولوجيا متخرج من الأخوين ومدرسة البوليتكنيك بباريس، خبرة 12 سنة في تحويل الأنظمة البرمجية.'
        : 'Ingénieur diplômé de Polytechnique & Al Akhawayn, 12 ans d’expérience en transformation EdTech.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: isAr ? 'د. هدى التازي' : 'Dr. Houda Tazi',
      role: isAr ? 'مديرة الابتكار التربوي' : 'Directrice de l’Innovation Pédagogique',
      bio: isAr
        ? 'دكتوراة في علوم التربية والتحول الرقمي من جامعة محمد الخامس بالرباط، مستشارة سابقة للمدارس الخاصة.'
        : 'Docteur en Sciences de l’Éducation (UM5 Rabat), ancienne conseillère pédagogique pour les écoles privées.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: isAr ? 'ياسين الخياري' : 'Yassine El Khiari',
      role: isAr ? 'مدير الهندسة والربط مع مسار' : 'Head of Engineering & MASSAR Sync',
      bio: isAr
        ? 'خبير برمجيات سحابية وأمن البيانات، يقود فريق تطوير وحدة الربط الفوري المباشر مع بوابة مسار الوزارية.'
        : 'Expert Cloud & Sécurité des Données, concepteur de l’architecture de synchronisation MASSAR.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
  ];

  const milestones = [
    {
      year: '2022',
      title: isAr ? 'التأسيس ببرج الدار البيضاء المالي' : 'Fondation à Casablanca Finance City',
      description: isAr
        ? 'إطلاق النواة الأولى لإديوفورا بالتعاون مع 5 مدارس خاصة بالدار البيضاء لبناء نظام متوافق مع مسار.'
        : 'Lancement du premier noyau Eduvora avec 5 écoles pilotes à Casablanca.',
    },
    {
      year: '2023',
      title: isAr ? 'التوسع وتأسيس المركز التقني بالرباط' : 'Inauguration du Hub Tech à Rabat',
      description: isAr
        ? 'افتتاح مكتب التكنوبارك الرباط والحصول على الترخيص الرسمي لمطابقة معايير حماية المعطيات CNDP.'
        : 'Ouverture au Technopark Rabat & Certification de conformité CNDP Loi 09-08.',
    },
    {
      year: '2024',
      title: isAr ? 'تجاوز 100 مدرسة خاصة شريكة' : 'Cap des 100 Écoles Partenaires',
      description: isAr
        ? 'إطلاق تطبيق الهاتف للأولياء وإدماج وحدة الأداء الإلكتروني السريع عبر البطاقات المغربية CMI.'
        : 'Lancement de l’application mobile Parents et de la passerelle de paiement CMI.',
    },
    {
      year: '2026',
      title: isAr ? 'المنصة الرقمية القيادية بالتعليم الخاص' : 'Leader SaaS Scolaire au Maroc',
      description: isAr
        ? 'خدمة أكثر من 85,000 تلميذ في مختلف مدن المملكة (الدار البيضاء، الرباط، مراكش، طنجة، فاس، أكادير).'
        : 'Plus de 85 000 élèves gérés au quotidien dans toutes les grandes villes du Royaume.',
    },
  ];

  return (
    <PageLayout
      title={isAr ? 'عن شركة إديوفورا المغرب' : 'À Propos d’Eduvora Maroc'}
      seoTitle={isAr ? 'عن إديوفورا - الشركة القيادية بالحلول التعليمية' : 'À Propos - Leader EdTech Maroc'}
      seoDescription={
        isAr
          ? 'تعرف على قصة تأسيس إديوفورا بالدار البيضاء والرباط، قيمنا، وفريق الخبراء الذي يقود التحول الرقمي بالتعليم الخاص بالمغرب.'
          : 'Découvrez l’histoire d’Eduvora à Casablanca et Rabat, nos valeurs, et l’équipe d’experts qui transforme la gestion des écoles privées au Maroc.'
      }
      badge={isAr ? 'قصتنا ورؤيتنا' : 'Notre Histoire & Vision'}
      subtitle={
        isAr
          ? 'نحن شركة تكنولوجيا تعليمية مغربية (EdTech) تهدف إلى تمكين المؤسسات التعليمية الخاصة من الإدارة الذكية والشفافة.'
          : 'EdTech marocaine pionnière, dédiée à l’excellence opérationnelle et à la modernisation des écoles privées.'
      }
      breadcrumbs={[{ label: isAr ? 'عن إديوفورا' : 'À Propos' }]}
    >
      <div className="space-y-16">
        {/* Mission & Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'رؤيتنا: جعل الإدارة المدرسية بسيطة، آمنة ومترابطة' : 'Notre Mission : Une École Connectée, Simple et Sécurisée'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'تأسست إديوفورا استجابة للتحديات الكبيرة التي تواجه المدارس الخاصة بالمغرب: تعقيد العمل الإداري الورقي، صعوبة المزامنة مع مسار، وتأخر استيفاء الواجبات الدراسية. طورنا منصة سحابية شاملة تلبي كل متطلبات الوزارة وراحة الأسر.'
                : 'Eduvora est née d’un constat : la gestion d’une école privée au Maroc exige une rigueur extrême entre contraintes MASSAR, gestion financière et attentes des parents. Nous avons créé la solution SaaS marocaine la plus complète du marché.'}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-900 border border-blue-100 dark:border-slate-800">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">100%</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                  {isAr ? 'امتثال لقانون CNDP المغربي' : 'Conformité CNDP Loi 09-08'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-slate-900 border border-emerald-100 dark:border-slate-800">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">+150</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                  {isAr ? 'مؤسسة خاصة شريكة' : 'Écoles Privées Clientes'}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900 text-white p-8 relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
              <Building2 className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-xl font-bold mb-3">
                {isAr ? 'مكاتبنا بالدار البيضاء والرباط' : 'Nos Hubs de Casablanca & Rabat'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {isAr
                  ? 'يتواجد فريقنا في برج الدار البيضاء المالي (CFC Tower) وفي التكنوبارك بالرباط، لتوفير الدعم الفني الحضوري والمواكبة الميدانية لجميع مدارس المملكة.'
                  : 'Nos équipes sont basées à Casablanca Finance City et au Technopark Rabat pour assurer une présence terrain et un accompagnement sur-mesure.'}
              </p>
              <button
                onClick={() => openDemoModal('About page CTA')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition cursor-pointer"
              >
                <span>{isAr ? 'احجز زيارة لمدرستك' : 'Réserver une rencontre'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isAr ? 'قيمنا الجوهرية' : 'Nos Valeurs Fondatrices'}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {isAr ? 'المبادئ التي تقود كل خطوة في إديوفورا' : 'Ce qui anime notre engagement quotidien'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isAr ? 'الأمان وحماية المعطيات' : 'Sécurité & Conformité CNDP'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr
                  ? 'حماية بيانات الأطفال والتلاميذ وأولياء أمورهم هي أولويتنا المطلقة وفق معايير القانون 09-08 والتشفير المتقدم.'
                  : 'Garantie absolue de confidentialité des données scolaires des mineurs selon la loi marocaine 09-08.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isAr ? 'الابتكار والربط الذكي' : 'Innovation & Sync MASSAR'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr
                  ? 'تطوير مستمر لوظائف المنصة ومزامنة تلقائية دائمة مع تحديثات منظومة مسار التابعة لوزارة التربية الوطنية.'
                  : 'Mise à jour continue et synchronisation zéro-erreur avec les APIs du Ministère de l’Éducation Nationale.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Users className="w-8 h-8 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isAr ? 'القرب والمرافقة الميدانية' : 'Proximité & Support Terrain'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr
                  ? 'فريق مغربي يتحدث بلغتكم ويتواجد في عين المكان لتدريب الطاقم الإداري والأساتذة مجاناً طيلة السنة.'
                  : 'Une équipe locale à votre écoute, capable d’intervenir dans vos locaux sous 24 à 48 heures.'}
              </p>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isAr ? 'فريق القيادة' : 'L’Équipe Dirigeante'}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {isAr ? 'خبراء مكرسون لتطوير التعليم بالمغرب' : 'Des passionnés d’éducation et de technologie'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 hover:shadow-lg transition duration-300"
              >
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-blue-500/20"
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{m.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{m.role}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-6 p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {isAr ? 'محطات النجاح' : 'Notre Parcours'}
            </span>
            <h2 className="text-2xl font-bold mt-1">
              {isAr ? 'تطور إديوفورا في خريطة الطريق' : 'De la création à la position de leader'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {milestones.map((ms, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <span className="text-xl font-black text-amber-400">{ms.year}</span>
                <h3 className="font-bold text-sm text-white">{ms.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{ms.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-10 rounded-3xl bg-blue-600 text-white space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">
            {isAr ? 'تريد التعرف على إديوفورا عن قرب؟' : 'Découvrez comment Eduvora s’adapte à votre école'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            {isAr
              ? 'احجز جلسة عرض توضيحي مع أحد خبرائنا بالدار البيضاء أو الرباط لتجربة المنصة مجاناً.'
              : 'Demandez une présentation sur-mesure dans vos locaux ou par visioconférence.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => openDemoModal('About Page Bottom CTA')}
              className="px-8 py-3.5 rounded-xl bg-white text-blue-700 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition shadow-lg cursor-pointer"
            >
              {isAr ? 'طلب تجربة مجانية الآن' : 'Demander une démonstration'}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
