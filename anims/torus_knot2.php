<!DOCTYPE html>
<html>
  <head>
    <style>
	  body, html{
	    width: 100%;
      height: 100vh;
      margin: 0;
      background: #000;
	  }
    canvas{
      width: 100vw;
      height: 100vh;
    }
	</style>
  </head>
  <body>
    <canvas id="c"></canvas>
  </body>
  <script>
    s=4
    canvas2 = document.querySelector("#c")
    let mc = 1
    canvas2.width = 1920 * mc
    canvas2.height = 1080 * mc
    x2 = canvas2.getContext('2d')
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
      setTimeout(()=>rec.stop(),60000);
    }

    let img = new Image()
    img.src = 'MTSQu.png' //light
    //img.src = '28aPJs.png' //dark
    let img2 = new Image()
    img2.src = 'FrqlF.jpg'
    bg = new Image()
    bg.src = 'nebula.jpg'
    //vid = document.createElement('video')
    //vid.src = '2teams.mp4'
    //vid.loop = true
    //vid.muted = true
    //vid.play()
    img2.addEventListener('load', ()=>{
      Draw()
      setTimeout(()=>startRecording(),2000)
    })

    star = new Image()
    star.src = 'star.png'

    //cloud = new Image()
    //cloud.src = 'cloud.png'

    Draw = () => {


      x.fillStyle='#0006',x.fillRect(0,0,w=c.width,w),h=540,oPX=oPY=oPZ=0
      R=(roll,pitch,yaw)=>{Y=S(p=(A=(M=Math).atan2)(Y,Z)+pitch)*(d=(H=M.hypot)(Y,Z)),Z=C(p)*d,X=S(p=A(X,Y)+roll)*(d=H(X,Y)),Y=C(p)*d,X=S(p=A(X,Z)+yaw)*(d=H(X,Z)),Z=C(p)*d}
      Q=q=>[960+X/Z*h,h+Y/Z*h]
      x.lineJoin='round'

      E=(X,Z,Y)=>Math.acos(Z/Math.hypot(X,Y,Z))-Math.PI/2
      sd=10,tw=6,oR=3.25,yaw=t,iR=1,cl=60,oX=0,oY=0,oZ=9.5
      l=15
      
      a1=.6666
      b1=1.33333
      
      mR=t/6,mP=Math.PI/5+t,mY=t/4,iT=-t*2

      for(j=cl*3+1;j--;){
        pitch=0
        oYaw=yaw
        PX=S(p=Math.PI*2/cl*(j))*oR
        PY=0
        PZ=C(p)*oR
        yaw=Math.atan2(PX,PZ)+Math.PI/2
        x.strokeStyle=`hsla(${360/cl*j},50%,${75+S(Math.PI*2/cl*j+t*10)*30}%,.4)`
        
        for(i=sd;j<cl*3&&i--;){
          x.beginPath()
          for(k=2;k--;){
            X=S(p=Math.PI*2/sd*i+Math.PI/sd+Math.PI*tw/cl*(v=k?j:j+1)+iT)*iR
            Y=C(p)*iR
            Z=0
            vX=S(q=Math.PI*a1/cl*v)*1.5
            vY=S(p=Math.PI*b1/cl*v)*4
            vZ=C(q)*1.5
            nX=S(q=Math.PI*a1/cl*(v-l))*1.5
            nY=S(p=Math.PI*b1/cl*(v-l))*4
            nZ=C(q)*1.5
            R(0,E(nX*3,nY,nZ),Math.atan2(k?PX:oPX,k?PZ:oPZ)+Math.PI/2)
            X+=(k?PX:oPX)+vX
            Y+=(k?PY:oPY)+vY
            Z+=(k?PZ:oPZ)+vZ
            R(mR,mP,mY)
            X+=oX
            Y+=oY
            Z+=oZ
            x.lineTo(...Q())
          }
          x.lineWidth=1+250/Z/Z
          x.stroke()
        }
        /*
        x.beginPath()
        for(i=sd;j&&i--;){
          X=S(p=Math.PI*2/sd*i+Math.PI/sd+Math.PI*tw/cl*j+iT)*iR
          Y=C(p)*iR
          Z=0
          v=j
          vX=S(q=Math.PI*a1/cl*v)*1.5
          vY=S(p=Math.PI*b1/cl*v)*4
          vZ=C(q)*1.5
          nX=S(q=Math.PI*a1/cl*(v-l))*2
          nY=S(p=Math.PI*b1/cl*(v-l))*4
          nZ=C(q)*1.5
          R(0,E(nX*3,nY,nZ),Math.atan2(PX,PZ)+Math.PI/2)
          X+=PX+vX
          Y+=PY+vY
          Z+=PZ+vZ
          R(mR,mP,mY)
          X+=oX
          Y+=oY
          Z+=oZ
          x.lineTo(...Q())
        }
        x.closePath()
        x.lineWidth=1+99/Z/Z
        x.stroke()
        */

        oPX=PX,oPY=PY,oPZ=PZ
      }

      w=canvas2.width|=0,x2.fillStyle='#fff',x2.fillRect(0,0,w,w)
      //x2.globalAlpha = .3
      //x2.drawImage(img2, 0, 0, canvas2.width, canvas2.height)
      //x2.globalAlpha = 1
      x.drawImage(c,0,0,c.width,c.height)
      s=.25
      x2.save()
      x2.translate(canvas2.width / 2, canvas2.height / 2)
      x2.rotate(0)
      sc = 1
      x2.globalAlpha=1
      x2.drawImage(c, -canvas2.width/2*sc, -canvas2.height/2*sc, canvas2.width*sc, canvas2.height*sc )
      x2.restore()
      s=.3
      x2.globalAlpha = .5+S(t*2)/2
      x2.drawImage(img, canvas2.width / 2 - img.width / 2 * s, canvas2.height / 2 - img.height / 2 * s, img.width * s, img.height * s)
      t+= 1/60
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

