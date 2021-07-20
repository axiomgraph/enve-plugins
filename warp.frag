// Opengl version 3.3
#version 330 core

layout(location = 0) out vec4 fragColor;

in vec2 texCoord;

uniform sampler2D texture;
uniform float size;
uniform float amplitude;

vec2 SineWave( vec2 p )
    {
  
    // wave distortion
    float x = sin(size*p.y*2)* amplitude;
    float y = sin(size*p.y*2) * amplitude;
    return vec2(p.x+x, p.y+y);
    }


void main(void) {
    
 if (size <0.000001f){
        fragColor = texture2D(texture,texCoord);
    }
    else {
    fragColor = texture2D(texture,SineWave(texCoord)); 
    }
   

}
