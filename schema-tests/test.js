const Ajv = require("ajv")
const addFormats = require('ajv-formats')
const ajv = new Ajv()
// addFormats(ajv)
// ajv.addFormat('test',(data)=>{
//   // data是用户传入的对应的字段的值
//   console.log('---------',data)
//   return data === 'haha'
// })
ajv.addKeyword({
  keyword: 'test',
  // compile最后要return出来一个函数（重要）
  compile(sch,parentSchema){
    // sch 是 定义keyword时的值，parentSchema是这个keyword所在schema的信息
    return ()=> true
  },
  errors: false
})

const schema = {
  type: "object",
  properties: {
    email: {type: "string",test:false},
    bar: {type: "string"},
  },
  required: ["email"],
  additionalProperties: false
}

const data = {email: "123", bar: "abc"}
const validate = ajv.compile(schema)
const valid = validate(data)
if (!valid) console.log(validate.errors)

