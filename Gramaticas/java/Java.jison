/*Parsea Java*/

%{
    //import
    let ErrorLexico = require('../../../error/LexicalError.js');
    let ErrorSintactico = require('../../../error/SyntaxError.js');
    //Errores
    let erroresLexicos = [];
    let erroresSintacticos = [];

    //Lineas extras
    let lineNumber = 0;
    let columnNumber=0;

    function setLineNumber(line){
        this.lineNumber=line;
    }

    function setColumnNumber(column){
        this.columnNumber=column;
    }

    function getLexicalErrors(){
        return lexicalErrorsArray;
    }

    function addLexicalError(lexema, linea, column){                        
        let errorLexico = new ErrorLexico(lexema, linea, column);
        erroresLexicos.push(errorLexico);
    }

    function addSyntaxError( descripcion, token, linea, columna){
        let newLine = linea + lineNumber;
        let newColumn = columna + columnNumber;
        let errorSintactico = new ErrorSintactico(descripcion, token, newLine, newColumn);
        erroresSintacticos.push(errorSintactico);
    }
%}

%lex
%%


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
\s+                                 /*ignore*/;
"//".*                              /*ignore*/;
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] /*ignore*/;
.+   { addLexicalError(yytext, yylloc.first_line, yylloc.first_column);}					


/lex
%{
    const TIPO_VISIBLIDAD = require('../../../api/Instrucciones').TIPO_VISIBLIDAD;
    const TIPO_LENGUAJE = require('../../../api/Instrucciones').TIPO_LENGUAJE);
    const TIPO_DATO = requie('../../../api/Instrucciones').TIPO_DATO;
    const TIPO_VALOR = require('../../../api/Instrucciones').TIPO_VALOR;
    const TIPO_OPERACION = require('../../../api/Instrucciones').TIPO_OPERACION;
    const TIPO_INSTRUCCION = require('../../../api/Instrucciones').TIPO_INSTRUCCION;
    const TIPO_SWITCH = require('../../../api/Instrucciones').TIPO_SWITCH;
    const instruccionesApi = require('../../../api.InstruccionesApi').instruccionesApi;
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
    
    

%start ini

%% 
/*Definicion de la gramatica*/

ini 
    : class_stmt ini
    | error ini {addSyntaxError("Se espera una clase de java", $1, this._$.first_line, this._$.first_column);}
    | EOF
        ;

concatenate_values
        :expresion concatenate_values_re
        |expresion error {addSyntaxError("Se esperaba mas parametros o \')\'", $2, this._$.first_line, this._$.first_column);}
        ;

concatenate_values_re
        :COMA expresion concatenate_values_re
        |COMA error concatenate_values_re {addSyntaxError("Se esperaba una expresion", $2, this._$.first_line, this._$.first_column);}
        |CLOSE_PARENTHESIS
        ;

print
        :PRINT
        |PRINTLN
        ;

print_stmt
        :print OPEN_PARENTHESIS concatenate_values
        | print error {addSyntaxError("Se esperaba \'(\'", $2, this._$.first_line, this._$.first_column);}
        | print OPEN_PARENTHESIS error {addSyntaxError("Error de parametros, agregar parametros o un cierre \')\'", $2, this._$.first_line, this._$.first_column);}
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
        | DOUBLE
        | VOID
        ;

entry_stmt
    : INTINPUT
    | FLOATINPUT
    | CHARINPUT
    ;

this_stmt
    : THIS DOT IDENTIFICADOR
    | THIS error {addSyntaxError("Agregar \'.\'", $2, this._$.first_line, this._$.first_column);}
    | THIS DOT error {addSyntaxError("Se esperaba un identificador", $3, this._$.first_line, this._$.first_column);}
    | IDENTIFICADOR
    ;

extends_re
    :EXTENDS IDENTIFICADOR
    |EXTENDS error {addSyntaxError("Se esperaba el nombre de otra clase a extender", $2, this._$.first_line, this._$.first_column);}
    | /*empty*/
    ;

class_stmt
        : PUBLIC CLASS IDENTIFICADOR OPEN_CURLY extends_re class_instructions 
        | PUBLIC error  {addSyntaxError("Se esperaba \'class\'", $2, this._$.first_line, this._$.first_column);}
        | PUBLIC CLASS error  {addSyntaxError("Agregar un identificador a la clase", $3, this._$.first_line, this._$.first_column);}
        | PUBLIC CLASS IDENTIFICADOR error {addSyntaxError("Se esperaba {", $4, this._$.first_line, this._$.first_column);}
        ;

