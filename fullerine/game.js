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

	
	function Polygon(){

		this.verts=new Array();
		this.dist=0;
	}

	
    function process(vars){

		updateScene(vars);
		p = Math.atan2(vars.camX, vars.camZ);
		d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
		d -= Math.sin(vars.frameNo / 50) / 60;
		t = Math.sin(vars.frameNo / 130) / 50;
		vars.camX = Math.sin(p + t) * d;
		vars.camZ = Math.cos(p + t) * d;
		vars.camY -= Math.cos(vars.frameNo / 80) / 40;
		vars.yaw = Math.PI + p + t;
		vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
    }
	
    function draw(vars){

		vars.ctx.globalAlpha=.5;
		vars.ctx.fillStyle=rgb(vars.frameNo/10);
        vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		var x1,y1,z1,x2,y2,z2,point1,point2;
				
		for(var i=0;i<vars.shapes.length;++i){
			for(var j=0;j<vars.shapes[i].polys.length;++j){
				vars.ctx.globalAlpha=.5;
				vars.ctx.fillStyle=rgb(vars.shapes[i].polys[j].col*10);
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
					
				if(!i){
					vars.ctx.globalAlpha=.45;
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
								vars.ctx.strokeStyle=rgb(vars.frameNo/8);
								vars.ctx.lineWidth=800/(1+point1.d);
								vars.ctx.beginPath();
								vars.ctx.moveTo(point1.x,point1.y);
								vars.ctx.lineTo(point2.x,point2.y);
								vars.ctx.stroke();
							}
						}
					}
				}else{
					vars.ctx.globalAlpha=.75;
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
								vars.ctx.strokeStyle="#f28";
								vars.ctx.lineWidth=40/(1+point1.d);
								vars.ctx.beginPath();
								vars.ctx.moveTo(point1.x,point1.y);
								vars.ctx.lineTo(point2.x,point2.y);
								vars.ctx.stroke();
							}
						}
					}
				}				
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
				t2=(2/3)*(1+Math.sin(vars.frameNo/10+Math.PI*2/shape.polys.length*i*4)/4);
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

		var x,y,z,x1,y1,z1,x2,y2,z2,x3,y3,z3;
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

		shape=new Icosahedron(x,y,z);
		shape=subdivide(shape,1);
		shape=expandShape(shape,1)
		shape.polys=segmentize(shape.polys);
		shape=truncate(shape,vars,0);
		vars.shapes.push(shape);
		transformShape(vars.shapes[vars.shapes.length-1],1.25,1.25,1.25);
    }


    function updateScene(vars){

		var x,y,z,x1,y1,z1,x2,y2,z2,x3,y3,z3,t;
		
		x=0;
		y=0;
		z=0;
		vars.shapes[0]=new Icosahedron(x,y,z);
		vars.shapes[0]=subdivide(vars.shapes[0],2);
		vars.shapes[0]=expandShape(vars.shapes[0],1)
		vars.shapes[0].polys=segmentize(vars.shapes[0].polys);
		vars.shapes[0]=truncate(vars.shapes[0],vars,1);
		t=100+Math.sin(vars.frameNo/50)*80;
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
            vars.frameNo=0;
            vars.rFrameNo=0;
            vars.camX = 0;
            vars.camY = 0;
            vars.camZ = -5;
			vars.yaw=0;
			vars.pitch=0;


            vars.mx=0;
            vars.my=0;
			vars.omx=vars.mx;
			vars.omy=vars.my;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
            vars.scale=800;
			vars.floor=2.5;
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