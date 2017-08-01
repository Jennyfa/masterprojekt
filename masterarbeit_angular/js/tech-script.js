// Application module
'use strict';

var crudApp = angular.module('crudApp', ['ngRoute']);

//Routing
crudApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {templateUrl: 'templates/start.html'})
        .when('/tech', {
            templateUrl: 'templates/tech.html',
            controller: 'DbController'
        })
        .when('/techdetails/:techid/:param', {
            templateUrl: 'templates/tech.details.html',
            controller: 'detailController'
        })
        .when('/tool', {
            templateUrl: 'templates/tool.html',
            controller: 'toolController'
        })
        .otherwise({
            redirectTo: '/'
        })
}]);
crudApp.directive('goClick', function ($location) {
    return function (scope, element, attrs) {
        var path;

        attrs.$observe('goClick', function (val) {
            path = val;
        });

        element.bind('click', function () {
            scope.$apply(function () {
                $location.path(path);
            });
        });
    };
});

//Technologien
crudApp.controller("DbController", function ($scope, $http) {

    //Get all Technologies
    $http.post('databaseFiles/empDetails.php')
        .then(function (info) {
            // Stored the returned data into scope
            $scope.all = info;

            console.log(info);
            console.log($scope.all);
        });
});

//TechnologieDetails
crudApp.controller("detailController", function ($scope, $http, $routeParams) {
    /*$scope.techdetails = ["Emil", "Tobias", "Linus"];*/
    //console.log($routeParams.param)
    $http.post('databaseFiles/getTech.php', $routeParams.param)
        .then(function (info) {
            $scope.details = info;
            $scope.details.data.links = new Array;
            $scope.details.data.links = $scope.details.data.tech_links.split(";");
            //console.log($scope);

        });

});
crudApp.controller('MainCtrl', function ($scope, $http, $routeParams) {

    var abhängigkeitsstufen = 2;
    var width = $(".container").width(),
        height = 450;
    var force = d3.layout.force()
        .size([width, height])
        .linkDistance(100) //Länge der Links
        .charge(-300)
        .on("tick", tick);
    var svg = d3.select(".graph").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "none");
    var path = svg.append("g").selectAll("path"),
        circle = svg.append("g").selectAll("circle"),
        text = svg.append("g").selectAll("text"),
        marker = svg.append("defs").selectAll("marker"),
        markerg = svg.append("defs").selectAll("markerg");
    var nodes = {};

    function update(links) {
        // Compute the distinct nodes from the links.
        links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, type: link.type});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, type: link.type});
        });

        force
            .nodes(d3.values(nodes))
            .links(links)
            .start();

        // -------------------------------

        // Compute the data join. This returns the update selection.
        //Art der abhängigkeit
        //a1=direktionale, a2=austauschbare direktionale , a3= feature-direktiona, a4=optionale
        marker = marker.data(["Direktionale", "Feature-Direktionale", "Austauschbare-Direktionale", "Optionale"]);
        markerg = markerg.data(["g1", "g2", "g3", "g4"]);

        // Remove any outgoing/old markers.
        marker.exit().remove();

        // Compute new attributes for entering and updating markers.
        marker.enter().append("marker")
            .attr("id", function (d) {
                return d;
            })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("line") // use ".append("path") for 'arrows'
            .attr("d", "M0,-5L10,0L0,5");

        // -------------------------------

        // Compute the data join. This returns the update selection.
        path = path.data(force.links());

        // Remove any outgoing/old paths.
        path.exit().remove();

        // Compute new attributes for entering and updating paths.
        path.enter().append("path")
            .attr("class", function (d) {
                return "link " + d.type;
            })
            .attr("marker-end", function (d) {
                return "url(#" + d.type + ")";
            });

        // -------------------------------

        // Compute the data join. This returns the update selection.
        circle = circle.data(force.nodes());

        // Add any incoming circles.
        circle.enter().append("circle");

        // Remove any outgoing/old circles.
        circle.exit().remove();

        // Compute new attributes for entering and updating circles.
        circle
            .attr("r", 6)
            .call(force.drag)
            .attr("class", function (d) {
                return "node " + d.group;
            })
            .on("click", function (d) {
                console.log(d3.select(this).data().map(function (d) {
                    return d.name;
                }));
            });

        // -------------------------------

        // Compute the data join. This returns the update selection.
        text = text.data(force.nodes());

        // Add any incoming texts.
        text.enter().append("text");

        // Remove any outgoing/old texts.
        text.exit().remove();

        // Compute new attributes for entering and updating texts.
        text
            .attr("x", 8)
            .attr("y", ".31em")
            .text(function (d) {
                return d.name;
            });
    }

    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
        path.attr("d", linkArc);
        circle.attr("transform", transform);
        text.attr("transform", transform);
    }

    function linkArc(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }

    var nodes = [];
    var links = [];
    //Die ausgesucht Technologie
    nodes[$routeParams.param] = (
        {name: $routeParams.param, id: $routeParams.techid, cat: "framework", group: "g1"}
    );
    var count = 0;
    //die ersten Abhängigkeiten für diese Technolgie
    getData($routeParams.techid).then(function (response) {
    }, function (Error) {
        console.log(Error);
    });
    function getData(id) {
        //Abhängigkeiten holen
        return new Promise(function (resolve, reject) {
            $http.post('databaseFiles/getRelation.php', id)
                .then(function (info) {
                    var relationen = info;
                    console.log(info);

                    //Array für die IDs
                    var arrayIDs = new Array;
                    if (relationen.data.length != 0) {
                        //Für Anzahl der Abhängigkeiten durchlaufen
                        for (var i = 0; i < relationen.data.length; i++) {
                            //Id in Array speichern
                            arrayIDs[i] = relationen.data[i].tech_id;
                            nodes[relationen.data[i].tech_name] = (
                            {
                                name: relationen.data[i].tech_name,
                                id: relationen.data[i].tech_id,
                                cat: "framework",
                                group: "g" + (count + 2),
                            }
                            );
                            var source;
                            var names = new Array;
                            var b = 0;
                            for (var n in nodes) {
                                names[b] = n;
                                b++;
                            }
                            for (var a = 0; a < names.length; a++) {
                                if (nodes[names[a]].id == relationen.data[i].t_id) {
                                    source = nodes[names[a]].name;

                                }
                            }
                            links.push(
                                {
                                    source: source,
                                    target: relationen.data[i].tech_name,
                                    type: relationen.data[i].ab_type
                                }
                            );
                        }

                        count++;
                        getData(arrayIDs);
                    }
                    else {
                        update(links);
                    }
                });
            resolve(links);
            reject(Error('Image didn\'t load successfully; error code:'));
        });
    }
});