class_instructions
        : class_instructions identifier class_instruction
        | class_instructions identifier error {addSyntaxError("No es un miembro, agregar un miembro con modificador \'public\' o \'private\'", $3, this._$.first_line, this._$.first_column);}
        | error {addSyntaxError("Se esperaba \'}\'", $1, this._$.first_line, this._$.first_column);}
        | CLOSE_CURLY 
        ;

function_parameters
        : data_type IDENTIFICADOR function_parameters_re
        | data_type error {addSyntaxError("Agregar un identificador", $2, this._$.first_line, this._$.first_column);}
        | CLOSE_PARENTHESIS
        ;

function_parameters_re
        : function_parameters_re COMA data_type IDENTIFICADOR 
        | function_parameters_re COMA error {addSyntaxError("Se esperaba un tipo mas identificador, ejemplo: \'int x\'", $3, this._$.first_line, this._$.first_column);}
        | function_parameters_re COMA data_type error {addSyntaxError("Agregar un identificador", $4, this._$.first_line, this._$.first_column);}
        | CLOSE_PARENTHESIS
        | error {addSyntaxError("Se esperaba \')\'", $1, this._$.first_line, this._$.first_column);}
        ;

function_stmt
        :  IDENTIFICADOR OPEN_PARENTHESIS function_parameters OPEN_CURLY instructions
        | IDENTIFICADOR error  {addSyntaxError("Se esperaba \'(\'", $2, this._$.first_line, this._$.first_column);}
        | IDENTIFICADOR OPEN_PARENTHESIS error {addSyntaxError("Se esperaba parametros o \')\'", $2, this._$.first_line, this._$.first_column);}
        | IDENTIFICADOR OPEN_PARENTHESIS function_parameters error {addSyntaxError("No es una declaracion", $4, this._$.first_line, this._$.first_column);} 
        ;

variable_stmt
        : IDENTIFICADOR asignacion_variable variable_stmt_re
        ;

variable_stmt_re
        : variable_stmt_re COMA IDENTIFICADOR asignacion_variable
        | variable_stmt_re COMA error {addSyntaxError("Se esperaba un identificador", $3, this._$.first_line, this._$.first_column);}
        | COLON
        ;

class_statements
        : variable_stmt
        | function_stmt
        | error {addSyntaxError("Se esperaba modificadores de la clase, pueden ser public o private", $1, this._$.first_line, this._$.first_column);}
        ;

constructor_class
        : IDENTIFICADOR OPEN_PARENTHESIS function_parameters OPEN_CURLY instructions
        | IDENTIFICADOR error {addSyntaxError("Se esperaba \'(\'", $2, this._$.first_line, this._$.first_column);}
        | IDENTIFICADOR OPEN_PARENTHESIS error {addSyntaxError("Se esperaban parametros o un cierre \')\'", $3, this._$.first_line, this._$.first_column);}
        | IDENTIFICADOR OPEN_PARENTHESIS function_parameters error {addSyntaxError("Se esperaba \'}\'", $4, this._$.first_line, this._$.first_column);}
        ;

class_instruction
        : data_type class_statements
        | constructor_class
        ;

instructions 
        : instruction instructions
        | error instructions {addSyntaxError("Se esperaba una declaracion", $1, this._$.first_line, this._$.first_column);}
        | CLOSE_CURLY
        ;

instruction
        : variable
        | if_stmt
        | else_stmt
        | switch_stmt
        | for_stmt
        | while_stmt
        | do_stmt COLON
        | do_stmt error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        | metodo COLON
        | metodo error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        | print_stmt COLON
        | print_stmt error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        | CONTINUE COLON
        | CONTINUE error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        | BREAK COLON
        | BREAK error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        | RETURN COLON
        | RETURN error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        ;

stmt_enclusure
    : OPEN_CURLY instructions
    | instruction
    | error {addSyntaxError("Se esperaba una declaracion o \'{\'", $1, this._$.first_line, this._$.first_column);}
    ;
/*Variable*/
increm
    : INCREMENTO
    | DECREMENTO
    ;

valor_variable
    :expresion
    |entry_stmt
    |error {addSyntaxError("Se esperaba una expresion o valor par asignar", $1, this._$.first_line, this._$.first_column);}
    ;

