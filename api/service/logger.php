<?php
require_once './config/database.php';

function create_log($conn, $who_trigger, $message)
{
  $stmt = $conn->prepare("INSERT INTO logs (who_trigger, message) VALUES (?, ?)");

  if (!$stmt) {
    error_log("Log Insert Prepare Failed: " . $conn->error);
    return false;
  }

  // Bind parameters
  $stmt->bind_param("ss", $who_trigger, $message);

  // Execute and close
  $success = $stmt->execute();
  if (!$success) {
    error_log("Log Insert Execute Failed: " . $stmt->error);
  }

  $stmt->close();
  return $success;
}