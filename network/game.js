(function(){ 
    
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

    function Vert(x,y,vx,vy,size,color){
        this.x = x;
        this.y = y;
        this.rx = x;
        this.ry = y;
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

		var p,d,t;
				
		if(vars.leftButton){
			if(vars.dropTimer<vars.frameNo){
				vars.dropTimer=vars.frameNo+vars.dropFreq;
				spawnDroplet(vars);
			}
		}
		
		for(var i=0;i<vars.cells.length;++i){
			vars.cells[i].rx=vars.cells[i].x;
			vars.cells[i].ry=vars.cells[i].y;
		}
		
		for(var j=0;j<vars.droplets.length;++j){
			for(var i=0;i<vars.cells.length;++i){
				d=Math.sqrt((vars.cells[i].rx-vars.droplets[j].x)*(vars.cells[i].rx-vars.droplets[j].x)+
							(vars.cells[i].ry-vars.droplets[j].y)*(vars.cells[i].ry-vars.droplets[j].y));
				p=Math.atan2(vars.cells[i].rx-vars.droplets[j].x,vars.cells[i].ry-vars.droplets[j].y);
				t=d+Math.cos(Math.PI/2+d/95-Math.PI*2/1000*vars.droplets[j].phase)*15/(1+Math.abs(vars.droplets[j].phase/2-d)/200);
				vars.cells[i].rx+=(vars.droplets[j].x+Math.sin(p)*t)-vars.cells[i].rx;
				vars.cells[i].ry+=(vars.droplets[j].y+Math.cos(p)*t)-vars.cells[i].ry;
			}
			if(vars.droplets[j].phase<3000){
				vars.droplets[j].phase+=35;
			}else{
				vars.droplets.splice(j,1);
			}
		}
		
		for(var i=0;i<vars.cells.length;++i){
			vars.cells[i].segs={};
		}
		for(var i=0;i<vars.cells.length;++i){
			if(vars.cells[i].x+vars.cells[i].vx>vars.canvas.width-vars.cells[i].size||vars.cells[i].x+vars.cells[i].vx<vars.cells[i].size)vars.cells[i].vx*=-1;
			if(vars.cells[i].y+vars.cells[i].vy>vars.canvas.height-vars.cells[i].size||vars.cells[i].y+vars.cells[i].vy<vars.cells[i].size)vars.cells[i].vy*=-1;
			if(!vars.leftButton){
				vars.cells[i].x+=vars.cells[i].vx;
				vars.cells[i].y+=vars.cells[i].vy;
			}else{
				vars.cells[i].x+=vars.cells[i].vx/4;
				vars.cells[i].y+=vars.cells[i].vy/4;
			}
			for(var j=0;j<vars.cells.length;++j){
				if(j!=i){
					d=((vars.cells[i].rx-vars.cells[j].rx)*(vars.cells[i].rx-vars.cells[j].rx)+
					   (vars.cells[i].ry-vars.cells[j].ry)*(vars.cells[i].ry-vars.cells[j].ry));
					if(d<90*90){
						if(typeof vars.cells[j].segs[i] == "undefined"){
							vars.cells[i].segs[j]=new Seg(vars.cells[i].rx,vars.cells[i].ry,vars.cells[j].rx,vars.cells[j].ry,d);
						}
					}
				}
			}
		}
    }

    function draw(vars){

        vars.ctx.globalAlpha=.35;
		vars.ctx.fillStyle=rgb(vars.frameNo/80);
		vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
		var x1,y1,x2,y2,a;
		
		vars.ctx.globalAlpha=1;
		for(var i=0;i<vars.cells.length;++i){
			for (var key in vars.cells[i].segs) {
				x1=vars.cells[i].segs[key].a.x;
				y1=vars.cells[i].segs[key].a.y;
				x2=vars.cells[i].segs[key].b.x;
				y2=vars.cells[i].segs[key].b.y;
				a=1+vars.cells[i].segs[key].dist/800;
				vars.cells[i].color=-Math.PI/2+((vars.cells[i].rx-vars.cells[i].x)*(vars.cells[i].rx-vars.cells[i].x)+
												(vars.cells[i].ry-vars.cells[i].y)*(vars.cells[i].ry-vars.cells[i].y))/8000;				
				vars.ctx.strokeStyle=colorString(interpolateColors(rgbArray(a/2+vars.frameNo/60),rgbArray(vars.cells[i].color),.4));
				vars.ctx.lineWidth=10/a;
				vars.ctx.globalAlpha=1/(a/1.5);
				vars.ctx.beginPath();
				vars.ctx.moveTo(x1,y1);
				vars.ctx.lineTo(x2,y2);
				vars.ctx.stroke();
			}
			if(!vars.leftButton){
				vars.ctx.globalAlpha=.25;
				vars.ctx.fillStyle="#888";
				vars.ctx.fillRect(vars.cells[i].rx-vars.cells[i].size/2,vars.cells[i].ry-vars.cells[i].size/2,vars.cells[i].size,vars.cells[i].size);
			}
		}
	}
	
	function spawnDroplet(vars){
		
		var droplet={};
		droplet.x=vars.mx;
		droplet.y=vars.my;
		droplet.phase=0;
		vars.droplets.push(droplet);
	}

    function loadScene(vars){

		var initCells=450, initV=6, x, y, vx, vy, size=10;
		vars.cells=[];
		vars.droplets=[];
		for(var i=0;i<initCells;++i){
			x=size+Math.random()*(vars.canvas.width-size*2);
			y=size+Math.random()*(vars.canvas.height-size*2);
			vx=Math.random()*initV-initV/2;
			vy=Math.random()*initV-initV/2;
			vars.cells.push(new Vert(x,y,vx,vy,size,0));
			vars.cells[vars.cells.length-1].segs={};
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

            vars.mx=0;
            vars.my=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
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