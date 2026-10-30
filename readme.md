### The Evolution of Art

A gallery that runs from the cave wall to the neural net. Each artwork carries a
collaboration score (Human, Human-led, Co-created, SI-rendered). SI means super
intelligence, and every SI-rendered work was piloted by a human art director. Signed-in
visitors write critiques; Gemini reads them and writes the Curator's Note, plus a short
"Collaborator's View" in the voice of the SI that helped render the work.

Built for CS55-13 (Server-Side Web Development, SRJC) as a derivative of the Firebase
"Friendly Eats" Next.js codelab. Next.js App Router, React Server Components, Firebase
Auth (Google), Cloud Firestore, Cloud Storage, Firebase App Hosting, and Genkit with Gemini.

Code written with Claude (Anthropic) as the coding agent, directed by Tad MacPherson.

#### Data model

```
artworks/{id}                title, artist, aiModel, era, origin, collab (1-4), year, medium,
                             description, photo, source, avgRating, numRatings, sumRating, timestamp
artworks/{id}/critiques/{id} rating, text, userId, timestamp
```

#### Run it locally

1. Create `.env` with the web app config of your Firebase project:

   ```
   FIREBASE_WEBAPP_CONFIG={"projectId":"...","appId":"...","storageBucket":"...","apiKey":"...","authDomain":"...","messagingSenderId":"..."}
   GEMINI_API_KEY=...
   ```

2. Install and start:

   ```sh
   npm i
   npm run dev
   ```

3. Open `http://localhost:3000`, click **Sign In with Google**, then open the menu in the
   top right and choose **Add the collection**.

#### Deploy

```sh
firebase deploy --only firestore,storage
firebase apphosting:secrets:set GEMINI_API_KEY
```

Then connect the GitHub repository to a Firebase App Hosting backend in the console.

#### Image credits

Public-domain works are served from Wikimedia Commons. SI-era works are from the Golden
Codex studio (golden-codex.com), each piloted by a human art director, and used with the
artist's permission.
