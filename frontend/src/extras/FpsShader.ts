import Shader from "../lib/core/Shader";

import DefaultTextures from "../lib/textures/DefaultTextures";
import {ShaderType} from "../lib/core/ShaderTypes";
import Camera from "../lib/Camera";
import ModelTransform from "../lib/model/ModelTransform";
import {Vector4} from "math.gl";

export default class FpsShader extends Shader{


    init(){

        if(this.attributes.length==0) {
            this.addAttribute("aPos", ShaderType.vec3);
            this.addAttribute("aNormal", ShaderType.vec3);
            this.addAttribute("aUV0", ShaderType.vec2);

        }
        this.addUniform("value",new Vector4(-1,-1,0.6,0.2));

        this.addTexture("text",DefaultTextures.getWhite(this.renderer))
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

@fragment
fn mainFragment(@location(0) uv0: vec2f,@location(1) normal: vec3f) -> GBufferOutput
{
    var output : GBufferOutput;
    var  uv = uv0;
 

    let index = floor(uv0.x*6.0);
    var v = fract(uv0.x*6.0)*0.1;
      if(index <2){v-=10.0;}
    if(index ==2){v+=uniforms.value.x;}
    else if(index ==3){v+=uniforms.value.y;}
    else if(index ==4){v+=uniforms.value.z;}
    else if(index ==5){v+=uniforms.value.w;}
    uv.x =v;
    let c= textureSample(text, mySampler,uv).x;

    output.color = vec4(vec3(1.0,0,0)*c,1.0);

    output.normal =vec4(normalize(normal)*0.5+0.5,1.0);
    
  
   
    output.mra =vec4(0.0,0.2,c*0.8,1.0);
 

    return output;
 
}
///////////////////////////////////////////////////////////
        
        
        
        
        
        
        
        
        `
    }



}
