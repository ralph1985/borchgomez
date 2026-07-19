import { defineField, defineType } from "sanity";

export const legalData = defineType({
  name: "legalData",
  title: "Datos legales",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Nombre completo",
      type: "string",
    }),
    defineField({
      name: "commercialName",
      title: "Nombre comercial",
      type: "string",
    }),
    defineField({
      name: "domain",
      title: "Dominio",
      type: "string",
      description: "Ejemplo: borchgomez.es",
    }),
    defineField({
      name: "nif",
      title: "NIF",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Dirección",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Datos legales",
    }),
  },
});
