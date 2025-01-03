#include <fog_pars_fragment>
    uniform float utime;
    uniform vec3 ucolor;
    uniform vec3 uColor;
    varying vec2 vUv;

      void main() {
        float bar = abs(vUv.x-0.5) ;

        float barWidth = 0.7;
        float barwave = 0.9;
        float strenght = step(barWidth,mod((utime/2.5)-vUv.x*barwave,1.0));
        float transparentcy = 1.0;
        if(strenght == 0.0)
        {
          transparentcy = 0.0;
        }
        else
        {
          transparentcy = 0.7;
        }
        vec4 blueCol = vec4(uColor,0.8);
        vec4 mixedColor = mix(vec4(0.0,0.0,0.0,0.0),blueCol*vUv.x,strenght);

        gl_FragColor.rgba = vec4(mixedColor);
        #include <fog_fragment>

        
      }
