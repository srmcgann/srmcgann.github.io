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
      setTimeout(()=>rec.stop(), 60000);
    }

    let img = new Image()
    img.src = 'MTSQu.png' //light
    //img.src = '28aPJs.png' //dark
    let img2 = new Image()
    img2.src = 'FrqlF.jpg'
    forest = new Image()
    forest.src = 'forest.jpg'
    img2.addEventListener('load', ()=>{
      Draw()
      setTimeout(()=>startRecording(),2000)
    })

    //cloud = new Image()
    //cloud.src = 'cloud.png'

    Draw = () => {

      //x.fillStyle='#0008',x.fillRect(0,0,w=1920,w),h=540
      x.globalAlpha = .5,x.drawImage(forest,0,0,c.width,c.height)
      x.globalAlpha = 1
      R=q=>{
        Z=S(p=(A=(M=Math).atan2)(Z,Y)+q[0])*(d=(H=(M.hypot))(Z,Y)),Y=C(p)*d
        X=S(p=A(X,Z)+q[1])*(d=H(X,Z)),Z=C(p)*d+q[7]
        X=S(p=A(X,Y)+q[2])*(d=H(X,Y))+q[5],Y=C(p)*d+q[6]
      }
      Q=q=>{
        X=0
        Y=(q[10]-q[4])*q[3]/(1+(q[4]-q[10])/8)
        Z=0
        R(q)
        X-=q[5]
        Y-=q[6]
        Z-=q[7]
        R([0,q[1]+t,0,0,0,q[5],q[6],q[7]])
        h=540,w=c.width
        A=960+X/Z*w,B=h+Y/Z*w
      }
      e=q=>{
        if(q[8]<.1||q[4]<1) return
        q[3]*=q[8]
        //x.strokeStyle='#8fa'
        for(var i=q[4];i--;){
          Q([...q,i])
          x.beginPath()
          x.arc(A,B,1+3000/Z/Z*(1+q[3])/5,0,7)
          x.fillStyle='#4fc'
          x.fill()
          
          x.beginPath()
          Q([...q,i])
          x.lineTo(A,B)
          Q([...q,i+1])
          x.strokeStyle='#294'
          x.lineWidth=50/Z*q[8]*(1+q[3])
          x.lineCap='round'
          x.lineTo(A,B)
          x.stroke()
          var a=[q[3]/(f=1+(q[4]-i)/3),q[4]/(1+f/3)/1.2|0,X,Y,Z,q[8]/1.5,q[9]/(f/2)]
          e([q[0],q[1],q[2]-a[6],...a])
          e([q[0],q[1],q[2]+a[6],...a])
        }
      }
      for(j=3;j--;){
        for(m=3;m--;)e([0,Math.PI*2/3*m,0,1.4,9,(j-1)*7-.5,3.5,22+S(j*2+2)*9,1.1,.8])
      }      

      w=canvas2.width|=0,x2.fillStyle='#fff',x2.fillRect(0,0,w,w)
      //x2.globalAlpha = .3
      //x2.drawImage(img2, 0, 0, canvas2.width, canvas2.height)
      //x2.globalAlpha = 1
      s=.25
      x2.save()
      x2.translate(canvas2.width / 2, canvas2.height / 2)
      x2.rotate(0)
      sc = 1
      x2.globalAlpha=1
      x2.drawImage(c, -canvas2.width/2*sc, -canvas2.height/2*sc, canvas2.width*sc, canvas2.height*sc )
      x2.restore()
      s=.35
      x2.globalAlpha = .5+S(t*3)/2
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

