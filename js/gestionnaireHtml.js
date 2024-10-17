/**
 * @param date string format [2019-10-24 16:52:14]
 * @param login string
 * @param message string
 * @returns {HTMLElement} la div article du message complet (avec date, login, message) construite
 */
export function construireArticle(date, login, message) {
    const divDate = document.createElement('div');
    divDate.innerText = date;
    const divLogin = document.createElement('div');
    divLogin.innerText = "(" + login + ")";
    const divMessage = document.createElement('div');
    divMessage.innerText = message;
    const article = document.createElement('article');
    article.appendChild(divDate);
    article.appendChild(divLogin);
    article.appendChild(divMessage);
    return article;
}

/**
 * Ajoute à la div des message le message en paramètre
 * @param message le message en HTMLElement à ajouter
 */
export function ajouterMessage(message) {
    if (message instanceof HTMLElement)
        document.getElementById("divDesMessages").appendChild(message)
    else
        console.error("Le message n'est pas valide.")
}