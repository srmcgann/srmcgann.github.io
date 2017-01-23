(function(){ 
    
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
	
    function Vert(x,y,vx,vy,size,color){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
		this.color=color;
    }
	
	function segVert(x,y){
		this.x=x;
		this.y=y;
	}
	
	function Seg(x1,y1,x2,y2,dist){
		this.a=new segVert(x1,y1);
		this.b=new segVert(x2,y2);
		this.dist=dist;
	}

    function process(vars){

		if(vars.leftButton && vars.pulseTimer<vars.frameNo){
			vars.pulseTimer=vars.frameNo+vars.pulseInterval;
			spawnPulse(vars);
		}
		
		var d,p,t,r;
		for(var i=0;i<vars.shapes.length;++i){
			for(var j=0;j<vars.shapes.length;++j){
				if(i!=j){
					d=Math.sqrt((vars.shapes[i].x-vars.shapes[j].x)*(vars.shapes[i].x-vars.shapes[j].x)+
								(vars.shapes[i].y-vars.shapes[j].y)*(vars.shapes[i].y-vars.shapes[j].y));
					t=vars.shapes[i].radius+vars.shapes[j].radius;
					if(d<t){
						p=Math.atan2(vars.shapes[j].x-vars.shapes[i].x,vars.shapes[j].y-vars.shapes[i].y);
						vars.shapes[i].x=vars.shapes[j].x-Math.sin(p)*t;
						vars.shapes[i].y=vars.shapes[j].y-Math.cos(p)*t;
						vars.shapes[i].vx-=Math.sin(p)/2;
						vars.shapes[i].vy-=Math.cos(p)/2;
						vars.shapes[j].vx+=Math.sin(p)/2;
						vars.shapes[j].vy+=Math.cos(p)/2;
					}
				}
			}
			r=i%2?.01:-.01;
			for(var j=0;j<vars.shapes[i].segs.length;++j){
				x=vars.shapes[i].segs[j].a.x;
				y=vars.shapes[i].segs[j].a.y;
				p=Math.atan2(x,y);
				d=Math.sqrt(x*x+y*y);
				vars.shapes[i].segs[j].a.x=Math.sin(p+r)*d;
				vars.shapes[i].segs[j].a.y=Math.cos(p+r)*d;
				x=vars.shapes[i].segs[j].b.x;
				y=vars.shapes[i].segs[j].b.y;
				p=Math.atan2(x,y);
				d=Math.sqrt(x*x+y*y);
				vars.shapes[i].segs[j].b.x=Math.sin(p+r)*d;
				vars.shapes[i].segs[j].b.y=Math.cos(p+r)*d;
			}
			vars.shapes[i].x+=vars.shapes[i].vx;
			vars.shapes[i].y+=vars.shapes[i].vy;
			if(vars.shapes[i].x<-vars.shapes[i].radius)vars.shapes[i].x=vars.canvas.width+vars.shapes[i].radius;
			if(vars.shapes[i].x>vars.canvas.width+vars.shapes[i].radius)vars.shapes[i].x=-vars.shapes[i].radius;
			if(vars.shapes[i].y<-vars.shapes[i].radius)vars.shapes[i].y=vars.canvas.height+vars.shapes[i].radius;
			if(vars.shapes[i].y>vars.canvas.height+vars.shapes[i].radius)vars.shapes[i].y=-vars.shapes[i].radius;
		}
		
		var x,y,vx,vy,x1,y1,x2,y2,x3,y3,x4,y4,ua,ub,uc,nx,ny,rrx,rry,rix,riy,dot;
		for(var i=0;i<vars.pulses.length;++i){
			for(var j=0;j<vars.pulses[i].particles.length;++j){
				vars.pulses[i].particles[j].mind=10000;
				x=vars.pulses[i].particles[j].x;
				y=vars.pulses[i].particles[j].y;
				vx=vars.pulses[i].particles[j].vx;
				vy=vars.pulses[i].particles[j].vy;
				
				x1=x;
				y1=y;
				x2=x+vx;
				y2=y+vy;
				for(var k=0;k<vars.shapes.length;++k){
					for(var m=0;m<vars.shapes[k].segs.length;++m){
						x3=vars.shapes[k].x+vars.shapes[k].segs[m].a.x;
						y3=vars.shapes[k].y+vars.shapes[k].segs[m].a.y;
						x4=vars.shapes[k].x+vars.shapes[k].segs[m].b.x;
						y4=vars.shapes[k].y+vars.shapes[k].segs[m].b.y;
						uc=(y4-y3)*(x2-x1)-(x4-x3)*(y2-y1);
						ua=((x4-x3)*(y1-y3)-(y4-y3)*(x1-x3))/uc;
						ub=((x2-x1)*(y1-y3)-(y2-y1)*(x1-x3))/uc;
						if(ua>-.25&&ua<1.25&&ub>-.25&&ub<1.25){
							nx=(y4-y3);
							ny=-(x4-x3);
							d=Math.sqrt(nx*nx+ny*ny);
							nx/=d;
							ny/=d;
							rix=vx;
							riy=vy;
							d=Math.sqrt(rix*rix+riy*riy);
							rix/=d;
							riy/=d;
							dot=nx*rix+ny*riy;
							rrx=rix-2*nx*dot;
							rry=riy-2*ny*dot;
							vars.pulses[i].particles[j].vx=rrx*d/2;
							vars.pulses[i].particles[j].vy=rry*d/2;
							var position = Math.sign((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3));
							vars.shapes[k].vx+=nx*position/10;
							vars.shapes[k].vy+=ny*position/10;
						}
					}
				}
				
				if(x+vx<0 || x+vx>vars.canvas.width) vars.pulses[i].particles[j].vx*=-1;
				if(y+vy<0 || y+vy>vars.canvas.height) vars.pulses[i].particles[j].vy*=-1;
				vars.pulses[i].particles[j].x+=vars.pulses[i].particles[j].vx;
				vars.pulses[i].particles[j].y+=vars.pulses[i].particles[j].vy;
			}
			vars.pulses[i].alpha/=1.05;
			if(vars.pulses[i].alpha<.025)vars.pulses.splice(i,1);
		}
    }
	

    function draw(vars){

        //vars.ctx.clearRect(0, 0, canvas.width, canvas.height);
		vars.ctx.globalAlpha=.2;
		vars.ctx.fillStyle="#011";
		vars.ctx.fillRect(0,0,vars.canvas.width,vars.canvas.height);
		
		var size,x,y;
		for(var i=0;i<vars.pulses.length;++i){
			vars.ctx.strokeStyle="#fff";
			vars.ctx.lineWidth=1;
			vars.ctx.globalAlpha=vars.pulses[i].alpha;
			vars.ctx.beginPath();
			for(var j=0;j<vars.pulses[i].particles.length;++j){
				
				vars.ctx.fillStyle="#fff";
				size=vars.pulses[i].particles[j].radius;
				x=vars.pulses[i].particles[j].x;
				y=vars.pulses[i].particles[j].y;
				if(j){
					vars.ctx.lineTo(x,y);
					if(j==vars.pulses[i].particles.length-1){
						vars.ctx.fillRect(x-size/2,y-size/2,size,size);
						x=vars.pulses[i].particles[0].x;
						y=vars.pulses[i].particles[0].y;
						vars.ctx.lineTo(x,y);
					}
				}else{
					vars.ctx.moveTo(x,y);
				}
				if(j)vars.ctx.fillRect(x-size/2,y-size/2,size,size);
			}
			vars.ctx.stroke();
		}
		vars.ctx.globalAlpha=1;
		for(var i=0;i<vars.shapes.length;++i){
			vars.ctx.strokeStyle=colorString(rgbArray(vars.frameNo/10));
			vars.ctx.lineWidth=5;
			vars.ctx.beginPath();
			vars.ctx.moveTo(vars.shapes[i].x+vars.shapes[i].segs[0].a.x,vars.shapes[i].y+vars.shapes[i].segs[0].a.y);
			for(var j=0;j<vars.shapes[i].segs.length;++j){
				x=vars.shapes[i].x+vars.shapes[i].segs[j].b.x;
				y=vars.shapes[i].y+vars.shapes[i].segs[j].b.y;
				vars.ctx.lineTo(x,y);
			}
			vars.ctx.stroke();
		}
	}


	function spawnPulse(vars){
		
		var pulse={};
		pulse.particles=[];
		pulse.alpha=1;
		var particles=40,p,x,y,initV=10;
		for(var i=0;i<particles;++i){
			p=Math.PI*2/particles*i+vars.frameNo/40;
			var particle={};
			particle.x=vars.mx;
			particle.y=vars.my;
			particle.vx=Math.sin(p)*initV;
			particle.vy=Math.cos(p)*initV;
			particle.radius=10;
			particle.delete=0;
			pulse.particles.push(particle);
		}
		vars.pulses.push(pulse);
	}
	
	
    function loadScene(vars){

		vars.pulses=[];
		vars.shapes=[];
		var initShapes=50,sd,x1,y1,x2,y2,p,ls,initV=2;
		for(var i=0;i<initShapes;++i){
			ls=15+Math.random()*60
			var shape={};
			shape.radius=ls;
			shape.vx=-initV/2+Math.random()*initV;
			shape.vy=-initV/2+Math.random()*initV;
			shape.segs=[];
			shape.x=Math.random()*vars.canvas.width;
			shape.y=Math.random()*vars.canvas.width;
			sd=4+parseInt(Math.random()*8);
			for(var j=0;j<sd;++j){
				p=Math.PI*2/sd*j;
				x1=Math.sin(p)*ls;
				y1=Math.cos(p)*ls;
				p=Math.PI*2/sd*(j+1);
				x2=Math.sin(p)*ls;
				y2=Math.cos(p)*ls;
				shape.segs.push(new Seg(x1,y1,x2,y2));
			}
			vars.shapes.push(shape);
		}
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

            vars.mx=0;
            vars.my=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
			vars.pulseInterval=2;
			vars.pulseTimer=0;
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