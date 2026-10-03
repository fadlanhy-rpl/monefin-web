import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  PlusSquare,
  Home,
  GraduationCap,
  Briefcase,
  DollarSign,
  TrendingUp,
  Banknote,
  Wallet,
  Gift,
  Coins,
  FileText,
  Gamepad2,
  HeartPulse,
  MoreHorizontal,
  Zap,
  PiggyBank,
  Target,
  Coffee,
  Plane,
  Tv,
  Hash,
  HelpCircle,
} from "lucide-react";

export function getCategoryIcon(iconName, className = "w-4 h-4", style = {}) {
  const norm = String(iconName || "").toLowerCase().trim();
  let IconComponent = HelpCircle;

  switch (norm) {
    case "utensils":
    case "food":
    case "makanan":
    case "kuliner":
      IconComponent = Utensils;
      break;
    case "car":
    case "transport":
    case "transportasi":
    case "bensin":
      IconComponent = Car;
      break;
    case "shopping-bag":
    case "shopping":
    case "belanja":
      IconComponent = ShoppingBag;
      break;
    case "film":
    case "entertainment":
    case "hiburan":
    case "bioskop":
      IconComponent = Film;
      break;
    case "medical":
    case "health":
    case "kesehatan":
    case "obat":
      IconComponent = PlusSquare;
      break;
    case "heart-pulse":
    case "medis":
      IconComponent = HeartPulse;
      break;
    case "home":
    case "housing":
    case "rumah":
    case "kost":
      IconComponent = Home;
      break;
    case "graduation-cap":
    case "graduation":
    case "education":
    case "pendidikan":
    case "kuliah":
      IconComponent = GraduationCap;
      break;
    case "briefcase":
    case "work":
    case "pekerjaan":
    case "gaji":
    case "bisnis":
      IconComponent = Briefcase;
      break;
    case "dollar":
    case "financial":
    case "finansial":
      IconComponent = DollarSign;
      break;
    case "trending-up":
    case "trending":
    case "investment":
    case "investasi":
      IconComponent = TrendingUp;
      break;
    case "banknote":
    case "cash":
    case "uang":
      IconComponent = Banknote;
      break;
    case "wallet":
    case "dompet":
      IconComponent = Wallet;
      break;
    case "gift":
    case "hadiah":
      IconComponent = Gift;
      break;
    case "coins":
    case "koin":
      IconComponent = Coins;
      break;
    case "file-text":
    case "bills":
    case "tagihan":
      IconComponent = FileText;
      break;
    case "gamepad-2":
    case "gaming":
    case "game":
      IconComponent = Gamepad2;
      break;
    case "more-horizontal":
    case "more":
    case "others":
    case "lainnya":
    case "lain-lain":
      IconComponent = MoreHorizontal;
      break;
    case "zap":
    case "utilities":
    case "listrik":
      IconComponent = Zap;
      break;
    case "piggy-bank":
    case "savings":
    case "tabungan":
      IconComponent = PiggyBank;
      break;
    case "target":
    case "goal":
    case "impian":
      IconComponent = Target;
      break;
    case "coffee":
    case "kopi":
    case "cafe":
      IconComponent = Coffee;
      break;
    case "plane":
    case "travel":
    case "liburan":
      IconComponent = Plane;
      break;
    case "tv":
    case "streaming":
      IconComponent = Tv;
      break;
    default:
      IconComponent = norm ? Hash : HelpCircle;
      break;
  }

  return <IconComponent className={className} style={style} />;
}

export function getCategoryColorStyle(colorName) {
  const norm = String(colorName || "").toLowerCase().trim();
  switch (norm) {
    case "orange":
      return "bg-orange-50 text-orange-600 border-orange-100";
    case "blue":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "purple":
      return "bg-purple-50 text-purple-600 border-purple-100";
    case "pink":
      return "bg-pink-50 text-pink-600 border-pink-100";
    case "emerald":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "teal":
      return "bg-teal-50 text-teal-600 border-teal-100";
    case "amber":
      return "bg-amber-50 text-amber-600 border-amber-100";
    default:
      return "bg-[#E6F0EF] text-[#00685F] border-[#c0ded9]";
  }
}

export function getCategoryColorHex(colorName) {
  const norm = String(colorName || "").toLowerCase().trim();
  switch (norm) {
    case "orange": return "#ea580c";
    case "blue": return "#2563eb";
    case "purple": return "#9333ea";
    case "pink": return "#db2777";
    case "emerald": return "#059669";
    case "teal": return "#0d9488";
    case "amber": return "#d97706";
    case "primary": return "#00685F";
    default:
      if (colorName && colorName.startsWith("#")) return colorName;
      return "#00685F";
  }
}
