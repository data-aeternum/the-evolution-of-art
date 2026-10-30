"use client";

// The "Fan" view: a 3D fan of the artworks, modeled on the living gallery on golden-codex.com.
// The active card sits flat in the middle; the others fan out behind it, tilted 70 degrees.
// Works that have a film play it when they come to the front. The fan advances on its own,
// holds while you hover or focus it, and answers to the arrow keys and to swipes.
// The Rate button hands the active work to the focus screen (see RateScreen.jsx).

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import renderStars from "@/src/components/Stars.jsx";
import CollabMeter from "@/src/components/CollabMeter.jsx";

const HOLD_MS = 6000; // how long a still stays in front before the fan advances
const ROT = "70deg"; // tilt of the cards behind the active one

export default function FanGallery({ artworks, onRate, userId }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(300);
  const stageRef = useRef(null);
  const firstCardRef = useRef(null);
  const videoRefs = useRef({});
  const holdTimer = useRef(null);
  const hovering = useRef(false);
  const pointerStart = useRef(null);
  const count = artworks.length;

  // Keep the active index valid when the filtered list changes
  useEffect(() => {
    if (active >= count) setActive(0);
  }, [count, active]);

  // Measure the card width (the fan geometry is expressed in card widths)
  useEffect(() => {
    const measure = () => {
      if (firstCardRef.current) setCardWidth(firstCardRef.current.offsetWidth || 300);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [count]);

  const go = useCallback(
    (index) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count]
  );

  // Autoplay: play the active card's film if it has one, otherwise hold, then advance
  useEffect(() => {
    clearTimeout(holdTimer.current);
    if (count === 0) return;
    const current = artworks[active];
    const video = videoRefs.current[current?.id];

    // Pause every other film
    Object.entries(videoRefs.current).forEach(([id, v]) => {
      if (v && id !== current?.id) {
        v.pause();
      }
    });

    const schedule = () => {
      clearTimeout(holdTimer.current);
      if (paused || hovering.current) return;
      holdTimer.current = setTimeout(() => go(active + 1), HOLD_MS);
    };

    if (video) {
      video.currentTime = 0;
      const onEnded = () => schedule();
      video.addEventListener("ended", onEnded);
      if (!paused) {
        video.play().catch(() => schedule());
      }
      return () => {
        video.removeEventListener("ended", onEnded);
        clearTimeout(holdTimer.current);
      };
    }
    schedule();
    return () => clearTimeout(holdTimer.current);
  }, [active, paused, count, artworks, go]);

  // Keyboard: left and right arrows move the fan
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      go(active - 1);
      e.preventDefault();
    }
    if (e.key === "ArrowRight") {
      go(active + 1);
      e.preventDefault();
    }
  };

  // Hover and focus hold the fan still
  const hold = () => {
    hovering.current = true;
    clearTimeout(holdTimer.current);
  };
  const release = () => {
    hovering.current = false;
    if (!paused) holdTimer.current = setTimeout(() => go(active + 1), HOLD_MS);
  };

  // Swipe: more than 40px of horizontal movement moves the fan
  const onPointerDown = (e) => {
    pointerStart.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (pointerStart.current == null) return;
    const dx = e.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
  };

  // The geometry from the living gallery: offset in card widths, tilt, scale and depth per step
  const transformFor = (index) => {
    let d = index - active;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    const v = Math.abs(d);
    const m = Math.sign(d);
    const n = cardWidth;
    const transform =
      v === 0
        ? "translateX(0) rotateY(0deg) scale(1) translateZ(0)"
        : `translateX(${m * (n / 3 + (v - 1) * n * 70 / 440)}px) rotateY(${m > 0 ? "-" : ""}${ROT}) scale(.83) translateZ(${-100 - 20 * Math.max(0, v - 3)}px)`;
    return { d, v, style: { zIndex: 100 - v, transform } };
  };

  if (count === 0) {
    return null;
  }

  const current = artworks[active];

  return (
    <div
      className="mv-lg"
      role="region"
      aria-roledescription="carousel"
      aria-label="The collection, as a fan"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocus={hold}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) release();
      }}
    >
      <div
        className="mv-lg-stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <ul className="mv-lg-track">
          {artworks.map((artwork, index) => {
            const { d, v, style } = transformFor(index);
            return (
              <li
                key={artwork.id}
                ref={index === 0 ? firstCardRef : null}
                className="mv-lg-card"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}: ${artwork.title}, ${artwork.artist}`}
                data-pos={d}
                data-far={v > 4}
                data-live={v === 0 && artwork.video ? "true" : "false"}
                aria-hidden={v !== 0}
                style={style}
                onClick={(e) => {
                  if (v !== 0 && !e.target.closest("button")) go(index);
                }}
              >
                <img src={artwork.photo} alt={artwork.title} loading={v <= 1 ? "eager" : "lazy"} decoding="async" />
                {artwork.video && (
                  <video
                    ref={(el) => {
                      videoRefs.current[artwork.id] = el;
                    }}
                    playsInline
                    muted
                    preload={v <= 1 ? "auto" : "none"}
                    poster={artwork.photo}
                    aria-hidden="true"
                  >
                    <source src={artwork.video} type="video/mp4" />
                  </video>
                )}
                <div className="mv-lg-shade"></div>
                <div className="mv-lg-meta">
                  <div>
                    <p className="mv-lg-title">{artwork.title}</p>
                    <p className="mv-lg-by">
                      {artwork.artist}
                      {artwork.aiModel && artwork.aiModel !== "None" ? ", with SI" : ""}
                    </p>
                  </div>
                  <span className="mv-lg-chip">{artwork.era}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* What is in front right now, with the Rate button (the twist on the original fan) */}
      <div className="mv-lg-focus">
        <div className="mv-lg-focus__rating">
          <ul className="artwork__rating">{renderStars(current.avgRating)}</ul>
          <span>({current.numRatings})</span>
        </div>
        <CollabMeter artwork={current} />
        <div className="mv-lg-focus__actions">
          <button type="button" className="mv-lg-rate" onClick={() => onRate(current)}>
            {userId ? "Rate this work" : "Sign in to rate"}
          </button>
          {/* prefetch off: the artwork page runs Gemini on the server, and the front card changes every few seconds */}
          <Link href={`/artwork/${current.id}`} className="mv-lg-open" prefetch={false}>
            Open
          </Link>
        </div>
      </div>

      <div className="mv-lg-bar">
        <button className="mv-lg-btn" type="button" onClick={() => go(active - 1)}>
          Previous
        </button>
        <span className="mv-lg-count">
          {active + 1} / {count}
        </span>
        <button className="mv-lg-btn" type="button" onClick={() => go(active + 1)}>
          Next
        </button>
        <button
          className="mv-lg-btn"
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? "Resume gallery" : "Pause gallery"}
        </button>
      </div>
      <p className="mv-lg-sr" aria-live="polite">
        {active + 1} of {count}: {current.title}, {current.artist}
      </p>
    </div>
  );
}
