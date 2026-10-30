// Shows the human/SI collaboration behind a work (SI = super intelligence) as two bars,
// each rated by hand for that work and disclosed:
//
//   Human  ████   how much of the work is human: imagination, direction, infrastructure, selection
//   SI     ███░   how much of the rendering the SI carried
//
// The collab level (1 Human, 2 Human-led, 3 Co-created, 4 SI-rendered) is the filter label.
// Works without explicit shares fall back to human 4 and SI (level - 1).

import { collabLabel } from "@/src/lib/artworksData.js";

export const DISCLOSURE =
  "Every SI-rendered work in this gallery was commissioned and directed by a human; both bars are rated by hand for each work and disclosed.";

export function sharesOf(artwork) {
  const level = Math.min(4, Math.max(1, Number(artwork?.collab) || 1));
  const human = artwork?.humanShare != null ? Number(artwork.humanShare) : 4;
  const si = artwork?.siShare != null ? Number(artwork.siShare) : level - 1;
  return { level, human: Math.min(4, Math.max(0, human)), si: Math.min(4, Math.max(0, si)) };
}

export default function CollabMeter({ artwork, showLabel = true }) {
  const { level, human, si } = sharesOf(artwork);
  const cells = (lit, kind) =>
    [1, 2, 3, 4].map((i) => (
      <span key={i} className={`collab__cell collab__cell--${kind} ${i <= lit ? "is-on" : ""}`} />
    ));

  const title =
    level === 1
      ? `${collabLabel(level)}: made entirely by human hands.`
      : `${collabLabel(level)}: human ${human} of 4, SI ${si} of 4. ${DISCLOSURE}`;

  return (
    <span className="collab" title={title}>
      <span className="collab__row">
        <span className="collab__end">Human</span>
        <span className="collab__cells">{cells(human, "human")}</span>
      </span>
      <span className="collab__row">
        <span className="collab__end">SI</span>
        <span className="collab__cells">{cells(si, "si")}</span>
      </span>
      {showLabel && <span className="collab__label">{collabLabel(level)}</span>}
    </span>
  );
}
