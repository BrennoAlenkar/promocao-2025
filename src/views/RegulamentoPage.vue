<template>
  <div class="regulamento-page">
    <!-- Header da página -->
    <div class="regulamento-header">
      <div class="header-background">
        <div class="header-pattern"></div>
        <div class="header-glow"></div>
      </div>
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <div class="header-icon-wrapper">
              <div class="header-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L2 7L12 11L22 7L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 17L12 21L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 12L12 16L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="icon-ring"></div>
            </div>
            <div class="header-text">
              <span class="page-category">Documentos Legais</span>
              <h1 class="page-title">Regulamento Oficial</h1>
              <p class="page-subtitle">Super Promoção 2025 - Termos e Condições Gerais</p>
              <div class="page-meta">
                <span class="meta-item">Vigente desde 01/01/2025</span>
                <span class="meta-divider">•</span>
                <span class="meta-item">Última atualização: Janeiro 2025</span>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <router-link to="/" class="btn-back">
              <span class="back-icon">←</span>
              <span class="back-text">Voltar ao Site</span>
            </router-link>
            <button class="btn-print" @click="printPage">
              <span class="print-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9V2H18V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 18H4C3.44772 18 3 17.5523 3 17V11C3 10.4477 3.44772 10 4 10H20C20.5523 10 21 10.4477 21 11V17C21 17.5523 20.5523 18 20 18H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18 14H6V22H18V14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="print-text">Imprimir</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo do regulamento -->
    <div class="regulamento-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- Índice -->
          <nav class="regulamento-nav">
            <div class="nav-header">
              <h3 class="nav-title">Índice de Conteúdo</h3>
            </div>
            <div class="nav-progress">
              <div class="progress-bar"></div>
            </div>
            <ul class="nav-list">
              <li class="nav-item">
                <a href="#artigo-1" @click="scrollToSection('artigo-1')" class="nav-link">
                  <span class="nav-number">01</span>
                  <span class="nav-text">Informações Gerais</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#artigo-2" @click="scrollToSection('artigo-2')" class="nav-link">
                  <span class="nav-number">02</span>
                  <span class="nav-text">Participação</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#artigo-3" @click="scrollToSection('artigo-3')" class="nav-link">
                  <span class="nav-number">03</span>
                  <span class="nav-text">Prêmios</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#artigo-4" @click="scrollToSection('artigo-4')" class="nav-link">
                  <span class="nav-number">04</span>
                  <span class="nav-text">Sorteios</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#artigo-5" @click="scrollToSection('artigo-5')" class="nav-link">
                  <span class="nav-number">05</span>
                  <span class="nav-text">Entrega dos Prêmios</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#artigo-6" @click="scrollToSection('artigo-6')" class="nav-link">
                  <span class="nav-number">06</span>
                  <span class="nav-text">Responsabilidades</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#artigo-7" @click="scrollToSection('artigo-7')" class="nav-link">
                  <span class="nav-number">07</span>
                  <span class="nav-text">Disposições Finais</span>
                </a>
              </li>
            </ul>
            <div class="nav-footer">
              <div class="estimated-time">
                <span class="time-icon">⏱️</span>
                <span class="time-text">Tempo de leitura: ~15 min</span>
              </div>
            </div>
          </nav>

          <!-- Artigos do regulamento -->
          <div class="regulamento-articles">
            <article id="artigo-1" class="article-section">
              <h2 class="article-title">
                <span class="article-number">1.</span>
                Informações Gerais da Promoção
              </h2>
              <div class="article-content">
                <p><strong>1.1 Nome da Promoção:</strong> "Super Promoção 2025"</p>
                <p><strong>1.2 Período de Vigência:</strong> De 01/01/2025 a 31/12/2025, às 23h59 (horário de Brasília).</p>
                <p><strong>1.3 Empresa Promotora:</strong> Super Promoção LTDA, CNPJ: 12.345.678/0001-90</p>
                <p><strong>1.4 Modalidade:</strong> Promoção comercial com distribuição de prêmios mediante sorteio.</p>
                <p><strong>1.5 Abrangência:</strong> Todo território nacional brasileiro.</p>
                <p><strong>1.6 Registro SCE:</strong> Esta promoção está devidamente registrada na Secretaria de Acompanhamento Econômico conforme legislação vigente.</p>
              </div>
            </article>

            <article id="artigo-2" class="article-section">
              <h2 class="article-title">
                <span class="article-number">2.</span>
                Participação na Promoção
              </h2>
              <div class="article-content">
                <p><strong>2.1 Público-Alvo:</strong> Pessoas físicas, maiores de 18 anos, residentes no Brasil.</p>
                <p><strong>2.2 Forma de Participação:</strong></p>
                <ul>
                  <li>Cadastro gratuito no site oficial da promoção</li>
                  <li>Preenchimento completo dos dados pessoais</li>
                  <li>Confirmação do e-mail de cadastro</li>
                  <li>Aceitação dos termos deste regulamento</li>
                </ul>
                <p><strong>2.3 Limitações:</strong></p>
                <ul>
                  <li>Um cadastro por CPF</li>
                  <li>Dados devem ser verdadeiros e atualizados</li>
                  <li>Vedada a participação de funcionários da empresa promotora e seus familiares</li>
                </ul>
                <p><strong>2.4 Gratuidade:</strong> A participação é totalmente gratuita, não sendo exigida nenhuma compra ou pagamento.</p>
              </div>
            </article>

            <article id="artigo-3" class="article-section">
              <h2 class="article-title">
                <span class="article-number">3.</span>
                Prêmios Oferecidos
              </h2>
              <div class="article-content">
                <p><strong>3.1 Prêmio Principal:</strong></p>
                <ul>
                  <li>1 (um) automóvel 0KM, modelo popular, ano/modelo 2025</li>
                  <li>Valor aproximado: R$ 80.000,00</li>
                </ul>
                <p><strong>3.2 Prêmios Secundários:</strong></p>
                <ul>
                  <li>10 (dez) notebooks de última geração - Valor unitário: R$ 5.000,00</li>
                  <li>50 (cinquenta) smartphones premium - Valor unitário: R$ 2.500,00</li>
                  <li>100 (cem) tablets - Valor unitário: R$ 1.200,00</li>
                  <li>500 (quinhentos) fones de ouvido wireless - Valor unitário: R$ 300,00</li>
                </ul>
                <p><strong>3.3 Valor Total dos Prêmios:</strong> R$ 455.000,00 (quatrocentos e cinquenta e cinco mil reais)</p>
                <p><strong>3.4 Características:</strong> Todos os prêmios são novos, lacrados e acompanhados de garantia do fabricante.</p>
              </div>
            </article>

            <article id="artigo-4" class="article-section">
              <h2 class="article-title">
                <span class="article-number">4.</span>
                Sorteios e Critérios
              </h2>
              <div class="article-content">
                <p><strong>4.1 Datas dos Sorteios:</strong></p>
                <ul>
                  <li>Sorteios mensais: Todo último sábado do mês às 15h</li>
                  <li>Sorteio final (prêmio principal): 31/12/2025 às 20h</li>
                </ul>
                <p><strong>4.2 Local dos Sorteios:</strong> Sede da empresa promotora, com transmissão ao vivo nas redes sociais.</p>
                <p><strong>4.3 Método de Sorteio:</strong> Sistema eletrônico de sorteio auditado por empresa certificada.</p>
                <p><strong>4.4 Critério de Seleção:</strong> Sorteio aleatório entre todos os participantes cadastrados até a data do sorteio.</p>
                <p><strong>4.5 Divulgação:</strong> Resultados publicados no site oficial e redes sociais em até 24 horas após cada sorteio.</p>
              </div>
            </article>

            <article id="artigo-5" class="article-section">
              <h2 class="article-title">
                <span class="article-number">5.</span>
                Entrega dos Prêmios
              </h2>
              <div class="article-content">
                <p><strong>5.1 Comunicação:</strong> Ganhadores serão contactados via telefone e e-mail em até 48 horas após o sorteio.</p>
                <p><strong>5.2 Documentação Necessária:</strong></p>
                <ul>
                  <li>RG e CPF originais</li>
                  <li>Comprovante de residência atualizado</li>
                  <li>Declaração de imposto de renda (se aplicável)</li>
                </ul>
                <p><strong>5.3 Prazo para Retirada:</strong> 90 (noventa) dias corridos a partir da comunicação oficial.</p>
                <p><strong>5.4 Local de Retirada:</strong> Sede da empresa promotora ou locais autorizados, conforme comunicado ao ganhador.</p>
                <p><strong>5.5 Custos:</strong> Todas as despesas de entrega são por conta da empresa promotora.</p>
                <p><strong>5.6 Impossibilidade de Retirada:</strong> Ganhadores que não retirarem seus prêmios no prazo estipulado perderão o direito aos mesmos.</p>
              </div>
            </article>

            <article id="artigo-6" class="article-section">
              <h2 class="article-title">
                <span class="article-number">6.</span>
                Responsabilidades e Limitações
              </h2>
              <div class="article-content">
                <p><strong>6.1 Impostos:</strong> Todos os impostos incidentes sobre os prêmios são de responsabilidade dos ganhadores.</p>
                <p><strong>6.2 Dados Pessoais:</strong> Os participantes autorizam o uso de seus dados para fins da promoção, conforme LGPD.</p>
                <p><strong>6.3 Imagem:</strong> Ganhadores autorizam o uso de sua imagem para divulgação da promoção.</p>
                <p><strong>6.4 Força Maior:</strong> A empresa não se responsabiliza por casos fortuitos ou de força maior.</p>
                <p><strong>6.5 Modificações:</strong> A empresa reserva-se o direito de alterar este regulamento, com ampla divulgação.</p>
                <p><strong>6.6 Cancelamento:</strong> A promoção poderá ser cancelada por motivos legais ou técnicos, com comunicação prévia.</p>
              </div>
            </article>

            <article id="artigo-7" class="article-section">
              <h2 class="article-title">
                <span class="article-number">7.</span>
                Disposições Finais
              </h2>
              <div class="article-content">
                <p><strong>7.1 Legislação:</strong> Esta promoção rege-se pela legislação brasileira vigente.</p>
                <p><strong>7.2 Foro:</strong> Para dirimir quaisquer questões oriundas desta promoção, fica eleito o foro da Comarca de São Paulo/SP.</p>
                <p><strong>7.3 Contato:</strong></p>
                <ul>
                  <li>Site: www.superpromoção2025.com.br</li>
                  <li>E-mail: contato@superpromoção2025.com.br</li>
                  <li>Telefone: 0800-123-4567</li>
                  <li>WhatsApp: (11) 99999-9999</li>
                </ul>
                <p><strong>7.4 Atendimento:</strong> De segunda a sexta, das 9h às 18h.</p>
                <p><strong>7.5 Vigência:</strong> Este regulamento entra em vigor na data de início da promoção.</p>
              </div>
            </article>

            <!-- Assinaturas -->
            <div class="regulamento-footer">
              <div class="signatures">
                <p><strong>São Paulo, 01 de Janeiro de 2025</strong></p>
                <br>
                <div class="signature-block">
                  <p>_______________________________</p>
                  <p><strong>João Silva</strong></p>
                  <p>Diretor Geral - Super Promoção LTDA</p>
                  <p>CNPJ: 12.345.678/0001-90</p>
                </div>
                <br>
                <div class="signature-block">
                  <p>_______________________________</p>
                  <p><strong>Maria Santos</strong></p>
                  <p>Responsável Técnica</p>
                  <p>CRA-SP: 123456</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Função para scroll suave para seções
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerOffset = 120
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Função para imprimir a página
const printPage = () => {
  window.print()
}

