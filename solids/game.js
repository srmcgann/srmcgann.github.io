function initVars(){

	pi=Math.PI;
	phi=1.61803398875;
	canvas=$("#canvas")[0];
	ctx=canvas.getContext("2d");
	canvas.width=1366;
	canvas.height=768;
	cx=canvas.width/2;
	cy=canvas.height/2;
	playerY=5,playerZ=-50,playerX=0;
	pitch=.25,yaw=0,pitchV=yawV=0;
	scale=550;
	leftkey=rightkey=upkey=downkey=spacekey=altkey=wkey=akey=skey=dkey=enterkey=shiftkey=0;
	mx=my=leftButton=rightButton=0;
	p1=Math.atan2(playerX,playerZ)+mx/50;
	p2=elevation(playerX,playerZ,playerY)+my/50;
	yaw=pi+p1;
	pitch=-pi/2+p2;
	frames=0;
	lineSubs=4;
	canvas.addEventListener("mousemove", mouse, true);
}

function resizeShape(shape,size){
	
	for(i=0;i<shape.polys.length;++i){
		for(j=0;j<shape.polys[i].verts.length;++j){
			x=shape.polys[i].verts[j].x;
			y=shape.polys[i].verts[j].y;
			z=shape.polys[i].verts[j].z;
			d=Math.sqrt(x*x+y*y+z*z);
			p1=Math.atan2(x,z);
			p2=elevation(x,z,y);
			shape.polys[i].verts[j].x=Math.sin(p1)*Math.sin(p2)/d*size;
			shape.polys[i].verts[j].z=Math.cos(p1)*Math.sin(p2)/d*size;
			shape.polys[i].verts[j].y=Math.cos(p2)/d*size;
		}
	}
}

function pushVert(p1,p2,dist,poly){
	
	x=Math.sin(p1)*Math.sin(p2)*dist;
	z=Math.cos(p1)*Math.sin(p2)*dist;
	y=Math.cos(p2)*dist;
	poly.verts.push(new Vertex(x,y,z));
}

