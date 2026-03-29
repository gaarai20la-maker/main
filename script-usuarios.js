// ===== FUNÇÕES DE AUTENTICAÇÃO =====

// Alternar para formulário de cadastro
function mostrarCadastro() {
  document.getElementById("login-form").classList.add("form-hidden");
  document.getElementById("cadastro-form").classList.remove("form-hidden");
  document.getElementById("login-error").textContent = "";
}

// Alternar para formulário de login
function mostrarLogin() {
  document.getElementById("cadastro-form").classList.add("form-hidden");
  document.getElementById("login-form").classList.remove("form-hidden");
  document.getElementById("cadastro-error").textContent = "";
  document.getElementById("cadastro-success").textContent = "";
}

// Fazer cadastro
function fazerCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById("cadastro-nome").value;
  const email = document.getElementById("cadastro-email").value;
  const telefone = document.getElementById("cadastro-telefone").value;
  const endereco = document.getElementById("cadastro-endereco").value;
  const senha = document.getElementById("cadastro-senha").value;
  const confirmarSenha = document.getElementById("cadastro-confirmar-senha").value;

  const errorDiv = document.getElementById("cadastro-error");
  const successDiv = document.getElementById("cadastro-success");

  errorDiv.textContent = "";
  successDiv.textContent = "";

  // Validação
  if (senha !== confirmarSenha) {
    errorDiv.textContent = "As senhas não coincidem!";
    return;
  }

  if (senha.length < 6) {
    errorDiv.textContent = "A senha deve ter no mínimo 6 caracteres!";
    return;
  }

  // Verificar se email já existe
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (usuarios.some(u => u.email === email)) {
    errorDiv.textContent = "Email já cadastrado!";
    return;
  }

  // Criar novo usuário
  const novoUsuario = {
    id: Date.now(),
    nome: nome,
    email: email,
    telefone: telefone,
    endereco: endereco,
    senha: senha,
    dataCadastro: new Date().toLocaleDateString("pt-BR"),
    pedidos: []
  };

  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  successDiv.textContent = "Cadastro realizado com sucesso! Faça login para continuar.";
  
  // Limpar formulário
  document.getElementById("cadastro-form").reset();
  
  // Voltar para login após 2 segundos
  setTimeout(() => {
    mostrarLogin();
  }, 2000);
}

// Fazer login
function fazerLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;
  const errorDiv = document.getElementById("login-error");

  errorDiv.textContent = "";

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (!usuario) {
    errorDiv.textContent = "Email ou senha incorretos!";
    return;
  }

  // Salvar usuário logado
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  
  // Redirecionar para home
  window.location.href = "index.html";
}

// Fazer logout
function fazerLogout() {
  if (confirm("Tem certeza que deseja sair?")) {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  }
}

// Verificar se usuário está logado
function verificarLogin() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  return usuarioLogado ? JSON.parse(usuarioLogado) : null;
}

// Redirecionar para login se não estiver autenticado (para página de perfil)
function verificarAutenticacao() {
  const usuario = verificarLogin();
  if (!usuario && window.location.pathname.includes("perfil.html")) {
    window.location.href = "usuarios.html";
  }
}

// Carregar dados do perfil
function carregarPerfil() {
  const usuario = verificarLogin();
  
  if (!usuario) {
    window.location.href = "usuarios.html";
    return;
  }

  document.getElementById("perfil-nome").textContent = usuario.nome;
  document.getElementById("perfil-email").textContent = usuario.email;
  document.getElementById("perfil-telefone").textContent = usuario.telefone || "Não informado";
  document.getElementById("perfil-endereco").textContent = usuario.endereco || "Não informado";
  document.getElementById("perfil-data").textContent = usuario.dataCadastro;

  // Carregar pedidos
  carregarPedidos(usuario);
}

// Carregar pedidos do usuário
function carregarPedidos(usuario) {
  const pedidosList = document.getElementById("pedidos-lista");
  
  if (usuario.pedidos && usuario.pedidos.length > 0) {
    pedidosList.innerHTML = usuario.pedidos.map(pedido => `
      <div class="pedido-item">
        <p><strong>Pedido #${String(pedido.id).substring(0, 8)}</strong></p>
        <p>Data: ${pedido.data}</p>
        <p>Total: R$ ${pedido.total}</p>
        <p>Status: ${pedido.status}</p>
      </div>
    `).join("");
  } else {
    pedidosList.innerHTML = "<p style='color: #999; text-align: center;'>Nenhum pedido realizado ainda.</p>";
  }
}

// Editar perfil (função básica)
function editarPerfil() {
  alert("Funcionalidade de edição em desenvolvimento!");
}

// Atualizar header com informações do usuário
function atualizarHeaderUsuario() {
  const usuario = verificarLogin();
  const header = document.querySelector("header");
  
  if (!header) return;

  // Verificar se já existe container de usuário
  let userContainer = header.querySelector(".user-info-container");
  
  if (usuario) {
    if (!userContainer) {
      userContainer = document.createElement("div");
      userContainer.className = "user-info-container";
      header.querySelector(".header-top").appendChild(userContainer);
    }
    
    userContainer.innerHTML = `
      <div class="user-info">
        <span style="color: white; font-weight: bold;">Olá, ${usuario.nome.split(" ")[0]}!</span>
        <button onclick="window.location.href='perfil.html'" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 10px;">👤 Perfil</button>
      </div>
    `;
  } else {
    if (userContainer) {
      userContainer.remove();
    }
  }
}

// Adicionar pedido ao histórico do usuário
function adicionarPedidoAoUsuario(total) {
  const usuario = verificarLogin();
  
  if (!usuario) return;

  const novoPedido = {
    id: Date.now(),
    data: new Date().toLocaleDateString("pt-BR"),
    total: total.toFixed(2),
    status: "Entregando"
  };

  // Atualizar usuário com novo pedido
  usuario.pedidos = usuario.pedidos || [];
  usuario.pedidos.push(novoPedido);

  // Atualizar no localStorage
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const index = usuarios.findIndex(u => u.id === usuario.id);
  if (index !== -1) {
    usuarios[index] = usuario;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  }
}

// Inicializar ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  atualizarHeaderUsuario();
  verificarAutenticacao();
  
  // Se está na página de perfil, carregar dados
  if (window.location.pathname.includes("perfil.html")) {
    carregarPerfil();
  }

  // Atualizar contador do carrinho
  function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const carrinhoIcon = document.querySelector(".carrinho-icon");
    if (carrinhoIcon) {
      carrinhoIcon.textContent = "🛒";
      if (totalItens > 0) {
        carrinhoIcon.setAttribute('data-count', totalItens);
      } else {
        carrinhoIcon.removeAttribute('data-count');
      }
    }
  }

  atualizarContadorCarrinho();
});