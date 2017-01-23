(function(){ 

    
    function rgb(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*16);
        var g = parseInt((0.5+Math.cos(col)*0.5)*16);
        var b = parseInt((0.5-Math.sin(col)*0.5)*16);
        return "#"+r.toString(16)+g.toString(16)+b.toString(16);
    }

    
    function rgbArray(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*256);
        var g = parseInt((0.5+Math.cos(col)*0.5)*256);
        var b = parseInt((0.5-Math.sin(col)*0.5)*256);
        return [r, g, b];
    }


	function colorString(arr){

		var r = parseInt(arr[0]/256*16);
		var g = parseInt(arr[1]/256*16);
		var b = parseInt(arr[2]/256*16);
		return "#"+r.toString(16)+g.toString(16)+b.toString(16);
	}


	function interpolateColors(RGB1,RGB2,degree){
		
		var w2=degree;
		var w1=1-w2;
		return [w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]];
	}
	

    function draw(vars){

		//vars.ctx.clearRect(0,0,vars.canvas.width,vars.canvas.height);
		
		var x=parseInt(vars.mx/(vars.canvas.width)*(vars.columns));
		var y=parseInt(vars.my/(vars.canvas.height)*(vars.rows));
		var a1, a2, a3, a4, a5;
		for(var i=0;i<vars.columns;++i){
			for(var j=0;j<vars.rows;++j){
					vars.grid[x][y].alpha=3.5;
					a1=vars.grid[i][j].alpha;
					a2=i?vars.grid[i-1][j].alpha:vars.grid[vars.columns-1][j].alpha;
					a3=i<vars.columns-1?vars.grid[i+1][j].alpha:vars.grid[0][j].alpha;
					a4=j?vars.grid[i][j-1].alpha:vars.grid[i][vars.rows-1].alpha;
					a5=j<vars.rows-1?vars.grid[i][j+1].alpha:vars.grid[i][0].alpha;
				if(vars.mbutton){
					vars.grid[i][j].alpha=(a1+a2+a3+a4+a5)/2.025;
					vars.grid[i][j].alpha/=2.4;
				}else{
					vars.grid[i][j].alpha=(a1+a2+a3+a4+a5)/4.9;
					vars.grid[i][j].alpha/=1.05;
				}
				if(vars.grid[i][j].alpha>2)vars.grid[i][j].alpha=2;
				if(vars.grid[i][j].alpha<.08){
					vars.grid[i][j].alpha=0;
					vars.grid[i][j].color=[0,0,100];
				}else{
					vars.grid[i][j].color = vars.grid[i][j].alpha*4>=Math.PI*2?[255,255,255]:rgbArray(vars.grid[i][j].alpha*4);
				}
			}
		}
		
		
		vars.bctx.drawImage(vars.vid,0,0,vars.buffer.width,vars.buffer.height);
		var idata = vars.bctx.getImageData(0,0,vars.buffer.width,vars.buffer.height);
		var data=idata.data;
		var r, g, b, t = 0, x = 0, y = 0;
		while(t<data.length){
			r1=data[t];
			g1=data[t+1];
			b1=data[t+2];
			if(x<vars.columns){
				var cell=vars.grid[x][y];
				var alpha=cell.alpha<=.15?cell.alpha>0.15?cell.alpha:.2:.8;
			}
			vars.ctx.fillStyle=colorString(interpolateColors([r1,g1,b1],cell.color,alpha));
			vars.ctx.fillRect(x*vars.cellSizeX,y*vars.cellSizeY,vars.cellSizeX,vars.cellSizeY);
			if(x<vars.buffer.width){
				x++;
				t += 4;
			}else{
				x = 0;
				y++;
				t = vars.buffer.width*4*parseInt(y);
			}
		}
    }
    
	
    function frame(vars) {

        requestAnimationFrame(function() {
          frame(vars);
        });
        if(vars === undefined){
            var vars={};
			vars.loadedmetadata=0;
			vars.vid = document.createElement('video');
			vars.vid.src = "277EIp.mp4";
			vars.vid.loop = true;
			vars.vid.addEventListener("loadedmetadata", function (){
				vars.loadedmetadata=1;
				vars.columns=110;
				vars.rows=Math.ceil(vars.columns/vars.vid.videoWidth*vars.vid.videoHeight);
				vars.buffer.width = vars.columns;
				vars.buffer.height = vars.rows;
				vars.canvas.width = document.body.clientWidth;
				vars.canvas.height = document.body.clientHeight;
				vars.cellSizeX=vars.canvas.width/vars.columns;
				vars.cellSizeY=vars.canvas.height/vars.rows;

				vars.grid=new Array(vars.columns);
				for(var i=0;i<vars.columns;++i){
					vars.grid[i]=new Array();
					for(var j=0;j<vars.rows;++j){
						var tile={};
						tile.alpha=0;
						tile.color=[0,0,0];
						vars.grid[i].push(tile);
					}
				}
				
				vars.cx=vars.canvas.width/2;
				vars.cy=vars.canvas.height/2;
				var w=document.body.clientWidth/6;
				vars.buffer.style.width=w+"px";
				var h=vars.vid.videoHeight/(vars.vid.videoWidth/w);
				vars.buffer.style.height=h+"px";
				vars.vid.play();
			});
            vars.buffer = document.querySelector("#buffer");
            vars.bctx = vars.buffer.getContext("2d");
            vars.canvas = document.querySelector("#canvas");
            vars.ctx = vars.canvas.getContext("2d");
            window.addEventListener("resize", function(){

				var w=document.body.clientWidth/6;
				vars.buffer.style.width=w+"px";
				var h=vars.vid.videoHeight/(vars.vid.videoWidth/w);
				vars.buffer.style.height=h+"px";
				vars.canvas.width = document.body.clientWidth;
				vars.canvas.height = document.body.clientHeight;
				vars.cellSizeX=vars.canvas.width/vars.columns;
				vars.cellSizeY=vars.canvas.height/vars.rows;
            }, true);
            vars.canvas.addEventListener("mouseout", function(){
				vars.mbutton=0;
			},true);
            vars.canvas.addEventListener("mousemove", function(e){
				var rect = vars.canvas.getBoundingClientRect();
                vars.mx = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
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
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*vars.canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*vars.canvas.height);
            }, true);
            vars.canvas.addEventListener("touchend", function(e){
                vars.mbutton=0;
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
		}

        vars.frameNo++;


        if(vars.loadedmetadata == 1){
			draw(vars);
		}
    }
	frame();
	
})();
