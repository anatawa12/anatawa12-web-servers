<?php
require_once __DIR__.'/vendor/autoload.php';
require_once dirname(__FILE__)."/spyc.php";
$mods = Spyc::YAMLLoad(file_get_contents("private/mods.yml"));
if (array_key_exists("name", $_GET)) {
	$mod_name = $_GET["name"];
} else {
	$mod_name = null;
	error();
}
$cur_mod = null;
foreach ($mods as $mod) {
	if ($mod["dir"] == $mod_name) {
		$cur_mod = $mod;
	}
}
if ($cur_mod == null) {
	error();
} else {
	$title = $cur_mod["name"];
	function body() {
		global $cur_mod;
		$parser = new \cebe\markdown\GithubMarkdown();
		$jarNameTemp = $cur_mod["jarNameTemplate"];
		?>
		<h1><?php print $cur_mod["name"] ?></h1>
		<div id="mods-info">
			<h2>mod info</h2>
			<?php echo $parser->parse($cur_mod["info"] ?? ""); ?>
		</div>

		<div id="mod_downloads">
			<h2>versions and downloads</h2>
			<table>
				<tr>
					<th>Minecraft version</th>
					<th>modVersion</th>
					<th>deponds</th>
					<th>download</th>
				</tr>
				<?php
				foreach ($cur_mod["mcAndModVersions"] as $mcVersion => $modVersions) {
					foreach ($modVersions as $modVersionInfo) {
						?>
						<tr>
						<td><?php print $mcVersion ?></td>
						<td><?php
							print $modVersionInfo["var"] ?></td>
						<td><?php print implode("<br>", $modVersionInfo["depends"])
							?></td>
						<td><?php
							$jarName = str_replace("\${version}", $modVersionInfo["var"], $jarNameTemp);
							print "<a href='mods/${cur_mod["dir"]}/$jarName'>$jarName</a>";
							?></td></tr><?php
					}
				}
				?>
			</table>
		</div>
		<?php
	}
	include dirname(__FILE__)."/private/base.php";
}

function error() {
	header("HTTP/1.1 404 Not Found");
	include "404.php";
}

?>
