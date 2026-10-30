// Server component that asks Gemini (through Genkit) for two things:
//   1. The Curator's Note: a one-sentence synthesis of what visitors have said about the work.
//   2. The Machine's View: two sentences on how the human/AI balance shaped the work.
// This is the "GPT-generated summary of user-generated content" the assignment asks for.

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
    const credit =
      artwork.aiModel && artwork.aiModel !== "None"
        ? `${artwork.artist} working with ${artwork.aiModel}`
        : artwork.artist;

    // 1. Curator's Note: summarize the visitors' critiques (only if there are any)
    let note = null;
    if (critiques.length > 0) {
      const notePrompt = `
        You are the curator of a gallery about the evolution of art from fully human
        works to human/AI collaborations. Visitors have written critiques of
        "${artwork.title}" by ${credit}. Each critique below is separated by a
        '${separator}' character. Write ONE sentence, in a warm curatorial voice,
        summarizing what visitors think of this work. Do not use lists or quotes.

        Critiques: ${critiques.map((c) => c.text).join(separator)}
      `;
      note = (await ai.generate(notePrompt)).text;
    }

    // 2. The Machine's View: reflect on the human/AI balance of the work
    const viewPrompt = `
      In exactly two short sentences, written in the first person as an AI reflecting
      honestly, describe what the balance between human and machine means for this work.
      Title: "${artwork.title}". Credit: ${credit}. Era: ${artwork.era}. Year: ${artwork.year}.
      Medium: ${artwork.medium}. Collaboration level: ${collabLabel(artwork.collab)}
      (${artwork.collab} of 4 on a scale from fully human to AI-led).
      Be specific to this work, never generic, and never claim to have made it.
    `;
    const view = (await ai.generate(viewPrompt)).text;

    return (
      <div className="curator__note">
        {note ? (
          <>
            <h4>Curator's Note</h4>
            <p>{note}</p>
          </>
        ) : (
          <>
            <h4>Curator's Note</h4>
            <p>No critiques yet, so no summary to write. Add the first one.</p>
          </>
        )}
        <h4>The Machine's View</h4>
        <p>{view}</p>
        <p className="curator__credit">✨ Written with Gemini</p>
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
