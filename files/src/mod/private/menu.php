<ul>
	<li><a href="/">files home</a></li>
	<li><a href="/<?php print $pref ?>">mods home</a></li>
	<li>mods</li>
	<?php
	foreach ($mods as $mod) {
		?>
		<li><a href="/<?php print $pref ?>/modInfo.php?name=<?php print $mod["dir"] ?>"><?php print $mod["name"] ?></a></li>
		<?php
	} ?>
</ul>
