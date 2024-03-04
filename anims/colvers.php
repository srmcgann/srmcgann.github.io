<!DOCTYPE html>
<html>
  <head>
    <style>
	  body, html{
	    width: 100%;
      height: 100vh;
      margin: 0;
	  }
    canvas{
      width: 100vw;
      height: 100vh;
    }
		err{
			position:absolute;
			z-index:100;
			height:40px;
			width:100%;
			background:#fff;
			color:red;
		}
	</style>
  </head>
  <body>
	  <div class="err"></div>
    <canvas id="c"></canvas>
  </body>
  <script>
    s=4
    canvas2 = document.querySelector("#c")
    let mc = 1
    canvas2.width = 1920 * mc
    canvas2.height = 1080 * mc
    xb = canvas2.getContext('2d')
    c = canvas2.cloneNode()
    x = c.getContext('2d')
    C = Math.cos
    S = Math.sin
    t = 0


    startRecording = () => {
      console.log('recording')
      const chunks = []; // here we will store our recorded media chunks (Blobs)
      const stream = canvas2.captureStream(); // grab our canvas MediaStream
      const rec = new MediaRecorder(stream); // init the recorder
      // every time the recorder has new data, we will store it in our array
      rec.ondataavailable = e => chunks.push(e.data);
      // only when the recorder stops, we construct a complete Blob from all the chunks
      rec.onstop = e => exportVid(new Blob(chunks, {type: 'video/webm'}));

      rec.start();
      setTimeout(()=>rec.stop(),90000);
    }

    let logo = new Image()
    let img = new Image()
    logo.src = 'MTSQu.png' //light
    img.src = 'https://www.incimages.com/uploaded_files/image/1920x1080/getty_487359776_373683.jpg'
    //logo.src = '28aPJs.png' //dark
    let img2 = new Image()
    img2.src = 'rainclouds.jpg'
    bg = new Image()
    bg.src = 'nebula.jpg'
    //vid = document.createElement('video')
    //vid.src = '2teams.mp4'
    //vid.loop = true
    //vid.muted = true
    //vid.play()
    img2.addEventListener('load', ()=>{
      try{
				Draw()
			} catch(e) {
			  document.querySelectorAll('.err')[0].innerHTML=e
			}
      //setTimeout(()=>startRecording(),2000)
    })

    star = new Image()
    star.src = 'star.png'

    //cloud = new Image()
    //cloud.src = 'cloud.png'

    Draw = () => {

      x.fillStyle='#0008',x.fillRect(0,0,w=c.width,w)

      if(!t){
				Rn=Math.random
				Q=q=>[c.width/2+X/Z*700,c.height/2+Y/Z*700]
			  R=(Rl,Pt,Yw,m)=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d;if(m){X+=oX,Y+=oY,Z+=oZ}}
			  
				B=Array(7).fill().map(v=>{
					a=[]
					ls=1
					tx1=(Rn()-.5)*9
					ty1=(Rn()-.5)*9
					tz1=(Rn()-.5)*4
					for(j=3;j--;){
						tx=tx1+S(p=Math.PI*2/3*j+Math.PI/3)*ls
						ty=ty1+C(p)*ls
					  for(i=42;i-->8;){
              X=S(p=Math.PI*2/50*i)*ls
						  Y=C(p)*ls
						  Z=tz1
							R(Math.PI*2/3*j+1.05+Math.PI,0,0)
							X1=tx+X,Y1=ty+Y,Z1=Z
						  X=S(p=Math.PI*2/50*(i+1))*ls
						  Y=C(p)*ls
						  Z=tz1
							R(Math.PI*2/3*j+1.05+Math.PI,0,0)
              X2=tx+X,Y2=ty+Y,Z2=Z
						  a=[...a,[X1,Y1,Z1,X2,Y2,Z2,tx1,ty1+1,tz1]]
					  }
					}
					return a
			  })
      }

      oX=0,oY=0,oZ=12
			Rl=0,Pt=0,Yw=t
      B.map(v=>{
        x.beginPath()
				X=v[0][6]
				Y=v[0][7]
        Z=v[0][8]
				R(Rl,Pt,Yw,1)
				x.lineTo(...Q())
				Y+=3
				x.lineTo(...Q())
				x.strokeStyle='#4f86'
				x.lineWidth=1500/Z/Z
				x.stroke()
				x.beginPath()
			  v.map(q=>{
				  X=q[0]
					Y=q[1]
					Z=q[2]
					R(Rl,Pt,Yw,1)
					//x.beginPath()
					x.lineTo(...Q())
					/*
					X=q[3]
					Y=q[4]
					Z=q[5]
					R(Rl,Pt,Yw,1)
					x.lineTo(...Q())
				  */
				})
			  x.fillStyle='#4f86'
			  //x.lineWidth=800/Z/Z
				x.fill()
			})
      
			canvas2.width|=0
      //xb.fillStyle='#000',xb.fillRect(0,0,w,w)
      //xb.globalAlpha=.8
      //xb.drawImage(img,0,0,w=c.width,c.height)
      //xb.globalAlpha=1
      //xb.globalAlpha = .3
      //xb.drawImage(img2, 0, 0, canvas2.width, canvas2.height)
      xb.fillStyle='#000',xb.fillRect(0,0,w,w)
      //xb.globalAlpha = 1
      x.drawImage(c,0,0,c.width,c.height)
      s=.25
      xb.save()
      xb.translate(canvas2.width / 2, canvas2.height / 2)
      xb.rotate(0)
      sc = 1
      xb.globalAlpha=1
      xb.drawImage(c, -canvas2.width/2*sc, -canvas2.height/2*sc, canvas2.width*sc, canvas2.height*sc )
      xb.restore()
      s=.3
      xb.globalAlpha = .5+S(t*2)/2
      //xb.drawImage(logo, canvas2.width / 2 - img.width / 2 * s, canvas2.height / 2 - img.height / 2 * s, img.width * s, img.height * s)
      t+=1/60
      requestAnimationFrame(Draw)
    }

    //Draw()

  
    function exportVid(blob) {
      const vid = document.createElement('video');
      vid.src = URL.createObjectURL(blob);
      vid.controls = true;
      document.body.appendChild(vid);
      const a = document.createElement('a');
      a.download = 'myvid.webm';
      a.href = vid.src;
      a.textContent = 'download the video';
      document.body.appendChild(a);
    }

  //startRecording()
  


      //golden rectangles -> icosahedron
      /*x.strokeStyle='#88f8'
      x.lineWidth=3
      P.map((v,i)=>{
        X=v[0]
        Y=v[1]+1
        Z=v[2]
        d=Math.hypot(X,Z)
        p=Math.atan2(X,Z)+t/5
        X=S(p)*d
        Z=C(p)*d+8
        if(!(i%4)){
          x.beginPath()
          x.moveTo(960+X/Z*w,260+Y/Z*w)
        }else{
          x.lineTo(960+X/Z*w,260+Y/Z*w)
          if(!((i+1)%4)){x.closePath(),x.stroke()}
        }
        x.fillStyle='#f00'
        x.font='36px arial'
        x.fillText(i,960+X/Z*w,260+Y/Z*w)
      })
      */


