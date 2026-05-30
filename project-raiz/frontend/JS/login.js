document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                usuario: usernameInput, 
                senha: passwordInput 
            })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = './project-raiz/frontend/pages/dashboard.html';
        } else {
            errorMessage.innerText = data.message;
        }
    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err);
        errorMessage.innerText = "Servidor offline ou erro de conexão.";
    }
});