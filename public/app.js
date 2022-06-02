import { Carta } from "./classes/Carta.js";
import { Tablero } from "./classes/Tablero.js";
export class Solitario {
    constructor() {
        this.tablero = new Tablero();
        this.pintarTableroHtml();
        this.asignarEvento();
    }
    /**
     * Resive una carta y uno posición para pintar las cartas en las columnas
     * Y devuelve el html de las cartas
     *
     *
     */
    pintarCarta(carta) {
        if (carta.esVisible === true) {
            return `<li id ="${carta.numero + carta.palo}Carta"  class="carta list-group-item"> <img   id="${carta.numero + carta.palo}" src="img/${carta.numero + carta.palo}.PNG"> </li>`;
        }
        else {
            return `<li  id ="${carta.numero + carta.palo}Carta" class="carta list-group-item"> <img  id="${carta.numero + carta.palo}" src="img/no.PNG"> </li>`;
        }
    }
    /*
    *Pinta las columnas donde ira cada una de las cartas
    */
    pintarTableroHtml() {
        console.log(this.tablero);
        let htmlTotal = ``;
        for (let columnaCarta of this.tablero.columnasCartas) {
            htmlTotal += `<li class="columna list-group-item"><ul class="list-group columnasHTML">`;
            for (let carta of columnaCarta) {
                htmlTotal += this.pintarCarta(carta);
            }
            htmlTotal += '</ul></li>';
        }
        htmlTotal += ` <ul class="list-group">
                <li id="mazo_Entrada" class="list-group-item">

                </li>
                <li id="almacemn" class="list-group-item">

                </li>
                <li id="almacen2" class="list-group-item">

                </li>
                <li id="almacen3" class="list-group-item">

                </li>
                <li id="almacen4" class="list-group-item">

                </li>
            </ul>`;
        console.log('xd');
        document.getElementById('cuerpoTablero').innerHTML = htmlTotal;
    }
    /**
        * Asigna evento
        */
    asignarEvento() {
        const cartasHtml = document.getElementsByClassName('carta');
        for (let i = 0; i < cartasHtml.length; i++) {
            cartasHtml[i].addEventListener('dragstart', this.drag);
        }
        const columnasHtml = document.getElementsByClassName('columnasHTML');
        for (let i = 0; i < columnasHtml.length; i++) {
            columnasHtml[i].addEventListener('drop', this.drop.bind(this));
            columnasHtml[i].addEventListener('dragover', this.allowDrop);
        }
        console.log(columnasHtml);
    }
    /**
     * Funcion Drag and Drop mover carta
    */
    //drag and drop
    allowDrop(ev) {
        ev.preventDefault();
    }
    drag(ev) {
        console.log(ev.currentTarget.childNodes);
        ev.dataTransfer.setData("text", ev.target.id);
    }
    drop(ev) {
        ev.preventDefault();
        console.log(ev);
        var data = ev.dataTransfer.getData("text");
        const idCarta = data + 'Carta';
        const cartaOrigenHtml = document.getElementById(idCarta);
        const hermanos = cartaOrigenHtml.parentElement.children;
        const cartaAnterior = cartaOrigenHtml.previousSibling;
        console.log(hermanos);
        console.log(cartaAnterior);
        let originalEncontrado = false;
        let cartasDependientes = [];
        for (let i = 0; i < hermanos.length; i++) {
            const hermano = hermanos[i];
            if (hermano.id === cartaOrigenHtml.id) {
                originalEncontrado = true;
            }
            else {
                if (originalEncontrado) {
                    cartasDependientes.push(hermano);
                }
            }
        }
        console.log(cartasDependientes);
        const idColumnaDes = ev.target.id + 'Carta';
        const columnaDestino = ev.path[2];
        if (this.moverCarta(idCarta, idColumnaDes)) {
            ev.path[2].appendChild(document.getElementById(idCarta));
            for (let carta of cartasDependientes) {
                ev.path[2].appendChild(document.getElementById(carta.id));
            }
            console.log(cartaAnterior.firstChild.nodeValue);
            /*  if(cartaAnterior.firstChild.src === 'no.png'){
                 cartaAnterior.firstChild.src = cartaAnterior.firstChild.id + '.PNG'
             } */
        }
    }
    /**
     * Puedo mover carta
     */
    moverCarta(idCartaOrigen, idCartaDestino) {
        const cartaOrigen = Carta.generaCartaId(idCartaOrigen.split('Carta')[0]);
        const cartaDestino = Carta.generaCartaId(idCartaDestino.split('Carta')[0]);
        if (cartaOrigen.color != cartaDestino.color) {
            if (cartaOrigen.numero === cartaDestino.numero - 1) {
                return true;
            }
        }
    }
}
const solitario = new Solitario();
