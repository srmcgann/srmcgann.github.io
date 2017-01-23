function initVars(){

	pi=Math.PI;
	phi=1.61803398875;
	canvas=$("#canvas")[0];
	ctx=canvas.getContext("2d");
	canvas.width=1366;
	canvas.height=768;
	cx=canvas.width/2;
	cy=canvas.height/2;
	playerY=0,playerZ=-60,playerX=0;
	pitch=.25,yaw=0,pitchV=yawV=0;
	scale=600;
	scale2=150;
	cursor=new Image();
	cursor.src="cursor3.png";
	showCursor=true;
	leftkey=rightkey=upkey=downkey=spacekey=altkey=wkey=akey=skey=dkey=enterkey=shiftkey=0;
	mx=my=leftButton=rightButton=mouseX=mouseY=0;
	p1=Math.atan2(playerX,playerZ)+mx/50;
	p2=elevation(playerX,playerZ,playerY)+my/50;
	yaw=pi+p1;
	pitch=-pi/2+p2;
	frames=0;
	lineSubs=1;
	activeLineSubs=1;
	cursorOccupied=0;
	canvas.addEventListener("mousemove", mouse, true);
	shapes=new Array();
	activeShape=new Shape(0,0,0,0,0,0,0,25,0);
	sliders=new Array();
	sliders.push(new Slider(cx*2-125,50,1,3,1,"Subdivisions"));
	sliders.push(new Slider(cx*2-125,400,0,10,0,"Convexity"));
}

function Vertex(x,y,z){
	
	this.x=x; this.y=y; this.z=z;
}

function Polygon(){

	this.verts=new Array();
	this.dist=0;
}

function Shape(x,y,z,pitch,yaw,roll,selected,size){
	
	this.polys=new Array();
	this.x=x, this.y=y, this.z=z, this.pitch=pitch, this.yaw=yaw, this.roll=roll;
	this.dist=0;
	this.size=size;
	this.id=shapes.length;
	this.selected=selected;
	this.subdivisions=0;
}

function Slider(x,y,min,max,value,title){
	
	this.x=x, this.y=y, this.min=min, this.max=max, this.value=value, this.title=title;
	this.hover=0;
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

function expandShape(shape,convexity){
	
	if(shape.convexity==convexity)return;
	for(j=0;j<shape.polys.length;++j){
		for(k=0;k<shape.polys[j].verts.length;++k){
			x=shape.polys[j].verts[k].x;
			y=shape.polys[j].verts[k].y;
			z=shape.polys[j].verts[k].z;
			d=Math.sqrt(x*x+y*y+z*z);
			p1=Math.atan2(x,y);
			p2=elevation(x,y,z);
			d2=d+(shape.size-d)*convexity;
			shape.polys[j].verts[k].x=Math.sin(p1)*Math.sin(p2)*d2;
			shape.polys[j].verts[k].y=Math.cos(p1)*Math.sin(p2)*d2;
			shape.polys[j].verts[k].z=Math.cos(p2)*d2;
		}
	}
	shape.convexity=convexity;
}

function pushVert(p1,p2,dist,poly){
	
	x=Math.sin(p1)*Math.sin(p2)*dist;
	z=Math.cos(p1)*Math.sin(p2)*dist;
	y=Math.cos(p2)*dist;
	poly.verts.push(new Vertex(x,y,z));
}

function Tetrahedron(x,y,z,pitch,yaw,roll,selected,size,convexity){
	
	this.polys=new Array();
	this.x=x, this.y=y, this.z=z, this.pitch=pitch, this.yaw=yaw, this.roll=roll,this.convexity=convexity;
	this.dist=0, this.id=0, this.selected=selected, this.subdivisions=0, this.size=size;
	p=new Polygon();
	pushVert(pi*2/3*0,pi,size,p);
	pushVert(pi*2/3*0,pi-pi*(2/3),size,p);
	pushVert(pi*2/3*1,pi-pi*(2/3),size,p);
	this.polys.push(p);
	p=new Polygon();
	pushVert(pi*2/3*1,pi,size,p);
	pushVert(pi*2/3*1,pi-pi*(2/3),size,p);
	pushVert(pi*2/3*2,pi-pi*(2/3),size,p);
	this.polys.push(p);
	p=new Polygon();
	pushVert(pi*2/3*2,pi,size,p);
	pushVert(pi*2/3*2,pi-pi*(2/3),size,p);
	pushVert(pi*2/3*0,pi-pi*(2/3),size,p);
	this.polys.push(p);
	p=new Polygon();
	pushVert(pi*2/3*0,pi-pi*(2/3),size,p);
	pushVert(pi*2/3*1,pi-pi*(2/3),size,p);
	pushVert(pi*2/3*2,pi-pi*(2/3),size,p);
	this.polys.push(p);
}

function Cube(x,y,z,pitch,yaw,roll,selected,size,convexity){
	
	this.polys=new Array();
	this.x=x, this.y=y, this.z=z, this.pitch=pitch, this.yaw=yaw, this.roll=roll,this.convexity=convexity;
	this.dist=0, this.id=1, this.selected=selected, this.subdivisions=0, this.size=size;
	s=size/1.7;
	p=new Polygon();
	p.verts.push(new Vertex(-s,-s,-s));
	p.verts.push(new Vertex(s,-s,-s));
	p.verts.push(new Vertex(s,s,-s));
	p.verts.push(new Vertex(-s,s,-s));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(-s,-s,s));
	p.verts.push(new Vertex(s,-s,s));
	p.verts.push(new Vertex(s,s,s));
	p.verts.push(new Vertex(-s,s,s));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(-s,-s,-s));
	p.verts.push(new Vertex(-s,s,-s));
	p.verts.push(new Vertex(-s,s,s));
	p.verts.push(new Vertex(-s,-s,s));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(-s,s,-s));
	p.verts.push(new Vertex(-s,s,s));
	p.verts.push(new Vertex(s,s,s));
	p.verts.push(new Vertex(s,s,-s));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(-s,-s,-s));
	p.verts.push(new Vertex(-s,-s,s));
	p.verts.push(new Vertex(s,-s,s));
	p.verts.push(new Vertex(s,-s,-s));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(s,-s,-s));
	p.verts.push(new Vertex(s,s,-s));
	p.verts.push(new Vertex(s,s,s));
	p.verts.push(new Vertex(s,-s,s));
	this.polys.push(p);
}

