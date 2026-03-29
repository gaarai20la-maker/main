let produtosGlobal = [];

async function carregarProdutos() {
  try {
    const resposta = await fetch("./produtos.json");
    if (!resposta.ok) {
      throw new Error(`HTTP error! status: ${resposta.status}`);
    }
    const produtos = await resposta.json();
    produtosGlobal = produtos;

    const container = document.getElementById("lista-produtos");
    container.innerHTML = "";

    produtos.forEach(produto => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.categoria = produto.categoria;
      card.dataset.preco = produto.preco.replace(",", ".");

      const estrelas = "⭐".repeat(Math.floor(produto.avaliacao)) + (produto.avaliacao % 1 !== 0 ? "✨" : "");

      // Verifica se está nos favoritos
      const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
      const isFavorito = favoritos.some(fav => fav.id === produto.id);

      card.innerHTML = `
        <div class="card-badge">Oferta</div>
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
        <h4>${produto.nome}</h4>
        <div class="card-preco">R$ ${produto.preco}</div>
        <div class="card-parcelas">ou ${produto.parcelas}</div>
        <div class="card-estrelas">${estrelas}</div>
        <div class="card-actions">
          <button class="btn-favorito ${isFavorito ? 'ativo' : ''}" data-id="${produto.id}">❤️</button>
          <button class="btn-comprar" data-id="${produto.id}">Adicionar ao Carrinho</button>
        </div>
      `;

      // Evento para clicar no card (ir para detalhes)
      card.addEventListener("click", (e) => {
        // Evitar se clicou em botão
        if (e.target.tagName === 'BUTTON') return;
        localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
        window.location.href = "produto.html";
      });

      // Evento para adicionar ao carrinho
      card.querySelector(".btn-comprar").addEventListener("click", (e) => {
        e.stopPropagation();
        adicionarAoCarrinho(produto);
      });

      // Evento para favorito
      card.querySelector(".btn-favorito").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorito(produto);
        e.target.classList.toggle("ativo");
      });

      container.appendChild(card);
    });
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    // Mostrar erro na tela
    const container = document.getElementById("lista-produtos");
    container.innerHTML = `<p style="color: red; text-align: center;">Erro ao carregar produtos: ${erro.message}</p>`;
  }
}

// Função para adicionar/remover dos favoritos
function toggleFavorito(produto) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const index = favoritos.findIndex(fav => fav.id === produto.id);
  
  if (index > -1) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push(produto);
  }
  
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const produtoExistente = carrinho.find(item => item.id === produto.id);
  
  if (produtoExistente) {
    produtoExistente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

// Função para atualizar contador do carrinho
function atualizarContadorCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
  const carrinhoIcon = document.querySelector(".carrinho-icon");
  carrinhoIcon.textContent = "🛒";
  if (totalItens > 0) {
    carrinhoIcon.setAttribute('data-count', totalItens);
  } else {
    carrinhoIcon.removeAttribute('data-count');
  }
}

// Função para mostrar mensagem de funcionalidade em processo
function mostrarEmProcesso() {
  alert("⏳ Em Processo de Implementação\n\nEsta funcionalidade em breve estará disponível!");
}

// Carregar produtos ao abrir a página
carregarProdutos();

// Busca de produtos
document.getElementById("search").addEventListener("input", (e) => {
  filtrarProdutos();
});

// Filtros
document.getElementById("filter-categoria").addEventListener("change", (e) => {
  filtrosAtivos.categoria = e.target.value;
  filtrarProdutos();
});

document.getElementById("filter-preco-min").addEventListener("input", (e) => {
  filtrosAtivos.precoMin = e.target.value;
  filtrarProdutos();
});

document.getElementById("filter-preco-max").addEventListener("input", (e) => {
  filtrosAtivos.precoMax = e.target.value;
  filtrarProdutos();
});

document.getElementById("btn-limpar-filtros").addEventListener("click", () => {
  document.getElementById("search").value = "";
  document.getElementById("filter-categoria").value = "";
  document.getElementById("filter-preco-min").value = "";
  document.getElementById("filter-preco-max").value = "";
  filtrosAtivos = { categoria: "", precoMin: "", precoMax: "" };
  filtrarProdutos();
});

// Filtros
let filtrosAtivos = {
  categoria: "",
  precoMin: "",
  precoMax: ""
};

function filtrarProdutos() {
  const termoBusca = document.getElementById("search").value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const nome = card.querySelector("h4").textContent.toLowerCase();
    const categoria = card.dataset.categoria || "";
    const preco = parseFloat(card.dataset.preco || 0);

    let mostrar = true;

    // Filtro de busca
    if (termoBusca && !nome.includes(termoBusca)) {
      mostrar = false;
    }

    // Filtro de categoria
    if (filtrosAtivos.categoria && categoria !== filtrosAtivos.categoria) {
      mostrar = false;
    }

    // Filtro de preço
    if (filtrosAtivos.precoMin && preco < parseFloat(filtrosAtivos.precoMin)) {
      mostrar = false;
    }
    if (filtrosAtivos.precoMax && preco > parseFloat(filtrosAtivos.precoMax)) {
      mostrar = false;
    }

    card.style.display = mostrar ? "block" : "none";
  });
}

// Função para filtrar por categoria
function filtrarPorCategoria(categoria) {
  filtrosAtivos.categoria = categoria;
  document.getElementById("filter-categoria").value = categoria;
  filtrarProdutos();
  // Scroll até a seção de produtos
  document.querySelector(".produtos").scrollIntoView({ behavior: 'smooth' });
}

// Verificar parâmetro de URL para filtro de categoria
const urlParams = new URLSearchParams(window.location.search);
const categoriaParam = urlParams.get('categoria');
if (categoriaParam) {
  filtrosAtivos.categoria = categoriaParam;
  document.getElementById("filter-categoria").value = categoriaParam;
}

// Atualizar contador ao carregar
document.addEventListener("DOMContentLoaded", atualizarContadorCarrinho);

// Importar e inicializar funções de usuário
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof atualizarHeaderUsuario === 'function') {
      atualizarHeaderUsuario();
    }
  });
} else {
  if (typeof atualizarHeaderUsuario === 'function') {
    atualizarHeaderUsuario();
  }
}