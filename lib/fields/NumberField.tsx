import { FiledPropsDefine } from "../type";
import { defineComponent } from "vue";

export default defineComponent({
  name: "NumberField",
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      const value = e.target.value;
      const num = Number(value);
      if (Number.isNaN(num)) {
        props.onChange(undefined);
      } else {
        props.onChange(num);
      }
    };
    return () => {
      const { value } = props;
      return <input type="number" value={value} onInput={handleChange} />;
    };
  },
});
