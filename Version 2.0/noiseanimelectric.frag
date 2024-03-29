// Adapted from natron project ( Based on https://www.shadertoy.com/view/ldlXRS

// Playing with different ways of animating noise. In this version, the domain is displaced by two random fbm noise calls (one for each axis).

// iChannel0: Rand (The output of a Rand plugin with Static Seed checked or tex12.png), filter=mipmap, wrap=repeat

//Noise animation - Electric
//by nimitz (stormoid.com) (twitter: @stormoid)

//The domain is displaced by two fbm calls one for each axis.
//Turbulent fbm (aka ridged) is used for better effect.)

// Rebuilt for enve by axiomgraph
// Opengl version 3.3

#version 330


layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;


in vec2 texCoord;

uniform float iTime;
uniform vec4 color;

#define time iTime*0.15
#define tau 6.2831853

mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
float noise( in vec2 x ){return texture(texture, x*.01).x;}

float fbm(in vec2 p)
{	
	float z=2.;
	float rz = 0.;
	vec2 bp = p;
	for (float i= 1.;i < 6.;i++)
	{
		rz+= abs((noise(p)-0.5)*2.)/z;
		z = z*2.;
		p = p*2.;
	}
	return rz;
}

float dualfbm(in vec2 p)
{
    //get two rotated fbm calls and displace the domain
	vec2 p2 = p*.7;
	vec2 basis = vec2(fbm(p2-time*1.6),fbm(p2+time*1.7));
	basis = (basis-.5)*.2;
	p += basis;
	
	//coloring
	return fbm(p*makem2(time*0.2));
}

float circ(vec2 p) 
{
	float r = length(p);
    r = 0.5 * log(r); // log(sqrt(r)); in the original version
	return abs(mod(r*4.,tau)-3.14)*3.+.2;

}

void main(void)
{
	//setup system
	vec2 p = gl_FragCoord.xy / resolution.xy-0.5;
	p.x *= resolution.x/resolution.y;
	p*=4.;
	
    float rz = dualfbm(p);
	
	//rings
	p /= exp(mod(time*10.,3.14159));
	rz *= pow(abs((0.1-circ(p))),.9);
	
	//final color
	vec3 col = color.rgb/rz;
	col=pow(abs(col),vec3(.99));
	fragColor = vec4(col,texture(texture,texCoord).a);
}
