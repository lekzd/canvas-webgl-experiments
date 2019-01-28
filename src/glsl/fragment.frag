precision mediump float;

// our texture
uniform sampler2D u_background;
uniform sampler2D u_bullets;
uniform sampler2D u_effects;
uniform sampler2D u_ui;

uniform float u_backgroundTop;
uniform float u_damaged;
uniform float u_effectsSize;
uniform float u_time;
uniform vec2 u_textureSize;

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

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);

  return 2.3 * n_xy;
}

vec4 backgroundLayerColor() {
  float pos = u_backgroundTop / 500.0;

  vec2 v_background1Coord = v_texCoord - vec2(0.0, pos - 1.0);
  vec4 background1Color = texture2D(u_background, v_background1Coord);

  vec2 v_background2Coord = v_texCoord - vec2(0.0, pos);
  vec4 background2Color = texture2D(u_background, v_background2Coord);

  float rAngle = mod(pos, 100.0);
  float gAngle = mod(pos + 90.0, 100.0);
  float bAngle = mod(pos + 180.0, 100.0);

  float r = clamp(sin(rAngle), -0.8, 0.8);
  float g = clamp(sin(gAngle), -0.8, 0.8);
  float b = clamp(sin(bAngle), -0.8, 0.8);

  vec4 colorization = vec4(r, g, b, 1.0);

  return (background1Color + background2Color) * colorization;
}

vec4 bulletsLayerColor() {
  vec4 bulletsColor = texture2D(u_bullets, v_texCoord);

  vec2 blurDistance = vec2(1.5 + u_effectsSize);
  vec3 blurColor = blur5(u_bullets, v_texCoord, u_textureSize.xy, blurDistance).xyz;

  float damagedValue = u_damaged / 5.0;

  return bulletsColor + vec4(blurColor.r + damagedValue, blurColor.g, blurColor.b, bulletsColor.a);
}

vec4 effectsLayerColor() {
  vec4 effectsColor = texture2D(u_effects, v_texCoord);

  float hasColor = clamp(effectsColor.r + effectsColor.g + effectsColor.b, 0.0, 1.0);
  vec2 multiplier = v_texCoord * 10.0 * mod(u_time, 10.0);

  if (hasColor > 0.0) {
      return vec4(vec3(0.9, 0.3, 0.0) * vec3(cnoise(multiplier)), effectsColor.a);
  }

  return vec4(0.0);
}

vec4 uiLayerColor() {
  vec4 uiColor = texture2D(u_ui, v_texCoord);

  return uiColor;
}

void main() {
  gl_FragColor = backgroundLayerColor() + effectsLayerColor() + bulletsLayerColor() + uiLayerColor();
}