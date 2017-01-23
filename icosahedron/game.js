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
	var rx1=-1000, ry1=1, rx2=1000, ry2=1;
	var rx3=0, ry3=0, rx4=x, ry4=z;
	var uc=(ry4-ry3)*(rx2-rx1)-(rx4-rx3)*(ry2-ry1);
	var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
	var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
	if(ua>=0&&ua<=1&&ub>=0&&ub<=1){
		return {
			x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
			y:vars.cy+y/z*vars.scale,
			d:Math.sqrt(x*x+y*y+z*z)
		};
	}else{
		return {d:-1};
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

function rotate(vert,pitch,yaw){
	var p,d;
	p=Math.atan2(vert.y,vert.z);
	d=Math.sqrt(vert.y*vert.y+vert.z*vert.z);
	vert.y=Math.sin(p+pitch)*d;
	vert.z=Math.cos(p+pitch)*d;
	p=Math.atan2(vert.x,vert.z);
	d=Math.sqrt(vert.x*vert.x+vert.z*vert.z);
	vert.x=Math.sin(p+yaw)*d;
	vert.z=Math.cos(p+yaw)*d;
}

function elevation(x,y,z){
	var dist = Math.sqrt(x*x+y*y+z*z);
	if(dist && z/dist>=-1 && z/dist <=1) return Math.acos(z / dist);
	return 0.00000001;
}

function process(vars){
	
	var p1,p2,p,t,d,x1,y1,z1,x2,y2,z2;
	
	p = Math.atan2(vars.camX, vars.camZ);
	d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
	d += Math.sin(vars.frameNo / 70) / 18.15;
	t = Math.sin(vars.frameNo / 100) / 60;
	vars.camX = Math.sin(p + t) * d;
	vars.camZ = Math.cos(p + t) * d;
	vars.camY -= Math.cos(vars.frameNo / 80) / 12;
	vars.yaw = Math.PI + p + t;
	vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;

	for(var i=0;i<vars.shapes.length;++i){
		for(var j=0;j<vars.shapes[i].polys.length;++j){
			vars.shapes[i].polys[j].ox=vars.shapes[i].polys[j].oy=vars.shapes[i].polys[j].oz=0;
			for(var k=0;k<vars.shapes[i].polys[j].segs.length;++k){
				x=vars.shapes[i].polys[j].osegs[k].a.x;
				y=vars.shapes[i].polys[j].osegs[k].a.y;
				z=vars.shapes[i].polys[j].osegs[k].a.z;
				vars.shapes[i].polys[j].ox+=x/3;
				vars.shapes[i].polys[j].oy+=y/3;
				vars.shapes[i].polys[j].oz+=z/3;
			}
		}
	}
	for(var i=0;i<vars.shapes.length;++i){
		vars.shapes[i].pitch=Math.sin(vars.frameNo/100)*Math.PI/3;
		vars.shapes[i].yaw+=.01;
		vars.shapes[i].modulation=.5+Math.sin(Math.PI*2/vars.shapes.length*vars.shapes[i].index+vars.frameNo/25)/2;
		for(var j=0;j<vars.shapes[i].polys.length;++j){
			x1=vars.shapes[i].polys[j].ox;
			y1=vars.shapes[i].polys[j].oy;
			z1=vars.shapes[i].polys[j].oz;
			vars.shapes[i].polys[j].x=vars.shapes[i].polys[j].y=vars.shapes[i].polys[j].z=0;
			for(var k=0;k<vars.shapes[i].polys[j].segs.length;++k){
				x2=vars.shapes[i].polys[j].osegs[k].a.x;
				y2=vars.shapes[i].polys[j].osegs[k].a.y;
				z2=vars.shapes[i].polys[j].osegs[k].a.z;
				p1=Math.atan2(x2-x1,y2-y1);
				p2=elevation(x2-x1,y2-y1,z2-z1);
				d=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)+(z2-z1)*(z2-z1));
				vars.shapes[i].polys[j].segs[k].a.x=x1+Math.sin(p1)*Math.sin(p2)*d*vars.shapes[i].modulation;
				vars.shapes[i].polys[j].segs[k].a.y=y1+Math.cos(p1)*Math.sin(p2)*d*vars.shapes[i].modulation;
				vars.shapes[i].polys[j].segs[k].a.z=z1+Math.cos(p2)*d*vars.shapes[i].modulation;
				x2=vars.shapes[i].polys[j].osegs[k].b.x;
				y2=vars.shapes[i].polys[j].osegs[k].b.y;
				z2=vars.shapes[i].polys[j].osegs[k].b.z;
				p1=Math.atan2(x2-x1,y2-y1);
				p2=elevation(x2-x1,y2-y1,z2-z1);
				d=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)+(z2-z1)*(z2-z1));
				vars.shapes[i].polys[j].segs[k].b.x=x1+Math.sin(p1)*Math.sin(p2)*d*vars.shapes[i].modulation;
				vars.shapes[i].polys[j].segs[k].b.y=y1+Math.cos(p1)*Math.sin(p2)*d*vars.shapes[i].modulation;
				vars.shapes[i].polys[j].segs[k].b.z=z1+Math.cos(p2)*d*vars.shapes[i].modulation;
				rotate(vars.shapes[i].polys[j].segs[k].a,vars.shapes[i].pitch,vars.shapes[i].yaw);
				rotate(vars.shapes[i].polys[j].segs[k].b,vars.shapes[i].pitch,vars.shapes[i].yaw);
				vars.shapes[i].polys[j].x+=vars.shapes[i].polys[j].segs[k].b.x/3;
				vars.shapes[i].polys[j].y+=vars.shapes[i].polys[j].segs[k].b.y/3;
				vars.shapes[i].polys[j].z+=vars.shapes[i].polys[j].segs[k].b.z/3;
			}
			vars.shapes[i].polys[j].dist=(vars.shapes[i].polys[j].x-vars.camX)*(vars.shapes[i].polys[j].x-vars.camX)+
										 (vars.shapes[i].polys[j].y-vars.camY)*(vars.shapes[i].polys[j].y-vars.camY)+
										 (vars.shapes[i].polys[j].z-vars.camZ)*(vars.shapes[i].polys[j].z-vars.camZ);
		}
		vars.shapes[i].polys.sort(sortFunction);
		vars.shapes[i].dist=((vars.shapes[i].x-vars.camX)*(vars.shapes[i].x-vars.camX)+
							 (vars.shapes[i].y-vars.camY)*(vars.shapes[i].y-vars.camY)+
							 (vars.shapes[i].z-vars.camZ)*(vars.shapes[i].z-vars.camZ));
	}
	vars.shapes.sort(sortFunction);
}

