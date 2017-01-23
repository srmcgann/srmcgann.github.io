
function initVars(){
	
	canvas=document.getElementById("canvas");
	stat=document.getElementById("status");
	ctx=canvas.getContext("2d");
	resize();
	pi=Math.PI;
	playerX=0;
	playerY=-2;
	playerZ=0;
	playerVX=playerVY=playerVZ=0;
	playerHeight=2;
	players=new Object();
	iPlayers=new Object();
	landed=true;
	health=100;
	deathAlpha=0;
	roll=pitch=yaw=rollV=pitchV=yawV=0;
	akey=skey=dkey=wkey=shiftkey=altkey=leftkey=rightkey=upkey=downkey=pgupkey=pgdownkey=spacekey=0;
	mx=my=leftButton=rightButton=0;
	splosions=new Array();
	splosionVelocity=.07, splosionFragments=50;
	bullets=new Array();
	bulletVelocity=1.5,bulletLifeSpan=2000;
	alternateShot=true;
	shotTimer=0;
	shotDelay=100; //milliseconds
	sec=0;
	syncTime=0, syncFreq=300;
	id=-1;
	targetFPS=60;
	scale=400;
	ceiling=-8;
	gravity=.03;
	jumpHeight=.7;
	mountainHeight=2;
	modPoints= new Array();
	useSounds=false;
	for(i=0;i<8;++i){
		point={};
		point.x=5000-Math.random()*10000;
		point.z=5000-Math.random()*10000;
		modPoints.push(point);
	}
	crosshair = new Image(); 
	crosshair.src = "crosshair.png";
	fireball = new Image(); 
	fireball.src = "fireball.png";
	alien = new Image(); 
	alien.src = "alien.png";
	focused=true;
	loggedIn=false;
	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
	canvas.addEventListener("mousemove", mouse, true);
}

function setupPointerLock(){
	
	canvas.onclick = function() {
		canvas.requestPointerLock();
	}
	canvas.onmousedown=function(event){event.preventDefault();}
	canvas.addEventListener("mousedown", function(event) {
		switch (event.which) {
			case 1: leftButton=true; break;
			case 3: rightButton=true; break;
		}
	});
	canvas.addEventListener("mouseup", function(event) {
		switch (event.which) {
			case 1: leftButton=false; break;
			case 3: rightButton=false; break;
		}
	});
}

function mouse(e) {

	var movementX = e.movementX ||
		e.mozMovementX          ||
		e.webkitMovementX       ||
		0;

	var movementY = e.movementY ||
		e.mozMovementY      ||
		e.webkitMovementY   ||
		0;

	mx += movementX;
	my += movementY;

	if(syncTime<sec){
		syncTime=sec+syncFreq;
		if(id!=-1)sync();
	}
}

function resize(){
	
	dispWidth=window.innerWidth;
	dispHeight=window.innerHeight;
	if(canvas.width != dispWidth || canvas.height != dispHeight){
		canvas.width=dispWidth;
		canvas.height=dispHeight;
		cx=canvas.width/2;
		cy=canvas.height/2;
	}
}

function rasterizePoint(x,y,z){
	var p,d;
	x-=playerX;
	y-=playerY;
	z-=playerZ;
	p=Math.atan2(x,z);
	d=Math.sqrt(x*x+z*z);
	x=Math.sin(p-yaw)*d;
	z=Math.cos(p-yaw)*d;					
	p=Math.atan2(y,z);
	d=Math.sqrt(y*y+z*z);
	y=Math.sin(p-pitch)*d;
	z=Math.cos(p-pitch)*d;
	var rx1=-10,ry1=1,rx2=10,ry2=1,rx3=0,ry3=0,rx4=x,ry4=z,uc=(ry4-ry3)*(rx2-rx1)-(rx4-rx3)*(ry2-ry1);
	if(!uc) return {x:0,y:0,d:-1};
	var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
	var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
	if(!z)z=.000000001;
	if(ua>0&&ua<1&&ub>0&&ub<1){
		return {
			x:cx+(rx1+ua*(rx2-rx1))*scale,
			y:cy+y/z*scale,
			d:Math.sqrt(x*x+y*y+z*z)
		};
	}else{
		return {
			x:cx+(rx1+ua*(rx2-rx1))*scale,
			y:cy+y/z*scale,
			d:-1
		};
	}
}

