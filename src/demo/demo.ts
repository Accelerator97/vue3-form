import PasswordWidget from "@/components/Password";

export default {
  name: "Demo",
  schema: {
    type: "object",
    properties: {
      pass1: {
        type: "string",
        minLength: 10,
        title: "password",
      },
      pass2: {
        type: "string",
        minLength: 10,
        title: "re try password",
      },
    },
  },
  async customValidate(data: any, errors: any) {
    return new Promise((resolve: any) => {
      setTimeout(() => {
        if (data.pass1 !== data.pass2) {
          errors.pass2.addError("密码必须相同");
        }
        resolve();
      }, 0);
    });
  },
  uiSchema: {
    properties: {
      pass1: {
        widget: PasswordWidget,
      },
    },
  },
  default: 1,
};
