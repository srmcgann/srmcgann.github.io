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
      setTimeout(()=>rec.stop(),279000);
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

  x.fillStyle='#0004',x.fillRect(0,0,w=c.width,w),h=800

  R=(Rl,Pt,Yw)=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=(M.hypot))(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d}
  Rn=Math.random
  Q=q=>[c.width/2+X/Z*h,c.height/2+Y/Z*h]
  
  oX=0,oY=0,oZ=60
  Rl=t/4,Pt=-t/3,Yw=t/2
  iPsd=8,iPor=20+S(t)*6,iPir=2+S(t*1.5)*1.5,iPcl=60
  iPifreq=6,iPifr=8*S(t/2)

  x.lineJoin=x.lineCap='round'
  P=Array(iPcl).fill().map((v,i)=>{
    X=0
    Y=0
    Z=iPifr
    p3=Math.PI*2/(iPcl-1)*(i-.5)*iPifreq+t
    R(0,p3,0)
    p=Math.PI*2/(iPcl-1)*(i-.5)
    R(0,0,p)
    p=Math.PI*2/(iPcl-1)*(i-.5)
    a=X,b=Y,e=Z
    a2=S(p)*iPor+a
    b2=b
    e2=C(p)*iPor+e

    X=0
    Y=0
    Z=iPifr
    p3=Math.PI*2/(iPcl-1)*(i+.5)*iPifreq+t
    R(0,p3,0)
    p=Math.PI*2/(iPcl-1)*(i+.5)
    R(0,0,p)
    p=Math.PI*2/(iPcl-1)*(i+.5)
    a=X,b=Y,e=Z
    a3=S(p)*iPor+a
    b3=+b
    e3=C(p)*iPor+e

    X=0
    Y=0
    Z=iPifr
    p3=Math.PI*2/(iPcl-1)*(i)*iPifreq+t
    R(0,p3,0)
    p=Math.PI*2/(iPcl-1)*(i)
    R(0,0,p)
    p=Math.PI*2/(iPcl-1)*(i)
    a=X,b=Y,e=Z
    X=S(p)*iPor+a
    Y=+b
    Z=C(p)*iPor+e
    a=X
    b=Y
    e=Z

    return [
      X,Y,Z,
      Array(iPsd).fill().map((q,j)=>{
        X=0
        Y=S(p=Math.PI*2/(iPsd-1)*j)*iPir
        Z=C(p)*iPir
        a4=a3-a2
        b4=b3-b2
        e4=e3-e2
        p3=Math.acos(b4/Math.hypot(a4,b4,e4))
        p1=Math.atan2(a4,e4)+Math.PI/2
        R(-p3-Math.PI/2,0,0)
        R(0,0,p1)
        return [X+a,Y+b,Z+e]
      })
    ]
  })
  
  P.map((v,i,a)=>{
    if(i){
      X=v[0]
      Y=v[1]
      Z=v[2]
      R(Rl,Pt,Yw)
      X+=oX,Y+=oY,Z+=oZ
      x.beginPath()
      x.lineTo(...Q())
      X=a[i-1][0]
      Y=a[i-1][1]
      Z=a[i-1][2]
      R(Rl,Pt,Yw)
      X+=oX,Y+=oY,Z+=oZ
      x.lineTo(...Q())
      x.lineWidth=4e4/Z/Z
      x.strokeStyle=`hsla(${t*200},80%,60%,.8`
      x.stroke()
    }
    v[3].map((q,j)=>{
      if(j){
        X=q[0]
        Y=q[1]
        Z=q[2]
        R(Rl,Pt,Yw)
        X+=oX,Y+=oY,Z+=oZ
        x.beginPath()
        x.lineTo(...Q())
        X=v[3][j-1][0]
        Y=v[3][j-1][1]
        Z=v[3][j-1][2]
        R(Rl,Pt,Yw)
        X+=oX,Y+=oY,Z+=oZ
        x.lineTo(...Q())
        x.lineWidth=1e4/Z/Z
        x.strokeStyle=`hsla(${t*200+180},99%,80%,.6`
        x.stroke()
      }
    })
    if(i){
      v[3].map((q,j)=>{
        X=q[0]
        Y=q[1]
        Z=q[2]
        R(Rl,Pt,Yw)
        X+=oX,Y+=oY,Z+=oZ
        x.beginPath()
        x.lineTo(...Q())
        X=P[i-1][3][j][0]
        Y=P[i-1][3][j][1]
        Z=P[i-1][3][j][2]
        R(Rl,Pt,Yw)
        X+=oX,Y+=oY,Z+=oZ
        x.lineTo(...Q())
        x.lineWidth=1e4/Z/Z
        x.strokeStyle='#f048'
        x.strokeStyle=`hsla(${t*200+180},99%,80%,.6`
        x.stroke()
      })
    }
  })

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
      //x2.globalAlpha = .5+S(t*2)/2
      //x2.drawImage(img, canvas2.width / 2 - img.width / 2 * s, canvas2.height / 2 - img.height / 2 * s, img.width * s, img.height * s)
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

