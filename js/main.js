/* Source pour créer le tableau
https://www.youtube.com/watch?v=sr9XJJVbpw0 */

/*
 * Création du jeu et la grille pour la diffculté  
 */
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    //Bonne Reponse
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    //Bonne Reponse
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    //Bonne Reponse
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

//Ces fonctions vont nous sauver beaucoup de temps (helpers functions)
//Cela veut dire au lieu d'écrire document.getElementById(id); 
//on peut faire appelle à la fonction id(id) et ça va le reconnaître
//etc....
function id(id) {
    return document.getElementById(id);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}

function qs(selector) {
    return document.querySelector(selector);
}
/***************************************************************************************************************************************/

//Création des variables globales qui va être utliser pour le jeu
var vies = 3;
var numeroChoisi;
var caseChoisi;
var selectionInactive;
var interval;

//Créations des buttons et des fonctions qui vont commencer le jeu (ou recommencer la joute)
let btnFacile = id("btn-facile");
let btnMoyenne = id("btn-moyenne");
let btnDifficle = id("btn-difficle");
let btnRestart = id("btnRestart");
//Création de la minuterie 
let minutesLbl = id("minutes");
let minutes = 0;
let secondes = 0;
let secondesLbl = id("secondes");
let minuterie = id("minuterie");
let tempsTotal = 0;


/***************************************************************************************************************************************/

//Cette fonction va faire que le btnRestart soit pas cliquable lorsqu'on ouvre l'onglet 
window.onload = function () {
    btnRestart.disabled = true;
    minutesLbl.style.visibility = "hidden";
    secondesLbl.style.visibility = "hidden";
    minuterie.style.visibility = "hidden";

}

//Créations des boutons pour les difficultés
btnFacile.onclick = function () {
    let jeu;
    jeu = easy[0];
    genererJeu(jeu);
    //Il faut désactiver les autres buttons puisqu'on a juste choisi juste ce bouton. 
    btnMoyenne.disabled = true;
    btnDifficle.disabled = true;
    btnFacile.style.background = "#ff0000";
    btnFacile.style.color = "#ffffff";
    btnDifficle.style.borderColor = "black";
    btnMoyenne.style.borderColor = "black";
    btnRestart.disabled = false;
    //Faire la minuterie visible 
    minuterie.style.visibility = "visible";
    minutesLbl.style.visibility = "visible";
    secondesLbl.style.visibility = "visible";
    //On ajoute une fonction qui fait les chiffres clickable 
    id("chiffre-container").addEventListener("click", numeroClickable)
}
btnMoyenne.onclick = function () {
    let jeu;
    jeu = medium[0];
    genererJeu(jeu);
    //Il faut désactiver les autres buttons puisqu'on a juste choisi juste ce bouton. 
    btnFacile.disabled = true;
    btnDifficle.disabled = true;
    btnMoyenne.style.background = "#ff0000";
    btnMoyenne.style.color = "#ffffff";
    btnDifficle.style.borderColor = "black";
    btnFacile.style.borderColor = "black";
    btnRestart.disabled = false;
    //Faire la minuterie visible 
    minuterie.style.visibility = "visible";
    minutesLbl.style.visibility = "visible";
    secondesLbl.style.visibility = "visible";
    //On ajoute une fonction qui fait les chiffres clickable 
    id("chiffre-container").addEventListener("click", numeroClickable)

}
btnDifficle.onclick = function () {
    let jeu;
    jeu = hard[0];
    genererJeu(jeu);
    //Il faut désactiver les autres buttons puisqu'on a juste choisi juste ce bouton.
    btnMoyenne.disabled = true;
    btnFacile.disabled = true;
    btnDifficle.style.background = "#ff0000";
    btnDifficle.style.color = "#ffffff";
    btnMoyenne.style.borderColor = "black";
    btnFacile.style.borderColor = "black";
    btnRestart.disabled = false;
    //Faire la minuterie visible 
    minuterie.style.visibility = "visible";
    minutesLbl.style.visibility = "visible";
    secondesLbl.style.visibility = "visible";
    //On ajoute une fonction qui fait les chiffres clickable 
    id("chiffre-container").addEventListener("click", numeroClickable)
}

//Création d'un bouton pour recommencer la joute (réinitlaliser les variables)
btnRestart.onclick = function() {
    supprimerJeu();
    //Recommencer la minuterie
    clearInterval(interval);
    secondes = "00";
    minutes = "00";
    secondesLbl.innerHTML = secondes;
    minutesLbl.innerHTML = minutes;
    tempsTotal = 0;
    vies = 3;
    minutesLbl.style.visibility = "hidden";
    secondesLbl.style.visibility = "hidden";
    minuterie.style.visibility = "hidden";
    //Dés que le bouton est cliquer on veut qu'on le cliquer pas encore
    btnRestart.disabled = false;
    //On supprimer la fonction qui fait les chiffres clickable  puisqu'on veut pas les cliquer encore 
    id("chiffre-container").removeEventListener("click", numeroClickable, true);
}
//Cette fonction fait les numero comme des boutons lorsqu'on a choisi un des difficultés. 
function numeroClickable() {
    for (let i = 0; i < id("chiffre-container").children.length; i++) {
        id("chiffre-container").children[i].addEventListener("click", function () {
            if (!selectionInactive) {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    numeroChoisi = null;
                } else {
                    for (let i = 0; i < 9; i++) {
                        id("chiffre-container").children[i].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    numeroChoisi = this;
                    updateMove();
                }
            }
        });
    }
}
/***************************************************************************************************************************************/
//Cette fonction va générer un jeu selon le bouton choisi comme paramètre. 
function genererJeu(jeu) {
    supprimerJeu(); //On éviter de créer plusieurs tableaux
    let idCount = 0;
    //Créations des cases
    for (let i = 0; i < 81; i++) {
        let nombre = document.createElement("p");
        if (jeu.charAt(i) != "-") {
            nombre.textContent = jeu.charAt(i);
        } else {
            nombre.addEventListener("click", function () {
                if (!selectionInactive) {
                    if (nombre.classList.contains("selected")) {
                        nombre.classList.remove("selected");
                        caseChoisi = null;
                    } else {
                        for (let i = 0; i < 81; i++) {
                            qsa(".case")[i].classList.remove("selected");
                        }
                        nombre.classList.add("selected");
                        caseChoisi = nombre;
                        updateMove();
                    }
                }
            });
        }
        //Identifier chaque case 
        nombre.id = idCount;
        idCount++;
        nombre.classList.add("case");
        //Ajouter les bordures 
        if ((nombre.id > 17 && nombre.id < 27) || (nombre.id > 44 && nombre.id < 54)) {
            nombre.classList.add("bordureBas");
        }
        if ((nombre.id + 1) % 9 == 3 || (nombre.id + 1) % 9 == 6) {
            nombre.classList.add("bordureDroit");
        }
        id("sudoku-map").appendChild(nombre);
    }
    let para = document.createElement("div");
    let node = document.createTextNode("Vies restantes: " + vies);
    para.appendChild(node);
    id("vies").appendChild(para);
    if (interval) {
        clearInterval(interval);
    }
    //création du stopwatch
    interval = setInterval(creationTemps, 1000);
}

