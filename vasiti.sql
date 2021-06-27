-- phpMyAdmin SQL Dump
-- version 4.9.7deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 27, 2021 at 12:10 PM
-- Server version: 8.0.25-0ubuntu0.20.10.1
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vasiti`
--

-- --------------------------------------------------------

--
-- Table structure for table `Categories`
--

CREATE TABLE `Categories` (
  `CategoryID` int NOT NULL,
  `CategoryName` varchar(58) NOT NULL,
  `Description` mediumtext,
  `CategorySlug` varchar(68) NOT NULL,
  `Image` varchar(58) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Categories`
--

INSERT INTO `Categories` (`CategoryID`, `CategoryName`, `Description`, `CategorySlug`, `Image`) VALUES
(1, 'Smartphone', 'Mobile phones', 'smartphone', 'smartphone.png'),
(2, 'TV', 'TVs', 'tv', 'tv.png'),
(3, 'Computers', 'Computers', 'computers', 'computers.png'),
(4, 'Game Console', 'Game Consoles', 'game-console', 'game-console.png'),
(5, 'Networks', 'Networks', 'networks', 'networks.png'),
(6, 'Software', 'Software', 'software', 'software.png'),
(7, 'Camera', 'Cameras', 'camera', 'camera.png'),
(8, 'Cables', 'Cables', 'cables', 'cables.png');

-- --------------------------------------------------------

--
-- Table structure for table `Order Details`
--

CREATE TABLE `Order Details` (
  `OrderID` int NOT NULL,
  `ProductID` int NOT NULL,
  `Quantity` smallint NOT NULL DEFAULT '1',
  `Total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `OrderID` int NOT NULL,
  `UserID` int NOT NULL,
  `AddressID` int NOT NULL,
  `SubTotal` decimal(10,2) DEFAULT NULL,
  `Discount` decimal(10,2) DEFAULT NULL,
  `ShippingFee` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `OrderDate` datetime DEFAULT NULL,
  `Status` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `ProductID` int NOT NULL,
  `product_name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CategoryID` int DEFAULT NULL,
  `ProductPrice` decimal(10,2) DEFAULT '0.00',
  `UnitsInStock` smallint DEFAULT '0',
  `product_description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ManufactureYear` smallint NOT NULL,
  `Image` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_varieties` json DEFAULT NULL,
  `ProductSlug` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date_uploaded` datetime DEFAULT NULL,
  `date_edited` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `product_name`, `CategoryID`, `ProductPrice`, `UnitsInStock`, `product_description`, `ManufactureYear`, `Image`, `product_varieties`, `ProductSlug`, `date_uploaded`, `date_edited`) VALUES
(1, 'iPhone 6', 1, '850.52', 18, 'Lateast', 2015, '1.png', NULL, 'iphone-6', NULL, NULL),
(2, 'iPhone 5S', 1, '500.22', 15, 'Newer', 2014, '2.png', NULL, 'iphone-5s', NULL, NULL),
(3, 'Sony 40 inches', 2, '600.56', 10, 'Sony Full HD', 2013, '3.png', NULL, 'sony-40-inches', NULL, NULL),
(4, 'Samsung 32 inches', 2, '350.89', 12, 'Samsung LED', 2012, '4.png', NULL, 'samsung-32-inches', NULL, NULL),
(5, 'Lenovo PC', 3, '1000.99', 8, 'Intel-NVIDA-Logitech', 2011, '5.png', NULL, 'lenovo-pc', NULL, NULL),
(6, 'Macbook Pro', 3, '2300.89', 6, 'Apple Early 2010', 2010, '6.png', NULL, 'macbook-pro', NULL, NULL),
(7, 'XBOX Five', 4, '600.88', 12, 'Microsoft Future', 2009, '7.png', NULL, 'xbox-five', NULL, NULL),
(8, 'PlayStation 6', 4, '522.99', 15, 'Sony Tomorrow', 2008, '8.png', NULL, 'playstation-6', NULL, NULL),
(9, 'Linksys 123', 5, '200.55', 16, 'Modem ADSL 8+', 2001, '9.png', NULL, 'linksys-123', NULL, NULL),
(10, 'Netgear 456', 5, '43.33', 22, 'Router Full Speed', 2005, '10.png', NULL, 'netgear-456', NULL, NULL),
(11, 'Adobe Photoshop CC', 6, '120.89', 17, 'Adobe Power', 2018, '11.png', NULL, 'adobe-photoshop-cc', NULL, NULL),
(12, 'Canon 2222D', 7, '1209.59', 16, 'Canon Powerful 3D', 2019, '12.png', NULL, 'canon-2222d', NULL, NULL),
(13, 'HDMI 5.0', 8, '5.88', 14, 'HDMI High Speed Standard', 2002, '13.png', '[{\"id\": \"1\", \"size\": \"Variation 1\", \"color\": \"yellow\", \"price\": \"1000\", \"images\": [\"/uploads/31154117_951041738411698_1541130520316870656_n.jpg\", \"/uploads/83882294_2684390684941522_7434926450546835456_n.jpg\", \"/uploads/88888888                                            \"], \"quantity\": \"11\"}]', 'hdmi-5.0', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int NOT NULL,
  `FullName` varchar(50) NOT NULL,
  `StreetAddress` varchar(255) NOT NULL,
  `PostCode` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `City` varchar(28) NOT NULL,
  `Country` varchar(28) NOT NULL,
  `Phone` varchar(12) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Username` varchar(28) DEFAULT NULL,
  `Password` varchar(158) DEFAULT NULL,
  `Admin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FullName`, `StreetAddress`, `PostCode`, `City`, `Country`, `Phone`, `Email`, `Username`, `Password`, `Admin`) VALUES
(3, 'Efetobor Agbontaen', 'Suite 27 Shekina Plaza, 4 Etete Road G.R.A Benin City, Edo, Nigeria.', '110001', 'Benin', 'Nigeria', '09081552310', 'agbontaenefe@gmail.com', 'admin', '$2a$10$Axh0Tr5cQM7rljsY.LvmduyszmaZtsB2GQz7QuOPLixqxnqQVEqZy', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Categories`
--
ALTER TABLE `Categories`
  ADD PRIMARY KEY (`CategoryID`),
  ADD KEY `CategoryName` (`CategoryName`);

--
-- Indexes for table `Order Details`
--
ALTER TABLE `Order Details`
  ADD PRIMARY KEY (`OrderID`,`ProductID`),
  ADD KEY `FK_Order_Details_Products` (`ProductID`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `FK_Orders_Users` (`UserID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `FK_Products_Categories` (`CategoryID`),
  ADD KEY `ProductName` (`product_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Categories`
--
ALTER TABLE `Categories`
  MODIFY `CategoryID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `OrderID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Order Details`
--
ALTER TABLE `Order Details`
  ADD CONSTRAINT `FK_Order_Details_Orders` FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Order_Details_Products` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`) ON DELETE CASCADE;

--
-- Constraints for table `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `FK_Orders_Users` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FK_Products_Categories` FOREIGN KEY (`CategoryID`) REFERENCES `Categories` (`CategoryID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
