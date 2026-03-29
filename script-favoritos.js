// Carregar favoritos
function carregarFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const container = document.getElementById("lista-favoritos");

  if (favoritos.length === 0) {
    container.innerHTML = "<p>Você ainda não tem produtos favoritos</p>";
    return;
  }

  container.innerHTML = "";

  favoritos.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("card");

    const estrelas = "⭐".repeat(Math.floor(produto.avaliacao)) + (produto.avaliacao % 1 !== 0 ? "✨" : "");

    card.innerHTML = `
      <div class="card-badge">Favorito</div>
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h4>${produto.nome}</h4>
      <div class="card-preco">R$ ${produto.preco}</div>
      <div class="card-parcelas">ou ${produto.parcelas}</div>
      <div class="card-estrelas">${estrelas}</div>
      <div class="card-actions">
        <button class="btn-favorito ativo" data-id="${produto.id}">❤️</button>
        <button class="btn-comprar" data-id="${produto.id}">Adicionar ao Carrinho</button>
      </div>
    `;

    // Evento para ver detalhes
    card.querySelector(".btn-comprar").addEventListener("click", (e) => {
      e.stopPropagation();
      localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
      window.location.href = "produto.html";
    });

    // Evento para remover dos favoritos
    card.querySelector(".btn-favorito").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorito(produto);
      carregarFavoritos(); // Recarregar a lista
    });

    container.appendChild(card);
  });
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

// Função para atualizar contador do carrinho
function atualizarContadorCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
  const carrinhoIcon = document.querySelector(".carrinho-icon");
  if (totalItens > 0) {
    carrinhoIcon.textContent = `🛒 ${totalItens}`;
  } else {
    carrinhoIcon.textContent = "🛒";
  }
}

// Carregar favoritos ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
  carregarFavoritos();
  atualizarContadorCarrinho();
});