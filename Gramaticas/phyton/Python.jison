/*Parsea python*/

%{
    //imports
    var ErrorLexico = require ('../../../error/LexicalError');
    var ErrorSintactico = require('../../../error/SyntaxError');
    //variables
    let erroresLexicos=[];
    let erroresSintacticos=[];
    let indentation=0;
    let estado=0;
    let lineNumber=0;
    let columnNumber=0;

    //control indentacion


    function getErroresLexico(){
        return erroresLexicos;
    }

    function getErroresSintacticos(){
        return erroresSintacticos;
    }

    function setLineNumber(line){
        this.lineNumber=line;
    }

    function setColumnNumber(column){
        this.columnNumber=column;
    }

    function addLexicalError(lexema, line, column){
        try{
            let errorLexico = new ErrorLexico(lexema, line+lineNumber, column+columnNumber);
            erroresLexicos.add(errorLexico);
        }catch(ex){
            console.log(ex);
        }
    }

    function addSyntaxError(descripcion, token, line, column){
        try{
            let errorSintactico = new ErrorSintactico(descripcion, token, line+lineNumber, column+columnNumber);
            erroresSintacticos.add(errorSintactico);
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
                console.log('TAB');
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
                console.log("blank");
                return 'INDENTATION';
            }
        }
\s     /*ignore*/;
"#"[^\n] /*ignore*/;
    
([\"][\"][\"][^\"]*([^\"][^\"]*)*[\"][\"][\"]|[\'][\'][\'][^\']*([^\'][^\']*)*[\'][\'][\']) {
                        if(estado==1){
                            /*ignore*/
                        }else if(estado==2){
                            yytext = yytext.substr(3,yyleng-6);
                            estado=2;
                            console.log(yytext);
                            return'LIT_CADENA';
                        }else{
                            indentation=0;
                            estado=1;
                        }
                    }

"def" {
                estado=2;
            console.log(yytext); return'DEF';

        }
        
"print" {
             estado=2;
console.log(yytext); return'PRINT';
            }

"println" {
                estado=2;
console.log(yytext); return'PRINTLN';
            }

"if" {
                estado=2;
console.log(yytext); return'IF';
                }

"else" {
                estado=2;
console.log(yytext); return'ELSE';
            }
      

"elif" {
                estado=2;
console.log(yytext); return'ELIF';
            }

"input" {
                estado=2;
console.log(yytext); return'INPUT';
            }

"return" {
                estado=2;
console.log(yytext); return'RETURN';
                  }

"while" {
                estado=2;
console.log(yytext); return'WHILE';
            }

"break" {
                estado=2;
console.log(yytext); return'BREAK';
            }

"continue" {

                estado=2;
console.log(yytext); return'CONTINUE';
            }

"for" {
                estado=2;
console.log(yytext); return'FOR';
            }

"in" {
                estado=2;
console.log(yytext); return'IN';
            }

"range" {
                estado=2;
console.log(yytext); return'RANGE';
            }


//Simbolos
"and" {
                estado=2;
console.log(yytext); return'AND';
            }
      

"or" {
                estado=2;
console.log(yytext); return'OR';
            }

"not" {
                estado=2;
console.log(yytext); return'NOT';
            }


"(" {
                estado=2;
console.log(yytext); return'OPEN_PARENTHESIS';
            }

")" {
                estado=2;
console.log(yytext); return'CLOSE_PARENTHESIS';
            }

"[" {
                estado=2;
console.log(yytext); return'OPEN_BRACKET';
            }

"]" {
                estado=2;
console.log(yytext); return'CLOSE_BRACKET';
            }

"{" {
                estado=2;
console.log(yytext); return'OPEN_CURLY';
            }

"}" {
                estado=2;
console.log(yytext); return'CLOSE_CURLY';
            }

"," {
                estado=2;
console.log(yytext); return'COMA';
            }

">=" {
                estado=2;
console.log(yytext); return'MAYOR_IGUAL';
            }

">" {
                estado=2;
console.log(yytext); return'MAYOR';
            }

"<" {
                estado=2;
console.log(yytext); return'MENOR';
            }

"<=" {
                estado=2;
console.log(yytext); return'MENOR_IGUAL';
            }

"!=" {
                estado=2;
console.log(yytext); return'DIFERENTE';
            }

"==" {
                estado=2;
console.log(yytext); return'COMPARACION';
            }


"+=" {
                estado=2;
console.log(yytext); return'O_SUMA';
            }

"-=" {
                estado=2;
console.log(yytext); return'O_RESTA';
            }

"/=" {
                estado=2;
console.log(yytext); return'O_DIV';
            }

"*=" {
                estado=2;
console.log(yytext); return'O_POR';
            }

"%=" {
                estado=2;
console.log(yytext); return'O_MOD';
            }

"^=" {
                estado=2;
console.log(yytext); return'O_POW';
            }

"=" {
                estado=2;
console.log(yytext); return'IGUAL';
            }

":" {
                estado=2;
console.log(yytext); return'SEMI_COLON';
            }


"+" {
                estado=2;
console.log(yytext); return'SUMA';
            }

"-" {
                estado=2;
console.log(yytext); return'RESTA';
            }

"/" {
                estado=2;
console.log(yytext); return'DIV';
            }

"*" {
                estado=2;
console.log(yytext); return'POR';
            }

"%" {
                estado=2;
console.log(yytext); return'MOD';
            }
      

"^" {
                estado=2;
console.log(yytext); return'POW';
            }


//Literales
[0-9]+("."[0-9]+)\b {
                estado=2;
console.log(yytext); return'LIT_DECIMAL';
            }

[0-9]+\b {
                estado=2;
console.log(yytext); return'LIT_ENTERO';
            }

([\"[^\"]*\"]|[\'[^\']*\']) {
                estado=2;
console.log(yytext); return'LIT_CADENA';
            }

"True" {
                estado=2;
console.log(yytext); return'LIT_TRUE';
            }

"False" {
                estado=2;
console.log(yytext); return'LIT_FALSE';
            }

[aA-zZ|"_"]([aA-zZ]|[0-9]|"_")* {
                estado=2;
console.log(yytext); return'IDENTIFICADOR';
            }


.+	{                             
        console.log("ERROR LEXICO "+yytext);
        addLexicalError(yytext, yylloc.first_line, yylloc.first_column);
    }
<<EOF>>  return'EOF';
/lex
%{
    const TIPO_VISIBILIDAD = require('../../../api/Instrucciones').TIPO_VISIBILIDAD;
    const TIPO_LENGUAJE = require('../../../api/Instrucciones').TIPO_LENGUAJE);
    const TIPO_DATO = requie('../../../api/Instrucciones').TIPO_DATO;
    const TIPO_VALOR = require('../../../api/Instrucciones').TIPO_VALOR;
    const TIPO_OPERACION = require('../../../api/Instrucciones').TIPO_OPERACION;
    const TIPO_INSTRUCCION = require('../../../api/Instrucciones').TIPO_INSTRUCCION;
    const TIPO_SWITCH = require('../../../api/Instrucciones').TIPO_SWITCH;
    const instruccionesApi = require('../../../api.InstruccionesApi').instruccionesApi;
    const TIPO_PRINT = require('../../../api.InstruccionesApi').TIPO_PRINT;
    const lenguaje = TIPO_LENGUAJE.PYTHON;
    let indentacionAcumulada=0;
    let indentacionActual=[];
    let instruccionAcumulada = [];

    function agregarInstruccionAcumulada(stmt){
        if(stmt.rol == TIPO_INSTRUCCION.IF ||
        stmt.rol == TIPO_INSTRUCCION.WHILE ||
        stmt.rol == TIPO_INSTRUCCION.FOR ||
        stmt.rol == TIPO_INSTRUCCION.WHILE){
            instruccionAcumulada[instruccionAcumulada.length-1].push(stmt);            
            instruccionAcumulada.push(stmt);
        }else if(stmt.rol == TIPO_INSTRUCCION.ELSE){
            let size = instruccionAcumulada[instruccionAcumulada.length-1].instrucciones.length-1;
            if(instruccionAcumulada[instruccionAcumulada.length-1].instrucciones[size] == TIPO_INSTRUCCION.IF){
                stmt.if = instruccionAcumulada[instruccionAcumulada.length-1];
                instruccionAcumulada[instruccionAcumulada.length-1].push(stmt);
                instruccionAcumulada.push(stmt);
            }else if(instruccionAcumulada[instruccionAcumulada.length-1].instrucciones[size] == TIPO_INSTRUCCION.ELSE){
                stmt.if = instruccionAcumulada[instruccionAcumulada.length-1].if;
                instruccionAcumulada[instruccionAcumulada.length-1].push(stmt);
                instruccionAcumulada.push(stmt);
            }else{
                addSyntaxError("Se esperaba un if antes de else",stmt.rol, this._$.first_line, this._$.first_column);
            }
        }else{
            instruccionAcumulada[instruccionAcumulada.length-1].push(stmt);
        }
    }

    function agregarInstrucciones(stmt, arreglo){
        if(indentacionActual.length==0){
            if(indentacionAcumulada==0){
                addSyntaxError("Bloque de indentacion esperado para la declaracion", stmt.rol, this._$.first_line, this._$.first_column);
            }else{
                indentacionActual.push(indentacionAcumulada);
                agregarInstruccionAcumulada(stmt);
            }
        }else {
            if(indentacionAcumulada==0){
                addSyntaxError("Error de indentacion: Bloque de indentacion esperado para la declaracion", stmt.rol, this._$.first_line, this._$.first_column);
            }else if(indentacionAcumulada > indentacionActual[indentacionActual.length-1]){
                indentacionActual.push(indentacionAcumulada);
                agregarInstruccionAcumulada(stmt);
            }else if(indentacionAcumulada < indentacionActual[indentacionActual.length-1]){
                let aux = [];
                //creamos una copia
                for(let index=0; index<indentacionActual.length; index++){
                    aux.push(indentacionActual[index]);
                }
                //Manejamos y buscamos la nueva indentacion
                let flag = false;
                let intruccionesEliminadas=0;
                for(let index=indentacionActual.length-1; index>=0; index--){
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
                    for(let index=0; index<instruccionesEliminadas; index++){
                        instruccionAcumulada.pop();
                    }
                    agregarInstruccionAcumulada(stmt);
                }else{
                    addSyntaxError("Error de indentacion: se requiere un bloque de indentacion del mismo nivel que las demas declaraciones",stmt.rol, this._$.first_line, this._$.first_column);
                }
            }else if(indentacionAcumulada == indentacionActual[indentacionActual.length-1]){
                agregarInstruccionAcumulada(stmt);
            }
        }
        indentacionAcumulada=0;
        return arreglo;
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
    |INPUT error {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
    |INPUT OPEN_PARENTHESIS error {addSyntaxError("Se esperaba \')\'",$3,this._$.first_line, this._$.first_column);}
    ;

expresion
    :expresion AND expresion {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OEPRACION.AND, lenguaje);}
    |expresion OR expresion {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.OR, lenguaje);}
    |NOT expresion {$$=instruccionesApi.operacionUnaria($2, undefined, TIPO_OEPRACION.NOT, lenguaje);}
    |expresion MAYOR expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.MAYOR, lenguaje );}
    |expresion MAYOR_IGUAL expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.MAYOR_IGUAL, lenguaje );}
    |expresion MENOR expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.MENOR, lenguaje );}
    |expresion MENOR_IGUAL expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.MENOR_IGUAL, lenguaje );}
    |expresion DIFERENTE expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.DIFERENTE, lenguaje );}
    |expresion COMPARACION expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.COMPARACION, lenguaje );}
    |expresion SUMA expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.SUMA, lenguaje );}
    |expresion RESTA expresion {$$=instruccionesApi.operacionAritmetica($1,$3,TIPO_OPERACION.RESTA, lenguaje );}
    |expresion POR expresion  {$$= instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.MULTIPLICACION, lenguaje);}
    |expresion DIV expresion {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.DIV, lenguaje);}
    |expresion MOD expresion {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.MOD, lenguaje);}
    |expresion POW expresion {$$=instruccionesApi.operacionAritmetica($1, $3, TIPO_OPERACION.POW, lenguaje);}
    |RESTA expresion %prec UMINUS {$$=instruccionesApi.operacionUnaria($2, undefined, TIPO_OPERACION.RESTA, lenguaje);}
    |input {$$=instruccionesApi.nuevoValor("input()",$1, lenguaje);}
    |LIT_ENTERO {$$=instruccionesApi.nuevoValor(parseInt($1.toString()), TIPO_VALOR.ENTERO, lenguaje);}
    |LIT_DECIMAL {$$=instruccionesApi.nuevoValor(parseFloat($1.toString()),TIPO_VALOR.DECIMAL, lenguaje);}
    |LIT_CADENA {$$=instruccionesApi.nuevoValor($1.toString(), TIPO_VALOR.CADENA, lenguaje);}
    |LIT_TRUE {$$=instruccionesApi.nuevoValor($1.toString(), TIPO_VALOR.BOOLEAN, lenguaje);}
    |LIT_FALSE {$$=instruccionesApi.nuevoValor($1.toString(), TIPO_VALOR.BOOLEAN, lenguaje);}
    |IDENTIFICADOR {$$=instruccionesApi.nuevoValor($1.toString(), TIPO_VALOR.IDENTIFICADOR, lenguaje);}
    |OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS {$$=$2;}
    ;

