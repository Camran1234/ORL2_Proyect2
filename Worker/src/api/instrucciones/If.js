var Instruccion = require('./Instruccion');

class If extends Instruccion{
    constructor(condicion, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.condicion = condicion;
        this.etiquetaSalida = null;
    }

    getEtiquetaSalida(){
        return this.etiquetaSalida;
    }

    setEtiquetaSalida(etiqueta){
        this.etiquetaSalida = etiqueta; 
    }

    getCondicion(){
        return this.condicion;
    }

}

module.exports =If;