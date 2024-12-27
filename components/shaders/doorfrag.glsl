    uniform float utime;
    varying vec2 vUv;

      void main() {
        vec3 finalCol;
        float transparent = 1.0;
        float col = mod((vUv.y*1.0)+utime,0.2);
        // vec4 finalCol;
        // finalCol = step();
        if(col >= 0.1)
        {
            finalCol = vec3(0.0,0.0,0.0);
            transparent = 0.0;
        }
        else
        {
            finalCol = vec3(0.0,0.0,1.0);
        }
        gl_FragColor.rgba = vec4(finalCol,transparent);
       

        
      }
