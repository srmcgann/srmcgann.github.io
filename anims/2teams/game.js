function initVars() {

	frames=0;
	fisheye=1;
	camera = new THREE.PerspectiveCamera( 70/fisheye, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.z = 3500;
	camera.target = new THREE.Vector3(0, 0, 0);
	scene = new THREE.Scene();

	cubeSize=100;
	texture = new THREE.TextureLoader().load('texture.png');
	geometry = new THREE.BoxBufferGeometry(cubeSize/fisheye, cubeSize/fisheye, cubeSize/fisheye);
	rows=7;
	cols=13;
	bars=6;

	renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true });
	renderer.autoClearColor = false;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
	interpolation=0;
	interpolationSteps=6;
	COL1=0x00CC33;
	COL2=0x6600FF;
	purpleScore=0;
	greenScore=0;
}

function loadText(text, color){

	loader = new THREE.FontLoader();
	loader.load( 'Square721 BT_Roman.json', function ( font) {
		textGeometry = new THREE.TextGeometry( text, {
			font: font,
			size: 50,
			height: 12,
			curveSegments: 20,
			bevelThickness: 3,
			bevelSize: 3,
			bevelEnabled: true
		});
		textMaterial = new THREE.MeshPhongMaterial( { color: color, specular: 0xffffff } );
		mesh = new THREE.Mesh( textGeometry, textMaterial );
		mesh.material.opacity = .45;
		mesh.position.x=-200;
		mesh.position.z=3300;
		scene.add( mesh );
	});
	//scene.add(new THREE.AmbientLight(0x505050));
	var light = new THREE.SpotLight(0xffffff, 1.5);
	light.position.set(200, 6000, 6000);
	light.castShadow = true;
	light.shadow.camera.near = 200;
	light.shadow.camera.far = camera.far;
	light.shadow.camera.fov = 50;
	light.shadow.bias = - 0.000022;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	scene.add(light);
	frames=0;
}

function loadScore(){

	loader = new THREE.FontLoader();
	loader.load( 'Square721 BT_Roman.json', function ( font) {
		textGeometry = new THREE.TextGeometry( "Purple: "+purpleScore, {
			font: font,
			size: 8,
			height: 12,
			curveSegments: 3
		});
		textMaterial = new THREE.MeshPhongMaterial( { color: 0x8800ff, specular: 0xffffff } );
		mesh = new THREE.Mesh( textGeometry, textMaterial );
		mesh.material.opacity = 1;
		mesh.position.x=-20;
		mesh.position.y=120;
		mesh.position.z=3300;
		mesh.rotation.x = Math.PI *2/360*30;
		scene.add( mesh );
	});
	loader.load( 'Square721 BT_Roman.json', function ( font) {
		textGeometry = new THREE.TextGeometry( "Green: "+greenScore, {
			font: font,
			size: 8,
			height: 12,
			curveSegments: 3
		});
		textMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00, specular: 0xffffff } );
		mesh = new THREE.Mesh( textGeometry, textMaterial );
		mesh.material.opacity = 1;
		mesh.position.x=-19;
		mesh.position.y=105;
		mesh.position.z=3300;
		mesh.rotation.x = Math.PI *2/360*30;
		scene.add( mesh );
	});
}

function colorHex(arr){

	var r = parseInt(arr[0]*15);
	var g = parseInt(arr[1]*15);
	var b = parseInt(arr[2]*15);
	return parseInt("0x"+r.toString(16)+r.toString(16)+g.toString(16)+g.toString(16)+b.toString(16)+b.toString(16));
}

function interpolateColors(RGB1,RGB2,degree){
	
	w1=degree;
	w2=1-w1;
	return colorHex([w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]]);
}


