"use strict";var vertexYUVShader=["attribute vec4 vertexPos;","attribute vec2 texturePos;","varying vec2 textureCoord;","void main()","{","gl_Position = vertexPos;","textureCoord = texturePos;","}"].join("\n");var fragmentYUVShader=["precision highp float;","varying highp vec2 textureCoord;","uniform sampler2D ySampler;","uniform sampler2D uSampler;","uniform sampler2D vSampler;","const mat4 YUV2RGB = mat4","(","1.1643828125, 0, 1.59602734375, -.87078515625,","1.1643828125, -.39176171875, -.81296875, .52959375,","1.1643828125, 2.017234375, 0, -1.081390625,","0, 0, 0, 1",");","void main(void) {","highp float y = texture2D(ySampler,  textureCoord).r;","highp float u = texture2D(uSampler,  textureCoord).r;","highp float v = texture2D(vSampler,  textureCoord).r;","gl_FragColor = vec4(y, u, v, 1) * YUV2RGB;","}"].join("\n");(function(a,b){a.SuperRender=b()}(this,function(){function a(b){this.canvasElement=document.getElementById(b);this.initContextGL();if(this.contextGL){this.YUVProgram=this.initProgram(vertexYUVShader,fragmentYUVShader);this.initBuffers();this.initTextures()}}a.prototype.initContextGL=function(){var b=this.canvasElement;var d=null;try{d=b.getContext("webgl")||b.getContext("experimental-webgl")}catch(c){d=null}if(!d||typeof d.getParameter!=="function"){d=null}this.contextGL=d;console.log("WebGL1.0")};a.prototype.initProgram=function(g,f){var e=this.contextGL;var d=e.createShader(e.VERTEX_SHADER);e.shaderSource(d,g);e.compileShader(d);if(!e.getShaderParameter(d,e.COMPILE_STATUS)){console.log("Vertex shader failed to compile: "+e.getShaderInfoLog(d))}var b=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(b,f);e.compileShader(b);if(!e.getShaderParameter(b,e.COMPILE_STATUS)){console.log("Fragment shader failed to compile: "+e.getShaderInfoLog(b))}var c=e.createProgram();e.attachShader(c,d);e.attachShader(c,b);e.linkProgram(c);if(!e.getProgramParameter(c,e.LINK_STATUS)){console.log("Program failed to compile: "+e.getProgramInfoLog(c))}e.deleteShader(d);e.deleteShader(b);return c};a.prototype.initBuffers=function(){var d=this.contextGL;var b=d.createBuffer();d.bindBuffer(d.ARRAY_BUFFER,b);d.bufferData(d.ARRAY_BUFFER,new Float32Array([1,1,-1,1,1,-1,-1,-1]),d.STATIC_DRAW);d.bindBuffer(d.ARRAY_BUFFER,null);var c=d.createBuffer();d.bindBuffer(d.ARRAY_BUFFER,c);d.bufferData(d.ARRAY_BUFFER,new Float32Array([1,0,0,0,1,1,0,1]),d.DYNAMIC_DRAW);d.bindBuffer(d.ARRAY_BUFFER,null);this.vertexPosBuffer=b;this.texturePosBuffer=c};a.prototype.initTextures=function(){var i=this.contextGL;var c=this.YUVProgram;i.useProgram(c);var g=this.initTexture();var d=i.getUniformLocation(c,"ySampler");i.uniform1i(d,0);this.yTextureRef=g;var f=this.initTexture();var b=i.getUniformLocation(c,"uSampler");i.uniform1i(b,1);this.uTextureRef=f;var h=this.initTexture();var e=i.getUniformLocation(c,"vSampler");i.uniform1i(e,2);this.vTextureRef=h;i.useProgram(null)};a.prototype.initTexture=function(){var c=this.contextGL;var b=c.createTexture();c.bindTexture(c.TEXTURE_2D,b);c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,c.LINEAR);c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,c.LINEAR);c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE);c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE);c.bindTexture(c.TEXTURE_2D,null);return b};a.prototype.SR_DisplayFrameData=function(o,p,b,h,m){if(o<=0||p<=0){return}var k=this.contextGL;if(null==b){k.clearColor(0,0,0,0);k.clear(k.COLOR_BUFFER_BIT|k.DEPTH_BUFFER_BIT);return}var e=this.canvasElement;e.width=o;e.height=p;this.nWindowWidth=e.width;this.nWindowHeight=e.height;var c=this.nWindowWidth;var g=this.nWindowHeight;k.clearColor(0.8,0.8,1,1);k.clear(k.COLOR_BUFFER_BIT|k.DEPTH_BUFFER_BIT);k.viewport(0,0,c,g);this.updateFrameData(o,p,b);var i=this.YUVProgram;k.useProgram(i);var n=this.vertexPosBuffer;k.bindBuffer(k.ARRAY_BUFFER,n);var f=k.getAttribLocation(i,"vertexPos");k.enableVertexAttribArray(f);k.vertexAttribPointer(f,2,k.FLOAT,false,0,0);k.bindBuffer(k.ARRAY_BUFFER,null);var l=this.texturePosBuffer;k.bindBuffer(k.ARRAY_BUFFER,l);var d=k.getAttribLocation(i,"texturePos");k.enableVertexAttribArray(d);k.vertexAttribPointer(d,2,k.FLOAT,false,0,0);k.bindBuffer(k.ARRAY_BUFFER,null);k.drawArrays(k.TRIANGLE_STRIP,0,4);k.disableVertexAttribArray(f);k.disableVertexAttribArray(d);k.useProgram(null);if(h&&m==this.captureId){this.capVideoData=e.toDataURL();this.captureId="";this.capVideo=false}};a.prototype.updateFrameData=function(c,o,h){var i=this.contextGL;var m=this.yTextureRef;var n=this.uTextureRef;var j=this.vTextureRef;var f=h;var g=c*o;var e=f.subarray(0,g);i.activeTexture(i.TEXTURE0);i.bindTexture(i.TEXTURE_2D,m);i.texImage2D(i.TEXTURE_2D,0,i.LUMINANCE,c,o,0,i.LUMINANCE,i.UNSIGNED_BYTE,e);var b=c/2*o/2;var k=f.subarray(g,g+b);i.activeTexture(i.TEXTURE1);i.bindTexture(i.TEXTURE_2D,n);i.texImage2D(i.TEXTURE_2D,0,i.LUMINANCE,c/2,o/2,0,i.LUMINANCE,i.UNSIGNED_BYTE,k);var l=b;var d=f.subarray(g+b,g+b+l);i.activeTexture(i.TEXTURE2);i.bindTexture(i.TEXTURE_2D,j);i.texImage2D(i.TEXTURE_2D,0,i.LUMINANCE,c/2,o/2,0,i.LUMINANCE,i.UNSIGNED_BYTE,d)};a.prototype.SR_SetDisplayRect=function(e){var g=this.contextGL;var b=this.nWindowWidth;var f=this.nWindowHeight;var d=null;if(e&&b>0&&f>0){var j=e.left/b;var c=e.top/f;var k=e.right/b;var i=e.bottom/f;d=new Float32Array([k,c,j,c,k,i,j,i])}else{d=new Float32Array([1,0,0,0,1,1,0,1])}var h=this.texturePosBuffer;g.bindBuffer(g.ARRAY_BUFFER,h);g.bufferSubData(g.ARRAY_BUFFER,0,d);g.bindBuffer(g.ARRAY_BUFFER,null)};a.prototype.SR_Destroy=function(){var h=this.contextGL;var b=this.YUVProgram;h.deleteProgram(b);var d=this.vertexPosBuffer;var f=this.texturePosBuffer;h.deleteBuffer(d);h.deleteBuffer(f);var e=this.yTextureRef;var c=this.uTextureRef;var g=this.vTextureRef;h.deleteTexture(e);h.deleteTexture(c);h.deleteTexture(g)};return a}));