function loadShapes(){
	
	shapes=new Array();
	size=6;

	// tetrahedron
	shapes.push(new Shape(-35,0,0,0,0,0));
	p=new Polygon();
	pushVert(pi*2/3*0,pi,size,p);
	pushVert(pi*2/3*0,pi-pi*(2/3),size,p);
	pushVert(pi*2/3*1,pi-pi*(2/3),size,p);
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	pushVert(pi*2/3*1,pi,size,p);
	pushVert(pi*2/3*1,pi-pi*(2/3),size,p);
	pushVert(pi*2/3*2,pi-pi*(2/3),size,p);
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	pushVert(pi*2/3*2,pi,size,p);
	pushVert(pi*2/3*2,pi-pi*(2/3),size,p);
	pushVert(pi*2/3*0,pi-pi*(2/3),size,p);
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	pushVert(pi*2/3*0,pi-pi*(2/3),size,p);
	pushVert(pi*2/3*1,pi-pi*(2/3),size,p);
	pushVert(pi*2/3*2,pi-pi*(2/3),size,p);
	shapes[shapes.length-1].polys.push(p);
	
	// cube
	shapes.push(new Shape(-17.5,0,0,0,0,0));
	s=Math.sqrt(size*2);
	p=new Polygon();
	p.verts.push(new Vertex(-s,-s,-s));
	p.verts.push(new Vertex(s,-s,-s));
	p.verts.push(new Vertex(s,s,-s));
	p.verts.push(new Vertex(-s,s,-s));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(-s,-s,s));
	p.verts.push(new Vertex(s,-s,s));
	p.verts.push(new Vertex(s,s,s));
	p.verts.push(new Vertex(-s,s,s));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(-s,-s,-s));
	p.verts.push(new Vertex(-s,s,-s));
	p.verts.push(new Vertex(-s,s,s));
	p.verts.push(new Vertex(-s,-s,s));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(-s,s,-s));
	p.verts.push(new Vertex(-s,s,s));
	p.verts.push(new Vertex(s,s,s));
	p.verts.push(new Vertex(s,s,-s));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(-s,-s,-s));
	p.verts.push(new Vertex(-s,-s,s));
	p.verts.push(new Vertex(s,-s,s));
	p.verts.push(new Vertex(s,-s,-s));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(s,-s,-s));
	p.verts.push(new Vertex(s,s,-s));
	p.verts.push(new Vertex(s,s,s));
	p.verts.push(new Vertex(s,-s,s));
	shapes[shapes.length-1].polys.push(p);
	
	// octahedron
	shapes.push(new Shape(0,0,0,0,0,0));
	p=new Polygon();
	pushVert(pi*2/4*0,pi,size,p);
	pushVert(pi*2/4*0,pi-pi/2,size,p);
	pushVert(pi*2/4*1,pi-pi/2,size,p);
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*1,pi,size,p);
	pushVert(pi*2/4*1,pi-pi/2,size,p);
	pushVert(pi*2/4*2,pi-pi/2,size,p);
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*2,pi,size,p);
	pushVert(pi*2/4*2,pi-pi/2,size,p);
	pushVert(pi*2/4*3,pi-pi/2,size,p);
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*3,pi,size,p);
	pushVert(pi*2/4*3,pi-pi/2,size,p);
	pushVert(pi*2/4*0,pi-pi/2,size,p);
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*0,0,size,p);
	pushVert(pi*2/4*0,pi/2,size,p);
	pushVert(pi*2/4*1,pi/2,size,p);
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*1,0,size,p);
	pushVert(pi*2/4*1,pi/2,size,p);
	pushVert(pi*2/4*2,pi/2,size,p);
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*2,0,size,p);
	pushVert(pi*2/4*2,pi/2,size,p);
	pushVert(pi*2/4*3,pi/2,size,p);
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*3,0,size,p);
	pushVert(pi*2/4*3,pi/2,size,p);
	pushVert(pi*2/4*0,pi/2,size,p);
	shapes[shapes.length-1].polys.push(p);
	
	// dodecahedron
	shapes.push(new Shape(17.5,0,0,0,0,0));
	polygon=new Polygon();
	for(i=0;i<5;++i){
		p=pi*2/5*i;
		x=Math.sin(p)*1;
		y=Math.cos(p)*1;
		z=0;
		polygon.verts.push(new Vertex(x,y,z));
	}
	d=Math.sqrt((polygon.verts[1].x-polygon.verts[0].x)*(polygon.verts[1].x-polygon.verts[0].x)+
				(polygon.verts[1].y-polygon.verts[0].y)*(polygon.verts[1].y-polygon.verts[0].y)+
				(polygon.verts[1].z-polygon.verts[0].z)*(polygon.verts[1].z-polygon.verts[0].z));

	a=1.113516364*d;
	shapes[shapes.length-1].polys.push(polygon);
	polygon=new Polygon();
	for(i=0;i<5;++i){
		p=pi*2/5*i+pi/5;
		x=Math.sin(p)*1;
		y=Math.cos(p)*1;
		z=-a;
		polygon.verts.push(new Vertex(x,y,z));
		shapes[shapes.length-1].polys[0].verts[i].z=a;
	}
	shapes[shapes.length-1].polys.push(polygon);
	for(k=0;k<5;++k){		
		shapes[shapes.length-1].polys.push(JSON.parse(JSON.stringify(shapes[shapes.length-1].polys[0])));
		shapes[shapes.length-1].polys.push(JSON.parse(JSON.stringify(shapes[shapes.length-1].polys[1])));
		for(i=shapes[shapes.length-1].polys.length-2;i<shapes[shapes.length-1].polys.length;++i){
			for(j=0;j<5;++j){
				p=Math.atan2(shapes[shapes.length-1].polys[i].verts[j].x,shapes[shapes.length-1].polys[i].verts[j].y)-pi/5;
				d=Math.sqrt(shapes[shapes.length-1].polys[i].verts[j].x*shapes[shapes.length-1].polys[i].verts[j].x+
							shapes[shapes.length-1].polys[i].verts[j].y*shapes[shapes.length-1].polys[i].verts[j].y);
				shapes[shapes.length-1].polys[i].verts[j].x=Math.sin(p)*d;
				shapes[shapes.length-1].polys[i].verts[j].y=Math.cos(p)*d;
				p=Math.atan2(shapes[shapes.length-1].polys[i].verts[j].y,shapes[shapes.length-1].polys[i].verts[j].z)-1.107149611002;
				d=Math.sqrt(shapes[shapes.length-1].polys[i].verts[j].y*shapes[shapes.length-1].polys[i].verts[j].y+
							shapes[shapes.length-1].polys[i].verts[j].z*shapes[shapes.length-1].polys[i].verts[j].z);
				shapes[shapes.length-1].polys[i].verts[j].y=Math.sin(p)*d;
				shapes[shapes.length-1].polys[i].verts[j].z=Math.cos(p)*d;
			}
		}
		for(i=0;i<shapes[shapes.length-1].polys.length;++i){
			for(j=0;j<5;++j){
				p=Math.atan2(shapes[shapes.length-1].polys[i].verts[j].x,shapes[shapes.length-1].polys[i].verts[j].y)-pi*2/5;
				d=Math.sqrt(shapes[shapes.length-1].polys[i].verts[j].x*shapes[shapes.length-1].polys[i].verts[j].x+
							shapes[shapes.length-1].polys[i].verts[j].y*shapes[shapes.length-1].polys[i].verts[j].y);
				shapes[shapes.length-1].polys[i].verts[j].x=Math.sin(p)*d;
				shapes[shapes.length-1].polys[i].verts[j].y=Math.cos(p)*d;
			}
		}
	}
	resizeShape(shapes[shapes.length-1],size*phi);

	
	// icosahedron
	shapes.push(new Shape(35,0,0,0,0,0));
	x1=-phi, y1=-1, z1=0, x2=phi, y2=-1, z2=0, x3=phi, y3=1, z3=0, x4=-phi, y4=1, z4=0,
	y5=-phi, z5=-1, x5=0, y6=phi, z6=-1, x6=0, y7=phi, z7=1, x7=0, y8=-phi, z8=1, x8=0,
	z9=-phi, x9=-1, y9=0, z10=phi, x10=-1, y10=0, z11=phi, x11=1, y11=0, z12=-phi, x12=1, y12=0,	
	p=new Polygon();
	p.verts.push(new Vertex(x1,y1,z1));
	p.verts.push(new Vertex(x5,y5,z5));
	p.verts.push(new Vertex(x8,y8,z8));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x2,y2,z2));
	p.verts.push(new Vertex(x5,y5,z5));
	p.verts.push(new Vertex(x8,y8,z8));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x3,y3,z3));
	p.verts.push(new Vertex(x6,y6,z6));
	p.verts.push(new Vertex(x7,y7,z7));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x4,y4,z4));
	p.verts.push(new Vertex(x6,y6,z6));
	p.verts.push(new Vertex(x7,y7,z7));
	shapes[shapes.length-1].polys.push(p);	
	p=new Polygon();
	p.verts.push(new Vertex(x9,y9,z9));
	p.verts.push(new Vertex(x12,y12,z12));
	p.verts.push(new Vertex(x5,y5,z5));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x9,y9,z9));
	p.verts.push(new Vertex(x12,y12,z12));
	p.verts.push(new Vertex(x6,y6,z6));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x10,y10,z10));
	p.verts.push(new Vertex(x11,y11,z11));
	p.verts.push(new Vertex(x7,y7,z7));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x10,y10,z10));
	p.verts.push(new Vertex(x11,y11,z11));
	p.verts.push(new Vertex(x8,y8,z8));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x1,y1,z1));
	p.verts.push(new Vertex(x9,y9,z9));
	p.verts.push(new Vertex(x4,y4,z4));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x1,y1,z1));
	p.verts.push(new Vertex(x10,y10,z10));
	p.verts.push(new Vertex(x4,y4,z4));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x2,y2,z2));
	p.verts.push(new Vertex(x11,y11,z11));
	p.verts.push(new Vertex(x3,y3,z3));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x2,y2,z2));
	p.verts.push(new Vertex(x12,y12,z12));
	p.verts.push(new Vertex(x3,y3,z3));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x2,y2,z2));
	p.verts.push(new Vertex(x11,y11,z11));
	p.verts.push(new Vertex(x8,y8,z8));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x2,y2,z2));
	p.verts.push(new Vertex(x12,y12,z12));
	p.verts.push(new Vertex(x5,y5,z5));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x1,y1,z1));
	p.verts.push(new Vertex(x10,y10,z10));
	p.verts.push(new Vertex(x8,y8,z8));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x1,y1,z1));
	p.verts.push(new Vertex(x9,y9,z9));
	p.verts.push(new Vertex(x5,y5,z5));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x4,y4,z4));
	p.verts.push(new Vertex(x9,y9,z9));
	p.verts.push(new Vertex(x6,y6,z6));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x3,y3,z3));
	p.verts.push(new Vertex(x12,y12,z12));
	p.verts.push(new Vertex(x6,y6,z6));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x4,y4,z4));
	p.verts.push(new Vertex(x10,y10,z10));
	p.verts.push(new Vertex(x7,y7,z7));
	shapes[shapes.length-1].polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x3,y3,z3));
	p.verts.push(new Vertex(x11,y11,z11));
	p.verts.push(new Vertex(x7,y7,z7));
	shapes[shapes.length-1].polys.push(p);
	resizeShape(shapes[shapes.length-1],size*phi);
}

