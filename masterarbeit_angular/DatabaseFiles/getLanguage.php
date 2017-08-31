<?php
header("content-type: text/html; charset=UTF-8");
// Including database connections
require_once 'database_connections.php';
// mysqli query to fetch all data from database
//$query = "SELECT * from emp_details ORDER BY emp_id ASC";
//$data = file_get_contents("php://input");

$data =$_GET['lang'];
$str= str_replace("[\"", "", $data);
$str= str_replace("\"]", "", $str);
$str= str_replace("\"", "'", $str);;



$query = "(SELECT t.tech_name, t.tech_id, b.dependsOn AS 'dependsOn', t3.tech_name AS 'dependsOnName' FROM technologien t 
 LEFT JOIN beziehungen b ON b.t_id=t.tech_id 
 LEFT JOIN technologien t3 ON b.dependsON = t3.tech_id
WHERE b.dependsOn in (SELECT t2.tech_id FROM technologien t2 WHERE t2.tech_name IN ($data)) AND t.tech_cat='Framework')UNION
(SELECT t.tech_name, t.tech_id, b.dependsOn AS 'dependsOn', t3.tech_name AS 'dependsOnName' FROM technologien t 
 LEFT JOIN abhaengigkeiten b ON b.t_id=t.tech_id 
 LEFT JOIN technologien t3 ON b.dependsON = t3.tech_id
WHERE b.dependsOn in (SELECT t2.tech_id FROM technologien t2 WHERE t2.tech_name IN ($data)) AND t.tech_cat='Framework')";

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