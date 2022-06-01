export class Carta {
    constructor(color, numero, palo, esVisible) {
        this.color = color;
        this.numero = numero;
        this.palo = palo;
        this.esVisible = esVisible;
        this.img = "img/" + numero + palo + ".PNG";
        this.id = numero + palo;
    }
}
