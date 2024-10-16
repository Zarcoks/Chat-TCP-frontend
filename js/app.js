import * as ajax from "./ajax.js";
import * as builder from "./gestionnaireHtml.js";
import {getCurrentDateTime} from "./utils.js";

const url = "http://kevin-chapron.fr:8080"
const codePermanent = "JOSV14080400"
let user


/**
 * Met à jour le pseudo affiché en fonction du nom de l'utilisateur
 * @param user objet contenant au moins l'attribut Name
 */
function updateUser(user) {
    document.querySelector("form > div:first-child").innerText = user.Name;
}

function sendConnected() {
    builder.ajouterMessage(builder.construireArticle(getCurrentDateTime(), "Local", "Vous êtes bien connecté !"))
}

/**
 * @param requete (xmlHTTPRequest) avec status de réponse
 */
function connecte(requete) {
    if (requete.status === 200) {
        // Enregistre le user si la requete s'est bien passée
        // Note: on est à priori sûr que le parse va marcher
        user = JSON.parse(requete.responseText)

        // Met à jour le nom de l'utilisateur dans la partie basse du HTML
        updateUser(user)

        // Lancer le loading des messages
        ajax.envoyerRequete('GET', url + "/messages", loaderMessages, null, ["Authorization", "Basic " + user.Token])
    } else {
        // Signaler si la requete s'est pas bien passée
        alert("Erreur de connexion: " + JSON.parse(requete.responseText).error)
    }
}

/**
 * Ajoute chaque message au HTML puis un connected
 * Note: les dates sont déjà triées par ordre croissant
 */
function loaderMessages(requete) {
    const allMessages = JSON.parse(requete.responseText)
    for (let i in allMessages) {
        let elt = allMessages[i]
        let date = elt.Date.split("T") // Permet le formattage
        builder.ajouterMessage(builder.construireArticle(date[0] + " " + date[1], elt.From, elt.Text))
    }
    // Affiche le message de confirmation de connexion
    sendConnected()
}

// Connexion avec le code permanent
ajax.envoyerRequete('POST', url + "/login", connecte, JSON.stringify({"Code": codePermanent}))