ini
    : statements EOF {
        return $1;
    }
    | ini error {addSyntaxError("Se esperaba una funcion",$2,this._$.first_line, this._$.first_column);}
    ;

/*Funcion*/
parameters
    : IDENTIFICADOR parameters_re {
        $2.push(instruccionesApi.nuevoParametro($1, TIPO_DATO.ANY, TIPO_LENGUAJE.PYTHON));
        $$=$2;
    }
    |  /*empty*/ {$$=[];}
    ;

parameters_re
    : parameters_re COMA  IDENTIFICADOR {
        $1.push(instruccionesApi.nuevoParametro($3, TIPO_DATO.ANY, TIPO_LENGUAJE.PYTHON));
        $$=$1;
    }
    |parameters_re error {addSyntaxError("Se esperaba \')\' u otro parametro",$2,this._$.first_line, this._$.first_column); $$=$1;}
    | /*empty*/ {$$=[];}
    ;

function_stmt
    :DEF IDENTIFICADOR OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS SEMI_COLON SPACE{
        $$ = instruccionesApi.nuevaFuncion(TIPO_VISIBILIDAD.PUBLIC, $2, [], $4, TIPO_LENGUAJE.PYTHON);
    } 
    |DEF error {addSyntaxError("Se esperaba un identificador",$2,this._$.first_line, this._$.first_column);}
    |DEF IDENTIFICADOR error {addSyntaxError("Se esperaba \'(\'",$3,this._$.first_line, this._$.first_column);}
    |DEF IDENTIFICADOR OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba \':\'",$6,this._$.first_line, this._$.first_column);}
    |DEF IDENTIFICADOR OPEN_PARENTHESIS parameters CLOSE_PARENTHESIS SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$7,this._$.first_line, this._$.first_column);}
    ;

