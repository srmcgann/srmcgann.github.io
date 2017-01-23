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


    function elevation(x,y,z){

        var dist = Math.sqrt(x*x+y*y+z*z);
        if(dist && z/dist>=-1 && z/dist <=1) return Math.acos(z / dist);
        return 0.00000001;
    }


    function rgb(col){

        col += 0.000001;
        var r = parseInt((0.05+Math.sin(col)*0.05)*256);
        var g = parseInt((0.05+Math.cos(col)*0.05)*256);
        var b = parseInt((0.05-Math.sin(col)*0.05)*256);
		return "#"+("0" + r.toString(16) ).slice (-2)+("0" + g.toString(16) ).slice (-2)+("0" + b.toString(16) ).slice (-2);
    }

    function rgbArray(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*16);
        var g = parseInt((0.5+Math.cos(col)*0.5)*16);
        var b = parseInt((0.5-Math.sin(col)*0.5)*16);
        return [r, g, b];
    }

	function colorString(arr){

		var r = parseInt(arr[0]);
		var g = parseInt(arr[1]);
		var b = parseInt(arr[2]);
        return "#"+r.toString(16)+g.toString(16)+b.toString(16);
	}
	
	function interpolateColors(RGB1,RGB2,degree){
		
		var w2=degree;
		var w1=1-w2;
		return [w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]];
	}

    function Vert(x,y,z,vx,vy,vz,size,color){
        this.x = x;
        this.y = y;
        this.z = z;
        this.rx = x;
        this.ry = y;
        this.rz = z;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.size = size;
		this.color=color;
    }
	
	function segVert(x,y,z){
		this.x=x;
		this.y=y;
		this.z=z;
	}
	
	function Seg(x1,y1,z1,x2,y2,z2,dist){
		this.a=new segVert(x1,y1,z1);
		this.b=new segVert(x2,y2,z2);
		this.dist=dist;
	}

    function process(vars){

		var p1,p2,d,t;

		p = Math.atan2(vars.camX, vars.camZ);
		d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
		d -= Math.cos(vars.frameNo / 100) /1;
		t = Math.sin(vars.frameNo / 160) / 80;
		vars.camX = Math.sin(p + t) * d;
		vars.camZ = Math.cos(p + t) * d;
		vars.camY -= Math.sin(vars.frameNo / 110) *1;
		vars.yaw = Math.PI + p + t;
		vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
				
		if(vars.leftButton){
			if(vars.dropTimer<vars.frameNo){
				vars.dropTimer=vars.frameNo+vars.dropFreq;
				spawnDroplet(vars);
			}
		}
		
		for(var i=0;i<vars.cells.length;++i){
			vars.cells[i].rx=vars.cells[i].x;
			vars.cells[i].ry=vars.cells[i].y;
			vars.cells[i].rz=vars.cells[i].z;
		}
		
		for(var j=0;j<vars.droplets.length;++j){
			for(var i=0;i<vars.cells.length;++i){
				d=Math.sqrt((vars.cells[i].rx-vars.droplets[j].x)*(vars.cells[i].rx-vars.droplets[j].x)+
							(vars.cells[i].ry-vars.droplets[j].y)*(vars.cells[i].ry-vars.droplets[j].y)+
							(vars.cells[i].rz-vars.droplets[j].z)*(vars.cells[i].rz-vars.droplets[j].z));
				p1=Math.atan2(vars.cells[i].rx-vars.droplets[j].x,vars.cells[i].ry-vars.droplets[j].y);
				p2=elevation(vars.cells[i].rx-vars.droplets[j].x,vars.cells[i].ry-vars.droplets[j].y,vars.cells[i].rz-vars.droplets[j].z);
				t=d+Math.sin(d/10-vars.droplets[j].phase/40-vars.frameNo/8)*2;
				vars.cells[i].rx+=(vars.droplets[j].x+Math.sin(p1)*Math.sin(p2)*t)-vars.cells[i].rx;
				vars.cells[i].ry+=(vars.droplets[j].y+Math.cos(p1)*Math.sin(p2)*t)-vars.cells[i].ry;
				vars.cells[i].rz+=(vars.droplets[j].z+Math.cos(p2)*t)-vars.cells[i].rz;
			}
			if(vars.droplets[j].phase<10){
				vars.droplets[j].phase+=.75;
			}else{
				vars.droplets.splice(j,1);
			}
		}
		
		
		/*
		for(var i=0;i<vars.cells.length;++i){
			vars.cells[i].segs={};
		}
		for(var i=0;i<vars.cells.length;++i){
			if(vars.cells[i].x+vars.cells[i].vx>vars.boundingCube-vars.cells[i].size||vars.cells[i].x+vars.cells[i].vx<-vars.boundingCube+vars.cells[i].size)vars.cells[i].vx*=-1;
			if(vars.cells[i].y+vars.cells[i].vy>vars.boundingCube-vars.cells[i].size||vars.cells[i].y+vars.cells[i].vy<-vars.boundingCube+vars.cells[i].size)vars.cells[i].vy*=-1;
			if(vars.cells[i].z+vars.cells[i].vz>vars.boundingCube-vars.cells[i].size||vars.cells[i].z+vars.cells[i].vz<-vars.boundingCube+vars.cells[i].size)vars.cells[i].vz*=-1;
			if(!vars.leftButton){
				vars.cells[i].x+=vars.cells[i].vx;
				vars.cells[i].y+=vars.cells[i].vy;
				vars.cells[i].z+=vars.cells[i].vz;
			}else{
				vars.cells[i].x+=vars.cells[i].vx/2;
				vars.cells[i].y+=vars.cells[i].vy/2;
				vars.cells[i].z+=vars.cells[i].vz/2;
			}
			for(var j=0;j<vars.cells.length;++j){
				if(j!=i){
					d=((vars.cells[i].rx-vars.cells[j].rx)*(vars.cells[i].rx-vars.cells[j].rx)+
					   (vars.cells[i].ry-vars.cells[j].ry)*(vars.cells[i].ry-vars.cells[j].ry)+
					   (vars.cells[i].rz-vars.cells[j].rz)*(vars.cells[i].rz-vars.cells[j].rz));
					if(d<vars.boundingCube*vars.boundingCube/20){
						if(typeof vars.cells[j].segs[i] == "undefined"){
							vars.cells[i].segs[j]=new Seg(vars.cells[i].rx,vars.cells[i].ry,vars.cells[i].rz,vars.cells[j].rx,vars.cells[j].ry,vars.cells[j].rz,d);
						}
					}
				}
			}
		}
		*/
    }

    function draw(vars){

        vars.ctx.globalAlpha=.35;
		vars.ctx.fillStyle="#000";//rgb(vars.frameNo/80);
		vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
		var x1,y1,x2,y2,a,point,point1,point2,size;
		
		vars.ctx.globalAlpha=.1;
		for(var i=0;i<vars.shapes.length;++i){
			for(var j=0;j<vars.shapes[i].polys.length;++j){
				vars.ctx.strokeStyle="#fff";
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
				}
			}
		}


		
		for(var i=0;i<vars.cells.length;++i){
			for (var key in vars.cells[i].segs) {
				x1=vars.cells[i].segs[key].a.x;
				y1=vars.cells[i].segs[key].a.y;
				z1=vars.cells[i].segs[key].a.z;
				point1=project3D(x1,y1,z1,vars);
				if(point1.d!=-1){
					x2=vars.cells[i].segs[key].b.x;
					y2=vars.cells[i].segs[key].b.y;
					z2=vars.cells[i].segs[key].b.z;
					point2=project3D(x2,y2,z2,vars);
					if(point2.d!=-1){
						a=1+vars.cells[i].segs[key].dist/12;
						vars.cells[i].color=-Math.PI/2+((vars.cells[i].rx-vars.cells[i].x)*(vars.cells[i].rx-vars.cells[i].x)+
														(vars.cells[i].ry-vars.cells[i].y)*(vars.cells[i].ry-vars.cells[i].y))/8000;				
						vars.ctx.strokeStyle=colorString(interpolateColors(rgbArray(a/2+vars.frameNo/60),rgbArray(vars.cells[i].color),.4));
						vars.ctx.lineWidth=10/a;
						vars.ctx.globalAlpha=1/(a/1.5);
						vars.ctx.beginPath();
						vars.ctx.moveTo(point1.x,point1.y);
						vars.ctx.lineTo(point2.x,point2.y);
						vars.ctx.stroke();
					}
					
				}
			}
			point=project3D(vars.cells[i].rx,vars.cells[i].ry,vars.cells[i].rz,vars);
			vars.ctx.globalAlpha=.5;
			if(point.d != -1){
				vars.ctx.fillStyle="#8f8";
				size=500000/(1+point.d*point.d);
				vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
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

	
	function spawnDroplet(vars){
		
		var droplet={};
		var vert=reverseRasterize(Math.sqrt(vars.camX*vars.camX+vars.camY*vars.camY+vars.camZ*vars.camZ),vars);
		droplet.x=vert.x;
		droplet.y=vert.y;
		droplet.z=vert.z;
		droplet.phase=0;
		vars.droplets.push(droplet);
	}

    function loadScene(vars){

		var initCells=5000, initV=1.5, x, y, vx, vy, size=10;
		vars.cells=[];
		vars.droplets=[];
		for(var i=0;i<initCells;++i){
			x=-vars.boundingCube+size+Math.random()*(vars.boundingCube*2-size);
			y=-vars.boundingCube+size+Math.random()*(vars.boundingCube*2-size);
			z=-vars.boundingCube+size+Math.random()*(vars.boundingCube*2-size);
			vx=Math.random()*initV-initV/2;
			vy=Math.random()*initV-initV/2;
			vz=Math.random()*initV-initV/2;
			vars.cells.push(new Vert(x,y,z,vx,vy,vz,size,0));
			vars.cells[vars.cells.length-1].segs={};
		}
		vars.shapes=[];
		vars.shapes.push(new loadCube(0,0,0,10));
		transformShape(vars.shapes[vars.shapes.length-1],vars.boundingCube,vars.boundingCube,vars.boundingCube);
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
                var rect = canvas.getBoundingClientRect();
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
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.frameNo=0;

            vars.camX = 0;
            vars.camY = 0;
            vars.camZ = -500;
			vars.scale=1200;
			var p1=Math.atan2(vars.camX,vars.camZ);
			var p2=elevation(vars.camX,vars.camZ,vars.camY);
			if(p2<0)p2=0;
			if(p2>Math.PI)p2=Math.PI;
			vars.yaw=Math.PI+p1;
			vars.pitch=-Math.PI/2+p2;

            vars.mx=0;
            vars.my=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
			vars.phase=0;
			vars.dropFreq=0;
			vars.dropTimer=0;
			vars.boundingCube=100;
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
