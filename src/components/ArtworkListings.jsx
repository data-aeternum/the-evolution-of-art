"use client";

// This component handles the gallery (artwork listings) page.
// It receives the initial artworks and the URL search params from src/app/page.js.
// Two views: "Fan" (the 3D fan with the Rate focus screen) and "Legacy" (the card grid).

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import renderStars from "@/src/components/Stars.jsx";
import CollabMeter from "@/src/components/CollabMeter.jsx";
import { getArtworksSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";
import FanGallery from "@/src/components/FanGallery.jsx";
import { useUser } from "@/src/lib/getUser";

// The focus screen is only loaded when someone presses Rate
const RateScreen = dynamic(() => import("@/src/components/RateScreen.jsx"));

// ---- Legacy view: one gallery card, linking to the artwork's own page ----

const ArtworkItem = ({ artwork }) => (
  <li key={artwork.id}>
    {/* prefetch off: the artwork page runs Gemini on the server, so only fetch it on a real click */}
    <Link href={`/artwork/${artwork.id}`} prefetch={false}>
      <ArtworkCard artwork={artwork} />
    </Link>
  </li>
);

const ArtworkCard = ({ artwork }) => (
  <div className="card">
    <ImageCover photo={artwork.photo} title={artwork.title} />
    <ArtworkCardDetails artwork={artwork} />
  </div>
);

const ImageCover = ({ photo, title }) => (
  <div className="image-cover">
    <img src={photo} alt={title} />
  </div>
);

const ArtworkCardDetails = ({ artwork }) => (
  <div className="artwork__details">
    <h2>{artwork.title}</h2>
    <p className="artwork__artist">{artwork.artist}</p>
    <ArtworkRating artwork={artwork} />
    <ArtworkMetadata artwork={artwork} />
  </div>
);

const ArtworkRating = ({ artwork }) => (
  <div className="artwork__rating">
    <ul>{renderStars(artwork.avgRating)}</ul>
    <span>({artwork.numRatings})</span>
  </div>
);

const ArtworkMetadata = ({ artwork }) => (
  <div className="artwork__meta">
    <p>
      {artwork.era} · {artwork.origin}
    </p>
    <CollabMeter artwork={artwork} showLabel={false} />
  </div>
);

// ---- The listings page ----

export default function ArtworkListings({ initialArtworks, searchParams, initialUserId }) {
  const router = useRouter();

  // The initial filters come from the URL, so a refresh keeps the same view
  const initialFilters = {
    origin: searchParams.origin || "",
    era: searchParams.era || "",
    collab: searchParams.collab || "",
    sort: searchParams.sort || "",
  };

  const [artworks, setArtworks] = useState(initialArtworks);
  const [filters, setFilters] = useState(initialFilters);
  const [view, setView] = useState(searchParams.view === "legacy" ? "legacy" : "fan");
  const [rating, setRating] = useState(null); // the artwork open in the Rate screen
  const userId = useUser()?.uid || initialUserId;

  // Keep the URL in sync with the chosen filters and view
  useEffect(() => {
    routerWithFilters(router, { ...filters, view: view === "legacy" ? "legacy" : "" });
  }, [router, filters, view]);

  // Listen for live changes to the filtered gallery
  useEffect(() => {
    return getArtworksSnapshot((data) => {
      setArtworks(data);
    }, filters);
  }, [filters]);

  // Keep the Rate screen's artwork fresh as ratings arrive
  const ratingArtwork = rating ? artworks.find((a) => a.id === rating.id) || rating : null;

  return (
    <article>
      <div className="view-toggle" role="tablist" aria-label="Gallery view">
        <button
          type="button"
          role="tab"
          aria-selected={view === "fan"}
          onClick={() => setView("fan")}
        >
          Fan
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "legacy"}
          onClick={() => setView("legacy")}
        >
          Legacy
        </button>
      </div>

      <Filters filters={filters} setFilters={setFilters} />

      {artworks.length === 0 && (
        <p className="empty">
          The gallery is empty. Sign in and choose "Add the collection" from the menu.
        </p>
      )}

      {view === "fan" ? (
        <FanGallery artworks={artworks} userId={userId} onRate={(artwork) => setRating(artwork)} />
      ) : (
        <ul className="artworks">
          {artworks.map((artwork) => (
            <ArtworkItem key={artwork.id} artwork={artwork} />
          ))}
        </ul>
      )}

      {ratingArtwork && (
        <RateScreen artwork={ratingArtwork} userId={userId} onClose={() => setRating(null)} />
      )}
    </article>
  );
}

// Write the active filters (and the view, when not the default) into the URL query string
function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}
