// Função para filtrar por categoria
function filtrarPorCategoria(categoria) {
  window.location.href = `index.html?categoria=${encodeURIComponent(categoria)}`;
}

// Atualizar contador ao carregar
document.addEventListener("DOMContentLoaded", () => {
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

  atualizarContadorCarrinho();
});