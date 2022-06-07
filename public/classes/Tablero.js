import { Carta } from "./Carta.js";
export class Tablero {
    /**
     *
     */
    constructor() {
        /**
         * Array de los palos de las cartas
         */
        this.palos = ['C', 'D', 'T', 'P'];
        this.rellenarTodasCartas();
        this.rellenarColumnas();
        this.rellenarMazoEntrada();
    }
    /**
     * Funcion para rellenar el Array de las cartas
     */
    rellenarTodasCartas() {
        this.todasCartas = [];
        let color = 'rojo';
        for (let i = 1; i <= 13; i++) {
            for (const palo of this.palos) {
                if (palo === 'C' || palo === 'D') {
                    color = 'rojo';
                }
                else {
                    color = 'negro';
                }
                const carta = new Carta(color, i, palo, false);
                this.todasCartas.push(carta);
            }
            ;
        }
        this.todasCartas.sort((a, b) => 0.5 - Math.random());
    }
    /**
     * Funcion para rellenar las 7 columnas
     */
    rellenarColumnas() {
        this.columnasCartas = [];
        for (let i = 7; i > 0; i--) {
            this.columnasCartas[i] = [];
            for (let j = i; j > 0; j--) {
                this.columnasCartas[i].push(this.todasCartas.pop());
            }
            this.columnasCartas[i][i - 1].esVisible = true;
        }
        this.columnasCartas.shift();
    }
    /**
    * Funcion para rellenar el Mazo de entrada del jugador
    */
    rellenarMazoEntrada() {
        this.mazoEntrada = this.todasCartas.splice(0);
        console.log(this.mazoEntrada);
        //this.mazoEntrada.shift();
    }
}