/*End of Funcion*/

/*Declaraciones*/


statements
    : statements statement {
        agregarInstrucciones($2, $1);
        $$=$1;
    }
    | statements function_stmt{
        if(indentacionAcumulada==0){
            instruccionAcumulada = [];
            instruccionAcumulada.push($2);
            $1.push($2);
        }else{
            addSyntaxError("Indentacion no esperada, la funcion no lleva indentacion","def "+$2.id,this._$.first_line, this._$.first_column);
        }
        indentacionAcumulada=0;
        $$=$1;
    }
    | statements SPACE {indentacionAcumulada=0;$$=$1;}
    | statements INDENTATION {indentacionAcumulada+=$2;$$=$1;}
    | statements error {addSyntaxError("Se esperaba una funcion",$2,this._$.first_line, this._$.first_column);$$=$1;}
    | /*empty*/ {$$=[];}
    ;

statement
    : var_stmt {$$=$1;}
    | if_stmt {$$=$1;}
    | for_stmt {$$=$1;}
    | while_stmt {$$=$1;}
    | print_stmt  {$$=$1;}
    | CONTINUE SPACE {$$=instruccionesApi.nuevoContinue();}
    | CONTINUE error {addSyntaxError("Se esperaba salto de linea",$2,this._$.first_line, this._$.first_column);}
    | BREAK SPACE {$$=instruccionesApi.nuevoBreak();}
    | BREAK error {addSyntaxError("Se esperaba un salto de linea",$2,this._$.first_line, this._$.first_column);}
    | RETURN expresion SPACE {$$=instruccionesApi.nuevoReturn($2, TIPO_LENGUAJE.PYTHON);}
    ;
