// Carregar carrinho
function carregarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const container = document.getElementById("lista-carrinho");
  const totalElement = document.getElementById("total");

  if (carrinho.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio</p>";
    totalElement.textContent = "0,00";
    return;
  }

  let total = 0;
  container.innerHTML = "";

  carrinho.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("carrinho-item");

    const preco = parseFloat(item.preco.replace(",", "."));
    const subtotal = preco * item.quantidade;
    total += subtotal;

    itemDiv.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}">
      <div class="item-info">
        <h4>${item.nome}</h4>
        <p>R$ ${item.preco}</p>
        <div class="quantidade">
          <button class="btn-menos" data-index="${index}">-</button>
          <span>${item.quantidade}</span>
          <button class="btn-mais" data-index="${index}">+</button>
        </div>
      </div>
      <div class="item-actions">
        <p>R$ ${subtotal.toFixed(2).replace(".", ",")}</p>
        <button class="btn-remover" data-index="${index}">🗑️</button>
      </div>
    `;

    container.appendChild(itemDiv);
  });

  totalElement.textContent = total.toFixed(2).replace(".", ",");

  // Event listeners para quantidade
  document.querySelectorAll(".btn-mais").forEach(btn => {
    btn.addEventListener("click", (e) => {
      alterarQuantidade(parseInt(e.target.dataset.index), 1);
    });
  });

  document.querySelectorAll(".btn-menos").forEach(btn => {
    btn.addEventListener("click", (e) => {
      alterarQuantidade(parseInt(e.target.dataset.index), -1);
    });
  });

  document.querySelectorAll(".btn-remover").forEach(btn => {
    btn.addEventListener("click", (e) => {
      removerDoCarrinho(parseInt(e.target.dataset.index));
    });
  });
}

// Alterar quantidade
function alterarQuantidade(index, delta) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  if (carrinho[index]) {
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) {
      carrinho.splice(index, 1);
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
    atualizarContadorCarrinho();
  }
}

// Remover do carrinho
function removerDoCarrinho(index) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  carregarCarrinho();
  atualizarContadorCarrinho();
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

// Event listener para finalizar compra
document.querySelector(".btn-finalizar").addEventListener("click", () => {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  alert("Compra finalizada com sucesso! Obrigado por comprar na Lojas Cem.");
  localStorage.removeItem("carrinho");
  carregarCarrinho();
  atualizarContadorCarrinho();
});

// Carregar carrinho ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
  carregarCarrinho();
  atualizarContadorCarrinho();
});