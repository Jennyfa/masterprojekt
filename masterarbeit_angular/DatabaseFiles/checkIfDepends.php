<?php
header("content-type: text/html; charset=UTF-8");
// Including database connections
require_once 'database_connections.php';
// mysqli query to fetch all data from database
//$query = "SELECT * from emp_details ORDER BY emp_id ASC";
//$data = file_get_contents("php://input");
$data =$_GET['data'];
$teile = explode(";", $data); //1. Teil verwendetet Technologien 2. Mögliche Ergänzungen


$query = "(SELECT  tech_name AS 'dependsOnTechnologie', tech_id 
FROM technologien t 
LEFT JOIN abhaengigkeiten a ON t.tech_id = a.dependsOn 
WHERE a.t_id IN (SELECT t2.tech_id FROM technologien t2 WHERE t2.tech_name IN ($teile[0]))
AND a.dependsOn IN (SELECT t3.tech_id FROM technologien t3 WHERE t3.tech_name IN ($teile[1])))
UNION 
(SELECT  tech_name AS 'dependsOnTechnologie', tech_id 
FROM technologien t4 
LEFT JOIN beziehungen b ON t4.tech_id = b.dependsOn 
WHERE b.t_id IN (SELECT te2.tech_id FROM technologien te2 WHERE te2.tech_name IN ($teile[0]))
AND b.dependsOn IN (SELECT te3.tech_id FROM technologien te3 WHERE te3.tech_name IN ($teile[1]))
AND b.b_type='Erweiterung')";


$result = mysqli_query($con, $query);
$arr = array();
if(mysqli_num_rows($result) != 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $arr[] = $row;
    }
}
// Return json array containing data from the databasecon
echo $json_info = json_encode($arr);
//echo $data;
?>