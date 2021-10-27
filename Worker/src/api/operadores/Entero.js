
const Decimal = require('./Decimal');

const TIPO_LENGUAJE  = require('../Instrucciones').TIPO_LENGUAJE;
class Entero extends Decimal {

    constructor(valor, linea, columna, lenguaje){
        super(valor,linea, columna, lenguaje);
        this.tipo = Entero;        
    }

    type(){
        return "entero";
    }

    parse(operador, tablaTipos){
        let valor = this.generarValor(tablaTipos);
        const Cadena = require('./Cadena');
        if(this.nombre != null ){
            return this.nombre;
        }else{
            if(operador instanceof Cadena){
                return "\""+valor+"\""
            }
            return valor;
        }
    }

    tryParse(operador){
        const Booleano = require('./Booleano');
        if(this.lenguaje == TIPO_LENGUAJE.JAVA){
            if(operador instanceof Booleano){
                return null;
            }
        }
        if(operador instanceof Entero){
            return new Entero(this.valor, this.linea, this.columna, this.lenguaje);
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

module.exports = Entero;