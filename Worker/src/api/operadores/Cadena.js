const TIPO_LENGUAJE  = require('../Instrucciones').TIPO_LENGUAJE;
const Objeto = require('./Object');

class Cadena extends Objeto {

    constructor(valor, linea, columna, lenguaje){
        super(valor, linea, columna, lenguaje);
        this.tipo = Cadena;
        this.esCadena = true;
    }

    getValor(){
        return this.valor;
    }

    type(){
        return "cadena";
    }

    tipo_int(){
        return super.tipo_int();
    }

    parse(operador, tablaTipos){
        let valor = this.valor;
        if(this.nombre != null ){
            return this.nombre;
        }else{
            return "\""+valor+"\"";
        }
    }

    tryParse(operador){
        const Booleano = require('./Booleano');
        if(this.lenguaje == TIPO_LENGUAJE.JAVA){
            if(operador instanceof Booleano){
                return null;
            }
        }
        return new Cadena(this.valor, this.linea, this.columna, this.lenguaje);
    }

    getTipo(){
        return  super.getTipo();
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

    generarExpresion(tablaTipos, instruccion){
        return super.generarExpresion(tablaTipos, instruccion)
    }

    setTipo(type){
        return super.setTipo(type);
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

module.exports = Cadena;