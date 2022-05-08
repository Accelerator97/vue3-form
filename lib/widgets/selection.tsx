import { defineComponent, PropType, ref, watch, watchEffect } from "vue";

export default defineComponent({
  name: "SelectionWidget",
  props: {
    value: {},
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    options: {
      // 注意这种对象数组类型的写法
      type: Array as PropType<
        {
          key: string;
          value: any;
        }[]
      >,
      required: true,
    },
  },
  setup(props) {
    // 因为不能通过v-model 修改props的value 所以创建一个响应式数据
    const currentValueRef = ref(props.value);
    // currentValueRef变化了 就调用props的onChange事件
    watch(currentValueRef, (newVal, oldVal) => {
      if (newVal === props.value) return;
      props.onChange(newVal);
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
});