function Octahedron(x,y,z,pitch,yaw,roll,selected,size,convexity){
	
	this.polys=new Array();
	this.x=x, this.y=y, this.z=z, this.pitch=pitch, this.yaw=yaw, this.roll=roll,this.convexity=convexity;
	this.dist=0, this.id=2, this.selected=selected, this.subdivisions=0, this.size=size;
	p=new Polygon();
	pushVert(pi*2/4*0,pi,size,p);
	pushVert(pi*2/4*0,pi-pi/2,size,p);
	pushVert(pi*2/4*1,pi-pi/2,size,p);
	this.polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*1,pi,size,p);
	pushVert(pi*2/4*1,pi-pi/2,size,p);
	pushVert(pi*2/4*2,pi-pi/2,size,p);
	this.polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*2,pi,size,p);
	pushVert(pi*2/4*2,pi-pi/2,size,p);
	pushVert(pi*2/4*3,pi-pi/2,size,p);
	this.polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*3,pi,size,p);
	pushVert(pi*2/4*3,pi-pi/2,size,p);
	pushVert(pi*2/4*0,pi-pi/2,size,p);
	this.polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*0,0,size,p);
	pushVert(pi*2/4*0,pi/2,size,p);
	pushVert(pi*2/4*1,pi/2,size,p);
	this.polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*1,0,size,p);
	pushVert(pi*2/4*1,pi/2,size,p);
	pushVert(pi*2/4*2,pi/2,size,p);
	this.polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*2,0,size,p);
	pushVert(pi*2/4*2,pi/2,size,p);
	pushVert(pi*2/4*3,pi/2,size,p);
	this.polys.push(p);
	p=new Polygon();
	pushVert(pi*2/4*3,0,size,p);
	pushVert(pi*2/4*3,pi/2,size,p);
	pushVert(pi*2/4*0,pi/2,size,p);
	this.polys.push(p);
}

