html = document.documentElement;
cx=html.clientWidth/2;
cy=html.clientHeight/2;
pi=Math.acos(-1);
var timer,mx=0,my=0,oldMouseX=0,oldMouseY=0,mbutton=0,mp=0,mx1,my1,mx2,my2;
var objects=[],vertex=[0,0,0,0,0,0];
var bodies=[];


function mobileCheck() {
 
 var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function initialize(){
	if(mobileCheck()){
		document.getElementById("canvas").style.display = "none";
	}else{
		ms=0;
		reshape();
		ctx1.font = "12px Arial";
		loadScene();
		startTimer();
	}
}

function loadScene(){
	
	var initV=1,p,initStars=100;

	objects=[];
	for(var i=0;i<initStars;++i){
		vertex[0]=Math.random()*cx*2;//x
		vertex[1]=Math.random()*cy*2;//y
		p=pi*2*Math.random();
		vertex[2]=Math.sin(p)*initV;//vx
		vertex[3]=Math.cos(p)*initV;//vy
		vertex[4]=100+Math.random()*210;//radius[mass]
		vertex[5]=new Image();
		switch(parseInt(Math.random()*6)){
			case 0: vertex[5].src="red_star.png"; break;
			case 1: vertex[5].src="orange_star.png"; break;
			case 2: vertex[5].src="yellow_star.png"; break;
			case 3: vertex[5].src="green_star.png"; break;
			case 4: vertex[5].src="blue_star.png"; break;
			case 5: vertex[5].src="purple_star.png"; break;
		}
		objects.push(vertex.slice());
	}
}

function stopTimer(){
	clearInterval(timer);
}

function startTimer(){clearInterval(timer);
	timer=setInterval(process, 25);
}

function render(){
	var x,y,x1,y1,x2,y2,tx=0,ty=0,sx=cx,sy=cy;
	
	sx=mx;
	sy=my;

	ctx1.globalAlpha=.15;
	
	for(var i=0;i<objects.length;++i){
		objects[i][2]/=1.0125;
		objects[i][3]/=1.0125;
		p=Math.random()*pi*2;
		objects[i][2]+=Math.sin(p)/4;
		objects[i][3]+=Math.cos(p)/4;
		objects[i][0]+=objects[i][2];
		objects[i][1]+=objects[i][3];
		tx+=objects[i][0];
		ty+=objects[i][1];
		
		dist=1+Math.sqrt((sx-objects[i][0])*(sx-objects[i][0])+(sy-objects[i][1])*(sy-objects[i][1]))/100;
		p=Math.atan2(objects[i][0]-sx,objects[i][1]-sy);
		objects[i][2]-=Math.sin(p)*150/objects[i][4]/dist;
		objects[i][3]-=Math.cos(p)*150/objects[i][4]/dist;
		ctx1.drawImage(objects[i][5],0,0,objects[i][5].width,objects[i][5].height,objects[i][0]-objects[i][4]/2,objects[i][1]-objects[i][4]/2,objects[i][4],objects[i][4]);
	}

}

function process(){
	ms+=.1;
	clear();
	render();
}

function clear(){
	ctx1.clearRect ( 0 , 0 , cx*2 , cy*2 );
}

function getMousePos(canvas1, evt) {
	var rect = canvas1.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function reshape(){
	canvas1 = document.getElementById("canvas");
	ctx1 = canvas1.getContext("2d");
	canvas1.width=document.body.clientWidth;
	canvas1.height=document.body.clientHeight;
	cx=canvas1.width/2;
	cy=canvas1.height/2;
	cd=Math.sqrt(cx*cx+cy*cy);
	window.addEventListener("resize", function(){
		canvas1.width=document.body.clientWidth;
		canvas1.height=document.body.clientHeight;
		cx=canvas1.width/2;
		cy=canvas1.height/2;
		cd=Math.sqrt(cx*cx+cy*cy);		
	});
	document.body.addEventListener('mousemove', function(evt) {
		var mousePos = getMousePos(canvas1, evt);
		mx=mousePos.x;
		my=mousePos.y;
	}, false);
	document.body.addEventListener("touchstart", function(e){
		e.preventDefault();
		var rect = canvas1.getBoundingClientRect();
		mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas1.width);
		my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas1.height);
	}, true);
	document.body.addEventListener("touchend", function(e){
		vars.leftButton=0;
	}, true);
	document.body.addEventListener("touchmove", function(e){
		e.preventDefault();
		var rect = canvas1.getBoundingClientRect();
		mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas1.width);
		my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas1.height);
	}, true);
}
initialize();