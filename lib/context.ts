import { CommonFieldType, CommonWidgetsDefined, Schema } from "./type";
import { inject, Ref } from "vue";
export const SchemaFormContextKey = Symbol();
export function useVJSFContext() {
  const context:
    | {
        SchemaItem: CommonFieldType;
        formatMapRef: Ref<{ [key: string]: CommonWidgetsDefined }>;
        transformSchemaRef: Ref<(schema: Schema) => Schema>;
      }
    | undefined = inject(SchemaFormContextKey);
  // context为undefined时 抛出错误
  if (!context) {
    throw Error("SchemaForm should be used");
  }
  return context;
}
