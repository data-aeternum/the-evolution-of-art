"use client";

// The focus screen: the work fills the screen, with a star rating and a comment below it.
// Opened from the Fan view's Rate button. Submits through the same Server Action as the
// dialog on the artwork page, so a rating from here lands in the same critiques collection.

import { useEffect, useRef } from "react";
import RatingPicker from "@/src/components/RatingPicker.jsx";
import CollabMeter, { DISCLOSURE } from "@/src/components/CollabMeter.jsx";
import renderStars from "@/src/components/Stars.jsx";
import { handleCritiqueFormSubmission } from "@/src/app/actions.js";
import { signInWithGoogle } from "@/src/lib/firebase/auth.js";

export default function RateScreen({ artwork, userId, onClose }) {
  const panel = useRef(null);

  // Escape closes the screen; lock page scroll while it is open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!artwork) return null;

  const credit =
    artwork.aiModel && artwork.aiModel !== "None"
      ? `${artwork.artist}, with ${artwork.aiModel}`
      : artwork.artist;

  return (
    <div
      className="rate-screen"
      role="dialog"
      aria-modal="true"
      aria-label={`Rate ${artwork.title}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button type="button" className="rate-screen__close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="rate-screen__panel" ref={panel}>
        <figure className="rate-screen__art">
          {artwork.video ? (
            <video autoPlay muted loop playsInline poster={artwork.photo}>
              <source src={artwork.video} type="video/mp4" />
            </video>
          ) : (
            <img src={artwork.photo} alt={artwork.title} />
          )}
        </figure>

        <div className="rate-screen__info">
          <p className="rate-screen__era">
            {artwork.era} · {artwork.origin} · {artwork.year}
          </p>
          <h2>{artwork.title}</h2>
          <p className="rate-screen__credit">{credit}</p>
          <p className="rate-screen__medium">{artwork.medium}</p>
          <CollabMeter artwork={artwork} />
          {Number(artwork.collab) > 1 && <p className="rate-screen__disclosure">{DISCLOSURE}</p>}
          <div className="rate-screen__current">
            <ul className="artwork__rating">{renderStars(artwork.avgRating)}</ul>
            <span>
              {artwork.numRatings} {artwork.numRatings === 1 ? "critique" : "critiques"} so far
            </span>
          </div>

          {userId ? (
            <form
              className="rate-screen__form"
              action={handleCritiqueFormSubmission}
              onSubmit={() => {
                // The Server Action runs; close the screen so the fan keeps moving
                setTimeout(onClose, 0);
              }}
            >
              <p className="rate-screen__prompt">Your rating</p>
              <RatingPicker />
              <input
                type="text"
                name="text"
                id="review"
                placeholder="What does this work say to you?"
                required
                autoComplete="off"
              />
              <input type="hidden" name="artworkId" value={artwork.id} />
              <input type="hidden" name="userId" value={userId} />
              <div className="rate-screen__buttons">
                <button type="button" className="button--cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="button--confirm">
                  Submit critique
                </button>
              </div>
            </form>
          ) : (
            <div className="rate-screen__form">
              <p className="rate-screen__prompt">Sign in to rate and critique this work.</p>
              <div className="rate-screen__buttons">
                <button type="button" className="button--cancel" onClick={onClose}>
                  Not now
                </button>
                <button type="button" className="button--confirm" onClick={() => signInWithGoogle()}>
                  Sign in with Google
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
