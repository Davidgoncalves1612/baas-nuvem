let produtos = JSON.parse(
  localStorage.getItem("produtos")
) || [
  {
    id: 1,
    nome: "Teclado Gamer",
    quantidade: 12,
    preco: 149.90,
    minimo: 5
  },
  {
    id: 2,
    nome: "Mouse sem fio",
    quantidade: 4,
    preco: 89.90,
    minimo: 5
  },
  {
    id: 3,
    nome: "Monitor 24 polegadas",
    quantidade: 8,
    preco: 899.90,
    minimo: 3
  }
];

let produtoEditando = null;

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function salvarDados() {
  localStorage.setItem(
    "produtos",
    JSON.stringify(produtos)
  );
}

function renderizarProdutos() {
  const lista = document.getElementById("listaProdutos");
  const busca = document.getElementById("busca").value.toLowerCase();

  lista.innerHTML = "";

  const filtrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(busca)
  );

  filtrados.forEach(produto => {
    const valorTotal = produto.quantidade * produto.preco;
    const estoqueEstaBaixo = produto.quantidade <= produto.minimo;

    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td><strong>${produto.nome}</strong></td>
      <td>${produto.quantidade}</td>
      <td>${formatarMoeda(produto.preco)}</td>
      <td>${formatarMoeda(valorTotal)}</td>
      <td>
        <span class="status ${
          estoqueEstaBaixo ? "status-low" : "status-ok"
        }">
          ${
            estoqueEstaBaixo ? "⚠ Estoque baixo" : "✓ Normal"
          }
        </span>
      </td>
      <td>
        <div class="actions">
          <button
            class="action-btn edit"
            onclick="editarProduto(${produto.id})"
          >
            Editar
          </button>
          <button
            class="action-btn delete"
            onclick="excluirProduto(${produto.id})"
          >
            Excluir
          </button>
        </div>
      </td>
    `;

    lista.appendChild(linha);
  });

  atualizarDashboard();
}

function atualizarDashboard() {
  const totalProdutos = produtos.length;

  const totalQuantidade = produtos.reduce(
    (total, produto) => total + Number(produto.quantidade),
    0
  );

  const valorEstoque = produtos.reduce(
    (total, produto) =>
      total + (Number(produto.quantidade) * Number(produto.preco)),
    0
  );

  const estoqueBaixo = produtos.filter(
    produto => Number(produto.quantidade) <= Number(produto.minimo)
  ).length;

  document.getElementById("totalProdutos").textContent = totalProdutos;
  document.getElementById("totalQuantidade").textContent = totalQuantidade;
  document.getElementById("valorEstoque").textContent = formatarMoeda(valorEstoque);
  document.getElementById("estoqueBaixo").textContent = estoqueBaixo;

  const alerta = document.getElementById("alerta");

  if (estoqueBaixo > 0) {
    alerta.classList.add("show");
  } else {
    alerta.classList.remove("show");
  }
}

function abrirModal() {
  produtoEditando = null;
  document.getElementById("tituloModal").textContent = "Novo produto";
  document.getElementById("formProduto").reset();
  document.getElementById("modal").classList.add("active");
}

function fecharModal() {
  document.getElementById("modal").classList.remove("active");
}

document.getElementById("formProduto").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const preco = Number(document.getElementById("preco").value);
    const minimo = Number(document.getElementById("minimo").value);

    if (produtoEditando) {
      produtoEditando.nome = nome;
      produtoEditando.quantidade = quantidade;
      produtoEditando.preco = preco;
      produtoEditando.minimo = minimo;
    } else {
      produtos.push({
        id: Date.now(),
        nome: nome,
        quantidade: quantidade,
        preco: preco,
        minimo: minimo
      });
    }

    salvarDados();
    renderizarProdutos();
    fecharModal();
  }
);

function editarProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  produtoEditando = produto;

  document.getElementById("tituloModal").textContent = "Editar produto";
  document.getElementById("nome").value = produto.nome;
  document.getElementById("quantidade").value = produto.quantidade;
  document.getElementById("preco").value = produto.preco;
  document.getElementById("minimo").value = produto.minimo;

  document.getElementById("modal").classList.add("active");
}

function excluirProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  const confirmar = confirm(`Deseja realmente excluir "${produto.nome}"?`);
  if (!confirmar) return;

  produtos = produtos.filter(p => p.id !== id);

  salvarDados();
  renderizarProdutos();
}

document.getElementById("modal").addEventListener(
  "click",
  function(event) {
    if (event.target === this) {
      fecharModal();
    }
  }
);

renderizarProdutos();