// -------------------=-------------------------- taxas de avista ------------------------------------------=-----------
let avista = document.getElementById("btn-avista")
let ctn_avista = document.getElementById("avista_container")
let ctn_avista_opc = document.getElementById("opc_avista_container")
let taxa_avista = document.getElementById("taxa_avista")
let btn_avista = document.getElementById("btn-avista")
let input_taxa = document.getElementById("avistaTaxa")

let opc1 = document.getElementById("opc1")
let opc2 = document.getElementById("opc2")

let clicado1 = false
function func_avista() {
    if (clicado1 == false) {
        ctn_avista_opc.style.display = "block"
        clicado1 = true
        clicado2 = true
        clicado3 = true
        func_credito()
        func_debito()

        if (opc2.checked) {
            taxa_avista.style.display = "block"
        }
        

    } else {
        ctn_avista_opc.style.display = "none"
        taxa_avista.style.display = "none"
        clicado1 = false
        if (opc2.checked) {
            taxa_avista.style.display = " none"
        }
        

    }
    
}
function semDesconto() {
    taxa_avista.style.display = "none"
    input_taxa.value = ""
    
}


function taxaAvista() {
    taxa_avista.style.display = " block"
}


btn_avista.addEventListener("click", func_avista)
opc1.addEventListener('click', semDesconto )
opc2.addEventListener('click', taxaAvista)

// -------------------=-------------------------- taxas de credito ------------------------------------------=-----------
let credito_container = document.getElementById("credito_container")
let btn_credito = document.getElementById("btn-credito")
let opc_credito_container = document.getElementById("opc_credito_container")
let taxa_credito = document.getElementById("taxa_credito")
let opc2_crd = document.getElementById("opc2_crd")
let opc1_crd = document.getElementById("opc1_crd")


let clicado2 = false
function func_credito() {
    if (clicado2 == false) {
        opc_credito_container.style.display = "block"
        clicado2 = true
        if (opc2_crd.checked) {
            taxa_credito.style.display = "block"
        }

        clicado1 = true
        clicado3 = true
        func_avista()
        func_debito()

    } else {
        opc_credito_container.style.display = "none"
        taxa_credito.style.display = "none"

        clicado2 = false
    }

}
 
function taxaCredito() {
   taxa_credito.style.display = "block"
}
function semTaxa_Credito() {
    taxa_credito.style.display = "none"
    
 }

opc2_crd.addEventListener('click', taxaCredito)
opc1_crd.addEventListener('click', semTaxa_Credito)

btn_credito.addEventListener("click", func_credito)

// -------------------=-------------------------- taxas de debito ------------------------------------------=-----------
let debito_container = document.getElementById("debito_container")
let btn_debito = document.getElementById("btn-debito")
let opc_debito_container = document.getElementById("opc_debito_container")
let taxa_debito = document.getElementById("taxa_debito")
let opc2_deb = document.getElementById("opc2_deb")
let opc1_deb = document.getElementById("opc1_deb")


let clicado3 = false
function func_debito() {
    if (clicado3 == false) {
        opc_debito_container.style.display = "block"
        clicado3 = true
        if (opc2_deb.checked) {
            taxa_debito.style.display = "block"
        }

        clicado1 = true
        clicado2 = true
        func_avista()
        func_credito()
    } else {
        opc_debito_container.style.display = "none"
        taxa_debito.style.display = "none"

        clicado3 = false
    }

}
 
function taxaDebito() {
   taxa_debito.style.display = "block"
}
function semTaxa_Debito() {
    taxa_debito.style.display = "none"
 }

opc2_deb.addEventListener('click', taxaDebito)
opc1_deb.addEventListener('click', semTaxa_Debito)

btn_debito.addEventListener("click", func_debito)

//-------------------------------------------- montar o json ------------------------------------------------------------------------
function criarJSON() {
    var jsonData = {
        "taxas": {
            "avista": {
                "taxa": true,
                "valor": []
            },
            "credito": {
                "taxa": [],
                "valores": {}
            },
            "debito": {
                "taxa": [],
                "valor": {}
            }
        }
       
    };

    // Verifica se a opção de desconto para compras a vista/pix está selecionada
    jsonData.taxas.avista.taxa = document.getElementById('opc2').checked;
    if (document.getElementById('opc2').checked) {
        jsonData.taxas.avista.valor = (document.getElementById("avistaTaxa").value == '') ? 0 : document.getElementById("avistaTaxa").value
    }

    // Preenche as taxas de crédito
    for (var i = 1; i <= 12; i++) {
        var isChecked = document.querySelector('input[name="' + i + 'x_crd"]:checked');
        var valorElement = document.querySelector('input[name="cTaxa' + i +'"]');
        
        // Verifica se o elemento foi encontrado antes de acessar sua propriedade 'value'
        var valor = isChecked ? (valorElement ? parseFloat(valorElement.value) || 0 : 0) : 0;

        jsonData.taxas.credito.valores[i + 'x'] = isChecked ? [true, valor] : [false];
    }
    if(document.getElementsByName("opc_crd")[0].checked) {
        jsonData.taxas.credito.taxa = document.getElementsByName("opc_crd")[0].value

    } else{
        jsonData.taxas.credito.taxa = document.getElementsByName("opc_crd")[1].value
    }


    // Preenche as taxas de débito
       let dTaxa = document.getElementById('dTaxa').value  
       
       let radio_debito = document.getElementById('opc2_deb')
        
       if (radio_debito.checked == true && dTaxa !== '') {
        jsonData.taxas.debito.taxa = 'true'
        jsonData.taxas.debito.valor = dTaxa

       } else {

        jsonData.taxas.debito.taxa = 'false'
        jsonData.taxas.debito.valor = false
       }
        
   

   // Exibe o JSON criado no console (pode ser removido em produção)
   // console.log(JSON.stringify(jsonData, null, 2));

    var inputJson = document.createElement('input');
    inputJson.type = 'hidden';
    inputJson.name = 'json_data';
    inputJson.value = JSON.stringify(jsonData);

    console.log(jsonData);

    return inputJson
}

document.getElementById('meuForm').addEventListener('submit', function(event) {
    // Evitar o envio padrão do formulário
    
    event.preventDefault();
  
    this.appendChild(criarJSON())
  
    
    this.submit();
  });
  