function rotate(x,y,z,pitch,yaw){
	var p=Math.atan2(y,z)+pitch;
	var dist=(y||z?Math.sqrt(y*y+z*z):0);
	y=Math.sin(p)*dist;
	z=Math.cos(p)*dist;
	p=Math.atan2(x,z)+yaw;
	dist=(x||z?Math.sqrt(x*x+z*z):0);
	x=Math.sin(p)*dist;
	z=Math.cos(p)*dist;
	return{x:x,y:y,z:z}
}

document.onkeydown = function (e) { 
	chr=e.keyCode || e.charCode;
	switch(chr){
		case 33:pgupkey=1;break;
		case 34:pgdownkey=1;break;
		case 37:leftkey=1;break;
		case 38:upkey=1;break;
		case 39:rightkey=1;break;
		case 40:downkey=1;break;
		case 65:akey=1;break;
		case 87:wkey=1;break;
		case 68:dkey=1;break;
		case 83:skey=1;break;
		case 16:shiftkey=1;break;
		case 18:altkey=1;break;
		case 32:spacekey=1;break;
	}
};
document.onkeyup = function (e) { 
	chr=e.keyCode || e.charCode;
	switch(chr){
		case 33:pgupkey=0;break;
		case 34:pgdownkey=0;break;
		case 37:leftkey=0;break;
		case 38:upkey=0;break;
		case 39:rightkey=0;break;
		case 40:downkey=0;break;
		case 65:akey=0;break;
		case 87:wkey=0;break;
		case 68:dkey=0;break;
		case 83:skey=0;break;
		case 16:shiftkey=0;break;
		case 18:altkey=0;break;
		case 32:spacekey=0;break;
	}
};
canvas.onkeydown = function (e) { 
	chr=e.keyCode || e.charCode;
	switch(chr){
		case 33:pgupkey=1;break;
		case 34:pgdownkey=1;break;
		case 37:leftkey=1;break;
		case 38:upkey=1;break;
		case 39:rightkey=1;break;
		case 40:downkey=1;break;
		case 65:akey=1;break;
		case 87:wkey=1;break;
		case 68:dkey=1;break;
		case 83:skey=1;break;
		case 16:shiftkey=1;break;
		case 18:altkey=1;break;
		case 32:spacekey=1;break;
	}
};
canvas.onkeyup = function (e) { 
	chr=e.keyCode || e.charCode;
	switch(chr){
		case 33:pgupkey=0;break;
		case 34:pgdownkey=0;break;
		case 37:leftkey=0;break;
		case 38:upkey=0;break;
		case 39:rightkey=0;break;
		case 40:downkey=0;break;
		case 65:akey=0;break;
		case 87:wkey=0;break;
		case 68:dkey=0;break;
		case 83:skey=0;break;
		case 16:shiftkey=0;break;
		case 18:altkey=0;break;
		case 32:spacekey=0;break;
	}
};

function shoot(x,y,z,vx,vy,vz,shooterID){
	
	shotTimer=sec+shotDelay;
	var bullet={};
	bullet.x=x;
	bullet.y=y;
	bullet.z=z;
	bullet.vx=vx;
	bullet.vy=vy;
	bullet.vz=vz;
	bullet.lifeSpan=sec+bulletLifeSpan;
	bullet.shooterID=shooterID;
	bullets.push(bullet);
	if(useSounds){
		pew = new Audio('pew.mp3');
		pew.play();
	}
}

