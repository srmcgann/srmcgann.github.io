(function(){ 

    function rasterizePoint(x,y,z,vars){

        var p,d;
        x-=vars.camX;
        y-=vars.camY;
        z-=vars.camZ;
        p=Math.atan2(x,z);
        d=Math.sqrt(x*x+z*z);
        x=Math.sin(p-vars.yaw)*d;
        z=Math.cos(p-vars.yaw)*d;
        p=Math.atan2(y,z);
        d=Math.sqrt(y*y+z*z);
        y=Math.sin(p-vars.pitch)*d;
        z=Math.cos(p-vars.pitch)*d;
        var rx1=-1000;
        var ry1=1;
        var rx2=1000;
        var ry2=1;
        var rx3=0;
        var ry3=0;
        var rx4=x;
        var ry4=z;
        var uc=(ry4-ry3)*(rx2-rx1)-(rx4-rx3)*(ry2-ry1);
        if(!uc) return {x:0,y:0,d:-1};
        var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
        var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
        if(!z)z=0.000000001;
        if(ua>0&&ua<1&&ub>0&&ub<1){
            return {
                x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
                y:vars.cy+y/z*vars.scale,
                d:(x*x+y*y+z*z)
            };
        }else{
            return {
                x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
                y:vars.cy+y/z*vars.scale,
                d:-1
            };
        }
    }


    function reverseRasterize(depth, vars){

        var vert=new Vert(),d,p;
        vert.x=vars.camX+(-vars.cx+vars.mx)/vars.scale*depth;
        vert.y=vars.camY+(-vars.cy+vars.my)/vars.scale*depth;
        vert.z=vars.camZ+depth;    
        d=Math.sqrt((vert.y-vars.camY)*(vert.y-vars.camY)+(vert.z-vars.camZ)*(vert.z-vars.camZ));
        p=Math.atan2(vert.y-vars.camY,vert.z-vars.camZ);
        vert.y=vars.camY+Math.sin(p+vars.pitch)*d;
        vert.z=vars.camZ+Math.cos(p+vars.pitch)*d;
        d=Math.sqrt((vert.x-vars.camX)*(vert.x-vars.camX)+(vert.z-vars.camZ)*(vert.z-vars.camZ));
        p=Math.atan2(vert.x-vars.camX,vert.z-vars.camZ);
        vert.x=vars.camX+Math.sin(p+vars.yaw)*d;
        vert.z=vars.camZ+Math.cos(p+vars.yaw)*d;

        d=Math.sqrt((vert.x-vars.camX)*(vert.x-vars.camX)+
                    (vert.y-vars.camY)*(vert.y-vars.camY)+
                    (vert.z-vars.camZ)*(vert.z-vars.camZ));
        var x = vert.x-vars.camX;
        var y = vert.y-vars.camY;
        var z = vert.z-vars.camZ;
        var t=d/depth;
        vert.x=vars.camX+x/t;
        vert.y=vars.camY+y/t;
        vert.z=vars.camZ+z/t;
        return vert;
    }


    function rgb(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*16);
        var g = parseInt((0.5+Math.cos(col)*0.5)*16);
        var b = parseInt((0.5-Math.sin(col)*0.5)*16);
        return "#"+r.toString(16)+g.toString(16)+b.toString(16);
    }


    function elevation(x,y,z){

        var dist = Math.sqrt(x*x+y*y+z*z);
        if(dist && z/dist>=-1 && z/dist <=1) return Math.acos(z / dist);
        return 0.00000001;
    }


    function subdivide(shape,subdivisions){

        var t=shape.segs.length;
        for(var i=0;i<t;++i){
            var x1=shape.segs[i].a.x;
            var y1=shape.segs[i].a.y;
            var z1=shape.segs[i].a.z;
            var x2=(shape.segs[i].b.x-x1)/subdivisions;
            var y2=(shape.segs[i].b.y-y1)/subdivisions;
            var z2=(shape.segs[i].b.z-z1)/subdivisions;
            shape.segs[i].b.x=x1+x2;
            shape.segs[i].b.y=y1+y2;
            shape.segs[i].b.z=z1+z2;
            var x3=x2;
            var y3=y2;
            var z3=z2;
            for(var k=0;k<subdivisions-1;++k){
                shape.segs.push(new Seg(x1+x2,y1+y2,z1+z2,x1+x2+x3,y1+y2+y3,z1+z2+z3));
                x2+=x3;
                y2+=y3;
                z2+=z3;
            }
        }
    }


    function transform(shape,scaleX,scaleY,scaleZ){

        for(var i=0;i<shape.segs.length;++i){
            shape.segs[i].a.x*=scaleX;
            shape.segs[i].a.y*=scaleY;
            shape.segs[i].a.z*=scaleZ;
            shape.segs[i].b.x*=scaleX;
            shape.segs[i].b.y*=scaleY;
            shape.segs[i].b.z*=scaleZ;
        }
    }


    function Vert(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }


    function Seg(x1,y1,z1,x2,y2,z2){
        this.a = new Vert(x1,y1,z1);
        this.b = new Vert(x2,y2,z2);
        this.dist=0;
    }


    function process(vars){

        var p,d,t=0;
        p = Math.atan2(vars.camX, vars.camZ);
        d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ)+Math.cos(vars.frameNo/250)/60;
        t=Math.sin(vars.frameNo/380)/160;
        vars.camX = Math.sin(p + t) * d;
        vars.camZ = Math.cos(p + t) * d;
        vars.camY = -6-Math.sin(vars.frameNo/200) * 3;
        vars.yaw = Math.PI + p + t;
        vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2+.05;

        var point=reverseRasterize(1000, vars);
        var x1=-1, y1=0, z1=-1, x2=1, y2=0, z2=-1, x3=0, y3=0, z3=1;
        var D=-x1*(y2*z3-y3*z2)+x2*(y3*z1-y1*z3)+x3*(y1*z2-y2*z1);
        var A = y1*(z2-z3)+y2*(z3-z1)+y3*(z1-z2);
        var B = z1*(x2-x3)+z2*(x3-x1)+z3*(x1-x2);
        var C = x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2);
        var uc=A*(vars.camX-point.x)+B*(vars.camY-point.y)+C*(vars.camZ-point.z);
        var u=uc?(A*vars.camX+B*vars.camY+C*vars.camZ+D)/uc:-1;
        var x=vars.camX+u*(point.x-vars.camX);
        var y=vars.camY+u*(point.y-vars.camY);
        var z=vars.camZ+u*(point.z-vars.camZ);

        if(vars.mbutton){
            if(vars.pulse<10) vars.pulse+=.5;
        }
        var s=vars.shapes[1];
        for(var i=0;i<s.segs.length;++i){
            s.segs[i].a.y/=1.04;
            d=Math.sqrt((x-s.segs[i].a.x)*(x-s.segs[i].a.x)+(z-s.segs[i].a.z)*(z-s.segs[i].a.z))+1;
            s.segs[i].a.y+=(-.125+1/(1+d*d))/3;
            s.segs[i].a.y-=Math.cos(1+d*2+vars.pulse+vars.frameNo/12)*vars.pulse/6/(5+d*d);
            s.segs[i].b.y/=1.04;
            d=Math.sqrt((x-s.segs[i].b.x)*(x-s.segs[i].b.x)+(z-s.segs[i].b.z)*(z-s.segs[i].b.z))+1;
            s.segs[i].b.y+=(-.125+1/(1+d*d))/3;
            s.segs[i].b.y-=Math.cos(1+d*2+vars.pulse+vars.frameNo/12)*vars.pulse/6/(5+d*d);
        }
        vars.pulse/=1.1;
        vars.shapes[2].x=x;
        vars.shapes[2].z=z;
    }


    function draw(vars){

        vars.ctx.clearRect(0, 0, canvas.width, canvas.height);

        for(var i=0;i<vars.shapes.length;++i){
            for(var j=0;j<vars.shapes[i].segs.length;++j){
                var x=vars.shapes[i].x+vars.shapes[i].segs[j].a.x;
                var y=vars.shapes[i].y+vars.shapes[i].segs[j].a.y;
                var z=vars.shapes[i].z+vars.shapes[i].segs[j].a.z;
                var pointa=rasterizePoint(x,y,z,vars);
                if(pointa.d != -1){
                    var x=vars.shapes[i].x+vars.shapes[i].segs[j].b.x;
                    var y=vars.shapes[i].y+vars.shapes[i].segs[j].b.y;
                    var z=vars.shapes[i].z+vars.shapes[i].segs[j].b.z;
                    var pointb=rasterizePoint(x,y,z,vars);
                    if(pointb.d != -1){
                        vars.ctx.lineWidth=1+vars.shapes[i].lineWidth/(1+pointa.d);
                        switch(i){
                            case 0:
                                vars.ctx.strokeStyle="#fff";
                                vars.ctx.globalAlpha=.75;
                                break;
                            case 1:
                                vars.ctx.strokeStyle=rgb(-vars.pulse/4+2-vars.shapes[i].segs[j].a.y*Math.PI/1.25);
                                vars.ctx.globalAlpha=1;
                            break;
                            case 2:
                                vars.ctx.strokeStyle="#3f3";
                                vars.ctx.globalAlpha=.75;
                            break;
                        }
                        vars.ctx.beginPath();
                        vars.ctx.moveTo(pointa.x,pointa.y);
                        vars.ctx.lineTo(pointb.x,pointb.y);
                        vars.ctx.stroke();
                    }
                }
            }
        }
    }


    function loadRectangle(x,y,z,lineWidth){

        var shape={};
        shape.x=x;
        shape.y=y;
        shape.z=z;
        shape.segs=[];
        shape.segs.push(new Seg(-1,0,-1,1,0,-1));
        shape.segs.push(new Seg(1,0,-1,1,0,1));
        shape.segs.push(new Seg(1,0,1,-1,0,1));
        shape.segs.push(new Seg(-1,0,1,-1,0,-1));
        shape.lineWidth=lineWidth;
        return shape;
    }


    function loadScene(vars){

        vars.shapes.push(loadRectangle(-.1,-1.1,-.2,300));
        transform(vars.shapes[vars.shapes.length-1],6.4,0,6.4);
        subdivide(vars.shapes[vars.shapes.length-1],20);

        var shape={},p,x1,y1,z1,x2,y2,z2,t,t2=0,ls=.25;
        var t=ls*Math.sqrt(3),rows=.8/ls*10,cols=.7/ls*10;
        shape.x=0;
        shape.y=0;
        shape.z=0;
        shape.segs=[];
        for(var j=-rows/2;j<rows/2;++j){
            t2++;
            for(var k=-cols/2;k<cols/2;++k){
                for(var i=0;i<(k==-cols/2||j==-rows/2||j==rows/2-1?6:3);++i){
                    p=Math.PI*2/6*i;
                    x1=(t2%2?t/2:0)+k*t+Math.sin(p)*ls;
                    y1=0;
                    z1=j*ls*1.5+Math.cos(p)*ls;
                    p=Math.PI*2/6*(i+1);
                    x2=(t2%2?t/2:0)+k*t+Math.sin(p)*ls;
                    y2=0;
                    z2=j*ls*1.5+Math.cos(p)*ls;
                    shape.segs.push(new Seg(x1,y1,z1,x2,y2,z2));
                }
            }
        }
        shape.lineWidth=100;
        vars.shapes.push(shape);

        vars.shapes.push(loadRectangle(0,0,0,100));
        transform(vars.shapes[vars.shapes.length-1],.75,1,.75);
    }


    function frame(vars) {

        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("#canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.canvas.width = document.body.clientWidth;
            vars.canvas.height = document.body.clientHeight;
            window.addEventListener("resize", function(){
                vars.canvas.width = document.body.clientWidth;
                vars.canvas.height = document.body.clientHeight;
                vars.cx=vars.canvas.width/2;
                vars.cy=vars.canvas.height/2;
            }, true);
            vars.canvas.addEventListener("mousemove", function(e){
                var rect = canvas.getBoundingClientRect();
                vars.mx = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.canvas.addEventListener("mousedown", function(e){
                vars.mbutton=1;
            }, true);
            vars.canvas.addEventListener("mouseup", function(e){
                vars.mbutton=0;
            }, true);
            vars.canvas.addEventListener("touchstart", function(e){
                vars.mbutton=1;
                e.preventDefault();
                var rect = canvas.getBoundingClientRect();
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.canvas.addEventListener("touchend", function(e){
                vars.mbutton=0;
            }, true);
            vars.canvas.addEventListener("touchmove", function(e){
                e.preventDefault();
                var rect = canvas.getBoundingClientRect();
                vars.mx = Math.round((e.changedTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvas.width);
                vars.my = Math.round((e.changedTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvas.height);
            }, true);
            vars.frameNo=0;
            vars.camX = 0;
            vars.camY = 0;
            vars.camZ = -12;
            vars.pitch = 0;
            vars.yaw = 0;
            vars.mx=0;
            vars.my=0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
            vars.scale=1200;
            vars.phase=0;
            vars.shapes=[];
            vars.pulse=0;
            loadScene(vars);
        }

        vars.frameNo++;
        requestAnimationFrame(function() {
          frame(vars);
        });

        process(vars);
        draw(vars);
    }

frame();
})();