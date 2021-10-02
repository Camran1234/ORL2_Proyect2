/*Parsea Java*/

%{

%}

%lex
%%
\s+                                 // se ignoran espacios en blanco
"//".*                              // comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] // comentario multiple líneas

"package" return 'PACKAGE';


">=" return 'MAYOR_IGUAL';
"<=" return 'MENOR_IGUAL';
"!=" return 'DIFERENTE';
"==" return 'IGUAL_IGUAL';

"&&" return 'AND';
"||" return 'OR';
"!" return 'NOT';

"+=" return 'O_MAS';
"-=" return 'O_MENOS';
"/=" return 'O_DIV';
"*=" return 'O_POR';
"%=" return 'O_MOD';
"^=" return 'O_POW';
"=" return 'IGUAL';

"++" return 'INCREMENTO';
"--" return 'DECREMENTO';
"+" return 'SUMA';
"-" return 'RESTA';
"*" return 'POR';
"/" return 'DIV';
"%" return 'MOD';
"^" return 'POW';
">" return 'MAYOR';
"<" return 'MENOR';


"int" return 'INT';
"float" return 'FLOAT';
"double" return 'DOUBLE';
"boolean" return 'BOOLEAN';
"char" return 'CHAR';
"String" return 'STRING';
"void" return 'VOID';
"true" return 'TRUE';
"false" return 'FALSE';


"(" return 'OPEN_PARENTHESIS';
")" return 'CLOSE_PARENTHESIS';
"[" return 'OPEN_BRACKET';
"]" return 'CLOSE_BRACKET';
"{" return 'OPEN_CURLY';
"}" return 'CLOSE_CURLY';
";" return 'COLON';
":" return 'SEMI_COLON';
"," return 'COMA';



"public" return 'PUBLIC';
"private" return 'PRIVATE';


"intinput" return 'INTINPUT';
"floatinput" return 'FLOATINPUT';
"charinput" return 'CHARINPUT';
//Declaraciones
"for" return 'FOR';
"while" return 'WHILE';
"do" return 'DO';
"switch" return 'SWITCH';
"default" return 'DEFAULT';
"if" return 'IF';
"else" return 'ELSE';


"print" return 'PRINT';
"println" return 'PRINTLN';
//Declaraciones de ciclos
"continue" return 'CONTINUE';
"break" return 'BREAK';
"case" return 'CASE';
"class" return 'CLASS';
"this" return 'THIS';


\"[^\"]*\"  { yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
\'[^\']\'   { yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; }


[0-9]+("."[0-9]+)\b return 'DECIMAL';
[0-9]+\b return 'ENTERO';
[aA-zZ|"_"|"$"]([aA-zZ]|[0-9]|"_"|"$")* return 'IDENTIFICADOR';
"." return 'DOT';

<<EOF>> return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }

/lex
%{

%}

    %left 'SUMA' 'RESTA'
    %left 'POR' 'DIV' 'MOD'
    %left 'POW'
    %left 'MAYOR_IGUAL' 'MENOR_IGUAL' 'DIFERENTE' 'IGUAL_IGUAL' 'MAYOR' 'MENOR' 'IGUAL'
    %left 'OPEN_PARENTHESIS' 'CLOSE_PARENTHESIS'
    %left 'OR'
    %left 'AND'
    %left 'NOT'

%start ini

%% 
/*Definicion de la gramatica*/

ini 
    : class_stmt ini
        |EOF
        ;

concatenate_values
        :valor concatenate_values_re
        ;

concatenate_values_re
        :COMA valor concatenate_values_re
        |CLOSE_PARENTHESIS
        ;

print
        :PRINT
        |PRINTLN
        ;

print_stmt
        :print OPEN_PARENTHESIS concatenate_values
        ;


identifier
        : PUBLIC
        | PRIVATE
        ;
data_type
        : INT
        | STRING
        | CHAR
        | BOOLEAN
        | FLOAT
        ;

data_type_func
        :INT
        |STRING
        |CHAR
        |BOOLEAN
        |FLOAT
        |VOID
        ;

entry_stmt
    : INTINPUT
    | FLOATINPUT
    | CHARINPUT
    ;

this_stmt
    : THIS DOT IDENTIFICADOR
    | IDENTIFICADOR
    ;

class_stmt
        : PUBLIC CLASS IDENTIFICADOR OPEN_CURLY class_instructions 
        | error CLASS IDENTIFICADOR OPEN_CURLY class_instructions
        | PUBLIC error IDENTIFICADOR OPEN_CURLY class_instructions 
        | PUBLIC CLASS error OPEN_CURLY class_instructions 
        | PUBLIC CLASS IDENTIFICADOR error class_instructions 
        ;

class_instructions
        : class_instruction class_instructions
        | CLOSE_CURLY
        | error
        ;

function_parameters
        : data_type IDENTIFICADOR function_parameters_re
        | CLOSE_PARENTHESIS
        ;

function_parameters_re
        : COMA data_type IDENTIFICADOR function_parameters_re
        | CLOSE_PARENTHESIS
        ;

function_stmt
        : identifier data_type_func IDENTIFICADOR OPEN_PARENTHESIS function_parameters OPEN_CURLY instructions
        ;

variable_stmt
        : identifier data_type nombre_variables
        ;

class_instruction
        : function_stmt
        | variable_stmt
        ;

