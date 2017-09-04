// Application module


$(document).on('click', function (event) {
    var target = $(event.target);

    if (target.attr('id') !== 'feedback' && target.attr('id') !== "circle" && target.attr('id') !== "detail_link" && target.attr('class') != 'btn') {
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

    $scope.sortType = 'name'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order

    $scope.defineImage = function defineImage(name, id) {
        var img = new Image();
        var newstr = "" + name;
        newstr = newstr.replace(/ /g, '');
        var url = "images/" + newstr + ".png";
        $.get(url)
            .done(function () {
                $('#img_' + id).attr('src', url);
                $('#img_' + id).attr('alt', 'logo ' + newstr);
            }).fail(function () {
            $('#img_' + id).attr('src', url);
            $('#img_' + id).css('display', 'none');
        })
    }

});
//TechnologieDetails
crudApp.controller("DetailController", function ($scope, $http, $routeParams) {
    console.log($routeParams.param)

    var config = {
        params: {tech: $routeParams.param},
        headers: {'Accept': 'application/json'}
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
        headers: {'Accept': 'application/json'}
    };

    $http.get('DatabaseFiles/getBeziehung.php', config)
        .then(function (info) {
            $scope.beziehung = info;
        });

    //ToDo: Daraus Service machen
    $scope.defineImage = function defineImage(name, id) {
        var img = new Image();
        var newstr = "" + name;
        newstr = newstr.replace(/ /g, '');
        var url = "images/" + newstr + ".png";
        img.onerror = img.onabort = function () {
            $('#img_' + id).attr('src', url);
            $('#img_' + id).css('display', 'none');
        };
        img.onload = function () {
            $('#img_' + id).attr('src', url);
            $('#img_' + id).attr('alt', 'logo ' + newstr);
        };
        img.src = url;
    }
});
crudApp.controller('VisuController', function ($scope, $http, $routeParams, $sce) {


    var abhängigkeitsstufen = 2;
    var width = $(".container").width(),
        height = 450;
    var force = d3.layout.force()
        .size([width, height])
        .linkDistance(160) //Länge der Links
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
        marker = marker.data(["Direktionale", "Feature-Direktionale", "Austauschbare-Direktionale", "Erweiterung", "basedOn", "notCompatible"]);
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
                return "node " + d.group + " " + d.cat + " " + d.type;
            })
            .on("click", function (d) {
                $('#feedback').remove();

                var adress = window.location.pathname + window.location.search + "#/techdetails/" + d.id + "/" + d.name;
                $("#pop").css('display', 'block');
                $("#pop").append('<div id="feedback" style="top: ' + d.py + '; left: ' + d.px + '");"> Name: ' + d.name + '</br> Art: ' + d.type +
                    '<a class="btn" id="test" href="' + adress + '" go-click="/techdetails/' + d.id + '/' + d.name + '" title="Edit" data-target="#techdetails">Details ansehen</a>');

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
        headers: {'Accept': 'application/json'}
    };

    $http.get('DatabaseFiles/getTech.php', config)
        .then(function (info) {
            $scope.base = info;
            nodes[$routeParams.param].cat = info.data.tech_cat;
            nodes[$routeParams.param].type = "";
        });


    nodes[$routeParams.param] = (
    {name: $routeParams.param, id: $routeParams.techid, cat: "tec", group: "g1", type: "tec"}
    );
    var count = 0;
    //die ersten Abhängigkeiten für diese Technolgie
    getData($routeParams.techid, 0).then(function (response) {
    }, function (Error) {
        console.log(Error);
    });

    function makeDiv(d) {
        $scope.d = d;
        console.log(d);

    }

    function getData(id, old) {
        //Abhängigkeiten holen
        return new Promise(function (resolve, reject) {


            var config = {
                params: {techIds: id, wihtout: old},
                headers: {'Accept': 'application/json'}
            };


            $http.get('DatabaseFiles/getRelation.php', config)
                .then(function (info) {

                    if(info.data.length==0){
                        console.log(nodes[$routeParams.param].cat);
                       var cat=nodes[$routeParams.param].cat
                        if(cat.match("Modul")||cat.match("language")||cat.match("library"))  {
                            config = {
                                params: {techIds: $routeParams.techid},
                                headers: {'Accept': 'application/json'}
                            };
                            $http.get('DatabaseFiles/getRelationModul.php', config)
                                .then(function (info) {
                                    var relationen = info;
                                    console.log(info);
                                    //Array für die IDs
                                    if (relationen.data.length != 0) {
                                        //Für Anzahl der Abhängigkeiten durchlaufen
                                        for (var i = 0; i < relationen.data.length; i++) {
                                            nodes[relationen.data[i].tech_name] = (
                                            {
                                                name: relationen.data[i].tech_name,
                                                id: relationen.data[i].tech_id,
                                                cat: relationen.data[i].tech_cat,
                                                group: "g" + (count + 2),
                                                type: relationen.data[i].type
                                            }
                                            );

                                            links.push(
                                                {
                                                    source: nodes[$routeParams.param].name,
                                                    target: relationen.data[i].tech_name,
                                                    type: "Direktionale"
                                                }
                                            );
                                        }
                                        count++;
                                        update(links);
                                    }
                                    else{update(links);}
                                });
                        }
                        else{
                            update(links);
                        }
                    }
                    else{

                        var relationen = info;
                        console.log(info);

                        //Array für die IDs
                        var arrayIDs = "";
                        if (relationen.data.length != 0) {
                            //Für Anzahl der Abhängigkeiten durchlaufen
                            for (var i = 0; i < relationen.data.length; i++) {
                                //Id in Array speichern
                                console.log(relationen.data[i]);
                                if (i == 0) {
                                    arrayIDs = arrayIDs + relationen.data[i].tech_id + " ";
                                }
                                else {
                                    arrayIDs = arrayIDs + ", " + relationen.data[i].tech_id + " ";
                                }


                                nodes[relationen.data[i].tech_name] = (
                                {
                                    name: relationen.data[i].tech_name,
                                    id: relationen.data[i].tech_id,
                                    cat: relationen.data[i].tech_cat,
                                    group: "g" + (count + 2),
                                    type: relationen.data[i].type
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
                            getData(arrayIDs, id);
                        }
                        else {
                            update(links);
                        }
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

    //alle Datenbanken
    $http.get('DatabaseFiles/getDatabaseList.php')
        .then(function (info) {
            $scope.datenbankList = info.data;
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
        function getResult(abfrage) {


            $scope.kriterien = 0;
            var features;
            var features_alt;
            var technologien_alt;
            var languages;
            var neueFeatures = new Array();
            var techFeat = "";
            var techLangs = "";
            var datenbank = "";


            if (abfrage.datenbank != null) {
                $scope.kriterien = $scope.kriterien + 1;
                datenbank = abfrage.datenbank.tech_name;

                var config = {
                    params: {database: datenbank},
                    headers: {'Accept': 'application/json'}
                };

                $http.get('DatabaseFiles/getDatabaseFeatures.php', config)
                    .then(function (info) {
                        console.log(info);
                        var database_features=makeStringFeature(info.data);
                        if(neueFeatures!=0){
                            neueFeatures=neueFeatures+database_features;}
                        else{
                            neueFeatures=database_features;
                        }
                        if(techFeat!=0){
                            techFeat=techFeat+database_features;
                        }
                        else{
                            techFeat=techFeat+database_features;
                        }
                    });
            }

            else {
                datenbank = 0;
            }


            if (abfrage.techs != null) {
                $scope.kriterien = $scope.kriterien + abfrage.techs.length;
                technologien_alt = makeStringName(abfrage.techs);
                techFeat = "" + technologien_alt;
                techLangs = "" + technologien_alt;
            }
            else {
                technologien_alt = "abc";
                techFeat = "" + technologien_alt;
                techLangs = "" + technologien_alt;
            }

            if (abfrage.language != null) {
                $scope.kriterien = $scope.kriterien + abfrage.language.length;
                languages = makeStringName(abfrage.language);
                techLangs = techLangs + ";" + languages;
            }
            else {
                techLangs = techLangs + "; ";
                languages = 0;
            }

            if (abfrage.features != null) {
                $scope.kriterien = $scope.kriterien + abfrage.features.length;
                features = makeStringFeature(abfrage.features);
                techFeat = techFeat + ";" + features + ",";
                neueFeatures = makeStringFeature(abfrage.features);

            }
            else {
                techFeat = techFeat + "; ";
                features =0;
                neueFeatures = 0;
            }


            if (abfrage.features_alt != null) {
                $scope.kriterien = $scope.kriterien + abfrage.features_alt.length;
                features_alt = makeStringFeature(abfrage.features_alt);
                techFeat = techFeat + features_alt;
            }
            else {
                features_alt = 'abc';
                techFeat = techFeat + features_alt;
            }



            //Wenn Implementierung
            if (abfrage.projektart == 'new') {

                if(languages!=0){
                    var config = {
                        params: {lang: languages},
                        headers: {'Accept': 'application/json'}
                    };

                    //Sprache
                    $http.get('DatabaseFiles/getLanguage.php', config)
                        .then(function (info) {
                            //Diese Technologie funktioniert
                            console.log(info);
                            getRating(info);
                        });
                }
                if(features!=0){
                    var config = {
                        params: {feature: features},
                        headers: {'Accept': 'application/json'}
                    };

                    //Features
                    $http.get('DatabaseFiles/getFeature.php', config)
                        .then(function (info) {
                            //Oder du nutzt diese Technologien für die jeweiligen Features
                            console.log(info);
                            getRating(info);
                        });
                }

            }

            //Wenn Austausch
            else {
                //Prüfen ob mit den vorhandenen Technologien schon alle Features abgedeckt sind.
                //vorhandene Technologien besitzen alles was man braucht
                //welche sind die neuen Features
                //prüfen ob verwendete Technologien Features hat
                //1. Fall Technologie hat die von zuhasue aus
                //alle neuen Features die in Technologie vorhanden sind
                //alte sind ja irgednwie schon vorhanden


                //alte Technologie
                if (technologien_alt != 'abc') {

                    var config = {
                        params: {tech: technologien_alt},
                        headers: {'Accept': 'application/json'}
                    };

                    $http.get('DatabaseFiles/getOldTechs.php', config)
                        .then(function (info) {
                            console.log(info)
                            getRating(info);
                        });

                    //checke ob alte technologien dieselbe Sprache
                    if (languages != 0) {

                        config = {
                            params: {lang: techLangs},
                            headers: {'Accept': 'application/json'}
                        };

                        $http.get('DatabaseFiles/getLanguageOfTechs.php', config)
                            .then(function (info) {
                                //Diese Technologie funktioniert
                                getRating(info);
                            });
                    }
                }




                if (features_alt != 'abc' || neueFeatures != 0 || datenbank !=0) {
                    config = {
                        params: {feature: techFeat},
                        headers: {'Accept': 'application/json'}
                    };
                    $http.get('DatabaseFiles/getFeaturesOfTechs.php', config)
                        .then(function (info) {

                            if (features_alt != 'abc' && technologien_alt != 'abc') {
                                //alle vorhandenen Features in den benutzen Technologien
                                $scope.vorhandeneFeatures = info.data;
                                //console.log(info);
                                getRating(info);
                            }
                            if (technologien_alt == 'abc' && features_alt != 'abc') {
                                if (neueFeatures != 0) {
                                    neueFeatures = neueFeatures + "," + features_alt;
                                }
                                else {
                                    neueFeatures = features_alt;
                                }

                            }





                            //console.log(neueFeatures);
                            //alle Features die nicht vorhanden sind in der neuen Technologie
                            console.log($scope.vorhandeneFeatures);
                            if (neueFeatures != 0) {

                                for (var i = 0; i < neueFeatures.length; i++) {

                                    //welche Features sind noch übrig? Vergleich vorhandene mit features
                                    if ($scope.vorhandeneFeatures != undefined) {
                                        for (var j = 0; j < $scope.vorhandeneFeatures.length; j++) {
                                            if (neueFeatures.f_name == $scope.vorhandeneFeatures[j].dependsOnName) {
                                                //console.log("gleich");
                                                neueFeatures.splice(i, 1);
                                            }
                                        }
                                    }
                                }
                            }
                            else if (neueFeatures == 0) {
                                if (technologien_alt != 'abc') {
                                    $scope.empfehlung = "Alle benötigten Features sind in den genutzten Technologien vorhanden";
                                }
                            }

                            if (neueFeatures != 0) {
                                //console.log(neueFeatures);
                                //Werden nicht abgedeckt also neue Featurs noch ungedeckt

                                //vorhandene Technologien können ergänzt werden
                                //2. Fall benötigt weitere Technologie dazu (siehe vorhandene Technologie kann ergänzt werden, durch einfache Abhängigkeiten
                                //welche Features können mit den Abhängigkeiten der technologien hinzugefügt werden
                                //neuFeatures, welche nicht in vorhandenen Technologien sind in ergänzenden Technologien suchen
                                //zunächst suchen welche Technologien diese features haben


                                console.log(neueFeatures);

                                config = {
                                    params: {feature: neueFeatures},
                                    headers: {'Accept': 'application/json'}
                                };

                                $http.get('DatabaseFiles/getFeature.php', config)
                                    .then(function (info) {
                                        //Hinzufügen zum ergebnissen und prüfen ob Zusammenhang, dann in Kombination anzeigen
                                        getRating(info);
                                        //checkIfAllFeaturesIn();

                                    });
                            }


                            /*
                             //ToDo:Wenn Kombination nicht in Datenbank, aber auch nicht in Kompatibel
                             /!*
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
                             });*!/
                             });
                             }
                             });
                             //Fall 4,vorhandene Technologien können ausgetauscht werden
                             //Fall 5. vorhandene Technologien müssen ausgetauscht werden*/

                        });
                }

                if (languages != 0) {
                    //Technologien die mit Features verwendet werden können
                    config = {
                        params: {lang: languages},
                        headers: {'Accept': 'application/json'}
                    };
                    //für Languages noch weitere holen
                    $http.get('DatabaseFiles/getLanguage.php', config)
                        .then(function (info) {
                            //Diese Technologie funktioniert
                            getRating(info);
                        });
                }
            }
        }

        //Für NeuImplementation
        function getRating(info) {
            var vorhanden = false;
            for (var i = 0; i < info.data.length; i++) {
                //wenn schon technologien vorhanden
                //alle vorhanden technologien durchgehen
                for (var sol in $scope.ergebnis) {
                    //wenn name gleich
                    if ($scope.ergebnis[sol].name == info.data[i].tech_name && info.data[i].tech_name != undefined) {
                        vorhanden = true;
                        if (!$scope.ergebnis[sol].dependsOn.match(info.data[i].dependsOnName)) {
                            var anzahl = $scope.ergebnis[sol].emp;
                            anzahl++;
                            if($scope.kriterien<=anzahl){
                                $scope.ergebnis[sol].emp = $scope.kriterien;
                            }
                            else{ $scope.ergebnis[sol].emp = anzahl;}

                            $scope.ergebnis[sol].dependsOn = "" + $scope.ergebnis[sol].dependsOn + ", " + info.data[i].dependsOnName;

                        }

                    }
                }
                if (!vorhanden) {
                    //console.log("Name war noch nicht vorhanden, pushe");
                    //console.log(info.data[i].tech_name);

                    if (info.data[i].dependsOnName == undefined) {
                        info.data[i].dependsOnName = 'Verwendet';
                    }

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
            if ($scope.ergebnis.length > 1) {
                for (var i = 0; i < $scope.ergebnis.length; i++) {

                    for (var j = 0; j < $scope.ergebnis.length; j++) {
                        if (i != j) {
                            technologien = "'" + $scope.ergebnis[i].name + "';'" + $scope.ergebnis[j].name + "'"
                            getTechCombination(technologien);
                        }
                    }
                }
            }
        }

        //Alle Kombinations Möglichkeiten für gefundene Ergebnisse
        function getTechCombination(daten) {

            var combination;
            var config = {
                params: {data: daten},
                headers: {'Accept': 'application/json'}
            };

            $http.get('DatabaseFiles/checkIfDepends.php', config)
                .then(function (info) {
                    //Kombination vorhanden
                    if (info.data.length > 0) {
                        daten = daten.replace(/'/g, "");
                        daten = daten.split(";");
                        for (var sol in $scope.ergebnis) {
                            //wenn name gleich
                            var featureCount = false;
                            var combiExist = false;
                            var basedOnLanguage = false;
                            var dependsOnFeature = "";
                            //Objekt aus Ergenis und es ist die Technologie, die eine Abhängigkeit hat ( Angular)
                            if ($scope.ergebnis[sol].name == daten[0]) {
                                //alle Eleemnte aus Ergebnisse
                                //nach daten[1] in ergebnissen suchen
                                for (var ab in $scope.ergebnis) {
                                    //Wenn Element aus Ergebnis gleich Technolgoie die abhängig ist (angulartics)
                                    if ($scope.ergebnis[ab].name == daten[1]) {
                                        //dependson dem Feature
                                        dependsOnFeature = $scope.ergebnis[ab].dependsOn;
                                        featureCount = false;
                                        //Nur auf sprache basiertende Kombis ausschließen
                                        for (var s in $scope.languageList) {
                                            if ($scope.languageList[s].tech_name == dependsOnFeature && dependsOnFeature != undefined) {
                                                console.log("based on Languauge");
                                                basedOnLanguage = true;
                                                if ($scope.ergebnis[ab].name == daten[1]) {
                                                    $scope.ergebnis.splice(ab, 1);
                                                    break;
                                                }
                                            }
                                        }
                                        break;
                                    }
                                }
                                if (basedOnLanguage) {
                                    console.log("break");
                                    break;
                                }
                                else {
                                    //Wenn Element schon kombinationen hat
                                    if ($scope.ergebnis[sol].combinationWith.length > 0) {
                                        console.log("mehrere Kombis");
                                        //Prüfen ob die technologie bereits enthalten
                                        for (var fea in $scope.ergebnis[sol].combinationWith) {
                                            if ($scope.ergebnis[sol].combinationWith[fea].tech == daten[1].dependsOnTechnologie) {
                                                combiExist = true;
                                            }
                                        }

                                        //alle Übereisntimmungen mit Kriterien in den Kombinationen durchgehen
                                        for (var fea in $scope.ergebnis[sol].combinationWith) {
                                            //Wenn Kombintaion noch kein Feature enthält die das dem der kombi gleicht
                                            if ($scope.ergebnis[sol].combinationWith[fea].feature != dependsOnFeature && !combiExist) {

                                                //Und Feature zählt --> nicht doppelt
                                                if (!featureCount) {
                                                    //Dann Empfehlung hochsetzen
                                                    var anzahl = $scope.ergebnis[sol].emp;
                                                    anzahl++;
                                                    if($scope.kriterien<=anzahl){
                                                        $scope.ergebnis[sol].emp = $scope.kriterien;
                                                    }
                                                    else{ $scope.ergebnis[sol].emp = anzahl;}


                                                }
                                                //und feature count gleich true setzen
                                                featureCount = true;
                                            }
                                        }
                                    }
                                    //Noch keine Kombi vorhanden
                                    else {
                                        //emphlung hochsetzen
                                        var anzahl = $scope.ergebnis[sol].emp;
                                        anzahl++;
                                        if($scope.kriterien<=anzahl){
                                            $scope.ergebnis[sol].emp = $scope.kriterien;
                                        }
                                        else{ $scope.ergebnis[sol].emp = anzahl;}

                                    }

                                    if (!combiExist) {
                                        console.log(daten[1]);

                                        if (dependsOnFeature != undefined) {
                                            //Wenn Element aus Ergebnis gleich Technolgoie die abhängig ist (angulartics)
                                            if ($scope.ergebnis[ab].name == daten[1]) {
                                                //Und Technologie und abhängiges featute  pushen
                                                $scope.ergebnis[sol].combinationWith.push({
                                                    tech: daten[1],
                                                    feature: dependsOnFeature
                                                });
                                            }

                                        }
                                    }
                                    console.log("break");
                                    break;
                                }
                            }
                        }
                        //das kombinierte löschen
                        for (var sol in $scope.ergebnis) {
                            if ($scope.ergebnis[sol].name == daten[1]) {
                                $scope.ergebnis.splice(sol, 1);
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
                        $scope.ergebnis[sol].old = "true";
                        vorhanden = true;
                    }
                }
                if (!vorhanden) {
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
            if (daten != null) {
                for (var a = 0; a < daten.length; a++) {
                    if (a == 0) {
                        newString = newString + "'" + daten[a].tech_name + "'";
                    }
                    else {
                        newString = newString + ",'" + daten[a].tech_name + "'";
                    }
                }
            }
            return newString;
        }

        //Aus Array String mit Features
        function makeStringFeature(daten) {
            var newString = "";
            if (daten != null) {
                for (var a = 0; a < daten.length; a++) {
                    if (a == 0) {
                        newString = newString + "'" + daten[a].f_name + "'";
                    }
                    else {
                        newString = newString + ",'" + daten[a].f_name + "'";
                    }
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
            newstr = newstr.replace(/ /g, '');
            var url = "images/" + newstr + ".png";
            img.onerror = img.onabort = function () {
                $('#img_' + id).attr('src', url);
                $('#img_' + id).css('display', 'none');
            };
            img.onload = function () {
                $('#img_' + id).attr('src', url);
                $('#img_' + id).attr('alt', 'logo ' + newstr);
            };
            img.src = url;
        }


        $scope.sortType = 'name'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
    }
);


//prüfen wo sich Array unterscheidet
/*abfrage.features = ($.grep(abfrage.features, function(el) {
 return $.inArray(el, abfrage.features_alt) === -1;
 })).concat($.grep(abfrage.features_alt, function(el) {
 return $.inArray(el, abfrage.features) === -1;
 }));*/
