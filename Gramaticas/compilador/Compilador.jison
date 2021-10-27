%{

%}

%lex

%%

\s+     /*Ignorar*/
"["     return '[';
"]"     return ']';
"("     return '(';
")"     return ')';
"{"     return '{';
"}"     return '}';
";"     return ';';
":"     return ':';

//Words
"stack" return 'STACK';
"Heap"  return 'HEAP';

//t
"et"    return 'ET';
"ts"    return "TS";
"t"     return 'T';
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

<<EOF>  return 'EOF';
.+  {};

%{

%}

%start ini

%%

ini : init_stmt EOF
    ; 