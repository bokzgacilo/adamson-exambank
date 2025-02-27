-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 28, 2025 at 12:53 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exam-bank`
--

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

CREATE TABLE `exam` (
  `id` int(11) NOT NULL,
  `exam_name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `access_code` varchar(50) NOT NULL,
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`questions`)),
  `created_by` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT current_timestamp(),
  `last_updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `approval_status` enum('Pending','Approved') DEFAULT 'Approved',
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exam`
--

INSERT INTO `exam` (`id`, `exam_name`, `subject`, `access_code`, `questions`, `created_by`, `date_created`, `last_updated`, `approval_status`, `status`) VALUES
(2, 'sdsdfsdf', 'Math', '239662', '[{\"id\":\"6\",\"question\":\"asdasds\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"2131232\\\",\\\"is_correct\\\":true}]\",\"answer\":\"{\\\"id\\\":1,\\\"option\\\":\\\"2131232\\\",\\\"is_correct\\\":true}\",\"category\":\"Identification\",\"created_by\":\"Admin Test\",\"last_updated\":\"0000-00-00 00:00:00\",\"date_created\":\"2025-02-12 16:18:41\",\"subject\":\"none\",\"status\":\"1\"}]', 'Admin Test', '2025-02-14 22:45:56', '2025-02-14 22:45:56', 'Approved', 1),
(3, 'asdasds', 'Math', '422982', '[{\"id\":\"2\",\"question\":\"What is love?\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"True\\\",\\\"is_correct\\\":true},{\\\"id\\\":2,\\\"option\\\":\\\"False\\\",\\\"is_correct\\\":false}]\",\"answer\":\"{\\\"id\\\":1,\\\"option\\\":\\\"True\\\",\\\"is_correct\\\":true}\",\"category\":\"True\\/False\",\"created_by\":\"Prof 2\",\"last_updated\":\"0000-00-00 00:00:00\",\"date_created\":\"2025-02-12 14:47:38\",\"subject\":\"Physical Education II\",\"status\":\"1\"},{\"id\":\"3\",\"question\":\"Who is first president of Philippine Republic?\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"Emilio Aguinaldo\\\",\\\"is_correct\\\":true}]\",\"answer\":\"{\\\"id\\\":1,\\\"option\\\":\\\"Emilio Aguinaldo\\\",\\\"is_correct\\\":true}\",\"category\":\"Identification\",\"created_by\":\"Prof 2\",\"last_updated\":\"0000-00-00 00:00:00\",\"date_created\":\"2025-02-12 14:48:50\",\"subject\":\"Physical Education II\",\"status\":\"1\"},{\"id\":\"4\",\"question\":\"Give 3 phases of matter\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"Solid\\\",\\\"is_correct\\\":true},{\\\"id\\\":2,\\\"option\\\":\\\"Liquid\\\",\\\"is_correct\\\":true},{\\\"id\\\":3,\\\"option\\\":\\\"Gas\\\",\\\"is_correct\\\":true}]\",\"answer\":\"{\\\"id\\\":1,\\\"option\\\":\\\"Solid\\\",\\\"is_correct\\\":true}\",\"category\":\"Enumeration\",\"created_by\":\"Prof 2\",\"last_updated\":\"0000-00-00 00:00:00\",\"date_created\":\"2025-02-12 14:50:49\",\"subject\":\"Physical Education II\",\"status\":\"1\"},{\"id\":\"5\",\"question\":\"asdasds\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"asdasd\\\",\\\"is_correct\\\":true}]\",\"answer\":\"{\\\"id\\\":1,\\\"option\\\":\\\"asdasd\\\",\\\"is_correct\\\":true}\",\"category\":\"Identification\",\"created_by\":\"Admin Test\",\"last_updated\":\"0000-00-00 00:00:00\",\"date_created\":\"2025-02-12 16:18:37\",\"subject\":\"none\",\"status\":\"1\"}]', 'Admin Test', '2025-02-14 23:08:24', '2025-02-14 23:08:24', 'Approved', 1),
(4, 'This is sample Exam', 'Computer Programming', '528421', '[{\"id\":\"2\",\"question\":\"What is love?\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"True\\\",\\\"is_correct\\\":true},{\\\"id\\\":2,\\\"option\\\":\\\"False\\\",\\\"is_correct\\\":false}]\",\"answer\":\"{\\\"id\\\":1,\\\"option\\\":\\\"True\\\",\\\"is_correct\\\":true}\",\"category\":\"True\\/False\",\"created_by\":\"Prof 2\",\"last_updated\":\"0000-00-00 00:00:00\",\"date_created\":\"2025-02-12 14:47:38\",\"subject\":\"Physical Education II\",\"status\":\"1\"},{\"id\":\"3\",\"question\":\"Who is first president of Philippine Republic?\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"Emilio Aguinaldo\\\",\\\"is_correct\\\":true}]\",\"answer\":\"{\\\"id\\\":1,\\\"option\\\":\\\"Emilio Aguinaldo\\\",\\\"is_correct\\\":true}\",\"category\":\"Identification\",\"created_by\":\"Prof 2\",\"last_updated\":\"0000-00-00 00:00:00\",\"date_created\":\"2025-02-12 14:48:50\",\"subject\":\"Physical Education II\",\"status\":\"1\"},{\"id\":\"8\",\"question\":\"What is the largest planet in the Solar System?\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"Earth\\\",\\\"is_correct\\\":false},{\\\"id\\\":2,\\\"option\\\":\\\"Mars\\\",\\\"is_correct\\\":false},{\\\"id\\\":3,\\\"option\\\":\\\"Jupiter\\\",\\\"is_correct\\\":true},{\\\"id\\\":4,\\\"option\\\":\\\"Venus\\\",\\\"is_correct\\\":false}]\",\"answer\":\"Jupiter\",\"category\":\"Multiple\",\"created_by\":\"Test\",\"last_updated\":\"2025-02-13 11:49:12\",\"date_created\":\"2025-02-13 11:49:12\",\"subject\":\"Astronomy\",\"status\":\"1\"},{\"id\":\"9\",\"question\":\"Which element has the atomic number 1?\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"Oxygen\\\",\\\"is_correct\\\":false},{\\\"id\\\":2,\\\"option\\\":\\\"Hydrogen\\\",\\\"is_correct\\\":true},{\\\"id\\\":3,\\\"option\\\":\\\"Helium\\\",\\\"is_correct\\\":false},{\\\"id\\\":4,\\\"option\\\":\\\"Carbon\\\",\\\"is_correct\\\":false}]\",\"answer\":\"Hydrogen\",\"category\":\"Multiple\",\"created_by\":\"Test\",\"last_updated\":\"2025-02-13 11:49:12\",\"date_created\":\"2025-02-13 11:49:12\",\"subject\":\"Chemistry\",\"status\":\"1\"},{\"id\":\"10\",\"question\":\"Who wrote \\\"Romeo and Juliet\\\"?\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"William Shakespeare\\\",\\\"is_correct\\\":true},{\\\"id\\\":2,\\\"option\\\":\\\"Charles Dickens\\\",\\\"is_correct\\\":false},{\\\"id\\\":3,\\\"option\\\":\\\"Mark Twain\\\",\\\"is_correct\\\":false},{\\\"id\\\":4,\\\"option\\\":\\\"J.K. Rowling\\\",\\\"is_correct\\\":false}]\",\"answer\":\"William Shakespeare\",\"category\":\"Multiple\",\"created_by\":\"Prof 2\",\"last_updated\":\"2025-02-13 11:49:12\",\"date_created\":\"2025-02-13 11:49:12\",\"subject\":\"Literature\",\"status\":\"1\"},{\"id\":\"11\",\"question\":\"What is the currency of Japan?\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"Yuan\\\",\\\"is_correct\\\":false},{\\\"id\\\":2,\\\"option\\\":\\\"Won\\\",\\\"is_correct\\\":false},{\\\"id\\\":3,\\\"option\\\":\\\"Yen\\\",\\\"is_correct\\\":true},{\\\"id\\\":4,\\\"option\\\":\\\"Ringgit\\\",\\\"is_correct\\\":false}]\",\"answer\":\"Yen\",\"category\":\"Multiple\",\"created_by\":\"Prof 2\",\"last_updated\":\"2025-02-13 11:49:12\",\"date_created\":\"2025-02-13 11:49:12\",\"subject\":\"Economics\",\"status\":\"1\"},{\"id\":\"12\",\"question\":\"How many continents are there on Earth?\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"5\\\",\\\"is_correct\\\":false},{\\\"id\\\":2,\\\"option\\\":\\\"6\\\",\\\"is_correct\\\":false},{\\\"id\\\":3,\\\"option\\\":\\\"7\\\",\\\"is_correct\\\":true},{\\\"id\\\":4,\\\"option\\\":\\\"8\\\",\\\"is_correct\\\":false}]\",\"answer\":\"7\",\"category\":\"Multiple\",\"created_by\":\"Prof 2\",\"last_updated\":\"2025-02-13 11:49:12\",\"date_created\":\"2025-02-13 11:49:12\",\"subject\":\"Geography\",\"status\":\"1\"},{\"id\":\"13\",\"question\":\"The Great Wall of China is visible from space.\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"True\\\",\\\"is_correct\\\":false},{\\\"id\\\":2,\\\"option\\\":\\\"False\\\",\\\"is_correct\\\":true}]\",\"answer\":\"False\",\"category\":\"True\\/False\",\"created_by\":\"Prof 2\",\"last_updated\":\"2025-02-13 11:49:12\",\"date_created\":\"2025-02-13 11:49:12\",\"subject\":\"History\",\"status\":\"1\"},{\"id\":\"14\",\"question\":\"Sound travels faster in water than in air.\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"True\\\",\\\"is_correct\\\":true},{\\\"id\\\":2,\\\"option\\\":\\\"False\\\",\\\"is_correct\\\":false}]\",\"answer\":\"True\",\"category\":\"True\\/False\",\"created_by\":\"Prof 2\",\"last_updated\":\"2025-02-13 11:49:12\",\"date_created\":\"2025-02-13 11:49:12\",\"subject\":\"Physics\",\"status\":\"1\"},{\"id\":\"24\",\"question\":\"What is C++\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"121\\\",\\\"is_correct\\\":true}]\",\"answer\":\"{\\\"id\\\":1,\\\"option\\\":\\\"121\\\",\\\"is_correct\\\":true}\",\"category\":\"Identification\",\"created_by\":\"Ariel Jericko Gacilo\",\"last_updated\":\"0000-00-00 00:00:00\",\"date_created\":\"2025-02-14 15:22:25\",\"subject\":\"Computer Programming\",\"status\":\"1\"},{\"id\":\"23\",\"question\":\"Quiestion 4545\",\"options\":\"[{\\\"id\\\":1,\\\"option\\\":\\\"True\\\",\\\"is_correct\\\":true},{\\\"id\\\":2,\\\"option\\\":\\\"False\\\",\\\"is_correct\\\":false}]\",\"answer\":\"{\\\"id\\\":1,\\\"option\\\":\\\"True\\\",\\\"is_correct\\\":true}\",\"category\":\"True\\/False\",\"created_by\":\"Prof 2\",\"last_updated\":\"0000-00-00 00:00:00\",\"date_created\":\"2025-02-14 06:35:47\",\"subject\":\"Physical Education II\",\"status\":\"1\"}]', 'Admin Test', '2025-02-14 23:25:47', '2025-02-14 23:25:47', 'Approved', 1);

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `options` text NOT NULL,
  `answer` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `classification` varchar(255) NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `last_updated` datetime NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `subject` varchar(255) NOT NULL,
  `terms` varchar(255) NOT NULL DEFAULT '[]',
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`id`, `question`, `options`, `answer`, `category`, `classification`, `created_by`, `last_updated`, `date_created`, `subject`, `terms`, `status`) VALUES
(7, 'PHASE', '[{\"id\":1,\"option\":\"22\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"22\",\"is_correct\":true}]', 'Identification', 'Application', 'Coordinator 1', '2025-02-26 16:15:00', '2025-02-12 16:33:44', 'Mathematics', '[\"Midterms\",\"Finals\",\"Prelims\"]', 1),
(8, 'What is the largest planet in the Solar System?', '[{\"id\":1,\"option\":\"Earth\",\"is_correct\":false},{\"id\":2,\"option\":\"Mars\",\"is_correct\":false},{\"id\":3,\"option\":\"Jupiter\",\"is_correct\":true},{\"id\":4,\"option\":\"Venus\",\"is_correct\":false}]', 'Jupiter', 'Multiple', 'Knowledge', 'Test', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Astronomy', '[]', 0),
(9, 'Which element has the atomic number 1?', '[{\"id\":1,\"option\":\"Oxygen\",\"is_correct\":false},{\"id\":2,\"option\":\"Hydrogen\",\"is_correct\":true},{\"id\":3,\"option\":\"Helium\",\"is_correct\":false},{\"id\":4,\"option\":\"Carbon\",\"is_correct\":false}]', 'Hydrogen', 'Multiple', 'Knowledge', 'Test', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Chemistry', '[]', 1),
(10, 'Who wrote \"Romeo and Juliet\"?', '[{\"id\":1,\"option\":\"William Shakespeare\",\"is_correct\":true},{\"id\":2,\"option\":\"Charles Dickens\",\"is_correct\":false},{\"id\":3,\"option\":\"Mark Twain\",\"is_correct\":false},{\"id\":4,\"option\":\"J.K. Rowling\",\"is_correct\":false}]', 'William Shakespeare', 'Multiple', 'Knowledge', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Literature', '[]', 1),
(20, 'What is AI??', '[{\"id\":1,\"option\":\"Chatgpt\",\"is_correct\":true},{\"id\":2,\"option\":\"Gemine\",\"is_correct\":false},{\"id\":3,\"option\":\"DeepSeek\",\"is_correct\":false},{\"id\":4,\"option\":\"Nova\",\"is_correct\":false}]', '{\"id\":1,\"option\":\"Chatgpt\",\"is_correct\":true}', 'Multiple', 'Knowledge', 'Prof Test', '0000-00-00 00:00:00', '2025-02-13 11:52:17', 'Computer Programming', '[]', 1),
(21, '2 What Is Java?', '[{\"id\":1,\"option\":\"Fun\",\"is_correct\":true},{\"id\":2,\"option\":\"TESTING\",\"is_correct\":true},{\"id\":3,\"option\":\"Good\",\"is_correct\":true},{\"id\":4,\"option\":\"Programming Language\",\"is_correct\":true},{\"id\":5,\"option\":\"Hard to lean\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"Fun\",\"is_correct\":true},{\"id\":2,\"option\":\"TESTING\",\"is_correct\":true},{\"id\":3,\"option\":\"Good\",\"is_correct\":true},{\"id\":4,\"option\":\"Programming Language\",\"is_correct\":true},{\"id\":5,\"option\":\"Hard to lean\",\"is_correct\":true}]', 'Enumeration', 'Synthesis', 'Coordinator 1', '2025-02-26 16:17:34', '2025-02-14 06:28:47', 'Mathematics', '[]', 1),
(32, 'What is the 3rd planet in our solar system?', '[{\"id\":1,\"option\":\"Earth\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"Earth\",\"is_correct\":true}', 'Identification', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-20 13:20:50', 'Computer Programming', '[]', 1),
(33, 'Our sun is hot?', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true},{\"id\":2,\"option\":\"False\",\"is_correct\":false}]', '{\"id\":1,\"option\":\"True\",\"is_correct\":true}', 'True/False', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-20 13:21:15', 'Computer Programming', '[]', 1),
(34, 'What is the largest planet in our solar system?', '[{\"id\":1,\"option\":\"Jupiter\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"Jupiter\",\"is_correct\":true}', 'Identification', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-20 22:04:21', 'Computer Programming', '[]', 1),
(35, 'What is REACT?', '[{\"id\":1,\"option\":\"React js is good\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"React js is good\",\"is_correct\":true}]', 'Identification', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-22 23:34:50', 'Computer Programming', '[\"Prelims\",\"Midterms\"]', 1),
(36, 'Gwapo ba ako', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true},{\"id\":2,\"option\":\"False\",\"is_correct\":false}]', '{\"id\":1,\"option\":\"True\",\"is_correct\":true}', 'True/False', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-22 23:35:52', 'Computer Programming', '[]', 1),
(37, 'What are the first letter in the alphabet?', '[{\"id\":1,\"option\":\"A\",\"is_correct\":true},{\"id\":2,\"option\":\"B\",\"is_correct\":true},{\"id\":3,\"option\":\"C\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"A\",\"is_correct\":true}', 'Enumeration', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-22 23:38:42', 'Computer Programming', '[]', 1),
(38, 'Test1', '[{\"id\":1,\"option\":\"23\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"23\",\"is_correct\":true}', 'Identification', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-22 23:47:44', 'Computer Programming', '[]', 1),
(39, 'Pacific Ocean is the largest ocean in planet?', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true},{\"id\":2,\"option\":\"False\",\"is_correct\":false}]', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true}]', 'True/False', 'Knowledge', 'Coordinator 1', '0000-00-00 00:00:00', '2025-02-23 08:32:59', 'Science', '[]', 1),
(40, 'Select even numbers', '[{\"id\":1,\"option\":\"2\",\"is_correct\":true},{\"id\":2,\"option\":\"3\",\"is_correct\":false},{\"id\":3,\"option\":\"4\",\"is_correct\":true},{\"id\":4,\"option\":\"5\",\"is_correct\":false}]', '[{\"id\":1,\"option\":\"2\",\"is_correct\":true},{\"id\":3,\"option\":\"4\",\"is_correct\":true}]', 'Multiple', 'Knowledge', 'Coordinator 1', '0000-00-00 00:00:00', '2025-02-23 08:35:11', 'Mathematics', '[]', 1),
(42, 'A set of instructions that a computer follows to perform a specific task.', '[{\"id\":1,\"option\":\"Program\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"Program\",\"is_correct\":true}]', 'Identification', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-24 13:59:53', 'Computer Programming', '[\"Midterms\",\"Prelims\"]', 1),
(43, 'What CPU stands for?', '[{\"id\":1,\"option\":\"Central Processing Unit\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"Central Processing Unit\",\"is_correct\":true}]', 'Identification', 'Knowledge', 'Administrator', '0000-00-00 00:00:00', '2025-02-24 20:10:33', 'Mathematics', '[\"Finals\",\"Midterms\"]', 1),
(44, 'What CPU stands for?', '[{\"id\":1,\"option\":\"Central Processing Unit\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"Central Processing Unit\",\"is_correct\":true}]', 'Identification', 'Knowledge', 'Administrator', '0000-00-00 00:00:00', '2025-02-24 20:11:20', 'Mathematics', '[\"Finals\",\"Midterms\"]', 1),
(45, 'What is CPU stands for?', '[{\"id\":1,\"option\":\"Central Process Unit\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"Central Process Unit\",\"is_correct\":true}]', 'Identification', 'Knowledge', 'Administrator', '0000-00-00 00:00:00', '2025-02-24 20:15:11', 'Mathematics', '[\"Midterms\",\"Finals\"]', 1),
(46, 'What is HTML?', '[{\"id\":1,\"option\":\"Hypertext Markup Language\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"Hypertext Markup Language\",\"is_correct\":true}]', 'Identification', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-24 20:16:15', 'Computer Programming', '[\"Prelims\"]', 1),
(47, 'A mouse is a fish that used in computer.', '[{\"id\":1,\"option\":\"True\",\"is_correct\":false},{\"id\":2,\"option\":\"False\",\"is_correct\":true}]', '[{\"id\":2,\"option\":\"False\",\"is_correct\":true}]', 'True/False', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-24 20:18:09', 'Computer Programming', '[\"Finals\",\"Midterms\",\"Prelims\"]', 1),
(48, 'You can click all keys in keyboard..', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true},{\"id\":2,\"option\":\"False\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true},{\"id\":2,\"option\":\"False\",\"is_correct\":true}]', 'True/False', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-24 20:18:49', 'Computer Programming', '[\"Finals\",\"Midterms\",\"Prelims\"]', 1),
(49, 'A keyboard is a device used for typing', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true},{\"id\":2,\"option\":\"False\",\"is_correct\":false}]', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true}]', 'True/False', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-24 20:20:39', 'Computer Programming', '[\"Midterms\",\"Finals\"]', 1),
(50, '1+1', '[{\"id\":1,\"option\":\"2\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"2\",\"is_correct\":true}]', 'Identification', 'Knowledge', 'Administrator', '0000-00-00 00:00:00', '2025-02-24 21:30:24', 'Mathematics', '[\"Prelims\",\"Midterms\",\"Finals\"]', 1),
(57, 'What is the meaning of AI', '[{\"id\":1,\"option\":\"Artificial Intelligence\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"Artificial Intelligence\",\"is_correct\":true}]', 'Identification', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-24 21:46:23', 'Computer Programming', '[\"Midterms\",\"Finals\",\"Prelims\"]', 1),
(58, 'What is the meaning of AI', '[{\"id\":1,\"option\":\"asdasd\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"asdasd\",\"is_correct\":true}]', 'Identification', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-24 21:46:43', 'Computer Programming', '[\"Midterms\",\"Finals\",\"Prelims\"]', 1),
(59, 'What is the meaning of AI', '[{\"id\":1,\"option\":\"kl\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"kl\",\"is_correct\":true}]', 'Identification', 'Knowledge', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-24 21:46:55', 'Computer Programming', '[\"Midterms\",\"Finals\",\"Prelims\"]', 1),
(79, 'test', '[{\"id\":1,\"option\":\"test\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"test\",\"is_correct\":true}]', 'Identification', 'Application', 'Coordinator 1', '0000-00-00 00:00:00', '2025-02-26 15:40:09', 'Mathematics', '[\"Midterms\"]', 1),
(80, '1+1', '[{\"id\":1,\"option\":\"2\",\"is_correct\":true}]', '[{\"id\":1,\"option\":\"2\",\"is_correct\":true}]', 'Identification', 'Synthesis', 'Coordinator 1', '2025-02-26 22:04:39', '2025-02-26 22:04:23', 'Mathematics', '[\"Prelims\",\"Midterms\",\"Finals\"]', 1);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`) VALUES
(1, 'Mathematics'),
(2, 'English'),
(3, 'Science'),
(4, 'Humanities'),
(5, 'Information Technology'),
(6, 'Engineering'),
(9, 'Computer Programming');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `assigned_subject` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `type`, `assigned_subject`, `username`, `password`, `avatar`, `status`) VALUES
(1, 'Administrator', 'Admin', 'none', 'admin', 'arieljericko', 'user_images/1/avatar_1.jpg', 1),
(2, 'Coordinator 1', 'Coordinator', 'none', 'coordinator', 'arieljericko', 'user_images/2/avatar_2.jpg', 0),
(3, 'Prof Test', 'Instructor', 'Computer Programming', 'prof1', 'testingf', 'https://randomuser.me/api/portraits/men/24.jpg', 1),
(4, 'Prof 2', 'Instructor', 'Physical Education II', 'prof2', '123', 'https://randomuser.me/api/portraits/women/22.jpg', 1),
(7, 'Ariel Jericko Gacilo', 'Instructor', 'Computer Programming', 'bokzgacilo', 'arieljericko', 'user_images/7/avatar_7.jpg', 0),
(8, 'Naruto', 'Instructor', 'Computer Programming', 'naruto', 'arieljericko', 'user_images/8/avatar_8.png', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `access_code` (`access_code`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exam`
--
ALTER TABLE `exam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
