<?php

require_once('../classes/Message.php');
if (isset($_POST['method']))
{
    header('Content-Type: application/json');
    $obj = new Message();
    switch($_POST['method'])
    {
        case 'get':
        $res = $obj->read();
        echo json_encode($res['response']);
        break;

        case 'insert':
        $res = $obj->insert($_POST['data']);
        echo json_encode($res);
        break;

        case 'update':
        $res = $obj->update($_POST['data']);
        echo json_encode($res);
        break;

        case 'show':
        $res = $obj->show($_POST['data']);
        echo json_encode($res['response']);
        break;

        case 'delete':
        $res = $obj->delete($_POST['data']);
        echo json_encode($res);
        break;
    }
}
