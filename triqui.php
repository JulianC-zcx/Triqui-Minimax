<?php

	$servidor = "127.0.0.1";
	$usuario = "root";
	$clave = "";
	$baseDeDatos = "triqui_db";
 
	$enlace = mysqli_connect($servidor, $usuario, $clave, $baseDeDatos, 3306);
 
	if (!$enlace) {
		echo "Error de conexión: " . mysqli_connect_error();
		exit();
	}
	
	mysqli_set_charset($enlace, "utf8mb4");
?>

<?php
	if ($_POST) {
		$nombre    = mysqli_real_escape_string($enlace, $_POST['nombre']);
		$tiempo    = (int) $_POST['tiempo'];
		$resultado = mysqli_real_escape_string($enlace, $_POST['resultado']);
 
		$insertar = "INSERT INTO intentos (nombre, tiempo_segundos, resultado)
					 VALUES ('$nombre', $tiempo, '$resultado')";
 
		$ejecutar = mysqli_query($enlace, $insertar);
 
		if ($ejecutar) {
			echo "Intento guardado correctamente :)";
		} else {
			echo "Error al guardar: " . mysqli_error($enlace);
		}
	}
?>