function initVars(){

	pi=Math.PI;
	canvas=$("#canvas")[0];
	ctx=canvas.getContext("2d");
	canvas.width=1366;
	canvas.height=768;
	cx=canvas.width/2;
	cy=canvas.height/2;
	frames=pt=shownPt=0;
	seed=phase=curColor=0;
	res=10;
}

function rand(){
	seed+=.001234;
	return parseFloat('0.'+Math.sin(seed).toString().substr(6));
}

function getCellColor(i,j){
	
	RGB1=terrain[i][j].type?color1:color2;
	RGB2=terrain[i][j].type?color2:color1;
	w1=terrain[i][j].differentNeighbors/8;
	w2=1-w1;
	return [w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]];
}

function loadTerrain(){
	
	cols=16*res;
	rows=9*res;
	advanceColors();
	terrain=new Array(cols);
	for(i=0;i<cols;++i){
		terrain[i]=new Array(rows);
		for(j=0;j<rows;++j){
			terrain[i][j]=new Object();
			terrain[i][j].type=rand()<.5?0:1;
		}
	}
	
	for(k=0;k<8;++k){
		temp=JSON.parse(JSON.stringify(terrain));		
		for(i=0;i<terrain.length;++i){
			for(j=0;j<terrain[i].length;++j){
				cell=terrain[i][j];
				l=i?i-1:terrain.length-1;
				u=j?j-1:terrain[0].length-1;
				r=i<terrain.length-1?i+1:0;
				d=j<terrain[0].length-1?j+1:0;
				left=terrain[l][j];
				up=terrain[i][u];
				right=terrain[r][j];
				down=terrain[i][d];
				upleft=terrain[l][u];
				upright=terrain[r][u];
				downright=terrain[r][d];
				downleft=terrain[l][d];
				t=(cell.type!=up.type?1:0)+
				  (cell.type!=down.type?1:0)+
				  (cell.type!=left.type?1:0)+
				  (cell.type!=right.type?1:0)+
				  (cell.type!=upleft.type?1:0)+
				  (cell.type!=upright.type?1:0)+
				  (cell.type!=downleft.type?1:0)+
				  (cell.type!=downright.type?1:0);
				temp[i][j].type=t<5?cell.type:(cell.type?0:1);
			}
		}
		terrain=temp;
	}
	
	for(i=0;i<terrain.length;++i){
		for(j=0;j<terrain[i].length;++j){
			cell=terrain[i][j];
			l=i?i-1:terrain.length-1;
			u=j?j-1:terrain[0].length-1;
			r=i<terrain.length-1?i+1:0;
			d=j<terrain[0].length-1?j+1:0;
			left=terrain[l][j];
			up=terrain[i][u];
			right=terrain[r][j];
			down=terrain[i][d];
			upleft=terrain[l][u];
			upright=terrain[r][u];
			downright=terrain[r][d];
			downleft=terrain[l][d];
			cell.differentNeighbors=(cell.type!=up.type?1:0)+
								    (cell.type!=down.type?1:0)+
								    (cell.type!=left.type?1:0)+
								    (cell.type!=right.type?1:0)+
								    (cell.type!=upleft.type?1:0)+
								    (cell.type!=upright.type?1:0)+
								    (cell.type!=downleft.type?1:0)+
								    (cell.type!=downright.type?1:0);
			cell.color=getCellColor(i,j);
		}
	}
	return terrain;
}

function rgb(col){
	
	col+=.000001;
	var r = parseInt((.5+Math.sin(col)*.5)*16);
	var g = parseInt((.5+Math.cos(col)*.5)*16);
	var b = parseInt((.5-Math.sin(col)*.5)*16);
	return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}

function advanceColors(){
	
	curColor+=.35;
	p1=curColor;
	p2=curColor+pi;
	color2=[.5+Math.sin(p2)/2,.5+Math.cos(p2)/2,.5-Math.sin(p2)/2];
	color1=[.5+Math.sin(p1)/2,.5+Math.cos(p1)/2,.5-Math.sin(p1)/2];
}

function doLogic(){

	frames++;
	if(phase<.95){
		phase+=.025;
	}else{
		phase=0;
		terrain2=terrain1;
		terrain1=loadTerrain();
	}
}

function colorString(arr){

	var r = parseInt(arr[0]*15);
	var g = parseInt(arr[1]*15);
	var b = parseInt(arr[2]*15);
	return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}

function interpolateColors(RGB1,RGB2,degree){
	
	w1=degree;
	w2=1-w1;
	return colorString([w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]]);
}

function draw(){
	
	ctx.clearRect(0,0,cx*2,cy*2);
	
	width=cx*2/cols;
	height=cy*2/rows;
	for(i=0;i<cols;++i){
		for(j=0;j<rows;++j){
			ctx.fillStyle=interpolateColors(terrain1[i][j].color,terrain2[i][j].color,phase);
			x=i*width;
			y=j*height;
			ctx.globalAlpha=1;
			ctx.fillRect(x,y,width+1,height+1);
		}
	}
}

function frame(){
	doLogic();
	draw();
}

initVars();
terrain1=loadTerrain();
terrain2=loadTerrain();
setInterval(frame,30);
