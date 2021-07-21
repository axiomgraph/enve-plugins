
// Opengl version 3.3
#version 330 core


layout(location = 0) out vec4 fragColor;

in vec2 texCoord;

uniform sampler2D texture;

uniform float blocksize;
uniform float x;
uniform float y;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(90.9898,70.233))) * 13758.5453);
}

void main( void )
{
    vec2 uv = texCoord.xy /vec2(1,1);
    vec4 texColor = texture2D(texture, uv);
    
    float gt = 30 + rand(vec2(0, 20)) * y;
    float m = 0.1;
    bool glitch = m < 0.5;
    float t = floor(y*10.0) / gt;
    float r = rand(vec2(t, t));
    
    if(glitch) {
		
        vec2 uvGlitch = uv;
        uvGlitch.x -= r / x; // position of pixels in y axis 
        if(uv.y > r && uv.y < r + blocksize)// defines pixel size
        {
    		texColor = texture2D(texture, uvGlitch);
        }
    }
    
    fragColor = texColor;

}