function Dodecahedron(x,y,z,pitch,yaw,roll,selected,size,convexity){
	
	this.polys=new Array();
	this.x=x, this.y=y, this.z=z, this.pitch=pitch, this.yaw=yaw, this.roll=roll,this.convexity=convexity;
	this.dist=0, this.id=3, this.selected=selected, this.subdivisions=0, this.size=size;
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
	this.polys.push(polygon);
	polygon=new Polygon();
	for(i=0;i<5;++i){
		p=pi*2/5*i+pi/5;
		x=Math.sin(p)*1;
		y=Math.cos(p)*1;
		z=-a;
		polygon.verts.push(new Vertex(x,y,z));
		this.polys[0].verts[i].z=a;
	}
	this.polys.push(polygon);
	for(k=0;k<5;++k){		
		this.polys.push(JSON.parse(JSON.stringify(this.polys[0])));
		this.polys.push(JSON.parse(JSON.stringify(this.polys[1])));
		for(i=this.polys.length-2;i<this.polys.length;++i){
			for(j=0;j<5;++j){
				p=Math.atan2(this.polys[i].verts[j].x,this.polys[i].verts[j].y)-pi/5;
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
		for(i=0;i<this.polys.length;++i){
			for(j=0;j<5;++j){
				p=Math.atan2(this.polys[i].verts[j].x,this.polys[i].verts[j].y)-pi*2/5;
				d=Math.sqrt(this.polys[i].verts[j].x*this.polys[i].verts[j].x+
							this.polys[i].verts[j].y*this.polys[i].verts[j].y);
				this.polys[i].verts[j].x=Math.sin(p)*d;
				this.polys[i].verts[j].y=Math.cos(p)*d;
			}
		}
	}
	resizeShape(this,size*phi);
}


function Icosahedron(x,y,z,pitch,yaw,roll,selected,size,convexity){
	
	this.polys=new Array();
	this.x=x, this.y=y, this.z=z, this.pitch=pitch, this.yaw=yaw, this.roll=roll,this.convexity=convexity;
	this.dist=0, this.id=4, this.selected=selected, this.subdivisions=0, this.size=size;
	x1=-phi, y1=-1, z1=0, x2=phi, y2=-1, z2=0, x3=phi, y3=1, z3=0, x4=-phi, y4=1, z4=0,
	y5=-phi, z5=-1, x5=0, y6=phi, z6=-1, x6=0, y7=phi, z7=1, x7=0, y8=-phi, z8=1, x8=0,
	z9=-phi, x9=-1, y9=0, z10=phi, x10=-1, y10=0, z11=phi, x11=1, y11=0, z12=-phi, x12=1, y12=0;
	p=new Polygon();
	p.verts.push(new Vertex(x1,y1,z1));
	p.verts.push(new Vertex(x5,y5,z5));
	p.verts.push(new Vertex(x8,y8,z8));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x2,y2,z2));
	p.verts.push(new Vertex(x5,y5,z5));
	p.verts.push(new Vertex(x8,y8,z8));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x3,y3,z3));
	p.verts.push(new Vertex(x6,y6,z6));
	p.verts.push(new Vertex(x7,y7,z7));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x4,y4,z4));
	p.verts.push(new Vertex(x6,y6,z6));
	p.verts.push(new Vertex(x7,y7,z7));
	this.polys.push(p);	
	p=new Polygon();
	p.verts.push(new Vertex(x9,y9,z9));
	p.verts.push(new Vertex(x12,y12,z12));
	p.verts.push(new Vertex(x5,y5,z5));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x9,y9,z9));
	p.verts.push(new Vertex(x12,y12,z12));
	p.verts.push(new Vertex(x6,y6,z6));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x10,y10,z10));
	p.verts.push(new Vertex(x11,y11,z11));
	p.verts.push(new Vertex(x7,y7,z7));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x10,y10,z10));
	p.verts.push(new Vertex(x11,y11,z11));
	p.verts.push(new Vertex(x8,y8,z8));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x1,y1,z1));
	p.verts.push(new Vertex(x9,y9,z9));
	p.verts.push(new Vertex(x4,y4,z4));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x1,y1,z1));
	p.verts.push(new Vertex(x10,y10,z10));
	p.verts.push(new Vertex(x4,y4,z4));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x2,y2,z2));
	p.verts.push(new Vertex(x11,y11,z11));
	p.verts.push(new Vertex(x3,y3,z3));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x2,y2,z2));
	p.verts.push(new Vertex(x12,y12,z12));
	p.verts.push(new Vertex(x3,y3,z3));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x2,y2,z2));
	p.verts.push(new Vertex(x11,y11,z11));
	p.verts.push(new Vertex(x8,y8,z8));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x2,y2,z2));
	p.verts.push(new Vertex(x12,y12,z12));
	p.verts.push(new Vertex(x5,y5,z5));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x1,y1,z1));
	p.verts.push(new Vertex(x10,y10,z10));
	p.verts.push(new Vertex(x8,y8,z8));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x1,y1,z1));
	p.verts.push(new Vertex(x9,y9,z9));
	p.verts.push(new Vertex(x5,y5,z5));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x4,y4,z4));
	p.verts.push(new Vertex(x9,y9,z9));
	p.verts.push(new Vertex(x6,y6,z6));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x3,y3,z3));
	p.verts.push(new Vertex(x12,y12,z12));
	p.verts.push(new Vertex(x6,y6,z6));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x4,y4,z4));
	p.verts.push(new Vertex(x10,y10,z10));
	p.verts.push(new Vertex(x7,y7,z7));
	this.polys.push(p);
	p=new Polygon();
	p.verts.push(new Vertex(x3,y3,z3));
	p.verts.push(new Vertex(x11,y11,z11));
	p.verts.push(new Vertex(x7,y7,z7));
	this.polys.push(p);
	resizeShape(this,size*phi*1.2);
}

function setActiveShape(shapeNo){

	size=25;
	switch(shapeNo){
		case 0: activeShape=new Tetrahedron(0,0,0,0,0,0,0,size,0); break;
		case 1: activeShape=new Cube(0,0,0,0,0,0,0,size,0); break;
		case 2: activeShape=new Octahedron(0,0,0,0,0,0,0,size,0); break;
		case 3: activeShape=new Dodecahedron(0,0,0,0,0,0,0,size,0); break;
		case 4: activeShape=new Icosahedron(0,0,0,0,0,0,0,size,0); break;
	}
    for(i=0;i<shapes.length;++i)shapes[i].selected=0;
    shapes[shapeNo].selected=1; 
}

