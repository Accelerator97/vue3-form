import { defineComponent } from "vue";
import { CommonWidgetsPropsDefined } from "../type";

import { createUseStyles } from "vue-jss";
const useStyle = createUseStyles({
  container: {},
  label: {
    display: "block",
    color: "#777",
  },
  errText: {
    color: "red",
    fontSize: 12,
    margin: "5px 0",
    padding: 0,
    paddingLeft: 20,
    zIndex: 999,
  },
});

const FormItem = defineComponent({
  name: "FormItem",
  props: CommonWidgetsPropsDefined,
  setup(props, { slots }) {
    const classRef = useStyle();
    return () => {
      const { schema, error } = props;
      console.log("err", error);
      const classes = classRef.value;
      return (
        <div class={classes.container}>
          <label class={classes.label}>{schema.title}</label>
          {slots.default && slots.default()}
          <ul class={classes.errText}>
            {error?.map((i) => (
              <li>{i}</li>
            ))}
          </ul>
        </div>
      );
    };
  },
});

export default FormItem;

// HOC高阶组件
export function withFormItem(Widget: any) {
  return defineComponent({
    name: `Wrapped${Widget}`,
    props: CommonWidgetsPropsDefined,
    setup(props, { attrs }) {
      return () => {
        return (
          <FormItem {...props}>
            <Widget {...props} {...attrs}></Widget>
          </FormItem>
        );
      };
    },
  });
}
