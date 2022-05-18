import { mount } from "@vue/test-utils";

import {
  ArrayField,
  NumberField,
  SelectionWidget,
  StringField,
} from "../../lib";

import TestComponent from "./utils/TestCompoenent";

describe("ArrayField", () => {
  it("should render multiple type", () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: "array",
          items: [{ type: "string" }, { type: "number" }],
        },
        value: [],
        onChange: () => {},
      },
    });
    const arrField = wrapper.findComponent(ArrayField);
    const strField = wrapper.findComponent(StringField);
    const numberField = wrapper.findComponent(NumberField);
    expect(arrField.exists()).toBeTruthy();
    expect(strField.exists()).toBeTruthy();
    expect(numberField.exists()).toBeTruthy();
  });
  it("should render single type", () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: "array",
          items: { type: "string" },
        },
        value: ["1", "2"],
        onChange: () => {},
      },
    });
    const arrField = wrapper.findComponent(ArrayField);
    const strFields = wrapper.findAllComponents(StringField);
    expect(strFields.length).toBe(2);
    expect(strFields[0].props("value")).toBe("1");
  });
  it("should render single type based on enum", () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: "array",
          items: { type: "string", enum: ["1", "2", "3"] },
        },
        value: [],
        onChange: () => {},
      },
    });
    const select = wrapper.findComponent(SelectionWidget);
    expect(select.exists()).toBeTruthy();
  });
});
