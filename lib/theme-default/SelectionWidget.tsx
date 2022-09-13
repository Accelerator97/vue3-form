import { defineComponent, ref, watch } from "vue";
import { SelectionWidgetsPropsDefined, SelectionWidgetDefined } from "../type";
import { withFormItem } from "./FormItem";

const Selection = withFormItem(
  defineComponent({
    name: "SelectionWidget",
    props: SelectionWidgetsPropsDefined,
    setup(props) {
      // 因为不能通过v-model 修改props的value 所以创建一个响应式数据
      const currentValueRef = ref(props.value);
      // currentValueRef变化了 就调用props的onChange事件
      watch(currentValueRef, (newVal, oldVal) => {
        if (newVal === props.value) return;
        props.onChange!(newVal);
      });
      // 如果props的value变化了，currentValueRef也要跟着变化
      watch(
        () => props.value,
        (v) => {
          if (props.value !== currentValueRef.value) {
            currentValueRef.value = v;
          }
        },
      );
      return () => {
        const { options } = props;
        return (
          <select multiple={true} v-model={currentValueRef.value}>
            {options.map((op) => (
              <option value={op.value}>{op.key}</option>
            ))}
          </select>
        );
      };
    },
  }),
) as SelectionWidgetDefined;

export default Selection;
