// Shows where a work sits on the human/AI collaboration scale.
// Four cells: the more cells lit, the larger the AI's share of the making.
// 1 = Human, 2 = Human-led, 3 = Co-created, 4 = AI-led.

import { collabLabel } from "@/src/lib/artworksData.js";

export default function CollabMeter({ level, showLabel = true }) {
  const n = Number(level) || 1;
  const cells = [1, 2, 3, 4].map((i) => (
    <span key={i} className={`collab__cell ${i <= n ? "is-on" : ""}`} />
  ));

  return (
    <span className="collab" title={`${collabLabel(n)}: ${n} of 4 on the human to AI scale`}>
      <span className="collab__end">Human</span>
      <span className="collab__cells">{cells}</span>
      <span className="collab__end">AI</span>
      {showLabel && <span className="collab__label">{collabLabel(n)}</span>}
    </span>
  );
}