function loadShapes(){
	
	size=6;

	shapes.push(new Tetrahedron(0,0,0,0,0,0,1,size,0));
	shapes.push(new Cube(0,0,0,0,0,0,0,size,0));
	shapes.push(new Octahedron(0,0,0,0,0,0,0,size,0));
	shapes.push(new Dodecahedron(0,0,0,0,0,0,0,size,0));
	shapes.push(new Icosahedron(0,0,0,0,0,0,0,size,0));

	setActiveShape(1);
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
		
	var rect = canvas.getBoundingClientRect();
	mouseX = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
	mouseY = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);
    draw();
    doLogic();
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
		case 1: leftButton=false; cursorOccupied=0; break;
		case 3: rightButton=false; break;
	}
	for(m=0;m<sliders.length;++m)sliders[m].value=Math.round(sliders[m].value);
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

function rasterizePoint2(x,y,z){

	var p,d;
	z+=22;
	var rx1=-1000,ry1=1,rx2=1000,ry2=1,rx3=0,ry3=0,rx4=x,ry4=z,uc=(ry4-ry3)*(rx2-rx1)-(rx4-rx3)*(ry2-ry1);
	if(!uc) return {x:0,y:0,d:-1};
	var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
	var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
	if(!z)z=.000000001;
	if(ua>0&&ua<1&&ub>0&&ub<1){
		return {
			x:(rx1+ua*(rx2-rx1))*scale2,
			y:y/z*scale2,
			d:Math.sqrt(x*x+y*y+z*z)
		};
	}else{
		return {
			x:(rx1+ua*(rx2-rx1))*scale2,
			y:y/z*scale2,
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

function subdivide(shape,degree,convexity){

	if(shape.subdivisions==degree && shape.convexity==convexity) return;
	size=25;
	switch(shape.id){
		case 0:
			shape=new Tetrahedron(shape.x,shape.y,shape.z,shape.pitch,shape.yaw,shape.roll,0,size,0);
			for(j=0;j<degree;++j){
				newShape=new Shape(shape.x,shape.y,shape.z,shape.pitch,shape.yaw,shape.roll,0,size,0);
				for(k=0;k<shape.polys.length;++k){
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
					p.verts.push(new Vertex(shape.polys[k].verts[0].x,shape.polys[k].verts[0].y,shape.polys[k].verts[0].z));
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(x3,y3,z3));
					newShape.polys.push(p);
					p=new Polygon();
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(shape.polys[k].verts[1].x,shape.polys[k].verts[1].y,shape.polys[k].verts[1].z));
					p.verts.push(new Vertex(x2,y2,z2));
					newShape.polys.push(p);
					p=new Polygon();
					p.verts.push(new Vertex(x3,y3,z3));
					p.verts.push(new Vertex(x2,y2,z2));
					p.verts.push(new Vertex(shape.polys[k].verts[2].x,shape.polys[k].verts[2].y,shape.polys[k].verts[2].z));
					newShape.polys.push(p);					
					p=new Polygon();
					p.verts.push(new Vertex(x3,y3,z3));
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(x2,y2,z2));
					newShape.polys.push(p);					
				}
				shape=newShape;
				shape.id=0;
			}
		break;
		case 1:
			shape=new Cube(shape.x,shape.y,shape.z,shape.pitch,shape.yaw,shape.roll,0,size,0);
			for(j=0;j<degree;++j){
				newShape=new Shape(shape.x,shape.y,shape.z,shape.pitch,shape.yaw,shape.roll,0,size,0);
				for(k=0;k<shape.polys.length;++k){
					x1=(shape.polys[k].verts[1].x+shape.polys[k].verts[0].x)/2;
					y1=(shape.polys[k].verts[1].y+shape.polys[k].verts[0].y)/2;
					z1=(shape.polys[k].verts[1].z+shape.polys[k].verts[0].z)/2;
					x2=(shape.polys[k].verts[2].x+shape.polys[k].verts[1].x)/2;
					y2=(shape.polys[k].verts[2].y+shape.polys[k].verts[1].y)/2;
					z2=(shape.polys[k].verts[2].z+shape.polys[k].verts[1].z)/2;
					x3=(shape.polys[k].verts[3].x+shape.polys[k].verts[2].x)/2;
					y3=(shape.polys[k].verts[3].y+shape.polys[k].verts[2].y)/2;
					z3=(shape.polys[k].verts[3].z+shape.polys[k].verts[2].z)/2;
					x4=(shape.polys[k].verts[0].x+shape.polys[k].verts[3].x)/2;
					y4=(shape.polys[k].verts[0].y+shape.polys[k].verts[3].y)/2;
					z4=(shape.polys[k].verts[0].z+shape.polys[k].verts[3].z)/2;
					x5=(shape.polys[k].verts[0].x+shape.polys[k].verts[2].x)/2;
					y5=(shape.polys[k].verts[0].y+shape.polys[k].verts[2].y)/2;
					z5=(shape.polys[k].verts[0].z+shape.polys[k].verts[2].z)/2;
					p=new Polygon();
					p.verts.push(new Vertex(shape.polys[k].verts[0].x,shape.polys[k].verts[0].y,shape.polys[k].verts[0].z));
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(x5,y5,z5));
					p.verts.push(new Vertex(x4,y4,z4));
					newShape.polys.push(p);
					p=new Polygon();
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(shape.polys[k].verts[1].x,shape.polys[k].verts[1].y,shape.polys[k].verts[1].z));
					p.verts.push(new Vertex(x2,y2,z2));
					p.verts.push(new Vertex(x5,y5,z5));
					newShape.polys.push(p);
					p=new Polygon();
					p.verts.push(new Vertex(x5,y5,z5));
					p.verts.push(new Vertex(x2,y2,z2));
					p.verts.push(new Vertex(shape.polys[k].verts[2].x,shape.polys[k].verts[2].y,shape.polys[k].verts[2].z));
					p.verts.push(new Vertex(x3,y3,z3));
					newShape.polys.push(p);
					p=new Polygon();
					p.verts.push(new Vertex(x4,y4,z4));
					p.verts.push(new Vertex(x5,y5,z5));
					p.verts.push(new Vertex(x3,y3,z3));
					p.verts.push(new Vertex(shape.polys[k].verts[3].x,shape.polys[k].verts[3].y,shape.polys[k].verts[3].z));
					newShape.polys.push(p);					
				}
				shape=newShape;
				shape.id=1;
			}
		break;
		case 2:
			shape=new Octahedron(shape.x,shape.y,shape.z,shape.pitch,shape.yaw,shape.roll,0,size,0);
			for(j=0;j<degree;++j){
				newShape=new Shape(shape.x,shape.y,shape.z,shape.pitch,shape.yaw,shape.roll,0,size,0);
				for(k=0;k<shape.polys.length;++k){
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
					p.verts.push(new Vertex(shape.polys[k].verts[0].x,shape.polys[k].verts[0].y,shape.polys[k].verts[0].z));
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(x3,y3,z3));
					newShape.polys.push(p);
					p=new Polygon();
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(shape.polys[k].verts[1].x,shape.polys[k].verts[1].y,shape.polys[k].verts[1].z));
					p.verts.push(new Vertex(x2,y2,z2));
					newShape.polys.push(p);
					p=new Polygon();
					p.verts.push(new Vertex(x3,y3,z3));
					p.verts.push(new Vertex(x2,y2,z2));
					p.verts.push(new Vertex(shape.polys[k].verts[2].x,shape.polys[k].verts[2].y,shape.polys[k].verts[2].z));
					newShape.polys.push(p);					
					p=new Polygon();
					p.verts.push(new Vertex(x3,y3,z3));
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(x2,y2,z2));
					newShape.polys.push(p);					
				}
				shape=newShape;
				shape.id=2;
			}
		break;
		case 3:
			shape=new Dodecahedron(shape.x,shape.y,shape.z,shape.pitch,shape.yaw,shape.roll,0,size,0);
			for(j=0;j<degree;++j){
				newShape=new Shape(shape.x,shape.y,shape.z,shape.pitch,shape.yaw,shape.roll,0,size,0);
				for(k=0;k<shape.polys.length;++k){
					if(j){
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
						p.verts.push(new Vertex(shape.polys[k].verts[0].x,shape.polys[k].verts[0].y,shape.polys[k].verts[0].z));
						p.verts.push(new Vertex(x1,y1,z1));
						p.verts.push(new Vertex(x3,y3,z3));
						newShape.polys.push(p);
						p=new Polygon();
						p.verts.push(new Vertex(x1,y1,z1));
						p.verts.push(new Vertex(shape.polys[k].verts[1].x,shape.polys[k].verts[1].y,shape.polys[k].verts[1].z));
						p.verts.push(new Vertex(x2,y2,z2));
						newShape.polys.push(p);
						p=new Polygon();
						p.verts.push(new Vertex(x3,y3,z3));
						p.verts.push(new Vertex(x2,y2,z2));
						p.verts.push(new Vertex(shape.polys[k].verts[2].x,shape.polys[k].verts[2].y,shape.polys[k].verts[2].z));
						newShape.polys.push(p);					
						p=new Polygon();
						p.verts.push(new Vertex(x3,y3,z3));
						p.verts.push(new Vertex(x1,y1,z1));
						p.verts.push(new Vertex(x2,y2,z2));
						newShape.polys.push(p);						
					}else{
						x=y=z=0;
						for(m=0;m<shape.polys[k].verts.length;++m){
							x+=shape.polys[k].verts[m].x;
							y+=shape.polys[k].verts[m].y;
							z+=shape.polys[k].verts[m].z;
						}
						x/=5;
						y/=5;
						z/=5;
						for(m=0;m<5;++m){
							p=new Polygon();
							p.verts.push(new Vertex(shape.polys[k].verts[m].x,shape.polys[k].verts[m].y,shape.polys[k].verts[m].z));
							p.verts.push(new Vertex(shape.polys[k].verts[(m+1)%5].x,shape.polys[k].verts[(m+1)%5].y,shape.polys[k].verts[(m+1)%5].z));
							p.verts.push(new Vertex(x,y,z));
							newShape.polys.push(p);
						}
					}
				}
				shape=newShape;
				shape.id=3;
			}
		break;
		case 4:
			shape=new Icosahedron(shape.x,shape.y,shape.z,shape.pitch,shape.yaw,shape.roll,0,size,0);
			for(j=0;j<degree;++j){
				newShape=new Shape(shape.x,shape.y,shape.z,shape.pitch,shape.yaw,shape.roll,0,size,0);
				for(k=0;k<shape.polys.length;++k){
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
					p.verts.push(new Vertex(shape.polys[k].verts[0].x,shape.polys[k].verts[0].y,shape.polys[k].verts[0].z));
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(x3,y3,z3));
					newShape.polys.push(p);
					p=new Polygon();
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(shape.polys[k].verts[1].x,shape.polys[k].verts[1].y,shape.polys[k].verts[1].z));
					p.verts.push(new Vertex(x2,y2,z2));
					newShape.polys.push(p);
					p=new Polygon();
					p.verts.push(new Vertex(x3,y3,z3));
					p.verts.push(new Vertex(x2,y2,z2));
					p.verts.push(new Vertex(shape.polys[k].verts[2].x,shape.polys[k].verts[2].y,shape.polys[k].verts[2].z));
					newShape.polys.push(p);					
					p=new Polygon();
					p.verts.push(new Vertex(x3,y3,z3));
					p.verts.push(new Vertex(x1,y1,z1));
					p.verts.push(new Vertex(x2,y2,z2));
					newShape.polys.push(p);					
				}
				shape=newShape;
				shape.id=4;
			}
		break;
	}
	activeShape=shape;
	activeShape.subdivisions=degree;
	
	expandShape(activeShape,convexity);
	
}

