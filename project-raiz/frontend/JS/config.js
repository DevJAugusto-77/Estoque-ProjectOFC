// Detecta se estamos em ambiente de desenvolvimento local
const isLocalhost = window.location.hostname === 'localhost' 
    || window.location.hostname === '127.0.0.1';

// Define a URL base da API usada pelo frontend
// - Em localhost aponta para `http://localhost:3000`
// - Em produção usa o domínio do Render (ou do deploy que você configurou)
const API_URL = isLocalhost 
    ? 'http://localhost:3000' 
    : 'https://estoque-projectofc-1.onrender.com';