function doLogic(){
	
	var playerV=.02,turnV=.05,accel;
	accel=playerV*(shiftkey?3:1);
	playerVX/=1.05;
	playerVY/=1.05;
	playerVZ/=1.05;
	if(akey){
		playerVX-=Math.cos(-yaw)*Math.cos(0)*accel;
		playerVZ-=Math.sin(-yaw)*Math.cos(0)*accel;
		playerVY-=Math.sin(0)*accel;
	}
	if(dkey){
		playerVX+=Math.cos(-yaw)*Math.cos(0)*accel;
		playerVZ+=Math.sin(-yaw)*Math.cos(0)*accel;
		playerVY+=Math.sin(0)*accel;
	}
	if(wkey){
		playerVX+=Math.sin(yaw)*Math.cos(pitch)*accel;
		playerVZ+=Math.cos(yaw)*Math.cos(pitch)*accel;
		playerVY+=Math.sin(pitch)*accel;
	}
	if(skey){
		playerVX-=Math.sin(yaw)*Math.cos(pitch)*accel;
		playerVZ-=Math.cos(yaw)*Math.cos(pitch)*accel;
		playerVY-=Math.sin(pitch)*accel;
	}
	if(pgupkey){
		playerVX+=Math.sin(yaw)*Math.cos(pitch-pi/2)*accel;
		playerVZ+=Math.cos(yaw)*Math.cos(pitch-pi/2)*accel;
		playerVY+=Math.sin(pitch-pi/2)*accel;
	}
	if(pgdownkey){
		playerVX-=Math.sin(yaw)*Math.cos(pitch-pi/2)*accel;
		playerVZ-=Math.cos(yaw)*Math.cos(pitch-pi/2)*accel;
		playerVY-=Math.sin(pitch-pi/2)*accel;
	}

	if(leftkey){
		yawV-=turnV;
	}
	if(rightkey){
		yawV+=turnV;
	}
	if(upkey)pitchV-=turnV;
	if(downkey)pitchV+=turnV;
	
	if(mx){
		yawV+=mx/300;
		mx=0;		
	}
	if(my){
		pitchV+=my/300;
		my=0;
	}
	
	playerX+=parseFloat(playerVX);
	playerY+=parseFloat(playerVY);
	playerZ+=parseFloat(playerVZ);
	yaw=parseFloat(yaw+yawV);
	pitch=parseFloat(pitch+pitchV);
	if(pitch<-pi/2)pitch=-pi/2;
	if(pitch>pi/2)pitch=pi/2;
	pitchV=pitchV/2;
	yawV=yawV/2;
	
	playerVY+=gravity;
	base=getBase(playerX,playerZ);
	if(landed||playerY>=base-playerHeight){
		playerY=base-playerHeight;
		playerVY=0;
		landed=true;
	}else{
		landed=false;
	}
	if(playerY<ceiling){
		playerY=ceiling;
		playerVY=0;
	}

	if((spacekey || rightButton) && landed){
		playerVY-=jumpHeight;
		landed=false;
	}
	
	if(leftButton && shotTimer<sec){
		shotTimer=sec+shotDelay;
		alternateShot=!alternateShot;
		x=-Math.sin(yaw)*Math.cos(pitch-pi/2);
		z=-Math.cos(yaw)*Math.cos(pitch-pi/2);
		y=-Math.sin(pitch-pi/2);
		x=x+playerX+Math.cos(-yaw)*Math.cos(0)*(alternateShot?1:-1);
		y=y+playerY+Math.sin(0)*(alternateShot?1:-1);
		z=z+playerZ+Math.sin(-yaw)*Math.cos(0)*(alternateShot?1:-1);
		vx=Math.sin(yaw)*Math.cos(pitch);
		vy=Math.sin(pitch);
		vz=Math.cos(yaw)*Math.cos(pitch);
		shoot(x,y,z,vx,vy,vz,id);
	}
	if(health<=0){
		die();
		alert("You ded.");
		initVars();
		loggedIn=true;
		join();
	}
}

function rgb(col){
	
	var r = parseInt((.66+Math.sin(col)*.33)*16);
	var g = parseInt((.66+Math.cos(col)*.33)*16);
	var b = parseInt((.66-Math.sin(col)*.33)*16);
	return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}

function drawLine(x1,y1,x2,y2,col,width,alpha){

	ctx.beginPath();
	ctx.globalAlpha=alpha;
	ctx.strokeStyle=rgb(col);
	ctx.lineWidth=width==undefined?1:width;
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();
}

function getBase(x,z){
	
	base=0;
	for(k=0;k<modPoints.length;++k){
		base+=Math.sin(sec/1000+Math.sqrt((x-modPoints[k].x)*(x-modPoints[k].x)+(z-modPoints[k].z)*(z-modPoints[k].z))/2)/modPoints.length*mountainHeight;
	}
	return base;
}

function spawnSplosion(x,y,z){
	
	for(k=0;k<splosionFragments;++k){
		var frag={};
		frag.x=x;
		frag.y=y;
		frag.z=z;
		p1=Math.random()*pi*2;
		p2=Math.random()*pi;
		t=Math.random();
		frag.vx=Math.sin(p1)*Math.sin(p2)*splosionVelocity*t;
		frag.vy=Math.cos(p2)*splosionVelocity*t;
		frag.vz=Math.cos(p1)*Math.sin(p2)*splosionVelocity*t;
		frag.size=Math.random()*50;
		splosions.push(frag);
	}
}

