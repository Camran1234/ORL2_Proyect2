/*Parsea Java*/

%{
    let lexicalErrorsArray = [];
    let syntaxErrors = [];
    let estado = false;
    let errorLinea = 0;
    let errorColumna = 0;
    /*let LexicalError = require('../error/LexicalError.js').default;
    let SyntaxError = require('../error/SyntaxError.js').default;*/
    let lexemaError = "";
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
        if(estado){
            /* let errorLexico = new LexicalError(lexema, linea+lineNumber, column+columnNumber);
            lexicalErrorsArray.push(errorLexico);
            lexemaError="";
            errorLinea=0;
            errorColumna=0;*/
            estado=false;
        }
    }

    function addSyntaxError(descripcion, linea, columna){
        /*let errorSintactico = new SyntaxError(descripcion, linea+lineNumber, columna+columnNumber);
        syntaxErrors.push(errorSintactico);*/
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
"==" {return 'IGUAL_IGUAL';}

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
.+   { 
                console.log("ERROR EN "+yytext);
                estado = true;
               
                errorLinea = yylloc.first_line;
                errorColumna = yylloc.first_column;
            }					


/lex
%{
    
%}
    %left 'PUBLIC' 'PRIVATE'
    %left 'OR'
    %left 'AND'    
    %left 'MAYOR_IGUAL' 'MENOR_IGUAL' 'DIFERENTE' 'IGUAL_IGUAL' 'MAYOR' 'MENOR' 'IGUAL'
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
        |EOF
        ;

concatenate_values
        :expresion concatenate_values_re
        ;

concatenate_values_re
        :COMA expresion concatenate_values_re
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
    | THIS error
    | THIS DOT error
    | IDENTIFICADOR
    ;

extends_re
    :EXTENDS IDENTIFICADOR
    |%empty /*empty*/
    ;

class_stmt
        : PUBLIC CLASS IDENTIFICADOR OPEN_CURLY extends_re class_instructions 
        | PUBLIC error  {addSyntaxError("Se esperaba CLASS cerca de "+$2,this._$.first_line,this._$.first_column);}
        | PUBLIC CLASS error  {addSyntaxError("Se esperaba un Identificador",this._$.first_line,this._$.first_column);}
        | PUBLIC CLASS IDENTIFICADOR error  {addSyntaxError("Apertura de declaracion no encontrada se esperaba \'{\' en "+$4,this._$.first_line,this._$.first_column);}
        | error {addSyntaxError("Se esperaba una declaracion de clase en "+$1,this._$.first_line, this._$.first_column);}
        ;

class_instructions
        : class_instructions identifier class_instruction
        | class_instructions identifier error  {addSyntaxError("declaracion esperada en "+$1,this._$.first_line, this._$.first_column);}
        | error {addSyntaxError("declaracion no reconocida, agregar \'}\' en "+$1,this._$.first_line, this._$.first_column);}
        | CLOSE_CURLY 
        ;

function_parameters
        : data_type IDENTIFICADOR function_parameters_re
        | data_type error  {addSyntaxError("Se esperaba un identificador en "+$2,this._$.first_line, this._$.first_column);}
        | CLOSE_PARENTHESIS
        ;

function_parameters_re
        : function_parameters_re COMA data_type IDENTIFICADOR 
        | function_parameters_re COMA error  {addSyntaxError("Se esperaba un tipo de dato: int, char..."+$2,this._$.first_line, this._$.first_column);}
        | function_parameters_re COMA data_type error {addSyntaxError("Se esperaba un identificador en "+$3,this._$.first_line, this._$.first_column);}
        | CLOSE_PARENTHESIS
        | error {addSyntaxError("Se esperaba \',\' o \')\' en "+$1,this._$.first_line, this._$.first_column);}
        ;

function_stmt
        :  IDENTIFICADOR OPEN_PARENTHESIS function_parameters OPEN_CURLY instructions
        | IDENTIFICADOR error  {addSyntaxError("Identificador esperado en "+$1,this._$.first_line, this._$.first_column);}
        | IDENTIFICADOR OPEN_PARENTHESIS error 
        | IDENTIFICADOR OPEN_PARENTHESIS function_parameters error
        ;

variable_stmt
        : IDENTIFICADOR asignacion_variable variable_stmt_re
        ;

variable_stmt_re
        : variable_stmt_re COMA IDENTIFICADOR asignacion_variable
        | variable_stmt_re COMA error
        | COLON
        ;

class_statements
        : variable_stmt
        | function_stmt
        | error
        ;

constructor_class
        : IDENTIFICADOR OPEN_PARENTHESIS function_parameters OPEN_CURLY instructions
        | IDENTIFICADOR error
        | IDENTIFICADOR OPEN_PARENTHESIS error
        | IDENTIFICADOR OPEN_PARENTHESIS function_parameters error 
        ;

class_instruction
        : data_type class_statements
        | constructor_class
        | identifier error {addSyntaxError("Se esperaba un tipo de dato: int, char...",this._$.first_line, this._$.first_column);}
        ;

instructions 
        : instruction instructions
        | error instructions {addSyntaxError("Declaracion no reconocida, agregar declaracion o } en "+$1,this._$.first_line, this._$.first_column);}
        | CLOSE_CURLY
        ;

instruction
        : variable
        | if_stmt
        | else_stmt
        | switch_stmt
        | for_stmt
        | while_stmt
        | do_stmt
        | metodo COLON
        | metodo error {addSyntaxError("Se esperaba ;",this._$.first_line, this._$.first_column);}
        | print_stmt COLON
        | print_stmt error {addSyntaxError("Se esperaba ;",this._$.first_line, this._$.first_column);}
        | CONTINUE COLON
        | CONTINUE error {addSyntaxError("Se esperaba ;",this._$.first_line, this._$.first_column);}
        | BREAK COLON
        | BREAK error {addSyntaxError("Se esperaba ;",this._$.first_line, this._$.first_column);}
        | RETURN COLON
        | RETURN error {addSyntaxError("Se esperaba ;",this._$.first_line, this._$.first_column);}
        ;

stmt_enclusure
    : OPEN_CURLY instructions
    | instruction
    | error {addSyntaxError("Se esperaba una declaraciones o { en"+$1,this._$.first_line, this._$.first_column);}
    ;
/*Variable*/
increm
    : INCREMENTO
    | DECREMENTO
    ;

valor_variable
    :expresion
    |entry_stmt
    |error {addSyntaxError("Se esperaba un valor para asignar en "+$1,this._$.first_line, this._$.first_column);}
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
    | %empty /*empty*/
    ;

asignacion_variable
    : metodo_asignacion valor_variable igualacion_re
    | %empty /*empty*/
    ;

asignacion
    : metodo_asignacion valor_variable igualacion_re
    | increm 
    | %empty /*empty*/
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
    | nombre_variables_re COMA error  {addSyntaxError("Se esperaba un idetificador en "+$1,this._$.first_line, this._$.first_column);}
    | error {addSyntaxError("Se esperaba \',\' o \';\' en "+$1,this._$.first_line, this._$.first_column);}
    | COLON
    ;

variable
    : data_type nombre_variables 
    | data_type error
    | this_stmt asignacion_post COLON
    | this_stmt error   {addSyntaxError("Se esperaba una asignacion en "+$2,this._$.first_line, this._$.first_column);}
    | this_stmt asignacion_post error
    ;
/*End of Variable*/
/*INIT of metodo*/
parameters
    : expresion parameters_re
    |error parameters
    |CLOSE_PARENTHESIS 
    ;

parameters_re
    : COMA expresion parameters_re
    |error parameters_re
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
    |expresion IGUAL_IGUAL expresion
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
    | error CLOSE_PARENTHESIS {addSyntaxError("Se esperaba una condicion en "+$1,this._$.first_line, this._$.first_column);}
    ;

if_stmt
    : IF OPEN_PARENTHESIS block_condition stmt_enclusure
    | IF error stmt_enclusure {addSyntaxError("Se esperaba una condicion en if",this._$.first_line, this._$.first_column);}
    ;

else_stmt
    : ELSE stmt_enclusure 
    ;

/*End of IF*/
/*Init of Switch*/

switch_instructions 
        : switch_instruction switch_instructions
        | error {addSyntaxError("Se esperaba una declaracion o break en "+$1,this._$.first_line, this._$.first_column);}
        | BREAK COLON
        | BREAK error {addSyntaxError("Se esperaba ; en "+$2,this._$.first_line, this._$.first_column);}
        ;

default_instructions
        : switch_instruction default_instructions
        | error default_instructions {addSyntaxError("Se esperaba una declaracion o cierre con } en "+$1,this._$.first_line, this._$.first_column);}
        | CLOSE_CURLY
        ;

switch_instruction
        : variable
        | if_stmt
        | else_stmt
        | switch_stmt
        | for_stmt
        | while_stmt
        | do_stmt
        | metodo COLON
        | metodo error
        |print_stmt COLON
        | print_stmt error
        | CONTINUE COLON
        | CONTINUE error
        | RETURN COLON
        | RETURN error {addSyntaxError("Se esperaba ;",this._$.first_line, this._$.first_column);}
        ;

switch_stmt
    : SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases_stmt
    | SWITCH error IDENTIFICADOR CLOSE_PARENTHESIS OPEN_CURLY cases_stmt {addSyntaxError("Se esperaba ( en switch cerca de "+$2,this._$.first_line, this._$.first_column);}
    | SWITCH OPEN_PARENTHESIS error CLOSE_PARENTHESIS OPEN_CURLY cases_stmt {addSyntaxError("Se esperaba un identificador cerca de "+$3,this._$.first_line, this._$.first_column);}
    | SWITCH OPEN_PARENTHESIS IDENTIFICADOR error OPEN_CURLY cases_stmt {addSyntaxError("Se esperaba \')\' cerca de "+$4,this._$.first_line, this._$.first_column);}
    | SWITCH OPEN_PARENTHESIS IDENTIFICADOR CLOSE_PARENTHESIS error cases_stmt {addSyntaxError("Se esperaba \'{\' cerca de "+$5,this._$.first_line, this._$.first_column);}
    | SWITCH error cases_stmt {addSyntaxError("Se esperaba un identificador en el switch cerca de "+$2,this._$.first_line, this._$.first_column);}
    ;

cases_stmt
    : CASE expresion SEMI_COLON switch_instructions cases_stmt
    | CASE error SEMI_COLON switch_instructions cases_stmt {addSyntaxError("Se esperaba un valor cerca de "+$2,this._$.first_line, this._$.first_column);}
    | CASE expresion error switch_instructions cases_stmt {addSyntaxError("Se esperaba \':\' cerca de "+$3,this._$.first_line, this._$.first_column);}
    | DEFAULT SEMI_COLON default_instructions 
    | DEFAULT error default_instructions {addSyntaxError("Se esperaba \':\' cerca de "+$2,this._$.first_line, this._$.first_column);}
    | error cases_stmt {addSyntaxError("Se esperaba un caso o \'}\' cerca de "+$1,this._$.first_line, this._$.first_column);}
    | CLOSE_CURLY
    ;
/*End of Switch*/
/*Init For*/

declaraciones_re
    : COMA this_stmt  asignacion declaraciones_re
    | COMA metodo declaraciones_re
    | COMA print_stmt
    | COMA error  asignacion declaraciones_re {addSyntaxError("Se esperaba un identificador cerca de "+$2,this._$.first_line, this._$.first_column);}
    | error declaraciones_re {addSyntaxError("Se esperaba una coma o punto y coma cerca de "+$1,this._$.first_line, this._$.first_column);}
    | COLON
    ;

declaraciones
    : this_stmt asignacion declaraciones_re
    ;

declaraciones_post
    : declaraciones
    | metodo declaraciones_re
    | error declaraciones_re {addSyntaxError("Se esperaba una declaracion cerca de "+$1,this._$.first_line, this._$.first_column);}
    ;

declaracion_for
    : data_type declaraciones
    | data_type error COLON {addSyntaxError("Se esperaba una declaracion cerca de "+$2,this._$.first_line, this._$.first_column);}
    | declaraciones_post
    ;
for_accion
    : declaraciones_post 
    ;

for_stmt
    : FOR OPEN_PARENTHESIS for_inicio stmt_enclusure
    | FOR error for_inicio stmt_enclusure {addSyntaxError("Se esperaba ( en "+$2,this._$.first_line, this._$.first_column);}
    ;

for_inicio
    : declaracion_for for_condition
    ;

for_condition
    : expresion COLON for_asignacion
    | error COLON for_asignacion {addSyntaxError("Se esperaba una condicion",this._$.first_line, this._$.first_column);}
    | expresion error for_asignacion {addSyntaxError("Se esperaba \';\' cerca de "+$2,this._$.first_line, this._$.first_column);}
    ;

for_asignacion
    : for_accion CLOSE_PARENTHESIS 
    | error CLOSE_PARENTHESIS {addSyntaxError("Se esperaba una accion cerca de "+$1,this._$.first_line, this._$.first_column);}
    | for_accion error {addSyntaxError("Se esperaba \')\' cerca de "+$2,this._$.first_line, this._$.first_column);}
    ;


/*End of For*/
/*Init of While*/

while_stmt
    : WHILE OPEN_PARENTHESIS block_condition stmt_enclusure
    |WHILE error block_condition stmt_enclusure {addSyntaxError("Se esperaba \'(\' cerca de "+$2,this._$.first_line, this._$.first_column);}
    | WHILE OPEN_PARENTHESIS error stmt_enclusure {addSyntaxError("Se esperaba una condicion cerca de "+$3,this._$.first_line, this._$.first_column);}
    ;
/*End of While*/

/*Init of DoWhile*/

do_stmt
    : DO stmt_enclusure while_do
    ;

while_do
    : WHILE OPEN_PARENTHESIS block_condition COLON
    | error OPEN_PARENTHESIS block_condition COLON {addSyntaxError("Se esperaba un while cerca de "+$1,this._$.first_line, this._$.first_column);}
    | WHILE error block_condition COLON {addSyntaxError("Se esperaba \'(\' cerca de "+$2,this._$.first_line, this._$.first_column);}
    | WHILE OPEN_PARENTHESIS error COLON {addSyntaxError("Se esperaba una condicion cerca de "+$3,this._$.first_line, this._$.first_column);}
    | error COLON {addSyntaxError("Se esperaba un while cerca de "+$1,this._$.first_line, this._$.first_column);}
    ;

/*End of DoWhile*/
