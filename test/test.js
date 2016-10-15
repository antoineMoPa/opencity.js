var headless = false;

if(typeof window == "undefined"){
    headless = true;
}

if(headless){
    var opencity = require("../opencity.js"); 
}

var fails = 0;

function array_equals(a,b){
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

assert(
    array_equals(
        opencity.parse("").getTokens(),
        []
    ),
    "should tokenize empty string"
);

assert_array_equals(
    opencity.parse(" ").getTokens()[0],
    ["whitespace"," "],
    "should tokenize whitespace"
);

assert_array_equals(
    opencity.parse("\n ").getTokens()[0],
    ["whitespace","\n "],
    "should tokenize whitespace"
);

assert_array_equals(
    opencity.parse("potato").getTokens()[0],
    ["identifier","potato"],
    "should tokenize identifier"
);

assert_array_equals(
    opencity.parse("potato").getTokens()[0],
    ["identifier","potato"],
    "should tokenize identifier"
);

assert_array_equals(
    opencity.parse("123.67").getTokens()[0],
    ["number","123.67"],
    "should tokenize number"
);

assert_array_equals(
    opencity.parse("123.67").getTokens()[0],
    ["number","123.67"],
    "should tokenize floating point number"
);

assert_array_equals(
    opencity.parse("543").getTokens()[0],
    ["number","543"],
    "should tokenize integer number"
);

assert_array_equals(
    opencity.parse(",").getTokens()[0],
    ["comma",","],
    "should tokenize comma"
);

assert_array_equals(
    opencity.parse("(id)").getTokens(),
    [["open_parens","("],
     ["identifier","id"],
     ["close_parens",")"]],
    "should tokenize parens"
);



console.log(fails+" tests failed.");
