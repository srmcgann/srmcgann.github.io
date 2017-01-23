function die(){
	$.post( "sync.php",{
			UPDATE:1,
			id:id,
			x:playerX,
			y:playerY,
			z:playerZ,
			yaw:yaw,
			pitch:pitch,
			shooting:leftButton,
			health:"0"
		}
	);
}
function sync(){
	$.post( "sync.php",{
			UPDATE:1,
			id:id,
			x:playerX,
			y:playerY,
			z:playerZ,
			yaw:yaw,
			pitch:pitch,
			shooting:leftButton,
			health,health
		},
		function(data,status){
			if(data){
				players=JSON.parse(data);
				if(players.length != iPlayers.length){
					iPlayers = JSON.parse(JSON.stringify(players));
				}
			}
		}
	);	
}

function join(){
	$.post( "sync.php",{
			JOIN:1,
			x:playerX,
			y:playerY,
			z:playerZ,
			yaw:yaw,
			pitch:pitch,
			nick:$("#nick").val(),
			health,health
		},
		function(data,status){
			id=data;
		}
	);
	loggedIn=true;
	$("#login").hide();
	$("#status").show();
	setupPointerLock();
	canvas.focus();
	syncTimer=setInterval(sync,syncFreq);
}


$("#nick").keyup(function (e) {
    if (e.keyCode == 13 && $("#nick").val().length>0) {
        join();
    }
});

$("#nick").focus();
