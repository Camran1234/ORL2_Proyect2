/*
    El parseo de tipos iria en el siguiente orden:
    1.-float
    2.-int
    3.-String
    4.-char
    5.-boolean (manejar como 1 o 0)

*/ 
var ErrorSemantico = require('../error/SemanticError');
function crearTipo(visibilidad, id, tipo, ambito,posMemoria, longitud, esArreglo, rol, paquete) {
    return {
        visibilidad:visibilidad,
        id: id,
        tipo: tipo,
        posMemoria: posMemoria,
        ambito: ambito,
        longitud: longitud,
        esArreglo: esArreglo,
        rol: rol,
        paquete:paquete
    }
}

class TablaTipos{

    constructor(){
        this.posMemoria = 0;
        this.tipos = [];
    }

    agregarTipo(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, linea, columna){
        let simboloLocal = buscar(id, ambito, paquete);
        let tipo_ = crearTipo(visibilidad, id, tipo, ambito, this.posMemoria, longitud, esArreglo, rol, paquete);
        if(simboloLocal == null){
            this.tipos.push(tipo_);
        }else{
            tipo_ = new ErrorSemantico("Ya existe el identificador del paquete: "+paquete+", dentro del ambito: "+ambito, id,linea, columna);
        }
        this.posMemoria++;
        return tipo_;
    }

    buscar(id, ambito, paquete){
        for(let index=this.tipos.length-1; index>=0; index--){
            let simboloLocal = this.tipos[index];
            if(simboloLocal.id == id
                && simboloLocal.ambito == ambito
                && simboloLocal.paquete == paquete){
                return simboloLocal;
            }
        }
        return null;
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