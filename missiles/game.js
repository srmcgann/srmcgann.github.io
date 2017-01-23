(function(){ 


	function transform(shape,scaleX,scaleY){

		for(var i=0;i<shape.segs.length;++i){
			shape.segs[i].a.x*=scaleX;
			shape.segs[i].a.y*=scaleY;
			shape.segs[i].b.x*=scaleX;
			shape.segs[i].b.y*=scaleY;
		}
	}

    
    function rotate(vert,theta){

		rvert=new Vert(vert.x,vert.y);
        var d=Math.sqrt(vert.x*vert.x+vert.y*vert.y);
		var p=Math.atan2(vert.x,vert.y);
		rvert.x=Math.sin(p+theta)*d;
		rvert.y=Math.cos(p+theta)*d;
        return rvert;
	}

    
    function rgb(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*16);
        var g = parseInt((0.5+Math.cos(col)*0.5)*16);
        var b = parseInt((0.5-Math.sin(col)*0.5)*16);
        return "#"+r.toString(16)+g.toString(16)+b.toString(16);
    }


    function Vert(x,y){
        this.x = x;
        this.y = y;
        this.curX=x;
        this.curY=y;
    }
    
    
    function Missile(x,y,vx,vy,pic,size,id){
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
		this.size=size;
        this.pic=pic;
		this.id=id;
    }


    function Seg(x1,y1,x2,y2){
        this.a = new Vert(x1,y1);
        this.b = new Vert(x2,y2);
        this.dist=0;
    }


    function process(vars){
        
        vars.shapes[0].shooting = vars.mbutton;
		//vars.missileTurnRadius=.2+Math.cos(vars.frameNo/100)/8;
		//vars.missileV=20+Math.cos(vars.frameNo/60)*10;
		
		for(var i=0;i<vars.shapes.length;++i){
			if(i){
				if(vars.shapes[i].x+vars.shapes[i].vx < vars.shapes[i].size || vars.shapes[i].x+vars.shapes[i].vx > vars.cx*2-vars.shapes[i].size) vars.shapes[i].vx*=-1;
				if(vars.shapes[i].y+vars.shapes[i].vy < vars.shapes[i].size || vars.shapes[i].y+vars.shapes[i].vy > vars.cy*2-vars.shapes[i].size) vars.shapes[i].vy*=-1;
				vars.shapes[i].x+=vars.shapes[i].vx;
				vars.shapes[i].y+=vars.shapes[i].vy;
				if(Math.random()<.05)vars.shapes[i].shooting=!vars.shapes[i].shooting;
			}
			if(vars.shapes[i].shotTimer<vars.frameNo){
				vars.shapes[i].shotTimer=vars.frameNo+vars.shotInterval;
				if(vars.shapes[i].shooting) launchMissiles(vars.shapes[i],vars,i);
			}
		}
		
		var mind,d,p1,p2,t;
        for(var i=0;i<vars.missiles.length;++i){
			if(vars.missiles[i].size>.03){
				vars.missiles[i].size-=.0025;
				vars.missiles[i].x+=vars.missiles[i].vx;
				vars.missiles[i].y+=vars.missiles[i].vy;
			}else{
				vars.missiles.splice(i,1);
			}
			mind=100000000;
			t=-1;
			for(var j=0;j<vars.shapes.length;++j){
				if(j!=vars.missiles[i].id){
					d=(vars.missiles[i].x-vars.shapes[j].x)*(vars.missiles[i].x-vars.shapes[j].x)+
					  (vars.missiles[i].y-vars.shapes[j].y)*(vars.missiles[i].y-vars.shapes[j].y);
					if(d<vars.shapes[j].size*vars.shapes[j].size){
						vars.missiles.splice(i,1);
						break;
					}
					if(d<=mind){
						mind=d;
						t=j;
					}
				}
			}
			if(t!=-1 && typeof vars.missiles[i] != "undefined"){
				p1=Math.atan2(vars.shapes[t].x-vars.missiles[i].x,vars.shapes[t].y-vars.missiles[i].y);
				p2=Math.atan2(vars.missiles[i].vx,vars.missiles[i].vy);
				if(Math.abs(p1-p2)>Math.PI){
					if(p1>p2){
						p1-=Math.PI*2;
					}else{
						p2-=Math.PI*2;
					}
				}
				if(p1>p2){
					p2+=Math.min(vars.missileTurnRadius,p1-p2);
				}else{
					p2-=Math.min(vars.missileTurnRadius,p2-p1);
				}
				vars.missiles[i].vx=Math.sin(p2)*vars.missileV;
				vars.missiles[i].vy=Math.cos(p2)*vars.missileV;
			}
        }
    }
    
    
    function launchMissiles(shape, vars, id){
        
        var t=0,vx,vy,p,size=id?.25:.35,pic;
        for(var i=1;i<=shape.iterations;++i) t+=Math.pow(shape.sd,i);
		switch((id+3)%6){
			case 0: pic=vars.purpleMissile; break;
			case 1: pic=vars.redMissile; break;
			case 2: pic=vars.orangeMissile; break;
			case 3: pic=vars.yellowMissile; break;
			case 4: pic=vars.greenMissile; break;
			case 5: pic=vars.blueMissile; break;
		}
		if(!id)pic=vars.whiteMissile;
        for(var i=t;i<shape.segs.length;++i){
            p=Math.atan2(shape.segs[i].a.curX-shape.x,shape.segs[i].a.curY-shape.y);
            vx=Math.sin(p)*vars.missileV;
            vy=Math.cos(p)*vars.missileV;
            vars.missiles.push(new Missile(shape.segs[i].a.curX,shape.segs[i].a.curY,vx,vy,pic,size,id));
        }
    }

    
    function draw(vars){

		vars.ctx.globalAlpha=.3;
		vars.ctx.fillStyle="#001";
        vars.ctx.fillRect(0, 0, canvas.width, canvas.height);

        var x,y;
		vars.ctx.globalAlpha=.25;
        for(var i=0;i<vars.missiles.length;++i){
            x=vars.missiles[i].x;
            y=vars.missiles[i].y;
			drawRotatedImage(vars.missiles[i].pic,vars.missiles[i].x,vars.missiles[i].y,vars.missiles[i].pic.width*vars.missiles[i].size,vars.missiles[i].pic.height*vars.missiles[i].size,Math.atan2(vars.missiles[i].vx,-vars.missiles[i].vy),vars);
        }

        var vert1=new Vert(),vert2=new Vert(),t;
        vars.shapes[0].x=vars.mx;
        vars.shapes[0].y=vars.my;
		vars.ctx.lineWidth=4;
		vars.ctx.globalAlpha=1;
        for(var j=0;j<vars.shapes.length;++j){
			vars.ctx.strokeStyle="#fff";
			vars.ctx.fillStyle=vars.shapes[j].color;
			vars.shapes[j].theta+=Math.sin(vars.frameNo/50)/20;
			for(var i=0;i<vars.shapes[j].segs.length;++i){
				vert1=rotate(vars.shapes[j].segs[i].a,vars.shapes[j].theta);
				vert2=rotate(vars.shapes[j].segs[i].b,vars.shapes[j].theta);
				vert1.x+=vars.shapes[j].x;
				vert1.y+=vars.shapes[j].y;
				vert2.x+=vars.shapes[j].x;
				vert2.y+=vars.shapes[j].y;
				vars.shapes[j].segs[i].a.curX=vert1.x;
				vars.shapes[j].segs[i].a.curY=vert1.y;
				vars.shapes[j].segs[i].b.curX=vert2.x;
				vars.shapes[j].segs[i].b.curY=vert2.y;
				vars.ctx.beginPath();
				vars.ctx.moveTo(vert1.x,vert1.y);
				vars.ctx.lineTo(vert2.x,vert2.y);
				vars.ctx.stroke();
			}
			vars.ctx.globalAlpha=.5;
			t=0;
			while(t<vars.shapes[j].segs.length-1){
				if(!(t%vars.shapes[j].sd)){
					vars.ctx.beginPath();
					vars.ctx.moveTo(vars.shapes[j].segs[t].a.curX,vars.shapes[j].segs[t].a.curY);					
				}
				t++;
				vert1.x=vars.shapes[j].segs[t].a.curX;
				vert1.y=vars.shapes[j].segs[t].a.curY;
				vars.ctx.lineTo(vert1.x,vert1.y);
				if(!((t+1)%vars.shapes[j].sd)){
					vars.ctx.closePath();
					vars.ctx.fill();					
				}
			}
        }
    }
    

	function spawnShape(vars){
		
        var shape={};
        var p,size=vars.shapes.length?vars.cy/10:vars.cy/4,x1,y1,x2,y2,point1,point2;
        shape.sd=3+parseInt((vars.shapes.length+3)%4);
        shape.iterations=2;
        shape.x=vars.cx;
        shape.y=vars.cy;
        shape.theta=0;
		shape.vx=-vars.initV/2+Math.random()*vars.initV;
		shape.vy=-vars.initV/2+Math.random()*vars.initV;
		shape.size=size;
		switch((vars.shapes.length+3)%6){
			case 0: shape.color="#408"; break;
			case 1: shape.color="#800"; break;
			case 2: shape.color="#840"; break;
			case 3: shape.color="#880"; break;
			case 4: shape.color="#081"; break;
			case 5: shape.color="#018"; break;
		}
		if(!vars.shapes.length)shape.color="#fff";
		shape.shotTimer=0;
		shape.shooting=0;
        shape.segs=[];
        shape.missiles=[];
        for(var i=0;i<shape.sd;++i){
            p=Math.PI*2/shape.sd*i;
            x1=Math.sin(p)*size;
            y1=Math.cos(p)*size;
            p=Math.PI*2/shape.sd*(i+1);
            x2=Math.sin(p)*size;
            y2=Math.cos(p)*size;
            shape.segs.push(new Seg(x1,y1,x2,y2));
        }
        vars.shapes.push(shape);
        var newShape2=JSON.parse(JSON.stringify(shape));
        for(var k=0;k<shape.iterations;++k){
            tempShape=JSON.parse(JSON.stringify(newShape2));
            newShape2={};
            newShape2.segs=[];
            for(var j=0;j<shape.sd;++j){
                newShape=JSON.parse(JSON.stringify(tempShape));
                transform(newShape,.35,.35);
                p=Math.PI*2/shape.sd*j;
                for(var i=0;i<newShape.segs.length;++i){
                    newShape.segs[i].a.y+=size;
                    newShape.segs[i].b.y+=size;
                    newShape.segs[i].a=rotate(newShape.segs[i].a,p);
                    newShape.segs[i].b=rotate(newShape.segs[i].b,p);
                    newShape2.segs.push(newShape.segs[i]);
                    vars.shapes[vars.shapes.length-1].segs.push(newShape.segs[i]);
                }
            }
        }
	}
	

	function drawRotatedImage(image, x, y, width, height, angle,vars) { 

		vars.ctx.save();
		vars.ctx.translate(x, y);
		vars.ctx.rotate(angle);
		vars.ctx.drawImage(image, -width/2, -height/2, width, height);
		vars.ctx.restore();
	}

	
    function frame(vars) {

        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("#canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.canvas.width = document.body.clientWidth;
            vars.canvas.height = document.body.clientHeight;
            window.addEventListener("resize", function(){
                vars.canvas.width = document.body.clientWidth;
                vars.canvas.height = document.body.clientHeight;
                vars.cx=vars.canvas.width/2;
                vars.cy=vars.canvas.height/2;
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
			vars.shotInterval=5;
			vars.missileV=20;
			vars.missileTurnRadius=.16;
			vars.initV=16;
            vars.shapes=[];
            vars.missiles=[];
			vars.whiteMissile=new Image();
			vars.whiteMissile.src="white_missile.png";
			vars.redMissile=new Image();
			vars.redMissile.src="red_missile.png";
			vars.orangeMissile=new Image();
			vars.orangeMissile.src="orange_missile.png";
			vars.yellowMissile=new Image();
			vars.yellowMissile.src="yellow_missile.png";
			vars.greenMissile=new Image();
			vars.greenMissile.src="green_missile.png";
			vars.blueMissile=new Image();
			vars.blueMissile.src="blue_missile.png";
			vars.purpleMissile=new Image();
			vars.purpleMissile.src="purple_missile.png";
			for(var i=0;i<8;++i) spawnShape(vars);
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