function doLogic(){
	
	subdivide(activeShape,Math.round(sliders[0].value)-1,sliders[1].value/sliders[1].max);

	activeShape.yaw+=.004;
	
	for(i=0;i<shapes.length;++i){
		shapes[i].roll+=.02;
		shapes[i].yaw+=.02;
		shapes[i].dist=Math.sqrt((shapes[i].x)*(shapes[i].x)+
								 (shapes[i].y)*(shapes[i].y)+
								 (-50-shapes[i].z)*(-50-shapes[i].z));
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
			shapes[i].polys[j].dist=Math.sqrt((tx)*(tx)+(ty)*(ty)+(-50-tz)*(-50-tz));
		}
		shapes[i].polys.sort(sortFunction);
	}
	shapes.sort(sortFunction);
	for(j=0;j<activeShape.polys.length;++j){
		tx=ty=tz=0;
		for(k=0;k<activeShape.polys[j].verts.length;++k){
			x=activeShape.polys[j].verts[k].x;
			y=activeShape.polys[j].verts[k].y;
			z=activeShape.polys[j].verts[k].z;
			p=Math.atan2(x,y);
			d=Math.sqrt(x*x+y*y);
			x=Math.sin(p+activeShape.roll)*d;
			y=Math.cos(p+activeShape.roll)*d;
			p=Math.atan2(y,z);
			d=Math.sqrt(y*y+z*z);
			y=activeShape.y+Math.sin(p+activeShape.pitch)*d;
			z=Math.cos(p+activeShape.pitch)*d;
			p=Math.atan2(x,z);
			d=Math.sqrt(x*x+z*z);
			x=activeShape.x+Math.sin(p+activeShape.yaw)*d;
			z=activeShape.z+Math.cos(p+activeShape.yaw)*d;
			tx+=x;
			ty+=y;
			tz+=z;
		}
		tx/=activeShape.polys[j].verts.length;
		ty/=activeShape.polys[j].verts.length;
		tz/=activeShape.polys[j].verts.length;
		activeShape.polys[j].dist=Math.sqrt((playerX-tx)*(playerX-tx)+(playerY-ty)*(playerY-ty)+(playerZ-tz)*(playerZ-tz));
	}
	activeShape.polys.sort(sortFunction);
	
	for(i=0;i<sliders.length;++i){
		if(mouseX>sliders[i].x&&mouseX<sliders[i].x+100&&mouseY>sliders[i].y&&mouseY<sliders[i].y+300){
			x=sliders[i].x+30;
			y=sliders[i].y+35+225/(sliders[i].max-sliders[i].min)*(sliders[i].value-sliders[i].min);
			if(mouseX>x&&mouseX<x+50&&mouseY>y&&mouseY<y+20){
			}
				sliders[i].hover=1;
		}else{
			sliders[i].hover=0;
		}
	}
	if(leftButton){
		if(!cursorOccupied || cursorOccupied==1){
			for(i=0;i<sliders.length;++i){
				if(sliders[i].hover==1){
					x=sliders[i].x+30;
					y=sliders[i].y+35+225/(sliders[i].max-sliders[i].min)*(sliders[i].value-sliders[i].min);
					y2=sliders[i].y+35+225;
					sliders[i].value=(mouseY-(sliders[i].y-65+65*i))/(225)*(sliders[i].max-sliders[i].min);
					if(sliders[i].value<sliders[i].min) sliders[i].value=sliders[i].min;
					if(sliders[i].value>sliders[i].max) sliders[i].value=sliders[i].max;
					cursorOccupied=1;
				}
			}
		}
		if(!cursorOccupied || cursorOccupied==2){
			cursorOccupied=2;
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

function drawShapeMenu(){
	
	ctx.font="32px Square721";
	ctx.fillStyle="#fff";
	ctx.globalAlpha=1;
	ctx.fillText("Select",18,40);
	ctx.fillText("a",60,75);
	ctx.fillText("Shape",22,110);
	for(i=0;i<shapes.length;++i){
		ox=70, oy=cy*2/6+cy*2/6*i+55;
		ctx.globalAlpha=.75;
		if(shapes[i].selected){
			ctx.strokeStyle=rgb(pi*2/shapes.length*shapes[i].id+.000001);
			ctx.fillStyle=rgb(pi*2/shapes.length*shapes[i].id+.000001);
		}else{
			if(!cursorOccupied&&mouseX>ox-50&&mouseX<ox+50&&mouseY>oy-50&&mouseY<oy+50){
				if(leftButton){
					for(j=0;j<shapes.length;++j) shapes[j].selected=j==i?1:0;
					setActiveShape(i);
					beep=new Audio("beep.mp3");
					beep.volume=1;
					beep.play();
					leftButton=0;
				}
				ctx.strokeStyle="#fff";
				ctx.fillStyle="#fff";
			}else{
				ctx.strokeStyle="#666";
				ctx.fillStyle="#666";				
			}
		}
		ctx.lineWidth=5;
		ctx.globalAlpha=.25;
		ctx.fillRect(ox-50,oy-50,100,100);
		ctx.globalAlpha=.75;
		ctx.strokeRect(ox-50,oy-50,100,100);
		for(j=0;j<shapes[i].polys.length;++j){
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
				point1=rasterizePoint2(x,y,z);
				if(k==shapes[i].polys[j].verts.length-1){
					x=shapes[i].polys[j].verts[0].x;
					y=shapes[i].polys[j].verts[0].y;
					z=shapes[i].polys[j].verts[0].z;
				}else{
					x=shapes[i].polys[j].verts[k+1].x;
					y=shapes[i].polys[j].verts[k+1].y;
					z=shapes[i].polys[j].verts[k+1].z;
				}
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
				point2=rasterizePoint2(x,y,z);
				if(point1.d!=-1 && point2.d!=-1){
					if(shapes[i].selected){
						ctx.strokeStyle=rgb(pi*2/shapes.length*shapes[i].id+.000001);
					}else{
						ctx.strokeStyle="#888";
					}
					ctx.globalAlpha=.5;
					width1=100/(1+point1.d);
					width2=100/(1+point2.d);
					for(m=0;m<lineSubs;++m){
						ctx.lineWidth=width1+(width2-width1)/lineSubs*m;
						ctx.beginPath();
						x1=point1.x+(point2.x-point1.x)/lineSubs*m;
						y1=point1.y+(point2.y-point1.y)/lineSubs*m;
						x2=point1.x+(point2.x-point1.x)/lineSubs*(m+1);
						y2=point1.y+(point2.y-point1.y)/lineSubs*(m+1);
						ctx.moveTo(ox+x1,oy+y1);
						ctx.lineTo(ox+x2,oy+y2);
						ctx.closePath();
						ctx.stroke();
					}
					ctx.strokeStyle="#fff";
					width1=15/(1+point1.d);
					width2=15/(1+point2.d);
					ctx.globalAlpha=1;
					for(m=0;m<lineSubs;++m){
						ctx.lineWidth=width1+(width2-width1)/lineSubs*m;
						ctx.beginPath();
						x1=point1.x+(point2.x-point1.x)/lineSubs*m;
						y1=point1.y+(point2.y-point1.y)/lineSubs*m;
						x2=point1.x+(point2.x-point1.x)/lineSubs*(m+1);
						y2=point1.y+(point2.y-point1.y)/lineSubs*(m+1);
						ctx.moveTo(ox+x1,oy+y1);
						ctx.lineTo(ox+x2,oy+y2);
						ctx.closePath();
						ctx.stroke();
					}
				}
			}
		}
	}
}


function addEvent(obj, evt, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evt, fn, false);
    }
    else if (obj.attachEvent) {
        obj.attachEvent("on" + evt, fn);
    }
}

