import { defineArrayMember, defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "greeting",
      title: "Saludo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "career",
      title: "Línea destacada",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "claims",
      title: "Claims",
      description:
        "Añade uno o varios claims. Déjalo vacío para ocultar este bloque en la web.",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "actions",
      title: "Botones",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Etiqueta",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Enlace",
              type: "string",
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ["https", "mailto", "tel"],
                  allowRelative: true,
                }),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "href",
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Hero",
    }),
  },
});
