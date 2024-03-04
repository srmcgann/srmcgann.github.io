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
      setTimeout(()=>startRecording(),20)
    })

    star = new Image()
    star.src = 'star.png'

    //cloud = new Image()
    //cloud.src = 'cloud.png'

    Draw = () => {

      x.fillStyle='#0005',x.fillRect(0,0,w=c.width,w)
      Rn=Math.random
      
      iBv=10,iBs=50,iBc=6,mg=200
      iPc=6,iPv=20,iPs=16,iPr=.4
      
      if(!t){
        P=[]
        B=Array(iBc).fill().map(v=>[iBs+iBv+Rn()*(w-iBs*2-iBv*2),iBs+iBv+Rn()*(1080-iBs*2-iBv*2),S(p=Math.PI*2*Rn())*iBv,C(p)*iBv,iBs])
      }

      if(!((t*60|0)%1)){
        x.lineJoin='round'
        x.lineCap='round'
        B.map((v,j)=>{
          if(Rn()<1){
            X=v[0]
            Y=v[1]
            for(i=iPc;i--;){
              P=[...P,[v[0]+S(p=Math.PI*2/iPc*i)*iBs,v[1]+C(p)*iBs,S(p)*iPv,C(p)*iPv,iPs,j,[]]]
            }
          }
        })
      }
      
      P=P.filter(v=>v[4]>1)
      P.map(v=>{
        v[4]/=1.08
        v[6]=[]
        mind=6e6
        while(mind>iBs*2){
          v[0]+=v[2]
          v[1]+=v[3]
          mind=6e6
          B.map((q,j)=>{
            if(v[5]!=j){
              if((d=Math.hypot(a=q[0]-v[0],b=q[1]-v[1]))<mind){
                mind=d
                p1=Math.atan2(a,b)
              }
            }
          })
          //if(mind<iBs)v[7]=0
          p2=Math.atan2(v[2],v[3])
          if(Math.abs(p1-p2)>=Math.PI){
            if(p1<p2){
              p1+=Math.PI*2
            }else{
              p2+=Math.PI*2
            }
          }
          v[2]=S(p=p2+(p1-p2)/iPr/(1+mind**.5))*iPv
          v[3]=C(p)*iPv
          if(mind>iBs)v[6]=[...v[6],[v[0],v[1]]]
        }
        
        x.beginPath()
        v[6].map(v=>{
          x.lineTo(v[0],v[1])
        })
        x.strokeStyle=`hsla(${t*300},99%,60%,.1`
        x.lineWidth=v[4]*3
        x.stroke()
        x.strokeStyle=`hsla(${t*300},99%,90%,.4`
        x.lineWidth=v[4]/1
        x.stroke()
        //while(v[6].length>iPml)v[6].shift()
        
        //x.beginPath()
        //x.arc(v[0],v[1],v[4],0,7)
        //x.fillStyle='#0ff8'
        //x.fill()
        //x.beginPath()
      })

      B.map((v,i)=>{
        v[0]+=v[2]
        v[1]+=v[3]
        if(v[0]<iBs+mg||v[0]>w-iBs-mg)v[2]*=-.9
        if(v[1]<iBs+mg||v[1]>1080-iBs-mg)v[3]*=-.9
        if(v[0]<iBs+mg)v[0]=iBs+mg
        if(v[0]>w-iBs-mg)v[0]=w-iBs-mg
        if(v[1]<iBs+mg)v[1]=iBs+mg
        if(v[1]>1080-iBs-mg)v[1]=1080-iBs-mg
        d=Math.hypot(v[2],v[3])
        v[2]+=(v[2]*(iBv-d))/200
        v[3]+=(v[3]*(iBv-d))/200
        B.map((q,j)=>{
          if(q!=j){
            d=Math.hypot(a=q[0]-v[0],b=q[1]-v[1])
            if(d<v[4]+q[4]){
              v[2]-=S(p=Math.atan2(a,b))*2
              v[3]-=C(p)*2
              v[0]=q[0]-S(p)*(d=q[4]+v[4])
              v[1]=q[1]-C(p)*d
              q[2]+=S(p)*2
              q[3]+=C(p)*2
              q[0]=v[0]+S(p)*d
              q[1]=v[1]+C(p)*d
            }
          }
        })
        x.beginPath()
        x.fillStyle=x.strokeStyle='#0f86'
        x.arc(v[0],v[1],v[4],0,7)
        x.fill()
        x.lineWidth=v[4]/8
        x.stroke()
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

