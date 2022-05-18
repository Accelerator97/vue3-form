import {
  defineComponent,
  PropType,
  provide,
  computed,
  inject,
  ComputedRef,
} from "vue";
import { Theme, SelectionWidgetNames, CommonWidgetsNames } from "./type";

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

export function getWidgets<T extends CommonWidgetsNames | SelectionWidgetNames>(
  name: T,
) {
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
