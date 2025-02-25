<?php
class Statistics
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function all_users()
  {
    // Get total number of questions
    $total_query = "SELECT COUNT(*) AS total_count FROM user";
    $total_stmt = $this->conn->prepare($total_query);
    $total_stmt->execute();
    $total_result = $total_stmt->get_result();
    $total_count = $total_result->fetch_assoc()['total_count'];

    // Get question count by category
    $category_query = "SELECT assigned_subject, COUNT(*) AS count FROM user GROUP BY assigned_subject";
    $category_stmt = $this->conn->prepare($category_query);
    $category_stmt->execute();
    $category_result = $category_stmt->get_result();

    // Get question count by category
    $subject_query = "SELECT type, COUNT(*) AS count FROM user GROUP BY type";
    $subject_stmt = $this->conn->prepare($subject_query);
    $subject_stmt->execute();
    $subject_result = $subject_stmt->get_result();

    $subjects = [];
    while ($row = $subject_result->fetch_assoc()) {
      $subjects[$row['type']] = $row['count'];
    }

    $categories = [];
    while ($row = $category_result->fetch_assoc()) {
      $categories[$row['assigned_subject']] = $row['count'];
    }

    return [
      'total_users' => $total_count,
      'users_by_subject' => $categories,
      'users_by_role' => $subjects
    ];
  }
  public function all_questions()
  {
    // Get total number of questions
    $total_query = "SELECT COUNT(*) AS total_count FROM question";
    $total_stmt = $this->conn->prepare($total_query);
    $total_stmt->execute();
    $total_result = $total_stmt->get_result();
    $total_count = $total_result->fetch_assoc()['total_count'];

    // Get question count by category
    $category_query = "SELECT category, COUNT(*) AS count FROM question GROUP BY category";
    $category_stmt = $this->conn->prepare($category_query);
    $category_stmt->execute();
    $category_result = $category_stmt->get_result();

    // Get question count by category
    $subject_query = "SELECT subject, COUNT(*) AS count FROM question GROUP BY subject";
    $subject_stmt = $this->conn->prepare($subject_query);
    $subject_stmt->execute();
    $subject_result = $subject_stmt->get_result();

    $subjects = [];
    while ($row = $subject_result->fetch_assoc()) {
      $subjects[$row['subject']] = $row['count'];
    }

    $categories = [];
    while ($row = $category_result->fetch_assoc()) {
      $categories[$row['category']] = $row['count'];
    }

    return [
      'total_questions' => $total_count,
      'questions_by_category' => $categories,
      'questions_by_subject' => $subjects
    ];
  }
}
