const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');

const signUp2link = document.getElementById('signUp2');

const signIn2Link = document.getElementById('signIn2');

const container = document.getElementById('container');


signUp2link.addEventListener('click', () =>
    container.classList.add('right-panel-active'));



  /*  const queryString = window.location.search;

    // Remove o ponto de interrogação inicial, se houver
    const queryParams = new URLSearchParams(queryString.substring(1));

    // Obtém o valor associado à chave 'mensagem'
    const mensagem = queryParams.get('mensagem');

   
    if (mensagem != undefined) {
        // Crie um novo elemento de parágrafo
    var paragrafo = document.createElement('p');
    paragrafo.id = 'email_existe';

    // Defina o conteúdo do parágrafo usando textContent ou innerHTML
    paragrafo.textContent = `${mensagem}`;

    // Anexe o parágrafo ao elemento body (ou qualquer outro elemento desejado)
    document.body.appendChild(paragrafo);

}
*/

