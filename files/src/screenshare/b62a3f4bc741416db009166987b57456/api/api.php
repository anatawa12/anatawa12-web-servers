<?php
define('IV',"\x03\xe3\x6d\x62\x17\x65\x1b\xb0\xd4\x4a\x2d\x14\xde\xda\xf7\xd8");
define('ENCRYPT_METHOD','aes-256-cbc');
define('ENABLE_NEW_USERS', false);

$prefix = "p/";

$auth_prefix = $prefix."auth_";
$auth_postfix = "_auth.bin";

$offer_prefix = $prefix."offer_";
$answer_prefix = $prefix."answer_";

$data_postfix = "_data.bin";
$hash_postfix = "_data.sha256";

header('Cache-Control: no-store');
header("Access-Control-Allow-Origin: *");

/**
 * @param array $elements
 * @return string
 */
function build_url(array $elements) {
    $e = $elements;
    $result = '';
    if (isset($e['scheme'])) {
        $result .= "$e[scheme]:";
    }

    $result .= '//';

    if (isset($e['host'])) {
        if (isset($e['user'])) {
            $result .= $e['user'];
            if (isset($e['pass'])) {
                $result .= $e['pass'];
            }
            $result .= '@';
        }
        $result .= $e['host'];
        if (isset($e['port'])) {
            $result .= ':' . $e['port'];
        }
    }

    if (isset($e['path'])) {
        $result .= $e['path'];
    } else {
        $result .= '/';
    }

    if (isset($e['query'])) {
        if (is_array($e['query'])) {
            $result .= '?' . http_build_query($e['query'], '', '&');
        } else {
            $result .= '?' . $e['query'];
        }
    }
    if (isset($e['fragment'])) {
        $result .= "#$e[fragment]";
    }
    return $result;
}

