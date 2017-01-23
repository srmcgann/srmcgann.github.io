(function(){ 
	
    function Vert(x,y,vx,vy,radius){
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.vx = vx;
		this.vy = vy;
		this.radius = radius;
		this.links = [];
    }

	
    function doLogic(vars){
		
		vars.colliders[0].x=vars.mx;
		vars.colliders[0].y=vars.my;
		vars.colliders[0].radius=200;
		
		var p,d,x1,y1,x2,y2,t,x,y;
		for(var i=0;i<vars.points.length;++i){
			vars.points[i].vx/=1.05;
			vars.points[i].vy/=1.05;
			vars.points[i].vx+=(vars.points[i].ox-vars.points[i].x)/200;
			vars.points[i].vy+=(vars.points[i].oy-vars.points[i].y)/200;
			vars.points[i].x+=vars.points[i].vx;
			vars.points[i].y+=vars.points[i].vy;

			x1=vars.points[i].x;
			y1=vars.points[i].y;
			for(var j=0;j<vars.colliders.length;++j){
				x2=vars.colliders[j].x;
				y2=vars.colliders[j].y;
				d=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				t=(vars.colliders[j].radius+vars.points[i].radius)/2;
				if(d<t){
					p=Math.atan2(x2-x1,y2-y1);
					x=vars.points[i].x;
					y=vars.points[i].y;
					vars.points[i].x=vars.colliders[j].x-Math.sin(p)*t;
					vars.points[i].y=vars.colliders[j].y-Math.cos(p)*t;
					vars.points[i].vx+=(vars.points[i].x-x)/2;
					vars.points[i].vy+=(vars.points[i].y-y)/2;
				}
			}
		}
		for(var i=1;i<vars.colliders.length;++i){
			x1=vars.colliders[i].x;
			y1=vars.colliders[i].y;
			for(var j=0;j<vars.colliders.length;++j){
				if(i!=j){
					x2=vars.colliders[j].x;
					y2=vars.colliders[j].y;
					d=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
					t=(vars.colliders[i].radius+vars.colliders[j].radius)/2;
					if(d<t){
						p=Math.atan2(x2-x1,y2-y1);
						x=vars.colliders[i].x;
						y=vars.colliders[i].y;
						vars.colliders[i].x=vars.colliders[j].x-Math.sin(p)*t;
						vars.colliders[i].y=vars.colliders[j].y-Math.cos(p)*t;
						vars.colliders[i].vx+=(vars.colliders[i].x-x);
						vars.colliders[i].vy+=(vars.colliders[i].y-y);
						vars.colliders[j].vx-=(vars.colliders[i].x-x);
						vars.colliders[j].vy-=(vars.colliders[i].y-y);
					}
				}
			}
			d=Math.sqrt(vars.colliders[i].vx*vars.colliders[i].vx+vars.colliders[i].vy*vars.colliders[i].vy);
			if(d<vars.colliders[i].initV){
				vars.colliders[i].vx/=d;
				vars.colliders[i].vy/=d;
				vars.colliders[i].vx*=vars.colliders[i].initV;
				vars.colliders[i].vy*=vars.colliders[i].initV;
			}else{
				vars.colliders[i].vx/=1.015;
				vars.colliders[i].vy/=1.015;
			}
			if(vars.colliders[i].x+vars.colliders[i].vx>vars.canvas.width-vars.colliders[i].radius/2 ||
			   vars.colliders[i].x+vars.colliders[i].vx<vars.colliders[i].radius/2){
				   if(vars.colliders[i].x+vars.colliders[i].vx>vars.canvas.width-vars.colliders[i].radius/2){
					   vars.colliders[i].x=vars.canvas.width-vars.colliders[i].radius/2;
				   }else{
					   vars.colliders[i].x=vars.colliders[i].radius/2
				   }
				   vars.colliders[i].vx*=-1;
			}
			if(vars.colliders[i].y+vars.colliders[i].vy>vars.canvas.height-vars.colliders[i].radius/2 ||
			   vars.colliders[i].y+vars.colliders[i].vy<vars.colliders[i].radius/2){
				   if(vars.colliders[i].y+vars.colliders[i].vy>vars.canvas.height-vars.colliders[i].radius/2){
					   vars.colliders[i].y=vars.canvas.height-vars.colliders[i].radius/2;
				   }else{
					   vars.colliders[i].y=vars.colliders[i].radius/2
				   }
				   vars.colliders[i].vy*=-1;
			}
			vars.colliders[i].x+=vars.colliders[i].vx;
			vars.colliders[i].y+=vars.colliders[i].vy;
		}
	}


    function draw(vars){

		//vars.ctx.clearRect(0,0,vars.canvas.width,vars.canvas.height);
		vars.ctx.globalAlpha=1;
		vars.ctx.drawImage(vars.clouds,0,0,vars.canvas.width,vars.canvas.height);
		
		vars.ctx.globalAlpha=1;
		var size,x1,y1,x2,y2,d,a;
		vars.ctx.strokeStyle="#fff";
		vars.ctx.lineWidth=3;
		for(var i=0;i<vars.points.length;++i){
			//size=vars.points[i].radius;
			//vars.ctx.drawImage(vars.ball2,vars.points[i].x-size/2,vars.points[i].y-size/2,size,size);
			x1=vars.points[i].x;
			y1=vars.points[i].y;
			for(var j=0;j<vars.points[i].links.length;++j){
				x2=vars.points[vars.points[i].links[j]].x;
				y2=vars.points[vars.points[i].links[j]].y;
				d=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				a=Math.min(2/(1+d/1.5),1);
				vars.ctx.globalAlpha=a;
				vars.ctx.beginPath();
				vars.ctx.moveTo(x1,y1);
				vars.ctx.lineTo(x2,y2);
				vars.ctx.stroke();
			}
		}
		vars.ctx.globalAlpha=1;
		for(var i=0;i<vars.colliders.length;++i){
			size=vars.colliders[i].radius;
			vars.ctx.drawImage(i?vars.ball1:vars.ball2,vars.colliders[i].x-size/2,vars.colliders[i].y-size/2,size,size);
		}
	}


    function loadScene(vars){

		vars.ball1=new Image();
		vars.ball1.src="http://cantelope.org/gravtype3/ball1.png";
		vars.ball2=new Image();
		vars.ball2.src="http://cantelope.org/gravtype3/ball2.png";
		vars.clouds=new Image();
		vars.clouds.src="http://cantelope.org/gravtype3/red_clouds2.jpg";

		vars.bctx.clearRect(0, 0, canvas.width, canvas.height);
		vars.bctx.font="99px Square721";
		vars.bctx.fillStyle="#fff";
		vars.bctx.fillText("Take",10,100);
		vars.bctx.fillText("a",210,200);
		vars.bctx.fillText("Chance",225,320);

		var x,y,t,radius;
		vars.spacing=1;
		vars.points=[];
		vars.sizeX=11.5/3.5;
		vars.sizeY=11.5/3.5;
		var idata=vars.bctx.getImageData(0,0,vars.buffer.width,vars.buffer.height);
		for(var j=0;j<vars.buffer.height;j+=vars.spacing){
			for(var i=0;i<vars.buffer.width;i+=vars.spacing){
				x=20+i*vars.sizeX;
				y=0+j*vars.sizeY;
				t=(i+j*vars.buffer.width)*4;
				r=idata.data[t+0];
				g=idata.data[t+1];
				b=idata.data[t+2];
				if(r)vars.points.push(new Vert(x,y,0,0,4));
			}
		}
		
		var d1=(vars.sizeX*vars.sizeX+vars.sizeY*vars.sizeY);
		var d2,x1,y1,x2,y2;
		for(var i=0;i<vars.points.length;++i){
			x1=vars.points[i].x;
			y1=vars.points[i].y;
			t=0;
			for(var j=0;j<vars.points.length;++j){
				if(i!=j){
					x2=vars.points[j].x;
					y2=vars.points[j].y;
					d2=((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))/vars.spacing;
					if(Math.abs(d2-d1)<.1)t++;
				}
			}
			vars.points[i].del=t>3?1:0;
		}
		for(var i=0;i<vars.points.length;++i){
			if(vars.points[i].del){
				vars.points.splice(i,1);
				i--;
			}
		}
		var unlinked;
		for(var i=0;i<vars.points.length;++i){
			x1=vars.points[i].x;
			y1=vars.points[i].y;
			t=0;
			for(var j=0;j<vars.points.length;++j){
				if(i!=j){
					x2=vars.points[j].x;
					y2=vars.points[j].y;
					d2=((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))/vars.spacing;
					if(Math.abs(d2-d1)<1 ){
						unlinked=1;
						for(var k=0;k<vars.points[j].links.length;++k){
							if(vars.points[j].links[k]==i)unlinked=0;
						}
						if(unlinked){
							vars.points[i].links.push(j);
						}
					}
				}
			}
			for(var j=0;j<vars.points.length;++j){
				if(i!=j){
					x2=vars.points[j].x;
					y2=vars.points[j].y;
					d2=((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))/vars.spacing;
					if(Math.abs(d2-d1)<25 && vars.points[i].links.length<2 && vars.points[j].links.length<2){
						unlinked=1;
						for(var k=0;k<vars.points[j].links.length;++k){
							if(vars.points[j].links[k]==i)unlinked=0;
						}
						if(unlinked){
							vars.points[i].links.push(j);
						}
					}
				}
			}
		}
		
		
		vars.colliders=[];
		var p,initV=8,x,y,vx,vy,initColliders=6;
		for(var i=0;i<initColliders;++i){
			p=Math.PI*2*Math.random();
			vx=Math.sin(p)*initV;
			vy=Math.cos(p)*initV;
			p=Math.PI*2/initColliders*i;
			x=vars.cx+Math.sin(p)*vars.cy/1.5;
			y=vars.cy+Math.cos(p)*vars.cy/1.5;
			vars.colliders.push(new Vert(x,y,vx,vy,80));
		}
		for(var i=0;i<vars.colliders.length;++i){
			vars.colliders[i].initV=initV;
		}
    }


    function frame(vars) {

        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("#canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.buffer = document.querySelector("#buffer");
            vars.bctx = vars.buffer.getContext("2d");
            vars.canvas.width = 1366*1.5;
            vars.canvas.height = 768*1.5;
			vars.buffer.width = 1366*1.5;
			vars.buffer.height = 768*1.5;
            window.addEventListener("resize", function(){
            }, true);
			vars.canvas.oncontextmenu = function (e) { e.preventDefault(); };
            vars.canvas.addEventListener("mousemove", function(e){
                var rect = vars.canvas.getBoundingClientRect();
				vars.omx=vars.mx;
				vars.omy=vars.my;
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
				vars.omx=vars.mx;
				vars.omy=vars.my;
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
            }, true);
			
            vars.frameNo=0;
			
            vars.mx=0;
            vars.my=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
			loadScene(vars);
        }

        vars.frameNo++;
        requestAnimationFrame(function() {
          frame(vars);
        });

        doLogic(vars);
        draw(vars);
    }
	
	window.addEventListener("load",function(){frame();});
})();