function drawFloor(vars) {

  var x,y,z,size,a;
  var t=parseInt(15+Math.cos(vars.frameNo/40)*14);
  for (var i = -30; i <= 30; i += 1) {
	for (var j = -30; j <= 30; j += 1) {
	  x = i/1.5;
	  z = j/1.5;
	  y = 10;
	  point = project3D(x, y, z, vars);
	  if (point.d != -1) {
		size = 250 / (1 + point.d);
		d = Math.sqrt(x * x + z * z);
		a = .75 - Math.pow(d / 20, 2)*.75;
		if (a > 0) {
		  vars.ctx.fillStyle = !(i%t)||!(j%t)?"#208":"#082";
		  vars.ctx.globalAlpha = a;
		  vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
		}
	  }
	}
  }
}

function drawCeiling(vars) {

  var x,y,z,size,a;
  var t=parseInt(15+Math.cos(vars.frameNo/40)*14);
  for (var i = -30; i <= 30; i += 1) {
	for (var j = -30; j <= 30; j += 1) {
	  x = i/1.5;
	  z = j/1.5;
	  y = -10;
	  point = project3D(x, y, z, vars);
	  if (point.d != -1) {
		size = 250 / (1 + point.d);
		d = Math.sqrt(x * x + z * z);
		a = .75 - Math.pow(d / 20, 2)*.75;
		if (a > 0) {
		  vars.ctx.fillStyle = !(i%t)||!(j%t)?"#082":"#208";
		  vars.ctx.globalAlpha = a;
		  vars.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
		}
	  }
	}
  }
}

