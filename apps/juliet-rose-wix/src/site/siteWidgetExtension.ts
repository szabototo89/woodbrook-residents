export type SiteWidgetExtensionPreset = Readonly<{
  id: string;
  name: string;
  thumbnailUrl: string;
}>;

export type SiteWidgetExtension = Readonly<{
  id: string;
  name: string;
  tagName: string;
  width: Readonly<{
    defaultWidth: number;
    allowStretch: boolean;
    stretchByDefault?: boolean;
  }>;
  height: Readonly<{ defaultHeight: number }>;
  installation: Readonly<{ autoAdd: boolean }>;
  element: string;
  settings: string;
  presets: readonly [SiteWidgetExtensionPreset, ...SiteWidgetExtensionPreset[]];
}>;