function Vertex(x,y,z){
	
	this.x=x; this.y=y; this.z=z;
}

function Polygon(){

	this.verts=new Array();
	this.dist=0;
}

function Shape(x,y,z,pitch,yaw,roll){
	
	this.polys=new Array();
	this.x=x, this.y=y, this.z=z, this.pitch=pitch, this.yaw=yaw, this.roll=roll;
	this.dist=0;
	this.id=shapes.length;
}

function mouse(e) {
	
	mx = e.movementX ||
		e.mozMovementX          ||
		e.webkitMovementX       ||
		0;

	my = e.movementY ||
		e.mozMovementY      ||
		e.webkitMovementY   ||
		0;
    doLogic();
    draw();
}

canvas.onmousedown=function(event){event.preventDefault();}
$('body').on('contextmenu', '#canvas', function(e){ return false; });
canvas.addEventListener("mousedown", function(event) {
	switch (event.which) {
		case 1: leftButton=true; break;
		case 3: rightButton=true; break;
	}
});
canvas.addEventListener("mouseup", function(event) {
	switch (event.which) {
		case 1: leftButton=false; break;
		case 3: rightButton=false; break;
	}
});

function rasterizePoint(x,y,z){

	var p,d;
	x-=playerX;
	y-=playerY;
	z-=playerZ;
	p=Math.atan2(x,z);
	d=Math.sqrt(x*x+z*z);
	x=Math.sin(p-yaw)*d;
	z=Math.cos(p-yaw)*d;
	p=Math.atan2(y,z);
	d=Math.sqrt(y*y+z*z);
	y=Math.sin(p-pitch)*d;
	z=Math.cos(p-pitch)*d;
	var rx1=-1000,ry1=1,rx2=1000,ry2=1,rx3=0,ry3=0,rx4=x,ry4=z,uc=(ry4-ry3)*(rx2-rx1)-(rx4-rx3)*(ry2-ry1);
	if(!uc) return {x:0,y:0,d:-1};
	var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
	var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
	if(!z)z=.000000001;
	if(ua>0&&ua<1&&ub>0&&ub<1){
		return {
			x:cx+(rx1+ua*(rx2-rx1))*scale,
			y:cy+y/z*scale,
			d:Math.sqrt(x*x+y*y+z*z)
		};
	}else{
		return {
			x:cx+(rx1+ua*(rx2-rx1))*scale,
			y:cy+y/z*scale,
			d:-1
		};
	}
}

