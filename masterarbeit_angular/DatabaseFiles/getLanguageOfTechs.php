<?php
header("content-type: text/html; charset=UTF-8");
// Including database connections
require_once 'database_connections.php';


$data =$_GET['lang'];
$teile = explode(";", $data);

$query = "(SELECT t.tech_name AS 'tech_name', t.tech_id AS 'tech_id', b.dependsOn AS 'dependsOn', t3.tech_name AS 'dependsOnName' FROM technologien t 
 LEFT JOIN beziehungen b ON b.t_id=t.tech_id 
 LEFT JOIN technologien t3 ON b.dependsON = t3.tech_id
WHERE b.dependsOn in (SELECT t2.tech_id FROM technologien t2 WHERE t2.tech_name IN ($teile[1]))
AND b.t_id IN (SELECT t2.tech_id FROM technologien t2 WHERE t2.tech_name IN ($teile[0])))
UNION
(SELECT t2.tech_name AS 'tech_name', t2.tech_id AS 'tech_id', a.dependsOn AS 'dependsOn', te3.tech_name AS 'dependsOnName' FROM technologien t2 
 LEFT JOIN abhaengigkeiten a ON a.t_id=t2.tech_id 
 LEFT JOIN technologien te3 ON a.dependsON = te3.tech_id
WHERE a.dependsOn in (SELECT te2.tech_id FROM technologien te2 WHERE te2.tech_name IN ($teile[1]))
AND a.t_id IN (SELECT te4.tech_id FROM technologien te4 WHERE te4.tech_name IN ($teile[0])))";




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