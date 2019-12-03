<?php

require_once('../config/database.php');

/*
    Clase que hereda la conexion a base de datos
*/
class Message extends Connection
{

    /*
    Funcion que recibe un array de datos para su inserción
    */
    function insert($data)
    {
        $return_value = [
            'data'=>false,
            'error'=>false,
            'response'=>''
        ];
        $cnx = $this->connect();

        try
        {
            $statement = $cnx->prepare("INSERT INTO messages (subject, from_id, to_id, date_time)
            VALUES (:subject, :from_id, :to_id, NOW())");
            $statement->execute($data);
            $last_id = $cnx->lastInsertId();

            
            sleep(3);

            for ($i=0, $len=count($_POST['messages']); $i<$len; $i++) {
                $statement = $cnx->prepare("INSERT INTO message_details (message_id, body)
                VALUES (:message_id, :body)");
                $statement->execute(array(':message_id' => $last_id, ':body' => $_POST['messages'][$i]['body']));
            }
            
        }
    
        catch(PDOException $e)
        {
            $return_value['error'] = true;
            $return_value['response']=$e->getMessage();
        }
        return $return_value;
    }

    function read()
    {
        $return_value = [
            'data'=>false,
            'error'=>false,
            'response'=>''
        ];

        $cnx = $this->connect();

        try
        {
            $statement = $cnx->prepare("SELECT m.subject,m.date_time,u.email,md.body,m.to_id FROM messages m LEFT JOIN message_details md ON md.message_id = m.id LEFT JOIN users u ON u.id = m.from_id");
            $statement->execute();
            $return_value['response'] = [];
            while($row = $statement->fetch(PDO::FETCH_ASSOC))
            {     
                array_push($return_value['response'],$row);
            }
        }
        catch(PDOException $e)
        {
            $return_value['error'] = true;
            $return_value['response']=$e->getMessage();
        }
        return $return_value;
    }

    function show($data)
    {
        $return_value = [
            'data'=>false,
            'error'=>false,
            'response'=>''
        ];

        $cnx = $this->connect();

        try
        {
            $statement = $cnx->prepare("SELECT * FROM messages
            WHERE id = :id");
            $statement->execute($data);
            $return_value['response'] = [];
            while($row = $statement->fetch(PDO::FETCH_ASSOC))
            {
                array_push($return_value['response'],$row);
            }
           
        }
        catch(PDOException $e)
        {
            $return_value['error'] = true;
            $return_value['response']=$e->getMessage();
        }
        return $return_value;
    }

    function update($data)
    {
        $return_value = [
            'data'=>false,
            'error'=>false,
            'response'=>''
        ];
        $cnx = $this->connect();

        try
        {
            $statement = $cnx->prepare("UPDATE messages SET subject=:subject, from_id=:from_id, to_id=:to_id, datetime=NOW() WHERE id=:id");
            $statement->execute($data);
        }
        catch(PDOException $e)
        {
            $return_value['error'] = true;
            $return_value['response']=$e->getMessage();
        }
        return $return_value;
    }

    function delete($data)
    {
        $return_value = [
            'data'=>false,
            'error'=>false,
            'response'=>''
        ];

        $cnx = $this->connect();

        try
        {
            $statement = $cnx->prepare("DELETE FROM messages WHERE id=:id");
            $statement->execute($data);
        }
        catch(PDOException $e)
        {
            $return_value['error'] = true;
            $return_value['response']=$e->getMessage();
        }
        return $return_value;
    }
}