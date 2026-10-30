// Import the Cloud Storage functions: ref() points at a file, uploadBytesResumable() uploads it, getDownloadURL() gets its public URL
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Import the shared client-side Cloud Storage instance
import { storage } from "@/src/lib/firebase/clientApp";

// Import the helper that saves the image URL on the artwork's Firestore document
import { updateArtworkImageReference } from "@/src/lib/firebase/firestore";

// Upload a new image for an artwork and save its URL on the artwork document
export async function updateArtworkImage(artworkId, image) {
  try {
    if (!artworkId) {
      throw new Error("No artwork ID has been provided.");
    }

    if (!image || !image.name) {
      throw new Error("A valid image has not been provided.");
    }

    // Upload the image to Cloud Storage and get its public URL
    const publicImageUrl = await uploadImage(artworkId, image);
    // Save that URL in the artwork's "photo" field in Firestore
    await updateArtworkImageReference(artworkId, publicImageUrl);

    // Return the URL so the page can show the new image right away
    return publicImageUrl;
  } catch (error) {
    console.error("Error processing request:", error);
  }
}

// Upload an image file to Cloud Storage and return its download URL
async function uploadImage(artworkId, image) {
  // Store the file at artworks/{artworkId}/{file name}
  const filePath = `artworks/${artworkId}/${image.name}`;
  const newImageRef = ref(storage, filePath);
  await uploadBytesResumable(newImageRef, image);

  return await getDownloadURL(newImageRef);
}
