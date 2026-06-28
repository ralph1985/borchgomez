import { defineArrayMember, defineField, defineType } from "sanity";

const iconOptions = [
  { title: "Drone", value: "drone" },
  { title: "Video", value: "video" },
  { title: "Compartir", value: "share" },
  { title: "Globo", value: "globe" },
  { title: "Monitor con busqueda", value: "monitor-search" },
  { title: "Grafica", value: "chart" },
  { title: "Mapa", value: "map-pin" },
];

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const featureList = [
  defineArrayMember({
    type: "string",
  }),
];

export const services = defineType({
  name: "services",
  title: "Servicios",
  type: "document",
  fields: [
    defineField({
      name: "intro",
      title: "Introduccion",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Titulo",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "subtitle",
          title: "Subtitulo",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Servicios",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "ID de ancla",
              type: "string",
              description: "Mantener los IDs publicos actuales, por ejemplo service-drone.",
              validation: (Rule) =>
                Rule.required().custom((value) => {
                  if (typeof value !== "string" || !slugPattern.test(value)) {
                    return "Usa minusculas, numeros y guiones, por ejemplo service-drone.";
                  }

                  return true;
                }),
            }),
            defineField({
              name: "title",
              title: "Titulo",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icono SVG",
              type: "string",
              options: {
                list: iconOptions,
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Descripcion",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "statusLabel",
              title: "Etiqueta de estado",
              type: "string",
            }),
            defineField({
              name: "statusText",
              title: "Texto de estado",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "features",
              title: "Listado de puntos",
              type: "array",
              of: featureList,
            }),
            defineField({
              name: "image",
              title: "Imagen opcional",
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
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "id",
              media: "image",
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((items) => {
            if (!Array.isArray(items)) {
              return true;
            }

            const ids = items
              .map((item) => (item as { id?: unknown })?.id)
              .filter((id): id is string => typeof id === "string");
            if (new Set(ids).size !== ids.length) {
              return "No puede haber IDs de servicio duplicados.";
            }

            return true;
          }),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Servicios",
    }),
  },
});
