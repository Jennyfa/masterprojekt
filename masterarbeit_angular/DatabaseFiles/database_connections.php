<?php

header("content-type: text/html; charset=UTF-8");
// Connecting to database as mysqli_connect("hostname", "username", "password", "database name");
$con = mysqli_connect("localhost", "root", "Kevin0203", "db_master");
$con->set_charset("utf8");
?>