
// Opengl version 3.3
#version 330 core


layout(location = 0) out vec4 fragColor;

in vec2 texCoord;


uniform sampler2D texture;

uniform vec2 redchannel;
uniform vec2 greenchannel;
uniform vec2 bluechannel;

void main( void )
{
	vec2 uv = texCoord;
	
 	
    	 float rdx = redchannel.x; //controls red channel on x axis
    	 float rdy = redchannel.y; //control red channel on y axis
    	 
    	 float gdx = greenchannel.x; //controls green channel on x axis
    	 float gdy = greenchannel.y; //controls green channel on y axis
    	 
    	 float bdx = bluechannel.x; //controls green channel on x axis
    	 float bdy = bluechannel.y; //controls green channel on y axis
    	 
    	 
    	
    	 vec4 tex = vec4(texture2D(texture, vec2(uv.x+rdx,uv.y+rdy)).r,
                    texture2D(texture,vec2(uv.x+gdx,uv.y+gdy)).g,
                    texture2D(texture, vec2(uv.x+bdx,uv.y+bdy)).b,
                    texture2D(texture, texCoord.xy).a
                   );	
    	
    fragColor = tex;

}
