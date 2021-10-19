/**
 * Ejemplo Intérprete Sencillo con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
%{
	//import
	var ErrorLexico = require ('../../../error/LexicalError');
    var ErrorSintactico = require('../../../error/SyntaxError');
	//variables
	var erroresLexicos = [];
	var erroresSintacticos = [];
	var lineNumber=0;
	var columnNumber=0;

	module.exports.setErroresLexicos = function(errores){
		erroresLexicos = errores;
	}

	module.exports.setErroresSintacticos = function(errores){
		erroresSintacticos = errores;
	}

	module.exports.setLineNumber = function(line){
		lineNumber = line;
	}

	module.exports.setColumnNumber = function(column){
		columnNumber = column
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
commentary	"//".*
block_commentary	[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]	
lit_entero	[0-9]+\b
lit_decimal [0-9]+("."[0-9]+)\b
lit_caracter \'[^\']\'
lit_string \"[^\"]*\"
nombre_paqueteria [aA-zZ|"_"|"-"|0-9|","|"$"|"\("|"\)"|"\["|"\]"|"\{"|"\}"]+
clase ("JAVA")("."{identificador})
metodo_clase {clase}("."{identificador})
metodo ("PY")("."{identificador})
paqueteria \"["PY"|"JAVA"](("."{nombre_paqueteria})+|".*")\"
identificador [aA-zZ|"_"|]([aA-zZ]|[0-9]|"_")*

%%

\s+											// se ignoran espacios en blanco
{metodo_clase}	console.log("metodo clase: "+yytext);return 'METODO_CLASE';
{metodo}	console.log("metodo: "+yytext);return 'METODO';
{clase}		console.log("clas: "+yytext);return 'CLASE';
"if"	return 'IF';
"else"	return 'ELSE';
"switch"	return 'SWITCH';
"while"		return 'WHILE';
"#include"	return 'INCLUDE';
{paqueteria}	return 'PAQUETERIA';
"for"		return 'FOR';
"do"		return 'DO';
"int"		return 'INT';
"char"		return 'CHAR';
"float"		return 'FLOAT';
"const"		return 'CONST';
"case"	return 'CASE';
"break"	return 'BREAK';
"default"	return 'DEFAULT';
"continue"	return 'CONTINUE';
"scanf"	return 'SCANF';
"printf"	return 'PRINTF';
"clrscr"		return 'CLEAN_SCREEN';
"getch"			return 'GETCH';
"void"			return 'VOID';
"main"			return 'MAIN';

//Literales
{lit_entero}	return 'LIT_ENTERO';
{lit_decimal}	return 'LIT_DECIMAL';
{lit_caracter}	return 'LIT_CARACTER';
{lit_string}	return 'LIT_STRING';

//Identificador
{identificador} return 'IDENTIFICADOR';

//Comparaciones
">"	return 'MAYOR';
"<"	return 'MENOR';
"=="	return 'COMPARACION';
"!="	return 'DIFERENTE';

//Condiciones
"&&"	return 'AND';
"||"	return 'OR';
"!"		return 'NOT';

//Operaciones aritmeticas
"++"	return 'INCREMENTO';
"--"	return 'DECREMENTO';
"+"		return 'SUMA';
"-"		return 'RESTA';
"*"		return 'POR';
"/"		return 'DIV';
"%"		return 'MOD';
"="		return 'IGUAL';
//Simbolos
"["		return 'OPEN_BRACKET';
"]"		return 'CLOSE_BRACKET';
"{"		return 'OPEN_CURLY';
"}"		return 'CLOSE_CURLY';
"("		return 'OPEN_PARENTHESIS';
")"		return 'CLOSE_PARENTHESIS';
";"		return 'COLON';
":"		return 'SEMI_COLON';
"&"		return 'PUNTERO';
","		return 'COMA';




<<EOF>>				return 'EOF';
{commentary}		/*ignore*/;
{block_commentary}	/*ignore*/;
.+					{ 
	addLexicalError(yytext, linea(yylloc.first_line), columna(yylloc.first_column));
	}
/lex


