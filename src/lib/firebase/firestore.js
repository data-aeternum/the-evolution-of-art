// All Firestore reads and writes for The Evolution of Art.
// Data model:
//   artworks/{artworkId}                 one document per artwork
//   artworks/{artworkId}/critiques/{id}  one document per visitor critique

// Import the helper that builds the seed artworks and critiques
import { generateArtworksAndCritiques } from "@/src/lib/seedArtworks.js";
// Import the label-to-number mapping for the collaboration scale
import { collabValue } from "@/src/lib/artworksData.js";

// Import the Cloud Firestore functions used in this module
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
} from "firebase/firestore";

// Import the shared client-side Firestore database instance
import { db } from "@/src/lib/firebase/clientApp";

// Save the public URL of an uploaded image on an artwork document
export async function updateArtworkImageReference(artworkId, publicImageUrl) {
  // Build a reference to the artwork document inside the "artworks" collection
  const artworkRef = doc(collection(db, "artworks"), artworkId);
  if (artworkRef) {
    // Set the artwork's "photo" field to the new image URL
    await updateDoc(artworkRef, { photo: publicImageUrl });
  }
}

// Update an artwork's rating totals and save a new critique inside one transaction
const updateWithCritique = async (transaction, docRef, newCritiqueDocument, critique) => {
  // Read the current artwork document inside the transaction
  const artwork = await transaction.get(docRef);
  const data = artwork.data();
  // Add one to the critique count, or start at 1 if there were none yet
  const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
  // Add the new star rating to the running total
  const newSumRating = (data?.sumRating || 0) + Number(critique.rating);
  // Compute the new average
  const newAverage = newSumRating / newNumRatings;

  // Queue the update of the artwork's rating fields
  transaction.update(docRef, {
    numRatings: newNumRatings,
    sumRating: newSumRating,
    avgRating: newAverage,
  });

  // Queue the creation of the new critique document
  transaction.set(newCritiqueDocument, {
    ...critique,
    timestamp: Timestamp.fromDate(new Date()),
  });
};

// Add a visitor's critique to an artwork
export async function addCritiqueToArtwork(db, artworkId, critique) {
  if (!artworkId) {
    throw new Error("No artwork ID has been provided.");
  }

  if (!critique) {
    throw new Error("A valid critique has not been provided.");
  }

  try {
    // Reference to the artwork document
    const docRef = doc(collection(db, "artworks"), artworkId);
    // Reference to a new, auto-ID document in the artwork's "critiques" subcollection
    const newCritiqueDocument = doc(collection(db, `artworks/${artworkId}/critiques`));

    // Run the rating update and the critique save together, atomically
    await runTransaction(db, (transaction) =>
      updateWithCritique(transaction, docRef, newCritiqueDocument, critique)
    );
  } catch (error) {
    console.error("There was an error adding the critique to the artwork", error);
    throw error;
  }
}

// Add filter and sort constraints to a query based on the user's chosen filters
function applyQueryFilters(q, { era, origin, collab, sort }) {
  // Era filter (for example "Renaissance")
  if (era) {
    q = query(q, where("era", "==", era));
  }
  // Origin filter (for example "Florence")
  if (origin) {
    q = query(q, where("origin", "==", origin));
  }
  // Collaboration filter: the UI passes a label ("Co-created"), Firestore stores a number (3)
  if (collab) {
    const level = collabValue(collab);
    if (level) {
      q = query(q, where("collab", "==", level));
    }
  }
  // Sort by average rating (default) or by number of critiques
  if (sort === "Rating" || !sort) {
    q = query(q, orderBy("avgRating", "desc"));
  } else if (sort === "Critiques") {
    q = query(q, orderBy("numRatings", "desc"));
  }
  return q;
}

// Convert a Firestore document into a plain object the page components can use
function toPlainArtwork(doc) {
  return {
    id: doc.id,
    ...doc.data(),
    // Only plain objects can cross from Server Components to Client Components,
    // so the Firestore Timestamp becomes a JavaScript Date
    timestamp: doc.data().timestamp.toDate(),
  };
}

// Read the list of artworks once (used by the server-rendered home page)
export async function getArtworks(db = db, filters = {}) {
  let q = query(collection(db, "artworks"));
  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map(toPlainArtwork);
}

// Listen for real-time changes to the artwork list (used by the client component)
export function getArtworksSnapshot(cb, filters = {}) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  let q = query(collection(db, "artworks"));
  q = applyQueryFilters(q, filters);

  // Subscribe to the query and return the unsubscribe function
  return onSnapshot(q, (querySnapshot) => {
    cb(querySnapshot.docs.map(toPlainArtwork));
  });
}

// Read a single artwork once by its ID
export async function getArtworkById(db, artworkId) {
  if (!artworkId) {
    console.log("Error: Invalid ID received: ", artworkId);
    return;
  }
  const docRef = doc(db, "artworks", artworkId);
  const docSnap = await getDoc(docRef);
  return {
    ...docSnap.data(),
    timestamp: docSnap.data().timestamp.toDate(),
  };
}

// Listen for real-time changes to a single artwork
export function getArtworkSnapshotById(artworkId, cb) {
  if (!artworkId) {
    console.log("Error: Invalid ID received: ", artworkId);
    return;
  }

  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  const docRef = doc(db, "artworks", artworkId);
  return onSnapshot(docRef, (docSnap) => {
    cb({
      ...docSnap.data(),
      timestamp: docSnap.data().timestamp.toDate(),
    });
  });
}

// Read all critiques for an artwork once, newest first
export async function getCritiquesByArtworkId(db, artworkId) {
  if (!artworkId) {
    console.log("Error: Invalid artworkId received: ", artworkId);
    return;
  }

  const q = query(
    collection(db, "artworks", artworkId, "critiques"),
    orderBy("timestamp", "desc")
  );

  const results = await getDocs(q);
  return results.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
  }));
}

// Listen for real-time changes to an artwork's critiques, newest first
export function getCritiquesSnapshotByArtworkId(artworkId, cb) {
  if (!artworkId) {
    console.log("Error: Invalid artworkId received: ", artworkId);
    return;
  }

  const q = query(
    collection(db, "artworks", artworkId, "critiques"),
    orderBy("timestamp", "desc")
  );
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    }));
    cb(results);
  });
}

// Write the curated collection and its sample critiques to Firestore
// (the "Add the collection" menu item). Artworks whose title already exists are skipped,
// so clicking the menu item twice does not create duplicates.
export async function addSeedArtworksAndCritiques() {
  const data = await generateArtworksAndCritiques();

  // Collect the titles already in the gallery
  const existing = await getDocs(collection(db, "artworks"));
  const existingTitles = new Set(existing.docs.map((d) => d.data().title));

  let added = 0;
  for (const { artworkData, critiquesData } of data) {
    if (existingTitles.has(artworkData.title)) {
      continue;
    }
    try {
      // Add the artwork as a new document in the "artworks" collection
      const docRef = await addDoc(collection(db, "artworks"), artworkData);

      // Add each sample critique to the artwork's "critiques" subcollection
      for (const critiqueData of critiquesData) {
        await addDoc(collection(db, "artworks", docRef.id, "critiques"), critiqueData);
      }
      added++;
    } catch (e) {
      console.log("There was an error adding the artwork");
      console.error("Error adding document: ", e);
    }
  }
  console.log(`Seeded ${added} artworks (${data.length - added} already present).`);
}
