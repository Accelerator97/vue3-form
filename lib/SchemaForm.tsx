import {
  defineComponent,
  PropType,
  provide,
  ref,
  Ref,
  shallowRef,
  watch,
  watchEffect,
} from "vue";
import { Schema } from "./type";
import SchemaItem from "./SchemaItem";
import Ajv, { Options } from "ajv";
import { validateFormData, ErrorSchema } from "./validator";

import { SchemaFormContextKey } from "./context";

interface ContextRef {
  doValidate: () => Promise<{
    errors: any[];
    valid: boolean;
  }>;
}

const defaultAjvOptions: Options = {
  allErrors: true,
  // jsonPointers: true,
};

export default defineComponent({
  name: "SchemaForm",
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>,
    },
    ajvOptions: {
      type: Object as PropType<Options>,
    },
    customValidate: {
      type: Function as PropType<(data: any, errors: any) => void>,
    },
  },
  setup(props, { slots, emit, attrs }) {
    const handleChange = (v: any) => {
      props.onChange(v);
    };

    const context = {
      SchemaItem,
    };

    const errorsSchemaRef: Ref<ErrorSchema> = shallowRef({});

    // 创建validateRef，并且用watchEffect监听，当传进来的props.ajvOptions变化时及时更新

    const validateRef: Ref<Ajv> = shallowRef(new Ajv());

    watchEffect(() => {
      validateRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      });
    });
    const validateResolveRef = ref();
    const validateIndex = ref(0);

    // 监听数据变化重新校验 使用深度监听
    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) {
          doValidate();
        }
      },
      { deep: true },
    );

    async function doValidate() {
      console.log("start validate -----");
      const index = (validateIndex.value += 1);
      const result = await validateFormData(
        validateRef.value,
        props.value,
        props.schema,
        props.customValidate,
      );
      // 执行完异步校验之后，根据index是否等于validateIndex.value
      // 判断校验开始时的上下文 和 校验结束时的上下文是否一致
      // 如果不一致，说明这中间已经发生了几次validate，之前的结果不再需要
      if (index !== validateIndex.value) return;
      console.log("end validate -------");
      errorsSchemaRef.value = result.errorSchema;
      // 把result作为函数参数传给用户自定义的异步校验函数
      validateResolveRef.value(result);
      validateResolveRef.value = undefined; // 清空validateRef
    }

    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              // resolve就是用户传入的异步自定义校验函数
              return new Promise((resolve) => {
                validateResolveRef.value = resolve;
                doValidate();
              });
            },
          };
        }
      },
      {
        immediate: true,
      },
    );

    provide(SchemaFormContextKey, context);

    return () => {
      const { schema, value } = props;
      return (
        <SchemaItem
          schema={schema}
          value={value}
          rootSchema={schema}
          onChange={handleChange}
          errorSchema={errorsSchemaRef.value || {}}
        />
      );
    };
  },
});
