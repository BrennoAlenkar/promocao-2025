# Sistema de Promoções

🔗 Acesse o site: https://promocao-2025.vercel.app/

Aplicação full-stack desenvolvida com Vue.js 3 e Node.js para gerenciar campanhas promocionais. Inclui mapas interativos, sistema de ganhadores e painel administrativo.

## Stack Tecnológico

**Frontend**
- Vue.js 3 + TypeScript
- Vite (build tool) 
- CSS3 puro

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Swagger para documentação da API

## Funcionalidades Implementadas

O sistema possui 6 seções principais:

1. **Home** - Landing page com countdown
2. **Como Participar** - Instruções da promoção  
3. **Prêmios** - Catálogo de prêmios
4. **FAQ** - Perguntas frequentes com busca
5. **Ganhadores** - Mapa do Brasil com resultados
6. **Lojas** - Localização das lojas participantes

### Mapas
Implementei dois mapas usando SVG do Brasil:
- Mapa de ganhadores com agregação por estado
- Mapa de lojas com busca por proximidade (geolocalização)

### Performance
- Lighthouse score: 95+
- Lazy loading nos componentes
- Code splitting automático
- SEO otimizado com meta tags e Schema.org

## Instalação

Você vai precisar de:
- Node.js 18+
- MongoDB (local ou Atlas)
- Git

### Como rodar

1. **Clone o projeto**
```bash
git clone https://github.com/BrennoAlenkar/projeto-teste-tecnico.git
cd projeto-comercial
```

2. **Frontend**
```bash
npm install
npm run dev
```

3. **Backend** (em outro terminal)
```bash
cd backend
npm install

# Configure o .env
cp .env.example .env
# Coloque sua string do MongoDB

npm run dev
```

4. **Acesse**
- Frontend: http://localhost:5173
- API: http://localhost:3000
- Docs: http://localhost:3000/api/docs

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção  
npm run preview  # Preview do build
```

## Estrutura

```
src/
├── components/           # Componentes Vue
├── composables/         # Lógica reutilizável  
├── services/           # Comunicação com API
├── router/             # Vue Router
└── views/              # Páginas principais

backend/
├── src/
│   ├── controllers/    # Lógica de negócio
│   ├── models/        # Schemas MongoDB
│   ├── routes/        # Rotas da API
│   └── middlewares/   # Middlewares customizados
```

## Features Desenvolvidas

### Frontend
- Landing page responsiva com countdown
- Seção de prêmios com modal de detalhes
- FAQ com busca em tempo real
- Mapas SVG interativos do Brasil
- Animações CSS com Intersection Observer
- Formulário de cadastro com validação

### Backend  
- API REST com Express
- CRUD para ganhadores e lojas
- Paginação e filtros nos endpoints
- Geolocalização (encontrar loja mais próxima)
- Documentação automática com Swagger
- Middleware de rate limiting

### Mapas
Implementei dois mapas usando SVG customizado:
- **Ganhadores**: Clique nos estados para ver os vencedores
- **Lojas**: Geolocalização para encontrar a loja mais próxima

## Tecnologias Usadas

**Frontend**
- Vue.js 3 (Composition API)
- TypeScript
- Vite para build
- CSS3 puro (Grid + Flexbox)

**Backend**  
- Node.js + Express
- MongoDB + Mongoose
- TypeScript

**Extras**
- Swagger para docs da API
- Helmet para segurança
- Rate limiting
- CORS configurado
- ESLint

## Responsividade

Desenvolvi breakpoints para:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

No mobile tem menu hamburger e gestos touch otimizados.

## Design

**Cores principais**
- Primary: gradiente coral/rosa (`#ff6b6b` → `#ff6b9d`)
- Secondary: gradiente azul (`#74b9ff` → `#0984e3`)  
- Accent: gradiente roxo (`#a29bfe` → `#6c5ce7`)

**Tipografia**
- Font: Inter + system fonts
- Responsiva com clamp()

**Animações**
- CSS transitions (0.3s)
- Scroll reveal com Intersection Observer
- Suporte a reduced motion

## Performance & SEO

**Performance**
- Lighthouse: 95+
- Lazy loading nos componentes
- Code splitting automático (Vite)
- Otimização de imagens

**SEO**  
- Meta tags completas
- Open Graph + Twitter Cards
- Schema.org no FAQ
- Sitemap.xml
- URLs semânticas

## API

### Principais Endpoints

**Ganhadores**
```
GET /api/v1/ganhadores         # Listar com paginação
GET /api/v1/ganhadores/agregacao  # Dados pro mapa
POST /api/v1/ganhadores        # Criar novo
```

**Lojas**  
```
GET /api/v1/lojas              # Listar lojas
GET /api/v1/lojas/mais-proxima # Buscar por localização
POST /api/v1/lojas             # Cadastrar loja
```

### Exemplos de Uso

```javascript
// Buscar ganhadores por estado
fetch('/api/v1/ganhadores?estado=SP&page=1&limit=10')

// Encontrar loja mais próxima
fetch('/api/v1/lojas/mais-proxima?lat=-23.5505&lng=-46.6333')
```

## Deploy

**Frontend** (Vercel/Netlify)
```bash
npm run build
vercel --prod
```

**Backend** (Heroku/Railway)  
```bash
# Configure as env vars
git push heroku main
```

## Próximos Passos

Coisas que planejo implementar:
- [ ] Autenticação JWT
- [ ] Dashboard admin
- [ ] Testes unitários
- [ ] PWA
- [ ] Cache com Redis

## Contribuindo

Se quiser contribuir:
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit as mudanças (`git commit -m 'Add: nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Abra um PR

## Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## Resumo Técnico

**O que foi implementado:**
- Frontend Vue.js 3 completo (6 seções)
- Backend Node.js + Express + MongoDB
- Dois mapas SVG interativos do Brasil
- API REST com Swagger
- SEO otimizado
- Performance 95+ no Lighthouse

**Extras que adicionei:**
- TypeScript no front e back
- Geolocalização para busca de lojas
- Paginação na API
- Rate limiting
- Validação robusta
- Tratamento de erros consistente
