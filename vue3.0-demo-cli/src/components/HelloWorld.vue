<template>
  <div class="hello">
    {{top}}
    <input :class="{fixedinput:top>10}" type="text" v-model="state.newTodo" @keyup.enter="addTodo">
    <div>
      <span>{{nums}}</span> <span @click="add" >点击</span>
    </div>
    <ul>
      <li :class="{done:todo.status}" v-for="(todo,index) in state.todoList" :key="todo.id" @click="toggle(index)">{{todo.name}}</li>
    </ul>
    <div>
      完成事件个数：{{remain}}
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
// 如果没有import 打包可以把代码丢掉 tree-shaking
// compisition 可以拆开独立函数放在独立文件 vue只能用mixin 会找不到源头 以及重名
import addTodoFac from './hello_function'
// 拆分复杂逻辑
import useScrollFac from './hello_function_userScroll'
export default {
  setup () {
    const nums = ref(0)
    const add = () => {
      nums.value += 1
    }
    const state = reactive({
      newTodo: '',
      todoList: [
        { id: 0, name: '学习', status: false },
        { id: 1, name: '吃饭', status: true },
        { id: 2, name: '睡觉', status: false }
      ]
    })
    // 函数可以抽离出去 拆包  拆成独立函数
    // function addTodo () {
    //   state.todoList.push(
    //     { id: state.todoList.length, name: state.newTodo, status: false }
    //   )
    // }
    const { addTodo } = addTodoFac(state)
    function toggle (index) {
      state.todoList[index].status = !state.todoList[index].status
    }
    const { top } = useScrollFac()
    console.log(top)
    const remain = computed(
      () => state.todoList.filter(todo => todo.status).length
    )
    return {
      nums,
      add,
      state,
      addTodo,
      remain,
      toggle,
      top
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 20px 10px;
}
li.done{
  text-decoration: line-through;
}
.fixedinput{
  position:fixed;
  top:10px;
  left:45%;
}
a {
  color: #42b983;
}
</style>
