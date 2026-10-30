import renderStars from "@/src/components/Stars.jsx";

// One critique: stars, the text, and when it was written
export function Critique({ rating, text, timestamp }) {
  return (
    <li className="critique__item">
      <ul className="artwork__rating">{renderStars(rating)}</ul>
      <p>{text}</p>

      <time>
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
        }).format(timestamp)}
      </time>
    </li>
  );
}

// Grey placeholder shown while critiques load
export function CritiqueSkeleton() {
  return (
    <li className="critique__item">
      <div className="artwork__rating">
        <div className="skeleton" style={{ height: "2rem", width: "10rem" }}></div>
      </div>
      <div className="skeleton" style={{ height: "19px", width: "12rem" }}></div>
      <p>{"   "}</p>
    </li>
  );
}