// Configurar título da página
onMounted(() => {
  document.title = 'Regulamento - Super Promoção 2025'
})
</script>

<style scoped>
.regulamento-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #e5e7eb 100%);
  position: relative;
}

.regulamento-header {
  position: relative;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #2563eb 100%);
  color: white;
  padding: 4rem 0 6rem;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(30, 58, 138, 0.25);
  margin-bottom: -2rem;
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.header-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 15% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 85% 20%, rgba(255, 255, 255, 0.12) 0%, transparent 45%),
    radial-gradient(circle at 45% 85%, rgba(255, 255, 255, 0.10) 0%, transparent 50%),
    linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%);
}

.header-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
}



.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 3rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  flex: 1;
}

.header-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-ring {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}



.header-icon {
  background: rgba(255, 255, 255, 0.18);
  padding: 1.5rem;
  border-radius: 50%;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
}

.header-icon svg {
  color: rgba(255, 255, 255, 0.9);
  width: 48px;
  height: 48px;
}

.header-text {
  flex: 1;
}

.page-category {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.95);
  padding: 0.6rem 1.25rem;
  border-radius: 25px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 1.25rem;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 3rem;
  font-weight: 900;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #ffffff;
}

.page-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.page-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.08);
  padding: 0.75rem 1.5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  margin-top: 0.5rem;
  display: inline-flex;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-divider {
  opacity: 0.5;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: flex-end;
}