%{
	const TIPO_VISIBILIDAD = require("../../../api/Instrucciones").TIPO_VISIBILIDAD;
	const TIPO_LENGUAJE = require("../../../api/Instrucciones").TIPO_LENGUAJE;
	const TIPO_DATO = require('../../../api/Instrucciones').TIPO_DATO;
    const TIPO_VALOR = require('../../../api/Instrucciones').TIPO_VALOR;
    const TIPO_OPERACION = require('../../../api/Instrucciones').TIPO_OPERACION;
    const TIPO_INSTRUCCION = require('../../../api/Instrucciones').TIPO_INSTRUCCION;
    const TIPO_SWITCH = require('../../../api/Instrucciones').TIPO_SWITCH;
    const TIPO_PRINT = require('../../../api/Instrucciones').TIPO_PRINT;
    const instruccionesApi = require('../../../api/InstruccionesApi').instruccionesApi;
    const lenguaje = TIPO_LENGUAJE.C;

	function reversaArreglo(arreglo){
		var aux = [];
		for(var index=arreglo.length-1; index>=0; index--){
			aux.push(arreglo[index]);
		}
		return aux;
	}

	function linea(line){
		return line + lineNumber;
	}

	function columna(column){
		return column + columnNumber;
	}


%}
	%left 'IDENTIFICADOR' 'CHAR' 'FLOAT' 'INT' 'CONST'
	%left 'OR'
	%left 'AND'
	%left 'MAYOR' 'MENOR' 'COMPARACION' 'DIFERENTE'
	%left 'NOT' 
	%left 'SUMA' 'RESTA' 
	%left 'POR' 'DIV' 'MOD' 
	%left 'UMINUS' 'UPUNTERO'
	%left 'OPEN_PARENTHESIS' 'CLOSE_PARENTHESIS'

%start ini

%% /* Definición de la gramática */

parametros
	: expresion parametros_re {
		$2.push($1);
		$$=reversaArreglo($2);
	}
	| /*empty*/ {$$=[];}
	;

