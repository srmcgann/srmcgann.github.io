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
      setTimeout(()=>rec.stop(),259000);
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
      setTimeout(()=>startRecording(),8000)
    })

    star = new Image()
    star.src = 'star.png'

    //cloud = new Image()
    //cloud.src = 'cloud.png'

    Draw = () => {


      x.fillStyle='#0008',x.fillRect(0,0,w=c.width,w),h=700
      R=(Rl,Pt,Yw)=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d}
      Q=q=>[960+X/Z*h,540+Y/Z*h]
      Rn=Math.random

      if(!t){
        x.lineJoin=x.lineCap='round'
        oX=0,oY=0,oZ=0
        Rl=0,Pt=0,Yw=0
        PX=0,PY=0,PZ=0
        PRl=PPt=PYw=p1v=p2v=0
        mSD=5,mR=2.75,iRStl=50,iRSd=.4,iRSs=.6,segprog=0
        iPSc=2000, G=60
        PS=Array(iPSc).fill().map(v=>[(Rn()-.5)*G*2,(Rn()-.5)*G*2,(Rn()-.5)*G*2])
        RS=[]
        RSQ=q=>{
          while(RS.length<iRStl){
            if(RS.length){
              X=0
              Y=0
              Z=iRSd
              p1v+=(Rn()-.5)*iRSs
              p2v+=(Rn()-.5)*iRSs
              p1v/=1.02
              p2v/=1.02
              p1=RS[RS.length-1][3]-(RS[RS.length-1][3]-p1v)/20
              p2=RS[RS.length-1][4]-(RS[RS.length-1][4]-p2v)/20
              R(0,0,p1)
              R(0,p2,0)
              X+=(TX=RS[RS.length-1][0])
              Y+=(TY=RS[RS.length-1][1])
              Z+=(TZ=RS[RS.length-1][2])
            }else{
              X=TX=0
              Y=TY=0
              Z=TZ=-2
              p1=0
              p2=0
            }
            MX=X,MY=Y,MZ=Z
            RSI=Array(mSD).fill().map((v,j)=>{
              a=[]
              sd=6,ls=.5+S(t*2)/2.5
              for(i=sd;i--;){
                X=S(p=Math.PI*2/sd*i+Math.PI/sd-t*2)*ls
                Y=C(p)*ls
                Z=iRSd
                Y-=mR
                R(Math.PI*2/mSD*j+S(t)*3,0,0)
                R(0,0,p1)
                R(0,p2,0)
                X+=TX,Y+=TY,Z+=TZ
                a=[...a,[X,Y,Z]]
              }
              return a
            })
            
            RS=[...RS,[MX,MY,MZ,p1,p2,RSI]]
          }
        }
        RSQ()
      }
      
      iPv=5
      speed=10
      segprog+=iPv

      PX-=(PX-(RS[0][0]+(RS[1][0]-RS[0][0])/speed*segprog))/5
      PY-=(PY-(RS[0][1]+(RS[1][1]-RS[0][1])/speed*segprog))/5
      PZ-=(PZ-(RS[0][2]+(RS[1][2]-RS[0][2])/speed*segprog))/5
      PRl=0//+=(RS[10][6]-PRl)/20
      PPt+=(RS[5][4]-PPt)/20
      PYw+=(RS[5][3]-PYw)/20

      if(segprog>=speed){
        segprog=0
        RS.shift()
        RSQ()
      }
      
      PS.map(v=>{
        X=v[0]-PX
        Y=v[1]-PY
        Z=v[2]-PZ
        while(v[0]-PX<-G)v[0]+=G*2
        while(v[1]-PY<-G)v[1]+=G*2
        while(v[2]-PZ<-G)v[2]+=G*2
        while(v[0]-PX>G)v[0]-=G*2
        while(v[1]-PY>G)v[1]-=G*2
        while(v[2]-PZ>G)v[2]-=G*2
        R(-PRl,-PPt,-PYw)
        X+=oX,Y+=oY,Z+=oZ
        if(Z>1){
          x.beginPath()
          x.fillStyle=`hsla(${0},99%,99%,${(G-Math.abs(Z))**4/20000}`
          x.arc(...Q(),1+40/Z,0,7)
          x.fill()
        }
        return v
      })
      
      RS.map((v,k)=>{
        if(0&&k<RS.length-1){
          X=v[0]-PX
          Y=v[1]-PY
          Z=v[2]-PZ
          R(-PRl,-PPt,-PYw)
          R(Rl,Pt,Yw)
          X+=oX,Y+=oY,Z+=oZ
          if(Z>.3){
            x.beginPath()
            x.lineTo(...Q())
            X=RS[k+1][0]-PX
            Y=RS[k+1][1]-PY
            Z=RS[k+1][2]-PZ
            R(-PRl,-PPt,-PYw)
            R(Rl,Pt,Yw)
            X+=oX,Y+=oY,Z+=oZ
            x.lineTo(...Q())
            x.lineWidth=Math.min(200,19/Z)
            x.strokeStyle='#2fa6'
            if(Z>.1){
              x.stroke()
            }
          }
        }
        v[5].map(v=>{
          x.beginPath()
          v.map(v=>{
            X=v[0]-PX
            Y=v[1]-PY
            Z=v[2]-PZ
            R(-PRl,-PPt,-PYw)
            R(Rl,Pt,Yw)
            X+=oX,Y+=oY,Z+=oZ
            x.lineTo(...Q())
          })
          if(Z>.3){
            x.lineWidth=Math.min(50,260/(1+Z)**2)
            x.closePath()
            x.strokeStyle=`hsla(${140},99%,65%,${.25-((Z+1)/((1+iRStl)*(1+iRSd))*3)**3/2}`
            x.stroke()
          }
        })
        if(k<RS.length-1){
          v[5].map((v,j)=>{
            v.map((v,i)=>{
              x.beginPath()
              X=v[0]-PX
              Y=v[1]-PY
              Z=v[2]-PZ
              R(-PRl,-PPt,-PYw)
              R(Rl,Pt,Yw)
              X+=oX,Y+=oY,Z+=oZ
              if(Z>.3){
                x.lineTo(...Q())
                X=RS[k+1][5][j][i][0]-PX
                Y=RS[k+1][5][j][i][1]-PY
                Z=RS[k+1][5][j][i][2]-PZ
                R(-PRl,-PPt,-PYw)
                R(Rl,Pt,Yw)
                X+=oX,Y+=oY,Z+=oZ
                  if(Z>.1){
                  x.lineTo(...Q())
                  x.lineWidth=Math.min(50,260/(1+Z)**2)
                  x.strokeStyle=`hsla(${140},99%,65%,${.25-((Z+1)/((1+iRStl)*(1+iRSd))*3)**3/2}`
                  x.stroke()
                }
              }
            })
          })
        }
      })

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

