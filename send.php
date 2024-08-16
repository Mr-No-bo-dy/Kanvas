<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kanvas</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="icon" href="img/js-ico.svg">
</head>
<body>
    <div class="wrapper">
        <div class="order_done">
            <?php if (isset($_POST['telCall'])) { ?>
                <h1>Ми отримали ваш запит</h1>
                <p>І звʼяжемося з вами найближчим часом.</p>
            <?php } ?>

            <?php if (isset($_POST['telOrder'])) { ?>
                <h1>Ви успішно оформили замовлення!</h1>
                <p>Ми звʼяжемося з вами найближчим часом для підтвердження замовлення.</p>
            <?php } ?>

            <div><a class="btn" href="index.html">На Головну</a></div>
        </div>
    </div>
</body>
</html>

<?php

// In order for sending to TG-bot to work, you need to fill in these data:
$token = ''; // TG bot's Token
$chat_id = ''; // Number of active chat from https://api.telegram.org/bot<token>/getUpdates

$urlQuery = 'https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$chat_id.'&text=';

// Order data
if (isset($_POST['telOrder'])) {
    try {
        $tel =  $_POST['telOrder'];
        $sizes =  $_POST['sizes'];
        $better_canvas = $_POST['better_canvas'] ?? '';
        $with_border = $_POST['with_border'] ?? '';
        $with_delivery = $_POST['with_delivery'] ?? '';
    } catch (\Throwable $th) {
        $tel = 'ERROR IN MESSAGE';
        $sizes = 'ERROR IN MESSAGE';
        $better_canvas = 'ERROR IN MESSAGE';
        $with_border = 'ERROR IN MESSAGE';
        $with_delivery = 'ERROR IN MESSAGE';
    }

    $tel = urlencode($tel);
    $sizes = explode('_', urlencode($sizes));
    $better_canvas = urlencode($better_canvas);
    $with_border = urlencode($with_border);
    $with_delivery = urlencode($with_delivery);

    $urlQuery .= '<b>Замовлення!</b>%0A%0A'.
        'Телефон покупця: <b>'.$tel.'</b>%0A'. '%0A'.
        'Розміри: <b>'.$sizes[0].' x '.$sizes[1].'</b> чогось там.%0A'. '%0A';

    // Тут ми вдаємо, що вирахували вартість за даними із БД:
    $price = ceil(100 + $sizes[0] * $sizes[1] * 0.05);
        // Additional order params;
    if (!empty($better_canvas)) {
        $urlQuery .= '%F0%9F%98%81 <b>Дорожче полотно</b>. %0A';
        $price += $better_canvas;
    }
    if (!empty($with_border)) {
        $urlQuery .= '%F0%9F%98%84 <b>З рамкою</b>. %0A';
        $price += $with_border;
    }
    if (!empty($with_delivery)) {
        $urlQuery .= '%F0%9F%98%89 <b>З доставкою</b>. %0A';
        $price += $with_delivery;
    }
    $price = ceil($price / 5) * 5;
    $urlQuery .= '%0A Вартість замовлення: <b>'.$price.'</b> грн. %E2%9C%94';

} else if (isset($_POST['telCall'])) {     // Call me
    try {
        $telCall =  $_POST['telCall'];
    } catch (\Throwable $th) {
        $telCall = 'ERROR IN MESSAGE';
    }
    $telCall = urlencode($telCall);
    $urlQuery .= 'Подзвоніть мені! %0A'.'Мій телефон: <b>'.$telCall.'</b>%0A';
}

// Parameter parse_mode=HTML
$urlQuery .= '&parse_mode=HTML';

// Send Order to TG-bot
$result = file_get_contents($urlQuery);
?>