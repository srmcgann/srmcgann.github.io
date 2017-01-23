function initVars(){

	pi=Math.PI;
	canvas=$("#canvas")[0];
	ctx=canvas.getContext("2d");
	ctx.font = "64px Square721";
	canvas.width=1366;
	canvas.height=768;
	cx=canvas.width/2;
	cy=canvas.height/2;
	leftkey=rightkey=upkey=downkey=spacekey=enterkey=ctrlkey=0;
	shipImages=new Object();
	shipImages.red=new Image(); shipImages.red.src="red_ship.png";
	shipImages.yellow=new Image(); shipImages.yellow.src="yellow_ship.png";
	shipImages.blue=new Image(); shipImages.blue.src="blue_ship.png";
	blast=new Image(); blast.src="blast.png";
	players=new Array();
	bullets=new Array();
	splosions=new Array();
	laserCannons=new Array();
	medkits=new Array();
	shipV=3, shipDrag=1.1, shipSize=100;
	dispersalRadius=20000;
	background=new Image();
	background.src="background4.jpg";
	target=new Image();
	target.src="target.png";
	arrow=new Image();
	arrow.src="arrow.png";
	bullet=new Image();
	bullet.src="plasmaBall.png";
	splodePic=new Image();
	splodePic.src="splode.png";
	spark=new Image();
	spark.src="spark2.png";
	pain=new Image();
	pain.src="pain.png";
	painAlpha=0;
	hexMarquis=new Image();
	hexMarquis.src="hexMarquis.png";
	laserCannonPic=new Image();
	laserCannonPic.src="laserCannon.png";
	medkitPic=new Image();
	medkitPic.src="medkit.png";
	thruster = new Audio("thruster.mp3");
	thruster.volume=.25;
	pew = new Audio("pew.ogg");
	splodeSound=new Audio("splode.ogg");
	metalSounds=new Array(5);
	for(i=1;i<=5;++i)metalSounds[i-1]=new Audio("metal"+i+".ogg");
	upgrade=new Audio("upgrade.mp3");
	frames=0;
	bx=by=0;
	AIplayers=humanPlayers=0;
	infoPanelBorderWidth=5;
	infoPanelWidth=365+infoPanelBorderWidth*2;
	bulletV=100, shotInterval=2, bulletDamage=1, bulletLife=200;
	initAIPlayers=10, initMedkits=5, initLaserCannons=4, initAIHealth=30, initHumanHealth=100;
	players.push(new Player(0,0,shipImages.yellow,0,0,0,1));
	for(i=1;i<=initAIPlayers;++i){
		d=Math.random()*dispersalRadius;
		p=pi*2*Math.random();
		x=Math.sin(p)*d;
		y=Math.cos(p)*d;
		players.push(new Player(x,y,shipImages.red,0,0,1,parseInt(1+Math.random()*2)));
		players[i].id=i;
	}	
	for(i=0;i<initLaserCannons;++i){
		d=Math.random()*dispersalRadius;
		p=pi*2*Math.random();
		x=Math.sin(p)*d;
		y=Math.cos(p)*d;
		laserCannons.push(new LaserCannon(x,y));
	}
	for(i=0;i<initMedkits;++i){
		d=Math.random()*dispersalRadius;
		p=pi*2*Math.random();
		x=Math.sin(p)*d;
		y=Math.cos(p)*d;
		medkits.push(new Medkit(x,y));
	}
}

function Player(X,Y,img,kills,respawns,AI,gunLevel){

	this.X = X; this.Y = Y;
	this.id = this.VX = this.VY = this.thrust = this.shooting = this.thetaV = this.shotTimer = 0;
	this.theta = pi*2*Math.random();
	this.alive=1;
	this.nick="";
	this.health=AI?initAIHealth:initHumanHealth;
	this.gunLevel=gunLevel;
	this.size=shipSize;
	this.img=img;
	this.kills=kills;
	this.respawns=respawns?respawns:0;
	this.AI=AI;
}

function Bullet(X,Y, theta, origin){

	this.theta = theta;
	this.VX=Math.sin(theta)*bulletV;
	this.VY=-Math.cos(theta)*bulletV;
	this.size=200;
	this.X = X+this.VX;
	this.Y = Y+this.VY;
	this.life=frames+bulletLife;
	this.origin=origin;
}

