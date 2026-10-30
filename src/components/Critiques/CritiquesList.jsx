// Server component: loads the critiques for an artwork, then hands them to the client list

import React from "react";
import { getCritiquesByArtworkId } from "@/src/lib/firebase/firestore.js";
import CritiquesListClient from "@/src/components/Critiques/CritiquesListClient";
import { CritiqueSkeleton } from "@/src/components/Critiques/Critique";
import { getFirestore } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";

export default async function CritiquesList({ artworkId, userId }) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const critiques = await getCritiquesByArtworkId(getFirestore(firebaseServerApp), artworkId);

  return (
    <CritiquesListClient initialCritiques={critiques} artworkId={artworkId} userId={userId} />
  );
}

export function CritiquesListSkeleton({ numCritiques }) {
  return (
    <article>
      <ul className="critiques">
        <ul>
          {Array(numCritiques)
            .fill(0)
            .map((value, index) => (
              <CritiqueSkeleton key={`loading-critique-${index}`} />
            ))}
        </ul>
      </ul>
    </article>
  );
}
