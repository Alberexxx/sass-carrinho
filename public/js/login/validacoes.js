
//validacoes do cadastro
var caixaTexto = document.getElementById("inputEmail");
var botao_cadastro = document.getElementById('btn-cadastro');
botao_cadastro.disabled = true;
botao_cadastro.style.backgroundColor = "#fff";
botao_cadastro.style.color = 'black'

var aviso = document.getElementById("validaEmail");


var senha1 = document.getElementById("senha1")
var senha2 = document.getElementById("senha2")
var aviso_igual = document.getElementById("aviso_igual")


caixaTexto.addEventListener('input', () => {

    var aviso = document.getElementById("validaEmail");
    var inputId = caixaTexto.value;
    
    const url = '/validaEmail';
   
    const requestOptions = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputId: inputId})
    };

    if ((inputId.includes("@")) ) {

        var posicaoArroba = inputId.indexOf("@");
        if (inputId.length > posicaoArroba + 1) {
        
            fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro na solicitação.');
                }
                return response.text(); 
            })
            .then((data) => {
                renderConteudo(data); 
            })
            .catch((error) => {
                console.error('Erro:', error);
            });

            function renderConteudo(texto) {

                aviso.innerHTML = texto;
                botao_cadastro.disabled = true;
                botao_cadastro.backgroundColor = "#fff"
                
            }

    } else {
        aviso.innerHTML = "";
        

    }
} else {
    aviso.innerHTML = "";
}

function validarFormulario() {
    var emailValido = aviso.textContent === ""; 
    var senhasCoincidem = aviso_igual.textContent === "Senhas coincidem!"; 
    
    if (emailValido && senhasCoincidem) {
      botao_cadastro.disabled = false;
      botao_cadastro.style.backgroundColor = ""

    } else {
      botao_cadastro.disabled = true;
      botao_cadastro.backgroundColor = "#fff"

    }
}

validarFormulario()



});



function verificarSenhas() {
    var senha1Valor = senha1.value;
    var senha2Valor = senha2.value;
  
    if (senha2Valor !== '') {

        if (senha1Valor === senha2Valor && senha1Valor !== '' && senha2Valor !== '') {
            aviso_igual.textContent = "Senhas coincidem!";
            aviso_igual.style.color = "#7CFC00";
    } else {
        aviso_igual.textContent = "As senhas são diferentes";
        aviso_igual.style.color = "red";

    }
    } else {
        aviso_igual.textContent = "";

    }

    function validarFormulario() {
        var emailValido = aviso.textContent === ""; 
        var senhasCoincidem = aviso_igual.textContent === "Senhas coincidem!"; 
        
        if (emailValido && senhasCoincidem) {
          botao_cadastro.disabled = false;
          botao_cadastro.style.backgroundColor = ""

        } else {
          botao_cadastro.disabled = true;
          botao_cadastro.backgroundColor = "#fff"

        }
    }

    validarFormulario()
    
    
  }

  senha1.addEventListener("input", verificarSenhas);
  senha2.addEventListener("input", verificarSenhas);



// validacoes do login --------------------------------------------------------------------------------------------------------------

var email_login = document.getElementById("email_login");
var senha_login = document.getElementById("senha_login");
var avisoLogin = document.getElementById("aviso_login");    
var btn_login = document.getElementById("btnLogin");
btn_login.style.backgroundColor = "#fff"
btn_login.style.color = 'black'

btn_login.disabled = true
   
    function verifica() {

        var senhaValor = senha_login.value;
        var emailValor = email_login.value;
        const url = '/verificaEmailSenha';
        
            const requestOptions = {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ senha: senhaValor, email: emailValor})
            };

          fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro na solicitação.');
                }
                return response.text(); 
            })
            .then((data) => {

                if(data != '') {
                    renderConteudo(data); 
                    btn_login.style.backgroundColor = ""
                    btn_login.disabled = true

                } else {
                    avisoLogin.innerHTML = '';
                    btn_login.style.backgroundColor = "#7CFC00"
                    btn_login.disabled = false

                }

                
            })
            .catch((error) => {
                console.error('Erro:', error);
            });

            function renderConteudo(texto) {
                avisoLogin.innerHTML = texto;
                avisoLogin.style.color = "red"
               
            }
    }

var email_login = document.getElementById("email_login")
var senha_login = document.getElementById("senha_login")
senha_login.addEventListener('input', verifica)
email_login.addEventListener('input', verifica)




          




    