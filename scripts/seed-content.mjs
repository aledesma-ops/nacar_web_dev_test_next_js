/**
 * Seed del contenido.
 *
 * Vuelca a `content/` los datos que hoy viven hardcodeados en src/data/site.ts
 * más las dos colecciones de Figma Sites (Articles y Cinema selects) en los
 * tres idiomas. Se ejecuta una sola vez: a partir de ahí la fuente de verdad
 * son los archivos del repo y el panel de /keystatic.
 *
 *   node scripts/seed-content.mjs          → no pisa lo que ya existe
 *   node scripts/seed-content.mjs --force  → regenera todo
 */

import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

const ROOT = process.cwd();
const FORCE = process.argv.includes("--force");
const LOCALES = ["en", "es", "ca"];

const IMG = (name) => `/images/uploads/${name}`;

// ---------------------------------------------------------------------------
// Artículos — datos de la tabla "Articles"
// ---------------------------------------------------------------------------

const ARTICLES = [
  {
    key: "listening-to-films-that-drift",
    category: "film",
    date: "2028-08-21",
    thumb: "article-1.png",
    header: "article-2.png",
    featured: true,
    en: {
      title: "Listening to Films That Drift",
      slug: "listening-to-films-that-drift",
      alt: "Hands reaching through dense forest undergrowth",
      blurb:
        "Some films unfold like a sigh, trading plot for texture and letting sound carry the weight of everything left unsaid.",
      body: [
        ["Time as sensation", "In drifting cinema, duration stops being a container and becomes the subject. A held shot is not dead time; it is the film asking you to notice what changes when nothing happens."],
        ["The score underneath", "Ambient scores do the narrative work that dialogue refuses. Listen to the room tone and you hear the plot: pressure, hesitation, the long exhale before a decision nobody narrates."],
      ],
    },
    es: {
      title: "Escuchar películas que se dejan llevar",
      slug: "escuchar-peliculas-que-se-dejan-llevar",
      alt: "Manos abriéndose paso entre la maleza de un bosque denso",
      blurb:
        "Hay películas que se despliegan como un suspiro: cambian la trama por la textura y dejan que el sonido cargue con todo lo que no se dice.",
      body: [
        ["El tiempo como sensación", "En el cine a la deriva la duración deja de ser un recipiente y pasa a ser el tema. Un plano sostenido no es tiempo muerto: es la película pidiéndote que mires qué cambia cuando no pasa nada."],
        ["La banda sonora por debajo", "Las bandas sonoras ambientales hacen el trabajo narrativo que el diálogo se niega a hacer. Escucha el ruido de sala y estarás escuchando la trama: presión, duda, el suspiro largo antes de una decisión que nadie narra."],
      ],
    },
    ca: {
      title: "Escoltar pel·lícules que es deixen portar",
      slug: "escoltar-pellicules-que-es-deixen-portar",
      alt: "Mans obrint-se pas entre la brossa d'un bosc dens",
      blurb:
        "Hi ha pel·lícules que es despleguen com un sospir: canvien la trama per la textura i deixen que el so carregui amb tot allò que no es diu.",
      body: [
        ["El temps com a sensació", "En el cinema a la deriva la durada deixa de ser un recipient i passa a ser el tema. Un pla sostingut no és temps mort: és la pel·lícula demanant-te que miris què canvia quan no passa res."],
        ["La banda sonora per sota", "Les bandes sonores ambientals fan la feina narrativa que el diàleg es nega a fer. Escolta el so de sala i estaràs escoltant la trama."],
      ],
    },
  },
  {
    key: "drowning-in-delay",
    category: "music",
    date: "2028-08-06",
    thumb: "article-2.png",
    header: "article-3.png",
    featured: true,
    en: {
      title: "Drowning in Delay: The Revival of Shoegaze",
      slug: "drowning-in-delay-the-revival-of-shoegaze",
      alt: "Person holding an open book in front of their face",
      blurb:
        "The amps are blown, the pedals are stacked, and a new generation has decided that burying the vocal is the point rather than the problem.",
      body: [
        ["Fuzz as texture, not just volume", "The revival gets misread as nostalgia for loudness. It is closer to a materials question: what happens to a melody when you sand it down until only its silhouette survives?"],
        ["The vocal as instrument", "Push the voice into the mix and it stops being an authority. The listener leans in, and the meaning arrives as weather rather than as statement."],
      ],
    },
    es: {
      title: "Ahogarse en delay: el regreso del shoegaze",
      slug: "ahogarse-en-delay-el-regreso-del-shoegaze",
      alt: "Persona sosteniendo un libro abierto delante de la cara",
      blurb:
        "Los amplis están reventados, los pedales apilados, y una nueva generación ha decidido que enterrar la voz es el objetivo y no el problema.",
      body: [
        ["Fuzz como textura, no solo volumen", "El regreso se lee mal como nostalgia del volumen. Es más bien una cuestión de materiales: qué le pasa a una melodía cuando la lijas hasta que solo sobrevive su silueta."],
        ["La voz como instrumento", "Empuja la voz hacia dentro de la mezcla y deja de ser una autoridad. Quien escucha se inclina hacia delante y el significado llega como clima, no como afirmación."],
      ],
    },
    ca: {
      title: "Ofegar-se en delay: el retorn del shoegaze",
      slug: "ofegar-se-en-delay-el-retorn-del-shoegaze",
      alt: "Persona sostenint un llibre obert davant de la cara",
      blurb:
        "Els amplis estan rebentats, els pedals apilats, i una nova generació ha decidit que enterrar la veu és l'objectiu i no el problema.",
      body: [
        ["Fuzz com a textura, no només volum", "El retorn es llegeix malament com a nostàlgia del volum. És més aviat una qüestió de materials: què li passa a una melodia quan la poleixes fins que només en sobreviu la silueta."],
        ["La veu com a instrument", "Empeny la veu cap dins de la mescla i deixa de ser una autoritat. Qui escolta s'inclina endavant i el significat arriba com a clima."],
      ],
    },
  },
  {
    key: "color-repetition-softness",
    category: "film",
    date: "2028-07-11",
    thumb: "article-3.png",
    header: "article-4.png",
    featured: false,
    en: {
      title: "Color, Repetition, and the Sound of Softness",
      slug: "color-repetition-and-the-sound-of-softness",
      alt: "Stylized flowers in saturated pastel tones",
      blurb:
        "Softness isn't weakness—it's a formal decision with teeth, and a palette repeated often enough becomes an argument.",
      body: [
        ["The visual hum", "Some directors repeat a color until it stops reading as decoration and starts reading as pressure. The third time you see that pink, it means something it did not mean the first time."],
        ["Repetition as memory", "A motif returning is the cheapest and most reliable way a film has of telling you what its character cannot forget."],
      ],
    },
    es: {
      title: "Color, repetición y el sonido de lo suave",
      slug: "color-repeticion-y-el-sonido-de-lo-suave",
      alt: "Flores estilizadas en tonos pastel saturados",
      blurb:
        "Lo suave no es debilidad: es una decisión formal con dientes, y una paleta repetida las veces suficientes acaba siendo un argumento.",
      body: [
        ["El zumbido visual", "Hay directores que repiten un color hasta que deja de leerse como decoración y empieza a leerse como presión. La tercera vez que ves ese rosa significa algo que no significaba la primera."],
        ["La repetición como memoria", "Un motivo que vuelve es la forma más barata y más fiable que tiene una película de decirte qué es lo que su personaje no consigue olvidar."],
      ],
    },
    ca: {
      title: "Color, repetició i el so d'allò suau",
      slug: "color-repeticio-i-el-so-dallo-suau",
      alt: "Flors estilitzades en tons pastel saturats",
      blurb:
        "Allò suau no és debilitat: és una decisió formal amb dents, i una paleta repetida prou vegades acaba sent un argument.",
      body: [
        ["El brunzit visual", "Hi ha directors que repeteixen un color fins que deixa de llegir-se com a decoració i comença a llegir-se com a pressió."],
        ["La repetició com a memòria", "Un motiu que torna és la manera més barata i fiable que té una pel·lícula de dir-te què és allò que el seu personatge no aconsegueix oblidar."],
      ],
    },
  },
  {
    key: "mirrors-image-loops",
    category: "visual",
    date: "2028-06-24",
    thumb: "article-4.png",
    header: "article-1.png",
    featured: false,
    en: {
      title: "Mirrors, Image Loops, and Feedback",
      slug: "mirrors-image-loops-and-feedback",
      alt: "Limbs multiplied across a mirrored surface",
      blurb:
        "We're always looking—but who is looking back? On mirrors as the oldest special effect and the newest anxiety.",
      body: [
        ["The aesthetics of reflection", "Mirrors let an image contain its own audience. Once the frame includes the act of watching, the viewer stops being safely outside it."],
        ["Feedback as form", "Point a camera at its own output and you get the visual equivalent of a held note: an image that keeps deciding what it is."],
      ],
    },
    es: {
      title: "Espejos, bucles de imagen y retroalimentación",
      slug: "espejos-bucles-de-imagen-y-retroalimentacion",
      alt: "Extremidades multiplicadas sobre una superficie especular",
      blurb:
        "Siempre estamos mirando, pero ¿quién nos devuelve la mirada? Sobre el espejo como el efecto especial más antiguo y la ansiedad más reciente.",
      body: [
        ["La estética del reflejo", "El espejo permite que una imagen contenga a su propio público. En cuanto el encuadre incluye el acto de mirar, quien mira deja de estar cómodamente fuera."],
        ["La retroalimentación como forma", "Apunta una cámara a su propia salida y obtienes el equivalente visual de una nota sostenida: una imagen que sigue decidiendo qué es."],
      ],
    },
    ca: {
      title: "Miralls, bucles d'imatge i retroalimentació",
      slug: "miralls-bucles-dimatge-i-retroalimentacio",
      alt: "Extremitats multiplicades sobre una superfície especular",
      blurb:
        "Sempre estem mirant, però qui ens retorna la mirada? Sobre el mirall com l'efecte especial més antic i l'ansietat més recent.",
      body: [
        ["L'estètica del reflex", "El mirall permet que una imatge contingui el seu propi públic. Quan l'enquadrament inclou l'acte de mirar, qui mira deixa d'estar còmodament a fora."],
        ["La retroalimentació com a forma", "Apunta una càmera a la seva pròpia sortida i obtindràs l'equivalent visual d'una nota sostinguda."],
      ],
    },
  },
  {
    key: "wrapped-in-haze",
    category: "film",
    date: "2028-06-07",
    thumb: "article-1.png",
    header: "article-3.png",
    featured: false,
    en: {
      title: "Wrapped in Haze: Cinema and the Blur",
      slug: "wrapped-in-haze-cinema-and-the-blur",
      alt: "Portrait obscured behind translucent plastic",
      blurb:
        "What happens when we can't quite see? Blur as a narrative device rather than a technical failure.",
      body: [
        ["The aesthetics of un-clarity", "Diffusion filters, smeared focus, fog: each one asks the viewer to complete the image, and a viewer who completes an image has agreed to be complicit in it."],
        ["Against the sharp", "High resolution flattened a century of mystery. The blur is how contemporary cinema smuggles it back in."],
      ],
    },
    es: {
      title: "Envueltos en bruma: el cine y el desenfoque",
      slug: "envueltos-en-bruma-el-cine-y-el-desenfoque",
      alt: "Retrato difuminado tras un plástico translúcido",
      blurb:
        "¿Qué pasa cuando no acabamos de ver? El desenfoque como recurso narrativo y no como fallo técnico.",
      body: [
        ["La estética de la falta de nitidez", "Filtros de difusión, foco emborronado, niebla: todos piden a quien mira que complete la imagen. Y quien completa una imagen ya ha aceptado ser cómplice de ella."],
        ["Contra lo nítido", "La alta resolución aplanó un siglo de misterio. El desenfoque es la forma que tiene el cine contemporáneo de colarlo otra vez."],
      ],
    },
    ca: {
      title: "Embolcallats en boira: el cinema i el desenfocament",
      slug: "embolcallats-en-boira-el-cinema-i-el-desenfocament",
      alt: "Retrat difuminat darrere d'un plàstic translúcid",
      blurb:
        "Què passa quan no acabem de veure-hi? El desenfocament com a recurs narratiu i no com a error tècnic.",
      body: [
        ["L'estètica de la manca de nitidesa", "Filtres de difusió, focus emborronat, boira: tots demanen a qui mira que completi la imatge."],
        ["Contra allò nítid", "L'alta resolució va aplanar un segle de misteri. El desenfocament és la manera que té el cinema contemporani de tornar-lo a colar."],
      ],
    },
  },
  {
    key: "burnt-amber-silhouettes",
    category: "music",
    date: "2028-06-01",
    thumb: "article-2.png",
    header: "article-4.png",
    featured: false,
    en: {
      title: "Burnt Amber Silhouettes: Sound in Sepia",
      slug: "burnt-amber-silhouettes-sound-in-sepia",
      alt: "Figure lit in deep orange against a dark room",
      blurb:
        "There's a kind of music that feels lit from behind—warm, receding, already remembering itself as it plays.",
      body: [
        ["The silhouette genre", "Call it amber pop: tape saturation, slow attack, everything mixed like it reached you through a wall. The genre's subject is distance itself."],
        ["Warmth as a claim", "Analog warmth is never neutral. Choosing it is choosing to sound like the past, which is always an argument about the present."],
      ],
    },
    es: {
      title: "Siluetas de ámbar quemado: sonido en sepia",
      slug: "siluetas-de-ambar-quemado-sonido-en-sepia",
      alt: "Figura iluminada en naranja intenso sobre una habitación oscura",
      blurb:
        "Hay una música que parece iluminada desde atrás: cálida, en retirada, recordándose a sí misma mientras suena.",
      body: [
        ["El género silueta", "Llámalo pop ámbar: saturación de cinta, ataque lento, todo mezclado como si te llegara a través de una pared. El tema del género es la distancia misma."],
        ["El calor como afirmación", "La calidez analógica nunca es neutra. Elegirla es elegir sonar a pasado, y eso siempre es un argumento sobre el presente."],
      ],
    },
    ca: {
      title: "Siluetes d'ambre cremat: so en sèpia",
      slug: "siluetes-dambre-cremat-so-en-sepia",
      alt: "Figura il·luminada en taronja intens sobre una habitació fosca",
      blurb:
        "Hi ha una música que sembla il·luminada des del darrere: càlida, en retirada, recordant-se a si mateixa mentre sona.",
      body: [
        ["El gènere silueta", "Digues-li pop ambre: saturació de cinta, atac lent, tot mesclat com si t'arribés a través d'una paret."],
        ["La calidesa com a afirmació", "La calidesa analògica mai no és neutra. Triar-la és triar sonar a passat, i això sempre és un argument sobre el present."],
      ],
    },
  },
  {
    key: "sky-mirror-diaries",
    category: "visual",
    date: "2028-05-29",
    thumb: "article-3.png",
    header: "article-2.png",
    featured: false,
    en: {
      title: "Sky Mirror Diaries: Visual Culture of Reflection",
      slug: "sky-mirror-diaries-visual-culture-of-reflection",
      alt: "Mirror held up to an overcast sky",
      blurb:
        "What happens when the subject turns the lens around and points it at everything except themselves?",
      body: [
        ["Face out, world in", "Contemporary self-portraiture keeps refusing the face. The mirror shows the sky, the room, the street—everything the person is standing inside of."],
        ["The diary as archive", "Shoot the same reflection daily and the images stop being about you. They become a record of weather, light, and how long you kept going."],
      ],
    },
    es: {
      title: "Diarios de espejo y cielo: cultura visual del reflejo",
      slug: "diarios-de-espejo-y-cielo-cultura-visual-del-reflejo",
      alt: "Espejo sostenido frente a un cielo encapotado",
      blurb:
        "¿Qué pasa cuando quien es retratado gira el objetivo y lo apunta a todo menos a sí mismo?",
      body: [
        ["La cara fuera, el mundo dentro", "El autorretrato contemporáneo insiste en negar la cara. El espejo enseña el cielo, la habitación, la calle: todo aquello dentro de lo que esa persona está."],
        ["El diario como archivo", "Fotografía el mismo reflejo cada día y las imágenes dejan de hablar de ti. Pasan a ser un registro de clima, de luz y de cuánto aguantaste."],
      ],
    },
    ca: {
      title: "Diaris de mirall i cel: cultura visual del reflex",
      slug: "diaris-de-mirall-i-cel-cultura-visual-del-reflex",
      alt: "Mirall sostingut davant d'un cel ennuvolat",
      blurb:
        "Què passa quan qui és retratat gira l'objectiu i l'apunta a tot menys a si mateix?",
      body: [
        ["La cara fora, el món dins", "L'autoretrat contemporani insisteix a negar la cara. El mirall ensenya el cel, l'habitació, el carrer."],
        ["El diari com a arxiu", "Fotografia el mateix reflex cada dia i les imatges deixen de parlar de tu. Passen a ser un registre de clima i de llum."],
      ],
    },
  },
  {
    key: "grain-collapse",
    category: "visual",
    date: "2028-05-12",
    thumb: "article-4.png",
    header: "article-1.png",
    featured: false,
    en: {
      title: "Grain Collapse: The Aesthetics of Noise",
      slug: "grain-collapse-the-aesthetics-of-noise",
      alt: "Swirling noise pattern in monochrome",
      blurb:
        "Smooth pixels are out. Fractured, degraded, deliberately broken images are how a generation signals that it was here.",
      body: [
        ["Collapse as control", "Artists like this because degradation is one of the few variables a digital image still lets you author. Noise is the last handmade thing on screen."],
        ["Against the default", "Every platform pushes toward clean. Choosing grain is choosing to be legible as a person rather than as a feed."],
      ],
    },
    es: {
      title: "Colapso de grano: la estética del ruido",
      slug: "colapso-de-grano-la-estetica-del-ruido",
      alt: "Patrón de ruido en espiral, monocromo",
      blurb:
        "El píxel limpio ha pasado de moda. La imagen fracturada, degradada y rota a propósito es como una generación señala que estuvo aquí.",
      body: [
        ["El colapso como control", "A quien crea le gusta porque la degradación es una de las pocas variables que una imagen digital todavía te deja firmar. El ruido es lo último hecho a mano que queda en pantalla."],
        ["Contra el valor por defecto", "Toda plataforma empuja hacia lo limpio. Elegir el grano es elegir ser legible como persona y no como feed."],
      ],
    },
    ca: {
      title: "Col·lapse de gra: l'estètica del soroll",
      slug: "collapse-de-gra-lestetica-del-soroll",
      alt: "Patró de soroll en espiral, monocrom",
      blurb:
        "El píxel net ha passat de moda. La imatge fracturada, degradada i trencada a propòsit és com una generació assenyala que hi va ser.",
      body: [
        ["El col·lapse com a control", "A qui crea li agrada perquè la degradació és una de les poques variables que una imatge digital encara et deixa signar."],
        ["Contra el valor per defecte", "Tota plataforma empeny cap a allò net. Triar el gra és triar ser llegible com a persona i no com a feed."],
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Cinema selects — datos de la tabla "Cinema selects"
// ---------------------------------------------------------------------------

const FILMS = [
  {
    slug: "static-bloom", title: "Static Bloom", year: 2004,
    en: { mood: "Hazy, melancholic", why: "For the light leaks and long silences" },
    es: { mood: "Brumosa, melancólica", why: "Por las fugas de luz y los silencios largos" },
    ca: { mood: "Boirosa, malenconiosa", why: "Per les fuites de llum i els silencis llargs" },
  },
  {
    slug: "glass-rerun", title: "Glass Rerun", year: 1998,
    en: { mood: "Dreamlike, looping", why: "Feels like déjà vu on VHS" },
    es: { mood: "Onírica, en bucle", why: "Parece un déjà vu grabado en VHS" },
    ca: { mood: "Onírica, en bucle", why: "Sembla un déjà vu gravat en VHS" },
  },
  {
    slug: "cold-century", title: "Cold Century", year: 2024,
    en: { mood: "Stark, restrained", why: "A political breakup wrapped in ice" },
    es: { mood: "Seca, contenida", why: "Una ruptura política envuelta en hielo" },
    ca: { mood: "Seca, continguda", why: "Una ruptura política embolcallada en gel" },
  },
  {
    slug: "wires-in-the-grass", title: "Wires in the Grass", year: 1988,
    en: { mood: "Pastoral, eerie", why: "Folk horror meets sci-fi" },
    es: { mood: "Pastoral, inquietante", why: "Terror folk que se cruza con la ciencia ficción" },
    ca: { mood: "Pastoral, inquietant", why: "Terror folk que es creua amb la ciència-ficció" },
  },
  {
    slug: "blue-minor", title: "Blue Minor", year: 2001,
    en: { mood: "Intimate, jazzy", why: "Mood-driven editing and a killer score" },
    es: { mood: "Íntima, jazzística", why: "Montaje guiado por la atmósfera y una banda sonora enorme" },
    ca: { mood: "Íntima, jazzística", why: "Muntatge guiat per l'atmosfera i una banda sonora enorme" },
  },
  {
    slug: "false-dawn", title: "False Dawn", year: 2025,
    en: { mood: "Bleak, slow burn", why: "A sunrise that never delivers" },
    es: { mood: "Desolada, de fuego lento", why: "Un amanecer que nunca llega a cumplir" },
    ca: { mood: "Desolada, de foc lent", why: "Una albada que mai no arriba a complir" },
  },
  {
    slug: "hyperfield", title: "Hyperfield", year: 1993,
    en: { mood: "Lush, glitchy", why: "The glitch is the emotion" },
    es: { mood: "Exuberante, con glitch", why: "El glitch es la emoción" },
    ca: { mood: "Exuberant, amb glitch", why: "El glitch és l'emoció" },
  },
  {
    slug: "nocturne-number-5", title: "Nocturne Number 5", year: 1980,
    en: { mood: "Slow, romantic", why: "A love story told entirely at night" },
    es: { mood: "Lenta, romántica", why: "Una historia de amor contada entera de noche" },
    ca: { mood: "Lenta, romàntica", why: "Una història d'amor explicada tota de nit" },
  },
];

// ---------------------------------------------------------------------------
// Singletons
// ---------------------------------------------------------------------------

const HOME = {
  en: {
    marquee: "Independent writing on music, film, and visual culture—one deep cut at a time.",
    hero: { image: IMG("hero.png"), alt: "" },
    articles: { viewAllLabel: "View all" },
    featuredAlbum: {
      heading: "Featured Album",
      cover: IMG("featured-album.png"),
      coverAlt: "Album cover for 'False Memory' by Artifact — abstract blue and white geometric blur with gothic-style typography",
      title: "False Memory by Artifact",
      ctaLabel: "Listen now",
      ctaHref: "https://example.com",
    },
    cinema: {
      heading: "Cinema Selects",
      labels: { film: "Film", year: "Year", mood: "Mood", whyWatch: "Why watch" },
    },
  },
  es: {
    marquee: "Escritura independiente sobre música, cine y cultura visual—una pieza cada vez.",
    hero: { image: IMG("hero.png"), alt: "" },
    articles: { viewAllLabel: "Ver todo" },
    featuredAlbum: {
      heading: "Álbum destacado",
      cover: IMG("featured-album.png"),
      coverAlt: "Portada del álbum 'False Memory' de Artifact — desenfoque geométrico azul y blanco con tipografía gótica",
      title: "False Memory, de Artifact",
      ctaLabel: "Escuchar ahora",
      ctaHref: "https://example.com",
    },
    cinema: {
      heading: "Selección de cine",
      labels: { film: "Película", year: "Año", mood: "Mood", whyWatch: "Por qué verla" },
    },
  },
  ca: {
    marquee: "Escriptura independent sobre música, cinema i cultura visual—una peça cada cop.",
    hero: { image: IMG("hero.png"), alt: "" },
    articles: { viewAllLabel: "Veure-ho tot" },
    featuredAlbum: {
      heading: "Àlbum destacat",
      cover: IMG("featured-album.png"),
      coverAlt: "Portada de l'àlbum 'False Memory' d'Artifact — desenfocament geomètric blau i blanc amb tipografia gòtica",
      title: "False Memory, d'Artifact",
      ctaLabel: "Escoltar ara",
      ctaHref: "https://example.com",
    },
    cinema: {
      heading: "Selecció de cinema",
      labels: { film: "Pel·lícula", year: "Any", mood: "Mood", whyWatch: "Per què veure-la" },
    },
  },
};

const SITE = {
  en: {
    name: "Grain Archive",
    seo: {
      titleTemplate: "%s · Grain Archive",
      description: "Independent writing on music, film, and visual culture—one deep cut at a time.",
    },
    nav: [
      { label: "Home", route: "home", variant: "orange" },
      { label: "Archive", route: "archive", variant: "green" },
      { label: "About", route: "about", variant: "blue" },
    ],
    archive: {
      heading: "Archive",
      intro: "Everything published so far, newest first.",
      allLabel: "All",
      emptyLabel: "Nothing here yet.",
    },
    subscribe: {
      heading: "Tune into the signal",
      body: "No noise—just deep cuts on music, film, and culture",
      ctaLabel: "Subscribe",
      ctaHref: "#",
    },
    footer: {
      columns: [
        { label: "Links", links: [
          { label: "Home", href: "home" },
          { label: "Archive", href: "archive" },
          { label: "About", href: "about" },
        ] },
        { label: "Connect", links: [
          { label: "Instagram", href: "https://www.instagram.com/figma" },
          { label: "Threads", href: "https://www.threads.com/@figma" },
          { label: "YouTube", href: "https://www.youtube.com/@Figma" },
          { label: "Email", href: "mailto:mail@grainarchive.com" },
        ] },
      ],
      copyright: "©2025 Grain Archive",
      tagline: "Words, images, and signals from the edge",
    },
  },
  es: {
    name: "Grain Archive",
    seo: {
      titleTemplate: "%s · Grain Archive",
      description: "Escritura independiente sobre música, cine y cultura visual—una pieza cada vez.",
    },
    nav: [
      { label: "Inicio", route: "home", variant: "orange" },
      { label: "Archivo", route: "archive", variant: "green" },
      { label: "Sobre", route: "about", variant: "blue" },
    ],
    archive: {
      heading: "Archivo",
      intro: "Todo lo publicado hasta ahora, empezando por lo más reciente.",
      allLabel: "Todo",
      emptyLabel: "Aquí todavía no hay nada.",
    },
    subscribe: {
      heading: "Sintoniza la señal",
      body: "Sin ruido—solo piezas de fondo sobre música, cine y cultura",
      ctaLabel: "Suscribirme",
      ctaHref: "#",
    },
    footer: {
      columns: [
        { label: "Enlaces", links: [
          { label: "Inicio", href: "home" },
          { label: "Archivo", href: "archive" },
          { label: "Sobre", href: "about" },
        ] },
        { label: "Conecta", links: [
          { label: "Instagram", href: "https://www.instagram.com/figma" },
          { label: "Threads", href: "https://www.threads.com/@figma" },
          { label: "YouTube", href: "https://www.youtube.com/@Figma" },
          { label: "Email", href: "mailto:mail@grainarchive.com" },
        ] },
      ],
      copyright: "©2025 Grain Archive",
      tagline: "Palabras, imágenes y señales desde el borde",
    },
  },
  ca: {
    name: "Grain Archive",
    seo: {
      titleTemplate: "%s · Grain Archive",
      description: "Escriptura independent sobre música, cinema i cultura visual—una peça cada cop.",
    },
    nav: [
      { label: "Inici", route: "home", variant: "orange" },
      { label: "Arxiu", route: "archive", variant: "green" },
      { label: "Sobre", route: "about", variant: "blue" },
    ],
    archive: {
      heading: "Arxiu",
      intro: "Tot el que s'ha publicat fins ara, començant pel més recent.",
      allLabel: "Tot",
      emptyLabel: "Aquí encara no hi ha res.",
    },
    subscribe: {
      heading: "Sintonitza el senyal",
      body: "Sense soroll—només peces de fons sobre música, cinema i cultura",
      ctaLabel: "Subscriure'm",
      ctaHref: "#",
    },
    footer: {
      columns: [
        { label: "Enllaços", links: [
          { label: "Inici", href: "home" },
          { label: "Arxiu", href: "archive" },
          { label: "Sobre", href: "about" },
        ] },
        { label: "Connecta", links: [
          { label: "Instagram", href: "https://www.instagram.com/figma" },
          { label: "Threads", href: "https://www.threads.com/@figma" },
          { label: "YouTube", href: "https://www.youtube.com/@Figma" },
          { label: "Email", href: "mailto:mail@grainarchive.com" },
        ] },
      ],
      copyright: "©2025 Grain Archive",
      tagline: "Paraules, imatges i senyals des de la vora",
    },
  },
};

const ABOUT = {
  en: {
    title: "About Grain Archive",
    intro: "A small publication about the textures of music, film, and images.",
    body: [
      ["What this is", "Grain Archive is independent writing on the parts of culture that resist a summary: the hum under a scene, the color that keeps coming back, the noise nobody cleaned up."],
      ["How it works", "Everything here is published by a small editorial team directly from the site's own CMS. No agency in between, no ticket queue."],
    ],
  },
  es: {
    title: "Sobre Grain Archive",
    intro: "Una publicación pequeña sobre las texturas de la música, el cine y las imágenes.",
    body: [
      ["Qué es esto", "Grain Archive es escritura independiente sobre las partes de la cultura que se resisten al resumen: el zumbido bajo una escena, el color que vuelve, el ruido que nadie limpió."],
      ["Cómo funciona", "Todo lo que hay aquí lo publica un equipo editorial pequeño desde el propio CMS del sitio. Sin agencia en medio y sin cola de tickets."],
    ],
  },
  ca: {
    title: "Sobre Grain Archive",
    intro: "Una publicació petita sobre les textures de la música, el cinema i les imatges.",
    body: [
      ["Què és això", "Grain Archive és escriptura independent sobre les parts de la cultura que es resisteixen al resum: el brunzit sota una escena, el color que torna, el soroll que ningú no va netejar."],
      ["Com funciona", "Tot el que hi ha aquí ho publica un equip editorial petit des del CMS del mateix lloc. Sense agència pel mig ni cua de tiquets."],
    ],
  },
};

// ---------------------------------------------------------------------------
// Escritura
// ---------------------------------------------------------------------------

let written = 0;
let skipped = 0;

async function write(relPath, contents) {
  const full = path.join(ROOT, relPath);
  if (!FORCE) {
    try {
      await fs.access(full);
      skipped++;
      return;
    } catch {
      /* no existe: seguimos */
    }
  }
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, contents, "utf8");
  written++;
}

/** YAML sin sorpresas: fechas y números como los espera Keystatic. */
const toYaml = (data) =>
  YAML.stringify(data, { lineWidth: 0, defaultStringType: "PLAIN", nullStr: "" });

function frontmatter(data, body) {
  return `---\n${toYaml(data)}---\n\n${body}`;
}

function markdocBody(sections) {
  return sections.map(([heading, text]) => `## ${heading}\n\n${text}`).join("\n\n") + "\n";
}

async function seed() {
  for (const locale of LOCALES) {
    // Artículos
    for (const article of ARTICLES) {
      const l = article[locale];
      const data = {
        title: l.title,
        category: article.category,
        datePublished: article.date,
        thumbnail: { src: IMG(article.thumb), alt: l.alt },
        header: { src: IMG(article.header), alt: l.alt },
        introBlurb: l.blurb,
        featured: article.featured,
        translationKey: article.key,
        draft: false,
        seo: { title: "", description: "", ogImage: null },
      };
      await write(
        `content/articles/${locale}/${l.slug}.mdoc`,
        frontmatter(data, markdocBody(l.body)),
      );
    }

    // Cinema selects
    for (const [index, film] of FILMS.entries()) {
      const l = film[locale];
      await write(
        `content/cinema/${locale}/${film.slug}.yaml`,
        toYaml({
          title: film.title,
          year: film.year,
          mood: l.mood,
          whyWatch: l.why,
          order: index,
          translationKey: film.slug,
          draft: false,
        }),
      );
    }

    // Singletons
    const about = ABOUT[locale];
    await write(
      `content/settings/${locale}/about.mdoc`,
      frontmatter(
        {
          title: about.title,
          intro: about.intro,
          seo: { title: "", description: "", ogImage: null },
        },
        markdocBody(about.body),
      ),
    );
    await write(`content/settings/${locale}/home.yaml`, toYaml(HOME[locale]));
    await write(`content/settings/${locale}/site.yaml`, toYaml(SITE[locale]));
  }

  console.log(
    `Seed completado — ${written} archivos escritos, ${skipped} existentes respetados.` +
      (skipped && !FORCE ? " Usa --force para regenerarlos." : ""),
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
