import { defineField, defineType } from "sanity";

const linkFields = [
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
    validation: (Rule) => Rule.required(),
  }),
];

const contactLink = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: linkFields,
    validation: (Rule) => Rule.required(),
  });

export const contact = defineType({
  name: "contact",
  title: "Hablemos",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    contactLink("primary", "Botón principal"),
    contactLink("phone", "Teléfono"),
    contactLink("email", "Email"),
    contactLink("instagram", "Instagram"),
  ],
  preview: {
    prepare: () => ({
      title: "Hablemos",
    }),
  },
});