function draw(vars){
	vars.ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawFloor(vars);
	drawCeiling(vars);
	var point1,point2,x,y,z;
	for(var i=0;i<vars.shapes.length;++i){
		for(var j=0;j<vars.shapes[i].polys.length;++j){
			vars.ctx.globalAlpha=.75;
			vars.ctx.fillStyle="#208";
			x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[0].a.x;
			y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[0].a.y;
			z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[0].a.z;
			point1=project3D(x,y,z,vars);
			vars.ctx.beginPath();
			vars.ctx.moveTo(point1.x,point1.y);
			vars.shapes[i].polys[j].x=vars.shapes[i].polys[j].y=vars.shapes[i].polys[j].z=0;
			for(var k=0;k<vars.shapes[i].polys[j].segs.length;++k){
				x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[k].b.x;
				y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[k].b.y;
				z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[k].b.z;
				point2=project3D(x,y,z,vars);
				vars.ctx.lineTo(point2.x,point2.y);
			}
			vars.ctx.fill();

			vars.ctx.globalAlpha=.75;
			vars.ctx.strokeStyle="#0f3";
			for(var k=0;k<vars.shapes[i].polys[j].segs.length;++k){					
				x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[k].a.x;
				y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[k].a.y;
				z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[k].a.z;
				point1=project3D(x,y,z,vars);
				x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[k].b.x;
				y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[k].b.y;
				z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[k].b.z;
				point2=project3D(x,y,z,vars);
				vars.ctx.lineWidth=1+50/(1+point1.d*point2.d);
				vars.ctx.beginPath();
				vars.ctx.moveTo(point1.x,point1.y);
				vars.ctx.lineTo(point2.x,point2.y);
				vars.ctx.stroke();
			}
		}
	}
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
	var polys=[];
	for(var i=0;i<this.polys.length;++i){
		var poly={};
		poly.segs=[];
		poly.osegs=[];
		x3=y3=z3=0;
		for(var j=0;j<this.polys[i].verts.length;++j){
			x1=this.polys[i].verts[j].x;
			y1=this.polys[i].verts[j].y;
			z1=this.polys[i].verts[j].z;
			x3+=x1;
			y3+=y1;
			z3+=z1;
			if(j<this.polys[i].verts.length-1){
				x2=this.polys[i].verts[j+1].x;
				y2=this.polys[i].verts[j+1].y;
				z2=this.polys[i].verts[j+1].z;
			}else{
				x2=this.polys[i].verts[0].x;
				y2=this.polys[i].verts[0].y;
				z2=this.polys[i].verts[0].z;
			}
			poly.segs.push(new Seg(x1,y1,z1,x2,y2,z2));
			poly.osegs.push(new Seg(x1,y1,z1,x2,y2,z2));
		}
		poly.ox=x3/3;
		poly.oy=y3/3;
		poly.oz=z3/3;
		polys.push(poly);
	}
	this.polys=polys;
}

function loadScene(vars){
	var rows=3, cols=3, bars=3; spacing=6;
	for(var i=0;i<cols;++i){
		for(var j=0;j<rows;++j){
			for(var k=0;k<bars;++k){
				x=(-cols/2+.5)*spacing+i*spacing;
				y=(-rows/2+.5)*spacing+j*spacing;
				z=(-bars/2+.5)*spacing+k*spacing;
				vars.shapes.push(new loadIcosahedron(x,y,z));
				vars.shapes[vars.shapes.length-1].pitch=0;
				vars.shapes[vars.shapes.length-1].yaw=0;
				vars.shapes[vars.shapes.length-1].modulation=0;
				vars.shapes[vars.shapes.length-1].index=vars.shapes.length-1;
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
		vars.frameNo=0;
		vars.camX = 0;
		vars.camY = 0;
		vars.camZ = -16;
		vars.yaw=0;
		vars.pitch=0;
		vars.cx=vars.canvas.width/2;
		vars.cy=vars.canvas.height/2;
		vars.scale=600;
		vars.shapes=[];
		loadScene(vars);
	}
	vars.frameNo++;
	requestAnimationFrame(function() { frame(vars); });
	process(vars);
	draw(vars);
}
frame();