parametros_re
	:  COMA expresion parametros_re {
		$3.push($2);
		$$=$3;
	}
	|  COMA error paremetros_re {addSyntaxError("Se esperaba un parametro",$3,linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
	|  /*empty*/ {$$=[];}
	;

metodo_stmt
	: METODO OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS {$$ = instruccionesApi.nuevoMetodo($1, $3, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| METODO error {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| METODO OPEN_PARENTHESIS parametros error {addSyntaxError("Se esperaba \')\'",$4,linea(this._$.first_line), columna(this._$.first_column));}
	;

metodo_clase_stmt
	: METODO_CLASE OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS {$$ = instruccionesApi.nuevoMetodo($1,$3, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| METODO_CLASE error {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| METODO_CLASE OPEN_PARENTHESIS parametros error {addSyntaxError("Se esperaba \')\'",$4,linea(this._$.first_line), columna(this._$.first_column));}
	;

variable_clase
	:  COMA IDENTIFICADOR variable_clase {
		var id = instruccionesApi.nuevoValor($2, null, null, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
		var asignacionClase = instruccionesApi.nuevaDeclaracion(TIPO_VISIBILIDAD.LOCAL, id, null, null, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
		$3.push(asignacionClase);
	 	$$=$3;
		 }
	|  COMA error variable_clase {addSyntaxError("Se esperaba un identificador",$2,linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
	|  /*empty*/ {$$=[];}
	;

asignacion_clase
	: variable_clase {$$=instruccionesApi.tipoAsignacion($1, "declaracion");}
	| OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS {$$=instruccionesApi.tipoAsignacion($2, "asignacion");}
	| OPEN_PARENTHESIS parametros error {addSyntaxError("Se esperaba \')\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
	;

clase_stmt
	: CLASE IDENTIFICADOR asignacion_clase {
		var arreglo = [];
		var id = instruccionesApi.nuevoValor($2, null, null, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
		if($3.rol == "declaracion"){
			$3.push(instruccionesApi.nuevaDeclaracion(TIPO_VISIBILIDAD.LOCAL, id, null, null,lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
			for(let index=0; index<$3.length; index++){
				$3[index].tipo = $1;
			}
			arreglo = $3;
		}else if($3.rol == "asignacion"){
			//Asignaciones
			arreglo.push(instruccionesApi.nuevaAsignacionClase($2, $3, $1, lenguaje, linea, columna));
		}
		$$=instruccionesApi.nuevaVariable(arreglo, lenguaje, linea, columna);;
	}
	| CLASE error {addSyntaxError("Esperaba un identificador",$2,linea(this._$.first_line), columna(this._$.first_column));}
	;

clean_stmt
	: CLEAN_SCREEN OPEN_PARENTHESIS CLOSE_PARENTHESIS {$$=instruccionesApi.nuevoClean(linea(this._$.first_line), columna(this._$.first_column));}
	| CLEAN_SCREEN error {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| CLEAN_SCREEN OPEN_PARENTHESIS error {addSyntaxError("Se esperaba \')\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
	;

getch_stmt
	: GETCH OPEN_PARENTHESIS CLOSE_PARENTHESIS{$$=instruccionesApi.nuevoGetch(linea(this._$.first_line), columna(this._$.first_column))}
	| GETCH error {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| GETCH OPEN_PARENTHESIS error {addSyntaxError("Se esperaba \')\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
	;

scan_parametros
	: expresion COMA expresion {
		var arreglo = [];
		arreglo.push($1);
		arreglo.push($3);
		$$=arreglo;
	}
	| expresion error {addSyntaxError("Se esperaba \',\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion COMA error {addSyntaxError("Se esperaba una expresion", $3, linea(this._$.first_line), columna(this._$.first_column));}
	;

scan_stmt
	: SCANF OPEN_PARENTHESIS scan_parametros CLOSE_PARENTHESIS {
		$$=instruccionesApi.nuevoScan($3[1], $3[0], lenguaje, linea(this._$.first_line), columna(this._$.first_column));
	}
	| SCANF error {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| SCANF OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una expresion", $3, linea(this._$.first_line), columna(this._$.first_column));}
	| SCANF OPEN_PARENTHESIS scan_parametros error {addSyntaxError("Se esperaba \')\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
	;

print_parametros
	: expresion print_parametros_re {
		$2.push($1);
		$$=reversaArreglo($2);
	}
	;

print_parametros_re
	: COMA expresion print_parametros_re {
		$3.push($2);
		$$=$3;
	}
	| COMA error print_parametros_re {addSyntaxError("Se esperaba una expresion", $2, linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
	| /*empty*/ {$$=[];}
	;

print_stmt
	: PRINTF OPEN_PARENTHESIS print_parametros CLOSE_PARENTHESIS {
		$$=instruccionesApi.nuevoImprimir($3, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
	}
	| PRINTF error {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| PRINTF OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una expresion", $3, linea(this._$.first_line), columna(this._$.first_column));}
	| PRINTF OPEN_PARENTHESIS print_parametros error {addSyntaxError("Se esperaba \')\'",$4,linea(this._$.first_line), columna(this._$.first_column));}
	;

nuevo_arreglo
	: OPEN_BRACKET expresion CLOSE_BRACKET nuevo_arreglo_re {
		$4.push($2);
		$$=reversaArreglo($4);
	}
	| OPEN_BRACKET error {addSyntaxError("Se esperaba un valor de arreglo",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| OPEN_BRACKET expresion error {addSyntaxError("Se esperaba \']\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
	;

nuevo_arreglo_re
	: OPEN_BRACKET expresion CLOSE_BRACKET nuevo_arreglo_re{
		$3.push($2);
		$$=$3;
	}
	| OPEN_BRACKET error nuevo_arreglo_re {addSyntaxError("Se esperaba un valor de arreglo",$2,linea(this._$.first_line), columna(this._$.first_column)); $$=$3;}
	| OPEN_BRACKET expresion error nuevo_arreglo_re {addSyntaxError("Se esperaba \']\'",$3,linea(this._$.first_line), columna(this._$.first_column)); $$=$4;}
	|  /*empty*/ {$$=[];}
	;

arreglo_stmt
	: IDENTIFICADOR nuevo_arreglo {
		$$=instruccionesApi.nuevoValor($1, $2,TIPO_VALOR.IDENTIFICADOR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
	}
	;

expresion
	: expresion AND expresion {$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.AND, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion OR expresion	{$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.OR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| NOT expresion {$$=instruccionesApi.operacionUnaria($2, TIPO_OPERACION.NOT, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion MAYOR expresion	{$$=instruccionesApi.operacionAritmetica($1, $3, TIPO_OPERACION.MAYOR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion MENOR expresion	{$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.MENOR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion COMPARACION expresion	{$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.COMPARACION, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion DIFERENTE expresion	{$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.DIFERENTE, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion SUMA expresion	{$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.SUMA, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion RESTA expresion	{$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.RESTA, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion POR expresion	{$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.POR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion DIV expresion	{$$=instruccionesApi.operacionAritmetica($1,$3, TIPO_OPERACION.DIV, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| expresion MOD expresion {$$=instruccionesApi.operacionAritmetica($1, $3, TIPO_OPERACION.MOD, lenguaje, line(), columna(this._$.first_column));}
	| RESTA expresion %prec UMINUS	{$$=instruccionesApi.operacionUnaria($2, TIPO_OPERACION.RESTA, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| LIT_ENTERO	{$$=instruccionesApi.nuevoValor($1, null, TIPO_VALOR.ENTERO, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| LIT_DECIMAL	{$$=instruccionesApi.nuevoValor($1, null, TIPO_VALOR.DECIMAL, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| LIT_CARACTER	{$$=instruccionesApi.nuevoValor($1, null, TIPO_VALOR.CARACTER, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| LIT_STRING {$$=instruccionesApi.nuevoValor($1, null, TIPO_VALOR.CADENA, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| IDENTIFICADOR {$$=instruccionesApi.nuevoValor($1,null, TIPO_VALOR.IDENTIFICADOR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| arreglo_stmt {$$=$1;}
	| PUNTERO IDENTIFICADOR %prec UPUNTERO {$$=instruccionesApi.nuevoValor($2, TIPO_VALOR.PUNTERO_IDENTIFICADOR);}
	| metodo_stmt	{$$=instruccionesApi.nuevoValor($1, null, TIPO_VALOR.METODO, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| metodo_clase_stmt	{$$=instruccionesApi.nuevoValor($1, null, TIPO_VALOR.METODO, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS {$$=$2;}
	;

ini
	: code_c EOF {return reversaArreglo($1);}
	;

paqueteria
	: INCLUDE LIT_STRING  {$$=instruccionesApi.nuevoInclude($2, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| INCLUDE error {addSyntaxError("Se esperaba una direccion de paqueteria",$2,linea(this._$.first_line), columna(this._$.first_column));}
	;

code_c
	: paqueteria code_c{
		$2.push($1);
		$$=$2;
	}
	| var_stmt COLON code_c {$3.push($1);$$=$3;}
	| var_stmt error code_c {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column)); $$=$3;}
	| clase_stmt COLON code_c {$3.push($1);$$=$3;}
	| clase_stmt error code_c {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
	| main code_c {$2.push($1); $$=$2;}
	| error code_c {addSyntaxError("Se esperaba una instruccion de inicio, un main, variable o paqueteria", $1, linea(this._$.first_line), columna(this._$.first_column)); $$=$2;}
	| /*empty*/ {$$=[];}
	;

/*Start of Main*/
main
	: VOID MAIN OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_CURLY statements{
		$$=instruccionesApi.nuevoMain(reversaArreglo($6), lenguaje, linea(this._$.first_line), columna(this._$.first_column));
	}
	| VOID error {addSyntaxError("Se esperaba la palabra \'main\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| VOID MAIN error {addSyntaxError("Se esperaba \'(\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
	| VOID MAIN OPEN_PARENTHESIS error {addSyntaxError("Se esperaba \')\'",$4,linea(this._$.first_line), columna(this._$.first_column));}
	| VOID MAIN OPEN_PARENTHESIS CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba \'{\'",$5,linea(this._$.first_line), columna(this._$.first_column));}
	| VOID MAIN OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_CURLY error {addSyntaxError("Se esperaba \'}\'",$6,linea(this._$.first_line), columna(this._$.first_column));}
	;

/*End of Main*/
/*Start of metodo y clases*/

/**/
/*Init of statements*/
empty_statements
	:  statement empty_statements {
		$2.push($1);
		$$=$2;
	}
	| /*empty*/ {$$=[];}
	;

block_statements
	: OPEN_CURLY statements  {$$=reversaArreglo($2);}
	| statement	{$$= $1;}
	;

statements
	:  statement statements {
		$2.push($1);
		$$=$2;
	}
	| CLOSE_CURLY {$$=[];}
	;


statement
	: var_stmt COLON	{$$=$1;}
	| var_stmt error {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| scan_stmt COLON	{$$=$1;}
	| scan_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| print_stmt COLON	{$$=$1;}
	| print_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| clean_stmt COLON	{$$=$1;}
	| clean_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| getch_stmt COLON	{$$=$1;}
	| getch_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| metodo_stmt COLON {$$=$1;}
	| metodo_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| metodo_clase_stmt COLON {$$=$1;}
	| metodo_clase_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| clase_stmt COLON	{$$=$1;}
	| clase_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| if_stmt	{$$=$1;}
	| for_stmt	{$$=$1;}
	| while_stmt	{$$=$1;}
	| do_stmt COLON	{$$=$1;}
	| do_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| switch_stmt	{$$=$1;}
	| CONTINUE COLON	{$$=instruccionesApi.nuevoContinue(linea(this._$.first_line), columna(this._$.first_column));}
	| CONTINUE error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| BREAK COLON 	{$$=instruccionesApi.nuevoBreak(linea(this._$.first_line), columna(this._$.first_column));}
	| BREAK error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	;
/*End of statements*/

/*Init of For statement*/

accion_for
	: var_stmt {$$=$1;}
	| metodo_stmt	{$$=$1;}
	| metodo_clase_stmt	{$$=$1;}
	| clase_Stmt 	{$$=$1;}
	| print_stmt	{$$=$1;}
	| scan_stmt	{$$=$1;}
	| clean_stmt	{$$=$1;}
	| getch_stmt	{$$=$1;}
	;

for_inicio
	:var_stmt COLON {$$=$1;}
	|var_stmt error
	;

for_condicion
	: expresion COLON {$$=$1;}
	| expresion error
	;

for_stmt
	: FOR OPEN_PARENTHESIS for_inicio for_condicion accion_for CLOSE_PARENTHESIS block_statements {
		$$=instruccionesApi.nuevoFor($3, $4, $5, $7, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
	}
	| FOR error {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| FOR OPEN_PARENTHESIS error	{addSyntaxError("Se esperaba una expresion de inicio", $3, linea(this._$.first_line), columna(this._$.first_column));}
	| FOR OPEN_PARENTHESIS for_inicio error {addSyntaxError("Se esperaba una condicion", $4, linea(this._$.first_line), columna(this._$.first_column));}
	| FOR OPEN_PARENTHESIS for_inicio for_condicion error {addSyntaxError("Se esperaba una accion", $5, linea(this._$.first_line), columna(this._$.first_column));}
	| FOR OPEN_PARENTHESIS for_inicio for_condicion accion_for error {addSyntaxError("Se esperaba \')\'", $6, linea(this._$.first_line), columna(this._$.first_column));}
	| FOR OPEN_PARENTHESIS for_inicio for_condicion accion_for CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba una declaracion", $7, linea(this._$.first_line), columna(this._$.first_column));}
	;

/*End of for statement*/

/*Init of Var statement*/
data_type 
	: INT {$$=TIPO_DATO.INT;}
	| FLOAT	{$$=TIPO_DATO.FLOAT;}
	| CHAR	{$$=TIPO_DATO.CHAR;}
	;

const_data
	: CONST data_type {
		var arreglo = [];
		arreglo.push(TIPO_VISIBILIDAD.CONST);
		arreglo.push($2);
		$$=arreglo;
	}
	| CONST error {addSyntaxError("Se esperaba un tipo de dato (int, float, char)",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| data_type	{$$=$1;}
	;

arreglo
	: OPEN_BRACKET expresion CLOSE_BRACKET arreglo_re	{
		$4.push($2);
		$$=reversaArreglo($4);
	}
	| OPEN_BRACKET error {addSyntaxError("Se esperaba una expresion",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| OPEN_BRACKET expresion error {addSyntaxError("Se esperaba \']\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
	|  /*empty*/	{$$=[];}
	;

arreglo_re
	: OPEN_BRACKET expresion CLOSE_BRACKET arreglo_re {
		$4.push($2);
		$$=$4;
	}
	| OPEN_BRACKET error arreglo_re  {addSyntaxError("Se esperaba una expresion",$2,linea(this._$.first_line), columna(this._$.first_column));$$=$3;}
	| OPEN_BRACKET expresion error arreglo_re  {addSyntaxError("Se esperaba \']\'",$3,linea(this._$.first_line), columna(this._$.first_column));$$=$4;}
	|  /*empty*/ {$$=[];}
	;

valor_asignacion
	: IGUAL expresion{
		var arreglo = [];
		arreglo.push(instruccionesApi.nuevaAsignacion_O(null, null, TIPO_OPERACION.IGUAL, $2, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
		$$=arreglo;
	}
	| IGUAL getch_stmt {
		var arreglo = [];
		arreglo.push(instruccionesApi.nuevaAsignacion_O(null, null, TIPO_OPERACION.IGUAL, $2, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
		$$=arreglo;
	}
	| IGUAL error  {addSyntaxError("Se esperaba un valor par asignar",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| INCREMENTO	{
		var arreglo = [];
		arreglo.push(instruccionesApi.nuevaAsignacion_O(null, null, TIPO_OPERACION.INCREMENTO, expresion, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
		$$ = arreglo;
		}
	| DECREMENTO	{
		var arreglo = [];
		arreglo.push(instruccionesApi.nuevaAsignacion_O(null, null, TIPO_OPERACION.DECREMENTO, expresion, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
		$$ = arreglo;
		}
	;

var_stmt
	: const_data IDENTIFICADOR arreglo valor_asignacion{
		var id = instruccionesApi.nuevoValor($2,null, TIPO_VALOR.IDENTIFICADOR, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
		$4[0].id = id;
		var tipo = null;
		var visibilidad = null;
		if(!Array.isArray($1)){
			tipo = $1;
		}else{
			visibilidad = $1[0];
			tipo = $1[1];
		}
		$4.push(instruccionesApi.nuevaDeclaracion(visibilidad, id, $3, tipo, lenguaje, linea(this._$.first_line), columna(this._$.first_column)));
		$$=instruccionesApi.nuevaVariable($4, lenguaje, linea, columna);
	}
	| const_data error  {addSyntaxError("Se esperaba un identificador",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| const_data IDENTIFICADOR arreglo error {addSyntaxError("Se esperaba un valor para asignar",$4,linea(this._$.first_line), columna(this._$.first_column));}
	| IDENTIFICADOR arreglo valor_asignacion{
		$3[0].id = instruccionesApi.nuevoValor($1, null, TIPO_VALOR.IDENTIFICADOR,lenguaje, linea(this._$.first_line), columna(this._$.first_column));
		$$=instruccionesApi.nuevaVariable($3, lenguaje, linea, columna);
	}
	| IDENTIFICADOR arreglo error  {addSyntaxError("Se espera un valor para asignar",$2,linea(this._$.first_line), columna(this._$.first_column));}
	;
/*End of Statement*/

/*Start of IF*/
if_stmt
	: IF OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS block_statements {
		$$=instruccionesApi.nuevoIf($2, $5, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
	}
	| IF error  {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| IF OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una condicion",$3,linea(this._$.first_line), columna(this._$.first_column));}
	| IF OPEN_PARENTHESIS expresion error {addSyntaxError("Se esperaba \')\'",$4,linea(this._$.first_line), columna(this._$.first_column));}
	| IF OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS error  {addSyntaxError("Se esperaba una declaracion o \'{\'",$5,linea(this._$.first_line), columna(this._$.first_column));}
	| ELSE block_statements {
		var else_stmt = instruccionesApi.nuevoElse(null, null, null, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
		if(!Array.isArray($2)){
			if($2.rol == TIPO_INSTRUCCION.IF){
				else_stmt.codicion = $2.condicion;
			}
			else_stmt.instrucciones = $2.instrucciones;
		}else{
			else_stmt.instrucciones = $2;
		}
		$$=else_stmt;
	}
	| ELSE error  {addSyntaxError("Se esperaba una declaracion o \'{\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	;
/*Close of if*/
/*Start of while*/
while_stmt
	: WHILE OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS block_statements{
		$$=instruccionesApi.nuevoWhile($3, $5, lenguaje, linea(this._$.first_line), columna(this._$.first_column));
	}
	| WHILE error  {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| WHILE OPEN_PARENTHESIS error  {addSyntaxError("Se esperaba una condicion",$3,linea(this._$.first_line), columna(this._$.first_column));}
	| WHILE OPEN_PARENTHESIS expresion error {addSyntaxError("Se esperaba \')\'",$4,linea(this._$.first_line), columna(this._$.first_column));}
	| WHILE OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba una condicion o \'{\'",$5,linea(this._$.first_line), columna(this._$.first_column));}
	;
/*End of while*/

/*Start of Do*/
do_stmt
	: DO OPEN_CURLY empty_statements CLOSE_CURLY while_do	{$$=instruccionesApi.nuevoDoWhile(reversaArreglo($3), $5, lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| DO error  {addSyntaxError("Se esperaba \'{\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| DO OPEN_CURLY empty_statements error  {addSyntaxError("Se esperaba \'}\'",$4,linea(this._$.first_line), columna(this._$.first_column));}
	| DO OPEN_CURLY empty_statements CLOSE_CURLY error  {addSyntaxError("Se esperaba un while",$5,linea(this._$.first_line), columna(this._$.first_column));}
	;

while_do
	: WHILE OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS  {$$=$3;}
	| WHILE error  {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| WHILE OPEN_PARENTHESIS error  {addSyntaxError("Se esperaba una condicion",$3,linea(this._$.first_line), columna(this._$.first_column));}
	| WHILE OPEN_PARENTHESIS expresion error  {addSyntaxError("Se esperaba \')\'",$4,linea(this._$.first_line), columna(this._$.first_column));}
	;
/*End of Do*/
/*Start of switch*/
switch_stmt
	: SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases CLOSE_CURLY {
		$$=instruccionesApi.nuevoSwitch($3, reversaArreglo($6), lenguaje, linea(this._$.first_line), columna(this._$.first_column));
	}
	| SWITCH error  {addSyntaxError("Se esperaba \'(\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| SWITCH OPEN_PARENTHESIS error  {addSyntaxError("Se esperaba un identificador",$3,linea(this._$.first_line), columna(this._$.first_column));}
	| SWITCH OPEN_PARENTHESIS IDENTIFICADOR error  {addSyntaxError("Se esperaba \')\'",$4,linea(this._$.first_line), columna(this._$.first_column));}
	| SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba \'{\'",$5,linea(this._$.first_line), columna(this._$.first_column));}
	| SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases error  {addSyntaxError("Se esperaba \'}\'",$7,linea(this._$.first_line), columna(this._$.first_column));}
	;

cases
	:case_stmt cases {
		$1.push($2);
		$$=$1;
	}
	|default_stmt {var arreglo = []; arreglo.push($1); $$=arreglo;}
	| /*empty*/	{$$=[];}
	;



switch_statement
	: var_stmt COLON	{$$=$1;}
	| var_stmt error {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| scan_stmt COLON	{$$=$1;}
	| scan_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| print_stmt COLON	{$$=$1;}
	| print_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| clean_stmt COLON	{$$=$1;}
	| clean_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| getch_stmt COLON	{$$=$1;}
	| getch_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| metodo_stmt COLON {$$=$1;}
	| metodo_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| metodo_clase_stmt COLON {$$=$1;}
	| metodo_clase_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| clase_stmt COLON	{$$=$1;}
	| clase_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| if_stmt	{$$=$1;}
	| for_stmt	{$$=$1;}
	| while_stmt	{$$=$1;}
	| do_stmt COLON	{$$=$1;}
	| do_stmt error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| switch_stmt	{$$=$1;}
	| CONTINUE COLON	{$$=instruccionesApi.nuevoContinue(linea(this._$.first_line), columna(this._$.first_column));}
	| CONTINUE error  {addSyntaxError("Se esperaba \';\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	;

switch_instructions
	: switch_statement switch_instructions{
		$2.push($1);
		$$=$2;
	}
	| BREAK COLON {$$=[];}
	| BREAK error {addSyntaxError("Se esperaba \';\'", $2, linea(this._$.first_line), columna(this._$.first_column));}
	;

default_instructions
	: switch_statement default_instructions {
		$2.push($1);
		$$=$2;
	}
	| /*empty*/ {$$=[];}
	;

case_stmt
	: CASE expresion SEMI_COLON switch_instructions {$$=instruccionesApi.nuevoCase($2, reversaArreglo($4), lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| CASE error  {addSyntaxError("Se esperaba un valor de caso",$2,linea(this._$.first_line), columna(this._$.first_column));}
	| CASE expresion error  {addSyntaxError("Se esperaba \':\'",$3,linea(this._$.first_line), columna(this._$.first_column));}
	| CASE expresion SEMI_COLON error {addSyntaxError("Se esperaba break;", $4, linea(this._$.first_line), columna(this._$.first_column));}
	;

default_stmt
	:DEFAULT SEMI_COLON default_instructions {$$=instruccionesApi.nuevoDefault(reversaArreglo($3), lenguaje, linea(this._$.first_line), columna(this._$.first_column));}
	| DEFAULT error  {addSyntaxError("Se esperaba \':\'",$2,linea(this._$.first_line), columna(this._$.first_column));}
	;

/*End of switch*/