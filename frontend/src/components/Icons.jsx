/**
 * Inline SVG icon set (stroke = currentColor). Keeps the bundle self-contained
 * and lets every icon inherit colour/size from its context.
 */
const P = {
  upload: <><path d="M12 15V4" /><path d="m7 9 5-5 5 5" /><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></>,
  scan: <><path d="M4 8V6a2 2 0 0 1 2-2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M20 16v2a2 2 0 0 1-2 2h-2" /><path d="M8 20H6a2 2 0 0 1-2-2v-2" /><path d="M4 12h16" /></>,
  map: <><path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14" /><path d="M15 6v14" /></>,
  tree: <><path d="M12 22v-6" /><path d="M9 16H6.5a3.5 3.5 0 0 1-1-6.86A4 4 0 0 1 12 5a4 4 0 0 1 6.5 4.14 3.5 3.5 0 0 1-1 6.86H15" /></>,
  wheat: <><path d="M12 22V8" /><path d="M12 8c0-2 1.5-3.5 3.5-3.5C15.5 6.5 14 8 12 8Z" /><path d="M12 8c0-2-1.5-3.5-3.5-3.5C8.5 6.5 10 8 12 8Z" /><path d="M12 14c0-2 1.5-3.5 3.5-3.5C15.5 12.5 14 14 12 14Z" /><path d="M12 14c0-2-1.5-3.5-3.5-3.5C8.5 12.5 10 14 12 14Z" /></>,
  sprout: <><path d="M7 20h10" /><path d="M12 20c0-5 0-8 0-8" /><path d="M12 12c0-3-2-5-5-5 0 3 2 5 5 5Z" /><path d="M12 10c0-2.5 2-4.5 4.5-4.5C16.5 8 14.5 10 12 10Z" /></>,
  droplet: <path d="M12 3s6 5.7 6 10a6 6 0 0 1-12 0c0-4.3 6-10 6-10Z" />,
  building: <><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" /><path d="M10 21v-3h4v3" /></>,
  mountain: <path d="m3 20 6-11 4 6 2-3 6 8H3Z" />,
  cloud: <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.34 11 4 4 0 0 0 7 19h10.5Z" />,
  arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  github: <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  gauge: <><path d="M12 14 8 8" /><path d="M20 14a8 8 0 1 0-16 0" /><path d="M4 14h1M19 14h1M12 6V5" /></>,
  compare: <><rect x="3" y="5" width="7" height="14" rx="1" /><rect x="14" y="5" width="7" height="14" rx="1" /><path d="M12 3v18" /></>,
  mine: <><path d="M14 3.5 20.5 10" /><path d="M17 6.5a7 7 0 0 0-9.9 0 7 7 0 0 0 0 9.9" /><path d="m11 13-8 8" /></>,
  ground: <><path d="M3 17h18" /><path d="M5 13h3M10.5 13h3M16 13h3" /><path d="M4 21h16" /></>,
  flower: <><circle cx="12" cy="12" r="2.5" /><path d="M12 9.5c-1-1.5-1-3.5 0-5 1 1.5 1 3.5 0 5Z" /><path d="M12 14.5c-1 1.5-1 3.5 0 5 1-1.5 1-3.5 0-5Z" /><path d="M9.5 12c-1.5-1-3.5-1-5 0 1.5 1 3.5 1 5 0Z" /><path d="M14.5 12c1.5-1 3.5-1 5 0-1.5 1-3.5 1-5 0Z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" /></>,
  haze: <><path d="M4 8h16" /><path d="M4 12h16" /><path d="M7 16h10" /></>,
  road: <><path d="M5 21 8 3" /><path d="M19 21 16 3" /><path d="M12 6v2M12 11v2M12 16v2" /></>,
  axe: <><path d="m14 3 7 7-3 1-5-5 1-3Z" /><path d="m12 6-9 9 3 3 8-8" /></>,
  flame: <path d="M12 2s5 4.5 5 9.5A5 5 0 0 1 7 12c0-1.5.6-2.6 1.2-3.4C8.6 9.5 9.4 10 10 10c0-2.5 2-4.5 2-8Z" />,
  alert: <><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  radar: <><path d="M19.07 4.93A10 10 0 1 0 21 12" /><path d="M12 12 19 5" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
  send: <><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6.3 6.3 2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
};

export default function Icon({ name, size = 24, stroke = 1.75, style, ...rest }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
      {...rest}
    >
      {P[name] || null}
    </svg>
  );
}
