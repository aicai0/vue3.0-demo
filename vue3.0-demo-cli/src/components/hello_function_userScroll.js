import { ref, onMounted, onUnmounted } from 'vue'
export default function useScroll () {
  const top = ref(0)
  function upDate (e) {
    top.value = window.scrollY
  }
  onMounted(
    () => {
      window.addEventListener('scroll', upDate)
    }
  )
  onUnmounted(
    () => {
      window.removeEventListener('scroll', upDate)
    }
  )
  return { top }
}