function drawPlayers(){
	
	if(iPlayers.length){
		ctx.globalAlpha=1;
		for(i=0;i<players.length;++i){
			if(players[i].health>0){				
				iPlayers[i].x=parseFloat(iPlayers[i].x+(players[i].x-iPlayers[i].x)/10);
				iPlayers[i].y=parseFloat(iPlayers[i].y+(players[i].y-iPlayers[i].y)/10);
				iPlayers[i].z=parseFloat(iPlayers[i].z+(players[i].z-iPlayers[i].z)/10);
				iPlayers[i].yaw=parseFloat(iPlayers[i].yaw+(players[i].yaw-iPlayers[i].yaw)/10);
				iPlayers[i].pitch=parseFloat(iPlayers[i].pitch+(players[i].pitch-iPlayers[i].pitch)/10);
				if(id!=players[i].id){
					point=rasterizePoint(iPlayers[i].x,iPlayers[i].y,iPlayers[i].z);
					if(point.d != -1){
						w=599/(1+point.d);
						h=792/(1+point.d);
						ctx.drawImage(alien,point.x-w/2,point.y-h/2,w,h);
						for(j=0;j<4;++j){
							p=pi*2/4*j;
							x1=Math.sin(p);
							y1=Math.cos(p);
							z1=0;
							p=pi*2/4*(j+1);
							x2=Math.sin(p);
							y2=Math.cos(p);
							z2=0;
							x3=0;
							y3=0;
							z3=3;
							point1=rotate(x1,y1,z1,iPlayers[i].pitch,iPlayers[i].yaw);
							point2=rotate(x2,y2,z2,iPlayers[i].pitch,iPlayers[i].yaw);
							point3=rotate(x3,y3,z3,iPlayers[i].pitch,iPlayers[i].yaw);
							point1=rasterizePoint(iPlayers[i].x+point1.x,iPlayers[i].y+point1.y,iPlayers[i].z+point1.z);
							point2=rasterizePoint(iPlayers[i].x+point2.x,iPlayers[i].y+point2.y,iPlayers[i].z+point2.z);
							point3=rasterizePoint(iPlayers[i].x+point3.x,iPlayers[i].y+point3.y,iPlayers[i].z+point3.z);
							if(point1.d != -1 && point2.d != -1){
								drawLine(point1.x,point1.y,point2.x,point2.y,1,20/(1+point1.d),.5);
							}
							if(point1.d != -1 && point3.d != -1){
								drawLine(point1.x,point1.y,point3.x,point3.y,1,20/(1+point1.d),.5);									
							}							
						}
					}
					if(players[i].shooting==="1"){
						x=iPlayers[i].x;
						y=iPlayers[i].y;
						z=iPlayers[i].z;
						vx=Math.sin(iPlayers[i].yaw)*Math.cos(iPlayers[i].pitch);
						vy=Math.sin(iPlayers[i].pitch);
						vz=Math.cos(iPlayers[i].yaw)*Math.cos(iPlayers[i].pitch);
						shoot(x,y,z,vx,vy,vz,players[i].id);
					}
					point=rasterizePoint(iPlayers[i].x,iPlayers[i].y-1,iPlayers[i].z);
					if(point.d != -1){
						ctx.font = "24px Arial";
						ctx.globalAlpha=1;
						ctx.fillStyle = "#0f0";
						ctx.fillText(players[i].nick,point.x-30,point.y);					
					}
				}
			}
		}
	}
	
	if(deathAlpha>.01){
		ctx.globalAlpha=deathAlpha;
		ctx.fillStyle="#f00";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		deathAlpha/=1.1;
	}else{
		deathAlpha=0;
	}
}

