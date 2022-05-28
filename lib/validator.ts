import Ajv, { ErrorObject } from "ajv";
import { Schema } from "./type";

interface TransformErrorsObejct {
  name: string;
  property: string;
  message: string | undefined;
  params: Record<string, any>;
  schemaPath: string;
}
interface ErrorSchemaObject {
  [level: string]: ErrorSchema;
}
export type ErrorSchema = ErrorSchemaObject & {
  __errors?: string[];
};

// 避免循环引用 使用ErrorShcemaObject作为中间变量
// export type ErrorSchema = {
//   [level: string]: ErrorSchema
// } & {
//   __errors: string[]
// }

function toErrorSchema(errors: TransformErrorsObejct[]) {
  if (errors.length < 1) return {};
  return errors.reduce((errorSchema, error) => {
    const { property = "", message } = error;
    const path = property.split("/"); // /obj/a -> [obj, a]
    let parent = errorSchema;
    // 如果dataPath: '/name', path为['',name] 要舍弃第一个下标项
    if (path.length > 0 && path[0] === "") {
      path.splice(0, 1);
    }

    // 下面的代码就是 把[obj,a] 转化成如下形式：
    // {
    //   obj: {
    //     a: {__errors: [message]}
    //   }
    // }
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        (parent as any)[segment] = {};
      }
      parent = parent[segment];
    }

    if (Array.isArray(parent.__errors)) {
      parent.__errors = parent.__errors.concat(message || "");
    } else {
      if (message) {
        parent.__errors = [message];
      }
    }

    return errorSchema;
  }, {} as ErrorSchema);
}

function transformErrors(
  errors: ErrorObject[] | null | undefined,
): TransformErrorsObejct[] {
  if (errors === null || errors === undefined) return [];
  //   {
  //     keyword: 'errorMessage',
  //     dataPath: '/name',
  //     schemaPath: '#/properties/name/errorMessage',
  //     params: { errors: [Array] },
  //     message: '自定义关键字验证 test 失败了'
  //   },
  return errors.map(({ message, keyword, params, dataPath, schemaPath }) => {
    return {
      name: keyword,
      message,
      params,
      property: `${dataPath}`,
      schemaPath,
    };
  });
}

export function validateFormData(
  validator: Ajv,
  formData: any,
  schema: Schema,
) {
  let validationErr = null;

  // validator.validate执行时 可能也会抛出错误 用validationErr接收 加到transformErrors返回的errors（数组形式)上
  try {
    validator.validate(schema, formData);
  } catch (err) {
    validationErr = err;
  }
  let errors = transformErrors(validator.errors);
  if (validationErr) {
    errors = [...errors, { message: validationErr } as TransformErrorsObejct];
  }
  const errorSchema = toErrorSchema(errors);
  return {
    errors,
    errorSchema,
    valid: errors.length === 0,
  };
}
