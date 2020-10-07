/**
 * Full-screen textured quad shader
 */

import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

const shader = {
  uniforms: {
    tDiffuse: { value: null },
    opacity: { value: 1 },
    curve: { value: 2.25 },
    scanLines: { value: 640 },
  },

  vertexShader: `
    varying vec2 vUv;
    uniform float curve;

    void main() {
      vUv = uv;
      vec3 pos = position * 1.25;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
    `,

  fragmentShader: `
    uniform float opacity;
    uniform sampler2D tDiffuse;
    uniform float curve;
    uniform float scanLines;
    varying vec2 vUv;

    void main() {
      vec2 textCoords = vec2(vUv.x, vUv.y);

      // compute distance to center
      vec2 dCenter = abs(0.5 - textCoords);

      dCenter *= dCenter;

      // add curve 
      textCoords -= 0.5;
      textCoords *= 1.0 + dCenter * curve;
      textCoords += 0.5;

      vec4 texel = texture2D( tDiffuse, textCoords);
      texel.rgb += sin(textCoords.y * scanLines) * 0.04;


    	gl_FragColor = opacity * texel;
    }
  `,
};

class CrtPass extends ShaderPass {
  constructor() {
    super(shader);
  }
}

export default CrtPass;