.btn-back,
.btn-print {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 1rem 1.75rem;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  min-width: 180px;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
}

.btn-print svg,
.btn-back .back-icon {
  color: rgba(255, 255, 255, 0.9);
}

.btn-back:hover,
.btn-print:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.btn-back::before,
.btn-print::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transition: left 0.5s;
}

.btn-back:hover::before,
.btn-print:hover::before {
  left: 100%;
}

.btn-print {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}

.back-icon,
.print-icon {
  font-size: 1.1rem;
}

.regulamento-content {
  padding: 5rem 0 3rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  position: relative;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  align-items: start;
}

.regulamento-nav {
  position: sticky;
  top: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.nav-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 1.75rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-icon {
  font-size: 1.4rem;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-title {
  color: white;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.nav-progress {
  height: 4px;
  background: #e2e8f0;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6);
  width: 0%;
  transition: width 0.3s ease;
}

.nav-list {
  list-style: none;
  padding: 1rem 0;
  margin: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
  border-radius: 0 12px 12px 0;
  margin: 0.25rem 0;
}

.nav-link:hover {
  color: #374151;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
  border-left-color: #6366f1;
  transform: translateX(4px);
}

.nav-number {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  color: #6b7280;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.nav-link:hover .nav-number {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-color: #6366f1;
  transform: scale(1.05);
}

.nav-text {
  flex: 1;
  font-size: 0.9rem;
}

.nav-footer {
  padding: 1.75rem 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 0 0 20px 20px;
}

.estimated-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.85rem;
}

.time-icon {
  font-size: 1rem;
}

.regulamento-articles {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(30, 58, 138, 0.1);
}

.article-section {
  padding: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
  border-radius: 20px;
  margin-bottom: 2rem;
  position: relative;
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.article-section:last-child {
  border-bottom: none;
}

.article-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  border-radius: 20px 20px 0 0;
}

.article-title {
  color: #374151;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 2rem 0;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  line-height: 1.2;
}

.article-number {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
}





.article-content {
  line-height: 1.8;
  color: #374151;
  font-size: 1rem;
}

.article-content p {
  margin: 0 0 1.5rem 0;
}

.article-content ul {
  margin: 1rem 0 1.5rem 0;
  padding: 0;
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #3b82f6;
}

.article-content li {
  margin: 0.75rem 0;
  position: relative;
  padding-left: 1.5rem;
  list-style: none;
}

.article-content li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

.article-content strong {
  color: #1e3a8a;
  font-weight: 700;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.regulamento-footer {
  padding: 3rem 2.5rem 2.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.signatures {
  text-align: center;
  color: #374151;
}

.signature-block {
  margin: 2rem 0;
}

.signature-block p {
  margin: 0.25rem 0;
}

/* Responsividade */
@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 260px 1fr;
    gap: 2rem;
  }
  
  .header-content {
    gap: 2rem;
  }
  
  .page-title {
    font-size: 2.25rem;
  }
}

@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .regulamento-nav {
    position: static;
    order: -1;
  }
  
  .header-content {
    gap: 2rem;
  }
  
  .header-left {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .regulamento-header {
    padding: 2rem 0;
  }
  
  .header-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2.5rem;
    justify-items: center;
  }
  
  .header-left {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
  
  .header-actions {
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .article-section {
    padding: 2rem 1.5rem;
  }
  
  .article-title {
    font-size: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .nav-header {
    padding: 1rem 1.5rem;
  }
  
  .nav-link {
    padding: 0.75rem 1.5rem;
  }
  
  .nav-footer {
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .regulamento-content {
    padding: 1.5rem 0;
  }
  
  .article-section {
    padding: 1.5rem 1rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-back,
  .btn-print {
    width: 100%;
  }
  
  .article-content ul {
    padding: 1rem;
  }
  
  .regulamento-footer {
    padding: 2rem 1rem;
  }
  
  .article-number {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
  
  .nav-link {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }
  
  .nav-number {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }
}
</style>