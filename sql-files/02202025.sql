-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 20, 2025 at 08:17 AM
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
  `created_by` varchar(255) NOT NULL,
  `last_updated` datetime NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `subject` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`id`, `question`, `options`, `answer`, `category`, `created_by`, `last_updated`, `date_created`, `subject`, `status`) VALUES
(2, 'What is love?', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true},{\"id\":2,\"option\":\"False\",\"is_correct\":false}]', '{\"id\":1,\"option\":\"True\",\"is_correct\":true}', 'True/False', 'Prof 2', '0000-00-00 00:00:00', '2025-02-12 14:47:38', 'Physical Education II', 1),
(3, 'Who is first president of Philippine Republic?', '[{\"id\":1,\"option\":\"Emilio Aguinaldo\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"Emilio Aguinaldo\",\"is_correct\":true}', 'Identification', 'Prof 2', '0000-00-00 00:00:00', '2025-02-12 14:48:50', 'Physical Education II', 1),
(4, 'Give 3 phases of matter', '[{\"id\":1,\"option\":\"Solid\",\"is_correct\":true},{\"id\":2,\"option\":\"Liquid\",\"is_correct\":true},{\"id\":3,\"option\":\"Gas\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"Solid\",\"is_correct\":true}', 'Enumeration', 'Prof 2', '0000-00-00 00:00:00', '2025-02-12 14:50:49', 'Physical Education II', 1),
(5, 'asdasds', '[{\"id\":1,\"option\":\"asdasd\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"asdasd\",\"is_correct\":true}', 'Identification', 'Admin Test', '0000-00-00 00:00:00', '2025-02-12 16:18:37', 'none', 1),
(6, 'asdasds', '[{\"id\":1,\"option\":\"2131232\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"2131232\",\"is_correct\":true}', 'Identification', 'Admin Test', '0000-00-00 00:00:00', '2025-02-12 16:18:41', 'none', 1),
(7, 'phase', '[{\"id\":1,\"option\":\"22\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"22\",\"is_correct\":true}', 'Identification', 'Admin Test', '0000-00-00 00:00:00', '2025-02-12 16:33:44', 'none', 1),
(8, 'What is the largest planet in the Solar System?', '[{\"id\":1,\"option\":\"Earth\",\"is_correct\":false},{\"id\":2,\"option\":\"Mars\",\"is_correct\":false},{\"id\":3,\"option\":\"Jupiter\",\"is_correct\":true},{\"id\":4,\"option\":\"Venus\",\"is_correct\":false}]', 'Jupiter', 'Multiple', 'Test', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Astronomy', 1),
(9, 'Which element has the atomic number 1?', '[{\"id\":1,\"option\":\"Oxygen\",\"is_correct\":false},{\"id\":2,\"option\":\"Hydrogen\",\"is_correct\":true},{\"id\":3,\"option\":\"Helium\",\"is_correct\":false},{\"id\":4,\"option\":\"Carbon\",\"is_correct\":false}]', 'Hydrogen', 'Multiple', 'Test', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Chemistry', 1),
(10, 'Who wrote \"Romeo and Juliet\"?', '[{\"id\":1,\"option\":\"William Shakespeare\",\"is_correct\":true},{\"id\":2,\"option\":\"Charles Dickens\",\"is_correct\":false},{\"id\":3,\"option\":\"Mark Twain\",\"is_correct\":false},{\"id\":4,\"option\":\"J.K. Rowling\",\"is_correct\":false}]', 'William Shakespeare', 'Multiple', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Literature', 1),
(11, 'What is the currency of Japan?', '[{\"id\":1,\"option\":\"Yuan\",\"is_correct\":false},{\"id\":2,\"option\":\"Won\",\"is_correct\":false},{\"id\":3,\"option\":\"Yen\",\"is_correct\":true},{\"id\":4,\"option\":\"Ringgit\",\"is_correct\":false}]', 'Yen', 'Multiple', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Economics', 1),
(12, 'How many continents are there on Earth?', '[{\"id\":1,\"option\":\"5\",\"is_correct\":false},{\"id\":2,\"option\":\"6\",\"is_correct\":false},{\"id\":3,\"option\":\"7\",\"is_correct\":true},{\"id\":4,\"option\":\"8\",\"is_correct\":false}]', '7', 'Multiple', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Geography', 1),
(13, 'The Great Wall of China is visible from space.', '[{\"id\":1,\"option\":\"True\",\"is_correct\":false},{\"id\":2,\"option\":\"False\",\"is_correct\":true}]', 'False', 'True/False', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'History', 1),
(14, 'Sound travels faster in water than in air.', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true},{\"id\":2,\"option\":\"False\",\"is_correct\":false}]', 'True', 'True/False', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Physics', 1),
(15, 'The capital of Australia is Sydney.', '[{\"id\":1,\"option\":\"True\",\"is_correct\":false},{\"id\":2,\"option\":\"False\",\"is_correct\":true}]', 'False', 'True/False', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Geography', 1),
(16, 'Who discovered gravity?', '[{\"id\":1,\"option\":\"Isaac Newton\",\"is_correct\":true}]', 'Isaac Newton', 'Identification', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Physics', 1),
(17, 'What is the capital of Italy?', '[{\"id\":1,\"option\":\"Rome\",\"is_correct\":true}]', 'Rome', 'Identification', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Geography', 1),
(18, 'List 3 primary colors.', '[{\"id\":1,\"option\":\"Red\",\"is_correct\":true},{\"id\":2,\"option\":\"Blue\",\"is_correct\":true},{\"id\":3,\"option\":\"Yellow\",\"is_correct\":true}]', 'Red, Blue, Yellow', 'Enumeration', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Art', 1),
(19, 'Name 3 states of water.', '[{\"id\":1,\"option\":\"Solid\",\"is_correct\":true},{\"id\":2,\"option\":\"Liquid\",\"is_correct\":true},{\"id\":3,\"option\":\"Gas\",\"is_correct\":true}]', 'Solid, Liquid, Gas', 'Enumeration', 'Prof 2', '2025-02-13 11:49:12', '2025-02-13 11:49:12', 'Science', 1),
(20, 'What is AI??', '[{\"id\":1,\"option\":\"Chatgpt\",\"is_correct\":true},{\"id\":2,\"option\":\"Gemine\",\"is_correct\":false},{\"id\":3,\"option\":\"DeepSeek\",\"is_correct\":false},{\"id\":4,\"option\":\"Nova\",\"is_correct\":false}]', '{\"id\":1,\"option\":\"Chatgpt\",\"is_correct\":true}', 'Multiple', 'Prof Test', '0000-00-00 00:00:00', '2025-02-13 11:52:17', 'Computer Programming', 1),
(21, '2 What Is Java?', '[{\"id\":1,\"option\":\"Fun\",\"is_correct\":true},{\"id\":2,\"option\":\"Good\",\"is_correct\":true},{\"id\":3,\"option\":\"Programming Language\",\"is_correct\":true},{\"id\":4,\"option\":\"Hard to lean\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"Fun\",\"is_correct\":true}', 'Enumeration', 'Prof Test', '0000-00-00 00:00:00', '2025-02-14 06:28:47', 'Computer Programming', 1),
(22, 'Quiestion 222', '[{\"id\":1,\"option\":\"asdasdasdasdasd\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"asdasdasdasdasd\",\"is_correct\":true}', 'Identification', 'Prof Test', '0000-00-00 00:00:00', '2025-02-14 06:35:47', 'Computer Programming', 1),
(23, 'Quiestion 4545', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true},{\"id\":2,\"option\":\"False\",\"is_correct\":false}]', '{\"id\":1,\"option\":\"True\",\"is_correct\":true}', 'True/False', 'Prof 2', '0000-00-00 00:00:00', '2025-02-14 06:35:47', 'Physical Education II', 1),
(32, 'What is the 3rd planet in our solar system?', '[{\"id\":1,\"option\":\"Earth\",\"is_correct\":true}]', '{\"id\":1,\"option\":\"Earth\",\"is_correct\":true}', 'Identification', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-20 13:20:50', 'Computer Programming', 1),
(33, 'Our sun is hot?', '[{\"id\":1,\"option\":\"True\",\"is_correct\":true},{\"id\":2,\"option\":\"False\",\"is_correct\":false}]', '{\"id\":1,\"option\":\"True\",\"is_correct\":true}', 'True/False', 'Ariel Jericko Gacilo', '0000-00-00 00:00:00', '2025-02-20 13:21:15', 'Computer Programming', 1);

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
(1, 'Administrator', 'Admin', 'none', 'admin', '123', 'https://randomuser.me/api/portraits/women/60.jpg', 1),
(2, 'Coordinator 1', 'Coordinator', 'none', 'coordinator', '123', 'https://randomuser.me/api/portraits/men/27.jpg', 0),
(3, 'Prof Test', 'Instructor', 'Computer Programming', 'prof1', 'testingf', 'https://randomuser.me/api/portraits/men/24.jpg', 0),
(4, 'Prof 2', 'Instructor', 'Physical Education II', 'prof2', '123', 'https://randomuser.me/api/portraits/women/22.jpg', 1),
(7, 'Ariel Jericko Gacilo', 'Instructor', 'Computer Programming', 'bokzgacilo', 'arieljericko', 'https://randomuser.me/api/portraits/women/24.jpg', 0);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
