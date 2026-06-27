import { defineArrayMember, defineField, defineType } from "sanity";

const paragraphList = [
  defineArrayMember({
    type: "text",
    rows: 3,
  }),
];

export const about = defineType({
  name: "about",
  title: "Sobre mí",
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
    defineField({
      name: "paragraphsBeforeImage",
      title: "Párrafos antes de la imagen",
      type: "array",
      of: paragraphList,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "image",
      title: "Imagen",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paragraphsAfterImage",
      title: "Párrafos después de la imagen",
      type: "array",
      of: paragraphList,
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Sobre mí",
    }),
  },
});
