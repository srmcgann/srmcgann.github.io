(function(){ 

	
	function Turkey(x,y){
		this.x=x;
		this.y=y;
		this.vx=0;
		this.vy=0;
	}
	

	function Flower(x,y){
		this.x=x;
		this.y=y;
	}
	

	function rand(vars){
		vars.seed+=.1234;
		return parseFloat('0.'+Math.sin(vars.seed).toString().substr(6));
	}
	

    function doLogic(vars){

		if(vars.phaseTimer<vars.frameNo){
			vars.phaseTimer=vars.frameNo+vars.phaseInterval;
			vars.phase=!vars.phase;
		}
		
		var p,v,d,t,mind;
		
		if(!(vars.frameNo%1000))spawnFlower(vars);
		
		if(vars.leftButton){
			vars.pug.targetX=vars.mx;
			vars.pug.targetY=vars.my;
		}
		vars.pug.dist=Math.sqrt((vars.pug.targetX-vars.pug.x)*(vars.pug.targetX-vars.pug.x)+
								(vars.pug.targetY-vars.pug.y)*(vars.pug.targetY-vars.pug.y));
		if(vars.pug.dist){
			p=Math.atan2(vars.pug.targetX-vars.pug.x,vars.pug.targetY-vars.pug.y);
			if(p<-Math.PI/1.5 || p>=Math.PI/1.5)vars.pug.direction=0;
			if(p>=-Math.PI/1.5 && p<-Math.PI/4)vars.pug.direction=3;
			if(p<Math.PI/4 && p>=-Math.PI/4)vars.pug.direction=2;
			if(p<Math.PI/1.5 && p>=Math.PI/4)vars.pug.direction=1;
			v=vars.pug.speed*vars.pug.dist/300;
			vars.pug.vx=Math.sin(p)*Math.min(v,vars.pug.dist);
			vars.pug.vy=Math.cos(p)*Math.min(v,vars.pug.dist);
			vars.pug.x+=vars.pug.vx;
			vars.pug.y+=vars.pug.vy;
		}
		
		for(var i=0;i<vars.turkeys.length;++i){
			mind=1000000;
			t=-1;
			for(var j=0;j<vars.flowers.length;++j){
				d=Math.sqrt((vars.turkeys[i].x-vars.flowers[j].x)*(vars.turkeys[i].x-vars.flowers[j].x)+
							(vars.turkeys[i].y-vars.flowers[j].y)*(vars.turkeys[i].y-vars.flowers[j].y));
				if(d<mind){
					mind=d;
					t=j;
				}
			}
			if(mind<vars.turkeys[i].up.height){
				vars.flowers.splice(t,1);
				vars.turkeyScore++;
				vars.chomp=new Audio("chomp.ogg");
				vars.chomp.volume=.5;
				vars.chomp.play();
				if(!vars.flowers.length)spawnFlower(vars);
			}else if(t!=-1){
				vars.turkeys[i].targetX=vars.flowers[t].x;
				vars.turkeys[i].targetY=vars.flowers[t].y;
				
				vars.turkeys[i].dist=Math.sqrt((vars.turkeys[i].targetX-vars.turkeys[i].x)*(vars.turkeys[i].targetX-vars.turkeys[i].x)+
											   (vars.turkeys[i].targetY-vars.turkeys[i].y)*(vars.turkeys[i].targetY-vars.turkeys[i].y));
				if(vars.turkeys[i].dist){
					p=Math.atan2(vars.turkeys[i].targetX-vars.turkeys[i].x,vars.turkeys[i].targetY-vars.turkeys[i].y);
					v=vars.turkeys[i].speed;
					vars.turkeys[i].vx=Math.sin(p)*Math.min(v,vars.turkeys[i].dist);
					vars.turkeys[i].vy=Math.cos(p)*Math.min(v,vars.turkeys[i].dist);
					p=Math.atan2(vars.pug.x-vars.turkeys[i].x,vars.pug.y-vars.turkeys[i].y);
					d=Math.sqrt((vars.turkeys[i].x-vars.pug.x)*(vars.turkeys[i].x-vars.pug.x)+
								(vars.turkeys[i].y-vars.pug.y)*(vars.turkeys[i].y-vars.pug.y));
					v=vars.turkeys[i].speed*vars.turkeys[i].speed*50/d;
					vars.turkeys[i].vx-=Math.sin(p)*v;
					vars.turkeys[i].vy-=Math.cos(p)*v;
					p=Math.atan2(vars.turkeys[i].vx,vars.turkeys[i].vy);
					if(p<-Math.PI/1.5 || p>=Math.PI/1.5)vars.turkeys[i].direction=0;
					if(p>=-Math.PI/1.5 && p<-Math.PI/4)vars.turkeys[i].direction=3;
					if(p<Math.PI/4 && p>=-Math.PI/4)vars.turkeys[i].direction=2;
					if(p<Math.PI/1.5 && p>=Math.PI/4)vars.turkeys[i].direction=1;
					vars.turkeys[i].x+=vars.turkeys[i].vx;
					vars.turkeys[i].y+=vars.turkeys[i].vy;
				}			
			}
			d=Math.sqrt((vars.turkeys[i].x-vars.pug.x)*(vars.turkeys[i].x-vars.pug.x)+
						(vars.turkeys[i].y-vars.pug.y)*(vars.turkeys[i].y-vars.pug.y));
			if(d<vars.turkeys[i].up.height){
				vars.turkeys.splice(i,1);
				vars.pugScore++;
				spawnTurkey(vars);
				vars.pugSound=new Audio("pug_sound.ogg");
				vars.pugSound.volume=.5;
				vars.pugSound.play();
				vars.chomp=new Audio("chomp.ogg");
				vars.chomp.volume=.5;
				vars.chomp.play();
			}
		}
	}


    function draw(vars){

        //vars.ctx.clearRect(0, 0, canvas.width, canvas.height);
		vars.ctx.globalAlpha=.2;
		vars.ctx.drawImage(vars.grass,0,0,vars.canvas.width,vars.canvas.height);

		vars.ctx.globalAlpha=1;
		
		for(var i=0;i<vars.flowers.length;++i){
			vars.ctx.drawImage(vars.flower,vars.flowers[i].x-vars.flower.width/2,vars.flowers[i].y-vars.flower.height/2,vars.flower.width,vars.flower.height);
		}
		
		var sx,sy,sWidth,sHeight,x,y,width,height;
		
		for(var i=0;i<vars.turkeys.length;++i){
			switch(vars.turkeys[i].direction%4){
				case 0:
					width=vars.turkeys[i].up.width;
					height=vars.turkeys[i].up.height;
					x=vars.turkeys[i].x-width/2;
					y=vars.turkeys[i].y-height/2;
					vars.ctx.drawImage(vars.turkeys[i].up,x,y);
				break;
				case 1:
					width=vars.turkeys[i].right.width;
					height=vars.turkeys[i].right.height;
					x=vars.turkeys[i].x-width/2;
					y=vars.turkeys[i].y-height/2;
					vars.ctx.drawImage(vars.turkeys[i].right,x,y);
				break;
				case 2:
					width=vars.turkeys[i].down.width;
					height=vars.turkeys[i].down.height;
					x=vars.turkeys[i].x-width/2;
					y=vars.turkeys[i].y-height/2;
					vars.ctx.drawImage(vars.turkeys[i].down,x,y);
				break;
				case 3:
					width=vars.turkeys[i].left.width;
					height=vars.turkeys[i].left.height;
					x=vars.turkeys[i].x-width/2;
					y=vars.turkeys[i].y-height/2;
					vars.ctx.drawImage(vars.turkeys[i].left,x,y);
				break;
			}
		}
		switch(vars.pug.direction%4){
			case 0:
				sx=0;
				sy=vars.phase?vars.pug.up.height/2:0;
				sWidth=vars.pug.up.width;
				sHeight=vars.pug.up.height/2;
				width=vars.pug.up.width;
				height=vars.pug.up.height/2;
				x=vars.pug.x-width/2;
				y=vars.pug.y-height/2;
				vars.ctx.drawImage(vars.pug.up,sx,sy,sWidth,sHeight,x,y,width,height);
			break;
			case 1:
				sx=0;
				sy=vars.phase?vars.pug.right.height/2:0;
				sWidth=vars.pug.right.width;
				sHeight=vars.pug.right.height/2;
				width=vars.pug.right.width/1.5;
				height=vars.pug.right.height/2/1.5;
				x=vars.pug.x+vars.pug.right.width/6-width/1.5;
				y=vars.pug.y+vars.pug.right.height/2/6-height/1.5;
				vars.ctx.drawImage(vars.pug.right,sx,sy,sWidth,sHeight,x,y,width,height);
			break;
			case 2:
				sx=0;
				sy=vars.phase?vars.pug.down.height/2:0;
				sWidth=vars.pug.down.width;
				sHeight=vars.pug.down.height/2;
				width=vars.pug.down.width;
				height=vars.pug.down.height/2;
				x=vars.pug.x-width/2;
				y=vars.pug.y-height/2;
				vars.ctx.drawImage(vars.pug.down,sx,sy,sWidth,sHeight,x,y,width,height);
			break;
			case 3:
				sx=0;
				sy=vars.phase?vars.pug.left.height/2:0;
				sWidth=vars.pug.left.width;
				sHeight=vars.pug.left.height/2;
				width=vars.pug.left.width/1.5;
				height=vars.pug.left.height/2/1.5;
				x=vars.pug.x+vars.pug.left.width/6-width/1.5;
				y=vars.pug.y+vars.pug.left.height/2/6-height/1.5;
				vars.ctx.drawImage(vars.pug.left,sx,sy,sWidth,sHeight,x,y,width,height);
			break;
		}

		vars.ctx.font="96px Square721";
		
		vars.ctx.fillStyle="#a00";
		vars.ctx.fillText("TURKEYS: "+vars.turkeyScore,vars.cx*2-770,100);
		vars.ctx.strokeStyle="#f6a";
		vars.ctx.strokeText("TURKEYS: "+vars.turkeyScore,vars.cx*2-770,100);

		vars.ctx.fillStyle="#38c";
		vars.ctx.fillText("PUG: "+vars.pugScore,120,100);
		vars.ctx.strokeStyle="#fff";
		vars.ctx.strokeText("PUG: "+vars.pugScore,120,100);

	}
	
	
	function spawnTurkey(vars){
		
		var x,y;
		if(Math.random()>=0.5){
			x=Math.random()*vars.canvas.width;
			y=Math.random()>=0.5?-vars.turkeySize:vars.canvas.height+vars.turkeySize;
		}else{
			x=Math.random()>=0.5?-vars.turkeySize:vars.canvas.width+vars.turkeySize;
			y=Math.random()*vars.canvas.height;
		}
		vars.turkeys.push(new Turkey(x,y));
		
		vars.turkeys[vars.turkeys.length-1].left=vars.turkey.left;
		vars.turkeys[vars.turkeys.length-1].right=vars.turkey.right;
		vars.turkeys[vars.turkeys.length-1].up=vars.turkey.up;
		vars.turkeys[vars.turkeys.length-1].down=vars.turkey.down;
		vars.turkeys[vars.turkeys.length-1].targetX=x;
		vars.turkeys[vars.turkeys.length-1].targetY=y;
		vars.turkeys[vars.turkeys.length-1].speed=9.5;
		vars.turkeys[vars.turkeys.length-1].direction=0;
	}
	
	
	function spawnFlower(vars){
		
		var x,y;
		x=vars.flower.width/2+Math.random()*(vars.canvas.width-vars.flower.width);
		y=vars.flower.height/2+Math.random()*(vars.canvas.height-vars.flower.height);
		vars.flowers.push(new Flower(x,y));
		vars.turkeyGobble=new Audio("turkey_gobble.ogg");
		vars.turkeyGobble.volume=.5;
		vars.turkeyGobble.play();
	}
	
	
    function loadScene(vars){

		vars.grass=new Image();
		vars.grass.src="grass.jpg";

		vars.pug={};
		vars.pug.up=new Image();
		vars.pug.up.src="pug_up.png";
		vars.pug.right=new Image();
		vars.pug.right.src="pug_right.png";
		vars.pug.down=new Image();
		vars.pug.down.src="pug_down.png";
		vars.pug.left=new Image();
		vars.pug.left.src="pug_left.png";
		vars.pug.x=vars.cx;
		vars.pug.y=vars.cy;
		vars.pug.vx=0;
		vars.pug.vy=0;
		vars.pug.targetX=vars.cx;
		vars.pug.targetY=vars.cy;
		vars.pug.speed=10;
		vars.pug.direction=0;
		vars.pug.dist=0;
		
		vars.turkey={};
		vars.turkey.up=new Image();
		vars.turkey.up.src="turkey_up.png";
		vars.turkey.right=new Image();
		vars.turkey.right.src="turkey_right.png";
		vars.turkey.down=new Image();
		vars.turkey.down.src="turkey_down.png";
		vars.turkey.left=new Image();
		vars.turkey.left.src="turkey_left.png";
		vars.turkeys=[];
		
		vars.flower=new Image();
		vars.flower.src="flower.png";
		vars.flowers=[];
		
		spawnFlower(vars);
		spawnTurkey(vars);
    }


    function frame(vars) {

        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("#canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.canvas.width = 1366*1.6;
            vars.canvas.height = 768*1.6;
            window.addEventListener("resize", function(){
                //vars.canvas.width = document.body.clientWidth;
                //vars.canvas.height = document.body.clientHeight;
                //vars.cx=vars.canvas.width/2;
                //vars.cy=vars.canvas.height/2;
            }, true);
			vars.canvas.oncontextmenu = function (e) { e.preventDefault(); };
            vars.canvas.addEventListener("mousemove", function(e){
                var rect = vars.canvas.getBoundingClientRect();
				vars.omx=vars.mx;
				vars.omy=vars.my;
                vars.mx = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
            }, true);
            vars.canvas.addEventListener("mousedown", function(e){
                switch(e.which){
					case 1: vars.leftButton=1; break;
					case 3: vars.rightButton=1; break;
				}
            }, true);
            vars.canvas.addEventListener("mouseup", function(e){
                switch(e.which){
					case 1: vars.leftButton=0; break;
					case 3: vars.rightButton=0; break;
				}
            }, true);
            vars.canvas.addEventListener("mousewheel", function(e){
				var e = window.event || e; // old IE support
				vars.wheelDelta = Math.max(-1, Math.min(1, (e.wheelDelta/120 || -e.detail)));
            }, true);
            vars.canvas.addEventListener("touchstart", function(e){
                vars.leftButton=1;
                e.preventDefault();
                var rect = vars.canvas.getBoundingClientRect();
				vars.omx=vars.mx;
				vars.omy=vars.my;
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
            }, true);
            vars.canvas.addEventListener("touchend", function(e){
                vars.leftButton=0;
            }, true);
            vars.canvas.addEventListener("touchmove", function(e){
                e.preventDefault();
                var rect = vars.canvas.getBoundingClientRect();
				vars.omx=vars.mx;
				vars.omy=vars.my;
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
            }, true);
			
            vars.frameNo=0;
			
            vars.mx=0;
            vars.my=0;
			vars.wheelDelta=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
			vars.seed=0;
			vars.phase=0;
			vars.phaseTimer=0;
			vars.phaseInterval=20;
			vars.turnTimer=0;
			vars.turnInterval=80;
			vars.turkeySize=250;
			vars.turkeyScore=0;
			vars.pugScore=0;
 			vars.soundtrack=new Audio("soundtrack.mp3");
			vars.soundtrack.volume=0.25;
			vars.soundtrack.play();
			vars.soundtrack.addEventListener('ended', function() {
				this.currentTime = 0;
				this.play();
			}, false);
           loadScene(vars);
        }

        vars.frameNo++;
        requestAnimationFrame(function() {
          frame(vars);
        });

        doLogic(vars);
        draw(vars);
    }

	frame();
})();