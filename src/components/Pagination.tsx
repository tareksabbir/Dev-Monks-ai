export function Pagination({ current = 1, total = 7 }) {
  return (
    <div className="flex items-center gap-1.5 justify-center mt-12 mb-8">
      {/* Prev button placeholder if needed, in screenshot there's a faint left arrow */}
      <button className="w-6 h-6 flex items-center justify-center text-[#d8c8a8]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M9 3L5 7l4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={`w-6 h-6 text-[11px] flex items-center justify-center border font-medium transition-colors ${
            current === n
              ? "bg-[#ff6b00] text-white border-[#ff6b00]"
              : "bg-transparent text-[#ff6b00] border-[#d8c8a8] hover:bg-black/5"
          }`}
        >
          {n}
        </button>
      ))}

      {/* Next button */}
      <button className="w-6 h-6 flex items-center justify-center bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M5 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
