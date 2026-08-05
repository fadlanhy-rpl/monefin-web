import Link from "next/link";

export const CatalisButton = ({ href, children, variant = "primary", className = "", onClick }) => {
  const baseStyle =
    variant === "primary"
      ? "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25 border border-brand-500/30 px-5 sm:px-6 py-3 sm:py-3.5"
      : "bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 shadow-md shadow-slate-200/50 px-5 sm:px-6 py-3 sm:py-3.5";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`btn-catalis font-bold text-xs sm:text-sm press-scale cursor-pointer ${baseStyle} ${className}`}
      >
        <div className="btn-catalis-inner">
          <span className="btn-catalis-text flex items-center justify-center gap-2">{children}</span>
          <span className="btn-catalis-text flex items-center justify-center gap-2">{children}</span>
        </div>
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`btn-catalis font-bold text-xs sm:text-sm press-scale ${baseStyle} ${className}`}
    >
      <div className="btn-catalis-inner">
        <span className="btn-catalis-text flex items-center justify-center gap-2">{children}</span>
        <span className="btn-catalis-text flex items-center justify-center gap-2">{children}</span>
      </div>
    </Link>
  );
};
