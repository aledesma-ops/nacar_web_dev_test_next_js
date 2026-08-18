import { collection, fields, singleton } from "@keystatic/core";
import type { Locale } from "./i18n";

/**
 * Fábricas de esquema.
 *
 * Keystatic no tiene i18n nativo, así que el patrón es una colección por
 * idioma generada desde una misma fábrica. Ventaja frente a un campo de idioma
 * dentro del documento: el editor solo ve su idioma, los slugs son
 * independientes por idioma (URLs localizadas) y los archivos quedan separados
 * en el repo, lo que hace legibles los diffs y las PRs de traducción.
 *
 * El vínculo entre versiones de un mismo contenido es `translationKey`, que es
 * lo que permite emitir hreflang y el selector de idioma sin adivinar.
 */

const UPLOADS = {
  directory: "public/images/uploads",
  publicPath: "/images/uploads/",
} as const;

/** Campo compartido: identidad del contenido a través de los idiomas. */
const translationKey = fields.text({
  label: "Clave de traducción",
  description:
    "Opcional. Enlaza esta pieza con sus versiones en otros idiomas: escribe el mismo valor en las tres (por ejemplo, el slug del primer idioma que creaste). Vacío = la pieza existe solo en este idioma. No se muestra en la web.",
});

const draft = fields.checkbox({
  label: "Borrador",
  description:
    "Si está marcado, no se publica en producción. Sigue siendo visible en los deploys de preview.",
  defaultValue: false,
});

const seo = fields.object(
  {
    title: fields.text({
      label: "Título SEO",
      description: "Si se deja vacío se usa el título del contenido.",
    }),
    description: fields.text({
      label: "Meta descripción",
      multiline: true,
      description: "Recomendado entre 120 y 155 caracteres.",
    }),
    ogImage: fields.image({
      label: "Imagen para redes (OG)",
      description: "1200×630. Si se deja vacía se usa la imagen de cabecera.",
      ...UPLOADS,
    }),
  },
  {
    label: "SEO",
    description: "Opcional. Con dejarlo vacío el sitio genera valores sensatos.",
  },
);

// ---------------------------------------------------------------------------
// Articles — refleja la colección de Figma Sites (Title, Category, Date
// published, Image thumbnail, Image header, Intro blurb, Content, Slug)
// ---------------------------------------------------------------------------

export function articlesCollection(locale: Locale) {
  return collection({
    label: `Artículos · ${locale.toUpperCase()}`,
    path: `content/articles/${locale}/*`,
    slugField: "title",
    format: { contentField: "content" },
    entryLayout: "content",
    columns: ["title", "category", "datePublished"],
    schema: {
      title: fields.slug({
        name: {
          label: "Título",
          validation: { isRequired: true, length: { min: 3, max: 120 } },
        },
        slug: {
          label: "Slug",
          description:
            "Parte final de la URL. Una vez publicado, cambiarlo rompe los enlaces existentes.",
        },
      }),
      category: fields.select({
        label: "Categoría",
        options: [
          { label: "Film", value: "film" },
          { label: "Music", value: "music" },
          { label: "Visual", value: "visual" },
        ],
        defaultValue: "film",
      }),
      datePublished: fields.date({
        label: "Fecha de publicación",
        validation: { isRequired: true },
      }),
      introBlurb: fields.text({
        label: "Entradilla",
        multiline: true,
        description:
          "Entre 20 y 320 caracteres. Se muestra en la página del artículo y se usa como meta descripción si no rellenas el bloque SEO.",
        validation: { isRequired: true, length: { min: 20, max: 320 } },
      }),
      thumbnail: fields.object(
        {
          src: fields.image({
            label: "Imagen (miniatura)",
            validation: { isRequired: true },
            ...UPLOADS,
          }),
          alt: fields.text({
            label: "Texto alternativo",
            description:
              "Describe la imagen para quien no puede verla. Obligatorio por accesibilidad.",
            validation: { isRequired: true },
          }),
        },
        { label: "Miniatura", description: "La que aparece en la home y en el archivo." },
      ),
      header: fields.object(
        {
          src: fields.image({ label: "Imagen (cabecera)", ...UPLOADS }),
          alt: fields.text({ label: "Texto alternativo" }),
        },
        { label: "Cabecera", description: "Imagen a sangre de la página de detalle." },
      ),
      featured: fields.checkbox({
        label: "Destacado en la home",
        defaultValue: false,
      }),
      translationKey,
      draft,
      seo,
      content: fields.document({
        label: "Contenido",
        formatting: {
          headingLevels: [2, 3],
          inlineMarks: { bold: true, italic: true },
          listTypes: true,
          blockTypes: { blockquote: true },
        },
        links: true,
        dividers: true,
        images: UPLOADS,
      }),
    },
  });
}

// ---------------------------------------------------------------------------
// Cinema selects — refleja la colección de Figma Sites
// (Title, Year, Mood, Why watch, Slug)
// ---------------------------------------------------------------------------

export function cinemaCollection(locale: Locale) {
  return collection({
    label: `Cinema selects · ${locale.toUpperCase()}`,
    path: `content/cinema/${locale}/*`,
    slugField: "title",
    format: { data: "yaml" },
    columns: ["title", "year", "mood"],
    schema: {
      title: fields.slug({
        name: { label: "Película", validation: { isRequired: true } },
        slug: { label: "Slug" },
      }),
      year: fields.integer({
        label: "Año",
        validation: { isRequired: true, min: 1888, max: 2100 },
      }),
      mood: fields.text({
        label: "Mood",
        description: "Dos o tres adjetivos. Ej: «Hazy, melancholic».",
        validation: { isRequired: true },
      }),
      whyWatch: fields.text({
        label: "Por qué verla",
        multiline: true,
        validation: { isRequired: true, length: { max: 160 } },
      }),
      order: fields.integer({
        label: "Orden",
        description: "Menor primero. Controla la posición en la tabla de la home.",
        defaultValue: 0,
      }),
      translationKey,
      draft,
    },
  });
}

