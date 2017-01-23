(function(){ 

    
	function project3D(x, y, z, vars){

	  var p,d
	  var {cos, sin, sqrt, atan2} = Math;
	  x -= vars.camX;
	  y -= vars.camY;
	  z -= vars.camZ;
	  p = atan2(x,z);
	  d = sqrt(x*x+z*z);
	  x = sin(p-vars.yaw)*d;
	  z = cos(p-vars.yaw)*d;
	  p = atan2(y,z);
	  d = sqrt(y*y+z*z);
	  y = sin(p-vars.pitch)*d;
	  z = cos(p-vars.pitch)*d;
	  var x1 = -100,y1=1,x2=100,y2=1;
	  var x3 = 0,y3 = 0,x4 = x,y4 = z;
	  var uc = (y4-y3)*(x2-x1)-(x4-x3)*(y2-y1);
	  var ua = ((x4-x3)*(y1-y3)-(y4-y3)*(x1-x3))/uc;
	  var ub = ((x2-x1)*(y1-y3)-(y2-y1)*(x1-x3))/uc;
	  if(ua>0&&ua<1&&ub>0&&ub<1){
		return {
		  x:vars.cx+(x1+ua*(x2-x1))*vars.scale,
		  y:vars.cy+y/z*vars.scale,
		  d:sqrt(x*x+y*y+z*z)
		};
	  }else{
		return {d:-1};
	  }
	}


    function rgb(col){

        var r = parseInt((0.5+Math.sin(col)*0.5)*16);
        var g = parseInt((0.5+Math.cos(col)*0.5)*16);
        var b = parseInt((0.5-Math.sin(col)*0.5)*16);
        return "#"+r.toString(16)+g.toString(16)+b.toString(16);
    }

    
    function rgbArray(col){

        var r = parseInt((0.5+Math.sin(col)*0.5)*256);
        var g = parseInt((0.5+Math.cos(col)*0.5)*256);
        var b = parseInt((0.5-Math.sin(col)*0.5)*256);
        return [r, g, b];
    }


	function colorString(arr){

		var r = parseInt(arr[0]/256*16);
		var g = parseInt(arr[1]/256*16);
		var b = parseInt(arr[2]/256*16);
		return "#"+r.toString(16)+g.toString(16)+b.toString(16);
	}


	function interpolateColors(RGB1,RGB2,degree){
		
		var w2=degree;
		var w1=1-w2;
		return [w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]];
	}
	

	function Vert(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		
	}
	

	function Seed(x,y,z,vx,vy,vz){
		this.x = x;
		this.y = y;
		this.z = z;
		this.vx = vx;
		this.vy = vy;
		this.vz = vz;		
	}


	function Seg(x1,y1,z1,x2,y2,z2){
		this.a = new Vert(x1,y1,z1);
		this.b = new Vert(x2,y2,z2);
	}


	function drawFloor(vars) {

	  vars.ctx.fillStyle = "#123";
	  var x,y,z,point,size,d,a;
	  for (var i = -100; i <= 100; i += 2) {
		for (var j = -100; j <= 100; j += 2) {
		  x = i;
		  z = j;
		  y = 15;
		  point = project3D(x, y, z, vars);
		  if (point.d != -1) {
			size = 250 / (1 + point.d);
			d = Math.sqrt(x * x + z * z);
			a = 1 - Math.pow(d / 100, 6);
			if (a > 0) {
			  vars.ctx.globalAlpha = a;
			  vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
			}
		  }
		}
	  }
	}


	function elevation(x, y, z) {

	  var dist = Math.sqrt(x * x + y * y + z * z);
	  if (dist && z / dist >= -1 && z / dist <= 1) return Math.acos(z / dist);
	  return 0.00000001;
	}


    function draw(vars){

		vars.ctx.clearRect(0,0,vars.canvas.width,vars.canvas.height);
		
		if(vars.segs.length+vars.seeds.length<vars.maxSeeds && vars.seedTimer<vars.frameNo){
			vars.seedTimer=vars.frameNo+vars.seedSpawnFrequency;
			for(var i=0;i<vars.seedsPerSpawn;++i)spawnSeed(vars);
		}else{
			if(vars.segs.length>=vars.maxSeeds){
				if(vars.alpha>.01){
					vars.alpha-=.01;
				}else{
					loadScene(vars);
				}
			}
		}
		var p,d,t;
		p = Math.atan2(vars.camX, vars.camZ);
		d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
		d -= Math.sin(vars.frameNo / 80) / 30;
		t = Math.sin(vars.frameNo / 160) / 80;
		vars.camX = Math.sin(p + t) * d;
		vars.camZ = Math.cos(p + t) * d;
		vars.camY -= Math.sin(vars.frameNo / 110) / 20;
		vars.yaw = Math.PI + p + t;
		vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;

		drawFloor(vars);

		vars.ctx.globalAlpha=vars.alpha;
		var pointA,pointB,w;
		for(var i=0;i<vars.segs.length;++i){
			pointA=project3D(vars.segs[i].a.x,vars.segs[i].a.y,vars.segs[i].a.z,vars);
			if(pointA.d!=-1){
				pointB=project3D(vars.segs[i].b.x,vars.segs[i].b.y,vars.segs[i].b.z,vars);
				if(pointB.d!=-1){
					d=Math.sqrt(vars.segs[i].a.x*vars.segs[i].a.x+vars.segs[i].a.y*vars.segs[i].a.y+vars.segs[i].a.z*vars.segs[i].a.z);
					w=(120+Math.sin(d/2-vars.frameNo/35)*120)/(1+d/3);
					vars.ctx.lineWidth=1+w/(1+pointA.d*pointA.d);
					vars.ctx.strokeStyle=rgb(Math.PI/3+w/40);
					vars.ctx.beginPath();
					vars.ctx.moveTo(pointA.x,pointA.y);
					vars.ctx.lineTo(pointB.x,pointB.y);
					vars.ctx.stroke();
				}
			}
		}
		
		var point, size, d;
		for(var i=0;i<vars.seeds.length;++i){
			d=Math.sqrt(vars.seeds[i].x*vars.seeds[i].x+vars.seeds[i].y*vars.seeds[i].y+vars.seeds[i].z*vars.seeds[i].z);
			vars.seeds[i].vx-=vars.seeds[i].x/300/(1+d);
			vars.seeds[i].vy-=vars.seeds[i].y/300/(1+d);
			vars.seeds[i].vz-=vars.seeds[i].z/300/(1+d);
			vars.seeds[i].vx/=1.02;
			vars.seeds[i].vy/=1.02;
			vars.seeds[i].vz/=1.02;
			vars.seeds[i].x+=vars.seeds[i].vx;
			vars.seeds[i].y+=vars.seeds[i].vy;
			vars.seeds[i].z+=vars.seeds[i].vz;
			point=project3D(vars.seeds[i].x,vars.seeds[i].y,vars.seeds[i].z,vars);
			if(point.d != -1){
				size=300/(1+point.d*point.d);
				vars.ctx.fillStyle="#fff";
				vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
			}
			for(var j=0;j<vars.segs.length;++j){
				d=Math.sqrt((vars.segs[j].a.x-vars.seeds[i].x)*(vars.segs[j].a.x-vars.seeds[i].x)+
							(vars.segs[j].a.y-vars.seeds[i].y)*(vars.segs[j].a.y-vars.seeds[i].y)+
							(vars.segs[j].a.z-vars.seeds[i].z)*(vars.segs[j].a.z-vars.seeds[i].z));
				if(d<vars.minDistance){
					vars.segs.push(new Seg(vars.segs[j].a.x,vars.segs[j].a.y,vars.segs[j].a.z,
										   vars.seeds[i].x,vars.seeds[i].y,vars.seeds[i].z));
					vars.seeds.splice(i,1);
					break;
				}else{
					d=Math.sqrt((vars.segs[j].b.x-vars.seeds[i].x)*(vars.segs[j].b.x-vars.seeds[i].x)+
								(vars.segs[j].b.y-vars.seeds[i].y)*(vars.segs[j].b.y-vars.seeds[i].y)+
								(vars.segs[j].b.z-vars.seeds[i].z)*(vars.segs[j].b.z-vars.seeds[i].z));
					if(d<vars.minDistance){
						vars.segs.push(new Seg(vars.segs[j].b.x,vars.segs[j].b.y,vars.segs[j].b.z,
											   vars.seeds[i].x,vars.seeds[i].y,vars.seeds[i].z));
						vars.seeds.splice(i,1);
						break;
					}
				}
			}
		}
    }

	
	function spawnSeed(vars){
		
		var {PI, sin, cos, random} = Math;
		var x,y,z,p,p1,p2,d,vx,vy,vz;
		switch(vars.spawnMode){
			case 0:
				p=PI*2*random();
				d=6+random()*4;
				x=sin(p)*d;
				y=cos(p)*d;
				z=6-random()*12;
				v=.1+random()/4;
				vx=sin(p+PI/2)*v;
				vy=cos(p+PI/2)*v;
				vz=0;
				vars.seeds.push(new Seed(x,y,z,vx,vy,vz));
			break;
			case 1:
				p=PI*2*random();
				d=6+random()*4;
				x=sin(p)*d;
				z=cos(p)*d;
				y=0;
				v=.1+random()/4;
				vx=sin(p+PI/2)*v;
				vz=cos(p+PI/2)*v;
				vy=0;
				vars.seeds.push(new Seed(x,y,z,vx,vy,vz));
			break;
			case 2:
				p1=PI*2*random();
				p2=PI/2-PI/8+PI/4*random();
				d=4;
				x=sin(p1)*sin(p2)*d;
				y=cos(p2)*d;
				z=cos(p1)*sin(p2)*d;
				v=.1+random()/4;
				vx=sin(p1)*sin(p2)*v;
				vy=cos(p2)*v;
				vz=cos(p1)*sin(p2)*v;
				vars.seeds.push(new Seed(x,y,z,vx,vy,vz));
			break;
		}
	}
    
	
	function loadScene(vars){
		
		vars.segs=[];
		vars.seeds=[];
		vars.alpha=1;
		vars.minDistance=.2+Math.random()/2;
		vars.spawnMode=parseInt(Math.random()*3);
		vars.seedsPerSpawn=2+parseInt(Math.random()*5);
		vars.segs.push(new Seg(0,0,0,0,0,0));		
	}
	
	
    function frame(vars) {

        requestAnimationFrame(function() {
          frame(vars);
        });
        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("canvas");
			vars.canvas.width = document.body.clientWidth;
			vars.canvas.height = document.body.clientHeight;
            vars.ctx = vars.canvas.getContext("2d");
            window.addEventListener("resize", function(){
				vars.canvas.width = document.body.clientWidth;
				vars.canvas.height = document.body.clientHeight;
				vars.cx=vars.canvas.width/2;
				vars.cy=vars.canvas.height/2;
            }, true);
            vars.canvas.addEventListener("mouseout", function(){
				vars.mbutton=0;
			},true);
            vars.canvas.addEventListener("mousemove", function(e){
				var rect = vars.canvas.getBoundingClientRect();
                vars.mx = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
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
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
            }, true);
            vars.canvas.addEventListener("touchend", function(e){
                vars.mbutton=0;
            }, true);
            vars.canvas.addEventListener("touchmove", function(e){
                e.preventDefault();
                var rect = vars.canvas.getBoundingClientRect();
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
            }, true);
            vars.frameNo=0;
            vars.mx = 0;
            vars.my = 0;
			vars.camX = 10;
			vars.camY = 4;
			vars.camZ = -4;
			vars.pitch = 0;
			vars.yaw = 0;
			vars.roll = 0;
			vars.cx = vars.canvas.width/2;
			vars.cy = vars.canvas.height/2;
			vars.scale = 500;
			vars.minDistance=.45;
			vars.seedSpawnFrequency=1;
			vars.seedsPerSpawn=5;
			vars.seedTimer=0;
			vars.maxSeeds=1000;
			vars.spawnMode=0;
			loadScene(vars);
		}

        vars.frameNo++;
		draw(vars);
    }
	frame();
	
})();
