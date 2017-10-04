<?php

$host_name = 'localhost';
$database = 'db_master';
$user_name = 'user';
$password = 'passwort';

header("content-type: text/html; charset=UTF-8");
// Connecting to database as mysqli_connect("hostname", "username", "password", "database name");
$con = mysqli_connect($host_name, $user_name, $password, $database);
$con->set_charset("utf8");
?>


