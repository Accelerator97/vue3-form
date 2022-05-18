import SelectionWidget from "./selection";
import { CommonWidgetsPropsDefined, CommonWidgetsDefined } from "../type";
import { defineComponent } from "vue";

const commonWidget = defineComponent({
  props: CommonWidgetsPropsDefined,
  setup() {
    return () => null;
  },
}) as CommonWidgetsDefined;

export default {
  widgets: {
    SelectionWidget,
    TextWidget: commonWidget,
    NumberWidget: commonWidget,
  },
};
