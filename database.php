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

    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');    
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if($_SERVER['REQUEST_METHOD']=='GET'){
    header('Content-Type: text/plain');
    $connection = connectDb("localhost","root","","driving_questions");
    $result = signInUser($connection, "users", $_GET['username'], $_GET['password']);
    $username = $_GET['username'];
    echo $result;

}

if($_SERVER['REQUEST_METHOD']=='POST' && isset($_POST["signupreq"])){
    header('Content-Type: text/plain');
    $connection = connectDb("localhost","root","","driving_questions");
    $result = addUser($connection, "users", $_POST['password'], $_POST['ccpassword'], $_POST['username']);
    echo $result;
}

if($_SERVER['REQUEST_METHOD']=='POST' && isset($_POST["username"]) && !isset($_POST["score"]) && !isset($_POST["signupreq"])){
    header('Content-type:application/json;charset=utf-8');
    $connection = connectDb("localhost","root","","driving_questions");
    $username = $_POST["username"];
    $result = selectQuery($connection, "select high_score from users where username='$username'");
    $ans = json_encode($result);
    echo $ans;
}

if($_SERVER['REQUEST_METHOD']=='POST' && isset($_POST["username"]) && isset($_POST["score"])){
    header('Content-Type: text/plain');
    $connection = connectDb("localhost","root","","driving_questions");
    $username = $_POST["username"];
    $score = (int) $_POST["score"];
    $oldscore = selectQuery($connection, "select high_score from users where username='$username'");
    
    if(((int)$oldscore[0]['high_score'])<$score){
    executeQuery($connection, "update users set high_score=$score where username='$username'");
    }

}

?>