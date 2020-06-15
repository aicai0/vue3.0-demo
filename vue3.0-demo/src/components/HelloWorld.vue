<template>
  <div class="hello">
    <div>
      测试{{x}}
    </div>
   <div @click="add">
      点击{{y}}
   </div>
   <div>
     vuex---->{{flag}}
   </div>
   <div @click="getData">
     composition-helpers ----> {{loading}}
   </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { useState, useActions } from 'vuex-composition-helpers' // vuex-composition-helpers
import MousePosition from './hooks/helloWord'
export default defineComponent({
  setup (props, { root }) {
    const x = MousePosition()
    console.log(props, root, this)
    const y: Ref<number> = ref(0)
    const add = () => {
      y.value += 1
    }

    const flag = root.$store.state.loading

    const loading = useState(['loading'])
    const { getData } = useActions(['getData'])
    return {
      x,
      y,
      add,
      flag,
      loading,
      getData
    }
  }
})
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
