/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `CourseCategories`;
CREATE TABLE `CourseCategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CourseCategories_categoryCode_key` (`categoryCode`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `Courses`;
CREATE TABLE `Courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alias` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdDate` datetime(3) NOT NULL,
  `studentCount` int NOT NULL DEFAULT '0',
  `creatorId` int DEFAULT NULL,
  `categoryId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Courses_courseCode_key` (`courseCode`),
  KEY `Courses_creatorId_fkey` (`creatorId`),
  KEY `Courses_categoryId_fkey` (`categoryId`),
  CONSTRAINT `Courses_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `CourseCategories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Courses_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `Enrollment`;
CREATE TABLE `Enrollment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `courseId` int NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNumber` int NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userTypeId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Users_username_key` (`username`),
  UNIQUE KEY `Users_email_key` (`email`),
  KEY `Users_userTypeId_fkey` (`userTypeId`),
  CONSTRAINT `Users_userTypeId_fkey` FOREIGN KEY (`userTypeId`) REFERENCES `UserTypes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `UserTypes`;
CREATE TABLE `UserTypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userTypeCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userTypeName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserTypes_userTypeCode_key` (`userTypeCode`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `CourseCategories` (`id`, `categoryCode`, `categoryName`) VALUES
(1, 'FE', 'Lập trình Frontend');
INSERT INTO `CourseCategories` (`id`, `categoryCode`, `categoryName`) VALUES
(2, 'BE', 'Lập trình Backend');
INSERT INTO `CourseCategories` (`id`, `categoryCode`, `categoryName`) VALUES
(3, 'FS', 'Fullstack');
INSERT INTO `CourseCategories` (`id`, `categoryCode`, `categoryName`) VALUES
(4, 'DB', 'Cơ sở dữ liệu');
INSERT INTO `CourseCategories` (`id`, `categoryCode`, `categoryName`) VALUES
(5, 'AI', 'Trí tuệ nhân tạo');
INSERT INTO `Courses` (`id`, `courseCode`, `alias`, `courseName`, `title`, `description`, `views`, `imageUrl`, `createdDate`, `studentCount`, `creatorId`, `categoryId`, `createdAt`, `updatedAt`) VALUES
(1, 'FE001', 'reactjs', 'ReactJS Cơ Bản', 'Học ReactJS từ đầu', 'Khóa học ReactJS cho người mới bắt đầu', 150, 'https://example.com/images/reactjs.png', '2024-01-15 00:00:00.000', 20, 1, 1, '2025-03-27 04:59:53.000', '2025-03-27 04:59:53.000');
INSERT INTO `Courses` (`id`, `courseCode`, `alias`, `courseName`, `title`, `description`, `views`, `imageUrl`, `createdDate`, `studentCount`, `creatorId`, `categoryId`, `createdAt`, `updatedAt`) VALUES
(2, 'BE001', 'nodejs', 'NodeJS Cơ Bản', 'Học NodeJS từ đầu', 'Khóa học NodeJS cho người mới bắt đầu', 200, 'https://example.com/images/nodejs.png', '2024-02-10 00:00:00.000', 30, 1, 2, '2025-03-27 04:59:53.000', '2025-03-27 04:59:53.000');
INSERT INTO `Courses` (`id`, `courseCode`, `alias`, `courseName`, `title`, `description`, `views`, `imageUrl`, `createdDate`, `studentCount`, `creatorId`, `categoryId`, `createdAt`, `updatedAt`) VALUES
(3, 'FS001', 'fullstack-js', 'Fullstack JavaScript', 'Học Fullstack JS', 'Khóa học Fullstack với JS', 300, 'https://example.com/images/fullstack.png', '2024-03-20 00:00:00.000', 25, 2, 3, '2025-03-27 04:59:53.000', '2025-03-27 04:59:53.000');
INSERT INTO `Courses` (`id`, `courseCode`, `alias`, `courseName`, `title`, `description`, `views`, `imageUrl`, `createdDate`, `studentCount`, `creatorId`, `categoryId`, `createdAt`, `updatedAt`) VALUES
(4, 'DB001', 'mysql', 'MySQL Cơ Bản', 'Học MySQL từ đầu', 'Khóa học cơ bản về MySQL', 120, 'https://example.com/images/mysql.png', '2024-04-05 00:00:00.000', 15, 2, 4, '2025-03-27 04:59:53.000', '2025-03-27 04:59:53.000');
INSERT INTO `Courses` (`id`, `courseCode`, `alias`, `courseName`, `title`, `description`, `views`, `imageUrl`, `createdDate`, `studentCount`, `creatorId`, `categoryId`, `createdAt`, `updatedAt`) VALUES
(5, 'AI001', 'ai-intro', 'Giới thiệu AI', 'Học AI cơ bản', 'Khóa học nhập môn AI', 180, 'https://example.com/images/ai.png', '2024-05-10 00:00:00.000', 10, 1, 5, '2025-03-27 04:59:53.000', '2025-03-27 04:59:53.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(1, 3, 1, 'approved', '2025-03-26 10:25:18.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(2, 3, 2, 'pending', '2025-03-26 10:25:18.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(3, 4, 3, 'approved', '2025-03-26 10:25:18.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(4, 4, 4, 'pending', '2025-03-26 10:25:18.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(5, 5, 5, 'approved', '2025-03-26 10:25:18.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(6, 3, 1, 'approved', '2025-03-26 10:26:52.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(7, 3, 2, 'pending', '2025-03-26 10:26:52.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(8, 4, 3, 'approved', '2025-03-26 10:26:52.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(9, 4, 4, 'pending', '2025-03-26 10:26:52.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(10, 5, 5, 'approved', '2025-03-26 10:26:52.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(11, 3, 1, 'approved', '2025-03-27 04:56:50.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(12, 3, 2, 'pending', '2025-03-27 04:56:50.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(13, 4, 3, 'approved', '2025-03-27 04:56:50.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(14, 4, 4, 'pending', '2025-03-27 04:56:50.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(15, 5, 5, 'approved', '2025-03-27 04:56:50.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(16, 3, 1, 'approved', '2025-03-27 04:59:53.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(17, 3, 2, 'pending', '2025-03-27 04:59:53.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(18, 4, 3, 'approved', '2025-03-27 04:59:53.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(19, 4, 4, 'pending', '2025-03-27 04:59:53.000');
INSERT INTO `Enrollment` (`id`, `userId`, `courseId`, `status`, `createdAt`) VALUES
(20, 5, 5, 'approved', '2025-03-27 04:59:53.000');
INSERT INTO `Users` (`id`, `username`, `fullName`, `password`, `phoneNumber`, `email`, `userTypeId`, `createdAt`, `updatedAt`) VALUES
(1, 'giaovu1', 'Nguyen Thi Hoa', 'giaovu123', 912345678, 'giaovu1@example.com', 1, '2025-03-27 04:59:53.000', '2025-03-27 04:59:53.000');
INSERT INTO `Users` (`id`, `username`, `fullName`, `password`, `phoneNumber`, `email`, `userTypeId`, `createdAt`, `updatedAt`) VALUES
(2, 'giaovu2', 'Tran Van Nam', 'giaovu456', 987654321, 'giaovu2@example.com', 1, '2025-03-27 04:59:53.000', '2025-03-27 04:59:53.000');
INSERT INTO `Users` (`id`, `username`, `fullName`, `password`, `phoneNumber`, `email`, `userTypeId`, `createdAt`, `updatedAt`) VALUES
(3, 'hocvien1', 'Le Thi Mai', 'hocvien123', 923456789, 'hocvien1@example.com', 2, '2025-03-27 04:59:53.000', '2025-03-27 04:59:53.000');
INSERT INTO `Users` (`id`, `username`, `fullName`, `password`, `phoneNumber`, `email`, `userTypeId`, `createdAt`, `updatedAt`) VALUES
(4, 'hocvien2', 'Pham Van Long', 'hocvien456', 934567890, 'hocvien2@example.com', 2, '2025-03-27 04:59:53.000', '2025-03-27 04:59:53.000');
INSERT INTO `Users` (`id`, `username`, `fullName`, `password`, `phoneNumber`, `email`, `userTypeId`, `createdAt`, `updatedAt`) VALUES
(5, 'hocvien3', 'Hoang Thi Lan', 'hocvien789', 945678901, 'hocvien3@example.com', 2, '2025-03-27 04:59:53.000', '2025-03-27 04:59:53.000');
INSERT INTO `UserTypes` (`id`, `userTypeCode`, `userTypeName`) VALUES
(1, 'GV', 'Giáo vụ');
INSERT INTO `UserTypes` (`id`, `userTypeCode`, `userTypeName`) VALUES
(2, 'HV', 'Học viên');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;