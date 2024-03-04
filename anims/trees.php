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
      setTimeout(()=>rec.stop(), 20000);
    }

    let img = new Image()
    //img.src = 'MTSQu.png' //light
    img.src = '28aPJs.png' //dark
    let img2 = new Image()
    img2.src = '24l2ah.jpg'
    img2.addEventListener('load', ()=>{
      Draw()
      //setTimeout(()=>startRecording(),2000)
    })

    cloud = new Image()
    cloud.src = 'cloud.png'

    Draw = () => {

      x2.globalAlpha = 1
      x2.fillRect(0,0,w=c.width|=0,w)

      b=.6
      g=x.createLinearGradient(0,0,0,c.height*b)
      g[l='addColorStop'](0, '#6af')
      g[l](1, '#f8ffff')
      x.fillStyle=g
      x.fillRect(0,0,c.width,c.height*b)

      g=x.createLinearGradient(0,c.height*b,0,c.height)
      g[l](0, '#210')
      g[l](.5, '#330')
      g[l](1, '#061')
      x.fillStyle=g
      x.fillRect(0,c.height*b,c.width,c.height*(1-b))

      s=200,r=200
      g=x.createRadialGradient(c.width-s*2,s,0,c.width-s*2,s,r),g[l](0,'#ffc'),g[l](.2,'#ffc'),g[l](1,'#fff0'),x.fillStyle=g
      x.beginPath(),x.arc(c.width-s*2,s,r,0,7),x.fill();

      h=c.height*b
      x.fillStyle='#210'
      x.beginPath()
      Y=h
      for(i=400;i--;){
        X=c.width/400*i
        x.lineTo(X,Y)
        Y+=((i**3.1/12%4)-2)*2
        Y=Math.min(h,Y)
      }
      x.lineTo(0,h)
      x.fill()
      x.drawImage(cloud,0,0,cloud.width/4, cloud.height/4)
      x.drawImage(cloud, 350,50,cloud.width/3, cloud.height/3)

      T=(X,Y)=>{
        x.strokeStyle='#431'
        a=20
        sc = (.85-(c.height-Y)/c.height*2)*2.5
        b=1e5/2000*sc
        for(j=9;j--;){
          OX=(j**2.2)*S(t*3)*sc/2
          s=(a-(a/8*j))*sc
          if(j<8){
            x.beginPath()
            x.lineWidth=s
            x.lineTo(jx,jy)
          }
          x.lineTo(jx=OX+X-s/2,jy=Y-j*b)
          if(j<8)x.stroke()
        }
        s=8*b
        x.strokeStyle='#1c34'
        x.lineWidth=5*sc
        sd =400
        for(j=sd;j--;){
          p=8/(sd-100)*(j+100)
          OX=p**2*S(t*3)*sc/3.6-(sd-j)/60*sc
          x.beginPath()
          x.moveTo(OX+X,y=Y-(s/(sd*1.25)*j+b*2))
          i=sd-j
          x.lineTo(OX+X+((i**3.8/5%1)*i-i/2)/2*sc,y+20*sc)
          x.stroke()
        }
      }
      treeCt = 16
      for(m=treeCt;m--;)T(c.width/treeCt*m+c.width/treeCt/2,c.height+(((m+20)**6.1%400)-400))

      //x2.globalAlpha = .5
      //x2.drawImage(img2, 0, 0, c.width, c.height)
      //x2.globalAlpha = 1
      s=.25
      x2.save()
      x2.translate(c.width / 2, c.height / 2)
      //x2.rotate(2.5+t/6)
      sc = 1
      x2.drawImage(c, -c.width/2*sc, -c.height/2*sc, c.width*sc, c.height*sc )
      x2.restore()
      s=.5
      x2.globalAlpha = .85
      x2.drawImage(img, c.width / 2 - img.width / 2 * s, c.height / 2 - img.height / 2 * s, img.width * s, img.height * s)
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

