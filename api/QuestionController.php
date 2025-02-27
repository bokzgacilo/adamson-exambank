<?php
class Question
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function create($question, $options, $answer, $category, $name, $subject, $term, $classification)
  {
    $query = "INSERT INTO question (question, options, answer, category, created_by, subject, terms, classification) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("ssssssss", $question, $options, $answer, $category, $name, $subject, $term, $classification);

    if ($stmt->execute()) {
      $last_id = $this->conn->insert_id;

      $fetch_query = "SELECT * FROM question WHERE id = ?";
      $fetch_stmt = $this->conn->prepare($fetch_query);
      $fetch_stmt->bind_param("i", $last_id);
      $fetch_stmt->execute();
      $result = $fetch_stmt->get_result();

      // Return the fetched row
      return $result->fetch_assoc();
    }

    return false;
  }

  public function update($id, $question, $options, $answer, $category, $name, $subject, $term, $classification)
  {
    $query = "UPDATE question 
      SET question = ?, 
          options = ?, 
          answer = ?, 
          category = ?, 
          created_by = ?, 
          subject = ?, 
          terms = ?,
          classification = ?,
          last_updated = NOW()
      WHERE id = ?";

    $stmt = $this->conn->prepare($query);
    if (!$stmt) {
      die("Prepare failed: " . $this->conn->error);
    }

    $stmt->bind_param("ssssssssi", $question, $options, $answer, $category, $name, $subject, $term, $classification, $id);

    if ($stmt->execute()) {
      $fetch_query = "SELECT * FROM question WHERE id = ?";
      $fetch_stmt = $this->conn->prepare($fetch_query);
      if (!$fetch_stmt) {
        die("Prepare failed: " . $this->conn->error);
      }

      $fetch_stmt->bind_param("i", $id);
      $fetch_stmt->execute();
      $result = $fetch_stmt->get_result();

      return $result->fetch_assoc();
    }

    return false;
  }



  public function viewAll($subject, $type)
  {
    if ($type === "Admin" || $type === "Coordinator") {
      $query = "SELECT * FROM question";
      $stmt = $this->conn->query($query);
    } else if ($type === "Instructor") {
      $query = "SELECT * FROM question WHERE subject = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $subject);
      $stmt->execute();
      $stmt = $stmt->get_result();
    } else {
      return [];
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }


  public function view($id)
  {
    $query = "SELECT * FROM exams WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
  }

  public function toggle_status($id)
  {
    $query = "UPDATE question SET status = NOT status WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
  }

  // Delete an exam
  public function delete($id)
  {
    $query = "DELETE FROM exams WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
  }
}
