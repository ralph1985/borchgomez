import type { DevInspectionBlock, DevInspectionField } from "../../domain/home-page";

type DevInspectorAttrs = Record<string, string>;

export function getDevInspectorAttrs(block: DevInspectionBlock): DevInspectorAttrs {
  return {
    "data-dev-inspector": "",
    "data-dev-component": block.component,
    "data-dev-source": block.source,
    "data-dev-label": buildDevLabel(block),
  };
}

function buildDevLabel(block: DevInspectionBlock): string {
  const parts = [block.component, `source: ${block.source}`];

  if (block.document) parts.push(`document: ${block.document}`);
  if (block.field) parts.push(`field: ${block.field}`);
  if (block.file) parts.push(`file: ${block.file}`);

  const fields = block.fields?.map(formatField).filter(Boolean);
  if (fields?.length) parts.push(`fields: ${fields.join("; ")}`);

  return parts.join(" | ");
}

function formatField(field: DevInspectionField): string {
  const details = [`${field.label}=${field.source}`];

  if (field.document) details.push(field.document);
  if (field.field) details.push(field.field);
  if (field.file) details.push(field.file);

  return details.join(":");
}
