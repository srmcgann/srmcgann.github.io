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
t=t2=0
rsz=window.onresize=()=>{c.width=c.clientWidth,c.height=c.clientHeight}
rsz()
CP=()=>{if(c.width!=1920)c.width=1920,c.height=c.width/1.778;P=typeof P=='undefined'?[]:P;B=typeof B=='undefined'?[]:B
}


    startRecording = () => {
      console.log('recording')
      const chunks = []; // here we will store our recorded media chunks (Blobs)
      const stream = canvas2.captureStream(); // grab our canvas MediaStream
      const rec = new MediaRecorder(stream,{
      audioBitsPerSecond : 128000,
      videoBitsPerSecond : 5000000
    }); // init the recorder
      // every time the recorder has new data, we will store it in our array
      rec.ondataavailable = e => chunks.push(e.data);
      // only when the recorder stops, we construct a complete Blob from all the chunks
      rec.onstop = e => exportVid(new Blob(chunks, {type: 'video/webm'}));

      rec.start();
      setTimeout(()=>{rec.stop();console.log('finished')}, 200000);
    }


    Draw = () => {


  switch((t/4|0)%13){
    case 0: c.height=56.25;eval(unescape(escape`𩡯𬠨𨰮𭱩𩁴𪀽𭰽𜐰𜀬𪐽𝡥𜰻𪐭𛐻𮀮𩡩𫁬𤡥𨱴𚁘𛁙𛀱𛀱𚐩𮀮𩡩𫁬𤱴𮑬𩐽𨁨𬱬𚀤𮱓𚀨𩀽𣑡𭁨𛡨𮑰𫱴𚀵𜀭𚁘👩𙑷𚐬𜠸𛐨𦐽𪐯𭱼𜀩𚐪𚠳𛰨𜡥𜰫𠰨𭀪𜠩𚠱𞐹𜀩𛑴𚠲𜀩𛰲𜀩𚠱𜰵𚱴𚠲𜀰𯐬𞐹𙐬𙁻𝐰𚱃𚁤𛑴𚠴𚐪𝐰𯐥𨀻`.replace(/u../g,'')))
    break
    case 1:CP();eval(unescape(escape`𩡯𬠨𫐽𜀻𚰫𫐼𝰸𞰩𤀽𭀿𦰮𛠮𤀬𦰹𝀰𛀵𜀰𛁓𚁰🐨𫐭𭀥𞐩𚠪𜠩𛁃𚁰𚐬𜁝𧐺𦱝𞱐𛡭𨑰𚁶🐾𮀮𩡩𫁬𤡥𨱴𚁶𦰰𧐫👶𦰲𧐯🐮𞐵𛁶𦰱𧐫👶𦰳𧐯🐮𞐵𛁭𛁭𛁸𛡦𪑬𫁓𭁹𫁥👠𪁳𫁡𚀤𮱰𚠪𜰯𜱥𝰪𚁶𦰴𧐫𚰩𯐬𞐰𙐬𝐰𙐬𛠰𜑠𚐩𛁐👐𛡦𪑬𭁥𬠨𭠽🡶𦰴𧐼𫐩`.replace(/u../g,'')))
    break
    case 2:eval(unescape(escape`𤐽𫐽🡸𛡬𪑮𩑔𫰨𞐶𜀫𤰨𬀽𪐯𞐮𝐵𚱴𚐪𤰨𫠽𬐯𜐲𚐯𚁚👃𚁰𚐪𤰨𫠩𛑓𚁴𚐭𜠩𚡨𛁨𚱃𚁮𚐯𦠪𪀩𞱦𫱲𚁣𛡷𪑤𭁨𯀽𪀽𝐴𜀬𮀮𩡩𫁬𤱴𮑬𩐽𙰣𜀹𨠸𙰬𪐽𪀪𝀻𪐭🐲𞱸𛡢𩑧𪑮𤁡𭁨𚁸𛡦𪑬𫀨𚐩𚑩𩠨𚁩𚰨𬐽𪐯𝠰𯀰𚐩𙐲𚑑𚁑𚁑𚁑𚀩𛀫𚱩𚐬𚰫𬐩𛀭𛑩𚐻`.replace(/u../g,'')));P=[]
    break
    case 3:CP();for(m=20;m--;)P.push([(R=q=>Math.random()*q)(w=c.width|=0),R(w),1]);P=P.filter(v=>v[2]<120).map((v,i)=>{x.strokeStyle=`hsla(${i*18+t*400},99%,${50+(t*99+i*20)%50}%,.8)`,x.arc(...v,0,7,x.beginPath(x.lineWidth=800/(v[2]+=5)**1.4)),x.stroke();return v});t2=0
    break
    case 4:
for(x.fillStyle='#0001',x.fillRect(0,0,w=2e3,w),P=t?P:[],m=9;++m<20;)P.push([(m+t)**4%w,0]);P.map(v=>{for(a=v[0],b=v[1]+=5,e=i=3;i--;b+=C(p)*s/d)e+=d=Math.hypot(E=a-(960+S(p=2*i+S(t/9)*20)*400),F=b-540+C(p)*200)**.005,a+=S(p=Math.atan2(E,F))*(s=130)/d;x.fillStyle=`hsla(${e**40/6e27-t*300},99%,${45+(e/5)**300/1.2e24}%,.02`,x.fillRect(a,b,s,-s)});P=P.filter(v=>v[1]<1e3)
    break
    case 5:sd=32;x.fillRect(0,0,w=c.width=1920,w);if(!t2){R=q=>{X=S(p=(A=(M=Math).atan2)(X,Y)+Rl)*(d=H(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d,Z+=2.5};Q=q=>[c.width/2+X/Z*1e3,c.height/2+Y/Z*1e3];B=Array(sd).fill().map(v=>[(O=Math.random)(),O(),O()]),L=q=>q*99**3/d,n=0;for(m=250/(1+sd/9)|0;m--;){B.map((v,i)=>{f=g=h=0,B.map(q=>{d=(1+(H=Math.hypot)(a=v[0]-q[0],b=v[1]-q[1],e=v[2]-q[2])*9)**3,f+=L(a),g+=L(b),h+=L(e)}),d=H(v[0]+=f,v[1]+=g,v[2]+=h),v[0]*=1/d,v[1]*=1/d,v[2]*=1/d})};n=6e6,B.map(v=>{B.map(q=>{if((d=H(q[0]-v[0],q[1]-v[1],q[2]-v[2]))&&d<n)n=d})})};Rl=t/4,Pt=-t/2,Yw=t,x.lineCap='round',B.map((v,i)=>{B.map((q,j)=>{if(j>i){d=H(q[0]-v[0],q[1]-v[1],q[2]-v[2]);if(d<n*1.22+sd**2/2e5){x.beginPath(),x.lineTo(...Q(R(X=v[0],Y=v[1],Z=v[2]))),k=Z+4,x.lineTo(...Q(R(X=q[0],Y=q[1],Z=q[2]))),x.globalAlpha=5e3/k**5,x.strokeStyle='#fff8',x.lineWidth=Math.min(60,16/Z),x.stroke(),x.strokeStyle=`hsla(${t*99},99%,50%,.2)`,x.lineWidth=Math.min(60,200/Z),x.stroke()}}})});t2++
    break
    case 6:CP();R=q=>{X=S(p=(A=(M=Math).atan2)(X,Z)+Yw)*(d=(H=Math.hypot)(X,Z)),Z=C(p)*d;Z+=oZ};Q=q=>[960+X/Z*700,540+Y/Z*700];x.fillStyle='#0008',x.fillRect(0,0,w=c.width,w),Yw=t/2,oZ=10,CR=(tx,ty,tz,pz)=>{x.beginPath();for(i=16;i--;){X=tx+S(p=i/2.546);Y=ty+C(p),Z=tz,R(),x.lineTo(...Q())};x.strokeStyle=`hsla(${11*(pz+t*4|0)},99%,${75+S(pz/8-t*8)*25}%,${Math.min(.3,((pz+16)**3/8e3)*((16-pz)**3/4e3))}`;x.lineWidth=600/Z/Z;x.closePath();x.stroke()};B=[];for(k=8;k--;){px=S(p=Math.PI*4/8*(k+(t*6|0)))*(d=S(t));py=C(p)*d;pz=(k*4)-(t*6%1)*4-10;P=[a=[px,py,pz/2]],CR(...a,pz);for(m=1;m<3;++m){for(j=6;j--;){P=[...P,[tx=px+S(p=j+.52+t)*m*2,ty=py+C(p)*m*2,tz=pz/2,pz]];CR(tx,ty,tz,pz)}};B=[...B,P]}B.map(v=>{v.map((m,i)=>{v.map((q,j)=>{if(j>i){X=m[0];Y=m[1];Z=m[2];R();x.beginPath();x.lineTo(...Q());X=q[0];Y=q[1];Z=q[2];R();x.lineTo(...Q());x.lineWidth=600/Z/Z;x.strokeStyle=`hsla(${11*(q[3]+t*4|0)},99%,${75+S(q[3]/8-t*8)*25}%,${Math.min(.1,((q[3]+16)**3/1e4)*((16-q[3])**3/1e4))}`;x.stroke()}})})});t2=0
    break
    case 7:x.fillStyle='#0006',x.fillRect(0,0,c.width,c.height);c.width=450,c.height=c.width/1.778;(P=t2?[...P,...Array(w=450).fill([(Q=q=>Math.random()*w)(),Q()]).map(v=>[...v,S(p=Q())*(d=Q()/90),C(p)*d,8])].filter(v=>v[4]|0):[]).map((v,i)=>{x.fillStyle=`hsla(${t*600},99%,${50+(i%50)}%,.8)`,x.fillRect(v[0]+=v[2],v[1]+=v[3],s=v[4]*=.91,s)});t2=7
    break
    case 8:CP();x.fillStyle='#0004',x.fillRect(0,0,w=c.width,w),h=800;R=()=>{X=S(p=A(X,Y)+Rl)*(d=(H=(M.hypot))(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d,Z+=oZ};Rn=Math.random;Q=q=>[960+X/Z*h,540+Y/Z*h],G=5,oZ=G*4.25,Rl=0,Pt=0,Yw=0,iPv=.5,iPs=20,iPrr=.6,iPc=6,sql=.2;if(t2==7)x.lineCap='round',P=Array(iPc).fill().map(v=>[-G/2,0,0,S(p=Rn()*7)*iPv,0,C(p)*iPv,[]]);P.map(v=>{p=(A=(M=Math).atan2)(v[3],v[5])+(Rn()-.5)*sql,v[1]=3+S(t)*3,v[3]=S(p)*iPv,v[5]=C(p)*iPv,v[0]+=v[3],v[1]+=v[4],v[2]+=v[5];if(v[0]>0||v[0]<-G*2)v[3]*=-1;if(v[2]>G*2||v[2]<-G*2)v[5]*=-1;v[6].push([v[0],v[1],v[2],iPs]);v[6].map((q,i)=>{q[3]-=iPrr;q[2]-=.4;if(i){for(m=4;m--;){X=q[0]*(m%2?-1:1),Y=q[1]*(m<2?-1:1),Z=q[2],R(),x.beginPath(),x.lineTo(...Q()),X=v[6][i-1][0]*(m%2?-1:1),Y=v[6][i-1][1]*(m<2?-1:1),Z=v[6][i-1][2],R();if(Z>.5)with(x)lineTo(...Q()),lineWidth=q[3]*500/((1+Z)**2),strokeStyle=`hsla(${i*40+t*400},99%,${100-(50/((1+1/v[6].length*i)**4))}%,.3`,stroke()}}});v[6]=v[6].filter(v=>v[3]>.1)});t2=10
    break
    case 9:CP();g=x.createLinearGradient(0,0,0,w=c.width),g[a='addColorStop'](0,'#48f3'),g[a](1,'#ffd3'),x[f='fillStyle']=g,x.fillRect(0,0,w,w),h=800,cl=100,rw=cl*.5625|0,iS=w/cl*4,eX=10000,dm=1.08,el=65,Q=(X,Y,s,cl)=>x.fillRect(X-s/2,Y-s/2,s,s),Rn=Math.random;if(t2==10)for(P=[],N=i=5600;i--;)P=[...P,[a=(i%cl)*w/cl+(w/cl/2),b=(i/cl|0)*1080/rw+(1080/rw/2),0,0,a,b]];for(B=[],m=4;m--;){if(Rn()<.1){l=P[Rn()*N|0],B=[...B,[l[0]+Rn(),l[1]+Rn(),1]]}};P.map(v=>{B.map(q=>{d=eX/(100+Math.hypot(a=v[0]-q[0],b=v[1]-q[1])**1.15)*q[2],v[2]+=S(p=Math.atan2(a,b))*d,v[3]+=C(p)*d});v[2]+=(v[4]-v[0])/el,v[3]+=(v[5]-v[1])/el,X=v[0]+=v[2]/=dm
Y=v[1]+=v[3]/=dm,x[f]=`hsla(${(d=Math.hypot(v[2],v[3])*7)-t*200},99%,${10+d/1.5}%,.03`,Q(X,Y,iS)});t2=1
    break
    case 10:CP();x[k='fillStyle']='#0104',x.fillRect(0,0,w=2e3,w);((t2-1)*60|0)%120||(h=540,Pi=(M=Math).PI,n=199,Rn=Math.random,D=a=>{x[m='beginPath'](),x.arc(...Q(),a*270/Z,0,7),x.fill()},W=q=>[X=S(p=Rn()*Pi*2)*S(q=Rn()*Pi)*n,Y=C(p)*S(q)*n,Z=C(q)*n],B=[...W(),-X/(d=(H=M.hypot)(X,Y,Z)/(4+Rn()*4)),-Y/d,-Z/d],P=Array(256).fill().map((v,i)=>[((i%8)-(l=3.5))*6,(((i/8|0)%8)-l)*6,(i/128|0)*6-3,0,0,0])),R=(a,b,d)=>{Y=S(p=(A=M.atan2)(b,d)+t/4)*(d=H(b,d)),Z=C(p)*d,X=S(p=A(a,Z)+t/4)*(d=H(a,Z)),Z=C(p)*d,Z+=70};Q=q=>[960+X/Z*h,h+Y/Z*h];R(B[0]+=B[3],B[1]+=B[4],B[2]+=B[5]);if(Z>1)x[k]='#25f4',D(20);x[k]='#3f43',P.map((v,i)=>{R(v[0]+=v[3]/=(l=1.02),v[1]+=v[4]/=l,v[2]+=v[5]/=l);if(Z>1)D(3);if(H(a=v[0]-B[0],b=v[1]-B[1],d=v[2]-B[2])*2<3+20){v[3]+=(a+B[3])/12,v[4]+=(b+B[4])/12,v[5]+=(d+B[5])/12,B[3]-=(a+v[3])/500,B[4]-=(b+v[4])/500,B[5]-=(d+v[5])/500};P.map((q,j)=>{if(i!==j&&H(a=v[0]-q[0],b=v[1]-q[1],d=v[2]-q[2])<3){v[3]+=(a+q[3])/60,v[4]+=(b+q[4])/60,v[5]+=(d+q[5])/60}})});t2=2
    break
    case 11:x.fillStyle='#0004',x.fillRect(0,0,w=c.width,N=1080),iV=10,iR=60,sq=.1,Rn=(M=Math).random,P=(t2!=2)?P:Array(10).fill().map(v=>[960,N/2,iR,S(p=Rn()*M.PI*2)*iV,C(p)*iV,[],0]);R=P=>{P=P.filter(v=>v[2]>10).map(v=>{if(v[2]<iR)v[2]/=1.08;d=(H=M.hypot)(v[3],v[4]),p=(A=M.atan2)(v[3],v[4])+((v[6]+=Rn()-.5)*sq),v[6]=M.min(1,M.max(-1,v[6])),v[0]+=v[3]=S(p)*d,v[1]+=v[4]=C(p)*d;if(v[0]>w)v[0]-=w;if(v[0]<0)v[0]+=w;if(v[1]>N)v[1]-=N;if(v[1]<0)v[1]+=N;x.beginPath(),x.fillStyle=`hsla(${v[2]*1.5-10},99%,${40+v[2]}%,${(v[2]**2/500)}`,x.arc(v[0],v[1],v[2],0,7),x.fill();if(!((v[2]|0)%10))for(m=2;m--;)v[5].push([v[0],v[1],v[2]/2+Rn()*v[2]/2,S(p=A(v[3],v[4])-M.PI+(Rn()-.5)/10)/2*iV,C(p)/2*iV,[],0]);v[5]=R(v[5]);return v});return P};P=R(P);t2=0
    break
    case 12:CP();x.fillStyle='#0008',x.fillRect(0,0,w=1920,w),h=540;Q=q=>[960+X/Z*h,h+Y/Z*h];R=(g,e,f)=>{Y=S(p=(A=(M=Math).atan2)(e,f)+t/2)*(d=(H=M.hypot)(e,f)),Z=C(p)*d,X=S(p=A(g,Z)+t/2)*(d=H(g,Z)),Z=C(p)*d};if(!t2){oX=oY=0,oZ=6;for(V=[],a=[[p=1.618,-1,0],[p,1,0],[-p,1,0],[-p,-1,0]],P=[],j=3;j--;)b=[],a.map(v=>b=[...b,v[j%3],v[(1+j)%3],v[(2+j)%3]]),P=[...P,b];P.map(v=>{for(i=4;i--;)V=[...V,[v[p=i*3],v[p+1],v[p+2]]]});SD=G=>{let a=[];for(let i=0;i<(l=G.length);i+=3)a=[...a,e=[((K=G[k=(i+1)%l])[0]+(m=G[i%l])[0])/2,(K[1]+m[1])/2,(K[2]+m[2])/2],[...K],b=[((I=G[(i+2)%l])[0]+K[0])/2,(I[1]+K[1])/2,(I[2]+K[2])/2],b,[...I],d=[(I[0]+m[0])/2,(I[1]+m[1])/2,(I[2]+m[2])/2],d,[...m],e,e,b,d];return a};a=SD(SD("#'+#(.#'((-&'&,(-..$#.$))*$$+*)-%%&-%,&)*%*,%+,*+,'+$#.-)'(&".split('').map(v=>V[v.charCodeAt(0)-35])))};for(j=3;j--;){N=(j*2+t*3)%6,x.strokeStyle=`hsla(${t*h},99%,${99/(1+N**2/40)}%,${8e4/N**9}`,a.map((v,i)=>{R(...v),d=H(X,Y,Z),X=X/d*N+oX,Y=Y/d*N+oY,Z=Z/d*N+oZ,x.lineTo(...Q());if(i%3==2)x.closePath(),x.lineWidth=99/Z/Z,x.beginPath(x.stroke())})};t2++
    break
  }



      //s=.25
      //x2.save()
      //x2.translate(canvas2.width / 2, canvas2.height / 2)
      //x2.rotate(0)
      //sc = 1
      //x2.globalAlpha=1
      x2.clearRect(0,0,4e4,4e4)
      x2.drawImage(c,0,0,canvas2.width,canvas2.height)
      //x2.restore()
      //s=.55
      //x2.globalAlpha = .5+S(t*6)/2
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
      Draw()
      setTimeout(()=>startRecording(),20)
  </script>
</html>

