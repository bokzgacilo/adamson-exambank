<?php
  // Database credentials
  $host = 'localhost';  // Database host
  $username = 'root';  // Database username
  $password = '';  // Database password (empty if no password set)
  $dbname = 'exam-bank';  // Database name

  // $host = '151.106.122.2';  // Database host
  // $username = 'u954740893_exambank';  // Database username
  // $password = 'P4]D8$^:g*5';  // Database password (empty if no password set)
  // $dbname = 'u954740893_main';  // Database name
  
  $conn = new mysqli($host, $username, $password, $dbname);

  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }
?>