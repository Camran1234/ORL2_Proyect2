/*
    El parseo de tipos iria en el siguiente orden:
    1.-float
    2.-int
    3.-String
    4.-char
    5.-boolean (manejar como 1 o 0)

*/ 

function crearSimbolo(id, tipo, ambito, longitud, esArreglo, rol) {
    return {
        id: id,
        tipo: tipo,
        posMemoria: 0,
        ambito: ambito,
        longitud: longitud,
        esArreglo: esArreglo,
        rol: rol
    }
}

class TablaSimbolo{

    constructor(){
        this.posMemoria = 0;
        this.simbolos = [];
        this.erroresSemanticos = [];
    }

    constructor(simbolos){
        this.posMemoria = 0;
        this.simbolos = simbolos;
        this.erroresSemanticos = [];
    }

    agregar(simbolo){
        let flag=false;
        for(let index=this.simbolos.length-1; index>=0; index--){
            let simboloLocal = this.simbolos[index];
            if(simboloLocal.id == simbolo.id){
                flag=true;
                break;
            }
        }
        if(!flag){
            this.simbolos.push(simbolo);
        }
    }

    buscar(id){
        for(let index=this.simbolos.length-1; index>=0; index--){
            let simboloLocal = this.simbolos[index];
            if(simboloLocal.id == id){
                return simboloLocal;
            }
        }
        return null;
    }

    getErroresSemanticos(){
        return this.erroresSemanticos;
    }

    getSimbolos(){
        return this.simbolos;
    }

    getMemoriaUtilizada(){
        return this.posMemoria;
    }

    
}

module.exports = {
    crearSimbolo,
    TablaSimbolo
}