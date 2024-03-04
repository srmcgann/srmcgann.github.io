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

      iBs=.5,iBc=6,iBv=.15
      oX=0,oY=0,oZ=8
      Rl=0,Pt=-t/1.5,Yw=t
      iGs=8

      if(!t){
        B=[]
        for(i=iBc;i--;){
          B=[...B,[Rn()-.5,Rn()-.5,Rn()-.5,S(p=Math.PI*2*Rn())*S(q=Math.PI*Rn())*iBv,C(q)*iBv,C(p)*S(q)*iBv]]
        }
      }

      x.lineJoin='round'
      x.lineCap='round'
      /*
      x.strokeStyle='#2fc1'
      l=2**.5
      for(j=6;j--;){
        for(x.beginPath(),a=[],i=4;i--;)a=[S(p=Math.PI*2/4*i+Math.PI/4)*iGs/2*l,C(p)*iGs/2*l,iGs/2],X=a[j%3]*(d=j>2?-1:1),Y=a[(j+1)%3]*d,Z=a[(j+2)%3]*d,R(),x.lineTo(...Q())
        x.closePath(),x.lineWidth=1500/Z/Z,x.stroke()
      }
      */

      Sk=[]
      B.map((v,i)=>{
        B.map((q,j)=>{
          if(j!=i){
            e=Math.hypot(X=q[0]-v[0],Y=q[1]-v[1],Z=q[2]-v[2])
            o=p1=Math.atan2(X,Z)
            m=p2=Math.acos(Y/e)
            tx=v[0]
            ty=v[1]
            tz=v[2]
            l=e
            vx=S(o)*S(m)
            vy=C(m)
            vz=C(o)*S(m)
            tx1=tx
            ty1=ty
            tz1=tz
            tx2=tx+vx*l
            ty2=ty+vy*l
            tz2=tz+vz*l
            Sk=[...Sk,[tx1,ty1,tz1,tx2,ty2,tz2,e,q[0],q[1],q[2]]]
            if(e<iBs*2){
              vx=S(p1)*S(p2)
              vy=C(p2)
              vz=C(p1)*S(p2)
              v[0]=q[0]-vx*iBs*2
              v[1]=q[1]-vy*iBs*2
              v[2]=q[2]-vz*iBs*2
              v[3]-=vx/5
              v[4]-=vy/5
              v[5]-=vz/5
              q[0]=v[0]+vx*iBs*2
              q[1]=v[1]+vy*iBs*2
              q[2]=v[2]+vz*iBs*2
              q[3]+=vx/5
              q[4]+=vy/5
              q[5]+=vz/5
            }
          }
        })
        d=Math.hypot(v[3],v[4],v[5])
        v[3]=v[3]/d*iBv
        v[4]=v[4]/d*iBv
        v[5]=v[5]/d*iBv
        v[0]+=v[3]
        v[1]+=v[4]
        v[2]+=v[5]
        if(v[0]>iGs/2-iBs)v[0]=iGs/2-iBs,v[3]*=-1
        if(v[0]<-iGs/2+iBs)v[0]=-iGs/2+iBs,v[3]*=-1
        if(v[1]>iGs/2-iBs)v[1]=iGs/2-iBs,v[4]*=-1
        if(v[1]<-iGs/2+iBs)v[1]=-iGs/2+iBs,v[4]*=-1
        if(v[2]>iGs/2-iBs)v[2]=iGs/2-iBs,v[5]*=-1
        if(v[2]<-iGs/2+iBs)v[2]=-iGs/2+iBs,v[5]*=-1
        x.beginPath()
        X=v[0],Y=v[1],Z=v[2]
        R()
        x.arc(...Q(),iBs*1e3/Z,0,7)
        x.fillStyle='#0ff6'
        x.fill()
      })

      sd=2

      Sk=Sk.map(v=>{
        d=1/12
        lx1=v[0]
        ly1=v[1]
        lz1=v[2]
        lx2=v[0]+(v[3]-v[0])*d
        ly2=v[1]+(v[4]-v[1])*d
        lz2=v[2]+(v[5]-v[2])*d
        v=[lx1,ly1,lz1,lx2,ly2,lz2,Math.hypot(lx1-lx2,ly1-ly2,lz1-lz2),v[7],v[8],v[9]]
        return v
      })
      
      
      for(j=16;j--;){
        tSk=[]
        for(m=2;m--;){
          Sk=Sk.map(v=>{
            d=v[6]
            lx1=v[3]
            ly1=v[4]
            lz1=v[5]
            n=(1/(1+(L=Math.hypot(v[7]-v[3],v[8]-v[4],v[9]-v[5]))))
            a=((v[0]-v[3])+(v[3]-v[7])*n)/2
            b=((v[2]-v[5])+(v[5]-v[9])*n)/2
            e=((v[1]-v[4])+(v[4]-v[8])*n)/2
            U=Math.min(1.5,L**3/100)
            p1=Math.atan2(a,b)+(Rn()-.5)*U
            p2=Math.acos(e/Math.hypot(a,b,e))+(Rn()-.5)*U
            lx2=v[3]-S(p1)*S(p2)*d
            ly2=v[4]-C(p2)*d
            lz2=v[5]-C(p1)*S(p2)*d
            if(Rn()<.12)tSk=[...tSk,[lx1,ly1,lz1,lx2,ly2,lz2,v[6],v[7],v[8],v[9]]]
            return v
          })
        }
        Sk=[...Sk,...tSk]

        tSk2=[]
        for(m=2;m--;){
          tSk=tSk.map(v=>{
            e=v[6]
            lx1=v[3]
            ly1=v[4]
            lz1=v[5]

            n=(1/(L=1+(Math.hypot(v[7]-v[3],v[8]-v[4],v[9]-v[5]))))
            a=((v[0]-v[3])+(v[3]-v[7])*n)/2
            b=((v[2]-v[5])+(v[5]-v[9])*n)/2
            e=((v[1]-v[4])+(v[4]-v[8])*n)/2
            U=Math.min(1.5,L**3/100)
            p1=Math.atan2(a,b)+(Rn()-.5)*U
            p2=Math.acos(e/Math.hypot(a,b,e))+(Rn()-.5)*U
            lx2=v[3]-S(p1)*S(p2)*e
            ly2=v[4]-C(p2)*e
            lz2=v[5]-C(p1)*S(p2)*e
            if(Rn()<.12)tSk2=[...tSk2,[lx1,ly1,lz1,lx2,ly2,lz2,v[6],v[7],v[8],v[9]]]
            return v
          })
        }
        Sk=[...Sk,...tSk2]
      }
      
      //x.lineJoin='butt'
      //x.lineCap='butt'
      Sk.map((v,i)=>{
        x.beginPath()
        x.strokeStyle='#aef2'
        d=1
        lx=(v[3]-v[0])*d
        ly=(v[4]-v[1])*d
        lz=(v[5]-v[2])*d
        X=v[0],Y=v[1],Z=v[2]
        R()
        x.lineTo(...Q())
        X=v[0]+lx,Y=v[1]+ly,Z=v[2]+lz
        R()
        x.lineTo(...Q())
        x.lineWidth=1+300/(1+i/100)/Z
        x.stroke()
        
        X=v[7]
        Y=v[8]
        Z=v[9]
        R()
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

