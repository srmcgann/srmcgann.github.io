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


    function Vert(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }


	function elevation(x,y,z){

		var dist = Math.sqrt(x*x+y*y+z*z);
		if(dist && z/dist>=-1 && z/dist <=1) return Math.acos(z / dist);
		return 0.00000001;
	}


    function rgb(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*256);
        var g = parseInt((0.5+Math.cos(col)*0.5)*256);
        var b = parseInt((0.5-Math.sin(col)*0.5)*256);
		return "#"+("0" + r.toString(16) ).slice (-2)+("0" + g.toString(16) ).slice (-2)+("0" + b.toString(16) ).slice (-2);
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
	
	
	function segVert(x,y,z){
		this.x=x;
		this.y=y;
		this.z=z;
	}
	
	function Seg(x1,y1,z1,x2,y2,z2,color,alpha,weight){
		this.a=new segVert(x1,y1,z1);
		this.b=new segVert(x2,y2,z2);
		this.color=color;
		this.alpha=alpha;
		this.weight=weight;
	}
	
	function intersects(x1,y2,x2,y2){
		
		var ua,ub,uc,x,y;
		uc=(y4-y3)*(x2-x1)-(x4-x3)*(y2-y1);
		ua=((x4-x3)*(y1-y3)-(y4-y3)*(x1-x3))/uc;
		ub=((x2-x1)*(y1-y3)-(y2-y1)*(x1-x3))/uc;
		x=x1+ua*(x2-x1);
		y=y1+ua*(y2-y1);
		return {intersects:(ua>=0&&ua<=1&&ub>=0&&ub<=1),x:x,y:y};
	}
	
	function plot(point1,point2,point3,steps,vars){
		for(j=0;j<steps+1;++j){
			x1=point1.x+(point2.x-point1.x)/steps*j;
			y1=point1.y+(point2.y-point1.y)/steps*j;
			z1=point1.z+(point2.z-point1.z)/steps*j;
			x2=point2.x+(point3.x-point2.x)/steps*j;
			y2=point2.y+(point3.y-point2.y)/steps*j;
			z2=point2.z+(point3.z-point2.z)/steps*j;
			//vars.segs1.push(new Seg(x1,y1,z1,x2,y2,z2,Math.PI+1,1,1));
			x3=x1+(x2-x1)/steps*j;
			y3=y1+(y2-y1)/steps*j;
			z3=z1+(z2-z1)/steps*j;
			if(j){
				vars.segs2.push(new Seg(x4,y4,z4,x3,y3,z3,0,1,5));
			}
			x4=x3;
			y4=y3;
			z4=z3;
		}
	}
	
    function process(vars){
				
		vars.segs1=[];
		vars.segs2=[];
		var x,y,z,d,d1,d2,d3,steps=30;
		var point1={},point2={},point3={},point4={},point5={},point6={};
		
		p = Math.atan2(vars.camX, vars.camZ);
		d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
		d -= Math.sin(vars.frameNo / 80) / 20;
		t = Math.sin(vars.frameNo / 280) / 125;
		vars.camX = Math.sin(p + t) * d;
		vars.camZ = Math.cos(p + t) * d;
		vars.camY = -Math.sin(vars.frameNo / 120) *12;
		vars.yaw = Math.PI + p + t;
		vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;		
		
		if(!vars.leftButton){
			var vert=reverseRasterize(1000,vars);
			vars.selected=-1;
			minu=2;
			for(var i=0;i<vars.points.length;++i){
				x1=vars.camX;
				y1=vars.camY;
				z1=vars.camZ;
				x2=vert.x;
				y2=vert.y;
				z2=vert.z;
				x3=vars.points[i].x;
				y3=vars.points[i].y;
				z3=vars.points[i].z;
				u=((x3-x1)*(x2-x1)+(y3-y1)*(y2-y1)+(z3-z1)*(z2-z1))/(1000*1000);
				if(u>0 && u<1){
					x=x1+u*(x2-x1);
					y=y1+u*(y2-y1);
					z=z1+u*(z2-z1);
					d=Math.sqrt((x3-x)*(x3-x)+(y3-y)*(y3-y)+(z3-z)*(z3-z));
					if(d<=vars.points[i].radius && u<minu){
						minu=u;
						vars.selected=i;
					}
				}
			}
		}
		if(vars.selected!=-1){
			if(!vars.leftButton){
				vert=reverseRasterize(vars.points[vars.selected].dist,vars);
				vars.dx=vars.points[vars.selected].x-vert.x;
				vars.dy=vars.points[vars.selected].y-vert.y;
				vars.dz=vars.points[vars.selected].z-vert.z;
				vars.d=vars.points[vars.selected].dist
			}else{
				vert=reverseRasterize(vars.d,vars);
				x=vert.x+vars.dx;
				y=vert.y+vars.dy;
				z=vert.z+vars.dz;
				vars.points[vars.selected].vx=(x-vars.points[vars.selected].x)/2;
				vars.points[vars.selected].vy=(y-vars.points[vars.selected].y)/2;
				vars.points[vars.selected].vz=(z-vars.points[vars.selected].z)/2;
				vars.points[vars.selected].x=x;
				vars.points[vars.selected].y=y;
				vars.points[vars.selected].z=z;
			}
		}
		
		for(var i=0;i<vars.points.length;++i){
			if(i!=vars.selected||!vars.leftButton){
				if(vars.points[i].x+vars.points[i].vx>vars.bounding-vars.points[i].radius ||
				   vars.points[i].x+vars.points[i].vx<-vars.bounding+vars.points[i].radius) vars.points[i].vx*=-1;
				if(vars.points[i].y+vars.points[i].vy>vars.bounding-vars.points[i].radius ||
				   vars.points[i].y+vars.points[i].vy<-vars.bounding+vars.points[i].radius) vars.points[i].vy*=-1;
				if(vars.points[i].z+vars.points[i].vz>vars.bounding-vars.points[i].radius ||
				   vars.points[i].z+vars.points[i].vz<-vars.bounding+vars.points[i].radius) vars.points[i].vz*=-1;
				vars.points[i].x+=vars.points[i].vx;
				vars.points[i].y+=vars.points[i].vy;
				vars.points[i].z+=vars.points[i].vz;
			}
			if(vars.points[i].x>vars.bounding-vars.points[i].radius)vars.points[i].x=vars.bounding-vars.points[i].radius;
			if(vars.points[i].x<-vars.bounding+vars.points[i].radius)vars.points[i].x=-vars.bounding+vars.points[i].radius;
			if(vars.points[i].y>vars.bounding-vars.points[i].radius)vars.points[i].y=vars.bounding-vars.points[i].radius;
			if(vars.points[i].y<-vars.bounding+vars.points[i].radius)vars.points[i].y=-vars.bounding+vars.points[i].radius;
			if(vars.points[i].z>vars.bounding-vars.points[i].radius)vars.points[i].z=vars.bounding-vars.points[i].radius;
			if(vars.points[i].z<-vars.bounding+vars.points[i].radius)vars.points[i].z=-vars.bounding+vars.points[i].radius;
			vars.points[i].vx+=(vars.points[i].ox-vars.points[i].x)/40;
			vars.points[i].vy+=(vars.points[i].oy-vars.points[i].y)/40;
			vars.points[i].vz+=(vars.points[i].oz-vars.points[i].z)/40;
			vars.points[i].vx/=1.01;
			vars.points[i].vy/=1.01;
			vars.points[i].vz/=1.01;
		}
		for(var i=0;i<vars.points.length-1;++i){
			switch(true){
				case i==0:
					point1.x=vars.points[i].x;
					point1.y=vars.points[i].y;
					point1.z=vars.points[i].z;
					point2.x=((vars.points[i+1].x-(vars.points[i+2].x-vars.points[i+1].x))+point1.x)/2;
					point2.y=((vars.points[i+1].y-(vars.points[i+2].y-vars.points[i+1].y))+point1.y)/2;
					point2.z=((vars.points[i+1].z-(vars.points[i+2].z-vars.points[i+1].z))+point1.z)/2;
					point3.x=vars.points[i+1].x;
					point3.y=vars.points[i+1].y;
					point3.z=vars.points[i+1].z;
					d=Math.sqrt((point1.x-point3.x)*(point1.x-point3.x)+
								(point1.y-point3.y)*(point1.y-point3.y)+
								(point1.z-point3.z)*(point1.z-point3.z));
					d1=Math.sqrt((point3.x-point2.x)*(point3.x-point2.x)+
								 (point3.y-point2.y)*(point3.y-point2.y)+
								 (point3.z-point2.z)*(point3.z-point2.z));
					d3=d/2;
					point2.x=point3.x+(point2.x-point3.x)/d1*d3;
					point2.y=point3.y+(point2.y-point3.y)/d1*d3;
					point2.z=point3.z+(point2.z-point3.z)/d1*d3;
					plot(point1,point2,point3,steps,vars);
					break;
				case i<vars.points.length-2:
					x=(vars.points[i].x+vars.points[i+1].x)/2
					y=(vars.points[i].y+vars.points[i+1].y)/2
					z=(vars.points[i].z+vars.points[i+1].z)/2
					point1.x=vars.points[i].x;
					point1.y=vars.points[i].y;
					point1.z=vars.points[i].z;
					point2.x=((vars.points[i].x+(vars.points[i].x-vars.points[i-1].x)/2)+x)/2;
					point2.y=((vars.points[i].y+(vars.points[i].y-vars.points[i-1].y)/2)+y)/2;
					point2.z=((vars.points[i].z+(vars.points[i].z-vars.points[i-1].z)/2)+z)/2;
					point5.x=((vars.points[i+1].x-(vars.points[i+2].x-vars.points[i+1].x)/2)+x)/2;
					point5.y=((vars.points[i+1].y-(vars.points[i+2].y-vars.points[i+1].y)/2)+y)/2;
					point5.z=((vars.points[i+1].z-(vars.points[i+2].z-vars.points[i+1].z)/2)+z)/2;
					point6.x=vars.points[i+1].x;
					point6.y=vars.points[i+1].y;
					point6.z=vars.points[i+1].z;
					d=Math.sqrt((point1.x-point6.x)*(point1.x-point6.x)+
								(point1.y-point6.y)*(point1.y-point6.y)+
								(point1.z-point6.z)*(point1.z-point6.z));
					d1=Math.sqrt((point1.x-point2.x)*(point1.x-point2.x)+
								 (point1.y-point2.y)*(point1.y-point2.y)+
								 (point1.z-point2.z)*(point1.z-point2.z));
					d2=Math.sqrt((point5.x-point6.x)*(point5.x-point6.x)+
								 (point5.y-point6.y)*(point5.y-point6.y)+
								 (point5.z-point6.z)*(point5.z-point6.z));
					d3=d/3;
					point2.x=point1.x+(point2.x-point1.x)/d1*d3;
					point2.y=point1.y+(point2.y-point1.y)/d1*d3;
					point2.z=point1.z+(point2.z-point1.z)/d1*d3;
					point5.x=point6.x+(point5.x-point6.x)/d2*d3;
					point5.y=point6.y+(point5.y-point6.y)/d2*d3;
					point5.z=point6.z+(point5.z-point6.z)/d2*d3;

					point3.x=(point2.x+point5.x)/2;
					point3.y=(point2.y+point5.y)/2;
					point3.z=(point2.z+point5.z)/2;
					point4.x=point3.x;
					point4.y=point3.y;
					point4.z=point3.z;
					plot(point1,point2,point3,steps/2,vars);
					plot(point4,point5,point6,steps/2,vars);					
					break;
				default:
					point1.x=vars.points[i].x;
					point1.y=vars.points[i].y;
					point1.z=vars.points[i].z;
					point2.x=((vars.points[i].x+(vars.points[i].x-vars.points[i-1].x))+vars.points[i+1].x)/2;
					point2.y=((vars.points[i].y+(vars.points[i].y-vars.points[i-1].y))+vars.points[i+1].y)/2;
					point2.z=((vars.points[i].z+(vars.points[i].z-vars.points[i-1].z))+vars.points[i+1].z)/2;
					point3.x=vars.points[i+1].x;
					point3.y=vars.points[i+1].y;
					point3.z=vars.points[i+1].z;
					d=Math.sqrt((point1.x-point3.x)*(point1.x-point3.x)+
								(point1.y-point3.y)*(point1.y-point3.y)+
								(point1.z-point3.z)*(point1.z-point3.z));
					d1=Math.sqrt((point1.x-point2.x)*(point1.x-point2.x)+
								 (point1.y-point2.y)*(point1.y-point2.y)+
								 (point1.z-point2.z)*(point1.z-point2.z));
					d3=d/2;
					point2.x=point1.x+(point2.x-point1.x)/d1*d3;
					point2.y=point1.y+(point2.y-point1.y)/d1*d3;
					point2.z=point1.z+(point2.z-point1.z)/d1*d3;
					plot(point1,point2,point3,steps,vars);
				break;
			}
		}
    }


	function sortFunction(a,b){
		return b.dist-a.dist;
	}


	function drawFloor(vars){
		
		var x,y,z,d,point,a;
		for (var i = -25; i <= 25; i += 1) {
			for (var j = -25; j <= 25; j += 1) {
				x = i*2;
				z = j*2;
				y = vars.floor;
				d = Math.sqrt(x * x + z * z);
				point = project3D(x, y-d*d/85, z, vars);
				if (point.d != -1) {
					size = 25000 / (1 + point.d*point.d);
					a = 0.5 - Math.pow(d / 50, 4) * 0.5;
					if (a > 0) {
						vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(d/26-vars.frameNo/40),[0,128,32],.5+Math.sin(d/6-vars.frameNo/8)/2));
						vars.ctx.globalAlpha = a;
						vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
					}
				}
			}
		}		
		vars.ctx.fillStyle = "#82f";
		for (var i = -25; i <= 25; i += 1) {
			for (var j = -25; j <= 25; j += 1) {
				x = i*2;
				z = j*2;
				y = -vars.floor;
				d = Math.sqrt(x * x + z * z);
				point = project3D(x, y+d*d/85, z, vars);
				if (point.d != -1) {
					size = 25000 / (1 + point.d*point.d);
					a = 0.5 - Math.pow(d / 50, 4) * 0.5;
					if (a > 0) {
						vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(-d/26-vars.frameNo/40),[32,0,128],.5+Math.sin(-d/6-vars.frameNo/8)/2));
						vars.ctx.globalAlpha = a;
						vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
					}
				}
			}
		}		
	}
	

    function draw(vars){

		vars.ctx.clearRect(0, 0, canvas.width, canvas.height);

		drawFloor(vars);
		
		vars.ctx.globalAlpha=.8;
		var x,y,size,point;
		vars.points2=JSON.parse(JSON.stringify(vars.points));
		for(var i=0;i<vars.points2.length;++i){
			vars.points2[i].index=i;
		}
		vars.points2.sort(sortFunction);
		for(var i=0;i<vars.points.length;++i){
			x=vars.points2[i].x;
			y=vars.points2[i].y;
			z=vars.points2[i].z;
			point=project3D(x,y,z,vars);
			if(point.d != -1){
				vars.points[vars.points2[i].index].dist=point.d;
				size=1600*vars.points2[i].radius/(1+point.d);
				vars.ctx.drawImage(vars.points2[i].index==vars.selected?vars.ball2:vars.ball1,point.x-size/2,point.y-size/2,size,size);
			}
		}
		
		/*
		var x1,y1,x2,y2,point1,point2;
		for(var i=0;i<vars.segs1.length;++i){
			x1=vars.segs1[i].a.x;
			y1=vars.segs1[i].a.y;
			z1=vars.segs1[i].a.z;
			point1=project3D(x1,y1,z1,vars);
			if(point1.d!=-1){
				x2=vars.segs1[i].b.x;
				y2=vars.segs1[i].b.y;
				z2=vars.segs1[i].b.z;
				point2=project3D(x2,y2,z2,vars);
				if(point2.d!=-1){
					vars.ctx.lineWidth=20/(1+point.d);
					vars.ctx.globalAlpha=vars.segs1[i].alpha;
					vars.ctx.strokeStyle=rgb(vars.segs1[i].color);
					vars.ctx.beginPath();
					vars.ctx.moveTo(point1.x,point1.y);
					vars.ctx.lineTo(point2.x,point2.y);
					vars.ctx.stroke();
				}
			}
		}
		*/
		
		for(var i=0;i<vars.segs2.length;++i){
			x1=vars.segs2[i].a.x;
			y1=vars.segs2[i].a.y;
			z1=vars.segs2[i].a.z;
			point1=project3D(x1,y1,z1,vars);
			if(point1.d!=-1){
				x2=vars.segs2[i].b.x;
				y2=vars.segs2[i].b.y;
				z2=vars.segs2[i].b.z;
				point2=project3D(x2,y2,z2,vars);
				if(point2.d!=-1){
					//{a:{x:x1,y:y1},b:{x:x2,y:y2}}=vars.segs2[i];
					vars.ctx.lineWidth=1+5000/(1+point1.d*point1.d);;
					vars.ctx.globalAlpha=.65;//vars.segs2[i].alpha;
					vars.ctx.strokeStyle=rgb(vars.segs2[i].color);
					vars.ctx.beginPath();
					vars.ctx.moveTo(point1.x,point1.y);
					vars.ctx.lineTo(point2.x,point2.y);
					vars.ctx.stroke();
				}
			}
		}

		vars.ctx.globalAlpha=.45;
		vars.ctx.strokeStyle="#f06";
		for(var i=0;i<vars.shapes.length;++i){
			for(var j=0;j<vars.shapes[i].segs.length;++j){
				var x=vars.shapes[i].x+vars.shapes[i].segs[j].a.x;
				var y=vars.shapes[i].y+vars.shapes[i].segs[j].a.y;
				var z=vars.shapes[i].z+vars.shapes[i].segs[j].a.z;
				var pointa=project3D(x,y,z,vars);
				if(pointa.d != -1){
					var x=vars.shapes[i].x+vars.shapes[i].segs[j].b.x;
					var y=vars.shapes[i].y+vars.shapes[i].segs[j].b.y;
					var z=vars.shapes[i].z+vars.shapes[i].segs[j].b.z;
					var pointb=project3D(x,y,z,vars);
					if(pointb.d != -1){
						vars.ctx.lineWidth=1+vars.shapes[i].lineWidth/(1+pointa.d);
						vars.ctx.beginPath();
						vars.ctx.moveTo(pointa.x,pointa.y);
						vars.ctx.lineTo(pointb.x,pointb.y);
						vars.ctx.stroke();
					}
				}
			}
		}
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
		
		vars.points=[];
		vars.ball1=new Image();
		vars.ball1.src="http://cantelope.org/curves/ball1.png";
		vars.ball2=new Image();
		vars.ball2.src="http://cantelope.org/curves/ball2.png";
		var x,y,z,p,initPoints=10,initV=0;
		for(var i=0;i<initPoints;++i){
			var point={};
			p=Math.PI*4/initPoints*i;
			point.x=Math.sin(p)*vars.bounding/1.5;
			point.y=-vars.bounding*.6+vars.bounding*1.3/initPoints*i;
			point.z=Math.cos(p)*vars.bounding/1.5;
			point.ox=point.x;
			point.oy=point.y;
			point.oz=point.z;
			p1=Math.random()*Math.PI*2;
			point.vx=-initV/2+Math.random()*initV;
			point.vy=-initV/2+Math.random()*initV;
			point.vz=-initV/2+Math.random()*initV;
			point.radius=1.25;
			point.dist=0;
			vars.points.push(point);
		}

		vars.shapes=[];
		vars.shapes.push(loadCube(0,.25,0,100));
		transform(vars.shapes[vars.shapes.length-1],vars.bounding,vars.bounding,vars.bounding);
		subdivide(vars.shapes[vars.shapes.length-1],8);
    }

    function frame(vars) {

        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.canvas.width = document.body.clientWidth;
            vars.canvas.height = document.body.clientHeight;
            window.addEventListener("resize", function(){
                vars.canvas.width = document.body.clientWidth;
                vars.canvas.height = document.body.clientHeight;
                vars.cx=vars.canvas.width/2;
                vars.cy=vars.canvas.height/2;
				loadScene(vars);
            }, true);
			vars.canvas.oncontextmenu = function (e) { e.preventDefault(); };
            vars.canvas.addEventListener("mousemove", function(e){
                var rect = vars.canvas.getBoundingClientRect();
                vars.mx = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
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
                var rect = vars.canvas.getBoundingClientRect();
				vars.omx=vars.mx;
				vars.omy=vars.my;
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
            }, true);
            vars.canvas.addEventListener("touchend", function(e){
                vars.leftButton=0;
            }, true);
            vars.canvas.addEventListener("touchmove", function(e){
                e.preventDefault();
                var rect = vars.canvas.getBoundingClientRect();
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
            }, true);
            vars.frameNo=0;

            vars.camX = 20;
            vars.camY = 0;
            vars.camZ = -25;
            vars.pitch = 0;
            vars.yaw = 0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
            vars.mx=vars.cx;
            vars.my=vars.cy;
            vars.bounding=10;
            vars.scale=700;
			vars.floor=26;
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