// ---------------------------------------------------------------------------
// Singletons — todo el texto de chrome que hoy vive hardcodeado en site.ts
// ---------------------------------------------------------------------------

export function homeSingleton(locale: Locale) {
  return singleton({
    label: `Home · ${locale.toUpperCase()}`,
    path: `content/settings/${locale}/home`,
    format: { data: "yaml" },
    schema: {
      marquee: fields.text({
        label: "Marquesina",
        multiline: true,
        validation: { isRequired: true },
      }),
      hero: fields.object(
        {
          image: fields.image({ label: "Imagen", ...UPLOADS }),
          alt: fields.text({ label: "Texto alternativo" }),
        },
        { label: "Hero" },
      ),
      articles: fields.object(
        {
          viewAllLabel: fields.text({ label: "Texto del botón «ver todo»" }),
        },
        { label: "Sección de artículos" },
      ),
      featuredAlbum: fields.object(
        {
          heading: fields.text({ label: "Título de sección" }),
          cover: fields.image({ label: "Portada", ...UPLOADS }),
          coverAlt: fields.text({ label: "Texto alternativo de la portada" }),
          title: fields.text({ label: "Álbum y artista" }),
          ctaLabel: fields.text({ label: "Texto del botón" }),
          ctaHref: fields.url({ label: "Enlace del botón" }),
        },
        { label: "Álbum destacado" },
      ),
      cinema: fields.object(
        {
          heading: fields.text({ label: "Título de sección" }),
          labels: fields.object({
            film: fields.text({ label: "Columna película" }),
            year: fields.text({ label: "Columna año" }),
            mood: fields.text({ label: "Columna mood" }),
            whyWatch: fields.text({ label: "Columna por qué verla" }),
          }),
        },
        { label: "Cinema selects" },
      ),
    },
  });
}

export function aboutSingleton(locale: Locale) {
  return singleton({
    label: `Página «Sobre» · ${locale.toUpperCase()}`,
    path: `content/settings/${locale}/about`,
    format: { contentField: "content" },
    entryLayout: "content",
    schema: {
      title: fields.text({ label: "Título", validation: { isRequired: true } }),
      intro: fields.text({ label: "Entradilla", multiline: true }),
      seo,
      content: fields.document({
        label: "Contenido",
        formatting: {
          headingLevels: [2, 3],
          inlineMarks: { bold: true, italic: true },
          listTypes: true,
        },
        links: true,
        dividers: true,
        images: UPLOADS,
      }),
    },
  });
}

export function siteSingleton(locale: Locale) {
  return singleton({
    label: `Ajustes del sitio · ${locale.toUpperCase()}`,
    path: `content/settings/${locale}/site`,
    format: { data: "yaml" },
    schema: {
      name: fields.text({ label: "Nombre del sitio", validation: { isRequired: true } }),
      seo: fields.object(
        {
          titleTemplate: fields.text({
            label: "Plantilla de título",
            description: "Usa %s como marcador del título de la página.",
          }),
          description: fields.text({ label: "Meta descripción por defecto", multiline: true }),
        },
        { label: "SEO por defecto" },
      ),
      nav: fields.array(
        fields.object({
          label: fields.text({ label: "Texto" }),
          route: fields.select({
            label: "Destino",
            options: [
              { label: "Home", value: "home" },
              { label: "Archivo", value: "archive" },
              { label: "Sobre", value: "about" },
            ],
            defaultValue: "home",
          }),
          variant: fields.select({
            label: "Color",
            options: [
              { label: "Naranja", value: "orange" },
              { label: "Verde", value: "green" },
              { label: "Azul", value: "blue" },
            ],
            defaultValue: "orange",
          }),
        }),
        { label: "Navegación", itemLabel: (props) => props.fields.label.value || "Enlace" },
      ),
      archive: fields.object(
        {
          heading: fields.text({ label: "Título del archivo" }),
          intro: fields.text({ label: "Entradilla del archivo", multiline: true }),
          allLabel: fields.text({ label: "Etiqueta del filtro «todas»" }),
          emptyLabel: fields.text({ label: "Mensaje cuando no hay resultados" }),
        },
        { label: "Página de archivo" },
      ),
      subscribe: fields.object(
        {
          heading: fields.text({ label: "Título" }),
          body: fields.text({ label: "Texto", multiline: true }),
          ctaLabel: fields.text({ label: "Texto del botón" }),
          ctaHref: fields.text({ label: "Enlace del botón" }),
        },
        { label: "Suscripción" },
      ),
      footer: fields.object(
        {
          columns: fields.array(
            fields.object({
              label: fields.text({ label: "Título de columna" }),
              links: fields.array(
                fields.object({
                  label: fields.text({ label: "Texto" }),
                  href: fields.text({ label: "Enlace" }),
                }),
                { label: "Enlaces", itemLabel: (props) => props.fields.label.value || "Enlace" },
              ),
            }),
            { label: "Columnas", itemLabel: (props) => props.fields.label.value || "Columna" },
          ),
          copyright: fields.text({ label: "Copyright" }),
          tagline: fields.text({ label: "Lema" }),
        },
        { label: "Pie de página" },
      ),
    },
  });
}