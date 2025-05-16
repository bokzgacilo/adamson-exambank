<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
function sendPasswordResetEmail($newPassword, $email, $clientName)
{
  $mail = new PHPMailer(true);

  try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'support@exambank.site';
    $mail->Password   = '87hRLAO$Vj';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('support@exambank.site', 'Exam Bank Support');
    $mail->addAddress($email, $clientName);

    $mail->isHTML(true);
    $mail->Subject = 'Your Password Has Been Reset';
    $mail->Body    = "
            <p>Hi <strong>{$clientName}</strong>,</p>
            <p>Your password has been successfully reset.</p>
            <p><strong>New Password:</strong> {$newPassword}</p>
            <p>Please log in and change your password as soon as possible for security reasons.</p>
            <br>
            <p>Regards,<br>Exam Bank Support</p>
        ";
    $mail->AltBody = "Hi {$clientName},\n\nYour new password is: {$newPassword}\n\nPlease change it after logging in.\n\n- Exam Bank Support";

    $mail->send();
    return true;
  } catch (Exception $e) {
    error_log("Mailer Error: {$mail->ErrorInfo}");
    return false;
  }
}
