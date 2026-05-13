export type AppLocale = 'en' | 'ar' | 'fr' | 'es' | 'de' | 'ja' | 'zh';

export const LOCALES: Array<{
  code: AppLocale;
  label: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}> = [
  { code: 'en', label: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  { code: 'zh', label: 'Chinese', nativeName: '中文', dir: 'ltr' },
];

export const DEFAULT_LOCALE: AppLocale = 'en';

export type TranslationKey =
  | 'nav.home'
  | 'nav.news'
  | 'nav.sources'
  | 'nav.about'
  | 'nav.faq'
  | 'nav.map'
  | 'home.badge'
  | 'home.title'
  | 'home.description'
  | 'home.mapCta'
  | 'home.newsCta'
  | 'home.latest'
  | 'home.categories'
  | 'news.title'
  | 'news.description'
  | 'news.read'
  | 'article.back'
  | 'article.source'
  | 'article.disclaimer'
  | 'common.healthNews'
  | 'common.region'
  | 'common.category'
  | 'common.confidence'
  | 'about.title'
  | 'about.description'
  | 'faq.title'
  | 'faq.description'
  | 'sources.title'
  | 'sources.description'
  | 'disclaimer.title'
  | 'disclaimer.description'
  | 'map.title'
  | 'map.description'
  | 'map.open';

export const messages: Record<AppLocale, Record<TranslationKey, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.news': 'Health News',
    'nav.sources': 'Sources',
    'nav.about': 'About',
    'nav.faq': 'FAQ',
    'nav.map': 'Live Map',
    'home.badge': 'Global Health Intelligence',
    'home.title': 'Global health news, medical trends, and public-health alerts.',
    'home.description':
      'HantaUpdates tracks health stories from the United States, Europe, Asia, the Arab region, and official public-health sources.',
    'home.mapCta': 'Open Live Map',
    'home.newsCta': 'Browse Health News',
    'home.latest': 'Latest health updates',
    'home.categories': 'Trending categories',
    'news.title': 'Global health news and trending medical updates.',
    'news.description':
      'Daily health trend coverage across public health, outbreaks, mental health, wellness, medical research, and healthcare technology.',
    'news.read': 'Read article',
    'article.back': 'Back to health news',
    'article.source': 'Original source',
    'article.disclaimer':
      'This article is informational only and does not provide medical advice.',
    'common.healthNews': 'Health News',
    'common.region': 'Region',
    'common.category': 'Category',
    'common.confidence': 'Confidence',
    'about.title': 'About HantaUpdates',
    'about.description':
      'HantaUpdates is a global health news and trend-monitoring site. It summarizes health signals, medical stories, and public-health updates without panic-driven language.',
    'faq.title': 'Frequently asked questions',
    'faq.description':
      'Simple answers about how HantaUpdates works and how to read health updates safely.',
    'sources.title': 'Sources and references',
    'sources.description':
      'HantaUpdates prioritizes official health agencies, reputable medical sources, and regional health news feeds.',
    'disclaimer.title': 'Medical disclaimer',
    'disclaimer.description':
      'HantaUpdates is for informational purposes only. It does not provide medical advice, diagnosis, or treatment.',
    'map.title': 'Live outbreak map',
    'map.description':
      'The interactive map is hosted on our dedicated tracker website.',
    'map.open': 'Open map on HantaMap',
  },

  ar: {
    'nav.home': 'الرئيسية',
    'nav.news': 'الأخبار الصحية',
    'nav.sources': 'المصادر',
    'nav.about': 'حول الموقع',
    'nav.faq': 'الأسئلة',
    'nav.map': 'الخريطة المباشرة',
    'home.badge': 'متابعة صحية عالمية',
    'home.title': 'أخبار صحية عالمية، ترندات طبية، وتنبيهات صحة عامة.',
    'home.description':
      'يتابع HantaUpdates الأخبار الصحية من أمريكا وأوروبا وآسيا والعالم العربي والمصادر الصحية الرسمية.',
    'home.mapCta': 'فتح الخريطة المباشرة',
    'home.newsCta': 'تصفح الأخبار الصحية',
    'home.latest': 'آخر التحديثات الصحية',
    'home.categories': 'الأقسام الرائجة',
    'news.title': 'أخبار صحية عالمية وتحديثات طبية رائجة.',
    'news.description':
      'تغطية يومية للترندات الصحية، التفشيات، الصحة النفسية، العافية، الأبحاث الطبية، والتقنيات الصحية.',
    'news.read': 'قراءة المقال',
    'article.back': 'العودة إلى الأخبار الصحية',
    'article.source': 'المصدر الأصلي',
    'article.disclaimer':
      'هذا المقال لغرض المعلومات فقط ولا يقدم نصيحة طبية.',
    'common.healthNews': 'أخبار صحية',
    'common.region': 'المنطقة',
    'common.category': 'القسم',
    'common.confidence': 'الثقة',
    'about.title': 'حول HantaUpdates',
    'about.description':
      'HantaUpdates موقع عالمي لمتابعة الأخبار الصحية والترندات الطبية، يعرض الإشارات الصحية والتحديثات بدون تهويل.',
    'faq.title': 'الأسئلة الشائعة',
    'faq.description':
      'إجابات مختصرة حول طريقة عمل الموقع وكيفية قراءة الأخبار الصحية بأمان.',
    'sources.title': 'المصادر والمراجع',
    'sources.description':
      'يعتمد HantaUpdates على الجهات الصحية الرسمية والمصادر الطبية الموثوقة وتدفقات الأخبار الإقليمية.',
    'disclaimer.title': 'إخلاء مسؤولية طبي',
    'disclaimer.description':
      'HantaUpdates موقع معلوماتي فقط، ولا يقدم نصيحة طبية أو تشخيصًا أو علاجًا.',
    'map.title': 'الخريطة المباشرة',
    'map.description':
      'الخريطة التفاعلية موجودة في موقع التتبع المستقل الخاص بنا.',
    'map.open': 'فتح الخريطة في HantaMap',
  },

  fr: {
    'nav.home': 'Accueil',
    'nav.news': 'Santé',
    'nav.sources': 'Sources',
    'nav.about': 'À propos',
    'nav.faq': 'FAQ',
    'nav.map': 'Carte live',
    'home.badge': 'Veille santé mondiale',
    'home.title': 'Actualités santé, tendances médicales et alertes publiques.',
    'home.description':
      'HantaUpdates suit les sujets santé aux États-Unis, en Europe, en Asie, dans le monde arabe et auprès des sources officielles.',
    'home.mapCta': 'Ouvrir la carte',
    'home.newsCta': 'Voir les actualités',
    'home.latest': 'Dernières mises à jour',
    'home.categories': 'Catégories tendance',
    'news.title': 'Actualités santé mondiales et tendances médicales.',
    'news.description':
      'Couverture quotidienne des tendances santé, épidémies, santé mentale, bien-être, recherche médicale et technologies de santé.',
    'news.read': 'Lire l’article',
    'article.back': 'Retour aux actualités',
    'article.source': 'Source originale',
    'article.disclaimer':
      'Cet article est informatif et ne constitue pas un avis médical.',
    'common.healthNews': 'Actualité santé',
    'common.region': 'Région',
    'common.category': 'Catégorie',
    'common.confidence': 'Fiabilité',
    'about.title': 'À propos de HantaUpdates',
    'about.description':
      'HantaUpdates est un site mondial de veille santé et de tendances médicales, sans langage alarmiste.',
    'faq.title': 'Questions fréquentes',
    'faq.description':
      'Réponses simples sur le fonctionnement du site et la lecture des informations santé.',
    'sources.title': 'Sources et références',
    'sources.description':
      'HantaUpdates privilégie les agences officielles, les sources médicales fiables et les flux régionaux.',
    'disclaimer.title': 'Avertissement médical',
    'disclaimer.description':
      'HantaUpdates est uniquement informatif et ne fournit pas de conseil médical.',
    'map.title': 'Carte interactive',
    'map.description':
      'La carte interactive est hébergée sur notre site de suivi dédié.',
    'map.open': 'Ouvrir la carte HantaMap',
  },

  es: {
    'nav.home': 'Inicio',
    'nav.news': 'Salud',
    'nav.sources': 'Fuentes',
    'nav.about': 'Acerca de',
    'nav.faq': 'FAQ',
    'nav.map': 'Mapa en vivo',
    'home.badge': 'Inteligencia global de salud',
    'home.title': 'Noticias de salud, tendencias médicas y alertas públicas.',
    'home.description':
      'HantaUpdates sigue temas de salud en EE. UU., Europa, Asia, el mundo árabe y fuentes oficiales.',
    'home.mapCta': 'Abrir mapa',
    'home.newsCta': 'Ver noticias',
    'home.latest': 'Últimas actualizaciones',
    'home.categories': 'Categorías tendencia',
    'news.title': 'Noticias globales de salud y tendencias médicas.',
    'news.description':
      'Cobertura diaria de salud pública, brotes, salud mental, bienestar, investigación médica y tecnología sanitaria.',
    'news.read': 'Leer artículo',
    'article.back': 'Volver a noticias',
    'article.source': 'Fuente original',
    'article.disclaimer':
      'Este artículo es informativo y no ofrece consejo médico.',
    'common.healthNews': 'Noticias de salud',
    'common.region': 'Región',
    'common.category': 'Categoría',
    'common.confidence': 'Confianza',
    'about.title': 'Acerca de HantaUpdates',
    'about.description':
      'HantaUpdates es un sitio global de noticias y tendencias de salud, sin lenguaje alarmista.',
    'faq.title': 'Preguntas frecuentes',
    'faq.description':
      'Respuestas simples sobre cómo funciona el sitio y cómo leer actualizaciones de salud.',
    'sources.title': 'Fuentes y referencias',
    'sources.description':
      'HantaUpdates prioriza agencias oficiales, fuentes médicas confiables y noticias regionales.',
    'disclaimer.title': 'Aviso médico',
    'disclaimer.description':
      'HantaUpdates es solo informativo y no proporciona consejo médico.',
    'map.title': 'Mapa en vivo',
    'map.description':
      'El mapa interactivo está alojado en nuestro sitio de seguimiento dedicado.',
    'map.open': 'Abrir mapa en HantaMap',
  },

  de: {
    'nav.home': 'Start',
    'nav.news': 'Gesundheit',
    'nav.sources': 'Quellen',
    'nav.about': 'Über uns',
    'nav.faq': 'FAQ',
    'nav.map': 'Live-Karte',
    'home.badge': 'Globale Gesundheitsbeobachtung',
    'home.title': 'Globale Gesundheitsnachrichten, medizinische Trends und Warnungen.',
    'home.description':
      'HantaUpdates beobachtet Gesundheitsthemen aus den USA, Europa, Asien, der arabischen Region und offiziellen Quellen.',
    'home.mapCta': 'Live-Karte öffnen',
    'home.newsCta': 'Nachrichten lesen',
    'home.latest': 'Aktuelle Updates',
    'home.categories': 'Trend-Kategorien',
    'news.title': 'Globale Gesundheitsnachrichten und medizinische Trends.',
    'news.description':
      'Tägliche Berichte zu Public Health, Ausbrüchen, mentaler Gesundheit, Wellness, Forschung und Gesundheitstechnologie.',
    'news.read': 'Artikel lesen',
    'article.back': 'Zurück zu Nachrichten',
    'article.source': 'Originalquelle',
    'article.disclaimer':
      'Dieser Artikel dient nur der Information und ist keine medizinische Beratung.',
    'common.healthNews': 'Gesundheitsnachrichten',
    'common.region': 'Region',
    'common.category': 'Kategorie',
    'common.confidence': 'Vertrauen',
    'about.title': 'Über HantaUpdates',
    'about.description':
      'HantaUpdates ist eine globale Website für Gesundheitsnachrichten und medizinische Trends ohne Panik-Sprache.',
    'faq.title': 'Häufige Fragen',
    'faq.description':
      'Einfache Antworten zur Nutzung der Website und zum sicheren Lesen von Gesundheitsinformationen.',
    'sources.title': 'Quellen und Referenzen',
    'sources.description':
      'HantaUpdates priorisiert offizielle Gesundheitsbehörden, seriöse medizinische Quellen und regionale Nachrichten.',
    'disclaimer.title': 'Medizinischer Hinweis',
    'disclaimer.description':
      'HantaUpdates dient nur der Information und ersetzt keine medizinische Beratung.',
    'map.title': 'Live-Ausbruchskarte',
    'map.description':
      'Die interaktive Karte befindet sich auf unserer separaten Tracker-Website.',
    'map.open': 'Karte auf HantaMap öffnen',
  },

  ja: {
    'nav.home': 'ホーム',
    'nav.news': '健康ニュース',
    'nav.sources': '情報源',
    'nav.about': '概要',
    'nav.faq': 'FAQ',
    'nav.map': 'ライブマップ',
    'home.badge': 'グローバル健康トレンド',
    'home.title': '世界の健康ニュース、医療トレンド、公衆衛生アラート。',
    'home.description':
      'HantaUpdates は米国、欧州、アジア、アラブ地域、公的機関の健康関連ニュースを追跡します。',
    'home.mapCta': 'ライブマップを開く',
    'home.newsCta': '健康ニュースを見る',
    'home.latest': '最新の健康アップデート',
    'home.categories': '注目カテゴリ',
    'news.title': '世界の健康ニュースと医療トレンド。',
    'news.description':
      '公衆衛生、感染症、メンタルヘルス、ウェルネス、医療研究、ヘルステックの最新情報。',
    'news.read': '記事を読む',
    'article.back': '健康ニュースに戻る',
    'article.source': '元の情報源',
    'article.disclaimer':
      'この記事は情報提供のみを目的としており、医療アドバイスではありません。',
    'common.healthNews': '健康ニュース',
    'common.region': '地域',
    'common.category': 'カテゴリ',
    'common.confidence': '信頼度',
    'about.title': 'HantaUpdates について',
    'about.description':
      'HantaUpdates は世界の健康ニュースと医療トレンドを分かりやすく伝えるサイトです。',
    'faq.title': 'よくある質問',
    'faq.description':
      'サイトの使い方と健康情報の読み方に関する簡単な回答です。',
    'sources.title': '情報源',
    'sources.description':
      'HantaUpdates は公的機関、信頼できる医療情報源、地域ニュースを優先します。',
    'disclaimer.title': '医療免責事項',
    'disclaimer.description':
      'HantaUpdates は情報提供のみを目的としており、診断や治療を提供しません。',
    'map.title': 'ライブマップ',
    'map.description':
      'インタラクティブマップは専用の追跡サイトで提供されています。',
    'map.open': 'HantaMap を開く',
  },

  zh: {
    'nav.home': '首页',
    'nav.news': '健康新闻',
    'nav.sources': '来源',
    'nav.about': '关于',
    'nav.faq': '常见问题',
    'nav.map': '实时地图',
    'home.badge': '全球健康趋势',
    'home.title': '全球健康新闻、医学趋势与公共卫生提醒。',
    'home.description':
      'HantaUpdates 追踪美国、欧洲、亚洲、阿拉伯地区以及官方公共卫生来源的健康新闻。',
    'home.mapCta': '打开实时地图',
    'home.newsCta': '浏览健康新闻',
    'home.latest': '最新健康更新',
    'home.categories': '热门分类',
    'news.title': '全球健康新闻与医学趋势。',
    'news.description':
      '每日覆盖公共卫生、疫情、心理健康、健康生活、医学研究和医疗技术。',
    'news.read': '阅读文章',
    'article.back': '返回健康新闻',
    'article.source': '原始来源',
    'article.disclaimer':
      '本文仅供参考，不构成医疗建议。',
    'common.healthNews': '健康新闻',
    'common.region': '地区',
    'common.category': '分类',
    'common.confidence': '可信度',
    'about.title': '关于 HantaUpdates',
    'about.description':
      'HantaUpdates 是一个全球健康新闻和医学趋势监测网站，避免夸张和恐慌式表达。',
    'faq.title': '常见问题',
    'faq.description':
      '关于网站如何运作以及如何安全阅读健康资讯的简明回答。',
    'sources.title': '来源与参考',
    'sources.description':
      'HantaUpdates 优先使用官方卫生机构、可靠医学来源和地区健康新闻。',
    'disclaimer.title': '医疗免责声明',
    'disclaimer.description':
      'HantaUpdates 仅供信息参考，不提供医疗建议、诊断或治疗。',
    'map.title': '实时疫情地图',
    'map.description':
      '互动地图托管在我们的独立追踪网站上。',
    'map.open': '打开 HantaMap',
  },
};

export function isAppLocale(value: string | null): value is AppLocale {
  return value === 'en' || value === 'ar' || value === 'fr' || value === 'es' || value === 'de' || value === 'ja' || value === 'zh';
}

export function getLocaleDirection(locale: AppLocale): 'ltr' | 'rtl' {
  return LOCALES.find((item) => item.code === locale)?.dir ?? 'ltr';
}

export function translate(locale: AppLocale, key: TranslationKey): string {
  return messages[locale]?.[key] ?? messages[DEFAULT_LOCALE][key] ?? key;
}