metodo_asignacion
    :IGUAL
    | O_MAS
    | O_MENOS
    | O_POR
    | O_DIV
    | O_MOD
    | O_POW
    ;

igualacion_re
    : metodo_asignacion valor_variable igualacion_re
    |  /*empty*/
    ;

asignacion_variable
    : metodo_asignacion valor_variable igualacion_re
    |  /*empty*/
    ;

asignacion
    : metodo_asignacion valor_variable igualacion_re
    | increm 
    |  /*empty*/
    ;

asignacion_post
    : metodo_asignacion valor_variable igualacion_re
    | increm 
    ;

nombre_variables
    : this_stmt asignacion_variable nombre_variables_re
    ;

nombre_variables_re
    : nombre_variables_re COMA this_stmt asignacion_variable 
    | nombre_variables_re COMA error  {addSyntaxError("Se esperaba una variable", $3, this._$.first_line, this._$.first_column);}
    | error {addSyntaxError("Se esperaba \';\'", $1, this._$.first_line, this._$.first_column);}
    | COLON
    ;

variable
    : data_type nombre_variables 
    | data_type error {addSyntaxError("Se esperaba un identificador (variable) ", $2, this._$.first_line, this._$.first_column);}
    | this_stmt asignacion_post COLON
    | this_stmt error  {addSyntaxError("Una asignacion era esperada", $2, this._$.first_line, this._$.first_column);} 
    | this_stmt asignacion_post error {addSyntaxError("Se esperaba \';\'", $3, this._$.first_line, this._$.first_column);}
    ;
/*End of Variable*/
/*INIT of metodo*/
parameters
    : expresion parameters_re
    |error parameters {addSyntaxError("Se esperaba una expresion", $1, this._$.first_line, this._$.first_column);}
    |CLOSE_PARENTHESIS 
    ;

parameters_re
    : COMA expresion parameters_re
    |error parameters_re {addSyntaxError("Se esperaba una expresion", $1, this._$.first_line, this._$.first_column);}
    | CLOSE_PARENTHESIS 
    ;

expresion
    :expresion AND expresion
    |expresion OR expresion
    |NOT expresion 
    |expresion MENOR expresion
    |expresion MENOR_IGUAL expresion
    |expresion MAYOR expresion
    |expresion MAYOR_IGUAL expresion
    |expresion DIFERENTE expresion
    |expresion COMPARACION expresion
    |expresion SUMA expresion
    |expresion RESTA expresion
    |expresion POR expresion
    |expresion DIV expresion
    |expresion MOD expresion
    |expresion POW expresion
    |OPEN_PARENTHESIS expresion CLOSE_PARENTHESIS
    |ENTERO
    |DECIMAL
    |RESTA expresion %prec UMINUS
    |this_stmt accion_increm
    |this_stmt
    |CADENA
    |CARACTER
    |booleanos
    |metodo
    ;

booleanos
    :TRUE
    |FALSE
    ;

accion_increm
    : INCREMENTO
    | DECREMENTO
    ;

metodo
    : IDENTIFICADOR OPEN_PARENTHESIS parameters 
    ;
/*End of Metodo*/
/*Init IF*/
block_condition
    : expresion CLOSE_PARENTHESIS
    | expresion error {addSyntaxError("Se esperaba \')\'", $2, this._$.first_line, this._$.first_column);}
    | error CLOSE_PARENTHESIS {addSyntaxError("Se esperaba una expresion", $1, this._$.first_line, this._$.first_column);}
    ;

if_stmt
    : IF OPEN_PARENTHESIS block_condition stmt_enclusure
    | IF error {addSyntaxError("Se esperaba \'(\'", $2, this._$.first_line, this._$.first_column);}
    | IF OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una condicion", $3, this._$.first_line, this._$.first_column);}
    ;

else_stmt
    : ELSE stmt_enclusure 
    ;

/*End of IF*/
/*Init of Switch*/

switch_instructions 
        : switch_instruction switch_instructions
        | error switch_instructions {addSyntaxError("Se esperaba una declaracion", $1, this._$.first_line, this._$.first_column);}
        | BREAK COLON
        | BREAK error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        ;

default_instructions
        : switch_instruction default_instructions
        | error default_instructions  {addSyntaxError("Se esperaba una declaracion", $1, this._$.first_line, this._$.first_column);}
        | CLOSE_CURLY
        ;

