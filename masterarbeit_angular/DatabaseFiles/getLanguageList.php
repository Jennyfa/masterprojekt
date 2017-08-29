<?php
header("content-type: text/html; charset=UTF-8");
// Including database connections
require_once 'database_connections.php';
// mysqli query to fetch all data from database
//$query = "SELECT * from emp_details ORDER BY emp_id ASC";


$query = "SELECT tech_name FROM technologien  WHERE tech_cat='language'";



//$query = "SELECT  t.tech_name, t.tech_id  a.ab_type,  r.r_ab_id FROM (technologien t LEFT JOIN relationen r  ON t.tech_id = r.von_tech_id) INNER JOIN abhaengigkeiten a ON r.r_ab_id=a.ab_id WHERE r.r_tech_id IN (".$str.")";

$result = mysqli_query($con, $query);
$arr = array();
if(mysqli_num_rows($result) != 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $arr[] = $row;
    }
}
// Return json array containing data from the databasecon
echo $json_info = json_encode($arr);
//echo $query;



?>