function loadScene(){
	
	camera.lookAt(camera.target);
	
	for( var i = scene.children.length - 1; i >= 0; i--) {
		obj = scene.children[i];
		scene.remove(obj);
	}
	cubes=new Array();
	for(i=0;i<rows;++i){
		for(j=0;j<cols;++j){
			for(k=0;k<bars;++k){
				material = new THREE.MeshBasicMaterial( { map: texture } );
				mesh = new THREE.Mesh( geometry, material )
				obj=new Object();
				obj.mesh=mesh;
				obj.id=parseInt(Math.random()*2);
				cubes.push(obj);
				mesh.material.transparent = true;
				mesh.material.depthTest = true;
				mesh.material.depthWrite = false;
				do{
					mesh.position.x=-(cols/2-.5)*cubeSize*4/fisheye+(parseInt(Math.random()*cols*cubeSize*4))/fisheye;
					mesh.position.y=-200-(rows/2-.5)*cubeSize*4/fisheye+(parseInt(Math.random()*rows*cubeSize*4))/fisheye;
					mesh.position.z=-(bars/2-.5)*cubeSize*4/fisheye+(parseInt(Math.random()*bars*cubeSize*4))/fisheye;
					obj.x1=obj.x2=mesh.position.x;
					obj.y1=obj.y2=mesh.position.y;
					obj.z1=obj.z2=mesh.position.z;
					placed=true;
					for(m=0;m<cubes.length-1;++m){
						if(cubes[m].mesh.position.x==mesh.position.x && cubes[m].mesh.position.y==mesh.position.y && cubes[m].mesh.position.z==mesh.position.z) placed=false;
					}
				}while(!placed);
				mesh.material.opacity = .1;
				mesh.material.color.setHex(obj.id?COL1:COL2);
				scene.add(mesh);
			}
		}
	}

	plane = new THREE.Mesh( new THREE.PlaneGeometry( 200000, 100000 ), new THREE.MeshBasicMaterial( { transparent: true, opacity: 0.075 } ) );
	plane.material.color.setHex(0x000000);
	plane.position.z = -10000;
	scene.add( plane );


	shroud=0;
	renderer.setClearColor( interpolateColors([1,0,0],[0,0,0],shroud));
	textLoaded=0;
	moving=false;
	scene.add(new THREE.AmbientLight(0xffffff));
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function frame() {
	
	speed=1;
	frames++;

	if(!moving || shroud){
		for(i=0;i<cubes.length;++i){
			if(!shroud){
				mind1=10000000;
				mind2=10000000;
				t1=t2=-1;
				x1=cubes[i].mesh.position.x;
				y1=cubes[i].mesh.position.y;
				z1=cubes[i].mesh.position.z;
				
				for(j=0;j<cubes.length;++j){
					if(i!=j){
						x2=cubes[j].mesh.position.x;
						y2=cubes[j].mesh.position.y;
						z2=cubes[j].mesh.position.z;				
						d=((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)+(z2-z1)*(z2-z1));
						if(cubes[i].id != cubes[j].id){
							if(d<mind1){
								mind1=d;
								t1=j;
							}
						}else{
							if(d<mind2){
								mind2=d;
								t2=j;
							}
						}
					}
				}
			}
			if(t1!=-1){
				x2=cubes[t1].x2;
				y2=cubes[t1].y2;
				z2=cubes[t1].z2;
				difx=Math.abs(x2-x1);
				dify=Math.abs(y2-y1);
				difz=Math.abs(z2-z1);
				
				switch(Math.max(difx,dify,difz)){
					case difx: dirx=x2>x1?1:-1; diry=0; dirz=0; break;
					case dify: dirx=0; diry=y2>y1?1:-1; dirz=0; break;
					case difz: dirx=0; diry=0; dirz=z2>z1?1:-1; break;
					break;
				}
				x1+=dirx*cubeSize*speed;
				y1+=diry*cubeSize*speed;
				z1+=dirz*cubeSize*speed;
				if(mind1>cubeSize*cubeSize){
					x3=cubes[t2].mesh.position.x;
					y3=cubes[t2].mesh.position.y;
					z3=cubes[t2].mesh.position.z;
					d=((x1-x3)*(x1-x3)+(y1-y3)*(y1-y3)+(z1-z3)*(z1-z3));
					if(d>cubeSize*cubeSize){
						cubes[i].x1=cubes[i].mesh.position.x;
						cubes[i].y1=cubes[i].mesh.position.y;
						cubes[i].z1=cubes[i].mesh.position.z;
						cubes[i].x2=x1;
						cubes[i].y2=y1;
						cubes[i].z2=z1;
					}
				}else{
					cubes[t1].id=!cubes[t1].id;
					cubes[t1].mesh.material.color.setHex(cubes[t1].id?COL1:COL2);
				}
				if(!shroud)moving=true;
			}else{
				pass=1;
				for(j=1;j<cubes.length;++j){
					if(cubes[0].id!=cubes[j].id)pass=0;
				}
				if(pass) victory(cubes[0].id);
			}
		}
		if(!shroud)loadScore("herp");
	}else{
		if(interpolation<interpolationSteps){
			interpolation++;
			for(i=0;i<cubes.length;++i){
				cubes[i].mesh.position.x=cubes[i].x1+(cubes[i].x2-cubes[i].x1)/interpolationSteps*interpolation;
				cubes[i].mesh.position.y=cubes[i].y1+(cubes[i].y2-cubes[i].y1)/interpolationSteps*interpolation;
				cubes[i].mesh.position.z=cubes[i].z1+(cubes[i].z2-cubes[i].z1)/interpolationSteps*interpolation;
			}
		}else{
			moving=false;
			interpolation=0;
			for(i=0;i<cubes.length;++i){
				cubes[i].mesh.position.x=cubes[i].x2;
				cubes[i].mesh.position.y=cubes[i].y2;
				cubes[i].mesh.position.z=cubes[i].z2;
				cubes[i].x1=cubes[i].x2;
				cubes[i].y1=cubes[i].y2;
				cubes[i].z1=cubes[i].z2;
			}
		}
	}
	renderer.render( scene, camera );
}

function victory(id){
	
	renderer.setClearColor( interpolateColors(id?[0,1,0]:[.8,0,1],[0,0,0],Math.cos(frames/20)/2));
	plane.material.color.setHex(interpolateColors(id?[0,1,0]:[.8,0,1],[0,0,0],Math.cos(frames/20)/2));
	if(!textLoaded){
		textLoaded=1;
		purpleScore+=id?0:1;
		greenScore+=id?1:0;
		loadText(id?"green Wins!":"Purple Wins!",id?COL1:COL2);
	}
	if(shroud<=1){
		shroud+=.00005;
	}else{
		loadScene();
	}
}

initVars();
loadScene();
setInterval(frame,16);
