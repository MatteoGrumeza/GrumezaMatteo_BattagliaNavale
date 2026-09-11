const DIMENSIONE_GRIGLIA = 8;
const grigliaElemento = document.getElementById("griglia-gioco");
const tentativiElemento = document.getElementById("contatore-tentativi");
const naviElemento = document.getElementById("navi-rimaste");
const cronometroElemento = document.getElementById("cronometro");
const messaggioElemento = document.getElementById("messaggio-stato");
const bottoneGioca = document.getElementById("bottone-gioca");
const bottoneRicomincia = document.getElementById("bottone-ricomincia");

let matriceGioco = [];
let tentativi = 0;
let partiNaveRimaste = 0;
let naviRimaste = 4;
let intervalloTimer = null;
let secondiTrascorsi = 0;
let giocoAttivo = false;

const lunghezzeNavi = [4, 3, 2, 1];

function inizializzaGioco() {
  matriceGioco = [];
  for (let i = 0; i < DIMENSIONE_GRIGLIA; i++) {
    let riga = [];
    for (let j = 0; j < DIMENSIONE_GRIGLIA; j++) {
      riga.push(0);
    }
    matriceGioco.push(riga);
  }

  tentativi = 0;
  secondiTrascorsi = 0;
  giocoAttivo = true;
  naviRimaste = lunghezzeNavi.length;
  partiNaveRimaste = 0;

  tentativiElemento.textContent = tentativi;
  naviElemento.textContent = naviRimaste;
  messaggioElemento.textContent = "Partita iniziata! Clicca sulla griglia per sparare.";

  clearInterval(intervalloTimer);
  cronometroElemento.textContent = "00:00";
  intervalloTimer = setInterval(aggiornaCronometro, 1000);

  posizionaNaviCasualmente();
  generaGriglia();
}

function posizionaNaviCasualmente() {
  for (let i = 0; i < lunghezzeNavi.length; i++) {
    let lunghezza = lunghezzeNavi[i];
    let posizionata = false;

    while (!posizionata) {
      let orizzontale = Math.random() < 0.5;
      let rigaInizio, colonnaInizio;

      if (orizzontale) {
        rigaInizio = Math.floor(Math.random() * DIMENSIONE_GRIGLIA);
        colonnaInizio = Math.floor(Math.random() * (DIMENSIONE_GRIGLIA - lunghezza + 1));
      } else {
        rigaInizio = Math.floor(Math.random() * (DIMENSIONE_GRIGLIA - lunghezza + 1));
        colonnaInizio = Math.floor(Math.random() * DIMENSIONE_GRIGLIA);
      }

      let spazioLibero = true;
      for (let k = 0; k < lunghezza; k++) {
        let r = orizzontale ? rigaInizio : rigaInizio + k;
        let c = orizzontale ? colonnaInizio + k : colonnaInizio;
        if (matriceGioco[r][c] !== 0) {
          spazioLibero = false;
          break;
        }
      }

      if (spazioLibero) {
        for (let k = 0; k < lunghezza; k++) {
          let r = orizzontale ? rigaInizio : rigaInizio + k;
          let c = orizzontale ? colonnaInizio + k : colonnaInizio;
          matriceGioco[r][c] = i + 1;
          partiNaveRimaste++;
        }
        posizionata = true;
      }
    }
  }
}

function generaGriglia() {
  grigliaElemento.innerHTML = "";

  for (let r = 0; r < DIMENSIONE_GRIGLIA; r++) {
    for (let c = 0; c < DIMENSIONE_GRIGLIA; c++) {
      const cella = document.createElement("div");
      cella.classList.add("cella");

      cella.addEventListener("click", function () {
        gestisciColpo(r, c, cella);
      });

      grigliaElemento.appendChild(cella);
    }
  }
}

function gestisciColpo(riga, colonna, cella) {
  if (!giocoAttivo) return;

  if (cella.classList.contains("colpito") || cella.classList.contains("acqua")) {
    messaggioElemento.textContent = "Cella già selezionata! Scegli un altro punto.";
    return;
  }

  tentativi++;
  tentativiElemento.textContent = tentativi;

  if (matriceGioco[riga][colonna] > 0) {
    let idNave = matriceGioco[riga][colonna];
    cella.classList.add("colpito");
    cella.textContent = "💥";
    partiNaveRimaste--;

    if (controllaNaveAffondata(idNave)) {
      naviRimaste--;
      naviElemento.textContent = naviRimaste;
      messaggioElemento.textContent = "Nave affondata!";
    } else {
      messaggioElemento.textContent = "Colpito!";
    }

    if (partiNaveRimaste === 0) {
      concludiGioco();
    }
  } else {
    cella.classList.add("acqua");
    cella.textContent = "🌊";
    messaggioElemento.textContent = "Acqua!";
  }
}

function controllaNaveAffondata(idNave) {
  for (let r = 0; r < DIMENSIONE_GRIGLIA; r++) {
    for (let c = 0; c < DIMENSIONE_GRIGLIA; c++) {
      if (matriceGioco[r][c] === idNave) {
        let indiceCella = r * DIMENSIONE_GRIGLIA + c;
        let cella = grigliaElemento.children[indiceCella];
        if (!cella.classList.contains("colpito")) {
          return false;
        }
      }
    }
  }
  return true;
}

function aggiornaCronometro() {
  secondiTrascorsi++;
  let minuti = Math.floor(secondiTrascorsi / 60);
  let secondi = secondiTrascorsi % 60;

  if (minuti < 10) minuti = "0" + minuti;
  if (secondi < 10) secondi = "0" + secondi;

  cronometroElemento.textContent = minuti + ":" + secondi;
}

function concludiGioco() {
  giocoAttivo = false;
  clearInterval(intervalloTimer);
  messaggioElemento.textContent = "Vittoria! Flotta affondata in " + tentativi + " tentativi e " + cronometroElemento.textContent + "!";
}

bottoneGioca.addEventListener("click", inizializzaGioco);
bottoneRicomincia.addEventListener("click", inizializzaGioco);