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
      setTimeout(()=>rec.stop(),266000);
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

      x.fillStyle='#0004',x.fillRect(0,0,w=c.width,w),h=540

      oX=oY=0,oZ=14,oS=.8
      Rl=t/3,Pt=-t/2,Yw=t
      iV=.15,iBv=.12,iBc=5
      fieldSize=6
      

      if(!t){
        Q=q=>[960+X/Z*800,h+Y/Z*800]
        R=q=>{Y=S(p=(A=(M=Math).atan2)(Y,Z)+t/2.5)*(d=(H=M.hypot)(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+t/2)*(d=H(X,Z)),Z=C(p)*d}
        Rt=q=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d}
        Rn=Math.random
        x.lineJoin='round'
        for(V=[],a=[[p=1.618,-1,0],[p,1,0],[-p,1,0],[-p,-1,0]],P=[],j=3;j--;)b=[],a.map(v=>b=[...b,v[j%3],v[(1+j)%3],v[(2+j)%3]]),P=[...P,[...b]]
        P.map((v,j)=>{
          x.beginPath()
          for(i=4;i--;){X=v[i*3],Y=v[i*3+1],Z=v[i*3+2],V=[...V,[X,Y,Z]]}})
          SD=G=>{
            let a=[]
            for(let i=0;i<(l=G.length);i++){
              if(!(i%3))a=[...a,e=[(G[k=(i+1)%l][0]+G[m=i%l][0])/2,(G[k][1]+G[m][1])/2,(G[k][2]+G[m][2])/2],[G[k][0],G[k][1],G[k][2]],b=[(G[n=(i+2)%l][0]+G[k][0])/2,(G[n][1]+G[k][1])/2,(G[n][2]+G[k][2])/2],b,[G[n][0],G[n][1],G[n][2]],d=[(G[n][0]+G[m][0])/2,(G[n][1]+G[m][1])/2,(G[n][2]+G[m][2])/2],d,[G[m][0],G[m][1],G[m][2]],e,e,b,d]
            }
          return a
        }
        a=SD("#'+#(.#'((-&'&,(-..$#.$))*$$+*)-%%&-%,&)*%*,%+,*+,'+$#.-)'(&".split('').map(v=>[...V[v.charCodeAt(0)-35]]))
        B=Array(iBc).fill().map(v=>[Rn()*fieldSize-(d=fieldSize/2+.5),Rn()*fieldSize-d,Rn()*fieldSize-d,S(p1=Rn()*Math.PI*2)*S(p2=Rn()*Math.PI)*iBv,C(p2)*iBv,C(p1)*S(p2)*iBv])
      }
      
      for(j=B.length;j--;){
        for(m=25;m--;){
          d=8*oS
          X=B[j][0]+(n=S(p=Rn()*Math.PI*2)*S(q=Rn()*Math.PI)*iV)*d
          Y=B[j][1]+(b=C(q)*iV)*d
          Z=B[j][2]+(e=C(p)*S(q)*iV)*d
          P=[...P,[X,Y,Z,n,b,e,1,j,0]]
        }
      }

      P=P.map((v,i)=>{
        B.map((q,j)=>{
          if(i!=j&&v[7]!=j){
            d=Math.hypot(n=q[0]-v[0],b=q[1]-v[1],e=q[2]-v[2])
            if(d<1)v[8]=1
            p1=Math.atan2(n,e)
            p2=Math.acos(b/d)
            v[3]+=S(p1)*S(p2)/5/d**1.5
            v[4]+=C(p2)/5/d**1.5
            v[5]+=C(p1)*S(p2)/5/d**1.5
          }
        })
        d=Math.hypot(v[3],v[4],v[5])
        v[3]=v[3]/d*iV
        v[4]=v[4]/d*iV
        v[5]=v[5]/d*iV
        X=(v[0]+=v[3])
        Y=(v[1]+=v[4])
        Z=(v[2]+=v[5])
        Rt()
        X+=oX
        Y+=oY
        Z+=oZ
        s=Math.min(300,(v[6]/=1.018)*4000/Z/Z)
        x.fillStyle='#8ff1'
        l=Q()
        if(Z>1)x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
        return v
      }).filter(v=>v[6]>.2&&!v[8])

      x.strokeStyle='#fff8'
      B.map(q=>{
        X=q[0]+=q[3]
        Y=q[1]+=q[4]
        Z=q[2]+=q[5]
        if(X>fieldSize||X<-fieldSize)q[3]*=-1
        if(Y>fieldSize||Y<-fieldSize)q[4]*=-1
        if(Z>fieldSize||Z<-fieldSize)q[5]*=-1
        if(X>fieldSize)q[0]=fieldSize
        if(Y>fieldSize)q[1]=fieldSize
        if(Z>fieldSize)q[2]=fieldSize
        if(X<-fieldSize)q[0]=-fieldSize
        if(Y<-fieldSize)q[1]=-fieldSize
        if(Z<-fieldSize)q[2]=-fieldSize
        Rt()
        //q[0]=X
        //q[1]=Y
        //q[2]=Z
        qX=X+oX
        qY=Y+oY
        qZ=Z+oZ
        a.map((v,i)=>{
          if(!(i%3))x.beginPath();
          X=v[0],Y=v[1],Z=v[2],R(),d=H(X,Y,Z),X=X/d*oS+qX,Y=Y/d*oS+qY,Z=Z/d*oS+qZ,x.lineTo(...Q())
          if(i%3==2)x.closePath(),x.lineWidth=175/Z/Z,x.stroke()
        })
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

