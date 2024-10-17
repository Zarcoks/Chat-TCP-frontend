/**
 * @var methode (string): la méthode de la requete (GET, POST...) en chaine de charactères
 * @var url (string): l'url en chaine de charactères vers lequel envoyer la requete
 * (forme http://example.com:8080/un_chemin
 * @var data (string): string des données à envoyer (à JSON.stringify() avant) (null par défault)
 * @var header (tableau): le tableau contenant le titre du header et sa valeur (null par défault)
 */
export function envoyerRequete(methode, url, fonctionRetour, data=null, header=null) {
    let requete = new XMLHttpRequest();
    requete.open(methode, url);
    if (header !== null)
        requete.setRequestHeader(header[0], header[1]);
    if (fonctionRetour != null)
        requete.onload = () => fonctionRetour(requete)
    requete.send(data);
}