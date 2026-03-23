export function PixelCat() {
  return (
    <svg
      width="80"
      height="40"
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simple pixel art representation of the cat */}
      <path
        d="M20 20 H25 V15 H30 V20 H45 V15 H50 V20 H55 V25 H60 V35 H20 V25 Z"
        fill="transparent"
        stroke="var(--foreground)"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <rect x="25" y="22" width="2" height="2" fill="var(--foreground)" />
      <rect x="45" y="22" width="2" height="2" fill="var(--foreground)" />
      <rect x="34" y="25" width="4" height="2" fill="var(--foreground)" />
      <path
        d="M10 25 H20 V35 H15 V30 H10 V25 Z"
        fill="transparent"
        stroke="var(--foreground)"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <path
        d="M60 25 H70 V35 H65 V30 H60 V25 Z"
        fill="transparent"
        stroke="var(--foreground)"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function ArrowRight({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FooterCTA() {
  const links = ["Try le Chat", "Build on AI Studio", "Talk to an expert"];
  return (
    <section className="bg-transparent py-20 text-center flex flex-col items-center">
      <h2 className="text-4xl font-normal text-foreground tracking-tight mb-8">
        The next chapter of AI is yours.
      </h2>
      <div className="flex items-center justify-center gap-6 mb-16">
        {links.map((label) => (
          <button
            key={label}
            className="group flex items-center text-sm font-medium text-foreground border-b border-foreground pb-0.5"
          >
            {label}
            <span className="ml-1 text-primary group-hover:translate-x-0.5 transition-transform">
              <ArrowRight size={14} color="currentColor" />
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-center -mb-2">
        <PixelCat />
      </div>
    </section>
  );
}
