(function(){ 


    function Vert(x,y,vx,vy,radius){
        this.x = x;
        this.y = y;
        this.vx = vx;
		this.vy = vy;
		this.radius = radius;
    }


	function intersection(x1,y1,x2,y2,x3,y3,x4,y4){
		
		var ua=-1,ub=-1,uc;
		uc=(y4-y3)*(x2-x1)-(x4-x3)*(y2-y1);
		if(uc){
			ua=((x4-x3)*(y1-y3)-(y4-y3)*(x1-x3))/uc;
			ub=((x2-x1)*(y1-y3)-(y2-y1)*(x1-x3))/uc;
		}
		return {ua:ua,ub:ub};
	}
	
	
    function draw(vars){

        vars.ctx.clearRect(0, 0, canvas.width, canvas.height);
		var d,p,p1,p2,x1,y1,x2,y2,x3,y3,x4,y4,x,y,d1,d2,t,bk,ok,minp1,minp2;

		vars.points[0].x=vars.mx;
		vars.points[0].y=vars.my;
		vars.triangles=[];
		for(var i=0;i<vars.points.length;++i){
			vars.points[i].connections=[];
		}
		for(var i=0;i<vars.points.length;++i){
			if(vars.points[i].x+vars.points[i].vx>vars.canvas.width || vars.points[i].x+vars.points[i].vx<0) vars.points[i].vx*=-1;
			if(vars.points[i].y+vars.points[i].vy>vars.canvas.height || vars.points[i].y+vars.points[i].vy<0) vars.points[i].vy*=-1;
			vars.points[i].x+=vars.points[i].vx;
			vars.points[i].y+=vars.points[i].vy;
			for(var j=0;j<vars.points.length;++j){
				if(i!=j){
					x=vars.points[j].x;
					y=vars.points[j].y;
					ok=1;
					for(var k=0;ok && k<vars.points[j].connections.length;++k){
						//if(vars.points[j].connections[k].id==i)ok=0;
					}
					t={id:j};
					if(ok)vars.points[i].connections.push(t);
				}
			}
		}

		function getAngle(x1,y1,x2,y2){
			
			p1=Math.atan2(x1,y1);
			p2=Math.atan2(x2,y2);
			if(Math.abs(p1-p2)>Math.PI){
				if(p2>p1){
					p2-=Math.PI*2;
				}else{
					p1-=Math.PI*2;
				}
			}
			return Math.abs(p2-p1);
		}
		
		for(var i=0;i<vars.points.length;++i){
			x1=vars.points[i].x;
			y1=vars.points[i].y;
			bk=1;
			while(bk){
				bk=0;
				for(var j=0;!bk && j<vars.points[i].connections.length;++j){
					x2=vars.points[vars.points[i].connections[j].id].x;
					y2=vars.points[vars.points[i].connections[j].id].y;
					for(k=0;!bk && k<vars.points.length;++k){
						if(i!=k){
							x3=vars.points[k].x;
							y3=vars.points[k].y;
							for(var m=0;!bk && m<vars.points[k].connections.length;++m){
								x4=vars.points[vars.points[k].connections[m].id].x;
								y4=vars.points[vars.points[k].connections[m].id].y;
								t=intersection(x1,y1,x2,y2,x3,y3,x4,y4);
								if(t.ua>.000001 && t.ua<.999999 && t.ub >.000001 && t.ub<.999999){
									
									minp1=Math.PI*2;
									minp2=Math.PI*2;

									p=getAngle(x2-x1,y2-y1,x3-x1,y3-y1);
									if(p<minp1)minp1=p;
									p=getAngle(x1-x3,y1-y3,x2-x3,y2-y3);
									if(p<minp1)minp1=p;
									p=getAngle(x1-x2,y1-y2,x3-x2,y3-y2);
									if(p<minp1)minp1=p;
									p=getAngle(x1-x2,y1-y2,x4-x2,y4-y2);
									if(p<minp1)minp1=p;
									p=getAngle(x2-x4,y2-y4,x1-x4,y1-y4);
									if(p<minp1)minp1=p;
									p=getAngle(x2-x1,y2-y1,x4-x1,y4-y1);
									if(p<minp1)minp1=p;

									p=getAngle(x3-x4,y3-y4,x1-x4,y1-y4);
									if(p<minp2)minp2=p;
									p=getAngle(x4-x3,y4-y3,x1-x3,y1-y3);
									if(p<minp2)minp2=p;
									p=getAngle(x3-x1,y3-y1,x4-x1,y4-y1);
									if(p<minp2)minp2=p;
									p=getAngle(x3-x2,y3-y2,x4-x2,y4-y2);
									if(p<minp2)minp2=p;
									p=getAngle(x2-x3,y2-y3,x4-x3,y4-y3);
									if(p<minp2)minp2=p;
									p=getAngle(x2-x4,y2-y4,x3-x4,y3-y4);
									if(p<minp2)minp2=p;
									
									if(minp2<minp1){
										vars.points[k].connections.splice(m,1);
										bk=1;											
									}else{
										vars.points[i].connections.splice(j,1);
										bk=1;											
									}
								}
							}
						}
					}
				}
			}
		}		
		
		for(var i=0;i<vars.points.length;++i){
			for(var j=0;j<vars.points[i].connections.length;++j){
				ok=0;
				for(var k=0;!ok && k<vars.points[vars.points[i].connections[j].id].connections.length;++k){
					if(vars.points[vars.points[i].connections[j].id].connections[k].id==i)ok=1;
				}
				if(!ok){
					vars.points[vars.points[i].connections[j].id].connections.push({id:i});
				}
			}
		}
		
		for(var i=0;i<vars.points.length;++i){
			x1=vars.points[i].x;
			y1=vars.points[i].y;
			for(var j=0;j<vars.points[i].connections.length;++j){
				x2=vars.points[vars.points[i].connections[j].id].x;
				y2=vars.points[vars.points[i].connections[j].id].y;
				p1=Math.atan2(x2-x1,y2-y1);
				minp=Math.PI;
				t=-1;
				for(var k=0;k<vars.points[i].connections.length;++k){
					if(k!=j){
						x3=vars.points[vars.points[i].connections[k].id].x;
						y3=vars.points[vars.points[i].connections[k].id].y;
						p2=Math.atan2(x3-x1,y3-y1);
						if(Math.abs(p2-p1)>Math.PI){
							if(p2>p1){
								p2-=Math.PI*2;
							}else{
								p1-=Math.PI*2;
							}
						}
						if(p2>p1 && p2-p1<minp){
							minp=p2-p1;
							t=k;
						}
					}
				}
				if(t!=-1 && minp<Math.PI){
					var triangle = {};
					triangle.p1=i;
					triangle.p2=vars.points[i].connections[j].id
					triangle.p3=vars.points[i].connections[t].id
					vars.triangles.push(triangle);
				}
			}
		}
		
		bk=1;
		while(bk){
			bk=0;
			for(var i=0;!bk&&i<vars.triangles.length;++i){
				for(var j=0;!bk&&j<vars.triangles.length;++j){
					if(j!=i){
						if((
							vars.triangles[i].p1==vars.triangles[j].p1 &&
							vars.triangles[i].p2==vars.triangles[j].p2 &&
							vars.triangles[i].p3==vars.triangles[j].p3) ||
							(vars.triangles[i].p1==vars.triangles[j].p2 &&
							vars.triangles[i].p2==vars.triangles[j].p3 &&
							vars.triangles[i].p3==vars.triangles[j].p1) ||
							(vars.triangles[i].p1==vars.triangles[j].p3 &&
							vars.triangles[i].p2==vars.triangles[j].p1 &&
							vars.triangles[i].p3==vars.triangles[j].p2) ||
							(vars.triangles[i].p1==vars.triangles[j].p1 &&
							vars.triangles[i].p2==vars.triangles[j].p3 &&
							vars.triangles[i].p3==vars.triangles[j].p2) ||
							(vars.triangles[i].p1==vars.triangles[j].p3 &&
							vars.triangles[i].p2==vars.triangles[j].p2 &&
							vars.triangles[i].p3==vars.triangles[j].p1) ||
							(vars.triangles[i].p1==vars.triangles[j].p2 &&
							vars.triangles[i].p2==vars.triangles[j].p1 &&
							vars.triangles[i].p3==vars.triangles[j].p3)
							){
							   vars.triangles.splice(j,1);
							   bk=1;
					   }
					}
				}
			}
		}


		bk=1;
		while(bk){
			bk=0;
			for(var i=0;!bk && i<vars.triangles.length;++i){
				x1=vars.points[vars.triangles[i].p1].x;
				y1=vars.points[vars.triangles[i].p1].y;
				x2=vars.points[vars.triangles[i].p2].x;
				y2=vars.points[vars.triangles[i].p2].y;
				x3=vars.points[vars.triangles[i].p1].x;
				y3=vars.points[vars.triangles[i].p1].y;
				x4=vars.points[vars.triangles[i].p3].x;
				y4=vars.points[vars.triangles[i].p3].y;
				p1=Math.atan2(x2-x1,y2-y1);
				p2=Math.atan2(x4-x3,y4-y3);
				x=(x1+x2)/2;
				y=(y1+y2)/2;
				x1=x+Math.sin(p1+Math.PI/2)*100;
				y1=y+Math.cos(p1+Math.PI/2)*100;
				x2=x-Math.sin(p1+Math.PI/2)*100;
				y2=y-Math.cos(p1+Math.PI/2)*100;
				x=(x3+x4)/2;
				y=(y3+y4)/2;
				x3=x+Math.sin(p2+Math.PI/2)*100;
				y3=y+Math.cos(p2+Math.PI/2)*100;
				x4=x-Math.sin(p2+Math.PI/2)*100;
				y4=y-Math.cos(p2+Math.PI/2)*100;
				t=intersection(x1,y1,x2,y2,x3,y3,x4,y4);
				
				x=x1+t.ua*(x2-x1);
				y=y1+t.ua*(y2-y1);
				vars.triangles[i].x=x;
				vars.triangles[i].y=y;
				vars.triangles[i].adjacents=0;
				vars.triangles[i].offshoots=[];
			}
		}
		

		var cx=0, cy=0;
		for(var i=0;i<vars.points.length;++i){
			cx+=vars.points[i].x;
			cy+=vars.points[i].y;
		}
		cx/=vars.points.length;
		cy/=vars.points.length;
		

		vars.ctx.strokeStyle="#0f8";
		vars.ctx.lineWidth=5;
		vars.ctx.globalAlpha=.5;
		for(var i=0;i<vars.triangles.length;++i){
			for(var j=0;j<vars.triangles.length;++j){
				if(i!=j){
					if(
						(vars.triangles[i].p1==vars.triangles[j].p1 &&
						vars.triangles[i].p2==vars.triangles[j].p2) ||
						(vars.triangles[i].p1==vars.triangles[j].p2 &&
						vars.triangles[i].p2==vars.triangles[j].p1) ||
						(vars.triangles[i].p1==vars.triangles[j].p2 &&
						vars.triangles[i].p2==vars.triangles[j].p3) ||
						(vars.triangles[i].p1==vars.triangles[j].p3 &&
						vars.triangles[i].p2==vars.triangles[j].p2) ||
						(vars.triangles[i].p1==vars.triangles[j].p1 &&
						vars.triangles[i].p2==vars.triangles[j].p3) ||
						(vars.triangles[i].p1==vars.triangles[j].p3 &&
						vars.triangles[i].p2==vars.triangles[j].p1) ||
						(vars.triangles[i].p1==vars.triangles[j].p1 &&
						vars.triangles[i].p3==vars.triangles[j].p2) ||
						(vars.triangles[i].p1==vars.triangles[j].p2 &&
						vars.triangles[i].p3==vars.triangles[j].p1) ||
						(vars.triangles[i].p1==vars.triangles[j].p2 &&
						vars.triangles[i].p3==vars.triangles[j].p3) ||
						(vars.triangles[i].p1==vars.triangles[j].p3 &&
						vars.triangles[i].p3==vars.triangles[j].p2) ||
						(vars.triangles[i].p1==vars.triangles[j].p1 &&
						vars.triangles[i].p3==vars.triangles[j].p3) ||
						(vars.triangles[i].p1==vars.triangles[j].p3 &&
						vars.triangles[i].p3==vars.triangles[j].p1) ||
						(vars.triangles[i].p2==vars.triangles[j].p1 &&
						vars.triangles[i].p3==vars.triangles[j].p2) ||
						(vars.triangles[i].p2==vars.triangles[j].p2 &&
						vars.triangles[i].p3==vars.triangles[j].p1) ||
						(vars.triangles[i].p2==vars.triangles[j].p2 &&
						vars.triangles[i].p3==vars.triangles[j].p3) ||
						(vars.triangles[i].p2==vars.triangles[j].p3 &&
						vars.triangles[i].p3==vars.triangles[j].p2) ||
						(vars.triangles[i].p2==vars.triangles[j].p1 &&
						vars.triangles[i].p3==vars.triangles[j].p3) ||
						(vars.triangles[i].p2==vars.triangles[j].p3 &&
						vars.triangles[i].p3==vars.triangles[j].p1)
					){
						vars.triangles[i].adjacents++;
						vars.triangles[i].offshoots.push(Math.atan2(vars.triangles[j].x-vars.triangles[i].x,vars.triangles[j].y-vars.triangles[i].y));
						vars.ctx.beginPath();
						vars.ctx.moveTo(vars.triangles[i].x,vars.triangles[i].y);
						vars.ctx.lineTo(vars.triangles[j].x,vars.triangles[j].y);
						vars.ctx.stroke();
					}
				}
			}
		}

		
		var d1,d2,d3;
		for(var i=0;i<vars.triangles.length;++i){
			if(vars.triangles[i].adjacents<3 && vars.triangles[i].x>0 &&
			   vars.triangles[i].x<vars.canvas.width && vars.triangles[i].y>0 && 
			   vars.triangles[i].y<vars.canvas.height){
				x1=(vars.points[vars.triangles[i].p1].x+vars.points[vars.triangles[i].p2].x)/2;
				y1=(vars.points[vars.triangles[i].p1].y+vars.points[vars.triangles[i].p2].y)/2;
				x2=(vars.points[vars.triangles[i].p2].x+vars.points[vars.triangles[i].p3].x)/2;
				y2=(vars.points[vars.triangles[i].p2].y+vars.points[vars.triangles[i].p3].y)/2;
				x3=(vars.points[vars.triangles[i].p3].x+vars.points[vars.triangles[i].p1].x)/2;
				y3=(vars.points[vars.triangles[i].p3].y+vars.points[vars.triangles[i].p1].y)/2;
				d1=((x1-cx)*(x1-cx)+(y1-cy)*(y1-cy));
				d2=((x2-cx)*(x2-cx)+(y2-cy)*(y2-cy));
				d3=((x3-cx)*(x3-cx)+(y3-cy)*(y3-cy));
				if(d1>d2 && d1>d3){
					p=Math.atan2(vars.points[vars.triangles[i].p2].x-vars.points[vars.triangles[i].p1].x,
								 vars.points[vars.triangles[i].p2].y-vars.points[vars.triangles[i].p1].y)+Math.PI/2;
				}else if(d2>d1 && d2>d3){
					p=Math.atan2(vars.points[vars.triangles[i].p3].x-vars.points[vars.triangles[i].p2].x,
								 vars.points[vars.triangles[i].p3].y-vars.points[vars.triangles[i].p2].y)+Math.PI/2;
				}else if(d3>d1 && d3>d2){
					p=Math.atan2(vars.points[vars.triangles[i].p1].x-vars.points[vars.triangles[i].p3].x,
								 vars.points[vars.triangles[i].p1].y-vars.points[vars.triangles[i].p3].y)+Math.PI/2;
				}
				x1=vars.triangles[i].x;
				y1=vars.triangles[i].y;
				x2=x1-Math.sin(p)*1000;
				y2=y1-Math.cos(p)*1000;
				vars.ctx.beginPath();
				vars.ctx.moveTo(x1,y1);
				vars.ctx.lineTo(x2,y2);
				vars.ctx.stroke();
				vars.ctx.closePath();
				if(vars.triangles[i].adjacents==1){
					if((d2<d1 && d1<d3)||(d3<d1 && d1<d2)){
						p=Math.atan2(vars.points[vars.triangles[i].p2].x-vars.points[vars.triangles[i].p1].x,
									 vars.points[vars.triangles[i].p2].y-vars.points[vars.triangles[i].p1].y)+Math.PI/2;
					}else if((d1<d2 && d2<d3)||(d3<d2 && d2<d1)){
						p=Math.atan2(vars.points[vars.triangles[i].p3].x-vars.points[vars.triangles[i].p2].x,
									 vars.points[vars.triangles[i].p3].y-vars.points[vars.triangles[i].p2].y)+Math.PI/2;
					}else if((d2<d3 && d3<d1)||(d1<d3 && d3<d2)){
						p=Math.atan2(vars.points[vars.triangles[i].p1].x-vars.points[vars.triangles[i].p3].x,
									 vars.points[vars.triangles[i].p1].y-vars.points[vars.triangles[i].p3].y)+Math.PI/2;
					}
					x1=vars.triangles[i].x;
					y1=vars.triangles[i].y;
					x2=x1-Math.sin(p)*1000;
					y2=y1-Math.cos(p)*1000;
					vars.ctx.beginPath();
					vars.ctx.moveTo(x1,y1);
					vars.ctx.lineTo(x2,y2);
					vars.ctx.stroke();
					vars.ctx.closePath();					
				}
			}
		}
		
		
		vars.ctx.fillStyle="#408";
		vars.ctx.lineWidth=10;
		vars.ctx.globalAlpha=.05;
		for(var i=0;i<vars.triangles.length;++i){
			x1=vars.points[vars.triangles[i].p1].x;
			y1=vars.points[vars.triangles[i].p1].y;
			x2=vars.points[vars.triangles[i].p2].x;
			y2=vars.points[vars.triangles[i].p2].y;
			x3=vars.points[vars.triangles[i].p3].x;
			y3=vars.points[vars.triangles[i].p3].y;
			vars.ctx.beginPath();
			vars.ctx.moveTo(x1,y1);
			vars.ctx.lineTo(x2,y2);
			vars.ctx.lineTo(x3,y3);
			vars.ctx.lineTo(x1,y1);
			vars.ctx.fill();
			vars.ctx.closePath();
		}
		


		vars.ctx.strokeStyle="#f28";
		vars.ctx.lineWidth=2;
		vars.ctx.globalAlpha=.1;
		for(var i=0;i<vars.points.length;++i){
			x1=vars.points[i].x;
			y1=vars.points[i].y;
			for(var j=0;j<vars.points[i].connections.length;++j){
				x2=vars.points[vars.points[i].connections[j].id].x;
				y2=vars.points[vars.points[i].connections[j].id].y;
				vars.ctx.beginPath();
				vars.ctx.moveTo(x1,y1);
				vars.ctx.lineTo(x2,y2);
				vars.ctx.stroke();
			}
		}

		var size;
		for(var i=0;i<vars.points.length;++i){
			vars.ctx.fillStyle="#fff";
			size=vars.points[i].radius/10;
			vars.ctx.fillRect(vars.points[i].x-size/2,vars.points[i].y-size/2,size,size);
		}
	}


	function rand(vars){
		vars.seed+=.1234;
		return parseFloat('0.'+Math.sin(vars.seed).toString().substr(6));
	}

	
    function loadScene(vars){

		var initPoints=30,x,y,initV=1,p,radius,d,ok;
		vars.points=[];
		for(var i=0;i<initPoints;++i){
			ok=0;
			while(!ok){
				ok=1;
				x=rand(vars)*vars.canvas.width;
				y=rand(vars)*vars.canvas.height;
				for(var j=0;j<vars.points.length;++j){
					d=Math.sqrt((x-vars.points[j].x)*(x-vars.points[j].x)+(y-vars.points[j].y)*(y-vars.points[j].y));
					if(d<20)ok=0
				}
			}
			p=rand(vars)*Math.PI*2;
			vx=Math.sin(p)*initV;
			vy=Math.cos(p)*initV;
			radius=200;
			vars.points.push(new Vert(x,y,vx,vy,radius));
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
			vars.wheelDelta=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
			vars.seed=0;
            loadScene(vars);
        }

        vars.frameNo++;
        requestAnimationFrame(function() {
          frame(vars);
        });

        draw(vars);
    }

	frame();
})();