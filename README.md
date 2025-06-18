
## 3. Configuração do GitHub Pages
1. Vá em Settings > Pages
2. Em "Branch", selecione `main` ou `master`
3. Em "Folder", selecione `/ (root)`
4. Clique em "Save"

## 4. Arquivo index.html de exemplo (funcional)
```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao Meu Site!</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Angela Machado</h1>
        <nav>
            <ul>
                <li><a href="#sobre">Sobre mim</a></li>
                <li><a href="#projetos">Projetos</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="sobre">
            <h2>Sobre mim</h2>
            <p>Conteúdo sobre você...</p>
        </section>
        
        <section id="projetos">
            <h2>Projetos no GitHub</h2>
            <p>Lista de projetos...</p>
        </section>
    </main>
    
    <footer>
        <p>© 2023 Angela Machado</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>