
class Parser{
    constructor(tablaTipos, estado){
        
        this.resultados = [];
        this.erroresLexicos = [];
        this.erroresSintacticos = [];
        this.erroresSemanticos = [];
        this.astC = null;
        this.astJava = null;
        this.astPython=null;
        this.tablaTipos = tablaTipos;
        this.dirPaquete = "";

        //0 analiza todo
        //1 analiza Python unicamente
        //2 analiza Java unicamente
        this.estado = estado;
        this.ast = [];
    }

    haveErrores(){
        if(this.erroresLexicos.length == 0 && this.erroresSintacticos.length ==0
            && this.erroresSemanticos.length ==0){
            return false;
        }
        return true;
    }

    getAst(){
        return this.ast;
    }

    imprimirAst(){
        console.log(JSON.stringify(this.ast));
    }

    

    getErrores(){
        let errores = [];
        for(let index=0; index<this.erroresLexicos.length; index++){
            errores.push(this.erroresLexicos[index].toError());
        }
        for (let index=0; index<this.erroresSintacticos.length; index++){
            errores.push(this.erroresSintacticos[index].toError());
        }
        for (let index=0; index<this.erroresSemanticos.length; index++){
            errores.push(this.erroresSemanticos[index].toError());
        }
        if(errores.length == 0){
            errores.push({
                Fila:"Sin errores",
                Columna:"Sin errores",
                Tipo_de_Error:"Sin errores",
                Simbolo_provocador:"Sin errores",
                Descripcion:"Sin errores"
            });
        }

        return errores;
    }

    push(ast, array){
        for(let index=0; index<ast.length; index++){
            array.push(ast[index]);
        }
        return array;
    }

    unificarAst(ast){
        for(let index=0; index<ast.length; index++){
            this.ast.unshift(ast[index]);
        }
    }

    procesarAST(astC, astJava, astPython, paqueteria){
        let Procesador = require('./Procesador');
        let procesador = new Procesador(this.tablaTipos, this.erroresSemanticos);
        let helper = null;
        if(this.estado ==0){
            helper = procesador.procesar(astPython, paqueteria, null);
            this.unificarAst(helper);
            helper = procesador.procesar(astJava, paqueteria, null);
            this.unificarAst(helper);
            helper = procesador.procesar(astC, paqueteria, null);
            this.unificarAst(helper);
        }else if(this.estado == 1){
            helper = procesador.procesar(astPython, paqueteria, null);
            this.unificarAst(helper);
        }else if(this.estado == 2){
            helper = procesador.procesar(astJava, paqueteria, null);
            this.unificarAst(helper);
        }
    }

    reversaArreglo(arr){
        let aux = [];
        for(let index=arr.length-1; index>=0; index--){
            aux.push(arr[index]);
        }
        return aux;
    }

    getCodigo3D(){
        if(this.haveErrores() == false){
            let Cuarteto = require('../parser/general/Cuarteto');
            let cuartetoF = new Cuarteto(this.tablaTipos);
            let resultado = cuartetoF.procesar(this.reversaArreglo(this.ast), 1);
            /*if(this.tablaTipos.isCompiler()){
                let cadena = this.tablaTipos.declararT();
                cadena += resultado;
                resultado = cadena;
            }*/
            return resultado;
        }       
    }

    getCodigoC(){
        if(this.haveErrores() == false){
            this.tablaTipos.setCompilerMode(true);
            let Cuarteto = require('../parser/general/Cuarteto');
            let cuartetoF = new Cuarteto(this.tablaTipos);
            let resultado = cuartetoF.procesar(this.reversaArreglo(this.ast), 1);
            return resultado;
        }
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
            //
            let dirPaquete = generalParser.getPaquete();
            //java
            let lineJava = generalParser.getLineJava()-1;
            let columnJava = generalParser.getColumnJava();
            let codigoJava = generalParser.getCodigoJava();
            //python
            let linePython = generalParser.getLinePython()-2;
            let columnPython = generalParser.getColumnPython();
            let codigoPython = generalParser.getCodigoPython();
            //C
            let lineC = generalParser.getLineC()-2;
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
            this.procesarAST(astC, astJava, astPython, dirPaquete);
            console.log("Errores Lexicos POST: "+JSON.stringify(erroresLexicos));
            console.log("Errores Sintacticos POST: "+JSON.stringify(erroresSintacticos));
            console.log("Errores Semanticos POST: "+JSON.stringify(this.erroresSemanticos));
            console.log("\n\nastPython: "+JSON.stringify(astPython));
            console.log("\n\nastJava: "+JSON.stringify(astJava));
            console.log("\n\nastC: "+JSON.stringify(astC));
            return this.ast;
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