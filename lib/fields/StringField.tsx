import { defineComponent } from "vue";
import { FiledPropsDefine } from "../type";

export default defineComponent({
  name: "StringField",
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      const v = e.target.value;
      props.onChange(v);
    };
    return () => {
      const { value } = props;
      return <input type="text" value={value} onInput={handleChange} />;
    };
  },
});
