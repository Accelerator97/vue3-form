import { PropType, DefineComponent, Prop } from "vue";

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
  type?: SchemaTypes | string;
  const?: any;
  format?: string;

  title?: string;
  default?: any;

  properties?: {
    [key: string]: Schema;
  };
  items?: Schema | Schema[] | SchemaRef;
  uniqueItems?: any;
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef;
  };
  oneOf?: Schema[];
  anyOf?: Schema[];
  allOf?: Schema[];
  // TODO: uiSchema
  // vjsf?: VueJsonSchemaConfig
  required?: string[];
  enum?: any[];
  enumNames?: any[];
  enumKeyValue?: any[];
  additionalProperties?: any;
  additionalItems?: Schema;

  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
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
  rootSchema: {
    type: Object as PropType<Schema>,
    required: true,
  },
} as const;

export type CommonFieldType = DefineComponent<typeof FiledPropsDefine, {}, {}>;

// props类型
const CommonWidgetsPropsDefined = {
  value: {},
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
} as const;

const SelectionWidgetsPropsDefined = {
  ...CommonWidgetsPropsDefined,
  options: {
    // 注意这种对象数组类型的写法
    type: Array as PropType<
      {
        key: string;
        value: any;
      }[]
    >,
    required: true,
  },
} as const;

// 主题系统组件的类型
type CommonWidgetsDefined = DefineComponent<
  typeof CommonWidgetsPropsDefined,
  {},
  {}
>;

type SelectionWidgetDefined = DefineComponent<
  typeof SelectionWidgetsPropsDefined,
  {},
  {}
>;

export interface Theme {
  widgets: {
    SelectionWidget: SelectionWidgetDefined;
    TextWidget: CommonWidgetsDefined;
    NumberWidget: CommonWidgetsDefined;
  };
}
