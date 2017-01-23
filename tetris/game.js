function initVars(){
	
	canvas=$("#board")[0];
	cssHeight=$("#board").css("height");
	$("#board").css("width",(parseInt(cssHeight.substr(0,cssHeight.length-2))/2)+"px");
	ctx = canvas.getContext("2d");
	canvas.width=400;
	canvas.height=canvas.width*2;
	ctx.lineWidth="2";
	blockSize=canvas.width/10;
	piece=0;
	time=0;
	level=1;
	lastDrop=0;
	dropInterval=.2;
	keyTimer=0;
	keyInterval=.08;
	rotateTimer=0;
	dropKeyTimer=0;
	stat=document.getElementById("status");
	stat.innerHTML="";
	leftkey=rightkey=upkey=downkey=spacekey=skey=0;
	gameover=0;
	rowsCompleted=0;
	rowsToAdvance=6;
	box = new Array(10);
	for(i=0;i<20;++i){
		box[i]=new Array(20);
		for(j=0;j<20;++j) box[i][j]="";
	}
}

function spawnPiece(type){
	
	switch(type){
		case 0:
			piece={
				color:"#f00",
				x1:0, y1:0,
				x2:0, y2:1,
				x3:0, y3:2,
				x4:0, y4:3,
				ox:4, oy:-4
			};
			break;
		case 1:
			piece={
				color:"#f80",
				x1:-1, y1:0,
				x2:-1, y2:1,
				x3:0, y3:1,
				x4:0, y4:2,
				ox:5, oy:-2
			};
			break;
		case 2:
			piece={
				color:"#ff0",
				x1:0, y1:0,
				x2:0, y2:1,
				x3:-1, y3:1,
				x4:-1, y4:2,
				ox:5, oy:-2
			};
			break;
		case 3:
			piece={
				color:"#0a0",
				x1:0, y1:0,
				x2:0, y2:1,
				x3:-1, y3:0,
				x4:-1, y4:1,
				ox:5, oy:-2
			};
			break;
		case 4:
			piece={
				color:"#0af",
				x1:0, y1:0,
				x2:0, y2:1,
				x3:0, y3:2,
				x4:-1, y4:2,
				ox:5, oy:-2
			};
			break;
		case 5:
			piece={
				color:"#00a",
				x1:-1, y1:0,
				x2:-1, y2:1,
				x3:-1, y3:2,
				x4:0, y4:2,
				ox:5, oy:-2
			};
			break;
		case 6:
			piece={
				color:"#a0a",
				x1:-1, y1:0,
				x2:0, y2:0,
				x3:1, y3:0,
				x4:0, y4:1,
				ox:5, oy:-2
			};
			break;
	}
	if(!clearBelow())gameover=1;
}

document.onkeydown = function (e) {
	
	chr=e.keyCode || e.charCode;
	switch(chr){
		case 37:leftkey=1;break;
		case 38:upkey=1;break;
		case 39:rightkey=1;break;
		case 40:downkey=1;break;
		case 32:spacekey=1;break;
		case 83:skey=1;break;
	}
};

document.onkeyup = function (e) {
	
	chr=e.keyCode || e.charCode;
	switch(chr){
		case 37:leftkey=0;break;
		case 38:upkey=0;rotateTimer=0;break;
		case 39:rightkey=0;break;
		case 40:downkey=0;break;
		case 32:spacekey=0;break;
		case 83:skey=0;break;
	}
	keyTimer=0;
};

board.onkeydown = function (e) {
	
	chr=e.keyCode || e.charCode;
	switch(chr){
		case 37:leftkey=1;break;
		case 38:upkey=1;break;
		case 39:rightkey=1;break;
		case 40:downkey=1;break;
		case 32:spacekey=1;break;
		case 83:skey=1;break;
	}
};

board.onkeyup = function (e) {
	
	chr=e.keyCode || e.charCode;
	switch(chr){
		case 37:leftkey=0;break;
		case 38:upkey=0;rotateTimer=0;break;
		case 39:rightkey=0;break;
		case 40:downkey=0;break;
		case 32:spacekey=0;break;
		case 83:skey=0;break;
	}
	keyTimer=0;
};

