export class Carta {
    img:string; 
    id:string;
    constructor(public color:string, public numero:number, public palo:string, public esVisible:boolean) {      
        this.img = "img/" + numero + palo + ".PNG";
        this.id = numero + palo;
    }
}