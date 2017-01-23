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


	function rotate(vert, roll, pitch, yaw) {
		
		var {cos, sin} = Math;
		var cosa = cos(roll);
		var sina = sin(roll);
		var cosb = cos(yaw);
		var sinb = sin(yaw);
		var cosc = cos(-pitch);
		var sinc = sin(-pitch);
		var xx = cosa*cosb;
		var xy = cosa*sinb*sinc - sina*cosc;
		var xz = cosa*sinb*cosc + sina*sinc;
		var yx = sina*cosb;
		var yy = sina*sinb*sinc + cosa*cosc;
		var yz = sina*sinb*cosc - cosa*sinc;
		var zx = -sinb;
		var zy = cosb*sinc;
		var zz = cosb*cosc;
		var px = xx*vert.x + xy*vert.y + xz*vert.z;
		var py = yx*vert.x + yy*vert.y + yz*vert.z;
		var pz = zx*vert.x + zy*vert.y + zz*vert.z;
		
		return {x:px, y:py, z:pz};
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


    function transformWireShape(shape,scaleX,scaleY,scaleZ){

        for(var i=0;i<shape.segs.length;++i){
            shape.segs[i].a.x*=scaleX;
            shape.segs[i].a.y*=scaleY;
            shape.segs[i].a.z*=scaleZ;
            shape.segs[i].b.x*=scaleX;
            shape.segs[i].b.y*=scaleY;
            shape.segs[i].b.z*=scaleZ;
        }
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


    function process(vars){

        var x,y,z,p,d,a,t=0;

		vars.draggingShape=0;
		if(vars.leftButton){
			for(var i=0;i<vars.shapes.length;++i){
				x=vars.shapes[i].x;
				y=vars.shapes[i].y;
				z=vars.shapes[i].z;
				vars.shapes[i].dist=Math.sqrt((x-vars.camX)*(x-vars.camX)+(y-vars.camY)*(y-vars.camY)+(z-vars.camZ)*(z-vars.camZ));
				if(vars.shapes[i].selected){
					vars.draggingShape=1;
					point=reverseRasterize(vars.selectDist, vars);
					vars.shapes[i].vx+=(point.x-vars.shapes[i].x);
					if(point.y+vars.shapes[i].size<=vars.floor){
						vars.shapes[i].vy+=(point.y-vars.shapes[i].y);
					}else{
						vars.shapes[i].vy=0;						
					}
					vars.shapes[i].vz+=(point.z-vars.shapes[i].z);
					vars.shapes[i].x=point.x;
					if(point.y+vars.shapes[i].size<=vars.floor){
						vars.shapes[i].y=point.y;
					}else{
						vars.shapes[i].y=vars.floor-vars.shapes[i].size;
						vars.selectDist=vars.shapes[i].dist;
					}
					vars.shapes[i].z=point.z;
				}
			}
		}else{
			vars.complete=1;
			var point=reverseRasterize(10000, vars);
			for(var i=0;i<vars.shapes.length;++i){
				x=vars.shapes[i].x;
				y=vars.shapes[i].y;
				z=vars.shapes[i].z;
				if(y<vars.floor-vars.shapes[i].size*2) vars.complete=0;
				vars.shapes[i].dist=Math.sqrt((x-vars.camX)*(x-vars.camX)+(y-vars.camY)*(y-vars.camY)+(z-vars.camZ)*(z-vars.camZ));
				vars.shapes[i].selected=0;


				for(var j=0;j<vars.shapes[i].polys.length && !vars.shapes[i].selected;++j){
					var x1 = vars.shapes[i].x+vars.shapes[i].polys[j].segs[0].a.x;
					var y1 = vars.shapes[i].y+vars.shapes[i].polys[j].segs[0].a.y;
					var z1 = vars.shapes[i].z+vars.shapes[i].polys[j].segs[0].a.z;
					var x2 = vars.shapes[i].x+vars.shapes[i].polys[j].segs[1].a.x;
					var y2 = vars.shapes[i].y+vars.shapes[i].polys[j].segs[1].a.y;
					var z2 = vars.shapes[i].z+vars.shapes[i].polys[j].segs[1].a.z;
					var x3 = vars.shapes[i].x+vars.shapes[i].polys[j].segs[2].a.x;
					var y3 = vars.shapes[i].y+vars.shapes[i].polys[j].segs[2].a.y;
					var z3 = vars.shapes[i].z+vars.shapes[i].polys[j].segs[2].a.z;
					var D = -(x1*(y2*z3-y3*z2)+x2*(y3*z1-y1*z3)+x3*(y1*z2-y2*z1));
					var A = y1*(z2-z3)+y2*(z3-z1)+y3*(z1-z2);
					var B = z1*(x2-x3)+z2*(x3-x1)+z3*(x1-x2);
					var C = x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2);
					var uc = A*(vars.camX-point.x)+B*(vars.camY-point.y)+C*(vars.camZ-point.z);
					var u = uc?(A*vars.camX+B*vars.camY+C*vars.camZ+D)/uc:-1;
					x = vars.camX+u*(point.x-vars.camX);
					y = vars.camY+u*(point.y-vars.camY);
					z = vars.camZ+u*(point.z-vars.camZ);
					a=0;
					for(var k=0;k<vars.shapes[i].polys[j].segs.length;++k){
						var v1 = [vars.shapes[i].x+vars.shapes[i].polys[j].segs[k].a.x-x,
								  vars.shapes[i].y+vars.shapes[i].polys[j].segs[k].a.y-y,
								  vars.shapes[i].z+vars.shapes[i].polys[j].segs[k].a.z-z];
						var v2 = [vars.shapes[i].x+vars.shapes[i].polys[j].segs[k].b.x-x,
								  vars.shapes[i].y+vars.shapes[i].polys[j].segs[k].b.y-y,
								  vars.shapes[i].z+vars.shapes[i].polys[j].segs[k].b.z-z];
						d = Math.sqrt(v1[0]*v1[0]+v1[1]*v1[1]+v1[2]*v1[2]);
						v1[0] /= d;
						v1[1] /= d;
						v1[2] /= d;
						d = Math.sqrt(v2[0]*v2[0]+v2[1]*v2[1]+v2[2]*v2[2]);
						v2[0] /= d;
						v2[1] /= d;
						v2[2] /= d;
						a += Math.acos(v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]);
					}
					if(a>=Math.PI*2){
						for(var m=0;m<i;++m) vars.shapes[m].selected=0;
						vars.shapes[i].selected=1;
						vars.selectDist=vars.shapes[i].dist;
					}
				}
			}
		}
		vars.shapes.sort(sortFunction);
		
		var p1,p2;
		var mx=vars.mx-vars.omx;
		var my=vars.my-vars.omy;
		if(!vars.draggingShape && vars.rightButton){
			p1=Math.atan2(vars.camX,vars.camZ);
			p2=elevation(vars.camX,vars.camZ,vars.camY);
			d=Math.sqrt(vars.camX*vars.camX+vars.camY*vars.camY+vars.camZ*vars.camZ)-my/8;
			if(d<5)d=5;
			vars.camX=Math.sin(p1)*Math.sin(p2)*d;
			vars.camZ=Math.cos(p1)*Math.sin(p2)*d;
			vars.camY=Math.cos(p2)*d;		
		}
		if(!vars.draggingShape && vars.wheelDelta){
			p1=Math.atan2(vars.camX,vars.camZ);
			p2=elevation(vars.camX,vars.camZ,vars.camY);
			d=Math.sqrt(vars.camX*vars.camX+vars.camY*vars.camY+vars.camZ*vars.camZ)-vars.wheelDelta*2;
			if(d<5)d=5;
			vars.camX=Math.sin(p1)*Math.sin(p2)*d;
			vars.camZ=Math.cos(p1)*Math.sin(p2)*d;
			vars.camY=Math.cos(p2)*d;		
		}
		if(!vars.draggingShape && vars.leftButton){
			p1=Math.atan2(vars.camX,vars.camZ)+mx/150;
			p2=elevation(vars.camX,vars.camZ,vars.camY)+my/150;
			if(p2<0)p2=0;
			if(p2>Math.PI)p2=Math.PI;
			d=Math.sqrt(vars.camX*vars.camX+vars.camY*vars.camY+vars.camZ*vars.camZ);
			vars.camX=Math.sin(p1)*Math.sin(p2)*d;
			vars.camZ=Math.cos(p1)*Math.sin(p2)*d;
			vars.camY=Math.cos(p2)*d;
			vars.yaw=Math.PI+p1;
			vars.pitch=-Math.PI/2+p2;

		}
		
		p = Math.atan2(vars.camX, vars.camZ);
		d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ)+Math.cos(vars.rFrameNo/250)/60;
		t=Math.sin(vars.rFrameNo/280)/260;
		vars.camX = Math.sin(p + t) * d;
		vars.camZ = Math.cos(p + t) * d;
		vars.yaw = Math.PI + p + t;
		vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
		vars.rFrameNo++;
		
		vars.omx=vars.mx;
		vars.omy=vars.my;
		vars.wheelDelta=0;
		
		if(vars.complete){
			if(vars.alpha>.1){
				vars.alpha/=1.1;
			}else{
				loadScene(vars);
			}
		}
    }


	function drawFloor(vars){
		
		vars.ctx.fillStyle = "#82f";
		for (var i = -100; i <= 100; i += 3) {
			for (var j = -100; j <= 100; j += 3) {
				x = i;
				z = j;
				y = vars.floor;
				point = project3D(x, y, z, vars);
				if (point.d != -1) {
					size = 300 / (1 + point.d);
					d = Math.sqrt(x * x + z * z);
					a = 0.75 - Math.pow(d / 100, 2) * 0.75;
					if (a > 0) {
					vars.ctx.globalAlpha = a;
					vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
					}
				}
			}
		}		
	}
	
	
    function draw(vars){

        vars.ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		var point,point1,point2,x,y,z,ax,ay,az,t,size,a,d,p1,p2;

		if(vars.camY<vars.floor) drawFloor(vars);

		for(var i=0;i<vars.shapes.length;++i){
			vars.shapes[i].color+=.01;
			for(var j=0;j<vars.shapes[i].polys.length;++j){
				
				vars.ctx.globalAlpha=.77*vars.alpha;
				var c=colorString(interpolateColors(rgbArray(vars.shapes[i].color),[16,16,16],.95+Math.sin(vars.frameNo/10+i)/20))
				vars.ctx.fillStyle=vars.shapes[i].selected?"#0f4":c;
				x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[0].a.x;
				y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[0].a.y;
				z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[0].a.z;
				point1=project3D(x,y,z,vars);
				if(point1.d != -1){
					vars.ctx.beginPath();
					vars.ctx.moveTo(point1.x,point1.y);
					ax=ay=az=t=0;
					for(var k=0;k<vars.shapes[i].polys[j].segs.length;++k){
						x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[k].b.x;
						y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[k].b.y;
						z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[k].b.z;
						ax+=x;
						ay+=y;
						az+=z;
						t++;
						point2=project3D(x,y,z,vars);
						if(point2.d != -1){
							vars.ctx.lineTo(point2.x,point2.y);
						}
					}
					vars.ctx.fill();
				}

				vars.ctx.globalAlpha=vars.shapes[i].selected?1*vars.alpha:0.25*vars.alpha;
				vars.ctx.strokeStyle=vars.shapes[i].selected?"#000":"#fff";
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
							vars.ctx.lineWidth=Math.min(10,1+1000/(1+point1.d*point2.d));
							vars.ctx.beginPath();
							vars.ctx.moveTo(point1.x,point1.y);
							vars.ctx.lineTo(point2.x,point2.y);
							vars.ctx.stroke();
						}
					}
					//vars.shapes[i].polys[j].segs[k].a=rotate(vars.shapes[i].polys[j].segs[k].a,.01,0.01,0.01);
					//vars.shapes[i].polys[j].segs[k].b=rotate(vars.shapes[i].polys[j].segs[k].b,.01,0.01,0.01);
				}
				ax/=t;
				ay/=t;
				az/=t;
				vars.shapes[i].polys[j].dist=((vars.camX-ax)*(vars.camX-ax)+(vars.camY-ay)*(vars.camY-ay)+(vars.camZ-az)*(vars.camZ-az));
			}
			vars.shapes[i].polys.sort(sortFunction);

			var d2;
			for(var j=0;j<vars.shapes.length;++j){
				if(j!=i){
					d=Math.sqrt((vars.shapes[i].x-vars.shapes[j].x)*(vars.shapes[i].x-vars.shapes[j].x)+
								(vars.shapes[i].y-vars.shapes[j].y)*(vars.shapes[i].y-vars.shapes[j].y)+
								(vars.shapes[i].z-vars.shapes[j].z)*(vars.shapes[i].z-vars.shapes[j].z));
					if(d<=vars.shapes[i].size+vars.shapes[j].size){
						d2=((vars.shapes[i].size+vars.shapes[j].size)-d)*1.01;
						p1=Math.atan2(vars.shapes[j].x-vars.shapes[i].x,vars.shapes[j].z-vars.shapes[i].z);
						p2=elevation(vars.shapes[j].x-vars.shapes[i].x,vars.shapes[j].z-vars.shapes[i].z,vars.shapes[j].y-vars.shapes[i].y);
						vars.shapes[i].vx-=Math.sin(p1)*Math.sin(p2)/8*d2;
						vars.shapes[i].vz-=Math.cos(p1)*Math.sin(p2)/8*d2;
						vars.shapes[j].vx+=Math.sin(p1)*Math.sin(p2)/8*d2;
						vars.shapes[j].vz+=Math.cos(p1)*Math.sin(p2)/8*d2;
						vars.shapes[j].vy+=Math.cos(p2)/8*d2;
						vars.shapes[j].x+=Math.sin(p1)*Math.sin(p2)*d2;
						vars.shapes[j].z+=Math.cos(p1)*Math.sin(p2)*d2;
						vars.shapes[j].y+=Math.cos(p2)*d2-.1;
						if(p2==Math.PI||!p2)vars.shapes[i].settled
					}
				}
			}
			vars.shapes[i].x+=vars.shapes[i].vx;
			vars.shapes[i].y+=vars.shapes[i].vy;
			vars.shapes[i].z+=vars.shapes[i].vz;
			if(vars.shapes[i].y+vars.shapes[i].size>=vars.floor){
				vars.shapes[i].y=vars.floor-vars.shapes[i].size;
				vars.shapes[i].vx*=.5;
				vars.shapes[i].vy*=-.5;
				vars.shapes[i].vz*=.5;
			}else{
				vars.shapes[i].vy+=vars.gravity;
			}
			vars.shapes[i].vx/=1.025;
			vars.shapes[i].vy/=1.025;
			vars.shapes[i].vz/=1.025;
		}

		if(vars.camY>=vars.floor) drawFloor(vars);
	}

	function pushVert(p1,p2,dist,poly){
		
		x=Math.sin(p1)*Math.sin(p2)*dist;
		z=Math.cos(p1)*Math.sin(p2)*dist;
		y=Math.cos(p2)*dist;
		poly.verts.push(new Vert(x,y,z));
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
	
	
	
	
	function loadTetrahedron(x,y,z){
		
		var size=1.75, pi=Math.PI;
		this.polys=new Array();
		this.x=x, this.y=y, this.z=z, this.dist=0;
		p={};
		p.verts=[];
		pushVert(pi*2/3*0,pi,size,p);
		pushVert(pi*2/3*0,pi-pi*(2/3),size,p);
		pushVert(pi*2/3*1,pi-pi*(2/3),size,p);
		this.polys.push(p);
		p={};
		p.verts=[];
		pushVert(pi*2/3*1,pi,size,p);
		pushVert(pi*2/3*1,pi-pi*(2/3),size,p);
		pushVert(pi*2/3*2,pi-pi*(2/3),size,p);
		this.polys.push(p);
		p={};
		p.verts=[];
		pushVert(pi*2/3*2,pi,size,p);
		pushVert(pi*2/3*2,pi-pi*(2/3),size,p);
		pushVert(pi*2/3*0,pi-pi*(2/3),size,p);
		this.polys.push(p);
		p={};
		p.verts=[];
		pushVert(pi*2/3*0,pi-pi*(2/3),size,p);
		pushVert(pi*2/3*1,pi-pi*(2/3),size,p);
		pushVert(pi*2/3*2,pi-pi*(2/3),size,p);
		this.polys.push(p);
		this.polys=segmentize(this.polys);
		transformShape(this,.75,.75,.75);
	}


    function loadCube(x,y,z,lineWidth){
		
		this.x=x;
		this.y=y;
		this.z=z;
		this.dist=0;
		this.polys=[];
        var poly={};
        poly.segs=[];
        poly.segs.push(new Seg(-1,	1,	-1,	1,	1,	-1));
        poly.segs.push(new Seg(1,	1,	-1,	1,	1,	1));
        poly.segs.push(new Seg(1,	1,	1,	-1,	1,	1));
        poly.segs.push(new Seg(-1,	1,	1,	-1,	1,	-1));
		this.polys.push(poly);
        var poly={};
        poly.segs=[];
        poly.segs.push(new Seg(-1,	-1,	-1,	1,	-1,	-1));
        poly.segs.push(new Seg(1,	-1,	-1,	1,	-1,	1));
        poly.segs.push(new Seg(1,	-1,	1,	-1,	-1,	1));
        poly.segs.push(new Seg(-1,	-1,	1,	-1,	-1,	-1));
		this.polys.push(poly);
        var poly={};
        poly.segs=[];
        poly.segs.push(new Seg(1,	-1,	-1,	1,	1,	-1));
        poly.segs.push(new Seg(1,	1,	-1,	1,	1,	1));
        poly.segs.push(new Seg(1,	1,	1,	1,	-1,	1));
        poly.segs.push(new Seg(1,	-1,	1,	1,	-1,	-1));
		this.polys.push(poly);
        var poly={};
        poly.segs=[];
        poly.segs.push(new Seg(-1,	-1,	-1,	-1,	1,	-1));
        poly.segs.push(new Seg(-1,	1,	-1,	-1,	1,	1));
        poly.segs.push(new Seg(-1,	1,	1,	-1,	-1,	1));
        poly.segs.push(new Seg(-1,	-1,	1,	-1,	-1,	-1));
		this.polys.push(poly);		
        var poly={};
        poly.segs=[];
        poly.segs.push(new Seg(-1,	-1,	1,	1,	-1,	1));
        poly.segs.push(new Seg(1,	-1,	1,	1,	1,	1));
        poly.segs.push(new Seg(1,	1,	1,	-1,	1,	1));
        poly.segs.push(new Seg(-1,	1,	1,	-1,	-1,	1));
		this.polys.push(poly);
        var poly={};
        poly.segs=[];
        poly.segs.push(new Seg(-1,	-1,	-1,	1,	-1,	-1));
        poly.segs.push(new Seg(1,	-1,	-1,	1,	1,	-1));
        poly.segs.push(new Seg(1,	1,	-1,	-1,	1,	-1));
        poly.segs.push(new Seg(-1,	1,	-1,	-1,	-1,	-1));
		this.polys.push(poly);
		return this;
	}


	function loadOctahedron(x,y,z){
		
		var size=1.5, pi=Math.PI;
		this.polys=[];
		this.x=x, this.y=y, this.z=z, this.dist=0;
		p={};
		p.verts=[];
		pushVert(pi*2/4*0,pi,size,p);
		pushVert(pi*2/4*0,pi-pi/2,size,p);
		pushVert(pi*2/4*1,pi-pi/2,size,p);
		this.polys.push(p);
		p={};
		p.verts=[];
		pushVert(pi*2/4*1,pi,size,p);
		pushVert(pi*2/4*1,pi-pi/2,size,p);
		pushVert(pi*2/4*2,pi-pi/2,size,p);
		this.polys.push(p);
		p={};
		p.verts=[];
		pushVert(pi*2/4*2,pi,size,p);
		pushVert(pi*2/4*2,pi-pi/2,size,p);
		pushVert(pi*2/4*3,pi-pi/2,size,p);
		this.polys.push(p);
		p={};
		p.verts=[];
		pushVert(pi*2/4*3,pi,size,p);
		pushVert(pi*2/4*3,pi-pi/2,size,p);
		pushVert(pi*2/4*0,pi-pi/2,size,p);
		this.polys.push(p);
		p={};
		p.verts=[];
		pushVert(pi*2/4*0,0,size,p);
		pushVert(pi*2/4*0,pi/2,size,p);
		pushVert(pi*2/4*1,pi/2,size,p);
		this.polys.push(p);
		p={};
		p.verts=[];
		pushVert(pi*2/4*1,0,size,p);
		pushVert(pi*2/4*1,pi/2,size,p);
		pushVert(pi*2/4*2,pi/2,size,p);
		this.polys.push(p);
		p={};
		p.verts=[];
		pushVert(pi*2/4*2,0,size,p);
		pushVert(pi*2/4*2,pi/2,size,p);
		pushVert(pi*2/4*3,pi/2,size,p);
		this.polys.push(p);
		p={};
		p.verts=[];
		pushVert(pi*2/4*3,0,size,p);
		pushVert(pi*2/4*3,pi/2,size,p);
		pushVert(pi*2/4*0,pi/2,size,p);
		this.polys.push(p);
		this.polys=segmentize(this.polys);
		transformShape(this,.75,.75,.75);
	}


	function loadDodecahedron(x,y,z,selected,size,convexity){
		
		this.polys = [];
		this.x=x, this.y=y, this.z=z, this.dist=0
		var polygon={};
		polygon.verts=[];

		for(var i=0;i<5;++i){
			p=Math.PI*2/5*i;
			x=Math.sin(p)*1;
			y=Math.cos(p)*1;
			z=0;
			polygon.verts.push(new Vert(x,y,z));
		}
		d=Math.sqrt((polygon.verts[1].x-polygon.verts[0].x)*(polygon.verts[1].x-polygon.verts[0].x)+
					(polygon.verts[1].y-polygon.verts[0].y)*(polygon.verts[1].y-polygon.verts[0].y)+
					(polygon.verts[1].z-polygon.verts[0].z)*(polygon.verts[1].z-polygon.verts[0].z));

		a=1.113516364*d;
		this.polys.push(polygon);
		polygon={};
		polygon.verts=[];
		for(var i=0;i<5;++i){
			p=Math.PI*2/5*i+Math.PI/5;
			x=Math.sin(p)*1;
			y=Math.cos(p)*1;
			z=-a;
			polygon.verts.push(new Vert(x,y,z));
			this.polys[0].verts[i].z=a;
		}
		this.polys.push(polygon);
		for(var k=0;k<5;++k){		
			this.polys.push(JSON.parse(JSON.stringify(this.polys[0])));
			this.polys.push(JSON.parse(JSON.stringify(this.polys[1])));
			for(var i=this.polys.length-2;i<this.polys.length;++i){
				for(var j=0;j<5;++j){
					p=Math.atan2(this.polys[i].verts[j].x,this.polys[i].verts[j].y)-Math.PI/5;
					d=Math.sqrt(this.polys[i].verts[j].x*this.polys[i].verts[j].x+
								this.polys[i].verts[j].y*this.polys[i].verts[j].y);
					this.polys[i].verts[j].x=Math.sin(p)*d;
					this.polys[i].verts[j].y=Math.cos(p)*d;
					p=Math.atan2(this.polys[i].verts[j].y,this.polys[i].verts[j].z)-1.107149611002;
					d=Math.sqrt(this.polys[i].verts[j].y*this.polys[i].verts[j].y+
								this.polys[i].verts[j].z*this.polys[i].verts[j].z);
					this.polys[i].verts[j].y=Math.sin(p)*d;
					this.polys[i].verts[j].z=Math.cos(p)*d;
				}
			}
			for(var i=0;i<this.polys.length;++i){
				for(var j=0;j<5;++j){
					p=Math.atan2(this.polys[i].verts[j].x,this.polys[i].verts[j].y)-Math.PI*2/5;
					d=Math.sqrt(this.polys[i].verts[j].x*this.polys[i].verts[j].x+
								this.polys[i].verts[j].y*this.polys[i].verts[j].y);
					this.polys[i].verts[j].x=Math.sin(p)*d;
					this.polys[i].verts[j].y=Math.cos(p)*d;
				}
			}
		}
		this.polys=segmentize(this.polys);
		transformShape(this,.75,.75,.75);
	}


	function loadIcosahedron(x,y,z){
		
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
		this.polys=segmentize(this.polys);
		transformShape(this,.7,.7,.7);
	}
	
	

    function loadScene(vars){

		var rows = 5, cols = 3, bars=3, spacing = 20, x, y, z, size;
		vars.shapes=[];
		vars.alpha=1;
        for(var i=0;i<bars;++i){
			for(var j=0;j<rows;++j){
				for(var k=0;k<cols;++k){
					x=(-cols/2+0.5+k)*spacing;
					y=(-rows/2+0.5+j)*spacing-100;
					z=(-bars/2+0.5+i)*spacing;
					switch(parseInt(Math.random()*5)){
						case 0: vars.shapes.push(new loadTetrahedron(x,y,z)); break;
						case 1: vars.shapes.push(new loadCube(x,y,z)); break;
						case 2: vars.shapes.push(new loadOctahedron(x,y,z)); break;
						case 3: vars.shapes.push(new loadDodecahedron(x,y,z)); break;
						case 4: vars.shapes.push(new loadIcosahedron(x,y,z)); break;
					}
					vars.shapes[vars.shapes.length-1].color=Math.random()*Math.PI*2;
					vars.shapes[vars.shapes.length-1].vx=0;
					vars.shapes[vars.shapes.length-1].vy=0;
					vars.shapes[vars.shapes.length-1].vz=0;
					size=2;//+Math.random()*2.5;
					vars.shapes[vars.shapes.length-1].size=size;
					transformShape(vars.shapes[vars.shapes.length-1],size,size,size);
				}
			}
		}
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
            vars.camX = 15;
            vars.camY = -20;
            vars.camZ = -60;

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
            vars.scale=800;
			vars.draggingShape=0;
			vars.gravity=.03;
			vars.floor=10;
			vars.phase=0;
			vars.alpha=1;
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