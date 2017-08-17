<?php
header("content-type: text/html; charset=UTF-8");
// Including database connections
require_once 'database_connections.php';
// mysqli query to fetch all data from database
//$query = "SELECT * from emp_details ORDER BY emp_id ASC";
$data = file_get_contents("php://input");
$teile = explode(";", $data); //1. Teil verwendetet Technologien 2. Mögliche Technologien zur Ergänzung

//selektiere alle Technologien die bereits verwendet werden und nicht kompatibel mit der neuen Technologie sind


$query = "SELECT tech_name, tech_id
FROM technologien t
LEFT JOIN beziehungen b  ON t.tech_id = b.t_id  
WHERE b.dependsOn IN (SELECT t3.tech_id FROM technologien t3 WHERE t3.tech_name IN ($teile[1])) 
AND b.t_id IN (SELECT t2.tech_id FROM technologien t2 WHERE t2.tech_name IN ($teile[0]))
AND b.b_type IN ('notCompatible')";

/*UNION
(SELECT  tech_name, tech_id, tech_cat, b.b_type as 'type', b.t_id, b.dependsOn 
FROM technologien t2 
LEFT JOIN
beziehungen b  ON t2.tech_id = b.dependsOn  WHERE b.t_id IN (".$str.") AND b.b_type IN ('basedOn', 'notCompatible'))";*/

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
echo $query;
?>