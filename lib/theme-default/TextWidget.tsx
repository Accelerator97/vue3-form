import { CommonWidgetsPropsDefined, CommonWidgetsDefined } from "../type";
import { defineComponent } from "vue";
import FormItem from "./FormItem";

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
      return (
        <FormItem {...props}>
          <input type="text" value={value as any} onInput={handleChange} />
        </FormItem>
      );
    };
  },
}) as CommonWidgetsDefined;

export default TextWidget;
