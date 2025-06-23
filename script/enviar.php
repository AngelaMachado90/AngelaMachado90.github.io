<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $destinatario = "contato@plugngo.eng.br";
    $assunto = "Novo contato através do site Plug'n Go";
    
    // Coletar dados do formulário
    $segmento = $_POST['segmento'];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $telefone = $_POST['telefone'];
    $empresa = $_POST['empresa'];
    $cnpj = $_POST['cnpj'];
    
    // Montar o corpo do email
    $mensagem = "
    <html>
    <head>
        <title>$assunto</title>
    </head>
    <body>
        <h2>Novo contato recebido:</h2>
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
    
    // Enviar email
    $enviado = mail($destinatario, $assunto, $mensagem, $headers);
    
    // Redirecionar após envio
    if ($enviado) {
        header('Location: obrigado.html');
    } else {
        header('Location: erro.html');
    }
    exit;
}
?>