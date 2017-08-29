// Application module


$(document).on('click', function (event) {
    var target = $(event.target);

    if (target.attr('id') !== 'feedback' && target.attr('id') !== "circle" && target.attr('id') !== "detail_link" && target.attr('class') !='btn') {
        $('#feedback').remove();
    }
});


'use strict';
//ToDO: in Module aufteilen (https://docs.angularjs.org/guide/module)
//ToDO: Testing & Perfomance test
//ToDO: Bei Features noch zusammenfassen, welche Technologien zusammen verwendet werden können
//ToDO: Warte Symbol


var crudApp = angular.module('crudApp', ['ngRoute', 'ui.bootstrap']);
crudApp.filter('tel', function () {
});
//Routing
crudApp.config(['$routeProvider', function ($routeProvider) {
    //$locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: 'templates/start.html'
        })
        .when('/tech', {
            templateUrl: 'templates/tech.html',
            controller: 'DbController'
        })
        .when('/techdetails/:techid/:param', {
            templateUrl: 'templates/techdetails.html',
            controller: 'DetailController'
        })
        .when('/tool', {
            templateUrl: 'templates/tool.html',
            controller: 'ToolController'
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
    $http.get('DatabaseFiles/empDetails.php')
        .then(function (info) {
            console.log(info);
            // Stored the returned data into scope
            $scope.all = info;
        });

    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order

    $scope.defineImage = function defineImage(name, id) {
        var img = new Image();
        var newstr = "" + name;
        newstr = newstr.replace(" ", "");
        var url = "images/" + newstr + ".png";
        $.get(url)
            .done(function() {
                $('#img_' + id).attr('src', url);
                $('#img_' + id).attr('alt', 'logo ' + newstr);
            }).fail(function() {
                $('#img_' + id).attr('src', "images/undefined.gif");
                $('#img_' + id).css('display', 'none');
        })
    }

});
//TechnologieDetails
crudApp.controller("DetailController", function ($scope, $http, $routeParams) {
    console.log($routeParams.param)

    var config = {
        params: {tech: $routeParams.param},
        headers : {'Accept' : 'application/json'}
    };

    $http.get('DatabaseFiles/getTech.php', config)
        .then(function (info) {
            $scope.details = info;
            console.log(info);
            $scope.details.data.links = new Array;
            $scope.details.data.links = $scope.details.data.tech_links.split("|");
            $scope.details.data.pros = new Array;
            $scope.details.data.pros = $scope.details.data.tech_pro.split("|");
            $scope.details.data.cons = new Array;
            $scope.details.data.cons = $scope.details.data.tech_con.split("|");
        });

    config = {
        params: {tech: $routeParams.techid},
        headers : {'Accept' : 'application/json'}
    };

    $http.get('DatabaseFiles/getBeziehung.php', config)
        .then(function (info) {
            $scope.beziehung = info;
        });

    //ToDo: Daraus Service machen
    $scope.defineImage = function defineImage(name, id) {
        var img = new Image();
        var newstr = "" + name;
        newstr = newstr.replace(" ", "");
        var url = "images/" + newstr + ".png";

        img.onerror = img.onabort = function () {
            $('#img_' + id).attr('src', "images/undefined.gif");
            $('#img_' + id).css('display', 'none');
        };
        img.onload = function () {
            $('#img_' + id).attr('src', url);
            $('#img_' + id).attr('alt', 'logo ' + newstr);
        };
        img.src = url;
    }
});
crudApp.controller('MainController', function ($scope, $http, $routeParams, $sce) {


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
        markerg = svg.append("defs").selectAll("markerg"),
        markercat = svg.append("defs").selectAll("markercat");
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
        marker = marker.data(["Direktionale", "Feature-Direktionale", "Austauschbare-Direktionale", "Optionale", "basedOn", "notCompatible"]);
        markerg = markerg.data(["g1", "g2", "g3", "g4"]);
        markercat = markercat.data(["Framework", "library", "Modul", "language"]);

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
            .attr("id", "circle")
            .call(force.drag)
            .attr("class", function (d) {
                return "node " + d.group + " " + d.cat;
            })
            .on("click", function (d) {
                $('#feedback').remove();
                console.log(d);
                var adress=window.location.pathname+window.location.search+"#/techdetails/"+d.id +"/"+d.name;
                $("#pop").css('display', 'block');
                $("#pop").append('<div id="feedback">' + d.name + '</br>' +
                '<a class="btn" id="test" href="'+adress+'" go-click="/techdetails/'+d.id +'/'+d.name+'" title="Edit" data-target="#techdetails">test</a>');
                  $('#test').click(function () {

                    window.location.href(adress);
                })
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

    var config = {
        params: {tech: $routeParams.param},
        headers : {'Accept' : 'application/json'}
    };

    $http.get('DatabaseFiles/getTech.php', config)
        .then(function (info) {
            $scope.base = info;
            nodes[$routeParams.param].cat = info.data.tech_cat;
        });


    nodes[$routeParams.param] = (
    {name: $routeParams.param, id: $routeParams.techid, cat: "tec", group: "g1"}
    );
    var count = 0;
    //die ersten Abhängigkeiten für diese Technolgie
    getData($routeParams.techid).then(function (response) {
    }, function (Error) {
        console.log(Error);
    });

    function makeDiv(d) {
        $scope.d = d;
        console.log(d);

    }

    function getData(id) {
        //Abhängigkeiten holen
        return new Promise(function (resolve, reject) {

            console.log(id);
            var config = {
                params: {techIds: id},
                headers : {'Accept' : 'application/json'}
            };


            $http.get('DatabaseFiles/getRelation.php', config)
                .then(function (info) {
                    var relationen = info;
                    console.log(info);

                    //Array für die IDs
                    var arrayIDs="";
                    if (relationen.data.length != 0) {
                        //Für Anzahl der Abhängigkeiten durchlaufen
                        for (var i = 0; i < relationen.data.length; i++) {
                            //Id in Array speichern
                            console.log(relationen.data[i]);
                            if(i==0){
                                arrayIDs = arrayIDs + relationen.data[i].tech_id +" ";
                            }
                            else{
                                arrayIDs = arrayIDs + ", " + relationen.data[i].tech_id +" ";
                            }


                            nodes[relationen.data[i].tech_name] = (
                            {
                                name: relationen.data[i].tech_name,
                                id: relationen.data[i].tech_id,
                                cat: relationen.data[i].tech_cat,
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
                                    type: relationen.data[i].type
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
crudApp.controller("ToolController", function ($scope, $http) {



    //alle Features
    $http.get('DatabaseFiles/getFeatureList.php')
        .then(function (info) {
            $scope.featureList = info.data;
        });
    //alle Sprachen
    $http.get('DatabaseFiles/getLanguageList.php')
        .then(function (info) {
            $scope.languageList = info.data;
        });

    //alle Technologien ohne Sprachen
    $http.get('DatabaseFiles/getTechwithoutLangList.php')
        .then(function (info) {
            $scope.techsList = info.data;
        });

    //Anfrage initalisieren
    $scope.anfrage = "";
    $scope.kriterien = 0;

    //Ergebnis erst eziegen wenn Submit & vorher formular anzeigen
    $('#ergebnis').css('display', 'none');
    $('#empForm').css('display', 'block');

    //6. create resetForm() function. This will be called on Reset button click.
    $scope.resetForm = function () {//ToDo: Reset
    };
    //Wenn Projektart Neu, alte Technologien nicht anzeigen
    $('input[name="projektart"]').change(function () {
        var name = $(this).val();
        if (name === "new") {
            $('.abfrage_alt').css('display', 'none');
        }
        else {
            $('.abfrage_alt').css('display', 'block');
        }
    });

    //Ergebnis anzeigen
    $scope.pressEmpf = function (myE) {

        $scope.anfrage = myE;
        //Get all Technologies
        $scope.ergebnis = [];


        getResult($scope.anfrage);
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
    function getResult(abfrage) {


        $scope.kriterien = 0;
        //Wenn Implementierung
        if (abfrage.projektart == 'new') {
            $scope.kriterien = $scope.kriterien + abfrage.language.length + abfrage.features.length;
            var languages = makeStringName(abfrage.language);
            var features = makeStringFeature(abfrage.features);

            var config = {
                params: {lang: languages},
                headers : {'Accept' : 'application/json'}
            };

            //Sprache
            $http.get('DatabaseFiles/getLanguage.php', config)
                .then(function (info) {
                    //Diese Technologie funktioniert
                    console.log(info);
                    getRating(info);
                });

            config = {
                params: {feature: features},
                headers : {'Accept' : 'application/json'}
            };

            //Features
            $http.get('DatabaseFiles/getFeature.php', config)
                .then(function (info) {
                    //Oder du nutzt diese Technologien für die jeweiligen Features
                    console.log(info);
                    getRating(info);
                });
        }

        //Wenn Austausch
        else {
            //Prüfen ob mit den vorhandenen Technologien schon alle Features abgedeckt sind.

            $scope.kriterien = $scope.kriterien + abfrage.language.length + abfrage.features.length
                + abfrage.features_alt.length;


            //vorhandene Technologien besitzen alles was man braucht
            //welche sind die neuen Features
            //prüfen ob verwendete Technologien Features hat
            //1. Fall Technologie hat die von zuhasue aus
            //alle neuen Features die in Technologie vorhanden sind
            //alte sind ja irgednwie schon vorhanden

            var technologien_alt = makeStringName(abfrage.techs);

            var languages = makeStringName(abfrage.language);
            var techLangs = "" + technologien_alt + ";" + languages;

            var config = {
                params: {lang: techLangs},
                headers : {'Accept' : 'application/json'}
            };

            $http.get('DatabaseFiles/getLanguageOfTechs.php',config)
                .then(function (info) {
                    //Diese Technologie funktioniert
                    getRating(info);
                });

            var features = makeStringFeature(abfrage.features);
            var features_alt = makeStringFeature(abfrage.features_alt);
            var techFeat = "" + technologien_alt + ";" + features;
            var neueFeatures = new Array();


            config = {
                params: {feature: techFeat},
                headers : {'Accept' : 'application/json'}
            };

            $http.get('DatabaseFiles/getFeaturesOfTechs.php',config)
                .then(function (info) {
                    //alle vorhandenen Features in den benutzen Technologien
                    $scope.vorhandeneFeatures = info.data;
                    getRating(info);

                    //alle Features die nicht vorhanden sind in der neuen Technologie
                    neueFeatures = abfrage.features;
                    for (var i = 0; i < abfrage.features.length; i++) {
                        //welche Features sind noch übrig? Vergleich vorhandene mit features
                        for (var j = 0; j < $scope.vorhandeneFeatures.length; j++) {
                            if (abfrage.features[i].f_name == $scope.vorhandeneFeatures[j].dependsOnName) {
                                console.log("gleich");
                                neueFeatures.splice(i, 1);
                            }
                        }
                    }
                    console.log(neueFeatures);
                    if (neueFeatures == 0) {

                        $scope.empfehlung="Alle benötigten Features sind in den genutzten Technologien vorhanden"
                    }
                    else {
                        //Werden nicht abgedeckt also neue Featurs noch ungedeckt

                        //vorhandene Technologien können ergänzt werden
                        //2. Fall benötigt weitere Technologie dazu (siehe vorhandene Technologie kann ergänzt werden, durch einfache Abhängigkeiten
                        //welche Features können mit den Abhängigkeiten der technologien hinzugefügt werden
                        //neuFeatures, welche nicht in vorhandenen Technologien sind in ergänzenden Technologien suchen
                        //zunächst suchen welche Technologien diese features haben

                        config = {
                            params: {lang: languages},
                            headers : {'Accept' : 'application/json'}
                        };


                        //für Languages noch weitere holen
                        $http.get('DatabaseFiles/getLanguage.php', config)
                            .then(function (info) {
                                //Diese Technologie funktioniert
                                console.log(info);
                                getRating(info);
                            });

                        var newFeatures = makeStringFeature(neueFeatures);
                        console.log(newFeatures)
                        var techWithThisFeatures;
                        var techWithThisFeaturesWithDependsOnUsedTech;

                        config = {
                            params: {feature: newFeatures},
                            headers : {'Accept' : 'application/json'}
                        };


                        $http.get('DatabaseFiles/getFeature.php', config)
                            .then(function (info) {

                                //Hinzufügen zum ergebnissen und prüfen ob Zusammenhang, dann in Kombination anzeigen
                                getRating(info);
                                //checkIfAllFeaturesIn();
                                console.log($scope.ergebnis);
                                 //ToDo:Wenn Kombination nicht in Datenbank, aber auch nicht in Kompatibel
                                /*
                                 techWithThisFeatures=info.data;
                                 var techsWTF=makeStringName(techWithThisFeatures);
                                 var forquery= ""+technologien_alt+";"+techsWTF;
                                 $http.get('DatabaseFiles/checkIfCompatible.php',checkingValues)
                                 .then(function (info) {
                                 if (info.data.length > 0) {
                                 //Nicht kompatible Technologien
                                 //Nur die anzeigen die kompatibel sind
                                 //Die anderen zu Schritt 4
                                 }
                                 else {
                                 //alle kompatibel
                                 //alle Anzeigen
                                 }
                                 });*/
                            });
                    }
                });
            //Fall 4,vorhandene Technologien können ausgetauscht werden
            //Fall 5. vorhandene Technologien müssen ausgetauscht werden
        }
    }

    //Für NeuImplementation
    function getRating(info) {
        var vorhanden = false;
        for (var i = 0; i < info.data.length; i++) {
            //console.log(i);
            //wenn schon technologien vorhanden
            //alle vorhanden technologien durchgehen
            for (var sol in $scope.ergebnis) {
                //wenn name gleich
                if ($scope.ergebnis[sol].name == info.data[i].tech_name) {
                    vorhanden = true;
                    if (!$scope.ergebnis[sol].dependsOn.match(info.data[i].dependsOnName)) {
                        var anzahl = $scope.ergebnis[sol].emp;
                        anzahl++;
                        $scope.ergebnis[sol].emp = anzahl;
                        $scope.ergebnis[sol].dependsOn = "" + $scope.ergebnis[sol].dependsOn + ", " + info.data[i].dependsOnName;

                    }

                }
            }
            if (!vorhanden) {
                //console.log("Name war noch nicht vorhanden, pushe");
                //console.log(info.data[i].tech_name);
                $scope.ergebnis.push(
                    {
                        name: info.data[i].tech_name,
                        id: info.data[i].tech_id,
                        emp: 1,
                        dependsOn: info.data[i].dependsOnName,
                        combinationWith: []
                    });
            }
            vorhanden = false;
        }

        var technologien = "";
        for (var i = 0; i < $scope.ergebnis.length; i++) {

            for (var j = 0; j < $scope.ergebnis.length; j++) {
                if (i != j) {

                    technologien = "'" + $scope.ergebnis[i].name + "';'" + $scope.ergebnis[j].name + "'"
                    getTechCombination(technologien);
                }
            }
        }
    }

    //Alle Kombinations möglichkeiten für gefundene Ergebnisse
    function getTechCombination(daten) {
        var combination;
        var config = {
            params: {data: daten},
            headers : {'Accept' : 'application/json'}
        };

        $http.get('DatabaseFiles/checkIfDepends.php', config)
            .then(function (info) {
                //Kombination vorhanden
                if (info.data.length > 0) {
                    combination = info.data;
                    daten = daten.replace(/'/g, "");
                    daten = daten.split(";");
                    for (var com in combination) {
                        for (var sol in $scope.ergebnis) {
                            //wenn name gleich
                            var featureCount=false;
                            if ($scope.ergebnis[sol].name == daten[0]) {
                                var dependsOnFeature;
                                for (var ab in $scope.ergebnis) {
                                    if ($scope.ergebnis[ab].name == daten[1]) {
                                        dependsOnFeature = $scope.ergebnis[ab].dependsOn;
                                        featureCount=false;
                                    }
                                }
                                if ($scope.ergebnis[sol].combinationWith.length > 0) {

                                    for (var fea in $scope.ergebnis[sol].combinationWith) {
                                        //console.log($scope.ergebnis[sol].combinationWith[fea].feature);
                                        //console.log(dependsOnFeature);

                                        if ($scope.ergebnis[sol].combinationWith[fea].feature != dependsOnFeature) {

                                            if(!featureCount){
                                                var anzahl = $scope.ergebnis[sol].emp;
                                                anzahl++;
                                                $scope.ergebnis[sol].emp = anzahl;
                                            }
                                            featureCount=true;
                                        }
                                    }
                                }
                                else {
                                    var anzahl = $scope.ergebnis[sol].emp;
                                    anzahl++;
                                    $scope.ergebnis[sol].emp = anzahl;
                                }

                                $scope.ergebnis[sol].combinationWith.push({
                                    tech: combination[com].dependsOnTechnologie,
                                    feature: dependsOnFeature
                                });


                            }
                            if ($scope.ergebnis[sol].name == daten[1]) {
                                $scope.ergebnis.splice(sol, 1);
                            }
                        }
                    }
                }
            });
    }

    function checkIfAllFeaturesIn() {
        var vorhanden = false;
        for (var sol in $scope.ergebnis) {
            for (var techs in $scope.anfrage.techs) {
                if ($scope.anfrage.techs[techs].tech_name == $scope.ergebnis[sol].name) {
                    $scope.ergebnis[sol].old="true";
                    vorhanden = true;
                }
            }
            if (!vorhanden) {
                //Todo: Sollen Technologien für Features nicht angezeiogt werden oder doch?
                console.log("Not useful");
                console.log("kill" + $scope.ergebnis[sol].name);
                //$scope.ergebnis.splice(sol, 1);
            }
            vorhanden = false;
        }
    }


    //Aus Array String mit Technologien
    function makeStringName(daten) {
        var newString = "";
        for (var a = 0; a < daten.length; a++) {
            if (a == 0) {
                newString = newString + "'" + daten[a].tech_name + "'";
            }
            else {
                newString = newString + ",'" + daten[a].tech_name + "'";
            }
        }
        return newString;
    }

    //Aus Array String mit Features
    function makeStringFeature(daten) {
        var newString = "";
        for (var a = 0; a < daten.length; a++) {
            if (a == 0) {
                newString = newString + "'" + daten[a].f_name + "'";
            }
            else {
                newString = newString + ",'" + daten[a].f_name + "'";
            }
        }
        return newString;
    }

    //Rating
    $scope.stars = function stars(name, emp) {
        var prozent = 0;
        prozent = emp / $scope.kriterien;
        var stars = prozent * 5;
        $('.' + name).rating('rate', stars);
        /*       prozent=prozent*100;
         console.log(prozent);
         console.log(name);
         $('#'+name).width(prozent+'%');*/

    };
    //ToDo: Daraus Service machen
    //Bild laden
    $scope.defineImage = function defineImage(name, id) {
        var img = new Image();
        var newstr = "" + name;
        newstr = newstr.replace(" ", "");
        var url = "images/" + newstr + ".png";
        img.onerror = img.onabort = function () {
            $('#img_' + id).attr('src', "images/undefined.gif");
            $('#img_' + id).css('display', 'none');
        };
        img.onload = function () {
            $('#img_' + id).attr('src', url);
            $('#img_' + id).attr('alt', 'logo ' + newstr);
        };
        img.src = url;
    }


    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
});


//prüfen wo sich Array unterscheidet
/*abfrage.features = ($.grep(abfrage.features, function(el) {
 return $.inArray(el, abfrage.features_alt) === -1;
 })).concat($.grep(abfrage.features_alt, function(el) {
 return $.inArray(el, abfrage.features) === -1;
 }));*/
