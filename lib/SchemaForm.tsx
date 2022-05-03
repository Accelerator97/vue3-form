import { defineComponent, PropType } from "vue";
import { Schema } from "./type";

export default defineComponent({
  name: "SchemaForm",
  props: {
    schema: {
      type: Object as PropType<Schema>,
    },
  },
  setup(props, { slots, emit, attrs }) {
    return () => {
      return <div>This is Form</div>;
    };
  },
});
