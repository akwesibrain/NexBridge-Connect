// Daybreak delta — the signature. One source fans through branches to the
// networks; coral pulses flow downstream and fade as they "arrive".
// Visible without JS; pulses hidden under prefers-reduced-motion (.nb-pulse).
const BRANCHES = [
  { id: "mtn", d: "M70,150 C150,150 190,54 300,44", y: 44, label: "MTN" },
  { id: "tcl", d: "M70,150 C150,150 200,112 300,104", y: 104, label: "Telecel" },
  { id: "atl", d: "M70,150 C150,150 200,188 300,196", y: 196, label: "AirtelTigo" },
  { id: "oth", d: "M70,150 C150,150 190,246 300,256", y: 256, label: "Other" },
];

export default function DeltaFlow({ className, labels = true }) {
  return (
    <svg className={className} viewBox="0 0 360 300" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        {BRANCHES.map((b) => <path key={b.id} id={`df-${b.id}`} d={b.d} />)}
      </defs>
      {/* channels */}
      {BRANCHES.map((b) => (
        <use key={b.id} href={`#df-${b.id}`} stroke="#ffffff" strokeOpacity="0.75" strokeWidth="2.5" strokeLinecap="round"
          className="nb-draw" style={{ strokeDasharray: 420, strokeDashoffset: 420, animation: `nb-draw 1.3s ${0.1 + b.y / 600}s ease forwards` }} />
      ))}
      <use href="#df-mtn" stroke="#cf4e2a" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round"
        className="nb-draw" style={{ strokeDasharray: 420, strokeDashoffset: 420, animation: "nb-draw 1.4s .15s ease forwards" }} />

      {/* source + mouths */}
      <circle cx="70" cy="150" r="6" fill="#cf4e2a" />
      <circle cx="70" cy="150" r="11" fill="none" stroke="#cf4e2a" strokeOpacity="0.4" strokeWidth="1.5" />
      {BRANCHES.map((b) => (
        <g key={b.id}>
          <circle cx="300" cy={b.y} r="4.5" fill="#fff" stroke="#cf4e2a" strokeWidth="1.6" />
          {labels && <text x="312" y={b.y + 4} fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#5a3826">{b.label}</text>}
        </g>
      ))}

      {/* flowing pulses */}
      {BRANCHES.map((b, i) => (
        <g key={b.id} className="nb-pulse">
          <circle r="3.4" fill="#cf4e2a">
            <animateMotion dur={`${2.6 + i * 0.35}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" calcMode="linear" keyPoints="0;1" keyTimes="0;1">
              <mpath href={`#df-${b.id}`} />
            </animateMotion>
            <animate attributeName="opacity" dur={`${2.6 + i * 0.35}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.15;0.8;1" />
          </circle>
          <circle r="2.4" fill="#ffffff">
            <animateMotion dur={`${2.6 + i * 0.35}s`} begin={`${i * 0.5 + 1.3}s`} repeatCount="indefinite" calcMode="linear" keyPoints="0;1" keyTimes="0;1">
              <mpath href={`#df-${b.id}`} />
            </animateMotion>
            <animate attributeName="opacity" dur={`${2.6 + i * 0.35}s`} begin={`${i * 0.5 + 1.3}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.15;0.8;1" />
          </circle>
        </g>
      ))}
    </svg>
  );
}
