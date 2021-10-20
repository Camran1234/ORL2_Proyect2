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

//Instrucciones
const Clase = require('../api/instrucciones/Clase');
const Constructor = require('../api/instrucciones/Constructor');
const Funcion = require('../api/instrucciones/Function');

var Tipo = require('./instrucciones/Tipo');
var ErrorSemantico = require('../error/SemanticError');
function crearTipo(visibilidad, id, tipo, ambito,posMemoria, longitud, esArreglo, rol, paquete, instruccion) {
    return new Tipo(visibilidad, id, tipo, ambito, posMemoria, longitud, esArreglo, rol, paquete, instruccion);
}

class TablaTipos{

    constructor(){
        this.posMemoria = 0;
        this.tipos = [];
        this.mainFounded=false;
    }

    crear(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, instruccion){
        let tipo = crearTipo(visibilidad, id, tipo, ambito, this.posMemoria, longitud, esArreglo, rol, paquete, instruccion);
        return tipo;
    }

    agregarTipo(tipo){
        this.tipos.push(tipo);
        this.posMemoria++;
    }

    buscar(tipo){
        let id = tipo.getId();
        let ambito = tipo.getAmbito();
        let rol = tipo.getRol();
        let lenguaje = tipo.getLenguaje();
        let paquete = tipo.getPaquete();
        return this.buscar(id, ambito, rol, lenguaje, paquete);
    }

    //Ambito sera un objeto siempre, haremos comparaciones por direcciones de memoria
    buscar(id, ambito, rol, lenguaje, paquete){
        let tipoEncontrado = null;
        if(lenguaje == TIPO_LENGUAJE.JAVA){
            tipoEncontrado = this.busquedaJava(id, ambito, rol, paquete);
        }else if(lenguaje == TIPO_LENGUAJE.C){
            tipoEncontrado = this.busquedaC(id, ambito, rol, paquete);
        }else if(lenguaje == TIPO_LENGUAJE.PYTHON){
            tipoEncontrado = this.busquedaPython(id, ambito, rol, paquete);
        }
        return tipoEncontrado;
    }

    busquedaJava(id, ambito, rol, paquete){
        let resultado = null;
        let tabla = this.tipos;
        if(ambito!=null){
            for(let index=tabla.length-1; index>=0; index--){
                let tipo = tabla[index];
                if(tipo.getId() == id &&
                tipo.getRol() == rol && 
                tipo.getAmbito() == ambito){
                    resultado = tipo;
                }
            }
            if(tipo == null){
                let instruccion = ambito.getAmbito();
                if(instruccion!=null){
                    if(instruccion instanceof Clase ){
                        if(instruccion.getIdExtension() !=null || instruccion.getIdExtension() != ""
                        || instruccion.getIdExtension() != undefined){
                            let clase = this.buscarClase(instruccion.getIdExtension(), paquete);
                            let newAmbito = clase.getInstruccion();
                            resultado = this.busquedaJava(id, newAmbito, rol);
                        }
                    }else{
                        resultado = this.busquedaJava(id, ambito, rol);
                    }
                }
            }
        }
        return resultado;
    }

    buscarClase(id, paquete){
        for(let index=this.tipos.legth-1; index>=0; index--){
            let tipo = this.tipos[index];
            if(id == tipo.getId() && tipo.getRol() == TIPO_INSTRUCCION.CLASE
            && paquete == tipo.getPaquete()){
                return tipo;
            }
        }
        return null;
    }

    busquedaC(id, ambito, rol){
        for(let index=this.tipos.length-1; index>=0; index--){
            let tipo = this.tipos[index];
            if(tipo.getId() == id && tipo.getAmbito() == ambito 
            && tipo.getRol() == rol){
                return tipo;
            }
            if(ambito!=null){
                let newAmbito = ambito.getAmbito();
                return this.busquedaC(id, newAmbito, rol);
            }
        }
        return null;
    }

    busquedaPython(id, ambito, rol){
        if(ambito!=null){
            for(let index=this.tipos.length-1; index>=0; index--){
                let tipo = this.tipos[index];
                if(tipo.getId() == id && tipo.getAmbito() == ambito &&
                tipo.getRol() == rol){
                    return tipo;
                }
            }
            //Scope back
            let newAmbito = ambito.getAmbito();
            return this.busquedaPython(id, newAmbito, rol);
        }        
        return null;
    }
    
}

module.exports = {
    crearTipo,
    TablaTipos
}