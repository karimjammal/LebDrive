<?php

function connectServer($servername,$username,$password)
{
$connection = new mysqli($servername, $username, $password);
if ($connection->connect_error)
{
throw new Exception("Connection Error");
}
else {
    return $connection;
}
}

function connectDb($servername,$username,$password,$dbname)
{
$connection = new mysqli($servername, $username, $password,$dbname);
if ($connection->connect_error)
{
throw new Exception("Connection Error");
}
else {
    return $connection;
}
}

function selectQuery($connection, $query)
{
    $result= $connection->query($query);

    $multiArray=array();
    While($row = $result->fetch_assoc()) {
        array_push($multiArray,$row);
        }
    return $multiArray;
}

function executeQuery($connection, $query)
{
    $result= $connection->query($query);
    return $result;
}

function userExists($connection, $tablename, $username)
{
    $result= selectQuery($connection,"select * from $tablename where username='$username'");
    return count($result)>0;
}
function checkPasswordMatch($password,$ccpassword)
{
    return ($password==$ccpassword);
}
function addUser($connection, $tablename, $password, $ccpassword, $username)
{
    if(userExists($connection,$tablename,$username))
    {
        return -1;
    }
    if(!checkPasswordMatch($password,$ccpassword))
    {
        return -2;
    }
    $hashedPassword= md5($password);
    
    executeQuery($connection,"Insert into $tablename (username,password) values ('$username','$hashedPassword')");
    return 1;
}

function passwordMatches($connection,$tablename,$username,$password)
{
    $result= selectQuery($connection,"Select password from $tablename where username='$username'");
    return $result[0]["password"]==md5($password);
    
}

function signInUser($connection,$tablename,$username,$password)
{
    if(userExists($connection,$tablename,$username) )
    {
        if(passwordMatches($connection,$tablename,$username,$password))
        {
            return 1;  
        }
      return -1;
    }
    return -2;
}
function alert($msg) {
    echo "<script type='text/javascript'>alert('$msg');</script>";
}

if (isset($_SERVER['HTTP_ORIGIN'])) {
    //header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');    
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
} 

    if($_SERVER["REQUEST_METHOD"]=="GET" && !isset($_GET["signsonly"]) && !isset($_GET["fulltest"])){
    header('Content-type:application/json;charset=utf-8');
    $connection = connectDb("localhost","root","","driving_questions");
    $result = selectQuery($connection, "select * from french_questions order by RAND() LIMIT 30");
    $ans = json_encode($result);
    echo $ans;
    }

    if($_SERVER["REQUEST_METHOD"]=="GET" && isset($_GET["signsonly"])){
    header('Content-type:application/json;charset=utf-8');
    $connection = connectDb("localhost","root","","driving_questions");
    $result = selectQuery($connection, "select * from french_signs order by RAND() LIMIT 30");
    $ans = json_encode($result);
    echo $ans;
    }

    if($_SERVER["REQUEST_METHOD"]=="GET" && isset($_GET["fulltest"])){
        header('Content-type:application/json;charset=utf-8');
        $connection = connectDb("localhost","root","","driving_questions");
        $result = selectQuery($connection, "select * from french_questions order by RAND() LIMIT 20");
        $result2 = selectQuery($connection, "select * from french_signs order by RAND() LIMIT 10");
        $finalres = array_merge($result, $result2);
        $ans = json_encode($finalres);
        echo $ans;
    }
?>