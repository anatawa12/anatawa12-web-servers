<?php
//header("HTTP/1.1 200 OK", true);
//print http_response_code(200);
require_once "private/spyc.php";
$mods = Spyc::YAMLLoad(file_get_contents("private/mods.yml"));
$title = "error: 404";

function body() {
	?>
	<h1>404 Not Found.</h1>
	<?php
}

include "private/base.php";