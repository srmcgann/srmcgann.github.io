function initVars(){

	pi=Math.PI;
	canvas=$("#canvas")[0];
	ctx=canvas.getContext("2d");
	canvas.width=1366;
	canvas.height=768;
	cx=canvas.width/2;
	cy=canvas.height/2;
	frames=0;
	seed=20;
	res=10;
	cols=16*res;
	rows=9*res;
}

function rand(){
	seed+=.1234;
	return parseFloat('0.'+Math.sin(seed).toString().substr(6));
}

function loadControlPoints(){
	
	points=25;
	controls=new Array(points);
	for(i=0;i<points;++i){
		controls[i]=new Object();
		controls[i].x=parseInt(rand()*cols);
		controls[i].y=parseInt(rand()*rows);
		controls[i].vx=0;//.5-Math.random();
		controls[i].vy=0;//.5-Math.random();
	}
}

function loadTerrain(){
	
	terrain=new Array(cols);
	max=0;
	for(i=0;i<cols;++i){
		terrain[i]=new Array(rows);
		for(j=0;j<rows;++j){
			terrain[i][j]=new Object();
			d1=d2=0;
			for(k=0;k<points;++k){
				d1+=Math.sqrt((i-controls[k].x)*(i-controls[k].x)+(j-controls[k].y)*(j-controls[k].y));
			}
			c=1;
			for(k=0;k<points;++k){
				d2=Math.sqrt((i-controls[k].x)*(i-controls[k].x)+(j-controls[k].y)*(j-controls[k].y));
				c*=1-(1-(d2/d1));
			}
			if(c>max)max=c;
			terrain[i][j].color=c;
		}
	}
	for(i=0;i<cols;++i){
		for(j=0;j<rows;++j){
			terrain[i][j].color/=max;
		}
	}
	for(i=0;i<cols;++i){
		for(j=0;j<rows;++j){			
			cell=terrain[i][j];
			l=i?i-1:cols-1;
			u=j?j-1:rows-1;
			r=i<cols-1?i+1:0;
			d=j<rows-1?j+1:0;
			left=terrain[l][j];
			up=terrain[i][u];
			right=terrain[r][j];
			down=terrain[i][d];
			upleft=terrain[l][u];
			upright=terrain[r][u];
			downright=terrain[r][d];
			downleft=terrain[l][d];
			c=parseInt(cell.color*15);
			cell.differentNeighbors=(c!=parseInt(up.color*15)?1:0)+
								    (c!=parseInt(down.color*15)?1:0)+
								    (c!=parseInt(left.color*15)?1:0)+
								    (c!=parseInt(right.color*15)?1:0)+
								    (c!=parseInt(upleft.color*15)?1:0)+
								    (c!=parseInt(upright.color*15)?1:0)+
								    (c!=parseInt(downleft.color*15)?1:0)+
								    (c!=parseInt(downright.color*15)?1:0);
		}
	}
}

function rgb(col){
	
	col+=.000001;
	var r = parseInt((.5+Math.sin(col)*.5)*16);
	var g = parseInt((.5+Math.cos(col)*.5)*16);
	var b = parseInt((.5-Math.sin(col)*.5)*16);
	return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}

function doLogic(){

	frames++;
	for(i=0;i<controls.length;++i){
		if(controls[i].x+controls[i].vx>=cols || controls[i].x+controls[i].vx<0)controls[i].vx*=-1;
		if(controls[i].y+controls[i].vy>=rows || controls[i].y+controls[i].vy<0)controls[i].vy*=-1;
		controls[i].x+=controls[i].vx;
		controls[i].y+=controls[i].vy;
	}
	loadTerrain();
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
	ctx.strokeStyle="#fff";
	ctx.font="16px Square721";
	for(i=0;i<cols;++i){
		for(j=0;j<rows;++j){
			if(parseInt(terrain[i][j].color*15)==2){
				x=i*width;
				y=j*height;
				ctx.globalAlpha=1;
				col1=[terrain[i][j].color,terrain[i][j].color,terrain[i][j].color];
				//p=terrain[i][j].color*pi*(4.5-Math.cos(frames/16)*4)+frames/12;
				//col2=[.5+Math.sin(p)/2,.5+Math.cos(p)/2,.5-Math.sin(p)/2];
				//ctx.fillStyle=interpolateColors(col2,col1,.5-Math.cos(frames/42)/2);
				c=1/(1+terrain[i][j].differentNeighbors/2);
				ctx.fillStyle=colorString([c,c,c]);
				ctx.fillRect(x,y,width+1,height+1);
			}
		}
	}
}

function frame(){
	doLogic();
	draw();
}

initVars();
loadControlPoints();
loadTerrain();
setInterval(frame,20);
