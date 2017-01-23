(function(){ 
    
    function rgbArray(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*256);
        var g = parseInt((0.5+Math.cos(col)*0.5)*256);
        var b = parseInt((0.5-Math.sin(col)*0.5)*256);
        return [r, g, b];
    }


    function greyScaleArray(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*256);
        var g = parseInt((0.5+Math.sin(col)*0.5)*256);
        var b = parseInt((0.5+Math.sin(col)*0.5)*256);
        return [r, g, b];
    }


	function colorStringFast(arr){

		var r = parseInt(arr[0]/256*16);
		var g = parseInt(arr[1]/256*16);
		var b = parseInt(arr[2]/256*16);
		return "#"+r.toString(16)+g.toString(16)+b.toString(16);
	}


	function colorStringSlow(arr){

		var r = parseInt(arr[0]);
		var g = parseInt(arr[1]);
		var b = parseInt(arr[2]);
		return "#"+("0" + r.toString(16) ).slice (-2)+("0" + g.toString(16) ).slice (-2)+("0" + b.toString(16) ).slice (-2);
	}


	function interpolateColors(RGB1,RGB2,degree){
		
		var w2=degree;
		var w1=1-w2;
		return [w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]];
	}
	

    function rgbSlow(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*256);
        var g = parseInt((0.5+Math.cos(col)*0.5)*256);
        var b = parseInt((0.5-Math.sin(col)*0.5)*256);
		return "#"+("0" + r.toString(16) ).slice (-2)+("0" + g.toString(16) ).slice (-2)+("0" + b.toString(16) ).slice (-2);
    }


	function rgbFast(col){

		col += 0.000001;
		var r = parseInt((0.5+Math.sin(col)*0.5)*16);
		var g = parseInt((0.5+Math.cos(col)*0.5)*16);
		var b = parseInt((0.5-Math.sin(col)*0.5)*16);
		return "#"+r.toString(16)+g.toString(16)+b.toString(16);
	}

		
    function greyScaleSlow(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*256);
        var g = parseInt((0.5+Math.sin(col)*0.5)*256);
        var b = parseInt((0.5+Math.sin(col)*0.5)*256);
		return "#"+("0" + r.toString(16) ).slice (-2)+("0" + g.toString(16) ).slice (-2)+("0" + b.toString(16) ).slice (-2);
    }


	function greyScaleFast(col){

		col += 0.000001;
		var r = parseInt((0.5+Math.sin(col)*0.5)*16);
		var g = parseInt((0.5+Math.sin(col)*0.5)*16);
		var b = parseInt((0.5+Math.sin(col)*0.5)*16);
		return "#"+r.toString(16)+g.toString(16)+b.toString(16);
	}

		
    function process(vars){
		
		if(vars.leftButton){
			for(var i=0;i<vars.cols;++i){
				for(var j=0;j<vars.rows;++j){
					vars.cells[i][j].b/=1.01;
				}
			}
		}
		var x=parseInt(vars.mx/vars.canvas.width*vars.cols)*vars.repeat%vars.cols;
		var y=parseInt(vars.my/vars.canvas.height*vars.rows)*vars.repeat%vars.rows;
		vars.cells[x][y].b=1;
		

		var l,r,u,d,lu,ru,ld,rd,ma,mb,A,B,f=.055+Math.sin(vars.frameNo/20)/80;
		var k=.063-Math.cos(vars.frameNo/12)/400;
		var t=1;
		for(var i=0;i<vars.cols;++i){
			for(var j=0;j<vars.rows;++j){
				l=i?i-1:vars.cols-1;
				r=i<vars.cols-1?i+1:0;
				u=j?j-1:vars.rows-1;
				d=j<vars.rows-1?j+1:0;
				A=vars.cells[i][j].a;
				B=vars.cells[i][j].b;
				ma=A*-1+
				   vars.cells[l][j].a*.2+
				   vars.cells[r][j].a*.2+
				   vars.cells[i][u].a*.2+
				   vars.cells[i][d].a*.2+
				   vars.cells[l][u].a*.05+
				   vars.cells[r][u].a*.05+
				   vars.cells[l][d].a*.05+
				   vars.cells[r][d].a*.05;
				mb=B*-1+
				   vars.cells[l][j].b*.2+
				   vars.cells[r][j].b*.2+
				   vars.cells[i][u].b*.2+
				   vars.cells[i][d].b*.2+
				   vars.cells[l][u].b*.05+
				   vars.cells[r][u].b*.05+
				   vars.cells[l][d].b*.05+
				   vars.cells[r][d].b*.05;
				vars.cells[i][j].a=A+(1*(ma)-A*B*B+f*(1-A))*t;
				vars.cells[i][j].b=B+(.5*(mb)+A*B*B-(k+f)*B)*t;
			}
		}
		/*
		if(Math.random()<.25){
			var x,y;
			for(var i=0;i<1;++i){
				x=parseInt(Math.random()*vars.cols);
				y=parseInt(Math.random()*vars.rows);
				vars.cells[x][y].b=1;
				x=parseInt(Math.random()*vars.cols);
				y=parseInt(Math.random()*vars.rows);
				vars.cells[x][y].b=0;
			}
		}
		*/
	}

    function draw(vars){
		
		var x,y,r,col1,col2;
		for(var i=0;i<vars.cols;++i){
			for(var j=0;j<vars.rows;++j){
				r=vars.cells[i][j].b*2/(vars.cells[i][j].a+vars.cells[i][j].b);
				if(r>1)r=1;
				col1=rgbArray(r*Math.PI-Math.PI/2+vars.frameNo/3);
				col2=greyScaleArray(r*Math.PI-Math.PI/2);
				t=1-Math.pow(.495-Math.cos(vars.frameNo/24)*.495,6);
				if(t<0)t=0;
				if(t>1)t=1;
				vars.ctx.fillStyle=colorStringSlow(interpolateColors(col1,col2,t));
				x=i*vars.size;
				y=j*vars.size;
				vars.ctx.fillRect(x,y,vars.size+1,vars.size+1);
			}
		}
		var iData=vars.ctx.getImageData(0,0,vars.canvas.width/vars.repeat,vars.canvas.height/vars.repeat+20);
		for(var k=0;k<vars.repeat;++k){
			for(var m=0;m<vars.repeat;++m){
				if(k||m){
					x=vars.canvas.width/vars.repeat*k;
					y=vars.canvas.height/vars.repeat*m-(m?8:0);
					vars.ctx.putImageData(iData,x,y);
				}
			}
		}
	}


	function mobileCheck() {
	 
	 var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	}


    function loadScene(vars){
		
		if(mobileCheck()){
			vars.cols=50;
		}else{
			vars.cols=110;			
		}
		vars.repeat=2;
		vars.size=vars.canvas.width/vars.repeat/vars.cols;
		vars.rows=parseInt(vars.canvas.height/vars.size/vars.repeat);
		vars.cells=new Array(vars.cols);
		for(var i=0;i<vars.cols;++i){
			vars.cells[i]=new Array(vars.rows);
			for(var j=0;j<vars.rows;++j){
				var cell={};
				cell.a=1;
				cell.b=Math.random()<.015?1:0;
				vars.cells[i][j]=cell;
			}
		}
    }

    function frame(vars) {

        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.canvas.width = 1366*1.5;
            vars.canvas.height = 768*1.5;
            window.addEventListener("resize", function(){
                vars.canvas.width = 1366*1.5;
                vars.canvas.height = 768*1.5;
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

            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
            vars.mx=vars.cx;
            vars.my=vars.cy;
            loadScene(vars);
        }

        vars.frameNo++;
        requestAnimationFrame(function() {
			frame(vars);
        });

		if(!(vars.frameNo%400))loadScene(vars);
		for(var i=0;i<100;++i)process(vars);
        draw(vars);
    }

	frame();
})();