/*End of Declaraciones*/

/*Print statement*/
print_parameter
    : expresion print_parameter_re{
        $2.push($1);
        $$ = $2;
    }
    ;

print_parameter_re
    : print_parameter_re COMA expresion {
        $1.push($3);
        $$ = $1;
    }
    |  /*empty*/ {$$=[];}
    ;

print_method
    :PRINT {$$=TIPO_PRINT.PRINT;}
    |PRINTLN {$$=TIPO_PRINT.PRINTLN;}
    ;

print_stmt
    : print_method  OPEN_PARENTHESIS print_parameter CLOSE_PARENTHESIS SPACE{
        $$= instruccionesApi.nuevoImprimir($3, TIPO_LENGUAJE.PYTHON);
    }
    | print_method error {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
    | print_method OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una cadena",$3,this._$.first_line, this._$.first_column);}
    | print_method OPEN_PARENTHESIS print_parameter error {addSyntaxError("Se esperaba \')\'",$4,this._$.first_line, this._$.first_column);}
    | print_method OPEN_PARENTHESIS print_parameter CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba un salto de linea",$5,this._$.first_line, this._$.first_column);}
    ;
/*End of Print statement*/

/*If statement*/
if_stmt
    : IF expresion SEMI_COLON SPACE{
        $$ = instruccionesApi.nuevoIf($2, undefined, TIPO_LENGUAJE.PYTHON);
    }
    | IF error {addSyntaxError("Se esperaba una condicion",$2,this._$.first_line, this._$.first_column);}
    | IF expresion error {addSyntaxError("Se esperaba \':\'",$3,this._$.first_line, this._$.first_column);}
    | IF expresion SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$4,this._$.first_line, this._$.first_column);}
    | ELIF expresion SEMI_COLON SPACE{
        $$ = instruccionesApi.nuevoElse($2, undefined, undefined, TIPO_LENGUAJE.PYTHON);
    }
    | ELIF error {addSyntaxError("Se esperaba una condicion",$2,this._$.first_line, this._$.first_column);}
    | ELIF expresion error {addSyntaxError("Se esperaba \':\'",$3,this._$.first_line, this._$.first_column);}
    | ELIF expresion SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$4,this._$.first_line, this._$.first_column);}
    | ELSE SEMI_COLON SPACE{$$=instruccionesApi.nuevoElse(undefined, undefined, undefined, TIPO_LENGUAJE.PYTHON);}
    | ELSE error {addSyntaxError("Se esperaba \':\'",$2,this._$.first_line, this._$.first_column);}
    | ELSE SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$3,this._$.first_line, this._$.first_column);}
    ;
