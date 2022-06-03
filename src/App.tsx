import { defineComponent, reactive, ref, Ref, watchEffect } from "vue";
import MonacoEditor from "./components/MonacoEditor";
import { createUseStyles } from "vue-jss";
import themeDefault from "../lib/theme-default";
// 测试数据
import demos from "./demo";

// 导入组件库
import SchemaForm, { ThemeProvider } from "../lib";

// TODO:需要在lib中导出
type Schema = any;
type UISchema = any;

function toJson(data: any) {
  // JSON.stringify 第三个参数可以表示换行缩进2个空格
  return JSON.stringify(data, null, 2);
}

const schema = {
  type: "string",
};

// css in js
const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "1200px",
    margin: "0 auto",
  },
  menu: {
    marginBottom: 20,
  },
  code: {
    width: 700,
    flexShrink: 0,
  },
  codePanel: {
    minHeight: 400,
    marginBottom: 20,
  },
  uiAndValue: {
    display: "flex",
    justifyContent: "space-between",
    // 当前元素下的所有子元素
    "& > *": {
      width: "46%",
    },
  },
  content: {
    display: "flex",
  },
  form: {
    padding: "0 20px",
    flexGrow: 1,
  },
  menuButton: {
    appearance: "none",
    borderWidth: 0,
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "inline-block",
    padding: 15,
    borderRadius: 5,
    "&:hover": {
      background: "#efefef",
    },
  },
  menuSelected: {
    background: "#337ab7",
    color: "#fff",
    "&:hover": {
      background: "#337ab7",
    },
  },
});

export default defineComponent({
  setup() {
    // tab栏切换
    const selectedRef: Ref<number> = ref(0);
    // 定义一个响应式对象
    const demo: {
      schema: Schema | null;
      data: any;
      uiSchema: UISchema | null;
      schemaCode: string;
      dataCode: string;
      uiSchemaCode: string;
      customValidate: ((data: any, error: any) => void) | undefined; // 自定义函数
    } = reactive({
      schema: null,
      data: {},
      uiSchema: {},
      schemaCode: "",
      dataCode: "",
      uiSchemaCode: "",
      customValidate: undefined, // 自定义函数
    });

    // 数据监听，确定 demo 的当前值
    watchEffect(() => {
      const index = selectedRef.value;
      // demos is test data provide by lib user
      const d: any = demos[index];
      demo.schema = d.schema;
      demo.data = d.default;
      demo.uiSchema = d.uiSchema;
      demo.schemaCode = toJson(d.schema);
      demo.dataCode = toJson(d.default);
      demo.uiSchemaCode = toJson(d.uiSchema);
      demo.customValidate = d.customValidate;
    });

    const handleChange = (v: any) => {
      demo.data = v;
      demo.dataCode = toJson(v);
    };

    // 在编辑器里修改demo的数据（工厂函数）
    function handleCodeChange(
      field: "schema" | "data" | "uiSchema",
      value: string,
    ) {
      try {
        const json = JSON.parse(value);
        demo[field] = json;
        (demo as any)[`${field}Code`] = value;
      } catch (err) {
        // do nothing
      }
    }

    const handleSchemaChange = (v: string) => handleCodeChange("schema", v);
    const handleDataChange = (v: string) => handleCodeChange("data", v);
    const handleUISchemaChange = (v: string) => handleCodeChange("uiSchema", v);

    const contextRef = ref();
    const nameRef = ref(); // 获取 SchemaForm 引用

    // css样式
    const classesRef = useStyles();

    return () => {
      const classes = classesRef.value;
      const selected = selectedRef.value;
      return (
        // <StyleThemeProvider>
        // <VJSFThemeProvider theme={theme as any}>
        <div class={classes.container}>
          <div class={classes.menu}>
            <h1>Vue3 JsonSchema Form</h1>
            <div>
              {demos.map((demo, index) => (
                <button
                  class={{
                    [classes.menuButton]: true,
                    [classes.menuSelected]: index === selected,
                  }}
                  onClick={() => (selectedRef.value = index)}
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>
          {/* /.menu */}
          <div class={classes.content}>
            <div class={classes.code}>
              <MonacoEditor
                code={demo.schemaCode}
                class={classes.codePanel}
                onChange={handleSchemaChange}
                title="Schema"
              />
              <div class={classes.uiAndValue}>
                <MonacoEditor
                  code={demo.uiSchemaCode}
                  class={classes.codePanel}
                  onChange={handleUISchemaChange}
                  title="UISchema"
                />
                <MonacoEditor
                  code={demo.dataCode}
                  class={classes.codePanel}
                  onChange={handleDataChange}
                  title="Value"
                />
              </div>
              {/* /.uiAndValue */}
            </div>
            {/* /.code */}
            <div class={classes.form}>
              <ThemeProvider theme={themeDefault}>
                <SchemaForm
                  schema={demo.schema}
                  onChange={handleChange}
                  value={demo.data}
                  contextRef={contextRef}
                  ref={nameRef}
                  customValidate={demo.customValidate}
                />
              </ThemeProvider>
              {/* <ThemeProvider theme={themeDefault as any}>
                <SchemaForm
                  schema={demo.schema}
                  value={demo.data}
                  onChange={handleChange}
                  contextRef={contextRef}
                  ref={nameRef}
                  customValidate={demo.customValidate}
                  uiSchema={demo.uiSchema || {}}
                  customFormats={customFormat}
                  customKeywords={customKeyword}
                />
              </ThemeProvider> */}
              <button
                onClick={() => {
                  console.log(contextRef.value.doValidate());
                }}
              >
                校验
              </button>
            </div>
          </div>
        </div>
        // </VJSFThemeProvider>
        // </StyleThemeProvider>
      );
    };
  },
});
