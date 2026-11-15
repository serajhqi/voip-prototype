import { Customer, Staff, CallRecord, AdminRubric, AdminTagRule, FollowUpTask } from './types.js';

export const initialCustomers: Customer[] = [
  {
    id: 'cust-101',
    phone: '۰۲۱-۸۸۲۲۳۳۴۴',
    name: 'سارا رادمنش',
    company: 'هلدینگ لجستیک آپادانا',
    email: 's.radmanesh@apadana-logistics.ir',
    needs: ['ترانک سازمانی ۲۵۰ کاناله (Enterprise SIP)', 'تضمین پایداری ۹۹.۹۹۹٪ (SLA)', 'سامانه جایگزینی چندمرکزی (Multi-site failover)'],
    purchaseWillingness: 92,
    effortTier: 'T1',
    tags: ['مشتری-سازمانی', 'قصد-خرید-بالا', 'بودجه-تاییدشده'],
    totalCalls: 3,
    lastCallDate: '2026-11-15T09:17:45Z',
    notes: 'مدیر ارشد فناوری (CTO) در حال بررسی جایگزینی سانترال قدیمی پیش از پایان قرارداد سالانه.',
    evaluation: {
      customerId: 'cust-101',
      evaluatedAt: '2026-11-15T09:18:00Z',
      lastCallId: 'call-001',
      overallHealthScore: 94,
      purchasePropensityScore: 92,
      churnRiskScore: 8,
      urgencyLevel: 'High',
      budgetReadiness: 'Budget Approved',
      satisfactionRating: 5,
      needsAssessment: {
        coreNeeds: [
          'ترانک سازمانی اختصاصی ۲۵۰ کاناله SIP با پایداری ۹۹.۹۹۹٪',
          'سامانه جایگزینی خودکار بین دو دیتاسنter اصلی و فرعی بدون قطعی',
          'مهاجرت و انتقال مستقیم شماره‌های قدیمی سانترال آنالوگ'
        ],
        technicalBlockers: [
          'نیاز به بازه زمانی کم‌ترافیک برای تست جابجایی ترافیک شبانه',
          'هماهنگی پورت‌های فایروال با دیتاسنتر اختصاصی آپادانا'
        ],
        unmetExpectations: []
      },
      metrics: [
        {
          id: 'cm-01',
          name: 'تناسب با راهکار سازمانی (Product Fit)',
          score: 96,
          weight: 25,
          level: 'High',
          analysis: 'نیازهای زیرساختی لجستیک آپادانا کاملاً منطبق بر معماری ترانک Enterprise ویپ ما است.'
        },
        {
          id: 'cm-02',
          name: 'قطعیت تصمیم و بودجه (Budget & Authority)',
          score: 94,
          weight: 25,
          level: 'High',
          analysis: 'خانم رادمنش اختیار کامل تخصیص بودجه سالانه را دارد و بودجه جایگزینی به تصویب هیئت‌مدیره رسیده است.'
        },
        {
          id: 'cm-03',
          name: 'فوریت و جدول زمانی (Decision Timeline)',
          score: 90,
          weight: 25,
          level: 'High',
          analysis: 'قرارداد سانترال قبلی ماه آینده به پایان می‌رسد و تمایل به عقد قرارداد ظرف دو هفته آینده دارند.'
        },
        {
          id: 'cm-04',
          name: 'ضریب وفاداری و تعامل (Engagement Depth)',
          score: 92,
          weight: 25,
          level: 'High',
          analysis: 'تعامل در بالاترین سطح سازمانی با حضور مدیران ارشد فناوری و حضور در جلسات دموی تخصصی.'
        }
      ],
      behavioralSignals: {
        sentimentTrend: 'Improving',
        engagementFrequency: 'Frequent',
        decisionTimeline: 'ظرف ۲ هفته آینده (جلسه نهایی دوشنبه ۱۰ صبح)'
      },
      recommendedNextActions: [
        'ارسال پیش‌نویس طرح ترانک سازمانی همراه با جدول کتبی SLA ۹۹.۹۹۹٪',
        'برگزاری جلسه هماهنگی آنلاین با حضور مدیر شبکه آپادانا فردا ساعت ۱۰:۰۰',
        'ارائه پلن مرحله‌به‌مرحله انتقال خطوط بدون حتی یک ثانیه قطعی مکالمات رانندگان'
      ],
      aiExecutiveSummary: 'مشتری طلایی Enterprise با بالاترین ارزش طول عمر (LTV). بودجه مصوب، انگیزه بالا به دلیل نارضایتی شدید از اپراتور قبلی و تعامل مستقیم در سطح CTO. احتمال عقد قرارداد بالای ۹۰٪ برآورد می‌شود.'
    }
  },
  {
    id: 'cust-102',
    phone: '۰۲۱-۴۴۵۵۶۶۷۷',
    name: 'داوود خلیلی',
    company: 'توسعه خرده‌فروشی نوین',
    email: 'd.khalili@novinretail.com',
    needs: ['تحلیل هوشمند مکالمات مرکز تماس', 'پیاده‌سازی گفتار Speechmatics', 'تعرفه اقتصادی'],
    purchaseWillingness: 52,
    effortTier: 'T2',
    tags: ['حساس-به-قیمت', 'نیازمند-پایلوت', 'مقایسه-محصول'],
    totalCalls: 2,
    lastCallDate: '2026-11-14T14:11:30Z',
    notes: 'علاقه‌مند به نمره‌دهی هوش مصنوعی مکالمات اما در حال مقایسه هزینه‌ها با توسعه مستقیم API.',
    evaluation: {
      customerId: 'cust-102',
      evaluatedAt: '2026-11-14T14:12:00Z',
      lastCallId: 'call-002',
      overallHealthScore: 68,
      purchasePropensityScore: 52,
      churnRiskScore: 35,
      urgencyLevel: 'Medium',
      budgetReadiness: 'Evaluating Alternatives',
      satisfactionRating: 3,
      needsAssessment: {
        coreNeeds: [
          'تفکیک هوشمند گفتار گویندگان (Speaker Diarization) با زبان فارسی',
          'داشبورد نمره‌دهی شاخص‌های مکالمه بدون نیاز به نیروی ناظر انسانی',
          'پلن اشتراک بر اساس دقیقه مکالمه یا تعرفه مصرفی اقتصادی'
        ],
        technicalBlockers: [
          'عدم اشراف کامل تیم مالی به هزینه‌های سنگین پنهان توسعه داخلی API',
          'شک و تردید درباره سرعت و دقت مدل فارسی در لهجه‌های گوناگون'
        ],
        unmetExpectations: [
          'توقع اشتراک ارزان‌تر در مقایسه با ابزارهای عمومی'
        ]
      },
      metrics: [
        {
          id: 'cm-01',
          name: 'تناسب با راهکار سازمانی (Product Fit)',
          score: 82,
          weight: 25,
          level: 'High',
          analysis: 'قابلیت‌های سامانه کاملاً نیاز فروشگاه زنجیره‌ای نوین را پوشش می‌دهد.'
        },
        {
          id: 'cm-02',
          name: 'قطعیت تصمیم و بودجه (Budget & Authority)',
          score: 45,
          weight: 25,
          level: 'Medium',
          analysis: 'بودجه جاری محدود است؛ آقای خلیلی نیازمند استدلال اقتصادی جهت تصویب بودجه در هیئت‌مدیره است.'
        },
        {
          id: 'cm-03',
          name: 'فوریت و جدول زمانی (Decision Timeline)',
          score: 50,
          weight: 25,
          level: 'Medium',
          analysis: 'بازه تصمیم‌گیری ۴ تا ۶ هفته تعیین شده و هنوز تصمیم نهایی اتخاذ نشده است.'
        },
        {
          id: 'cm-04',
          name: 'ضریب وفاداری و تعامل (Engagement Depth)',
          score: 65,
          weight: 25,
          level: 'Medium',
          analysis: 'تعامل مناسب با شرکت در وبینار و درخواست مستندات مقایسه‌ای.'
        }
      ],
      behavioralSignals: {
        sentimentTrend: 'Stable',
        engagementFrequency: 'Regular',
        competitorMentioned: 'توسعه مستقیم روی API عمومی',
        decisionTimeline: 'پایان ماه جاری پس از بررسی فایل مقایسه TCO'
      },
      recommendedNextActions: [
        'ارسال گزارش تحلیلی تک‌صفحه‌ای مقایسه هزینه کل مالکیت (TCO) در برابر توسعه اختصاصی',
        'پیشنهاد دوره پایلوت آزمایشی ۲ هفته‌ای رایگان روی ۵۰۰ دقیقه مکالمه واقعی فروشگاه',
        'تماس پیگیری چهارشنبه ساعت ۱۴:۰۰ توسط مریم پرتو'
      ],
      aiExecutiveSummary: 'مشتری مستعد با نیاز شفاف به تحلیل مکالمات اما دارای تردید اقتصادی شدید. اگر هزینه توسعه ۶ ماهه داخلی برای هیئت‌مدیره شفاف‌سازی شود و پایلوت عملیاتی ارائه گردد، نرخ تبدیل به بیش از ۷۵٪ خواهد رسید.'
    }
  },
  {
    id: 'cust-103',
    phone: '۰۲۱-۲۲۱۱۰۰۹۹',
    name: 'الناز رستگار',
    company: 'پرداخت الکترونیک پاسارگاد',
    email: 'elena.rastegar@pasargad-pay.ir',
    needs: ['رفع افت بسته شبکه (Packet Loss)', 'بررسی تاخیر ترانک در تراکنش‌های اوج'],
    purchaseWillingness: 70,
    effortTier: 'T1',
    tags: ['خطر-ریزش-مشتری', 'ارجاع-فنی-فوری', 'مشتری-ویژه-VIP'],
    totalCalls: 5,
    lastCallDate: '2026-11-15T09:10:15Z',
    notes: 'گزارش قطعی و افت کیفیت در ساعات اوج تراکنش‌های بانکی؛ در انتظار پاسخ تیم مهندسی زیرساخت.',
    evaluation: {
      customerId: 'cust-103',
      evaluatedAt: '2026-11-15T09:12:00Z',
      lastCallId: 'call-003',
      overallHealthScore: 54,
      purchasePropensityScore: 70,
      churnRiskScore: 82,
      urgencyLevel: 'Critical',
      budgetReadiness: 'Budget Approved',
      satisfactionRating: 2,
      needsAssessment: {
        coreNeeds: [
          'صفر شدن جیتر و پکت لاس در ساعات اوج تراکنش‌های بانکی (۸:۳۰ تا ۱۱ صبح)',
          'پاسخگویی تیکت پشتیبانی زیر ۱۵ دقیقه توسط کارشناس ارشد زیرساخت',
          'گزارش مانیتورینگ بلادرنگ پینگ و وضعیت خطوط SIP پاسارگاد'
        ],
        technicalBlockers: [
          'اختلال نوسان گیت‌وی مرکز دو در سوئیچینگ بالادستی مخابرات',
          'احتمال نیاز به مسیردهی مجدد ترانک اختصاصی روی فیبر امن بانکی'
        ],
        unmetExpectations: [
          'تاخیر در کشف قطعی صبح امروز پیش از تماس مشتری'
        ]
      },
      metrics: [
        {
          id: 'cm-01',
          name: 'تناسب با راهکار سازمانی (Product Fit)',
          score: 90,
          weight: 25,
          level: 'High',
          analysis: 'بزرگ‌ترین حساب فین‌تک سازمانی با نیازمندی‌های بسیار حیاتی تراکنشی.'
        },
        {
          id: 'cm-02',
          name: 'قطعیت تصمیم و بودجه (Budget & Authority)',
          score: 88,
          weight: 25,
          level: 'High',
          analysis: 'بودجه بسیار بالا و قرارداد چندصد میلیونی؛ اما حساسیت شدید به عدم قطعی تراکنش‌ها.'
        },
        {
          id: 'cm-03',
          name: 'فوریت و وضعیت بحرانی (Critical Urgency)',
          score: 98,
          weight: 25,
          level: 'Critical',
          analysis: 'در صورت عدم حل قطعی ظرف ساعات آینده، تهدید صریح به لغو قرارداد و ارجاع حقوقی ثبت شده است.'
        },
        {
          id: 'cm-04',
          name: 'رضایت جاری و سلامت رابطه (Account Health)',
          score: 40,
          weight: 25,
          level: 'Critical',
          analysis: 'رضایت به شدت نزولی به دلیل اختلالات متناوب در ساعات حساس بانکی.'
        }
      ],
      behavioralSignals: {
        sentimentTrend: 'Declining',
        engagementFrequency: 'Frequent',
        decisionTimeline: 'فوری (تا ساعت ۱۲:۰۰ امروز)'
      },
      recommendedNextActions: [
        'تشکیل اتاق وضعیت بحران با سرپرست فنی زیرساخت و ایزوله‌سازی ترافیک روی ترانک اختصاصی',
        'تماس جواد صادقی با خانم رستگار راس ساعت ۱۲:۰۰ با لاگ دقیق حل نوسان پکت',
        'اعطای تخفیف SLA و جلسه حضوری مدیر ارشد موفقیت مشتری در دفتر پاسارگاد'
      ],
      aiExecutiveSummary: 'مشتری استراتژیک VIP با خطر بحرانی ریزش (Churn Risk: 82%). ارزش قراردادی فوق‌العاده بالاست و حفظ حساب نیازمند ورود مستقیم مدیر فنی و تضمین پایداری خطوط تراکنشی است.'
    }
  },
  {
    id: 'cust-104',
    phone: '۰۲۱-۷۷۸۸۹۹۰۰',
    name: 'مهران بهرامی',
    company: 'شبکه مراکز درمانی سبحان',
    email: 'm.bahrami@sobhan-health.org',
    needs: ['سیستم تلفن گویای نوبت‌دهی امن', 'یادآوری خودکار پیامکی و تلفنی نوبت‌ها'],
    purchaseWillingness: 90,
    effortTier: 'T1',
    tags: ['آماده-عقد-قرارداد', 'حوزه-سلامت-امنیت'],
    totalCalls: 4,
    lastCallDate: '2026-11-10T14:20:00Z',
    notes: 'در مرحله بررسی نهایی پیش‌نویس قرارداد توسط واحد حقوقی.',
    evaluation: {
      customerId: 'cust-104',
      evaluatedAt: '2026-11-10T14:25:00Z',
      overallHealthScore: 92,
      purchasePropensityScore: 90,
      churnRiskScore: 10,
      urgencyLevel: 'High',
      budgetReadiness: 'Budget Approved',
      satisfactionRating: 5,
      needsAssessment: {
        coreNeeds: [
          'تلفن گویای تعاملی هوشمند با اتصال به دیتابیس HIS بیمارستانی',
          'تماس‌های خودکار یادآوری نوبت با بازخورد کلید تلفن بیمار',
          'رمزنگاری کامل مکالمات و رعایت الزامات وزارت بهداشت'
        ],
        technicalBlockers: [],
        unmetExpectations: []
      },
      metrics: [
        { id: 'cm-01', name: 'تناسب با راهکار سازمانی', score: 95, weight: 25, level: 'High', analysis: 'ماژول تلفن گویای سلامت کاملاً با نرم‌افزار نوبت‌دهی سبحان سازگار است.' },
        { id: 'cm-02', name: 'قطعیت تصمیم و بودجه', score: 92, weight: 25, level: 'High', analysis: 'تاییدیه معاونت درمان اخذ شده و قرارداد در واحد حقوقی است.' },
        { id: 'cm-03', name: 'فوریت و جدول زمانی', score: 85, weight: 25, level: 'High', analysis: 'راه‌اندازی برای ابتدای ماه آینده برنامه‌ریزی شده است.' },
        { id: 'cm-04', name: 'ضریب تعامل و ارتباط', score: 90, weight: 25, level: 'High', analysis: 'روابط عالی و بدون ابهام فنی.' }
      ],
      behavioralSignals: {
        sentimentTrend: 'Improving',
        engagementFrequency: 'Regular',
        decisionTimeline: 'ظرف چند روز پس از تایید حقوقی'
      },
      recommendedNextActions: [
        'پیگیری دریافت نسخه امضا شده قرارداد از واحد حقوقی',
        'رزرو منابع سروری و تخصیص تیم فنی برای استقرار سامانه تلفن گویا'
      ],
      aiExecutiveSummary: 'حساب قطعی آماده تبدیل با شاخص سلامت ۹۲٪. تعامل بسیار مثبت و بدون ابهام فنی.'
    }
  },
  {
    id: 'cust-105',
    phone: '۰۲۱-۸۸۹۹۱۱۲۲',
    name: 'مهندس کامران شریفی',
    company: 'فولاد و صنایع معدنی دماوند',
    email: 'k.sharifi@damavand-steel.com',
    needs: ['یکپارچه‌سازی با Microsoft Dynamics 365', 'سیستم ضبط مکالمات خطوط کارگاهی', 'ترانک E1 با پشتیبان فیبر نوری'],
    purchaseWillingness: 86,
    effortTier: 'T1',
    tags: ['مشتری-سازمانی', 'قصد-خرید-بالا', 'پروژه-صنعتی'],
    totalCalls: 3,
    lastCallDate: '2026-11-15T11:45:00Z',
    notes: 'نیاز به اتصال مستقیم شماره‌های واحد بازرگانی با سیستم مدیریت ارتباط با مشتری و تفکیک داخلی کارخانجات اصفهان و یزد.',
    evaluation: {
      customerId: 'cust-105',
      evaluatedAt: '2026-11-15T11:48:00Z',
      lastCallId: 'call-004',
      overallHealthScore: 89,
      purchasePropensityScore: 86,
      churnRiskScore: 12,
      urgencyLevel: 'High',
      budgetReadiness: 'Budget Approved',
      satisfactionRating: 4,
      needsAssessment: {
        coreNeeds: [
          'وب‌هوک بلادرنگ پاپ‌آپ تماس ورودی در مایکروسافت داینامیکس ۳۶۵',
          'ذخیره خودکار فایل ضبط صوت روی استوریج امن کارخانه',
          'تفکیک پیش‌شماره‌های کارخانه یزد، اصفهان و دفتر مرکزی تهران'
        ],
        technicalBlockers: [
          'ارائه مستندات امنیتی جهت احراز هویت سرویس‌های On-Premise'
        ],
        unmetExpectations: []
      },
      metrics: [
        { id: 'cm-01', name: 'تناسب با راهکار سازمانی', score: 92, weight: 25, level: 'High', analysis: 'ماژول آماده ادغام با CRM داینامیکس ۳۶۵ بدون نیاز به افزونه جانبی.' },
        { id: 'cm-02', name: 'قطعیت تصمیم و بودجه', score: 88, weight: 25, level: 'High', analysis: 'بودجه نوسازی انفورماتیک فولاد دماوند تامین شده است.' },
        { id: 'cm-03', name: 'فوریت و جدول زمانی', score: 84, weight: 25, level: 'High', analysis: 'راه‌اندازی فاز اول در دفتر مرکزی تهران تا پایان ماه جاری.' },
        { id: 'cm-04', name: 'ضریب تعامل و ارتباط', score: 86, weight: 25, level: 'High', analysis: 'مهندس شریفی تعامل مستمر و بسیار حرفه‌ای دارد.' }
      ],
      behavioralSignals: {
        sentimentTrend: 'Improving',
        engagementFrequency: 'Regular',
        decisionTimeline: 'جلسه فنی حضوری در هفته جاری'
      },
      recommendedNextActions: [
        'ارسال مستندات وب‌هوک و نمونه کدهای ادغام با داینامیکس تا ساعت ۱۵:۰۰',
        'تنظیم جلسه تست آزمایشی با تیم نرم‌افزار فولاد دماوند'
      ],
      aiExecutiveSummary: 'فرصت ارزشمند در صنایع مادر با پتانسیل بالای بیش‌فروشی ماژول‌های مانیتورینگ خطوط کارخانجات.'
    }
  },
  {
    id: 'cust-106',
    phone: '۰۲۱-۹۱۰۰۲۴۲۴',
    name: 'نگار اسدی',
    company: 'پلتفرم رزرواسیون پرواز ۲۴',
    email: 'n.asadi@parvaz24.travel',
    needs: ['صف انتظار ابری با ظرفیت ۱۰۰ تماس همزمان', 'انتقال هوشمند تماس کنسلی پرواز', 'نظرسنجی صوتی پس از مکالمه'],
    purchaseWillingness: 78,
    effortTier: 'T1',
    tags: ['گردشگری-پیک-سفر', 'مرکز-تماس-ابری', 'نیازمند-مقیاس‌پذیری'],
    totalCalls: 4,
    lastCallDate: '2026-11-14T17:20:00Z',
    notes: 'در آستانه پیک سفرهای نوروز نیازمند افزایش فوری خطوط ترانک و جلوگیری از بوق اشغال پشت خط.',
    evaluation: {
      customerId: 'cust-106',
      evaluatedAt: '2026-11-14T17:25:00Z',
      lastCallId: 'call-005',
      overallHealthScore: 84,
      purchasePropensityScore: 78,
      churnRiskScore: 18,
      urgencyLevel: 'High',
      budgetReadiness: 'Budget Approved',
      satisfactionRating: 4,
      needsAssessment: {
        coreNeeds: [
          'ترانک مقیاس‌پذیر ابری با ظرفیت ۱۰۰ تماس همزمان',
          'پیام خودکار استعلام لغو پرواز برای خلوت‌سازی صف پاسخگویی',
          'سامانه نظرسنجی صوتی پس از مکالمه برای سنجش رضایت مسافران'
        ],
        technicalBlockers: [
          'تست بارگذاری سنگین قبل از ایام تعطیلات'
        ],
        unmetExpectations: []
      },
      metrics: [
        { id: 'cm-01', name: 'تناسب با راهکار سازمانی', score: 90, weight: 25, level: 'High', analysis: 'زیرساخت ابری ویپ پاسخگوی جهش‌های فصلی ترافیک مسافران است.' },
        { id: 'cm-02', name: 'قطعیت تصمیم و بودجه', score: 80, weight: 25, level: 'High', analysis: 'بودجه فصلی پشتیبانی تصویب شده است.' },
        { id: 'cm-03', name: 'فوریت و جدول زمانی', score: 88, weight: 25, level: 'High', analysis: 'الزام به تست عملیاتی در روز چهارشنبه ساعت ۱۰ صبح.' },
        { id: 'cm-04', name: 'ضریب تعامل و ارتباط', score: 82, weight: 25, level: 'High', analysis: 'تماس مستقیم مدیر عملیات پرواز ۲۴.' }
      ],
      behavioralSignals: {
        sentimentTrend: 'Improving',
        engagementFrequency: 'Regular',
        decisionTimeline: 'تست ترافیک چهارشنبه ۱۰ صبح'
      },
      recommendedNextActions: [
        'پیکربندی سناریوی صف انتظار ابری ۱۰۰ خطه',
        'اجرای آزمون شبیه‌سازی بار ترافیکی با تیم عملیات در روز چهارشنبه'
      ],
      aiExecutiveSummary: 'مشتری مقیاس‌پذیر با گردش ترافیک بالا در پیک‌های سفر؛ تمایل بالا برای فعال‌سازی طرح ارتقای ابری.'
    }
  },
  {
    id: 'cust-107',
    phone: '۰۲۱-۸۸۴۴۱۱۰۲',
    name: 'هومن افشار',
    company: 'سامانه بیمه درمان باران',
    email: 'h.afshar@baran-ins.ir',
    needs: ['پایش خودکار لحن و رضایت تماس‌گیرندگان خسارت', 'ترانک بک‌آپ دیتاسنتر غرب', 'گزارش‌گیری روزانه زمان معطلی'],
    purchaseWillingness: 68,
    effortTier: 'T2',
    tags: ['بیمه-خدمات-درمان', 'نظارت-بر-کیفیت'],
    totalCalls: 3,
    lastCallDate: '2026-11-13T10:30:00Z',
    notes: 'در حال ارزیابی آزمایشی داشبورد تحلیل گفتار برای شعب صدور و خسارت خودرو و درمان.',
    evaluation: {
      customerId: 'cust-107',
      evaluatedAt: '2026-11-13T10:35:00Z',
      lastCallId: 'call-006',
      overallHealthScore: 82,
      purchasePropensityScore: 68,
      churnRiskScore: 15,
      urgencyLevel: 'Medium',
      budgetReadiness: 'Under Review',
      satisfactionRating: 4,
      needsAssessment: {
        coreNeeds: [
          'سوئیچینگ خودکار ترافیک در پروتکل BGP به دیتاسنتر پشتیبان',
          'تحلیل لحن و پایش شکایت تماس‌گیرندگان بخش درمان و خسارت'
        ],
        technicalBlockers: [],
        unmetExpectations: []
      },
      metrics: [
        { id: 'cm-01', name: 'تناسب با راهکار سازمانی', score: 86, weight: 25, level: 'High', analysis: 'حل موفقیت‌آمیز نیاز ترانک رزرو و ارتقای حس اعتماد.' },
        { id: 'cm-02', name: 'قطعیت تصمیم و بودجه', score: 65, weight: 25, level: 'Medium', analysis: 'در مرحله ارزیابی آزمایشی داشبورد تحلیل گفتار.' },
        { id: 'cm-03', name: 'فوریت و جدول زمانی', score: 62, weight: 25, level: 'Medium', analysis: 'بررسی نتایج در جلسه ماهانه کمیته فناوری بیمه باران.' },
        { id: 'cm-04', name: 'ضریب تعامل و ارتباط', score: 78, weight: 25, level: 'Medium', analysis: 'روابط مثبت و رضایت از پشتیبانی فنی جواد صادقی.' }
      ],
      behavioralSignals: {
        sentimentTrend: 'Stable',
        engagementFrequency: 'Regular',
        decisionTimeline: 'جلسه کمیته ارزیابی انتهای ماه'
      },
      recommendedNextActions: [
        'ارائه گزارش آماری دقت تحلیل لحن روی تماس‌های تستی بخش خسارت',
        'پیگیری تصمیم‌گیری درباره اشتراک سالانه هوش مصنوعی'
      ],
      aiExecutiveSummary: 'مشتری وفادار با رضایت بالا از پشتیبانی شبکه؛ پتانسیل بیش‌فروشی ابزار هوش مصنوعی تحلیل مکالمات.'
    }
  },
  {
    id: 'cust-108',
    phone: '۰۲۱-۲۲۹۹۳۳۰۱',
    name: 'دکتر بیتا کاوه',
    company: 'داروسازی زیست‌دارو البرز',
    email: 'b.kaveh@alborz-bio.com',
    needs: ['خط مشاوره دارویی تخصصی با ضبط امن', 'احراز هویت پیامکی پزشکان و داروخانه‌ها', 'رمزنگاری تماس‌های مشاوره'],
    purchaseWillingness: 82,
    effortTier: 'T1',
    tags: ['دارویی-حفظ-حریم', 'کیفیت-صدای-شفاف'],
    totalCalls: 2,
    lastCallDate: '2026-11-12T13:15:00Z',
    notes: 'خط ویژه مشاوره عوارض دارویی برای بیماران خاص؛ حساسیت بالا به وضوح صدا و قطع نشدن تماس.',
    evaluation: {
      customerId: 'cust-108',
      evaluatedAt: '2026-11-12T13:20:00Z',
      overallHealthScore: 88,
      purchasePropensityScore: 82,
      churnRiskScore: 10,
      urgencyLevel: 'High',
      budgetReadiness: 'Budget Approved',
      satisfactionRating: 5,
      needsAssessment: {
        coreNeeds: [
          'کدک‌های صوتی با وضوح بالا (HD Voice Opus) جهت مکالمات پزشکی',
          'سامانه احراز هویت پیامکی پیش از اتصال به پزشک مشاور',
          'رمزنگاری سرتاسری و ذخیره در آرشیو با گواهی محرمانگی'
        ],
        technicalBlockers: [],
        unmetExpectations: []
      },
      metrics: [
        { id: 'cm-01', name: 'تناسب با راهکار سازمانی', score: 92, weight: 25, level: 'High', analysis: 'پروتکل‌های رمزنگاری ما استانداردهای صنعت داروسازی را برآورده می‌کند.' },
        { id: 'cm-02', name: 'قطعیت تصمیم و بودجه', score: 85, weight: 25, level: 'High', analysis: 'ردیف بودجه تحقیقات و روابط عمومی زیست‌دارو تخصیص یافته است.' },
        { id: 'cm-03', name: 'فوریت و جدول زمانی', score: 80, weight: 25, level: 'High', analysis: 'آغاز کمپین آگاهی‌بخشی دارویی از هفته آینده.' },
        { id: 'cm-04', name: 'ضریب تعامل و ارتباط', score: 84, weight: 25, level: 'High', analysis: 'نگرش بسیار مثبت به کیفیت و امنیت سامانه.' }
      ],
      behavioralSignals: {
        sentimentTrend: 'Improving',
        engagementFrequency: 'Regular',
        decisionTimeline: 'عقد قرارداد ظرف ۷ روز آینده'
      },
      recommendedNextActions: [
        'ارسال تاییدیه پروتکل رمزنگاری امن TLS/SRTP برای تیم حراست و IT',
        'فعال‌سازی خط آزمایشی HD Voice برای تست پزشکان مشاور'
      ],
      aiExecutiveSummary: 'فرصت ویژه در حوزه بهداشت و سلامت؛ نرخ پذیرش بالا به واسطه ویژگی‌های امنیتی و کیفیت ممتاز صدا.'
    }
  },
  {
    id: 'cust-109',
    phone: '۰۲۱-۶۶۲۲۵۵۸۸',
    name: 'مسعود رفیعی',
    company: 'فروشگاه اینترنتی کالا مارکت',
    email: 'm.rafiei@kala-market.ir',
    needs: ['پشتیبانی ۲۴ ساعته شیفت شب', 'پاسخگویی خودکار استعلام وضعیت سفارش', 'تحلیل علت تماس‌های مرجوعی کالا'],
    purchaseWillingness: 60,
    effortTier: 'T2',
    tags: ['تجارت-الکترونیک', 'پشتیبانی-۲۴-ساعته'],
    totalCalls: 5,
    lastCallDate: '2026-11-15T02:40:00Z',
    notes: 'حجم بالای تماس‌های پیگیری تحویل سفارشات شب یلدا و نیاز به کاهش زمان انتظار مشتریان.',
    evaluation: {
      customerId: 'cust-109',
      evaluatedAt: '2026-11-15T02:45:00Z',
      lastCallId: 'call-007',
      overallHealthScore: 72,
      purchasePropensityScore: 60,
      churnRiskScore: 28,
      urgencyLevel: 'Medium',
      budgetReadiness: 'Price Sensitive',
      satisfactionRating: 3,
      needsAssessment: {
        coreNeeds: [
          'بهینه‌سازی صف انتظار و پاسخگویی تلفنی ساعات ۲۲ الی ۴ بامداد',
          'استعلام خودکار پیامکی و تلفنی شماره سفارش کالا بدون معطلی اپراتور',
          'دسته‌بندی خودکار دلایل نارضایتی از تاخیر تحویل کالا'
        ],
        technicalBlockers: [
          'کمبود اپراتورهای مقیم در ساعات نیمه‌شب'
        ],
        unmetExpectations: [
          'زمان معطلی بیش از ۳ دقیقه در صف شبانه'
        ]
      },
      metrics: [
        { id: 'cm-01', name: 'تناسب با راهکار سازمانی', score: 85, weight: 25, level: 'High', analysis: 'ماژول پاسخگوی خودکار صوتی IVR دقیقاً راه‌حل زمان انتظار شبانه است.' },
        { id: 'cm-02', name: 'قطعیت تصمیم و بودجه', score: 55, weight: 25, level: 'Medium', analysis: 'مشتری به دنبال ماژول‌های رایگان یا کم‌هزینه برای کاهش پرسنل شیفت شب است.' },
        { id: 'cm-03', name: 'فوریت و جدول زمانی', score: 68, weight: 25, level: 'Medium', analysis: 'نیاز به راهکار فوری برای پوشش جشنواره فروش شب یلدا.' },
        { id: 'cm-04', name: 'ضریب تعامل و ارتباط', score: 70, weight: 25, level: 'Medium', analysis: 'تعامل در شیفت‌های شبانه با تیم پشتیبانی.' }
      ],
      behavioralSignals: {
        sentimentTrend: 'Stable',
        engagementFrequency: 'Frequent',
        decisionTimeline: 'پایان هفته جاری'
      },
      recommendedNextActions: [
        'ارسال راهنمای راه‌اندازی ربات صوتی استعلام سفارش کالا مارکت',
        'ارائه تخفیف پلن خدمات ۲۴ ساعته برای کاهش زمان صف به زیر ۴۰ ثانیه'
      ],
      aiExecutiveSummary: 'کسب‌وکار ایکامرس با چالش شیفت شب؛ با راه‌اندازی ماژول سلف سرویس صوتی، رضایت و نرخ وفاداری سریعاً افزایش می‌یابد.'
    }
  },
  {
    id: 'cust-110',
    phone: '۰۲۱-۸۸۳۳۷۷۹۹',
    name: 'شیما میرزایی',
    company: 'موسسه آموزش عالی آینده‌پژوهان',
    email: 'sh.mirzaei@ayandeh-edu.ir',
    needs: ['کمپین خروجی خودکار معرفی دوره‌های MBA', 'تحلیل نرخ تبدیل تماس به ثبت‌نام', 'توزیع تماس بین کارشناسان ثبت‌نام'],
    purchaseWillingness: 75,
    effortTier: 'T2',
    tags: ['آموزش-عالی', 'کمپین-فروش-تلفنی'],
    totalCalls: 3,
    lastCallDate: '2026-11-15T10:10:00Z',
    notes: 'در حال برگزاری کمپین ثبت‌نام ترم زمستان و نیاز به رصد درصد پاسخگویی تماس‌های مشاوره.',
    evaluation: {
      customerId: 'cust-110',
      evaluatedAt: '2026-11-15T10:15:00Z',
      lastCallId: 'call-008',
      overallHealthScore: 85,
      purchasePropensityScore: 75,
      churnRiskScore: 14,
      urgencyLevel: 'Medium',
      budgetReadiness: 'Budget Approved',
      satisfactionRating: 4,
      needsAssessment: {
        coreNeeds: [
          'گزارش خروجی اکسل نرخ تماس موفق و تبدیل به مشاوره حضوری',
          'توزیع هوشمند تماس‌های برگشتی به کارشناس مشاوره اولیه متقاضی',
          'سامانه ضبط و سنجش مهارت مذاکره تیم بازاریابی آموزشی'
        ],
        technicalBlockers: [],
        unmetExpectations: []
      },
      metrics: [
        { id: 'cm-01', name: 'تناسب با راهکار سازمانی', score: 88, weight: 25, level: 'High', analysis: 'داشبورد گزارش کمپین تلفنی پاسخگوی نیاز مدیریت آموزشگاه است.' },
        { id: 'cm-02', name: 'قطعیت تصمیم و بودجه', score: 76, weight: 25, level: 'High', analysis: 'بودجه فصلی تبلیغات دوره‌های MBA در اختیار واحد خانم میرزایی است.' },
        { id: 'cm-03', name: 'فوریت و جدول زمانی', score: 72, weight: 25, level: 'Medium', analysis: 'در حال اجرای کمپین زمستانه تا پایان آذرماه.' },
        { id: 'cm-04', name: 'ضریب تعامل و ارتباط', score: 80, weight: 25, level: 'High', analysis: 'همکاری مداوم با کارشناس ارتباط با مشتریان (الهام ناصری).' }
      ],
      behavioralSignals: {
        sentimentTrend: 'Improving',
        engagementFrequency: 'Regular',
        decisionTimeline: 'تمدید فصلی قرارداد در پایان ماه'
      },
      recommendedNextActions: [
        'ارسال گزارش تحلیلی اکسل طبق قول الهام ناصری تا ساعت ۱۶:۰۰ امروز',
        'پیشنهاد ماژول توزیع هوشمند سرنخ‌ها بین ۵ مشاور برتر موسسه'
      ],
      aiExecutiveSummary: 'موسسه آموزشی فعال با پرداخت منظم و رضایت پایدار. تمدید سالانه کمپین‌های تبلیغاتی تلفنی با ضریب احتمال بالا.'
    }
  }
];

