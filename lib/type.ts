import { PropType } from "vue";

export enum SchemaTypes {
  "NUMBER" = "number",
  "INTEGER" = "integer",
  "STRING" = "string",
  "OBJECT" = "object",
  "ARRAY" = "array",
  "BOOLEAN" = "boolean",
}

// Schema预先定义，然后通过$ref引用的Schema
type SchemaRef = { $ref: string };

export interface Schema {
  type: SchemaTypes | string;
  const?: any;
  format?: string;
  default?: any;
  properties?: {
    [key: string]: Schema | { $refs: string };
  };
  items?: Schema | Schema[] | SchemaRef;
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef;
  };
  oneOf?: Schema[];
  required?: string[];
  enum?: any[];
  enumKeyValue?: any[];
  additionalProperties?: any;
  additionalItem?: Schema;
}

export const FiledPropsDefine = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  value: {
    required: true,
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
} as const;
