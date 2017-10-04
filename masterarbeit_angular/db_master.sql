-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 04. Okt 2017 um 10:49
-- Server-Version: 10.1.16-MariaDB
-- PHP-Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `db_master`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `abhaengigkeiten`
--

CREATE TABLE `abhaengigkeiten` (
  `ab_id` int(11) NOT NULL,
  `ab_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ab_source` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `t_id` int(11) NOT NULL,
  `dependsOn` int(11) NOT NULL,
  `f_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `abhaengigkeiten`
--

INSERT INTO `abhaengigkeiten` (`ab_id`, `ab_type`, `ab_source`, `t_id`, `dependsOn`, `f_id`) VALUES
(14, 'Direktionale', 'Projekt', 21, 23, NULL),
(20, 'Feature-Direktionale', 'Dokumentation', 1, 11, 20),
(21, 'Feature-Direktionale', 'Dokumentation', 1, 36, 19),
(22, 'Direktionale', 'Dokumentation', 36, 37, NULL),
(23, 'Feature-Direktionale', 'Projekt', 1, 13, 24),
(24, 'Direktionale', 'Projekt', 1, 40, NULL),
(25, 'Feature-Direktionale', 'Projekt', 1, 44, NULL),
(26, 'Direktionale', 'Dokumentation', 44, 37, NULL),
(27, 'Direktionale', 'Projekt', 1, 45, NULL),
(28, 'Direktionale', 'Dokumentation', 1, 37, NULL),
(29, 'Feature-direktionale', 'Dokumentation', 1, 49, 25),
(30, 'Direktionale', 'Projekt', 1, 50, NULL),
(31, 'Direktionale', 'Projekt', 1, 51, NULL),
(32, 'Direktionale', 'Projekt', 1, 52, NULL),
(33, 'Direktionale', 'Projekt', 1, 53, NULL),
(34, 'Direktionale', 'Dokumentation', 2, 31, NULL),
(37, 'Direktionale', 'Dokumentation', 18, 58, NULL),
(38, 'Feature-Direktionale', 'Dokumentation', 18, 17, NULL),
(39, 'Feature-Direktionale', 'Dokumentation', 18, 16, NULL),
(40, 'Dirketionale', 'Dokumentation', 60, 61, NULL),
(41, 'Direktionale', 'Stack Overflow', 65, 64, NULL),
(42, 'Feature-Direktionale', 'Projekte', 1, 63, 21),
(44, 'Feature-Direktionale', 'Projekt', 2, 66, 20),
(45, 'Feature-Direktionale', 'Projekt', 2, 11, 36);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `beziehungen`
--

CREATE TABLE `beziehungen` (
  `b_id` int(11) NOT NULL,
  `b_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `b_source` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `t_id` int(11) NOT NULL,
  `dependsOn` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `beziehungen`
--

INSERT INTO `beziehungen` (`b_id`, `b_type`, `b_source`, `t_id`, `dependsOn`) VALUES
(2, 'basedOn', 'Dokumentation', 2, 12),
(7, 'basedOn', 'Dokumentation', 1, 12),
(8, 'basedOn', 'StackOverflow', 22, 25),
(9, 'basedOn', 'Dokumentation', 22, 12),
(10, 'basedOn', 'Dokumentation', 22, 31),
(11, 'basedOn', 'Dokumentation', 22, 32),
(12, 'basedOn', 'Dokumentation', 41, 12),
(13, 'basedOn', 'Dokumentation', 52, 12),
(14, 'Alternative', 'Dokumentation', 1, 19),
(15, 'Alternative', 'Dokumentation', 19, 1),
(16, 'basedOn', 'Dokumentation', 54, 1),
(18, 'Ermöglichung', 'Dokumentation', 1, 54),
(19, 'basedOn', 'Dokumentation', 20, 32),
(20, 'Kombination', 'Projekt', 32, 31),
(21, 'Erweiterung', 'Projekt', 2, 27),
(22, 'Erweiterung', 'Projekt', 2, 13),
(23, 'Erweiterung', 'Projekt', 2, 22),
(24, 'Erweiterung', 'Dokumentation', 2, 27),
(25, 'Erweiterung', 'Dokumentation', 2, 28),
(26, 'Erweiterung', 'Dokumentation', 2, 30),
(27, 'basedOn', 'Dokumentation', 18, 17),
(28, 'Empfehlung', 'Dokumentation', 18, 59),
(29, 'Alternative', 'Stack Overflow', 59, 60),
(30, 'Kombination', 'Projekte', 18, 59),
(31, 'Erweiterung', 'Stack Overflow', 18, 65),
(32, 'Erweiterung', 'Projekte', 32, 47),
(35, 'Kombination', 'Projekte', 32, 47),
(36, 'Kombination', 'Projekte', 32, 12),
(37, 'Kombination', 'Projekte', 31, 12),
(38, 'Ermöglichung', 'Dokumentation', 2, 27),
(39, 'Ermöglichung', 'Dokumentation', 2, 28),
(40, 'Alternative', 'Stack Overflow', 27, 28),
(41, 'Kombination', 'Projekte', 2, 31),
(42, 'Kombination', 'Projekte', 2, 32),
(43, 'Kombination', 'Projekte', 1, 54),
(44, 'Kombination', 'Projekte', 1, 63),
(45, 'Kombination', 'Projekte', 63, 54),
(46, 'Alternative', 'Projekte', 2, 1),
(47, 'Alternative', 'Projekte', 2, 19),
(48, 'Alternative', 'Dokumentation', 1, 18),
(49, 'Alternative', 'Projekte', 19, 2),
(50, 'Alternative', 'Projekte', 18, 2),
(51, 'Alternative', 'Dokumentation', 19, 18),
(52, 'Kombination', 'Projekte', 2, 20),
(53, 'Kombination', 'Projekte', 20, 32),
(54, 'Kombination', 'Projekte', 47, 20),
(55, 'Alternative', 'Projekte', 47, 32);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `feature`
--

CREATE TABLE `feature` (
  `f_id` int(11) NOT NULL,
  `f_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `f_desc` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `feature`
--

INSERT INTO `feature` (`f_id`, `f_name`, `f_desc`) VALUES
(1, 'Zwei-Wege-Datenbindung', 'Mit Zwei-Wege-Datenbindung ist die Synchronisation der Daten zwischen View und Model \r\ngemeint. Datenänderungen in der View werden auch in Modal übertragen, und Änderungen im Modal werden ins View übertragen. '),
(2, 'MVC', 'Modal-View-Controller Muster '),
(3, 'Dependency Injection', 'Ist ein Software-Design-Muster, welches sich darum kuemmert, wie Komponenten ihre Abhaengigkeiten erhalten. '),
(4, 'Direktiven ', 'Direktiven erweitern den Sprachumfang von HTML'),
(5, 'Testing', 'Projekte sind testbar'),
(6, 'Expressions', 'Durch Expressions können Daten kombiniert und auch manipuliert werden'),
(7, 'Filter', 'Filterung von Listen oder Werten '),
(8, 'templates', ''),
(9, 'Animationen', 'Visuelle Animationen '),
(10, 'Routing', ''),
(11, 'Suchmaschinenoptimierung', ''),
(12, 'Deep Linking', ''),
(13, 'Formular Validierung', ''),
(14, 'Responsive', 'Responsive-Fähigkeit durch die Technologie'),
(15, 'Analytics', ''),
(17, 'Authentication/Login', ''),
(18, 'Visualisierung', ''),
(19, 'Internationalisierung', ''),
(20, 'OData', ''),
(21, 'UI-Elemente', ''),
(22, 'Volltextsuche', ''),
(23, 'Security', ''),
(24, 'Captacha', ''),
(25, 'JDBC', 'Java Database Connectivity (JDBC) ist eine Datenbankschnittstelle, die eine einheitliche Schnittstelle zu Datenbanken verschiedener Hersteller bietet und speziell auf relationale Datenbanken ausgerichtet ist.'),
(26, 'ODBC', 'Open Database Connectivity (ODBC) ist eine standardisierte Datenbankschnittstelle, die SQL als Datenbanksprache verwendet.'),
(27, 'JSON', 'JSON ist ein kompaktes Datenformat in einer einfach lesbaren Textform. Es dient dem Zweck des Datenaustauschs zwischen Anwendungen.');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `technologien`
--

CREATE TABLE `technologien` (
  `tech_id` int(11) NOT NULL,
  `tech_name` char(50) COLLATE utf8_unicode_ci NOT NULL,
  `tech_desc` varchar(1200) COLLATE utf8_unicode_ci NOT NULL,
  `tech_pro` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `tech_con` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `tech_links` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `tech_cat` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `tech_version` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `technologien`
--

INSERT INTO `technologien` (`tech_id`, `tech_name`, `tech_desc`, `tech_pro`, `tech_con`, `tech_links`, `tech_cat`, `tech_version`) VALUES
(1, 'SAPUI5', 'SAPUI5 ist ein JavaScript basiertes Framework um Web Anwendungen zu erstellen. Mit dem SAPUI5 JavaScript Toolkit können Entwickler die HTML 5 Web-Entwicklungsstandards verwenden.', 'Gute Dokumentation|viele UIs|Viele Features und Funktionen|Viele fertige UI-Elemente\n\n', 'hohe Lizenzkosten |Nicht enthaltene Funktionalität schwer integrierbar|starrer Aufbau\n', 'https://sapui5.hana.ondemand.com/| https://www.sap.com/community/topic/ui5.html', 'Framework', ''),
(2, 'AngularJs', 'AngularJS ist ein JavaScript-Webframework zur Erstellung von Single-Page-Webanwendungen nach dem MVC-Muster. Es wird als Open-Source-Framework von Google Inc. entwickelt.', 'Open-Source|einfach zu erlernen, wenn man bereits JavaScript kann|voll erweiterbar|sehr leicht, fremde Bibliotheken einzubinden|alle Features leicht modifizierbar|Viele Module|Geeignet für Single-Page-Applications|kein Boilerplate-Code|lose Kopplung', 'Suchmaschinenoptimierung schwierig | Neuere Version vorhanden (Angular)', 'https://angularjs.org/|https://docs.angularjs.org/guide/external-resources|http://ngmodules.org/', 'Framework', '1.6.5'),
(11, 'dataJs', '', 'schnell und einfach zu bedienen|\r\n', '', 'https://datajs.codeplex.com/|', 'library', ''),
(12, 'JavaScript', 'JavaScript ist eine Skriptsprache die häufig für Webanwendungen genutzt wird.', 'viele Libraries bauen auf JavaScript auf', '', 'htttps://www.javascript.com', 'language', ''),
(13, 'D3', 'D3.js is a JavaScript library for manipulating documents based on data. ', '', '', 'https://d3js.org/', 'library', '4.10.0'),
(14, 'NVD3', 'This project is an attempt to build re-usable charts and ', '', '', 'http://nvd3.org/', 'library', ''),
(15, 'PHP', 'PHP ist eine Skriptsprache. Wird im Bereich der Webentwicklung häufig verwendet um dynamische Webseiten zu entwickeln.', '', '', 'http://php.net', 'language', ''),
(16, 'Java', '', '', '', '', 'language', ''),
(17, 'Scala', 'Scala ist eine objektorientierte und funktionale Programmiersprache', '', '', 'https://www.scala-lang.org', 'language', ''),
(18, 'PlayFramework', 'Das Play! Framework ist ein modernes Open-Source-Framework für Java und Scala Web-Anwendungen . Das eine saubere Alternative zu aufgeblähten Enterprise Java Stacks bietet.', 'Java und/oder Scala Programmierung möglich | BigData Support|schnelle Entwicklungszeiten|gute Performanz', 'Teilweise schwieriger Erweiterbar durch JavaScript Bibliotheken', 'https://playframework.com/documentation/2.6.x/Installing', 'Framework', '2.6.x'),
(19, 'OpenUI5', 'Ein JavaScript Framework, welches als OpenSource Variante zur SAPUI5 entwickelt wurde', 'Open-Source', 'hat nicht alle Funktionen, die SAPUI5 hat', 'https://openui5.org/', 'Framework', ''),
(20, 'Twitter Bootstrap', 'Ist ein freies CSS-Framework', 'erleichtert die Gestaltung von Webanwendungen mit CSS3', '', 'http://getbootstrap.com/ | http://holdirbootstrap.de/', 'Framework', ''),
(21, 'Mobile Angular UI\n', 'Ist ein Modul für AngularJs um auf Features des Smartphones in der Anwendung nutzen zu können', '', '', 'http://mobileangularui.com/', 'library', ''),
(22, 'PhoneGap', 'PhoneGap ermöglicht es hybride Apps mit Hilfe von HTML5, CSS3 und Javascript zu schreiben.Die entstehenden Apps können über die Hersteller Portale  vertrieben werden. ', 'Man benötigt keine Erfahrung in den Gerätespezifischen Programmiersprachen', 'keine native Appentwicklung', 'https://phonegap.com/', 'Framework', ''),
(23, 'fastclickJs', '', '', '', 'https://github.com/ftlabs/fastclick', 'library', ''),
(24, 'angular-mobile-nav', '', '', '', 'https://github.com/ajoslin/angular-mobile-nav', 'library', ''),
(25, 'Cordova', '', 'Open-Source|', '', '', 'Framework', ''),
(26, 'Ionic', '', '', '', 'http://ionicframework.com/', 'Framework', ''),
(27, 'angularytics', '', '', '', 'https://github.com/mgonto/angularytics', 'library', ''),
(28, 'angulartics', '', '', '', 'https://github.com/angulartics/angulartics', 'library', ''),
(29, 'ngRoute', '', '', '', 'https://docs.angularjs.org/api/ngRoute', 'Modul', ''),
(30, 'HTTP Auth Interceptor', '', '', '', '		\r\nhttps://github.com/witoldsz/angular-http-auth\r\n', 'Modul', ''),
(31, 'HTML5', '', '', '', '', 'language', '5'),
(32, 'CSS3', '', '', '', '', 'language', ''),
(33, 'Vaadin TouchKit', 'Ist eine Erweiterung für Vaadin um hybride Anwendungen für mobile Endgeräte zu erstellen.', '', '', 'https://vaadin.com/add-ons/touchkit', '', ''),
(34, 'Ace', 'Codeeditor für das Web', '', '', 'https://ace.c9.io/', 'library', ''),
(35, 'Canvg', 'SVG Parser und Renderer', '', '', 'https://github.com/canvg/canvg', 'library', ''),
(36, 'Crossroads', 'Crossroads.js ist eine Routing-Bibliothek, inspiriert von URL-Route / Dispatch-Programmen, wie sie in Frameworks wie Rails, Pyramid, Django, CakePHP, CodeIgniter usw. existieren. Es analysiert einen String-Input und entscheidet, welche Aktion ausgeführt werden soll, indem der String gegen mehrere Muster geprüft wird.', 'reduziert Code Komplexität durch Entkopplung ', '', 'https://github.com/millermedeiros/crossroads.js', 'library', ''),
(37, 'js-signals', '\r\nCustom Event / Messaging-System für JavaScript', '', '', 'http://millermedeiros.github.io/js-signals/', 'libray', ''),
(38, 'iscroll', '', '', '', '', 'http://cubiq.org/iscroll-4', '4'),
(39, 'swipeview', 'SwipeView ist die super einfache Lösung für endlose Karussells für den mobilen Browser.', '', '', 'http://cubiq.org/swipeview', '', ''),
(40, 'es6-promise', '', '', '', 'https://github.com/stefanpenner/es6-promise', 'library', ''),
(41, 'Esprima', 'Esprima ist ein Werkzeug, um eine lexikalische und syntaktische Analyse von JavaScript-Programmen durchzuführen. ', '', '', 'http://esprima.org/', 'library', ''),
(42, 'Flexie', '', '', '', 'https://github.com/doctyper/flexie/', '', ''),
(43, 'handlebars', 'handlebars', '', '', 'https://github.com/wycats/handlebars.js#differences-between-handlebarsjs-and-mustache | http://handlebarsjs.com/', 'library', ''),
(44, 'Hasher', 'Hasher ist ein Satz von JavaScript-Funktionen zur Steuerung der Browser-Historie für Rich-Media-Websites und Anwendungen. Es funktioniert als eine Abstraktion von Browser nativen Methoden plus einige zusätzliche Helper-Methoden.', '', '', 'https://github.com/millermedeiros/Hasher', 'library', ''),
(45, 'jQuery mobile', 'jQuery mobile ist ein HTML5-basiertes User Interface System. Es ist so konzipiert, dass reaktionsschnelle Websites und Apps erstellt werden können, die auf allen Smartphone-, Tablet- und Desktop-Geräten zugänglich sind.', 'respsonive | auf alle Geräten nutzbar', '', 'http://jquerymobile.com/', 'library', ''),
(46, 'jQuery UI Touch Punch', 'Ermöglicht für jQuery UI die Interaktion auf mobilen Endgeräten durch Touch. ', '', '', 'http://touchpunch.furf.com/', 'Plugin', ''),
(47, 'Less', 'Less ist ein CSS-Pre-Prozessor, was bedeutet, dass es die CSS-Sprache erweitert und Features hinzugefügt, die Variablen, Mixins, Funktionen und viele andere Techniken erlauben, die es Ihnen ermöglichen, CSS zu erstellen, das eine bessere Wartbarkeit schafft und erweiterbar ist.', 'für häufig wieder verwendete Attribute können Variablen vergeben werden', '', 'http://lesscss.org/', 'language', ''),
(48, 'Mobifyjs', 'Mobify.js ist eine Open-Source-Bibliothek zur Verbesserung von reaktionsfähigen Websites durch die Bereitstellung von reaktionsfähigen Bildern, JS / CSS-Optimierung, Adaptive Templating und vieles mehr.', '', 'wird nicht mehr gewartet ', 'https://github.com/mobify/mobifyjs', 'library', ''),
(49, 'Raphael', 'Raphaël ist eine kleine JavaScript-Bibliothek, die die Arbeit mit Vektorgrafiken im Web vereinfachen soll. Wenn man ein eigenes spezifisches Diagramm oder Image-Crop erstellen und das Widget drehen möchtest, kann man dies einfach mit dieser Bibliothek erreichen.', '', '', 'http://dmitrybaranovskiy.github.io/raphael/', 'library ', ''),
(50, 'URI', '', '', '', 'http://medialize.github.io/URI.js/', 'library ', ''),
(51, 'Sinon', '', '', '', 'http://sinonjs.org/', 'library', ''),
(52, 'jQuery', 'JQuery ist eine schnelle, kleine und funktionsreiche JavaScript-Bibliothek. Es macht Dinge wie HTML-Dokument Traversal und Manipulation, Event-Handling, Animation und Ajax viel einfacher mit einer einfach zu bedienenden API, die über eine Vielzahl von Browsern funktioniert. Mit einer Kombination aus Vielseitigkeit und Erweiterbarkeit hat jQuery die Art und Weise verändert, wie Millionen von Menschen JavaScript schreiben.', '', '', 'https://jquery.com/', 'library', '3.2.1'),
(53, 'JsHtmlSanitizer', '', '', '', 'https://code.google.com/archive/p/google-caja/wikis/JsHtmlSanitizer.wiki', 'library', ''),
(54, 'SAP Fiori', 'SAP Fiori besteht aus SAPUI5 und den SAP Gestaltungsrichtlinien. ', 'einheitliche UX/UI', 'hohe Lizenzkosten |nicht bzw. nur schwer anpassbar an Corporate Design', 'https://www.sapfioritrial.com/', 'Benutzeroberfläche', ''),
(58, 'Java-Technologie', '', '', '', '', 'Technologie', ''),
(59, 'scala-sbt', 'Build Werkzeug ', '', '', 'http://www.scala-sbt.org/1.x/docs/index.html', 'Build Tool', ''),
(60, 'Maven', '', '', '', 'https://maven.apache.org/', 'Build Tool', ''),
(61, 'Java JDK', '', '', '', '', 'Technologie', '>1.7'),
(62, 'Hibernate', '', '', '', 'http://hibernate.org/', 'ORM Framework', ''),
(63, 'SAP HANA', 'SAP HANA ist eine In-Memory Datenbank Lösung für Big Data Themen.', 'schnell|gut geeinget für große Analysen & Reportings', 'hohe Lizenzkosten', 'https://help.sap.com/viewer/p/SAP_HANA_PLATFORM|https://www.sap.com/germany/products/hana.html |https://help.hana.ondemand.com/help/frameset.htm', 'Datenbank', ''),
(64, 'MongoDB', 'Ist eine NoSQL Datenbank', '', 'Gut geeignet für BigData', 'https://www.mongodb.com', 'Datenbank', ''),
(65, 'Morphia', 'Nahtlose MongoDB-Zugriffsintegration mit Play''s Model Interface.', '', '', 'https://www.playframework.com/modules/morphia', 'Modul ', '1.2.7'),
(66, 'BreezeJs', '', '', '', 'http://www.getbreezenow.com/', 'library', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tech_features`
--

CREATE TABLE `tech_features` (
  `tf_id` int(11) NOT NULL,
  `tf_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `tf_desc` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `belongsTo` int(11) NOT NULL,
  `isLike` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `tech_features`
--

INSERT INTO `tech_features` (`tf_id`, `tf_name`, `tf_desc`, `belongsTo`, `isLike`) VALUES
(2, 'Zwei-Wege-Datenbindung', 'Mit Zwei-Wege-Datenbindung ist die Synchronisation der Daten zwischen View und Model \r\ngemeint. Datenänderungen in der View werden auch in Modal übertragen, und Änderungen im Modal werden ins View übertragen. ', 2, 1),
(3, 'Eigene Direktiven', 'In AngularJs ist es mögliche eigene Direktiven zu nutzen', 2, 4),
(4, 'Direktiven', 'Erweiterung von HTML durch Direktiven', 2, 4),
(5, 'Expressions', 'Manipulation und Kombination von Daten', 2, 6),
(6, 'Filterung', 'Filtern von Listen und Werten ', 2, 7),
(7, 'Animationen', 'visuelle Animationen ', 2, 9),
(8, 'Routen', 'Für komplexere Applikationen bietet AngularJs das Routing um zwischen URls zu wechseln.', 2, 10),
(9, 'MVVM - Muster', 'Das MVVM ist nach dem MVC Muster aufgebaut', 2, 2),
(10, 'Deep Linking', '', 2, 12),
(11, 'Form Validation', '', 2, 13),
(12, 'Testing', 'In AngularJs ist es sehr einfach das Projekt zu testen ', 2, 5),
(13, 'Responsive', 'Smartphone Features nutzen', 21, 14),
(14, 'Google Analytics', '', 27, 15),
(15, 'Analytics', '', 28, 15),
(16, 'Authentication/Login', '', 30, 17),
(17, 'Visualisierungen ', 'Graphen', 13, 18),
(18, 'Visualisierungen ', 'Graphen', 14, 18),
(19, 'Routing', '', 1, 10),
(20, 'UI-Elemente', '', 1, 21),
(21, 'Odata', '', 1, 20),
(22, 'Internationalisierung', '', 1, 19),
(24, 'Visualisierung', 'Visualisierung von Diagrammen ', 13, 18),
(25, 'Visualisierungen ', '', 49, 18),
(26, 'MVC', '', 18, 2),
(28, 'Junit', 'Testing in Play', 18, 5),
(29, 'JDBC', 'Schnittstelle zwischen SAP HANA und Frondend-Technologie', 63, 25),
(30, 'ODBC', 'Schnittstelle zwischen SAP HANA und Frondend-Technologie', 63, 26),
(31, 'Odata', 'Schnittstelle zur Frontend-Technologie', 63, 20),
(32, 'JSON', 'Schnittstelle', 63, 27),
(33, 'JSON', 'Schnittstelle', 2, 27),
(34, 'JDBC', 'Schnittstelle', 18, 25),
(35, 'OData', 'Schnittstelle', 66, 20),
(36, 'OData', 'Schnittstelle', 11, 20);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `abhaengigkeiten`
--
ALTER TABLE `abhaengigkeiten`
  ADD PRIMARY KEY (`ab_id`);

--
-- Indizes für die Tabelle `beziehungen`
--
ALTER TABLE `beziehungen`
  ADD PRIMARY KEY (`b_id`),
  ADD KEY `b_id` (`b_id`);

--
-- Indizes für die Tabelle `feature`
--
ALTER TABLE `feature`
  ADD PRIMARY KEY (`f_id`),
  ADD KEY `f_name` (`f_name`),
  ADD KEY `f_id` (`f_id`);

--
-- Indizes für die Tabelle `technologien`
--
ALTER TABLE `technologien`
  ADD PRIMARY KEY (`tech_id`),
  ADD UNIQUE KEY `tech_name` (`tech_name`),
  ADD UNIQUE KEY `tech_name_2` (`tech_name`),
  ADD KEY `tech_name_3` (`tech_name`);

--
-- Indizes für die Tabelle `tech_features`
--
ALTER TABLE `tech_features`
  ADD PRIMARY KEY (`tf_id`),
  ADD UNIQUE KEY `tf_id_2` (`tf_id`),
  ADD KEY `tf_name` (`tf_name`),
  ADD KEY `tf_id` (`tf_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `abhaengigkeiten`
--
ALTER TABLE `abhaengigkeiten`
  MODIFY `ab_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
--
-- AUTO_INCREMENT für Tabelle `beziehungen`
--
ALTER TABLE `beziehungen`
  MODIFY `b_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
--
-- AUTO_INCREMENT für Tabelle `feature`
--
ALTER TABLE `feature`
  MODIFY `f_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT für Tabelle `technologien`
--
ALTER TABLE `technologien`
  MODIFY `tech_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;
--
-- AUTO_INCREMENT für Tabelle `tech_features`
--
ALTER TABLE `tech_features`
  MODIFY `tf_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
