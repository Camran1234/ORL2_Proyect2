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
const TIPO_LENGUAJE = require('./Instrucciones').TIPO_LENGUAJE;

//Instrucciones
const Clase = require('../api/instrucciones/Clase');
const Constructor = require('../api/instrucciones/Constructor');
const Funcion = require('../api/instrucciones/Function');
const Retornar = require('../api/instrucciones/Retornar');
const Main = require('../api/instrucciones/Main');

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
        this.memoriaTemporal = 0;
        this.tipos = [];
        this.mainFounded=false;
        //para generar codigo
        this.t = 0;
        this.et = 0;
        this.ar=0;
        this.s = 0;
        this.specialVoids = [];
        this.cMode = false;
        this.specialInts = [];
        this.specialFloats = [];
        this.specialCadenas = [];
        this.specialChars = [];
        this.nombres = [];
        this.excluidos = [];
        this.cadena = "";
        this.asignaciones = "";
    }

    setCompilerMode(state){
        this.cMode = state;
    }

    drawTParam(index){
        return "t"+index;
    }

    drawTsParam(index){
        return "ts"+index;
    }

    stablishType(tipo){
        if(this.isCompiler()){
            if(tipo instanceof Caracter){
                this.actualTChar();
            }else if(tipo instanceof Booleano){
                this.actualTEntero();
            }else if(tipo instanceof Entero){
                this.actualTEntero();
            }else if(tipo instanceof Decimal){
                this.actualTFloat();
            }else if(tipo instanceof Cadena){
                this.actualTCadena();
            }   
        }
    }

    declararT(){
        let cadena = "";
        //Only the T params must be declared
        // The ts not because they got declared during executions
        cadena += "int g;\n";
        for(let index=0; index< this.t.size; index++){
            cadena += "int "+this.drawTParam(index)+";\n";
        }
        for(let index=0; index< this.specialCadenas.size; index++){
            cadena += "char *"+this.specialCadenas[index]+";\n";
        }
        for(let index=0; index< this.specialVoids.size; index++){
            cadena += "void *"+this.specialVoids[index]+";\n";
        }
        for(let index=0; index< this.specialFloats.size; index++){
            cadena += "float "+this.specialFloats[index]+";\n";
        }
        for(let index=0; index<this.specialChars.size; index++){
            cadena += "char "+this.specialChars[index]+";\n";
        }
        for(let index=0; index<this.specialInts.size; index++){
            cadena += "int "+this.specialInts[index]+";\n";
        }
        return cadena;
    }

    inscribirDeclaraciones(){
        let cadena = "";
        cadena += this.cadena;
        for(let index=0; index<= this.t; index++){
            let flag = false;
            if(this.excluidos.length!=0){
                if(index == this.excluidos[0]){
                    flag = true;
                    this.excluidos.shift();
                }
            }
            if(!flag){
                cadena += "int "+this.drawTParam(index)+";\n";
            }
        }
        return cadena;
    }

    

    inscribirAsignaciones(){
        return this.asignaciones;
    }

    agregarAsignacion(texto){
        this.asignaciones += texto;
    }

    agregarTexto(cadena){
        this.cadena += cadena;
    }

    inscribirT(){
        this.excluidos.push(this.t);
    }

    actualTCadena(nombre){
        this.specialCadenas.push(nombre);
    }

    actualTVoid(nombre){
        this.specialVoids.push(nombre);
    }

    actualTFloat(nombre){
        this.specialFloats.push(nombre);
    }

    actualTChar(nombre){
        this.specialChars.push(nombre);
    }

    actualTInt(nombre){
        this.specialInts.push(nombre);
    }

    isCompiler(){
        return this.cMode;
    }

    

    drawS(){
        return "ts"+this.s;
    }

    getS(){
        return this.s;
    }

    addS(){
        this.s++;
    }

    drawAr(){
        return "arr"+this.ar;
    }

    addAr(){
        this.ar++;
    }

    getAr(){
        return this.ar;
    }

    searchReturn(ambito){
        let tabla = this.tipos;
        for(let index= tabla.length-1; index>=0; index--){
            let tipo = tabla[index];
            let ambitoContenedor = tipo.getInstruccion().ambitoMayor();
            if(ambitoContenedor!=null){
                if(ambitoContenedor == ambito){
                    if(tipo.getInstruccion() instanceof Retornar){
                        return tipo;
                    }
                }
            }
        }
        return null;
    }

    sizeAmbito(ambito){
        let size = 0;
        let tabla = this.tipos;
        for(let index=tabla.length-1; index>=0; index--){
            let tipo = tabla[index];
            let ambitoContenedor = tipo.getInstruccion().ambitoMayor(); // El ambito Contenedor
            if(ambitoContenedor!=null){
                if(ambito == ambitoContenedor){
                    size++;
                }
            }
        }
        if(ambito instanceof Clase){
            if(ambito.esExtendible()){
                //Agregamos tamanio extra
                let extension = ambito.getIdExtensionO().getInstruccion();
                size += this.sizeAmbito(extension);
            }
        }
        if(ambito instanceof Funcion){
            size--;
        }

        return size;
    }

    addT(){
        
        this.t++;
    }

    addEt(){
        this.et++;
    }

    getT(){
        return this.t;
    }

    getEt(){
        return this.et;
    }

    drawT(){
        if(this.cMode){
            if(this.t == 30){
                let x = 2;
            }
        }
        return "t"+this.t;
    }

    drawEt(){
        if(this.cMode){
            
        }
        return "et"+this.et;
    }

    getPosMemoria(){
        return this.posMemoria;
    }

    getPosMemoriaMax(){
        let tipos = this.tipos;
        for(let index=0; index<tipos.length; index++){
            
        }
    }

    crear(visibilidad, id, tipo, ambito, longitud, esArreglo, rol, paquete, instruccion, lenguaje){
        return new Tipo(visibilidad, id, tipo, ambito, this.posMemoria, longitud, esArreglo, rol, paquete, instruccion, lenguaje);
    }

    forcePush(tipo){
        if(tipo.getInstruccion() instanceof Retornar){
            this.tipos.push(tipo);
        }
    }

    agregarTipo(tipo){
        let ambito = tipo.getAmbito();
        if(ambito !=null){
            let theAmbit = ambito.ambitoMayor();
            let instruccion = tipo.getInstruccion();
            //Comprobamos si esta dentro de una clase para colocarlo en el heap
            if(theAmbit!=null){//Verificar si esta contenida en algun lugar
                if(instruccion instanceof Clase
                    || instruccion instanceof Funcion
                    || instruccion instanceof Constructor
                    || instruccion instanceof Main){
                    tipo.setPosMemoria(null);
                    this.memoriaTemporal = 0;
                    this.tipos.push(tipo);
                }else{
                    tipo.setPosMemoria(this.memoriaTemporal);
                    this.tipos.push(tipo);
                    this.memoriaTemporal++;
                    theAmbit.addMemoria();
                }
            }else{
                //No esta dentro de una clase, funcion o constructor
                this.memoriaTemporal = 0;
                this.tipos.push(tipo);
                this.posMemoria++;    
            }
        }else{
            //Esta en un estado nulo, declaraciones globales
            this.memoriaTemporal = 0;
            this.tipos.push(tipo);
            this.posMemoria++;
        }        
    }

    buscar(tipo){
        let id = tipo.getId();
        let ambito = tipo.getAmbito();
        let rol = tipo.getRol();
        let lenguaje = tipo.getLenguaje();
        let paquete = tipo.getPaquete();
        let resultado = this.buscarP(id, ambito, rol, lenguaje, paquete);
        if(lenguaje == TIPO_LENGUAJE.JAVA){
            if(resultado!=null && ambito!=null){
                if(resultado.getAmbito() == null &&
                 ambito !=null && (ambito instanceof Clase) == false){
                    //No devolvemos nada porque quiere decir que buscaban dentro de la funcion y no un this
                    return null;
                }else if(resultado.getAmbito() instanceof Clase &&
                ambito!=null && (ambito instanceof Clase) == false){
                    return null;
                }
            }
        }         
        return resultado;

    }

    compararParametros(parametrosL, parametrosR){
        if(parametrosL !=null && parametrosR != null){
            if(Array.isArray(parametrosL) && Array.isArray(parametrosR)){
                if(parametrosL.length == parametrosR.length){
                    for(let index=0; index<parametrosL.length; index++){
                        if(parametrosL[index].tipo != parametrosR[index].tipo){
                            if(parametrosR[index].tipo != TIPO_DATO.ANY){
                                return false;
                            }
                        }
                    }
                    return true;
                }else{
                    return false;
                }
            }
        }
        return false;
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

        return null;
    }

    //Ambito sera un objeto siempre, haremos comparaciones por direcciones de memoria
    buscarP(id, ambito, rol, lenguaje, paquete){
        let tipoEncontrado = null;
        if(lenguaje == TIPO_LENGUAJE.JAVA){
            if(ambito == null && rol == TIPO_INSTRUCCION.CLASE){
                tipoEncontrado = this.busquedaJava_C(id, ambito, rol, paquete);
            }else{
                tipoEncontrado = this.busquedaJava(id, ambito, rol, paquete);
            }
        }else if(lenguaje == TIPO_LENGUAJE.C){
            tipoEncontrado = this.busquedaC(id, ambito, rol);
        }else if(lenguaje == TIPO_LENGUAJE.PYTHON){
            tipoEncontrado = this.busquedaPython(id, ambito, rol);
        }
        return tipoEncontrado;
    }

    /*
        Busqueda en niveles nulos incluidos a diferencia de busquedaJava normal.
    */
    busquedaJava_C(id, ambito, rol, paquete){
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
        
        return resultado;
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
                    break;
                }
            }
        }
        if(resultado == null && ambito!=null){
            let instruccion = ambito.getAmbito();
            if(ambito instanceof Clase  ){
                if(ambito.getIdExtension() !=null && ambito.getIdExtension() != ""){
                    let clase = this.buscarClase(ambito.getIdExtension(), paquete);
                    let newAmbito = clase.getInstruccion();
                    if(newAmbito!=null){
                        //Esto es de una clase ajena
                        resultado = this.busquedaJava(id, newAmbito, rol, paquete);
                        if(resultado!=null){
                            if(resultado.getVisibilidad() == TIPO_VISIBILIDAD.PRIVATE){
                                return null;
                            }
                        }
                    }
                }
            }else{
                resultado = this.busquedaJava(id, instruccion, rol, paquete);
            }
        }
        return resultado;
    }

    buscarParametroJavaSize(funcion){
        let tabla = this.tipos;
        const Clase = require('../api/instrucciones/Clase');
        const Declaracion = require('../api/instrucciones/Declaracion');
        const Asignacion = require('../api/instrucciones/Asignacion');
        let size=0; 

        if(funcion.ambitoEnClase()!=null){
            if(funcion.ambitoEnClase() instanceof Clase){
                for(let index=tabla.length-1; index>=0; index--){
                    let tipo = tabla[index];
                    if(tipo.getInstruccion().ambitoMayor() == funcion.ambitoEnClase()
                    &&( tipo.getInstruccion() instanceof Declaracion
                    || tipo.getInstruccion() instanceof Asignacion)){
                        size++;
                    }
                }
            }
        }
        
        return size;
    }

    buscarParametro(posMemoria, funcion){
        let tabla = this.tipos;
        for(let index=tabla.length-1; index>=0; index--){
            let tipo = tabla[index];
            const Declaracion = require('../api/instrucciones/Declaracion');
            const Asignacion = require('../api/instrucciones/Asignacion');
            if(tipo.getInstruccion().ambitoMayor() == funcion
            &&( tipo.getInstruccion() instanceof Declaracion
            || tipo.getInstruccion() instanceof Asignacion)){
                if(tipo.getPosMemoria() == posMemoria){
                    return tipo;
                }
            }
        }
    }

    buscarInstruccion(instruccion){
        let tabla = this.tipos;
        for(let index=tabla.length-1; index>=0; index--){
            let tipo = tabla[index];
            if(tipo.getInstruccion() == instruccion){
                return tipo;
            }
        }
    }

    buscarClase(id, paquete){
        
        let tabla = this.tipos;
        for(let index=tabla.length-1; index>=0; index--){
            let tipo = tabla[index];
            
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

module.exports = TablaTipos;