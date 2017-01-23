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
        if(!uc) return {x:0,y:0,d:-1};
        var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
        var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
        if(!z)z=0.000000001;
        if(ua>0&&ua<1&&ub>0&&ub<1){
            return {
                x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
                y:vars.cy+y/z*vars.scale,
                d:(x*x+y*y+z*z)
            };
        }else{
            return {
                x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
                y:vars.cy+y/z*vars.scale,
                d:-1
            };
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
		var r = parseInt((0.5+Math.sin(col)*0.5)*16);
		var g = parseInt((0.5+Math.cos(col)*0.5)*16);
		var b = parseInt((0.5-Math.sin(col)*0.5)*16);
		return "#"+r.toString(16)+g.toString(16)+b.toString(16);
	}

	
    function Vert(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.ox = x;
        this.oy = y;
        this.oz = z;
    }

	
	function Seg(x1,y1,z1,x2,y2,z2){
		this.a = new Vert(x1,y1,z1);
		this.b = new Vert(x2,y2,z2);
		this.dist=0;
	}


    function process(vars){
		
		var p,d,t;
		p = Math.atan2(vars.camX, vars.camZ);
		d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ)-Math.cos(vars.frameNo/80)/70;
		t=Math.sin(vars.frameNo/280)/100;
		vars.camX = Math.sin(p + t) * d;
		vars.camZ = Math.cos(p + t) * d;
		vars.camY += +Math.sin(vars.frameNo/130) / 70;
		vars.yaw = Math.PI + p + t;
		vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2+.05;
		
		var x,y,p2;
		for(var i=0;i<vars.particles.length;++i){
			x=vars.particles[i].ox;
			y=vars.particles[i].oy;
			z=vars.particles[i].oz;
			if(y>2.25){
				vars.particles[i].oy=-1.75;
				vars.particles[i].ox=-2+Math.random()*4;
				vars.particles[i].oz=-2+Math.random()*4;
			}
			vars.particles[i].oy+=.02;
			d=Math.sqrt(x*x+y*y+z*z);
			vars.particles[i].d=d;
			t=5/(2+d);
			p=Math.atan2(x,y)+Math.sin(vars.frameNo/30)*Math.PI*2/(1+d/2)-Math.sin(vars.frameNo/30)*2.5;
			p2=elevation(x,y,z);
			x=Math.sin(p)*Math.sin(p2)*d/t;
			y=Math.cos(p)*Math.sin(p2)*d/t;
			z=Math.cos(p2)*d;

			p=Math.atan2(y,z)+Math.sin(vars.frameNo/30)*Math.PI*2/(1+d/2)-Math.sin(vars.frameNo/30)*2.5;
			p2=elevation(y,z,x);
			y=Math.sin(p)*Math.sin(p2)*d/t;
			z=Math.cos(p)*Math.sin(p2)*d/t;
			x=Math.cos(p2)*d;
			
			vars.particles[i].x=x;
			vars.particles[i].y=y;
			vars.particles[i].z=z;
		}
		
		
		if(vars.leftButton){
			if(vars.dropTimer<vars.frameNo){
				vars.dropTimer=vars.frameNo+vars.dropFreq;
				spawnDroplet(vars);
			}
		}
		
		for(var i=0;i<vars.particles.length;++i){
			vars.particles[i].rx=vars.particles[i].x;
			vars.particles[i].ry=vars.particles[i].y;
			vars.particles[i].rz=vars.particles[i].z;
		}
		
		for(var j=0;j<vars.droplets.length;++j){
			for(var i=0;i<vars.particles.length;++i){
				d=Math.sqrt((vars.particles[i].rx-vars.droplets[j].x)*(vars.particles[i].rx-vars.droplets[j].x)+
							(vars.particles[i].ry-vars.droplets[j].y)*(vars.particles[i].ry-vars.droplets[j].y)+
							(vars.particles[i].rz-vars.droplets[j].z)*(vars.particles[i].rz-vars.droplets[j].z));
				p1=Math.atan2(vars.particles[i].rx-vars.droplets[j].x,vars.particles[i].ry-vars.droplets[j].y);
				p2=elevation(vars.particles[i].rx-vars.droplets[j].x,vars.particles[i].ry-vars.droplets[j].y,vars.particles[i].rz-vars.droplets[j].z);
				t=d+Math.sin(d*2.5-vars.droplets[j].phase/40-vars.frameNo/8)/14;
				vars.particles[i].rx+=(vars.droplets[j].x+Math.sin(p1)*Math.sin(p2)*t)-vars.particles[i].rx;
				vars.particles[i].ry+=(vars.droplets[j].y+Math.cos(p1)*Math.sin(p2)*t)-vars.particles[i].ry;
				vars.particles[i].rz+=(vars.droplets[j].z+Math.cos(p2)*t)-vars.particles[i].rz;
			}
			if(vars.droplets[j].phase<.5){
				vars.droplets[j].phase+=.1;
			}else{
				vars.droplets.splice(j,1);
			}
		}
		if(vars.droplets.length){
			for(var i=0;i<vars.particles.length;++i){
				vars.particles[i].d2=Math.sqrt((vars.droplets[0].x-vars.particles[i].rx)*(vars.droplets[0].x-vars.particles[i].rx)+
												(vars.droplets[0].y-vars.particles[i].ry)*(vars.droplets[0].y-vars.particles[i].ry)+
												(vars.droplets[0].z-vars.particles[i].rz)*(vars.droplets[0].z-vars.particles[i].rz));
			}
		}else{
			for(var i=0;i<vars.particles.length;++i){
				vars.particles[i].d2=Math.sqrt(vars.particles[i].rx*vars.particles[i].rx+vars.particles[i].ry*vars.particles[i].ry+vars.particles[i].rz*vars.particles[i].rz);
			}
		}
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


	function sortFunction(a,b){
		return b.dist-a.dist;
	}


    function draw(vars){

        vars.ctx.globalAlpha=.1;
		vars.ctx.fillStyle="#000";
		vars.ctx.fillRect(0, 0, vars.canvas.width, vars.canvas.height);
		
		
		var x,y,size;
        vars.ctx.globalAlpha=1;
		vars.particles.sort(sortFunction);
		for(var i=0;i<vars.particles.length;++i){
			vars.ctx.fillStyle=rgb(vars.particles[i].d2*1.25+.5);
			x=vars.particles[i].rx;
			y=vars.particles[i].ry;
			z=vars.particles[i].rz;
			var point=project3D(x,y,z,vars);
			if(point.d!=-1){
				vars.particles[i].dist=point.d;
				size=1+1500/(1+point.d)/(2+vars.particles[i].d*10);
				vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
			}
		}
		
		vars.ctx.globalAlpha=.1;
		vars.ctx.strokeStyle="#0fa";
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


	function mobileCheck() {
	 
	 var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	}


    function loadScene(vars){
		
		vars.particles=[];
		if(mobileCheck()){
			var initParticles=1000;
		}else{
			var initParticles=3000;
		}
		var x,y;
		for(var i=0;i<initParticles;++i){
			x=-2+Math.random()*4;
			y=.25+-2+Math.random()*4;
			z=-2+Math.random()*4;
			vars.particles.push(new Vert(x,y,z));
		}
		vars.shapes=[];
		vars.shapes.push(loadCube(0,.25,0,100));
		transform(vars.shapes[vars.shapes.length-1],2,2,2);
		subdivide(vars.shapes[vars.shapes.length-1],8);
		vars.droplets=[];
    }

	
    function frame(vars) {

        if(vars === undefined){
            var vars={};
			vars.canvas=document.createElement("canvas");
			document.body.appendChild(vars.canvas);
            //vars.canvas = document.querySelector("canvas");
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
            vars.camX = 0;
            vars.camY = -3;
            vars.camZ = -6;
            vars.camPitch = 0;
            vars.camYaw = 0;
            vars.mx=0;
            vars.my=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
            vars.scale=750;
			vars.phase=0;
			vars.dropFreq=0;
			vars.dropTimer=0;
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