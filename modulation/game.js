(function(){ 
    
    function project3D(x,y,z,vars){

        var p,d;
        x-=vars.camX;
        y-=vars.camY;
        z-=vars.camZ;
        p=Math.atan2(x,z);
        d=Math.sqrt(x*x+z*z);
        x=Math.sin(p-vars.yaw)*d;
        z=Math.cos(p-vars.yaw)*d;
        p=Math.atan2(y,z);
        d=Math.sqrt(y*y+z*z);
        y=Math.sin(p-vars.pitch)*d;
        z=Math.cos(p-vars.pitch)*d;
        var rx1=-1000;
        var ry1=1;
        var rx2=1000;
        var ry2=1;
        var rx3=0;
        var ry3=0;
        var rx4=x;
        var ry4=z;
        var uc=(ry4-ry3)*(rx2-rx1)-(rx4-rx3)*(ry2-ry1);
        if(!uc) return {x:0,y:0,d:-1};
        var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
        var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
        if(!z)z=0.000000001;
        if(ua>0&&ua<1&&ub>0&&ub<1){
            return {
                x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
                y:vars.cy+y/z*vars.scale,
                d:Math.sqrt(x*x+y*y+z*z)
            };
        }else{
            return {
                x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
                y:vars.cy+y/z*vars.scale,
                d:-1
            };
        }
    }


	function elevation(x,y,z){

		var dist = Math.sqrt(x*x+y*y+z*z);
		if(dist && z/dist>=-1 && z/dist <=1) return Math.acos(z / dist);
		return 0.00000001;
	}


	function rgb(col){

		col += 0.000001;
		var r = parseInt((0.5+Math.sin(col)*0.5)*16);
		var g = parseInt((0.5+Math.cos(col)*0.5)*16);
		var b = parseInt((0.5-Math.sin(col)*0.5)*16);
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
	
	
    function transformShape(shape,scaleX,scaleY,scaleZ){

        for(var i=0;i<shape.polys.length;++i){
			for(var j=0;j<shape.polys[i].segs.length;++j){
				shape.polys[i].segs[j].a.x*=scaleX;
				shape.polys[i].segs[j].a.y*=scaleY;
				shape.polys[i].segs[j].a.z*=scaleZ;
				shape.polys[i].segs[j].b.x*=scaleX;
				shape.polys[i].segs[j].b.y*=scaleY;
				shape.polys[i].segs[j].b.z*=scaleZ;

				shape.polys[i].segs[j].oa.x=shape.polys[i].segs[j].a.x;
				shape.polys[i].segs[j].oa.y=shape.polys[i].segs[j].a.y;
				shape.polys[i].segs[j].oa.z=shape.polys[i].segs[j].a.z;
				shape.polys[i].segs[j].ob.x=shape.polys[i].segs[j].b.x;
				shape.polys[i].segs[j].ob.y=shape.polys[i].segs[j].b.y;
				shape.polys[i].segs[j].ob.z=shape.polys[i].segs[j].b.z;
			}
        }
    }


    function Vert(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.ox = x;
        this.oy = y;
        this.oz = z;
    }

	
	function Seg(x1,y1,z1,x2,y2,z2){
		this.a = new Vert(x1,y1,z1);
		this.b = new Vert(x2,y2,z2);
		this.oa = new Vert(x1,y1,z1);
		this.ob = new Vert(x2,y2,z2);
		this.dist=0;
	}


	function Polygon(){

		this.verts=new Array();
		this.dist=0;
	}

	
	function sortFunction(a,b){
		return b.dist-a.dist;
	}


    function process(vars){
		
		var p,d,t;
		p = Math.atan2(vars.camX, vars.camZ);
		d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
		d -= Math.sin(vars.frameNo / 80) / 20;
		t = Math.sin(vars.frameNo / 280) / 75;
		vars.camX = Math.sin(p + t) * d;
		vars.camZ = Math.cos(p + t) * d;
		vars.camY = -Math.sin(vars.frameNo / 120) *12;
		vars.yaw = Math.PI + p + t;
		vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;		

		var p1,p2,d1,d2,t,x1,y1,z1,x2,y2,z2,t;
		
		t=2.5+Math.sin(vars.frameNo/80)*2.5;
		
		for(var i=0;i<vars.shapes.length;++i){
			for(var j=0;j<vars.shapes[i].polys.length;++j){
				for(var k=0;k<vars.shapes[i].polys[j].segs.length;++k){
					x1=vars.shapes[i].polys[j].segs[k].oa.x;
					y1=vars.shapes[i].polys[j].segs[k].oa.y;
					z1=vars.shapes[i].polys[j].segs[k].oa.z;
					p2=elevation(x1,y1,z1);
					t2=Math.sin(p2*2+vars.frameNo/35)/2;
					p1=Math.atan2(x1,y1)+t2;
					d1=Math.sqrt(x1*x1+y1*y1+z1*z1);
					d2=d1+Math.sin(p2*t+vars.frameNo/15)*1.75;
					vars.shapes[i].polys[j].segs[k].a.x=Math.sin(p1)*Math.sin(p2)*d2;
					vars.shapes[i].polys[j].segs[k].a.y=Math.cos(p1)*Math.sin(p2)*d2;
					vars.shapes[i].polys[j].segs[k].a.z=Math.cos(p2)*d1*2;

					x1=vars.shapes[i].polys[j].segs[k].ob.x;
					y1=vars.shapes[i].polys[j].segs[k].ob.y;
					z1=vars.shapes[i].polys[j].segs[k].ob.z;
					p2=elevation(x1,y1,z1);
					t2=Math.sin(p2*2+vars.frameNo/35)/2;
					p1=Math.atan2(x1,y1)+t2;
					d1=Math.sqrt(x1*x1+y1*y1+z1*z1);
					d2=d1+Math.sin(p2*t+vars.frameNo/15)*1.75;
					vars.shapes[i].polys[j].segs[k].b.x=Math.sin(p1)*Math.sin(p2)*d2;
					vars.shapes[i].polys[j].segs[k].b.y=Math.cos(p1)*Math.sin(p2)*d2;
					vars.shapes[i].polys[j].segs[k].b.z=Math.cos(p2)*d1*2;
				}
			}
		}
    }


	function drawFloor(vars){
		
		var x,y,z,d,point,a;
		for (var i = -15; i <= 15; i++) {
			for (var j = -15; j <= 15; j++) {
				x = i*2;
				z = j*2;
				y = vars.floor;
				d = Math.sqrt(x * x + z * z);
				point = project3D(x, y-d*d/35, z, vars);
				if (point.d != -1) {
					size = 40000 / (1 + point.d*point.d);
					a = 0.2 - Math.pow(d / 30, 4) * 0.2;
					if (a > 0) {
						vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(d/26-vars.frameNo/20),[0,128,32],.5+Math.sin(d/6-vars.frameNo/4)/2));
						vars.ctx.globalAlpha = a;
						vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
					}
					size = 15000 / (1 + point.d*point.d);
					a = 0.5 - Math.pow(d / 30, 4) * 0.5;
					if (a > 0) {
						vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(d/26-vars.frameNo/20),[0,128,32],.5+Math.sin(d/6-vars.frameNo/4)/2));
						vars.ctx.globalAlpha = a;
						vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
					}
				}
			}
		}		
		vars.ctx.fillStyle = "#82f";
		for (var i = -15; i <= 15; i += 1) {
			for (var j = -15; j <= 15; j += 1) {
				x = i*2;
				z = j*2;
				y = -vars.floor;
				d = Math.sqrt(x * x + z * z);
				point = project3D(x, y+d*d/35, z, vars);
				if (point.d != -1) {
					size = 40000 / (1 + point.d*point.d);
					a = 0.2 - Math.pow(d / 30, 4) * 0.2;
					if (a > 0) {
						vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(-d/26-vars.frameNo/20),[32,0,128],.5+Math.sin(-d/6-vars.frameNo/4)/2));
						vars.ctx.globalAlpha = a;
						vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
					}
					size = 15000 / (1 + point.d*point.d);
					a = 0.5 - Math.pow(d / 30, 4) * 0.5;
					if (a > 0) {
						vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(-d/26-vars.frameNo/20),[32,0,128],.5+Math.sin(-d/6-vars.frameNo/4)/2));
						vars.ctx.globalAlpha = a;
						vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
					}
				}
			}
		}		
	}
	

    function draw(vars){

		vars.ctx.globalAlpha=.35;
		vars.ctx.fillStyle="#001";//rgb(vars.frameNo/10);
        vars.ctx.fillRect(0, 0, vars.canvas.width, vars.canvas.height);
		
		drawFloor(vars);
		
		var x1,y1,z1,x2,y2,z2,point1,point2;
		

		for(var i=0;i<vars.shapes.length;++i){
			vars.shapes[i].polys.sort(sortFunction);
			for(var j=0;j<vars.shapes[i].polys.length;++j){
				vars.ctx.globalAlpha=.45;
				vars.ctx.beginPath();
				vars.ctx.fillStyle=rgb(vars.shapes[i].polys[j].segs[0].a.z/4-vars.frameNo/20);
				for(var k=0;k<=vars.shapes[i].polys[j].segs.length;++k){
					x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[k%vars.shapes[i].polys[j].segs.length].a.x;
					y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[k%vars.shapes[i].polys[j].segs.length].a.y;
					z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[k%vars.shapes[i].polys[j].segs.length].a.z;
					point1=project3D(x,y,z,vars);
					if(point1.d != -1){
						vars.shapes[i].polys[j].dist=point1.d;
						if(!k){
							vars.ctx.moveTo(point1.x,point1.y);
						}else{
							vars.ctx.lineTo(point1.x,point1.y);
						}
						
					}
				}
				vars.ctx.fill();
				
				vars.ctx.globalAlpha=.45;
				for(var k=0;k<vars.shapes[i].polys[j].segs.length;++k){
					x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[k].a.x;
					y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[k].a.y;
					z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[k].a.z;
					point1=project3D(x,y,z,vars);
					if(point1.d != -1){
						x=vars.shapes[i].x+vars.shapes[i].polys[j].segs[k].b.x;
						y=vars.shapes[i].y+vars.shapes[i].polys[j].segs[k].b.y;
						z=vars.shapes[i].z+vars.shapes[i].polys[j].segs[k].b.z;
						point2=project3D(x,y,z,vars);
						if(point2.d != -1){
							vars.ctx.strokeStyle="#fff";
							vars.ctx.lineWidth=1+500/(1+point1.d*point1.d);
							vars.ctx.beginPath();
							vars.ctx.moveTo(point1.x,point1.y);
							vars.ctx.lineTo(point2.x,point2.y);
							vars.ctx.stroke();
						}
					}
				}
			}
		}
	}
	

	function subdivide(shape,subdivisions){

		var t=shape.segs.length;
		for(var i=0;i<t;++i){
			var x1=shape.segs[i].a.x;
			var y1=shape.segs[i].a.y;
			var z1=shape.segs[i].a.z;
			var x2=(shape.segs[i].b.x-x1)/subdivisions;
			var y2=(shape.segs[i].b.y-y1)/subdivisions;
			var z2=(shape.segs[i].b.z-z1)/subdivisions;
			shape.segs[i].b.x=x1+x2;
			shape.segs[i].b.y=y1+y2;
			shape.segs[i].b.z=z1+z2;
			var x3=x2;
			var y3=y2;
			var z3=z2;
			for(var k=0;k<subdivisions-1;++k){
				shape.segs.push(new Seg(x1+x2,y1+y2,z1+z2,x1+x2+x3,y1+y2+y3,z1+z2+z3));
				x2+=x3;
				y2+=y3;
				z2+=z3;
			}
		}
	}


	function loadCube(x,y,z,lineWidth){

		var shape={};
		shape.x=x;
		shape.y=y;
		shape.z=z;
		shape.segs=[];
		shape.segs.push(new Seg(-1,-1,-1,1,-1,-1));
		shape.segs.push(new Seg(1,-1,-1,1,1,-1));
		shape.segs.push(new Seg(1,1,-1,-1,1,-1));
		shape.segs.push(new Seg(-1,1,-1,-1,-1,-1));
		shape.segs.push(new Seg(-1,-1,1,1,-1,1));
		shape.segs.push(new Seg(1,-1,1,1,1,1));
		shape.segs.push(new Seg(1,1,1,-1,1,1));
		shape.segs.push(new Seg(-1,1,1,-1,-1,1));
		shape.segs.push(new Seg(-1,-1,-1,-1,-1,1));
		shape.segs.push(new Seg(1,-1,-1,1,-1,1));
		shape.segs.push(new Seg(1,1,-1,1,1,1));
		shape.segs.push(new Seg(-1,1,-1,-1,1,1));
		shape.lineWidth=lineWidth;
		return shape;
	}


	function mobileCheck() {
	 
	 var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	}

	function pushVert(p1,p2,dist,poly){
		
		x=Math.sin(p1)*Math.sin(p2)*dist;
		z=Math.cos(p1)*Math.sin(p2)*dist;
		y=Math.cos(p2)*dist;
		poly.verts.push(new Vert(x,y,z));
	}


	function expandShape(shape,convexity){
		
		for(j=0;j<shape.polys.length;++j){
			for(k=0;k<shape.polys[j].verts.length;++k){
				x=shape.polys[j].verts[k].x;
				y=shape.polys[j].verts[k].y;
				z=shape.polys[j].verts[k].z;
				d=Math.sqrt(x*x+y*y+z*z);
				p1=Math.atan2(x,y);
				p2=elevation(x,y,z);
				d2=d+(1-d)*convexity;
				shape.polys[j].verts[k].x=Math.sin(p1)*Math.sin(p2)*d2;
				shape.polys[j].verts[k].y=Math.cos(p1)*Math.sin(p2)*d2;
				shape.polys[j].verts[k].z=Math.cos(p2)*d2;
			}
		}
		return shape;
	}

	function segmentize(source){

		var polys=[],x1,y1,z1,x2,y2,z2;
		for(var i=0;i<source.length;++i){
			var poly={};
			poly.segs=[];
			for(var j=0;j<source[i].verts.length;++j){
				x1=source[i].verts[j].x;
				y1=source[i].verts[j].y;
				z1=source[i].verts[j].z;
				if(j<source[i].verts.length-1){
					x2=source[i].verts[j+1].x;
					y2=source[i].verts[j+1].y;
					z2=source[i].verts[j+1].z;
				}else{
					x2=source[i].verts[0].x;
					y2=source[i].verts[0].y;
					z2=source[i].verts[0].z;
				}
				poly.segs.push(new Seg(x1,y1,z1,x2,y2,z2));
			}
			polys.push(poly);
		}
		return polys;
	}	
	
	
	function Shape(x,y,z){
		
		this.polys=[];
		this.x=x, this.y=y, this.z=z;
	}

	
	function Icosahedron(x,y,z){
		
		var size=1, phi = 1.61803398875;
		this.polys=[];
		this.x=x, this.y=y, this.z=z, this.dist=0;
		x1=-phi, y1=-1, z1=0, x2=phi, y2=-1, z2=0, x3=phi, y3=1, z3=0, x4=-phi, y4=1, z4=0,
		y5=-phi, z5=-1, x5=0, y6=phi, z6=-1, x6=0, y7=phi, z7=1, x7=0, y8=-phi, z8=1, x8=0,
		z9=-phi, x9=-1, y9=0, z10=phi, x10=-1, y10=0, z11=phi, x11=1, y11=0, z12=-phi, x12=1, y12=0;
		p={}; p.verts=[];
		p.verts.push(new Vert(x1,y1,z1));
		p.verts.push(new Vert(x5,y5,z5));
		p.verts.push(new Vert(x8,y8,z8));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x2,y2,z2));
		p.verts.push(new Vert(x5,y5,z5));
		p.verts.push(new Vert(x8,y8,z8));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x3,y3,z3));
		p.verts.push(new Vert(x6,y6,z6));
		p.verts.push(new Vert(x7,y7,z7));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x4,y4,z4));
		p.verts.push(new Vert(x6,y6,z6));
		p.verts.push(new Vert(x7,y7,z7));
		this.polys.push(p);	
		p={}; p.verts=[];
		p.verts.push(new Vert(x9,y9,z9));
		p.verts.push(new Vert(x12,y12,z12));
		p.verts.push(new Vert(x5,y5,z5));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x9,y9,z9));
		p.verts.push(new Vert(x12,y12,z12));
		p.verts.push(new Vert(x6,y6,z6));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x10,y10,z10));
		p.verts.push(new Vert(x11,y11,z11));
		p.verts.push(new Vert(x7,y7,z7));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x10,y10,z10));
		p.verts.push(new Vert(x11,y11,z11));
		p.verts.push(new Vert(x8,y8,z8));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x1,y1,z1));
		p.verts.push(new Vert(x9,y9,z9));
		p.verts.push(new Vert(x4,y4,z4));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x1,y1,z1));
		p.verts.push(new Vert(x10,y10,z10));
		p.verts.push(new Vert(x4,y4,z4));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x2,y2,z2));
		p.verts.push(new Vert(x11,y11,z11));
		p.verts.push(new Vert(x3,y3,z3));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x2,y2,z2));
		p.verts.push(new Vert(x12,y12,z12));
		p.verts.push(new Vert(x3,y3,z3));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x2,y2,z2));
		p.verts.push(new Vert(x11,y11,z11));
		p.verts.push(new Vert(x8,y8,z8));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x2,y2,z2));
		p.verts.push(new Vert(x12,y12,z12));
		p.verts.push(new Vert(x5,y5,z5));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x1,y1,z1));
		p.verts.push(new Vert(x10,y10,z10));
		p.verts.push(new Vert(x8,y8,z8));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x1,y1,z1));
		p.verts.push(new Vert(x9,y9,z9));
		p.verts.push(new Vert(x5,y5,z5));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x4,y4,z4));
		p.verts.push(new Vert(x9,y9,z9));
		p.verts.push(new Vert(x6,y6,z6));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x3,y3,z3));
		p.verts.push(new Vert(x12,y12,z12));
		p.verts.push(new Vert(x6,y6,z6));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x4,y4,z4));
		p.verts.push(new Vert(x10,y10,z10));
		p.verts.push(new Vert(x7,y7,z7));
		this.polys.push(p);
		p={}; p.verts=[];
		p.verts.push(new Vert(x3,y3,z3));
		p.verts.push(new Vert(x11,y11,z11));
		p.verts.push(new Vert(x7,y7,z7));
		this.polys.push(p);
	}
	
	
	function subdivide(shape,subdivisions){
		
		for(var j=0;j<subdivisions;++j){
			newShape=new Shape(shape.x,shape.y,shape.z);
			for(var k=0;k<shape.polys.length;++k){
				x1=(shape.polys[k].verts[1].x+shape.polys[k].verts[0].x)/2;
				y1=(shape.polys[k].verts[1].y+shape.polys[k].verts[0].y)/2;
				z1=(shape.polys[k].verts[1].z+shape.polys[k].verts[0].z)/2;
				x2=(shape.polys[k].verts[2].x+shape.polys[k].verts[1].x)/2;
				y2=(shape.polys[k].verts[2].y+shape.polys[k].verts[1].y)/2;
				z2=(shape.polys[k].verts[2].z+shape.polys[k].verts[1].z)/2;
				x3=(shape.polys[k].verts[0].x+shape.polys[k].verts[2].x)/2;
				y3=(shape.polys[k].verts[0].y+shape.polys[k].verts[2].y)/2;
				z3=(shape.polys[k].verts[0].z+shape.polys[k].verts[2].z)/2;
				p=new Polygon();
				p.verts.push(new Vert(shape.polys[k].verts[0].x,shape.polys[k].verts[0].y,shape.polys[k].verts[0].z));
				p.verts.push(new Vert(x1,y1,z1));
				p.verts.push(new Vert(x3,y3,z3));
				newShape.polys.push(p);
				p=new Polygon();
				p.verts.push(new Vert(x1,y1,z1));
				p.verts.push(new Vert(shape.polys[k].verts[1].x,shape.polys[k].verts[1].y,shape.polys[k].verts[1].z));
				p.verts.push(new Vert(x2,y2,z2));
				newShape.polys.push(p);
				p=new Polygon();
				p.verts.push(new Vert(x3,y3,z3));
				p.verts.push(new Vert(x2,y2,z2));
				p.verts.push(new Vert(shape.polys[k].verts[2].x,shape.polys[k].verts[2].y,shape.polys[k].verts[2].z));
				newShape.polys.push(p);
				p=new Polygon();
				p.verts.push(new Vert(x3,y3,z3));
				p.verts.push(new Vert(x1,y1,z1));
				p.verts.push(new Vert(x2,y2,z2));
				newShape.polys.push(p);
			}
			shape=newShape;
		}
		return shape;
	}

	
	function truncate(shape,vars,modulate){
		var x1,y1,z1,x2,y2,z2,seg,t,t2,polys;
		for(var i=0;i<shape.polys.length;++i){
			t=shape.polys[i].segs.length;
			if(modulate){
				t2=(2/3)*(1+Math.sin(vars.frameNo/10+Math.PI*2/shape.polys.length*i*4)/4);
			}else{
				t2=(2/3);
			}
			shape.polys[i].col=t2;
			for(var j=0;j<t;++j){
				x1=shape.polys[i].segs[j].a.x;
				y1=shape.polys[i].segs[j].a.y;
				z1=shape.polys[i].segs[j].a.z;
				x2=shape.polys[i].segs[j].b.x;
				y2=shape.polys[i].segs[j].b.y;
				z2=shape.polys[i].segs[j].b.z;
				shape.polys[i].segs[j].a.x=x2-(x2-x1)*t2;
				shape.polys[i].segs[j].a.y=y2-(y2-y1)*t2;
				shape.polys[i].segs[j].a.z=z2-(z2-z1)*t2;
				shape.polys[i].segs[j].b.x=x1+(x2-x1)*t2;
				shape.polys[i].segs[j].b.y=y1+(y2-y1)*t2;
				shape.polys[i].segs[j].b.z=z1+(z2-z1)*t2;
			}
			poly={};
			poly.segs=[];
			poly.col=shape.polys[i].col;
			for(var j=0;j<t;++j){
				x1=shape.polys[i].segs[j].b.x;
				y1=shape.polys[i].segs[j].b.y;
				z1=shape.polys[i].segs[j].b.z;
				if(j<t-1){
					x2=shape.polys[i].segs[j+1].a.x;
					y2=shape.polys[i].segs[j+1].a.y;
					z2=shape.polys[i].segs[j+1].a.z;
				}else{
					x2=shape.polys[i].segs[0].a.x;
					y2=shape.polys[i].segs[0].a.y;
					z2=shape.polys[i].segs[0].a.z;					
				}
				seg = new Seg(x1,y1,z1,x2,y2,z2);
				poly.segs.push(shape.polys[i].segs[j]);
				poly.segs.push(seg);
			}
			shape.polys[i]=poly;
		}
		return shape;
	}
	
	
    function loadScene(vars){
		
		var x,y,z,x1,y1,z1,x2,y2,z2,x3,y3,z3;
		vars.shapes=[];
		
		x=0;
		y=0;
		z=0;
		shape=new Icosahedron(x,y,z);
		shape=subdivide(shape,2);
		shape=expandShape(shape,1)
		shape.polys=segmentize(shape.polys);
		shape=truncate(shape,vars,0);
		vars.shapes.push(shape);
		transformShape(vars.shapes[vars.shapes.length-1],3.5,3.5,3.5);
    }

	
    function frame(vars) {

        if(vars === undefined){
            var vars={};
			vars.canvas=document.createElement("canvas");
			document.body.appendChild(vars.canvas);
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
            vars.camX = 0;
            vars.camY = 0;
            vars.camZ = -22;
            vars.pitch = 0;
            vars.yaw = 0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
            vars.mx=vars.cx;
            vars.my=vars.cy;
            vars.bounding=10;
            vars.scale=1000;
			vars.floor=25;
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