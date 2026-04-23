document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede a página de recarregar

    // Captura os valores dos inputs do seu index.html
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Envia como 'usuario' e 'senha' para bater com o backend
            body: JSON.stringify({ 
                usuario: usernameInput, 
                senha: passwordInput 
            })
        });

        const data = await response.json();

        if (data.success) {
            // Se o login for bem-sucedido, redireciona para o dashboard
            window.location.href = './frontend/pages/dashboard.html';
        } else {
            // Exibe a mensagem de erro no parágrafo do HTML
            errorMessage.innerText = data.message;
        }
    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err);
        errorMessage.innerText = "Servidor offline ou erro de conexão.";
    }
});