export const initialStaff: Staff[] = [
  {
    id: 'staff-01',
    name: 'علی رضایی',
    extension: '۱۰۴۲',
    department: 'فروش سازمانی',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'available',
    avgScore: 94.5,
    totalCallsHandled: 132,
    avgHandleTimeSec: 340,
    strengths: ['همدلی و برقراری ارتباط قوی', 'بیان دقیق ارزش محصول', 'مدیریت موثر ابهامات مشتری'],
    coachingPoints: ['امکان شفاف‌سازی سقف بودجه مشتری در مراحل ابتدایی جلسه ارزیابی'],
    tags: ['کارشناس-برتر', 'متخصص-فروش-سازمانی']
  },
  {
    id: 'staff-02',
    name: 'جواد صادقی',
    extension: '۱۰۴۵',
    department: 'پشتیبانی فنی و موفقیت مشتری',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'available',
    avgScore: 91.2,
    totalCallsHandled: 218,
    avgHandleTimeSec: 410,
    strengths: ['تسلط فنی عمیق به شبکه ویپ', 'صبر و آرامش در تماس‌های اعتراضی'],
    coachingPoints: ['نیاز به خلاصه کردن جمع‌بندی نهایی و اعلام بازه دقیق SLA در انتهای تماس'],
    tags: ['متخصص-فنی', 'نیاز-به-بهبود-جمع‌بندی']
  },
  {
    id: 'staff-03',
    name: 'مریم پرتو',
    extension: '۱۰۵۰',
    department: 'فروش تلفنی و بازاریابی',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'available',
    avgScore: 88.5,
    totalCallsHandled: 168,
    avgHandleTimeSec: 290,
    strengths: ['ایجاد رابطه دوستانه', 'گوش دادن فعال'],
    coachingPoints: ['ارسال ایمیل صورتجلسه مکالمه حداکثر ظرف ۳۰ دقیقه پس از پایان تماس'],
    tags: ['پاسخگویی-سریع', 'توسعه-دهنده-ارتباط']
  },
  {
    id: 'staff-04',
    name: 'بهزاد کاظمی',
    extension: '۱۰۶۰',
    department: 'پشتیبانی فنی پیشرفته و شیفت شب',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'available',
    avgScore: 89.8,
    totalCallsHandled: 194,
    avgHandleTimeSec: 365,
    strengths: ['عیب‌یابی سریع پکت شبکه', 'رسیدگی دقیق به تیکت‌های اضطراری شبانه'],
    coachingPoints: ['به‌روزرسانی سریع‌تر وضعیت تیکت در پرتال مشتری'],
    tags: ['پشتیبانی-۲۴-ساعته', 'تکنسین-شبکه']
  },
  {
    id: 'staff-05',
    name: 'الهام ناصری',
    extension: '۱۰۷۰',
    department: 'ارتباط با مشتریان کلیدی و تمدید قرارداد',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'available',
    avgScore: 93.0,
    totalCallsHandled: 142,
    avgHandleTimeSec: 315,
    strengths: ['مذاکره قراردادهای سالانه', 'شناسایی فرصت‌های بیش‌فروشی و ارتقای پلن'],
    coachingPoints: ['ارسال مستندات تکمیلی بلافاصله پس از توافق تلفنی'],
    tags: ['مدیریت-حساب-کلیدی', 'مذاکره‌کننده-ارشد']
  }
];

