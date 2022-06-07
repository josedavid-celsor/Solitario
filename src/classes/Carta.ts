export class Carta {
    img:string; 
    id:string;
    constructor(public color:string, public numero:number, public palo:string, public esVisible:boolean) {      
        this.img = "img/" + numero + palo + ".PNG";
        this.id = numero + palo;
    }
    /**
     *  /*
    * comprobaciones de tipo clase para generar
     * @param id es el id de la carta
     * @returns un objeto carta
     */
    public static generaCartaId(id:string) :Carta{
        const paloOrigen:string = id[id.length - 1];
        const numeroOrigen:number =  parseInt(id.split(paloOrigen)[0]); 
        let color;
        if (paloOrigen === 'C' || paloOrigen === 'D') {
             color = 'rojo';
        }
        else {
            color = 'negro';
        }
        
        const carta:Carta = new Carta(color, numeroOrigen, paloOrigen, true);
        return carta
    }
}