# Arquitetura CSS - KoddaHub

Base CSS modular para facilitar manutenção e reduzir regressões.

## Estrutura Atual

- `main.css` → ponto de entrada global da home (`index.html`)
- `base/` → tokens, reset e tipografia base
- `components/` → componentes reutilizáveis (botões, cards, navbar, footer, cta, hero-carousel)
- `layouts/` → seções estruturais (hero, sections, contact)
- `utilities/` → utilitários e helpers (`utilities.css`, `cookie-consent.css`, `floating-actions.css`, `gallery.css`)
- `demos/` → CSS dedicado para cada página demo
- `animations.css` e `responsive.css` → animações e responsividade global
- `kodassauro.css` → chatbot

## Ordem de Importação (main.css)

1. `base/variables.css`
2. `base/reset.css`
3. `base/typography.css`
4. `components/*`
5. `layouts/*`
6. `utilities/*`
7. `animations.css`
8. `responsive.css`
9. `kodassauro.css`

## Observações

- Demos não dependem de `main.css`; cada demo carrega seu CSS próprio em `css/demos/`.
- Arquivos legados removidos nesta limpeza:
  - `css/components.css`
  - `css/gallery.css`
  - `css/floating-actions.css`
  - `css/demos/_shared-demo-styles.css`

## Mapa de Dependências

Consulte `doc/css-dependency-map.md` para o mapa HTML → CSS atualizado.
