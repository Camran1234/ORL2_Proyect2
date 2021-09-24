/*Parsea Java*/

%lex
%%
/*skip whitespace*/
\s+                                 // se ignoran espacios en blanco
"//".*                              // comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] // comentario multiple líneas

//Paqueteria
"package" return 'PACKAGE'



//Comparaciones
">=" return 'MAYOR_IGUAL'
"<=" return 'MENOR_IGUAL'
"!=" return 'DIFERENTE'
"==" return 'IGUAL_IGUAL'


//Operadores logicos
"&&" return 'AND'
"||" return 'OR'
"!" return 'NOT'

//Asignaciones
"+=" return 'O_MAS'
"-=" return 'O_MENOS'
"/=" return 'O_DIV'
"*=" return 'O_POR'
"%=" return 'O_MOD'
"^=" return 'O_POW'
"&=" return 'O_AND'
"|=" return 'O_OR'
">>=" return 'O_GREATER'
"<<=" return 'O_LESSER'
"=" return 'IGUAL'

//Operadores aritmeticos
"++" return 'INCREMENTO'
"--" return 'DECREMENTO'
"+" return 'SUMA'
"-" return 'RESTA'
"*" return 'POR'
"/" return 'DIV'
"%" return 'MOD'
"^" return 'POW'
"&" return 'AND_OP'
"|" return 'OR_OP'
">>" return 'GREATER_OP'
"<<" return 'LESSER_OP' 
">" return 'MAYOR'
"<" return 'MENOR'

//Tipos de valores
"int" return 'INT'
"float" return 'FLOAT'
"double" return 'DOUBLE'
"boolean" return 'BOOLEAN'
"char" return 'CHAR'
"String" return 'STRING'
"void" return 'VOID'

//Cierres y aperturas
"(" return 'OPEN_PARENTHESIS'
")" return 'CLOSE_PARENTHESIS'
"[" return 'OPEN_BRACKET'
"]" return 'CLOSE_BRACKET'
"{" return 'OPEN_CURLY'
"}" return 'CLOSE_CURLY'
";" return 'COLON'
"," return 'COMA'
"." return 'DOT'

//Tipo de visibilidad
"public" return 'PUBLIC'
"private" return 'PRIVATE'
"default" return 'DEFAULT'

//entradas valores
"intinput" return 'INTINPUT'
"floatinput" return 'FLOATINPUT'
"charinput" return 'CHARINPUT'
//Declaraciones
"for" return 'FOR'
"while" return 'WHILE'
"do" return 'DO'
"switch" return 'SWITCH'
"if" return 'IF'
"else" return 'ELSE'


//FUNCIONES ESPECIALES
    //Imprimir
    "print" return 'PRINT'
    "println" return 'PRINTLN'
    //Declaraciones de ciclos
    "continue" return 'CONTINUE'
    "break" return 'BREAK'

//Cadena y caracter
\"[^\"]*\"  { yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
\'[^\']\'   { yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; }

//Numeros y simbolos
[0-9]+("."[0-9]+)?\b return "DECIMAL"
[0-9]+\b return "ENTERO"
[aA-zZ|"_"|"$"]([aA-zZ]|[0-9]|"_"|"$")* return "IDENTIFICADOR"


<<EOF>> return 'EOF'

/lex
    %left 'SUMA' 'RESTA'
    %left 'POR' 'DIV' 'MOD'
    %left 'POW'
    %left 'OPEN_PARENTHESIS' 'CLOSE_PARENTHESIS'
    %left 'OR'
    %left 'AND'
    %left 'NOT'