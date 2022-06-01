import { Tablero } from "./classes/Tablero.js";
export class Solitario {
    constructor() {
        this.tablero = new Tablero();
        this.pintarTableroHtml();
    }
    /**
     * Resive una carta y uno posición para pintar las cartas en las columnas
     * Y devuelve el html de las cartas
     *
     *
     */
    pintarCarta(carta) {
        if (carta.esVisible === true) {
            return `<li  class="carta list-group-item"  ondragstart="drag(event)"> <img id ="${carta.numero + carta.palo}"  src="img/${carta.numero + carta.palo}.PNG"> </li>`;
        }
        else {
            return `<li  class="carta list-group-item"> <img id ="${carta.numero + carta.palo}"  src="img/no.PNG"> </li>`;
        }
    }
    /*
    *Pinta las columnas donde ira cada una de las cartas
    */
    pintarTableroHtml() {
        console.log(this.tablero);
        let htmlTotal = ``;
        for (let columnaCarta of this.tablero.columnasCartas) {
            htmlTotal += `<ul class="columna" ondrop="drop(event)" ondragover="allowDrop(event)">`;
            for (let carta of columnaCarta) {
                htmlTotal += this.pintarCarta(carta);
            }
            htmlTotal += '</ul>';
        }
        console.log('xd');
        document.getElementById('cuerpoTablero').innerHTML = htmlTotal;
    }
}
const solitario = new Solitario();
