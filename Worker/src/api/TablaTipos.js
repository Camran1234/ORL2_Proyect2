/*
    El parseo de tipos iria en el siguiente orden:
    1.-float
    2.-int
    3.-String
    4.-char
    5.-boolean (manejar como 1 o 0)

*/ 
const TIPO_DATO = require('./Instrucciones').TIPO_DATO;
const TIPO_VALOR = require('./Instrucciones').TIPO_VALOR;
const TIPO_INSTRUCCION = require('./Instrucciones').TIPO_INSTRUCCION;
const TIPO_BUSQUEDA = {
    identificador:'Identificador',
    this_identificador:'this_identificador',
    metodo :'metodo',
    constructor: 'constructor',
    main: 'main'
}

var Tipo = require('./instrucciones/Tipo');
var ErrorSemantico = require('../error/SemanticError');
function crearTipo(visibilidad, id, tipo, ambito,posMemoria, longitud, esArreglo, rol, paquete) {
    return new Tipo(visibilidad, id, tipo, ambito, posMemoria, longitud, esArreglo, rol, paquete);
}

class TablaTipos{

    constructor(){
        this.posMemoria = 0;
        this.tipos = [];
        this.mainFounded=false;
    }

    //Analizar caso para agregar:
    //Variables
    //Funciones
    //Mains
    //Incluir Paquetes
    //Ambitos
    //Roles
    //Visibilidad
   /* agregarTipo(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, linea, columna){
        let simboloLocal = buscar(id, ambito, rol);
        let tipo_ = crearTipo(visibilidad, id, tipo, ambito, this.posMemoria, longitud, esArreglo, rol, paquete);
        if(simboloLocal == null){
            if(rol == TIPO_INSTRUCCION.MAIN){
                if(this.mainFounded = true ){
                    tipo_ = new ErrorSemantico("Ya existe un main", "main", linea, columna);
                }else{
                    this.mainFounded=true;
                    this.tipos.push(tipo_);
                }
            }else {
                this.tipos.push(tipo_);
            }
        }else{
            tipo_ = new ErrorSemantico("Ya existe el identificador dentro del paquete: "+paquete+", dentro del ambito: "+ambito, id,linea, columna);
        }
        this.posMemoria++;
        return tipo_;
    }*/

    agregar(tipo){
        this.tipos.push(tipo_);
    }

    agregarTipo(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, linea, columna){
        let tipo_ = crearTipo(visibilidad, id, tipo, ambito, posMemoria, longitud, esArreglo, rol, paquete);        
        let busqueda = this.buscar(id, ambito, rol, paqueteria);
        if(busqueda == null){

        }else{

        }
    }

    compararFuncion(tipoL,tipoR, lenguaje){

    }

    compararConstructor(tipoL, tipoR, lenguaje){

    }

    compararClase(tipoL, tipoR, lenguaje){
        if(lenguaje == TIPO_LENGUAJE.JAVA){

        }
    }

    

    buscar(id, ambito, rol, paqueteria){
        let busqueda = null;
        let tipoBusqueda = this.seleccionarBusqueda(rol);

        if(rol == TIPO_VALOR.IDENTIFICADOR){
            busqueda = this.buscarLocalmente(id, ambito, rol, paqueteria, tipoBusqueda);
        }
        if(rol == TIPO_VALOR.THIS_IDENTIFICADOR || rol == ){

        }
        
        return busqueda;
    }

    seleccionarBusqueda(rol){
        if(rol == TIPO_INSTRUCCION.IDENTIFICADOR){
            return TIPO_BUSQUEDA.IDENTIFICADOR;
        }else if(rol == TIPO_INSTRUCCION.THIS_IDENTIFICADOR){
            return TIPO_BUSQUEDA.THIS_IDENTIFICADOR;
        }else if(rol == TIPO_INSTRUCCION.METODO){
            return TIPO_BUSQUEDA.METODO;
        }else if(rol == TIPO_INSTRUCCION.CONSTRUCTOR){
            return TIPO_BUSQUEDA.CONSTRUCTOR;
        }else if(rol == TIPO_INSTRUCCION.MAIN){
            return TIPO_BUSQUEDA.MAIN;
        }
    }

    //Realizar las busquedas de abajo para arriba
    buscarLocalmente(id, ambito, rol, paqueteria, tipoBusqueda){
        let busqueda=null;
        for(let index=this.tipos.length-1; index>=0; index--){
            let simboloLocal = this.tipos[index];
            let jsonLocal = simboloLocal.getJSON();
            if(jsonLocal.id() == id && jsonLocal.ambito() == ambito &&
            jsonLocal.rol() == TIPO_INSTRUCCION.DECLARACION && 
            jsonLocal.paqueteria() == paqueteria){
                busqueda = simboloLocal;
                break;
            }
        }
        return busqueda;
    }

    buscarClase(id, ambito, rol, paqueteria, tipoBusqueda){

    }

    buscarExtension(id, ambito, rol, paqueteria, tipoBusqueda){

    }

    transformarDatoToValor(tipo){
        let valor = tipo;
        if(TIPO_DATO.INT){
            valor = TIPO_VALOR.ENTERO;
        }else if(TIPO_DATO.FLOAT){
            valor = TIPO_VALOR.DECIMAL;
        }else if(TIPO_DATO.CHAR){
            valor = TIPO_VALOR.CARACTER;
        }else if(TIPO_DATO.STRING){
            valor = TIPO_VALOR.STRING;
        }else if(TIPO_DATO.BOOLEAN){
            valor = TIPO_VALOR.BOOLEAN;
        }else if(TIPO_DATO.VOID){
            valor = TIPO_VALOR.VOID;
        }
        return valor;
    }

    FromClass(){

    }

    getTipos(){
        return this.tipos;
    }

    getMemoriaUtilizada(){
        return this.posMemoria;
    }

    
}

module.exports = {
    crearTipo,
    TablaTipos
}