function Splosion(X,Y){

	this.X = X;
	this.Y = Y;
	this.radius=0;
	this.sparks=new Array();
	for(m=0;m<250;++m){
		s=new Object();
		s.X=X;
		s.Y=Y;
		p=pi*2*Math.random();
		v=2+Math.random()*shipSize/2;
		s.VX=Math.sin(p)*v;
		s.VY=Math.cos(p)*v;
		s.radius=shipSize*2;
		this.sparks.push(s);
	}
}

function LaserCannon(X,Y){
	
	this.X=X;
	this.Y=Y;
	this.size=250;
}

function Medkit(X,Y){
	
	this.X=X;
	this.Y=Y;
	this.size=150;
}

function rand(){
	seed+=10;
	return parseFloat('0.'+Math.sin(seed).toString().substr(6));
}

window.addEventListener("keydown", function(e){
	chr=e.keyCode || e.charCode;
	switch(chr){
		case 37:leftkey=1;break;
		case 38:upkey=1;break;
		case 39:rightkey=1;break;
		case 40:downkey=1;break;
		case 32:spacekey=1;break;
		case 13:enterkey=1;break;
		case 17:ctrlkey=1;break;
	}
});

window.addEventListener("keyup", function(e){
	chr=e.keyCode || e.charCode;
	switch(chr){
		case 37:leftkey=0;break;
		case 38:upkey=0;break;
		case 39:rightkey=0;break;
		case 40:downkey=0;break;
		case 32:spacekey=0;break;
		case 13:enterkey=0;break;
		case 17:ctrlkey=0;break;
	}
});

