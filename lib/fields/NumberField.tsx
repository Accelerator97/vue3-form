import { FiledPropsDefine } from "../type";
import { defineComponent } from "vue";

export default defineComponent({
  name: "NumberField",
  props: FiledPropsDefine,
  setup() {
    return () => {
      return <div>Number</div>;
    };
  },
});