function elevation(x,y,z){

    var dist = Math.sqrt(x*x+y*y+z*z);
    if(dist!=0 && z/dist>=-1 && z/dist <=1) return Math.acos(z / dist);
    return .00000001;
}

function sortFunction(a,b){
	return b.dist-a.dist;
}

function doLogic(){
	

	for(i=0;i<shapes.length;++i){
		shapes[i].roll+=.02;
		shapes[i].yaw+=.02;
		shapes[i].dist=Math.sqrt((playerX-shapes[i].x)*(playerX-shapes[i].x)+
								 (playerY-shapes[i].y)*(playerY-shapes[i].y)+
								 (playerZ-shapes[i].z)*(playerZ-shapes[i].z));
		for(j=0;j<shapes[i].polys.length;++j){
			tx=ty=tz=0;
			for(k=0;k<shapes[i].polys[j].verts.length;++k){
				x=shapes[i].polys[j].verts[k].x;
				y=shapes[i].polys[j].verts[k].y;
				z=shapes[i].polys[j].verts[k].z;
				p=Math.atan2(x,y);
				d=Math.sqrt(x*x+y*y);
				x=Math.sin(p+shapes[i].roll)*d;
				y=Math.cos(p+shapes[i].roll)*d;
				p=Math.atan2(y,z);
				d=Math.sqrt(y*y+z*z);
				y=shapes[i].y+Math.sin(p+shapes[i].pitch)*d;
				z=Math.cos(p+shapes[i].pitch)*d;
				p=Math.atan2(x,z);
				d=Math.sqrt(x*x+z*z);
				x=shapes[i].x+Math.sin(p+shapes[i].yaw)*d;
				z=shapes[i].z+Math.cos(p+shapes[i].yaw)*d;
				tx+=x;
				ty+=y;
				tz+=z;
			}
			tx/=shapes[i].polys[j].verts.length;
			ty/=shapes[i].polys[j].verts.length;
			tz/=shapes[i].polys[j].verts.length;
			shapes[i].polys[j].dist=Math.sqrt((playerX-tx)*(playerX-tx)+(playerY-ty)*(playerY-ty)+(playerZ-tz)*(playerZ-tz));
		}
		shapes[i].polys.sort(sortFunction);
	}
	shapes.sort(sortFunction);
	if(leftButton){
		p1=Math.atan2(playerX,playerZ)+mx/250;
		p2=elevation(playerX,playerZ,playerY)+my/250;
		if(p2<0)p2=0;
		if(p2>pi)p2=pi;
		d=Math.sqrt(playerX*playerX+playerY*playerY+playerZ*playerZ);
		playerX=Math.sin(p1)*Math.sin(p2)*d;
		playerZ=Math.cos(p1)*Math.sin(p2)*d;
		playerY=Math.cos(p2)*d;
		yaw=pi+p1;
		pitch=-pi/2+p2;
	}
	if(rightButton){
		p1=Math.atan2(playerX,playerZ);
		p2=elevation(playerX,playerZ,playerY);
		d=Math.sqrt(playerX*playerX+playerY*playerY+playerZ*playerZ)-my/4;
		if(d<5)d=5;
		playerX=Math.sin(p1)*Math.sin(p2)*d;
		playerZ=Math.cos(p1)*Math.sin(p2)*d;
		playerY=Math.cos(p2)*d;		
	}
	yawV/=1.5;
	pitchV/=1.5;
	mx=0;my=0;
}

