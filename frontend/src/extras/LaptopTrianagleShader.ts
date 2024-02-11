import Shader from "../lib/core/Shader";

import DefaultTextures from "../lib/textures/DefaultTextures";
import {ShaderType} from "../lib/core/ShaderTypes";
import Camera from "../lib/Camera";
import ModelTransform from "../lib/model/ModelTransform";

export default class LaptopTrianagleShader extends Shader{


    init(){

        if(this.attributes.length==0) {
            this.addAttribute("aPos", ShaderType.vec3);
            this.addAttribute("aNormal", ShaderType.vec3);
            this.addAttribute("aUV0", ShaderType.vec2);

        }
        this.addUniform("time",0);
        this.addUniform("ratio",0);
        this.addTexture("triangle",DefaultTextures.getWhite(this.renderer))

        this.addSampler("mySampler")

        this.needsTransform =true;
        this.needsCamera=true;
    }
    getShaderCode(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////      
struct VertexOutput
{
   @location(0) uv0 : vec2f,
    @location(1) normal : vec3f,
    @builtin(position) position : vec4f
  
}
struct GBufferOutput {
  @location(0) color : vec4f,
  @location(1) normal : vec4f,
    @location(2) mra : vec4f,
   
}

${Camera.getShaderText(0)}
${ModelTransform.getShaderText(1)}
${this.getShaderUniforms(2)}

@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    
    output.position =camera.viewProjectionMatrix*model.modelMatrix *vec4( aPos,1.0);
    output.uv0 =aUV0;
   
    output.normal =model.normalMatrix *aNormal;
    
    return output;
}
fn rotate( v:vec2f,  a:f32)->vec2f {
    let s = sin(a);
    let c= cos(a);
    let m = mat2x2(c, s, -s, c);
    return m * v;
}

@fragment
fn mainFragment(@location(0) uv0: vec2f,@location(1) normal: vec3f) -> GBufferOutput
{
    var output : GBufferOutput;
   var  uv = uv0-vec2(0.5);
 
    uv.x*=uniforms.ratio;
    uv*=1.5;
    uv =rotate(uv,uniforms.time);
    uv+=vec2(0.5);
    let colorTri =  textureSample(triangle, mySampler,uv);
    output.color = colorTri;
    



  
    output.normal =vec4(normalize(normal)*0.5+0.5,1.0);
    
  
   
    output.mra =vec4(0.0,0.8,0.7,1.0);
 

    return output;
 
}
///////////////////////////////////////////////////////////
        
        
        
        
        
        
        
        
        `
    }



}