function doLogic(){
	
	if(players[0].alive){
		if(leftkey) players[0].thetaV-=.08;
		if(rightkey) players[0].thetaV+=.08;
		players[0].theta+=players[0].thetaV;
		players[0].thetaV/=1.5;
		if(upkey){
			players[0].thrust=1;
			players[0].VX+=Math.sin(players[0].theta)*shipV;
			players[0].VY-=Math.cos(players[0].theta)*shipV;
			thruster.play();
		}else{
			players[0].thrust=0;
			thruster.pause();
			if(thruster.readyState==4) thruster.currentTime=0;
		}
	}else{
		players[0].thrust=0;
		thruster.pause();
		if(thruster.readyState==4) thruster.currentTime=0;		
	}
	for(i=0;i<bullets.length;++i){
		bullets[i].X+=bullets[i].VX;
		bullets[i].Y+=bullets[i].VY;
		if(bullets[i].life<frames){
			bullets.splice(i,1);
		}else{
			for(j=0;j<players.length;++j){
				if(bullets[i].origin!=players[j].id){
					d=Math.sqrt((bullets[i].X-players[j].X)*(bullets[i].X-players[j].X)+
								(bullets[i].Y-players[j].Y)*(bullets[i].Y-players[j].Y));
					if(d<players[j].size){
						if(players[j].health>0){
							if(!j)painAlpha=1;
							players[j].health-=bulletDamage;
							d=Math.sqrt((players[j].X-players[0].X)*(players[j].X-players[0].X)+
										(players[j].Y-players[0].Y)*(players[j].Y-players[0].Y));
							if(players[j].health<=0){
								players[j].alive=0;
								players[bullets[i].origin].kills++;
								splosions.push(new Splosion(players[j].X,players[j].Y));
								switch(parseInt(Math.random()*4)){
									case 0: laserCannons.push(new LaserCannon(players[j].X,players[j].Y)); break;
									case 1: medkits.push(new Medkit(players[j].X,players[j].Y)); break;
									default:break;
								}
								if(d<4000){
									splodeSound=new Audio("splode.ogg");
									splodeSound.volume=1/(1+d/300);
									splodeSound.play();
								}
								d=Math.random()*dispersalRadius;
								p=pi*2*Math.random();
								x=Math.sin(p)*d;
								y=Math.cos(p)*d;
								if(!j){
									players[j]=new Player(x,y,shipImages.yellow,players[j].kills,players[j].respawns+1,players[j].AI,1)
									painAlpha=5;
								}else{
									players[j]=new Player(x,y,shipImages.red,players[j].kills,players[j].respawns+1,players[j].AI,parseInt(1+Math.random()*2))
									players[j].id=j;
								}
							}else{
								if(d<4000){
									metalSound=metalSounds[parseInt(Math.random()*5)];
									metalSound.volume=.2/(1+d/300);
									metalSound.play();								
								}
							}
							bullets.splice(i,1);
							break;
						}
					}
				}
			}
		}
	}
	players[0].shooting=ctrlkey;
	AIplayers=0;
	humanPlayers=0;
	for(i=0;i<players.length;++i){
		if(players[i].AI){
			++AIplayers;
		}else{
			++humanPlayers;
		}
		if(players[i].AI){
			mind=10000000;
			for(j=0;j<players.length;++j){
				if(i!=j){
					d=Math.sqrt((players[i].X-players[j].X)*(players[i].X-players[j].X)+
								(players[i].Y-players[j].Y)*(players[i].Y-players[j].Y));
					if(d<mind){
						mind=d;
						t=j;
						targetType=1;
					}
				}
			}
			for(j=0;j<laserCannons.length;++j){
				if(i!=j){
					d=Math.sqrt((players[i].X-laserCannons[j].X)*(players[i].X-laserCannons[j].X)+
								(players[i].Y-laserCannons[j].Y)*(players[i].Y-laserCannons[j].Y));
					if(d<mind){
						mind=d;
						t=j;
						targetType=2;
					}
				}
			}
			for(j=0;j<medkits.length;++j){
				if(i!=j){
					d=Math.sqrt((players[i].X-medkits[j].X)*(players[i].X-medkits[j].X)+
								(players[i].Y-medkits[j].Y)*(players[i].Y-medkits[j].Y));
					if(d<mind){
						mind=d;
						t=j;
						targetType=3;
					}
				}
			}
			switch(targetType){
				case 1: p=pi-Math.atan2(players[t].X-players[i].X,players[t].Y-players[i].Y); break;
				case 2: p=pi-Math.atan2(laserCannons[t].X-players[i].X,laserCannons[t].Y-players[i].Y); break;
				case 3: p=pi-Math.atan2(medkits[t].X-players[i].X,medkits[t].Y-players[i].Y); break;
			}
			while(players[i].theta>pi*2)players[i].theta-=pi*2;
			while(players[i].theta<0)players[i].theta+=pi*2;
			if(Math.abs(p-players[i].theta)>pi){
				if(p>players[i].theta){
					p-=pi*2;
				}else{
					players[i].theta-=pi*2;
				}
			}
			if(p<players[i].theta){
				players[i].thetaV-=.05;
			}else{
				players[i].thetaV+=.05;
			}
			if(Math.random()<.1) players[i].thetaV-=.08;
			if(Math.random()>.9) players[i].thetaV+=.08;
			players[i].theta+=players[i].thetaV;
			players[i].thetaV/=1.5;
			
			if(Math.random()<.05)players[i].thrust=!players[i].thrust;
			if(players[i].thrust){
				players[i].VX+=Math.sin(players[i].theta)*shipV;
				players[i].VY-=Math.cos(players[i].theta)*shipV;
			}
			players[i].X+=players[i].VX;
			players[i].Y+=players[i].VY;
			players[i].VX/=shipDrag;
			players[i].VY/=shipDrag;
			if(Math.random()<.05)players[i].shooting=!players[i].shooting;
		}
		if(players[i].alive && players[i].shooting && players[i].shotTimer<frames){
			players[i].shotTimer=frames+shotInterval;
			bullets.push(new Bullet(players[i].X,players[i].Y,players[i].theta,players[i].id));
			for(j=1;j<players[i].gunLevel;++j){
				bullets.push(new Bullet(players[i].X,players[i].Y,players[i].theta+.1*j,players[i].id));
				bullets.push(new Bullet(players[i].X,players[i].Y,players[i].theta-.1*j,players[i].id));
			}
			d=Math.sqrt((players[i].X-players[0].X)*(players[i].X-players[0].X)+
						(players[i].Y-players[0].Y)*(players[i].Y-players[0].Y));
			if(d<4000){
				pew = new Audio("pew.ogg");
				pew.volume=.1/(1+d/300);
				pew.play();				
			}
		}
		for(j=0;j<laserCannons.length;++j){
			d=Math.sqrt((laserCannons[j].X-players[i].X)*(laserCannons[j].X-players[i].X)+
						(laserCannons[j].Y-players[i].Y)*(laserCannons[j].Y-players[i].Y));
			if(d<players[i].size){
				if(!i){
					upgrade=new Audio("upgrade.mp3");
					upgrade.volume=.5;
					upgrade.play();
				}
				players[i].gunLevel++;
				laserCannons.splice(j,1);
				while(laserCannons.length<initLaserCannons){
					d=Math.random()*dispersalRadius; p=pi*2*Math.random(); x=Math.sin(p)*d; y=Math.cos(p)*d;
					laserCannons.push(new LaserCannon(x,y));
				}
				break;
			}
		}
		for(j=0;j<medkits.length;++j){
			d=Math.sqrt((medkits[j].X-players[i].X)*(medkits[j].X-players[i].X)+
						(medkits[j].Y-players[i].Y)*(medkits[j].Y-players[i].Y));
			if(d<players[i].size){
				if(!i){
					upgrade=new Audio("upgrade.mp3");
					upgrade.volume=.5;
					upgrade.play();
				}
				players[i].health=players[i].AI?initAIHealth:initHumanHealth;
				medkits.splice(j,1);
				while(medkits.length<initMedkits){
					d=Math.random()*dispersalRadius; p=pi*2*Math.random(); x=Math.sin(p)*d; y=Math.cos(p)*d;
					medkits.push(new Medkit(x,y));
				}
				break;
			}
		}
	}
	players[0].X+=players[0].VX;
	players[0].Y+=players[0].VY;
	players[0].VX/=shipDrag;
	players[0].VY/=shipDrag;
}

