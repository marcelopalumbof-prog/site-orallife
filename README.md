# Clínica Oral Life — Site institucional

Site de uma página (one-page) para a **Clínica Oral Life – Odontologia Especializada**,
em São Cristóvão, Salvador/BA. Feito em HTML, CSS e JavaScript puros — **sem build, sem
dependências, sem framework**. É só abrir o `index.html`.

O objetivo do site é um só: **levar o visitante a agendar pelo WhatsApp.**
Há 17 pontos de contato que abrem o WhatsApp em `(71) 99726-6122`.

---

## Como rodar

**Opção 1 — abrir direto (mais simples)**
Dê duplo clique em `index.html`.

**Opção 2 — servidor local (recomendado para testar)**
```bash
# dentro da pasta do site
python -m http.server 8000
# depois abra http://localhost:8000
```
> O servidor local é recomendado porque o mapa do Google e as fontes podem ser
> bloqueados ao abrir via `file://` em alguns navegadores.

**Publicar:** envie a pasta inteira para qualquer hospedagem estática
(Netlify, Vercel, GitHub Pages, Hostinger, HostGator…). Não há etapa de compilação.

---

## Estrutura de arquivos

```
Site OralLife/
├── index.html              ← todo o conteúdo (textos, seções, SVGs)
├── PENDENCIAS.md           ← o que falta preencher (leia este!)
├── README.md               ← este arquivo
├── robots.txt              ← indexação por buscadores
└── assets/
    ├── css/
    │   └── styles.css      ← tokens de design + todos os componentes
    ├── js/
    │   ├── main.js         ← navbar, drawer, carrossel, formulário, convênios
    │   ├── animations.js   ← animações de rolagem (GSAP + ScrollTrigger)
    │   └── vendor/
    │       ├── gsap.min.js         ← GSAP 3.13 (local, ~71 KB)
    │       └── ScrollTrigger.min.js ← plugin de rolagem (~43 KB)
    └── img/
        ├── LEIA-ME.txt     ← onde cada foto aparece + como trocar
        ├── favicon.svg
        └── *.jpg           ← fotos da clínica (etapas, recepção, sorriso, consultórios)
```

---

## Tokens de design

Todas as cores, raios, espaçamentos e fontes ficam em **variáveis CSS** no topo de
`assets/css/styles.css` (bloco `:root`). Mudar a identidade visual = mudar ali.

| Grupo | Exemplos |
|---|---|
| Cores | `--navy-900`, `--ink-950`, `--navy-bg`, `--blue-glow`, `--whatsapp` |
| Superfícies | `--surface-page` → `--surface-panel` → `--surface-card` → `--white` |
| Raios | `--r-pill` 999px · `--r-card` 20px · `--r-panel` 24px · `--r-frame` 32px |
| Espaçamento | `--s-1` 4px → `--s-9` 120px (escala 4/8) |
| Fontes | `--font-display` (Space Grotesk) · `--font-sans` (Inter) |
| Movimento | `--ease-out`, `--t-fast` 200ms, `--t-mid` 280ms |

**Princípios aplicados**
1. Superfícies azul-gelo separadas por **bordas de 1px**, nunca por sombras
   (a única exceção é o botão flutuante de WhatsApp, que precisa se destacar).
2. Títulos enormes (até 64px) contra textos de apoio pequenos (13–15px).
3. Tudo que é clicável é pílula, quase sempre com um círculo navy e seta ↖↗.
4. Toda fotografia recebe color grading azul frio via CSS (`filter` + gradientes).
5. Um único acento forte (navy `#0B1F4D`), usado com parcimônia.
6. Sem promessas de resultado, sem preços e sem dados inventados (normas do CFO).

---

## Seções da página

