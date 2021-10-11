
class Parser{
    constructor(){
        this.errores = [];
        this.resultados = [];
    }


    parse(codigo){
        try{
        //Obteniendo codigo General
            var General = require('./general/General');
            var generalParser = General;
            //let errores
            let erroresLexicos = [];
            let erroresSintacticos = [];
            generalParser.setErroresLexicos(erroresLexicos);
            generalParser.setErroresSintacticos(erroresSintacticos);
            generalParser.parse(codigo.toString());
            //java
            let lineJava = generalParser.getLineJava()+1;
            let columnJava = generalParser.getColumnJava();
            let codigoJava = generalParser.getCodigoJava();
            //python
            let linePython = generalParser.getLinePython();
            let columnPython = generalParser.getColumnPython();
            let codigoPython = generalParser.getCodigoPython();
            //C
            let lineC = generalParser.getLineC()+1;
            let columnC = generalParser.getColumnC()+1;
            let codigoC = generalParser.getCodigoC();
            console.log("Errores Lexicos: "+JSON.stringify(erroresLexicos));
            console.log("Errores Sintacticos: "+JSON.stringify(erroresSintacticos));    
            console.log("JAVA "+lineJava+", "+columnJava+": "+codigoJava);
            console.log("PYTHON "+linePython+", "+columnPython+": "+codigoPython);
            console.log("C "+lineC+", "+columnC+": "+codigoC);
        }catch(error){
            console.log(error);
        }
        


    }
}

module.exports = Parser;