import { CommonWidgetsPropsDefined, CommonWidgetsDefined } from "../type";
import { computed, defineComponent } from "vue";
import { withFormItem } from "./FormItem";

const TextWidget = withFormItem(
  defineComponent({
    name: "TextWidget",
    props: CommonWidgetsPropsDefined,
    setup(props) {
      const handleChange = (e: any) => {
        const v = e.target.value;
        e.target.value = props.value;
        props.onChange!(v);
      };
      const styleRef = computed(() => {
        return {
          color: (props.options && props.options.color) || "black",
        };
      });
      return () => {
        const { value } = props;
        return (
          <input
            type="text"
            value={value as any}
            onInput={handleChange}
            style={styleRef.value}
          />
        );
      };
    },
  }),
) as CommonWidgetsDefined;

export default TextWidget;