export const initialRubrics: AdminRubric[] = [
  {
    id: 'rub-01',
    name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای',
    category: 'Staff Performance',
    weight: 15,
    description: 'کارشناس شرکت را با احترام معرفی کرده، هویت مشتری را احراز و با لحنی گرم و شایسته آغاز می‌کند.',
    targetExpectation: 'اعلام نام، نام سازمان و تشکر از تماس در ۱۰ ثانیه نخست مکالمه.'
  },
  {
    id: 'rub-02',
    name: 'گوش دادن فعال و کشف نیازهای مشتری',
    category: 'Staff Performance',
    weight: 25,
    description: 'کارشناس پرسش‌های شفاف‌ساز می‌پرسد، دغدغه‌های مشتری را تایید کرده و کلام او را قطع نمی‌کند.',
    targetExpectation: 'بازگویی و تایید خلاصه نیاز مشتری پیش از ارائه پیشنهاد راهکار.'
  },
  {
    id: 'rub-03',
    name: 'پاسخ به ابهامات و ارزش‌آفرینی',
    category: 'Staff Performance',
    weight: 25,
    description: 'کارشناس ابهامات هزینه، مهاجرت خطوط یا پایداری را با آرامش پاسخ داده و مزایای راهکار را تبیین می‌کند.',
    targetExpectation: 'پاسخ به حساسیت قیمت از طریق ارائه آمار بازگشت سرمایه و جلوگیری از هزینه قطعی.'
  },
  {
    id: 'rub-04',
    name: 'تعیین شفاف اقدامات آتی و زمان‌بندی',
    category: 'Staff Performance',
    weight: 20,
    description: 'کارشناس تاریخ و ساعت مشخصی برای پیگیری تعیین کرده و تعهدات را دقیق مشخص می‌کند.',
    targetExpectation: 'توافق بر سر تاریخ و ساعت دقیق تماس یا جلسه بعدی پیش از پایان مکالمه.'
  },
  {
    id: 'rub-05',
    name: 'رعایت استاندارد لحن و الزامات حرفه‌ای',
    category: 'Staff Performance',
    weight: 15,
    description: 'پایبندی به ادبیات رسمی و محترمانه، عدم اعمال فشار نامناسب بر مشتری و حفظ خونسردی در شرایط اعتراض.',
    targetExpectation: 'حفظ لحن صبورانه، همدلانه و متین تحت هر شرایطی.'
  }
];

