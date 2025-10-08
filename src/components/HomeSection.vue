<template>
  <section id="home" class="home-section">
    <div class="hero" :class="{ 'loaded': isLoaded }">
      <div class="hero-animation">
        <div class="floating-prize"></div>
        <div class="floating-prize"></div>
        <div class="floating-prize"></div>
      </div>
      
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="highlight">SUPER PROMOÇÃO</span>
          <span class="year">2025</span>
        </h1>
        <p class="hero-subtitle">
          A maior campanha promocional do ano!<br>
          <strong>Participe e concorra a prêmios incríveis!</strong>
        </p>
        
        <div class="countdown-container">
          <h3>Promoção válida até:</h3>
          <div class="countdown">
            <div class="countdown-item">
              <span class="countdown-number">{{ countdown.days }}</span>
              <span class="countdown-label">Dias</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number">{{ countdown.hours }}</span>
              <span class="countdown-label">Horas</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number">{{ countdown.minutes }}</span>
              <span class="countdown-label">Min</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number">{{ countdown.seconds }}</span>
              <span class="countdown-label">Seg</span>
            </div>
          </div>
        </div>
        
        <div class="hero-actions">
          <button class="btn btn-primary pulse-animation" @click="scrollToParticipacao">
            PARTICIPAR AGORA
          </button>
          <router-link to="/regulamento" class="btn btn-secondary">
            📄 Ver Regulamento
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="campaign-highlights">
      <div class="highlight-grid">
        <div class="highlight-card">
          <h3>Mais de 1000</h3>
          <p>Prêmios disponíveis</p>
        </div>
        <div class="highlight-card">
          <h3>500+ Lojas</h3>
          <p>Participantes em todo Brasil</p>
        </div>
        <div class="highlight-card">
          <h3>R$ 1 Milhão</h3>
          <p>Em prêmios totais</p>
        </div>
        <div class="highlight-card">
          <h3>Fácil de</h3>
          <p>Participar pelo app</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const countdown = ref<CountdownTime>({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const isLoaded = ref(false)
let countdownInterval: number

const updateCountdown = () => {
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 30)
  endDate.setHours(23, 59, 59, 999)
  
  const now = new Date().getTime()
  const distance = endDate.getTime() - now
  
  if (distance > 0) {
    countdown.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
  } else {
    // acabou o tempo
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
}

const scrollToParticipacao = () => {
  const element = document.getElementById('como-participar')
  if (element) {
    const headerOffset = 90
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  updateCountdown()
  // atualiza de 10 em 10 segundos pra não sobrecarregar
  countdownInterval = setInterval(updateCountdown, 10000)
  
  // Marca como carregado após um pequeno delay para suavizar a transição
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
.home-section {
  padding: 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.hero {
  position: relative;
  text-align: center;
  padding: 6rem 2rem 4rem;
  color: white;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  

}

.hero.loaded {
  opacity: 1;
  transform: translateY(0);
}

.hero.loaded::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: 
    linear-gradient(
      45deg, 
      rgba(0, 0, 0, 0.4), 
      rgba(0, 0, 0, 0.6), 
      rgba(0, 0, 0, 0.4)
    ),
    url('/img/img-fundo-teste.png');
  background-size: cover;
  background-position: center 0%;
  background-attachment: fixed;
  background-repeat: no-repeat;
  z-index: -1;
  animation: backgroundFloat 8s ease-in-out infinite;
}



@keyframes backgroundFloat {
  0%, 100% { 
    transform: translateY(0px);
  }
  50% { 
    transform: translateY(-70px);
  }
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.04) 0%, transparent 50%),
    rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(1px);
  z-index: 1;
  animation: sparkle 8s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { 
    opacity: 1;
    background-position: 0% 0%, 100% 100%;
  }
  50% { 
    opacity: 0.8;
    background-position: 20% 20%, 80% 80%;
  }
}

.hero-content {
  position: relative;
  z-index: 2;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 25%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 75%; }
  100% { background-position: 0% 50%; }
}

.hero-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1.5;
}

.floating-prize {
  position: absolute;
  font-size: 3rem;
  opacity: 0.8;
  animation: floatSoft 8s ease-in-out infinite;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  user-select: none;
}

