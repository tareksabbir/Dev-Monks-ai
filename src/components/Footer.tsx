export function Footer() {
  const BANDS = [
    "bg-[#ffeaa2]", // Light yellow
    "bg-[#ffcd55]", // Darker yellow/orange
    "bg-[#ffa000]", // Orange
    "bg-[#ff5500]", // Dark orange/red
    "bg-[#cc2200]", // Deep red
  ];

  return (
    <footer className="w-full relative mt-auto">
      {/* Sunset gradient bands as distinct solid divs */}
      <div className="w-full flex flex-col items-stretch">
        {BANDS.map((color, i) => (
          <div key={i} className={`h-8 w-full ${color}`} />
        ))}
      </div>
    </footer>
  );
}
