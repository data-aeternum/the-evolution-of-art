// This component shows an artwork's hero image and metadata, and offers the actions
// a signed-in visitor can take: upload a new image, or write a critique.

import React from "react";
import renderStars from "@/src/components/Stars.jsx";
import CollabMeter, { DISCLOSURE } from "@/src/components/CollabMeter.jsx";

const ArtworkDetails = ({
  artwork,
  userId,
  handleArtworkImage,
  setIsOpen,
  isOpen,
  children,
}) => {
  return (
    <section className="img__section">
      <img src={artwork.photo} alt={artwork.title} />

      <div className="actions">
        {userId && (
          <img
            alt="Write a critique"
            title="Write a critique"
            className="review"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            src="/review.svg"
          />
        )}
        <label
          onChange={(event) => handleArtworkImage(event.target)}
          htmlFor="upload-image"
          className="add"
          title="Upload a new image"
        >
          <input name="" type="file" id="upload-image" className="file-input hidden w-full h-full" />

          <img className="add-image" src="/add.svg" alt="Upload a new image" />
        </label>
      </div>

      <div className="details__container">
        <div className="details">
          <h2>{artwork.title}</h2>
          <p className="details__artist">
            {artwork.artist}
            {artwork.aiModel && artwork.aiModel !== "None" && (
              <span className="details__ai"> with {artwork.aiModel}</span>
            )}
          </p>

          <div className="artwork__rating">
            <ul>{renderStars(artwork.avgRating)}</ul>
            <span>({artwork.numRatings})</span>
          </div>

          <p>
            {artwork.era} · {artwork.origin} · {artwork.year}
          </p>
          <p className="details__medium">{artwork.medium}</p>
          <CollabMeter level={artwork.collab} />
          {artwork.description && <p className="details__description">{artwork.description}</p>}
          {/* Lineage: who and what made this work, disclosed in full */}
          <dl className="lineage">
            <div>
              <dt>Human contributor</dt>
              <dd>{artwork.artist}</dd>
            </div>
            <div>
              <dt>SI collaborator</dt>
              <dd>{artwork.aiModel && artwork.aiModel !== "None" ? artwork.aiModel : "None"}</dd>
            </div>
            <div>
              <dt>How they worked</dt>
              <dd>{artwork.medium}</dd>
            </div>
            {artwork.source && (
              <div>
                <dt>Source</dt>
                <dd>
                  <a href={artwork.source} target="_blank" rel="noreferrer">
                    {artwork.source.replace(/^https?:\/\//, "").split("/")[0]}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {Number(artwork.collab) > 1 && <p className="details__disclosure">{DISCLOSURE}</p>}
          {children}
        </div>
      </div>
    </section>
  );
};

export default ArtworkDetails;
