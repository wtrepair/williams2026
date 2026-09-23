import { useId } from "react";

/** A conceptual service illustration, not a construction or installation plan. */
export default function WellCutaway({ className = "" }) {
  const prefix = useId().replace(/:/g, "");
  const id = (name) => `${prefix}-${name}`;

  return (
    <svg
      className={className}
      viewBox="0 0 500 650"
      role="img"
      aria-labelledby={id("title")}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "#e1eaf0",
      }}
    >
      <title id={id("title")}>
        Illustrative well cutaway showing a six-inch casing, water line, well
        pump and groundwater.
      </title>
      <defs>
        <linearGradient id={id("earth")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c6b99b" />
          <stop offset="1" stopColor="#aa9778" />
        </linearGradient>
        <linearGradient id={id("water")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#75b9bd" />
          <stop offset="1" stopColor="#548d96" />
        </linearGradient>
        <linearGradient id={id("casing")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9e5df" />
          <stop offset="0.38" stopColor="#ffffff" />
          <stop offset="0.75" stopColor="#eef4eb" />
          <stop offset="1" stopColor="#becdc7" />
        </linearGradient>
        <linearGradient id={id("bore")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#297b8c" />
          <stop offset="0.46" stopColor="#63bdc8" />
          <stop offset="1" stopColor="#35899a" />
        </linearGradient>
        <linearGradient id={id("pump")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#48666b" />
          <stop offset="0.48" stopColor="#d1ded7" />
          <stop offset="1" stopColor="#68858a" />
        </linearGradient>
        <pattern
          id={id("soil-speckle")}
          width="39"
          height="33"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="6" cy="8" r="1.2" fill="#78684c" opacity=".25" />
          <circle cx="24" cy="25" r="1" fill="#f7efe0" opacity=".42" />
          <path
            d="m29 7 4 1m-20 17 2-1"
            stroke="#776c54"
            strokeWidth="1"
            opacity=".22"
          />
        </pattern>
        <clipPath id={id("front")}>
          <path d="M43 281 405 315V561L43 527Z" />
        </clipPath>
        <clipPath id={id("column")}>
          <path d="M225 323h22v204h-22Z" />
        </clipPath>
      </defs>

      <style>{`
        .well-cutaway-flow { animation: well-cutaway-rise 3.6s linear infinite; }
        @keyframes well-cutaway-rise { to { transform: translateY(-64px); } }
        @media (prefers-reduced-motion: reduce) { .well-cutaway-flow { animation: none; } }
      `}</style>

      <g fontFamily="'DM Sans', Arial, sans-serif" fill="#163b3a">
        <circle cx="39" cy="43" r="3" fill="#3c8bca" />
        <text x="51" y="47" fontSize="9" letterSpacing="1.9" fontWeight="600">
          ILLUSTRATIVE CUTAWAY
        </text>
        <path d="M38 62H462" stroke="#183c35" strokeOpacity=".16" />
        <text x="38" y="99" fontSize="25" letterSpacing="-.8" fontWeight="500">
          Good water starts below.
        </text>
        <text x="39" y="122" fontSize="11" fill="#52685b">
          A closer look at the well beneath your property.
        </text>
      </g>

      {/* A quiet perspective gives the geological section depth. */}
      <ellipse cx="255" cy="570" rx="185" ry="22" fill="#506755" opacity=".1" />
      <path d="m43 281 362 34 52-34-362-34Z" fill="#849e72" />
      <path d="m43 281 362 34v246L43 527Z" fill={`url(#${id("earth")})`} />
      <path d="m405 315 52-34v246l-52 34Z" fill="#8a876b" />
      <g clipPath={`url(#${id("front")})`}>
        <path d="m30 289 390 36v18L30 307Z" fill="#7c8060" />
        <path
          d="M30 329c108 18 159 5 213 17s124 25 177 18v68c-70 2-121-22-191-16S83 406 30 396Z"
          fill="#b8a482"
        />
        <path
          d="M30 387c70 21 104 6 171 24s147 19 219 28v20L30 423Z"
          fill="#d8c6a1"
        />
        <path
          d="M30 434c59-3 112 17 163 17s154 14 227 16v100H30Z"
          fill={`url(#${id("water")})`}
        />
        <path
          d="M30 436c59-3 112 17 163 17s154 14 227 16"
          fill="none"
          stroke="#a6d6d0"
          strokeWidth="4"
        />
        <path
          d="M30 505c79-4 139 17 212 18s114 17 178 15v40H30Z"
          fill="#627c77"
        />
        <path d="M30 284H420V438H30Z" fill={`url(#${id("soil-speckle")})`} />
        <g stroke="#cee5d8" strokeOpacity=".37" strokeWidth="1.5" fill="none">
          <path d="m57 473 32 3m27 23 51 4m145-18 23 2m20 29 33 3m-309-2 23 2" />
          <path d="m122 460 26 2m153 41 24 2m-104-7 19 2m126-22 31 3" />
        </g>
      </g>
      <path d="m405 325 52-34v18l-52 34Z" fill="#63795a" />
      <path d="m405 438 52-34v23l-52 33Z" fill="#b2a381" />
      <path d="m405 469 52-34v75l-52 35Z" fill="#52848a" />
      <path d="m405 469 52-34" fill="none" stroke="#8ebdb7" strokeWidth="3" />
      <path d="m405 544 52-34v17l-52 34Z" fill="#4e6763" />

      {/* Grass and granite are small, familiar markers at ground level. */}
      <path d="m43 281 362 34 52-34-362-34Z" fill="#93a67c" />
      <path d="m60 281 146 13 37-18-148-22Z" fill="#a9b991" opacity=".7" />
      <path d="m266 282 132 19 35-22-114-11Z" fill="#819869" opacity=".6" />
      <g stroke="#526e4b" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="m96 275-3-9m3 9 4-7m-4 7-7-3m66 13-2-12m2 12 5-8m-5 8-6-4" />
        <path d="m344 289-2-10m2 10 5-7m44 4 2-12m-2 12-5-5" />
      </g>
      <path d="m111 259 7-6 11 1 7 7-9 4-13-1Z" fill="#a4ac9b" />
      <path d="m111 259 16 2 9 0-9 4-13-1Z" fill="#828f80" />
      <path d="m361 280 5-5 8 1 6 5-8 3-10-1Z" fill="#b9c0af" />

      {/* The casing and bore are opened visually so the pump can be seen. */}
      <ellipse cx="236" cy="293" rx="25" ry="8" fill="#586e50" opacity=".18" />
      <path d="M219 326v201c0 9 34 9 34 0V326Z" fill="#7d8c7b" />
      <path d="M225 323h22v202c0 7-22 7-22 0Z" fill={`url(#${id("bore")})`} />
      <path
        d="M219 326V233h34v93c-7 7-27 7-34 0Z"
        fill={`url(#${id("casing")})`}
      />
      <path
        d="M220 325c7 6 24 6 32 0"
        stroke="#bbc9be"
        strokeWidth="2"
        fill="none"
      />
      <ellipse cx="236" cy="233" rx="17" ry="5" fill="#f9fbef" />
      <path d="M215 227v7c0 8 42 8 42 0v-7Z" fill="#368995" />
      <ellipse cx="236" cy="227" rx="21" ry="7" fill="#78bdc0" />
      <ellipse cx="236" cy="225.5" rx="15" ry="4" fill="#a6d7d2" />
      <path d="M237 242v234" stroke="#1e5f6c" strokeWidth="7" />
      <path d="M237 243v232" stroke="#b4e4df" strokeWidth="2.5" />
      <path
        d="M237 337h57q13 0 13-13v-7q0-13 13-13h136"
        fill="none"
        stroke="#315e68"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path
        d="M237 335h57q11 0 11-11v-7q0-15 15-15h136"
        fill="none"
        stroke="#72bfcb"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="m448 296 9 7-9 7" fill="none" stroke="#315e68" strokeWidth="2" />
      <path d="M231 346v108" stroke="#ffffff" strokeWidth="1" opacity=".2" />
      <g clipPath={`url(#${id("column")})`} opacity=".84">
        <g className="well-cutaway-flow" fill="#e3fff2">
          {[376, 408, 440, 472, 504, 536, 568].map((y) => (
            <circle key={y} cx="237" cy={y} r="2.1" />
          ))}
        </g>
      </g>
      <rect
        x="226"
        y="475"
        width="21"
        height="41"
        rx="5"
        fill={`url(#${id("pump")})`}
      />
      <ellipse cx="236.5" cy="475" rx="10.5" ry="3.5" fill="#c4d3c9" />
      <path
        d="M227 484h19m-19 5h19m-19 5h19m-19 5h19"
        stroke="#2c5660"
        strokeWidth="1.5"
        opacity=".85"
      />
      <path d="M232 477v-8h9v8" fill="#68858a" />
      <path
        d="M222 521q14 10 29 0"
        stroke="#bededa"
        strokeWidth="1"
        fill="none"
        opacity=".5"
      />

      {/* Fine leader lines keep the drawing legible without suggesting a plan. */}
      <g fill="none" stroke="#315549" strokeWidth="1" strokeLinejoin="round">
        <path d="M251 217 276 190h88" />
        <circle cx="251" cy="217" r="2.5" fill="#315549" stroke="none" />
        <path d="M351 303v-67h48" />
        <circle cx="351" cy="303" r="2.5" fill="#315549" stroke="none" />
        <path d="M225 492h-37l-20-24H85" />
        <circle cx="225" cy="492" r="2.5" fill="#315549" stroke="none" />
        <path d="M335 497v30h51" />
        <circle cx="335" cy="497" r="2.5" fill="#315549" stroke="none" />
      </g>
      <g
        fontFamily="'DM Sans', Arial, sans-serif"
        fill="#163b3a"
        fontSize="12"
        fontWeight="600"
      >
        <text x="278" y="180">
          6-inch casing
        </text>
        <text x="360" y="227">
          Water line
        </text>
        <text x="85" y="457">
          Well pump
        </text>
        <text x="304" y="549">
          Groundwater
        </text>
      </g>
      <path d="M38 599H462" stroke="#183c35" strokeOpacity=".16" />
      <g
        fontFamily="'DM Sans', Arial, sans-serif"
        fill="#52685b"
        fontSize="9.5"
      >
        <text x="39" y="622">
          Every property is different.
        </text>
        <text x="462" y="622" textAnchor="end">
          Conceptual illustration · not to scale
        </text>
      </g>
    </svg>
  );
}
