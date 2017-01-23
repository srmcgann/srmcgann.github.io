(function(){ 

    
    function rgb(col){

        col += 0.000001;
        var r = parseInt((0.85+Math.sin(col)*0.15)*16);
        var g = parseInt((0.85+Math.cos(col)*0.15)*16);
        var b = parseInt((0.85-Math.sin(col)*0.15)*16);
        return "#"+r.toString(16)+g.toString(16)+b.toString(16);
    }


    function Vert(x,y){
        this.x = x;
        this.y = y;
    }
    
    
    function Seg(x1,y1,x2,y2,color){
        this.a = new Vert(x1,y1);
        this.b = new Vert(x2,y2);
		this.color=color;
    }


    function process(vars){
        
		loadScene(vars);
    }

    
    function draw(vars){

		vars.ctx.globalAlpha=.1;
		vars.ctx.fillStyle="#000";
        vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		vars.ctx.globalAlpha=1;
		for(var i=0;i<vars.shapes.length;++i){
			for(var j=0;j<vars.shapes[i].segs.length;++j){
				vars.ctx.lineWidth=1+5/(1+j/15);
				x1=vars.shapes[i].x+vars.shapes[i].segs[j].a.x;
				y1=vars.shapes[i].y+vars.shapes[i].segs[j].a.y;
				x2=vars.shapes[i].x+vars.shapes[i].segs[j].b.x;
				y2=vars.shapes[i].y+vars.shapes[i].segs[j].b.y;
				vars.ctx.strokeStyle=rgb(vars.shapes[i].segs[j].color+Math.PI*1.5*i+vars.frameNo/8);
				vars.ctx.beginPath();
				vars.ctx.moveTo(x1,y1);
				vars.ctx.lineTo(x2,y2);
				vars.ctx.stroke();
			}
		}
    }
    

	function pushShape(x,y,sd,vars){

		var x1,y1,x2,y2,sd,ls,p,t,depth,theta1,theta2;
		shape={};
		depth=3;
		shape.x=x;
		shape.y=y;
		shape.segs=[];
		ls=vars.canvas.height/6;
		t=Math.sin(Math.PI*2/3*vars.shapes.length)*Math.PI*1.5;
		theta1=Math.cos(vars.frameNo/150+t)*3;
		for(var i=0;i<sd;++i){
			p=Math.PI*2/sd*i+theta1;
			x1=Math.sin(p)*ls;
			y1=Math.cos(p)*ls;
			p=Math.PI*2/sd*(i+2)+theta1;
			x2=Math.sin(p)*ls;
			y2=Math.cos(p)*ls;
			shape.segs.push(new Seg(x1,y1,x2,y2,0));
		}
		var baseShape=JSON.parse(JSON.stringify(shape));
		for(var k=0;k<depth;++k){
			var newShape={};
			newShape.segs=[];
			ls/=4-Math.cos(vars.frameNo/20+t)*2;
			theta2=Math.sin(vars.frameNo/40+t)*(k+1)*1.5;
			for(var j=0;j<baseShape.segs.length;++j){
				for(var i=0;i<sd;++i){
					p=Math.PI*2/sd*i+theta1+theta2;
					x1=baseShape.segs[j].a.x+Math.sin(p)*ls;
					y1=baseShape.segs[j].a.y+Math.cos(p)*ls;
					p=Math.PI*2/sd*(i+2)+theta1+theta2;
					x2=baseShape.segs[j].a.x+Math.sin(p)*ls;
					y2=baseShape.segs[j].a.y+Math.cos(p)*ls;
					newShape.segs.push(new Seg(x1,y1,x2,y2,Math.PI*2/(depth+1)*(k+1)));
				}			
			}
			for(var j=0;j<newShape.segs.length;++j)shape.segs.push(JSON.parse(JSON.stringify(newShape.segs[j])));
			var baseShape=JSON.parse(JSON.stringify(newShape));
		}
		vars.shapes.push(shape);		
	}
	
	function loadScene(vars){
		
		vars.shapes=[];

		pushShape(vars.cx/3,vars.cy,4,vars);
		pushShape(vars.cx*(1+2/3),vars.cy,3,vars);
		pushShape(vars.cx,vars.cy,5,vars);
	}
	

    function frame(vars) {

        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("#canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.canvas.width = 1366*1.5;
            vars.canvas.height = 768*1.5;
            window.addEventListener("resize", function(){
                //vars.canvas.width = document.body.clientWidth;
                //vars.canvas.height = document.body.clientHeight;
                //vars.cx=vars.canvas.width/2;
                //vars.cy=vars.canvas.height/2;
            }, true);
            vars.canvas.addEventListener("mousemove", function(e){
                var rect = canvas.getBoundingClientRect();
                vars.mx = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.canvas.addEventListener("mousedown", function(e){
                vars.mbutton=1;
            }, true);
            vars.canvas.addEventListener("mouseup", function(e){
                vars.mbutton=0;
            }, true);
            vars.canvas.addEventListener("touchstart", function(e){
                vars.mbutton=1;
                e.preventDefault();
                var rect = canvas.getBoundingClientRect();
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.canvas.addEventListener("touchend", function(e){
                vars.mbutton=0;
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
			loadScene(vars);
			vars.ctx.fillStyle="#fff";
			vars.ctx.fillRect(0,0,vars.canvas.width,vars.canvas.height);
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