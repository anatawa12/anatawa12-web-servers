<?php
require_once dirname(__FILE__)."/spyc.php";
$mods = Spyc::YAMLLoad(file_get_contents("private/mods.yml"));
$title = "anatawa12's mods";

function body() {
	?>
	<h1>anatawa12's mods.</h1>
	<p>please select from menu</p>
	<div>
		<h2>Notation of depends</h2>
		<p>
			this site's depends are written like this.<br>
			mod-version is maven's <a href="https://maven.apache.org/enforcer/enforcer-rules/versionRanges.html">version range.</a><br>
			<code>Mod-Name@mod-version</code>
		</p>
	</div>
	<?php
}

include __DIR__."/private/base.php";

