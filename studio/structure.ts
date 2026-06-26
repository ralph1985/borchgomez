import type { StructureResolver } from "sanity/structure";

export const singletonStructure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Por qué y cómo trabajo")
        .id("purpose")
        .child(S.document().schemaType("purpose").documentId("purpose").title("Por qué y cómo trabajo")),
    ]);
