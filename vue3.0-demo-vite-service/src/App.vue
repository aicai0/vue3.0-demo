<template>
<div>
  <h1> hello</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>
