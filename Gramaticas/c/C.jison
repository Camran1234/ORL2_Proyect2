/**
 * Ejemplo Intérprete Sencillo con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
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
.+					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
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
	|%empty /*empty*/
	;

parametros_re
	: parametros_re COMA expresion
	| paremetros_re COMA error
	| %empty /*empty*/
	;

metodo_stmt
	: METODO OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS
	| METODO error
	| METODO OPEN_PARENTHESIS parametros error
	;

metodo_clase_stmt
	: METODO_CLASE OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS
	| METODO_CLASE error
	| METODO_CLASE OPEN_PARENTHESIS parametros error
	;

variable_clase
	: variable_clase COMA IDENTIFICADOR
	| variable_clase COMA error
	| %empty /*empty*/
	;

asignacion_clase
	: variable_clase
	| OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS
	| OPEN_PARENTHESIS parametros error
	;

clase_stmt
	: CLASE IDENTIFICADOR asignacion_clase
	| CLASE error 
	;

clean_stmt
	: CLEAN_SCREEN OPEN_PARENTHESIS CLOSE_PARENTHESIS 		
	| CLEAN_SCREEN error
	| CLEAN_SCREEN OPEN_PARENTHESIS error
	;

getch_stmt
	: GETCH OPEN_PARENTHESIS CLOSE_PARENTHESIS
	| GETCH error
	| GETCH OPEN_PARENTHESIS error
	;

scan_stmt
	: SCANF OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS
	| SCANF error
	| SCANF OPEN_PARENTHESIS parametros error
	;

print_stmt
	: PRINTF OPEN_PARENTHESIS parametros CLOSE_PARENTHESIS
	;

nuevo_arreglo
	: OPEN_BRACKET expresion CLOSE_BRACKET nuevo_arreglo_re
	| OPEN_BRACKET error
	| OPEN_BRACKET expresion error
	;

nuevo_arreglo_re
	: nuevo_arreglo_re OPEN_BRACKET expresion CLOSE_BRACKET
	| nuevo_arreglo_re OPEN_BRACKET error
	| nuevo_arreglo_re OPEN_BRACKET expresion error
	| %empty /*empty*/
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
	| INCLUDE error
	;

ini
	: code_c EOF
	;

code_c
	: code_c paqueteria 
	| code_c error
	| main
	| error
	;

/*Start of Main*/
main
	: VOID MAIN OPEN_PARENTHESIS CLOSE_PARENTHESIS block_statements
	| VOID error 
	| VOID MAIN error
	| VOID MAIN OPEN_PARENTHESIS error
	| VOID MAIN OPEN_PARENTHESIS CLOSE_PARENTHESIS error
	;

/*End of Main*/
/*Start of metodo y clases*/

/**/
/*Init of statements*/
empty_statements
	:empty_statements statement
	|%empty /*empty*/
	;

block_statements
	: statements OPEN_CURLY 
	| statement
	;

statements
	: statements statement
	| statements error
	| CLOSE_CURLY 
	;


statement
	: var_stmt COLON
	| var_stmt error
	| scan_stmt COLON
	| scan_stmt error
	| print_stmt COLON
	| print_stmt error
	| clean_stmt COLON
	| clean_stmt error
	| getch_stmt COLON
	| getch_stmt error
	| metodo_stmt COLON
	| metodo_stmt error
	| metodo_clase_stmt COLON
	| metodo_clase_stmt error
	| clase_stmt COLON
	| clase_stmt error
	| if_stmt
	| for_stmt
	| while_stmt
	| do_stmt COLON
	| do_stmt error
	| switch_stmt
	| CONTINUE COLON
	| CONTINUE error
	| BREAK COLON 
	| BREAK error
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
	|var_stmt error
	| var_stmt COLON error
	| var_stmt COLON expresion error
	| var_stmt COLON expresion COLON error
	;

for_stmt
	: FOR OPEN_PARENTHESIS for_params CLOSE_PARENTHESIS block_statements
	| FOR error
	| FOR OPEN_PARENTHESIS error
	| FOR OPEN_PARENTHESIS for_params error
	| FOR OPEN_PARENTHESIS for_params CLOSE_PARENTHESIS error
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
	| CONST error
	| data_type
	;

arreglo
	: OPEN_BRACKET expresion CLOSE_BRACKET arreglo_re
	| OPEN_BRACKET error
	| OPEN_BRACKET expresion error
	| %empty /*empty*/
	;

arreglo_re
	: arreglo_re OPEN_BRACKET expresion CLOSE_BRACKET
	| arreglo_re OPEN_BRACKET error
	| arreglo_re OPEN_BRACKET expresion error
	| %empty /*empty*/
	;

valor_asignacion
	: IGUAL expresion
	| IGUAL getch_stmt
	| IGUAL error
	| INCREMENTO
	| DECREMENTO
	;

var_stmt
	: const_data IDENTIFICADOR arreglo valor_asignacion
	| const_data error
	| const_data IDENTIFICADOR arreglo error
	| IDENTIFICADOR valor_asignacion
	| IDENTIFICADOR error
	;
/*End of Statement*/

/*Start of IF*/
if_stmt
	:IF OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS block_statements
	| IF error 
	| IF OPEN_PARENTHESIS error
	| IF OPEN_PARENTHESIS expresion error
	| IF OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS error
	| ELSE block_statements
	| ELSE error
	;
/*Close of if*/
/*Start of while*/
while_stmt
	: WHILE OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS block_statements
	| WHILE error
	| WHILE OPEN_PARENTHESIS error
	| WHILE OPEN_PARENTHESIS expresion error
	| WHILE OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS error
	;
/*End of while*/

/*Start of Do*/
do_stmt
	: DO OPEN_CURLY empty_statements CLOSE_CURLY while_do
	| DO error
	| DO OPEN_CURLY empty_statements error
	| DO OPEN_CURLY empty_statements CLOSE_CURLY error
	;

while_do
	: WHILE OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS 
	| WHILE error
	| WHILE OPEN_PARENTHESIS error
	| WHILE OPEN_PARENTHESIS expresion error
	;
/*End of Do*/
/*Start of switch*/
switch_stmt
	: SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases CLOSE_CURLY
	| SWITCH error
	| SWITCH OPEN_PARENTHESIS error
	| SWITCH OPEN_PARENTHESIS IDENTIFICADOR error
	| SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS error
	| SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases error
	;

cases
	:cases case_stmt
	|default_stmt 
	|%empty /*empty*/
	;

case_stmt
	:CASE expresion SEMI_COLON empty_statements
	| CASE error
	| CASE expresion error
	;

default_stmt
	:DEFAULT SEMI_COLON empty_statements
	| DEFAULT error
	;

/*End of switch*/