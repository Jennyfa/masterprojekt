<?php
// Including database connections
require_once 'database_connections.php';
// mysqli query to fetch all data from database
//$query = "SELECT * from emp_details ORDER BY emp_id ASC";
$data = file_get_contents("php://input");

// Escaping special characters from updated data
$queryString = "SELECT * FROM technologien WHERE tech_name='".$data."'";

$result = mysqli_fetch_assoc(mysqli_query($con, $queryString));
//$result = mysqli_fetch_assoc(mysqli_query($con, $queryString));



echo $json_info = json_encode($result);
//echo $queryString;
?>