export const initialTagRules: AdminTagRule[] = [
  {
    tag: 'مشتری-سازمانی',
    category: 'Customer',
    conditionSummary: 'اشاره به بیش از ۱۰۰ کانال، معماری چند شعبه‌ای یا نیاز به ترانک سازمانی',
    color: '#3b82f6'
  },
  {
    tag: 'قصد-خرید-بالا',
    category: 'Customer',
    conditionSummary: 'نمره تمایل به خرید محاسبه‌شده بالاتر از ۷۵٪',
    color: '#10b981'
  },
  {
    tag: 'حساس-به-قیمت',
    category: 'Customer',
    conditionSummary: 'پرسش مکرر درباره تخفیف‌ها، حذف هزینه راه‌اندازی یا مقایسه نرخ با رقبا',
    color: '#f59e0b'
  },
  {
    tag: 'خطر-ریزش-مشتری',
    category: 'Customer',
    conditionSummary: 'ابراز نارضایتی شدید از قطعی ارتباط، افت کیفیت یا تاخیر در پاسخ تیکت‌ها',
    color: '#ef4444'
  },
  {
    tag: 'کارشناس-برتر',
    category: 'Staff',
    conditionSummary: 'میانگین نمره ارزیابی مکالمات بالای ۹۰ در ۱۰ تماس اخیر',
    color: '#8b5cf6'
  },
  {
    tag: 'نیاز-به-بهبود-جمع‌بندی',
    category: 'Staff',
    conditionSummary: 'نمره شاخص تعیین اقدامات آتی و پیگیری زیر ۷۰ امتیاز',
    color: '#ec4899'
  }
];

export const initialFollowUpTasks: FollowUpTask[] = [
  {
    id: 'task-301',
    callId: 'call-001',
    customerId: 'cust-101',
    customerName: 'سارا رادمنش (لجستیک آپادانا)',
    assignedStaffId: 'staff-01',
    staffName: 'علی رضایی',
    title: 'ارسال پیش‌نویس طرح ترانک سازمانی و تضمین SLA',
    description: 'ارسال پروپوزال فنی ترانک ۲۵۰ کاناله با آپ‌تایم ۹۹.۹۹۹٪ و جایگزینی خودکار بین دو دیتاسنتر. تنظیم جلسه بررسی با تیم زیرساخت.',
    dueTime: '2026-11-16T10:00:00Z',
    deadline: 'فردا ساعت ۱۰:۰۰ صبح',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-11-15T09:30:00Z'
  },
  {
    id: 'task-302',
    callId: 'call-002',
    customerId: 'cust-102',
    customerName: 'داوود خلیلی (خرده‌فروشی نوین)',
    assignedStaffId: 'staff-03',
    staffName: 'مریم پرتو',
    title: 'ارسال مدل تحلیل بازگشت سرمایه (TCO) در برابر توسعه اختصاصی',
    description: 'تهیه و ارسال گزارش تک‌صفحه‌ای مقایسه هزینه‌های استفاده از سامانه آماده با پیاده‌سازی Speechmatics در مقایسه با ماه‌ها هزینه برنامه‌نویسی اختصاصی.',
    dueTime: '2026-11-17T14:00:00Z',
    deadline: 'چهارشنبه ساعت ۱۴:۰۰',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-11-14T16:00:00Z'
  },
  {
    id: 'task-303',
    callId: 'call-003',
    customerId: 'cust-103',
    customerName: 'الناز رستگار (پرداخت پاسارگاد)',
    assignedStaffId: 'staff-02',
    staffName: 'جواد صادقی',
    title: 'فوری: بررسی تریس شبکه و جیتر بافت ترانک با سرپرست فنی',
    description: 'مشتری افت کیفیت در گیت‌وی اصلی را در ساعت اوج تراکنش گزارش کرده است. بررسی تنظیمات جیتر بافر، بررسی لاگ‌های SIP INVITE و تماس با خانم رستگار.',
    dueTime: '2026-11-15T12:00:00Z',
    deadline: 'امروز تا ساعت ۱۲:۰۰ ظهر',
    priority: 'Critical',
    status: 'In Progress',
    createdAt: '2026-11-15T09:45:00Z'
  },
  {
    id: 'task-305',
    callId: 'call-004',
    customerId: 'cust-105',
    customerName: 'کامران شریفی (فولاد دماوند)',
    assignedStaffId: 'staff-01',
    staffName: 'علی رضایی',
    title: 'ارسال مستندات API وب‌هوک و پلاگین مایکروسافت داینامیکس',
    description: 'آماده‌سازی پکیج راهنمای اتصال خطوط ترانک کارخانه فولاد به CRM داینامیکس ۳۶۵ و هماهنگی جلسه حضوری با واحد انفورماتیک.',
    dueTime: '2026-11-16T15:00:00Z',
    deadline: 'فردا ساعت ۱۵:۰۰ عصر',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-11-15T11:55:00Z'
  },
  {
    id: 'task-306',
    callId: 'call-005',
    customerId: 'cust-106',
    customerName: 'نگار اسدی (پرواز ۲۴)',
    assignedStaffId: 'staff-03',
    staffName: 'مریم پرتو',
    title: 'تنظیم سناریوی صف انتظار ابری برای پیک پروازهای نوروزی',
    description: 'پیکربندی موقت ارتقای ظرفیت ترانک ابری به ۱۰۰ خط همزمان و افزودن پیام اطلاع‌رسانی صوتی استعلام پیامکی پروازهای لغوشده.',
    dueTime: '2026-11-18T10:00:00Z',
    deadline: 'چهارشنبه ساعت ۱۰:۰۰ صبح',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-11-14T17:35:00Z'
  },
  {
    id: 'task-307',
    callId: 'call-006',
    customerId: 'cust-107',
    customerName: 'هومن افشار (بیمه درمان باران)',
    assignedStaffId: 'staff-02',
    staffName: 'جواد صادقی',
    title: 'فعال‌سازی ترانک رزرو روی دیتاسنتر فرعی غرب کشور',
    description: 'تست انتقال خودکار ترافیک در صورت اختلال اینترنت بین‌الملل و ارائه تاییدیه امنیتی پایداری خطوط بیمه.',
    dueTime: '2026-11-14T12:00:00Z',
    deadline: 'دیروز ساعت ۱۲:۰۰',
    priority: 'Medium',
    status: 'Completed',
    createdAt: '2026-11-13T10:45:00Z'
  },
  {
    id: 'task-308',
    callId: 'call-007',
    customerId: 'cust-109',
    customerName: 'مسعود رفیعی (کالا مارکت)',
    assignedStaffId: 'staff-04',
    staffName: 'بهزاد کاظمی',
    title: 'بررسی گزارش تحلیلی زمان انتظار تماس مشتریان شیفت شب',
    description: 'استخراج داده‌های صف انتظار ساعات ۲۲ تا ۳ بامداد و بهینه‌سازی الگوریتم توزیع تماس بین اپراتورهای شیفت شب کالا مارکت.',
    dueTime: '2026-11-15T18:00:00Z',
    deadline: 'امروز ساعت ۱۸:۰۰',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-11-15T02:50:00Z'
  },
  {
    id: 'task-309',
    callId: 'call-008',
    customerId: 'cust-110',
    customerName: 'شیما میرزایی (آینده‌پژوهان)',
    assignedStaffId: 'staff-05',
    staffName: 'الهام ناصری',
    title: 'ارائه گزارش تفکیکی نرخ پاسخگویی کمپین دوره MBA',
    description: 'بررسی شاخص‌های گفتار و استخراج نرخ علاقه متقاضیان دوره‌های بین‌المللی و تحویل فایل اکسل اکسپورت‌شده به واحد ثبت‌نام.',
    dueTime: '2026-11-15T16:00:00Z',
    deadline: 'امروز ساعت ۱۶:۰۰',
    priority: 'Low',
    status: 'Completed',
    createdAt: '2026-11-15T10:20:00Z'
  }
];

