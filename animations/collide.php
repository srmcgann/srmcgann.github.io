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
      setTimeout(()=>rec.stop(), 264000);
    }

    let img = new Image()
    img.src = 'MTSQu.png' //light
    //img.src = '28aPJs.png' //dark
    let img2 = new Image()
    img2.src = 'FrqlF.jpg'
    bg = new Image()
    bg.src = 'coral-nebula-xy.jpg'
    //vid = document.createElement('video')
    //vid.src = '2teams.mp4'
    //vid.loop = true
    //vid.muted = true
    //vid.play()
    img2.addEventListener('load', ()=>{
      Draw()
      setTimeout(()=>startRecording(),2000)
    })

    //cloud = new Image()
    //cloud.src = 'cloud.png'

    Draw = () => {


      x.fillStyle='#0105',x.fillRect(0,0,w=c.width,w),h=540
      
      oX=oY=0,oZ=99,pX=0,pY=0,pZ=0,O=8
      cl=16,Br=20,Pr=3,BV=5,spc=2
      
      El=q=>Math.acos(Z/Math.hypot(X,Z,Y))
      W=q=>[X=S(p=Math.random()*Math.PI*2)*S(q=Math.random()*Math.PI)*199,Y=C(p)*S(q)*199,Z=C(q)*199];
      (t*60|0)%120||(BV=3+Math.random()*8,Br=15+Math.random()*25,B=[...W(),-X/(d=Math.hypot(X,Y,Z))*BV,-Y/d*BV,-Z/d*BV],P=Array(cl**2*2).fill().map((v,i)=>[((i%cl)-(l=cl/2-.5))*Pr*spc,(((i/cl|0)%cl)-l)*Pr*spc,((i/cl/cl)|0)*spc*Pr-(spc*Pr/2),0,0,0]))
      R=q=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d}
      Q=q=>[960+X/Z*h,h+Y/Z*h]

      Rl=0,Pt=Math.PI/2-.2+t/4,Yw=t/4

      X=(B[0]+=B[3])+pX
      Y=(B[1]+=B[4])+pY
      Z=(B[2]+=B[5])+pZ
      R()
      X+=oX
      Y+=oY
      Z+=oZ
      if(Z>1){
        x.beginPath()
        x.arc(...Q(),Br*270/Z,0,7)
        x.fillStyle='#28f8'
        x.fill()
      }
      P.map((v,i)=>{
        X=(v[0]+=v[3]/=1.02)+pX
        Y=(v[1]+=v[4]/=1.02)+pY
        Z=(v[2]+=v[5]/=1.02)+pZ
        R()
        X+=oX
        Y+=oY
        Z+=oZ
        if(Z>1){
          x.beginPath()
          x.arc(...Q(),Pr*270/Z,0,7)
          x.fillStyle='#0f46'
          x.fill()
        }
        if(H(v[0]-B[0],v[1]-B[1],v[2]-B[2])<(Pr+Br)/2){
          v[3]+=(v[0]-B[0])/O+B[3]/O
          v[4]+=(v[1]-B[1])/O+B[4]/O
          v[5]+=(v[2]-B[2])/O+B[5]/O
          B[3]-=(v[0]-B[0])/199+v[3]/199
          B[4]-=(v[1]-B[1])/199+v[4]/199
          B[5]-=(v[2]-B[2])/199+v[5]/199
        }
        P.map((q,j)=>{
          if(i!==j&&H(v[0]-q[0],v[1]-q[1],v[2]-q[2])<Pr){
            v[3]+=(v[0]-q[0])/O+q[3]/O
            v[4]+=(v[1]-q[1])/O+q[4]/O
            v[5]+=(v[2]-q[2])/O+q[5]/O
            q[3]-=(v[0]-q[0])/O+v[3]/O
            q[4]-=(v[1]-q[1])/O+v[4]/O
            q[5]-=(v[2]-q[2])/O+v[5]/O
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
      s=.35
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

