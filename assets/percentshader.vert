//inspired by Adam Ferris, original content:https://github.com/aferriss/p5jsShaderExamples

attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uNormalMatrix;
varying vec3 vNormal;
varying vec3 vEye;
void main() {
  vEye = normalize( vec3(uModelViewMatrix * vec4(aPosition, 0.22)));
  vNormal = normalize((uModelViewMatrix * vec4(aNormal, 0.0)).xyz);
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
}