/*End of statement*/

/*For statement*/
for_parameters
    :expresion for_parameters_re{
        $2.push($1);
        $$=$2;
    }
    ;

for_parameters_re
    : for_parameters_re COMA expresion {
        $1.push($3);
        $$=$1;
    }
    | for_parameters_re error {addSyntaxError("Se esperaba \')\' u otra parametro",$2,this._$.first_line, this._$.first_column);}
    |  /*empty*/ {$$=[];}
    ;

rango
    :RANGE OPEN_PARENTHESIS for_parameters CLOSE_PARENTHESIS{
        $$ = $3;
    }
    |RANGE error {addSyntaxError("Se esperaba indicar un rango",$2,this._$.first_line, this._$.first_column);}
    |RANGE OPEN_PARENTHESIS error {addSyntaxError("Se esperaba indicar un rango",$3,this._$.first_line, this._$.first_column);}
    ;

for_stmt
    : FOR IDENTIFICADOR IN rango SEMI_COLON SPACE{
        let valor_inicial = instruccionesApi.nuevaDeclaracion(TIPO_VISIBILIDAD.PUBLIC, $2, TIPO_DATO.INT, TIPO_LENGUAJE.PYTHON);
        let valor_accion = instruccionesApi.nuevoValor(parseInt("1"),TIPO_VALOR.ENTERO, TIPO_LENGUAJE.PYTHON);
        let accion_post = instruccionesApi.nuevaAsignacion_O($2,TIPO_OPERACION.INCREMENTO,valor_accion,TIPO_LENGUAJE.PYTHON);
        $$ = instruccionesApi.nuevoFor(valor_inicial, $4, accion_post, undefined, TIPO_LENGUAJE.PYTHON);
    }
    | FOR error {addSyntaxError("Se esperaba un identificador",$2,this._$.first_line, this._$.first_column);}
    | FOR IDENTIFICADOR error {addSyntaxError("Se esperaba la palabra reservada \'in\'",$3,this._$.first_line, this._$.first_column);}
    | FOR IDENTIFICADOR IN error {addSyntaxError("Se esperaba un rango",$4,this._$.first_line, this._$.first_column);} 
    | FOR IDENTIFICADOR IN rango error {addSyntaxError("Se esperaba \':\'",$5,this._$.first_line, this._$.first_column);} 
    | FOR IDENTIFICADOR IN rango SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$6,this._$.first_line, this._$.first_column);}
    ;