function updateMove() {
    if (caseChoisi && numeroChoisi) {
        caseChoisi.textContent = numeroChoisi.textContent;
        if (bonneReponse(caseChoisi)) {
            caseChoisi.classList.remove("selected");
            numeroChoisi.classList.remove("selected");
            caseChoisi = null;
            numeroChoisi = null;
            if (checkWin()) {
                finirJoute();
            }
        } else {
            selectionInactive = true;
            caseChoisi.classList.add("mauvaiseReponse");
            setTimeout(function () {
                vies--;
                if (vies == 0) {
                    finirJoute();
                } else {
                    id("vies").textContent = "Vies restantes: " + vies;
                    selectionInactive = false;
                }
                caseChoisi.classList.remove("mauvaiseReponse");
                caseChoisi.classList.remove("selected");
                numeroChoisi.classList.remove("selected");
                caseChoisi.textContent = "";
                caseChoisi = null;
                numeroChoisi = null;
            }, 1000);
        }
    }
}

//Selon la case choisi et la difficulté elle va vérifier si on obtendu la bonne réponse
function bonneReponse(caseChoisi) {
    let solution;
    let reponse = id("difficulte");
    if (reponse = btnFacile) solution = easy[1]; //
    else if (reponse = btnMoyenne) solution = medium[1];
    else solution = hard[1];
    if (solution.charAt(caseChoisi.id) === caseChoisi.textContent) return true;
    else return false;
}
//Cette fonction  va  vérifier lorsqu'on a gagné 
function checkWin() {
    let cases = qsa(".case");
    for (let i = 0; i < cases.length; i++) {
        if (cases[i].textContent === "") return false;
    }
    return true;
}
//À la fin de la joute on a mis des conditions si on gagné ou perdu. On aussi recommencer le stopwatch. 
function finirJoute() {
    selectionInactive = true;
    clearInterval(interval);
    if (vies == 0) {
        id("vies").textContent = "Vous avez perdu!";
    }
    else {
        id("vies").textContent = "Vous avez gagné!!!";
    }
    id("chiffre-container").removeEventListener("click", numeroClickable, true);
}
//Cette fonction fait suprimer le jeu (cases) lorsqu'on a soit perdu ou cliquer recommencer 
function supprimerJeu() {
    let cases = qsa(".case");
    for (i = 0; i < cases.length; i++) {
        cases[i].remove();
    }
    //btnFacile
    if (btnMoyenne.disabled == true && btnDifficle.disabled == true) {
        btnMoyenne.disabled = false;
        btnDifficle.disabled = false;
        btnFacile.disabled = false;
        btnFacile.style.background = "#e7e7e7";
        btnFacile.style.color = "black";
        btnFacile.style.borderColor = "black";
        btnRestart.disabled = true;
    }
    //btnMoyenne
    else if (btnFacile.disabled == true && btnDifficle.disabled == true) {
        btnFacile.disabled = false;
        btnDifficle.disabled = false;
        btnMoyenne.disabled = false;
        btnMoyenne.style.background = "#e7e7e7";
        btnMoyenne.style.color = "black";
        btnMoyenne.style.borderColor = "black";
        btnRestart.disabled = true;
    }
    //btnDifficle
    else if (btnFacile.disabled == true && btnMoyenne.disabled == true) {
        btnFacile.disabled = false;
        btnDifficle.disabled = false;
        btnMoyenne.disabled = false;
        btnDifficle.style.background = "#e7e7e7";
        btnDifficle.style.color = "black";
        btnDifficle.style.borderColor = "black";
        btnRestart.disabled = true;
    }
    const textVies = id("vies");
    textVies.textContent = "";

}
/***************************************************************************************************************************************/
/* Source pour créer le stopwatch
https://stackoverflow.com/a/5517836
*/

//Création de la minuterie
function creationTemps() {
    tempsTotal++;
    secondesLbl.innerHTML = covertirTemps(tempsTotal % 60);
    minutesLbl.innerHTML = covertirTemps(parseInt(tempsTotal / 60));
}
//Convertir le temps à 00:01......
//Sans cette fonction ça sera 0:1......
function covertirTemps(val) {
    let valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    }
    else {
        return valString;
    }
}

/***************************************************************************************************************************************/