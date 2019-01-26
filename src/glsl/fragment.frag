precision mediump float;

// our texture
uniform sampler2D u_image;
uniform sampler2D u_bulletsImage;
uniform float u_backgroundTop;
uniform vec2 u_textureSize;
uniform vec3 u_mousePos;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color;
}

vec4 backgroundLayerColor() {
  vec2 v_background1Coord = v_texCoord - vec2(0.0, u_backgroundTop / 500.0 - 1.0);
  vec4 background1Color = texture2D(u_image, v_background1Coord);

  vec2 v_background2Coord = v_texCoord - vec2(0.0, u_backgroundTop / 500.0);
  vec4 background2Color = texture2D(u_image, v_background2Coord);

  return background1Color + background2Color;
}

void main() {

  vec4 bulletsColor = texture2D(u_bulletsImage, v_texCoord);

//  float minDistance = 10.0 * u_mousePos.z;
//  float maxDistance = 8.0 * u_mousePos.z;
//
//  if (u_mousePos.z > 0.0) {
//    float dist = distance(gl_FragCoord.xy, u_mousePos.xy);
//
//    if (dist < minDistance && dist > maxDistance) {
//      vec2 blurDistance = vec2(dist / 8.0);
//      vec3 blurColor = blur5(u_image, v_texCoord, u_textureSize.xy, blurDistance).xyz;
//
//      background1Color = vec4(blurColor + ((30.0 - u_mousePos.z) / 250.0), 1.0);
//    }
//  }

  gl_FragColor = backgroundLayerColor() + bulletsColor;
//   gl_FragColor = textureColor;
}