import { defineArrayMember, defineField, defineType } from "sanity";

const defaultFilters = [
  { label: "Todos", value: "all" },
  { label: "Artesanos", value: "artesanos" },
  { label: "Restaurantes", value: "restaurantes" },
  { label: "Turismo Rural", value: "turismo-rural" },
  { label: "Alojamientos", value: "alojamientos" },
  { label: "Queserías", value: "queserias" },
  { label: "Panaderías", value: "panaderias" },
  { label: "Tradiciones", value: "tradiciones" },
  { label: "Otros", value: "otros" },
];

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const linkFields = [
  defineField({
    name: "label",
    title: "Etiqueta",
    type: "string",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "href",
    title: "Enlace externo",
    type: "url",
    validation: (Rule) =>
      Rule.required().uri({
        scheme: ["http", "https"],
      }),
  }),
];

export const portfolio = defineType({
  name: "portfolio",
  title: "Proyectos e historias",
  type: "document",
  initialValue: {
    filters: defaultFilters,
    initialVisible: 6,
    loadStep: 6,
  },
  fields: [
    defineField({
      name: "title",
      title: "Título de la sección",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Descripción de la sección",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "filters",
      title: "Filtros",
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
              name: "value",
              title: "Identificador",
              type: "string",
              validation: (Rule) =>
                Rule.required().custom((value) => {
                  if (typeof value !== "string" || !slugPattern.test(value)) {
                    return "Usa minúsculas, números y guiones, por ejemplo turismo-rural.";
                  }

                  return true;
                }),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((filters) => {
            if (!Array.isArray(filters)) {
              return true;
            }

            const values = filters
              .map((filter) => (filter as { value?: unknown })?.value)
              .filter((value): value is string => typeof value === "string");
            if (!values.includes("all")) {
              return "Debe existir el filtro por defecto con identificador all.";
            }

            if (new Set(values).size !== values.length) {
              return "No puede haber identificadores de filtro duplicados.";
            }

            return true;
          }),
    }),
    defineField({
      name: "initialVisible",
      title: "Proyectos visibles al principio",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: "loadStep",
      title: "Proyectos añadidos al mostrar más",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: "projects",
      title: "Proyectos",
      type: "array",
      of: [
        defineArrayMember({
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
              rows: 2,
            }),
            defineField({
              name: "category",
              title: "Categoría fallback",
              type: "string",
              description: "Se muestra si el subtítulo está vacío.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "filterValues",
              title: "Filtros del proyecto",
              type: "array",
              of: [
                defineArrayMember({
                  type: "string",
                }),
              ],
              validation: (Rule) =>
                Rule.required()
                  .min(1)
                  .custom((filterValues, context) => {
                    if (!Array.isArray(filterValues)) {
                      return true;
                    }

                    const documentFilters = Array.isArray(context.document?.filters) ? context.document.filters : [];
                    const validValues = new Set(
                      documentFilters
                        .map((filter) => (filter as { value?: unknown })?.value)
                        .filter((value): value is string => typeof value === "string" && value !== "all"),
                    );
                    const values = filterValues.filter((value): value is string => typeof value === "string");
                    const invalidValues = values.filter((value) => !validValues.has(value));

                    return invalidValues.length === 0
                      ? true
                      : `Filtros no dados de alta: ${invalidValues.join(", ")}.`;
                  }),
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
              name: "link",
              title: "Botón",
              type: "object",
              fields: linkFields,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "category",
              media: "image",
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Proyectos e historias",
    }),
  },
});
