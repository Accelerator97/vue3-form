import { defineComponent, PropType } from "vue";
import { FiledPropsDefine, Schema, SelectionWidgetNames } from "../type";
import { useVJSFContext } from "../context";
import { createUseStyles } from "vue-jss";
import { getWidgets } from "../theme";

const useStyles = createUseStyles({
  container: {
    border: "1px solid #eee",
  },
  action: {
    background: "#eee",
    padding: 10,
    textAlign: "right",
  },
  actionItem: {
    "& + &": {
      // 如果都是一样的盒子就添加marginLeft，并且最后一个盒子不会有marginLeft
      marginLeft: 10,
    },
  },
  content: {
    padding: 10,
  },
});

const ArrayItemWrapper = defineComponent({
  name: "ArrayItemWrapper",
  props: {
    onAdd: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDelete: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onUp: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDown: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    index: { type: Number, required: true },
  },
  setup(props, { slots }) {
    const classesRef = useStyles();
    const handleAdd = () => props.onAdd(props.index);
    const handleDelete = () => props.onDelete(props.index);
    const handleUp = () => props.onUp(props.index);
    const handleDown = () => props.onDown(props.index);
    return () => {
      const classes = classesRef.value;
      return (
        <div class={classes.container}>
          {/* 增删排序的按钮 */}
          <div class={classes.action}>
            <button class={classes.actionItem} onClick={handleAdd}>
              新增
            </button>
            <button class={classes.actionItem} onClick={handleDelete}>
              删除
            </button>
            <button class={classes.actionItem} onClick={handleUp}>
              上移
            </button>
            <button class={classes.actionItem} onClick={handleDown}>
              下移
            </button>
          </div>
          {/* 在Vue3中所有Slots是一个函数 */}
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      );
    };
  },
});

export default defineComponent({
  name: "ArrayField",
  props: FiledPropsDefine,
  setup(props) {
    const context = useVJSFContext();
    const SelectioWidgeRef = getWidgets(SelectionWidgetNames.SelectionWidget);
    const handleArrayItemChange = (v: any, index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      arr[index] = v;
      props.onChange(arr);
    };
    const handleAdd = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      arr.splice(index + 1, 0, undefined);
      props.onChange(arr);
    };
    const handleDelete = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      arr.splice(index, 1);
      props.onChange(arr);
    };
    const handleUp = (index: number) => {
      if (index === 0) return;
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      const item = arr.splice(index, 1);
      arr.splice(index - 1, 0, item[0]);
      props.onChange(arr);
    };
    const handleDown = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      if (index === arr.length - 1) return;
      const item = arr.splice(index, 1);
      arr.splice(index + 1, 0, item[0]);
      props.onChange(arr);
    };
    return () => {
      const { schema, rootSchema, value, errorSchema } = props;
      const SchemaItem = context.SchemaItem;
      const isMultiType = Array.isArray(schema.items);
      // 判断是否是数组第一种形式
      const isSelect = schema.items && (schema.items as any).enum;
      // const SelectionWidget = context.theme.widgets.SelectionWidget;
      const SelectionWidget = SelectioWidgeRef.value;
      if (isMultiType) {
        const items: Schema[] = schema.items as any;
        const arr = Array.isArray(value) ? value : [];
        return items.map((s: Schema, index: number) => (
          <SchemaItem
            schema={s}
            rootSchema={rootSchema}
            value={arr[index]}
            errorSchema={errorSchema[index] || {}}
            onChange={(v: any) => {
              handleArrayItemChange(v, index);
            }}
          />
        ));
      } else if (!isSelect) {
        // 判断是否是数组第一种形式
        const arr = Array.isArray(value) ? value : [];
        return arr.map((v: any, index: number) => {
          return (
            <ArrayItemWrapper
              index={index}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onUp={handleUp}
              onDown={handleDown}
            >
              <SchemaItem
                schema={schema.items as any}
                value={v}
                key={index}
                errorSchema={errorSchema[index] || {}}
                rootSchema={rootSchema}
                onChange={(v: any) => {
                  handleArrayItemChange(v, index);
                }}
              />
            </ArrayItemWrapper>
          );
        });
      } else {
        // 数组的第三种形式
        const enumOptions = (schema as any).items.enum;
        const options = enumOptions.map((e: any) => ({
          key: e,
          value: e,
        }));
        return (
          <SelectionWidget
            onChange={props.onChange}
            value={props.value}
            options={options}
            error={errorSchema.__errors}
          ></SelectionWidget>
        );
      }
    };
  },
});