addEvent(document, "mouseout", function(e) {
    e = e ? e : window.event;
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName == "HTML") {
        showCursor=false;
    }
});


function drawShape(shape){

	for(j=0;j<shape.polys.length;++j){
		if(shape.subdivisions<4){
			ctx.globalAlpha=.125;
			ctx.fillStyle=rgb(pi*2/shapes.length*shape.id+.000001);
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
		}
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
				if(shape.subdivisions<4){
					ctx.strokeStyle=rgb(pi*2/shapes.length*shape.id+.000001);
					ctx.globalAlpha=.5;
					width1=300/(1+point1.d);
					width2=300/(1+point2.d);
					for(m=0;m<activeLineSubs;++m){
						ctx.lineWidth=width1+(width2-width1)/activeLineSubs*m;
						ctx.beginPath();
						x1=point1.x+(point2.x-point1.x)/activeLineSubs*m;
						y1=point1.y+(point2.y-point1.y)/activeLineSubs*m;
						x2=point1.x+(point2.x-point1.x)/activeLineSubs*(m+1);
						y2=point1.y+(point2.y-point1.y)/activeLineSubs*(m+1);
						ctx.moveTo(x1,y1);
						ctx.lineTo(x2,y2);
						ctx.closePath();
						ctx.stroke();
					}
				}
				ctx.strokeStyle="#fff";
				width1=100/(1+point1.d);
				width2=100/(1+point2.d);
				ctx.globalAlpha=1;
				for(m=0;m<activeLineSubs;++m){
					ctx.lineWidth=width1+(width2-width1)/activeLineSubs*m;
					ctx.beginPath();
					x1=point1.x+(point2.x-point1.x)/activeLineSubs*m;
					y1=point1.y+(point2.y-point1.y)/activeLineSubs*m;
					x2=point1.x+(point2.x-point1.x)/activeLineSubs*(m+1);
					y2=point1.y+(point2.y-point1.y)/activeLineSubs*(m+1);
					ctx.moveTo(x1,y1);
					ctx.lineTo(x2,y2);
					ctx.closePath();
					ctx.stroke();
				}
			}
		}
	}
}

