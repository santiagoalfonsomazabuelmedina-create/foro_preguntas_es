-- Docker ejecuta este archivo UNA sola vez, la primera vez que crea el volumen de datos.
-- Crea una base aparte para las pruebas de integración, así nunca borran tus datos de desarrollo.
CREATE DATABASE app_test;
