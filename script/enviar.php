<?php
// Verifica se o formulário foi submetido
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Configurações do email
    $destinatario = "contato@plugngo.eng.br";
    $assunto = "Novo contato do site Plug'n GO";
    
    // Coletar e sanitizar os dados do formulário
    $segmento = filter_input(INPUT_POST, 'segmento', FILTER_SANITIZE_STRING);
    $nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $telefone = filter_input(INPUT_POST, 'telefone', FILTER_SANITIZE_STRING);
    $empresa = filter_input(INPUT_POST, 'empresa', FILTER_SANITIZE_STRING);
    $cnpj = filter_input(INPUT_POST, 'cnpj', FILTER_SANITIZE_STRING);
    
    // Validação básica
    if (empty($nome) || empty($email)) {
        header('Location: erro.html?reason=campos-vazios');
        exit;
    }

    // Montar o corpo do email
    $mensagem = "
    <html>
    <head>
        <title>{$assunto}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .dados { margin: 15px 0; }
            .label { font-weight: bold; color: #333; }
        </style>
    </head>
    <body>
        <h2>Novo contato recebido:</h2>
        
        <div class='dados'>
            <span class='label'>Segmento:</span> {$segmento}
        </div>
        
        <div class='dados'>
            <span class='label'>Nome:</span> {$nome}
        </div>
        
        <div class='dados'>
            <span class='label'>Email:</span> {$email}
        </div>
        
        <div class='dados'>
            <span class='label'>Telefone:</span> {$telefone}
        </div>
        
        <div class='dados'>
            <span class='label'>Empresa:</span> {$empresa}
        </div>
        
        <div class='dados'>
            <span class='label'>CNPJ:</span> {$cnpj}
        </div>
    </body>
    </html>
    ";
    
    // Cabeçalhos do email
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: {$nome} <{$email}>\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Tentar enviar o email
    try {
        $enviado = mail($destinatario, $assunto, $mensagem, $headers);
        
        if ($enviado) {
            // Redirecionar para página de sucesso
            header('Location: obrigado.html');
        } else {
            // Registrar erro em log
            error_log("Falha ao enviar email para: {$destinatario}");
            header('Location: erro.html?reason=erro-envio');
        }
    } catch (Exception $e) {
        error_log("Erro no envio de email: " . $e->getMessage());
        header('Location: erro.html?reason=erro-excecao');
    }
    
    exit;
} else {
    // Se alguém tentar acessar diretamente o arquivo
    header('Location: index.html');
    exit;
}
?>