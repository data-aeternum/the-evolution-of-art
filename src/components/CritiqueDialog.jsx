// Mark this file as a Client Component so it runs in the browser
"use client";

// The critique dialog. It uses a Next.js Server Action to handle the form submission.

import { useLayoutEffect, useRef } from "react";
import RatingPicker from "@/src/components/RatingPicker.jsx";
import { handleCritiqueFormSubmission } from "@/src/app/actions.js";

const CritiqueDialog = ({ isOpen, handleClose, critique, onChange, userId, id }) => {
  const dialog = useRef();

  // dialogs only render their backdrop when opened with showModal()
  useLayoutEffect(() => {
    if (isOpen) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [isOpen, dialog]);

  // Close when the visitor clicks outside the form
  const handleClick = (e) => {
    if (e.target === dialog.current) {
      handleClose();
    }
  };

  return (
    <dialog ref={dialog} onMouseDown={handleClick}>
      <form
        action={handleCritiqueFormSubmission}
        onSubmit={() => {
          handleClose();
        }}
      >
        <header>
          <h3>Write your critique</h3>
        </header>
        <article>
          <RatingPicker />

          <p>
            <input
              type="text"
              name="text"
              id="review"
              placeholder="What does this work say to you?"
              required
              value={critique.text}
              onChange={(e) => onChange(e.target.value, "text")}
            />
          </p>

          <input type="hidden" name="artworkId" value={id} />
          <input type="hidden" name="userId" value={userId} />
        </article>
        <footer>
          <menu>
            <button autoFocus type="reset" onClick={handleClose} className="button--cancel">
              Cancel
            </button>
            <button type="submit" value="confirm" className="button--confirm">
              Submit
            </button>
          </menu>
        </footer>
      </form>
    </dialog>
  );
};

export default CritiqueDialog;
