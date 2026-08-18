import KeystaticApp from "./keystatic";

/**
 * Root layout del panel.
 *
 * El panel vive en un grupo de rutas propio para que no herede ni el layout, ni
 * las fuentes, ni los estilos del sitio público: Keystatic trae su propio
 * sistema de diseño y mezclarlos rompe el editor.
 */
export const metadata = {
  title: "Grain Archive · CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout() {
  return (
    <html lang="es">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
