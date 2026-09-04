import Link from "next/link";

export const CatalisButton = ({ href, children, variant = "primary", size = "normal", className = "", onClick }) => {
  const sizeStyle =
    size === "sm"
      ? "px-3.5 xl:px-5 py-2 xl:py-2.5 text-xs xl:text-sm"
      : "px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm";

  const baseStyle =
    variant === "primary"
      ? "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25 border border-brand-500/30"
      : "bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 shadow-md shadow-slate-200/50";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`btn-catalis font-bold press-scale cursor-pointer ${baseStyle} ${sizeStyle} ${className}`}
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
      className={`btn-catalis font-bold press-scale ${baseStyle} ${sizeStyle} ${className}`}
    >
      <div className="btn-catalis-inner">
        <span className="btn-catalis-text flex items-center justify-center gap-2">{children}</span>
        <span className="btn-catalis-text flex items-center justify-center gap-2">{children}</span>
      </div>
    </Link>
  );
};
