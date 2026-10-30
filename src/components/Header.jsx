// Mark this file as a client component so it runs in the browser (it uses hooks and click handlers)
"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  onIdTokenChanged,
} from "@/src/lib/firebase/auth.js";
import { addSeedArtworksAndCritiques } from "@/src/lib/firebase/firestore.js";
import { setCookie, deleteCookie } from "cookies-next";

// Custom hook that keeps the browser's session cookie in sync with Firebase Auth
function useUserSession(initialUser) {
  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        // Store the ID token in the "__session" cookie so server components can read it
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);
      } else {
        await deleteCookie("__session");
      }
      // If the user the server rendered with is the same as the current user, nothing changed
      if (initialUser?.uid === user?.uid) {
        return;
      }
      // The user changed (signed in or out), so reload to re-render server content as the new user
      window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}

export default function Header({ initialUser }) {
  const user = useUserSession(initialUser);

  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <header>
      <Link href="/" className="logo">
        <img src="/evolution-of-art.svg" alt="The Evolution of Art" />
        <span>
          The Evolution of Art
          <small>From the cave wall to the neural net</small>
        </span>
      </Link>
      {user ? (
        <>
          <div className="profile">
            <p>
              <img
                className="profileImage"
                src={user.photoURL || "/profile.svg"}
                alt={user.email}
              />
              {user.displayName}
            </p>

            <div className="menu">
              ...
              <ul>
                <li>{user.displayName}</li>

                <li>
                  <a href="#" onClick={addSeedArtworksAndCritiques}>
                    Add the collection
                  </a>
                </li>

                <li>
                  <a href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="profile">
          <a href="#" onClick={handleSignIn}>
            <img src="/profile.svg" alt="A placeholder user image" />
            Sign In with Google
          </a>
        </div>
      )}
    </header>
  );
}
