// import { mount } from "@vue/test-utils";

// import SchemaForm, { NumberField, StringField } from "../../lib";

// describe("ObjectField", () => {
//   let schema: any;
//   beforeEach(() => {
//     schema = {
//       type: "object",
//       properties: {
//         name: {
//           type: "string",
//         },
//         age: {
//           type: "number",
//         },
//       },
//     };
//   });
//   it("should render properties to correct fields", () => {
//     const wrapper = mount(SchemaForm, {
//       props: {
//         schema,
//         value: {},
//         onChange: () => {},
//       },
//     });
//     const stringField = wrapper.findComponent(StringField);
//     const numberField = wrapper.findComponent(NumberField);
//     expect(numberField.exists()).toBeTruthy();
//     expect(stringField.exists()).toBeTruthy();
//   });
//   it("should change value when sub fields trigger onChange ", async () => {
//     let value: any = {};
//     const wrapper = mount(SchemaForm, {
//       props: {
//         schema,
//         value: value,
//         onChange: (v: any) => {
//           value = v;
//         },
//       },
//     });
//     const stringField = wrapper.findComponent(StringField);
//     const numberField = wrapper.findComponent(NumberField);
//     await stringField.props("onChange")("1");
//     await numberField.props("onChange")(1);
//     expect(value.name).toEqual("1");
//     expect(value.age).toEqual(1);
//   });
//   it("should not render value when value is undefined ", async () => {
//     let value: any = {};
//     const wrapper = mount(SchemaForm, {
//       props: {
//         schema,
//         value: value,
//         onChange: (v: any) => {
//           value = v;
//         },
//       },
//     });
//     const stringField = wrapper.findComponent(StringField);
//     await stringField.props("onChange")(undefined);
//     expect(value.name).toEqual(undefined);
//   });
// });
