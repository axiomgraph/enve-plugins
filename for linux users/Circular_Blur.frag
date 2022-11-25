/* built from scratch, with some borrowing (rotation) from https://godotshaders.com/shader/rotational-motion-blur-2d/
built for enve by axiomgraph
 Opengl version 3.3 */
#version 330 core
layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;

in vec2 texCoord;
uniform vec2 scenePos;

uniform float Angle; 
uniform int Samples; 
uniform vec2 Origin; 

vec2 rotate(vec2 uv, vec2 p, float angle)
{
	mat2 rotation = mat2(vec2(cos(angle), -sin(angle)),
						vec2(sin(angle), cos(angle)));
	uv -= p;
	uv = uv * rotation;
	uv += p;
	return uv;
}

void main(void)
{
        float inputAspect = scenePos.x /scenePos.y; //aspect ratio
 
        vec2 uv =texCoord;

        float precompute = Angle/-100.0 * (1.0 / float(Samples - 1));
        vec4 color = vec4(0.0);
        float ws = 0.0;
        vec2 position = Origin/100.0;
// spin blur 
    for(int i = 0; i <= Samples; i++){

        float p =  (float(i)* precompute);
        float w = 1.0 ;
	    uv.x *= inputAspect; //aspect ratio
	    uv = rotate(uv,position,p);
	    uv.x *= 1.0 / inputAspect; //aspect ratio
        color += texture2D (texture, uv)* w;
	    ws += w;
    }
    fragColor = vec4(color/ ws * 1.0);
}
