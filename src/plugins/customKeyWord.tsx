import { CustomKeyWord } from "../../lib/type";

const keyword: CustomKeyWord = {
  name: "test",
  definition: {
    keyword: "test",
    macro: () => {
      return {
        minLength: 10,
      };
    },
  },
  // return出来的关键字要与macro中有对应关系
  transformSchema(schema) {
    return {
      ...schema,
      minLength: 10,
    };
  },
};

export default keyword;
