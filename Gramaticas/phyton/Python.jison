/*Parsea python*/

%{
    //imports
    var ErrorLexico = require ('../../../error/LexicalError');
    var ErrorSintactico = require('../../../error/SyntaxError');
    //variables
    var erroresLexicos=[];
    var erroresSintacticos=[];
    var indentation=0;
    var estado=0;
    var lineNumber=0;
    var columnNumber=0;

    //control indentacion


    module.exports.getErroresLexico = function(){
        return erroresLexicos;
    }

    module.exports.getErroresSintacticos = function(){
        return erroresSintacticos;
    }

    module.exports.setLineNumber = function(line){
        lineNumber = line;
    }

    module.exports.setColumnNumber = function(column){
        columnNumber = column;
    }

    module.exports.setErroresLexicos = function(error){
        erroresLexicos = error;
    }

    module.exports.setErroresSintacticos = function(error){
        erroresSintacticos = error;
    }

    function addLexicalError(lexema, linea, column){   
        try{
            var errorLexico = new ErrorLexico(lexema, linea, column);
            erroresLexicos.push(errorLexico);
        }catch(ex){
            console.log(ex);
        }                  
    }

    function addSyntaxErrorStmt(stmt, line, column){
        try{
            let stmtRol = stmt.rol;
            if(stmtRol == TIPO_INSTRUCCION.VARIABLE){
                var errorSintactico = new ErrorSintactico("Se esperaba que estuviera dentro de una declaracion contenedora",stmt.id, line, column);
                erroresSintacticos.push(errorSintactico);
            }else if (stmtRol == TIPO_INSTRUCCION.FUNCION){
                var errorSintactico = new ErrorSintactico("Se esperaba que estuviera dentro de una declaracion contenedora",stmt.id, line, column);
                erroresSintacticos.push(errorSintactico);
            }else{
                var errorSintactico = new ErrorSintactico("Se esperaba que estuviera dentro de una declaracion contenedora",stmt.rol, line, column);
                erroresSintacticos.push(errorSintactico);
            }
            
        }catch(ex){
            var errorSintactico = new ErrorSintactico(ex, stmt.rol, line, column);
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
%%
\n      {
        indentation=0;
            if(estado==0){
                /*ignore*/
            }else if(estado==1){
                estado=0;
            }else if(estado==2){
                estado=0;
            }
        return 'SPACE';
        }

\t      {
            if(estado==1){
                /*ignore*/
            }else if(estado==2){
                /*ignore*/
            }else{
                yytext = 4;
                return 'INDENTATION';
            }            
        }
        
" "       {
            if(estado==1){
                /*ignore*/
            }else if(estado==2){
                /*ignore*/
            }else{
                yytext=1;
                return 'INDENTATION';
            }
        }
\s     /*ignore*/;
"#"[^\n]*\n /*ignore*/;
    
([\"][\"][\"][^\"]*([^\"][^\"]*)*[\"][\"][\"]|[\'][\'][\'][^\']*([^\'][^\']*)*[\'][\'][\']) {
                        if(estado==1){
                            /*ignore*/
                        }else if(estado==2){
                            yytext = yytext.substr(3,yyleng-6);
                            estado=2;
                            
                            return'LIT_CADENA';
                        }else{
                            indentation=0;
                            estado=1;
                        }
                    }

"def" {
                estado=2;
             return'DEF';

        }
        
"print" {
             estado=2;
 return'PRINT';
            }
"&" {
    estado = 2;
    return 'PUNTERO';
}

"println" {
                estado=2;
 return'PRINTLN';
            }

"if" {
                estado=2;
 return'IF';
                }

"else" {
                estado=2;
 return'ELSE';
            }
      

"elif" {
                estado=2;
 return'ELIF';
            }

"input" {
                estado=2;
 return'INPUT';
            }

"return" {
                estado=2;
 return'RETURN';
                  }

"while" {
                estado=2;
 return'WHILE';
            }

"break" {
                estado=2;
 return'BREAK';
            }

"continue" {

                estado=2;
 return'CONTINUE';
            }

"for" {
                estado=2;
 return'FOR';
            }

"in" {
                estado=2;
 return'IN';
            }

"range" {
                estado=2;
 return'RANGE';
            }


//Simbolos
"and" {
                estado=2;
 return'AND';
            }
      

"or" {
                estado=2;
 return'OR';
            }

"not" {
                estado=2;
 return'NOT';
            }


"(" {
                estado=2;
 return'OPEN_PARENTHESIS';
            }

")" {
                estado=2;
 return'CLOSE_PARENTHESIS';
            }

"[" {
                estado=2;
 return'OPEN_BRACKET';
            }

"]" {
                estado=2;
 return'CLOSE_BRACKET';
            }

"{" {
                estado=2;
 return'OPEN_CURLY';
            }

"}" {
                estado=2;
 return'CLOSE_CURLY';
            }

"," {
                estado=2;
 return'COMA';
            }

">=" {
                estado=2;
 return'MAYOR_IGUAL';
            }

">" {
                estado=2;
 return'MAYOR';
            }

"<" {
                estado=2;
 return'MENOR';
            }

"<=" {
                estado=2;
 return'MENOR_IGUAL';
            }

"!=" {
                estado=2;
 return'DIFERENTE';
            }

"==" {
                estado=2;
 return'COMPARACION';
            }


"+=" {
                estado=2;
 return'O_SUMA';
            }

"-=" {
                estado=2;
 return'O_RESTA';
            }

"/=" {
                estado=2;
 return'O_DIV';
            }

"*=" {
                estado=2;
 return'O_POR';
            }

"%=" {
                estado=2;
 return'O_MOD';
            }

"^=" {
                estado=2;
 return'O_POW';
            }

"=" {
                estado=2;
 return'IGUAL';
            }

":" {
                estado=2;
 return'SEMI_COLON';
            }


"+" {
                estado=2;
 return'SUMA';
            }

"-" {
                estado=2;
 return'RESTA';
            }

"/" {
                estado=2;
 return'DIV';
            }

"*" {
                estado=2;
 return'POR';
            }

"%" {
                estado=2;
 return'MOD';
            }
      

"^" {
                estado=2;
 return'POW';
            }


//Literales
[0-9]+("."[0-9]+)\b {
                estado=2;
 return'LIT_DECIMAL';
            }

[0-9]+\b {
                estado=2;
 return'LIT_ENTERO';
            }

([\"][^\"]*[\"])  {estado=2;yytext = yytext.substr(1,yyleng-2);return'LIT_CADENA';}

([\'''][^\']*[\'])  {estado=2;yytext = yytext.substr(1,yyleng-2);return'LIT_CADENA';}

"True" {
                estado=2;
 return'LIT_TRUE';
            }

"False" {
                estado=2;
 return'LIT_FALSE';
            }

[aA-zZ|"_"]([aA-zZ]|[0-9]|"_")* {
                estado=2;
 return'IDENTIFICADOR';
            }


.+	{                             
        addLexicalError(yytext, linea(yylloc.first_line), columna(yylloc.first_column));
    }
<<EOF>>  return'EOF';
/lex
%{
    const TIPO_VISIBILIDAD = require('../../../api/Instrucciones').TIPO_VISIBILIDAD;
    const TIPO_LENGUAJE = require('../../../api/Instrucciones').TIPO_LENGUAJE;
    const TIPO_DATO = require('../../../api/Instrucciones').TIPO_DATO;
    const TIPO_VALOR = require('../../../api/Instrucciones').TIPO_VALOR;
    const TIPO_OPERACION = require('../../../api/Instrucciones').TIPO_OPERACION;
    const TIPO_INSTRUCCION = require('../../../api/Instrucciones').TIPO_INSTRUCCION;
    const TIPO_SWITCH = require('../../../api/Instrucciones').TIPO_SWITCH;
    const instruccionesApi = require('../../../api/InstruccionesApi').instruccionesApi;
    const TIPO_PRINT = require('../../../api/Instrucciones').TIPO_PRINT;
    const lenguaje = TIPO_LENGUAJE.PYTHON;
    var indentacionAcumulada=0;
    var indentacionActual=[];
    var instruccionAcumulada = [];

    function reversaArreglo(arreglo){
        var array = [];
        for(var index=arreglo.length-1; index>=0; index--){
            array.push(arreglo[index]);
        }

        return array;
    }

     function agregarInstruccionAcumulada(stmt, linea, columna){
        
        try{
            var helper = instruccionAcumulada.length-1;
            var helperInstructions = instruccionAcumulada[helper].instrucciones;        
            var actualstmt = instruccionAcumulada[helper].instrucciones[helperInstructions.length-1];
            if(actualstmt.rol == TIPO_INSTRUCCION.IF ||
                actualstmt.rol == TIPO_INSTRUCCION.ELSE ||
                actualstmt.rol == TIPO_INSTRUCCION.WHILE ||
                actualstmt.rol == TIPO_INSTRUCCION.FOR ){
                    instruccionAcumulada.push(actualstmt);
                    instruccionAcumulada[instruccionAcumulada.length-1].instrucciones.push(stmt);            
                }else{
                    addSyntaxError("Bloque de indentacion esperado para la declaracion", stmt.rol, linea, columna);
                }
        }catch(ex){
            addSyntaxErrorStmt(stmt);
        }
      
    }

    function agregarInstrucciones(stmt, arreglo, linea, columna){
        try{
            if(indentacionActual.length==0){
                if(indentacionAcumulada==0){
                    addSyntaxError("Bloque de indentacion esperado para la declaracion", stmt.rol, linea, columna);
                }else{
                    indentacionActual.push(indentacionAcumulada);
                    instruccionAcumulada[instruccionAcumulada.length-1].instrucciones.push(stmt);
                }
            }else {
                if(indentacionAcumulada==0){
                    addSyntaxError("Error de indentacion: Bloque de indentacion esperado para la declaracion", stmt.rol, linea, columna);
                }else if(indentacionAcumulada > indentacionActual[indentacionActual.length-1]){
                    indentacionActual.push(indentacionAcumulada);
                    agregarInstruccionAcumulada(stmt, linea,columna);
                }else if(indentacionAcumulada < indentacionActual[indentacionActual.length-1]){
                    var aux = [];
                    //creamos una copia
                    for(var index=0; index<indentacionActual.length; index++){
                        aux.push(indentacionActual[index]);
                    }
                    //Manejamos y buscamos la nueva indentacion
                    var flag = false;
                    var instruccionesEliminadas=0;
                    for(var index=indentacionActual.length-1; index>=0; index--){
                        if(indentacionAcumulada==indentacionActual[index]){
                            flag=true;
                            break;
                        }else{  
                            aux.pop();
                            instruccionesEliminadas++;
                        }
                    }
                    if(flag){
                        indentacionActual = aux;
                        if(instruccionesEliminadas != 0){
                            for(var index=0; index<instruccionesEliminadas; index++){
                                instruccionAcumulada.pop();
                            }
                            try{
                                instruccionAcumulada[instruccionAcumulada.length-1].instrucciones.push(stmt);
                            }catch(ex){
                                addSyntaxErrorStmt(stmt);
                            }
                            
                        }else{
                            addSyntaxError("Se esperaba una instruccion", stmt.rol, linea, column);
                        }
                        
                    }else{
                        addSyntaxError("Error de indentacion: se requiere un bloque de indentacion del mismo nivel que las demas declaraciones",stmt.rol, linea, columna);
                    }
                }else if(indentacionAcumulada == indentacionActual[indentacionActual.length-1]){
                    try{
                        instruccionAcumulada[instruccionAcumulada.length-1].instrucciones.push(stmt);
                    }catch(ex){
                        addSyntaxErrorStmt(stmt, linea, columna);
                    }
                }
            }
            indentacionAcumulada=0;
            return arreglo;
        }catch(ex){
            addSyntaxErrorStmt(stmt);
        }
    }

 function linea(linea){
        return linea + lineNumber;
    }

    function columna(column){
        return column + columnNumber;
    }
%}
    
    %left 'OR'
    %left 'AND'
    %left 'MAYOR_IGUAL' 'MENOR_IGUAL' 'DIFERENTE' 'COMPARACION' 'MAYOR' 'MENOR'    
    %left 'NOT'
    %left 'SUMA' 'RESTA'
    %left 'POR' 'DIV' 'MOD'
    %left 'POW'
    %left 'UMINUS'
    %left 'OPEN_PARENTHESIS' 'CLOSE_PARENTHESIS'
    
%start ini

%% 
/*Definicion de la gramatica*/
/*Manejaremos solo expresiones*/

input
    :INPUT OPEN_PARENTHESIS CLOSE_PARENTHESIS {$$=TIPO_VALOR.INPUT;}
    |INPUT error {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
    |INPUT OPEN_PARENTHESIS error {addSyntaxError("Se esperaba \')\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
    ;

expresion
    :expresion AND expresion {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OEPRACION.AND, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion OR expresion {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.OR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |NOT expresion {$$=instruccionesApi.operacionUnaria($2, TIPO_OPERACION.NOT, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion MAYOR expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.MAYOR, lenguaje , linea(this._$.first_line), columna(this._$.first_column));}
    |expresion MAYOR_IGUAL expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.MAYOR_IGUAL, lenguaje, linea(this._$.first_line), columna(this._$.first_column) );}
    |expresion MENOR expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.MENOR, lenguaje, linea(this._$.first_line), columna(this._$.first_column) );}
    |expresion MENOR_IGUAL expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.MENOR_IGUAL, lenguaje, linea(this._$.first_line), columna(this._$.first_column) );}
    |expresion DIFERENTE expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.DIFERENTE, lenguaje, linea(this._$.first_line), columna(this._$.first_column) );}
    |expresion COMPARACION expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.COMPARACION, lenguaje, linea(this._$.first_line), columna(this._$.first_column) );}
    |expresion SUMA expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.SUMA, lenguaje , linea(this._$.first_line), columna(this._$.first_column));}
    |expresion RESTA expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.RESTA, lenguaje , linea(this._$.first_line), columna(this._$.first_column));}
    |expresion POR expresion  {$$= instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.MULTIPLICACION, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion DIV expresion {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.DIVISION, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion MOD expresion {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.MOD, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |expresion POW expresion {$$=instruccionesApi.operacionAritmetica($1, $3, TIPO_OPERACION.POW, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |RESTA expresion %prec UMINUS {$$=instruccionesApi.operacionUnaria($2, TIPO_OPERACION.NEGATIVO, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |LIT_ENTERO {$$=instruccionesApi.nuevoValor(parseInt($1.toString()),null, TIPO_VALOR.ENTERO, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |LIT_DECIMAL {$$=instruccionesApi.nuevoValor(parseFloat($1.toString()),null,TIPO_VALOR.DECIMAL, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |LIT_CADENA {$$=instruccionesApi.nuevoValor($1.toString(),null, TIPO_VALOR.CADENA, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |LIT_TRUE {$$=instruccionesApi.nuevoValor("true",null, TIPO_VALOR.BOOLEAN, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |LIT_FALSE {$$=instruccionesApi.nuevoValor("false",null, TIPO_VALOR.BOOLEAN, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |IDENTIFICADOR {$$=instruccionesApi.nuevoValor($1.toString(),null, TIPO_VALOR.IDENTIFICADOR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
    |OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS {$$=$2;}
    ;

ini
    : statements EOF {
        return $1;
    }
    | ini error {addSyntaxError("Se esperaba una funcion1",$2,linea(this._$.first_line), columna(this._$.first_column));}
    ;

ides
    :IDENTIFICADOR {var arreglo = []; arreglo.push($1); arreglo.push(false); $$=arreglo; }
    |PUNTERO IDENTIFICADOR {var arreglo = []; arreglo.push($2); arreglo.push(true); $$=arreglo;}
    ;

/*Funcion*/
parameters
    : ides parameters_re {
        $2.push(instruccionesApi.nuevoParametro($1[0], TIPO_DATO.ANY,$1[1], TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column)));
        $$=reversaArreglo($2);
    }
    |  /*empty*/ {$$=[];}
    ;

parameters_re
    :  COMA  ides parameters_re{
        $3.push(instruccionesApi.nuevoParametro($2[0], TIPO_DATO.ANY,$2[1], TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column)));
        $$=$3;
    }
    | COMA error parameters_re{addSyntaxError("Se esperaba otro parametro",$2,linea(this._$.first_line), columna(this._$.first_column)); $$=$3;}
    | /*empty*/ {$$=[];}
    ;

function_stmt
    :DEF IDENTIFICADOR OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS SEMI_COLON SPACE{
        $$ = instruccionesApi.nuevaFuncion(TIPO_VISIBILIDAD.PUBLIC, $2,TIPO_DATO.ANY, [], $4, TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));
    } 
    |DEF error {addSyntaxError("Se esperaba un identificador",$2,linea(this._$.first_line), columna(this._$.first_column));}
    |DEF IDENTIFICADOR error {addSyntaxError("Se esperaba \'(\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
    |DEF IDENTIFICADOR OPEN_PARENTHESIS parameters error {addSyntaxError("Se esperaba \')\'", $5, linea(this._$.first_line), columna(this._$.first_column));}
    |DEF IDENTIFICADOR OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba \':\'",$6,linea(this._$.first_line), columna(this._$.first_column));}
    |DEF IDENTIFICADOR OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$7,linea(this._$.first_line), columna(this._$.first_column));}
    ;

/*End of Funcion*/

/*Declaraciones*/


statements
    : statements statement {
        if($1.length>0){
            agregarInstrucciones($2, $1, linea(this._$.first_line), columna(this._$.first_column));
        }else{
            var token = "";
            if($2.rol == TIPO_INSTRUCCION.VARIABLE){
                token = $2.arreglo[$2.length-1].id[0].valor;
            }else{
                token = $2.rol;
            }
            addSyntaxError("Se esperaba una funcion2", token, linea(this._$.first_line), columna(this._$.first_column));
        }
        $$=$1;
    }
    | statements function_stmt {
        if(indentacionAcumulada==0){
            instruccionAcumulada = [];
            instruccionAcumulada.push($2);
            $1.push($2);
        }else{
            addSyntaxError("Indentacion no esperada, la funcion no lleva indentacion","def "+$1.id,linea(this._$.first_line), columna(this._$.first_column));
        }
        indentacionAcumulada=0;
        $$=$1;
    }
    |  statements SPACE {indentacionAcumulada=0;$$=$1;}
    |  statements INDENTATION  {indentacionAcumulada+=$2;$$=$1;}
    |  statements error  {addSyntaxError("Se esperaba una funcion3",$2,linea(this._$.first_line), columna(this._$.first_column));$$=$1;}
    | /*empty*/ {$$=[];}
    ;

met_params
    :expresion met_params_re{
        $2.push($1);
        $$=reversaArreglo($2);
    }
    |/*empty*/ {$$=[];}
    ;

met_params_re
    :COMA expresion met_params_re {
        $3.push($2);
        $$=$3;
    }
    |COMA error met_params_re {addSyntaxError("Se esperaba una expresion", $2, linea(this._$.first_line), columna(this._$.first_column));}
    |/*empty*/ {$$=[];}
    ;

metodo_stmt
    :IDENTIFICADOR OPEN_PARENTHESIS met_params CLOSE_PARENTHESIS SPACE{
        var metodo = instruccionesApi.nuevoMetodo($1, $3, lenguaje,linea(this._$.first_line), columna(this._$.first_column));
        $$=metodo;
    }
    |IDENTIFICADOR OPEN_PARENTHESIS met_params error {addSyntaxError("Se esperaba \')\'", $4, linea(this._$.fist_line),columna(this._$.first_column));}
    |IDENTIFICADOR OPEN_PARENTHESIS met_params CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba un salto de linea", $5, linea(this._$.fist_line),columna(this._$.first_column));}
    ;

statement
    : var_stmt {$$=$1;}
    | if_stmt {$$=$1;}
    | for_stmt {$$=$1;}
    | while_stmt {$$=$1;}
    | print_stmt  {$$=$1;}
    | metodo_stmt {$$=$1;}
    | CONTINUE SPACE {$$=instruccionesApi.nuevoContinue( linea(this._$.first_line), columna(this._$.first_column));}
    | CONTINUE error {addSyntaxError("Se esperaba salto de linea",$2,linea(this._$.first_line), columna(this._$.first_column));}
    | BREAK SPACE {$$=instruccionesApi.nuevoBreak(linea(this._$.first_line), columna(this._$.first_column));}
    | BREAK error {addSyntaxError("Se esperaba un salto de linea",$2,linea(this._$.first_line), columna(this._$.first_column));}
    | RETURN expresion SPACE {$$=instruccionesApi.nuevoReturn($2, TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));}
    ;
/*End of Declaraciones*/

/*Print statement*/
print_parameter
    : expresion print_parameter_re{
        $2.push($1);
        $$ = reversaArreglo($2);
    }
    ;

print_parameter_re
    :  COMA expresion print_parameter_re{
        $3.push($2);
        $$ = $3;
    }
    |  /*empty*/ {$$=[];}
    ;

print_method
    :PRINT {$$=TIPO_PRINT.PRINT;}
    |PRINTLN {$$=TIPO_PRINT.PRINTLN;}
    ;

print_stmt
    : print_method  OPEN_PARENTHESIS print_parameter CLOSE_PARENTHESIS SPACE{
        $$= instruccionesApi.nuevoImprimir($3,$1, TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));
    }
    | print_method error {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
    | print_method OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una cadena",$3,linea(this._$.first_line), columna(this._$.first_column));}
    | print_method OPEN_PARENTHESIS print_parameter error {addSyntaxError("Se esperaba \')\'",$4,linea(this._$.first_line), columna(this._$.first_column));}
    | print_method OPEN_PARENTHESIS print_parameter CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba un salto de linea",$5,linea(this._$.first_line), columna(this._$.first_column));}
    ;
/*End of Print statement*/

/*If statement*/
if_stmt
    : IF expresion SEMI_COLON SPACE{
        $$ = instruccionesApi.nuevoIf($2, null, TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));
    }
    | IF error {addSyntaxError("Se esperaba una condicion",$2,linea(this._$.first_line), columna(this._$.first_column));}
    | IF expresion error {addSyntaxError("Se esperaba \':\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
    | IF expresion SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$4,linea(this._$.first_line), columna(this._$.first_column));}
    | ELIF expresion SEMI_COLON SPACE{
        $$ = instruccionesApi.nuevoElse($2, null, null, TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));
    }
    | ELIF error {addSyntaxError("Se esperaba una condicion",$2,linea(this._$.first_line), columna(this._$.first_column));}
    | ELIF expresion error {addSyntaxError("Se esperaba \':\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
    | ELIF expresion SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$4,linea(this._$.first_line), columna(this._$.first_column));}
    | ELSE SEMI_COLON SPACE{$$=instruccionesApi.nuevoElse(null, null, null, TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));}
    | ELSE error {addSyntaxError("Se esperaba \':\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
    | ELSE SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$3,linea(this._$.first_line), columna(this._$.first_column));}
    ;
/*End of statement*/

/*For statement*/
for_parameters
    :expresion for_parameters_re{
        $2.push($1);
        $$=reversaArreglo($2);
    }
    ;

for_parameters_re
    :  COMA expresion for_parameters_re{
        $3.push($2);
        $$=$3;
    }
    | COMA  error for_parameters_re {addSyntaxError("Se esperaba otra parametro",$2,linea(this._$.first_line), columna(this._$.first_column));}
    |  /*empty*/ {$$=[];}
    ;

rango
    :RANGE OPEN_PARENTHESIS for_parameters CLOSE_PARENTHESIS{
        $$ = $3;
    }
    |RANGE error {addSyntaxError("Se esperaba indicar un rango",$2,linea(this._$.first_line), columna(this._$.first_column));}
    |RANGE OPEN_PARENTHESIS error {addSyntaxError("Se esperaba indicar un rango",$3,linea(this._$.first_line), columna(this._$.first_column));}
    |RANGE OPEN_PARENTHESIS for_parameters error {addSyntaxError("Se esperaba \')\'", $4, linea(this._$.first_line), columna(this._$.first_column));}
    ;

for_stmt
    : FOR IDENTIFICADOR IN rango SEMI_COLON SPACE{
        var valor_inicial = instruccionesApi.nuevaDeclaracion(TIPO_VISIBILIDAD.LOCAL, $2,[], TIPO_DATO.INT, TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));
        var valor_accion = instruccionesApi.nuevoValor(parseInt("1"),null,TIPO_VALOR.ENTERO, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        var accion_post = instruccionesApi.nuevaAsignacion_O($2,[],TIPO_OPERACION.INCREMENTO,valor_accion,TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));
        $$ = instruccionesApi.nuevoFor(valor_inicial, $4, accion_post, null, TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));
    }
    | FOR error {addSyntaxError("Se esperaba un identificador",$2,linea(this._$.first_line), columna(this._$.first_column));}
    | FOR IDENTIFICADOR error {addSyntaxError("Se esperaba la palabra reservada \'in\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
    | FOR IDENTIFICADOR IN error {addSyntaxError("Se esperaba un rango",$4,linea(this._$.first_line), columna(this._$.first_column));} 
    | FOR IDENTIFICADOR IN rango error {addSyntaxError("Se esperaba \':\'",$5,linea(this._$.first_line), columna(this._$.first_column));} 
    | FOR IDENTIFICADOR IN rango SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$6,linea(this._$.first_line), columna(this._$.first_column));}
    ;
/*End of statement*/

/*While statement*/
while_stmt
    : WHILE expresion SEMI_COLON SPACE{$$=instruccionesApi.nuevoWhile($2, null, TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));}
    | WHILE error {addSyntaxError("Se esperaba una condicion",$2,linea(this._$.first_line), columna(this._$.first_column));}
    | WHILE expresion error {addSyntaxError("Se esperaba \':\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
    | WHILE expresion SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$4,linea(this._$.first_line), columna(this._$.first_column));}
    ;
/*End of statement*/
/*Variable statement*/
igualaciones
    : IGUAL {$$=TIPO_OPERACION.IGUAL;}
    | O_MAS {$$=TIPO_OPERACION.SUMA;}
    | O_RESTA {$$=TIPO_OPERACION.RESTA;}
    | O_POR {$$=TIPO_OPERACION.MULTIPLICACION;}
    | O_DIV {$$=TIPO_OPERACION.DIVISION;}
    | O_POW {$$=TIPO_OPERACION.POW;}
    | O_MOD {$$=TIPO_OPERACION.MOD;}
    ;

nombre_variables
    : IDENTIFICADOR nombre_variables_re{
        $2.push(instruccionesApi.nuevoValor($1,null, TIPO_VALOR.IDENTIFICADOR,lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$=reversaArreglo($2);
    }
    ;

nombre_variables_re
    : COMA IDENTIFICADOR nombre_variables_re{
        $3.push(instruccionesApi.nuevoValor($2,null, TIPO_VALOR.IDENTIFICADOR,lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
        $$=$3;
    }
    |COMA error nombre_variables_re {addSyntaxError("Se esperaba un identificador", $2, linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
    |  /*empty*/ {$$=[];}
    ;

expresiones
    :expresion expresiones_re{
        $2.push($1);
        $$=reversaArreglo($2);
    }
    ;
expresiones_re
    : COMA expresion expresiones_re{
        $3.push($1);
        $$=$3;
    }
    | COMA error expresiones_re {addSyntaxError("Se esperaba una expresion", $2, linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
    |/*empty*/{$$=[];}
    ;

asignacion
    : igualaciones expresiones asignacion_re{
        var nuevaIgualacion = instruccionesApi.nuevaAsignacion_O(null,[], $1, $2, TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));
        $3.push(nuevaIgualacion);
        $$=reversaArreglo($3);
    }
    | igualaciones input asignacion_re{
        var valor = instruccionesApi.nuevoValor("input()",null,$2, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        var nuevaIgualacion = instruccionesApi.nuevaAsignacion_O(null,[], $1, valor, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        $3.push(nuevaIgualacion);
        $$=reversaArreglo($3);
        }
    | igualaciones error {addSyntaxError("Se esperaba una asignacion",$2,linea(this._$.first_line), columna(this._$.first_column));}
    ;

asignacion_re
    :  igualaciones expresiones asignacion_re{
        var nuevaIgualacion = instruccionesApi.nuevaAsignacion_O(null,[], $1,$2,TIPO_LENGUAJE.PYTHON, linea(this._$.first_line), columna(this._$.first_column));
        $3.push(nuevaIgualacion);
        $$=$3;
    }
    |  igualaciones input asignacion_re{
        var valor = instruccionesApi.nuevoValor("input()",null,$2, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        var nuevaIgualacion = instruccionesApi.nuevaAsignacion_O(null,[], $1, valor, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
        $3.push(nuevaIgualacion);
        $$=$3;
    }
    |  igualaciones error asignacion_re {addSyntaxError("Se esperaba una expresion",$2,linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
    |  /*empty*/ {$$=[];}
    ;

var_stmt
    : nombre_variables asignacion SPACE{
        var arreglo = [];
        for(var index=0; index<$1.length; index++){
            let id = $1[index];
            for(var indexJ =0; indexJ<$2.length; indexJ++){
                let helper = JSON.parse(JSON.stringify($2[indexJ]));
                helper.id = id;
                arreglo.push(helper);
            }
        }
        console.log("var_stmt");
        $$=instruccionesApi.nuevaVariable(arreglo, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
    }
    | nombre_variables error {addSyntaxError("Se esperaba una asignacion",$2,linea(this._$.first_line), columna(this._$.first_column));}
    | nombre_variables asignacion error {addSyntaxError("Se esperaba un salto de linea", $3, linea(this._$.first_line), columna(this._$.first_column));}
    ;
/*End of statement*/
