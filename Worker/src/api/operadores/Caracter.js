

const Entero = require('./Entero');

class Caracter extends Entero {

    constructor(valor, linea, columna, lenguaje){
        super(valor,linea, columna, lenguaje);
        this.tipo = Caracter;
    }

    type(){
        return "caracter";
    }

    parse(operador, tablaTipos){
        const Cadena = require('./Cadena');
        let valor = this.valor;
        if(this.nombre!=null ){
            return this.nombre;
        }else{
            if(operador instanceof Cadena){
                return "\""+valor+"\"";
            }
            return valor.charCodeAt(0);
        }
    }

    tryParse(operador){
        if(operador instanceof Caracter){
            return new Caracter(this.valor, this.linea, this.columna, this.lenguaje);
        }
        return null;
    }

    getThisTipo(){
        return  super.getThisTipo();
    }

    setParamPuntero(op){
        return super.setParamPuntero(op);
    }

    esArreglo(){
        return super.esArreglo();
    }

    setParamsO(params){
        return  super.setParamsO(params);
    }

    getParamsO(){
        return  super.getParamsO();
    }

    getEstado(){
        return super.getEstado();
    }

    getNombre(){
        return super.getNombre();
    }

    setEstado(estado){
        return super.setEstado(estado);
    }

    setInstruccion(instruccion){
        return super.setInstruccion(instruccion);
    }

    setSimboloReferencia(var_){
        return  super.setSimboloReferencia(var_);
    }

    getSimboloReferencia(){
        return super.getSimboloReferencia();
    }

    getInstruccion(){
        return super.getInstruccion()
    }

    /*Devuelve el tipo que hace referencia a esta funcion */
    buscarTipo(tablaTipos){
        return super.buscarTipo(tablaTipos)
    }

    setTipo(type){
        return super.setTipo(type);
    }

    generarExpresion(tablaTipos, instruccion){
        this.setTipo(this.tipo);
        return super.generarExpresion(tablaTipos, instruccion)
    }

    generarParametro(tablaTipos, parametro, puntero){
        return super.generarParametro(tablaTipos, parametro, puntero)
    }

    codigo3D(tablaTipos){
        return super.codigo3D(tablaTipos)
    }

    generarValor(){
        return super.generarValor()
    }

    getNombre(){
        return super.getNombre()
    }

    setNombre(nombre){
        return  super.setNombre(nombre)
    }

    getValor(){
        return super.getValor()
    }

    getLinea(){
        return super.getLinea()
    }

    getColumna(){
        return super.getColumna()
    }

    getLenguaje(){
        return super.getLenguaje()
    }

}

module.exports = Caracter;