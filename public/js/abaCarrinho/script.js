
var nomeEmpresa = document.getElementById("nomeEmpresa")
var nomeEmpresaValue =  nomeEmpresa.value


function formatarInput(input) {
    
    let campoMonetario = input
    let formataValor = new Intl.NumberFormat('pt-BR', {style: 'currency', currency:'BRL'});
    
    let valorBruto = campoMonetario.replace(/\D/g, '');
    let valorFinal = (formataValor.format(parseFloat(valorBruto / 100)));
    return valorFinal; 
} 
function desformatarInput(input) {
    input = formatarInput(input)   
    input = input.replace(/\./g, '').replace(",", ".").replace('R$', '').trim()
    input = parseFloat(input) 
    return input;
}


function updateTotal() {
    const cartString = localStorage.getItem('carrinho:' + nomeEmpresaValue);
    const cart = cartString ? JSON.parse(cartString) : [];

    var btn_valor = document.getElementById('btn-total');
    var ValorTotal = 0;

    for (var i = 0; i < cart.length; i++) {
        // Converte e formata o preço do produto
        let precoFormatado = desformatarInput(cart[i].preco);
        
        if (!isNaN(precoFormatado)) {
            ValorTotal += precoFormatado * parseInt(cart[i].quantidade, 10);
        } 
    }

    // Formata o total antes de exibir no botão
    btn_valor.innerHTML = '<strong>Total: </strong>' + formatarInput(ValorTotal.toFixed(2));
}



function limitarTamanhoString(str) {
    var larguraJanela = window.innerWidth /12;
    if (str.length > larguraJanela) {
        return str.slice(0, larguraJanela) + "...";
    } else {
        return str;
    }
}

function updateCart(nomeEmpresaValue) {

    const cartString = localStorage.getItem('carrinho:'+ nomeEmpresaValue);
    const cart = cartString ? JSON.parse(cartString) : [];
    
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = '';
    var submit_btn = document.getElementById("submit-btn");

    let cartItemElement; //-----------

    // Função para criar um elemento de produto no carrinho
    function createCartItemElement(product, index) {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const eightyPercentWidth = windowWidth * 0.1;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const itemName = document.createElement('span');
        itemName.textContent = `${limitarTamanhoString(product.produto)} - `;
        itemName.classList.add('itemName')

        const itemPrice = document.createElement('span');
        itemPrice.textContent = `${formatarInput(product.preco)} - Qtd:`;
        itemPrice.classList.add('itemprice')

        const itemQuantity = document.createElement('span');
        itemQuantity.textContent = ` ${product.quantidade}`;
        itemQuantity.classList.add('itemQuantity') 	

        const minButton = document.createElement('button');
        minButton.textContent = ' - ';
        minButton.classList.add('min-btn')

        cartItemElement = cartItem; //---------------

        minButton.addEventListener('click', function () {
            if (product.quantidade > 1) {
                product.quantidade--;
                itemQuantity.textContent = ` ${product.quantidade}`;
                cart[index].quantidade = product.quantidade;
                localStorage.setItem('carrinho:'+ nomeEmpresaValue, JSON.stringify(cart));
            } else {
                cart.splice(index, 1);
                localStorage.setItem('carrinho:' + nomeEmpresaValue, JSON.stringify(cart));
                updateCart(nomeEmpresaValue);
                const cartItems = document.querySelector(".cart-items")

                if ( cart.length === 0)  {
                    cartItems.style.height = "10px"
                    submit_btn.style.backgroundColor = 'gray'
                } 
            }
            updateTotal()
        });

        const maxButton = document.createElement('button');
        maxButton.textContent = ' + ';
        maxButton.classList.add('add-btn')
        maxButton.addEventListener('click', function () {
            product.quantidade++;
            itemQuantity.textContent = ` ${product.quantidade}`;
            cart[index].quantidade = product.quantidade;
            localStorage.setItem('carrinho:' + nomeEmpresaValue, JSON.stringify(cart));
            
            updateTotal()
        });
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('delete-btn');

        // Adicionar funcionalidade de exclusão ao botão
        deleteButton.addEventListener('click', function () {
            cart.splice(index, 1);
            localStorage.setItem('carrinho:' + nomeEmpresaValue, JSON.stringify(cart));
            
            const cartItems = document.querySelector(".cart-items")

            if ( cart.length === 0)  {
                cartItems.style.height = "10px"
                submit_btn.style.backgroundColor = 'gray'

            } 
            updateCart(nomeEmpresaValue);
            updateTotal()
        });

        const itemHr = document.createElement('hr');
        itemHr.classList.add('item-hr');


        cartItem.appendChild(itemName);
        cartItem.appendChild(itemPrice);
        cartItem.appendChild(minButton)
        cartItem.appendChild(itemQuantity);
        cartItem.appendChild(maxButton)
        cartItem.appendChild(deleteButton);
        cartItem.appendChild(itemHr);



        return cartItem;
    }
    cart.reverse();

  cart.forEach(function(product, index) {
    const cartItemElement = createCartItemElement(product, index);
    cartItems.appendChild(cartItemElement);
});

}

