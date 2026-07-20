// Subscription Categories
export const CATEGORIES = [
  { id: 'entertainment', name: 'Entertainment', color: '#ec4899', icon: 'Tv' },
  { id: 'utilities', name: 'Utilities & Cloud', color: '#3b82f6', icon: 'Cpu' },
  { id: 'work', name: 'Work & Productivity', color: '#10b981', icon: 'Briefcase' },
  { id: 'health', name: 'Health & Fitness', color: '#ef4444', icon: 'Heart' },
  { id: 'education', name: 'Education & News', color: '#f59e0b', icon: 'BookOpen' },
  { id: 'finance', name: 'Finance & Insurance', color: '#8b5cf6', icon: 'DollarSign' },
  { id: 'other', name: 'Other', color: '#6b7280', icon: 'Grid' }
];

// Currencies
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

// Billing Cycles
export const BILLING_CYCLES = [
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'yearly', name: 'Yearly' }
];

// Popular Subscriptions Catalogue
export const SERVICE_CATALOGUE = [
  {
    name: 'Netflix',
    logo: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
    category: 'entertainment',
    defaultCost: 649,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#E50914',
    website: 'https://netflix.com'
  },
  {
    name: 'Spotify',
    logo: 'https://www.scdn.co/lyric-find/assets/images/favicon.png',
    category: 'entertainment',
    defaultCost: 179,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#1DB954',
    website: 'https://spotify.com'
  },
  {
    name: 'YouTube Premium',
    logo: 'https://www.youtube.com/s/desktop/4f80164b/img/favicon_144x144.png',
    category: 'entertainment',
    defaultCost: 149,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#FF0000',
    website: 'https://youtube.com'
  },
  {
    name: 'Amazon Prime',
    logo: 'https://www.amazon.in/favicon.ico',
    category: 'entertainment',
    defaultCost: 1499,
    defaultCurrency: 'INR',
    defaultCycle: 'yearly',
    color: '#00A8E8',
    website: 'https://amazon.in'
  },
  {
    name: 'Disney+ Hotstar',
    logo: 'https://www.hotstar.com/favicon.ico',
    category: 'entertainment',
    defaultCost: 1499,
    defaultCurrency: 'INR',
    defaultCycle: 'yearly',
    color: '#001A3D',
    website: 'https://hotstar.com'
  },
  {
    name: 'ChatGPT Plus',
    logo: 'https://openai.com/favicon.ico',
    category: 'work',
    defaultCost: 1999,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#10a37f',
    website: 'https://chat.openai.com'
  },
  {
    name: 'Claude Pro',
    logo: 'https://claude.ai/favicon.ico',
    category: 'work',
    defaultCost: 1999,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#D97706',
    website: 'https://claude.ai'
  },
  {
    name: 'GitHub Copilot',
    logo: 'https://github.githubassets.com/favicons/favicon.svg',
    category: 'work',
    defaultCost: 850,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#24292F',
    website: 'https://github.com'
  },
  {
    name: 'Notion',
    logo: 'https://www.notion.so/images/favicon.ico',
    category: 'work',
    defaultCost: 400,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#000000',
    website: 'https://notion.so'
  },
  {
    name: 'Adobe Creative Cloud',
    logo: 'https://www.adobe.com/favicon.ico',
    category: 'work',
    defaultCost: 4230,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#FF0000',
    website: 'https://adobe.com'
  },
  {
    name: 'Canva Pro',
    logo: 'https://www.canva.com/favicon.ico',
    category: 'work',
    defaultCost: 499,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#00C4CC',
    website: 'https://canva.com'
  },
  {
    name: 'Figma Professional',
    logo: 'https://www.figma.com/favicon.ico',
    category: 'work',
    defaultCost: 1250,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#F24E1E',
    website: 'https://figma.com'
  },
  {
    name: 'Google One',
    logo: 'https://one.google.com/favicon.ico',
    category: 'utilities',
    defaultCost: 130,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#4285F4',
    website: 'https://one.google.com'
  },
  {
    name: 'AWS Cloud',
    logo: 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico',
    category: 'utilities',
    defaultCost: 2000,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#FF9900',
    website: 'https://aws.amazon.com'
  },
  {
    name: 'PlayStation Plus',
    logo: 'https://www.playstation.com/favicon.ico',
    category: 'entertainment',
    defaultCost: 4999,
    defaultCurrency: 'INR',
    defaultCycle: 'yearly',
    color: '#003087',
    website: 'https://playstation.com'
  },
  {
    name: 'Xbox Game Pass',
    logo: 'https://www.xbox.com/favicon.ico',
    category: 'entertainment',
    defaultCost: 549,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#107C10',
    website: 'https://xbox.com'
  },
  {
    name: 'Anytime Fitness',
    logo: 'https://www.anytimefitness.com/favicon.ico',
    category: 'health',
    defaultCost: 2000,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#552A80',
    website: 'https://anytimefitness.com'
  },
  {
    name: 'Duolingo Plus',
    logo: 'https://www.duolingo.com/favicon.ico',
    category: 'education',
    defaultCost: 499,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#58CC02',
    website: 'https://duolingo.com'
  },
  {
    name: 'Medium Membership',
    logo: 'https://medium.com/favicon.ico',
    category: 'education',
    defaultCost: 400,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#000000',
    website: 'https://medium.com'
  },
  {
    name: 'Apple One',
    logo: 'https://www.apple.com/favicon.ico',
    category: 'entertainment',
    defaultCost: 365,
    defaultCurrency: 'INR',
    defaultCycle: 'monthly',
    color: '#A2AAAD',
    website: 'https://apple.com'
  }
];
