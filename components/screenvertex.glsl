varying vec2 vUv;

      void main() { 
        vUv = uv;
        vec4 modelPosition = modelViewMatrix * vec4(position.x,position.y,position.z, 1.0);
        // modelPosition.y += sin(position.x*5.0);
        gl_Position = projectionMatrix * modelPosition;
      }
