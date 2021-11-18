const Cadena = require('../operadores/Cadena');
const Decimal = require('../operadores/Decimal');
var Instruccion = require('./Instruccion');

class Switch extends Instruccion {
    constructor(id, cases,default_, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.id = id;
        if(cases == null){
            this.cases = [];
        }else{
            this.cases = cases;
        }
        
        this.default_ = default_;
        this.variableReferencia = null;
        this.ast = [];
        //cuartetos
        this.tIde = "";
        this.etSalida = "";
        this.VTipo="";
    }

    setEtSalida(et){
        this.etSalida = et;
    }

    getEtSalida(){
        return this.etSalida;
    }

    setTIde(t){
        this.tIde = t;
    }

    getTIde(){
        return this.tIde;
    }

    getAst(){
        return this.ast;
    }

    setVariableReferencia(variable){
        this.variableReferencia = variable;
    }

    getVariableReferencia(){
        return this.variableReferencia;
    }

    setCase(newCase){
        this.cases.push(newCase);
    }

    setDefault(default_){
        this.default_ = default_;
    }

    setVTipo(tipo){
        if(tipo == "CADENA"){
            this.VTipo = new Cadena("",0,0,"");
        }else{
            this.VTipo = new Decimal("",0,0,"");
        }
    }

    getVTipo(){
        return this.VTipo;
    }

    getDefault(){
        return this.default_;
    }

    getId(){
        return this.id;
    }

    getCases(){
        return this.cases;
    }
}

module.exports = Switch;