function rgb(col){
	
	var r = parseInt((.5+Math.sin(col)*.5)*16);
	var g = parseInt((.5+Math.cos(col)*.5)*16);
	var b = parseInt((.5-Math.sin(col)*.5)*16);
	return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}

function drawShape(shape){
	
	for(j=0;j<shape.polys.length;++j){
		ctx.globalAlpha=.2;
		ctx.fillStyle=rgb(pi*2/shapes.length*shapes[i].id+.000001);
		ctx.beginPath();
		for(k=0;k<shape.polys[j].verts.length;++k){
			x=shape.polys[j].verts[k].x;
			y=shape.polys[j].verts[k].y;
			z=shape.polys[j].verts[k].z;
			p=Math.atan2(x,y);
			d=Math.sqrt(x*x+y*y);
			x=Math.sin(p+shape.roll)*d;
			y=Math.cos(p+shape.roll)*d;
			p=Math.atan2(y,z);
			d=Math.sqrt(y*y+z*z);
			y=shape.y+Math.sin(p+shape.pitch)*d;
			z=Math.cos(p+shape.pitch)*d;
			p=Math.atan2(x,z);
			d=Math.sqrt(x*x+z*z);
			x=shape.x+Math.sin(p+shape.yaw)*d;
			z=shape.z+Math.cos(p+shape.yaw)*d;
			point1=rasterizePoint(x,y,z);
			if(point1.d!=-1){				
				if(!k){
					ctx.moveTo(point1.x,point1.y);
				}else{
					ctx.lineTo(point1.x,point1.y);					
				}
			}
			ctx
		}
		ctx.closePath();
		ctx.fill();
		for(k=0;k<shape.polys[j].verts.length;++k){
			x=shape.polys[j].verts[k].x;
			y=shape.polys[j].verts[k].y;
			z=shape.polys[j].verts[k].z;
			p=Math.atan2(x,y);
			d=Math.sqrt(x*x+y*y);
			x=Math.sin(p+shape.roll)*d;
			y=Math.cos(p+shape.roll)*d;
			p=Math.atan2(y,z);
			d=Math.sqrt(y*y+z*z);
			y=shape.y+Math.sin(p+shape.pitch)*d;
			z=Math.cos(p+shape.pitch)*d;
			p=Math.atan2(x,z);
			d=Math.sqrt(x*x+z*z);
			x=shape.x+Math.sin(p+shape.yaw)*d;
			z=shape.z+Math.cos(p+shape.yaw)*d;
			point1=rasterizePoint(x,y,z);
			if(k==shape.polys[j].verts.length-1){
				x=shape.polys[j].verts[0].x;
				y=shape.polys[j].verts[0].y;
				z=shape.polys[j].verts[0].z;
			}else{
				x=shape.polys[j].verts[k+1].x;
				y=shape.polys[j].verts[k+1].y;
				z=shape.polys[j].verts[k+1].z;
			}
			p=Math.atan2(x,y);
			d=Math.sqrt(x*x+y*y);
			x=Math.sin(p+shape.roll)*d;
			y=Math.cos(p+shape.roll)*d;
			p=Math.atan2(y,z);
			d=Math.sqrt(y*y+z*z);
			y=shape.y+Math.sin(p+shape.pitch)*d;
			z=Math.cos(p+shape.pitch)*d;
			p=Math.atan2(x,z);
			d=Math.sqrt(x*x+z*z);
			x=shape.x+Math.sin(p+shape.yaw)*d;
			z=shape.z+Math.cos(p+shape.yaw)*d;
			point2=rasterizePoint(x,y,z);
			if(point1.d!=-1 && point2.d!=-1){
				ctx.strokeStyle=rgb(pi*2/shapes.length*shapes[i].id+.000001);
				ctx.globalAlpha=.5;
				width1=300/(1+point1.d);
				width2=300/(1+point2.d);
				for(m=0;m<lineSubs;++m){
					ctx.lineWidth=width1+(width2-width1)/lineSubs*m;
					ctx.beginPath();
					x1=point1.x+(point2.x-point1.x)/lineSubs*m;
					y1=point1.y+(point2.y-point1.y)/lineSubs*m;
					x2=point1.x+(point2.x-point1.x)/lineSubs*(m+1);
					y2=point1.y+(point2.y-point1.y)/lineSubs*(m+1);
					ctx.moveTo(x1,y1);
					ctx.lineTo(x2,y2);
					ctx.closePath();
					ctx.stroke();
				}
				ctx.strokeStyle="#fff";
				width1=75/(1+point1.d);
				width2=75/(1+point2.d);
				ctx.globalAlpha=1;
				for(m=0;m<lineSubs;++m){
					ctx.lineWidth=width1+(width2-width1)/lineSubs*m;
					ctx.beginPath();
					x1=point1.x+(point2.x-point1.x)/lineSubs*m;
					y1=point1.y+(point2.y-point1.y)/lineSubs*m;
					x2=point1.x+(point2.x-point1.x)/lineSubs*(m+1);
					y2=point1.y+(point2.y-point1.y)/lineSubs*(m+1);
					ctx.moveTo(x1,y1);
					ctx.lineTo(x2,y2);
					ctx.closePath();
					ctx.stroke();
				}
			}
		}
	}
}