function updateCartShort(nomeEmpresaValue) {
    const cartString = localStorage.getItem('carrinho:'+ nomeEmpresaValue);
    let cart = cartString ? JSON.parse(cartString) : [];

    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = '';

    if ( cart.length === 0)  {
        cartItems.style.height = "10px"
    } else if ( cart.length == 1) {
        cartItems.style.height = '33px'
    } else if (cart.length >= 2) {
        cartItems.style.height = '68px'

    }

    // Função para criar um elemento de produto no carrinho
    function createCartItemElement(product, index, isLastItem) {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const eightyPercentWidth = windowWidth * 0.03;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const itemName = document.createElement('span');
        itemName.textContent = `${limitarTamanhoString( product.produto )} - `;
        itemName.classList.add('itemName')

        const itemPrice = document.createElement('span');
        itemPrice.textContent = `${formatarInput(product.preco)} - Qtd:`;
        itemPrice.classList.add('itemprice')

        const itemQuantity = document.createElement('span');
        itemQuantity.textContent = ` ${product.quantidade}`;
        itemQuantity.classList.add('itemQuantity') 	

        const minButton = document.createElement('button');
        minButton.textContent = ' - ';
        minButton.classList.add('min-btn')

        minButton.addEventListener('click', function () {
            if (product.quantidade > 1) {
                product.quantidade--;
                itemQuantity.textContent = ` ${product.quantidade}`;
                cart[index].quantidade = product.quantidade;
                localStorage.setItem('carrinho:'+ nomeEmpresaValue, JSON.stringify(cart));
               
            } else {
                cart.splice(index, 1);
                localStorage.setItem('carrinho:'+nomeEmpresaValue, JSON.stringify(cart));
                updateCartShort(nomeEmpresaValue);
                const cartItems = document.querySelector(".cart-items")

                if ( cart.length === 0)  {
                    cartItems.style.height = "10px"
                } else if ( cart.length == 1) {
                    cartItems.style.height = '33px'
                }
                var submit_btn = document.getElementById("submit-btn")
           
                if ( cart.length === 0 || cart === null )  {
                    submit_btn.style.backgroundColor = "gray"
                } 
            }
            updateTotal()

        });

        const maxButton = document.createElement('button');
        maxButton.textContent = ' + ';
        maxButton.classList.add('add-btn')

        maxButton.addEventListener('click', function () {
            product.quantidade++;
            itemQuantity.textContent = ` ${product.quantidade}`;
            cart[index].quantidade = product.quantidade;
            localStorage.setItem('carrinho:'+ nomeEmpresaValue, JSON.stringify(cart));
            updateTotal()
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir'; 
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', function () {
            cart.splice(index, 1);
            localStorage.setItem('carrinho:'+nomeEmpresaValue, JSON.stringify(cart));

            const cartItems = document.querySelector(".cart-items")

            if ( cart.length == 0)  {
                cartItems.style.height = "10px"
            } else if ( cart.length == 1) {
                cartItems.style.height = '33px'
            }
            var submit_btn = document.getElementById("submit-btn")
           
           if ( cart.length === 0 || cart === null )  {
               submit_btn.style.backgroundColor = "gray"
           } 
            updateCartShort(nomeEmpresaValue);
            updateTotal()
        });
        const itemHr = document.createElement('hr');
        itemHr.classList.add('item-hr');

        cartItem.appendChild(itemName);
        cartItem.appendChild(itemPrice);
        cartItem.appendChild(minButton);
        cartItem.appendChild(itemQuantity);
        cartItem.appendChild(maxButton);
        cartItem.appendChild(deleteButton);

        if (!isLastItem) {
            cartItem.appendChild(itemHr);
        }

        return cartItem;
    }
    cart.reverse();
    var carte = cart.slice(0,2)
  carte.forEach(function(product, index ) {
    const isLastItem = index === carte.length - 1;
    const cartItemElement = createCartItemElement(product, index, isLastItem);
    cartItems.appendChild(cartItemElement);
});  
}



