import {
  defineComponent,
  PropType,
  provide,
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
  doValidate: () => {
    errors: any[];
    valid: boolean;
  };
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

    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              // const valid = validateRef.value.validate(
              //   props.schema,
              //   props.value,
              // ) as boolean;
              const result = validateFormData(
                validateRef.value,
                props.value,
                props.schema,
              );
              errorsSchemaRef.value = result.errorSchema;
              return result;
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
