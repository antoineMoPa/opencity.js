var headless = false;

if(typeof window == "undefined"){
    headless = true;
}

if(headless){
    var opencity = require("../opencity.js"); 
}

var fails = 0;

function array_equals(a,b){
    if(!Array.isArray(a) || !Array.isArray(b)){
	return false;
    }
    
    if(a.length != b.length){
        return false;
    }
    
    for(var i = 0; i < a.length; i++){
        if(Array.isArray(a[i])){
            if(!Array.isArray(b[i])){
                return false;
            }
            if(!array_equals(a[i], b[i])){
                return false;
            }
        }else if(a[i] != b[i]){
            return false;
        }
    }
    return true;
}

function assert(bool_stmt, msg){
    if(!bool_stmt){
        fails++;
        console.log("failed test: "+msg);
    }
}

function assert_equals(a, b, msg){
    if(a != b){
        fails++;
	console.log(a + " != " + b);
	console.log("failed test: "+msg);
    }
}

function assert_array_equals(a, b, msg){
    if(array_equals(a, b)){
        return true;
    } else {
        fails++;
        console.log("failed test: "+msg);
        console.log("a:",a);
        console.log("b:",b);
    }
}

// Tokenizer tests

assert(
    array_equals(
        opencity.tokenize(""),
        [["eof"]]
    ),
    "should tokenize empty string"
);

assert_array_equals(
    opencity.tokenize(" ")[0],
    ["whitespace"," "],
    "should tokenize whitespace"
);

assert_array_equals(
    opencity.tokenize("\n ")[0],
    ["whitespace","\n "],
    "should tokenize whitespace"
);

assert_array_equals(
    opencity.tokenize("potato")[0],
    ["identifier","potato"],
    "should tokenize identifier"
);

assert_array_equals(
    opencity.tokenize("potato")[0],
    ["identifier","potato"],
    "should tokenize identifier"
);

assert_array_equals(
    opencity.tokenize("123.67")[0],
    ["number","123.67"],
    "should tokenize number"
);

assert_array_equals(
    opencity.tokenize("123.67")[0],
    ["number","123.67"],
    "should tokenize floating point number"
);

assert_array_equals(
    opencity.tokenize("543")[0],
    ["number","543"],
    "should tokenize integer number"
);

assert_array_equals(
    opencity.tokenize(",")[0],
    ["comma",","],
    "should tokenize comma"
);

assert_array_equals(
    opencity.tokenize("(id)"),
    [["open_parens","("],
     ["identifier","id"],
     ["close_parens",")"],
     ["eof"]],
    "should tokenize parens"
);

assert_array_equals(
    opencity.tokenize(" ", false),
    [["eof"]],
    "should not tokenize whitespace when requested not to"
);

// Parser tests

var road_statement =
    "road normal_road:\n"+
    "    buildingedge($1)-sidewalk-parkinglane-bikelane-buslane-carlane-middle-carlane-buslane-buildingedge($2);"+
    "end\n";

var stmts = opencity.parse(road_statement).getStatements();

assert_equals(
    stmts[0].type,
    "road",
    "should parse road statement"
);

assert_equals(
    stmts[0].elements[0].type,
    "buildingedge",
    "should have correct type"
);

assert_equals(
    stmts[0].elements[0].catches.length,
    1,
    "should have correct length"
);

assert_equals(
    stmts[0].catches,
    2,
    "should have correct length"
);

assert_equals(
    stmts[0].elements[0].catches[0],
    "$1",
    "should catch variables"
);

assert_equals(
    stmts[0].elements[9].catches[0],
    "$2",
    "should catch variables"
);

assert_equals(
    stmts[0].elements[1].type,
    "sidewalk",
    "should parse road statement"
);

// Road instantiation

var road_i_statement = road_statement +
    "normal_road(0.0, 0.0, 1.0, 0.0);\n";

var stmts = opencity.parse(road_i_statement).getStatements();

assert_equals(
    stmts[1].type,
    "func_call",
    "should parse function call"
);

assert_equals(
    stmts[1].name,
    "normal_road",
    "should parse function name"
);

assert_equals(
    stmts[1].args.length,
    4,
    "should read the right count of arguments"
);

assert_array_equals(
    stmts[1].args[0],
    ["number","0.0"],
    "should read arguments"
);

var road_i2_statement = road_statement +
    "a, b = normal_road(0.0, 0.0, 1.0, 0.0);\n";

var stmts = opencity.parse(road_i2_statement).getStatements();

assert_equals(
    stmts[1].type,
    "func_call",
    "should parse function call with return assignments"
);

assert_array_equals(
    stmts[1].assigns,
    [["identifier","a"],["identifier","b"]],
    "should know where to store results"
);

console.log(fails+" tests failed.");
