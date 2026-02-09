# Arquitetura CSS - KoddaHub

Utilizamos uma base modular com tokens, base styles, componentes, utilitários e layouts. A prioridade é manter a cascata previsível e evitar duplicação.

## Estrutura de Arquivos

├── README.md # Esta documentação
├── reset.css # Reset global de estilos
├── variables.css # Design tokens (cores, espaçamento, etc.)
├── base.css # Estilos base para elementos HTML
├── components.css # Componentes reutilizáveis globais
├── main.css # Layouts e seções principais do site
├── kodassauro.css # Chatbot local (UI)
├── floating-actions.css # Ações flutuantes (WhatsApp, etc.)
├── demo-shell.css # Camada de marca para demos
├── demos/ # CSS das demos (extraído do HTML)
├── utilities.css # Classes utilitárias (helpers)
├── animations.css # Animações e keyframes
└── responsive.css # Media queries responsivas


## Ordem de Carregamento (CRÍTICO)

1. **reset.css** - Normaliza navegadores
2. **variables.css** - Define variáveis CSS
3. **base.css** - Estilos elementares
4. **components.css** - Componentes reutilizáveis
5. **main.css** - Layouts e seções
6. **utilities.css** - Classes helpers
7. **animations.css** - Animações
8. **responsive.css** - Responsividade

## Convenções de Nomenclatura (BEM Modificado)

- `.card` - Bloco
- `.card__title` - Elemento
- `.card--floating` - Modificador
- `.card--floating:hover` - Estado

## Dependências Entre Arquivos

| Arquivo | Depende de | Fornece para |
|---------|------------|--------------|
| variables.css | Nenhuma | TODOS os arquivos |
| components.css | variables.css | main.css |
| utilities.css | variables.css | main.css |
| animations.css | variables.css | main.css |

## Como Adicionar Novo Componente

1. Crie `components/_novo-componente.css`
2. Adicione em `components/_index.css`
3. Documente dependências no topo do arquivo
4. Use variáveis do `variables.css`


SEU PROJETO KODDAHUB              ≈ ITCSS
─────────────────────────────────────────────────
css/reset.css                    → GENERIC
css/variables.css                → SETTINGS
css/base.css                     → ELEMENTS
css/components.css               → COMPONENTS
css/main.css                     → OBJECTS (layout patterns)
css/utilities.css                → UTILITIES
css/animations.css               → TOOLS (animações)
css/responsive.css               → (cross-layer)
