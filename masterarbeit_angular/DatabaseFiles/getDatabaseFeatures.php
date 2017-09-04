<?php
header("content-type: text/html; charset=UTF-8");
// Including database connections
require_once 'database_connections.php';
// mysqli query to fetch all data from database
//$query = "SELECT * from emp_details ORDER BY emp_id ASC";
//$data = file_get_contents("php://input");
$data =$_GET['database'];


$query = "SELECT f2.f_name FROM feature f2
 LEFT JOIN tech_features tf ON f2.f_id=tf.isLike
WHERE tf.belongsTo in (SELECT t.tech_id FROM technologien t WHERE t.tech_name='$data')";

/*$query = "SELECT f2.f_name AS 'dependsOnName' FROM feature f2
 LEFT JOIN tech_features tf ON f2.f_id=tf.isLike
WHERE tf.belongsTo in (SELECT t.tech_id FROM technologien t WHERE t.tech_name='.$data.')";*/

//seleketiere alle Selektiere alle tech_feature die belongsTo Datenbank

$result = mysqli_query($con, $query);
$arr = array();
if(mysqli_num_rows($result) != 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $arr[] = $row;
    }
}
// Return json array containing data from the databasecon
echo $json_info = json_encode($arr);
?>