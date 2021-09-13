<?php
//*
define("IS_STORM", false);
/*/
define("IS_STORM", true);
// */
if (IS_STORM) {
	$pref = "modsDownload";
} else {
	$pref = "mod";
}
	?><html lang="ja">
<!DOCTYPE html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<title><?php print $title?></title>
	<?php
	if (IS_STORM) {
		print "<link rel=\"stylesheet\" type=\"text/css\" href=\"/modsDownload/main.css\">";
	} else {
		print "<link rel=\"stylesheet\" type=\"text/css\" href=\"/mod/main.css\">";
	}
	?>
</head>
<body>
<input type="checkbox" class="check" id="checked">
<label class="menu-btn" for="checked">
	<span class="bar top"></span>
	<span class="bar middle"></span>
	<span class="bar bottom"></span>
	<span class="menu-btn__text">MENU</span>
</label>
<label class="close-menu" for="checked"></label>
<nav class="drawer-menu">
	<?php include dirname(__FILE__)."/menu.php" ?>
</nav>
<div class="contents">
	<div class="contents__inner">
		<?php print body()?>
	</div>
</div>
</body>
</html>