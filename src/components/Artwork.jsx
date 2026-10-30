// Mark this file as a Client Component so it runs in the browser
"use client";

// This component shows one individual artwork.
// It receives data from src/app/artwork/[id]/page.jsx

import { React, useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { getArtworkSnapshotById } from "@/src/lib/firebase/firestore.js";
import { useUser } from "@/src/lib/getUser";
import ArtworkDetails from "@/src/components/ArtworkDetails.jsx";
import { updateArtworkImage } from "@/src/lib/firebase/storage.js";

// Load the critique dialog lazily so its code is only downloaded when shown
const CritiqueDialog = dynamic(() => import("@/src/components/CritiqueDialog.jsx"));

export default function Artwork({ id, initialArtwork, initialUserId, children }) {
  const [artworkDetails, setArtworkDetails] = useState(initialArtwork);
  const [isOpen, setIsOpen] = useState(false);

  // The user ID is needed to attach a critique to its author and to decide whether to show the dialog
  const userId = useUser()?.uid || initialUserId;
  const [critique, setCritique] = useState({
    rating: 0,
    text: "",
  });

  // Update one field of the critique being written
  const onChange = (value, name) => {
    setCritique({ ...critique, [name]: value });
  };

  // Handle a new image chosen in the file input
  async function handleArtworkImage(target) {
    const image = target.files ? target.files[0] : null;
    if (!image) {
      return;
    }

    const imageURL = await updateArtworkImage(id, image);
    setArtworkDetails({ ...artworkDetails, photo: imageURL });
  }

  // Close the critique dialog and clear the draft
  const handleClose = () => {
    setIsOpen(false);
    setCritique({ rating: 0, text: "" });
  };

  // Subscribe to real-time updates for this artwork
  useEffect(() => {
    return getArtworkSnapshotById(id, (data) => {
      setArtworkDetails(data);
    });
  }, [id]);

  return (
    <>
      <ArtworkDetails
        artwork={artworkDetails}
        userId={userId}
        handleArtworkImage={handleArtworkImage}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {children}
      </ArtworkDetails>
      {userId && (
        <Suspense fallback={<p>Loading...</p>}>
          <CritiqueDialog
            isOpen={isOpen}
            handleClose={handleClose}
            critique={critique}
            onChange={onChange}
            userId={userId}
            id={id}
          />
        </Suspense>
      )}
    </>
  );
}