function rgb(col){
	
	var r = parseInt((.5+Math.sin(col)*.5)*16);
	var g = parseInt((.5+Math.cos(col)*.5)*16);
	var b = parseInt((.5-Math.sin(col)*.5)*16);
	return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}

function rg(col){
	
	var r = parseInt((.5+Math.sin(col)*.5)*16);
	var g = parseInt((.5+Math.cos(col)*.5)*16);
	var b = 0;
	return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}

function drawRotatedImage(image, x, y, width, height, angle) { 

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.drawImage(image, -width/2, -height/2, width, height);
	ctx.restore();
}

function draw(){
	
	ctx.clearRect(0,0,cx*2,cy*2);
	ctx.globalAlpha=1;
	
	scx=cx+infoPanelWidth/2;
	scy=cy;
	
	bx+=(players[0].X-bx)/(12*2.5*shipDrag/shipV);
	by+=(players[0].Y-by)/(9*2.5*shipDrag/shipV);
	for(i=-2;i<=2;++i){
		for(j=-2;j<=2;++j){
			ox=scx+background.width*(i+parseInt(bx/background.width));
			oy=scy+background.height*(j+parseInt(by/background.height));
			ctx.drawImage(background,ox-background.width/2-bx,oy-background.height/2-by,background.width,background.height);
		}
	}
	
	for(i=0;i<bullets.length;++i){
		x=scx-bx+bullets[i].X;
		y=scy-by+bullets[i].Y;
		if(x>0-bullets[i].size&&x<cx*2+bullets[i].size&&y>0-bullets[i].size&&y<cy*2+bullets[i].size){
			drawRotatedImage(bullet,x,y,bullet.width/300*bullets[i].size,bullet.height/300*bullets[i].size,bullets[i].theta);			
		}
	}
	
	for(i=0;i<players.length;++i){
		if(players[i].alive){
			size=players[i].size;
			if(players[i].thrust){
				ox=scx+Math.sin(-players[i].theta)*size/2-bx;
				oy=scy+Math.cos(-players[i].theta)*size/2-by;
				drawRotatedImage(blast,ox+players[i].X,oy+players[i].Y,blast.width/300*size,blast.height/300*size,players[i].theta);
			}
			ox=scx-Math.sin(-players[i].theta)*size/6-bx;
			oy=scy-Math.cos(-players[i].theta)*size/6-by;
			drawRotatedImage(players[i].img,ox+players[i].X,oy+players[i].Y,size,size,players[i].theta);
		}
	}

	for(i=0;i<laserCannons.length;++i){		
		x=scx-bx+laserCannons[i].X;
		y=scy-by+laserCannons[i].Y;
		if(x>0-laserCannons[i].size&&x<cx*2+laserCannons[i].size&&y>0-laserCannons[i].size&&y<cy*2+laserCannons[i].size){
			drawRotatedImage(hexMarquis,x,y,300,300,frames/50);
			ctx.drawImage(laserCannonPic,x-laserCannonPic.width/2,y-laserCannonPic.height/2,laserCannonPic.width/300*laserCannons[i].size,laserCannonPic.height/300*laserCannons[i].size);
		}
	}
	
	for(i=0;i<medkits.length;++i){		
		x=scx-bx+medkits[i].X;
		y=scy-by+medkits[i].Y;
		if(x>0-medkits[i].size&&x<cx*2+medkits[i].size&&y>0-medkits[i].size&&y<cy*2+medkits[i].size){
			drawRotatedImage(hexMarquis,x,y,300,300,frames/50);
			ctx.drawImage(medkitPic,x-medkits[i].size/2,y-medkits[i].size/2,medkits[i].size,medkits[i].size);
		}
	}
	
	for(i=0;i<splosions.length;++i){
		if(splosions[i].radius<10000){
			splosions[i].radius+=50;
			ctx.globalAlpha=1/(1+splosions[i].radius/200);
			ox=scx-bx;
			oy=scy-by;
			d=Math.sqrt((splosions[i].X-players[0].X)*(splosions[i].X-players[0].X)+
						(splosions[i].Y-players[0].Y)*(splosions[i].Y-players[0].Y));
			if(d<5000){
				ctx.drawImage(splodePic,ox+splosions[i].X-splosions[i].radius/2,oy+splosions[i].Y-splosions[i].radius/2,splosions[i].radius,splosions[i].radius);
			}
			for(j=0;j<splosions[i].sparks.length;++j){
				splosions[i].sparks[j].radius/=1.03;
				splosions[i].sparks[j].X+=splosions[i].sparks[j].VX;
				splosions[i].sparks[j].Y+=splosions[i].sparks[j].VY;
				splosions[i].sparks[j].VX/=1.1;
				splosions[i].sparks[j].VY/=1.1;
				if(d<5000)ctx.drawImage(spark,ox+splosions[i].sparks[j].X-splosions[i].sparks[j].radius/2,oy+splosions[i].sparks[j].Y-splosions[i].sparks[j].radius/2,splosions[i].sparks[j].radius,splosions[i].sparks[j].radius);
			}
		}else{
			splosions.splice(i,1);
		}
	}
	
	if(painAlpha){
		ctx.globalAlpha=painAlpha>1?1:painAlpha;
		ctx.drawImage(pain,0,0,cx*2,cy*2);
		painAlpha-=.1;
		if(painAlpha<0)painAlpha=0;
	}


	ctx.globalAlpha=.75;
	ctx.fillStyle="#000";
	ctx.fillRect(0,0,infoPanelWidth,cy*2);
	ctx.strokeStyle="#488";
	ctx.lineWidth=infoPanelBorderWidth;
	ctx.strokeRect(infoPanelBorderWidth/2,infoPanelBorderWidth/2,infoPanelWidth-infoPanelBorderWidth,cy*2-infoPanelBorderWidth);
	ctx.beginPath();
	ctx.moveTo(infoPanelBorderWidth,infoPanelWidth-infoPanelBorderWidth/2);
	ctx.lineTo(infoPanelWidth-infoPanelBorderWidth,infoPanelWidth-infoPanelBorderWidth/2);
	ctx.stroke();
	
	mapWidth=infoPanelWidth-infoPanelBorderWidth*2;
	mapScale=25;
	ctx.lineWidth=3;
	ctx.globalAlpha=.1;
	ctx.strokeStyle="#88f";
	divisionSpacing=25;
	x=infoPanelBorderWidth+(-players[0].X/mapScale)%divisionSpacing+divisionSpacing*(-players[0].X<0?1:0);
	for(i=x;i<mapWidth+infoPanelBorderWidth;i+=divisionSpacing){
		ctx.beginPath();
		ctx.moveTo(i,infoPanelBorderWidth);
		ctx.lineTo(i,infoPanelBorderWidth+mapWidth);
		ctx.stroke();
	}
	y=infoPanelBorderWidth+(-players[0].Y/mapScale)%divisionSpacing+divisionSpacing*(-players[0].Y<0?1:0);
	for(i=y;i<mapWidth+infoPanelBorderWidth;i+=divisionSpacing){
		ctx.beginPath();
		ctx.moveTo(infoPanelBorderWidth,i);
		ctx.lineTo(infoPanelBorderWidth+mapWidth,i);
		ctx.stroke();
	}
	ctx.lineWidth=1;
	ctx.globalAlpha=.15;
	ctx.strokeStyle="#fff";
	divisionSpacing=50;
	x=infoPanelBorderWidth+(-players[0].X/mapScale)%divisionSpacing+divisionSpacing*(-players[0].X<0?1:0);
	for(i=x;i<mapWidth+infoPanelBorderWidth;i+=divisionSpacing){
		ctx.beginPath();
		ctx.moveTo(i,infoPanelBorderWidth);
		ctx.lineTo(i,infoPanelBorderWidth+mapWidth);
		ctx.stroke();
	}
	y=infoPanelBorderWidth+(-players[0].Y/mapScale)%divisionSpacing+divisionSpacing*(-players[0].Y<0?1:0);
	for(i=y;i<mapWidth+infoPanelBorderWidth;i+=divisionSpacing){
		ctx.beginPath();
		ctx.moveTo(infoPanelBorderWidth,i);
		ctx.lineTo(infoPanelBorderWidth+mapWidth,i);
		ctx.stroke();
	}
	ctx.globalAlpha=.85;

	for(i=0;i<medkits.length;++i){
		x=infoPanelWidth/2+medkits[i].X/mapScale-players[0].X/mapScale;
		y=infoPanelWidth/2+medkits[i].Y/mapScale-players[0].Y/mapScale;
		if(x<infoPanelBorderWidth)x=infoPanelBorderWidth;
		if(x>infoPanelWidth-infoPanelBorderWidth)x=infoPanelWidth-infoPanelBorderWidth; 
		if(y<infoPanelBorderWidth)y=infoPanelBorderWidth;
		if(y>infoPanelWidth-infoPanelBorderWidth)y=infoPanelWidth-infoPanelBorderWidth;
		d=Math.sqrt((medkits[i].X-players[0].X)*(medkits[i].X-players[0].X)+
					(medkits[i].Y-players[0].Y)*(medkits[i].Y-players[0].Y));
		size=8+50/(1+d/1000);
		ctx.drawImage(medkitPic,x-size/2,y-size/2,size,size);
	}

	for(i=1;i<players.length;++i){
		if(players[i].alive){			
			x=infoPanelWidth/2+players[i].X/mapScale-players[0].X/mapScale;
			y=infoPanelWidth/2+players[i].Y/mapScale-players[0].Y/mapScale;
			if(x<infoPanelBorderWidth)x=infoPanelBorderWidth;
			if(x>infoPanelWidth-infoPanelBorderWidth)x=infoPanelWidth-infoPanelBorderWidth; 
			if(y<infoPanelBorderWidth)y=infoPanelBorderWidth;
			if(y>infoPanelWidth-infoPanelBorderWidth)y=infoPanelWidth-infoPanelBorderWidth;
			d=Math.sqrt((players[i].X-players[0].X)*(players[i].X-players[0].X)+
						(players[i].Y-players[0].Y)*(players[i].Y-players[0].Y));
			size=8+100/(1+d/1000);
			ctx.drawImage(target,x-size/2,y-size/2,size,size);
		}
	}

	for(i=0;i<laserCannons.length;++i){
		x=infoPanelWidth/2+laserCannons[i].X/mapScale-players[0].X/mapScale;
		y=infoPanelWidth/2+laserCannons[i].Y/mapScale-players[0].Y/mapScale;
		if(x<infoPanelBorderWidth)x=infoPanelBorderWidth;
		if(x>infoPanelWidth-infoPanelBorderWidth)x=infoPanelWidth-infoPanelBorderWidth; 
		if(y<infoPanelBorderWidth)y=infoPanelBorderWidth;
		if(y>infoPanelWidth-infoPanelBorderWidth)y=infoPanelWidth-infoPanelBorderWidth;
		d=Math.sqrt((laserCannons[i].X-players[0].X)*(laserCannons[i].X-players[0].X)+
					(laserCannons[i].Y-players[0].Y)*(laserCannons[i].Y-players[0].Y));
		size=8+100/(1+d/1000);
		drawRotatedImage(hexMarquis,x,y,size,size,frames/50);
		ctx.drawImage(laserCannonPic,x-laserCannonPic.width/300*size/2,y-laserCannonPic.height/300*size/2,laserCannonPic.width/300*size,laserCannonPic.width/300*size);
	}


	ctx.fillStyle="#fff";
	for(i=0;i<bullets.length;++i){
		x=infoPanelWidth/2+bullets[i].X/mapScale-players[0].X/mapScale;
		y=infoPanelWidth/2+bullets[i].Y/mapScale-players[0].Y/mapScale;
		if(x>infoPanelBorderWidth && x<infoPanelWidth-infoPanelBorderWidth && 
		   y>infoPanelBorderWidth && y<infoPanelWidth-infoPanelBorderWidth){
			ctx.fillRect(x-2,y-2,4,4);
		}
	}

	drawRotatedImage(arrow,infoPanelWidth/2,infoPanelWidth/2,arrow.width/7,arrow.height/7,players[0].theta);
	
	ctx.globalAlpha=1;
	ctx.font = "32px Square721";
	ctx.fillStyle="#088";
	ctx.fillText("HEALTH",infoPanelBorderWidth*2,infoPanelWidth+32);
	ctx.fillStyle=rg(pi-pi/100*players[0].health-.01);
	ctx.fillRect(infoPanelBorderWidth*2,infoPanelWidth+40,(infoPanelWidth-infoPanelBorderWidth*4)/100*players[0].health,50);
	ctx.lineWidth=2;
	ctx.strokeStyle="#fff";
	ctx.strokeText(players[0].health+"%",infoPanelWidth/2-40,infoPanelWidth+77);
	ctx.fillStyle="#000";
	ctx.fillText(players[0].health+"%",infoPanelWidth/2-40,infoPanelWidth+77);
	ctx.lineWidth=4;
	ctx.strokeStyle="#088";
	ctx.strokeRect(infoPanelBorderWidth*2,infoPanelWidth+40,infoPanelWidth-infoPanelBorderWidth*4,50);
	
	// Gun Level
	// Enemies Killed
	// Times Died
	// AI Players
	// Human Players
		
	ctx.fillStyle="#088";
	ctx.textAlign="end";
	ctx.fillText("Gun Barrels",infoPanelBorderWidth*2+225,infoPanelWidth+132);
	ctx.fillText("Kills",infoPanelBorderWidth*2+225,infoPanelWidth+132+40);
	ctx.fillText("Respawns",infoPanelBorderWidth*2+225,infoPanelWidth+132+80);
	ctx.fillText("AI Players",infoPanelBorderWidth*2+225,infoPanelWidth+132+120);
	ctx.fillText("Humans",infoPanelBorderWidth*2+225,infoPanelWidth+132+160);
	ctx.fillText("World Bullets",infoPanelBorderWidth*2+225,infoPanelWidth+132+200);
	ctx.textAlign="start";
	ctx.fillText(":"+(players[0].gunLevel*2-1),infoPanelBorderWidth*2+225,infoPanelWidth+132);
	ctx.fillText(":"+players[0].kills,infoPanelBorderWidth*2+225,infoPanelWidth+132+40);
	ctx.fillText(":"+players[0].respawns,infoPanelBorderWidth*2+225,infoPanelWidth+132+80);
	ctx.fillText(":"+AIplayers,infoPanelBorderWidth*2+225,infoPanelWidth+132+120);
	ctx.fillText(":"+humanPlayers,infoPanelBorderWidth*2+225,infoPanelWidth+132+160);
	ctx.fillText(":"+bullets.length,infoPanelBorderWidth*2+225,infoPanelWidth+132+200);
}

function frame(){

	if(frames>100000)frames=0;
	frames++;
	doLogic();
	draw();
}

function kickoff(){
	
	clearInterval(loadTimer);
	$("body").css("background","#000");
	$("#canvas").show();
	draw();
	$("#canvas").css("background","#000");
	$("#loadingOuter").hide();
	setInterval(frame,30);
}

function load(){

	$("#loading").html("LOADING");
	for(i=0;i<frames%6;++i) $("#loading").html($("#loading").html()+".");
	frames++;
}

initVars();
loadTimer=setInterval(load,100);
