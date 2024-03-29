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
      setTimeout(()=>rec.stop(),120000);
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
      //setTimeout(()=>startRecording(),20)
    })

    star = new Image()
    star.src = 'star.png'

    //cloud = new Image()
    //cloud.src = 'cloud.png'

    Draw = () => {

      x.fillStyle='#0006',x.fillRect(0,0,w=c.width,w)
      
      iTs=80,iTv=2,iTr=7.5,iTt=100,iTa=1.5
      iFc=200,iFs=16,iFv=20
      
      T=q=>{
        
      }
      
      Qf=q=>{
        F=[...F,[Rn()*w,Rn()*1080,1]]
      }

      if(!t){
        F=[]
        Rn=Math.random
        P=[[960,540,iTs,Math.PI,0,100]]
        for(i=iFc;i--;)Qf()
      }

      if(!((t*60|0)%2))Qf()
      
      F=F.map(v=>{
        x.fillStyle='#4f4f'
        s=iFs
        x.fillRect(v[0]-s/2,v[1]-s/2,s,s)
        return v
      }).filter(v=>v[2])

      Q=q=>{
        for(m=q[5]/12|0;m--;){
          P=[...P,[q[0],q[1],10+(q[2]/2-10)*Rn(),Rn()*Math.PI*2,0,100]]
        }
      }

      P.map(v=>{
        v[5]-=iTa
        mind=6e6
        F.map(q=>{
          d=Math.hypot(a=v[0]-q[0],b=v[1]-q[1])
          if(d<mind)mind=d,p1=Math.atan2(a,b)
          if(q[2]&&mind<iTs/2){
            q[2]=0,mind=6e6
            v[2]+=3
            v[5]+=iFv
            v[5]=Math.min(100,v[5])
          }
        })
        p2=v[3]
        if(Math.abs(p1-p2)>=Math.PI){
          if(p1<p2){
            p1+=Math.PI*2
          }else{
            p2+=Math.PI*2
          }
        }
        v[4]/=1.15
        v[3]/=1.03
        v[4]+=(p1-p2<0?iTr:-iTr)/80
        v[3]+=v[4]/4
        v[0]+=S(p=v[3])*(d=v[2]/20*iTv)
        v[1]+=C(p)*d
        if(v[0]<0)v[0]+=w
        if(v[0]>w)v[0]-=w
        if(v[1]<0)v[1]+=1080
        if(v[1]>1080)v[1]-=1080
        x.beginPath()
        for(i=3;i--;){
          X=v[0]+S(p=Math.PI*2/3*i+v[3])*(d=v[2]*(i?.5:1))
          Y=v[1]+C(p)*d
          x.lineTo(X,Y)
        }
        x.closePath()
        x.lineCap=x.lineJoin='round'
        x.lineWidth=v[2]/8
        x.fillStyle=x.strokeStyle=`hsla(${360-v[5]},99%,50%,.5`
        x.stroke()
        x.fill()
        if(v[2]>=iTt){
          Q(v)
          v[5]=0
        }
        if(v[5]<=0){
          for(i=4;i--;){
            if(i){
              X1=v[0]+S(p=Math.PI*2/3*i+v[3])*(d=v[2]*(i==3?1:.5))
              Y1=v[1]+C(p)*d
              X2=v[0]+S(p=Math.PI*2/3*(i+1)+v[3])*(d=v[2]*((i+1)==3?1:.5))
              Y2=v[1]+C(p)*d
              for(j=3;j--;){
                X=X1+(X2-X1)/3*j
                Y=Y1+(Y2-Y1)/3*j
                F=[...F,[X,Y,1]]
              }
            }
          }
        }
        return v
      })
      P=P.filter((v,i)=>i<500&&v[5]>0)

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

