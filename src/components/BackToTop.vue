<template>
  <Transition name="fade">
    <button 
      v-if="isVisible"
      @click="goToTop"
      class="back-to-top"
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
    >
      <span class="arrow">↑</span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const checkScrollPosition = () => {
  isVisible.value = window.scrollY > 500
}

const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScrollPosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 5.5rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  backdrop-filter: blur(10px);
}

.back-to-top:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.back-to-top:active {
  transform: translateY(-2px) scale(1.05);
}

.arrow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 4.5rem;
    right: 1rem;
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
}
</style>