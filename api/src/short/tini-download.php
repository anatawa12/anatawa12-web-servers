<?php
// if no arch information, show documentation
if (!isset($_GET["arch"])) {
    ?>
    <!doctype html>
    <h1>tini download redirector</h1>
    <p>
        The tool/API to make easy to download thelatest version of Tini.
        This will respond static linked binary if possible.
        This API caches version information for one days.
    <h2>Usage</h2>
    <p>
        Pass your arch as get parameter.
        You can pass <code>TARGETARCH</code> in docker buildx.
        You also can pass <code>TARGETVARIANT</code> in docker buildx as variant.
        You can get deb or rpm via setting type parameter as deb or rpm.
        You can get signature and checksum via sign parameter as asc, sha1, sha256.
        You can get dynamically linked binary via setting type as dynamic. force static via as static.
    <h2>Examples</h2>
    <ul>
        <li>https://api.anatawa12.com/short/tini-download?arch=x64</li>
        <li>in DockerFile (with <code># syntax=docker.io/docker/dockerfile:1.3.0</code>), <code>ADD --chmod=555 "https://api.anatawa12.com/short/tini-download?arch=${TARGETARCH}&variant=${TARGETVARIANT}" /tini</code></li>
    </ul>
    <?php
    exit;
}

include_once(__DIR__."/tini-download-lib/utils.php");

// arch is exists, checked
$arch = $_GET["arch"];
$variant = $_GET["variant"] ?? "";
$type = $_GET["type"] ?? "static";
$sign = $_GET["sign"] ?? "bin";

$errors = [];
// check enums
check_enum($type, "type", ["dynamic", "static", "deb", "rpm"], $errors);
check_enum($sign, "sign", ["bin", "asc", "sha1", "sha256"], $errors);
// check exists
$tini_arch = get_tini_arch(strtolower($arch), strtolower($variant), $errors);
$tini_version = get_tini_latest_version();
handle_errors($errors);

$suffix = "";
switch ($type) {
    case "dynamic": 
        $suffix = "$tini_arch";
        break;
    case "static": 
        $suffix = "static-$tini_arch";
        break;
    case "deb":
        $suffix = "$tini_arch.deb";
        break;
    case "rpm": 
        $suffix = "$tini_arch.rpm";
        break;
}

if (!find_line(__DIR__."/tini-download-lib/available.txt", $suffix)) {
    $errors[] = "The $type package of tini for $tini_arch is not available.";
}
handle_errors($errors);

$file = "";
switch ($type) {
    case "dynamic": 
    case "static": 
        $file = "tini-$suffix";
        break;
    case "deb": 
    case "rpm": 
        $file = "tini_$tini_version-$suffix";
        break;
}

$url = "https://github.com/krallin/tini/releases/download/v$tini_version/$file";

switch ($sign) {
    case "bin":
        break;
    case "asc":
        $url = "$url.asc";
        break;
    case "sha1":
        $url = "$url.sha1sum";
        break;
    case "sha256":
        $url = "$url.sha256sum";
        break;
}

http_response_code(307);
header("Location: $url");
echo $url;