function draw(){
	
	ctx.clearRect(0,0,cx*2,cy*2);
	
	ctx.fillStyle="#662";
	for(i=-100;i<100;i+=3){
		for(j=-100;j<100;j+=3){
			x=i;z=j;y=15;
			point=rasterizePoint(x,y,z);
			if(point.d!=-1){
				size=200/(1+point.d);
				d = Math.sqrt(x * x + z * z);
				a = 0.75 - Math.pow(d / 100, 6) * 0.75;
				if(a>0){
					ctx.globalAlpha = a;
					ctx.fillRect(point.x-size/2,point.y-size/2,size,size);				
				}
			}
		}
	}
	for(i=0;i<shapes.length;++i){
		drawShape(shapes[i]);
	}
}

window.addEventListener("keydown", function(e){

	chr=e.keyCode || e.charCode;
	switch(chr){
		case 37:leftkey=1;break;
		case 38:upkey=1;break;
		case 39:rightkey=1;break;
		case 40:downkey=1;break;
		case 32:spacekey=1;break;
		case 18:altkey=1;break;
		case 87:wkey=1;break;
		case 65:akey=1;break;
		case 83:skey=1;break;
		case 68:dkey=1;break;
		case 16:shiftkey=1;break;
		case 13:enterkey=1;break;
	}
});

window.addEventListener("keyup", function(e){

	chr=e.keyCode || e.charCode;
	switch(chr){
		case 37:leftkey=0;break;
		case 38:upkey=0;break;
		case 39:rightkey=0;break;
		case 40:downkey=0;break;
		case 32:spacekey=0;break;
		case 18:altkey=0;break;
		case 87:wkey=0;break;
		case 65:akey=0;break;
		case 83:skey=0;break;
		case 68:dkey=0;break;
		case 16:shiftkey=0;break;
		case 13:enterkey=0;break;
	}
});

function frame(){

	if(frames>100000){
		seedTimer=0;
		frames=0;
	}
	frames++;
	draw();
	doLogic();
}

function kickoff(){
	
	//$("body").css("background:#000");
	$("#canvas").show();
	draw();
	setInterval(frame,30);
}

initVars();
loadShapes();
$(window).load(function(){
	kickoff();
});