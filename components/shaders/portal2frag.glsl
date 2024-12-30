    uniform float utime;
    uniform vec3 portalCol;
    varying vec2 vUv;

      void main() {
        vec4 finalCol;
        float transparent = 1.0;
        float col = mod((vUv.y-utime)*0.9,0.7);
        // float col = step((vUv.y+utime)*1.7,0.5);
        if(col >= 0.2)
        {
             transparent = 0.0;
        }
        else
        {
            // transparent = 1.0;
            finalCol = mix(vec4(0.0,0.0,1.0,0.0),vec4(portalCol,1.0),col*5.0);
        }
        
        gl_FragColor.rgba = vec4(finalCol);
       

        
      }
