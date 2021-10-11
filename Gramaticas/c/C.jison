/**
 * Ejemplo Intérprete Sencillo con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
%{
	//import
	var ErrorLexico = require ('../../../error/LexicalError');
    var ErrorSintactico = require('../../../error/SyntaxError');
	//variables
	let erroresLexicos = [];
	let erroresSintacticos = [];
	let lineNumber=0;
	let columnNumber=0;

	function getErroresLexicos(){
		return erroresLexicos;
	}

	function getErroresSintacticos(){
		return erroresSintacticos;
	}

	function setLineNumber(line){
		this.lineNumber=line;
	}

	function setColumnNumber(column){
		this.columnNumber=column
	}

	function addLexicalError(lexema, line, column){
		try{
			let errorLexico = new ErrorLexico(lexema, line+lineNumber, column+columnNumber);
			erroresLexicos.push(errorLexico);
		}catch(ex){
			console.log(ex);
		}
	}

	function addSyntaxError(descripcion, token, line, column){
		try{
			let errorSintactico = new ErrorSintactico(descripcion, token, line+lineNumber, column+columnNumber);
			erroresLexicos.push(errorSintactico);
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
	console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
	addLexicalError(yytext, yylloc.first_line, yylloc.first_column);
	}
/lex


%{
	
%}
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
	: expresion parametros_re
	| /*empty*/
	;

parametros_re
	: parametros_re COMA expresion
	| paremetros_re COMA error {addSyntaxError("Se esperaba un parametro",$3,this._$.first_line, this._$.first_column);}
	|  /*empty*/
	;

