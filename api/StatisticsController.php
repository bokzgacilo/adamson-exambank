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
    // Get total number of users
    $total_query = "SELECT COUNT(*) AS total_count FROM user";
    $total_stmt = $this->conn->prepare($total_query);
    $total_stmt->execute();
    $total_result = $total_stmt->get_result();
    $total_count = $total_result->fetch_assoc()['total_count'];

    // Get user count by role (type)
    $role_query = "SELECT type, COUNT(*) AS count FROM user GROUP BY type";
    $role_stmt = $this->conn->prepare($role_query);
    $role_stmt->execute();
    $role_result = $role_stmt->get_result();

    $roles = [];
    while ($row = $role_result->fetch_assoc()) {
        $roles[$row['type']] = $row['count'];
    }

    // Get users by subject (handling JSON array)
    $category_query = "SELECT assigned_subject FROM user";
    $category_stmt = $this->conn->prepare($category_query);
    $category_stmt->execute();
    $category_result = $category_stmt->get_result();

    $subjects = [];
    
    while ($row = $category_result->fetch_assoc()) {
        $assigned_subjects = json_decode($row['assigned_subject'], true); // Decode JSON

        if (is_array($assigned_subjects)) {
            foreach ($assigned_subjects as $subject) {
                if (strtolower($subject) !== "None") { // Ignore "none"
                    $subjects[$subject] = ($subjects[$subject] ?? 0) + 1;
                }
            }
        }
    }

    return [
        'total_users' => $total_count,
        'users_by_subject' => $subjects,
        'users_by_role' => $roles
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
    $classification_query = "SELECT classification, COUNT(*) AS count FROM question GROUP BY classification";
    $classification_stmt = $this->conn->prepare($classification_query);
    $classification_stmt->execute();
    $classification_result = $classification_stmt->get_result();

    // Get question count by category
    $subject_query = "SELECT subject, COUNT(*) AS count FROM question GROUP BY subject";
    $subject_stmt = $this->conn->prepare($subject_query);
    $subject_stmt->execute();
    $subject_result = $subject_stmt->get_result();

    $subjects = [];
    while ($row = $subject_result->fetch_assoc()) {
      $subjects[$row['subject']] = $row['count'];
    }

    $classifications = [];
    while ($row = $classification_result->fetch_assoc()) {
      $classifications[$row['classification']] = $row['count'];
    }

    $categories = [];
    while ($row = $category_result->fetch_assoc()) {
      $categories[$row['category']] = $row['count'];
    }

    return [
      'total_questions' => $total_count,
      'questions_by_category' => $categories,
      'questions_by_subject' => $subjects,
      'questions_by_classification' => $classifications
    ];
  }
}
