
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


let x_icon = document.getElementById("x_icon")
let carrinho = document.getElementById("carrinho")
let miniaturaCarrinho = document.getElementById("miniaturaCarrinho")
let statusCarrinho = localStorage.getItem('vsb_carrinho') ?? 'true';
let notificacao = document.getElementById('notificacao_carrinho') 

notificacao.style.display = 'none'

if (statusCarrinho === 'true') {
    miniaturaCarrinho.style.display = 'none'
    carrinho.style.display = 'block'
    
} else if (statusCarrinho === 'false') {
    miniaturaCarrinho.style.display = 'block'
    carrinho.style.display = 'none'
}

function esconder_carrinho() {
 
  if (statusCarrinho === 'true') {
    
    carrinho.style.display = 'none'
    miniaturaCarrinho.style.display = 'block'

    if (!localStorage.getItem('vsb_carrinho')) {
      localStorage.setItem('vsb_carrinho', "false");
    } else {
      localStorage.setItem('vsb_carrinho', "false");
    }
 
    statusCarrinho = "false"
    notificacao.style.display = 'none'

  } else {

    miniaturaCarrinho.style.display = 'none'
    carrinho.style.display = 'block'
    statusCarrinho = "true"
    notificacao.style.display = 'none'

    
    if (!localStorage.getItem('vsb_carrinho')) {
      localStorage.setItem('vsb_carrinho', "true");
    } else {
      localStorage.setItem('vsb_carrinho', "true");
    }


  }
}



x_icon.addEventListener("click", esconder_carrinho)
miniaturaCarrinho.addEventListener("click", esconder_carrinho)

function escolherPagamento(empresa) {
  var stringOriginal = JSON.parse(localStorage.getItem('carrinho:' + empresa)) || [];
  
  if (stringOriginal.length > 0) {
    let total = document.getElementById('btn-total').innerText
    total = total.replace(/[^\d,]/g, '')
    
    let btn_pagamento_valor = document.getElementById('btn_pagamento_valor')


    
    btn_pagamento_valor.innerHTML = `<strong>Total:</strong> ${formatarInput(total)}`

    let div_carrinho = document.getElementById('carrinho');
    let div_pagamento = document.getElementById('div_pagamento');

    let larguraOriginal = div_carrinho.offsetWidth;

    div_pagamento.style.width = `${larguraOriginal}px ` 
    div_pagamento.style.display = 'block'

    div_carrinho.style.display = 'none'
  } 
 
}


function escolherformaPag(forma, taxa) {
  let div_carrinho = document.getElementById('carrinho');
  let div_pagamento = document.getElementById('div_pagamento');
  let total = document.getElementById('btn-total').innerText
  total = total.replace(/[^\d,]/g, '')
  let semDesconto = total;
  total = total.replace(',', '.')
  total = parseFloat(total)

  var taxasObj = JSON.parse(taxa);

  if (forma == 1) {
    if (taxasObj.avista.taxa == true) {
      let taxaAvista = parseFloat(taxasObj.avista.valor)
      let valorTotal = total - ((taxaAvista * total)/100) 
      valorTotal = valorTotal.toFixed(2)

      confirmarAvista(1, semDesconto, valorTotal ,taxaAvista) 

    } else {
 
      confirmarAvista(1, semDesconto, undefined, undefined ) 
    }
  }
  if (forma == 2) {
    
    if (taxasObj.credito.taxa == 'true') {

      confirmarCredito(taxasObj.credito, total) 

    } else {

      confirmarCredito(taxasObj.credito, total) 
    }

  }
  if (forma == 3) {
    if (taxasObj.debito.taxa == 'true') {

      let taxaDebito = parseFloat(taxasObj.debito.valor)
      let valorTotal = total + ((taxaDebito * total)/100) 
      valorTotal = valorTotal.toFixed(2)

     

      confirmarAvista(3, semDesconto, valorTotal ,taxaDebito) 

    } else {
 
      confirmarAvista(3, semDesconto, undefined, undefined ) 
    }
  }
 
}