| # | Seção | Destaques |
|---|---|---|
| 1 | **Hero** | Moldura arredondada, navbar pílula flutuante, faixa de nota no rodapé |
| 2 | **Nossos Tratamentos** | Grade 3×3 com 7 cards + 2 cards decorativos (posições 2 e 6) |
| 3 | **Como funciona** | Painel com marca d'água, carrossel de 3 etapas |
| 4 | **Como agendar** | Imagem grande + 4 passos + CTA |
| 5 | **Convênios** | Grade de planos (editável em `main.js`) |
| 6 | **Equipe** | 3 cartões com foto, nome, CRO e especialidades |
| 7 | **Depoimentos** | Nota 4,4 / 71 avaliações + 2 comentários reais do Google |
| 8 | **Contato** | CTA navy, endereço, telefone, mapa, formulário de retorno |

---

## O que o JavaScript faz

### `assets/js/animations.js` — animações de rolagem (GSAP)

- **Entradas** — cada `.reveal` sobe e aparece ao entrar na tela, em cascata
- **Hero** — zoom e parallax lentos enquanto o banner sai da tela
- **Marca d'água** — arcadas e ilustrações derivam suavemente ao rolar
- **Fotos grandes** — “respiram” (zoom lento) ao passar pela tela
- **Micro-detalhes** — estrelas da nota e números das etapas entram em sequência
- **Robustez** — `end: 'max'` + rede de segurança: nada fica invisível se o
  usuário saltar a rolagem (âncora, Page Down, posição restaurada)
- **Acessibilidade** — tudo via `gsap.matchMedia('(prefers-reduced-motion:
  no-preference)')`: com “reduzir movimento” ativo, nenhuma animação roda
- **Sem risco** — se o GSAP não carregar, o sistema de entrada padrão do
  `main.js` assume sozinho

Os arquivos do GSAP ficam **locais** (`assets/js/vendor/`), sem CDN no ar.

### `assets/js/main.js` — interações

- **Navbar** — vira branca sólida com blur ao rolar + destaca o link da seção visível
- **Drawer mobile** — tela cheia, trava o scroll, fecha com `Esc`, prende o foco
- **Disclosure “O que inclui”** — abre/fecha com animação suave de altura
- **Carrossel** — setas, swipe, teclado ← →, setas desabilitadas nos limites
- **Fade-up** — revela elementos ao entrarem na viewport (com rede de segurança)
- **Formulário** — valida nome e telefone e abre o WhatsApp com a mensagem preenchida
- **Convênios** — monta a lista a partir do array `CONVENIOS`

### Links rápidos para editar

```js
// assets/js/main.js
var WHATSAPP_PHONE = '5571997266122';       // número do WhatsApp
var CONVENIOS = [ /* 'Nome do plano', */ ]; // convênios aceitos
```

```html
<!-- index.html — o texto de cada card de tratamento -->
<div class="disclosure__panel" id="inc-implante"> ... </div>
```

---

## Acessibilidade e SEO

- Lighthouse: **Acessibilidade 100 · Boas práticas 100 · SEO 100**
- Contraste AA em todo o texto (tokens ajustados para ≥ 4.5:1 sobre o azul-gelo)
- HTML semântico, um único `<h1>`, hierarquia de headings correta
- Navegação completa por teclado, foco visível (anel azul de 2px), `skip link`
- Imagens com `alt` descritivo, `loading="lazy"` e dimensões declaradas
- Respeita `prefers-reduced-motion` e tem estilo de impressão
- Meta tags, Open Graph e **JSON-LD tipo `Dentist`** (endereço, telefone, serviços
  e `aggregateRating` 4,4 / 71)

---

## Suporte de navegadores

Chrome, Edge, Firefox, Safari e navegadores móveis (iOS 15+ / Android 8+).
Recursos opcionais degradam com elegância: `IntersectionObserver`, `ResizeObserver`
e `inert` têm caminhos alternativos.

---

## Antes de publicar

Leia o **`PENDENCIAS.md`**. Os itens que dependem da clínica (horários, convênios,
equipe, responsável técnico e fotos) estão listados lá com o caminho exato de cada
edição.
