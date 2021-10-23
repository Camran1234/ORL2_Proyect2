/*Parsea Java*/

%{
    //import
    var ErrorLexico = require('../../../error/LexicalError.js');
    var ErrorSintactico = require('../../../error/SyntaxError.js');
    //Errores
    var erroresLexicos = [];
    var erroresSintacticos = [];

    //Lineas extras
    var lineNumber = 0;
    var columnNumber=0;

    module.exports.setLineNumber = function(line){
        lineNumber = line;
    }

    module.exports.setColumnNumber = function(column){
        columnNumber=column;
    }

    module.exports.setErroresLexicos = function(errors){
        erroresLexicos = errors;
    }

    module.exports.setErroresSintacticos = function(errors){
        erroresSintacticos = errors;
    }

    function getLexicalErrors(){
        return lexicalErrorsArray;
    }

    function addLexicalError(lexema, linea, column){   
        try{
            var errorLexico = new ErrorLexico(lexema, linea, column);
            erroresLexicos.push(errorLexico);
        }catch(ex){
            console.log(ex);
        }                  
    }

    function addSyntaxError(descripcion, token, line, column){
		try{
			var errorSintactico = new ErrorSintactico(descripcion, token, line, column);
			erroresSintacticos.push(errorSintactico);
		}catch(ex){
			console.log(ex);
		}
	}
%}

%lex
commentary "//".*
block_commentary [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]	
%%

\s+                                 /*ignore*/;
{commentary}          /*ignore*/;
{block_commentary} /*ignore*/;
"package"  { 
                return 'PACKAGE';
            }

">=" { 
            return 'MAYOR_IGUAL';       
            }
"<=" { 
            return 'MENOR_IGUAL';       
            }
"!=" { 
    return 'DIFERENTE';               
            }
"==" {return 'COMPARACION';}

"&&" { 
                           return 'AND';       
            }
"&"		return 'PUNTERO';
"||" { 
                           return 'OR';       
            }
"!" { 
                           return 'NOT';       
            }

"+=" { 
                           return 'O_MAS';       
            }
"-=" { 
                           return 'O_MENOS';       
            }
"/=" { 
                           return 'O_DIV';       
            }
"*=" { 
                           return 'O_POR';       
            }
"%=" { 
                           return 'O_MOD';       
            }
"^=" { 
                           return 'O_POW';       
            }
"=" { 
                           return 'IGUAL';       
            }

"++" { 
                           return 'INCREMENTO';       
            }
"--" { 
                           return 'DECREMENTO';       
            }
"+" { 
                           return 'SUMA';       
            }
"-" { 
                           return 'RESTA';       
            }
"*" { 
                           return 'POR';       
            }
"/" { 
                           return 'DIV';       
            }
"%" { 
                           return 'MOD';       
            }
"^" { 
                           return 'POW';       
            }
">" { 
                           return 'MAYOR';       
            }
"<" { 
                           return 'MENOR';       
            }


"int" { 
                           return 'INT';       
            }
"float" { 
                           return 'FLOAT';       
            }
"double" { 
                           return 'DOUBLE';       
            }
"boolean" { 
                           return 'BOOLEAN';       
            }
"char" { 
                           return 'CHAR';       
            }
"String" { 
                           return 'STRING';       
            }
"void" { 
                           return 'VOID';       
            }
"true" { 
                           return 'TRUE';       
            }
"false" { 
                           return 'FALSE';       
           }


"(" { 
                           return 'OPEN_PARENTHESIS';       
            }
")" { 
                           return 'CLOSE_PARENTHESIS';       
           }
"[" { 
                           /*return 'OPEN_BRACKET';*/    
            }
"]" { 
                           /*return 'CLOSE_BRACKET';*/
            }
"{" { 
                           return 'OPEN_CURLY';       
            }
"}" { 
                           return 'CLOSE_CURLY';       
            }
";" { 
                           return 'COLON';       
            }
":" { 
                           return 'SEMI_COLON';       
            }
"," { 
                           return 'COMA';       
            }



"public" { 
                           return 'PUBLIC';       
            }
"private" { 
                           return 'PRIVATE';       
            }


"intinput" { 
                           return 'INTINPUT';       
            }
"floatinput" { 
                           return 'FLOATINPUT';       
            }
"charinput" { 
                           return 'CHARINPUT';       
            }
//Declaraciones
"return" {
        
                           return 'RETURN';       
    }

"for" { 
                           return 'FOR';       
            }
"while" { 
                           return 'WHILE';       
            }
"do" { 
                           return 'DO';       
            }
