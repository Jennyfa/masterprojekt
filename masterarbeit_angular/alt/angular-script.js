// Application module


var crudApp;
crudApp = angular.module('crudApp', []);
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


    $scope.formToggle = function(){
        $('#empForm').slideUp();
        $('#empForm').slideToggle();
    }


    $scope.insertInfo = function (info) {
        $http.post('databaseFiles/insertDetails.php',
            {
                "name": info.name,
                "email": info.email,
                "address": info.address,
                "gender": info.gender
            })
            .then(function (data) {
                console.log(data);
                if (data) {
                    getInfo();
                    // Hide details insertion form
                    $('#empForm').css('display', 'none');
                }

            });


    }

    $scope.currentUser = {};
    $scope.editInfo = function(info){
        $scope.currentUser = info;
        $('#empForm').slideUp();
        $('#editForm').slideToggle();
    }

    $scope.UpdateInfo = function(info){
        $http.post('databaseFiles/updateDetails.php',
            {"id":info.emp_id,"name":info.emp_name,"email":info.emp_email,"address":info.emp_address,"gender":info.emp_gender})
            .then(function(data){
            $scope.show_form = true;
            if (data) {
                getInfo();
                $('#editForm').css('display', 'none');
            }
        });
    }
    $scope.deleteInfo = function(info){
        $http.post('databaseFiles/deleteDetails.php',{"del_id":info.emp_id}).then(function(data){
            if (data) {
                getInfo();
            }
        });
    }

}]);
