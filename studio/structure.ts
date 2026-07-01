import type { StructureResolver } from "sanity/structure";

export const singletonStructure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Hero")
        .id("hero")
        .child(S.document().schemaType("hero").documentId("hero").title("Hero")),
      S.listItem()
        .title("Por qué y cómo trabajo")
        .id("purpose")
        .child(S.document().schemaType("purpose").documentId("purpose").title("Por qué y cómo trabajo")),
      S.listItem()
        .title("Servicios")
        .id("services")
        .child(S.document().schemaType("services").documentId("services").title("Servicios")),
      S.listItem()
        .title("Planes")
        .id("plans")
        .child(S.document().schemaType("plans").documentId("plans").title("Planes")),
      S.listItem()
        .title("Proyectos e historias")
        .id("portfolio")
        .child(S.document().schemaType("portfolio").documentId("portfolio").title("Proyectos e historias")),
      S.listItem()
        .title("Sobre mí")
        .id("about")
        .child(S.document().schemaType("about").documentId("about").title("Sobre mí")),
      S.listItem()
        .title("Hablemos")
        .id("contact")
        .child(S.document().schemaType("contact").documentId("contact").title("Hablemos")),
    ]);
