%{

%}

%lex

%%

\s+     /*Ignorar*/
"["     return 'OPEN_BRACKET';
"]"     return 'CLOSE_BRACKET';
"("     return 'OPEN_PARENTHESIS';
")"     return 'CLOSE_PARENTHESIS';
"{"     return 'OPEN_CURLY';
"}"     return 'CLOSE_CURLY';
";"     return 'COLON';
":"     return 'SEMI_COLON';

//Words
"stack" return 'STACK';
"Heap"  return 'HEAP';

//t
"et"    return 'ET';
"ts"    return "TS";
"t"     return 'T';
"h"     return 'H';
"print" return 'PRINT';
"scan"  return 'SCAN';

//Literales
[aA-zZ|"_"|"$"][aA-zZ|0-9|"_"|"$"]* return 'IDENTIFICADOR';
[0-9]+("."[0-9]+) return 'LIT_DECIMAL';
[0-9]+  return 'LIT_ENTERO';
\"[^\"]*\"  return 'LIT_CADENA'
//Operaciones
";"     return 'COLON';
","     return 'COMA';
"+"     return '+';
"-"     return '-';
"*"     return '*';
"/"     return '/';
"^"     return '^';
"%"     return '%';
"=="    return '==';
"!="    return '!=';
">"     return '>';
"<"     return '<';
">="    return ">=";
"<="    return "<=";

"="     return '=';

<<EOF>  return 'EOF';
.+  {}

%{

%}

%start ini

%%

ini : init_stmt EOF
    ; 

init_stmt
    : function_stmt init_stmt
    | var_stmt init_stmt
    | metodo_stmt init_stmt
    | scan_stmt init_stmt
    | print_stmt inti_stmt
    | etiqueta_stmt init_stmt
    | goto_stmt init_stmt
    ;

print_stmt
    : PRINT OPEN_PARENTHESIS CLOSE_PARENTHESIS COLON
    ;

function_stmt
    : IDENTIFICADOR OPEN_PARENTHESIS CLOSE_PARENTHESIS OPEN_CURLY stmts
    ;   

etiqueta_stmt
    : ET LIT_ENTERO SEMI_COLON
    ;

ides_t
    : T LIT_ENTERO
    | TS LIT_ENTERO
    ;

ides_stack
    : 
    ;

stack_stmt
    : STACK EQUAL 
    |
    ;

stmts
    : var_stmt stmts
    | CLOSE_CURLY
    ;

var_stmt
    : 
    ;


