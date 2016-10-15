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
        if(a[i] != b[i]){
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
    "should parse empty string"
);

assert_array_equals(
    opencity.parse(" ").getTokens()[0],
    ["whitespace"," "],
    "should parse whitespace"
);

assert_array_equals(
    opencity.parse("\n ").getTokens()[0],
    ["whitespace","\n "],
    "should parseo whitespace"
);


console.log(fails+" tests failed.");
