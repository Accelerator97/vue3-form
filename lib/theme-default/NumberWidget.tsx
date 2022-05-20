import { CommonWidgetsPropsDefined, CommonWidgetsDefined } from "../type";
import { defineComponent } from "vue";

const NumberWidget = defineComponent({
  name: "NumberWidget",
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
        <input type="number" value={value as any} onInput={handleChange} />
      );
    };
  },
}) as CommonWidgetsDefined;

export default NumberWidget;
