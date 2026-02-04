# KoddaHub Portfolio

Portfólio empresarial completo para expor soluções web segmentadas por tipo de negócio.

## Descrição do Projeto

KoddaHub é um site de portfólio moderno e responsivo que apresenta cinco tipos de soluções web:

- **Site Institucional** - Para ONGs, escolas, clínicas e associações
- **E-commerce** - Lojas virtuais completas e integradas
- **Site Industrial** - Para fábricas e fornecedores B2B
- **Site de Serviços** - Para consultorias e profissionais liberais
- **Sistemas Empresariais** - CRM, controle de estoque e soluções customizadas

## Público-Alvo

Empresas buscando presença digital profissional ou sistemas de gestão personalizados.

## Tecnologias Utilizadas

- **HTML5** - Semântico e acessível
- **CSS3** - Flexbox, Grid, responsivo
- **JavaScript** - Vanilla JS com módulos ES6
- **Font Awesome 6** - Ícones profissionais
- **Google Maps API** - Integração de mapas
- **Formspree** - Gerenciamento de formulários estáticos
- **GitHub Pages** - Hospedagem e deployment

## 📁 Estrutura do Projeto

```
sitebase/
├── index.html                 # Home page principal
├── css/
    ├── reset.css          # Reset global
    ├── variables.css      # Variáveis e paleta KoddaHub
    ├── base.css           # Estilos base e tipografia
    ├── layout.css         # Sistema de grid e containers
    ├── utilities.css      # Classes utilitárias
    ├── components.css     # Componentes reutilizáveis
    ├── modern.css         # Estilos modernos específicos
    ├── responsive.css     # Media queries e responsividade
    └── print.css          # Estilos de impressão
├── js/
│   ├── main.js               # Funcionalidades principais
│   ├── navigation.js         # Menu móvel e navegação
│   ├── form-handler.js       # Validação e envio de formulários
│   └── price-calculator.js   # Calculadora dinâmica de preços
├── pages/
│   ├── institucional.html    # Página de Sites Institucionais
│   ├── ecommerce.html        # Página de E-commerce
│   ├── industrial.html       # Página de Sites Industriais
│   ├── servicos.html         # Página de Sites de Serviços
│   └── sistemas.html         # Página de Sistemas Empresariais
├── images/
│   ├── logos/                # Logotipos
│   ├── icons/                # Ícones específicos
│   ├── screenshots/          # Screenshots dos projetos
│   └── backgrounds/          # Imagens de fundo
├── assets/
│   ├── pdfs/                 # Documentos PDF
│   └── fonts/                # Fontes customizadas
├── README.md                 # Este arquivo
├── .gitignore               # Git ignore rules
└── CNAME                    # Para GitHub Pages customizado

```

## 🎨 Paleta de Cores

| Cor | Código | Uso |
|-----|--------|-----|
| Primary | `#2C3E50` | Textos principais, backgrounds |
| Secondary | `#3498DB` | Botões, destaque |
| Accent | `#E74C3C` | CTAs, alertas |
| Success | `#27AE60` | Mensagens de sucesso |
| Light | `#ECF0F1` | Backgrounds alternativos |
| Dark | `#1A252F` | Textos escuros |
| Purple | `#8E44AD` | Sistemas |

## 📱 Breakpoints Responsivos

- **Mobile**: 320px
- **Tablet**: 768px
- **Desktop**: 1024px
- **Large Desktop**: 1440px

## ⚙️ Como Usar

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/sitebase.git
cd sitebase
```

### 2. Visualizar Localmente

Abra o arquivo `index.html` em um navegador moderno ou use um servidor local:

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (http-server)
npx http-server
```

Acesse `http://localhost:8000` no navegador.

### 3. Configurar Formspree