function confirmarAvista(x, semDesconto, total, taxa) {

  if (x == 1) {
    let divPagamento = document.getElementById("div_pagamento")
    let pag_avista = document.getElementById("pag_avista")
    let total_semDesconto = document.getElementById("total_semDesconto_v")
    let desconto_v = document.getElementById("desconto_v")
    let total_final_v = document.getElementById("total_final_v")

    let value_semDesconto_v = document.getElementById("value_semDesconto_v")
    let value_desconto_v = document.getElementById("value_desconto_v")
    let value_total_v = document.getElementById("value_total_v")
    
    let larguraOriginal = divPagamento.offsetWidth;

    pag_avista.style.width = `${larguraOriginal}px `
    pag_avista.style.display = 'block'
    divPagamento.style.display = 'none'

    if (total == undefined && taxa == undefined || taxa == 0 ) {
      semDesconto = semDesconto.replace(",", ".")
      desconto_v.innerHTML = `<strong> Valor Final:</strong> ${formatarInput(semDesconto)}`
      value_total_v.value = semDesconto

    } else {
      
      semDesconto = semDesconto.replace(",", ".")
      total_semDesconto.innerHTML = `<strong> Total: </strong>${formatarInput(semDesconto)}`
      let v_desconto = String(parseFloat((parseFloat(taxa) * parseFloat(semDesconto)) / 100).toFixed(2));

      desconto_v.innerHTML = `<strong> - </strong> ${formatarInput(v_desconto)} de desconto (${String(taxa).replace('.', ',')}%)  `
      total_final_v.innerHTML = `<strong> Valor Final: </strong> ${formatarInput(total)}`

      value_semDesconto_v.value = semDesconto
      semDesconto = parseFloat(semDesconto)
      value_desconto_v.value = (parseFloat((taxa * semDesconto)/100).toFixed(2)).replace('.', ',')
      value_total_v.value = total.replace('.', ',')

      
    }

  
  } else if(x == 3) {
    let divPagamento = document.getElementById("div_pagamento")
    let pag_avista = document.getElementById("pag_debito")
    let total_semDesconto = document.getElementById("total_semDesconto_d")
    let desconto_v = document.getElementById("desconto_d")
    let total_final_v = document.getElementById("total_final_d")

    let larguraOriginal = divPagamento.offsetWidth;

    pag_avista.style.width = `${larguraOriginal}px`
    pag_avista.style.display = 'block'
    divPagamento.style.display = 'none'

    if (total == undefined && taxa == undefined || taxa == 0) {
      semDesconto = semDesconto.replace(",", ".")
      desconto_v.innerText = `Valor Final da compra: ${formatarInput(semDesconto)}`
      value_total_d.value = semDesconto

    } else {
      semDesconto = semDesconto.replace(",", ".")
      total_semDesconto.innerHTML = `<strong> Total: </strong> ${formatarInput(semDesconto)}`
      let v_juros_deb = String(((taxa * parseFloat(semDesconto))/100).toFixed(2)).replace('.',',');
      desconto_v.innerHTML = `<strong> + </strong> ${formatarInput(v_juros_deb)} de juros no cartão de debito (${String(taxa).replace('.', ',')}%) `
      total_final_v.innerHTML = `<strong> Valor Final: </strong>${formatarInput(total)} `

      
      value_semDesconto_d.value = semDesconto
      semDesconto = parseFloat(semDesconto)
      value_desconto_d.value = (parseFloat((taxa * semDesconto)/100).toFixed(2)).replace('.', ',')
      value_total_d.value = total.replace('.', ',')


      
    }
  }
  

}

