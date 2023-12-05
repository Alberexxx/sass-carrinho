document.addEventListener("DOMContentLoaded", function () {
    
    const dadosVendas = [100, 150, 200, 180, 250, 300, 220]; // Alteração de dados

    // gráfico de barras
    const ctxVendas = document.getElementById("graficoVendas").getContext("2d");
    ctxVendas.canvas.width = 300; // largura do gráfico de barras
    ctxVendas.canvas.height = 150; // altura do gráfico de barras
    const myChart = new Chart(ctxVendas, {
        type: "bar",
        data: {
            labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
            datasets: [{
                label: "Vendas",
                data: dadosVendas,
                backgroundColor: [
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)"
                ],
                borderColor: [
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)",
                    "rgba(1, 1, 1, 1)"
                ],
                
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const dadosPizza = {
        labels: ["Calça", "Bermuda", "Camisa", "Jaqueta"],
        datasets: [{
            data: [30, 20, 40, 10], // Alteração de dados
            backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)"
            ]
        }]
    };

    // gráfico de pizza
    const ctxPizza = document.getElementById("graficoPizza").getContext("2d");
    ctxPizza.canvas.width = 300; // largura do gráfico de pizza
    ctxPizza.canvas.height = 300; // altura do gráfico de pizza
    const myPizzaChart = new Chart(ctxPizza, {
        type: "pie",
        data: dadosPizza,
    });
});

/*

var tabelaPedidos = document.getElementById('tabelaPedidos');

// Cria o cabeçalho da tabela
var thead = document.createElement('thead');
thead.innerHTML = '<tr><th>Número do Pedido</th><th>Quantidade de Produtos</th><th>Códigos dos Produtos</th><th>Valor Total</th><th>Local de Entrega</th><th>Status</th></tr>';
tabelaPedidos.appendChild(thead);

// Preenche a tabela com os dados dos pedidos
var tbody = document.createElement('tbody');
pedidos.forEach(function(pedido) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + pedido.numeroPedido + '</td><td>' + pedido.qtdProdutos + '</td><td>' + pedido.codigosProdutos.join(', ') + '</td><td>' + pedido.valorTotal + '</td><td>' + pedido.localEntrega + '</td><th>'+ pedido.Status + '</th>';
    tbody.appendChild(tr);
});
tabelaPedidos.appendChild(tbody);

*/



