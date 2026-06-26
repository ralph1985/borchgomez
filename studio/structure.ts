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
        .title("Planes")
        .id("plans")
        .child(S.document().schemaType("plans").documentId("plans").title("Planes")),
    ]);
