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
      setTimeout(()=>rec.stop(),249000);
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

      x.fillStyle='#000a',x.fillRect(0,0,w=c.width,w),h=650
      R=(Rl,Pt,Yw)=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d}
      Q=q=>[960+X/Z*h,540+Y/Z*h]
      Rn=Math.random

      Rl=0,Pt=0,Yw=0
      cl=6,sp=10
      s=cl*sp/2

      if(!t){
      
        x.lineJoin=x.lineCap='round'
        sql=0
        PX=PY=PZ=0
        PRl=PPt=PYw=0
        oX=0
        oY=0
        oZ=0
        
        sd=10
        iBv=.2
        iPv=.5
        iFex=.04
        iFfreq=3
        iFms=1.75
        
        P=Array(cl**3).fill().map((v,i)=>{
          X=0,Y=-iBv,Z=0
          R(0,Rn()*Math.PI,Rn()*Math.PI*2)
          //R(0,-Math.PI/2,-Math.PI/4)
          vx=X,vy=Y,vz=Z
          X=((i%cl)-cl/2+.5)*sp
          Y=(((i/cl|0)%cl)-cl/2+.5)*sp
          Z=((i/cl/cl|0)-cl/2+.5)*sp          
          return [X,Y,Z,vx,vy,vz]
        })
        
        MR=q=>{
          R(0,0,-PYw)
          R(0,-PPt,0)
          R(-PRl,0,0)
          R(Rl,Pt,Yw)
        }

        FQ=v=>{
          a=[]
          for(let i=sd;i--;){
            X=S(p=Math.PI*2/sd*i+t*2)
            Y=C(p)
            Z=0
            p1=A(v[3],v[5])
            p2=Math.acos(v[4]/(H(v[3],v[4],v[5])))
            R(0,-p2-Math.PI/2,0)
            R(0,0,p1)
            a=[...a,[X,Y,Z,v[0],v[1],v[2],p1,p2,.2]]
          }
          return a
        }

        F=[]
      }

      X=0,Y=0,Z=iPv
      PRl=C(t)/2
      PPt=S(t*2)/4
      PYw=S(t)
      R(PRl,PPt,PYw)
      PX+=X,PY+=Y,PZ+=Z
      
      P.map(v=>{
        X=v[3],Y=v[4],Z=v[5]
        R(0,(Rn()-.5)*Math.PI*sql,(Rn()-.5)*Math.PI*2*sql)
        v[3]=X,v[4]=Y,v[5]=Z
        v[0]+=v[3]
        v[1]+=v[4]
        v[2]+=v[5]
        X=v[0]-PX
        Y=v[1]-PY
        Z=v[2]-PZ
        while(X<-s)X+=s*2
        while(X>s)X-=s*2
        while(Y<-s)Y+=s*2
        while(Y>s)Y-=s*2
        while(Z<-s)Z+=s*2
        while(Z>s)Z-=s*2
        MR()
        X+=oX,Y+=oY,Z+=oZ
        alpha=1/(1+((1+Z)**6)/5e7)
        if(Z>0){
          x.beginPath()
          x.arc(...Q(),Math.min(100,100/Z),0,7)
          x.fillStyle=`hsla(${150},99%,50%,${alpha}`
          x.fill()
        }
        
        if(!((t*60|0)%iFfreq)){
          F=[...F,FQ(v)]
        }
        
      })

      console.log(F)
      F.map(v=>{
        x.beginPath()
        X=v[0][3]-PX
        Y=v[0][4]-PY
        Z=v[0][5]-PZ
        while(X<-s)X+=s*2
        while(X>s)X-=s*2
        while(Y<-s)Y+=s*2
        while(Y>s)Y-=s*2
        while(Z<-s)Z+=s*2
        while(Z>s)Z-=s*2
        tx=X,ty=Y,tz=Z
        v.map(v=>{
          X=tx+(v[0]*v[8])
          Y=ty+(v[1]*v[8])
          Z=tz+(v[2]*v[8])
          MR()
          X+=oX,Y+=oY,Z+=oZ
          if(Z>0)x.lineTo(...Q())
          v[8]*=1.05
          v[8]+=iFex
        })
        
        X=tx,Y=ty,Z=tz
        MR()
        if(Z>1){
          x.closePath()
          alpha=1/(1+((1+Z)**6)/7e8)
          x.strokeStyle=`hsla(${360*(iFms/8)*v[0][8]+t*400},99%,${100-v[0][8]/iFms*50}%,${2/((1+iFms*v[0][8])**2*1)*alpha})`
          x.lineWidth=Math.min(50,1+100/Z/Z)
          x.stroke()
        }
      })

      F=F.filter(v=>v[0][8]<iFms)

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

