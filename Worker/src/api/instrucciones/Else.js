var Instruccion = require('./Instruccion');

class Else extends Instruccion{
    /*return {
        condicion:expresion,
        instrucciones:instrucciones,
        if:if_father,
        rol: TIPO_INSTRUCCION.ELSE,
        lenguaje:lenguaje,
        linea:linea, 
        columna:columna
    }*/

    constructor(condicion, instrucciones, linea, columna, lenguaje, ambito,paqueteria ){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.condicion = condicion;
        this.if_ = null;
    }

    getIf(){
        return this.if_;
    }

    setIf(if_){
        this.if_ = if_;
    }

    getCondicion(){
        return this.condicion;
    }

}

module.exports = Else;