//Tool
crudApp.controller("toolController", function ($scope, $http){

    $http.post('databaseFiles/getFeatureList.php')
        .then(function (info) {
          $scope.featureList=info.data;
            console.log($scope.featureList);
        });

    $http.post('databaseFiles/getLanguageList.php')
        .then(function (info) {
          $scope.languageList=info.data;
            console.log($scope.languageList);
        });

    //Anfrage initalisieren
    $scope.anfrage="";
    $scope.kriterien=0;

    //Ergebnis erst eziegen wenn Submit & vorher formular anzeigen
    $('#ergebnis').css('display', 'none');
    $('#empForm').css('display', 'block');

    //6. create resetForm() function. This will be called on Reset button click.
    $scope.resetForm = function () {//ToDo: Reset
        };
    //Wenn Projektart Neu, alte Technologien nicht anzeigen
    $('input[name="projektart"]').change(function () {
        var name = $(this).val();
        if(name==="new"){$('#technologien').css('display', 'none');}
        else{$('#technologien').css('display', 'block');}
    });

    //Ergebnis anzeigen
    $scope.pressEmpf = function (myE) {

        $scope.anfrage=myE;
        //Get all Technologies
        $scope.ergebnis = [];

        getResult($scope.anfrage);
        console.log($scope.ergebnis);
        //Formular nicht mehr anzeigen
        $('#empForm').css('display', 'none');
        //Ergebnis anzeigen
        $('#ergebnis').slideUp();
        $('#ergebnis').slideToggle();



        //Technologien nach Sprache durchsuchen
        //Technologien nach den Technologien durchsuchen
        //derzeitiges Framework nicht mitanzeigen
        //empfehlungsreihenfolge naach übereinstimmung der Kirertien
        //Wenn keine übereinstimmung keine Anzeige der technologie
    }
    function getResult(abfrage){
        var languages=[];
        var features=[];
        for(var a=0; a < abfrage.language.length; a++){
            languages[a]=abfrage.language[a];

        }
        for(var a=0; a < abfrage.features.length; a++){
            features[a]=abfrage.features[a];

        }
        console.log(language);

        //ToDo: Binding Languages
        $scope.kriterien=$scope.kriterien+abfrage.language.length+abfrage.features.length;
        //+abfrage.techs.length;
        //Sprache
        $http.post('databaseFiles/getLanguage.php', language)
            .then(function (info) {
              console.log(info);
                getRating(info);
                console.log( $scope.ergebnis);

            });

        //Sprache
        $http.post('databaseFiles/getFeature.php', features)
            .then(function (info) {
                getRating(info);
                console.log( $scope.ergebnis);


            });


    }
    function getRating(info){
        for(var i=0; i < info.data.length; i++){
            var count=0;
            for(var c in $scope.ergebnis){
                count++;
            }
            //wenn schon tehcnologien vorhanden
            if(count!=0){
                //alle vorhanden technologien durchgehen
                for(var sol in $scope.ergebnis){
                    //wenn name gleich
                    if($scope.ergebnis[sol].name==info.data[i].tech_name){
                        var anzahl= $scope.ergebnis[sol].emp;
                        anzahl++;
                        $scope.ergebnis[sol].emp=anzahl;
                        $scope.ergebnis[sol].dependsOn= "" + $scope.ergebnis[sol].dependsOn +", " +  info.data[i].dependsOnName;
                    }
                    else{
                        $scope.ergebnis.push(
                            {
                                name: info.data[i].tech_name,
                                id: info.data[i].tech_id,
                                emp:1,
                                dependsOn: info.data[i].dependsOnName
                            });
                    }
                }
            }
            //wenn noch keine vorhanden
            else{
                $scope.ergebnis.push(
                    {
                        name: info.data[i].tech_name,
                        id: info.data[i].tech_id,
                        emp:1,
                        dependsOn: info.data[i].dependsOnName
                    });
            }
        }
    }
    $scope.stars  = function stars(name,emp){
        console.log("stars");
        //console.log(name);
            var prozent=0;
            prozent=emp/$scope.kriterien;
        var stars = prozent*5;
        $('.'+name).rating('rate',stars);
 /*       prozent=prozent*100;
            console.log(prozent);
            console.log(name);
            $('#'+name).width(prozent+'%');*/

    };


});