function drawSlider(slider){
	
	ctx.strokeStyle="#8ff";
	ctx.globalAlpha=.75;
	ctx.fillStyle="#242";
	ctx.fillRect(slider.x,slider.y,100,300);
	ctx.globalAlpha=1;
	ctx.lineWidth=2;
	ctx.strokeRect(slider.x,slider.y,100,300);
	ctx.font="16px Square721";
	ctx.fillStyle="#fff";
	ctx.fillText(slider.title,slider.x+2,slider.y+16);
	t=0
	ctx.textAlign="end";
	for(k=slider.min;k<=slider.max;++k){
		ctx.fillText(k,slider.x+25,slider.y+50+225/(slider.max-slider.min)*t);
		ctx.strokeStyle="#fff";
		ctx.beginPath();
		ctx.moveTo(slider.x+25,slider.y+45+225/(slider.max-slider.min)*t);
		ctx.lineTo(slider.x+85,slider.y+45+225/(slider.max-slider.min)*t);
		ctx.stroke();
		t++;
	}
	ctx.beginPath();
	ctx.moveTo(slider.x+55,slider.y+25);
	ctx.lineTo(slider.x+55,slider.y+290);
	ctx.stroke();
	ctx.textAlign="start";

	ctx.lineWidth=2;
	ctx.fillStyle="#0f8";
	ctx.fillRect(slider.x+30,slider.y+35+225/(slider.max-slider.min)*(slider.value-slider.min),50,20);
	ctx.strokeStyle=slider.hover?"#fff":"#000";
	ctx.strokeRect(slider.x+30,slider.y+35+225/(slider.max-slider.min)*(slider.value-slider.min),50,20);
}

