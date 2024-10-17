/*****************************************/
/*          Chat - Victor JOST           */
/*****************************************/

/**
 * Ce projet a été cette fois réalisé avec encore plus de plaisir que le dernier sur Nami-san.
 *
 * Toutefois, je peux me reprocher de ne pas avoir travaillé la qualité du code, notamment au niveau
 * de la gestion d'erreur.
 *
 * En javascript je ne sais pas comment on fait, et j'ai jugé que cela me couterait trop de temps
 * comparé à la valeur ajoutée, qui plus est dans la période examen où le temps se fait très précieux...
 *
 * Disons que si le projet avait été ammené plus loin, je l'aurai fait sans hésiter.
 *
 * J'espère que cela ne sera pas trop gênant, je tâche actuellement de documenter le code pour qu'il soit un minimum
 * compréhensible.
 */

import * as ajax from "./ajax.js";
import * as builder from "./gestionnaireHtml.js";
import {getWebsocket} from "./websocket.js";

const url = "kevin-chapron.fr:8080"
const codePermanent = "JOSV14080400"
let user // Portée globale - user
let ws   // Portée globale - websocket


/**
 * Met à jour le pseudo affiché en fonction du nom de l'utilisateur
 * @param user objet contenant au moins l'attribut Name de l'utilisateur connecté
 */
function updateUser(user) {
    document.querySelector("form > div:first-child").innerText = user.Name;
}

/**
 * Fonction actionnée lors de la réponse du serveur
 * @param requete (xmlHTTPRequest) après retour du serveur seulement
 */
function connecte(requete) {
    if (requete.status === 200) {
        // Enregistre le user si la requete s'est bien passée
        user = JSON.parse(requete.responseText)

        // Met à jour le nom de l'utilisateur dans la partie basse du HTML
        updateUser(user)

        // Lancer le loading des messages
        ajax.envoyerRequete('GET', "http://" + url + "/messages", loaderMessages, null, ["Authorization", "Basic " + user.Token])
    } else {
        // Signaler si la requete s'est pas bien passée
        alert("Erreur de connexion: " + JSON.parse(requete.responseText).error)
    }
}

/**
 * Fonction appelée lors de la réception des 50 derniers messages
 * Ajoute chaque message au HTML puis lance la connexion au websocket
 * Note: les dates sont déjà triées par ordre croissant
 */
function loaderMessages(requete) {
    const allMessages = JSON.parse(requete.responseText)
    for (let i in allMessages) {
        let elt = allMessages[i]
        let date = elt.Date.split("T") // Permet le formattage
        builder.ajouterMessage(builder.construireArticleMessage(date[0] + " " + date[1], elt.From, elt.Text))
    }
    updateConnectedPeople()
    connexionWebsocket()
}

function unifierList(allMessages) {
    let listeAvecDate = []
    let listeSansDate = []
    const list = allMessages.reverse()
    for (let i in list) {
        if (!listeSansDate.includes(list[i].From)) {
            listeSansDate.push(list[i].From)
            listeAvecDate.push(list[i])
        }
    }
    return listeAvecDate
}

function receiveMessagesToUpdate(requete) {
    updateConnectedPeople(JSON.parse(requete.responseText))
}

/**
 * Clear et remet les utilisateurs connecté
 * @param allMessages
 */
function updateConnectedPeople(allMessages=null) {
    if (allMessages === null)
        ajax.envoyerRequete('GET', "http://" + url + "/messages", receiveMessagesToUpdate, null, ["Authorization", "Basic " + user.Token])
    else {
        builder.clearUserConnecte()
        const listeUnifiee = unifierList(allMessages)
        for (let i in listeUnifiee) {
            let span = builder.construireArticleConnecte(listeUnifiee[i].From, listeUnifiee[i].Date)
            builder.ajouterUserConnecte(span)
        }
    }
}

/*
 * ----------------------------------------- *
 *             Partie Websocket              *
 * ----------------------------------------- *
 */

/**
 * Fonction appelée lorsque la connexion au websocket est établie
 * Envoie les informations d'authentification
 * @param event
 */
function connexionOuverte(event) {
    // Authentification
    ws.send(JSON.stringify({"auth": user.Token}));
}

/**
 * Fonction appelée lorsque la connexion avec le websocket est fermée
 * Ne fait rien pour l'instant, on aurait pu mettre une alerte "connexion fermée" mais c'est plus gênant qu'autre chose
 * @param event
 */
function connexionFermee(event) {}

/**
 * Fonction appelée quand un message est reçu.
 * Affiche le message reçu dans le HTML
 * @param event
 */
function messageRecu(event) {
    let elt = JSON.parse(event.data)
    let date = elt.Date.split("T") // Permet le formattage
    builder.ajouterMessage(builder.construireArticleMessage(date[0] + " " + date[1], elt.From, elt.Text))
    updateConnectedPeople()
}

/**
 * Appelée en cas d'erreur dans la connexion
 * Met juste un message pour le debug.
 * A développer si le projet prend de l'ampleur
 * @param event
 */
function erreurRecu(event) {
    console.error("Erreur: " + event);
}

/**
 * Fonction pour lancer le websocket.
 */
function connexionWebsocket() {
    ws = getWebsocket("ws://" + url + "/ws", connexionOuverte, connexionFermee, messageRecu, erreurRecu)
}

// Listener sur l'input pour envoyer des messages via le websocket
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault() // enlever l'action de base du form
    const messageInput = document.getElementById("messageInput")
    let message = {"message": messageInput.value} // construction du JSON
    if (ws !== null && messageInput.value !== "") { // empeche les messages vides
        ws.send(JSON.stringify(message))
        messageInput.value = "" // On vide la balise, parce qu'on ne veut pas garder le dernier message qu'on a envoyé dans l'input
    }
});

// Connexion avec le code permanent (premiere fonction appelée du programme)
ajax.envoyerRequete('POST', "http://" + url + "/login", connecte, JSON.stringify({"Code": codePermanent}))