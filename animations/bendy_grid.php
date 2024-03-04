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
      setTimeout(()=>rec.stop(),2620);
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

x[K='fillStyle']='#0008',x.fillRect(0,0,w=1920,w),h=800,N=9,G=20,O=(60+S(t*2)*30)/G;if(!t){R=v=>{Y=S(p=(A=(M=Math).atan2)(v[1],v[2])-t/8)*(d=(H=M.hypot)(v[1],v[2])),Z=C(p)*d,X=S(p=A(v[0],Z)+t/4)*(d=H(v[0],Z)),Z=C(p)*d,Z+=15};Q=q=>[960+X/Z*h,c.height/2+Y/Z*h];for(P=[],j=N**3*3;j--;)if(((i=j/3|0)+1)%N)P=[...P,[...(V=[(a=[(i%N)-N/2+.5,((i/N|0)%N)-N/2+.5,(i/N/N|0)-N/2+.5,((l=i+1)%N)-N/2+.5,((l/N|0)%N)-N/2+.5,(l/N/N|0)-N/2+.5])[j%3],a[(j+1)%3],a[(j+2)%3],a[3+(j%3)],a[3+((j+1)%3)],a[3+((j+2)%3)]]),...V]];B=[0,0,0].fill().map(v=>[0,0,0,(Rn=q=>Math.random()-.5)(),Rn(),Rn()])};s=G/4;B.map(v=>{v[0]+=v[3],v[1]+=v[4],v[2]+=v[5];for(m=3;m--;)if(v[m]>s||v[m]<-s)v[m+3]*=l=-1;x[W='beginPath'](),x.arc(...Q(R(v)),O*810/Z,0,7),x[K]='#24f8',x.fill()});P.map((v,i)=>{v[0]+=(v[6]-v[0])/G,v[1]+=(v[7]-v[1])/G,v[2]+=(v[8]-v[2])/G,v[3]+=(v[9]-v[3])/G,v[4]+=(v[10]-v[4])/G,v[5]+=(v[11]-v[5])/G;B.map(q=>{if((d=H(a=q[0]-v[0],b=q[1]-v[1],e=q[2]-v[2]))<O){v[0]=+q[0]-a/d*O,v[1]=+q[1]-b/d*O,v[2]=+q[2]-e/d*O};if((d=H(a=q[0]-v[3],b=q[1]-v[4],e=q[2]-v[5]))<O)v[3]=+q[0]-a/d*O,v[4]=+q[1]-b/d*O,v[5]=+q[2]-e/d*O});with(x)x[W](),lineTo(...Q(R(v))),lineTo(...Q(R([v[3],v[4],v[5]]))),strokeStyle='#0f82',lineWidth=1e3/Z/Z,stroke()})

      w=canvas2.width|=0,xb.fillStyle='#fff',xb.fillRect(0,0,w,w)
      //x2.globalAlpha = .3
      //x2.drawImage(img2, 0, 0, canvas2.width, canvas2.height)
      //x2.globalAlpha = 1
      //x.drawImage(c,0,0,c.width,c.height)
      //s=.25
      xb.save()
      xb.translate(canvas2.width / 2, canvas2.height / 2)
      xb.rotate(0)
      sc = 1
      xb.globalAlpha=1
      xb.drawImage(c, -canvas2.width/2*sc, -canvas2.height/2*sc, canvas2.width*sc, canvas2.height*sc )
      xb.restore()
      s=.3
      //xb.globalAlpha = .5+S(t*2)/2
      //xb.drawImage(img, canvas2.width / 2 - img.width / 2 * s, canvas2.height / 2 - img.height / 2 * s, img.width * s, img.height * s)
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

