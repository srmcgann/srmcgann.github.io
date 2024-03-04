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
      setTimeout(()=>rec.stop(),60000);
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
      //setTimeout(()=>startRecording(),2000)
    })

    star = new Image()
    star.src = 'star.png'

    //cloud = new Image()
    //cloud.src = 'cloud.png'

    Draw = () => {

      Rn=Math.random
      
      w=c.width
      cl=99,sc=w/cl
      rw=cl*.5625|0
      iBc=3,iBs=12,iBv=.5
      iPc=5,iPs=4,iPv=.5
      bnc=12

      if(!t){
        x.lineCap='round'
        x.linejoin='round'
        B=[]
        for(i=iBc+1;--i;){
          dn=0
          while(!dn){
            dn=1
            X=Rn()*cl|0
            Y=Rn()*rw|0
            if(X<iBs*1.5||X>cl-iBs*1.5||Y>rw-iBs*1.5||Y<iBs*1.5)dn=0
            B.map(v=>{if(Math.hypot(v[0]-X,v[1]-Y)<iBs)dn=0})
          }
          B=[...B,[X,Y,S(p=Rn()*Math.PI*2)*iBv,C(p)*iBv]]
        }
        P=[]
        for(i=iPc+1;--i;){
          dn=0
          while(!dn){
            dn=1
            X=Rn()*cl|0
            Y=Rn()*rw|0
            if(X<iPs*2||X>cl-iPs*2||Y>rw-iPs*2||Y<iPs*2)dn=0
            P.map(v=>{if(Math.hypot(v[0]-X,v[1]-Y)<iBs)dn=0})
            B.map(v=>{if(Math.hypot(v[0]-X,v[1]-Y)<(iBs+iPs)/2)dn=0})
          }
          P=[...P,[X,Y,S(p=Rn()*Math.PI*2)*iPv,C(p)*iPv]]
        }
        h=800
      }
      g=x.createLinearGradient(0,0,w,1080)
      g.addColorStop(0,'#0006')
      g.addColorStop(1,'#0086')
      x.fillStyle=g,x.fillRect(0,0,w,1080)

      Q=q=>{x.fillRect((X-q/2)*sc,(Y-q/2)*sc,q*sc,q*sc)}
      Q2=(v,s)=>{
        l=iPv-Math.hypot(v[2],v[3])
        v[2]*=1+l/50
        v[3]*=1+l/50
        X=v[0]
        Y=v[1]
        if(X<s/2||X>cl-s/2)v[2]*=-1
        if(Y<s/2||Y>rw-s/2)v[3]*=-1
        v[0]+=v[2]
        v[1]+=v[3]
      }
      
      B.map((v,j)=>{
        Q2(v,iBs)
        x.fillStyle='#26f8'

        X=v[0]
        Y=v[1]
        P.map((q,k)=>{
          if(Math.hypot(a=q[0]-X,b=q[1]-Y)<(d=(iBs+iPs)/2)){
            v[0]=q[0]-S(p=Math.atan2(a,b))*d
            v[1]=q[1]-C(p)*d
            v[2]-=S(p)/bnc
            v[3]-=C(p)/bnc
            q[0]=v[0]+S(p=Math.atan2(a,b))*d
            q[1]=v[1]+C(p)*d
            q[2]+=S(p)/bnc
            q[3]+=C(p)/bnc
          }
        })
        B.map((q,k)=>{
          if(j!=k&&Math.hypot(a=q[0]-X,b=q[1]-Y)<(d=iBs)){
            v[0]=q[0]-S(p=Math.atan2(a,b))*d
            v[1]=q[1]-C(p)*d
            v[2]-=S(p)/bnc
            v[3]-=C(p)/bnc
            q[0]=v[0]+S(p=Math.atan2(a,b))*d
            q[1]=v[1]+C(p)*d
            q[2]+=S(p)/bnc
            q[3]+=C(p)/bnc
          }
        })
        
        for(i=iBs*4+1;i--;){
          X=v[0]+S(p=Math.PI/iBs/2*i)*iBs/2
          Y=v[1]+C(p)*iBs/2
          Q(1)
        }
      })

      x.strokeStyle='#fff2'
      P.map((v,j)=>{
        Q2(v,iPs)
        X=v[0]
        Y=v[1]
        P.map((q,k)=>{
          if(k!=j){
            d=Math.hypot(a=q[0]-X,b=q[1]-Y)
            if(k<j){
              x.beginPath()
              for(k=0;k<(d*2+1)|0;k++){
                aX=X+a/d/2*k
                aY=Y+b/d/2*k
                E=1
                B.map(n=>{
                  E=50+Math.hypot(e=aX-n[0],f=aY-n[1])**2
                  p=Math.atan2(e,f)
                  aX+=S(p)*400/E
                  aY+=C(p)*400/E
                })
                
                x.lineTo(aX*sc,aY*sc)
              }
              x.lineWidth=sc
              x.stroke()
            }
            if(d<(d=iPs)){
              v[0]=q[0]-S(p=Math.atan2(a,b))*d
              v[1]=q[1]-C(p)*d
              v[2]-=S(p)/bnc
              v[3]-=C(p)/bnc
              q[0]=v[0]+S(p=Math.atan2(a,b))*d
              q[1]=v[1]+C(p)*d
              q[2]+=S(p)/bnc
              q[3]+=C(p)/bnc
            }
          }
        })

        l=P.length
        ar=Array(cl*rw*2).fill(0)
        x.fillStyle='#fff8'

        x.fillStyle='#2f68'
        for(i=iPs*4+1;i--;){
          X=v[0]+S(p=Math.PI/iPs/2*i)*iPs/2
          Y=v[1]+C(p)*iPs/2
          Q(1)
        }
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

