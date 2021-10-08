
import Error from './Error'
export default class SyntaxError extends Error{

    constructor(descripcion,  linea, columna){
        super(linea, columna);
        this.descripcion = descripcion;
    }

    getMessage(){
        let mensaje = "Error Sintactico "+this.descripcion+ " linea: "+this.linea+", columna: "+this.column;
        return mensaje;
    }

    getDescription(){
        return this.Description;
    }


}