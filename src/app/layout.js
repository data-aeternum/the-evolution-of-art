import "@/src/app/styles.css";
import Header from "@/src/components/Header.jsx";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
// Force Next.js to render this layout on every request (it depends on the signed-in user)
export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Evolution of Art",
  description:
    "A gallery of human and human/SI collaborative artworks, from the cave wall to the neural net. Every SI-rendered work was piloted by a human art director. Visitors critique; Gemini writes the curator's note. Built with Next.js and Firebase.",
};

export default async function RootLayout({ children }) {
  const { currentUser } = await getAuthenticatedAppForUser();
  return (
    <html lang="en">
      <body>
        <Header initialUser={currentUser?.toJSON()} />

        <main>{children}</main>

        <footer className="site-footer">
          <p>
            Public-domain works via Wikimedia Commons. SI-era works from the Golden Codex
            studio, each piloted by a human art director. SI means super intelligence. A CS55-13
            project by Tad MacPherson.
          </p>
        </footer>
      </body>
    </html>
  );
}
