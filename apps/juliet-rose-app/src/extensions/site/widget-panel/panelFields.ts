export type PanelFieldKind = 'text' | 'longText' | 'url' | 'choice';

export type PanelChoiceOption = Readonly<{
  id: string;
  value: string;
}>;

export type PanelField = Readonly<{
  key: string;
  label: string;
  kind: PanelFieldKind;
  help?: string;
  placeholder?: string;
  options?: readonly PanelChoiceOption[];
}>;

export type PanelSection = Readonly<{
  title: string;
  fields: readonly PanelField[];
}>;

export function collectFieldKeys(
  sections: readonly PanelSection[],
): readonly string[] {
  return sections.flatMap((section) =>
    section.fields.map((field) => field.key),
  );
}
