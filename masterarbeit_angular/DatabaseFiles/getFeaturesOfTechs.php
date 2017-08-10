<?php
header("content-type: text/html; charset=UTF-8");
// Including database connections
require_once 'database_connections.php';
// mysqli query to fetch all data from database
//$query = "SELECT * from emp_details ORDER BY emp_id ASC";
$data = file_get_contents("php://input");

$teile = explode(";", $data);


// Escaping special characters from updated data
//Selektiere alle tech_features, die zu features gehören und der ausgewählten Technologie angehören
$query = "SELECT f2.f_name, t.tech_name AS 'dependsOnTechnologie' FROM technologien t 
LEFT JOIN tech_features tf  ON t.tech_id=tf.belongsTo 
LEFT JOIN feature f2  ON f2.f_id=tf.isLike
WHERE tf.isLike IN (SELECT f.f_id FROM feature f WHERE f.f_name IN ($teile[1]))
AND tf.belongsTo in (SELECT t2.tech_id FROM technologien t2 WHERE t2.tech_name IN ($teile[0]))";



$result = mysqli_query($con, $query);
$arr = array();
if(mysqli_num_rows($result) != 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $arr[] = $row;
    }
}
// Return json array containing data from the databasecon
echo $json_info = json_encode($arr);
//echo $query
?>