1. Acesse [formspree.io](https://formspree.io)
2. Crie uma conta e um novo formulário
3. Copie o ID do formulário
4. Atualize o valor `formAction` em `js/form-handler.js`

```javascript
const formAction = 'https://formspree.io/f/SEU_FORM_ID';
```

### 4. Deploy no GitHub Pages

1. Crie um repositório no GitHub
2. Configure no branch `gh-pages` ou use `main` branch
3. Acesse as settings e ative GitHub Pages
4. Seu site estará disponível em `https://seu-usuario.github.io/sitebase`

## 🚀 Recursos Implementados

### Home Page
- ✅ Hero section com CTA
- ✅ Grid de 4 soluções com cards interativos
- ✅ Seção de diferenciais com 6 features
- ✅ Destaque para sistemas empresariais
- ✅ Formulário de contato funcional
- ✅ Footer com links e redes sociais

### Páginas de Soluções
- ✅ Hero com branding specific
- ✅ Funcionalidades padrão incluídas
- ✅ Pricing com badge destacado
- ✅ Funcionalidades Plus opcionais
- ✅ CTA para orçamento
- ✅ Breadcrumb navigation

### JavaScript
- ✅ Menu responsivo mobile
- ✅ Scroll smooth
- ✅ Animações ao scroll
- ✅ Validação de formulário
- ✅ Integração com Formspree
- ✅ Calculadora de preços dinâmica

## 📊 Preços Base

| Solução | Preço | Suporte Mensal |
|---------|-------|----------------|
| Site Institucional | R$ 2.500,00 | R$ 199,00 |
| E-commerce | R$ 4.800,00 | R$ 299,00 |
| Site Industrial | R$ 3.800,00 | R$ 249,00 |
| Site de Serviços | R$ 2.800,00 | R$ 179,00 |
| CRM Básico | R$ 6.500,00 | R$ 399,00+ |
| Controle de Estoque | R$ 5.200,00 | R$ 399,00+ |
| Sistema Completo | R$ 8.000,00 | R$ 399,00+ |

## 🔐 Segurança

- ✅ SSL/TLS automático via GitHub Pages
- ✅ Formulários via Formspree (sem armazenamento no servidor)
- ✅ Validação client-side e server-side
- ✅ Sem dependências externas críticas

## ♿ Acessibilidade

- ✅ HTML5 semântico
- ✅ ARIA labels adequados
- ✅ Contraste de cores WCAG AA
- ✅ Navegação por teclado
- ✅ Suporte a leitores de tela

## 📈 SEO

- ✅ Meta tags descritivas
- ✅ Estrutura semântica HTML
- ✅ URLs amigáveis
- ✅ Open Graph tags
- ✅ Robots.txt (se necessário)

## 🔄 Integração com APIs

### Google Maps
Para adicionar mapa interativo:

```javascript
const map = new google.maps.Map(document.getElementById('map'), {
  zoom: 15,
  center: { lat: -23.5505, lng: -46.6333 }
});
```

### Formspree
Formulário automaticamente integrado. Configure o ID do formulário em `js/form-handler.js`.

## 📦 Customizações Recomendadas

1. **Logos e Imagens**: Substitua em `images/` com suas próprias imagens
2. **Cores**: Atualize as variáveis CSS em `css/main.css`
3. **Conteúdo**: Edite textos em cada página HTML
4. **Fontes**: Customize em `assets/fonts/`
5. **Redes Sociais**: Atualize URLs no footer

## 🐛 Troubleshooting

### Formulário não envia
- Verifique o Form ID do Formspree em `js/form-handler.js`
- Confirme que o e-mail foi verificado no Formspree
- Verifique o console (F12) para erros

### Menu mobile não funciona
- Verifique se `js/navigation.js` está carregado
- Confirme que o HTML tem IDs corretos (`id="mobileMenuBtn"`)

### Imagens não carregam
- Verifique os caminhos relativos em `pages/*.html`
- Use paths como `../images/` para arquivos em subdiretórios

## 📄 Licença

Este projeto está disponível para uso comercial e pessoal.

## 👥 Autor

**KoddaHub** - Soluções Web Profissionais

- Email: angelamachado02022@gmail.com
- Telefone: (41) 9227-2854
- Localização: Curitiba

## 🤝 Contribuições

Para reportar bugs ou sugerir melhorias, entre em contato conosco.

## 📅 Histórico de Atualizações

### v1.0.0 (2024-02-03)
- ✨ Lançamento inicial
- 🎨 Design system completo
- 📱 Responsividade total
- 🚀 5 páginas de soluções
- 📝 Documentação completa

---

**Desenvolvido com ❤️ para empresas que querem presença digital profissional**

🎨 Paleta de Cores para o Site KoddaHub
Nome da Cor	Hexadecimal	Uso Sugerido
Laranja Vibrante	#F57C00	Destaques, botões principais, ícones
Preto Profundo	#212121	Fundo, texto principal, cabeçalhos
Cinza Circuito	#9E9E9E	Bordas, divisores, texto secundário
Azul Elétrico	#2196F3	Links, detalhes interativos, hover
Branco Neutro	#FAFAFA	Fundo de seções, contraste com preto
Sugestão de Combinações
Fundo escuro com texto branco e laranja para contraste forte e moderno.

Botões azuis com hover em laranja para chamar atenção.

Elementos de interface como cards ou menus com cinza claro e bordas sutis.


# TO DO

1. Estrutura HTML Semântica e Acessível
Seu site usa muitas <div> e <section>. Boas práticas:

Substitua <div> por tags semânticas: <header>, <main>, <footer>, <article>, <nav>.

Use <button> para elementos clicáveis (como os cards de serviços), não apenas <div>. Isso melhora a navegação por teclado e leitores de tela.

Defina uma hierarquia de cabeçalhos (<h1> a <h6>) lógica. O <h1> deve ser o título principal da página. Você tem vários <h1>; idealmente, deve ter apenas um por página

2. Estilização CSS Moderna e Organizada
CSS Resett/Normalize: Comece com um reset CSS (como o do Eric Meyer) para garantir consistência visual entre navegadores.

Metodologia (ex: BEM): Organize suas classes. Exemplo: .card, .card--service, .card__title, .card__description. Isso evita conflitos e facilita manutenção.

Variáveis CSS: Defina cores, fontes e espaçamentos como variáveis (:root { --cor-primaria: #0056b3; }). Facilita mudanças e garante consistência.

Mobile First: Comece estilizando para telas pequenas e use @media (min-width: ...) para telas maiores. Isso melhora performance e UX.

3. Interatividade com JavaScript Limpo
O formulário parece ser um ponto focal, mas há espaço para evolução:

Validação no Lado do Cliente: Implemente validação dos campos (email, campos obrigatórios) antes de enviar, com feedback visual claro.

Mensagens de Status Dinâmicas: Altere o texto do botão para "Enviando..." durante o envio e dê confirmação visual/verbal do sucesso ou erro.

Código Modular: Separe seu JavaScript em funções com responsabilidades únicas. Ex: validarFormulario(), enviarDados(), mostrarMensagem().

4. Performance Otimização (Onde Brilha um Dev)
Imagens: Comprima todas as imagens (use ferramentas como Squoosh ou ImageOptim). Use formatos modernos (WebP) com fallback.

Lazy Loading: Adicione loading="lazy" às imagens fora da tela inicial. Isso acelera o carregamento inicial.

Fontes Web: Otimize fontes carregadas do Google Fonts (use o parâmetro &display=swap).

Minificação: No deploy, use ferramentas para minificar HTML, CSS e JS.

🚀 Próximos Passos e Projeto de Melhoria
Para colocar isso em prática, sugiro um pequeno projeto guiado:

Refatore o Cabeçalho (<header>): Substitua as divs por <header>, <nav>, <ul> e <li>.

Crie um Card de Serviço Semântico: Escolha um dos serviços e recrie-o usando <article>, um <button> verdadeiro e classes CSS seguindo BEM.

Implemente Validação de Formulário: Adicione validação em tempo real ao campo de email e aos campos obrigatórios.

Este é um excelente trabalho inicial. A jornada de refatoração para aplicar essas práticas é o que vai realmente destacar suas habilidades técnicas para recrutadores e clientes.