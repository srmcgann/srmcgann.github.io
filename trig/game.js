(function(){ 

	function rasterizePoint(x,y,z,vars){

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
		if(!uc) return {x:0,y:0,d:-1};
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
			return {
				x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
				y:vars.cy+y/z*vars.scale,
				d:-1
			};
		}
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


	function rotate(vert,pitch,yaw,roll){

		var d=Math.sqrt(vert.y*vert.y+vert.z*vert.z);
		var p=Math.atan2(vert.y,vert.z);
		vert.y=Math.sin(p+pitch)*d;
		vert.z=Math.cos(p+pitch)*d;
		d=Math.sqrt(vert.x*vert.x+vert.z*vert.z);
		p=Math.atan2(vert.x,vert.z);
		vert.x=Math.sin(p+yaw)*d;
		vert.z=Math.cos(p+yaw)*d;
		d=Math.sqrt(vert.x*vert.x+vert.y*vert.y);
		p=Math.atan2(vert.x,vert.y);
		vert.x=Math.sin(p+roll)*d;
		vert.y=Math.cos(p+roll)*d;
	}


	function subdivide(shape,subdivisions){
		
		var t=shape.segs.length;
		for(var i=0;i<t;++i){
			var x1=shape.segs[i].a.x;
			var y1=shape.segs[i].a.y;
			var z1=shape.segs[i].a.z;
			var x2=(shape.segs[i].b.x-x1)/subdivisions;
			var y2=(shape.segs[i].b.y-y1)/subdivisions;
			var z2=(shape.segs[i].b.z-z1)/subdivisions;
			shape.segs[i].b.x=x1+x2;
			shape.segs[i].b.y=y1+y2;
			shape.segs[i].b.z=z1+z2;
			var x3=x2;
			var y3=y2;
			var z3=z2;
			for(var k=0;k<subdivisions-1;++k){
				shape.segs.push(new Seg(x1+x2,y1+y2,z1+z2,x1+x2+x3,y1+y2+y3,z1+z2+z3));
				x2+=x3;
				y2+=y3;
				z2+=z3;
			}
		}
	}


	function transform(shape,scaleX,scaleY,scaleZ){

		for(var i=0;i<shape.segs.length;++i){
			shape.segs[i].a.x*=scaleX;
			shape.segs[i].a.y*=scaleY;
			shape.segs[i].a.z*=scaleZ;
			shape.segs[i].b.x*=scaleX;
			shape.segs[i].b.y*=scaleY;
			shape.segs[i].b.z*=scaleZ;
		}
	}


	function Vert(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	}


	function Seg(x1,y1,z1,x2,y2,z2){
		this.a = new Vert(x1,y1,z1);
		this.b = new Vert(x2,y2,z2);
		this.dist=0;
	}


	function sortFunction(a,b){
		return b.dist-a.dist;
	}


	function rgbArray(col){
		
		col += 0.000001;
		var r = 0.5+Math.sin(col)*0.5;
		var g = 0.5+Math.cos(col)*0.5;
		var b = 0.5-Math.sin(col)*0.5;
		return [r,g,b];
	}


	function colorString(arr){

		var r = parseInt(arr[0]*15);
		var g = parseInt(arr[1]*15);
		var b = parseInt(arr[2]*15);
		return "#"+r.toString(16)+g.toString(16)+b.toString(16);
	}


	function interpolateColors(RGB1,RGB2,degree){
		
		var w1=degree;
		var w2=1-w1;
		return colorString([w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]]);
	}


	function process(vars){

		var p,d,t;
		p = Math.atan2(vars.camX, vars.camZ);
		d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
		d -= Math.sin(vars.frameNo / 50) / 5.15;
		t = Math.sin(vars.frameNo / 160) / 40;
		vars.camX = Math.sin(p + t) * d;
		vars.camZ = Math.cos(p + t) * d;
		vars.camY -= Math.cos(vars.frameNo / 80) / 5;
		vars.yaw = Math.PI + p + t;
		vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
	  
		switch(vars.phase){
			case 0:
				for(var i=0;i<vars.shapes.length;++i){
                    var t=parseInt(i/12)%2?-1:1;
                    switch(i%3){
                        case 0: vars.shapes[i].roll=Math.sin(vars.frameNo/100)*Math.PI/2*t; break;
                        case 2: vars.shapes[i].yaw=Math.sin(vars.frameNo/100)*Math.PI/2*t; break;
                        case 1: vars.shapes[i].pitch=Math.sin(vars.frameNo/100)*Math.PI/2*t; break;
                    }
					for(var j=0;j<vars.shapes[i].verts2.length;++j){
						vars.shapes[i].verts2[j].x=vars.shapes[i].verts[j].x;
						vars.shapes[i].verts2[j].y=vars.shapes[i].verts[j].y;
						vars.shapes[i].verts2[j].z=vars.shapes[i].verts[j].z;
						rotate(vars.shapes[i].verts2[j],vars.shapes[i].pitch,vars.shapes[i].yaw,vars.shapes[i].roll);
					}
				}
			break;
		}
	}


	function drawFloor(vars) {

	  vars.ctx.fillStyle = "#316";
	  var x,y,z,d,a,size,point;
	  for (var i = -50; i <= 50; i += 1) {
		for (var j = -50; j <= 50; j += 1) {
		  x = i;
		  z = j;
		  y = 10;
		  point = rasterizePoint(x, y, z, vars);
		  if (point.d != -1) {
			size = 200 / (1 + point.d);
			d = Math.sqrt(x * x + z * z);
			a = 1 - Math.pow(d / 50, 2);
			if (a > 0) {
			  vars.ctx.globalAlpha = a;
			  vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
			}
		  }
		}
	  }
	}

	function draw(vars){
		
		vars.ctx.globalAlpha=1;
		vars.ctx.fillStyle="#000";
		vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		drawFloor(vars);
		vars.ctx.globalAlpha=1;
		var point,size,x,y,z,vert;
		switch(vars.phase){
			case 0:
				for(var i=0;i<vars.shapes.length;++i){
					for(var j=0;j<vars.shapes[i].verts2.length;++j){
						x=vars.shapes[i].x+vars.shapes[i].verts2[j].x;
						y=vars.shapes[i].y+vars.shapes[i].verts2[j].y;
						z=vars.shapes[i].z+vars.shapes[i].verts2[j].z;
						point=rasterizePoint(x,y,z,vars);
						if(point.d != -1){
							vars.shapes[i].verts[j].dist=point.d;
							size=vars.shapes[i].verts[j].radius*5000/(1+Math.pow(point.d,1));
							//point.x=point.x-vars.cx+vars.mx;
							//point.y=point.y-vars.cy+vars.my;
							vars.ctx.drawImage(vars.shapes[i].verts[j].img,point.x-size/2,point.y-size/2,size,size);
						}
					}
					vars.shapes[i].verts.sort(sortFunction);
				}
			break;
		}
	}


	function loadCube(x,y,z,lineWidth){
		
		var shape={};
		shape.x=x;
		shape.y=y;
		shape.z=z;
		shape.segs=[];
		shape.segs.push(new Seg(-1,-1,-1,1,-1,-1));
		shape.segs.push(new Seg(1,-1,-1,1,1,-1));
		shape.segs.push(new Seg(1,1,-1,-1,1,-1));
		shape.segs.push(new Seg(-1,1,-1,-1,-1,-1));
		shape.segs.push(new Seg(-1,-1,1,1,-1,1));
		shape.segs.push(new Seg(1,-1,1,1,1,1));
		shape.segs.push(new Seg(1,1,1,-1,1,1));
		shape.segs.push(new Seg(-1,1,1,-1,-1,1));
		shape.segs.push(new Seg(-1,-1,-1,-1,-1,1));
		shape.segs.push(new Seg(1,-1,-1,1,-1,1));
		shape.segs.push(new Seg(1,1,-1,1,1,1));
		shape.segs.push(new Seg(-1,1,-1,-1,1,1));
		shape.lineWidth=lineWidth;
		return shape;
	}

	
    function loadScene(vars){
		
		switch(vars.phase){
			case 0:
				vars.shapes=[];
                for(var k=-1;k<=1;++k){
                    for(var j=0;j<6;++j){
                        var shape={};
                        shape.yaw=0;
                        shape.pitch=0;
                        shape.roll=0;
                        shape.x=k*16;
                        shape.y=0;
                        shape.z=0;
                        shape.verts=[];
                        shape.verts2=[];
                        var sd=3*(j+1),x,y,p,d=1+j,radius=.75;
                        for(var i=0;i<sd;++i){
                            p=Math.PI*2/sd*i;
                            var vert={};
                            vert.x=Math.sin(p)*d;
                            vert.y=Math.cos(p)*d;
                            vert.z=0;
                            vert.radius=radius;
                            vert.img=vars.starPics[(j*2+(k*3+3))%6];
                            shape.verts.push(vert);
                            vert=JSON.parse(JSON.stringify(vert))
                            shape.verts2.push(vert);
                        }
                        vars.shapes.push(shape);
                    }
				}
			break;
			case 1:
			break;
		}
	}
	

	function frame(vars) {
		
		if(vars === undefined){
            window.addEventListener("resize",function(){
                vars.canvas.width = document.body.clientWidth;
                vars.canvas.height = document.body.clientHeight;
                vars.cx=vars.canvas.width/2;
                vars.cy=vars.canvas.height/2;
            });
			var vars={};
			vars.canvas = document.querySelector("#canvas");
			vars.ctx = vars.canvas.getContext("2d");
			vars.canvas.width = document.body.clientWidth;
			vars.canvas.height = document.body.clientHeight;
			vars.canvas.addEventListener("mousemove", function(e){
				var rect = canvas.getBoundingClientRect();
				vars.mx = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
				vars.my = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);				
			}, true);
			vars.canvas.addEventListener("touchstart", function(e){
				e.preventDefault();
				var rect = canvas.getBoundingClientRect();
				vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas.width);
				vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas.height);				
			}, true);
			vars.canvas.addEventListener("touchmove", function(e){
				e.preventDefault();
				var rect = canvas.getBoundingClientRect();
				vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas.width);
				vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas.height);				
			}, true);
			vars.frameNo=0;
			vars.camX = 0;
			vars.camY = -10;
			vars.camZ = -30;
			vars.pitch = 0;
			vars.yaw = 0;
			vars.mx=0;
			vars.my=0;
			vars.cx=vars.canvas.width/2;
			vars.cy=vars.canvas.height/2;
			vars.scale=800;
			vars.starPics=[new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
			vars.starPics[0].src="red_star.png";
			vars.starPics[1].src="orange_star.png";
			vars.starPics[2].src="yellow_star.png";
			vars.starPics[3].src="green_star.png";
			vars.starPics[4].src="blue_star.png";
			vars.starPics[5].src="purple_star.png";
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