function makeURL(array $query) {
    $urlBuilder = [];
    if (isset($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
        $urlBuilder['scheme'] = $_SERVER['HTTP_X_FORWARDED_PROTO'];
    } else if (($_SERVER["HTTPS"] ?? "off") == "on") {
        $urlBuilder['scheme'] = 'https';
    } else {
        $urlBuilder['scheme'] = 'http';
    }
    $urlBuilder['host'] = strstr($_SERVER["HTTP_HOST"], ':', true);
    if ($urlBuilder['host'] == false)
        $urlBuilder['host'] = $_SERVER["HTTP_HOST"];

    if (($_SERVER["HTTPS"] ?? "off") == "on") {
        if ($_SERVER["SERVER_PORT"] != "443") {
            $urlBuilder['port'] = $_SERVER["SERVER_PORT"];
        }
    } else {
        if ($_SERVER["SERVER_PORT"] != "80") {
            $urlBuilder['port'] = $_SERVER["SERVER_PORT"];
        }
    }

    $urlBuilder['path'] = $_SERVER["SCRIPT_NAME"];

    if (isset($_SERVER['QUERY_STRING'])) {
        $urlBuilder['query'] = [];

        parse_str($_SERVER['QUERY_STRING'], $urlBuilder['query']);
    }

    $urlBuilder['query'] = array_merge($urlBuilder['query']??[], $query);

    return build_url($urlBuilder);
}

$type = $_GET["type"] ?? "entry";

// auth
$hashed_user = hash('sha256', $_GET["user"] ?? "");
$pass = $_GET["pass"] ?? "";
$auth_path = $auth_prefix . $hashed_user . $auth_postfix;

function should_auth(): bool {
    // if new users is disabled, disable new users
    if (!ENABLE_NEW_USERS) return true;
    global $auth_path, $type;
    if (file_exists($auth_path))
        return true;
    // get entry can make new user
    if ($type == "entry" && $_SERVER["REQUEST_METHOD"] == "GET")
        return false;
    return true;
}

if (should_auth()) {
    if (!file_exists($auth_path)) {
        http_response_code(403);
        exit;
    }
    $auth = file_get_contents($auth_path);
    if (!password_verify($pass, $auth)) {
        http_response_code(403);
        exit;
    }
} else {
    // make user
    file_put_contents($auth_path, password_hash($pass, PASSWORD_DEFAULT));
}

$offer_path = $offer_prefix . $hashed_user . $data_postfix;
$offer_hash_path = $offer_prefix . $hashed_user . $hash_postfix;
$answer_path = $answer_prefix . $hashed_user . $data_postfix;
$answer_hash_path = $answer_prefix . $hashed_user . $hash_postfix;

// encrypt

function encryptData($rawData)
{
    global $pass;
    $data = openssl_encrypt(
        $rawData,
        ENCRYPT_METHOD,
        $pass,
        OPENSSL_RAW_DATA,
        IV
    );
    if ($data === false) {
        http_response_code(500);
        echo "openssl_encrypt err";
        exit;
    }
    return $data;
}

function decryptData($data, $hash)
{
    global $pass;
    $rawData = openssl_decrypt(
        $data,
        ENCRYPT_METHOD,
        $pass,
        OPENSSL_RAW_DATA,
        IV
    );
    if ($rawData === false) {
        http_response_code(500);
        echo "openssl_decrypt err";
        exit;
    }
    if ($hash !== hash('sha256', $rawData)) {
        http_response_code(500);
        echo "decryptData: hash err";
        exit;
    }
    return $rawData;
}

//$_SERVER["REQUEST_METHOD"]
switch ($type) {
    case "entry":
        header("Content-type: application/json; charset=utf-8");
        ?>
        {
            "entry": "<?php echo makeURL(['type' => 'entry']); ?>",
            "offer": "<?php echo makeURL(['type' => 'offer']); ?>",
            "answer": "<?php echo makeURL(['type' => 'answer']); ?>",
            "iceServers": [
                {"urls": "stun:stun.l.google.com:19302"},
                {
                    "urls": "turn:gcp.anatawa12.com:3478",
                    "username": "88f109f914f29326a86619ef42ffd047",
                    "credential": "790167fe3566973565915009d093ce91"
                }
            ]
        }
    <?php
        break;
    case "offer":
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":
                if (!file_exists($offer_path) || !file_exists($offer_hash_path)) {
                    http_response_code(404);
                    exit;
                }

                header("Content-type: application/sdp; charset=utf-8");
                echo decryptData(file_get_contents($offer_path), file_get_contents($offer_hash_path));
                unlink($offer_path);
                unlink($offer_hash_path);
                break;
            case "POST":
                http_response_code(201);
                $sdp = file_get_contents("php://input");
                file_put_contents($offer_path, encryptData($sdp));
                file_put_contents($offer_hash_path, hash('sha256', $sdp));
                echo $sdp;
                break;
            default:
                http_response_code(405);
                exit;
        }
        break;
    case "answer":
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":
                $offerWasExits = file_exists($offer_path);
                if (!file_exists($answer_path) || !file_exists($answer_hash_path)) {
                    for ($i = 0; $i < 10; $i++) {
                        sleep(1);
                        if (file_exists($answer_path) && file_exists($answer_hash_path))
                            goto found;
                    }
                    if (!$offerWasExits) {
                        http_response_code(409);
                    } else {
                        http_response_code(404);
                    }
                    exit;
                    found:
                }

                header("Content-type: application/sdp; charset=utf-8");
                echo decryptData(file_get_contents($answer_path), file_get_contents($answer_hash_path));
                unlink($answer_path);
                unlink($answer_hash_path);
                break;
            case "POST":
                if (file_exists($answer_path) || file_exists($answer_hash_path)) {
                    if ((file_exists($answer_path) && filectime($answer_path) + 10 < time())
                        || (file_exists($answer_hash_path) && filectime($answer_hash_path) + 10 < time())) {
                        unlink($answer_path);
                        unlink($answer_hash_path);
                        goto removed;
                    }
                    http_response_code(409);
                    exit;
                }
                removed:

                http_response_code(201);
                $sdp = file_get_contents("php://input");
                file_put_contents($answer_path, encryptData($sdp));
                file_put_contents($answer_hash_path, hash('sha256', $sdp));
                echo $sdp;
                break;
            default:
                http_response_code(405);
                exit;
        }
        break;
    default:
        http_response_code(404);
        echo "invalid type: " . $type;
        exit;
}