/*
x.fillRect(0,0,w=c.width=1e3,w),x.strokeStyle='#8f0'
R=q=>{
if(q[2]<7){
for(let i=3;i--;R([X,Y,e])){
for(x.beginPath(),x.lineWidth=9/(e=q[2]+1),j=2;j--;x.lineTo(X=q[0]+S(p=2.1*(i+j)-t*3+t*e)*d,Y=q[1]+C(p)*d))d=600/e**2
x.stroke()
}
}
}
R([500,281,1])
*/

/*
      x.fillStyle=`#0004`,x.fillRect(0,0,w=2e3,w),s=12
      t||(N=O=P=0,q=[0,0,0])
      Q=(m,a)=>{
        d=(M=Math).hypot(A=q[m],B=q[f=(m+1)%3])
        q[m]=S(p=M.atan2(A,B)+a)*d
        q[f]=C(p)*d
      }
      vl=.15+S(t)/20
      y=C(t/1.5)
      pt=S(t)
      r=(t+S(t))/2
      h=450+S(t/1.5)*300
      N-=S(y)*C(pt)*vl
      O+=S(pt)*vl
      P-=C(y)*C(pt)*vl
      for(i=s**3;i--;){
        q[0]=(i%s)+N%1-(k=s/2-.5)
        q[1]=(i/s|0)%s+O%1-k
        q[2]=(i/s/s|0)+P%1-k
        Q(2,y),Q(1,pt),Q(0,r)
        x.fillStyle=`hsla(${((d=M.hypot(...q))+t*6)*25},99%,${99/d*3}%,${.6/(1+(Z=q[2])**3/199)}`
        Z>0&&x.fill(x.arc(960+q[0]/Z*h,540+q[1]/Z*h,70/(1+Z*Z/4),0,7,x.beginPath()))
      }
*/
  </script>
</html>

