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
  Coffee,
  Plane,
  Tv,
  Hash,
} from "lucide-react";

export function getCategoryIcon(iconName, className = "w-4 h-4") {
  const norm = String(iconName || "").toLowerCase().trim();
  switch (norm) {
    case "utensils":
    case "food":
    case "makanan":
    case "kuliner":
      return <Utensils className={className} />;
    case "car":
    case "transport":
    case "transportasi":
    case "bensin":
      return <Car className={className} />;
    case "shopping-bag":
    case "shopping":
    case "belanja":
      return <ShoppingBag className={className} />;
    case "film":
    case "entertainment":
    case "hiburan":
    case "bioskop":
      return <Film className={className} />;
    case "medical":
    case "health":
    case "kesehatan":
    case "obat":
      return <PlusSquare className={className} />;
    case "heart-pulse":
    case "medis":
      return <HeartPulse className={className} />;
    case "home":
    case "housing":
    case "rumah":
    case "kost":
      return <Home className={className} />;
    case "graduation-cap":
    case "education":
    case "pendidikan":
    case "kuliah":
      return <GraduationCap className={className} />;
    case "briefcase":
    case "work":
    case "pekerjaan":
    case "gaji":
    case "bisnis":
      return <Briefcase className={className} />;
    case "dollar":
    case "financial":
    case "finansial":
      return <DollarSign className={className} />;
    case "trending-up":
    case "investment":
    case "investasi":
      return <TrendingUp className={className} />;
    case "banknote":
    case "cash":
    case "uang":
      return <Banknote className={className} />;
    case "wallet":
    case "dompet":
      return <Wallet className={className} />;
    case "gift":
    case "hadiah":
      return <Gift className={className} />;
    case "coins":
    case "koin":
      return <Coins className={className} />;
    case "file-text":
    case "bills":
    case "tagihan":
      return <FileText className={className} />;
    case "gamepad-2":
    case "gaming":
    case "game":
      return <Gamepad2 className={className} />;
    case "zap":
    case "utilities":
    case "listrik":
      return <Zap className={className} />;
    case "piggy-bank":
    case "savings":
    case "tabungan":
      return <PiggyBank className={className} />;
    case "coffee":
    case "kopi":
    case "cafe":
      return <Coffee className={className} />;
    case "plane":
    case "travel":
    case "liburan":
      return <Plane className={className} />;
    case "tv":
    case "streaming":
      return <Tv className={className} />;
    default:
      return <Hash className={className} />;
  }
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
