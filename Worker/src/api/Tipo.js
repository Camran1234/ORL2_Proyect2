class Tipo{

    constructor(visibilidad, id, tipo, ambito, posMemoria, longitud, esArreglo, rol, paquete){
        this.visibilidad = visibilidad;
        this.id = id;
        this.tipo = tipo;
        this.ambito = ambito;
        this.posMemoria = posMemoria;
        this.longitud = longitud;
        this.esArreglo = esArreglo;
        this.rol = rol;
        this.paquete = paquete;
    }    

    id(){
        return this.id;
    }

    ambito(){
        return this.ambito;
    }

    rol(){
        return this.rol;
    }

    paqueteria(){
        return this.paqueteria;
    }

    getJSON(){
        return {
            visibilidad:visibilidad,
            id: id,
            tipo: tipo,
            posMemoria: posMemoria,
            ambito:ambito,
            longitud:longitud,
            esArreglo:esArreglo,
            rol:rol,
            paquete:paquete
        }
    }



}

module.exports = Tipo;