function drawEnvironment(){

	var grid=30;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	rx=Math.round(playerX);
	rz=Math.round(playerZ);
	for(i=-grid/2+rx;i<=grid/2+rx;++i){
		for(j=-grid/2+rz;j<=grid/2+rz;++j){
			alpha=3-(Math.sqrt((i-rx)*(i-rx)+(j-rz)*(j-rz))/(grid/2))*3;
			if(alpha<0)alpha=0;
			if(alpha>1)alpha=1;
			x=i;
			z=j;
			y=getBase(x,z);
			point1=rasterizePoint(x,y,z);
			x=i+1;
			z=j;
			y=getBase(x,z);
			point2=rasterizePoint(x,y,z);
			if(i-rx<grid/2 && point1.d != -1 && point2.d != -1) drawLine(point1.x,point1.y,point2.x,point2.y,pi+y*2,20/(1+point1.d),alpha);
			x=i;
			z=j+1;
			y=getBase(x,z);
			point2=rasterizePoint(x,y,z);
			if(j-rz<grid/2 && point1.d != -1 && point2.d != -1) drawLine(point1.x,point1.y,point2.x,point2.y,pi+y*2,20/(1+point1.d),alpha);

			x=i;
			z=j;
			y=ceiling;
			point1=rasterizePoint(x,y,z);
			x=i+1;
			z=j;
			y=ceiling;
			point2=rasterizePoint(x,y,z);
			if(i-rx<grid/2 && point1.d != -1 && point2.d != -1) drawLine(point1.x,point1.y,point2.x,point2.y,3.5,20/(1+point1.d),alpha);
			x=i;
			z=j+1;
			y=ceiling;
			point2=rasterizePoint(x,y,z);
			if(j-rz<grid/2 && point1.d != -1 && point2.d != -1) drawLine(point1.x,point1.y,point2.x,point2.y,3.5,20/(1+point1.d),alpha);
		}
	}
	
	ctx.globalAlpha=.7;
	for(i=0;i<bullets.length;++i){
		bullets[i].x+=bullets[i].vx*bulletVelocity;
		bullets[i].y+=bullets[i].vy*bulletVelocity;
		bullets[i].z+=bullets[i].vz*bulletVelocity;
		point=rasterizePoint(bullets[i].x,bullets[i].y,bullets[i].z);
		if(point.d != -1){
			size=500/(1+point.d);
			ctx.drawImage(fireball,point.x-size/2,point.y-size/2,size,size);
		}
		if(bullets[i].y>getBase(bullets[i].x,bullets[i].z) || bullets[i].y<ceiling){
			spawnSplosion(bullets[i].x,bullets[i].y,bullets[i].z);
			bullets[i].lifeSpan=0;
		}
		if(bullets[i].shooterID != id){
			dist=Math.sqrt((bullets[i].x-playerX)*(bullets[i].x-playerX)+
						   (bullets[i].y-playerY)*(bullets[i].y-playerY)+
						   (bullets[i].z-playerZ)*(bullets[i].z-playerZ));
			if(dist<playerHeight){
				health--;
				deathAlpha=1;
			}
		}
	}
	for(i=0;i<bullets.length;++i){
		if(bullets[i].lifeSpan<sec)bullets.splice(i,1);
	}
	
	for(i=0;i<splosions.length;++i){
		splosions[i].x+=splosions[i].vx;
		splosions[i].y+=splosions[i].vy;
		splosions[i].z+=splosions[i].vz;
		point=rasterizePoint(splosions[i].x,splosions[i].y,splosions[i].z);
		if(point.d != -1){
		  ctx.fillStyle = "#ff0";
		  ctx.beginPath();
		  ctx.arc(point.x,point.y,splosions[i].size/(1+point.d),0,pi*2);
		  ctx.fill();
		  ctx.closePath();
		}
		if(splosions[i].size>1)splosions[i].size--;
	}
	for(i=0;i<splosions.length;++i){
		if(splosions[i].size<2)splosions.splice(i,1);
	}
	
	if(loggedIn){
		ctx.globalAlpha=.1;
		ctx.drawImage(crosshair,cx-155,cy-155);
		stat.innerHTML= "health &nbsp;= "+health+"<br>"+
					   "players = "+players.length+"<br>"+
					   "Nick &nbsp;&nbsp;&nbsp;= "+$("#nick").val()+"<br>"+
					   "FPS &nbsp;&nbsp;&nbsp;&nbsp;= "+FPS;
	}
}

window.onfocus = function() {
    focused = true;
	frame();
};

window.onblur = function() {
    focused = false;
};

function frame(){
	
	requestAnimationFrame(frame);
	sec+=1000/targetFPS;
	frames++;
	resize();
	drawEnvironment();
	if(loggedIn){
		doLogic();
		drawPlayers();
	}else{
		playerY=-4;
	}
}


FPS=frames=0;
setInterval( function checkFPS(){FPS=frames;frames=0;} ,1000);
initVars();
frame();