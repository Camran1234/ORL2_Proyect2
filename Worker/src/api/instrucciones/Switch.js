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
    }

    setCase(newCase){
        this.cases.push(newCase);
    }

    setDefault(default_){
        this.default_ = default_;
    }

    getId(){
        return this.id;
    }

    getCases(){
        return this.cases;
    }
}

module.exports = Switch;