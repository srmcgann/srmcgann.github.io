(function(){
    html = document.documentElement;
    cx = html.clientWidth / 2;
    cy = html.clientHeight / 2;
    var timer;
    var playerX = 1,
        playerY = 0,
        playerZ = 1;
    var pi = Math.acos(-1);
    var perspective = 4;
    var oscale = 100 * perspective;
    var scale = oscale;
    var roll = 0,
        pitch = 0,
        yaw = 0,
        moveableCamera = 0;
    var particles = [],
        vertex = [0, 0, 0, 0, 0, 0, 0, 0];
    var GWaveIntensity = 500,
        multiColor = 1,
        maxParticleSize = 40;

    function initialize() {
      ms = 0;
      reshape();
      loadScene();
      roll = 0;
      pitch = 0;
      yaw = 0;
      playerX = 1;
      playerY = 0;
      playerZ = -2000;
      process();
    }

    function spawnParticle(waveDirection) {
      vertex[6] = 25+maxParticleSize * Math.random(); //radius
      p1 = pi * 2 * Math.random();
      p2 = pi * 2 * Math.random();
      ls = Math.random() * 750;
      vertex[0] = Math.sin(p1) * Math.cos(p2) * ls; //x
      vertex[1] = Math.cos(p1) * Math.cos(p2) * ls; //y
      vertex[2] = 1000 + Math.sin(p2) * ls; //z
      vertex[3] = 0; //vx
      vertex[4] = 0; //vy
      vertex[5] = 0; //vy
      if (multiColor) {
        vertex[7] = ms/6+4+pi / 2 + pi / maxParticleSize * vertex[6]/1.5; //color
      } else {
        vertex[7] = -1;
      }
      for (i = 0; i < particles.length; ++i) {
        dist = 1 + Math.sqrt((vertex[0] - particles[i][0]) * (vertex[0] - particles[i][0]) + (vertex[1] - particles[i][1]) * (vertex[1] - particles[i][1]) + (vertex[2] - particles[i][2]) * (vertex[2] - particles[i][2]));
        particles[i][3] += (vertex[0] - particles[i][0]) / dist * GWaveIntensity * waveDirection / particles[i][6];
        particles[i][4] += (vertex[1] - particles[i][1]) / dist * GWaveIntensity * waveDirection / particles[i][6];
        particles[i][5] += (vertex[2] - particles[i][2]) / dist * GWaveIntensity * waveDirection / particles[i][6];
      }
      particles.push(vertex.slice());
    }

    function destroyParticle(index, waveDirection) {
      for (i = 0; i < particles.length; ++i) {
        if (i != index) {
          dist = 1 + Math.sqrt((particles[index][0] - particles[i][0]) * (particles[index][0] - particles[i][0]) + (particles[index][1] - particles[i][1]) * (particles[index][1] - particles[i][1]) + (particles[index][2] - particles[i][2]) * (particles[index][2] - particles[i][2]));
          particles[i][3] += (particles[index][0] - particles[i][0]) / dist * GWaveIntensity * waveDirection / particles[i][6];
          particles[i][4] += (particles[index][1] - particles[i][1]) / dist * GWaveIntensity * waveDirection / particles[i][6];
          particles[i][5] += (particles[index][2] - particles[i][2]) / dist * GWaveIntensity * waveDirection / particles[i][6];
        }
      }
      particles.splice(index, 1);
    }

    function loadScene() {
      var initParticles = 3000,
          zeroInitialVelocities = 1;
      particles = [];
      for (i = 0; i < initParticles; ++i) spawnParticle();
      if (zeroInitialVelocities) {
        for (i = 0; i < particles.length; ++i) {
          particles[i][3] = 0;
          particles[i][4] = 0;
          particles[i][5] = 0;
        }
      }
    }

    function rgb(col){

            col += 0.000001;
            var r = parseInt((0.5+Math.sin(col)*0.5)*16);
            var g = parseInt((0.5+Math.cos(col)*0.5)*16);
            var b = parseInt((0.5-Math.sin(col)*0.5)*16);
            return "#"+r.toString(16)+g.toString(16)+b.toString(16);
        }

    function rasterizePoint(x, y, z) {
      var p, d;
      if (moveableCamera) {
        x -= playerX;
        y -= playerY - 50;
        z -= playerZ;
        p = Math.atan2(x, z);
        d = Math.sqrt(x * x + z * z);
        x = Math.sin(p - yaw) * d;
        z = Math.cos(p - yaw) * d;
        p = Math.atan2(y, z);
        d = Math.sqrt(y * y + z * z);
        y = Math.sin(p - pitch) * d;
        z = Math.cos(p - pitch) * d;
      }
      z-=playerZ;
      var rx1 = -10,
          ry1 = 1,
          rx2 = 10,
          ry2 = 1,
          rx3 = 0,
          ry3 = 0,
          rx4 = x,
          ry4 = z,
          uc = (ry4 - ry3) * (rx2 - rx1) - (rx4 - rx3) * (ry2 - ry1);
      if (!uc) return {
        x: 0,
        y: 0,
        d: -1
      };
      var ua = ((rx4 - rx3) * (ry1 - ry3) - (ry4 - ry3) * (rx1 - rx3)) / uc;
      var ub = ((rx2 - rx1) * (ry1 - ry3) - (ry2 - ry1) * (rx1 - rx3)) / uc;
      if (!z) z = .000000001;
      if (ua > 0 && ua < 1 && ub > 0 && ub < 1) {
        return {
          x: cx + (rx1 + ua * (rx2 - rx1)) * scale,
          y: cy + y / z * scale,
          d: Math.sqrt(x * x + y * y + z * z) / scale
        };
      } else {
        return {
          x: cx + (rx1 + ua * (rx2 - rx1)) * scale,
          y: cy + y / z * scale,
          d: -1
        };
      }
    }

    function render() {
      var x, y, x1, y1, x2, y2, red, green, blue, col;

      if (!multiColor) {
        col = particles[0][7];
        red = (parseInt((.5 + Math.sin(col) / 2) * 255)).toString(16);
        green = (parseInt((.5 + Math.cos(col) / 2) * 255)).toString(16);
        blue = (parseInt((.5 - Math.sin(col) / 2) * 255)).toString(16);
        if (red.length < 2) red = "0" + red;
        if (green.length < 2) green = "0" + green;
        if (blue.length < 2) blue = "0" + blue;
        ctx1.fillStyle = "#" + red + green + blue;
      }

      ax = 0;
      ay = 0;
      az = 0;
      for (i = 0; i < particles.length; ++i) {
        ax += particles[i][0];
        ay += particles[i][1];
        az += particles[i][2] - 1000;
        particles[i][7]=ms/6+4+pi / 2 + pi / maxParticleSize * particles[i][6]/1.5;
      }
      ax /= particles.length;
      ay /= particles.length;
      az /= particles.length;
      for (i = 0; i < particles.length; ++i) {
        particles[i][0] -= ax;
        particles[i][1] -= ay;
        particles[i][2] -= az;
        p = Math.atan2(particles[i][0], particles[i][2] - 1000) +Math.sin(ms/10)/40;
        dist = Math.sqrt(particles[i][0] * particles[i][0] + (particles[i][2] - 1000) * (particles[i][2] - 1000));
        particles[i][0] = Math.sin(p) * dist;
        particles[i][2] = 1000 + Math.cos(p) * dist;
        ctx1.globalAlpha = 1 - particles[i][6] / maxParticleSize;
        particles[i][3] /= 1.025;
        particles[i][4] /= 1.025;
        particles[i][5] /= 1.025;
        particles[i][0] += particles[i][3];
        particles[i][1] += particles[i][4];
        particles[i][2] += particles[i][5];

        if (multiColor) {
          ctx1.fillStyle = rgb(particles[i][7]);
        }
        point = rasterizePoint(particles[i][0], particles[i][1], particles[i][2]);
        if (point.d != -1) {
          drawPoint(point.x, point.y, 2+particles[i][6] / point.d, 1);
        }
      }
      if (particles.length) destroyParticle(parseInt(Math.random() * particles.length), -1);
      spawnParticle(1);
    }

    function process() {
      requestAnimationFrame(process);
      ms += .1;
      playerZ-=Math.cos(pi+ms/12)*15;
      clear();
      render();
    }

    function drawPoint(x, y, weight, cvs) {
      switch (cvs) {
        case 1:
          ctx1.fillRect(x, y, weight, weight);
          break;
                 }
    }

    function clear() {
      ctx1.globalAlpha=.15;
      ctx1.fillStyle="#000";
      ctx1.fillRect(0, 0, cx * 2, cy * 2);
      ctx1.globalAlpha=1;
    }

    function reshape() {
      canvas1 = document.getElementById("screen");
      ctx1 = canvas1.getContext("2d");
      canvas1.width = document.documentElement.clientWidth;
      canvas1.height = document.documentElement.clientHeight;
      cx = canvas1.width / 2;
      cy = canvas1.height / 2;
      cd = Math.sqrt(cx * cx + cy * cy);
    }
    initialize();
})();