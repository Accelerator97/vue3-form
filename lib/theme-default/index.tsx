import SelectionWidget from "./SelectionWidget";
import TextWidget from "./TextWidget";
import NumberWidget from "./NumberWidget";

import { CommonWidgetsPropsDefined, CommonWidgetsDefined } from "../type";
import { defineComponent } from "vue";

const CommonWidget = defineComponent({
  props: CommonWidgetsPropsDefined,
  setup() {
    return () => null;
  },
}) as CommonWidgetsDefined;

export default {
  widgets: {
    SelectionWidget,
    TextWidget,
    NumberWidget,
  },
};
