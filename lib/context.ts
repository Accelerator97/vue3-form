import { CommonFieldType, Theme } from "./type";
import { inject } from "vue";
export const SchemaFormContextKey = Symbol();
export function useVJSFContext() {
  const context: { theme: Theme; SchemaItem: CommonFieldType } | undefined =
    inject(SchemaFormContextKey);
  // context为undefined时 抛出错误
  if (!context) {
    throw Error("SchemaForm should be used");
  }
  return context;
}
