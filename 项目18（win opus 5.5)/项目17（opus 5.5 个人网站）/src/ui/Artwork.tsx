export function Artwork({
  kind = "project",
  index = 0,
}: {
  kind?: string;
  index?: number;
}) {
  const colors = ["#829587", "#b6897a", "#8b9da0", "#aa997b"];
  const ink = colors[index % colors.length];
  return (
    <svg
      viewBox="0 0 420 240"
      className={`artwork artwork-${kind}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`wash-${kind}-${index}`} x2="0" y2="1">
          <stop stopColor={ink} stopOpacity=".14" />
          <stop offset="1" stopColor={ink} stopOpacity=".02" />
        </linearGradient>
      </defs>
      <rect width="420" height="240" fill={`url(#wash-${kind}-${index})`} />
      <circle cx="286" cy="67" r="27" fill={ink} opacity=".16" />
      {kind === "project" ? (
        <>
          <path
            d="M-30 207 Q70 60 183 179 Q275 68 456 194 L456 260 H-30"
            fill={ink}
            opacity=".12"
          />
          <path
            d="M-20 240 Q83 115 201 209 Q310 126 445 225"
            fill="none"
            stroke={ink}
            strokeWidth="1"
            opacity=".4"
          />
          <path
            d="M197 191V134M166 146L197 119L230 146M173 146H223M178 148V185M216 148V185M170 185H224"
            stroke={ink}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M92 180V123M79 138Q92 102 105 138M306 193V135M292 147Q306 114 320 147"
            stroke={ink}
            fill="none"
            opacity=".6"
          />
          <circle cx="92" cy="116" r="22" fill={ink} opacity=".22" />
          <circle cx="306" cy="128" r="27" fill={ink} opacity=".18" />
        </>
      ) : kind === "article" ? (
        <>
          <path
            d="M165 68L260 83L244 186L149 171Z"
            fill="#faf8f1"
            stroke={ink}
            opacity=".8"
          />
          <path
            d="M181 95L235 104M177 112L231 121M174 129L228 138M172 146L211 153"
            stroke={ink}
            opacity=".4"
          />
          <path
            d="M293 192V66M293 100L273 84M293 134L317 115M293 168L274 151"
            stroke={ink}
            fill="none"
            opacity=".65"
          />
        </>
      ) : (
        <>
          <path
            d="M0 167Q91 133 211 166T420 162M0 185Q91 151 211 184T420 180M0 203Q91 169 211 202T420 198"
            stroke={ink}
            strokeWidth="1"
            fill="none"
            opacity=".3"
          />
          <path d="M187 149L209 116L231 149Z" fill={ink} opacity=".5" />
          <path d="M179 151H239L230 161H188Z" fill={ink} opacity=".8" />
          <path d="M209 115V88" stroke={ink} opacity=".5" />
        </>
      )}
    </svg>
  );
}