document.addEventListener('DOMContentLoaded', function () {
   

    const submitBtn = document.querySelector('.submit-btn');
    const expandBtn = document.querySelector('.expand-cart-btn');
    const cartContainer = document.querySelector('.cart-container');
    const cartItems = document.querySelector(".cart-items")

    const windowHeight = window.innerHeight;
    const eightyPercentHeight = windowHeight * 0.8;

    let isExpanded = false;
    let isExpand_inp = document.getElementById('isExpand_inp');
    isExpand_inp.value = false;

    let originalHeight = cartItems.clientHeight;

    icon_seta.style.transform = "rotate(180deg)"
    var submit_btn = document.getElementById("submit-btn")
    
     const cartString = localStorage.getItem('carrinho:'+nomeEmpresaValue);
     const cart = cartString ? JSON.parse(cartString) : [];
    
    if ( cart.length === 0 || cart === null )  {
        submit_btn.style.backgroundColor = "gray"
    } 
    
  window.f_expandBtn = function() {
        const icon_seta = document.getElementById("icon_seta")
        const cartString = localStorage.getItem('carrinho:'+ nomeEmpresaValue);
        let cart = cartString ? JSON.parse(cartString) : [];
        var carrinho = localStorage.getItem('carrinho:'+ nomeEmpresaValue) 

        if (!isExpanded) {

            if ( cart.length === 0 ) {
                updateCart(nomeEmpresaValue)
            } else if ( cart.length === 1) {
                cartItems.style.height = `${eightyPercentHeight}px`;
                icon_seta.style.transform = ""
                isExpanded = true;
                isExpand_inp.value = true;
                expandBtn.childNodes[0].nodeValue = " diminuir "
                updateCart(nomeEmpresaValue)
            } else {
                cartItems.style.height = `${eightyPercentHeight}px`;
                icon_seta.style.transform = ""
                isExpanded = true;
                isExpand_inp.value = true;
                expandBtn.childNodes[0].nodeValue = " diminuir "
                updateCart(nomeEmpresaValue)
            }
            
        } else {
            if ( carrinho === '' || carrinho === null)  {
                cartItems.style.height = "10px"
                icon_seta.style.transform = "rotate(180deg)"
                expandBtn.childNodes[0].nodeValue = " expandir "
                var carrinho = localStorage.getItem('carrinho:'+nomeEmpresaValue) 
            } else {
                cartItems.style.height = `${originalHeight}px`;
                icon_seta.style.transform = "rotate(180deg)"
                expandBtn.childNodes[0].nodeValue = " expandir "
                var carrinho = localStorage.getItem('carrinho:'+nomeEmpresaValue) 
            }
            
            
            if ( carrinho === '' || carrinho === null)  {
                cartItems.style.height = "0px"
            } 
            updateCartShort(nomeEmpresaValue)
            isExpanded = false;
            isExpand_inp.value = false;
        }
    }

    expandBtn.addEventListener('click', f_expandBtn);

    updateCartShort(nomeEmpresaValue)
    

    window.adicionar = function(id, preco, nome, empresa) {
        const cartItems = document.querySelector(".cart-items")
        var submit_btn = document.getElementById("submit-btn")
        var popup = document.getElementById("popup");

        

        let notificacao = document.getElementById('notificacao_carrinho') 
             
        function mostrarMensagem() {
            popup.style.display = "block";

                
                notificacao.style.display = 'block'
           


            setTimeout(function () { popup.style.display = "none"; }, 2000);
        }
    
        // Recupere o carrinho atual do Local Storage (se existir)
        var carrinho = JSON.parse(localStorage.getItem('carrinho:'+ empresa)) || [];
    
        // Verifique se o produto já existe no carrinho
        var produtoExistente = carrinho.find(item => item.id === id);
        if (produtoExistente) {
            // Atualize a quantidade do produto existente
            produtoExistente.quantidade++;
        } else {
            // Adicione o produto ao carrinho
            var produto = {
                id: id, // ID do produto
                produto: nome,
                preco: preco,
                quantidade: 1
            };
            carrinho.push(produto);
            if (isExpanded){
               
    
            } else {
                    if (carrinho.length === 1 ) {
                cartItems.style.height = "31px"
                submit_btn.style.backgroundColor = '#4CAF50'
                } else if (carrinho.length == 2) {
                    cartItems.style.height = "67px"
                }
            }
           
            mostrarMensagem();
        }
    
        // Atualize o carrinho no Local Storage
        localStorage.setItem('carrinho:'+ empresa, JSON.stringify(carrinho));
       
        if (isExpanded){
            updateCart(empresa);

        } else {
            updateCartShort(empresa);
        }
       
        updateTotal()
       
    }

    updateTotal()

}); 
    


function LimparCarrinho(empresa) {
  let  isExpand_inp = document.getElementById('isExpand_inp')

    if ( isExpand_inp.value == 'true') {
        f_expandBtn()
         
        const cartItems = document.querySelector(".cart-items")
        cartItems.style.height = "0px"
        localStorage.removeItem('carrinho:'+ empresa);
        var submit_btn = document.getElementById("submit-btn")
        const cartString = localStorage.getItem('carrinho:'+empresa);

        if ( cartString === '' || cartString === null )  {
            submit_btn.style.backgroundColor = "gray"
        } 
        updateCartShort(empresa);
        updateTotal()
    } else {
       
        const cartItems = document.querySelector(".cart-items")
        cartItems.style.height = "0px"
        localStorage.removeItem('carrinho:'+ empresa);
        var submit_btn = document.getElementById("submit-btn")
        const cartString = localStorage.getItem('carrinho:'+empresa);

        if ( cartString === '' || cartString === null )  {
            submit_btn.style.backgroundColor = "gray"
        } 
        updateCartShort(empresa);
        updateTotal()
    }
   
}



