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


	function grayscale(col){
	  var r = Math.round((0.5+Math.sin(col)/2)*255);
	  var g = Math.round((0.5+Math.sin(col)/2)*255);
	  var b = Math.round((0.5+Math.sin(col)/2)*255);
	  return "#"+("0" + r.toString(16) ).slice (-2)+("0" + g.toString(16) ).slice (-2)+("0" + b.toString(16) ).slice (-2);
	}


    function transformShape(shape,scaleX,scaleY,scaleZ){

        for(var i=0;i<shape.polys.length;++i){
			for(var j=0;j<shape.polys[i].segs.length;++j){
				shape.polys[i].segs[j].a.x*=scaleX;
				shape.polys[i].segs[j].a.y*=scaleY;
				shape.polys[i].segs[j].a.z*=scaleZ;
				shape.polys[i].segs[j].b.x*=scaleX;
				shape.polys[i].segs[j].b.y*=scaleY;
				shape.polys[i].segs[j].b.z*=scaleZ;
			}
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

	function Polygon(){

		this.verts=new Array();
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
		
		
		updateScene(vars);
		
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
				if(j!=i && i!= vars.selected && i!=vars.balls.length-1){
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
			p=vars.theta/40;
			vars.balls[vars.balls.length-1].ox=Math.cos(p)*20;
			vars.balls[vars.balls.length-1].oy=0;
			vars.balls[vars.balls.length-1].oz=Math.sin(p)*20;
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

		drawFloor(vars);
		vars.ctx.globalAlpha=1;


		vars.ctx.globalAlpha=.3;
		vars.ctx.fillStyle=rgb(vars.frameNo/20);
        vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		var x1,y1,z1,x2,y2,z2,point1,point2;
				
		for(var i=0;i<vars.shapes.length;++i){
			for(var j=0;j<vars.shapes[i].polys.length;++j){
				vars.ctx.globalAlpha=.65;
				vars.ctx.fillStyle=grayscale(-vars.shapes[i].polys[j].col*10);
				vars.ctx.beginPath();
				for(var k=0;k<=vars.shapes[i].polys[j].segs.length;++k){
					x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[k%vars.shapes[i].polys[j].segs.length].a.x;
					y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[k%vars.shapes[i].polys[j].segs.length].a.y;
					z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[k%vars.shapes[i].polys[j].segs.length].a.z;
					point1=project3D(x,y,z,vars);
					if(point1.d != -1){
						if(!k){
							vars.ctx.moveTo(point1.x,point1.y);
						}else{
							vars.ctx.lineTo(point1.x,point1.y);
						}
						
					}
				}
				vars.ctx.fill();
					
				vars.ctx.globalAlpha=.65;
				vars.ctx.lineWidth=1;
				for(var k=0;k<vars.shapes[i].polys[j].segs.length;++k){
					x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[k].a.x;
					y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[k].a.y;
					z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[k].a.z;
					point1=project3D(x,y,z,vars);
					if(point1.d != -1){
						x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[k].b.x;
						y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[k].b.y;
						z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[k].b.z;
						point2=project3D(x,y,z,vars);
						if(point2.d != -1){
							vars.ctx.strokeStyle=grayscale(vars.shapes[i].polys[j].col*10);
							vars.ctx.lineWidth=800/(1+point1.d);
							vars.ctx.beginPath();
							vars.ctx.moveTo(point1.x,point1.y);
							vars.ctx.lineTo(point2.x,point2.y);
							vars.ctx.stroke();
						}
					}
				}
			}
		}


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
				vars.ctx.drawImage(vars.balls2[i].index==vars.selected?vars.ball1Pic:(vars.balls2[i].index==vars.balls.length-1?vars.ball2Pic:vars.ball3Pic),point.x-size/2,point.y-size/2,size,size);
			}
		}
	}
	
	
	function pushVert(p1,p2,dist,poly){
		
		x=Math.sin(p1)*Math.sin(p2)*dist;
		z=Math.cos(p1)*Math.sin(p2)*dist;
		y=Math.cos(p2)*dist;
		poly.verts.push(new Vert(x,y,z));
	}


	function expandShape(shape,convexity){
		
		for(j=0;j<shape.polys.length;++j){
			for(k=0;k<shape.polys[j].verts.length;++k){
				x=shape.polys[j].verts[k].x;
				y=shape.polys[j].verts[k].y;
				z=shape.polys[j].verts[k].z;
				d=Math.sqrt(x*x+y*y+z*z);
				p1=Math.atan2(x,y);
				p2=elevation(x,y,z);
				d2=d+(1-d)*convexity;
				shape.polys[j].verts[k].x=Math.sin(p1)*Math.sin(p2)*d2;
				shape.polys[j].verts[k].y=Math.cos(p1)*Math.sin(p2)*d2;
				shape.polys[j].verts[k].z=Math.cos(p2)*d2;
			}
		}
		return shape;
	}
	
	
	function segmentize(source){

		var polys=[],x1,y1,z1,x2,y2,z2;
		for(var i=0;i<source.length;++i){
			var poly={};
			poly.segs=[];
			for(var j=0;j<source[i].verts.length;++j){
				x1=source[i].verts[j].x;
				y1=source[i].verts[j].y;
				z1=source[i].verts[j].z;
				if(j<source[i].verts.length-1){
					x2=source[i].verts[j+1].x;
					y2=source[i].verts[j+1].y;
					z2=source[i].verts[j+1].z;
				}else{
					x2=source[i].verts[0].x;
					y2=source[i].verts[0].y;
					z2=source[i].verts[0].z;
				}
				poly.segs.push(new Seg(x1,y1,z1,x2,y2,z2));
			}
			polys.push(poly);
		}
		return polys;
	}	
	
	
	function Shape(x,y,z){
		
		this.polys=[];
		this.x=x, this.y=y, this.z=z;
	}

	
	function Icosahedron(x,y,z){
		
		var size=1, phi = 1.61803398875;
		this.polys=[];
		this.x=x, this.y=y, this.z=z, this.dist=0;
		x1=-phi, y1=-1, z1=0, x2=phi, y2=-1, z2=0, x3=phi, y3=1, z3=0, x4=-phi, y4=1, z4=0,
		y5=-phi, z5=-1, x5=0, y6=phi, z6=-1, x6=0, y7=phi, z7=1, x7=0, y8=-phi, z8=1, x8=0,
		z9=-phi, x9=-1, y9=0, z10=phi, x10=-1, y10=0, z11=phi, x11=1, y11=0, z12=-phi, x12=1, y12=0;
		p={}; p.verts=[];
		p.verts.push(new Vert(x1,y1,z1));
		p.verts.push(new Vert(x5,y5,z5));
		p.verts.push(new Vert(x8,y8,z8));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x2,y2,z2));
		p.verts.push(new Vert(x5,y5,z5));
		p.verts.push(new Vert(x8,y8,z8));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x3,y3,z3));
		p.verts.push(new Vert(x6,y6,z6));
		p.verts.push(new Vert(x7,y7,z7));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x4,y4,z4));
		p.verts.push(new Vert(x6,y6,z6));
		p.verts.push(new Vert(x7,y7,z7));
		this.polys.push(p);	
		p={}; p.verts=[];
		p.verts.push(new Vert(x9,y9,z9));
		p.verts.push(new Vert(x12,y12,z12));
		p.verts.push(new Vert(x5,y5,z5));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x9,y9,z9));
		p.verts.push(new Vert(x12,y12,z12));
		p.verts.push(new Vert(x6,y6,z6));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x10,y10,z10));
		p.verts.push(new Vert(x11,y11,z11));
		p.verts.push(new Vert(x7,y7,z7));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x10,y10,z10));
		p.verts.push(new Vert(x11,y11,z11));
		p.verts.push(new Vert(x8,y8,z8));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x1,y1,z1));
		p.verts.push(new Vert(x9,y9,z9));
		p.verts.push(new Vert(x4,y4,z4));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x1,y1,z1));
		p.verts.push(new Vert(x10,y10,z10));
		p.verts.push(new Vert(x4,y4,z4));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x2,y2,z2));
		p.verts.push(new Vert(x11,y11,z11));
		p.verts.push(new Vert(x3,y3,z3));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x2,y2,z2));
		p.verts.push(new Vert(x12,y12,z12));
		p.verts.push(new Vert(x3,y3,z3));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x2,y2,z2));
		p.verts.push(new Vert(x11,y11,z11));
		p.verts.push(new Vert(x8,y8,z8));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x2,y2,z2));
		p.verts.push(new Vert(x12,y12,z12));
		p.verts.push(new Vert(x5,y5,z5));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x1,y1,z1));
		p.verts.push(new Vert(x10,y10,z10));
		p.verts.push(new Vert(x8,y8,z8));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x1,y1,z1));
		p.verts.push(new Vert(x9,y9,z9));
		p.verts.push(new Vert(x5,y5,z5));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x4,y4,z4));
		p.verts.push(new Vert(x9,y9,z9));
		p.verts.push(new Vert(x6,y6,z6));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x3,y3,z3));
		p.verts.push(new Vert(x12,y12,z12));
		p.verts.push(new Vert(x6,y6,z6));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x4,y4,z4));
		p.verts.push(new Vert(x10,y10,z10));
		p.verts.push(new Vert(x7,y7,z7));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x3,y3,z3));
		p.verts.push(new Vert(x11,y11,z11));
		p.verts.push(new Vert(x7,y7,z7));
		this.polys.push(p);
	}
	
	
	function subdivide(shape,subdivisions){
		
		for(var j=0;j<subdivisions;++j){
			newShape=new Shape(shape.x,shape.y,shape.z);
			for(var k=0;k<shape.polys.length;++k){
				x1=(shape.polys[k].verts[1].x+shape.polys[k].verts[0].x)/2;
				y1=(shape.polys[k].verts[1].y+shape.polys[k].verts[0].y)/2;
				z1=(shape.polys[k].verts[1].z+shape.polys[k].verts[0].z)/2;
				x2=(shape.polys[k].verts[2].x+shape.polys[k].verts[1].x)/2;
				y2=(shape.polys[k].verts[2].y+shape.polys[k].verts[1].y)/2;
				z2=(shape.polys[k].verts[2].z+shape.polys[k].verts[1].z)/2;
				x3=(shape.polys[k].verts[0].x+shape.polys[k].verts[2].x)/2;
				y3=(shape.polys[k].verts[0].y+shape.polys[k].verts[2].y)/2;
				z3=(shape.polys[k].verts[0].z+shape.polys[k].verts[2].z)/2;
				p=new Polygon();
				p.verts.push(new Vert(shape.polys[k].verts[0].x,shape.polys[k].verts[0].y,shape.polys[k].verts[0].z));
				p.verts.push(new Vert(x1,y1,z1));
				p.verts.push(new Vert(x3,y3,z3));
				newShape.polys.push(p);
				p=new Polygon();
				p.verts.push(new Vert(x1,y1,z1));
				p.verts.push(new Vert(shape.polys[k].verts[1].x,shape.polys[k].verts[1].y,shape.polys[k].verts[1].z));
				p.verts.push(new Vert(x2,y2,z2));
				newShape.polys.push(p);
				p=new Polygon();
				p.verts.push(new Vert(x3,y3,z3));
				p.verts.push(new Vert(x2,y2,z2));
				p.verts.push(new Vert(shape.polys[k].verts[2].x,shape.polys[k].verts[2].y,shape.polys[k].verts[2].z));
				newShape.polys.push(p);
				p=new Polygon();
				p.verts.push(new Vert(x3,y3,z3));
				p.verts.push(new Vert(x1,y1,z1));
				p.verts.push(new Vert(x2,y2,z2));
				newShape.polys.push(p);
			}
			shape=newShape;
		}
		return shape;
	}

	
	function truncate(shape,vars,modulate){
		var x1,y1,z1,x2,y2,z2,seg,t,t2,polys;
		for(var i=0;i<shape.polys.length;++i){
			t=shape.polys[i].segs.length;
			if(modulate){
				t2=(2/3)*(1+Math.sin(vars.frameNo/10+Math.PI*2/shape.polys.length*i*(3+Math.sin(vars.frameNo/100)*3))/4);
			}else{
				t2=(2/3);
			}
			shape.polys[i].col=t2;
			for(var j=0;j<t;++j){
				x1=shape.polys[i].segs[j].a.x;
				y1=shape.polys[i].segs[j].a.y;
				z1=shape.polys[i].segs[j].a.z;
				x2=shape.polys[i].segs[j].b.x;
				y2=shape.polys[i].segs[j].b.y;
				z2=shape.polys[i].segs[j].b.z;
				shape.polys[i].segs[j].a.x=x2-(x2-x1)*t2;
				shape.polys[i].segs[j].a.y=y2-(y2-y1)*t2;
				shape.polys[i].segs[j].a.z=z2-(z2-z1)*t2;
				shape.polys[i].segs[j].b.x=x1+(x2-x1)*t2;
				shape.polys[i].segs[j].b.y=y1+(y2-y1)*t2;
				shape.polys[i].segs[j].b.z=z1+(z2-z1)*t2;
			}
			poly={};
			poly.segs=[];
			poly.col=shape.polys[i].col;
			for(var j=0;j<t;++j){
				x1=shape.polys[i].segs[j].b.x;
				y1=shape.polys[i].segs[j].b.y;
				z1=shape.polys[i].segs[j].b.z;
				if(j<t-1){
					x2=shape.polys[i].segs[j+1].a.x;
					y2=shape.polys[i].segs[j+1].a.y;
					z2=shape.polys[i].segs[j+1].a.z;
				}else{
					x2=shape.polys[i].segs[0].a.x;
					y2=shape.polys[i].segs[0].a.y;
					z2=shape.polys[i].segs[0].a.z;					
				}
				seg = new Seg(x1,y1,z1,x2,y2,z2);
				poly.segs.push(shape.polys[i].segs[j]);
				poly.segs.push(seg);
			}
			shape.polys[i]=poly;
		}
		return shape;
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

		vars.shapes=[];
		
		x=0;
		y=0;
		z=0;
		shape=new Icosahedron(x,y,z);
		shape=subdivide(shape,3);
		shape=expandShape(shape,1)
		shape.polys=segmentize(shape.polys);
		shape=truncate(shape,vars,1);
		vars.shapes.push(shape);
		transformShape(vars.shapes[vars.shapes.length-1],50,50,50);

		var rows=4, cols=4, bars=4;
		for(var i=0;i<rows;++i){
			for(var j=0;j<cols;++j){
				for(var k=0;k<bars;++k){
					x=(-rows/2+.5)+i;
					y=(-cols/2+.5)+j;
					z=-10+(-bars/2+.5)+k;
					vars.balls.push(new Vert(x*2,y*2,z*2,1.75));
				}
			}
		}
		for(var i=0;i<rows;++i){
			for(var j=0;j<cols;++j){
				for(var k=0;k<bars;++k){
					x=(-rows/2+.5)+i;
					y=(-cols/2+.5)+j;
					z=10+(-bars/2+.5)+k;
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

    function updateScene(vars){

		var x,y,z,t;
		x=0;
		y=0;
		z=0;
		vars.shapes[0]=new Icosahedron(x,y,z);
		vars.shapes[0]=subdivide(vars.shapes[0],2);
		vars.shapes[0]=expandShape(vars.shapes[0],1)
		vars.shapes[0].polys=segmentize(vars.shapes[0].polys);
		vars.shapes[0]=truncate(vars.shapes[0],vars,1);
		t=170;//+Math.sin(vars.frameNo/50)*80;
		transformShape(vars.shapes[0],t,t,t);
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