<?php
require_once "spyc.php";
$mods = Spyc::YAMLLoad(file_get_contents("private/mods.yml"));
$title = "error: 404";

function body() {
	?>
	<h1>404 Not Found.</h1>
	<?php
}

include "private/base.php";