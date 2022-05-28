import { defineComponent } from "vue";
import { FiledPropsDefine } from "../type";
import { useVJSFContext } from "../context";
import { isObject } from "../utils";

export default defineComponent({
  name: "ObjectField",
  props: FiledPropsDefine,
  setup(props) {
    // 如果用户直接用ObjectFiled组件，没有用SchemaForm组件，context可能为undefined
    const context = useVJSFContext();
    const handleObjectFieldChange = (key: string, v: string) => {
      const value: any = isObject(props.value) ? props.value : {};
      if (v === undefined) {
        delete value[key];
      } else {
        value[key] = v;
      }
      props.onChange(value);
    };
    return () => {
      const { SchemaItem } = context;
      const { schema, rootSchema, value, errorSchema } = props;
      const properties = schema.properties || {};
      const currentValue: any = isObject(value) ? value : {};

      return Object.keys(properties).map((k: string, index: number) => (
        <SchemaItem
          schema={properties[k]}
          rootSchema={rootSchema}
          value={currentValue[k]}
          errorSchema={errorSchema[k] || {}}
          key={index}
          onChange={(v: any) => handleObjectFieldChange(k, v)}
        />
      ));
    };
  },
});
