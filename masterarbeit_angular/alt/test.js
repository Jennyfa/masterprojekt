// Application module
'use strict';

var crudApp = angular.module('crudApp', ['ngRoute', 'nvd3']);

//Routing
crudApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {templateUrl: 'templates/start.html'})
        .when('/tech', {
            templateUrl: 'templates/tech.html',
            controller: 'DbController'
        })
        .when('/techdetails/:tech_id/:param', {
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

//Technologien
crudApp.controller("DbController", function ($scope, $http) {

    //Get all Technologies
    $http.post('databaseFiles/empDetails.php')
        .then(function (info) {
            // Stored the returned data into scope
            $scope.all = info;
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
            //console.log($scope.details);
        });

});

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


crudApp.controller('MainCtrl', function ($scope, $http, $routeParams) {

    var technologien = [];
    var nodes = [];
    var links = [];
    console.log($routeParams.tech_id);

    nodes.push({"id": $routeParams.tech_id, "name": $routeParams.param, "group": 1});

    var allrelations;
    var firstrelations;
    var nextrelations;
    var countRelations = 2;


    function getData(id) {
        // Create new promise with the Promise() constructor;
        // This has as its argument a function
        // with two parameters, resolve and reject
        return new Promise(function(resolve, reject) {
            // Standard XHR to load an image
            var request = new XMLHttpRequest();
            request.open('POST', 'databaseFiles/getRelation.php',true);


            // When the request loads, check whether it was successful
            request.onload = function() {
                if (request.status === 200) {
                    // If successful, resolve the promise by passing back the request response
                    resolve(request.response);
                } else {
                    // If it fails, reject the promise with a error message
                    reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
                }
            };
            request.onerror = function() {
                // Also deal with the case when the entire request fails to begin with
                // This is probably a network error, so reject the promise with an appropriate message
                reject(Error('There was a network error.'));
            };
            // Send the request
            request.send(id);
        });
    }

    getData($routeParams.tech_id).then(function(response) {
        // The first runs when the promise resolves, with the request.reponse
        // specified within the resolve() method.
        firstrelations=JSON.parse(response);
        for (var i = 0; i < firstrelations.length; i++) {
            console.log(firstrelations[i]);
            getData(firstrelations[i].tech_id).then(function(response) {
                nextrelations=JSON.parse(response);
                allrelations = firstrelations.concat(nextrelations);
                console.log(allrelations);
            }, function(Error) {
                console.log(Error);
            });
        }


        // The second runs when the promise
        // is rejected, and logs the Error specified with the reject() method.
    }, function(Error) {
        console.log(Error);
    });

    getAllData(id).then(function(response) {
        // The first runs when the promise resolves, with the request.reponse
        // specified within the resolve() method.


        nodes.push({
            "id": $routeParams.tech_id,
            "name": $routeParams.param,
            "group": 1
        });

        for (var j = 0; j < allrelations.length; i++) {

            nodes.push({
                "id": allrelations[j].tech_id,
                "name": allrelations[j].tech_name,
                "group": 2
            });

        }

        console.log(nodes);


        // The second runs when the promise
        // is rejected, and logs the Error specified with the reject() method.
    }, function(Error) {
        console.log(Error);
    });





    /*

     function getRelations(id) {
     var relations;
     $http.post('databaseFiles/getRelation.php', id)
     .then(function (info) {
     relations = info
     console.log(relations)
     return relations;
     })

     }firstrelations = getRelations($routeParams.tech_id);
     console.log(firstrelations);

     for (var i = 0; i < firstrelations.data.length; i++) {
     nextrelations = getRelations(firstrelations.data[i].tech_id);
     }

     var allrelations = firstrelations.concat(nextrelations);

     if(nextrelations)

     if (countRelations == 0) {
     $scope.data = {
     "nodes": nodes,
     "links": links
     }

     var color = d3.scale.category20()
     $scope.options = {
     chart: {
     type: 'forceDirectedGraph',
     height: 450,
     width: $(".container").width(),
     margin: {top: 20, right: 20, bottom: 20, left: 20},
     color: function (d) {
     return color(d.group)
     },
     nodeExtras: function (node) {
     node && node
     .append("text")
     .text(function (d) {
     return d.name
     })
     .style('font-size', '10px');
     }
     }
     };

     }
     */

})
;


/*firstrelations = info


 for (var i = 0; i < firstrelations.data.length; i++) {

 nodes.push({
 "id": firstrelations.data[i].tech_id,
 "name": firstrelations.data[i].tech_name,
 "group": 1
 });
 //source: Das wie viele Element aus den Nodes ist die Quelle
 //Target: Das wie vielte Element aus den Nodes ist das Ziel
 //value: Strichstärke
 links.push({
 "source": 0,
 "target": i + 1,
 "value": 1
 });
 firstrelations = info


 for (var i = 0; i < firstrelations.data.length; i++) {

 nodes.push({
 "id": firstrelations.data[i].tech_id,
 "name": firstrelations.data[i].tech_name,
 "group": 1
 });
 //source: Das wie viele Element aus den Nodes ist die Quelle
 //Target: Das wie vielte Element aus den Nodes ist das Ziel
 //value: Strichstärke
 links.push({
 "source": 0,
 "target": i + 1,
 "value": 1
 });


 //erste Abhängigkeit
 for (var i = 0; i < $scope.relationen.data.length; i++) {

 nodes.push({
 "id": $scope.relationen.data[i].tech_id,
 "name": $scope.relationen.data[i].tech_name,
 "group": 1
 });
 //source: Das wie viele Element aus den Nodes ist die Quelle
 //Target: Das wie vielte Element aus den Nodes ist das Ziel
 //value: Strichstärke
 links.push({
 "source": 0,
 "target": i + 1,
 "value": 1
 });




 }

 var extranodes = getOtherNodes(nodes);
 var extralinks = getOtherLinks(links);

 nodes.push(extranodes);
 console.log(nodes);
 //links.push(extralinks);


 //zweite Abhängigkeit


 var color = d3.scale.category20()
 $scope.options = {
 chart: {
 type: 'forceDirectedGraph',
 height: 450,
 width: $(".container").width(),
 margin: {top: 20, right: 20, bottom: 20, left: 20},
 color: function (d) {
 return color(d.group)
 },
 nodeExtras: function (node) {
 node && node
 .append("text")
 .attr("dx", 8)
 .attr("dy", ".35em")
 .text(function (d) {
 return d.name
 })
 .style('font-size', '10px');
 }
 }
 };

 $scope.data = {
 "nodes": nodes,
 "links": links
 }
 */










// Application module
'use strict';

var crudApp = angular.module('crudApp', ['ngRoute', 'nvd3']);

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

//Technologien
crudApp.controller("DbController", function ($scope, $http) {

    //Get all Technologies
    $http.post('databaseFiles/empDetails.php')
        .then(function (info) {
            // Stored the returned data into scope
            $scope.all = info;
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
            //console.log($scope.details);
        });

});

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


crudApp.controller('MainCtrl', function ($scope, $http, $routeParams) {

    var technologien = [];
    var nodes = [];
    var links = [];


    $http.post('databaseFiles/getRelation.php', $routeParams.techid)
        .then(function (info) {
            $scope.relationen = info;


            nodes.push({"id": $scope.details.data.tech_id, "name": $scope.details.data.tech_name, "group": 1});

            //erste Abhängigkeit
            for (var i = 0; i < $scope.relationen.data.length; i++) {

                nodes.push({
                    "id": $scope.relationen.data[i].tech_id,
                    "name": $scope.relationen.data[i].tech_name,
                    "group": 1
                });
                //source: Das wie viele Element aus den Nodes ist die Quelle
                //Target: Das wie vielte Element aus den Nodes ist das Ziel
                //value: Strichstärke
                links.push({
                    "source": 0,
                    "target": i + 1,
                    "value": 1
                });




            }

            var extranodes = getOtherNodes(nodes);
            var extralinks = getOtherLinks(links);

            nodes.push(extranodes);
            console.log(nodes);
            //links.push(extralinks);


            //zweite Abhängigkeit


            var color = d3.scale.category20()
            $scope.options = {
                chart: {
                    type: 'forceDirectedGraph',
                    height: 450,
                    width: $(".container").width(),
                    margin: {top: 20, right: 20, bottom: 20, left: 20},
                    color: function (d) {
                        return color(d.group)
                    },
                    nodeExtras: function (node) {
                        node && node
                            .append("text")
                            .attr("dx", 8)
                            .attr("dy", ".35em")
                            .text(function (d) {
                                return d.name
                            })
                            .style('font-size', '10px');
                    }
                }
            };

            $scope.data = {
                "nodes": nodes,
                "links": links
            }

        });


    function getOtherNodes(exitingnodes) {


        var nodesextra = [];

        if(exitingnodes.length!=0){
            for (var j = 0; j < exitingnodes.length; j++) {
                console.log(exitingnodes[j].id);
                $http.post('databaseFiles/getRelation.php', exitingnodes[j].id)
                    .then(function (info) {
                        console.log(info);
                        for (var k = 0; k < info.data.length; k++) {
                            nodesextra.push({
                                "id": info.data[k].tech_id,
                                "name": info.data[k].tech_name,
                                "group": 2
                            });
                        }

                    });
            }
        }
        return nodesextra;

    }


    function getOtherLinks (exitinglinks) {

        console.log(exitinglinks);

    }

    function getOtherRelationen(exitingnodes) {
        var nodestest = [];
        var linkstest = [];


        for (var j = 0; j < exitingnodes.data.length; j++) {
            $http.post('databaseFiles/getRelation.php', exitingnodes.data[j].tech_id)
                .then(function (info) {
                    console.log(info);
                    if (info.data.length != 0) {
                        console.log(info);
                        for (var k = 0; k < info.data.length; k++) {

                            nodes.push({
                                "id": info.data[k].tech_id,
                                "name": info.data[k].tech_name,
                                "group": 2

                            });
                            //source: Das wie viele Element aus den Nodes ist die Quelle
                            //Target: Das wie vielte Element aus den Nodes ist das Ziel
                            //value: Strichstärke
                            console.log(j);
                            links.push({
                                "source": 2,
                                "target": 3,
                                "value": 3
                            });
                        }
                    }
                    console.log(links);

                });

        }

    }
    function getOtherRelationen(exitingnodes) {
        var nodestest = [];
        var linkstest = [];


        for (var j = 0; j < exitingnodes.data.length; j++) {
            $http.post('databaseFiles/getRelation.php', exitingnodes.data[j].tech_id)
                .then(function (info) {
                    console.log(info);
                    if (info.data.length != 0) {
                        console.log(info);
                        for (var k = 0; k < info.data.length; k++) {

                            nodes.push({
                                "id": info.data[k].tech_id,
                                "name": info.data[k].tech_name,
                                "group": 2

                            });
                            //source: Das wie viele Element aus den Nodes ist die Quelle
                            //Target: Das wie vielte Element aus den Nodes ist das Ziel
                            //value: Strichstärke
                            console.log(j);
                            links.push({
                                "source": 2,
                                "target": 3,
                                "value": 3
                            });
                        }
                    }
                    console.log(links);

                });

        }

    }



    /* function getOtherRelationen(id, i, nodes, links) {
     var  nodestest = [];
     var linkstest = [];
     $http.post('databaseFiles/getRelation.php', id)
     .then(function (info) {

     if(info.data.length!=0){
     console.log(info);
     for (var j = 0; j < info.data.length; j++) {

     nodes.push({
     "id": info.data[j].tech_id,
     "name": info.data[j].tech_name,
     "group": 1

     });
     //source: Das wie viele Element aus den Nodes ist die Quelle
     //Target: Das wie vielte Element aus den Nodes ist das Ziel
     //value: Strichstärke
     links.push({
     "source": i+1,
     "target": i+2,
     "value": 1
     });
     }
     }
     console.log(linkstest)
     });
     }*/


});

/*

 {"source": 1, "target": 0, "value": 1},
 {"source": 2, "target": 0, "value": 8},
 {"source": 3, "target": 0, "value": 10},
 //function deleteDuplicates(arr) { var temp = {}; for (var i = 0; i < arr.length; i++) temp[arr[i]] = true; var r = []; for (var k in temp) r.push(k); return r; }
 /*
 for (var i = 0; i < ($scope.relation.data.length); i++) {

 console.log( $scope.relation.data[i].vontech_id)
 technologien.push(
 $scope.relation.data[i].von_tech_id);
 }
 console.log(technologien);
 $http.post('databaseFiles/getTechRelation.php', technologien)
 .then(function (info) {

 console.log(info);
 });
 var nodestest = [];

 for (var i = 0; i < info.data.length; i++) {
 console.log (info.data);

 nodestest.push({
 name: info.data[i].tech_id,
 group: 1
 });
 }

 console.log (nodestest);

 console.log($scope);
 console.log($scope.techdetails);

 $scope.showDetail = function(info){
 $scope.techdetails = info;
 console.log($scope.techdetails);
 /*$('#techdetails').slideUp();
 $('#techdetails').slideToggle();

 .when('/tech/:param', {
 templateUrl: 'templates/tech.details.html',
 controller: 'DetailCtrl'
 })*/

/*

 var crudApp;
 crudApp = angular.module('crudApp', ['ngRoute']);
 crudApp.controller("DbController", ['$scope', '$http', function ($scope, $http) {

 // Function to get employee details from the database
 $scope.details = '';

 getInfo = function () {
 // Sending request to EmpDetails.php files
 $http.post('databaseFiles/empDetails.php')
 .then(function (data) {
 // Stored the returned data into scope
 $scope.details = data;

 });
 }
 getInfo();

 $scope.currentTech = {};
 $scope.getTech = function(info){
 $scope.currentTech = info;
 console.log(info);
 $('#empForm').slideUp();
 $('#empForm').slideToggle();
 }

 }]);
 */
/* .controller("DetailCtrl", function($scope,$http,$routeParams) {
 console.log('Passed parameter contact id is:', $routeParams.param);
 $scope.selectedTechId = $routeParams.param;
 var id = $scope.selectedTechId;
 var queryString = "SELECT * FROM technologien WHERE tech_id=" + id;


 $scope.getIn = function (info) {
 // Sending request to EmpDetails.php files
 $http.post('databaseFiles/getTech.php', queryString)
 .then(function (data) {
 // Stored the returned data into scope
 console.log(data);
 $scope.details = data;
 });
 }
 $scope.getIn();
 })*//*
 function getOtherRelationen(exitingnodes) {
 var nodestest = [];
 var linkstest = [];


 for (var j = 0; j < exitingnodes.data.length; j++) {
 $http.post('databaseFiles/getRelation.php', exitingnodes.data[j].tech_id)
 .then(function (info) {
 console.log(info);
 if (info.data.length != 0) {
 console.log(info);
 for (var k = 0; k < info.data.length; k++) {

 nodes.push({
 "id": info.data[k].tech_id,
 "name": info.data[k].tech_name,
 "group": 2

 });
 //source: Das wie viele Element aus den Nodes ist die Quelle
 //Target: Das wie vielte Element aus den Nodes ist das Ziel
 //value: Strichstärke
 console.log(j);
 links.push({
 "source": 2,
 "target": 3,
 "value": 3
 });
 }
 }
 console.log(links);

 });

 }

 }

 {"source": 1, "target": 0, "value": 1},
 {"source": 2, "target": 0, "value": 8},
 {"source": 3, "target": 0, "value": 10},
 //function deleteDuplicates(arr) { var temp = {}; for (var i = 0; i < arr.length; i++) temp[arr[i]] = true; var r = []; for (var k in temp) r.push(k); return r; }
 /*
 for (var i = 0; i < ($scope.relation.data.length); i++) {

 console.log( $scope.relation.data[i].vontech_id)
 technologien.push(
 $scope.relation.data[i].von_tech_id);
 }
 console.log(technologien);
 $http.post('databaseFiles/getTechRelation.php', technologien)
 .then(function (info) {

 console.log(info);
 });
 var nodestest = [];

 for (var i = 0; i < info.data.length; i++) {
 console.log (info.data);

 nodestest.push({
 name: info.data[i].tech_id,
 group: 1
 });
 }

 console.log (nodestest);

 console.log($scope);
 console.log($scope.techdetails);

 $scope.showDetail = function(info){
 $scope.techdetails = info;
 console.log($scope.techdetails);
 /*$('#techdetails').slideUp();
 $('#techdetails').slideToggle();

 .when('/tech/:param', {
 templateUrl: 'templates/tech.details.html',
 controller: 'DetailCtrl'
 })*/

/*

 var crudApp;
 crudApp = angular.module('crudApp', ['ngRoute']);
 crudApp.controller("DbController", ['$scope', '$http', function ($scope, $http) {

 // Function to get employee details from the database
 $scope.details = '';

 getInfo = function () {
 // Sending request to EmpDetails.php files
 $http.post('databaseFiles/empDetails.php')
 .then(function (data) {
 // Stored the returned data into scope
 $scope.details = data;

 });
 }
 getInfo();

 $scope.currentTech = {};
 $scope.getTech = function(info){
 $scope.currentTech = info;
 console.log(info);
 $('#empForm').slideUp();
 $('#empForm').slideToggle();
 }

 }]);
 */
/* .controller("DetailCtrl", function($scope,$http,$routeParams) {
 console.log('Passed parameter contact id is:', $routeParams.param);
 $scope.selectedTechId = $routeParams.param;
 var id = $scope.selectedTechId;
 var queryString = "SELECT * FROM technologien WHERE tech_id=" + id;


 $scope.getIn = function (info) {
 // Sending request to EmpDetails.php files
 $http.post('databaseFiles/getTech.php', queryString)
 .then(function (data) {
 // Stored the returned data into scope
 console.log(data);
 $scope.details = data;
 });
 }
 $scope.getIn();
 })*/