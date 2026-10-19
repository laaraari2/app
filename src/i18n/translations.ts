import { TranslationSchema, Locale } from '../types/i18n';

export const translations: Record<Locale, TranslationSchema> = {
  ar: {
    nav: {
      home: 'الرئيسية',
      solutions: 'الحلول',
      products: 'المنتجات',
      pricing: 'الأسعار',
      about: 'عن إديوفورا',
      blog: 'المدونة',
      contact: 'اتصل بنا',
      requestDemo: 'طلب تجربة مجانية',
      login: 'تسجيل الدخول',
    },
    hero: {
      badge: 'المنصة الذكية الأولى للمدارس الخاصة بالمغرب 🇲🇦',
      tagline: 'منصة ذكية لإدارة المدارس الخاصة',
      titleStart: 'الجيل الجديد لإدارة',
      titleHighlight: 'المدارس الخاصة',
      titleEnd: 'في المغرب بكفاءة وذكاء',
      subtitle:
        'إديوفورا توفر حلولاً رقمية متكاملة تجمع بين الربط المباشر مع نظام مسار، الإدارة المالية الذكية، التواصل الآني مع الأولياء، وتدبير الشؤون التربوية في منصة سحابية واحدة آمنة.',
      ctaPrimary: 'احجز عرضاً توضيحياً مجاناً',
      ctaSecondary: 'استكشف منتجات المنصة',
      trustTitle: 'شركاء النجاح في أكثر من +150 مدرسة خاصة في مختلف مدن المملكة',
      liveStats: {
        schools: 'مدرسة خاصة',
        students: 'تلميذ نشط',
        satisfaction: 'نسبة رضا مدراء المدارس',
        massarSynced: 'توافق كامل مع منظومة مسار',
      },
    },
    features: {
      badge: 'مميزات إديوفورا',
      title: 'كل ما تحتاجه مادتك التربوية والإدارية في مكان واحد',
      subtitle:
        'صُممت المنصة وفق الخصوصيات القانونية والتربوية للمؤسسات التعليمية الخاصة في المغرب.',
      categories: {
        all: 'الجميع',
        admin: 'الإدارة والتسجيل',
        massar: 'ربط مسار (MASSAR)',
        finance: 'المالية والأستاذ',
        parent: 'تطبيق الأولياء',
        ai: 'الذكاء الاصطناعي',
      },
      items: [
        {
          id: 'feat-1',
          category: 'massar',
          title: 'ربط مباشر وتلقائي مع منظومة مسار (MASSAR)',
          description:
            'مزامنة فورية للغيابات، النقط، لائحة التلاميذ، ومعاملات المواد بضغطة زر واحدة دون الحاجة لإعادة إدخال البيانات يدوياً.',
          highlight: 'وفر 90% من وقت الإدخال اليدوي',
        },
        {
          id: 'feat-2',
          category: 'finance',
          title: 'تدبير الأقساط الشهرية والأداء الإلكتروني',
          description:
            'تتبع المقبوضات، إرسال تذكيرات تلقائية عبر واتساب للآباء، وإمكانية الأداء الإلكتروني الآمن عبر البطاقات البنكية المغربية (CMI).',
          highlight: 'تقليل المتأخرات المالية بنسبة 65%',
        },
        {
          id: 'feat-3',
          category: 'parent',
          title: 'تطبيق الأباء الذكي (Eduvora Parent)',
          description:
            'إشعارات لحظية بالحضور والغياب، الاطلاع على بيان النقاط، استعمال الزمن، والتواصل المباشر مع الإدارة والأساتذة.',
          highlight: 'تجربة ولي أمر عصرية وشفافة',
        },
        {
          id: 'feat-4',
          category: 'admin',
          title: 'إدارة تسجيل واستقبال التلاميذ الجدد',
          description:
            'إدارة طلبات التسجيل القبلي عبر الإنترنت، أرشفة الملفات الرقمية، وطباعة الشواهد المدرسية والعقود الرسمية تلقائياً.',
          highlight: 'أرشفة رقمية آمنة 100%',
        },
        {
          id: 'feat-5',
          category: 'ai',
          title: 'تقارير وتحليلات تربوية بالذكاء الاصطناعي',
          description:
            'كشف مبكر للتلاميذ المتأخرين دراسياً، تحليل معدلات المواد، واستخراج خطط دعم تربوي مخصصة للرفع من نسبة النجاح.',
          highlight: 'مؤشرات أداء قيادية للمدير',
        },
        {
          id: 'feat-6',
          category: 'admin',
          title: 'تخطيط استعمالات الزمن وتدبير النقل المدرسية',
          description:
            'إنشاء جداول الحصص بدون تضارب للقاعات والأساتذة، وتتبع حافلات النقل المدرسي عبر نظام الجي بي إس (GPS).',
          highlight: 'تتبع الحافلات والتوقيت الذكي',
        },
      ],
    },
    products: {
      badge: 'منظومة إديوفورا المتكاملة',
      title: 'أربعة منتجات متناغمة تقود مدرستك نحو التميز الرقمي',
      subtitle:
        'حلول مخصصة لكل فاعل داخل المنظومة التعليمية: المدير، الأستاذ، ولي الأمر، والمكلف بالمالية.',
      items: {
        school: {
          title: 'Eduvora School',
          tagline: 'لوحة قيادة الإدارة والمدير العام',
          description:
            'المركز الرئيسي للتحكم في جميع أقسام المدرسة: التسجيل، الشؤون التربوية، الموارد البشرية، وتتبع الإيرادات والمصاريف في الوقت الفعلي.',
          features: [
            'لوحة إحصائيات مركزية شاملة',
            'إدارة الموظفين والأساتذة والأجور',
            'توليد الشواهد والوثائق بلمسة زر',
            'دعم تسيير فروع متعددة للمؤسسة',
          ],
        },
        parent: {
          title: 'Eduvora Parent',
          tagline: 'تطبيق الهاتف الذكي لأولياء الأمور',
          description:
            'تطبيق متاح على iOS و Android يضع المدرسة في جيب ولي الأمر لمتابعة أبنائه لحظة بلحظة وبكل راحة بال.',
          features: [
            'إشعارات لحظية للغياب والتأخر',
            'اطلاع على النقط والواجبات المنزلية',
            'أداء واجبات الدراسة عبر الهاتف',
            'دردشة آمنة مع إدارة المؤسسة',
          ],
        },
        teacher: {
          title: 'Eduvora Teacher',
          tagline: 'بوابة الأساتذة والفريد التربوي',
          description:
            'منصة مبسطة تمكّن الأساتذة من تسجيل غياب التلاميذ، إدخال النقاط والملاحظات، ومشاركة الدروس والتمارين المنزلية بكل سرعة.',
          features: [
            'تسجيل الغياب بضغطة زر من الهاتف أو اللوحة',
            'دفتر النصوص الرقمي والواجبات',
            'إدخال نقط المراقبة المستمرة لمسار',
            'تتبع السلوك والملاحظات التربوية',
          ],
        },
        finance: {
          title: 'Eduvora Finance',
          tagline: 'النظام المالي والمحاسباتي الذكي',
          description:
            'وحدة مالية متخصصة تضمن شفافية المداخيل والمصاريف، إصدار وصل الأداء والتذكير الأوتوماتيكي بالمستحقات المالية.',
          features: [
            'إصدار وصلات الأداء الرقمية فوراً',
            'إرسال تذكيرات عبر WhatsApp تلقائياً',
            'إدارة المقبولين بالمنح والتخفيضات',
            'تقارير المحاسبة العامة والتحليلية',
          ],
        },
      },
    },
    whyEduvora: {
      badge: 'لماذا يفضلنا المدراء بالمغرب؟',
      title: 'صُمم بأيدي خبراء مغاربة يفهمون تطلعات المدرسة الخاصة',
      subtitle:
        'نحن لا نقدم مجرد برنامج حاسوب، بل شريك استراتيجي يرافق مؤسستك في التحول الرقمي الكامل.',
      stats: {
        schoolsCount: '+150',
        schoolsLabel: 'مؤسسة تعليمية خاصة',
        studentsCount: '+85,000',
        studentsLabel: 'تلميذ مسجل في المنصة',
        satisfactionRate: '98.5%',
        satisfactionLabel: 'معدل تجديد الاشتراكات السنوي',
        timeSaved: '40+',
        timeSavedLabel: 'ساعة توفير أسبوعياً لكل إدارة',
      },
      advantages: [
        {
          title: 'مطابقة تامة للتشريعات المغربية و CNDP',
          description:
            'المنصة مصرح بها وممتثلة بالكامل لقانون حماية المعطيات ذات الطابع الشخصي رقم 09-08 والمقتضيات الوزارية.',
        },
        {
          title: 'دعم فني وتدريب بالموقع مجاناً',
          description:
            'فريقنا المتواجد بالدار البيضاء والرباط يقدم تدريباً حضورياً لطاقمكم ومرافقة يومية طيلة السنة الدراسية.',
        },
        {
          title: 'استضافة سحابية عالية الأمان 99.9%',
          description:
            'خوادم فائقة السرعة مع نسخ احتياطي يومي تلقائي لحماية معطيات مدرستكم من أي ضياع.',
        },
        {
          title: 'ربط مباشر مع وسائل الأداء بالمغرب',
          description:
            'دعم الأداء عبر البطاقات المغربية، التحويلات البنكية، والمقتطعات التلقائية مع فواتير قانونية.',
        },
      ],
      timelineTitle: 'رحلة الانضمام إلى إديوفورا في 4 خطوات بسيطة',
      timelineSubtitle: 'نضمن لك انتقالا سلسأ وبدون أي تعطيل لسير الدراسة بالمؤسسة',
      timelineSteps: [
        {
          step: '01',
          title: 'طلب التجربة والمقابلة الأسبوعية',
          description: 'يقوم خبيرنا بزيارة مؤسستكم أو تقديم عرض توضيحي مباشر للتعرف على احتياجاتكم.',
          duration: 'اليوم 1',
        },
        {
          step: '02',
          title: 'استيراد البيانات ومزامنة مسار',
          description: 'يقوم فريقنا التقني بنقل معطيات التلاميذ والأساتذة وربط النظام مع مسار تلقائياً.',
          duration: 'اليوم 2-3',
        },
        {
          step: '03',
          title: 'تأهيل وتدريب الطاقم الإداري والتربوي',
          description: 'دورات تدريبية مبسطة ومواكبة مباشرة للإداريين والأساتذة لاستعمال التطبيق.',
          duration: 'اليوم 4',
        },
        {
          step: '04',
          title: 'الانطلاق الرسمي وإطلاق تطبيق الآباء',
          description: 'توزيع رموز الوصول على أولياء الأمور وبداية العمل الفلي بنظام رقمي متكامل.',
          duration: 'اليوم 5',
        },
      ],
    },
    testimonials: {
      badge: 'شهادات النجاح',
      title: 'ماذا يقول مدراء المدارس الخاصة عن إديوفورا؟',
      subtitle: 'تجارب حقيقية لمؤسسات تعليمية رائدة استطاعت تحسين أدائها الإداري والمالي.',
      items: [
        {
          quote:
            'إديوفورا غيرت طريقة عملنا بالكامل في المؤسسة. ربط مسار التلقائي ووحدة الأداء المالي وفرت علينا مئات الساعات من العمل الورقي وشجعت الأباء على استيفاء الواجبات في وقتها.',
          author: 'الأستاذ عبد الجليل العلمي',
          role: 'المؤسس والمدير العام',
          school: 'مجموعة مدارس النخبة الخاصة',
          city: 'الدار البيضاء - المعاريف',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          metrics: 'توفير 15 ساعة عمل إداري أسبوعياً',
        },
        {
          quote:
            'تطبيق أولياء الأمور Eduvora Parent جعل التواصل بيننا وبين الأسر في غاية الشفافية. الآباء أصبحوا يتابعون غيابات أبنائهم ونقطهم فورياً، ونسبة الرضا ارتفعت بشكل كبير.',
          author: 'الدكتورة مريم بنجلون',
          role: 'مديرة الشؤون التربوية',
          school: 'مؤسسة الأمانة التعليمية',
          city: 'الرباط - السويسي',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          metrics: 'ارتفاع رضا الأولياء إلى 99%',
        },
        {
          quote:
            'فريق الدعم الفني لإديوفورا حاضر دائماً معنا. التدريب الحصوري وتتبعهم اليومي جعل انتقال جميع أساتذتنا إلى النظام الرقمي سهلاً وسريعاً جداً دون أي مشاكل.',
          author: 'الحاج رشيد التازي',
          role: 'المدير المالي والتنفيذي',
          school: 'مدارس المستقبل ثنائية اللغة',
          city: 'مراكش - جليز',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          metrics: 'تحصيل 95% من الواجبات المدرسية أونلاين',
        },
      ],
    },
    faq: {
      badge: 'الأسئلة الشائعة',
      title: 'إجابات عن كل ما يشغل بالك قبل اختيار إديوفورا',
      subtitle: 'نحن هنا لتسهيل القرار عليك وتوفير كافة الإيضاحات التقنية والقانونية.',
      items: [
        {
          question: 'هل إديوفورا متوافق بشكل كامل مع نظام مسار (MASSAR) المغربي؟',
          answer:
            'نعم، 100%. تمتلك إديوفورا وحدة ربط متطورة تتيح استيراد وتصدير الغيابات، نقط المراقبة المستمرة، والبيانات الشخصية للتلاميذ من وإلى مسار بضغطة زر دون أي تعارض.',
        },
        {
          question: 'كيف تحمي المنصة المعطيات الشخصية للتلاميذ وأولياء الأمور؟',
          answer:
            'نلتزم تماماً بالقانون المغربي رقم 09-08 الصادر عن اللجنة الوطنية لحماية المعطيات ذات الطابع الشخصي (CNDP). جميع البيانات مشفرة باستخدام معايير AES-256 ومخزنة في خوادم آمنة عالية الحماية.',
        },
        {
          question: 'كم يستغرق تنصيب المنصة وتدريب فريق مدرستنا؟',
          answer:
            'استبدال النظام القديم وتفعيل إديوفورا يستغرق بين 48 ساعة إلى 5 أيام عمل فقط. يتولى فريقنا التدريب المباشر لإدارتكم وأساتذتكم مجاناً.',
        },
        {
          question: 'هل يمكن لأولياء الأمور أداء الواجبات الشهرية عبر تطبيق الهاتف؟',
          answer:
            'نعم! يوفر تطبيق Eduvora Parent خيار الأداء الإلكتروني الآمن عبر البطاقات البنكية المغربية أو الاقتطاع البنكي التلقائي، مع استلام وصل رسمية مشفر فور إتمام العملية.',
        },
        {
          question: 'هل تعمل المنصة باللغتين العربية والفرنسية؟',
          answer:
            'نعم، إديوفورا ثنائية اللغة بالكامل (العربية والفرنسية) مع دعم تغيير واجهة الاستخدام واتجاه الشاشة (RTL / LTR) لكل مستخدم حسب تفضيله الشخصي.',
        },
        {
          question: 'ما هي تكلفة الاشتراك في إديوفورا؟',
          answer:
            'تعتمد التكلفة على عدد التلاميذ المسجلين بالمؤسسة. نوفر خططاً مرنة تناسب المدارس الصغيرة والكبيرة دون أي مصاريف خفية أو تكاليف صيانة إضافية.',
        },
      ],
    },
    cta: {
      title: 'جاهز لنقل مدرستك إلى عصر الإدارة الذكية؟',
      subtitle:
        'انضم إلى أكثر من 150 مدرسة خاصة بالمغرب تعتمد على إديوفورا يومياً لتحقيق التميز التربوي والمالي.',
      button: 'طلب تجربة مجانية مجاناً',
      callUs: 'تحدث مع خبيرنا التقني الآن: 522-123-456 212+',
      guarantee: 'بدون أي التزام مالي - تجربة مجانية لمدة 14 يوماً مع تدريب كامل',
    },
    footer: {
      tagline: 'المنصة الرقمية المتكاملة لإدارة وتطوير المدارس الخاصة بالمغرب.',
      address: 'برج الدار البيضاء المالي، حي المعاريف / القطب التكنولوجي، الرباط',
      phone: '522 12 34 56 (212+)',
      email: 'contact@eduvora.ma',
      cndpNotice: 'منصة مصرح بها ومطابقة لمقتضيات اللجنة الوطنية لحماية المعطيات CNDP',
      rights: 'جميع الحقوق محفوظة © 2026 إديوفورا. صُمم بكل فخر في المغرب 🇲🇦',
      quickLinks: 'روابط سريعة',
      products: 'المنتجات',
      legal: 'قانوني',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الاستخدام',
      security: 'الأمان والحماية',
    },
    demoModal: {
      title: 'احجز عرضاً توضيحياً مجانياً لمؤسستك',
      subtitle: 'سيتصل بك خبيرنا التعليمي في أقل من 24 ساعة لتقديم عرض مخصص لمدرستك.',
      schoolName: 'اسم المؤسسة التعليمية الخاصة',
      schoolNamePlaceholder: 'مثال: مؤسسة النخبة الخاصة',
      contactName: 'الاسم الكامل للمدير أو المسؤول',
      contactNamePlaceholder: 'مثال: محمد العلمي',
      city: 'المدينة',
      citySelectPlaceholder: 'اختر المدينة',
      email: 'البريد الإلكتروني المهني',
      emailPlaceholder: 'direction@ecole.ma',
      phone: 'رقم الهاتف / الواتساب',
      phonePlaceholder: '06 61 XX XX XX',
      studentCount: 'عدد التلاميذ بالمؤسسة',
      studentCountSelectPlaceholder: 'اختر الفئة',
      notes: 'ملاحظات أو متطلبات خاصة (اختياري)',
      notesPlaceholder: 'مثال: نريد التركيز على ربط مسار والأداء الإلكتروني...',
      submitButton: 'تأكيد طلب العرض التوضيحي',
      submitting: 'جاري الإرسال...',
      successTitle: 'تم استلام طلبكم بنجاح! 🎉',
      successSubtitle: 'شكراً لاهتمامكم بـ إديوفورا.',
      successMessage:
        'سيقوم فريقنا بالاتصال بكم على الرقم المقدم لبرمجة جلسة توضيحية أو زيارة ميدانية لمؤسستكم في أقرب وقت.',
      closeButton: 'إغلاق',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      solutions: 'Solutions',
      products: 'Produits',
      pricing: 'Tarifs',
      about: 'À propos',
      blog: 'Blog',
      contact: 'Contact',
      requestDemo: 'Demander une démo',
      login: 'Connexion',
    },
    hero: {
      badge: 'N°1 des plateformes SaaS pour écoles privées au Maroc 🇲🇦',
      tagline: 'La plateforme intelligente de gestion des écoles privées',
      titleStart: 'La nouvelle génération de gestion des',
      titleHighlight: 'Écoles Privées',
      titleEnd: 'au Maroc',
      subtitle:
        'Eduvora réunit la synchronisation directe avec MASSAR, la gestion financière automatisée, la communication parents en temps réel et le suivi pédagogique dans une plateforme Cloud ultra-sécurisée.',
      ctaPrimary: 'Demander une démonstration gratuite',
      ctaSecondary: 'Découvrir nos produits',
      trustTitle: 'Plus de 150 écoles privées partenaires à travers le Royaume',
      liveStats: {
        schools: 'Écoles privées',
        students: 'Élèves actifs',
        satisfaction: 'Satisfaction directeurs',
        massarSynced: 'Compatibilité MASSAR 100%',
      },
    },
    features: {
      badge: 'Fonctionnalités Clés',
      title: 'Tout ce dont votre établissement a besoin en une seule solution',
      subtitle:
        'Conçu spécifiquement pour le cadre réglementaire et pédagogique des écoles privées marocaines.',
      categories: {
        all: 'Tous',
        admin: 'Administration & Inscription',
        massar: 'Sync MASSAR',
        finance: 'Finance & Enseignants',
        parent: 'App Parents',
        ai: 'IA & Rapports',
      },
      items: [
        {
          id: 'feat-1',
          category: 'massar',
          title: 'Synchronisation Directe avec MASSAR',
          description:
            'Mise à jour en un clic des absences, notes de contrôle continu, listes d’élèves et coefficients sans aucune saisie manuelle répétitive.',
          highlight: 'Économisez 90% du temps de saisie',
        },
        {
          id: 'feat-2',
          category: 'finance',
          title: 'Gestion des Frais Scolaires & Paiement CMI',
          description:
            'Suivi des encaissements, relances automatiques sur WhatsApp et possibilité de paiement en ligne sécurisé par carte marocaine (CMI).',
          highlight: 'Réduction des impayés de 65%',
        },
        {
          id: 'feat-3',
          category: 'parent',
          title: 'Application Mobile Parents (Eduvora Parent)',
          description:
            'Alertes instantanées de présence, bulletins de notes, emploi du temps et messagerie directe avec la direction de l’école.',
          highlight: 'Expérience parents moderne & transparente',
        },
        {
          id: 'feat-4',
          category: 'admin',
          title: 'Préinscriptions & Archivage Numérique',
          description:
            'Gestion des demandes en ligne, numérisation des dossiers élèves, génération automatique d’attestations et contrats de scolarité.',
          highlight: 'Archivage numérique 100% sécurisé',
        },
        {
          id: 'feat-5',
          category: 'ai',
          title: 'Analyses Pédagogiques par Intelligence Artificielle',
          description:
            'Détection précoce des élèves en difficulté, suivi des moyennes par matière et génération de plans de soutien personnalisés.',
          highlight: 'Indicateurs clés pour la direction',
        },
        {
          id: 'feat-6',
          category: 'admin',
          title: 'Emplois du Temps & Suivi Transport Scolaire GPS',
          description:
            'Génération intelligente d’emplois du temps sans conflit de salles et géolocalisation en direct des bus de ramassage scolaire.',
          highlight: 'Geofencing & géolocalisation des bus',
        },
      ],
    },
    products: {
      badge: 'Écosystème Eduvora',
      title: 'Quatre produits intégrés pour la transformation digitale globale',
      subtitle:
        'Des interfaces adaptées à chaque acteur: Fondateurs, Directeurs, Enseignants, Comptables et Parents.',
      items: {
        school: {
          title: 'Eduvora School',
          tagline: 'Le cockpit de gestion administrative et pédagogique',
          description:
            'Le cœur du système pour piloter les inscriptions, les ressources humaines, l’emploi du temps et les indicateurs financiers en temps réel.',
          features: [
            'Tableau de bord statistique décisionnel',
            'Gestion du personnel, enseignants et paie',
            'Édition instantanée de documents officiels',
            'Support multi-établissements et filiales',
          ],
        },
        parent: {
          title: 'Eduvora Parent',
          tagline: 'L’application mobile pour les familles',
          description:
            'Disponible sur iOS et Android, l’application offre aux parents un suivi fluide et rassurant de la scolarité de leurs enfants.',
          features: [
            'Notifications push d’absence et retards',
            'Consultation du cahier de texte et devoirs',
            'Paiement sécurisé des frais d’écolage',
            'Messagerie sécurisée avec l’établissement',
          ],
        },
        teacher: {
          title: 'Eduvora Teacher',
          tagline: 'Le portail de l’équipe enseignante',
          description:
            'Une interface fluide permettant aux professeurs de saisir les absences, noter les travaux, et partager des ressources pédagogiques.',
          features: [
            'Appel en classe en 1 clic sur mobile ou tablette',
            'Cahier de texte numérique et devoirs',
            'Saisie rapide des notes pour MASSAR',
            'Suivi du comportement et appréciations',
          ],
        },
        finance: {
          title: 'Eduvora Finance',
          tagline: 'Module financier et comptable automatisé',
          description:
            'Garantit la clarté financière, l’émission automatique des reçus de paiement et la gestion des relances pour une trésorerie saine.',
          features: [
            'Émission immédiate de reçus numérotés',
            'Relances automatiques programmées sur WhatsApp',
            'Gestion des remises, bourses et fratries',
            'Rapports comptables et analytiques exportables',
          ],
        },
      },
    },
    whyEduvora: {
      badge: 'Pourquoi les écoles nous choisissent',
      title: 'Développé par des experts marocains pour les écoles privées',
      subtitle:
        'Bien plus qu’un simple logiciel, nous sommes le partenaire stratégique qui vous accompagne au quotidien.',
      stats: {
        schoolsCount: '+150',
        schoolsLabel: 'Écoles privées partenaires',
        studentsCount: '+85 000',
        studentsLabel: 'Élèves suivis au quotidien',
        satisfactionRate: '98,5%',
        satisfactionLabel: 'Taux de renouvellement annuel',
        timeSaved: '40h+',
        timeSavedLabel: 'Économisées par semaine et par école',
      },
      advantages: [
        {
          title: 'Conformité Totale Réglementation CNDP & Maroc',
          description:
            'Plateforme déclarée et rigoureusement conforme à la loi 09-08 sur la protection des données personnelles au Maroc.',
        },
        {
          title: 'Support & Formation sur Site Gratuits',
          description:
            'Nos équipes basées à Casablanca et Rabat assurent une formation présentielle de votre personnel et un suivi continu.',
        },
        {
          title: 'Hébergement Cloud Haute Sécurité 99,9%',
          description:
            'Infrastructures cloud ultra-rapides avec sauvegardes quotidiennes automatiques pour garantir la pérennité de vos données.',
        },
        {
          title: 'Intégration Paiement Bancaire Marocain',
          description:
            'Paiement en ligne CMI, virements et préélèvements automatiques avec reçus légaux instantanés.',
        },
      ],
      timelineTitle: 'Déploiement simple en 4 étapes clés',
      timelineSubtitle: 'Transition fluide sans perturber le déroulement des cours',
      timelineSteps: [
        {
          step: '01',
          title: 'Démonstration & Diagnostic',
          description: 'Présentation personnalisée en ligne ou dans vos locaux pour cibler vos besoins.',
          duration: 'Jour 1',
        },
        {
          step: '02',
          title: 'Import Données & Sync MASSAR',
          description: 'Migration sécurisée de vos fichiers élèves/profs et connexion directe MASSAR.',
          duration: 'Jours 2-3',
        },
        {
          step: '03',
          title: 'Formation Présentielle des Équipes',
          description: 'Ateliers pratiques pour la direction, secrétariat et professeurs.',
          duration: 'Jour 4',
        },
        {
          step: '04',
          title: 'Lancement Officiel & App Parents',
          description: 'Distribution des accès aux parents et démarrage de la gestion 100% digitale.',
          duration: 'Jour 5',
        },
      ],
    },
    testimonials: {
      badge: 'Témoignages Client',
      title: 'Ce que disent les directeurs d’établissements',
      subtitle: 'Découvrez les retours d’expérience de fondateurs et directeurs d’écoles d’excellence.',
      items: [
        {
          quote:
            'Eduvora a révolutionné notre gestion quotidienne. La synchronisation automatique avec MASSAR et le paiement en ligne ont supprimé le travail papier et diminué nos retards de paiement.',
          author: 'M. Abdeljalil El Alami',
          role: 'Fondateur & Directeur Général',
          school: 'Groupe Scolaire Les Élites',
          city: 'Casablanca - Maarif',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          metrics: '15h de travail administratif économisées/semaine',
        },
        {
          quote:
            'L’application Eduvora Parent offre une transparence totale aux familles. Les parents suivent les retards et bulletins en direct, ce qui a grandement renforcé la confiance envers notre école.',
          author: 'Dr. Maryem Benjelloun',
          role: 'Directrice Pédagogique',
          school: 'Institution Al Amana',
          city: 'Rabat - Souissi',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          metrics: 'Taux de satisfaction parents de 99%',
        },
        {
          quote:
            'Le support client d’Eduvora est exemplaire. La formation sur place et leur réactivité au quotidien ont permis à tous nos enseignants d’adopter l’outil en moins d’une semaine.',
          author: 'Haj Rachid Tazi',
          role: 'Directeur Financier & Opérations',
          school: 'Écoles Bilingues du Futur',
          city: 'Marrakech - Guéliz',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          metrics: '95% des frais scolaires payés en ligne',
        },
      ],
    },
    faq: {
      badge: 'Foire Aux Questions',
      title: 'Toutes les réponses à vos questions sur Eduvora',
      subtitle: 'Obtenez des clarifications claires sur l’aspect technique, juridique et tarifaire.',
      items: [
        {
          question: 'Eduvora est-il 100% compatible avec le système MASSAR au Maroc ?',
          answer:
            'Absolument. Eduvora dispose d’un module de synchronisation certifié permettant d’importer et exporter les absences, les notes de contrôle continu et les dossiers élèves vers MASSAR en un clic.',
        },
        {
          question: 'Comment Eduvora protège-t-il les données personnelles des élèves ?',
          answer:
            'Nous respectons strictement la loi marocaine 09-08 de la CNDP. Vos données sont cryptées en AES-256 et hébergées dans des centres de données sécurisés avec sauvegardes journalières.',
        },
        {
          question: 'Combien de temps prend l’installation et la formation du personnel ?',
          answer:
            'La mise en service complète prend entre 48 heures et 5 jours ouvrés. Notre équipe assure gratuitement la formation initiale sur place et l’accompagnement continu.',
        },
        {
          question: 'Les parents peuvent-ils payer les frais d’écolage sur l’application mobile ?',
          answer:
            'Oui! L’application Eduvora Parent intègre le paiement en ligne sécurisé CMI par carte marocaine ou préélèvement automatique, avec génération immédiate du reçu officiel numéroté.',
        },
        {
          question: 'La plateforme est-elle disponible en Arabe et en Français ?',
          answer:
            'Oui, Eduvora est entièrement bilingue (Arabe et Français). Chaque utilisateur (administrateur, enseignant, parent) peut basculer la langue et le sens d’affichage (RTL / LTR) en un clic.',
        },
        {
          question: 'Quel est le modèle tarifaire d’Eduvora ?',
          answer:
            'Le tarif est calculé de manière équitable en fonction du nombre d’élèves inscrits dans votre établissement. Pas de frais cachés, pas de surcoût d’installation ni de frais de maintenance.',
        },
      ],
    },
    cta: {
      title: 'Prêt à faire passer votre école à la vitesse supérieure ?',
      subtitle:
        'Rejoignez plus de 150 écoles privées d’excellence au Maroc qui font confiance à Eduvora chaque jour.',
      button: 'Demander ma démonstration gratuite',
      callUs: 'Parlez immédiatement à un expert: +212 522-123-456',
      guarantee: 'Sans aucun engagement - Essai gratuit 14 jours avec accompagnement inclus',
    },
    footer: {
      tagline: 'La plateforme Cloud SaaS globale pour la gestion moderne des écoles privées au Maroc.',
      address: 'Casablanca Finance City Tower / Technopark Rabat',
      phone: '+212 522 12 34 56',
      email: 'contact@eduvora.ma',
      cndpNotice: 'Plateforme déclarée conforme aux exigences CNDP (Loi 09-08)',
      rights: 'Tous droits réservés © 2026 Eduvora. Fait avec passion au Maroc 🇲🇦',
      quickLinks: 'Navigation',
      products: 'Nos Produits',
      legal: 'Mentions Légales',
      privacyPolicy: 'Politique de Confidentialité',
      termsOfService: 'Conditions d’Utilisation',
      security: 'Sécurité & CNDP',
    },
    demoModal: {
      title: 'Demandez votre démonstration gratuite',
      subtitle: 'Un conseiller Eduvora vous recontactera sous 24h pour une présentation personnalisée.',
      schoolName: 'Nom de l’établissement privé',
      schoolNamePlaceholder: 'Ex: Groupe Scolaire Les Élites',
      contactName: 'Nom complet du responsable / fondateur',
      contactNamePlaceholder: 'Ex: M. Mohammed El Alami',
      city: 'Ville',
      citySelectPlaceholder: 'Sélectionnez la ville',
      email: 'Email professionnel',
      emailPlaceholder: 'direction@ecole.ma',
      phone: 'Téléphone / WhatsApp',
      phonePlaceholder: '06 61 XX XX XX',
      studentCount: 'Nombre d’élèves de l’établissement',
      studentCountSelectPlaceholder: 'Tranche d’effectif',
      notes: 'Besoins particuliers ou questions (Optionnel)',
      notesPlaceholder: 'Ex: Focus sur la synchronisation MASSAR et le paiement CMI...',
      submitButton: 'Valider ma demande de démo',
      submitting: 'Envoi en cours...',
      successTitle: 'Demande reçue avec succès ! 🎉',
      successSubtitle: 'Merci pour votre intérêt pour Eduvora.',
      successMessage:
        'Notre équipe vous contactera au numéro indiqué pour planifier votre séance de présentation personnalisée.',
      closeButton: 'Fermer',
    },
  },
};
