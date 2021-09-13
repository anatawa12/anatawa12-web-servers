<?php
require_once __DIR__.'/vendor/autoload.php';
$this_file_dir = dirname(__FILE__);
$id = substr($_SERVER["REQUEST_URI"], 1);
//if (array_key_exists("id", $_GET)) $id = $_GET["id"];
//else $id = "";
$id_dir = $this_file_dir . "/" . $id;
if (realpath($id_dir) != $this_file_dir){
	if (file_exists($id_dir."/index.html")) {
		print file_get_contents($id_dir."/index.html");
		return;
	}
	if (file_exists($id_dir."/index.php")) {
		include ($id_dir."/index.php");
		return;
	}
}
if (!file_exists($id_dir)) {
	header("HTTP/1.0 404 Not Found");
	include __DIR__ . "/404.php";
	return;
}
if (is_file($id_dir)) {
	print file_get_contents($id_dir);
	return;
}

$parser = new \cebe\markdown\GithubMarkdown();

main();
function main(){
global $id, $id_dir, $all_files_info, $parser, $title, $info;
	require_once dirname(__FILE__)."/private/spyc.php";
	require_once dirname(__FILE__)."/vendor/autoload.php";
	$title = "anatawa12's files at /$id";
	if (file_exists($id_dir . "/info.yml")) $info = spyc_load(file_get_contents($id_dir . "/info.yml"));
	else $info = array();
	if (array_key_exists("title", $info)) {
		$title = $info["title"];
	}

	function startsWith($haystack, $needle) {
		$length = strlen($needle);
		return (substr($haystack, 0, $length) === $needle);
	}
	$all_files_info = array();
	if ($id != "") {
		$parent = dirname($id_dir);

		if (file_exists($parent . "/info.yml")) $parent_info = spyc_load(file_get_contents($parent . "/info.yml"));
		else $parent_info = array();
		$desc = $parser->parse($parent_info["desc"] ?? "");
		$all_files_info[] = array("path" => "..", "name" => "parent directory", "desc" => $desc);
	}

	$dir_files = scandir($id_dir, SCANDIR_SORT_DESCENDING);
	foreach ($dir_files as $dir_file) {
		$file_name = $id_dir . '/' . $dir_file;
		if (startsWith($dir_file, ".")) continue;
		if (array_key_exists("ignore", $info) && in_array($dir_file, $info["ignore"])) continue;
		if (is_dir($file_name)) {
			if (file_exists($file_name . "/info.yml")) {
				$desc = $parser->parse(spyc_load_file($file_name . "/info.yml")["desc"]);
			} else {
				$desc = "";
			}
		} else {
			if (array_key_exists("files", $info) && array_key_exists($dir_file, $info["files"])) {
				$desc = $info["files"][$dir_file];
			} else {
				$desc = "";
			}
		}
		$all_files_info[] = array("path" => $dir_file,"name" => $dir_file, "desc" => $desc);
	}

	function body() {
		global $id, $all_files_info, $parser, $title, $info;
		?>
		<h1><?php print $title?></h1>
		<div id="mods-info">
			<?php echo $parser->parse(@$info["info"] ?? @$info["desc"] ?? ""); ?>
		</div>
		<div>
			<?php if (count($all_files_info) != 0) { ?>
				<table>
					<tbody>
					<tr>
						<th>name</th>
						<th>info</th>
					</tr>
					<?php
					foreach ($all_files_info as $file_info) {
						?>
						<tr>
							<td>
								<a href="<?php print $file_info["path"]; ?>"><?php print $file_info["name"] ?></a>
							</td>
							<td><?php print $file_info["desc"] ?></td>
						</tr>
						<?php
					}
					?>
					</tbody>
				</table>
			<?php } else { ?>
				there is no files
			<?php } ?>
		</div>
		<?php
	}

	include "private/base.php";
}
