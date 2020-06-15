import { ref, watch } from '@vue/composition-api'
function MousePosition () {
  const x = ref(0)
  watch(x, () => {
    console.log('hooks setup', x.value)
  })
  return { x }
}
export default MousePosition
