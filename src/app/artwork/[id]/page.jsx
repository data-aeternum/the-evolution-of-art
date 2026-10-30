import Artwork from "@/src/components/Artwork.jsx";
import { Suspense } from "react";
import { getArtworkById } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import CritiquesList, { CritiquesListSkeleton } from "@/src/components/Critiques/CritiquesList";
import { CuratorNote, CuratorNoteSkeleton } from "@/src/components/Critiques/CuratorNote";
import { getFirestore } from "firebase/firestore";

// The page for one artwork: hero + details, the Gemini curator's note, then the critiques
export default async function ArtworkPage(props) {
  // This is a server component, so it can read the URL parameters and load the data it needs
  const params = await props.params;
  const { currentUser, firebaseServerApp } = await getAuthenticatedAppForUser();
  const artwork = await getArtworkById(getFirestore(firebaseServerApp), params.id);

  return (
    <div className="main__artwork">
      <Artwork id={params.id} initialArtwork={artwork} initialUserId={currentUser?.uid || ""}>
        <Suspense fallback={<CuratorNoteSkeleton />}>
          <CuratorNote artworkId={params.id} />
        </Suspense>
      </Artwork>
      <Suspense fallback={<CritiquesListSkeleton numCritiques={artwork.numRatings} />}>
        <CritiquesList artworkId={params.id} userId={currentUser?.uid || ""} />
      </Suspense>
    </div>
  );
}
