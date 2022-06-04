import Ajv, { ErrorObject } from "ajv";
import { Schema } from "./type";
import { isObject } from "./utils";

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

export async function validateFormData(
  validator: Ajv,
  formData: any,
  schema: Schema,
  customValidate?: (data: any, errors: any) => void, // 添加自定义校验函数作为函数的参数
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

  // 如果用户没有传入自定义校验函数
  if (!customValidate) {
    return {
      errors,
      errorSchema,
      valid: errors.length === 0,
    };
  }

  /**
   * {
   *   obj:{
   *       a:{
   *           b}
   *       _errors:[]
   *    }
   * }
   * 在每个层级都会有一个_errors这个属性，它是一个数组形式
   * 对于customValidate，用proxy的方式在每个层级上添加_errors这个属性
   */
  const proxy = createErrorProxy();
  await customValidate(formData, proxy); // 使用await调用customValidate
  const newErrorSchema = mergetObjects(errorSchema, proxy);
  return {
    errors,
    errorSchema: newErrorSchema,
    valid: errors.length === 0,
  };
}

function createErrorProxy() {
  const raw = {};
  return new Proxy(raw, {
    get(target, key, receiver) {
      if (key === "addError") {
        return (msg: string) => {
          const _errors = Reflect.get(target, "_errors", receiver);
          if (_errors && Array.isArray(_errors)) {
            _errors.push(msg);
          } else {
            (target as any).__errors = [msg];
          }
        };
      }
      // 读取obj.a时 通过raw.obj.a来读取
      // 通过res判断之前是否在raw上设置这个属性
      const res = Reflect.get(target, key, receiver);
      if (!res) {
        const p: any = createErrorProxy();
        (target as any)[key] = p;
        return p;
      }
      return res;
    },
  });
}

// 合并对象
export function mergetObjects(obj1: any, obj2: any, concatArrays = false) {
  // Recursively merge deeply nested objects
  const accumulator = Object.assign({}, obj1); // Prevent mutation of source object
  return Object.keys(obj2).reduce((accumulator, key) => {
    const left = obj1 ? obj1[key] : {};
    const right = obj2[key];
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      accumulator[key] = mergetObjects(left, right, concatArrays); // 递归
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      accumulator[key] = left.concat(right);
    } else {
      accumulator[key] = right;
    }
    return accumulator;
  }, accumulator);
}
