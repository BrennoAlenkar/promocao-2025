<template>
  <div class="loading-spinner" :class="{ small, large }">
    <div class="spinner">
      <div class="spinner-circle"></div>
      <div class="spinner-circle"></div>
      <div class="spinner-circle"></div>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  small?: boolean
  large?: boolean
}

withDefaults(defineProps<Props>(), {
  text: '',
  small: false,
  large: false
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner.small {
  padding: 1rem;
}

.loading-spinner.large {
  padding: 4rem;
}

.spinner {
  display: flex;
  gap: 0.5rem;
}

.spinner-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  animation: bounce 1.4s ease-in-out infinite both;
}

.small .spinner-circle {
  width: 8px;
  height: 8px;
}

.large .spinner-circle {
  width: 16px;
  height: 16px;
}

.spinner-circle:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner-circle:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-text {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
  text-align: center;
}

.small .loading-text {
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.large .loading-text {
  font-size: 1.1rem;
  margin-top: 1.5rem;
}
</style>