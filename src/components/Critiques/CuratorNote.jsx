// Server component that asks Gemini (through Genkit) for two things:
//   1. The Curator's Note: a one-sentence synthesis of what visitors have said about the work.
//   2. The Collaborator's View: two sentences, in the voice of the SI collaborator, on what the
//      partnership between the human art director and the SI meant for this work.
// This is the "GPT-generated summary of user-generated content" the assignment asks for.
// SI = super intelligence. Every SI-rendered work here was piloted by a human art director.

import { googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";
import { getCritiquesByArtworkId, getArtworkById } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore";
import { collabLabel } from "@/src/lib/artworksData.js";

export async function CuratorNote({ artworkId }) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);
  const [critiques, artwork] = await Promise.all([
    getCritiquesByArtworkId(db, artworkId),
    getArtworkById(db, artworkId),
  ]);

  try {
    if (!process.env.GEMINI_API_KEY) {
      // Set it with: firebase apphosting:secrets:set GEMINI_API_KEY
      throw new Error(
        'GEMINI_API_KEY not set. Set it with "firebase apphosting:secrets:set GEMINI_API_KEY"'
      );
    }

    // Configure a Genkit instance with the Google AI plugin (it reads GEMINI_API_KEY)
    const ai = genkit({
      plugins: [googleAI()],
      // The always-current Flash alias (older pinned Flash models are retired for new keys)
      model: googleAI.model("gemini-flash-latest"),
    });

    const separator = "@";
    const usesSI = artwork.aiModel && artwork.aiModel !== "None";
    const credit = usesSI ? `${artwork.artist}, working with ${artwork.aiModel}` : artwork.artist;

    // 1. Curator's Note: summarize the visitors' critiques (only if there are any)
    const notePrompt = `
      You are the curator of a gallery about the evolution of art, from fully human
      works to collaborations between human art directors and SI (super intelligence).
      Visitors have written critiques of "${artwork.title}" by ${credit}. Each critique
      below is separated by a '${separator}' character. Write ONE sentence, in a warm
      curatorial voice, summarizing what visitors think of this work. Say "SI", never "AI".
      Do not use lists or quotes.

      Critiques: ${critiques.map((c) => c.text).join(separator)}
    `;

    // 2. The Collaborator's View: reflect on the partnership behind the work
    const viewPrompt = usesSI
      ? `
      In exactly two short sentences, written in the first person as the SI (super
      intelligence) that helped render this work, describe what the partnership with the
      human art director meant for it. The human directed every step: the brief, the
      selection, the final call. You rendered under that direction. Say "SI", never "AI";
      never call yourself the author; be specific to this work, never generic.
      Title: "${artwork.title}". Credit: ${credit}. Era: ${artwork.era}. Year: ${artwork.year}.
      Medium: ${artwork.medium}. Collaboration level: ${collabLabel(artwork.collab)}
      (${artwork.collab} of 4 on a scale from fully human to SI-rendered under human direction).
    `
      : `
      In exactly two short sentences, written in the first person as an SI (super
      intelligence) that studies art, say what this fully human work teaches you about
      making images, and why no rendering of yours could replace it. Say "SI", never "AI";
      be specific to this work, never generic.
      Title: "${artwork.title}". Artist: ${artwork.artist}. Era: ${artwork.era}.
      Year: ${artwork.year}. Medium: ${artwork.medium}.
    `;

    // Ask Gemini both questions at the same time so the page is not waiting twice
    const [noteResult, viewResult] = await Promise.all([
      critiques.length > 0 ? ai.generate(notePrompt) : Promise.resolve(null),
      ai.generate(viewPrompt),
    ]);
    const note = noteResult ? noteResult.text : null;
    const view = viewResult.text;

    return (
      <div className="curator__note">
        <h4>Curator's Note</h4>
        <p>{note || "No critiques yet, so no summary to write. Add the first one."}</p>
        <h4>{usesSI ? "The Collaborator's View" : "An SI Looks On"}</h4>
        <p>{view}</p>
        <p className="curator__credit">✨ Written with Gemini, under the curator's direction</p>
      </div>
    );
  } catch (e) {
    console.error(e);
    return (
      <div className="curator__note">
        <p>The curator is away. Could not reach Gemini for a summary.</p>
      </div>
    );
  }
}

// Placeholder shown while Gemini is writing
export function CuratorNoteSkeleton() {
  return (
    <div className="curator__note">
      <p>✨ The curator is reading the critiques...</p>
    </div>
  );
}
