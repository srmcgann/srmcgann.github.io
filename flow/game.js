(function(){ 
    
    function Vert(x,y,vx,vy,theta){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.theta = theta;
    }
    
    
	function drawRotatedImage(image, x, y, width, height, angle, vars) { 

		vars.ctx.save();
		vars.ctx.translate(x, y);
		vars.ctx.rotate(-angle);
		vars.ctx.drawImage(image, -width/2, -height/2, width, height);
		vars.ctx.restore();
	}

	
    function process(vars){
        
		var p,d;
		for(var i=0;i<vars.drips.length;++i){
			vars.drips[i].theta=Math.atan2(vars.drips[i].vx,vars.drips[i].vy);
			for(var j=0;j<vars.CPS.length;++j){
				d=((vars.CPS[j].x-vars.drips[i].x)*(vars.CPS[j].x-vars.drips[i].x)+
							(vars.CPS[j].y-vars.drips[i].y)*(vars.CPS[j].y-vars.drips[i].y));
				p=Math.atan2(vars.CPS[j].x-vars.drips[i].x,vars.CPS[j].y-vars.drips[i].y);
				if(Math.abs(p-vars.drips[i].theta)>Math.PI){
					if(p>vars.drips[i].theta){
						p-=Math.PI*2;
					}else{
						p+=Math.PI*2;
					}
				}
				if(p>vars.drips[i].theta){
					vars.drips[i].theta-=Math.min(Math.PI,Math.PI-Math.abs(p-vars.drips[i].theta))/(1+d/2200);
				}else{
					vars.drips[i].theta+=Math.min(Math.PI,Math.PI-Math.abs(p-vars.drips[i].theta))/(1+d/2200);
				}
			}
			vars.drips[i].theta+=-.5/2+Math.random()/2;
			vars.drips[i].vx=Math.sin(vars.drips[i].theta)*vars.dripV;
			vars.drips[i].vy=Math.cos(vars.drips[i].theta)*vars.dripV;
			if(vars.drips[i].x+vars.drips[i].vx>vars.canvas.width || vars.drips[i].x+vars.drips[i].vx<0)vars.drips[i].vx*=-1;
			if(vars.drips[i].y+vars.drips[i].vy>vars.canvas.height || vars.drips[i].y+vars.drips[i].vy<0)vars.drips[i].vy*=-1;
			vars.drips[i].x+=vars.drips[i].vx;
			vars.drips[i].y+=vars.drips[i].vy;
		}
		
		for(var i=0;i<vars.CPS.length-1;++i){
			if(vars.CPS[i].x+vars.CPS[i].vx>vars.canvas.width-70 || vars.CPS[i].x+vars.CPS[i].vx<70)vars.CPS[i].vx*=-1;
			if(vars.CPS[i].y+vars.CPS[i].vy>vars.canvas.height-70 || vars.CPS[i].y+vars.CPS[i].vy<70)vars.CPS[i].vy*=-1;
			vars.CPS[i].x+=vars.CPS[i].vx;
			vars.CPS[i].y+=vars.CPS[i].vy;
			vars.CPS[i].theta=Math.atan2(vars.CPS[i].vx,vars.CPS[i].vy);
			p=Math.PI*2/(vars.CPS.length-1)*i+vars.frameNo/40;
			vars.CPS[i].x=vars.cx+Math.sin(p)*vars.cx/2;
			vars.CPS[i].y=vars.cy+Math.cos(p)*vars.cy/2;
		}
		vars.CPS[vars.CPS.length-1].x=vars.mx;
		vars.CPS[vars.CPS.length-1].y=vars.my;
    }

  
    function draw(vars){
		vars.ctx.globalAlpha=.075;
		vars.ctx.fillStyle="#104";
        vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
		vars.ctx.globalAlpha=1;
		for(var i=0;i<vars.drips.length;++i){
			drawRotatedImage(vars.dripPic,vars.drips[i].x,vars.drips[i].y,vars.dripPic.width/4,vars.dripPic.height/4,vars.drips[i].theta,vars);
		}
		
		for(var i=0;i<vars.CPS.length;++i){
			vars.ctx.drawImage(vars.ballPic,vars.CPS[i].x-100,vars.CPS[i].y-100,200,200);
		}
    }
    
	
	function loadScene(vars){
		
		var initDrips=2000, initControlPoints=1, x,y,vx,vy,p;
		vars.dripV=9;
		vars.CPV=5;
		vars.dripPic=new Image();
		vars.dripPic.src="http://cantelope.org/flow/drip.png";
		vars.ballPic=new Image();
		vars.ballPic.src="http://cantelope.org/flow/ball.png";
		vars.drips=[];
		for(var i=0;i<initDrips;++i){
			x=100+Math.random()*(vars.canvas.width-200);
			y=100+Math.random()*(vars.canvas.height-200);
			p=Math.random()*Math.PI*2;
			vx=Math.sin(p)*vars.dripV;
			vy=Math.cos(p)*vars.dripV;
			vars.drips.push(new Vert(x,y,vx,vy,p));
		}
		vars.CPS=[];
		for(var i=0;i<initControlPoints;++i){
			x=100+Math.random()*(vars.canvas.width-200);
			y=100+Math.random()*(vars.canvas.height-200);
			p=Math.random()*Math.PI*2;
			vx=Math.sin(p)*vars.CPV;
			vy=Math.cos(p)*vars.CPV;
			vars.CPS.push(new Vert(x,y,vx,vy));
		}
	}
	

    function frame(vars) {

        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("#canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.canvas.width = 1366*1.5;
            vars.canvas.height = 768*1.5;
            window.addEventListener("resize", function(){
                //vars.canvas.width = document.body.clientWidth;
                //vars.canvas.height = document.body.clientHeight;
                //vars.cx=vars.canvas.width/2;
                //vars.cy=vars.canvas.height/2;
            }, true);
            vars.canvas.addEventListener("mousemove", function(e){
                var rect = canvas.getBoundingClientRect();
                vars.mx = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.canvas.addEventListener("mousedown", function(e){
                vars.mbutton=1;
            }, true);
            vars.canvas.addEventListener("mouseup", function(e){
                vars.mbutton=0;
            }, true);
            vars.canvas.addEventListener("touchstart", function(e){
                vars.mbutton=1;
                e.preventDefault();
                var rect = canvas.getBoundingClientRect();
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.canvas.addEventListener("touchend", function(e){
                vars.mbutton=0;
            }, true);
            vars.canvas.addEventListener("touchmove", function(e){
                e.preventDefault();
                var rect = canvas.getBoundingClientRect();
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.frameNo=0;
            vars.mx=0;
            vars.my=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
            vars.phase=0;
			loadScene(vars);
		}

        vars.frameNo++;
        requestAnimationFrame(function() {
          frame(vars);
        });

        process(vars);
        draw(vars);
    }

frame();
})();