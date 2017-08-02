<?php
// Including database connections
require_once 'database_connections.php';
// mysqli query to fetch all data from database
$query = "SELECT tech_name, tech_id from technologien ORDER BY tech_name ASC";
$result = mysqli_query($con, $query);
$arr = array();
$count=0;
if(mysqli_num_rows($result) != 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $arr[] = $row;
        $count++;
    }
}
// Return json array containing data from the databasecon
echo $json_info = json_encode($arr);
//echo $arr;
?>