"extends"   return 'EXTENDS';
"switch" { 
                           return 'SWITCH';       
            }
"default" { 
                           return 'DEFAULT';       
            }
"if" { 
                           return 'IF';       
            }
"else" { 
                           return 'ELSE';       
            }


"print" { 
                           return 'PRINT';       
            }
"println" { 
                           return 'PRINTLN';       
            }
//Declaraciones de ciclos
"continue" { 
                           return 'CONTINUE';       
            }
"break" { 
                           return 'BREAK';       
            }
"case" { 
                           return 'CASE';       
            }
"class" { 
                           return 'CLASS';       
            }
"this" { 
                           return 'THIS';       
            }


\"[^\"]*\"  { 
                           yytext = yytext.substr(1,yyleng-2); 
                    return 'CADENA'; 
            }
             
\'[^\']\'   { 
                           yytext = yytext.substr(1,yyleng-2); 
                    return 'CARACTER';
            }


[0-9]+("."[0-9]+)\b { 
                           return 'DECIMAL';       
            }
[0-9]+\b { 
                           return 'ENTERO';       
            }
[aA-zZ|"_"|"$"]([aA-zZ]|[0-9]|"_"|"$")* { 
                           return 'IDENTIFICADOR';       
            }
"." { return 'DOT'; }

<<EOF>> return 'EOF';
.+   { addLexicalError(yytext, linea(yylloc.first_line), columna(yylloc.first_column));}					


/lex
%{
    const TIPO_VISIBILIDAD = require('../../../api/Instrucciones').TIPO_VISIBILIDAD;
    const TIPO_LENGUAJE = require('../../../api/Instrucciones').TIPO_LENGUAJE;
    const TIPO_DATO = require('../../../api/Instrucciones').TIPO_DATO;
    const TIPO_VALOR = require('../../../api/Instrucciones').TIPO_VALOR;
    const TIPO_OPERACION = require('../../../api/Instrucciones').TIPO_OPERACION;
    const TIPO_INSTRUCCION = require('../../../api/Instrucciones').TIPO_INSTRUCCION;
    const TIPO_PRINT = require('../../../api/Instrucciones').TIPO_PRINT;
    const instruccionesApi = require('../../../api/InstruccionesApi').instruccionesApi;
    const lenguaje = TIPO_LENGUAJE.JAVA;

    function reversaArreglo(arreglo){
        var aux = [];
        for(var index=arreglo.length-1; index>=0; index--){
            aux.push(arreglo[index]);
        }
        return aux;
    }

   function linea(linea){
        return linea + lineNumber;
    }

    function columna(column){
        return column + columnNumber;
    }
%}
    %left 'PUBLIC' 'PRIVATE'
    %left 'OR'
    %left 'AND'    
    %left 'MAYOR_IGUAL' 'MENOR_IGUAL' 'DIFERENTE' 'COMPARACION' 'MAYOR' 'MENOR' 'IGUAL'
    %left 'NOT'
    %left 'SUMA' 'RESTA'
    %left 'POR' 'DIV' 'MOD'
    %left 'POW'
    %left 'UMINUS'
    %left 'OPEN_PARENTHESIS' 'CLOSE_PARENTHESIS'
    
    

%start init_java

%% 
/*Definicion de la gramatica*/

init_java
    : ini EOF {return reversaArreglo($1);}
    ;

ini 
    : class_stmt ini {
        $2.push($1);
        $$=$2;
    }
    | error ini {addSyntaxError("Se espera una clase de java", $1, linea(this._$.first_line), columna(this._$.first_column));$$=$2;}
    | /*empty*/ {$$=[];}
        ;

