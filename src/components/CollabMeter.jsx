// Shows the human/SI collaboration behind a work (SI = super intelligence) as two bars.
//
//   Human  ████   always full: the imagination, the direction and the infrastructure are human
//   SI     ███░   never full: the last cell never lights, because no work here was made by SI alone
//
// Levels: 1 = Human (SI 0 of 4), 2 = Human-led (SI 1), 3 = Co-created (SI 2), 4 = SI-rendered (SI 3).
// Even at the top of the scale the SI reads as less than the human, which is the honest picture:
// collaborative, equal at best, and always piloted by a human art director.

import { collabLabel } from "@/src/lib/artworksData.js";

export const DISCLOSURE =
  "Every SI-rendered work in this gallery was piloted by a human art director, from brief to final selection. The human bar is always full; the SI bar never is.";

export default function CollabMeter({ level, showLabel = true }) {
  const n = Math.min(4, Math.max(1, Number(level) || 1));
  const siCells = n - 1; // 0..3, never 4
  const cells = (lit, kind) =>
    [1, 2, 3, 4].map((i) => (
      <span
        key={i}
        className={`collab__cell collab__cell--${kind} ${i <= lit ? "is-on" : ""} ${
          kind === "si" && i === 4 ? "is-never" : ""
        }`}
      />
    ));

  const title =
    n === 1
      ? `${collabLabel(n)}: made entirely by human hands.`
      : `${collabLabel(n)}: SI ${siCells} of 4, human 4 of 4. ${DISCLOSURE}`;

  return (
    <span className="collab" title={title}>
      <span className="collab__row">
        <span className="collab__end">Human</span>
        <span className="collab__cells">{cells(4, "human")}</span>
      </span>
      <span className="collab__row">
        <span className="collab__end">SI</span>
        <span className="collab__cells">{cells(siCells, "si")}</span>
      </span>
      {showLabel && <span className="collab__label">{collabLabel(n)}</span>}
    </span>
  );
}
