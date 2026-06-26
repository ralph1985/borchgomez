import { defineArrayMember, defineField, defineType } from "sanity";

const featureList = [
  defineArrayMember({
    type: "string",
  }),
];

const ctaFields = [
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

export const plans = defineType({
  name: "plans",
  title: "Planes",
  type: "document",
  fields: [
    defineField({
      name: "intro",
      title: "Introducción",
      type: "object",
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
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Planes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Nombre",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "price",
              title: "Precio",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "tagline",
              title: "Entradilla",
              type: "text",
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "featured",
              title: "Destacado",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "badge",
              title: "Etiqueta destacada",
              type: "string",
            }),
            defineField({
              name: "features",
              title: "Características",
              type: "array",
              of: featureList,
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "cta",
              title: "Llamada a la acción",
              type: "object",
              fields: ctaFields,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "price",
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "promo",
      title: "Vídeo promocional",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Título",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "price",
          title: "Precio",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "description",
          title: "Descripción",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "features",
          title: "Características",
          type: "array",
          of: featureList,
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: "note",
          title: "Nota",
          type: "text",
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "budgetNote",
      title: "Nota de presupuesto",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Planes",
    }),
  },
});
