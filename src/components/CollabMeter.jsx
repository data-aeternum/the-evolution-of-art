// Shows where a work sits on the human/SI collaboration scale (SI = super intelligence).
// Four cells: the more cells lit, the larger the SI's share of the rendering.
// 1 = Human, 2 = Human-led, 3 = Co-created, 4 = SI-rendered.
// Every SI-rendered work in this gallery was piloted by a human art director.

import { collabLabel } from "@/src/lib/artworksData.js";

export const DISCLOSURE =
  "Every SI-rendered work in this gallery was piloted by a human art director, from brief to final selection.";

export default function CollabMeter({ level, showLabel = true }) {
  const n = Number(level) || 1;
  const cells = [1, 2, 3, 4].map((i) => (
    <span key={i} className={`collab__cell ${i <= n ? "is-on" : ""}`} />
  ));

  const title =
    n === 1
      ? `${collabLabel(n)}: made entirely by human hands`
      : `${collabLabel(n)}: ${n} of 4 on the human to SI scale. ${DISCLOSURE}`;

  return (
    <span className="collab" title={title}>
      <span className="collab__end">Human</span>
      <span className="collab__cells">{cells}</span>
      <span className="collab__end">SI</span>
      {showLabel && <span className="collab__label">{collabLabel(n)}</span>}
    </span>
  );
}
