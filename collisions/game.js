(function(){ 

    
    function rgb(col){

        col += 0.000001;
        var r = parseInt((0.85+Math.sin(col)*0.15)*16);
        var g = parseInt((0.85+Math.cos(col)*0.15)*16);
        var b = parseInt((0.85-Math.sin(col)*0.15)*16);
        return "#"+r.toString(16)+g.toString(16)+b.toString(16);
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
	
    function Vert(x,y,vx,vy,radius){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
		this.radius=radius;
    }
    
    
    function Seg(x1,y1,x2,y2){
        this.a = new Vert(x1,y1);
        this.b = new Vert(x2,y2);
    }


    function process(vars){
        
		var u,x,y,x1,y1,x2,y2,x3,y3,p,t;
		
		for(var i=0;i<vars.balls.length;++i){
			if(vars.balls[i].y>vars.cy*1.75){
				vars.balls[i].x=vars.cx;
				vars.balls[i].y=vars.cy;
			}
			vars.balls[i].vx/=1.025;
			vars.balls[i].vy/=1.025;
			for(var j=0;j<vars.balls.length;++j){
				if(j!=i){
					x1=vars.balls[i].x;
					y1=vars.balls[i].y;
					x2=vars.balls[j].x;
					y2=vars.balls[j].y;
					d=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
					p=Math.atan2(x2-x1,y2-y1);
					t=(vars.balls[i].radius+vars.balls[j].radius);
					if(d<t){
						vars.balls[i].x=vars.balls[j].x-Math.sin(p)*t;
						vars.balls[i].y=vars.balls[j].y-Math.cos(p)*t;
						vars.balls[i].vx-=Math.sin(p)*t/50;
						vars.balls[i].vy-=Math.cos(p)*t/50;
					}
				}
			}
			if(vars.balls[i].y+vars.balls[i].vy>vars.cy*2-vars.balls[i].radius){
				vars.balls[i].vy*=-1;
			}else{
				vars.balls[i].vy+=vars.gravity;
			}
			if(vars.balls[i].x+vars.balls[i].vy>vars.cx*2-vars.balls[i].radius ||
			   vars.balls[i].x+vars.balls[i].vy<vars.balls[i].radius){
				vars.balls[i].vx*=-1;
			}
			vars.balls[i].x+=vars.balls[i].vx;
			vars.balls[i].y+=vars.balls[i].vy;
			if(vars.balls[i].y>vars.cy*2-vars.balls[i].radius){
				vars.balls[i].y=vars.cy*2-vars.balls[i].radius;
			}
			if(vars.balls[i].x>vars.cx*2-vars.balls[i].radius){
				vars.balls[i].x=vars.cx*2-vars.balls[i].radius;
			}
			if(vars.balls[i].x<vars.balls[i].radius){
				vars.balls[i].x=vars.balls[i].radius;
			}
			x3=vars.balls[i].x;
			y3=vars.balls[i].y;
			for(var j=0;j<vars.shapes.length;++j){
				for(var k=0;k<vars.shapes[j].segs.length;++k){
					x1=vars.shapes[j].x+vars.shapes[j].segs[k].a.x;
					y1=vars.shapes[j].y+vars.shapes[j].segs[k].a.y;
					x2=vars.shapes[j].x+vars.shapes[j].segs[k].b.x;
					y2=vars.shapes[j].y+vars.shapes[j].segs[k].b.y;
					d=((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
					u=((x3-x1)*(x2-x1)+(y3-y1)*(y2-y1))/d;
					if(u>0 && u<1){
						x=x1+u*(x2-x1);
						y=y1+u*(y2-y1);
						d=Math.sqrt((x-x3)*(x-x3)+(y-y3)*(y-y3));
						if(d<vars.balls[i].radius){
							p=Math.atan2(x2-x1,y2-y1)+Math.PI/2;
							vars.balls[i].x=x-Math.sin(p)*vars.balls[i].radius;
							vars.balls[i].y=y-Math.cos(p)*vars.balls[i].radius;
							vars.balls[i].vx-=Math.sin(p)*3;
							vars.balls[i].vy-=Math.cos(p)*3;
						}
					}
				}
			}
		}
		var r=Math.sin(vars.frameNo/60)/50;
		for(var i=0;i<vars.shapes.length;++i){
			for(var j=0;j<vars.shapes[i].segs.length;++j){
				x1=vars.shapes[i].segs[j].a.x;
				y1=vars.shapes[i].segs[j].a.y;
				x2=vars.shapes[i].segs[j].b.x;
				y2=vars.shapes[i].segs[j].b.y;
				d=Math.sqrt(x1*x1+y1*y1);
				p=Math.atan2(x1,y1)+r;
				vars.shapes[i].segs[j].a.x=Math.sin(p)*d;
				vars.shapes[i].segs[j].a.y=Math.cos(p)*d;
				d=Math.sqrt(x2*x2+y2*y2);
				p=Math.atan2(x2,y2)+r;
				vars.shapes[i].segs[j].b.x=Math.sin(p)*d;
				vars.shapes[i].segs[j].b.y=Math.cos(p)*d;
			}
		}
    }

    
    function draw(vars){

		vars.ctx.globalAlpha=.2;
		vars.ctx.fillStyle="#000";
        vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		vars.ctx.globalAlpha=.5;
		for(var i=0;i<vars.balls.length;++i){
			d=(vars.balls[i].vx*vars.balls[i].vx+
						vars.balls[i].vy*vars.balls[i].vy);
			vars.ctx.fillStyle=colorString(interpolateColors([128,0,255],[255,200,32],Math.min(d/250,1)));
			vars.ctx.beginPath();
			vars.ctx.arc(vars.balls[i].x, vars.balls[i].y, vars.balls[i].radius, 0, 2 * Math.PI, false);
			vars.ctx.fill();
		}
		
		vars.ctx.strokeStyle="#fff";
		vars.ctx.lineWidth=10;
		for(var i=0;i<vars.shapes.length;++i){
			for(var j=0;j<vars.shapes[i].segs.length;++j){
				vars.ctx.beginPath();
				x1=vars.shapes[i].x+vars.shapes[i].segs[j].a.x;
				y1=vars.shapes[i].y+vars.shapes[i].segs[j].a.y;
				x2=vars.shapes[i].x+vars.shapes[i].segs[j].b.x;
				y2=vars.shapes[i].y+vars.shapes[i].segs[j].b.y;
				vars.ctx.moveTo(x1,y1);
				vars.ctx.lineTo(x2,y2);
				vars.ctx.stroke();
			}
		}
    }
    
	
	function loadScene(vars){
		
		var initBalls=35,x,y,vx,vy,radius;
		
		vars.shapes = [];
		var shape = {};
		shape.segs = [];
		shape.segs.push(new Seg(-250,-250,250,-250));
		shape.segs.push(new Seg(250,-250,250,250));
		shape.segs.push(new Seg(250,250,-250,250));
		shape.segs.push(new Seg(-250,250,-250,-250));
		shape.x=vars.cx;
		shape.y=vars.cy;
		vars.shapes.push(shape);
		
		vars.balls=[];
		for(var i = 0;i<initBalls;++i){
			radius = 15+Math.random()*20;
			x = vars.cx-.5+Math.random();//radius+Math.random()*(vars.canvas.width-radius*2);
			y = vars.cy-.5+Math.random();//radius+Math.random()*(vars.canvas.height-radius*2);
			vx = -2.55+Math.random()*5;
			vy = -2.55+Math.random()*5;
			vars.balls.push(new Vert(x,y,vx,vy,radius));
		}
	}
	

    function frame(vars) {

        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("#canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.canvas.width = document.body.clientWidth;
            vars.canvas.height = document.body.clientHeight;
            window.addEventListener("resize", function(){
                vars.canvas.width = document.body.clientWidth;
                vars.canvas.height = document.body.clientHeight;
                vars.cx=vars.canvas.width/2;
                vars.cy=vars.canvas.height/2;
            }, true);
            vars.frameNo=0;
            vars.mx=0;
            vars.my=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
            vars.phase=0;
			vars.gravity=.175;
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