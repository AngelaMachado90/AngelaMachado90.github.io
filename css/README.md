# Arquitetura CSS - KoddaHub

    Utilizamos para desenvolver este uma metodologia DRY, abaixo será explicado melhor como foi feito.

## Estrutura de Arquivos

├── README.md # Esta documentação
├── main.css # Ponto de entrada principal
├── reset.css # Reset global de estilos
├── variables.css # Design tokens (cores, espaçamento, etc.)
├── base.css # Estilos base para elementos HTML
├── components/ # Componentes reutilizáveis
│ ├── _cards.css # Cards (depende: variables, animations)
│ ├── _buttons.css # Botões (depende: variables)
│ └── _index.css # Importa todos componentes
├── layouts/ # Layouts específicos de páginas
│ ├── _hero.css # Hero da home (depende: components/_cards.css)
│ ├── _solutions.css # Seção soluções
│ └── _index.css # Importa todos layouts
├── utilities.css # Classes utilitárias (helpers)
├── animations.css # Animações e keyframes
└── responsive.css # Media queries responsivas


## Ordem de Carregamento (CRÍTICO)

1. **reset.css** - Normaliza navegadores
2. **variables.css** - Define variáveis CSS
3. **base.css** - Estilos elementares
4. **components/** - Componentes reutilizáveis
5. **layouts/** - Layouts específicos
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
| components/_cards.css | variables.css, animations.css | layouts/_hero.css |
| layouts/_hero.css | components/_cards.css | main.css |
| animations.css | variables.css | components/_cards.css |

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
css/components/                  → COMPONENTS
css/layouts/                     → OBJECTS (layout patterns)
css/utilities.css                → UTILITIES
css/animations.css               → TOOLS (animações)
css/responsive.css               → (cross-layer)