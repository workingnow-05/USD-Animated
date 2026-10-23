export const distortionVertexShader = `uniform float uTime; uniform vec2 uPointer; varying float vStrength; void main(){ vec3 p=position; float wave=sin(p.y*4.0+uTime)*.06+cos(p.x*5.0-uTime*.7)*.04; p+=normal*(wave+dot(normalize(p.xy+vec2(.001)),uPointer)*.12); vStrength=wave; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }`;

export const atmosphereFragmentShader = `uniform vec3 uColor; varying float vStrength; void main(){ float glow=.72+vStrength*2.2; gl_FragColor=vec4(uColor*glow,.82); }`;
