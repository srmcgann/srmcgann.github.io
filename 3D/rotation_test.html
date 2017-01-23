<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="description" content="Waves">
		<meta name="keywords" content="HTML5,canvas,JavaScript,geometry,waves">
        <link rel="stylesheet" type="text/css" href="style.css">		
		<style>
			html,body{
				width:100%;
				height:100%;
				margin:0;
				background:#000;
				color:#fff;
				text-align:center;
				font-size:36px;
				font-family:arial,tahoma;
			}
			#result{
				margin-left:auto;
				margin-right:auto;
				color:#6f8;
				width:1000px;
				text-wrap:wrap;
			}
		</style>
	</head>
	<body>
		<br><br><br>
		A benchmark comparison of two 3D rotation functions<br><br>
		<div id="result">Rotating a vertex 10 million times...<br>Watch here for results.</div>
            <script src="prism.js"></script><br><br>
<pre class="line-numbers" style="width:665px;">
<code class="language-javascript">function trig_rotate(vert, roll, pitch, yaw){
				
	var d, p, x=vert.x, y=vert.y, z=vert.z;
	var {sin, cos, atan2, sqrt} = Math;
	d = sqrt(x*x+y*y);
	p = atan2(x,y);
	x = sin(p-roll)*d;
	y = cos(p-roll)*d;
	d = sqrt(y*y+z*z);
	p = atan2(y,z);
	y = sin(p+pitch)*d;
	z = cos(p+pitch)*d;
	d = sqrt(x*x+z*z);
	p = atan2(x,z);
	x = sin(p+yaw)*d;
	z = cos(p+yaw)*d;
	return {x:x, y:y, z:z};
}
</code></pre><br>
<pre class="line-numbers" style="width:665px;">
<code class="language-javascript">function matrix_rotate(vert, roll, pitch, yaw) {
				
	var {sin, cos} = Math;	
	var cosa = cos(roll);
	var sina = sin(roll);
	var cosb = cos(yaw);
	var sinb = sin(yaw);
	var cosc = cos(-pitch);
	var sinc = sin(-pitch);

	var xx = cosa*cosb;
	var xy = cosa*sinb*sinc - sina*cosc;
	var xz = cosa*sinb*cosc + sina*sinc;
	var yx = sina*cosb;
	var yy = sina*sinb*sinc + cosa*cosc;
	var yz = sina*sinb*cosc - cosa*sinc;
	var zx = -sinb;
	var zy = cosb*sinc;
	var zz = cosb*cosc;

	var px = xx*vert.x + xy*vert.y + xz*vert.z;
	var py = yx*vert.x + yy*vert.y + yz*vert.z;
	var pz = zx*vert.x + zy*vert.y + zz*vert.z;
	
	return {x:px, y:py, z:pz};
}
</code></pre><br><br>
		
		<script>
			function trig_rotate(vert, roll, pitch, yaw){
				
				var d, p, x=vert.x, y=vert.y, z=vert.z;
				var {sin, cos, atan2, sqrt} = Math;
				d = sqrt(x*x+y*y);
				p = atan2(x,y);
				x = sin(p-roll)*d;
				y = cos(p-roll)*d;
				d = sqrt(y*y+z*z);
				p = atan2(y,z);
				y = sin(p+pitch)*d;
				z = cos(p+pitch)*d;
				d = sqrt(x*x+z*z);
				p = atan2(x,z);
				x = sin(p+yaw)*d;
				z = cos(p+yaw)*d;
				return {x:x, y:y, z:z};
			}


			function matrix_rotate(vert, roll, pitch, yaw) {
				
				var {sin, cos} = Math;	
				var cosa = cos(roll);
				var sina = sin(roll);
				var cosb = cos(yaw);
				var sinb = sin(yaw);
				var cosc = cos(-pitch);
				var sinc = sin(-pitch);

				var xx = cosa*cosb;
				var xy = cosa*sinb*sinc - sina*cosc;
				var xz = cosa*sinb*cosc + sina*sinc;
				var yx = sina*cosb;
				var yy = sina*sinb*sinc + cosa*cosc;
				var yz = sina*sinb*cosc - cosa*sinc;
				var zx = -sinb;
				var zy = cosb*sinc;
				var zz = cosb*cosc;

				var px = xx*vert.x + xy*vert.y + xz*vert.z;
				var py = yx*vert.x + yy*vert.y + yz*vert.z;
				var pz = zx*vert.x + zy*vert.y + zz*vert.z;
				
				return {x:px, y:py, z:pz};
			}


            function Vert(x,y,z){
                this.x = x;
                this.y = y;
                this.z = z;
            }


			function compare(){
				var vert=new Vert(1,1,1);
				var start=Date.now();
				for(i=0;i<10000000;++i){
					val=matrix_rotate(vert,i,.03,.01);
				}
				var end=Date.now();
				var mtime=(end-start)/1000;
				s="Matrix Rotation took: "+mtime+" seconds<br>";
				document.querySelector("#result").innerHTML=s;

				start=Date.now();
				for(i=0;i<10000000;++i){
					val=trig_rotate(vert,i,.03,.01);
				}
				end=Date.now();
				var ttime=(end-start)/1000;
				s="Trig Rotation took: "+ttime+" seconds";
				document.querySelector("#result").innerHTML+=s;
			}
			setTimeout(compare,100);
		</script>
	</body>
</html>
