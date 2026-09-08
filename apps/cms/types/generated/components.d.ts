import type { Schema, Struct } from '@strapi/strapi';

export interface SharedResourceDetail extends Struct.ComponentSchema {
  collectionName: 'components_shared_resource_details';
  info: {
    description: 'A reusable label and value shown with a directory entry';
    displayName: 'Resource detail';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    showOnCard: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    value: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.resource-detail': SharedResourceDetail;
    }
  }
}
