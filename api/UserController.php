<?php
class User
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  // Create a new exam
  public function create($name, $type, $assigned_subject, $username, $password)
  {
    $query = "INSERT INTO user (name, type, assigned_subject, username, password) VALUES (?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssss", $name, $type, $assigned_subject, $username, $password);
    return $stmt->execute();
  }

  // Read all user
  public function viewAll()
  {
    $query = "SELECT * FROM user WHERE type <> 'admin'";
    $result = $this->conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
  }

  // Read a single exam
  public function view($id)
  {
    $query = "SELECT * FROM user WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
  }

  // Update an exam
  public function edit($id, $title, $description, $date)
  {
    $query = "UPDATE user SET title = ?, description = ?, exam_date = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssi", $title, $description, $date, $id);
    return $stmt->execute();
  }

  public function update_subjects($id, $usersubjects)
  {
    $assigned_subjects = json_encode($usersubjects); // Convert array to JSON string
    $query = "UPDATE user SET assigned_subject = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $assigned_subjects, $id);
    
    return $stmt->execute();
  }

  public function get_user_data($id)
  {
    $stmt = $this->conn->prepare("SELECT * FROM user WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();

      return $row;
    } else {
      return json_encode([]);
    }
  }

  public function login($username, $password)
  {
    $stmt = $this->conn->prepare("SELECT * FROM user WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();

      if ($row['status'] == 0) {
        return json_encode(["error" => "Your account is inactive. Please contact support."]);
      }

      return json_encode($row);
    } else {
      return json_encode(["error" => "Invalid username or password."]);
    }
  }

  public function change_avatar($id, $avatar, $password)
  {
    $query = "UPDATE user SET password = ? WHERE id = ?";

    if ($avatar) {
      $uploadDir = "user_images/$id/";

      if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
      }

      $extension = pathinfo($avatar["name"], PATHINFO_EXTENSION);
      $fileName = "avatar_$id.$extension";
      $imagePath = "user_images/$id/" . $fileName;

      if (move_uploaded_file($avatar["tmp_name"], $imagePath)) {
        $query = "UPDATE user SET avatar = ?, password = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $imagePath, $password, $id);
      } else {
        return false;
      }
    } else {
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("si", $password, $id);
    }

    return $stmt->execute();
  }


  public function change_password($id, $password)
  {
    $query = "UPDATE user SET password = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $password, $id);
    return $stmt->execute();
  }

  public function change_status($id, $status)
  {
    $query = "UPDATE user SET status = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $status, $id);
    return $stmt->execute();
  }

  // Delete an exam
  public function delete($id)
  {
    $query = "DELETE FROM user WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
  }
}
