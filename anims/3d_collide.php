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


      x.fillStyle='#0008',x.fillRect(0,0,w=c.width,w),h=700
      R=(Rl,Pt,Yw)=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d}
      Q=q=>[960+X/Z*h,540+Y/Z*h]
      Rn=Math.random

      Rl=-t/8,Pt=S(t/1.5)*4,Yw=t/2
      oX=0,oY=0,oZ=3
      iBc=500,iBv=.1,iBs=.15
      G=1

      CB=(X,Y,Z)=>{b=[],l=(2**.5)/2;for(let i=6;i--;){for(let j=4;j--;){a=[S(p=Math.PI*2/4*j+Math.PI/4)*l,C(p)*l,.5],b=[...b,[a[i%3]*(e=i<3?-1:1)+X,a[(i+1)%3]*e+Y,a[(i+2)%3]*e+Z]]}};return b}

      if(!t){
        x.lineJoin=x.lineCap='round'
        P=[
          CB(-1,0,0),
          CB(1,0,0),
          CB(0,-1,0),
          CB(0,1,0),
          CB(0,0,-1),
          CB(0,0,1)
        ]
        B=Array(iBc).fill().map(v=>{
          return [
            (Rn()-.5)*G,
            (Rn()-.5)*G,
            (Rn()-.5)*G,
            (Rn()-.5)*iBv,
            (Rn()-.5)*iBv,
            (Rn()-.5)*iBv
          ]
        })
      }

      B.map((v,i)=>{

        gv=[0,1,0]
        X=gv[0],Y=gv[1],Z=gv[2]
        R(0,0,-Yw)
        R(0,-Pt,0)
        R(-Rl,0,0)
        gvx=X,gvy=Y,gvz=Z

        X=v[0]
        Y=v[1]
        Z=v[2]
        R(Rl,Pt,Yw)
        X+=oX,Y+=oY,Z+=oZ
        s=.5

        v[3]+=gvx/100
        v[4]+=gvy/100
        v[5]+=gvz/100
        
        v[3]/=1.05
        v[4]/=1.05
        v[5]/=1.05
        
        B.map((q,j)=>{
          if(j!=i){
            d=H(a=q[0]-v[0],b=q[1]-v[1],e=q[2]-v[2])
            if(d<iBs){
              v[3]/=1.1
              v[4]/=1.1
              v[5]/=1.1
              v[3]-=a/d/50
              v[4]-=b/d/50
              v[5]-=e/d/50
              q[3]/=1.1
              q[4]/=1.1
              q[5]/=1.1
              q[3]+=a/d/50
              q[4]+=b/d/50
              q[5]+=e/d/50
            }
          }
        })

        tx=v[0]+v[3]
        ty=v[1]+v[4]
        tz=v[2]+v[5]
        
        if(
          (tx>s*3 || tx<-s*3) ||
          (!(v[1]>-s && v[1]<s && v[2]>-s && v[2]<s) &&
          (v[0]>-s && v[0]<s && (tx>s || tx<-s)))
        ) v[3]*=-.9
        
        if(
          (ty>s*3 || ty<-s*3) ||
          (!(v[2]>-s && v[2]<s && v[0]>-s && v[0]<s) &&
          (v[1]>-s && v[1]<s && (ty>s || ty<-s)))
        ) v[4]*=-.9
        
        if(
          (tz>s*3 || tz<-s*3) ||
          (!(v[0]>-s && v[0]<s && v[1]>-s && v[1]<s) &&
          (v[2]>-s && v[2]<s && (tz>s || tz<-s)))
        ) v[5]*=-.9
        
        
        v[0]+=v[3]
        v[1]+=v[4]
        v[2]+=v[5]
 
        if(
          (v[0]>s||v[0]<-s)&&(v[2]>s||v[2]<-s) ||
          (v[1]>s||v[1]<-s)&&(v[0]>s||v[0]<-s) ||
          (v[2]>s||v[2]<-s)&&(v[1]>s||v[1]<-s)
        ) v[0]=v[1]=v[2]=0

        x.beginPath()
        x.arc(...Q(),400*iBs/Z,0,7)
        x.fillStyle='#04f6'
        x.fill()
      })

      P.map((v,i)=>{
        v.map((v,i)=>{
          X=v[0],Y=v[1],Z=v[2]
          
          if(!(i%4)) x.beginPath()
          R(Rl,Pt,Yw)
          X+=oX,Y+=oY,Z+=oZ
          x.lineTo(...Q())
          if(i%4==3){
            x.lineWidth=99/Z/Z
            x.strokeStyle='#4fc2'
            x.closePath()
            x.stroke()
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

