<?php

require_once('../config/database.php');

/*
    Clase que hereda la conexion a base de datos
*/
class User extends Connection
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
            $data['password'] = password_hash($data['password'],PASSWORD_DEFAULT);
            $statement = $cnx->prepare("INSERT INTO users (username, password, email)
            VALUES (:username, :password, :email)");
            $statement->execute($data);
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
            $statement = $cnx->prepare("SELECT * FROM users");
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
            $statement = $cnx->prepare("SELECT * FROM users WHERE id = :id");
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
            $statement = $cnx->prepare("UPDATE users SET username=:username, email=:email WHERE id=:id");
            $statement->execute($data);
        }
        catch(PDOException $e)
        {
            $return_value['error'] = true;
            $return_value['response']=$e->getMessage();
        }
        return $return_value;
    }

    public function getFirst($data) {
        $return_value = [
            'type'=>'',
            'data'=>false,
            'error'=>false,
            'response'=>''
        ];
        
        $cnx = $this->connect();

        try {

            $statement = $cnx->prepare ("SELECT * FROM users WHERE email=:email LIMIT 1");
            $statement->execute(['email'=>$data['email']]);

            if ($row = $statement->fetch(PDO::FETCH_ASSOC)) {

                $return_value['data'] = password_verify($data['password'],$row['password']);
                session_start();
                $_SESSION['user_id'] = $row['id'];
                $return_value['type'] = $row['type_id'];

            }
            
        } catch (PDOException $e) {

            $return_value['error'] = true;
            $return_value['response'] = $e->getMessage();
        }

        return $return_value;

    }

    public function editPass($data){
        $return_value = [
            'data'=>false,
            'error'=>false,
            'response'=>''
        ];

        $cnx = $this->connect ();

        try {
            
            $data['password'] = password_hash($data['password'],PASSWORD_DEFAULT);
            $statement = $cnx->prepare ("UPDATE users SET password=:password
                WHERE id = :id");

            $statement->execute ($data);

        } catch (PDOException $e) {

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
            $statement = $cnx->prepare("DELETE FROM users WHERE id=:id");
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