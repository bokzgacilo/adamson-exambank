<?php
class Subject
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function create($name)
  {
    $query = "INSERT INTO subjects (name) VALUES (?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("s", $name);

    if ($stmt->execute()) {
      $last_id = $this->conn->insert_id;

      $fetch_query = "SELECT * FROM subjects WHERE id = ?";
      $fetch_stmt = $this->conn->prepare($fetch_query);
      $fetch_stmt->bind_param("i", $last_id);
      $fetch_stmt->execute();
      $result = $fetch_stmt->get_result();

      return $result->fetch_assoc();
    }

    return false;
  }

  public function GetAllSubjects($type)
  {
    if ($type === "Admin" || $type === "Coordinator") {
      $query = "SELECT * FROM subjects";
      $stmt = $this->conn->query($query);
    } else {
      return [];
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }
  public function GetAllDepartments($type)
  {
    if ($type === "Admin" || $type === "Coordinator") {
      $query = "SELECT * FROM department";
      $stmt = $this->conn->query($query);
    } else {
      return [];
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }

  public function change_status($id, $status)
  {
    // Step 1: Get subject name by ID
    $query = "SELECT name FROM subjects WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if (!$row) {
      return false; // Subject not found
    }

    $subjectName = $row['name'];

     // Step 2: Update questions where subject matches
    $query = "UPDATE question SET status = ? WHERE subject = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("ss", $status, $subjectName);
    $stmt->execute(); // Optional: check $stmt->affected_rows

    // Step 3: Update subject status
    $query = "UPDATE subjects SET status = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $status, $id);

    return $stmt->execute();

  }

  public function delete($subject_name)
  {
    $query = "DELETE FROM subjects WHERE name = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("s", $subject_name);
    
    return $stmt->execute();
  }

  public function viewAll()
  {
    $query = "SELECT * FROM subjects"; // No WHERE condition
    $stmt = $this->conn->query($query);

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }
}
