<?php
// Verifica se o formulário foi submetido
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Coletando os dados do formulário
    $segmento = $_POST['segmento'];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $telefone = $_POST['telefone'];
    $empresa = $_POST['empresa'];
    $cnpj = $_POST['cnpj'];
    
    // Destinatário do email (substitua pelo seu email)
    $para = "contato@plugngo.eng.br";
    
    // Assunto do email
    $assunto = "Novo contato do site: $empresa";
    
    // Mensagem do email
    $mensagem = "
    <html>
    <head>
        <title>Novo contato do site</title>
    </head>
    <body>
        <h2>Novo contato recebido</h2>
        <p><strong>Segmento:</strong> $segmento</p>
        <p><strong>Nome:</strong> $nome</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Telefone:</strong> $telefone</p>
        <p><strong>Empresa:</strong> $empresa</p>
        <p><strong>CNPJ:</strong> $cnpj</p>
    </body>
    </html>
    ";
    
    // Cabeçalhos do email
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $nome <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    
    // Enviando o email
    $enviado = mail($para, $assunto, $mensagem, $headers);
    
    // Verificando se o email foi enviado
    if ($enviado) {
        // Redireciona para uma página de sucesso
        header('Location: obrigado.html');
    } else {
        // Redireciona para uma página de erro
        header('Location: erro.html');
    }
} else {
    // Se não foi submetido via POST, redireciona
    header('Location: index.html');
}
?>