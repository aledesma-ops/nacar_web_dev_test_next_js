import Image from "next/image";
import Link from "next/link";
import { DocumentRenderer } from "@keystatic/core/renderer";
import type { ComponentProps } from "react";

type Document = ComponentProps<typeof DocumentRenderer>["document"];

/**
 * Render del campo `content`.
 *
 * Los renderers están tipados con el sistema de diseño en vez de con un `.prose`
 * genérico: es lo que evita que el contenido editorial se salga del DS en cuanto
 * alguien pega un H2 o una cita.
 */
export function Prose({ document }: { document: Document }) {
  return (
    <div className="flex w-full max-w-[720px] flex-col gap-[24px]">
      <DocumentRenderer
        document={document}
        renderers={{
          inline: {
            bold: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
            italic: ({ children }) => <em className="italic">{children}</em>,
            link: ({ href, children }) => (
              <Link
                href={href}
                className="underline decoration-solid underline-offset-4 transition-colors duration-200 hover:text-accent-orange"
                {...(/^https?:/.test(href)
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {children}
              </Link>
            ),
          },
          block: {
            paragraph: ({ children }) => (
              <p className="type-p1 text-paragraph-4">{children}</p>
            ),
            heading: ({ level, children }) =>
              level === 2 ? (
                <h2 className="type-h5 mt-[24px] text-headline-1">{children}</h2>
              ) : (
                <h3 className="type-p1-semibold mt-[16px] text-headline-1">
                  {children}
                </h3>
              ),
            blockquote: ({ children }) => (
              <blockquote className="type-h4 border-l-2 border-accent-orange pl-[24px] text-headline-1">
                {children}
              </blockquote>
            ),
            divider: () => (
              <hr className="w-full border-t border-dashed border-divider" />
            ),
            list: ({ type, children }) => {
              const className = "type-p1 flex flex-col gap-[8px] pl-[24px] text-paragraph-4";
              return type === "ordered" ? (
                <ol className={`${className} list-decimal`}>
                  {children.map((child, index) => (
                    <li key={index}>{child}</li>
                  ))}
                </ol>
              ) : (
                <ul className={`${className} list-disc`}>
                  {children.map((child, index) => (
                    <li key={index}>{child}</li>
                  ))}
                </ul>
              );
            },
            image: ({ src, alt }) => (
              <figure className="relative my-[16px] aspect-[3/2] w-full overflow-hidden rounded-card">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 800px) 720px, 100vw"
                  className="object-cover"
                />
              </figure>
            ),
          },
        }}
      />
    </div>
  );
}
