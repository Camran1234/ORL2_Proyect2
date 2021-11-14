/*Inicio del parseo*/
%{
    //imports
    var ErrorLexico = require("../../error/LexicalError");
    var ErrorSintactico = require("../../error/SyntaxError");
    //variables
    let estado=0;
    let erroresLexicos;
    let erroresSintacticos;
    //codigo Java
    let lineJava=0;
    let columnJava=0;
    let codigoJava="";
    //codigo C
    let lineC = 0;
    let columnC = 0;
    let codigoC = "";
    //codigo python
    let linePython = 0;
    let columnPython = 0;
    let codigoPython = "";
    let dirPaquete = "";
    
    module.exports.setErroresLexicos = function (errores){
        erroresLexicos = errores;
    }

    module.exports.setErroresSintacticos = function (errores){
        erroresSintacticos = errores;
    }

    module.exports.getPaquete = function (){
        return dirPaquete;
    }

    function setCodigoPython(codigo){
        codigoPython = codigo.join('');
    }

    function setLinePython(line){
        linePython = line;
    }

    function setColumnPython(column){
        columnPython = column;
    }

    function setCodigoC(codigo){
        codigoC = codigo.join('');
    }

    function setLineC(linea){
        lineC = linea;
    }

    function setColumnC(columna){
        columnC = columna
    }

    function setCodigoJava(codigo){
        codigoJava=codigo.join('');
    }

    function setLineJava(linea){
        lineJava = linea;
    }

    function setColumnJava(column){
        columnJava = column
    }

    module.exports.getCodigoJava = function (){
        return codigoJava;
    }

    module.exports.getLineJava = function (){
        return lineJava;
    }

    module.exports.getColumnJava = function (){
        return columnJava;
    }

    module.exports.getCodigoC = function (){
        return codigoC;
    }

    module.exports.getLineC = function (){
        return lineC;
    }

    module.exports.getColumnC = function (){
        return columnC;
    }

    module.exports.getCodigoPython = function (){
        return codigoPython;
    }

    module.exports.getLinePython = function (){
        return linePython;
    }

    module.exports.getColumnPython = function(){
        return columnPython;
    }

    module.exports.getErroresLexicos = function (){
        return erroresLexicos;
    }

    module.exports.getErroresSintacticos = function (){
        return erroresSintacticos;
    }

    function addLexicalError(lexema, line, column){
        try{
            let errorLexico = new ErrorLexico(lexema, line, column);
            erroresLexicos.push(errorLexico);
        }catch(ex){
            console.log("ERROR FATAL EN addLexicalError: "+ex);
        }
    }

    function addSyntaxError(descripcion, token, line, column){
        try{
            let errorSintactico = new ErrorSintactico(descripcion, token, line, column);
            erroresSintacticos.push(errorSintactico);
        }catch(ex){
            console.log("ERROR FATAL EN addSyntaxError: "+ex);
        }
    }
    
    
%}

/* Definición Léxica */
%lex
nombre_paqueteria [aA-zZ|"_"|"-"|0-9|","|"$"|"\("|"\)"|"\["|"\]"|"\{"|"\}"]+
paqueteria {nombre_paqueteria}(["."]{nombre_paqueteria})*
chunk [^ \n\t]+
commentary "//".*
block_commentary [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]
%%

"paquete" {
    console.log("Paquete: "+yytext);
            if(estado==1){
                return 'CHUNK';
            }else {                
                return 'PAQUETE';
            }
        }
{paqueteria}    {
                    if(estado==1){
                        return 'CHUNK';
                    }else{
                        return 'PAQUETERIA';
                    }
                }
"%%PY"  {
    console.log(yytext);
    estado=1;
    return 'PY';
    }  
"%%JAVA"    {
    console.log(yytext);
    estado=1;
    return 'JAVA';
    }
"%%PROGRAMA"    {
    console.log(yytext);
    estado=1;
    return 'PROGRAMA';
    }
\s  return 'SPACE';
{commentary}  {
            if(estado==1){
                return 'CHUNK';
            }else{
                /*ignore*/;
            }
        }
{block_commentary}  {
            if(estado==1){
                return 'CHUNK';
            }else{
                /*ignore*/;
            }
        }
{chunk} {
    if(estado==0){
        addLexicalError(yytext, yylloc.first_line, yylloc.first_column);
    }else{
        return 'CHUNK';
    }
}
<<EOF>> return 'EOF';

/lex


%{
    function containLine(arreglo){
        let resultado = 0;
        for(let index=0; index<arreglo.length; index++){
            if(arreglo[index] == "\n"){
                resultado++;
                break;
            }else if(arreglo[index] == " " || arreglo[index] == "\t"){
                /*Ignore*/
            }else{
                /*For text*/
                break;
            }
        }
        return resultado;
    }
%}

%start ini

%% /* Definición de la gramática */

space_stmt
    :space_stmt SPACE {
        $1.push($2.toString());
        $$=$1
    }
    |/*empty*/ {
        $$ = [];
    }
    ;

texto
    :texto CHUNK {
        $1.push($2.toString());
        $$ = $1;
    }
    |texto SPACE {
        $1.push($2.toString());
        $$ = $1;
    }
    | /*empty*/ {
        $$=[];
    }
    ;

ini
	:paqueteria EOF 
    |paqueteria error EOF {addSyntaxError("Se esperaba el final del archivo", $2, this._$.first_line, this._$.first_column);} 
	;

paqueteria
    : space_stmt PAQUETE space_stmt PAQUETERIA space_stmt condicional_py {dirPaquete = $4.toString();}
    | space_stmt error {addSyntaxError("Paqueteria no encontrada, falta agregar \'paqueteria\'",$2, this._$.first_line, this._$.first_column);}
    | space_stmt PAQUETE space_stmt error {addSyntaxError("direccion de paquete no encontrada",$4, this._$.first_line, this._$.first_column);}
    | space_stmt PAQUETE space_stmt PAQUETERIA space_stmt error {addSyntaxError("Se esperaba el codigo python, agregar \'%%PY\' para leer el codigo",$6, this._$.first_line, this._$.first_column);}
    ;

condicional_py
    :PY texto condicional_java {
        setCodigoPython($2);
        setLinePython(this._$.first_line+containLine($2));
        setColumnPython(this._$.first_column);
    }
    |PY texto error {addSyntaxError("Se esperaba el codigo JAVA, agregar \'%%JAVA\'", $3, this._$.first_line, this._$.first_column);}
    ;

condicional_java
    :JAVA texto condicional_c {
        console.log("INICIANDO AQUI");
        setCodigoJava($2);
        setLineJava(this._$.first_line+containLine($2));
        setColumnJava(this._$.first_column);
    }
    |JAVA texto error {addSyntaxError("Se esperaba el codigo C, agregar \'%%PROGRAMA\'",$3, this._$.first_line, this._$.first_column);}
    ;

condicional_c
    :PROGRAMA texto{
        setCodigoC($2);
        setLineC(this._$.first_line+containLine($2));
        setColumnC(this._$.first_column);
    }
    ;
