import { mount, shallowMount } from "@vue/test-utils";

import { defineComponent, h } from "vue";

import SchemaForm, { NumberField } from "../../lib";

describe("JsonSchemaForm", () => {
  it("should render correct number field", () => {
    let value = 0;
    const wrapper = mount(SchemaForm, {
      props: {
        schema: {
          type: "number",
        },
        value: value,
        onChange: (v: number) => {
          value = v;
        },
      },
    });
    const numberField = wrapper.findComponent(NumberField);
    expect(numberField.exists()).toBeTruthy();
    // 模拟input事件 输入字符串的123 返回数字类型的123
    const input = numberField.find("input");
    input.element.value = "123";
    input.trigger("input");
    expect(value).toBe(123);
  });
});
