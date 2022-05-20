import { defineComponent } from "vue";
import { FiledPropsDefine, CommonWidgetsNames } from "../type";
import { getWidgets } from "../theme";

export default defineComponent({
  name: "StringField",
  props: FiledPropsDefine,
  setup(props) {
    // 单独抽出onChange 是为了以后可以在handleChange的时候加入其他逻辑
    const handleChange = (v: string) => {
      props.onChange(v);
    };
    const TextWidgetRef = getWidgets(CommonWidgetsNames.TextWidget);
    return () => {
      const TextWidget = TextWidgetRef.value;
      const { schema, rootSchema, ...rest } = props;
      // 这种写法会有个弊端 导致因为...rest里也有onChange，用户又传了一个onChange
      // 编译的时候 onChange就会变成一个数组
      return <TextWidget {...rest} onChange={handleChange}></TextWidget>;
    };
  },
});
