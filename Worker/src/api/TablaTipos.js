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
const TIPO_VISIBILIDAD = require('./Instrucciones').TIPO_VISIBILIDAD;
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

var Tipo = require('./Tipo');
var ErrorSemantico = require('../error/SemanticError');
function crearTipo(visibilidad, id, tipo, ambito,posMemoria, longitud, esArreglo, rol, paquete, instruccion) {
    if(tipo == TIPO_DATO.INT){
        tipo = TIPO_VALOR.ENTERO;
    }else if(tipo == TIPO_DATO.FLOAT){
        tipo = TIPO_VALOR.DECIMAL;
    }else if(tipo == TIPO_DATO.STRING){
        tipo = TIPO_VALOR.CADENA;
    }else if(tipo == TIPO_DATO.CHAR){
        tipo = TIPO_VALOR.CARACTER;
    }else if(tipo == TIPO_DATO.BOOLEAN){
        tipo = TIPO_VALOR.BOOLEAN;
    }
    return new Tipo(visibilidad, id, tipo, ambito, posMemoria, longitud, esArreglo, rol, paquete, instruccion);
}

class TablaTipos{

    constructor(){
        this.posMemoria = 0;
        this.tipos = [];
        this.mainFounded=false;
    }

    crear(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, instruccion, lenguaje){
        return new Tipo(visibilidad, id, tipo, ambito, posMemoria, longitud, esArreglo, rol, paquete, instruccion, lenguaje);
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

    compararParametros(parametrosL, parametrosR){
        if(parametrosL !=null && parametrosR != null){
            if(Array.isArray(parametrosL) && Array.isArray(parametrosR)){
                if(parametrosL.length == parametrosR.length){
                    for(let index=0; index<parametrosL.length; index++){
                        if(parametrosL[index].tipo != parametrosR[index].tipo){
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    buscarFuncion(id_, ambito_, rol_, parametros_){
        let id = id_;
        let ambito = ambito_;
        let rol = rol_;
        let parametros = parametros_;
        for(let index=this.tipos.length-1; index>=0; index--){
            let tipo = this.tipos[index];
            if(tipo.getId() == id && tipo.getAmbito() == ambito &&
            tipo.getRol() == rol && this.compararParametros(parametros, tipo.getLongitud())){
                return tipo;
            }
        }
        if(ambito !=null){
            let newAmbito = ambito.getAmbito();
            return this.buscarFuncion(id, newAmbito, rol, parametros);
        }

        return resultado;
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
        for(let index=tabla.length-1; index>=0; index--){
            let tipo = tabla[index];
            if(tipo.getId() == id &&
            tipo.getRol() == rol && 
            tipo.getAmbito() == ambito){
                resultado = tipo;
                break;
            }
        }
        if(resultado == null){
            if(ambito!=null){
            let instruccion = ambito.getAmbito();
                if(instruccion instanceof Clase ){
                    if(instruccion.getIdExtension() !=null){
                        let clase = this.buscarClase(instruccion.getIdExtension(), paquete);
                        let newAmbito = clase.getInstruccion();
                        if(newAmbito!=null){
                            //Esto es de una clase ajena
                            resultado = this.busquedaJava(id, newAmbito, rol);
                            if(resultado.getVisibilidad() == TIPO_VISIBILIDAD.PRIVATE){
                                return null;
                            }
                        }
                    }
                }else{
                    resultado = this.busquedaJava(id, ambito, rol);
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

    buscarClase_C(id){
        for(let index=this.tipos.legth-1; index>=0; index--){
            let tipo = this.tipos[index];
            if(id == tipo.getId() && tipo.getRol() == TIPO_INSTRUCCION.CLASE){
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
        }
        if(ambito!=null){
            let newAmbito = ambito.getAmbito();
            return this.busquedaC(id, newAmbito, rol);
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
            if(ambito!=null){
                let newAmbito = ambito.getAmbito();
                return this.busquedaPython(id, newAmbito, rol);
            }
        }        
        return null;
    }
    
}

module.exports = {
    crearTipo,
    TablaTipos
}