instructions 
        : instruction instructions
        | CLOSE_CURLY
        ;

instruction
        : variable
        | if_stmt
        | switch_stmt
        | for_stmt
        | while_stmt
        | do_stmt
        | metodo COLON
        | print_stmt COLON
        | CONTINUE COLON
        | BREAK COLON
        | error
        ;

stmt_enclusure
    : OPEN_CURLY instructions
    | instruction
    ;
/*Variable*/
increm
    : INCREMENTO
    | DECREMENTO
    ;

valor_variable
    :condition
    |entry_stmt
    ;

igualacion_re
    : IGUAL valor_variable igualacion_re
    | /*empty*/
    ;

asignacion_variable
    :IGUAL valor_variable igualacion_re
    | /*empty*/
    ;

asignacion
    : IGUAL valor_variable igualacion_re
    | increm 
    | /*empty*/
    ;

asignacion_post
    : IGUAL valor_variable igualacion_re
    | increm 
    ;

nombre_variables
    : this_stmt asignacion_variable nombre_variables_re
    ;

nombre_variables_re
    : COMA this_stmt asignacion_variable nombre_variables_re
    | COLON
    ;

variable
    : data_type nombre_variables 
    | this_stmt asignacion_post COLON
    ;
/*End of Variable*/
/*INIT of metodo*/
parameters
    : condition parameters_re
    |CLOSE_PARENTHESIS 
    ;

parameters_re
    : COMA condition parameters_re
    | CLOSE_PARENTHESIS 
    ;

condition
    : condition AND condition
    | condition OR condition
    | NOT condition
    | OPEN_PARENTHESIS condition CLOSE_PARENTHESIS
    | comparation
    ;

comparation
    : comparation MENOR comparation
    | comparation MENOR_IGUAL comparation
    | comparation MAYOR comparation
    | comparation MAYOR_IGUAL comparation
    | comparation DIFERENTE comparation
    | comparation IGUAL_IGUAL comparation
    | OPEN_PARENTHESIS comparation CLOSE_PARENTHESIS
    | valor
    ;

accion_increm
    : INCREMENTO
    | DECREMENTO
    ;

valor
    :ENTERO
    |DECIMAL
    |RESTA ENTERO
    |RESTA DECIMAL
    |this_stmt accion_increm
    |this_stmt
    |CADENA
    |CARACTER
    |TRUE
    |FALSE
    |metodo
    |valor SUMA valor
    |valor RESTA valor
    |valor POR valor
    |valor DIV valor
    |valor MOD valor
    |valor POW valor
    |OPEN_PARENTHESIS valor CLOSE_PARENTHESIS
    ;

metodo
    : IDENTIFICADOR OPEN_PARENTHESIS parameters 
    ;
/*End of Metodo*/
/*Init IF*/
block_condition
    : condition CLOSE_PARENTHESIS
    ;

if_stmt
    : block_if block_elseif block_else
    ;

block_if
    : IF OPEN_PARENTHESIS block_condition stmt_enclusure
    ;

elseif_stmt
    : ELSE IF OPEN_PARENTHESIS block_condition stmt_enclusure
    ;

block_elseif
    :  elseif_stmt block_elseif
    |  block_else
    ;

else_stmt
    : ELSE stmt_enclusure
    ;

block_else
    : else_stmt
    | /*empty*/
    ;
/*End of IF*/
/*Init of Switch*/

switch_instructions 
        : switch_instruction switch_instructions
        | BREAK COLON
        ;

default_instructions
        : switch_instruction default_instructions
        | CLOSE_CURLY
        ;

switch_instruction
        : variable
        | if_stmt
        | switch_stmt
        | for_stmt
        | while_stmt
        | do_stmt
        | metodo COLON
        |print_stmt COLON
        | CONTINUE COLON
        |error
        ;

switch_stmt
    : SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases_stmt
    ;

cases_stmt
    : CASE valor SEMI_COLON switch_instructions cases_stmt
    | DEFAULT SEMI_COLON default_instructions
    | CLOSE_CURLY
    ;
/*End of Switch*/
/*Init For*/

declaraciones_re
    : COMA this_stmt  asignacion declaraciones_re
    | COMA metodo declaraciones_re
    | COMA print_stmt
    | COLON
    ;

declaraciones
    : this_stmt asignacion declaraciones_re
    ;

declaraciones_post
    : declaraciones
    | metodo declaraciones_re
    ;

declaracion_for
    : data_type declaraciones
    | declaraciones_post
    ;
for_accion
    : declaracion_post 
    ;

for_stmt
    : FOR OPEN_PARENTHESIS for_inicio stmt_enclusure
    ;

for_inicio
    : declaracion_for for_condition
    ;

for_condition
    : condition COLON for_asignacion
    ;

for_asignacion
    : for_accion CLOSE_PARENTHESIS 
    ;

for_accion
    : data_type nombre_variables
    | IDENTIFICADOR asignacion_post 
    ;

/*End of For*/
/*Init of While*/

while_stmt
    : WHILE OPEN_PARENTHESIS block_condition stmt_enclusure
    ;
/*End of While*/

/*Init of DoWhile*/

do_stmt
    : DO stmt_enclusure while_do
    ;

while_do
    : WHILE OPEN_PARENTHESIS block_condition COLON
    ;

/*End of DoWhile*/
