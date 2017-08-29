<?php
header("content-type: text/html; charset=UTF-8");
// Including database connections
require_once 'database_connections.php';
// mysqli query to fetch all data from database
//$query = "SELECT * from emp_details ORDER BY emp_id ASC";
//$data = file_get_contents("php://input");
$data =$_GET['feature'];
$str= str_replace("[\"", "", $data);
$str= str_replace("\"]", "", $str);
$str= str_replace("\"", "'", $str);;

// Escaping special characters from updated data
//$query = "SELECT * FROM relationen WHERE r_tech_id='".$data."'";

//$query = "SELECT  tech_name, tech_id, a.ab_type,  r.r_ab_id, r.r_tech_id FROM (technologien t LEFT JOIN
//relationen r  ON t.tech_id = r.von_tech_id) INNER JOIN abhaengigkeiten a ON r.r_ab_id=a.ab_id  WHERE r.r_tech_id IN (".$str.")";
$query = "SELECT t.tech_name, t.tech_id, f2.f_name  AS 'dependsOnName' FROM technologien t 
LEFT JOIN tech_features tf  ON t.tech_id=tf.belongsTo 
LEFT JOIN feature f2  ON f2.f_id=tf.isLike
WHERE tf.isLike in (SELECT f.f_id FROM feature f WHERE f.f_name IN ($data))";


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