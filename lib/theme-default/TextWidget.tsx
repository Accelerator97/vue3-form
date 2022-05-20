import { CommonWidgetsPropsDefined, CommonWidgetsDefined } from "../type";
import { defineComponent } from "vue";

const TextWidget = defineComponent({
  name: "TextWidget",
  props: CommonWidgetsPropsDefined,
  setup(props) {
    const handleChange = (e: any) => {
      const v = e.target.value;
      e.target.value = props.value;
      props.onChange(v);
    };
    return () => {
      const { value } = props;
      return <input type="text" value={value as any} onInput={handleChange} />;
    };
  },
}) as CommonWidgetsDefined;

export default TextWidget;
