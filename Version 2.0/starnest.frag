/* Adapted from natron plugins  // https://www.shadertoy.com/view/XlfGRj
// Star Nest by Pablo Román Andrioli
// This content is under the MIT License.
// Rebuilt for enve by axiomgraph
// Opengl version 3.3*/
#version 330 core
#ifdef GL_ES
precision mediump float; 
#endif

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform float iTime;


uniform int iterations;
uniform float formuparam;

uniform int volsteps;
uniform float stepsize;

uniform float zoom;
uniform float tile;
uniform float speed;

uniform float brightness ;
uniform float darkmatter;
uniform float distfading;
uniform float saturation;


void main( void)
{
        //get coords and direction
        vec2 uv=gl_FragCoord.xy/resolution.xy-.5;
        uv.y*=resolution.y/resolution.x;
        vec3 dir=vec3(uv*zoom,1.);
        float time=iTime*speed+.25;

        //mouse rotation
        vec2 c = resolution / 2.0;
        float a1=.5+c.x/resolution.x*2.;
        float a2=.8+c.y/resolution.y*2.;
        mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
        mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
        dir.xz*=rot1;
        dir.xy*=rot2;
        vec3 from=vec3(1.,.5,0.5);
        from+=vec3(time*2.,time,-2.);
        from.xz*=rot1;
        from.xy*=rot2;

        //volumetric rendering
        float s=0.1,fade=1.;
        vec3 v=vec3(0.);
        for (int r=0; r<volsteps; r++) {
                vec3 p=from+s*dir*.5;
                p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
                float pa,a=pa=0.;
                for (int i=0; i<iterations; i++) {
                        p=abs(p)/dot(p,p)-formuparam; // the magic formula
                        a+=abs(length(p)-pa); // absolute sum of average change
                        pa=length(p);
                }
                float dm=max(0.,darkmatter-a*a*.001); //dark matter
                a*=a*a; // add contrast
                if (r>6) fade*=1.-dm; // dark matter, don't render near
                //v+=vec3(dm,dm*.5,0.);
                v+=fade;
                v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
                fade*=distfading; // distance fading
                s+=stepsize;
        }
        v=mix(vec3(length(v)),v,saturation); //color adjust
        fragColor = vec4(v*.01,texture(texture,texCoord).a);

}
