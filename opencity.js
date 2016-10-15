var opencity = {};

opencity.tokens = [
    [/^[\s\t \n]+/,"whitespace"],
    [/^road/,"road"],
    [/^block/,"block"],
    [/^end/,"end"],
    [/^busstop/,"busstop"],
    [/^sidewalk/,"sidewalk"],
    [/^parkinglane/,"parkinglane"],
    [/^bikelane/,"bikelane"],
    [/^buslane/,"buslane"],
    [/^middle/,"middle"],
    [/^carlane/,"carlane"],
    [/^buslane/,"buslane"],
    [/^buildingedge/,"buildingedge"],
    [/^buildings/,"buildings"],
    [/^roundabout/,"roundabout"],
    [/^[a-zA-Z\_]+/,"identifier"],
    [/^:/,"semicolon"],
    [/^\(/,"open_parens"],
    [/^\)/,"close_parens"],
    [/^[0-9]+\.[0-9]+/,"number"],
    [/^[0-9]+/,"number"],
    [/^\,/,"comma"],
    [/^;/,"end_statement"],
];

opencity.tokenize = function(str){
    var toks = [];
    var l = str.length;
    var remaining = str;
    var tokens = opencity.tokens;
    var max_its = 3000;
    var its = 0;

    while(remaining.length > 0){
        var match = false;
        for(var it = 0; it < tokens.length; it++){
            var t = tokens[it];

            // Iteration count limiter
            its++;
            if(its > max_its){
                console.log("Max iterations reached");
                return;
            }

            if((m = remaining.match(t[0])) != null){
                toks.push([t[1],m[0]]);
                remaining = remaining.substr(m[0].length, remaining.length);
                match = true;
                break;
            }
        }
        
        if(!match){
            console.log("tokenization error at :'"+remaining.substr(0,15)+"[...]'");
            return toks;
        }

    }

    return toks;
};

opencity.parse = function(str){
    var toks = opencity.tokenize(str);

    return {
        getTokens: function(){
            return toks;
        }
    }
};

if(typeof module != "undefined"){
    module.exports = opencity;
}