.floating-prize:nth-child(1) {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.floating-prize:nth-child(2) {
  top: 20%;
  right: 15%;
  animation-delay: 2.5s;
}

.floating-prize:nth-child(3) {
  bottom: 30%;
  left: 20%;
  animation-delay: 5s;
}

@keyframes floatSoft {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
  25% { transform: translateY(-20px) rotate(5deg); opacity: 1; }
  50% { transform: translateY(-10px) rotate(0deg); opacity: 0.6; }
  75% { transform: translateY(10px) rotate(-5deg); opacity: 0.9; }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.hero-title {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 4rem;
  margin-bottom: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.highlight {
  color: #e6c547;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.7),
    0 0 10px rgba(230, 197, 71, 0.3),
    0 0 20px rgba(230, 197, 71, 0.2);
  animation: shimmer 6s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { 
    color: #e6c547;
    text-shadow: 
      2px 2px 4px rgba(0, 0, 0, 0.7),
      0 0 10px rgba(230, 197, 71, 0.3),
      0 0 20px rgba(230, 197, 71, 0.2);
  }
  50% { 
    color: #f0d55b;
    text-shadow: 
      2px 2px 4px rgba(0, 0, 0, 0.7),
      0 0 12px rgba(240, 213, 91, 0.4),
      0 0 25px rgba(240, 213, 91, 0.25);
  }
}

.year {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 5rem;
  font-weight: 900;
  color: white;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.8),
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(255, 255, 255, 0.3);
  letter-spacing: -0.04em;
}

.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 3rem;
  line-height: 1.6;
  text-shadow: 
    1px 1px 3px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 10px;
  backdrop-filter: blur(5px);
}

.countdown-container {
  margin: 3rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.countdown-container h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.countdown {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  min-width: 80px;
}

.countdown-number {
  font-family: 'Poppins', monospace;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.countdown-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.btn {
  font-family: 'Poppins', 'Inter', sans-serif;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(45deg, #ff6b6b, #ffd93d, #74b0ff);
  background-size: 200% 200%;
  color: white;
  box-shadow: 
    0 8px 30px rgba(255, 107, 107, 0.4),
    0 0 20px rgba(255, 107, 107, 0.3);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  animation: gradientShift 3s ease infinite;
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn:hover {
  transform: translateY(-3px) scale(1.02);
}

.btn-primary:hover {
  box-shadow: 
    0 12px 40px rgba(255, 107, 107, 0.6),
    0 0 30px rgba(255, 107, 107, 0.4);
  background-position: 100% 0;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 1);
  box-shadow: 
    0 12px 40px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.pulse-animation {
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 8px 30px rgba(255, 107, 107, 0.3); }
  50% { box-shadow: 0 8px 30px rgba(255, 107, 107, 0.5), 0 0 0 5px rgba(255, 107, 107, 0.1); }
  100% { box-shadow: 0 8px 30px rgba(255, 107, 107, 0.3); }
}

.campaign-highlights {
  padding: 4rem 2rem;
  background: white;
}

.highlight-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.highlight-card {
  text-align: center;
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  background: var(--gradient-accent);
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.highlight-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.highlight-card:hover::before {
  opacity: 1;
  transform: rotate(45deg) translate(50%, 50%);
}

.highlight-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.3);
}

.highlight-card:hover .highlight-icon {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

.highlight-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  transition: transform 0.3s ease;
}

/* .rotating: Removed continuous rotation animation for better performance */

.highlight-card h3 {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.highlight-card p {
  font-size: 1.1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 1rem 3rem;
    min-height: 70vh;
    background-attachment: scroll; /* Melhor performance no mobile */
  }
  
  .hero.loaded::before {
    background-attachment: scroll; /* Melhor performance no mobile */
    animation: backgroundFloatMobile 8s ease-in-out infinite;
  }
  
  .hero.loaded {
    animation: heroFloatMobile 8s ease-in-out infinite;
  }
  
  .hero::before {
    background: rgba(0, 0, 0, 0.25); /* Overlay mais suave no mobile */
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .year {
    font-size: 3.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
    padding: 0.8rem;
    margin-bottom: 2rem;
  }
  
  .countdown {
    gap: 1rem;
  }
  
  .countdown-number {
    font-size: 2rem;
  }
  
  .btn {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }
}

@keyframes backgroundFloatMobile {
  0%, 100% { 
    transform: translateY(0px);
  }
  50% { 
    transform: translateY(-50px);
  }
}
</style>