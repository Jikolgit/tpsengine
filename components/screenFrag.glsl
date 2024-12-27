
    varying vec2 vUv;


      void main() {
        float width = 0.1/7.0;
        float cols = distance(vUv,vec2((0.5-0.25),0.5));
        float cols2 = distance(vUv,vec2((0.5+0.25),0.5));
        if(cols >0.15)
        {
            cols = 1.0;
        }
        else
        {
            cols = 0.0;
        }
        if(cols2 >0.15)
        {
            cols2 = 1.0;
        }
        else
        {
            cols2 = 0.0;
        }
        vec3 finalCol = mix(vec3(1.0,1.0,1.0),vec3(0.0,0.0,1.0),cols);
        vec3 finalCol2 = mix(vec3(1.0,1.0,1.0),vec3(0.0,0.0,1.0),cols2);
        vec3 finalCol3 = finalCol+finalCol2;
        gl_FragColor = vec4(finalCol3,1.0);



        
      }
