<?php

require_once('../classes/User.php');

if (isset($_POST['method'])) {
    header('Content-Type:application/json');
    $obj = new User();
    switch ($_POST['method']) {
        case 'login':       
        $data = $_POST['data'];
        $resp = $obj->getFirst($data);   
        echo json_encode($resp);
        break;
        
        case 'insert':
        $resp = $obj->insert($_POST['data']);
        echo json_encode($resp);
        break;
        
        case 'get':
        $resp = $obj->read();
        echo json_encode($resp['response']);
        break;
        
        
        case 'delete':
        $resp = $obj->delete($_POST['data']);
        echo json_encode($resp);
        break;
        
        case 'update':
        $resp = $obj->update($_POST['data']);
        echo json_encode($resp);
        break;

        case 'editPass':
        $resp = $obj->editPass($_POST['data']);
        echo json_encode($resp);
        break;
        break;
        
        case 'show':
        $resp = $obj->show($_POST['data']);
        echo json_encode($resp['response']);
        break;
        
    }
}