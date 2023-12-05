document.addEventListener("DOMContentLoaded", function () {
    const removeButtons = document.querySelectorAll(".remove");
    const plusButtons = document.querySelectorAll(".bx-plus");
    const minusButtons = document.querySelectorAll(".bx-minus");
    const quantityElements = document.querySelectorAll(".qty span");
    

    // atualiza o total do produto 
    function updateProductTotal(row) {
        const price = parseFloat(row.querySelector("td:nth-child(2)").textContent.replace("R$ ", ""));
        const quantity = parseInt(row.querySelector(".qty span").textContent);
        const total = price * quantity;
        row.querySelector("td:nth-child(4)").textContent = `R$ ${total.toFixed(2)}`;
        updateSubtotal();
    }

    //  atualiza o subtotal
    function updateSubtotal() {
        let subtotal = 0;
        document.querySelectorAll("tbody tr").forEach((row) => {
            subtotal += parseFloat(row.querySelector("td:nth-child(4)").textContent.replace("R$ ", ""));
        });
        document.querySelector(".info div:nth-child(1) span:nth-child(2)").textContent = `R$ ${subtotal.toFixed(2)}`;
        updateTotal(subtotal);
    }

    // atualiza o total
    function updateTotal(subtotal) {
        const totalElement = document.querySelector("footer span:nth-child(2)");
        totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    
        var valor = document.getElementById('conteudoHidden')
        valor.value = subtotal.toFixed(2)
    }

    //  botão de remover
    removeButtons.forEach((button) => {
        button.addEventListener("click", function () {
            id = document.getElementById("id")
            const row = button.closest("tr");
            row.remove();
            updateSubtotal();
           
        });
    });

    // botão de add
    plusButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            const quantity = parseInt(quantityElements[index].textContent);
            quantityElements[index].textContent = quantity + 1;
            updateProductTotal(button.closest("tr"));
            
        });
    });

    // botão de sub
    minusButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            const quantity = parseInt(quantityElements[index].textContent);
            if (quantity > 1) {
                quantityElements[index].textContent = quantity - 1;
                updateProductTotal(button.closest("tr"));
            }
        });
    });

    // Inicia o subtotal e o total
    updateSubtotal();
});

// Dark Mode 
function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
  }

  function removeItem(id) {
   
    const url = '/removeItem';
    const requestOptions = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idItem: id})
    };
            fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro na solicitação.')
                }
                return response.text(); 
            })
            .then((data) => {
                
                
            })
            .catch((error) => {
                console.error('Erro:', error);
            });       
}

function mudarQuantidade(id, qtd) {
   
    const url = '/mudarQuantidade';
    const requestOptions = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idItem: id, qtd: qtd})
    };
            fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro na solicitação.')
                }
                return response.text(); 
            })
            .then((data) => {
                
                
            })
            .catch((error) => {
                console.error('Erro:', error);
            });       
}




