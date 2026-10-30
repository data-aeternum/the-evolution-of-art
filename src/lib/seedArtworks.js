// Builds the seed records (artworks + a few critiques each) that get written to Firestore
// when a signed-in user picks "Add the collection" from the header menu.

import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { ARTWORKS, CRITIQUES } from "@/src/lib/artworksData.js";

import { Timestamp } from "firebase/firestore";

// Return every curated artwork with a random set of 0-5 sample critiques attached.
export async function generateArtworksAndCritiques() {
  const data = [];

  for (const artwork of ARTWORKS) {
    // Pretend the artwork was added to the gallery some time in the last few months.
    const artworkTimestamp = Timestamp.fromDate(getRandomDateBefore());

    const critiquesData = [];

    // Give each artwork a random number of sample critiques dated after it was added.
    for (let j = 0; j < randomNumberBetween(0, 5); j++) {
      const critiqueTimestamp = Timestamp.fromDate(
        getRandomDateAfter(artworkTimestamp.toDate())
      );

      // Pick one sample critique at random (rating and text stay together).
      const sample = CRITIQUES[randomNumberBetween(0, CRITIQUES.length - 1)];

      critiquesData.push({
        rating: sample.rating,
        text: sample.text,
        userId: `Visitor #${randomNumberBetween()}`,
        timestamp: critiqueTimestamp,
      });
    }

    // Pre-compute the rating totals so the gallery can sort without reading every critique.
    const sumRating = critiquesData.reduce((sum, c) => sum + c.rating, 0);
    const avgRating = critiquesData.length ? sumRating / critiquesData.length : 0;

    const artworkData = {
      ...artwork,
      avgRating,
      numRatings: critiquesData.length,
      sumRating,
      timestamp: artworkTimestamp,
    };

    data.push({ artworkData, critiquesData });
  }
  return data;
}
