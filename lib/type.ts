import { PropType, DefineComponent, Prop } from "vue";
import { ErrorSchema } from "./validator";

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
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true,
  },
  uiSchema: {
    type: Object as PropType<uiSchema>,
    required: true,
  },
} as const;

export type CommonFieldType = DefineComponent<typeof FiledPropsDefine, {}, {}>;

// props类型
export const CommonWidgetsPropsDefined = {
  value: {},
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
  errors: {
    type: Array as PropType<string[]>,
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
} as const;

export const SelectionWidgetsPropsDefined = {
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
export type CommonWidgetsDefined = DefineComponent<
  typeof CommonWidgetsPropsDefined,
  {},
  {}
>;

export type SelectionWidgetDefined = DefineComponent<
  typeof SelectionWidgetsPropsDefined,
  {},
  {}
>;

export enum SelectionWidgetNames {
  SelectionWidget = "SelectionWidget",
}

export enum CommonWidgetsNames {
  TextWidget = "TextWidget",
  NumberWidget = "NumberWidget",
}

export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetDefined;
    [CommonWidgetsNames.TextWidget]: CommonWidgetsDefined;
    [CommonWidgetsNames.NumberWidget]: CommonWidgetsDefined;
  };
}

export interface uiSchema {
  widget?: string | CommonWidgetsDefined; // string是已经定义好的NumberWidget/SelectionWidget/TextWidget 后面CommonWidgetsDefined是用户自己定义
  properties?: {
    [key: string]: uiSchema; // 嵌套 向下传递uiSchema
  };
  items?: uiSchema | uiSchema[]; // 针对数组 单类型数组对应uiSchema 多类型数组对应uiSchema[]
}
