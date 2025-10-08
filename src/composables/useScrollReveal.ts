import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollReveal() {
  const isVisible = ref(false)
  const elementRef = ref<HTMLElement | null>(null)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (elementRef.value) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isVisible.value = true // elemento entrou na tela
            }
          })
        },
        {
          threshold: 0.1, // 10% do elemento visível
          rootMargin: '0px 0px -50px 0px' // um pouco antes de aparecer
        }
      )
      
      observer.observe(elementRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect() // limpa o observer quando sai de cena
    }
  })

  return {
    isVisible,
    elementRef
  }
}