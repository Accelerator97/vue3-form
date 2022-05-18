import { CommonWidgetsPropsDefined, CommonWidgetsDefined } from "../type";
import { defineComponent } from "vue";

export const TextWidget = defineComponent({
  name: "TextWidget",
  props: CommonWidgetsPropsDefined,
  setup(props) {
    const handleChange = (e: any) => {
      const v = e.target.value;
      props.onChange(v);
    };
    return () => {
      const { value } = props;
      return <input type="text" value={value as any} onInput={handleChange} />;
    };
  },
});