function confirmarCredito(taxas, total) {
    

    let divPagamento = document.getElementById("div_pagamento")
    let pag_credito = document.getElementById("pag_credito")
    let total_semDesconto = document.getElementById("total_semDesconto_d")
    let desconto_v = document.getElementById("desconto_d")
    let total_final_v = document.getElementById("total_final_d")
    let taxas_credito = document.getElementById("taxas_credito")

    //limpar taxas
    taxas_credito.innerHTML = '';

    let larguraOriginal = divPagamento.offsetWidth;

    pag_credito.style.width = `${larguraOriginal}px`
    pag_credito.style.display = 'block'
    divPagamento.style.display = 'none'

    let botoesExistents = document.getElementById("btn_credito_voltar")

    // Obtenha o objeto de valores do JSON
    let valores = taxas.valores;

    let primeiroRadioCriado = false
    // Itere sobre as chaves do objeto
    for (let chave in valores) {
    // Extraia os valores do array correspondente à chave
      let [isChecked, valorTaxa] = valores[chave];

    // Verifique se o primeiro elemento do array é verdadeiro
      if (isChecked) {
        let numeroParcela = parseInt(chave.replace('x', ''))
        let juros = ((total * valorTaxa)/100).toFixed(2)
        
        let valorFinal = (total + parseFloat(juros)).toFixed(2)
        
        let parcela = (valorFinal/numeroParcela).toFixed(2)
        let temJuros = '';

       

        // Crie um elemento de input do tipo radio
        let radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = "opcao_pagamento_credito"; // Use o mesmo nome para agrupar os botões

        // Crie um elemento de label
        let label = document.createElement("label");
        let hr = document.createElement("hr");
        
        hr.classList.add("hr_credito");

              // Verifique se o primeiro elemento do array é verdadeiro
        if (isChecked && !primeiroRadioCriado) {
            primeiroRadioCriado = true; // Marque que o primeiro radio foi criado
            radioBtn.checked = isChecked;
        } else {
            isChecked = false; // Desmarque os demais radios
        }


        // Adicione o valor da taxa à label
        if (valorTaxa > 0) {

          label.textContent = `${chave} de ${formatarInput(String(parcela))} com juros (${String(valorTaxa).replace('.',',')}%)   Total: ${formatarInput(String(valorFinal))} `;

        } else {
           label.textContent = `${chave} de R$${formatarInput(String(parcela))} sem juros    Total: R$${formatarInput(String(valorFinal))} `;
        }
        
        
        taxas_credito.appendChild(radioBtn);
        taxas_credito.appendChild(label);
       

        // Adicione quebras de linha para melhorar a legibilidade
        taxas_credito.appendChild(document.createElement("br"));
        taxas_credito.appendChild(hr);
    }
}

}

 

function esconderEscolha(x) {
  if (x == 1) {
    let div_carrinho = document.getElementById('carrinho');
    let div_pagamento = document.getElementById('div_pagamento');

    div_pagamento.style.display = 'none'
    div_carrinho.style.display = 'block'
  } else if (x == 2) {
    let div_pagamento = document.getElementById('div_pagamento');
    let pag_avista = document.getElementById('pag_avista');

    div_pagamento.style.display = 'block'
    pag_avista.style.display = 'none'
    
  } else if (x == 3) {
    let div_pagamento = document.getElementById('div_pagamento');
    let pag_avista = document.getElementById('pag_debito');

    div_pagamento.style.display = 'block'
    pag_avista.style.display = 'none'
    
  }  else if (x == 4) {
    let div_pagamento = document.getElementById('div_pagamento');
    let pag_credito = document.getElementById('pag_credito');

    div_pagamento.style.display = 'block'
    pag_credito.style.display = 'none'
    
  } 
  
}