function drawBlock(x,y,color,border){
	
	ctx.beginPath();
	ctx.fillStyle=color;
	ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
	ctx.strokeStyle=border;
	ctx.rect(x*blockSize, y*blockSize, blockSize, blockSize);
	ctx.stroke();
}

function render(){
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	showTarget();
	
	drawBlock(piece["ox"]+piece["x1"],piece["oy"]+piece["y1"],piece["color"],"#fff");
	drawBlock(piece["ox"]+piece["x2"],piece["oy"]+piece["y2"],piece["color"],"#fff");
	drawBlock(piece["ox"]+piece["x3"],piece["oy"]+piece["y3"],piece["color"],"#fff");
	drawBlock(piece["ox"]+piece["x4"],piece["oy"]+piece["y4"],piece["color"],"#fff");
	
	for(i=0;i<10;++i){
		for(j=0;j<20;++j){
			if(box[i][j]) drawBlock(i,j,box[i][j]);
		}
	}
	
}

function clearBelow(){
	
	x1=piece["ox"]+piece["x1"];
	y1=piece["oy"]+piece["y1"]+1;
	x2=piece["ox"]+piece["x2"];
	y2=piece["oy"]+piece["y2"]+1;
	x3=piece["ox"]+piece["x3"];
	y3=piece["oy"]+piece["y3"]+1;
	x4=piece["ox"]+piece["x4"];
	y4=piece["oy"]+piece["y4"]+1;
	if(y1>19 || y2> 19 || y3>19 || y4>19 || box[x1][y1] || box[x2][y2] || box[x3][y3] || box[x4][y4]) return 0;
	return 1;
}

function showTarget(){
	
	t=0;
	x1=piece["ox"]+piece["x1"];
	y1=piece["oy"]+piece["y1"];
	x2=piece["ox"]+piece["x2"];
	y2=piece["oy"]+piece["y2"];
	x3=piece["ox"]+piece["x3"];
	y3=piece["oy"]+piece["y3"];
	x4=piece["ox"]+piece["x4"];
	y4=piece["oy"]+piece["y4"];
	while(y1+t<19 && y2+t<19 && y3+t<19 && y4+t<19 && !box[x1][y1+t+1] && !box[x2][y2+t+1] && !box[x3][y3+t+1] && !box[x4][y4+t+1]){
		t++;
	}
	drawBlock(x1,y1+t,"#222","#111");
	drawBlock(x2,y2+t,"#222","#111");
	drawBlock(x3,y3+t,"#222","#111");
	drawBlock(x4,y4+t,"#222","#111");
}

function clearHorizontal(dir){
	
	x1=piece["ox"]+piece["x1"]+dir;
	y1=piece["oy"]+piece["y1"];
	x2=piece["ox"]+piece["x2"]+dir;
	y2=piece["oy"]+piece["y2"];
	x3=piece["ox"]+piece["x3"]+dir;
	y3=piece["oy"]+piece["y3"];
	x4=piece["ox"]+piece["x4"]+dir;
	y4=piece["oy"]+piece["y4"];
	if(x1<0 || x2<0 || x3<0 || x4<0 || x1>9 || x2>9 || x3>9 || x4>9 ||
	   box[x1][y1] || box[x2][y2] || box[x3][y3] || box[x4][y4]) return 0;
	return 1;
}

