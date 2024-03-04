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
      setTimeout(()=>rec.stop(),90000);
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
      setTimeout(()=>startRecording(),20)
    })

    star = new Image()
    star.src = 'star.png'

    //cloud = new Image()
    //cloud.src = 'cloud.png'

    Draw = () => {

      x.fillStyle='#0008',x.fillRect(0,0,w=c.width,w),h=800
      R=q=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d,X+=oX,Y+=oY,Z+=oZ}
      Q=q=>[960+X/Z*h,540+Y/Z*h]
      Rn=Math.random

      cl=81,rw=(cl*.5825|0)+1,sp=w/cl
      iBc=2,envV=.4,iEnvr=8.25
      iPv=.5
      
      if(!t){
        x.lineCap=x.lineJoin='round'
        P=[]
        
        env=Array(1).fill().map(v=>[Rn()*cl|0,Rn()*rw|0,S(p=Rn()*Math.PI*2)*envV,C(p)*envV])
        
        for(i=iBc;i--;){
          if(P.length){
            dn=0
            while(!dn){
              X=1+Rn()*(cl-1)|0
              Y=1+Rn()*(rw-2)|0
              X=cl/2|0
              Y=rw*.9|0
              dn=1
              P.map(q=>{
                if(q[0]==X && q[1]==Y) dn=0
              })
              if(dn) a=[X, Y, S(p=Rn()*Math.PI*2)*iPv,C(p)*iPv]
            }
          }else{
            a=[1+Rn()*(cl-1)|0,1+Rn()*(rw-2)|0,S(p=Rn()*Math.PI*2)*iPv,C(p)*iPv]
            //a=[cl/2|0,rw/2|0]
          }
          P=[...P,a]
        }
      }
      
      
      envg=Array(cl*2).fill().map(v=>Array(rw*2).fill(0))
      env.map(v=>{
        v[0]+=v[2]
        v[1]+=v[3]
        if(v[0]>cl-iEnvr){
          v[0]=cl-iEnvr
          v[2]*=-1
        }
        if(v[0]<iEnvr){
          v[0]=iEnvr
          v[2]*=-1
        }
        if(v[1]>rw-iEnvr*2){
          v[1]=rw-iEnvr*2
          v[3]*=-1
        }
        if(v[1]<iEnvr){
          v[1]=iEnvr
          v[3]*=-1
        }
        for(i=cl*rw;i--;){
          X1=i%cl
          Y1=i/cl|0
          X2=v[0]|0
          Y2=v[1]|0
          if((H=Math.hypot)(X1-X2,Y1-Y2)<iEnvr){
            envg[X1][Y1]=1
            x.fillStyle='#0ff4'
            x.fillRect(X1*sp,Y1*sp,sp,sp)
          }
        }
      })
      
      pth=Array(cl).fill().map(v=>Array(rw).fill(0))
      pth[(P[1][0]+.5)|0][(P[1][1]-.5)|0]=1
      
      Rc=(X,Y)=>{
        if(X<1 || Y<1 || X>cl-1 || Y>rw-1 || found || memo[X][Y]>4 ) return
        memo[X][Y]++
        if(X==TX && Y==TY){
          pth[X][Y-1]=1
          found=1
          return
        }
        d1=H(X-1-TX,Y-TY)
        d2=H(X+1-TX,Y-TY)
        d3=H(X-TX,Y-1-TY)
        d4=H(X-TX,Y+1-TY)
        d=1
        if(d&&X>0&&(!envg[X-1][Y-1])&&d1<=d2&&d1<=d3&&d1<=d4)X-=1,d=0
        if(d&&X<cl-1&&(!envg[X+1][Y-1])&&d2<=d1&&d2<=d3&&d2<=d4)X+=1,d=0
        if(d&&Y>0&&(!envg[X][Y-2])&&d3<=d1&&d3<=d2&&d3<=d4)Y-=1,d=0
        if(d&&Y<rw-1&&(!envg[X][Y])&&d4<=d1&&d4<=d2&&d4<=d3)Y+=1,d=0
        if(!envg[X][Y-1])pth[X][Y-1]=1
        if(!d){
          Rc(X,Y)
        }else{
          tct+=1
          switch(((t*10)%4)|0){
            case 0: Rc(X-1,Y-1); break
            case 1: Rc(X+1,Y+1); break
            case 2: Rc(X+1,Y-1); break
            case 3: Rc(X-1,Y+1); break
          }
        }
      }

      TX=(P[0][0]+.5)|0
      TY=(P[0][1]+.5)|0
      found=0
      memo=Array(cl*2).fill().map(v=>Array(rw*2).fill(0))
      X=(P[1][0]+.5)|0
      Y=(P[1][1]+.5)|0
      tct=0
      if(!envg[X][Y]&&!envg[P[0][0]|0][(P[0][1]|0)]) Rc(X,Y)
      
      x.strokeStyle='#cff2'
      for(i=cl*rw;i--;){
        X=(a=i%cl)*sp
        Y=(b=i/cl|0)*sp
        x.lineWidth=1
        x.strokeRect(X,Y,sp,sp)
        if(pth[a][b]){
          x.fillStyle='#eff3'
          //x.fillRect(X,Y,sp,sp)
          x.beginPath()
          x.arc(X,Y,sp,0,7)
          x.fill()
        }
      }


      P.map(v=>{
        env.map(q=>{
          d=H(a=q[0]-v[0],b=q[1]-v[1])
          if(d<iEnvr*1.5){
            v[0]=q[0]-S(p=Math.atan2(a,b))*iEnvr*1.5
            v[1]=q[1]-C(p)*iEnvr*1.5
          }
        })
        v[0]+=v[2]
        v[1]+=v[3]
        if(v[0]>cl-2){
          v[0]=cl-2
          v[2]*=-1
        }
        if(v[0]<1){
          v[0]=1
          v[2]*=-1
        }
        if(v[1]>rw-1*2){
          v[1]=rw-1*2
          v[3]*=-1
        }
        if(v[1]<1){
          v[1]=1
          v[3]*=-1
        }
        x.beginPath()
        x.fillStyle='#0f04'
        X=v[0]*sp+sp/2
        Y=v[1]*sp-sp/2
        x.arc(X,Y,sp*2,0,7)
        x.fill()
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

