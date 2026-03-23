export function Footer() {
  const BANDS = [
    "bg-sunset-1", // Light yellow
    "bg-sunset-2", // Darker yellow/orange
    "bg-sunset-3", // Orange
    "bg-sunset-4", // Dark orange/red
    "bg-sunset-5", // Deep red
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
