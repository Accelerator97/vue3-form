import { defineComponent, reactive, ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
const img = require("./assets/logo.png"); //eslint-disable-line

export default defineComponent({
  setup() {
    const state = reactive({
      name: "Ben",
    });

    const numberRef = ref(1);
    setInterval(() => {
      state.name += 1;
      numberRef.value += 1;
    }, 1000);

    // 如果number写在setup 里面，setup只执行一次，number永远是初始化的值1，不会再次执行
    // const number = numberRef.value;
    return () => {
      // setup定义的响应式数据变化 会引起return出来的函数重新执行，生成新的DOM树
      // 所以要把number = numberRef.value放在return 出来的函数里面
      const number = numberRef.value;
      return (
        <div id="app">
          <img src={img} alt="vue logo"></img>
          <p>{state.name + number}</p>
        </div>
      );
    };
  },
});
