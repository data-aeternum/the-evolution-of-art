"use client";

// Client component: keeps the critique list live as new critiques arrive

import React, { useState, useEffect } from "react";
import { getCritiquesSnapshotByArtworkId } from "@/src/lib/firebase/firestore.js";
import { Critique } from "@/src/components/Critiques/Critique";

export default function CritiquesListClient({ initialCritiques, artworkId, userId }) {
  const [critiques, setCritiques] = useState(initialCritiques);

  useEffect(() => {
    return getCritiquesSnapshotByArtworkId(artworkId, (data) => {
      setCritiques(data);
    });
  }, [artworkId]);
  return (
    <article>
      <h3 className="critiques__heading">Critiques</h3>
      <ul className="critiques">
        {critiques.length > 0 ? (
          <ul>
            {critiques.map((critique) => (
              <Critique
                key={critique.id}
                rating={critique.rating}
                text={critique.text}
                timestamp={critique.timestamp}
              />
            ))}
          </ul>
        ) : (
          <p>
            Nobody has critiqued this work yet.{" "}
            {!userId ? "Sign in and" : ""} be the first.
          </p>
        )}
      </ul>
    </article>
  );
}
