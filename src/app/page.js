// The gallery (home) page: server-rendered list of artworks, then kept live on the client
import ArtworkListings from "@/src/components/ArtworkListings.jsx";
import { getArtworks } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

// Force Next.js to render this route on every request instead of at build time
export const dynamic = "force-dynamic";

export default async function Home(props) {
  // URL query parameters drive the filters, for example ?era=Renaissance&collab=Human&sort=Critiques
  const searchParams = await props.searchParams;
  // Create a server-side Firebase app that acts as the current user
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  // Fetch the artworks from Firestore on the server
  const artworks = await getArtworks(getFirestore(firebaseServerApp), searchParams);
  return (
    <main className="main__home">
      <section className="hero">
        <h1>Twenty thousand years of making images.</h1>
        <p>
          A gallery that runs from the cave wall to the neural net. Every work carries a
          collaboration score, from fully human to AI-led. Visitors write critiques; Gemini
          reads them and writes the curator's note.
        </p>
      </section>
      <ArtworkListings
        initialArtworks={artworks}
        searchParams={searchParams}
        initialUserId={currentUser?.uid || ""}
      />
    </main>
  );
}
