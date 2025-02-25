<?php
  // Database credentials
  $host = 'localhost';  // Database host
  $username = 'root';  // Database username
  $password = '';  // Database password (empty if no password set)
  $dbname = 'exam-bank';  // Database name
  
  $conn = new mysqli($host, $username, $password, $dbname);

  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }
?>