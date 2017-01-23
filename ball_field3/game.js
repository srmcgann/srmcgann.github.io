(function(){ 

    function project3D(x,y,z,vars){

        var p,d;
        x-=vars.camX;
        y-=vars.camY;
        z-=vars.camZ;
        p=Math.atan2(x,z);
        d=Math.sqrt(x*x+z*z);
        x=Math.sin(p-vars.yaw)*d;
        z=Math.cos(p-vars.yaw)*d;
        p=Math.atan2(y,z);
        d=Math.sqrt(y*y+z*z);
        y=Math.sin(p-vars.pitch)*d;
        z=Math.cos(p-vars.pitch)*d;
        var rx1=-1000;
        var ry1=1;
        var rx2=1000;
        var ry2=1;
        var rx3=0;
        var ry3=0;
        var rx4=x;
        var ry4=z;
        var uc=(ry4-ry3)*(rx2-rx1)-(rx4-rx3)*(ry2-ry1);
        var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
        var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
        if(!z)z=0.000000001;
        if(ua>0&&ua<1&&ub>0&&ub<1){
            return {
                x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
                y:vars.cy+y/z*vars.scale,
                d:Math.sqrt(x*x+y*y+z*z)
            };
        }else{
            return { d:-1 };
        }
    }


    function reverseRasterize(depth, vars){

        var vert=new Vert(),d,p;
        vert.x=vars.camX+(-vars.cx+vars.mx)/vars.scale*depth;
        vert.y=vars.camY+(-vars.cy+vars.my)/vars.scale*depth;
        vert.z=vars.camZ+depth;    
        d=Math.sqrt((vert.y-vars.camY)*(vert.y-vars.camY)+(vert.z-vars.camZ)*(vert.z-vars.camZ));
        p=Math.atan2(vert.y-vars.camY,vert.z-vars.camZ);
        vert.y=vars.camY+Math.sin(p+vars.pitch)*d;
        vert.z=vars.camZ+Math.cos(p+vars.pitch)*d;
        d=Math.sqrt((vert.x-vars.camX)*(vert.x-vars.camX)+(vert.z-vars.camZ)*(vert.z-vars.camZ));
        p=Math.atan2(vert.x-vars.camX,vert.z-vars.camZ);
        vert.x=vars.camX+Math.sin(p+vars.yaw)*d;
        vert.z=vars.camZ+Math.cos(p+vars.yaw)*d;

        d=Math.sqrt((vert.x-vars.camX)*(vert.x-vars.camX)+
                    (vert.y-vars.camY)*(vert.y-vars.camY)+
                    (vert.z-vars.camZ)*(vert.z-vars.camZ));
        var x = vert.x-vars.camX;
        var y = vert.y-vars.camY;
        var z = vert.z-vars.camZ;
        var t=d/depth;
        vert.x=vars.camX+x/t;
        vert.y=vars.camY+y/t;
        vert.z=vars.camZ+z/t;
        return vert;
    }


	function interpolateColors(RGB1,RGB2,degree){
		
		var w2=degree;
		var w1=1-w2;
		return [w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]];
	}

    
    function rgbArray(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*256);
        var g = parseInt((0.5+Math.cos(col)*0.5)*256);
        var b = parseInt((0.5-Math.sin(col)*0.5)*256);
        return [r, g, b];
    }


	function colorString(arr){

		var r = parseInt(arr[0]);
		var g = parseInt(arr[1]);
		var b = parseInt(arr[2]);
		return "#"+("0" + r.toString(16) ).slice (-2)+("0" + g.toString(16) ).slice (-2)+("0" + b.toString(16) ).slice (-2);
	}
	

    function rgb(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*16);
        var g = parseInt((0.5+Math.cos(col)*0.5)*16);
        var b = parseInt((0.5-Math.sin(col)*0.5)*16);
        return "#"+r.toString(16)+g.toString(16)+b.toString(16);
    }


    function elevation(x,y,z){

        var dist = Math.sqrt(x*x+y*y+z*z);
        if(dist && z/dist>=-1 && z/dist <=1) return Math.acos(z / dist);
        return 0.00000001;
    }


    function Vert(x,y,z,radius){
        this.x = x;
        this.y = y;
        this.z = z;
        this.ox = x;
        this.oy = y;
        this.oz = z;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.radius = radius;
		this.dist=0;
		this.selected=0;
    }


    function Seg(x1,y1,z1,x2,y2,z2){
        this.a = new Vert(x1,y1,z1);
        this.b = new Vert(x2,y2,z2);
        this.dist=0;
    }

	
	function sortFunction(a,b){
		return b.dist-a.dist;
	}


    function process(vars){
		
		var p,d,t;
		
		p = Math.atan2(vars.camX, vars.camZ);
		d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
		d -= Math.sin(vars.frameNo / 50) / 60;
		t = Math.sin(vars.frameNo / 150) / 80;
		vars.camX = Math.sin(p + t) * d;
		vars.camZ = Math.cos(p + t) * d;
		vars.camY = -Math.sin(vars.frameNo / 180) *15;
		vars.yaw = Math.PI + p + t;
		vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
		
		
		var x,y,z,x1,y1,z1,x2,y2,z2,x3,y3,z3,u,minu,vert,t;
		if(!vars.leftButton){
			var vert=reverseRasterize(1000,vars);
			vars.selected=-1;
			minu=2;
			for(var i=0;i<vars.balls.length;++i){
				x1=vars.camX;
				y1=vars.camY;
				z1=vars.camZ;
				x2=vert.x;
				y2=vert.y;
				z2=vert.z;
				x3=vars.balls[i].x;
				y3=vars.balls[i].y;
				z3=vars.balls[i].z;
				u=((x3-x1)*(x2-x1)+(y3-y1)*(y2-y1)+(z3-z1)*(z2-z1))/(1000*1000);
				if(u>0 && u<1){
					x=x1+u*(x2-x1);
					y=y1+u*(y2-y1);
					z=z1+u*(z2-z1);
					d=Math.sqrt((x3-x)*(x3-x)+(y3-y)*(y3-y)+(z3-z)*(z3-z));
					if(d<=vars.balls[i].radius/2 && u<minu){
						minu=u;
						vars.selected=i;
					}
				}
			}
		}
		

		if(vars.selected!=-1){
			if(!vars.leftButton){
				vert=reverseRasterize(vars.balls[vars.selected].dist,vars);
				vars.dx=vars.balls[vars.selected].x-vert.x;
				vars.dy=vars.balls[vars.selected].y-vert.y;
				vars.dz=vars.balls[vars.selected].z-vert.z;
				vars.d=vars.balls[vars.selected].dist
			}else{
				vert=reverseRasterize(vars.d,vars);
				vars.balls[vars.selected].x=vert.x+vars.dx;
				vars.balls[vars.selected].y=vert.y+vars.dy;
				vars.balls[vars.selected].z=vert.z+vars.dz;
			}
		}
		
		
		for(var i=0;i<vars.balls.length;++i){
			if(i!=vars.selected || !vars.leftButton){
				vars.balls[i].vx+=(vars.balls[i].ox-vars.balls[i].x)/75;
				vars.balls[i].vy+=(vars.balls[i].oy-vars.balls[i].y)/75;
				vars.balls[i].vz+=(vars.balls[i].oz-vars.balls[i].z)/75;
			}
			x1=vars.balls[i].x;
			y1=vars.balls[i].y;
			z1=vars.balls[i].z;
			for(var j=0;j<vars.balls.length;++j){
				if(j!=i && i!= vars.selected){
					x2=vars.balls[j].x;
					y2=vars.balls[j].y;
					z2=vars.balls[j].z;
					d=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)+(z2-z1)*(z2-z1));
					t=vars.balls[j].radius+vars.balls[i].radius;
					if(d<t/2){
						p1=Math.atan2(x2-x1,y2-y1);
						p2=elevation(x2-x1,y2-y1,z2-z1);
						x=vars.balls[j].x-Math.sin(p1)*Math.sin(p2)*t/2;
						y=vars.balls[j].y-Math.cos(p1)*Math.sin(p2)*t/2;
						z=vars.balls[j].z-Math.cos(p2)*t/2;
						vars.balls[i].vx+=(x-vars.balls[j].x)/80*vars.balls[j].radius/vars.balls[i].radius;
						vars.balls[i].vy+=(y-vars.balls[j].y)/80*vars.balls[j].radius/vars.balls[i].radius;
						vars.balls[i].vz+=(z-vars.balls[j].z)/80*vars.balls[j].radius/vars.balls[i].radius;
						vars.balls[i].x=x;
						vars.balls[i].y=y;
						vars.balls[i].z=z;
					}
				}
			}
		}

		for(var i=0;i<vars.balls.length;++i){
			vars.balls[i].x+=vars.balls[i].vx;
			vars.balls[i].y+=vars.balls[i].vy;
			vars.balls[i].z+=vars.balls[i].vz;
			vars.balls[i].vx/=1.035;
			vars.balls[i].vy/=1.035;
			vars.balls[i].vz/=1.035;
		}

		if(vars.selected != vars.balls.length-1 || !vars.leftButton){
			vars.theta++;
			p=vars.theta/50;
			vars.balls[vars.balls.length-1].ox=Math.cos(p)*20;
			vars.balls[vars.balls.length-1].oy=0;
			vars.balls[vars.balls.length-1].oz=Math.sin(p*2)*20;
		}
    }


	function drawFloor(vars){
		
		vars.ctx.fillStyle = "#2f8";
		for (var i = -50; i <= 50; i += 2) {
			for (var j = -50; j <= 50; j += 2) {
				x = i*2;
				z = j*2;
				y = vars.floor;
				point = project3D(x, y, z, vars);
				if (point.d != -1) {
					size = 20000 / (1 + point.d*point.d);
					d = Math.sqrt(x * x + z * z);
					a = 0.5 - Math.pow(d / 100, 4) * 0.5;
					if (a > 0) {
						vars.ctx.globalAlpha = a;
						vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
						//vars.ctx.drawImage(vars.ball2Pic,point.x-size/2,point.y-size/2,size,size);
					}
				}
			}
		}		
		vars.ctx.fillStyle = "#82f";
		for (var i = -50; i <= 50; i += 2) {
			for (var j = -50; j <= 50; j += 2) {
				x = i*2;
				z = j*2;
				y = -vars.floor;
				point = project3D(x, y, z, vars);
				if (point.d != -1) {
					size = 20000 / (1 + point.d*point.d);
					d = Math.sqrt(x * x + z * z);
					a = 0.5 - Math.pow(d / 100, 4) * 0.5;
					if (a > 0) {
						vars.ctx.globalAlpha = a;
						vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
						//vars.ctx.drawImage(vars.ball2Pic,point.x-size/2,point.y-size/2,size,size);
					}
				}
			}
		}		
	}
	
	
    function draw(vars){

        vars.ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawFloor(vars);
		vars.ctx.globalAlpha=1;
		var point,x,y,z,size;

		vars.balls2=JSON.parse(JSON.stringify(vars.balls));
		for(var i=0;i<vars.balls2.length;++i){
			vars.balls2[i].index=i;
		}
		vars.balls2.sort(sortFunction);
		vars.ctx.globalAlpha=.8;
		for(var i=0;i<vars.balls2.length;++i){
			x=vars.balls2[i].x;
			y=vars.balls2[i].y;
			z=vars.balls2[i].z;
			point=project3D(x,y,z,vars);
			vars.balls[vars.balls2[i].index].dist=point.d;
			if(point.d != -1){
				size=900*vars.balls2[i].radius/(1+point.d);
				vars.ctx.drawImage(vars.balls2[i].index==vars.selected?vars.ball3Pic:(vars.balls2[i].index==vars.balls.length-1?vars.ball1Pic:vars.ball2Pic),point.x-size/2,point.y-size/2,size,size);
			}
		}
	}
	

    function loadScene(vars){

		vars.ball1Pic=new Image();
		vars.ball1Pic.src="http://cantelope.org/ball_field3/ball3.png";
		vars.ball2Pic=new Image();
		vars.ball2Pic.src="http://cantelope.org/ball_field3/ball2.png";
		vars.ball3Pic=new Image();
		vars.ball3Pic.src="http://cantelope.org/ball_field3/ball4.png";
		vars.balls=[];

		var x,y,z,p,ok,sd;
		var rows=4, cols=4, bars=4;
		for(var i=0;i<rows;++i){
			for(var j=0;j<cols;++j){
				for(var k=0;k<bars;++k){
					x=(-rows/2+.5)+i;
					y=(-cols/2+.5)+j;
					z=(-bars/2+.5)+k;
					vars.balls.push(new Vert(x*2,y*2,z*2,1.75));
				}
			}
		}
		for(var i=0;i<rows;++i){
			for(var j=0;j<cols;++j){
				for(var k=0;k<bars;++k){
					x=-10+(-rows/2+.5)+i;
					y=(-cols/2+.5)+j;
					z=(-bars/2+.5)+k;
					vars.balls.push(new Vert(x*2,y*2,z*2,1.75));
				}
			}
		}
		
		for(var i=0;i<rows;++i){
			for(var j=0;j<cols;++j){
				for(var k=0;k<bars;++k){
					x=10+(-rows/2+.5)+i;
					y=(-cols/2+.5)+j;
					z=(-bars/2+.5)+k;
					vars.balls.push(new Vert(x*2,y*2,z*2,1.75));
				}
			}
		}
		
		p=0;
		x=Math.sin(p)*10;
		y=0;
		z=Math.cos(p)*10;
		vars.balls.push(new Vert(x,y,z,8));		
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
			vars.canvas.oncontextmenu = function (e) { e.preventDefault(); };
            vars.canvas.addEventListener("mousemove", function(e){
                var rect = canvas.getBoundingClientRect();
				vars.omx=vars.mx;
				vars.omy=vars.my;
                vars.mx = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);
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
                var rect = canvas.getBoundingClientRect();
				vars.omx=vars.mx;
				vars.omy=vars.my;
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.canvas.addEventListener("touchend", function(e){
                vars.leftButton=0;
            }, true);
            vars.canvas.addEventListener("touchmove", function(e){
                e.preventDefault();
                var rect = canvas.getBoundingClientRect();
				vars.omx=vars.mx;
				vars.omy=vars.my;
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.frameNo=0;
            vars.rFrameNo=0;
            vars.camX = 0;
            vars.camY = 0;
            vars.camZ = -40;

			var p1=Math.atan2(vars.camX,vars.camZ);
			var p2=elevation(vars.camX,vars.camZ,vars.camY);
			if(p2<0)p2=0;
			if(p2>Math.PI)p2=Math.PI;
			vars.yaw=Math.PI+p1;
			vars.pitch=-Math.PI/2+p2;

			vars.mx=0;
            vars.my=0;
			vars.omx=vars.mx;
			vars.omy=vars.my;
			vars.selectDist=0;
			vars.wheelDelta=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
            vars.scale=700;
			vars.floor=18;
			vars.theta=0;
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