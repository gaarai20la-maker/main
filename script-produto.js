// Carrega os detalhes do produto do localStorage
function carregarDetalhesProduto() {
  const produtoJSON = localStorage.getItem("produtoSelecionado");

  if (!produtoJSON) {
    alert("Produto não encontrado!");
    window.location.href = "index.html";
    return;
  }

  const produto = JSON.parse(produtoJSON);

  // Preenche os dados na página
  document.getElementById("prod-imagem").src = produto.imagem;
  document.getElementById("prod-nome").textContent = produto.nome;
  document.getElementById("prod-preco").textContent = `R$ ${produto.preco}`;
  document.getElementById("prod-parcelas").textContent = `ou ${produto.parcelas}`;
  document.getElementById("prod-descricao").textContent = produto.descricao;
  document.getElementById("prod-categoria").textContent = produto.categoria;
  document.getElementById("prod-id").textContent = `#${String(produto.id).padStart(5, "0")}`;

  // Gera as estrelas
  const estrelas = "⭐".repeat(Math.floor(produto.avaliacao)) + 
                   (produto.avaliacao % 1 !== 0 ? "✨" : "");
  document.getElementById("prod-estrelas").textContent = estrelas;
  document.getElementById("prod-avaliacoes").textContent = `(${produto.avaliacao})`;

  // Verifica se o produto está nos favoritos
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const isFavorito = favoritos.some(fav => fav.id === produto.id);
  const btnFavorito = document.querySelector(".btn-favorito");
  if (isFavorito) {
    btnFavorito.classList.add("ativo");
  }

  // Limpa o localStorage após usar
  localStorage.removeItem("produtoSelecionado");
}

// Executar ao carregar a página
document.addEventListener("DOMContentLoaded", carregarDetalhesProduto);

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
  alert("Produto adicionado ao carrinho! ✓");
}

// Função para adicionar/remover dos favoritos
function toggleFavorito(produto) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const index = favoritos.findIndex(fav => fav.id === produto.id);
  
  if (index > -1) {
    favoritos.splice(index, 1);
    alert("Removido dos favoritos!");
  } else {
    favoritos.push(produto);
    alert("Adicionado aos favoritos! ❤️");
  }
  
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// Função para atualizar contador do carrinho no header
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

// Event listeners dos botões
document.querySelector(".btn-comprar-grande").addEventListener("click", () => {
  const produtoJSON = localStorage.getItem("produtoSelecionado");
  if (produtoJSON) {
    const produto = JSON.parse(produtoJSON);
    adicionarAoCarrinho(produto);
  }
});

document.querySelector(".btn-favorito").addEventListener("click", (e) => {
  const produtoJSON = localStorage.getItem("produtoSelecionado");
  if (produtoJSON) {
    const produto = JSON.parse(produtoJSON);
    toggleFavorito(produto);
    e.target.classList.toggle("ativo");
  }
});

// Atualizar contador ao carregar
document.addEventListener("DOMContentLoaded", atualizarContadorCarrinho);
