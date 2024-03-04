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
      setTimeout(()=>rec.stop(),291000);
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
      R=q=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d,X+=oX,Y+=oY,Z+=oZ}
      Q=q=>[960+X/Z*h,540+Y/Z*h]
      Rn=Math.random

      Rl=0,Pt=-t/2,Yw=t
      oX=0,oY=0,oZ=9
      iPc=1900/5,iPbr=5
      iBv=.2,iBc=3,iBs=1.5
      G=5

      if(!t){
        Rv=q=>[S(p=Math.PI*2*Rn())*S(q=Math.PI*Rn())*iBv,C(q)*iBv,C(p)*S(q)*iBv]
        x.lineCap=x.lineJoin='round'
        B=Array(iBc).fill().map(v=>[Rn(),Rn(),Rn(),...Rv()])
        P=Array(iPbr).fill().map((v,j)=>Array(iPc).fill().map((v,i)=>[a=S(p=Math.PI*2/50*i)/4+(i/iPc-.5)*10,b=C(p/2)*3*S(Math.PI/2+Math.PI*(i/iPc-.5)),f=(j-iPbr/2+.5)*1.5,0,0,0,a,b,f]))
      }
      
      B.map(v=>{
        v[0]+=v[3]
        v[1]+=v[4]
        v[2]+=v[5]
        if(v[0]<-G||v[0]>G)v[3]*=-1
        if(v[1]<-G||v[1]>G)v[4]*=-1
        if(v[2]<-G||v[2]>G)v[5]*=-1
        x.beginPath()
        x.fillStyle='#4af4'
        X=v[0]
        Y=v[1]
        Z=v[2]
        R()
        x.arc(...Q(),Math.max(1,iBs*600/Z),0,7)
        x.fill()
      })
 
      P.map(v=>{
        v.map((v,i,ar)=>{
          v[3]+=(v[6]-v[0])/9
          v[4]+=(v[7]-v[1])/9
          v[5]+=(v[8]-v[2])/9
          v[0]+=v[3]/=1.15
          v[1]+=v[4]/=1.15
          v[2]+=v[5]/=1.15
          B.map(q=>{
            d=H(a=q[0]-v[0],b=q[1]-v[1],e=q[2]-v[2])
            if(d<iBs){
              p1=A(a,e),p2=M.acos(b/d)
              v[0]=q[0]-S(p1)*S(p2)*iBs
              v[1]=q[1]-C(p2)*iBs
              v[2]=q[2]-C(p1)*S(p2)*iBs
              v[3]-=S(p1)*S(p2)/1000
              v[4]-=C(p2)/1000
              v[5]-=C(p1)*S(p2)/1000
            }
          })
          if(i<ar.length-2){
            x.beginPath()
            X=ar[i][0]
            Y=ar[i][1]
            Z=ar[i][2]
            R(Rl,Pt,Yw)
            x.lineTo(...Q())
            X=ar[i+1][0]
            Y=ar[i+1][1]
            Z=ar[i+1][2]
            R(Rl,Pt,Yw)
            x.lineTo(...Q())
            x.strokeStyle='#2fa3'
            x.lineWidth=iBs*800/Z/Z
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