concatenate_values
        :expresion concatenate_values_re{{
            $2.push($1);
            $$= reversaArreglo($2);
        }}
        |expresion error {addSyntaxError("Se esperaba mas parametros o \')\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        ;

concatenate_values_re
        :COMA expresion concatenate_values_re{
            $3.push($2);
            $$=$3;
        }
        |COMA error concatenate_values_re {addSyntaxError("Se esperaba una expresion", $2, linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
        |CLOSE_PARENTHESIS {$$=[];}
        ;

print
        :PRINT {$$=TIPO_PRINT.PRINT;}
        |PRINTLN {$$=TIPO_PRINT.PRINTLN;}
        ;

print_stmt
        :print OPEN_PARENTHESIS concatenate_values{
            $$ = instruccionesApi.nuevoImprimir($3,$1, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        }
        | print error {addSyntaxError("Se esperaba \'(\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | print OPEN_PARENTHESIS error {addSyntaxError("Error de parametros, agregar parametros o un cierre \')\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        ;


identifier
        : PUBLIC {$$=TIPO_VISIBILIDAD.PUBLIC;}
        | PRIVATE {$$=TIPO_VISIBILIDAD.PRIVATE;}
        ;
data_type
        : INT {$$=TIPO_DATO.INT;}
        | STRING {$$=TIPO_DATO.STRING;}
        | CHAR {$$=TIPO_DATO.CHAR;}
        | BOOLEAN {$$=TIPO_DATO.BOOLEAN;}
        | FLOAT {$$=TIPO_DATO.FLOAT;}
        | DOUBLE {$$=TIPO_DATO.FLOAT;}
        | VOID  {$$=TIPO_DATO.VOID;}
        ;

entry_stmt
    : INTINPUT {$$=TIPO_VALOR.INPUT_INT;}
    | FLOATINPUT    {$$=TIPO_VALOR.INPUT_FLOAT;}
    | CHARINPUT {$$=TIPO_VALOR.INPUT_CHAR;}
    ;

this_stmt
    : THIS DOT IDENTIFICADOR {$$=instruccionesApi.nuevoValor($3,null, TIPO_VALOR.THIS_IDENTIFICADOR,lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    | THIS error {addSyntaxError("Agregar \'.\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | THIS DOT error {addSyntaxError("Se esperaba un identificador", $3, linea(this._$.first_line), columna(this._$.first_column));}
    | IDENTIFICADOR {$$=instruccionesApi.nuevoValor($1,null, TIPO_VALOR.IDENTIFICADOR,lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    ;

extends_re
    :EXTENDS IDENTIFICADOR {$$=$2;}
    |EXTENDS error {addSyntaxError("Se esperaba el nombre de otra clase a extender", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | /*empty*/ {$$=null;}
    ;

class_stmt
        : PUBLIC CLASS IDENTIFICADOR extends_re OPEN_CURLY class_instructions {
            $$ = instruccionesApi.nuevaClase(TIPO_VISIBILIDAD.PUBLIC, $3, $4,reversaArreglo($6), null, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        }
        | PUBLIC error  {addSyntaxError("Se esperaba \'class\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | PUBLIC CLASS error  {addSyntaxError("Agregar un identificador a la clase", $3, linea(this._$.first_line), columna(this._$.first_column));}
        | PUBLIC CLASS IDENTIFICADOR extends_re error {addSyntaxError("Se esperaba {", $4, linea(this._$.first_line), columna(this._$.first_column));}
        ;

class_instructions
        :  identifier class_instruction class_instructions{
            if($2.rol == TIPO_INSTRUCCION.VARIABLE){
                let arregloVar = $2.arreglo;
                for(let index=0; index<arregloVar.length; index++){
                    let helperV = arregloVar[index];
                    helperV.visibilidad = $1;
                }
            }else{
                $2.visibilidad = $1;
            }            
            $3.push($2);
            $$=$3;        
        }
        |  identifier error class_instructions {
            addSyntaxError("No es un miembro, agregar un miembro con modificador \'public\' o \'private\'", $3, linea(this._$.first_line), columna(this._$.first_column));
            $$=$3;
        }
        |  error  class_instructions{
            addSyntaxError("Se esperaba una variable o funcion", $1, linea(this._$.first_line),columna(this._$.first_column));
            $$=$2;
        }
        | CLOSE_CURLY  {$$=[];}
        ;
ides
    :IDENTIFICADOR {var arreglo = []; arreglo.push($1); arreglo.push(false); $$=arreglo; }
    |PUNTERO IDENTIFICADOR {var arreglo = []; arreglo.push($2); arreglo.push(true); $$=arreglo;}
    ;
function_parameters
        : data_type ides function_parameters_re{
            var parametro = instruccionesApi.nuevoParametro($2[0], $1,$2[1], lenguaje, linea(this._$.first_line), columna(this._$.first_column));
            $3.push(parametro);
            $$=reversaArreglo($3);
        }
        | data_type error {addSyntaxError("Agregar un identificador", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | CLOSE_PARENTHESIS {$$=[];}
        ;

function_parameters_re
        :  COMA data_type ides function_parameters_re {
            var parametro2 = instruccionesApi.nuevoParametro($3[0], $2,$3[1], lenguaje, linea(this._$.first_line), columna(this._$.first_column));
            $4.push(parametro2);
            $$= $4;
        }
        |  COMA error function_parameters_re {addSyntaxError("Se esperaba un tipo mas identificador, ejemplo: \'int x\'", $3, linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
        |  COMA data_type error  function_parameters_re{addSyntaxError("Agregar un identificador", $4, linea(this._$.first_line), columna(this._$.first_column));$$=$4;}
        | CLOSE_PARENTHESIS{
            $$=[];
        }
        | error function_parameters_re {addSyntaxError("Se esperaba \')\'", $1, linea(this._$.first_line), columna(this._$.first_column));$$=$2;}
        ;

function_stmt
        :  IDENTIFICADOR OPEN_PARENTHESIS function_parameters OPEN_CURLY instructions {            
            $$ = instruccionesApi.nuevaFuncion(null, $1,null, reversaArreglo($5), $3, lenguaje, linea(this._$.first_line), columna(this._$.first_column))
        }
        | IDENTIFICADOR error  {addSyntaxError("Se esperaba \'(\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | IDENTIFICADOR OPEN_PARENTHESIS error {addSyntaxError("Se esperaba parametros o \')\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | IDENTIFICADOR OPEN_PARENTHESIS function_parameters error {addSyntaxError("No es una declaracion", $4, linea(this._$.first_line), columna(this._$.first_column));} 
        ;

variable_stmt
        : IDENTIFICADOR asignacion_variable variable_stmt_re{
            var id = instruccionesApi.nuevoValor($1,null, TIPO_VALOR.IDENTIFICADOR,lenguaje, linea(this._$.first_line), columna(this._$.first_column));
            for(var index=0; index<$2.length; index++){
                $2[index].id= id;
                $3.push($2[index]);
            }
            $3.push(instruccionesApi.nuevaDeclaracion(null, id,[], null, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
            $$=reversaArreglo($3);
        }
        ;

variable_stmt_re
        :  COMA IDENTIFICADOR asignacion_variable variable_stmt_re{
            var id = instruccionesApi.nuevoValor($2,null, TIPO_VALOR.IDENTIFICADOR,lenguaje, linea(this._$.first_line), columna(this._$.first_column));
            for(var index=0; index<$3.length; index++){
                $3[index].id = id;
                $4.push($3[index]);
            }
            $4.push(instruccionesApi.nuevaDeclaracion(null, id,[], null, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
            $$=$4;
        }
        |  COMA error variable_stmt_re {addSyntaxError("Se esperaba un identificador", $3, linea(this._$.first_line), columna(this._$.first_column)); $$=$3;}
        | COLON {$$=[];}
        ;

class_statements
        : variable_stmt {$$=instruccionesApi.nuevaVariable($1, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
        | function_stmt {$$=$1;}
        | error {addSyntaxError("Se esperaba modificadores de la clase, pueden ser public o private", $1, linea(this._$.first_line), columna(this._$.first_column));}
        ;

constructor_class
        : IDENTIFICADOR OPEN_PARENTHESIS function_parameters OPEN_CURLY instructions{
            $$ = instruccionesApi.nuevoConstructor(null, $1, reversaArreglo($5), $3, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        }
        | IDENTIFICADOR error {addSyntaxError("Se esperaba \'(\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | IDENTIFICADOR OPEN_PARENTHESIS error {addSyntaxError("Se esperaban parametros o un cierre \')\'", $3, linea(this._$.first_line), columna(this._$.first_column));}
        | IDENTIFICADOR OPEN_PARENTHESIS function_parameters error {addSyntaxError("Se esperaba \'}\'", $4, linea(this._$.first_line), columna(this._$.first_column));}
        ;

class_instruction
        : data_type class_statements{
            
            if($2.rol == TIPO_INSTRUCCION.VARIABLE){
                let variableArreglo = $2.arreglo;
                for(var index=0; index< variableArreglo.length; index++){
                    let varD = variableArreglo[index];
                    varD.tipo = $1;
                }
            }else{
               $2.tipo = $1; 
            }
            $$=$2;
        }
        | constructor_class{$$=$1;}
        ;

instructions 
        : instruction instructions{
            $2.push($1);
            $$=$2;
        }
        | error instructions {addSyntaxError("Se esperaba una declaracion", $1, linea(this._$.first_line), columna(this._$.first_column));$$=$2;}
        | CLOSE_CURLY{
            $$=[];
        }
        ;

instruction
        : variable  {$$=$1;}
        | if_stmt   {$$=$1;}
        | else_stmt {$$=$1;}
        | switch_stmt {$$=$1;}
        | for_stmt  {$$=$1;}
        | while_stmt    {$$=$1;}
        | do_stmt COLON {$$=$1;}
        | do_stmt error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | metodo COLON {$$=$1;}
        | metodo error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | print_stmt COLON  {$$=$1;}
        | print_stmt error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | CONTINUE COLON    {$$=instruccionesApi.nuevoContinue(linea(this._$.first_line), columna(this._$.first_column));}
        | CONTINUE error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | BREAK COLON   {$$=instruccionesApi.nuevoBreak(linea(this._$.first_line), columna(this._$.first_column));}
        | BREAK error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | RETURN expresion COLON  {$$=instruccionesApi.nuevoReturn($2, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
        | RETURN expresion error {addSyntaxError("Se esperaba \';\'", $3, linea(this._$.first_line), columna(this._$.first_column));}
        | RETURN error {addSyntaxError("Se esperaba un valor a retornar", $2, linea(this._$.first_line), columna(this._$.first_column));}
        ;

stmt_enclusure
    : OPEN_CURLY instructions {$$=reversaArreglo($2);}
    | instruction {$$=$1;}
    | error {addSyntaxError("Se esperaba una declaracion o \'{\'", $1, linea(this._$.first_line), columna(this._$.first_column));}
    ;
/*Variable*/
increm
    : INCREMENTO {$$=TIPO_OPERACION.INCREMENTO;}
    | DECREMENTO    {$$=TIPO_OPERACION.DECREMENTO;}
    ;

valor_variable
    :expresion {$$=$1;}
    |entry_stmt {$$=$1;}
    |error {addSyntaxError("Se esperaba una expresion o valor par asignar", $1, linea(this._$.first_line), columna(this._$.first_column));}
    ;

metodo_asignacion
    :IGUAL {$$=TIPO_OPERACION.IGUAL;}
    | O_MAS {$$=TIPO_OPERACION.SUMA;}
    | O_MENOS   {$$=TIPO_OPERACION.RESTA;}
    | O_POR {$$=TIPO_OPERACION.MULTIPLICACION;}
    | O_DIV {$$=TIPO_OPERACION.DIVISION;}
    | O_MOD {$$=TIPO_OPERACION.MOD;}
    | O_POW {$$=TIPO_OPERACION.POW;}
    ;

igualacion_re
    : metodo_asignacion valor_variable igualacion_re{
        var valorAsignado = instruccionesApi.nuevaAsignacion_O(null,[], $1, $2, lenguaje, linea(this._$.first_line), columna(this._$.first_column)  );
        $3.push(valorAsignado);
        $$=$3;
    }
    |  /*empty*/ {$$=[];}
    ;

asignacion_variable
    : metodo_asignacion valor_variable igualacion_re{
        $3.push(instruccionesApi.nuevaAsignacion_O(null,[], $1, $2, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$=reversaArreglo($3);
    }
    |  /*empty*/ {$$=[];}
    ;

asignacion
    : metodo_asignacion valor_variable igualacion_re{
        $3.push(instruccionesApi.nuevaAsignacion_O(null,[], $1, $2, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$ = reversaArreglo($3);
    }
    | increm {
        var arreglo = [];
        arreglo.push(instruccionesApi.nuevaAsignacion_O(null,[], $1, null, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$ = arreglo;
    }
    |  /*empty*/ {$$=[];}
    ;

asignacion_post
    : metodo_asignacion valor_variable igualacion_re{
        $3.push(instruccionesApi.nuevaAsignacion_O(null,[], $1, $2, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$ = reversaArreglo($3);
    }
    | increm {
        var expresion = instruccionesApi.nuevoValor("1",null,TIPO_VALOR.ENTERO, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        var arreglo = [];
        arreglo.push(instruccionesApi.nuevaAsignacion_O(null,[], $1, expresion, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$ = arreglo;
    }
    ;

nombre_variables
    : this_stmt asignacion_variable nombre_variables_re{
        for(var index=0; index<$2.length; index++){
            $2[index].id = $1;
            $3.push($2[index]);
        }
        $3.push(instruccionesApi.nuevaDeclaracion(null, $1,[],null, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$=reversaArreglo($3);
    }
    ;

nombre_variables_re
    :  COMA this_stmt asignacion_variable nombre_variables_re {
        for(var index=0; index<$3.length; index++){
            $3[index].id = $2;
            $4.push($3[index]);
        }
        $4.push(instruccionesApi.nuevaDeclaracion(null, $2,[], null, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$=$4;
    }
    |  COMA error nombre_variables_re  {addSyntaxError("Se esperaba una variable", $2, linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
    | error {addSyntaxError("Se esperaba \';\'", $1, linea(this._$.first_line), columna(this._$.first_column));}
    | COLON {$$=[];}
    ;

variable
    : data_type nombre_variables {
        for(var index=0; index<$2.length; index++){
            if($2[index].rol == TIPO_INSTRUCCION.DECLARACION){
                $2[index].tipo = $1;
                $2[index].visibilidad = TIPO_VISIBILIDAD.LOCAL;
            }
        }
        $$= instruccionesApi.nuevaVariable($2, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
    }
    | data_type error {addSyntaxError("Se esperaba un identificador (variable) ", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | this_stmt asignacion_post COLON{
        for(var index=0; index<$2.length; index++){
            $2[index].id = $1;
        }
        $$ = instruccionesApi.nuevaVariable($2, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
    }     
    | this_stmt error  {addSyntaxError("Una asignacion era esperada", $2, linea(this._$.first_line), columna(this._$.first_column));} 
    | this_stmt asignacion_post error {addSyntaxError("Se esperaba \';\'", $3, linea(this._$.first_line), columna(this._$.first_column));}
    ;
/*End of Variable*/
/*INIT of metodo*/
parameters
    : expresion parameters_re{
        $2.push($1);
        $$=reversaArreglo($2);
    }
    |error parameters {addSyntaxError("Se esperaba una expresion", $1, linea(this._$.first_line), columna(this._$.first_column));}
    |CLOSE_PARENTHESIS {$$=[];}
    ;

parameters_re
    : COMA expresion parameters_re {
        $3.push($2);
        $$=$3;
    }
    |error parameters_re {addSyntaxError("Se esperaba una expresion", $1, linea(this._$.first_line), columna(this._$.first_column));}
    | CLOSE_PARENTHESIS {$$=[];}
    ;

expresion
    :expresion AND expresion    {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.AND, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion OR expresion {$$=instruccionesApi.operacionAritmetica($1, $3, TIPO_OPERACION.OR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |NOT expresion  {$$=instruccionesApi.operacionUnaria($2, TIPO_OPERACION.NOT, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion MENOR expresion  {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.MENOR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion MENOR_IGUAL expresion    {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.MENOR_IGUAL, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion MAYOR expresion  {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.MAYOR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion MAYOR_IGUAL expresion    {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.MAYOR_IGUAL, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion DIFERENTE expresion {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.DIFERENTE, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion COMPARACION expresion    {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.COMPARACION, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion SUMA expresion   {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.SUMA, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion RESTA expresion  {$$=instruccionesApi.operacionAritmetica($1, $3, TIPO_OPERACION.RESTA, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion POR expresion    {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.MULTIPLICACION, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion DIV expresion    {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.DIVISION, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion MOD expresion    {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.MOD, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion POW expresion {$$=instruccionesApi.operacionAritmetica($1, $3, TIPO_OPERACION.POW, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS {$$=$2;}
    |ENTERO     {$$=instruccionesApi.nuevoValor($1,null, TIPO_VALOR.ENTERO, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |DECIMAL    {$$=instruccionesApi.nuevoValor($1,null, TIPO_VALOR.DECIMAL, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |RESTA expresion %prec UMINUS   {$$=instruccionesApi.operacionUnaria($2, TIPO_OPERACION.NEGATIVO, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |this_stmt accion_increm {$$=instruccionesApi.operacionUnaria($1, $2, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |this_stmt  {$$=$1;}
    |CADENA {$$=instruccionesApi.nuevoValor($1,null, TIPO_VALOR.CADENA, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |CARACTER {$$=instruccionesApi.nuevoValor($1,null, TIPO_VALOR.CARACTER, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |booleanos {$$=instruccionesApi.nuevoValor($1,null, TIPO_VALOR.BOOLEAN, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |metodo {$$=instruccionesApi.nuevoValor($1,null, TIPO_VALOR.METODO, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    ;

booleanos
    :TRUE {$$="true";}
    |FALSE {$$="false";}
    ;

accion_increm
    : INCREMENTO {$$=TIPO_OPERACION.INCREMENTO;}
    | DECREMENTO    {$$=TIPO_OPERACION.DECREMENTO;}
    ;

metodo
    : IDENTIFICADOR OPEN_PARENTHESIS parameters {
        var newMetodo = instruccionesApi.nuevoMetodo($1, $3, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        $$= newMetodo;
    }
    ;
/*End of Metodo*/
/*Init IF*/
block_condition
    : expresion CLOSE_PARENTHESIS {$$=$1;}
    | expresion error {addSyntaxError("Se esperaba \')\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | error CLOSE_PARENTHESIS {addSyntaxError("Se esperaba una expresion", $1, linea(this._$.first_line), columna(this._$.first_column));}
    ;

if_stmt
    : IF OPEN_PARENTHESIS block_condition stmt_enclusure {
        $$ = instruccionesApi.nuevoIf($3, $4, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
    }
    | IF error {addSyntaxError("Se esperaba \'(\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | IF OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una condicion", $3, linea(this._$.first_line), columna(this._$.first_column));}
    ;

else_stmt
    : ELSE stmt_enclusure {
        var else_ = instruccionesApi.nuevoElse(null, null, null, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        if(!Array.isArray($2)){
            if($2.rol == TIPO_INSTRUCCION.IF){
                else_.condicion = $2.condicion;
                else_.instrucciones = $2.instrucciones;
            }else{
                console.log("ERROR EN ELSE_STMT");
            }
        }else{
            else_.instrucciones = $2;
        }
        $$=else_;
    }
    ;

/*End of IF*/
/*Init of Switch*/

switch_instructions 
        : switch_instruction switch_instructions{
            $2.push($1);
            $$=$2;
        }
        | error switch_instructions {addSyntaxError("Se esperaba una declaracion", $1, linea(this._$.first_line), columna(this._$.first_column));$$=$2;}
        | BREAK COLON {
            $$=[];
        }
        | BREAK error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        ;

default_instructions
        : switch_instruction default_instructions{
            $2.push($1);
            $$=$2;
        }
        | error default_instructions  {addSyntaxError("Se esperaba una declaracion", $1, linea(this._$.first_line), columna(this._$.first_column));$$=$2;}
        | CLOSE_CURLY{
            $$=[];
        }
        ;

switch_instruction
        : variable {$$=$1;}
        | if_stmt {$$=$1;}
        | else_stmt {$$=$1;}
        | switch_stmt {$$=$1;}
        | for_stmt {$$=$1;}
        | while_stmt {$$=$1;}
        | do_stmt COLON {$$=$1;}
        | do_stmt error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | metodo COLON {$$=$1;}
        | metodo error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        |print_stmt COLON {$$=$1;}
        | print_stmt error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | CONTINUE COLON {$$=instruccionesApi.nuevoContinue(linea(this._$.first_line), columna(this._$.first_column));}
        | CONTINUE error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
        | RETURN expresion COLON  {$$=instruccionesApi.nuevoReturn($2, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
        | RETURN error   {addSyntaxError("Se esperaba un valor para retornar", $2, linea(this._$.first_line), columna(this._$.first_column));}
        |RETURN expresion error {addSyntaxError("Se esperaba \';\'", $3, linea(this._$.first_line), columna(this._$.first_column));}
        ;

switch_stmt
    : SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases_stmt{
        $$=instruccionesApi.nuevoSwitch($3, reversaArreglo($6), lenguaje, linea(this._$.first_line), columna(this._$.first_column));
    }
    | SWITCH error {addSyntaxError("Se esperaba \'(\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | SWITCH OPEN_PARENTHESIS error {addSyntaxError("Se esperaba un identificador", $3, linea(this._$.first_line), columna(this._$.first_column));}
    | SWITCH OPEN_PARENTHESIS IDENTIFICADOR error {addSyntaxError("Se esperaba \')\'", $4, linea(this._$.first_line), columna(this._$.first_column));}
    | SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS error cases_stmt {addSyntaxError("Se esperaba \'{\'", $5, linea(this._$.first_line), columna(this._$.first_column));} 
    ;

cases_stmt
    : CASE expresion SEMI_COLON switch_instructions cases_stmt{
        $5.push(instruccionesApi.nuevoCase($2, reversaArreglo($4), lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$= $5;
    }
    | CASE error cases_stmt {addSyntaxError("Se esperaba una expresion", $2, linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
    | CASE expresion error cases_stmt  {addSyntaxError("Se esperaba \':\'", $3, linea(this._$.first_line), columna(this._$.first_column));$$=$4;}
    | DEFAULT SEMI_COLON default_instructions CLOSE_CURLY {
        var arreglo = [];
        arreglo.push(instruccionesApi.nuevoDefault(reversaArreglo($3), lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$=arreglo;
    }
    | DEFAULT error {addSyntaxError("Se esperaba \':\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | DEFAULT SEMI_COLON default_instructions error {addSyntaxError("Se esperaba \'}\'", $4, linea(this._$.first_line), columna(this._$.first_column));}
    | error cases_stmt {addSyntaxError("Se esperaba un caso o \'}\'", $1, linea(this._$.first_line), columna(this._$.first_column));$$=$2;}
    | CLOSE_CURLY {$$=[];}
    ;
/*End of Switch*/
/*Init For*/


this_asignacion
    :   this_stmt asignacion {
            for(var index=0; index<$2.length; index++){
                $2[index].id = $1;
            }
            $$ = $2;
        }
    ;

for_accion
    : this_asignacion {$$=$1;}
    | metodo {$$=$1;}
    | print_stmt {$$=$1;}
    ;

declaraciones_post
    : for_accion declaraciones_post_re{
        $2.push($1);
        $$=reversaArreglo($2);
    }
    ;

declaraciones_post_re
    : COMA for_accion declaraciones_post_re{
        $3.push($2);
        $$=$3;
    }
    | COMA error declaraciones_post_re {
        addSyntaxError("Se esperaba una accion", ", "+$2, linea(this._$.first_line), columna(this._$.first_column));
        $$=$3;
        }
    |error declaraciones_post_re {addSyntaxError("Se esperaba \';\'", $1, linea(this._$.first_line), columna(this._$.first_column));$$=$2;}
    | COLON {$$=[];}
    ;

declaracion_for
    : data_type this_stmt asignacion declaracion_for_re{
        for(var index=0; index<$2.length; index++){
                $2[index].id = $1;
            }
        $2.push(instruccionesApi.nuevaDeclaracion(TIPO_VISIBILIDAD.LOCAL, $2,[], $1, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));            
        $$ = reversaArreglo($2);
    }
    | data_type error {addSyntaxError("Se esperaba un identificador", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | this_asignacion declaracion_for_re {$2.push($1); $$=reversaArreglo($2);}
    ;

declaracion_for_re
    : COMA  this_asignacion declaracion_for_re{
        $3.push($2);
        $$=$3;
    }
    | COMA error declaracion_for_re{
        addSyntaxError("Se esperaba una expresion", $2, linea(this._$.first_line), columna(this._$.first_column));
        $$=$3;
    }
    | error {addSyntaxError("Se esperaba \';\'", $1, linea(this._$.first_line), columna(this._$.first_column));}
    | COLON {$$=[];}
    ;



for_stmt
    : FOR OPEN_PARENTHESIS for_inicio for_condition for_asignacion stmt_enclusure{
        $$= instruccionesApi.nuevoFor($3, $4, $5, $6, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
    }
    | FOR error {addSyntaxError("Se esperaba \'(\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | FOR OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una asignacion", $3, linea(this._$.first_line), columna(this._$.first_column));}
    | FOR OPEN_PARENTHESIS for_inicio error {addSyntaxError("Se esperaba una condicion", $4, linea(this._$.first_line), columna(this._$.first_column));}
    | FOR OPEN_PARENTHESIS for_inicio for_condition error {addSyntaxError("Se esperaba una asignacion o accion", $5, linea(this._$.first_line), columna(this._$.first_column));}
    ;

for_inicio
    : declaracion_for {$$=$1;}
    //| declaracion_for error {addSyntaxError("Una condicion era esperada", $2, linea(this._$.first_line), columna(this._$.first_column));}
    ;

for_condition
    : expresion COLON {$$=$1;}
    | expresion error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
    //| expresion COLON error {addSyntaxError("Se esperaba una accion del for", $3, linea(this._$.first_line), columna(this._$.first_column));}
    ;

for_asignacion
    : declaraciones_post CLOSE_PARENTHESIS {$$=$1;}
    | declaraciones_post error {addSyntaxError("Se esperaba \'(\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
    ;


/*End of For*/
/*Init of While*/

while_stmt
    : WHILE OPEN_PARENTHESIS block_condition stmt_enclusure{
        $$ = instruccionesApi.nuevoWhile($3, $4, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
    }
    |WHILE error block_condition stmt_enclusure {addSyntaxError("Se esperaba \'(\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | WHILE OPEN_PARENTHESIS error stmt_enclusure {addSyntaxError("Se esperaba una condicion", $3, linea(this._$.first_line), columna(this._$.first_column));}
    ;
/*End of While*/

/*Init of DoWhile*/

do_stmt
    : DO stmt_enclusure while_do{
        $$ = instruccionesApi.nuevoDoWhile($2, $3, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
    }
    | DO stmt_enclusure error {addSyntaxError("Agregar un while", $3, linea(this._$.first_line), columna(this._$.first_column));}
    ;

while_do
    : WHILE OPEN_PARENTHESIS block_condition {$$=$3;}
    | WHILE error {addSyntaxError("Se esperaba \'(\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
    | WHILE OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una condicion", $3, linea(this._$.first_line), columna(this._$.first_column));}

    ;

/*End of DoWhile*/
