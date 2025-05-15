<?php
class Quiz
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }
  public function getQuizzes($usertype, $fullname)
  {
    if ($usertype === 'Admin') {
      $stmt = $this->conn->prepare("SELECT * FROM quiz");
    } else {
      $stmt = $this->conn->prepare("SELECT * FROM quiz WHERE created_by = ?");
      $stmt->bind_param("s", $fullname);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $quizzes = [];
    while ($row = $result->fetch_assoc()) {
      $quizzes[] = $row;
    }

    $stmt->close();
    return $quizzes;
  }
  public function create($quiz_name, $subject, $department, $questions, $created_by)
  {
    $question_string = json_encode($questions);

    $query = "INSERT INTO quiz (quiz_name, subject, department, questions, created_by) VALUES (?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssss", $quiz_name, $subject, $department, $question_string, $created_by);

    if ($stmt->execute()) {
      $last_id = $this->conn->insert_id;
      $fetch_query = "SELECT * FROM quiz WHERE id = ?";
      $fetch_stmt = $this->conn->prepare($fetch_query);
      $fetch_stmt->bind_param("i", $last_id);
      $fetch_stmt->execute();
      $result = $fetch_stmt->get_result();

      return $result->fetch_assoc();
    }

    return false;
  }
}