/*End of statement*/

/*While statement*/
while_stmt
    : WHILE expresion SEMI_COLON SPACE{$$=instruccionesApi.nuevoWhile($2, undefined, TIPO_LENGUAJE.PYTHON);}
    | WHILE error {addSyntaxError("Se esperaba una condicion",$2,this._$.first_line, this._$.first_column);}
    | WHILE expresion error {addSyntaxError("Se esperaba \':\'",$3,this._$.first_line, this._$.first_column);}
    | WHILE expresion SEMI_COLON error {addSyntaxError("Se esperaba un salto de linea",$4,this._$.first_line, this._$.first_column);}
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
        $2.push($1);
        $$=$2;
    }
    ;

nombre_variables_re
    : nombre_variables_re COMA IDENTIFICADOR {
        $1.push($3);
        $$=$1;
    }
    |  /*empty*/ {$$=[];}
    ;

expresiones
    :expresion expresiones_re{
        $2.push($1);
        $$=$2;
    }
    ;
expresiones_re
    :expresiones_re COMA expresion {
        $1.push($3);
        $$=$1;
    }
    |/*empty*/{$$=[];}
    ;

asignacion
    : igualaciones expresiones asignacion_re{
        let nuevaIgualacion = instruccionesApi.nuevaAsignacion_O(undefined, $1, $2, TIPO_LENGUAJE.PYTHON);
        $3.push(nuevaIgualacion);
        $$=$3;
    }
    | igualaciones error {addSyntaxError("Se esperaba una asignacion",$2,this._$.first_line, this._$.first_column);}
    ;

asignacion_re
    : asignacion_re igualaciones expresiones {
        let nuevaIgualacion = instruccionesApi.nuevaAsignacion_O(undefined, $2,$3,TIPO_LENGUAJE.PYTHON);
        $1.push(nuevaIgualacion);
        $$=$1;
    }
    | asignacion_re error {addSyntaxError("Se esperaba un salto de linea",$2,this._$.first_line, this._$.first_column);}
    |asignacion_re igualaciones error {addSyntaxError("Se esperaba un valor para asignar",$3,this._$.first_line, this._$.first_column);}
    |  /*empty*/ {$$=[];}
    ;

var_stmt
    : nombre_variables asignacion SPACE{
        //Vienen solo identificadores
        let nombres = $1;
        //Vienen objetos asignaciones
        let asignaciones = $2;
        for(let index=0; index<asignaciones.length; index++){
            asignaciones[index].id = nombres;
        }
        $$=asignaciones;
    }
    | nombre_variables error {addSyntaxError("Se esperaba un salto de linea",$2,this._$.first_line, this._$.first_column);}
    ;
/*End of statement*/
