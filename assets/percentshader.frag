//inspired by Adam Ferris, original:https://github.com/aferriss/p5jsShaderExamples

precision mediump float;
varying vec3 vNormal;
varying vec3 vEye;
uniform sampler2D uPercentTexture;
vec2 perTex(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
  return reflected.xy / m + 0.5;
}
void main() {
  vec2 uv = perTex(vEye, vNormal) ;
  vec4 color = texture2D(uPercentTexture, uv);
  gl_FragColor = color;
}