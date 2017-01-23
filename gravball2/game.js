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
        this.rx = x;
        this.ry = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
		this.color=color;
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
				t=d+Math.cos(Math.PI/2+d/95-Math.PI*2/1000*vars.droplets[j].phase)*10/(1+Math.abs(vars.droplets[j].phase/2-d)/16);
				vars.cells[i].rx+=(vars.droplets[j].x+Math.sin(p)*t)-vars.cells[i].rx;
				vars.cells[i].ry+=(vars.droplets[j].y+Math.cos(p)*t)-vars.cells[i].ry;
			}
			if(vars.droplets[j].phase<3500){
				vars.droplets[j].phase+=42;
			}else{
				vars.droplets.splice(j,1);
			}
		}
    }

    function draw(vars){

        vars.ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		var x1,y1,x2,y2,x3,y3,x4,y4,t=0;
		vars.ctx.strokeStyle="#68f";
		vars.ctx.globalAlpha=1;
		vars.ctx.lineWidth=1;
		for(var i=0;i<vars.cells.length-vars.rows;++i){
			
			vars.cells[i].color=-Math.PI/1.4+Math.sqrt((vars.cells[i].rx-vars.cells[i].x)*(vars.cells[i].rx-vars.cells[i].x)+
											(vars.cells[i].ry-vars.cells[i].y)*(vars.cells[i].ry-vars.cells[i].y))/26;
			vars.ctx.fillStyle=colorString(rgbArray(vars.cells[i].color));
			if(t<vars.rows-1){
				t++;
				x1=vars.cells[i].rx;
				y1=vars.cells[i].ry;
				x2=vars.cells[i+vars.rows].rx;
				y2=vars.cells[i+vars.rows].ry;
				x3=vars.cells[i+vars.rows+1].rx;
				y3=vars.cells[i+vars.rows+1].ry;
				x4=vars.cells[i+1].rx;
				y4=vars.cells[i+1].ry;
				vars.ctx.beginPath();
				vars.ctx.moveTo(x1,y1);
				vars.ctx.lineTo(x2,y2);
				vars.ctx.lineTo(x3,y3);
				vars.ctx.lineTo(x4,y4);
				vars.ctx.fill();
				vars.ctx.stroke();
			}else{
				t=0;
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

		var initCells=5000, x, y, vx, vy, size=34;
		vars.cells=[];
		vars.droplets=[];
		
		vars.cols=parseInt(vars.canvas.width/size)+2;
		vars.rows=parseInt(vars.canvas.height/size)+2;
		for(var i=0;i<vars.cols;++i){
			for(var j=0;j<vars.rows;++j){
				x=i*size;
				y=j*size;
				vx=0;
				vy=0;
				vars.cells.push(new Vert(x,y,vx,vy,size,0));
			}
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