export const initialCalls: CallRecord[] = [
  {
    id: 'call-001',
    direction: 'inbound',
    startTime: '2026-11-15T09:12:00Z',
    endTime: '2026-11-15T09:17:45Z',
    durationSec: 345,
    staffId: 'staff-01',
    customerId: 'cust-101',
    customerPhone: '۰۲۱-۸۸۲۲۳۳۴۴',
    customerName: 'سارا رادمنش',
    status: 'completed',
    diarizedTurns: [
      {
        speaker: 'Staff',
        startTime: 0,
        endTime: 4.5,
        text: 'با درود، ارتباطات هوشمند ویپ، علی رضایی هستم. چطور می‌تونم به مجموعه شما کمک کنم؟',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 5.0,
        endTime: 18.2,
        text: 'سلام آقای رضایی. سارا رادمنش هستم از هلدینگ لجستیک آپادانا. قرارداد سانترال فعلی ما ماه آینده تموم میشه و ما نیازمند ترانک سازمانی با ظرفیت ۲۵۰ تماس همزمان و تضمین پایداری بالا هستیم.',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        startTime: 19.0,
        endTime: 31.5,
        text: 'بسیار خرسندم از هم‌صحبتی با شما سرکار خانم رادمنش. لجستیک آپادانا عملیات حیاتی و حساسی داره. راهکار سازمانی ما پایداری ۹۹.۹۹۹٪ رو همراه با جابجایی خودکار ترافیک بین دیتاسنترها با ضمانت کتبی ارائه میده.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 32.0,
        endTime: 46.8,
        text: 'دقیقاً همین موضوع مد نظر تیم زیرساخت ماست؛ چون در دوره گذشته به خاطر قطعی اپراتور قبلی خسارت سنگینی دیدیم. روند ارسال پروپوزال و زمان‌بندی بررسی فنی به چه صورت هست؟',
        sentiment: 'positive'
      },
      {
        speaker: 'Staff',
        startTime: 47.5,
        endTime: 62.0,
        text: 'من طرح معماری پیشنهادی و جدول تعرفه سازمانی رو تا فردا صبح ساعت ۱۰ براتون ایمیل می‌کنم. امکانش هست یک جلسه آنلاین ۲۰ دقیقه‌ای با حضور مدیر فنی‌تون برای ساعت ۱۰ فردا هماهنگ کنیم؟',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 62.8,
        endTime: 74.0,
        text: 'بله، فردا ساعت ۱۰ صبح برای من و مدیر شبکه ما زمان بسیار مناسبی هست. دعوت‌نامه رو به ایمیل من ارسال بفرمایید.',
        sentiment: 'positive'
      },
      {
        speaker: 'Staff',
        startTime: 74.5,
        endTime: 85.0,
        text: 'حتماً، دعوت‌نامه ظرف کمتر از یک ساعت آینده ارسال خواهد شد. از توجه شما سپاسگزارم و روز بسیار خوبی داشته باشید.',
        sentiment: 'positive'
      }
    ],
    analysis: {
      brief: 'خانم سارا رادمنش (مدیر ارشد فناوری آپادانا) برای جایگزینی سانترال با ۲۵۰ ترانک سازمانی و تضمین SLA ۹۹.۹۹۹٪ تماس گرفت. علی رضایی پایداری چندمرکزی را معرفی کرده و جلسه بررسی پروپوزال را برای فردا ساعت ۱۰:۰۰ صبح قطعی کرد.',
      keyPoints: [
        'نیاز به ۲۵۰ خط همزمان ترانک SIP با تضمین پایداری ۹۹.۹۹۹٪.',
        'سابقه خسارت مالی ناشی از قطعی اپراتور پیشین و انگیزه بالا برای جابجایی.',
        'بودجه سالانه مصوب و آماده تخصیص است.'
      ],
      detectedSentiment: 'Very Positive',
      urgency: 'High',
      customerNeedsIdentified: ['ترانک سازمانی ۲۵۰ کاناله', 'تضمین پایداری ۹۹.۹۹۹٪', 'انتقال سریع خطوط'],
      customerPurchaseWillingness: 92,
      customerEffortTier: 'T1',
      staffPerformanceScores: [
        {
          criterionId: 'rub-01',
          name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای',
          score: 98,
          weight: 15,
          feedback: 'معرفی بسیار گرم، شفاف، احراز سریع هویت مشتری و تسلط کامل در گفتار.'
        },
        {
          criterionId: 'rub-02',
          name: 'گوش دادن فعال و کشف نیازهای مشتری',
          score: 94,
          weight: 25,
          feedback: 'درک دقیق حساسیت پایداری و عدم قطع کلام مشتری در هنگام توضیح مشکلات اپراتور قبلی.'
        },
        {
          criterionId: 'rub-03',
          name: 'پاسخ به ابهامات و ارزش‌آفرینی',
          score: 95,
          weight: 25,
          feedback: 'تاکید موثر بر راهکار دو دیتاسنتری و ممانعت از تکرار ضرر و زیان‌های قطعی.'
        },
        {
          criterionId: 'rub-04',
          name: 'تعیین شفاف اقدامات آتی و زمان‌بندی',
          score: 96,
          weight: 20,
          feedback: 'تثبیت دقیق زمان جلسه بررسی (فردا ساعت ۱۰ صبح) و ارسال به موقع دعوتنامه تقویمی.'
        },
        {
          criterionId: 'rub-05',
          name: 'رعایت استاندارد لحن و الزامات حرفه‌ای',
          score: 95,
          weight: 15,
          feedback: 'لحن شایسته، مسلط و ایجاد اطمینان خاطر در مشتری سازمانی.'
        }
      ],
      overallStaffScore: 95.5,
      coachingNotes: 'مکالمه نمونه در حوزه فروش سازمانی. الگوی بسیار مناسب برای آموزش سایر همکاران.',
      extractedTags: {
        customerTags: ['مشتری-سازمانی', 'قصد-خرید-بالا', 'بودجه-تاییدشده'],
        staffTags: ['کارشناس-برتر', 'متخصص-فروش-سازمانی']
      }
    },
    tasksCreated: [initialFollowUpTasks[0]]
  },
  {
    id: 'call-002',
    direction: 'outbound',
    startTime: '2026-11-14T14:05:00Z',
    endTime: '2026-11-14T14:11:30Z',
    durationSec: 390,
    staffId: 'staff-03',
    customerId: 'cust-102',
    customerPhone: '۰۲۱-۴۴۵۵۶۶۷۷',
    customerName: 'داوود خلیلی',
    status: 'completed',
    diarizedTurns: [
      {
        speaker: 'Staff',
        startTime: 0,
        endTime: 6.0,
        text: 'سلام آقای خلیلی، مریم پرتو هستم برای پیگیری پس از وبینار سامانه هوشمند صوت مرکز تماس. حالتون چطوره؟',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 6.5,
        endTime: 21.0,
        text: 'سلام خانم پرتو. قابلیت پیاده‌سازی Speechmatics خیلی برامون جالب بود، ولی راستش بودجه امسال ما محدوده و داریم فکر می‌کنیم شاید خودمون مستقیماً از API استفاده کنیم تا هزینه‌هامون کمتر بشه.',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        startTime: 21.8,
        endTime: 36.5,
        text: 'دغدغه بودجه کاملاً قابل درکه آقای خلیلی. اما توسعه داخلی نیازمند حداقل ۶ ماه وقت تیم فنی برای توسعه وب‌سوکت، رابط کاربری، تحلیل متن و نگهداری سروره که معمولاً بسیار پرهزینه‌تر از اشتراک آماده ما تموم میشه.',
        sentiment: 'neutral'
      },
      {
        speaker: 'Customer',
        startTime: 37.0,
        endTime: 51.2,
        text: 'نکته درستی هست، اما ما به اعداد شفاف نیاز داریم تا هیئت‌مدیره رو قانع کنیم. می‌تونید یک جدول مقایسه‌ای از هزینه‌های توسعه خودمون در مقایسه با پلتفرم شما آماده کنید؟',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        startTime: 52.0,
        endTime: 65.0,
        text: 'حتماً. یک گزارش مقایسه‌ای تحلیلی از صرفه‌جویی زمان و هزینه براتون آماده می‌کنم. موافقید روز چهارشنبه ساعت ۲ بعدازظهر یک تماس کوتاه برای بررسیش داشته باشیم؟',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 65.8,
        endTime: 73.0,
        text: 'بله عالیه، فایل رو چهارشنبه صبح بفرستید و ساعت ۲ تماس بگیرید.',
        sentiment: 'neutral'
      }
    ],
    analysis: {
      brief: 'مریم با داوود خلیلی پیرامون راهکار تحلیل مکالمات تماس گرفت. مشتری به پیاده‌سازی Speechmatics علاقه‌مند است اما به دلیل محدودیت بودجه، توسعه داخلی API را مد نظر دارد. مریم متعهد شد گزارش مقایسه هزینه (TCO) را چهارشنبه ساعت ۱۴ ارسال و پیگیری کند.',
      keyPoints: [
        'علاقه‌مندی مشتری به تفکیک گوینده Speechmatics و نمره‌دهی خودکار.',
        'ابهام در خصوص هزینه اشتراک در برابر توسعه اختصاصی نرم‌افزار.',
        'نیازمند گزارش تحلیلی شفاف از صرفه‌جویی اقتصادی.'
      ],
      detectedSentiment: 'Skeptical',
      urgency: 'Medium',
      customerNeedsIdentified: ['تحلیل بازگشت سرمایه', 'پیاده‌سازی Speechmatics', 'طرح اشتراک اقتصادی'],
      customerPurchaseWillingness: 52,
      customerEffortTier: 'T2',
      staffPerformanceScores: [
        {
          criterionId: 'rub-01',
          name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای',
          score: 88,
          weight: 15,
          feedback: 'شروع خوب و اشاره مناسب به پیشینه وبینار.'
        },
        {
          criterionId: 'rub-02',
          name: 'گوش دادن فعال و کشف نیازهای مشتری',
          score: 85,
          weight: 25,
          feedback: 'شنیدن دغدغه بودجه، البته می‌شد دقایق مکالمه ماهانه را دقیق‌تر بررسی کرد.'
        },
        {
          criterionId: 'rub-03',
          name: 'پاسخ به ابهامات و ارزش‌آفرینی',
          score: 82,
          weight: 25,
          feedback: 'پاسخ مناسب به ابهام توسعه اختصاصی و تاکید بر سرعت استقرار محصول.'
        },
        {
          criterionId: 'rub-04',
          name: 'تعیین شفاف اقدامات آتی و زمان‌بندی',
          score: 90,
          weight: 20,
          feedback: 'تعیین قطعی زمان تماس بعدی برای روز چهارشنبه ساعت ۱۴.'
        },
        {
          criterionId: 'rub-05',
          name: 'رعایت استاندارد لحن و الزامات حرفه‌ای',
          score: 92,
          weight: 15,
          feedback: 'برخورد بسیار مودبانه و محترمانه.'
        }
      ],
      overallStaffScore: 86.7,
      coachingNotes: 'دفاع خوب از راهکار. پیشنهاد می‌شود پیش از ارسال فایل، تعداد کاربران مرکز تماس آنها پرسیده شود.',
      extractedTags: {
        customerTags: ['حساس-به-قیمت', 'نیازمند-پایلوت', 'مقایسه-محصول'],
        staffTags: ['پاسخگویی-سریع']
      }
    },
    tasksCreated: [initialFollowUpTasks[1]]
  },
  {
    id: 'call-003',
    direction: 'inbound',
    startTime: '2026-11-15T09:02:00Z',
    endTime: '2026-11-15T09:10:15Z',
    durationSec: 495,
    staffId: 'staff-02',
    customerId: 'cust-103',
    customerPhone: '۰۲۱-۲۲۱۱۰۰۹۹',
    customerName: 'الناز رستگار',
    status: 'completed',
    diarizedTurns: [
      {
        speaker: 'Staff',
        startTime: 0,
        endTime: 5.0,
        text: 'پشتیبانی تخصصی ویپ، جواد صادقی هستم. بفرمایید چطور می‌تونم راهنمایی‌تون کنم؟',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 5.5,
        endTime: 24.0,
        text: 'آقای صادقی، تماس‌های تایید پرداخت مشتریان ما امروز صبح مکرراً قطع شده! در ساعات اوج تراکنش این وضعیت برای پاسارگاد غیرقابل قبوله. اگر پایداری خطوط رو تضمین نکنید ما فوراً قرارداد رو فسخ می‌کنیم.',
        sentiment: 'negative'
      },
      {
        speaker: 'Staff',
        startTime: 24.8,
        endTime: 38.0,
        text: 'سرکار خانم رستگار، کاملاً حساسیت تراکنش‌های مالی و فوریت موضوع رو درک می‌کنم و بابت این اختلال صمیمانه پوزش می‌خوام. همین لحظه لاگ نشست‌های SIP خطوط شما رو باز کردم تا بررسی کنم.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 38.8,
        endTime: 53.0,
        text: 'ما حوالی ساعت ۸:۴۵ شاهد افت شدید پکت‌ها روی گیت‌وی مرکز دو بودیم. من نیاز دارم مهندس ارشد شبکه فوراً مسیر جایگزین رو بررسی کنه و تایید بده تکرار نمیشه.',
        sentiment: 'negative'
      },
      {
        speaker: 'Staff',
        startTime: 53.8,
        endTime: 70.0,
        text: 'دقیقاً نوسانی که فرمودید رو در نمودار مشاهده کردم. هم‌اکنون تیکت اضطراری سطح ۳ برای سرپرست فنی زیرساخت ثبت کردم و اولویت بحرانی قرار دادم. من شخصاً تریس شبکه رو پیگیری می‌کنم و تا ساعت ۱۲ ظهر امروز با نتیجه باهاتون تماس می‌گیرم.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 70.8,
        endTime: 80.0,
        text: 'ممنون آقای صادقی. از پیگیری سریع شما متشکرم. ساعت ۱۲ منتظر تماس شما هستم.',
        sentiment: 'neutral'
      }
    ],
    analysis: {
      brief: 'خانم الناز رستگار (پرداخت پاسارگاد) در اعتراض به قطعی مکرر تماس‌های تراکنشی تماس گرفت و هشدار ریزش داد. جواد صادقی با آرامش و همدلی اوضاع را مدیریت کرده، تیکت فوری سطح ۳ باز کرد و متعهد شد تا ساعت ۱۲ ظهر با نتایج با مشتری تماس بگیرد.',
      keyPoints: [
        'افت پکت متناوب روی گیت‌وی ۲ در ساعات اوج تراکنش‌های بانکی.',
        'خطر ریزش حساب مشتری استراتژیک VIP.',
        'مهلت بحرانی: پیگیری تریس شبکه و تماس مجدد جواد تا ساعت ۱۲:۰۰ امروز.'
      ],
      detectedSentiment: 'Frustrated',
      urgency: 'Critical',
      customerNeedsIdentified: ['رفع نوسان شبکه', 'بررسی مهندس ارشد زیرساخت', 'پایداری بدون قطعی'],
      customerPurchaseWillingness: 70,
      customerEffortTier: 'T1',
      staffPerformanceScores: [
        {
          criterionId: 'rub-01',
          name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای',
          score: 85,
          weight: 15,
          feedback: 'شروع مستقیم و متناسب با میز پشتیبانی فنی.'
        },
        {
          criterionId: 'rub-02',
          name: 'گوش دادن فعال و کشف نیازهای مشتری',
          score: 96,
          weight: 25,
          feedback: 'پرهیز کامل از قطع کلام مشتری عصبانی و درک فوری اهمیت تراکنش‌های مالی.'
        },
        {
          criterionId: 'rub-03',
          name: 'پاسخ به ابهامات و ارزش‌آفرینی',
          score: 92,
          weight: 25,
          feedback: 'عدم توجیه یا بهانه‌تراشی و هدایت فوری به سمت عیب‌یابی عملیاتی.'
        },
        {
          criterionId: 'rub-04',
          name: 'تعیین شفاف اقدامات آتی و زمان‌بندی',
          score: 95,
          weight: 20,
          feedback: 'تعیین مهلت شفاف (ساعت ۱۲ امروز) و تعهد شخصی برای تماس.'
        },
        {
          criterionId: 'rub-05',
          name: 'رعایت استاندارد لحن و الزامات حرفه‌ای',
          score: 98,
          weight: 15,
          feedback: 'مدیریت بحران و تنش‌زدایی فوق‌العاده حرفه‌ای در شرایط فشار شدید.'
        }
      ],
      overallStaffScore: 93.6,
      coachingNotes: 'تنش‌زدایی بسیار عالی. حتماً کدهای خطای پروتکل SIP INVITE در متن تیکت ثبت شود.',
      extractedTags: {
        customerTags: ['خطر-ریزش-مشتری', 'ارجاع-فنی-فوری', 'مشتری-ویژه-VIP'],
        staffTags: ['متخصص-فنی']
      }
    },
    tasksCreated: [initialFollowUpTasks[2]]
  },
  {
    id: 'call-004',
    direction: 'inbound',
    startTime: '2026-11-15T11:40:00Z',
    endTime: '2026-11-15T11:46:15Z',
    durationSec: 375,
    staffId: 'staff-01',
    customerId: 'cust-105',
    customerPhone: '۰۲۱-۸۸۹۹۱۱۲۲',
    customerName: 'کامران شریفی',
    status: 'completed',
    diarizedTurns: [
      {
        speaker: 'Staff',
        startTime: 0,
        endTime: 5.0,
        text: 'وقت شما بخیر، فروش سازمانی ویپ، علی رضایی در خدمت شما هستم.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 5.5,
        endTime: 22.0,
        text: 'سلام آقای رضایی، کامران شریفی هستم مدیر انفورماتیک فولاد دماوند. ما در حال استقرار مایکروسافت داینامیکس ۳۶۵ در کل کارخانجات هستیم و حتماً نیاز داریم به محض زنگ خوردن تلفن، پاپ‌آپ پرونده مشتری در داینامیکس باز بشه و فایل صوت هم ضمیمه تیکت بشه.',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        startTime: 22.8,
        endTime: 38.0,
        text: 'سلام جناب مهندس شریفی. ما وب‌هوک CTI استاندارد و ماژول آماده ادغام با Dynamics 365 داریم. به محض ایجاد تماس رویداد از طریق WebSocket ارسال میشه و رکورد صوتی با کیفیت بالا در سرور داخلی شما یا فضای ابری امن ذخیره خواهد شد.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 38.8,
        endTime: 50.0,
        text: 'خیلی عالیه. آیا مستندات فنی API و نمونه کد وب‌هوک رو دارید که واحد نرم‌افزار ما قبل از جلسه نهایی بررسی کنه؟',
        sentiment: 'positive'
      },
      {
        speaker: 'Staff',
        startTime: 50.8,
        endTime: 64.0,
        text: 'بله کاملاً. مستندات کامل فنی و توابع ادغام رو تا ساعت ۳ بعدازظهر امروز خدمتتون ایمیل می‌کنم و فردا برای هماهنگی جلسه با تیم فنی‌تون تماس می‌گیرم.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 64.8,
        endTime: 71.0,
        text: 'بسیار متشکرم. ایمیل رو بفرستید و فردا عصر هماهنگ می‌کنیم.',
        sentiment: 'positive'
      }
    ],
    analysis: {
      brief: 'مهندس کامران شریفی (فولاد دماوند) جهت اتصال خطوط کارخانجات به CRM مایکروسافت داینامیکس ۳۶۵ و ضبط مکالمات استعلام گرفت. علی رضایی ماژول CTI را تشریح کرد و ارسال مستندات API را تا ساعت ۱۵:۰۰ تعهد داد.',
      keyPoints: [
        'یکپارچه‌سازی سیستم تلفنی با Microsoft Dynamics 365 در سطح صنعتی.',
        'نیازمند ذخیره‌سازی خودکار صوت و الصاق به پرونده سفارشات.',
        'پروپوزال فنی و API تا عصر امروز ارسال می‌شود.'
      ],
      detectedSentiment: 'Very Positive',
      urgency: 'High',
      customerNeedsIdentified: ['ادغام CTI با Dynamics 365', 'ضبط امن مکالمات', 'مستندات کامل API'],
      customerPurchaseWillingness: 86,
      customerEffortTier: 'T1',
      staffPerformanceScores: [
        { criterionId: 'rub-01', name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای', score: 95, weight: 15, feedback: 'معرفی شفاف و رسمی.' },
        { criterionId: 'rub-02', name: 'گوش دادن فعال و کشف نیازهای مشتری', score: 94, weight: 25, feedback: 'پاسخ صریح و فنی به نیاز داینامیکس.' },
        { criterionId: 'rub-03', name: 'پاسخ به ابهامات و ارزش‌آفرینی', score: 92, weight: 25, feedback: 'اطمینان‌بخشی درباره امنیت داده‌های صنعتی.' },
        { criterionId: 'rub-04', name: 'تعیین شفاف اقدامات آتی و زمان‌بندی', score: 95, weight: 20, feedback: 'تعهد ساعت ۳ بعدازظهر برای ارسال مستندات.' },
        { criterionId: 'rub-05', name: 'رعایت استاندارد لحن و الزامات حرفه‌ای', score: 96, weight: 15, feedback: 'مسلط و محترم.' }
      ],
      overallStaffScore: 94.2,
      coachingNotes: 'پرزنت بسیار مسلط برای مشتری سازمانی. پس از ارسال ایمیل حتماً نمونه پکت JSON وب‌هوک ضمیمه شود.',
      extractedTags: {
        customerTags: ['مشتری-سازمانی', 'قصد-خرید-بالا', 'پروژه-صنعتی'],
        staffTags: ['متخصص-فروش-سازمانی']
      }
    },
    tasksCreated: [initialFollowUpTasks[3]]
  },
  {
    id: 'call-005',
    direction: 'inbound',
    startTime: '2026-11-14T17:15:00Z',
    endTime: '2026-11-14T17:21:40Z',
    durationSec: 400,
    staffId: 'staff-03',
    customerId: 'cust-106',
    customerPhone: '۰۲۱-۹۱۰۰۲۴۲۴',
    customerName: 'نگار اسدی',
    status: 'completed',
    diarizedTurns: [
      {
        speaker: 'Staff',
        startTime: 0,
        endTime: 4.5,
        text: 'عصر بخیر، مرکز خدمات ویپ، مریم پرتو هستم. در خدمتم.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 5.0,
        endTime: 21.0,
        text: 'سلام خانم پرتو، نگار اسدی هستم مدیر عملیات پرواز ۲۴. ما در تعطیلات پیش‌رو با حجم وحشتناکی از تماس بابت تغییر برنامه پروازها مواجهیم. می‌خوایم خطوط ترانک رو موقتاً به ۱۰۰ خط افزایش بدیم و صف انتظار هوشمند فعال بشه.',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        startTime: 21.8,
        endTime: 36.0,
        text: 'سلام خانم اسدی. راهکار ترانک ابری مقیاس‌پذیر ما دقیقاً برای همین پیک‌های ترافیکی طراحی شده. ما می‌تونیم بدون قطعی، ظرفیت خطوط شما رو به ۱۰۰ کانال ارتقا بدیم و پیام صوتی استعلام سریع خودکار رو فعال کنیم.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 36.8,
        endTime: 48.0,
        text: 'خیلی خوبه. فقط می‌خوایم روز چهارشنبه صبح تست بار ترافیکی بگیریم تا مطمئن بشیم بوق اشغال برای مسافران نمی‌خوره.',
        sentiment: 'positive'
      },
      {
        speaker: 'Staff',
        startTime: 48.8,
        endTime: 61.0,
        text: 'کاملاً موافقم. من برای روز چهارشنبه ساعت ۱۰ صبح با سرپرست فنی هماهنگ می‌کنم تا تست شبیه‌سازی ترافیک رو با هم اجرا کنیم.',
        sentiment: 'positive'
      }
    ],
    analysis: {
      brief: 'خانم نگار اسدی (پرواز ۲۴) برای افزایش موقت ترانک به ۱۰۰ کانال و راه‌اندازی صف ابری در تعطیلات نوروز تماس گرفت. مریم پرتو امکان افزایش آنی ظرفیت را تایید و جلسه تست ترافیک را برای چهارشنبه ساعت ۱۰ تنظیم کرد.',
      keyPoints: [
        'افزایش موقت ظرفیت ترانک به ۱۰۰ خط همزمان برای ایام اوج سفر.',
        'فعال‌سازی پیام خودکار استعلام لغو پرواز برای خلوت‌سازی صف اپراتورها.',
        'تست نهایی شبیه‌سازی چهارشنبه ساعت ۱۰:۰۰ صبح.'
      ],
      detectedSentiment: 'Positive',
      urgency: 'High',
      customerNeedsIdentified: ['ترانک ابری ۱۰۰ کاناله', 'صف انتظار هوشمند', 'پایداری بدون بوق اشغال'],
      customerPurchaseWillingness: 78,
      customerEffortTier: 'T1',
      staffPerformanceScores: [
        { criterionId: 'rub-01', name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای', score: 92, weight: 15, feedback: 'شروع خوب و پرانرژی.' },
        { criterionId: 'rub-02', name: 'گوش دادن فعال و کشف نیازهای مشتری', score: 95, weight: 25, feedback: 'تشخیص سریع اهمیت بحران مسافران نوروزی.' },
        { criterionId: 'rub-03', name: 'پاسخ به ابهامات و ارزش‌آفرینی', score: 90, weight: 25, feedback: 'معرفی عالی قابلیت پاسخگویی خودکار.' },
        { criterionId: 'rub-04', name: 'تعیین شفاف اقدامات آتی و زمان‌بندی', score: 94, weight: 20, feedback: 'تعیین زمان دقیق تست برای چهارشنبه ۱۰ صبح.' },
        { criterionId: 'rub-05', name: 'رعایت استاندارد لحن و الزامات حرفه‌ای', score: 92, weight: 15, feedback: 'صبور و راهگشا.' }
      ],
      overallStaffScore: 92.8,
      coachingNotes: 'رسیدگی دقیق به مشتری نیازمند مقیاس‌پذیری آنی.',
      extractedTags: {
        customerTags: ['گردشگری-پیک-سفر', 'مرکز-تماس-ابری', 'نیازمند-مقیاس‌پذیری'],
        staffTags: ['پاسخگویی-سریع']
      }
    },
    tasksCreated: [initialFollowUpTasks[4]]
  },
  {
    id: 'call-006',
    direction: 'outbound',
    startTime: '2026-11-13T10:25:00Z',
    endTime: '2026-11-13T10:30:10Z',
    durationSec: 310,
    staffId: 'staff-02',
    customerId: 'cust-107',
    customerPhone: '۰۲۱-۸۸۴۴۱۱۰۲',
    customerName: 'هومن افشار',
    status: 'completed',
    diarizedTurns: [
      {
        speaker: 'Staff',
        startTime: 0,
        endTime: 5.0,
        text: 'درود جناب افشار، جواد صادقی هستم از تیم پشتیبانی شبکه ویپ. پیرو تیکت ترانک پشتیبان تماس می‌گیرم.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 5.8,
        endTime: 18.0,
        text: 'سلام آقای صادقی، ممنون از تماس شما. بله ما برای بیمه درمان باران نیاز داریم در صورت بروز هرگونه اختلال در دیتاسنتر اصلی، خطوط به دیتاسنتر فرعی سوئیچ بشه.',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        startTime: 18.8,
        endTime: 32.0,
        text: 'تنظیمات سوئیچ خودکار در لایه BGP انجام شده و تاییدیه آزمایشی موفق ثبت شد. گزارش مستندات پایداری رو در تیکت ضمیمه کردم.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 32.8,
        endTime: 40.0,
        text: 'بسیار از پیگیری مسئولانه شما سپاسگزارم. تیکت رو تایید و مختومه می‌کنم.',
        sentiment: 'positive'
      }
    ],
    analysis: {
      brief: 'جواد صادقی با هومن افشار (بیمه باران) جهت نهایی‌سازی ترانک رزرو تماس گرفت. تست انتقال خودکار BGP با موفقیت تایید و مستندات برای مشتری ارسال شد.',
      keyPoints: [
        'پایداری مسیرهای دیتاسنتر غرب برای بیمه باران.',
        'مختومه شدن تیکت رضایت‌بخش با تایید مشتری.'
      ],
      detectedSentiment: 'Positive',
      urgency: 'Medium',
      customerNeedsIdentified: ['ترانک بک‌آپ', 'تست سوئیچ خودکار BGP'],
      customerPurchaseWillingness: 68,
      customerEffortTier: 'T2',
      staffPerformanceScores: [
        { criterionId: 'rub-01', name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای', score: 92, weight: 15, feedback: 'پیگیری سریع و شفاف.' },
        { criterionId: 'rub-02', name: 'گوش دادن فعال و کشف نیازهای مشتری', score: 90, weight: 25, feedback: 'توضیحات کوتاه و مفید.' },
        { criterionId: 'rub-03', name: 'پاسخ به ابهامات و ارزش‌آفرینی', score: 94, weight: 25, feedback: 'حل کامل موضوع تیکت فنی.' },
        { criterionId: 'rub-04', name: 'تعیین شفاف اقدامات آتی و زمان‌بندی', score: 90, weight: 20, feedback: 'بستن دقیق اقدامات.' },
        { criterionId: 'rub-05', name: 'رعایت استاندارد لحن و الزامات حرفه‌ای', score: 95, weight: 15, feedback: 'حرفه‌ای و آرامش‌بخش.' }
      ],
      overallStaffScore: 92.2,
      coachingNotes: 'پیگیری منظم و بستن به موقع تیکت مشتری وفادار.',
      extractedTags: {
        customerTags: ['بیمه-خدمات-درمان'],
        staffTags: ['متخصص-فنی']
      }
    },
    tasksCreated: [initialFollowUpTasks[5]]
  },
  {
    id: 'call-007',
    direction: 'inbound',
    startTime: '2026-11-15T02:35:00Z',
    endTime: '2026-11-15T02:40:20Z',
    durationSec: 320,
    staffId: 'staff-04',
    customerId: 'cust-109',
    customerPhone: '۰۲۱-۶۶۲۲۵۵۸۸',
    customerName: 'مسعود رفیعی',
    status: 'completed',
    diarizedTurns: [
      {
        speaker: 'Staff',
        startTime: 0,
        endTime: 4.5,
        text: 'پشتیبانی ۲۴ ساعته ویپ، بهزاد کاظمی هستم. شب شما بخیر.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 5.0,
        endTime: 19.0,
        text: 'سلام آقای کاظمی، مسعود رفیعی هستم از کالا مارکت. در شیفت شب خریداران بابت تاخیر در سفارش پیام میدن و پشت خط طولانی می‌مونن. می‌خوام صف انتظار شیفت شب بازبینی بشه.',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        startTime: 19.8,
        endTime: 34.0,
        text: 'سلام جناب رفیعی. متوجه دغدغه شما در ساعات نیمه‌شب هستم. من لاگ ترافیک صف رو بررسی می‌کنم و اولویت توزیع تماس رو تا ساعت ۱۸ امروز بهینه‌سازی خواهم کرد.',
        sentiment: 'positive'
      }
    ],
    analysis: {
      brief: 'مسعود رفیعی (کالا مارکت) در تماس شبانه خواهان بهینه‌سازی صف انتظار شیفت شب شد. بهزاد کاظمی ثبت گزارش و اصلاح الگوریتم صف را تا عصر امروز متعهد شد.',
      keyPoints: [
        'پایش صف انتظار شبانه فروشگاه اینترنتی.',
        'بهینه‌سازی توزیع تماس اپراتورهای شیفت شب.'
      ],
      detectedSentiment: 'Neutral',
      urgency: 'Medium',
      customerNeedsIdentified: ['کاهش زمان انتظار صف شبانه', 'توزیع خودکار تماس'],
      customerPurchaseWillingness: 60,
      customerEffortTier: 'T2',
      staffPerformanceScores: [
        { criterionId: 'rub-01', name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای', score: 90, weight: 15, feedback: 'شروع خوب در ساعات بامداد.' },
        { criterionId: 'rub-02', name: 'گوش دادن فعال و کشف نیازهای مشتری', score: 88, weight: 25, feedback: 'درک دقیق مشکل فروشگاه.' },
        { criterionId: 'rub-03', name: 'پاسخ به ابهامات و ارزش‌آفرینی', score: 88, weight: 25, feedback: 'ارائه راهکار عملیاتی.' },
        { criterionId: 'rub-04', name: 'تعیین شفاف اقدامات آتی و زمان‌بندی', score: 92, weight: 20, feedback: 'تعیین مهلت ساعت ۱۸.' },
        { criterionId: 'rub-05', name: 'رعایت استاندارد لحن و الزامات حرفه‌ای', score: 92, weight: 15, feedback: 'صبور و دقیق.' }
      ],
      overallStaffScore: 89.8,
      coachingNotes: 'پاسخگویی بسیار مناسب در شیفت شبانه.',
      extractedTags: {
        customerTags: ['تجارت-الکترونیک', 'پشتیبانی-۲۴-ساعته'],
        staffTags: ['پشتیبانی-۲۴-ساعته']
      }
    },
    tasksCreated: [initialFollowUpTasks[6]]
  },
  {
    id: 'call-008',
    direction: 'outbound',
    startTime: '2026-11-15T10:05:00Z',
    endTime: '2026-11-15T10:10:05Z',
    durationSec: 305,
    staffId: 'staff-05',
    customerId: 'cust-110',
    customerPhone: '۰۲۱-۸۸۳۳۷۷۹۹',
    customerName: 'شیما میرزایی',
    status: 'completed',
    diarizedTurns: [
      {
        speaker: 'Staff',
        startTime: 0,
        endTime: 4.5,
        text: 'درود سرکار خانم میرزایی، الهام ناصری هستم از واحد مدیریت مشتریان سازمانی.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 5.0,
        endTime: 16.0,
        text: 'سلام خانم ناصری وقت شما بخیر. می‌خواستم وضعیت گزارش کمپین تلفنی متقاضیان دوره MBA زمستان رو جویا بشم.',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        startTime: 16.8,
        endTime: 30.0,
        text: 'سلام خانم میرزایی. گزارش تفکیکی نرخ پاسخگویی و برچسب‌های علاقه استخراج شده و فایل اکسل کامل تا ساعت ۱۶ امروز به ایمیل شما ارسال خواهد شد.',
        sentiment: 'positive'
      }
    ],
    analysis: {
      brief: 'الهام ناصری با شیما میرزایی (آینده‌پژوهان) پیرامون گزارش آماری کمپین ثبت‌نام دوره MBA گفتگو کرد و تحویل گزارش تفکیکی را تا ساعت ۱۶ نهایی کرد.',
      keyPoints: [
        'ارائه خروجی تحلیلی کمپین جذب دانشجو.',
        'نرخ پاسخگویی مثبت بالاتر از میانگین دوره‌های پیشین.'
      ],
      detectedSentiment: 'Positive',
      urgency: 'Low',
      customerNeedsIdentified: ['گزارش آماری اکسل', 'تحلیل رضایت متقاضیان'],
      customerPurchaseWillingness: 75,
      customerEffortTier: 'T2',
      staffPerformanceScores: [
        { criterionId: 'rub-01', name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای', score: 94, weight: 15, feedback: 'مودبانه و بسیار محترم.' },
        { criterionId: 'rub-02', name: 'گوش دادن فعال و کشف نیازهای مشتری', score: 92, weight: 25, feedback: 'اشراف به موضوع کمپین.' },
        { criterionId: 'rub-03', name: 'پاسخ به ابهامات و ارزش‌آفرینی', score: 92, weight: 25, feedback: 'ارائه گزارش تحلیلی باارزش.' },
        { criterionId: 'rub-04', name: 'تعیین شفاف اقدامات آتی و زمان‌بندی', score: 94, weight: 20, feedback: 'تحویل در موعد مقرر.' },
        { criterionId: 'rub-05', name: 'رعایت استاندارد لحن و الزامات حرفه‌ای', score: 95, weight: 15, feedback: 'عالی.' }
      ],
      overallStaffScore: 93.4,
      coachingNotes: 'ارتباط مستمر و بسیار قوی با مشتریان سازمانی.',
      extractedTags: {
        customerTags: ['آموزش-عالی'],
        staffTags: ['مدیریت-حساب-کلیدی']
      }
    },
    tasksCreated: [initialFollowUpTasks[7]]
  },
  {
    id: 'call-009',
    direction: 'inbound',
    startTime: '2026-11-08T11:20:00Z',
    endTime: '2026-11-08T11:24:30Z',
    durationSec: 270,
    staffId: 'staff-01',
    customerId: 'cust-101',
    customerPhone: '۰۲۱-۸۸۲۲۳۳۴۴',
    customerName: 'سارا رادمنش',
    status: 'completed',
    diarizedTurns: [
      {
        speaker: 'Staff',
        startTime: 0,
        endTime: 4.0,
        text: 'وقت بخیر، ارتباطات ویپ، رضایی هستم. در خدمتم.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 4.5,
        endTime: 17.0,
        text: 'سلام آقای رضایی، سارا رادمنش هستم از هلدینگ لجستیک آپادانا. می‌خواستم در خصوص استانداردهای اتصال SIP Trunk به زیرساخت داخلی سوال بپرسم.',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        startTime: 17.5,
        endTime: 30.0,
        text: 'سلام خانم رادمنش. سیستم ما سازگار با کلیه تجهیزات استاندارد صنعتی و پروتکل‌های امن TLS/SRTP هست و داکیومنت فنی براتون ارسال میشه.',
        sentiment: 'positive'
      }
    ],
    analysis: {
      brief: 'تماس اولیه خانم رادمنش برای ارزیابی الزامات فنی SIP Trunk و استانداردهای اتصال با شبکه آپادانا.',
      keyPoints: [
        'بررسی اولیه پروتکل‌های امنیتی و پشتیبانی از TLS/SRTP.',
        'ارسال مستندات فنی معماری ترانک.'
      ],
      detectedSentiment: 'Neutral',
      urgency: 'Medium',
      customerNeedsIdentified: ['مستندات معماری ترانک', 'سازگاری با تجهیزات سانترال'],
      customerPurchaseWillingness: 80,
      customerEffortTier: 'T1',
      staffPerformanceScores: [
        { criterionId: 'rub-01', name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای', score: 95, weight: 15, feedback: 'بسیار محترمانه.' },
        { criterionId: 'rub-02', name: 'گوش دادن فعال و کشف نیازهای مشتری', score: 92, weight: 25, feedback: 'شناسایی دقیق نیازهای امنیتی.' },
        { criterionId: 'rub-03', name: 'پاسخ به ابهامات و ارزش‌آفرینی', score: 94, weight: 25, feedback: 'توضیحات فنی شفاف.' },
        { criterionId: 'rub-04', name: 'تعیین شفاف اقدامات آتی و زمان‌بندی', score: 90, weight: 20, feedback: 'ارسال سریع مستندات.' },
        { criterionId: 'rub-05', name: 'رعایت استاندارد لحن و الزامات حرفه‌ای', score: 95, weight: 15, feedback: 'عالی.' }
      ],
      overallStaffScore: 93.0,
      coachingNotes: 'پاسخ‌گویی فنی سریع و هدایت موثر مشتری به سمت بررسی نهایی.',
      extractedTags: {
        customerTags: ['مشتری-سازمانی', 'استعلام-فنی'],
        staffTags: ['تسلط-فنی']
      }
    },
    tasksCreated: []
  },
  {
    id: 'call-010',
    direction: 'outbound',
    startTime: '2026-11-11T15:30:00Z',
    endTime: '2026-11-11T15:35:10Z',
    durationSec: 310,
    staffId: 'staff-02',
    customerId: 'cust-103',
    customerPhone: '۰۲۱-۲۲۱۱۰۰۹۹',
    customerName: 'الناز رستگار',
    status: 'completed',
    diarizedTurns: [
      {
        speaker: 'Staff',
        startTime: 0,
        endTime: 5.0,
        text: 'درود سرکار خانم رستگار، صادقی هستم از تیم پشتیبانی ارشد. تماس گرفتم وضعیت خطوط درگاه پاسارگاد رو بررسی کنیم.',
        sentiment: 'positive'
      },
      {
        speaker: 'Customer',
        startTime: 5.5,
        endTime: 16.0,
        text: 'سلام آقای صادقی. بعد از تغییرات دیتاسنتر اول وضعیت پایدار بود اما همچنان در ساعات پایانی شب نگران ترافیک تراکنشی هستیم.',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        startTime: 16.8,
        endTime: 29.0,
        text: 'ما پهنای باند گیت‌وی رزرو رو ۲۰ درصد افزایش دادیم و مانیتورینگ بلادرنگ ۲۴ ساعته بر روی آدرس IP سرورهای شما فعاله.',
        sentiment: 'positive'
      }
    ],
    analysis: {
      brief: 'تماس پیگیری جواد صادقی با الناز رستگار (پرداخت پاسارگاد) جهت بررسی عملکرد خطوط پس از افزایش پهنای باند و مانیتورینگ ترافیک شبانه.',
      keyPoints: [
        'پایداری خطوط بعد از اقدامات اصلاحی دیتاسنتر.',
        'افزایش ۲۰ درصدی ظرفیت گیت‌وی پشتیبان برای مهار نوسانات تراکنشی.'
      ],
      detectedSentiment: 'Positive',
      urgency: 'Medium',
      customerNeedsIdentified: ['پایش مداوم ترافیک شبانه', 'تضمین پایداری خطوط پرداخت'],
      customerPurchaseWillingness: 65,
      customerEffortTier: 'T1',
      staffPerformanceScores: [
        { criterionId: 'rub-01', name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای', score: 92, weight: 15, feedback: 'پیگیری پیش‌دستانه و حرفه‌ای.' },
        { criterionId: 'rub-02', name: 'گوش دادن فعال و کشف نیازهای مشتری', score: 90, weight: 25, feedback: 'توجه به نگرانی ساعات شبانه.' },
        { criterionId: 'rub-03', name: 'پاسخ به ابهامات و ارزش‌آفرینی', score: 94, weight: 25, feedback: 'اطمینان‌بخشی با اقدامات عملی.' },
        { criterionId: 'rub-04', name: 'تعیین شفاف اقدامات آتی و زمان‌بندی', score: 92, weight: 20, feedback: 'نظارت مستمر.' },
        { criterionId: 'rub-05', name: 'رعایت استاندارد لحن و الزامات حرفه‌ای', score: 94, weight: 15, feedback: 'بسیار خوب.' }
      ],
      overallStaffScore: 92.4,
      coachingNotes: 'نمونه موفق تماس خروجی پیش‌دستانه جهت کاهش ریسک ریزش مشتری بحرانی.',
      extractedTags: {
        customerTags: ['مشتری-کلیدی-VIP', 'فین‌تک-بانکی'],
        staffTags: ['پیگیری-پیش‌دستانه']
      }
    },
    tasksCreated: []
  }
];

export const simulationPresets = [
  {
    id: 'sim-new-enterprise',
    name: 'سناریوی ۱: استعلام سازمان با ارزش بالا (لجستیک آپادانا)',
    description: 'سارا رادمنش (لجستیک آپادانا) متقاضی ترانک ۲۵۰ کاناله با تضمین پایداری ۹۹.۹۹۹٪.',
    customer: initialCustomers[0],
    staff: initialStaff[0],
    diarizedTurns: initialCalls[0].diarizedTurns,
    analysis: initialCalls[0].analysis,
    task: initialCalls[0].tasksCreated[0]
  },
  {
    id: 'sim-price-hesitation',
    name: 'سناریوی ۲: ابهام بودجه و مقایسه هزینه (خرده‌فروشی نوین)',
    description: 'داوود خلیلی (خرده‌فروشی نوین) در حال بررسی خرید سامانه در برابر توسعه مستقیم API.',
    customer: initialCustomers[1],
    staff: initialStaff[2],
    diarizedTurns: initialCalls[1].diarizedTurns,
    analysis: initialCalls[1].analysis,
    task: initialCalls[1].tasksCreated[0]
  },
  {
    id: 'sim-critical-escalation',
    name: 'سناریوی ۳: ارجاع فوری مشتری ویژه VIP (پرداخت پاسارگاد)',
    description: 'الناز رستگار (پرداخت پاسارگاد) در اعتراض به افت پکت با تهدید لغو قرارداد.',
    customer: initialCustomers[2],
    staff: initialStaff[1],
    diarizedTurns: initialCalls[2].diarizedTurns,
    analysis: initialCalls[2].analysis,
    task: initialCalls[2].tasksCreated[0]
  },
  {
    id: 'sim-crm-integration',
    name: 'سناریوی ۴: یکپارچه‌سازی CTI با Microsoft Dynamics (فولاد دماوند)',
    description: 'مهندس کامران شریفی (فولاد دماوند) متقاضی پاپ‌آپ CTI و ذخیره‌سازی مکالمات در CRM سازمانی.',
    customer: initialCustomers[4],
    staff: initialStaff[0],
    diarizedTurns: initialCalls[3].diarizedTurns,
    analysis: initialCalls[3].analysis,
    task: initialCalls[3].tasksCreated[0]
  },
  {
    id: 'sim-cloud-queue-peak',
    name: 'سناریوی ۵: صف انتظار ابری در پیک ترافیک نوروزی (پرواز ۲۴)',
    description: 'نگار اسدی (پرواز ۲۴) نیازمند افزایش فوری ظرفیت به ۱۰۰ کانال و جلوگیری از بوق اشغال.',
    customer: initialCustomers[5],
    staff: initialStaff[2],
    diarizedTurns: initialCalls[4].diarizedTurns,
    analysis: initialCalls[4].analysis,
    task: initialCalls[4].tasksCreated[0]
  },
  {
    id: 'sim-brand-new-caller',
    name: 'سناریوی ۶: تماس‌گیرنده جدید ناشناس (ثبت خودکار پرونده)',
    description: 'تماس سرنخ جدید با شماره ناشناس و ایجاد خودکار پرونده مشتری و وظایف پس از اتمام تماس.',
    customer: {
      id: 'cust-new-gen',
      phone: '۰۲۱-۶۶۳۳۴۴۵۵',
      name: 'محمدرضا وثوق',
      company: 'تجهیزات پزشکی پارس',
      email: 'm.vosough@parsmed.ir',
      needs: ['تلفن نرم‌افزاری امن درمانگاهی', 'اتصال به اپلیکیشن موبایل پرسنل'],
      purchaseWillingness: 85,
      effortTier: 'T1' as const,
      tags: ['سرنخ-جدید', 'حوزه-درمان'],
      totalCalls: 1,
      lastCallDate: new Date().toISOString(),
      notes: 'تماس از طریق کمپین معرفی خدمات. خواهان استقرار ۴۵ داخلی برای ۳ درمانگاه.'
    },
    staff: initialStaff[0],
    diarizedTurns: [
      {
        speaker: 'Staff' as const,
        startTime: 0,
        endTime: 4.0,
        text: 'با درود، سامانه ارتباطات ویپ، علی رضایی هستم. در خدمتم.',
        sentiment: 'positive' as const
      },
      {
        speaker: 'Customer' as const,
        startTime: 4.8,
        endTime: 16.5,
        text: 'سلام آقای رضایی، محمدرضا وثوق هستم از تجهیزات پزشکی پارس. برای ۴۵ نفر از پرسنل در ۳ درمانگاه نیاز به تلفن نرم‌افزاری امن با تفکیک داخلی داریم.',
        sentiment: 'neutral' as const
      },
      {
        speaker: 'Staff' as const,
        startTime: 17.0,
        endTime: 28.0,
        text: 'سلام جناب وثوق، خوش‌آمدید. بله ما راهکار ویژه مراکز درمانی با بالاترین استاندارد رمزنگاری تماس و اپلیکیشن پرسنلی داریم و به راحتی از ۴۵ کاربر شما پشتیبانی می‌کنه.',
        sentiment: 'positive' as const
      },
      {
        speaker: 'Customer' as const,
        startTime: 28.5,
        endTime: 36.0,
        text: 'بسیار عالی. ممکنه تعرفه‌ها رو بفرستید و یک جلسه دمو برای پنجشنبه ساعت ۱۱ صبح تنظیم کنیم؟',
        sentiment: 'positive' as const
      },
      {
        speaker: 'Staff' as const,
        startTime: 36.8,
        endTime: 45.0,
        text: 'حتماً، پنجشنبه ساعت ۱۱ صبح رزرو شد. کاتالوگ و مشخصات کامل بلافاصله خدمتتون ایمیل میشه.',
        sentiment: 'positive' as const
      }
    ],
    analysis: {
      brief: 'مشتری جدید محمدرضا وثوق (تجهیزات پزشکی پارس) برای استقرار ۴۵ داخلی امن در ۳ درمانگاه تماس گرفت. تمایل خرید بالا و دمو برای پنجشنبه ساعت ۱۱:۰۰ صبح تنظیم شد.',
      keyPoints: [
        'تشکیل خودکار پرونده مشتری از روی صوت تماس.',
        '۴۵ داخلی برای مراکز درمانی با رمزنگاری صوتی.',
        'جلسه دمو برای پنجشنبه ساعت ۱۱:۰۰ ثبت شد.'
      ],
      detectedSentiment: 'Very Positive' as const,
      urgency: 'Medium' as const,
      customerNeedsIdentified: ['تلفن نرم‌افزاری امن', 'استقرار چند شعبه‌ای', 'تعرفه سازمانی'],
      customerPurchaseWillingness: 85,
      customerEffortTier: 'T1' as const,
      staffPerformanceScores: [
        { criterionId: 'rub-01', name: 'خوش‌آمدگویی و برقراری ارتباط حرفه‌ای', score: 95, weight: 15, feedback: 'سریع و محترمانه.' },
        { criterionId: 'rub-02', name: 'گوش دادن فعال و کشف نیازهای مشتری', score: 92, weight: 25, feedback: 'تشخیص سریع الزامات درمانی.' },
        { criterionId: 'rub-03', name: 'پاسخ به ابهامات و ارزش‌آفرینی', score: 90, weight: 25, feedback: 'اطمینان‌بخشی درباره امنیت.' },
        { criterionId: 'rub-04', name: 'تعیین شفاف اقدامات آتی و زمان‌بندی', score: 94, weight: 20, feedback: 'هماهنگی فوری جلسه دمو.' },
        { criterionId: 'rub-05', name: 'رعایت استاندارد لحن و الزامات حرفه‌ای', score: 96, weight: 15, feedback: 'بسیار حرفه‌ای.' }
      ],
      overallStaffScore: 93.1,
      coachingNotes: 'سرعت و دقت عالی در اولین تماس ورودی سرنخ جدید.',
      extractedTags: {
        customerTags: ['سرنخ-جدید', 'حوزه-درمان'],
        staffTags: ['کارشناس-برتر']
      }
    },
    task: {
      id: 'task-304',
      callId: 'call-004-new',
      customerId: 'cust-new-gen',
      customerName: 'محمدرضا وثوق (تجهیزات پزشکی پارس)',
      assignedStaffId: 'staff-01',
      staffName: 'علی رضایی',
      title: 'ارسال کاتالوگ و تدارک جلسه دموی پنجشنبه',
      description: 'تهیه پیش‌فاکتور ۴۵ کاربر درمانی و ارسال لینک جلسه آنلاین برای روز پنجشنبه ساعت ۱۱:۰۰ صبح.',
      dueTime: '2026-11-19T11:00:00Z',
      deadline: 'پنجشنبه ساعت ۱۱:۰۰ صبح',
      priority: 'High' as const,
      status: 'Pending' as const,
      createdAt: new Date().toISOString()
    }
  }
];
