<template>
  <div class="home-page">
    <!-- Conteúdo da Landing Page -->
    <HomeSection />
    <ComoParticiparSection />
    <PremiosSection />
    <FaqSection />
    <GanhadoresSection />
    <LojasSection />
  </div>
</template>

<script setup lang="ts">
import HomeSection from '../components/HomeSection.vue'
import ComoParticiparSection from '../components/ComoParticiparSection.vue'
import PremiosSection from '../components/PremiosSection.vue'
import FaqSection from '../components/FaqSection.vue'
import GanhadoresSection from '../components/GanhadoresSection.vue'
import LojasSection from '../components/LojasSection.vue'
</script>

<style scoped>
.home-page {
  width: 100%;
}
</style>