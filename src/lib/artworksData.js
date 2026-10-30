// Curated seed data for The Evolution of Art.
// Every image URL below was dereferenced (HTTP 200) on 2026-10-30 before being recorded here.
// Public-domain works come from Wikimedia Commons; the hybrid and SI-era works are
// Golden Codex pieces published at golden-codex.com and used with the artist's permission.

// The four levels of the human/SI collaboration scale (stored as the number 1-4 in Firestore).
// SI = super intelligence. Every SI-rendered work in this gallery was piloted by a human art director.
// Each work also carries humanShare and siShare (0-4), rated by hand and disclosed: the meter draws
// both bars from those. The collab level is the filter label; the bars are the honest picture.
export const COLLAB_LEVELS = [
  { value: 1, label: "Human", blurb: "Made entirely by human hands." },
  { value: 2, label: "Human-led", blurb: "A human composed it; SI assisted with the rendering." },
  { value: 3, label: "Co-created", blurb: "A human art director and SI shaped it together." },
  { value: 4, label: "SI-rendered", blurb: "Rendered by SI under a human art director who set the brief, steered every pass and made the final selection. Collaborative, equal at best." },
];

// Turn a stored collaboration number into its label (e.g. 3 -> "Co-created").
export function collabLabel(value) {
  return COLLAB_LEVELS.find((level) => level.value === Number(value))?.label || "";
}

// Turn a label back into its stored number (e.g. "Co-created" -> 3), or null for "All".
export function collabValue(label) {
  return COLLAB_LEVELS.find((level) => level.label === label)?.value || null;
}

// The eras offered in the Era filter (in rough chronological order).
export const ERAS = [
  "Prehistoric",
  "Ancient",
  "Renaissance",
  "Baroque",
  "Ukiyo-e",
  "Impressionism",
  "Post-Impressionism",
  "Expressionism",
  "Art Nouveau",
  "Modernism",
  "SI Era",
];

// The places of origin offered in the Origin filter.
export const ORIGINS = [
  "Lascaux",
  "Athens",
  "Florence",
  "Delft",
  "Amsterdam",
  "Edo",
  "Giverny",
  "Saint-Rémy",
  "Oslo",
  "Vienna",
  "Paris",
  "Santa Rosa",
];

