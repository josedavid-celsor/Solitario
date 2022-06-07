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
        let htmlTotal = ``;
        for (let columnaCarta of this.tablero.columnasCartas) {
            htmlTotal += `<li class="columna list-group-item"><ul class="list-group columnasHTML">`;
            for (let carta of columnaCarta) {
                htmlTotal += this.pintarCarta(carta);
            }
            htmlTotal += '</ul></li>';
        }
        htmlTotal += ` 
                <li id="mazoEntrada" class="list-group-item deposito">

                </li>
                <li id="mazoRobo" class="list-group-item deposito">

                </li>

            `;
        document.getElementById('cuerpoTablero').innerHTML = htmlTotal;
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
            columnasHtml[i].addEventListener('drop', this.drop.bind({ app: this, html: columnasHtml[i] }));
            columnasHtml[i].addEventListener('dragover', this.allowDrop);
        }
        const almacenCorazones = document.getElementById('almacenCorazones');
        const almacenPicas = document.getElementById('almacenPicas');
        const almacenTrebol = document.getElementById('almacenTrebol');
        const almacenDiamantes = document.getElementById('almacenDiamantes');
        almacenCorazones.addEventListener('drop', this.dropAlmacen.bind({ app: this, html: almacenCorazones }));
        almacenCorazones.addEventListener('dragover', this.allowDrop);
        almacenPicas.addEventListener('drop', this.dropAlmacen.bind({ app: this, html: almacenPicas }));
        almacenPicas.addEventListener('dragover', this.allowDrop);
        almacenTrebol.addEventListener('drop', this.dropAlmacen.bind({ app: this, html: almacenTrebol }));
        almacenTrebol.addEventListener('dragover', this.allowDrop);
        almacenDiamantes.addEventListener('drop', this.dropAlmacen.bind({ app: this, html: almacenDiamantes }));
        almacenDiamantes.addEventListener('dragover', this.allowDrop);
    }
    /**
     * Funcion Drag and Drop mover carta
    */
    //drag and drop
    allowDrop(ev) {
        ev.preventDefault();
    }
    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
    drop(ev) {
        console.log(this);
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        const idCarta = data + 'Carta';
        const cartaOrigenHtml = document.getElementById(idCarta);
        const hermanos = cartaOrigenHtml.parentElement.children;
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
        if (this.app.moverCarta(idCarta, idColumnaDes)) {
            this.app.descubrirCarta(cartaOrigenHtml);
            this.html.appendChild(document.getElementById(idCarta));
            for (let carta of cartasDependientes) {
                this.html.appendChild(document.getElementById(carta.id));
            }
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
        let htmlMazoEntrada = '';
        let ultimaCarta;
        for (let carta of this.tablero.mazoEntrada) {
            if (carta) {
                const htmlAPintar = this.pintarCarta(carta);
                htmlMazoEntrada += htmlAPintar;
                ultimaCarta = carta;
            }
        }
        document.getElementById("mazoEntrada").innerHTML = htmlMazoEntrada;
        const cartaHTML = document.getElementById(ultimaCarta.numero + ultimaCarta.palo + 'Carta');
        cartaHTML.addEventListener('click', this.robarCarta.bind({ app: this, html: cartaHTML }));
    }
    /**
     * Voltear carta del mazo al robarla
     */
    robarCarta(ev) {
        console.log(this);
        console.log(ev);
        ev.preventDefault();
        let primeraCartaMazoEntrada = Carta.generaCartaId(ev.target.id);
        const mazoRobo = document.getElementById('mazoRobo');
        const cartaMazoEntrada = document.getElementById(primeraCartaMazoEntrada.numero + primeraCartaMazoEntrada.palo + 'Carta');
        cartaMazoEntrada.addEventListener('dragstart', this.app.drag);
        mazoRobo.appendChild(cartaMazoEntrada);
        document.getElementById(ev.target.id).setAttribute('src', 'img/' + ev.target.id + '.PNG');
        this.app.asignarNuevoRobo();
    }
    /**
     * Asignar robo a la ultima carta del Mazo entrada
     */
    asignarNuevoRobo() {
        const ultimaCarta = document.getElementById("mazoEntrada").lastChild;
        ultimaCarta.addEventListener('click', this.robarCarta.bind({ app: this, html: ultimaCarta }));
    }
    /**
     * Funcion para poder almacenar cartas en los almacenes
     */
    dropAlmacen(ev) {
        const almacenDestino = this.html;
        console.log(almacenDestino);
        var dataCartaMandada = ev.dataTransfer.getData("text");
        const cartaHTML = document.getElementById(dataCartaMandada + 'Carta');
        const cartaMandada = Carta.generaCartaId(dataCartaMandada);
        if (this.app.compruebaPalo(cartaMandada, almacenDestino.id)) {
            if (!almacenDestino.children[almacenDestino.children.length - 1] && cartaMandada.numero === 1) {
                //No tiene ninguna carta aun
                this.app.descubrirCarta(cartaHTML);
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
        console.log(cartaHTML);
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