// ---------------------------------------------------
function enviar(empresa, x, numero) {
    var stringOriginal = JSON.parse(localStorage.getItem('carrinho:' + empresa)) || [];
    

    var novaString = "";
    let ValorTotal = 0;

    for (var i = 0; i < stringOriginal.length; i++) {
        let produto = stringOriginal[i].produto ? stringOriginal[i].produto + ", " : "";
        let cor = stringOriginal[i].cor ? "Cor: " + stringOriginal[i].cor + ", " : "";
        let tamanho = stringOriginal[i].tamanho ? "Tamanho: " + stringOriginal[i].tamanho : "";
        let quantidade = stringOriginal[i].quantidade ? "Qtd " + stringOriginal[i].quantidade + ", " : "";

        let preco = stringOriginal[i].preco ? "preço unid: R$" + stringOriginal[i].preco.replace('.', ',') : "";

        novaString += produto + cor + tamanho + quantidade + formatarInput(preco);

        stringOriginal[i].preco = stringOriginal[i].preco.replace(",", ".");

        //ValorTotal += parseFloat(stringOriginal[i].preco)  * parseInt(stringOriginal[i].quantidade);

      if (stringOriginal[i].preco && !isNaN(parseFloat(stringOriginal[i].preco))) {
          // Realiza a multiplicação apenas se o valor for um número válido
          ValorTotal += parseFloat(stringOriginal[i].preco) * parseInt(stringOriginal[i].quantidade);
      } 



        if (i !== stringOriginal.length - 1) {
            novaString += " %0A ";
            novaString = novaString.slice(0, -1);
        }
    }

    // Corrigindo a variável para ValorTotal
    ValorTotal = ValorTotal.toFixed(2); // Limitando a duas casas decimais
    ValorTotal = ValorTotal.replace('.', ',');

    var cabecalho = "------%20Carrinho%20de%20compras%20------%0A%0A";
//-----------------------------------------------------------------------------------------------

    if (x == 1) {

      
      let value_semDesconto_v = document.getElementById("value_semDesconto_v").value
      let value_desconto_v = document.getElementById("value_desconto_v").value
      let value_total_v = document.getElementById("value_total_v").value

      if (value_desconto_v == '') {
        var rodape = `%0A%0A*Pagamento:%20À%20vista/PIX*%0A%0A*Valor%20Final%20do%20carrinho:*%20${formatarInput(value_total_v)}`;

      } else {
        var rodape = `%0A%0A*Pagamento:%20À%20vista/PIX*%0A*Total:*%20${formatarInput(value_semDesconto_v)}%0A*Desconto:*%20${formatarInput(value_desconto_v)}%0A%0A*Valor%20Final%20do%20carrinho:*%20${formatarInput(value_total_v)}`;

      }

//---------------------------------------------------------------------------------------------------------------------->
    } else if (x == 2) {
      let escolhaParcela = '';
  
    let inputsRadio = document.querySelectorAll('input[type="radio"][name="opcao_pagamento_credito"]');
    
    for (let i = 0; i < inputsRadio.length; i++) {
        if (inputsRadio[i].checked) {
            // O input está marcado, você pode obter o valor da label correspondente
            let labelAssociada = inputsRadio[i].nextElementSibling; // Assume que a label está imediatamente após o input
            let valorLabel = labelAssociada.textContent;
            
           escolhaParcela = valorLabel
        }
    }

    let regex = /Total: ([^ ]+)/;
    let match = escolhaParcela.match(regex);


      var rodape = `%0A%0A*Pagamento:%20Cartão%20de%20Credito*%0A*Numero%20de%20parcelas%20escolhido*:%20${escolhaParcela}%0A%0A*Valor%20Final%20do%20carrinho:*%20${match[1]}`;

//---------------------------------------------------------------------------------------------------------------------->
    } else if (x == 3) {
      let value_semDesconto_d = document.getElementById("value_semDesconto_d").value
      let value_desconto_d = document.getElementById("value_desconto_d").value
      let value_total_d = document.getElementById("value_total_d").value


      if (value_desconto_d == '') {
        var rodape = ` *Pagamento:%20Cartão%20de%20Debito*%0A%0A*Valor%20Final%20do%20carrinho:*%20${formatarInput(value_total_d)}`;

      } else {
        var rodape = ` %0A%0A*Pagamento:%20Cartão%20de%20Debito*%0A*Total:*%20${formatarInput(value_semDesconto_d)}%0A*Juros:*%20${formatarInput(value_desconto_d)}%0A%0A*Valor%20Final%20do%20carrinho:*%20${formatarInput(value_total_d)}`;

      }


      
    }
    var mensagemCompleta = "https://wa.me/55" + numero + "?text=" + cabecalho + novaString + rodape;
//-----------------------------------------------------------------------------------------------
  
   window.location.href = mensagemCompleta;

 
}
