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
      setTimeout(()=>rec.stop(),197000);
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

   x.fillStyle='#0008',x.fillRect(0,0,w=c.width,w),h=800
  R=(Rl,Pt,Yw)=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d,X+=oX,Y+=oY,Z+=oZ}
  Q=q=>[c.width/2+X/Z*h,c.height/2+Y/Z*h]
  Rn=Math.random

  oX=0,oY=0,oZ=12+S(t*1.5)*4
  Rl=t/2,Pt=S(t)/2.5,Yw=S(t)/2
  cellSize=.25
  iCs=1,iMv=.5,sql=.2,MR=6

  RQa=(tx,ty,m)=>{
    a=[]
    for(let i=6;i--;){
      a=[...a,[tx+S(p=Math.PI*2/6*i+Math.PI/6)*cellSize*iCs,ty+C(p)*cellSize*iCs,0]]
    }
    b=[...b,[a,[1,1,1,1,1,1],[tx,ty,0],1,[],0,[],0]]
    a=[]
    for(let j=6;j--;){
      a=[]
      X=tx+S(p=Math.PI*2/6*j)*d
      Y=ty+C(p)*d
      for(i=6;i--;){
        a=[...a,[X+S(p=Math.PI*2/6*i+Math.PI/6)*cellSize*iCs,Y+C(p)*cellSize*iCs,0]]
      }
      b=[...b,[a,[1,1,1,1,1,1],[X,Y,0],1,[],0,[],0]]
    }
    if(m){
      for(let j=6;j--;){
        a=[]
        X=tx+S(p=Math.PI/3*j+Math.PI/6)*.75
        Y=ty+C(p)*.75
        for(i=6;i--;){
          a=[...a,[X+S(p=Math.PI*2/6*i+Math.PI/6)*cellSize*iCs,Y+C(p)*cellSize*iCs,0]]
        }
        b=[...b,[a,[1,1,1,1,1,1],[X,Y,0],1,[],0,[],0]]
      }
    }
  }
  RQb=(tx1,ty1)=>{
    RQa(tx1,ty1,0)
    for(j=6;j--;){
      RQa(tx1+S(p=l*j)*d*3,ty1+C(p)*d*3,1)
      RQa(tx1+S(p=l*j+Math.PI/6)*d*6*d*2,ty1+C(p)*d*6*d*2,0)
      RQa(tx1+S(p=l*j)*d*6,ty1+C(p)*d*6,1)
    }
  }

  RQc=(tx2,ty2)=>{
   RQb(tx2,ty2)
   for(let j=6;j--;){
      d1=5.25
      RQb(tx2+S(p=Math.PI*2/6*j+Math.PI/6)*d1,ty2+C(p)*d1)
    }
  }

  genPath=start=>{
    P=[]
    recurse=q=>{
      B[q][5]=1
      tc=0
      while(tc<20&&B[tq=B[q][4][B[q][4].length*Rn()|0]][5])tc++;
      n=5
      if(!B[tq][5]){
        p=(Math.atan2(B[tq][2][0]-B[q][2][0]+.00001,B[q][2][1]-B[tq][2][1])+Math.PI)/(Math.PI*2+.001)*6|0
        switch(p){
          case 0:
            B[q][1][0]=0
            B[tq][1][3]=0
            break
          case 1:
            B[q][1][1]=0
            B[tq][1][4]=0
            break
          case 2:
            B[q][1][2]=0
            B[tq][1][5]=0
            break
          case 3:
            B[q][1][3]=0
            B[tq][1][0]=0
            break
          case 4:
            B[q][1][4]=0
            B[tq][1][1]=0
            break
          case 5:
            B[q][1][5]=0
            B[tq][1][2]=0
            break;
        }
        P.push([q,tq])
        B[q][6].push(tq)
        B[tq][6].push(q)
        recurse(tq)
      }else{
        if(B.filter(v=>!v[5]).length)recurse(P[P.length*Rn()|0][0])
      }
    }
    recurse(start)
  }

  if(!t){x
    l=Math.PI*2/6    
    x.lineJoin=x.lineCap='round'
    genMaze=()=>{
      o=d=0.8660254037844386*cellSize*2
      b=[],a=[]
      for(i=6;i--;)a=[...a,[S(p=l*i+Math.PI/6)*cellSize*iCs,C(p)*cellSize*iCs,0]]
      b=[...b,[a,[1,1,1,1,1,1],[0,0,0],1,[],0,[],0]]
      RQc(0,0)
      for(let j=6;j--;){
        d1=10.5
        RQc(S(p=Math.PI*2/6*j+Math.PI/6)*d1,C(p)*d1)
      }
      M1=[0,0,0,S(p=Math.PI*2*Rn())*iMv,C(p)*iMv,0]
      M2=[0,0,0,S(p=Math.PI*2*Rn())*iMv,C(p)*iMv,0]
      b=b.filter(v=>Math.hypot(...v[2])<=MR)
      
      for(let i=0;i<b.length;++i){
        for(let j=i+1;j<b.length;++j){
          if(b[j][3]&&((d=Math.hypot(b[i][2][0]-b[j][2][0],b[i][2][1]-b[j][2][1]))<.01))b[j][3]=0
        }
      }
      b = b.filter(v=>v[3])
      for(let i=0;i<b.length;++i){
        for(let j=0;j<b.length;++j){
          if(i!=j && (d=Math.hypot(b[i][2][0]-b[j][2][0],b[i][2][1]-b[j][2][1]))-o<.1){
            b[i][4].push(j)
          }
        }
      }
      B = b
      genPath(0)
    }
    genMaze()
  }
  
  //if(!((t*60|0)%6)) genMaze()

  solve=(a,b)=>{
    if(found||memo[b])return
    if(a==b) return true
    memo[b]=1
    let test=0
    B[b][6].map(v=>{if(solve(a,v))found=1,sP.push(v),test=1})
    if(test) return true
  }

  M1[3]+=(Rn()-.5)*sql
  M1[4]+=(Rn()-.5)*sql
  d=(H=Math.hypot)(M1[3],M1[4])
  M1[3]-=(M1[3]-M1[3]/d*iMv)/5
  M1[4]-=(M1[4]-M1[4]/d*iMv)/5
  X=M1[0]+=M1[3]
  Y=M1[1]+=M1[4]
  Z=M1[2]+=M1[5]
  if(H(...M1)>MR)M1[3]-=S(p=A(M1[0],M1[1]))/4,M1[4]-=C(p)/4
  R(Rl,Pt,Yw)
  x.beginPath()
  x.arc(...Q(),1999/Z/Z,0,7)
  x.fillStyle='#6af9'
  x.fill()
  M2[3]+=(Rn()-.5)*sql
  M2[4]+=(Rn()-.5)*sql
  d=H(M2[3],M2[4])
  M2[3]-=(M2[3]-M2[3]/d*iMv)/5
  M2[4]-=(M2[4]-M2[4]/d*iMv)/5
  X=M2[0]+=M2[3]
  Y=M2[1]+=M2[4]
  Z=M2[2]+=M2[5]
  if(H(...M2)>MR)M2[3]-=S(p=A(M2[0],M2[1]))/4,M2[4]-=C(p)/4
  R(Rl,Pt,Yw)
  x.beginPath()
  x.arc(...Q(),1999/Z/Z,0,7)
  x.fillStyle='#6af9'
  x.fill()


  sP=[],found=0,memo=Array(5e5).fill(0)

  mindA=mindB=6e6
  B.map((v,i)=>{
    v[7]=0
    if((d1=H(v[2][0]-M1[0],v[2][1]-M1[1]))<mindA)ptA=i,mindA=d1
    if((d2=H(v[2][0]-M2[0],v[2][1]-M2[1]))<mindB)ptB=i,mindB=d2
  })
  B[ptA][7]=B[ptB][7]=1

  solve(ptA,ptB)
  sP.push(ptB)

  sP.map((v,j)=>{
    if(j<sP.length-1){
    x.beginPath()
      X=B[v][2][0]
      Y=B[v][2][1]
      Z=B[v][2][2]
      R(Rl,Pt,Yw)
      x.lineTo(...Q())
      X=B[sP[j+1]][2][0]
      Y=B[sP[j+1]][2][1]
      Z=B[sP[j+1]][2][2]
      R(Rl,Pt,Yw)
      x.lineTo(...Q())          
      x.strokeStyle='#3f66'
      x.lineWidth=1+Math.min(15,1500/Z/Z)
      x.stroke()
    }
  })

  P.map((v,j)=>{
    X=B[v[0]][2][0]
    Y=B[v[0]][2][1]
    Z=B[v[0]][2][2]
    R(Rl,Pt,Yw)
    tq=Q()
    for(let i=1;i<v.length;++i){
      x.beginPath()
      x.lineTo(...tq)
      X=B[v[1]][2][0]
      Y=B[v[1]][2][1]
      Z=B[v[1]][2][2]
      R(Rl,Pt,Yw)
      x.lineTo(...Q())
    }
    x.strokeStyle=`hsla(${t*400},99%,60%,.3`
    x.lineWidth=1+Math.min(15,600/Z/Z)
    x.stroke()
  })

  B.map((v,j)=>{
    if(v[7]){
      v[0].map((q,i)=>{
        X=q[0]
        Y=q[1]
        Z=q[2]
        R(Rl,Pt,Yw)
        if(!i)x.beginPath()
        x.lineTo(...Q())
        if(i==v[0].length-1){
          x.closePath()
          x.fillStyle='#f084'
          x.closePath()
          x.fill()
        }
      })
    }
    v[0].map((q,i)=>{
      if(v[1][i]){
        X=q[0]
        Y=q[1]
        Z=q[2]
        R(Rl,Pt,Yw)
        x.beginPath()
        x.lineTo(...Q())
        if(i<5){
          X=v[0][i+1][0]
          Y=v[0][i+1][1]
          Z=v[0][i+1][2]
        }else{
          X=v[0][0][0]
          Y=v[0][0][1]
          Z=v[0][0][2]
        }
        R(Rl,Pt,Yw)
        x.lineTo(...Q())
        x.strokeStyle='#62cc'
        x.lineWidth=1+Math.min(15,200/Z/Z)
        x.stroke()
      }
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