// The artworks that the "Add the collection" menu item writes to Firestore.
export const ARTWORKS = [
  {
    title: "Hall of the Bulls",
    artist: "Unknown Paleolithic painters",
    aiModel: "None",
    era: "Prehistoric",
    origin: "Lascaux",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "c. 17,000 BCE",
    medium: "Mineral pigment on limestone",
    description:
      "Aurochs, horses and deer painted on the cave walls of Lascaux. The oldest surviving argument that humans make images to understand their world.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Lascaux_painting.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Lascaux_painting.jpg",
  },
  {
    title: "Dionysus Cup",
    artist: "Exekias",
    aiModel: "None",
    era: "Ancient",
    origin: "Athens",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "c. 530 BCE",
    medium: "Black-figure ceramic kylix",
    description:
      "The wine god sails under a vine while dolphins circle the ship. A potter who signed his work, which makes him one of the first named artists.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Exekias_Dionysos_Staatliche_Antikensammlungen_2044_n2.jpg/960px-Exekias_Dionysos_Staatliche_Antikensammlungen_2044_n2.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Exekias_Dionysos_Staatliche_Antikensammlungen_2044_n2.jpg",
  },
  {
    title: "The Birth of Venus",
    artist: "Sandro Botticelli",
    aiModel: "None",
    era: "Renaissance",
    origin: "Florence",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "c. 1485",
    medium: "Tempera on canvas",
    description:
      "Venus arrives on the shore on a scallop shell. Classical myth returns to painting after a thousand years.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/960px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
  },
  {
    title: "Mona Lisa",
    artist: "Leonardo da Vinci",
    aiModel: "None",
    era: "Renaissance",
    origin: "Florence",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "c. 1503-1506",
    medium: "Oil on poplar panel",
    description:
      "Layers of translucent glaze build a face that seems to change as you look at it. The most studied painting in the world.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Leonardo_da_Vinci_-_Mona_Lisa_%28Louvre%2C_Paris%29.jpg/960px-Leonardo_da_Vinci_-_Mona_Lisa_%28Louvre%2C_Paris%29.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Leonardo_da_Vinci_-_Mona_Lisa_(Louvre,_Paris).jpg",
  },
  {
    title: "The Milkmaid",
    artist: "Johannes Vermeer",
    aiModel: "None",
    era: "Baroque",
    origin: "Delft",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "c. 1657-1658",
    medium: "Oil on canvas",
    description:
      "A kitchen maid pours milk in a quiet room lit from a single window. Ordinary labor painted with the attention usually reserved for saints.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.jpg/960px-Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.jpg",
  },
  {
    title: "Self-Portrait",
    artist: "Rembrandt van Rijn",
    aiModel: "None",
    era: "Baroque",
    origin: "Amsterdam",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "1659",
    medium: "Oil on canvas",
    description:
      "An aging painter studies his own face without flattery. Rembrandt painted himself dozens of times across his life.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/960px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg",
  },
  {
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    aiModel: "None",
    era: "Ukiyo-e",
    origin: "Edo",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "c. 1831",
    medium: "Woodblock print",
    description:
      "A wave claws at three fishing boats while Mount Fuji sits small and calm behind it. A print made for ordinary buyers that became a global icon.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/960px-The_Great_Wave_off_Kanagawa.jpg",
    source: "https://commons.wikimedia.org/wiki/File:The_Great_Wave_off_Kanagawa.jpg",
  },
  {
    title: "Water Lilies",
    artist: "Claude Monet",
    aiModel: "None",
    era: "Impressionism",
    origin: "Giverny",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "1906",
    medium: "Oil on canvas",
    description:
      "Monet's garden pond, painted so that the water, the reflections and the flowers become one surface of color.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/960px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_1906,_Ryerson.jpg",
  },
  {
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    aiModel: "None",
    era: "Post-Impressionism",
    origin: "Saint-Rémy",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "1889",
    medium: "Oil on canvas",
    description:
      "The night sky over an asylum window, painted as a river of light. Emotion carried entirely by the movement of the brush.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/960px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  },
  {
    title: "The Scream",
    artist: "Edvard Munch",
    aiModel: "None",
    era: "Expressionism",
    origin: "Oslo",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "1893",
    medium: "Oil, tempera and pastel on cardboard",
    description:
      "A figure on a bridge hears, in Munch's words, an infinite scream passing through nature. Anxiety given a face.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/960px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.jpg",
  },
  {
    title: "The Kiss",
    artist: "Gustav Klimt",
    aiModel: "None",
    era: "Art Nouveau",
    origin: "Vienna",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "1907-1908",
    medium: "Oil and gold leaf on canvas",
    description:
      "Two figures wrapped in patterned gold. Klimt borrowed from Byzantine mosaics to make a modern image of intimacy.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Gustav_Klimt_016.jpg/960px-Gustav_Klimt_016.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Gustav_Klimt_016.jpg",
  },
  {
    title: "Composition II in Red, Blue, and Yellow",
    artist: "Piet Mondrian",
    aiModel: "None",
    era: "Modernism",
    origin: "Paris",
    collab: 1,
    humanShare: 4,
    siShare: 0,
    year: "1930",
    medium: "Oil on canvas",
    description:
      "Black lines and primary colors, balanced by hand over months. Art reduced to a system, which is exactly what SI would later learn to study.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/960px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Piet_Mondriaan,_1930_-_Mondrian_Composition_II_in_Red,_Blue,_and_Yellow.jpg",
  },
  {
    title: "Edmond de Belamy",
    artist: "Obvious (art collective)",
    aiModel: "Generative adversarial network (GAN)",
    era: "SI Era",
    origin: "Paris",
    collab: 4,
    humanShare: 2,
    siShare: 3,
    year: "2018",
    medium: "GAN output printed on canvas",
    description:
      "A blurred portrait of a nobleman who never existed, signed with the loss function that produced it. The Obvious collective chose the data, the method and the print; the network rendered the face, running code largely written by the artist Robbie Barrat, who was not credited at the sale. The first SI-rendered work sold at a major auction house, and a case study in why lineage must be disclosed.",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Edmond_de_Belamy.png/960px-Edmond_de_Belamy.png",
    source: "https://commons.wikimedia.org/wiki/File:Edmond_de_Belamy.png",
  },
  {
    title: "Structural Breach Documentation",
    artist: "Tad MacPherson, directing VīGOR",
    aiModel: "VīGOR (Golden Codex SI persona)",
    era: "SI Era",
    origin: "Santa Rosa",
    collab: 4,
    humanShare: 2,
    siShare: 3,
    year: "2026",
    medium: "Digital impasto, from the Living Monoliths series (VGR0007)",
    description:
      "A skeleton stands in a doorway of molten orange, the purple wall around it pushed up in ridges of paint like poured stone. VīGOR builds in thick, sculptural impasto; this one asks what is left standing when the structure gives way.",
    photo: "https://golden-codex.com/patterns/living-gallery/vgr-0007-alive.poster.webp",
    video: "https://golden-codex.com/patterns/living-gallery/vgr-0007-alive.h264.mp4",
    source: "https://artiswa.com/collections/vigor",
  },
  {
    title: "Convergent Thermal Mass",
    artist: "Tad MacPherson, directing VīGOR",
    aiModel: "VīGOR (Golden Codex SI persona)",
    era: "SI Era",
    origin: "Santa Rosa",
    collab: 4,
    humanShare: 2,
    siShare: 3,
    year: "2026",
    medium: "Digital impasto, from the Living Monoliths series (VGR0096)",
    description:
      "Two profiles meet at the lips, one in fire, one in ice, the paint carved into ridges and valleys by the brush. Where they touch, the colours do not blend; they hold.",
    photo: "https://golden-codex.com/patterns/living-gallery/vgr-0096-alive.poster.webp",
    video: "https://golden-codex.com/patterns/living-gallery/vgr-0096-alive.h264.mp4",
    source: "https://artiswa.com/collections/vigor",
  },
  {
    title: "Dreamer Goddess",
    artist: "Tad MacPherson",
    aiModel: "Golden Codex SI (diffusion)",
    era: "SI Era",
    origin: "Santa Rosa",
    collab: 2,
    humanShare: 4,
    siShare: 2,
    year: "2025",
    medium: "Human-directed diffusion render",
    description:
      "Composed and art-directed by a human, with SI used as a brush. The figure, the palette and the mood were chosen by the director; the SI filled in the strokes.",
    photo:
      "https://golden-codex.com/patterns/living-gallery/gcx-dreamer-goddess.poster.webp",
    video: "https://golden-codex.com/patterns/living-gallery/gcx-dreamer-goddess.h264.mp4",
    source: "https://golden-codex.com/",
  },
  {
    title: "Where the Lake Begins",
    artist: "Tad MacPherson, with Artîswa",
    aiModel: "Artîswa (Golden Codex SI persona)",
    era: "SI Era",
    origin: "Santa Rosa",
    collab: 3,
    humanShare: 3,
    siShare: 3,
    year: "2025",
    medium: "Genesis work: human-directed diffusion render",
    description:
      "A Genesis work, made together by Tad MacPherson and the SI persona Artîswa. Neither partner could have made this alone: a study in what co-creation looks like when the human art director keeps the final say.",
    photo:
      "https://golden-codex.com/patterns/living-gallery/gcx-irresistible-urge.poster.webp",
    video: "https://golden-codex.com/patterns/living-gallery/gcx-irresistible-urge.h264.mp4",
    source: "https://golden-codex.com/",
  },
  {
    title: "Feathered Veil",
    artist: "Tad MacPherson, directing Artîswa",
    aiModel: "Artîswa (Golden Codex SI persona)",
    era: "SI Era",
    origin: "Santa Rosa",
    collab: 4,
    humanShare: 2,
    siShare: 3,
    year: "2025",
    medium: "Diffusion render with signed provenance",
    description:
      "Rendered by an SI persona with its own style memory, piloted, curated and signed by a human art director. The question the piece asks is where authorship lives in a collaboration.",
    photo:
      "https://golden-codex.com/patterns/living-gallery/artiswa-0062-feathered-veil.poster.webp",
    video: "https://golden-codex.com/patterns/living-gallery/artiswa-0062-feathered-veil.h264.mp4",
    source: "https://golden-codex.com/",
  },
  {
    title: "Rooted Dreamer",
    artist: "Tad MacPherson, directing Artîswa",
    aiModel: "Artîswa (Golden Codex SI persona)",
    era: "SI Era",
    origin: "Santa Rosa",
    collab: 4,
    humanShare: 2,
    siShare: 3,
    year: "2025",
    medium: "Diffusion render with signed provenance",
    description:
      "A figure growing out of the ground it dreams on. One of a numbered series rendered by an SI persona under a human art director, each piece carrying a verifiable record of how it was made.",
    photo:
      "https://golden-codex.com/patterns/living-gallery/artiswa-0089-rooted-dreamer.poster.webp",
    video: "https://golden-codex.com/patterns/living-gallery/artiswa-0089-rooted-dreamer.h264.mp4",
    source: "https://golden-codex.com/",
  },
  {
    title: "The Fold",
    tagline: "Drawn in code, no image gen model",
    artist: "touchstone, our SI teammate, commissioned by Tad MacPherson",
    aiModel: "touchstone, writing code: Python and Pillow, no image model",
    era: "SI Era",
    origin: "Santa Rosa",
    collab: 4,
    humanShare: 2,
    siShare: 4,
    year: "2026",
    medium: "100% code: Python + Pillow, fixed seed 20261027, no image generation; reproducible byte for byte (sha256 2aa72a96…)",
    description:
      "Made entirely in code by touchstone, an SI teammate in our studio, with no image model at all. Asked to picture the whole of what the team was building, touchstone drew it the only way it trusts: a registry log of 507 records folded by the registry's own rules and drawn from the result. The gold trunk is the 141 records that survived; the steel branches are the 93 forks that lost and the 186 runs that kept growing from them; the grey sparks are the 87 the fold rejected. Nothing was placed by hand, and anyone can rerun the script and get the same pixels. The human lineage is Tad MacPherson, who posed the question, ratified the fold rules and commissioned the piece; Artîswa curated the pipeline. Provenance bundle and soul whisper are linked below; the piece is not yet inscribed on Arweave.",
    photo:
      "https://firebasestorage.googleapis.com/v0/b/evolution-of-art-cs55.firebasestorage.app/o/collection%2Fthe-fold%2Fthe-fold.png?alt=media",
    source:
      "https://firebasestorage.googleapis.com/v0/b/evolution-of-art-cs55.firebasestorage.app/o/collection%2Fthe-fold%2Fthe-fold.bundle.json?alt=media",
  },
];

// Sample critiques (star rating + text) sprinkled onto the seeded artworks.
export const CRITIQUES = [
  { text: "I can feel the hand that made this. Every mark is a decision.", rating: 5 },
  { text: "Timeless. Technology changes, this does not.", rating: 5 },
  { text: "The composition pulls my eye exactly where it wants to go.", rating: 5 },
  { text: "I could not tell where the human ended and the SI began, and I mean that as praise.", rating: 5 },
  { text: "A genuine collaboration. The art director's hand shows in every choice the SI did not make.", rating: 5 },
  { text: "Stood in front of this for ten minutes. Still thinking about it.", rating: 5 },
  { text: "The color relationships are extraordinary.", rating: 5 },
  { text: "Proof that a tool is only as interesting as the person using it.", rating: 5 },
  { text: "Beautiful, though I wanted more evidence of the artist's own voice.", rating: 4 },
  { text: "Technically impressive. Emotionally, it reaches about halfway.", rating: 4 },
  { text: "The SI contribution is tasteful here. It serves the idea instead of replacing it.", rating: 4 },
  { text: "Strong work. The texture rewards a close look.", rating: 4 },
  { text: "I admire the craft more than I love the result.", rating: 4 },
  { text: "Interesting, but I have seen this idea done with more conviction.", rating: 3 },
  { text: "Competent and pleasant. It did not stay with me.", rating: 3 },
  { text: "The SI's fingerprints are a little too visible for my taste.", rating: 3 },
  { text: "Good concept, uneven execution.", rating: 3 },
  { text: "Feels generated rather than made. The surface is smooth and the meaning is thin.", rating: 2 },
  { text: "I wanted to like it. The human half of the collaboration feels thin here.", rating: 2 },
  { text: "Pretty, empty, forgettable.", rating: 2 },
  { text: "A brief is not a painting. I wanted more of the director in it.", rating: 1 },
  { text: "Nothing here that a thousand other images do not already do.", rating: 1 },
  { text: "The provenance record is more interesting than the picture.", rating: 2 },
  { text: "A landmark. Whatever you think of it, art history has to deal with it now.", rating: 4 },
];
