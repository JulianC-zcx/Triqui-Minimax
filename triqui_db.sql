CREATE DATABASE IF NOT EXISTS triqui_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_spanish_ci;
 
USE triqui_db;
 
CREATE TABLE IF NOT EXISTS intentos (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL,
  tiempo_segundos INT          NOT NULL,
  resultado       ENUM('victoria', 'derrota', 'empate') NOT NULL,
  fecha           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);