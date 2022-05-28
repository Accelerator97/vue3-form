import { FiledPropsDefine, CommonWidgetsNames } from "../type";
import { defineComponent } from "vue";
import { getWidgets } from "../theme";

export default defineComponent({
  name: "NumberField",
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      const value = e.target.value;
      e.target.value = props.value;
      const num = Number(value);
      if (Number.isNaN(num)) {
        props.onChange(undefined);
      } else {
        props.onChange(num);
      }
    };
    const NumberWidgetRef = getWidgets(CommonWidgetsNames.NumberWidget);
    return () => {
      const { schema, rootSchema, errorSchema, ...rest } = props;
      const NumberWidget = NumberWidgetRef.value;
      return (
        <NumberWidget
          {...rest}
          error={errorSchema.__errors}
          onChange={handleChange}
        />
      );
    };
  },
});
