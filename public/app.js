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
                <li id="mazoEntrada" class="list-group-item">

                </li>
                <li id="mazoRobo" class="list-group-item">

                </li>
                <li id="almacenTrebol" class="list-group-item">

                </li>
                <li id="almacenCorazones" class="list-group-item">

                </li>
                <li id="almacenPicas" class="list-group-item">

                </li>
                <li id="almacenDiamantes" class="list-group-item">

                </li>
            </ul>`;
        console.log('xd');
        document.getElementById('cuerpoTablero').innerHTML = htmlTotal;
        console.log(this.tablero);
        this.pintarMazo();
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
        document.getElementById('almacenCorazones').addEventListener('drop', this.dropAlmacen.bind(this));
        document.getElementById('almacenCorazones').addEventListener('dragover', this.allowDrop);
        document.getElementById('almacenPicas').addEventListener('drop', this.dropAlmacen.bind(this));
        document.getElementById('almacenPicas').addEventListener('dragover', this.allowDrop);
        document.getElementById('almacenTrebol').addEventListener('drop', this.dropAlmacen.bind(this));
        document.getElementById('almacenTrebol').addEventListener('dragover', this.allowDrop);
        document.getElementById('almacenDiamantes').addEventListener('drop', this.dropAlmacen.bind(this));
        document.getElementById('almacenDiamantes').addEventListener('dragover', this.allowDrop);
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
        console.log(hermanos);
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
        const idColumnaDes = ev.target.id + 'Carta';
        const columnaDestino = ev.path[2];
        if (this.moverCarta(idCarta, idColumnaDes)) {
            ev.path[2].appendChild(document.getElementById(idCarta));
            for (let carta of cartasDependientes) {
                ev.path[2].appendChild(document.getElementById(carta.id));
            }
            this.descubrirCarta(cartaOrigenHtml);
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
    /**
     * Pintar mazo html
     */
    pintarMazo() {
        let htmlMazoEntrada;
        let ultimaCarta;
        for (let carta of this.tablero.mazoEntrada) {
            htmlMazoEntrada += this.pintarCarta(carta);
            ultimaCarta = carta;
        }
        document.getElementById("mazoEntrada").innerHTML = htmlMazoEntrada;
        document.getElementById(ultimaCarta.numero + ultimaCarta.palo + 'Carta').addEventListener('click', this.robarCarta.bind(this));
    }
    /**
     * Voltear carta del mazo al robarla
     */
    robarCarta(ev) {
        ev.preventDefault();
        let primeraCartaMazoEntrada = Carta.generaCartaId(ev.target.id);
        const mazoRobo = document.getElementById('mazoRobo');
        const cartaMazoEntrada = document.getElementById(primeraCartaMazoEntrada.numero + primeraCartaMazoEntrada.palo + 'Carta');
        cartaMazoEntrada.addEventListener('dragstart', this.drag);
        mazoRobo.appendChild(cartaMazoEntrada);
        document.getElementById(ev.target.id).setAttribute('src', 'img/' + ev.target.id + '.PNG');
        this.asignarNuevoRobo();
    }
    /**
     * Asignar robo a la ultima carta del Mazo entrada
     */
    asignarNuevoRobo() {
        const ultimaCarta = document.getElementById("mazoEntrada").lastChild;
        ultimaCarta.addEventListener('click', this.robarCarta.bind(this));
    }
    /**
     * Funcion para poder almacenar cartas en los almacenes
     */
    dropAlmacen(ev) {
        console.log(ev);
        const almacenDestino = ev.target;
        var dataCartaMandada = ev.dataTransfer.getData("text");
        const cartaHTML = document.getElementById(dataCartaMandada + 'Carta');
        const cartaMandada = Carta.generaCartaId(dataCartaMandada);
        console.log(almacenDestino.lastChild);
        console.log(cartaMandada.numero);
        console.log(almacenDestino.children[almacenDestino.children.length - 1]);
        if (this.compruebaPalo(cartaMandada, almacenDestino.id)) {
            if (!almacenDestino.children[almacenDestino.children.length - 1] && cartaMandada.numero === 1) {
                //No tiene ninguna carta aun
                this.descubrirCarta(cartaHTML);
                almacenDestino.appendChild(cartaHTML);
            }
        }
    }
    /**
     * Comprueba el palo de la carta
     */
    compruebaPalo(carta, almacen) {
        switch (almacen) {
            case 'almacenCorazones':
                if (carta.palo === 'C') {
                    return true;
                }
                break;
            case 'almacenTrebol':
                if (carta.palo === 'T') {
                    return true;
                }
                break;
            case 'almacenPicas':
                if (carta.palo === 'P') {
                    return true;
                }
                break;
            case 'almacenDiamantes':
                if (carta.palo === 'D') {
                    return true;
                }
                break;
        }
    }
    /**
     * Descubre carta
     */
    descubrirCarta(cartaHTML) {
        const cartaAnterior = cartaHTML.previousSibling;
        const identificador = cartaAnterior.id.split('Carta')[0];
        const cartaDescubierta = document.getElementById(identificador);
        if (cartaDescubierta.getAttribute('src') === 'img/no.PNG') {
            cartaDescubierta.setAttribute('src', 'img/' + identificador + '.PNG');
            cartaAnterior.addEventListener('dragstart', this.drag);
        }
    }
}
const solitario = new Solitario();
