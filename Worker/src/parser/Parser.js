
class Parser{
    constructor(){
        console.log("limpieza");
        this.errores = [];
        this.resultados = [];
        this.erroresLexicos = [];
        this.erroresSintacticos = [];
    }


    parse(codigo){
        try{
        //Obteniendo codigo General
            delete require.cache[require.resolve('./general/General')]
            let generalParser = require('./general/General');
            console.log('Codigo recibido: '+codigo);
            //let errores
            let erroresLexicos = this.erroresLexicos;
            let erroresSintacticos = this.erroresSintacticos;
            generalParser.setErroresLexicos(erroresLexicos);
            generalParser.setErroresSintacticos(erroresSintacticos);
            generalParser.parse(codigo);
            //java
            let lineJava = generalParser.getLineJava();
            let columnJava = generalParser.getColumnJava();
            let codigoJava = generalParser.getCodigoJava();
            //python
            let linePython = generalParser.getLinePython();
            let columnPython = generalParser.getColumnPython();
            let codigoPython = generalParser.getCodigoPython();
            //C
            let lineC = generalParser.getLineC();
            let columnC = generalParser.getColumnC();
            let codigoC = generalParser.getCodigoC();
            //Paquete
            let paquete = generalParser.getPaquete();
            console.log("JAVA "+lineJava+", "+columnJava+": "+codigoJava);
            console.log("PYTHON "+linePython+", "+columnPython+": "+codigoPython);
            console.log("C "+lineC+", "+columnC+": "+codigoC);
            //Getting ast of python
            let astPython = this.parsePython(linePython, columnPython, codigoPython);            
            //Getting ast of Java
            let astJava = this.parseJava(lineJava, columnJava, codigoJava);
            //Getin ast of C
            let astC = this.parseC(lineC, columnC, codigoC);
            console.log("Errores Lexicos POST: "+JSON.stringify(erroresLexicos));
            console.log("Errores Sintacticos POST: "+JSON.stringify(erroresSintacticos));
            console.log("\n\nastPython: "+JSON.stringify(astPython));
            console.log("\n\nastJava: "+JSON.stringify(astJava));
            console.log("\n\nastC: "+JSON.stringify(astC));
            lineJava=0;
            columnJava=0;
            codigoJava="";
            linePython = 0;
            columnPython = 0;
            codigoPython = "";
            lineC = 0;
            columnC = 0;
            codigoC = "";
        }catch(error){
            console.log(error);
        }
    }

    parseC(line, column, code){
        delete require.cache[require.resolve('./general/c/C')]
        var C = require('./general/c/C');
        var cParser = C;
        cParser.setErroresLexicos(this.erroresLexicos);
        cParser.setErroresSintacticos(this.erroresSintacticos);
        cParser.setLineNumber(line);
        cParser.setColumnNumber(column);
        return cParser.parse(code.toString());
    }

    parseJava(line, column, code){
        delete require.cache[require.resolve('./general/java/Java')]
        var Java = require('./general/java/Java');
        var javaParser = Java;
        javaParser.setErroresLexicos(this.erroresLexicos);
        javaParser.setErroresSintacticos(this.erroresSintacticos);
        javaParser.setLineNumber(line);
        javaParser.setColumnNumber(column);
        return javaParser.parse(code.toString());
    }

    parsePython(line, column, code){
        delete require.cache[require.resolve('./general/python/Python')]
        var Python = require('./general/python/Python');
        var pythonParser = Python;
        pythonParser.setErroresLexicos(this.erroresLexicos);
        pythonParser.setErroresSintacticos(this.erroresSintacticos);
        pythonParser.setLineNumber(line);
        pythonParser.setColumnNumber(column);        
        return pythonParser.parse(code.toString()+"\n");
    }
}

module.exports = Parser;