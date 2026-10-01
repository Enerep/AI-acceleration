import { motion } from "motion/react";

export function Helix() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="possibility-art helix-art"
      aria-hidden="true"
    >
      <g transform="translate(20,0)">
        {Array.from({ length: 27 }, (_, i) => {
          const x = 10 + i * 11;
          // Math.sin can differ by a few ULPs between Node and WebKit.
          // Serialize SVG coordinates at a fixed visual precision for hydration.
          const y = (110 + Math.sin(i * 0.3) * 63).toFixed(3);
          const y2 = (110 - Math.sin(i * 0.3) * 63).toFixed(3);
          return (
            <g key={i}>
              <line
                x1={x}
                y1={y}
                x2={x}
                y2={y2}
                stroke="currentColor"
                opacity=".23"
                strokeWidth="1.5"
              />
              <circle cx={x} cy={y} r="4.5" fill="currentColor" />
              <circle
                cx={x}
                cy={y2}
                r="4.5"
                fill="currentColor"
                opacity=".55"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function Orbital() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="possibility-art orbital-art"
      aria-hidden="true"
    >
      <g transform="translate(180,110)" fill="none" stroke="currentColor">
        <g className="orbital-spin">
          {[0, 60, 120].map((r) => (
            <ellipse
              key={r}
              rx="118"
              ry="43"
              transform={`rotate(${r})`}
              strokeWidth="1.5"
            />
          ))}
          <circle r="15" fill="currentColor" />
          <circle cx="113" cy="12" r="6" fill="currentColor" />
          <circle cx="-49" cy="-95" r="6" fill="currentColor" />
          <circle cx="-54" cy="93" r="6" fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}

export function Blocks() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="possibility-art blocks-art"
      aria-hidden="true"
    >
      {[0, 1, 2].map((col) =>
        [0, 1, 2].map((row) => {
          const x = 107 + col * 43 - row * 20;
          const y = 35 + row * 40 + col * 21;
          return (
            <g
              key={`${col}-${row}`}
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            >
              <path
                d={`M${x},${y} l40,20 -20,12 -40,-20 Z`}
                fill="currentColor"
                fillOpacity={(col + row) % 2 === 0 ? 0.13 : 0.02}
              />
              <path
                d={`M${x - 20},${y + 12} v35 l40,20 v-35 M${x + 20},${y + 32} l20,-12 v35 l-20,12`}
              />
            </g>
          );
        }),
      )}
    </svg>
  );
}

export function Crystal() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="possibility-art crystal-art"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.4" fill="none">
        <path d="M180 23 267 78 252 166 180 202 107 166 93 78Z M180 23 180 110 267 78 M180 110 252 166 M180 110 180 202 M180 110 107 166 M180 110 93 78 M93 78 252 166 M267 78 107 166" />
        {[
          [180, 23],
          [267, 78],
          [252, 166],
          [180, 202],
          [107, 166],
          [93, 78],
          [180, 110],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === 6 ? 8 : 5}
            fill="currentColor"
          />
        ))}
      </g>
    </svg>
  );
}

export function CostChart({ enabled }: { enabled: boolean }) {
  return (
    <svg
      viewBox="0 0 530 180"
      role="img"
      aria-label="AI inference cost fell from 20 dollars per million tokens in November 2022 to 7 cents in October 2024. Two measured endpoints joined to illustrate the decrease."
      className="cost-chart"
    >
      <g stroke="currentColor" opacity=".12">
        <path d="M28 35H505M28 83H505M28 132H505" />
      </g>
      <path
        d="M30 35C100 35 125 77 200 95S380 131 493 132L493 148H30Z"
        fill="url(#cost-fill)"
      />
      <motion.path
        d="M30 35C100 35 125 77 200 95S380 131 493 132"
        fill="none"
        stroke="#f85a2c"
        strokeWidth="3"
        initial={enabled ? { pathLength: 0 } : false}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />
      <g fill="#f85a2c">
        <circle cx="30" cy="35" r="5" />
        <circle cx="493" cy="132" r="5" />
      </g>
      <g fill="currentColor" fontFamily="monospace" fontSize="11">
        <text x="30" y="20">
          $20.00
        </text>
        <text x="493" y="115" textAnchor="end">
          $0.07
        </text>
        <text x="30" y="172" opacity=".6">
          NOV 2022
        </text>
        <text x="493" y="172" textAnchor="end" opacity=".6">
          OCT 2024
        </text>
      </g>
      <defs>
        <linearGradient id="cost-fill" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#f85a2c" stopOpacity=".15" />
          <stop offset="1" stopColor="#f85a2c" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ProteinCloud() {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true" className="protein-cloud">
      {Array.from({ length: 84 }, (_, i) => {
        const x = 22 + (i % 14) * 21.3;
        const y = 20 + Math.floor(i / 14) * 25;
        const active = (i * 7) % 13 > 3;
        return (
          <g
            key={i}
            transform={`translate(${x},${y}) rotate(${i * 37})`}
            stroke={active ? "#d5e8bd" : "#687062"}
            fill="none"
            opacity={active ? 0.8 : 0.35}
          >
            <path d="M-5,-3C3,-10 7,4 0,5S-8,2 -2,-2" strokeWidth="1.3" />
          </g>
        );
      })}
    </svg>
  );
}
