type EyeArtProps = {
  /** Path to a real photographic eye asset, e.g. "/eyes/hero-eye.jpg". */
  src?: string;
  alt?: string;
  className?: string;
  /** Controls default aspect ratio and mask shape for each atmospheric slot. */
  slot?: "hero" | "section" | "fragment";
  breathing?: boolean;
  blink?: boolean;
  /** 0–1, how visible the piece is. Kept low per the brief — this should barely register. */
  opacity?: number;
};

const DEFAULT_EYE_SRC = "/eyes/hero-eye.jpg";

const SLOT_ASPECT: Record<string, string> = {
  hero: "aspect-[3/4] sm:aspect-[4/5]",
  section: "aspect-[16/9]",
  fragment: "aspect-square",
};

/**
 * Atmospheric photographic eye — the CyberForge visual signature.
 * Defaults to the magenta-iris hero photo in /public/eyes/.
 */
export function EyeArt({
  src = DEFAULT_EYE_SRC,
  alt = "",
  className = "",
  slot = "section",
  breathing = true,
  blink = false,
  opacity = 1,
}: EyeArtProps) {
  return (
    <div
      className={`relative overflow-hidden ${SLOT_ASPECT[slot]} ${breathing ? "eye-breathe" : ""} ${
        blink ? "eye-blink" : ""
      } ${className}`}
      style={
        {
          "--eye-min": opacity * 0.88,
          "--eye-max": opacity,
          maskImage:
            slot === "hero"
              ? "radial-gradient(ellipse 80% 85% at 58% 42%, black 32%, transparent 88%)"
              : "radial-gradient(ellipse 75% 80% at 55% 45%, black 35%, transparent 85%)",
          WebkitMaskImage:
            slot === "hero"
              ? "radial-gradient(ellipse 80% 85% at 58% 42%, black 32%, transparent 88%)"
              : "radial-gradient(ellipse 75% 80% at 55% 45%, black 35%, transparent 85%)",
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            decoding="async"
            fetchPriority={slot === "hero" ? "high" : "low"}
            style={{
              objectPosition: slot === "hero" ? "58% 42%" : "55% 45%",
              filter: "contrast(1.12) brightness(0.82) saturate(1.35)",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 28% 28% at 52% 46%, var(--signal-magenta) 0%, transparent 72%)",
              opacity: 0.28,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 38%, var(--ink) 100%)",
            }}
          />
          {slot === "hero" ? <HeroCorners /> : null}
        </>
      ) : (
        <PlaceholderBokeh />
      )}
    </div>
  );
}

function HeroCorners() {
  return (
    <div className="pointer-events-none absolute inset-[8%] opacity-70">
      <span className="absolute left-0 top-0 h-10 w-10 border-l border-t border-signal-magenta/70" />
      <span className="absolute right-0 top-0 h-10 w-10 border-r border-t border-signal-magenta/70" />
      <span className="absolute bottom-0 left-0 h-10 w-10 border-b border-l border-signal-magenta/70" />
      <span className="absolute bottom-0 right-0 h-10 w-10 border-b border-r border-signal-magenta/70" />
    </div>
  );
}

/**
 * Fallback if the photo is unavailable — soft iris glow, never a vector icon.
 */
function PlaceholderBokeh() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 55% 45%, rgba(232,62,131,0.45) 0%, rgba(184,77,120,0.28) 14%, rgba(40,20,30,0.6) 30%, var(--ink) 62%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 55% 45%, #050506 0%, transparent 9%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 51% 41%, rgba(242,240,241,0.5) 0%, transparent 3%)",
        }}
      />
      <div className="absolute inset-0" style={{ backdropFilter: "blur(2px)" }} />
    </div>
  );
}
