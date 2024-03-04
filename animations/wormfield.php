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
      setTimeout(()=>startRecording(),2000)
    })

    star = new Image()
    star.src = 'star.png'

    //cloud = new Image()
    //cloud.src = 'cloud.png'

    Draw = () => {

      x.fillStyle='#012a',x.fillRect(0,0,w=c.width,w),h=800
      R=(Rl,Pt,Yw)=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d}
      Q=q=>[960+X/Z*h,540+Y/Z*h]
      Rn=Math.random

      cl=10
      sp=2

      oX=0,oY=0,oZ=0//cl*sp
      Rl=0,Pt=0,Yw=0
      iPl=8,iPsl=.2,iWv=.1
      
      if(!t){
        PX=0,PY=0,PZ=0
        sql=2
        x.lineJoin=x.lineCap='round'
        P=Array(cl**3).fill().map((v,i)=>{
          X=((i%cl)-cl/2+.5)*sp
          Y=(((i/cl|0)%cl)-cl/2+.5)*sp
          Z=((i/cl/cl|0)-cl/2+.5)*sp
          d1=-1
          a=Array(iPl+1).fill().map((v,j)=>{
            tx=0
            tty=d1
            ty=-(d1=iPsl*j/(1+j/10))
            tz=0
            tvx=S(p1=Math.PI*2*Rn())*S(p2=Math.PI*Rn())*iWv
            tvy=C(p2)*iWv
            tvz=C(p1)*S(p2)*iWv
            return [tx,ty,tz,tvx,tvy,tvz,d1-(tty!=-1?tty:-.1)]
          })
          return [X,Y,Z,a]
        })
      }

      iPv=.12
      PRl=C(t/2)
      PPt=S(t/3)/3
      PYw=S(t/2)
      X=0,Y=0,Z=iPv
      R(PRl,PPt,PYw)
      PX+=X
      PY+=Y
      PZ+=Z
      
      P.map(v=>{
        tx=v[0]-PX
        ty=v[1]-PY
        tz=v[2]-PZ
        while(tx+v[3][v[3].length-1][0]<-cl/2*sp)tx+=cl*sp
        while(tx+v[3][v[3].length-1][0]>cl/2*sp)tx-=cl*sp
        while(ty+v[3][v[3].length-1][1]<-cl/2*sp)ty+=cl*sp
        while(ty+v[3][v[3].length-1][1]>cl/2*sp)ty-=cl*sp
        while(tz+v[3][v[3].length-1][2]<-cl/2*sp)tz+=cl*sp
        while(tz+v[3][v[3].length-1][2]>cl/2*sp)tz-=cl*sp
        
        X=v[3][v[3].length-1][3]
        Y=v[3][v[3].length-1][4]
        Z=v[3][v[3].length-1][5]
        R((Rn()-.5)*sql,(Rn()-.5)*sql,(Rn()-.5)*sql)
        v[3][v[3].length-1][3]+=X
        v[3][v[3].length-1][4]+=Y
        v[3][v[3].length-1][5]+=Z
        d=H(v[3][v[3].length-1][3],v[3][v[3].length-1][4],v[3][v[3].length-1][5])
        v[3][v[3].length-1][3]=v[3][v[3].length-1][3]/d*iWv
        v[3][v[3].length-1][4]=v[3][v[3].length-1][4]/d*iWv
        v[3][v[3].length-1][5]=v[3][v[3].length-1][5]/d*iWv
        v[3][v[3].length-1][0]+=X
        v[3][v[3].length-1][1]+=Y
        v[3][v[3].length-1][2]+=Z
        if(v[3][v[3].length-1][0]>cl*sp)v[3][v[3].length-1][0]-cl*sp
        if(v[3][v[3].length-1][1]>cl*sp)v[3][v[3].length-1][1]-cl*sp
        if(v[3][v[3].length-1][2]>cl*sp)v[3][v[3].length-1][2]-cl*sp
        if(v[0]>cl*sp)v[0]-cl*sp
        if(v[1]>cl*sp)v[1]-cl*sp
        if(v[2]>cl*sp)v[2]-cl*sp
        for(i=v[3].length-1;i--;){
          d=H(v[3][i][0]-v[3][i+1][0],v[3][i][1]-v[3][i+1][1],v[3][i][2]-v[3][i+1][2])
          v[3][i][0]=v[3][i+1][0]-(v[3][i+1][0]-v[3][i][0])/d*v[3][i][6]
          v[3][i][1]=v[3][i+1][1]-(v[3][i+1][1]-v[3][i][1])/d*v[3][i][6]
          v[3][i][2]=v[3][i+1][2]-(v[3][i+1][2]-v[3][i][2])/d*v[3][i][6]
        }
        
        v[3].map((q,j)=>{
          if(j<v[3].length-1){
            X=tx+q[0]
            Y=ty+q[1]
            Z=tz+q[2]
            R(0,0,-PYw)
            R(0,-PPt,0)
            R(-PRl,0,0)
            R(Rl,Pt,Yw)
            X+=oX,Y+=oY,Z+=oZ
            x.beginPath()
            x.lineTo(...Q())

            X=tx+v[3][j+1][0]
            Y=ty+v[3][j+1][1]
            Z=tz+v[3][j+1][2]
            R(0,0,-PYw)
            R(0,-PPt,0)
            R(-PRl,0,0)
            R(Rl,Pt,Yw)
            X+=oX,Y+=oY,Z+=oZ
            x.lineTo(...Q())
            x.lineWidth=Math.min(150,99/Z/(1+j))
            if(Z>.35){
              alpha=.85/(1+H(X,Y,Z)**8/12e5)
              x.strokeStyle=`hsla(${360/v[3].length*1.5*j+t*800},99%,${100-50/v[3].length*j}%,${alpha}`
              x.stroke()
            }
          }
        })
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
      xb.globalAlpha = .5+S(t*2)/2
      xb.drawImage(img, canvas2.width / 2 - img.width / 2 * s, canvas2.height / 2 - img.height / 2 * s, img.width * s, img.height * s)
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

