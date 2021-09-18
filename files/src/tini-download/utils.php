<?php
function check_enum(string $find, string $name, array $allowed, array &$errors)
{
    foreach ($allowed as $allowed_item) {
        if ($find === $allowed_item) return;
    }

    $allowed_text = json_encode($allowed);
    $errors[] = "$find is not allowd for $name. $allowed_text are allowed.";
}

function get_tini_arch(string $arch, string $variant, array &$errors) {
    if ($arch == "arm") {
        $found = find_table("./arch.arm.txt", $variant);
        if ($found !== false) return $found;
        $errors[] = "arm with $variant is not supported";
    } else {
        $found = find_table("./arch.all.txt", $arch);
        if ($found !== false) return $found;
        $errors[] = "arch $arch is not supported";
    }
}

function find_table(string $file, string $find) {
    $file = new SplFileObject($file);
    while (!$file->eof()) {
        $line = explode(":", $file->fgets(), 2);
        if (count($line) == 2 && trim($line[0]) == $find)
            return trim($line[1]);
    }
    return false;
}

function find_line(string $file, string $find) {
    $file = new SplFileObject($file);
    while (!$file->eof()) {
        if (trim($file->fgets()) == $find)
            return true;
    }
    return false;
}

function handle_errors(array $errors) {
    if (!empty($errors)) {
        http_response_code(400);
        header('Content-Type: text/plain');
        foreach ($errors as $error) {
            echo 'error: ' . $error . "\n";
        }
        echo "when you found bug, please file issue on https://github.com/anatawa12/anatawa12-web-servers/issues.\n";
        exit;
    }
}

function get_tini_latest_version() {
    $latest_file_time = @filemtime("./latest.txt");
    // if not exists or it's old
    if ($latest_file_time === false || $latest_file_time < (time() - (24*60*60))) {
        $options = [
            "http" => [
                "header" => "Accept: application/vnd.github.v3+json\r\nUser-Agent: anatawa12.com\r\n",
            ]
        ];
        $json = json_decode(file_get_contents("https://api.github.com/repos/krallin/tini/releases/latest", false, stream_context_create($options)), true);
        $latest = $json["name"];
        // drop v if exists
        if ($latest[0] == 'v')$latest = substr($latest, 1);
        file_put_contents("./latest.txt", $latest);
        return $latest;
    } else {
        return file_get_contents("./latest.txt");
    }
}

function sum_str_bytes(string $str, int $mask) {
    $sum = 0;
    $len = strlen($str);
    for ($i=0; $i < $len; $i++) { 
        $sum += ord($str[$i]);
        $sum = $sum & $mask;
    }
    return $sum;
}
