<?
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	require("db.php");
	
	$sql="SELECT * FROM players";
	$res=$link->query($sql);
	while($row=$res->fetch_assoc()){
		if(time()-strtotime($row['date'])>20){
			$sql="DELETE FROM players WHERE id = ".$row['id'];
			$link->query($sql);
		}
	}
	
	function getPlayers(){
		global $link;
		$sql="SELECT * FROM players";
		$res=$link->query($sql);
		$rows = array();
		while($row = $res->fetch_assoc()) {
			$rows[] = $row;
		}
		echo json_encode($rows);
	}
	
	if(isset($_POST['JOIN'])){
		$x=$_POST['x'];
		$y=$_POST['y'];
		$z=$_POST['z'];
		$yaw=$_POST['yaw'];
		$pitch=$_POST['pitch'];
		$nick=mysqli_real_escape_string($link,$_POST['nick']);
		$date=date("Y-m-d H:i:s",strtotime("now"));
		$health=$_POST['health'];
		$sql="INSERT INTO players (nick,x,y,z,yaw,pitch,date,health) VALUES(\"$nick\",$x,$y,$z,$yaw,$pitch,\"$date\",$health)";
		$link->query($sql);
		$id=$link->insert_id;
		echo $id;
	}
	
	if(isset($_POST['UPDATE'])){
		$x=$_POST['x'];
		$y=$_POST['y'];
		$z=$_POST['z'];
		$yaw=$_POST['yaw'];
		$pitch=$_POST['pitch'];
		$date=date("Y-m-d H:i:s",strtotime("now"));
		$id=$_POST['id'];
		$shooting=$_POST['shooting'];
		$health=$_POST['health'];
		$sql="UPDATE players SET x=$x, y=$y, z=$z, yaw=$yaw, pitch=$pitch, date=\"$date\", shooting=$shooting, health=$health WHERE id=$id";
		$link->query($sql);
		if($link->affected_rows>0) getPlayers();
	}

?>