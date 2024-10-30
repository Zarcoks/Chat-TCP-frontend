/**
 * @param date string format [2019-10-24 16:52:14]
 * @param login string
 * @param message string
 * @returns {HTMLElement} la div article du message complet (avec date, login, message) construite
 */
export function construireArticleMessage(date, login, message) {
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

/**
 * En fonction de la date d'envoi d'un message, renvoi le status associé
 * @param date
 * @returns {string|string}
 */
function getStatus(date) {
    const formatDate = new Date(date)
    const tempsDuMessage = Math.round((Date.now() - formatDate)/60000); // En minutes
    return tempsDuMessage <= 5 ? "Connecté" : tempsDuMessage > 720 ? "Déconnecté" : ("Connecté il y a " + tempsDuMessage + " minutes.")
}

/**
 * Construit la balise span d'un seul utilisateur connecté, en déterminant préalablement le status
 * @param login
 * @param date
 * @returns {HTMLSpanElement}
 */
export function construireArticleConnecte(login, date) {
    const span = document.createElement("span")
    span.innerText = login + ": " + getStatus(date)

    // met à jour le status toutes les minutes
    setInterval(function() {
        span.innerText = login + ": " + getStatus(date)
    }, 60000);

    return span
}

/**
 * Ajoute la span en parametre à la balise aside
 * @param span
 */
export function ajouterUserConnecte(span) {
    if (span instanceof HTMLElement)
        document.querySelector("aside").appendChild(span);
    else
        console.error("L'utilisateur à ajouter n'est pas valide.")
}

/**
 * Enlève tous les éléments de la balise aside
 */
export function clearUserConnecte() {
    document.querySelector("aside").innerHTML = ""
}