switch_instruction
        : variable
        | if_stmt
        | else_stmt
        | switch_stmt
        | for_stmt
        | while_stmt
        | do_stmt COLON
        | do_stmt error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        | metodo COLON
        | metodo error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        |print_stmt COLON
        | print_stmt error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        | CONTINUE COLON
        | CONTINUE error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        | RETURN COLON
        | RETURN error  {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
        ;

switch_stmt
    : SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases_stmt
    | SWITCH error {addSyntaxError("Se esperaba \'(\'", $2, this._$.first_line, this._$.first_column);}
    | SWITCH OPEN_PARENTHESIS error {addSyntaxError("Se esperaba un identificador", $3, this._$.first_line, this._$.first_column);}
    | SWITCH OPEN_PARENTHESIS IDENTIFICADOR error {addSyntaxError("Se esperaba \')\'", $4, this._$.first_line, this._$.first_column);}
    | SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS error cases_stmt {addSyntaxError("Se esperaba \'{\'", $5, this._$.first_line, this._$.first_column);} 
    ;

cases_stmt
    : CASE expresion SEMI_COLON switch_instructions cases_stmt
    | CASE error {addSyntaxError("Se esperaba una expresion", $2, this._$.first_line, this._$.first_column);}
    | CASE expresion error  {addSyntaxError("Se esperaba \':\'", $3, this._$.first_line, this._$.first_column);}
    | DEFAULT SEMI_COLON default_instructions 
    | DEFAULT error {addSyntaxError("Se esperaba \':\'", $2, this._$.first_line, this._$.first_column);}
    | error cases_stmt {addSyntaxError("Se esperaba un caso o \'}\'", $1, this._$.first_line, this._$.first_column);}
    | CLOSE_CURLY
    ;
/*End of Switch*/
/*Init For*/

declaraciones_re
    : COMA this_stmt  asignacion declaraciones_re
    | COMA metodo declaraciones_re
    | COMA print_stmt
    | COMA error {addSyntaxError("Se eperaba una declaracion", $2, this._$.first_line, this._$.first_column);} 
    | COMA this_stm error {addSyntaxError("Se espera una asignacion", $3, this._$.first_line, this._$.first_column);}
    | error  {addSyntaxError("Se esperaba \';\' u otra declaracion", $1, this._$.first_line, this._$.first_column);}
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
    : declaraciones_post 
    ;

for_stmt
    : FOR OPEN_PARENTHESIS for_inicio stmt_enclusure
    | FOR error {addSyntaxError("Se esperaba \'(\'", $2, this._$.first_line, this._$.first_column);}
    | FOR OPEN_PARENTHESIS error {addSyntaxError("No se reconocieron los parametros de for", $3, this._$.first_line, this._$.first_column);}
    ;

for_inicio
    : declaracion_for for_condition
    | declaracion_for error {addSyntaxError("Una condicion era esperada", $2, this._$.first_line, this._$.first_column);}
    ;

for_condition
    : expresion COLON for_asignacion
    | expresion error {addSyntaxError("Se esperaba \';\'", $2, this._$.first_line, this._$.first_column);}
    | expresion COLON error {addSyntaxError("Se esperaba una accion del for", $3, this._$.first_line, this._$.first_column);}
    ;

for_asignacion
    : for_accion CLOSE_PARENTHESIS 
    | for_accion error {addSyntaxError("Se esperaba \'(\'", $2, this._$.first_line, this._$.first_column);}
    ;


/*End of For*/
/*Init of While*/

while_stmt
    : WHILE OPEN_PARENTHESIS block_condition stmt_enclusure
    |WHILE error block_condition stmt_enclusure {addSyntaxError("Se esperaba \'(\'", $2, this._$.first_line, this._$.first_column);}
    | WHILE OPEN_PARENTHESIS error stmt_enclusure {addSyntaxError("Se esperaba una condicion", $3, this._$.first_line, this._$.first_column);}
    ;
/*End of While*/

/*Init of DoWhile*/

do_stmt
    : DO stmt_enclusure while_do
    | DO stmt_enclusure error {addSyntaxError("Agregar un while", $3, this._$.first_line, this._$.first_column);}
    ;

while_do
    : WHILE OPEN_PARENTHESIS block_condition 
    | WHILE error {addSyntaxError("Se esperaba \'(\'", $2, this._$.first_line, this._$.first_column);}
    | WHILE OPEN_PARENTHESIS error {addSyntaxError("Se esperaba una condicion", $3, this._$.first_line, this._$.first_column);}

    ;

/*End of DoWhile*/
