var canvas = document.getElementById("test-opencity");

var code = "road normal_road:\n"+
    "    buildingedge($1)-sidewalk-parkinglane-bikelane-buslane-carlane-middle-carlane-buslane-buildingedge($2);"+
    "end\n"+
    "a, b = normal_road(0.0, 0.0, 1.0, 0.0);\n";

opencity.parse(code).eval(canvas);