function rotatePiece(){
	
	// rotate piece (if clear) using block 2 as the center
	if(piece["color"]=="#0a0") return 0; // don't rotate the square shaped piece
	cx=piece["x2"];
	cy=piece["y2"];
	d=Math.sqrt((piece["x1"]-cx)*(piece["x1"]-cx)+(piece["y1"]-cy)*(piece["y1"]-cy));
	p=Math.atan2(piece["x1"]-cx,piece["y1"]-cy);
	x1=cx+Math.round(Math.sin(p+Math.PI/2)*d);
	y1=cy+Math.round(Math.cos(p+Math.PI/2)*d);
	d=Math.sqrt((piece["x3"]-cx)*(piece["x3"]-cx)+(piece["y3"]-cy)*(piece["y3"]-cy));
	p=Math.atan2(piece["x3"]-cx,piece["y3"]-cy);
	x3=cx+Math.round(Math.sin(p+Math.PI/2)*d);
	y3=cy+Math.round(Math.cos(p+Math.PI/2)*d);
	d=Math.sqrt((piece["x4"]-cx)*(piece["x4"]-cx)+(piece["y4"]-cy)*(piece["y4"]-cy));
	p=Math.atan2(piece["x4"]-cx,piece["y4"]-cy);
	x4=cx+Math.round(Math.sin(p+Math.PI/2)*d);
	y4=cy+Math.round(Math.cos(p+Math.PI/2)*d);
	if(x1+piece["ox"]>9 || x3+piece["ox"]>9 || x4+piece["ox"]>9 || x1+piece["ox"]<0 || x3+piece["ox"]<0 || x4+piece["ox"]<0 ||
	   y1+piece["oy"]>19 || y3+piece["oy"]>19 || y4+piece["oy"]>19 || box[x1+piece["ox"]][y1+piece["oy"]] ||
	   box[x3+piece["ox"]][y3+piece["oy"]] || box[x4+piece["ox"]][y4+piece["oy"]]) return 0;
	piece["x1"]=x1;
	piece["y1"]=y1;
	piece["x3"]=x3;
	piece["y3"]=y3;
	piece["x4"]=x4;
	piece["y4"]=y4;
	return 1;
}

function copyPieceToBox(){
	
	box[piece["ox"]+piece["x1"]][piece["oy"]+piece["y1"]]=piece["color"];
	box[piece["ox"]+piece["x2"]][piece["oy"]+piece["y2"]]=piece["color"];
	box[piece["ox"]+piece["x3"]][piece["oy"]+piece["y3"]]=piece["color"];
	box[piece["ox"]+piece["x4"]][piece["oy"]+piece["y4"]]=piece["color"];
	piece=0;
}

function checkCompletedRows(){
	
	for(i=19;i>0;--i){
		c=1;
		for(j=0;j<10;++j) if(!box[j][i])c=0;
		if(c){
			for(i2=i;i2>0;--i2) for(j=0;j<10;++j) box[j][i2]=box[j][i2-1];
			for(j=0;j<10;++j) box[j][0]="";
			rowsCompleted++;
			level=1+parseInt(rowsCompleted/rowsToAdvance);
			dropInterval/=1.035;
		}
	}
}

function doLogic(){
	
	if(!gameover){
		if(!piece)spawnPiece( parseInt(Math.random()*7) );
		if(leftkey && keyTimer < time){
			if(clearHorizontal(-1)){
				piece["ox"]--;
				keyTimer=time+keyInterval;
			}
		}		
		if(rightkey && keyTimer < time){
			if(clearHorizontal(1)){
				piece["ox"]++;
				keyTimer=time+keyInterval;
			}
		}
		if(upkey && rotateTimer < time){
			if(rotatePiece()) rotateTimer=time+keyInterval*4;
		}
		if(spacekey){
			while(clearBelow())piece["oy"]++;
			copyPieceToBox();
			spacekey=0;
		}
		if(piece && downkey){
			if(clearBelow()){
				piece["oy"]++;
			}
		}
		if(piece && time>lastDrop+dropInterval){
			if(clearBelow()){
				lastDrop=time;
				piece["oy"]++;
			}else{
				copyPieceToBox();
			}
		}
		checkCompletedRows();
		stat.innerHTML="Level: "+level+"<br>Rows Completed: "+rowsCompleted+"<br>"+"Rows to Advance: "+(rowsToAdvance-rowsCompleted%rowsToAdvance);
	}else{
		stat.innerHTML="Game Over<br>Hit the space key...";
		if(spacekey) initVars();
	}
}

function frame(){
	
	requestAnimationFrame(frame);
	time+=.01;
	doLogic();
	render();
}

initVars();
frame();