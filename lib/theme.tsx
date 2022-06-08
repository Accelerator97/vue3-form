import {
  defineComponent,
  PropType,
  provide,
  computed,
  inject,
  ComputedRef,
  shallowRef,
  ExtractPropTypes,
  ref,
} from "vue";
import {
  Theme,
  SelectionWidgetNames,
  CommonWidgetsNames,
  uiSchema,
  CommonWidgetsDefined,
  FiledPropsDefine,
} from "./type";

import { isObject } from "./utils";

import { useVJSFContext } from "./context";

const THEME_PROVIDER_KEY = Symbol();

const ThemeProvider = defineComponent({
  name: "VJSFThemeProvider",
  props: {
    theme: { type: Object as PropType<Theme>, required: true },
  },
  setup(props, { slots }) {
    const context = computed(() => props.theme);
    // 把theme转为一个响应式对象 通过provide传递给下面的组件
    provide(THEME_PROVIDER_KEY, context);
    return () => slots.default && slots.default();
  },
});

// 通过Vue的ExtractPropTypes 将FiledPropsDefine转换为类型
export function getWidgets<T extends CommonWidgetsNames | SelectionWidgetNames>(
  name: T,
  props?: ExtractPropTypes<typeof FiledPropsDefine>,
) {
  const formatContext = useVJSFContext();

  if (props) {
    const { uiSchema, schema } = props;
    if (uiSchema?.widget && isObject(uiSchema.widget)) {
      return shallowRef(uiSchema.widget as CommonWidgetsDefined);
    }
    if (schema.format) {
      if (formatContext.formatMapRef.value[schema.format]) {
        return ref(formatContext.formatMapRef.value[schema.format]);
      }
    }
  }

  const context: ComputedRef<Theme> | undefined =
    inject<ComputedRef<Theme>>(THEME_PROVIDER_KEY);
  if (!context) {
    throw new Error("vjsf must be required");
  }

  // 如果 const widget = context.value.widgets[name] 那么widget的值不为响应式了 要写成computed形式
  const widgetRef = computed(() => {
    return context.value.widgets[name];
  });
  return widgetRef;
}

export default ThemeProvider;
