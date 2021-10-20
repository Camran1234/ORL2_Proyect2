
class Object {
    constructor(valor, linea, columna, lenguaje){
        this.linea = linea;
        this.columna = columna;
        this.lenguaje = lenguaje;
        this.valor = valor;    
    }

    getValor(){
        return this.valor;
    }

    getLinea(){
        return this.linea
    }

    getColumna(){
        return this.columna;
    }

    getLenguaje(){
        return this.lenguaje;
    }

    type(){
        return Object;
    }
}

module.exports = Object;