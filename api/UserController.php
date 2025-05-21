<?php
class User
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  // Create a new exam
  public function create($name, $type, $assigned_subject, $assigned_department, $username, $password)
  {
    $query = "INSERT INTO user (name, type, assigned_subject, assigned_department, username, password) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("ssssss", $name, $type, $assigned_subject, $assigned_department, $username, $password);
    $data = $stmt->execute();
    $stmt -> close();
    return $data;
  }

  // Read all user
  public function viewAll()
  {
    $query = "SELECT * FROM user WHERE type <> 'admin'";
    $result = $this->conn->query($query);
    $data = $result->fetch_all(MYSQLI_ASSOC);
    $result -> close();
    return $data;
  }

  // Read a single exam
  public function view($id)
  {
    $query = "SELECT * FROM user WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();
    $stmt -> close();
    return $data;
  }

  // Update an exam
  public function edit($id, $title, $description, $date)
  {
    $query = "UPDATE user SET title = ?, description = ?, exam_date = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssi", $title, $description, $date, $id);
    $data = $stmt->execute();
    $stmt -> close();
    return $data;
  }

  public function update_subjects($id, $usersubjects)
  {
    $assigned_subjects = json_encode($usersubjects); // Convert array to JSON string
    $query = "UPDATE user SET assigned_subject = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $assigned_subjects, $id);
    $data = $stmt->execute();
    $stmt -> close();
    return $data;
  }
  public function update_departments($id, $usersubjects)
  {
    $assigned_departments = json_encode($usersubjects); // Convert array to JSON string
    $query = "UPDATE user SET assigned_department = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $assigned_departments, $id);
    $data = $stmt->execute();
    $stmt -> close();
    return $data;
  }

  public function get_user_data($id)
  {
    $stmt = $this->conn->prepare("SELECT * FROM user WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $stmt -> close();
      return $row;
    } else {
      $stmt -> close();
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

      $stmt -> close();
      if ($row['status'] == 0) {
        return json_encode(["error" => "Your account is inactive. Please contact support."]);
      }
      return json_encode($row);
    } else {
      $stmt -> close();
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
    $data = $stmt->execute();
    $stmt -> close();
    return $data;
  }


  public function change_password($id, $password)
  {
    $query = "UPDATE user SET password = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $password, $id);
    $data = $stmt -> execute();
    $stmt -> close();
    return $data;
  }

  public function change_status($id, $status)
  {
    $query = "UPDATE user SET status = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $status, $id);
    $data = $stmt -> execute();
    $stmt -> close();
    return $data;
  }
  public function change_type($id, $type)
  {
    $query = "UPDATE user SET type = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $type, $id);
    $data = $stmt -> execute();
    $stmt -> close();
    return $data;
  }

  // Delete an exam
  public function delete($id)
  {
    $query = "DELETE FROM user WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $data = $stmt -> execute();
    $stmt -> close();
    return $data;
  }
}