function draw(){
	
	ctx.clearRect(0,0,cx*2,cy*2);
	
	ctx.globalAlpha=1;
	ctx.fillStyle="#20f";
	for(i=-200;i<200;i+=5){
		for(j=-200;j<200;j+=5){
			x=i;z=j;y=25;
			point=rasterizePoint(x,y,z);
			if(point.d!=-1){
				size=500/(1+point.d);
				d=Math.sqrt(x*x+z*z);
				a=.5-Math.pow(d/200,10)/2;
				ctx.globalAlpha=a<0?0:a;
				ctx.fillRect(point.x-size/2,point.y-size/2,size,size);				
			}
		}
	}
	drawShape(activeShape);
	drawShapeMenu();

	for(i=0;i<sliders.length;++i){
		drawSlider(sliders[i]);
	}

	if ($('#canvas:hover').length != 0) {
		showCursor=true ;
	}
	if(showCursor){
		ctx.globalAlpha=1;
		ctx.drawImage(cursor,mouseX-cursor.width/13,mouseY-cursor.width/30,cursor.width/4,cursor.height/4);		
	}
	
	/*
	ctx.globalAlpha=1;
	ctx.lineWidth=1;
	ctx.beginPath();
	ctx.moveTo(mouseX,mouseY+25);
	ctx.lineTo(mouseX,mouseY-25);
	ctx.moveTo(mouseX-25,mouseY);
	ctx.lineTo(mouseX+25,mouseY);
	ctx.stroke();
	*/
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