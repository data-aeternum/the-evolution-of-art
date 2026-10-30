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
    <div className="main__home">
      <section className="hero">
        <h1>Twenty thousand years of making images.</h1>
        <p className="hero__lede">
          From cave art to art made by super intelligence, every work in this gallery carries its
          own sense of beauty, and its own lineage, disclosed in full.
        </p>
        {/* The full Creator's Statement, one tap away so the art comes first */}
        <details className="hero__more">
          <summary>Read the Creator&#39;s Statement</summary>
          <div className="hero__statement">
            <p>I am working on an initiative called Alexandria Aeternum. Its aim is to curate humanity&#39;s cultural artifacts and keep them, digitally, on Arweave: decentralized archival storage built to last for centuries. The plan does not stop with the past. Properly attributed modern works, in every form, belong there too.</p>
            <p>That includes work made with super intelligence (SI). It is controversial, and I understand why. But SI gives an artistic outlet to many people who could never otherwise see what they imagine take shape in the world. Note The Fold. A machine, asked to make something it would consider art, made it. No image model, no prompt. It is written strictly in code, and anyone who runs that code gets the same picture, byte for byte.</p>
            <p>From cave art to art made by super intelligence, every work in this gallery carries its own sense of beauty, and its own lineage, disclosed in full. That is the point.</p>
            <p>So when the assignment asked me to take the Friendly Eats restaurant app and make it my own, the subject chose itself. The restaurants became artworks: the Hall of the Bulls at Lascaux, a Greek cup signed by Exekias, Vermeer, Hokusai, Van Gogh, Mondrian, and then the SI era, from the first GAN portrait sold at auction to pieces from my own studio that I made with SI as a collaborator, with me as the art director piloting every pass.</p>
            <p>It is controversial, beautiful, and made with purpose. Let people be bothered if they must. That is what progress sometimes looks like.</p>
          </div>
        </details>
        <p className="hero__disclosure">
          SI means super intelligence. Every SI-rendered work here was commissioned and directed by a
          human; the two bars on every card are rated by hand and disclosed. The SI is a
          collaborator, never the author. Tad MacPherson
        </p>
      </section>
      <ArtworkListings
        initialArtworks={artworks}
        searchParams={searchParams}
        initialUserId={currentUser?.uid || ""}
      />
    </div>
  );
}