metodo_stmt
	: METODO OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS
	| METODO error {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| METODO OPEN_PARENTHESIS parametros error {addSyntaxError("Se esperaba \')\'",$4,this._$.first_line, this._$.first_column);}
	;

metodo_clase_stmt
	: METODO_CLASE OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS
	| METODO_CLASE error {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| METODO_CLASE OPEN_PARENTHESIS parametros error {addSyntaxError("Se esperaba \')\'",$4,this._$.first_line, this._$.first_column);}
	;

variable_clase
	: variable_clase COMA IDENTIFICADOR
	| variable_clase COMA error {addSyntaxError("Se esperaba un identificador",$3,this._$.first_line, this._$.first_column);}
	|  /*empty*/
	;

asignacion_clase
	: variable_clase
	| OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS
	| OPEN_PARENTHESIS parametros error {addSyntaxError("Se esperaba \')\'",$3,this._$.first_line, this._$.first_column);}
	;

clase_stmt
	: CLASE IDENTIFICADOR asignacion_clase
	| CLASE error {addSyntaxError("Esperaba un identificador",$2,this._$.first_line, this._$.first_column);}
	;

clean_stmt
	: CLEAN_SCREEN OPEN_PARENTHESIS CLOSE_PARENTHESIS 		
	| CLEAN_SCREEN error {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| CLEAN_SCREEN OPEN_PARENTHESIS error {addSyntaxError("Se esperaba \')\'",$3,this._$.first_line, this._$.first_column);}
	;

getch_stmt
	: GETCH OPEN_PARENTHESIS CLOSE_PARENTHESIS
	| GETCH error {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| GETCH OPEN_PARENTHESIS error {addSyntaxError("Se esperaba \')\'",$3,this._$.first_line, this._$.first_column);}
	;

scan_stmt
	: SCANF OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS
	| SCANF error {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| SCANF OPEN_PARENTHESIS parametros error {addSyntaxError("Se esperaba \')\'",$3,this._$.first_line, this._$.first_column);}
	;

print_stmt
	: PRINTF OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS
	| PRINTF error {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| PRINTF OPEN_PARENTHESIS parametros error {addSyntaxError("Se esperaba \')\'",$4,this._$.first_line, this._$.first_column);}
	;

nuevo_arreglo
	: OPEN_BRACKET expresion CLOSE_BRACKET nuevo_arreglo_re
	| OPEN_BRACKET error {addSyntaxError("Se esperaba un valor de arreglo",$2,this._$.first_line, this._$.first_column);}
	| OPEN_BRACKET expresion error {addSyntaxError("Se esperaba \']\'",$3,this._$.first_line, this._$.first_column);}
	;

nuevo_arreglo_re
	: nuevo_arreglo_re OPEN_BRACKET expresion CLOSE_BRACKET
	| nuevo_arreglo_re OPEN_BRACKET error {addSyntaxError("Se esperaba un valor de arreglo",$3,this._$.first_line, this._$.first_column);}
	| nuevo_arreglo_re OPEN_BRACKET expresion error {addSyntaxError("Se esperaba \']\'",$4,this._$.first_line, this._$.first_column);}
	|  /*empty*/
	;

arreglo_stmt
	: IDENTIFICADOR nuevo_arreglo
	;

expresion
	: expresion AND expresion
	| expresion OR expresion
	| NOT expresion 
	| expresion MAYOR expresion
	| expresion MENOR expresion
	| expresion COMPARACION expresion
	| expresion DIFERENTE expresion
	| expresion SUMA expresion
	| expresion RESTA expresion
	| expresion POR expresion
	| expresion DIV expresion
	| expresion MOD expresion
	| RESTA expresion %prec UMINUS
	| LIT_ENTERO
	| LIT_DECIMAL
	| LIT_CARACTER
	| LIT_STRING
	| IDENTIFICADOR
	| arreglo_stmt
	| PUNTERO IDENTIFICADOR %prec UPUNTERO
	| metodo_stmt
	| metodo_clase_stmt
	| OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS
	;

paqueteria
	: INCLUDE PAQUETERIA 
	| INCLUDE error {addSyntaxError("Se esperaba una direccion de paqueteria",$2,this._$.first_line, this._$.first_column);}
	;

ini
	: code_c EOF
	;

code_c
	: code_c paqueteria 
	| code_c error {addSyntaxError("Se esperaba \'include\'",$2,this._$.first_line, this._$.first_column);}
	| main 
	| error {addSyntaxError("Se esperaba una funcion main",$1,this._$.first_line, this._$.first_column);}
	;

/*Start of Main*/
main
	: VOID MAIN OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_CURLY statements
	| VOID error {addSyntaxError("Se esperaba la palabra \'main\'",$2,this._$.first_line, this._$.first_column);}
	| VOID MAIN error {addSyntaxError("Se esperaba \'(\'",$3,this._$.first_line, this._$.first_column);}
	| VOID MAIN OPEN_PARENTHESIS error {addSyntaxError("Se esperaba \')\'",$4,this._$.first_line, this._$.first_column);}
	| VOID MAIN OPEN_PARENTHESIS CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba \'{\'",$5,this._$.first_line, this._$.first_column);}
	| VOID MAIN OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_CURLY error {addSyntaxError("Se esperaba \'}\'",$6,this._$.first_line, this._$.first_column);}
	;

/*End of Main*/
/*Start of metodo y clases*/

/**/
/*Init of statements*/
empty_statements
	:empty_statements statement
	| /*empty*/
	;

block_statements
	: statements OPEN_CURLY 
	| statements error {addSyntaxError("Se esperaba \'{\'",$2,this._$.first_line, this._$.first_column);}
	| statement
	;

statements
	: statements statement
	| CLOSE_CURLY 
	;


statement
	: var_stmt COLON
	| var_stmt error {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| scan_stmt COLON
	| scan_stmt error  {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| print_stmt COLON
	| print_stmt error  {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| clean_stmt COLON
	| clean_stmt error  {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| getch_stmt COLON
	| getch_stmt error  {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| metodo_stmt COLON
	| metodo_stmt error  {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| metodo_clase_stmt COLON
	| metodo_clase_stmt error  {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| clase_stmt COLON
	| clase_stmt error  {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| if_stmt
	| for_stmt
	| while_stmt
	| do_stmt COLON
	| do_stmt error  {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| switch_stmt
	| CONTINUE COLON
	| CONTINUE error  {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| BREAK COLON 
	| BREAK error  {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	;
/*End of statements*/

/*Init of For statement*/

accion_for
	: var_stmt
	| metodo_stmt
	| metodo_clase_stmt
	| clase_Stmt 
	| print_stmt
	| scan_stmt
	| clean_stmt
	| getch_stmt
	;

for_params
	:var_stmt COLON expresion COLON accion_for
	|var_stmt error {addSyntaxError("Se esperaba \';\'",$2,this._$.first_line, this._$.first_column);}
	| var_stmt COLON error  {addSyntaxError("Se esperaba una condicion",$3,this._$.first_line, this._$.first_column);}
	| var_stmt COLON expresion error  {addSyntaxError("Se esperaba \';\'",$4,this._$.first_line, this._$.first_column);}
	| var_stmt COLON expresion COLON error {addSyntaxError("Se esperaba una declaracion",$5,this._$.first_line, this._$.first_column);}
	;

for_stmt
	: FOR OPEN_PARENTHESIS for_params CLOSE_PARENTHESIS block_statements
	| FOR error {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| FOR OPEN_PARENTHESIS error {addSyntaxError("No se especificaron los parametros del for",$3,this._$.first_line, this._$.first_column);}
	| FOR OPEN_PARENTHESIS for_params error  {addSyntaxError("Se esperaba \')\'",$4,this._$.first_line, this._$.first_column);}
	| FOR OPEN_PARENTHESIS for_params CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba una declaracion",$5,this._$.first_line, this._$.first_column);}
	;

/*End of for statement*/

/*Init of Var statement*/
data_type 
	: INT
	| FLOAT
	| CHAR
	;

const_data
	: CONST data_type
	| CONST error {addSyntaxError("Se esperaba un tipo de dato (int, float, char)",$2,this._$.first_line, this._$.first_column);}
	| data_type
	;

arreglo
	: OPEN_BRACKET expresion CLOSE_BRACKET arreglo_re
	| OPEN_BRACKET error {addSyntaxError("Se esperaba una expresion",$2,this._$.first_line, this._$.first_column);}
	| OPEN_BRACKET expresion error {addSyntaxError("Se esperaba \']\'",$3,this._$.first_line, this._$.first_column);}
	|  /*empty*/
	;

arreglo_re
	: arreglo_re OPEN_BRACKET expresion CLOSE_BRACKET
	| arreglo_re OPEN_BRACKET error  {addSyntaxError("Se esperaba una expresion",$3,this._$.first_line, this._$.first_column);}
	| arreglo_re OPEN_BRACKET expresion error  {addSyntaxError("Se esperaba \']\'",$4,this._$.first_line, this._$.first_column);}
	|  /*empty*/
	;

valor_asignacion
	: IGUAL expresion
	| IGUAL getch_stmt
	| IGUAL error  {addSyntaxError("Se esperaba un valor par asignar",$2,this._$.first_line, this._$.first_column);}
	| INCREMENTO
	| DECREMENTO
	;

var_stmt
	: const_data IDENTIFICADOR arreglo valor_asignacion
	| const_data error  {addSyntaxError("Se esperaba un identificador",$2,this._$.first_line, this._$.first_column);}
	| const_data IDENTIFICADOR arreglo error {addSyntaxError("Se esperaba un valor para asignar",$4,this._$.first_line, this._$.first_column);}
	| IDENTIFICADOR valor_asignacion
	| IDENTIFICADOR error  {addSyntaxError("Se espera un valor para asignar",$2,this._$.first_line, this._$.first_column);}
	;
/*End of Statement*/

/*Start of IF*/
if_stmt
	:IF OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS block_statements
	| IF error  {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| IF OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una condicion",$3,this._$.first_line, this._$.first_column);}
	| IF OPEN_PARENTHESIS expresion error {addSyntaxError("Se esperaba \')\'",$4,this._$.first_line, this._$.first_column);}
	| IF OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS error  {addSyntaxError("Se esperaba una declaracion o \'{\'",$5,this._$.first_line, this._$.first_column);}
	| ELSE block_statements
	| ELSE error  {addSyntaxError("Se esperaba una declaracion o \'{\'",$2,this._$.first_line, this._$.first_column);}
	;
/*Close of if*/
/*Start of while*/
while_stmt
	: WHILE OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS block_statements
	| WHILE error  {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| WHILE OPEN_PARENTHESIS error  {addSyntaxError("Se esperaba una condicion",$3,this._$.first_line, this._$.first_column);}
	| WHILE OPEN_PARENTHESIS expresion error {addSyntaxError("Se esperaba \')\'",$4,this._$.first_line, this._$.first_column);}
	| WHILE OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba una condicion o \'{\'",$5,this._$.first_line, this._$.first_column);}
	;
/*End of while*/

/*Start of Do*/
do_stmt
	: DO OPEN_CURLY empty_statements CLOSE_CURLY while_do
	| DO error  {addSyntaxError("Se esperaba \'{\'",$2,this._$.first_line, this._$.first_column);}
	| DO OPEN_CURLY empty_statements error  {addSyntaxError("Se esperaba \'}\'",$4,this._$.first_line, this._$.first_column);}
	| DO OPEN_CURLY empty_statements CLOSE_CURLY error  {addSyntaxError("Se esperaba un while",$5,this._$.first_line, this._$.first_column);}
	;

while_do
	: WHILE OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS 
	| WHILE error  {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| WHILE OPEN_PARENTHESIS error  {addSyntaxError("Se esperaba una condicion",$3,this._$.first_line, this._$.first_column);}
	| WHILE OPEN_PARENTHESIS expresion error  {addSyntaxError("Se esperaba \')\'",$4,this._$.first_line, this._$.first_column);}
	;
/*End of Do*/
/*Start of switch*/
switch_stmt
	: SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases CLOSE_CURLY
	| SWITCH error  {addSyntaxError("Se esperaba \'(\'",$2,this._$.first_line, this._$.first_column);}
	| SWITCH OPEN_PARENTHESIS error  {addSyntaxError("Se esperaba un identificador",$3,this._$.first_line, this._$.first_column);}
	| SWITCH OPEN_PARENTHESIS IDENTIFICADOR error  {addSyntaxError("Se esperaba \')\'",$4,this._$.first_line, this._$.first_column);}
	| SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS error {addSyntaxError("Se esperaba \'{\'",$5,this._$.first_line, this._$.first_column);}
	| SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases error  {addSyntaxError("Se esperaba \'}\'",$7,this._$.first_line, this._$.first_column);}
	;

cases
	:cases case_stmt
	|default_stmt 
	| /*empty*/
	;

case_stmt
	:CASE expresion SEMI_COLON empty_statements
	| CASE error  {addSyntaxError("Se esperaba un valor de caso",$2,this._$.first_line, this._$.first_column);}
	| CASE expresion error  {addSyntaxError("Se esperaba \':\'",$3,this._$.first_line, this._$.first_column);}
	;

default_stmt
	:DEFAULT SEMI_COLON empty_statements
	| DEFAULT error  {addSyntaxError("Se esperaba \':\'",$2,this._$.first_line, this._$.first_column);}
	;

/*End of switch*/