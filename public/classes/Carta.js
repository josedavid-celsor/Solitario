export class Carta {
    constructor(color, numero, palo, esVisible) {
        this.color = color;
        this.numero = numero;
        this.palo = palo;
        this.esVisible = esVisible;
        this.img = "img/" + numero + palo + ".PNG";
        this.id = numero + palo;
    }
    /**
     *  /*
    * comprobaciones de tipo clase para generar
     * @param id es el id de la carta
     * @returns un objeto carta
     */
    static generaCartaId(id) {
        console.log(id);
        const paloOrigen = id[id.length - 1];
        const numeroOrigen = parseInt(id.split(paloOrigen)[0]);
        let color;
        if (paloOrigen === 'C' || paloOrigen === 'D') {
            color = 'rojo';
        }
        else {
            color = 'negro';
        }
        const carta = new Carta(color, numeroOrigen, paloOrigen, true);
        return carta;
    }
}
