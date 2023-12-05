
//validacoes do cadastro

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
//senha_login.addEventListener('input', verifica)
email_login.addEventListener('input', verifica)




          




    