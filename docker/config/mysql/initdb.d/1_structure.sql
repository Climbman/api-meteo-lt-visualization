CREATE DATABASE meteo_forecasts CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE meteo_forecasts;

CREATE TABLE config (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    cnf_key VARCHAR(255),
    cnf_value VARCHAR(255)
);

CREATE TABLE places (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    place_code VARCHAR(255) NOT NULL,
    adm_division VARCHAR(255),
    country_code VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE (place_code)
);

CREATE TABLE forecasts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    place_id INT UNSIGNED NOT NULL,
    date_cached DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    data JSON,
    PRIMARY KEY (id),
    CONSTRAINT FK_placeId FOREIGN KEY (place_id) REFERENCES places(id)
);