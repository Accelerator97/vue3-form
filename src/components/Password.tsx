import {
  CommonWidgetsPropsDefined,
  CommonWidgetsDefined,
} from "../../lib/type";
import { defineComponent, shallowRef } from "vue";
import { withFormItem } from "../../lib/theme-default/FormItem";

const PasswordWidget = withFormItem(
  defineComponent({
    name: "PasswordWidget",
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
          <input type="password" value={value as any} onInput={handleChange} />
        );
      };
    },
  }),
) as CommonWidgetsDefined;

export default shallowRef(PasswordWidget);
