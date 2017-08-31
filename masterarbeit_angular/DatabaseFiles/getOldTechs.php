<?php
// Including database connections
require_once 'database_connections.php';
// mysqli query to fetch all data from database
//$query = "SELECT * from emp_details ORDER BY emp_id ASC";
//$data = json_decode(file_get_contents("php://input"));


$data =$_GET['tech'];

// Escaping special characters from updated data
$queryString = "SELECT * FROM technologien WHERE tech_name IN (".$data.")";

$result = mysqli_query($con, $queryString);
$arr = array();
if(mysqli_num_rows($result) != 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $arr[] = $row;
    }
}
// Return json array containing data from the databasecon
echo $json_info = json_encode($arr);

//echo $queryString;
?>