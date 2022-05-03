import { defineComponent } from "vue";
import { FiledPropsDefine } from "../type";

export default defineComponent({
  name: "StringField",
  props: FiledPropsDefine,
  setup() {
    return () => {
      return <div>String</div>;
    };
  },
});
