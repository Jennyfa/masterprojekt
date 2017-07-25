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
            //console.log($scope.all);
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
            console.log($scope);
            //console.log($scope.details);
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
        console.log("I work for it");
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
        marker = marker.data(["a1", "a2", "a3", "a4"]);
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
          .on("click", function(d)
           {
                   console.log(d3.select(this).data().map(function (d) { return d.name; }));
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

    getData($scope).then(function (response) {
    }, function (Error) {
        console.log(Error);
    });

    function getData($scope) {
        //Abhängigkeiten holen
        return new Promise(function (resolve, reject) {
            $http.post('databaseFiles/getRelation.php', $routeParams.techid)
                .then(function (info) {
                    console.log(info);
                    $scope.relationen = info;
                    nodes[$routeParams.param] = (
                    {name: $routeParams.param, id: $routeParams.techid, cat: "framework", group: "g1"}
                    );
                    //TEchnologie ansich
                    //Abhängigkeiten 1, Stufe zu node hinzufügen
                    for (var i = 0; i < $scope.relationen.data.length; i++) {
                        nodes[$scope.relationen.data[i].tech_name] = (
                        {
                            name: ($scope.relationen.data[i].tech_name).toString(),
                            id: ($scope.relationen.data[i].tech_id).toString(),
                            cat: "framework",
                            group: "g2"
                        }
                        );
                        links.push(
                            {
                                source: $routeParams.param,
                                target: ($scope.relationen.data[i].tech_name).toString(),
                                type: "a" + ($scope.relationen.data[i].ab_type).toString()
                            }
                        );
                    }

                    getOtherNodes(nodes, links, $scope.relationen.data);
                });
            resolve(links);
            reject(Error('Image didn\'t load successfully; error code:'));
        });

    }

    //die bestehenden Nodes auf weitere Abhängigkeiten prüfen
    function getOtherNodes(nodes, links, relationen) {
        if (relationen.length != 0) {
            //wie viele elemente hat technologie[1]

            var arrayIDs=new Array;
            for(var o=0; o< relationen.length; o++){
                arrayIDs[o]=relationen[o].tech_id;
            }

            $http.post('databaseFiles/getRelation.php', arrayIDs)
                .then(function (info) {
                    console.log(info);

                        //wie viele elemente hat die relation von Technologie[1][j]
                        for (var k = 0; k < info.data.length; k++) {
                            nodes[info.data[k].tech_name] = (
                            {
                                name: (info.data[k].tech_name).toString(),
                                id: (info.data[k].tech_id).toString(),
                                cat: "framework",
                                group: "g3"
                            }
                            );


                            links.push(
                                {
                                    source: "testTech5",
                                    target:(info.data[k].tech_name).toString(),
                                type:"a" + (info.data[k].ab_type).toString()
                                });


                        }
                    console.log(links);
                    update(links);
                });

        }
    }


});

//Tool
crudApp.controller("toolController", function ($scope, $http) {


    $scope.pressEmpf = function(myE) {
        console.log("Klick");
        console.log(myE);
    }

});
