import{a as Ga,b as Sf,c as ka}from"./chunk-GINGPXMU.js";var df=Ga((qr,Fc)=>{(function(r,e){typeof qr=="object"&&typeof Fc=="object"?Fc.exports=e():typeof define=="function"&&define.amd?define([],e):typeof qr=="object"?qr._vantaEffect=e():r._vantaEffect=e()})(typeof self<"u"?self:qr,(()=>(()=>{"use strict";var r={d:(h,u)=>{for(var d in u)r.o(u,d)&&!r.o(h,d)&&Object.defineProperty(h,d,{enumerable:!0,get:u[d]})},o:(h,u)=>Object.prototype.hasOwnProperty.call(h,u),r:h=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(h,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(h,"__esModule",{value:!0})}},e={};r.r(e),r.d(e,{default:()=>p}),Number.prototype.clamp=function(h,u){return Math.min(Math.max(this,h),u)};function t(h){for(;h.children&&h.children.length>0;)t(h.children[0]),h.remove(h.children[0]);h.geometry&&h.geometry.dispose(),h.material&&(Object.keys(h.material).forEach((u=>{h.material[u]&&h.material[u]!==null&&typeof h.material[u].dispose=="function"&&h.material[u].dispose()})),h.material.dispose())}let n=typeof window=="object",i=n&&window.THREE||{};n&&!window.VANTA&&(window.VANTA={});let s=n&&window.VANTA||{};s.register=(h,u)=>s[h]=d=>new u(d),s.version="0.5.24";let o=function(){return Array.prototype.unshift.call(arguments,"[VANTA]"),console.error.apply(this,arguments)};s.VantaBase=class{constructor(h={}){if(!n)return!1;s.current=this,this.windowMouseMoveWrapper=this.windowMouseMoveWrapper.bind(this),this.windowTouchWrapper=this.windowTouchWrapper.bind(this),this.windowGyroWrapper=this.windowGyroWrapper.bind(this),this.resize=this.resize.bind(this),this.animationLoop=this.animationLoop.bind(this),this.restart=this.restart.bind(this);let u=typeof this.getDefaultOptions=="function"?this.getDefaultOptions():this.defaultOptions;if(this.options=Object.assign({mouseControls:!0,touchControls:!0,gyroControls:!1,minHeight:200,minWidth:200,scale:1,scaleMobile:1},u),(h instanceof HTMLElement||typeof h=="string")&&(h={el:h}),Object.assign(this.options,h),this.options.THREE&&(i=this.options.THREE),this.el=this.options.el,this.el==null)o('Instance needs "el" param!');else if(!(this.options.el instanceof HTMLElement)){let g=this.el;if(this.el=(d=g,document.querySelector(d)),!this.el)return void o("Cannot find element",g)}var d,m;this.prepareEl(),this.initThree(),this.setSize();try{this.init()}catch(g){return o("Init error",g),this.renderer&&this.renderer.domElement&&this.el.removeChild(this.renderer.domElement),void(this.options.backgroundColor&&(console.log("[VANTA] Falling back to backgroundColor"),this.el.style.background=(m=this.options.backgroundColor,typeof m=="number"?"#"+("00000"+m.toString(16)).slice(-6):m)))}this.initMouse(),this.resize(),this.animationLoop();let y=window.addEventListener;y("resize",this.resize),window.requestAnimationFrame(this.resize),this.options.mouseControls&&(y("scroll",this.windowMouseMoveWrapper),y("mousemove",this.windowMouseMoveWrapper)),this.options.touchControls&&(y("touchstart",this.windowTouchWrapper),y("touchmove",this.windowTouchWrapper)),this.options.gyroControls&&y("deviceorientation",this.windowGyroWrapper)}setOptions(h={}){Object.assign(this.options,h),this.triggerMouseMove()}prepareEl(){let h,u;if(typeof Node<"u"&&Node.TEXT_NODE)for(h=0;h<this.el.childNodes.length;h++){let d=this.el.childNodes[h];if(d.nodeType===Node.TEXT_NODE){let m=document.createElement("span");m.textContent=d.textContent,d.parentElement.insertBefore(m,d),d.remove()}}for(h=0;h<this.el.children.length;h++)u=this.el.children[h],getComputedStyle(u).position==="static"&&(u.style.position="relative"),getComputedStyle(u).zIndex==="auto"&&(u.style.zIndex=1);getComputedStyle(this.el).position==="static"&&(this.el.style.position="relative")}applyCanvasStyles(h,u={}){Object.assign(h.style,{position:"absolute",zIndex:0,top:0,left:0,background:""}),Object.assign(h.style,u),h.classList.add("vanta-canvas")}initThree(){i.WebGLRenderer?(this.renderer=new i.WebGLRenderer({alpha:!0,antialias:!0}),this.el.appendChild(this.renderer.domElement),this.applyCanvasStyles(this.renderer.domElement),isNaN(this.options.backgroundAlpha)&&(this.options.backgroundAlpha=1),this.scene=new i.Scene):console.warn("[VANTA] No THREE defined on window")}getCanvasElement(){return this.renderer?this.renderer.domElement:this.p5renderer?this.p5renderer.canvas:void 0}getCanvasRect(){let h=this.getCanvasElement();return!!h&&h.getBoundingClientRect()}windowMouseMoveWrapper(h){let u=this.getCanvasRect();if(!u)return!1;let d=h.clientX-u.left,m=h.clientY-u.top;d>=0&&m>=0&&d<=u.width&&m<=u.height&&(this.mouseX=d,this.mouseY=m,this.options.mouseEase||this.triggerMouseMove(d,m))}windowTouchWrapper(h){let u=this.getCanvasRect();if(!u)return!1;if(h.touches.length===1){let d=h.touches[0].clientX-u.left,m=h.touches[0].clientY-u.top;d>=0&&m>=0&&d<=u.width&&m<=u.height&&(this.mouseX=d,this.mouseY=m,this.options.mouseEase||this.triggerMouseMove(d,m))}}windowGyroWrapper(h){let u=this.getCanvasRect();if(!u)return!1;let d=Math.round(2*h.alpha)-u.left,m=Math.round(2*h.beta)-u.top;d>=0&&m>=0&&d<=u.width&&m<=u.height&&(this.mouseX=d,this.mouseY=m,this.options.mouseEase||this.triggerMouseMove(d,m))}triggerMouseMove(h,u){h===void 0&&u===void 0&&(this.options.mouseEase?(h=this.mouseEaseX,u=this.mouseEaseY):(h=this.mouseX,u=this.mouseY)),this.uniforms&&(this.uniforms.iMouse.value.x=h/this.scale,this.uniforms.iMouse.value.y=u/this.scale);let d=h/this.width,m=u/this.height;typeof this.onMouseMove=="function"&&this.onMouseMove(d,m)}setSize(){this.scale||(this.scale=1),typeof navigator<"u"&&(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<600)&&this.options.scaleMobile?this.scale=this.options.scaleMobile:this.options.scale&&(this.scale=this.options.scale),this.width=Math.max(this.el.offsetWidth,this.options.minWidth),this.height=Math.max(this.el.offsetHeight,this.options.minHeight)}initMouse(){(!this.mouseX&&!this.mouseY||this.mouseX===this.options.minWidth/2&&this.mouseY===this.options.minHeight/2)&&(this.mouseX=this.width/2,this.mouseY=this.height/2,this.triggerMouseMove(this.mouseX,this.mouseY))}resize(){this.setSize(),this.camera&&(this.camera.aspect=this.width/this.height,typeof this.camera.updateProjectionMatrix=="function"&&this.camera.updateProjectionMatrix()),this.renderer&&(this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(window.devicePixelRatio/this.scale)),typeof this.onResize=="function"&&this.onResize()}isOnScreen(){let h=this.el.offsetHeight,u=this.el.getBoundingClientRect(),d=window.pageYOffset||(document.documentElement||document.body.parentNode||document.body).scrollTop,m=u.top+d;return m-window.innerHeight<=d&&d<=m+h}animationLoop(){this.t||(this.t=0),this.t2||(this.t2=0);let h=performance.now();if(this.prevNow){let u=(h-this.prevNow)/16.666666666666668;u=Math.max(.2,Math.min(u,5)),this.t+=u,this.t2+=(this.options.speed||1)*u,this.uniforms&&(this.uniforms.iTime.value=.016667*this.t2)}return this.prevNow=h,this.options.mouseEase&&(this.mouseEaseX=this.mouseEaseX||this.mouseX||0,this.mouseEaseY=this.mouseEaseY||this.mouseY||0,Math.abs(this.mouseEaseX-this.mouseX)+Math.abs(this.mouseEaseY-this.mouseY)>.1&&(this.mouseEaseX+=.05*(this.mouseX-this.mouseEaseX),this.mouseEaseY+=.05*(this.mouseY-this.mouseEaseY),this.triggerMouseMove(this.mouseEaseX,this.mouseEaseY))),(this.isOnScreen()||this.options.forceAnimate)&&(typeof this.onUpdate=="function"&&this.onUpdate(),this.scene&&this.camera&&(this.renderer.render(this.scene,this.camera),this.renderer.setClearColor(this.options.backgroundColor,this.options.backgroundAlpha)),this.fps&&this.fps.update&&this.fps.update(),typeof this.afterRender=="function"&&this.afterRender()),this.req=window.requestAnimationFrame(this.animationLoop)}restart(){if(this.scene)for(;this.scene.children.length;)this.scene.remove(this.scene.children[0]);typeof this.onRestart=="function"&&this.onRestart(),this.init()}init(){typeof this.onInit=="function"&&this.onInit()}destroy(){typeof this.onDestroy=="function"&&this.onDestroy();let h=window.removeEventListener;h("touchstart",this.windowTouchWrapper),h("touchmove",this.windowTouchWrapper),h("scroll",this.windowMouseMoveWrapper),h("mousemove",this.windowMouseMoveWrapper),h("deviceorientation",this.windowGyroWrapper),h("resize",this.resize),window.cancelAnimationFrame(this.req);let u=this.scene;u&&u.children&&t(u),this.renderer&&(this.renderer.domElement&&this.el.removeChild(this.renderer.domElement),this.renderer=null,this.scene=null),s.current===this&&(s.current=null)}};let a=s.VantaBase,l=typeof window=="object"&&window.THREE;class c extends a{constructor(u){l=u.THREE||l,l.Color.prototype.toVector=function(){return new l.Vector3(this.r,this.g,this.b)},super(u),this.updateUniforms=this.updateUniforms.bind(this)}init(){this.mode="shader",this.uniforms={iTime:{type:"f",value:1},iResolution:{type:"v2",value:new l.Vector2(1,1)},iDpr:{type:"f",value:window.devicePixelRatio||1},iMouse:{type:"v2",value:new l.Vector2(this.mouseX||0,this.mouseY||0)}},super.init(),this.fragmentShader&&this.initBasicShader()}setOptions(u){super.setOptions(u),this.updateUniforms()}initBasicShader(u=this.fragmentShader,d=this.vertexShader){d||(d=`uniform float uTime;
uniform vec2 uResolution;
void main() {
  gl_Position = vec4( position, 1.0 );
}`),this.updateUniforms(),typeof this.valuesChanger=="function"&&this.valuesChanger();let m=new l.ShaderMaterial({uniforms:this.uniforms,vertexShader:d,fragmentShader:u}),y=this.options.texturePath;y&&(this.uniforms.iTex={type:"t",value:new l.TextureLoader().load(y)});let g=new l.Mesh(new l.PlaneGeometry(2,2),m);this.scene.add(g),this.camera=new l.Camera,this.camera.position.z=1}updateUniforms(){let u={},d,m;for(d in this.options)m=this.options[d],d.toLowerCase().indexOf("color")!==-1?u[d]={type:"v3",value:new l.Color(m).toVector()}:typeof m=="number"&&(u[d]={type:"f",value:m});return Object.assign(this.uniforms,u)}resize(){super.resize(),this.uniforms.iResolution.value.x=this.width/this.scale,this.uniforms.iResolution.value.y=this.height/this.scale}}class f extends c{}let p=s.register("FOG",f);return f.prototype.defaultOptions={highlightColor:16761600,midtoneColor:16719616,lowlightColor:2949375,baseColor:16772075,blurFactor:.6,speed:1,zoom:1,scale:2,scaleMobile:4},f.prototype.fragmentShader=`uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

uniform float blurFactor;
uniform vec3 baseColor;
uniform vec3 lowlightColor;
uniform vec3 midtoneColor;
uniform vec3 highlightColor;
uniform float zoom;

float random (in vec2 _st) {
  return fract(sin(dot(_st.xy,
                     vec2(0.129898,0.78233)))*
        437.585453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
  vec2 i = floor(_st);
  vec2 f = fract(_st);

  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
          (c - a)* u.y * (1.0 - u.x) +
          (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 6

float fbm ( in vec2 _st) {
  float v = 0.0;
  float a = blurFactor;
  vec2 shift = vec2(100.0);
  // Rotate to reduce axial bias
  mat2 rot = mat2(cos(0.5), sin(0.5),
                  -sin(0.5), cos(0.50));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(_st);
      _st = rot * _st * 2.0 + shift;
      a *= (1. - blurFactor);
  }
  return v;
}

void main() {
  vec2 st = gl_FragCoord.xy / iResolution.xy*3.;
  st.x *= 0.7 * iResolution.x / iResolution.y ; // Still keep it more landscape than square
  st *= zoom;

  // st += st * abs(sin(iTime*0.1)*3.0);
  vec3 color = vec3(0.0);

  vec2 q = vec2(0.);
  q.x = fbm( st + 0.00*iTime);
  q.y = fbm( st + vec2(1.0));

  vec2 dir = vec2(0.15,0.126);
  vec2 r = vec2(0.);
  r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ dir.x*iTime );
  r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ dir.y*iTime);

  float f = fbm(st+r);

  color = mix(baseColor,
              lowlightColor,
              clamp((f*f)*4.0,0.0,1.0));

  color = mix(color,
              midtoneColor,
              clamp(length(q),0.0,1.0));

  color = mix(color,
              highlightColor,
              clamp(length(r.x),0.0,1.0));

  vec3 finalColor = mix(baseColor, color, f*f*f+.6*f*f+.5*f);
  gl_FragColor = vec4(finalColor,1.0);
}
`,e})()))});var ff=Ga((Yr,Nc)=>{(function(r,e){typeof Yr=="object"&&typeof Nc=="object"?Nc.exports=e():typeof define=="function"&&define.amd?define([],e):typeof Yr=="object"?Yr._vantaEffect=e():r._vantaEffect=e()})(typeof self<"u"?self:Yr,(()=>(()=>{"use strict";var r={d:(d,m)=>{for(var y in m)r.o(m,y)&&!r.o(d,y)&&Object.defineProperty(d,y,{enumerable:!0,get:m[y]})},o:(d,m)=>Object.prototype.hasOwnProperty.call(d,m),r:d=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(d,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(d,"__esModule",{value:!0})}},e={};function t(){return typeof navigator<"u"?/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<600:null}function n(d,m){return d==null&&(d=0),m==null&&(m=1),Math.floor(d+Math.random()*(m-d+1))}r.r(e),r.d(e,{default:()=>u}),Number.prototype.clamp=function(d,m){return Math.min(Math.max(this,d),m)};let i=d=>.299*d.r+.587*d.g+.114*d.b;function s(d){for(;d.children&&d.children.length>0;)s(d.children[0]),d.remove(d.children[0]);d.geometry&&d.geometry.dispose(),d.material&&(Object.keys(d.material).forEach((m=>{d.material[m]&&d.material[m]!==null&&typeof d.material[m].dispose=="function"&&d.material[m].dispose()})),d.material.dispose())}let o=typeof window=="object",a=o&&window.THREE||{};o&&!window.VANTA&&(window.VANTA={});let l=o&&window.VANTA||{};l.register=(d,m)=>l[d]=y=>new m(y),l.version="0.5.24";let c=function(){return Array.prototype.unshift.call(arguments,"[VANTA]"),console.error.apply(this,arguments)};l.VantaBase=class{constructor(d={}){if(!o)return!1;l.current=this,this.windowMouseMoveWrapper=this.windowMouseMoveWrapper.bind(this),this.windowTouchWrapper=this.windowTouchWrapper.bind(this),this.windowGyroWrapper=this.windowGyroWrapper.bind(this),this.resize=this.resize.bind(this),this.animationLoop=this.animationLoop.bind(this),this.restart=this.restart.bind(this);let m=typeof this.getDefaultOptions=="function"?this.getDefaultOptions():this.defaultOptions;if(this.options=Object.assign({mouseControls:!0,touchControls:!0,gyroControls:!1,minHeight:200,minWidth:200,scale:1,scaleMobile:1},m),(d instanceof HTMLElement||typeof d=="string")&&(d={el:d}),Object.assign(this.options,d),this.options.THREE&&(a=this.options.THREE),this.el=this.options.el,this.el==null)c('Instance needs "el" param!');else if(!(this.options.el instanceof HTMLElement)){let _=this.el;if(this.el=(y=_,document.querySelector(y)),!this.el)return void c("Cannot find element",_)}var y,g;this.prepareEl(),this.initThree(),this.setSize();try{this.init()}catch(_){return c("Init error",_),this.renderer&&this.renderer.domElement&&this.el.removeChild(this.renderer.domElement),void(this.options.backgroundColor&&(console.log("[VANTA] Falling back to backgroundColor"),this.el.style.background=(g=this.options.backgroundColor,typeof g=="number"?"#"+("00000"+g.toString(16)).slice(-6):g)))}this.initMouse(),this.resize(),this.animationLoop();let x=window.addEventListener;x("resize",this.resize),window.requestAnimationFrame(this.resize),this.options.mouseControls&&(x("scroll",this.windowMouseMoveWrapper),x("mousemove",this.windowMouseMoveWrapper)),this.options.touchControls&&(x("touchstart",this.windowTouchWrapper),x("touchmove",this.windowTouchWrapper)),this.options.gyroControls&&x("deviceorientation",this.windowGyroWrapper)}setOptions(d={}){Object.assign(this.options,d),this.triggerMouseMove()}prepareEl(){let d,m;if(typeof Node<"u"&&Node.TEXT_NODE)for(d=0;d<this.el.childNodes.length;d++){let y=this.el.childNodes[d];if(y.nodeType===Node.TEXT_NODE){let g=document.createElement("span");g.textContent=y.textContent,y.parentElement.insertBefore(g,y),y.remove()}}for(d=0;d<this.el.children.length;d++)m=this.el.children[d],getComputedStyle(m).position==="static"&&(m.style.position="relative"),getComputedStyle(m).zIndex==="auto"&&(m.style.zIndex=1);getComputedStyle(this.el).position==="static"&&(this.el.style.position="relative")}applyCanvasStyles(d,m={}){Object.assign(d.style,{position:"absolute",zIndex:0,top:0,left:0,background:""}),Object.assign(d.style,m),d.classList.add("vanta-canvas")}initThree(){a.WebGLRenderer?(this.renderer=new a.WebGLRenderer({alpha:!0,antialias:!0}),this.el.appendChild(this.renderer.domElement),this.applyCanvasStyles(this.renderer.domElement),isNaN(this.options.backgroundAlpha)&&(this.options.backgroundAlpha=1),this.scene=new a.Scene):console.warn("[VANTA] No THREE defined on window")}getCanvasElement(){return this.renderer?this.renderer.domElement:this.p5renderer?this.p5renderer.canvas:void 0}getCanvasRect(){let d=this.getCanvasElement();return!!d&&d.getBoundingClientRect()}windowMouseMoveWrapper(d){let m=this.getCanvasRect();if(!m)return!1;let y=d.clientX-m.left,g=d.clientY-m.top;y>=0&&g>=0&&y<=m.width&&g<=m.height&&(this.mouseX=y,this.mouseY=g,this.options.mouseEase||this.triggerMouseMove(y,g))}windowTouchWrapper(d){let m=this.getCanvasRect();if(!m)return!1;if(d.touches.length===1){let y=d.touches[0].clientX-m.left,g=d.touches[0].clientY-m.top;y>=0&&g>=0&&y<=m.width&&g<=m.height&&(this.mouseX=y,this.mouseY=g,this.options.mouseEase||this.triggerMouseMove(y,g))}}windowGyroWrapper(d){let m=this.getCanvasRect();if(!m)return!1;let y=Math.round(2*d.alpha)-m.left,g=Math.round(2*d.beta)-m.top;y>=0&&g>=0&&y<=m.width&&g<=m.height&&(this.mouseX=y,this.mouseY=g,this.options.mouseEase||this.triggerMouseMove(y,g))}triggerMouseMove(d,m){d===void 0&&m===void 0&&(this.options.mouseEase?(d=this.mouseEaseX,m=this.mouseEaseY):(d=this.mouseX,m=this.mouseY)),this.uniforms&&(this.uniforms.iMouse.value.x=d/this.scale,this.uniforms.iMouse.value.y=m/this.scale);let y=d/this.width,g=m/this.height;typeof this.onMouseMove=="function"&&this.onMouseMove(y,g)}setSize(){this.scale||(this.scale=1),t()&&this.options.scaleMobile?this.scale=this.options.scaleMobile:this.options.scale&&(this.scale=this.options.scale),this.width=Math.max(this.el.offsetWidth,this.options.minWidth),this.height=Math.max(this.el.offsetHeight,this.options.minHeight)}initMouse(){(!this.mouseX&&!this.mouseY||this.mouseX===this.options.minWidth/2&&this.mouseY===this.options.minHeight/2)&&(this.mouseX=this.width/2,this.mouseY=this.height/2,this.triggerMouseMove(this.mouseX,this.mouseY))}resize(){this.setSize(),this.camera&&(this.camera.aspect=this.width/this.height,typeof this.camera.updateProjectionMatrix=="function"&&this.camera.updateProjectionMatrix()),this.renderer&&(this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(window.devicePixelRatio/this.scale)),typeof this.onResize=="function"&&this.onResize()}isOnScreen(){let d=this.el.offsetHeight,m=this.el.getBoundingClientRect(),y=window.pageYOffset||(document.documentElement||document.body.parentNode||document.body).scrollTop,g=m.top+y;return g-window.innerHeight<=y&&y<=g+d}animationLoop(){this.t||(this.t=0),this.t2||(this.t2=0);let d=performance.now();if(this.prevNow){let m=(d-this.prevNow)/16.666666666666668;m=Math.max(.2,Math.min(m,5)),this.t+=m,this.t2+=(this.options.speed||1)*m,this.uniforms&&(this.uniforms.iTime.value=.016667*this.t2)}return this.prevNow=d,this.options.mouseEase&&(this.mouseEaseX=this.mouseEaseX||this.mouseX||0,this.mouseEaseY=this.mouseEaseY||this.mouseY||0,Math.abs(this.mouseEaseX-this.mouseX)+Math.abs(this.mouseEaseY-this.mouseY)>.1&&(this.mouseEaseX+=.05*(this.mouseX-this.mouseEaseX),this.mouseEaseY+=.05*(this.mouseY-this.mouseEaseY),this.triggerMouseMove(this.mouseEaseX,this.mouseEaseY))),(this.isOnScreen()||this.options.forceAnimate)&&(typeof this.onUpdate=="function"&&this.onUpdate(),this.scene&&this.camera&&(this.renderer.render(this.scene,this.camera),this.renderer.setClearColor(this.options.backgroundColor,this.options.backgroundAlpha)),this.fps&&this.fps.update&&this.fps.update(),typeof this.afterRender=="function"&&this.afterRender()),this.req=window.requestAnimationFrame(this.animationLoop)}restart(){if(this.scene)for(;this.scene.children.length;)this.scene.remove(this.scene.children[0]);typeof this.onRestart=="function"&&this.onRestart(),this.init()}init(){typeof this.onInit=="function"&&this.onInit()}destroy(){typeof this.onDestroy=="function"&&this.onDestroy();let d=window.removeEventListener;d("touchstart",this.windowTouchWrapper),d("touchmove",this.windowTouchWrapper),d("scroll",this.windowMouseMoveWrapper),d("mousemove",this.windowMouseMoveWrapper),d("deviceorientation",this.windowGyroWrapper),d("resize",this.resize),window.cancelAnimationFrame(this.req);let m=this.scene;m&&m.children&&s(m),this.renderer&&(this.renderer.domElement&&this.el.removeChild(this.renderer.domElement),this.renderer=null,this.scene=null),l.current===this&&(l.current=null)}};let f=l.VantaBase,p=typeof window=="object"&&window.THREE;class h extends f{static initClass(){this.prototype.defaultOptions={color:16727937,backgroundColor:2299196,points:10,maxDistance:20,spacing:15,showDots:!0}}constructor(m){p=m.THREE||p,super(m)}genPoint(m,y,g){let x;if(this.points||(this.points=[]),this.options.showDots){let M=new p.SphereGeometry(.25,12,12),T=new p.MeshLambertMaterial({color:this.options.color});x=new p.Mesh(M,T)}else x=new p.Object3D;var _,v;return this.cont.add(x),x.ox=m,x.oy=y,x.oz=g,x.position.set(m,y,g),x.r=((_=-2)==null&&(_=0),(v=2)==null&&(v=1),_+Math.random()*(v-_)),this.points.push(x)}onInit(){this.cont=new p.Group,this.cont.position.set(0,0,0),this.scene.add(this.cont);let m=this.options.points,{spacing:y}=this.options;t()&&(m=~~(.75*m),y=~~(.65*y));let g=m*m*2;this.linePositions=new Float32Array(g*g*3),this.lineColors=new Float32Array(g*g*3);let x=i(new p.Color(this.options.color)),_=i(new p.Color(this.options.backgroundColor));this.blending=x>_?"additive":"subtractive";let v=new p.BufferGeometry;v.setAttribute("position",new p.BufferAttribute(this.linePositions,3).setUsage(p.DynamicDrawUsage)),v.setAttribute("color",new p.BufferAttribute(this.lineColors,3).setUsage(p.DynamicDrawUsage)),v.computeBoundingSphere(),v.setDrawRange(0,0);let M=new p.LineBasicMaterial({vertexColors:p.VertexColors,blending:this.blending==="additive"?p.AdditiveBlending:null,transparent:!0});this.linesMesh=new p.LineSegments(v,M),this.cont.add(this.linesMesh);for(let w=0;w<=m;w++)for(let C=0;C<=m;C++){let I=n(-3,3),L=(w-m/2)*y+n(-5,5),R=(C-m/2)*y+n(-5,5);w%2&&(R+=.5*y),this.genPoint(L,I-n(5,15),R),this.genPoint(L+n(-5,5),I+n(5,15),R+n(-5,5))}this.camera=new p.PerspectiveCamera(25,this.width/this.height,.01,1e4),this.camera.position.set(50,100,150),this.scene.add(this.camera);let T=new p.AmbientLight(16777215,.75);return this.scene.add(T),this.spot=new p.SpotLight(16777215,1),this.spot.position.set(0,200,0),this.spot.distance=400,this.spot.target=this.cont,this.scene.add(this.spot)}onDestroy(){this.scene&&this.scene.remove(this.linesMesh),this.spot=this.points=this.linesMesh=this.lineColors=this.linePositions=null}setOptions(m){super.setOptions(m),m.color&&this.points.forEach((y=>{y.material.color=new p.Color(m.color)}))}onUpdate(){let m,y=this.camera;Math.abs(y.tx-y.position.x)>.01&&(m=y.tx-y.position.x,y.position.x+=.02*m),Math.abs(y.ty-y.position.y)>.01&&(m=y.ty-y.position.y,y.position.y+=.02*m),y.lookAt(new p.Vector3(0,0,0));let g=0,x=0,_=0,v=new p.Color(this.options.backgroundColor),M=new p.Color(this.options.color),T=M.clone().sub(v);this.rayCaster&&this.rayCaster.setFromCamera(new p.Vector2(this.rcMouseX,this.rcMouseY),this.camera);for(let w=0;w<this.points.length;w++){let C,I,L=this.points[w];I=this.rayCaster?this.rayCaster.ray.distanceToPoint(L.position):1e3;let R=I.clamp(5,15);if(L.scale.x=L.scale.y=L.scale.z=(.25*(15-R)).clamp(1,100),L.r!==0){let W=Math.atan2(L.position.z,L.position.x);C=Math.sqrt(L.position.z*L.position.z+L.position.x*L.position.x),W+=25e-5*L.r,L.position.x=C*Math.cos(W),L.position.z=C*Math.sin(W)}for(let W=w;W<this.points.length;W++){let D=this.points[W],F=L.position.x-D.position.x,U=L.position.y-D.position.y,z=L.position.z-D.position.z;if(C=Math.sqrt(F*F+U*U+z*z),C<this.options.maxDistance){let B,Q=(2*(1-C/this.options.maxDistance)).clamp(0,1);B=this.blending==="additive"?new p.Color(0).lerp(T,Q):v.clone().lerp(M,Q),this.linePositions[g++]=L.position.x,this.linePositions[g++]=L.position.y,this.linePositions[g++]=L.position.z,this.linePositions[g++]=D.position.x,this.linePositions[g++]=D.position.y,this.linePositions[g++]=D.position.z,this.lineColors[x++]=B.r,this.lineColors[x++]=B.g,this.lineColors[x++]=B.b,this.lineColors[x++]=B.r,this.lineColors[x++]=B.g,this.lineColors[x++]=B.b,_++}}}return this.linesMesh.geometry.setDrawRange(0,2*_),this.linesMesh.geometry.attributes.position.needsUpdate=!0,this.linesMesh.geometry.attributes.color.needsUpdate=!0,.001*this.t}onMouseMove(m,y){let g=this.camera;g.oy||(g.oy=g.position.y,g.ox=g.position.x,g.oz=g.position.z);let x=Math.atan2(g.oz,g.ox),_=Math.sqrt(g.oz*g.oz+g.ox*g.ox),v=x+2*(m-.5)*(this.options.mouseCoeffX||1);g.tz=_*Math.sin(v),g.tx=_*Math.cos(v),g.ty=g.oy+50*(y-.5)*(this.options.mouseCoeffY||1),this.rayCaster,this.rcMouseX=2*m-1,this.rcMouseY=2*-m+1}onRestart(){this.scene&&this.scene.remove(this.linesMesh),this.points=[]}}h.initClass();let u=l.register("NET",h);return e})()))});var pf=Ga((Jr,zc)=>{(function(r,e){typeof Jr=="object"&&typeof zc=="object"?zc.exports=e():typeof define=="function"&&define.amd?define([],e):typeof Jr=="object"?Jr._vantaEffect=e():r._vantaEffect=e()})(typeof self<"u"?self:Jr,(()=>(()=>{"use strict";var r={d:(h,u)=>{for(var d in u)r.o(u,d)&&!r.o(h,d)&&Object.defineProperty(h,d,{enumerable:!0,get:u[d]})},o:(h,u)=>Object.prototype.hasOwnProperty.call(h,u),r:h=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(h,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(h,"__esModule",{value:!0})}},e={};function t(h,u){return h==null&&(h=0),u==null&&(u=1),Math.floor(h+Math.random()*(u-h+1))}r.r(e),r.d(e,{default:()=>p}),Number.prototype.clamp=function(h,u){return Math.min(Math.max(this,h),u)};function n(h){for(;h.children&&h.children.length>0;)n(h.children[0]),h.remove(h.children[0]);h.geometry&&h.geometry.dispose(),h.material&&(Object.keys(h.material).forEach((u=>{h.material[u]&&h.material[u]!==null&&typeof h.material[u].dispose=="function"&&h.material[u].dispose()})),h.material.dispose())}let i=typeof window=="object",s=i&&window.THREE||{};i&&!window.VANTA&&(window.VANTA={});let o=i&&window.VANTA||{};o.register=(h,u)=>o[h]=d=>new u(d),o.version="0.5.24";let a=function(){return Array.prototype.unshift.call(arguments,"[VANTA]"),console.error.apply(this,arguments)};o.VantaBase=class{constructor(h={}){if(!i)return!1;o.current=this,this.windowMouseMoveWrapper=this.windowMouseMoveWrapper.bind(this),this.windowTouchWrapper=this.windowTouchWrapper.bind(this),this.windowGyroWrapper=this.windowGyroWrapper.bind(this),this.resize=this.resize.bind(this),this.animationLoop=this.animationLoop.bind(this),this.restart=this.restart.bind(this);let u=typeof this.getDefaultOptions=="function"?this.getDefaultOptions():this.defaultOptions;if(this.options=Object.assign({mouseControls:!0,touchControls:!0,gyroControls:!1,minHeight:200,minWidth:200,scale:1,scaleMobile:1},u),(h instanceof HTMLElement||typeof h=="string")&&(h={el:h}),Object.assign(this.options,h),this.options.THREE&&(s=this.options.THREE),this.el=this.options.el,this.el==null)a('Instance needs "el" param!');else if(!(this.options.el instanceof HTMLElement)){let g=this.el;if(this.el=(d=g,document.querySelector(d)),!this.el)return void a("Cannot find element",g)}var d,m;this.prepareEl(),this.initThree(),this.setSize();try{this.init()}catch(g){return a("Init error",g),this.renderer&&this.renderer.domElement&&this.el.removeChild(this.renderer.domElement),void(this.options.backgroundColor&&(console.log("[VANTA] Falling back to backgroundColor"),this.el.style.background=(m=this.options.backgroundColor,typeof m=="number"?"#"+("00000"+m.toString(16)).slice(-6):m)))}this.initMouse(),this.resize(),this.animationLoop();let y=window.addEventListener;y("resize",this.resize),window.requestAnimationFrame(this.resize),this.options.mouseControls&&(y("scroll",this.windowMouseMoveWrapper),y("mousemove",this.windowMouseMoveWrapper)),this.options.touchControls&&(y("touchstart",this.windowTouchWrapper),y("touchmove",this.windowTouchWrapper)),this.options.gyroControls&&y("deviceorientation",this.windowGyroWrapper)}setOptions(h={}){Object.assign(this.options,h),this.triggerMouseMove()}prepareEl(){let h,u;if(typeof Node<"u"&&Node.TEXT_NODE)for(h=0;h<this.el.childNodes.length;h++){let d=this.el.childNodes[h];if(d.nodeType===Node.TEXT_NODE){let m=document.createElement("span");m.textContent=d.textContent,d.parentElement.insertBefore(m,d),d.remove()}}for(h=0;h<this.el.children.length;h++)u=this.el.children[h],getComputedStyle(u).position==="static"&&(u.style.position="relative"),getComputedStyle(u).zIndex==="auto"&&(u.style.zIndex=1);getComputedStyle(this.el).position==="static"&&(this.el.style.position="relative")}applyCanvasStyles(h,u={}){Object.assign(h.style,{position:"absolute",zIndex:0,top:0,left:0,background:""}),Object.assign(h.style,u),h.classList.add("vanta-canvas")}initThree(){s.WebGLRenderer?(this.renderer=new s.WebGLRenderer({alpha:!0,antialias:!0}),this.el.appendChild(this.renderer.domElement),this.applyCanvasStyles(this.renderer.domElement),isNaN(this.options.backgroundAlpha)&&(this.options.backgroundAlpha=1),this.scene=new s.Scene):console.warn("[VANTA] No THREE defined on window")}getCanvasElement(){return this.renderer?this.renderer.domElement:this.p5renderer?this.p5renderer.canvas:void 0}getCanvasRect(){let h=this.getCanvasElement();return!!h&&h.getBoundingClientRect()}windowMouseMoveWrapper(h){let u=this.getCanvasRect();if(!u)return!1;let d=h.clientX-u.left,m=h.clientY-u.top;d>=0&&m>=0&&d<=u.width&&m<=u.height&&(this.mouseX=d,this.mouseY=m,this.options.mouseEase||this.triggerMouseMove(d,m))}windowTouchWrapper(h){let u=this.getCanvasRect();if(!u)return!1;if(h.touches.length===1){let d=h.touches[0].clientX-u.left,m=h.touches[0].clientY-u.top;d>=0&&m>=0&&d<=u.width&&m<=u.height&&(this.mouseX=d,this.mouseY=m,this.options.mouseEase||this.triggerMouseMove(d,m))}}windowGyroWrapper(h){let u=this.getCanvasRect();if(!u)return!1;let d=Math.round(2*h.alpha)-u.left,m=Math.round(2*h.beta)-u.top;d>=0&&m>=0&&d<=u.width&&m<=u.height&&(this.mouseX=d,this.mouseY=m,this.options.mouseEase||this.triggerMouseMove(d,m))}triggerMouseMove(h,u){h===void 0&&u===void 0&&(this.options.mouseEase?(h=this.mouseEaseX,u=this.mouseEaseY):(h=this.mouseX,u=this.mouseY)),this.uniforms&&(this.uniforms.iMouse.value.x=h/this.scale,this.uniforms.iMouse.value.y=u/this.scale);let d=h/this.width,m=u/this.height;typeof this.onMouseMove=="function"&&this.onMouseMove(d,m)}setSize(){this.scale||(this.scale=1),typeof navigator<"u"&&(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<600)&&this.options.scaleMobile?this.scale=this.options.scaleMobile:this.options.scale&&(this.scale=this.options.scale),this.width=Math.max(this.el.offsetWidth,this.options.minWidth),this.height=Math.max(this.el.offsetHeight,this.options.minHeight)}initMouse(){(!this.mouseX&&!this.mouseY||this.mouseX===this.options.minWidth/2&&this.mouseY===this.options.minHeight/2)&&(this.mouseX=this.width/2,this.mouseY=this.height/2,this.triggerMouseMove(this.mouseX,this.mouseY))}resize(){this.setSize(),this.camera&&(this.camera.aspect=this.width/this.height,typeof this.camera.updateProjectionMatrix=="function"&&this.camera.updateProjectionMatrix()),this.renderer&&(this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(window.devicePixelRatio/this.scale)),typeof this.onResize=="function"&&this.onResize()}isOnScreen(){let h=this.el.offsetHeight,u=this.el.getBoundingClientRect(),d=window.pageYOffset||(document.documentElement||document.body.parentNode||document.body).scrollTop,m=u.top+d;return m-window.innerHeight<=d&&d<=m+h}animationLoop(){this.t||(this.t=0),this.t2||(this.t2=0);let h=performance.now();if(this.prevNow){let u=(h-this.prevNow)/16.666666666666668;u=Math.max(.2,Math.min(u,5)),this.t+=u,this.t2+=(this.options.speed||1)*u,this.uniforms&&(this.uniforms.iTime.value=.016667*this.t2)}return this.prevNow=h,this.options.mouseEase&&(this.mouseEaseX=this.mouseEaseX||this.mouseX||0,this.mouseEaseY=this.mouseEaseY||this.mouseY||0,Math.abs(this.mouseEaseX-this.mouseX)+Math.abs(this.mouseEaseY-this.mouseY)>.1&&(this.mouseEaseX+=.05*(this.mouseX-this.mouseEaseX),this.mouseEaseY+=.05*(this.mouseY-this.mouseEaseY),this.triggerMouseMove(this.mouseEaseX,this.mouseEaseY))),(this.isOnScreen()||this.options.forceAnimate)&&(typeof this.onUpdate=="function"&&this.onUpdate(),this.scene&&this.camera&&(this.renderer.render(this.scene,this.camera),this.renderer.setClearColor(this.options.backgroundColor,this.options.backgroundAlpha)),this.fps&&this.fps.update&&this.fps.update(),typeof this.afterRender=="function"&&this.afterRender()),this.req=window.requestAnimationFrame(this.animationLoop)}restart(){if(this.scene)for(;this.scene.children.length;)this.scene.remove(this.scene.children[0]);typeof this.onRestart=="function"&&this.onRestart(),this.init()}init(){typeof this.onInit=="function"&&this.onInit()}destroy(){typeof this.onDestroy=="function"&&this.onDestroy();let h=window.removeEventListener;h("touchstart",this.windowTouchWrapper),h("touchmove",this.windowTouchWrapper),h("scroll",this.windowMouseMoveWrapper),h("mousemove",this.windowMouseMoveWrapper),h("deviceorientation",this.windowGyroWrapper),h("resize",this.resize),window.cancelAnimationFrame(this.req);let u=this.scene;u&&u.children&&n(u),this.renderer&&(this.renderer.domElement&&this.el.removeChild(this.renderer.domElement),this.renderer=null,this.scene=null),o.current===this&&(o.current=null)}};let l=o.VantaBase,c=typeof window=="object"&&window.THREE;class f extends l{static initClass(){this.prototype.ww=100,this.prototype.hh=80,this.prototype.waveNoise=4}constructor(u){c=u.THREE||c,super(u)}getMaterial(){let u={color:this.options.color,shininess:this.options.shininess,flatShading:!0,side:c.DoubleSide};return new c.MeshPhongMaterial(u)}onInit(){let u,d,m=this.getMaterial(),y=new c.BufferGeometry;this.gg=[];let g=[];for(u=0;u<=this.ww;u++)for(this.gg[u]=[],d=0;d<=this.hh;d++){let w=g.length,C=new c.Vector3(18*(u-.5*this.ww),((x=0)==null&&(x=0),(_=this.waveNoise)==null&&(_=1),x+Math.random()*(_-x)-10),18*(.5*this.hh-d));g.push(C),this.gg[u][d]=w}var x,_;y.setFromPoints(g);let v=[];for(u=1;u<=this.ww;u++)for(d=1;d<=this.hh;d++){let w,C,I=this.gg[u][d],L=this.gg[u][d-1],R=this.gg[u-1][d],W=this.gg[u-1][d-1];t(0,1)?(w=[W,L,R],C=[L,R,I]):(w=[W,L,I],C=[W,R,I]),v.push(...w,...C)}y.setIndex(v),this.plane=new c.Mesh(y,m),this.scene.add(this.plane);let M=new c.AmbientLight(16777215,.9);this.scene.add(M);let T=new c.PointLight(16777215,.9);T.position.set(-100,250,-100),this.scene.add(T),this.camera=new c.PerspectiveCamera(35,this.width/this.height,50,1e4),this.cameraPosition=new c.Vector3(240,200,390),this.cameraTarget=new c.Vector3(140,-30,190),this.camera.position.copy(this.cameraPosition),this.scene.add(this.camera)}onUpdate(){let u;this.plane.material.color.set(this.options.color),this.plane.material.shininess=this.options.shininess,this.camera.ox=this.cameraPosition.x/this.options.zoom,this.camera.oy=this.cameraPosition.y/this.options.zoom,this.camera.oz=this.cameraPosition.z/this.options.zoom,this.controls!=null&&this.controls.update();let d=this.camera;Math.abs(d.tx-d.position.x)>.01&&(u=d.tx-d.position.x,d.position.x+=.02*u),Math.abs(d.ty-d.position.y)>.01&&(u=d.ty-d.position.y,d.position.y+=.02*u),Math.abs(d.tz-d.position.z)>.01&&(u=d.tz-d.position.z,d.position.z+=.02*u),d.lookAt(this.cameraTarget),this.oy=this.oy||{};for(let m=0;m<this.plane.geometry.attributes.position.array.length;m+=3){let y={x:this.plane.geometry.attributes.position.array[m],y:this.plane.geometry.attributes.position.array[m+1],z:this.plane.geometry.attributes.position.array[m+2],oy:this.oy[m]};if(y.oy){let g=this.options.waveSpeed,x=Math.sqrt(g)*Math.cos(-y.x-.7*y.z),_=Math.sin(g*this.t*.02-g*y.x*.025+g*y.z*.015+x),v=Math.pow(_+1,2)/4;y.y=y.oy+v*this.options.waveHeight,this.plane.geometry.attributes.position.array[m+1]=y.y}else this.oy[m]=y.y}this.plane.geometry.attributes.position.setUsage(c.DynamicDrawUsage),this.plane.geometry.computeVertexNormals(),this.plane.geometry.attributes.position.needsUpdate=!0,this.wireframe&&(this.wireframe.geometry.fromGeometry(this.plane.geometry),this.wireframe.geometry.computeFaceNormals())}onMouseMove(u,d){let m=this.camera;return m.oy||(m.oy=m.position.y,m.ox=m.position.x,m.oz=m.position.z),m.tx=m.ox+100*(u-.5)/this.options.zoom,m.ty=m.oy+-100*(d-.5)/this.options.zoom,m.tz=m.oz+-50*(u-.5)/this.options.zoom}}f.prototype.defaultOptions={color:21896,shininess:30,waveHeight:15,waveSpeed:1,zoom:1},f.initClass();let p=o.register("WAVES",f);return e})()))});var Dc={};Sf(Dc,{ACESFilmicToneMapping:()=>Ou,AddEquation:()=>$n,AddOperation:()=>Fu,AdditiveAnimationBlendMode:()=>wc,AdditiveBlending:()=>El,AlphaFormat:()=>qu,AlwaysDepth:()=>Au,AlwaysStencilFunc:()=>Hd,AmbientLight:()=>Ur,AmbientLightProbe:()=>_a,AnimationClip:()=>gi,AnimationLoader:()=>Yl,AnimationMixer:()=>Ea,AnimationObjectGroup:()=>Sa,AnimationUtils:()=>Ve,ArcCurve:()=>cr,ArrayCamera:()=>Ks,ArrowHelper:()=>fc,Audio:()=>Vr,AudioAnalyser:()=>Ma,AudioContext:()=>Lc,AudioListener:()=>jl,AudioLoader:()=>ya,AxesHelper:()=>Da,AxisHelper:()=>hv,BackSide:()=>Qe,BasicDepthPacking:()=>Bd,BasicShadowMap:()=>Rf,BinaryTextureLoader:()=>mv,Bone:()=>us,BooleanKeyframeTrack:()=>fn,BoundingBoxHelper:()=>uv,Box2:()=>Nn,Box3:()=>_t,Box3Helper:()=>uc,BoxBufferGeometry:()=>Cn,BoxGeometry:()=>Cn,BoxHelper:()=>Ia,BufferAttribute:()=>Pe,BufferGeometry:()=>_e,BufferGeometryLoader:()=>ga,ByteType:()=>Hu,Cache:()=>xi,Camera:()=>oi,CameraHelper:()=>hc,CanvasRenderer:()=>xv,CanvasTexture:()=>na,CatmullRomCurve3:()=>hr,CineonToneMapping:()=>Bu,CircleBufferGeometry:()=>rr,CircleGeometry:()=>rr,ClampToEdgeWrapping:()=>ht,Clock:()=>wa,Color:()=>ne,ColorKeyframeTrack:()=>Ir,CompressedTexture:()=>sr,CompressedTextureLoader:()=>Jl,ConeBufferGeometry:()=>or,ConeGeometry:()=>or,CubeCamera:()=>ts,CubeReflectionMapping:()=>_i,CubeRefractionMapping:()=>wi,CubeTexture:()=>Rn,CubeTextureLoader:()=>ca,CubeUVReflectionMapping:()=>ws,CubeUVRefractionMapping:()=>Xr,CubicBezierCurve:()=>ds,CubicBezierCurve3:()=>ur,CubicInterpolant:()=>oa,CullFaceBack:()=>Sl,CullFaceFront:()=>du,CullFaceFrontBack:()=>Cf,CullFaceNone:()=>uu,Curve:()=>Mt,CurvePath:()=>ra,CustomBlending:()=>pu,CustomToneMapping:()=>Uu,CylinderBufferGeometry:()=>hi,CylinderGeometry:()=>hi,Cylindrical:()=>sc,DataTexture:()=>rn,DataTexture2DArray:()=>ss,DataTexture3D:()=>Qs,DataTextureLoader:()=>ha,DataUtils:()=>mc,DecrementStencilOp:()=>Hf,DecrementWrapStencilOp:()=>kf,DefaultLoadingManager:()=>cf,DepthFormat:()=>ti,DepthStencilFormat:()=>Zi,DepthTexture:()=>ia,DirectionalLight:()=>Or,DirectionalLightHelper:()=>cc,DiscreteInterpolant:()=>aa,DodecahedronBufferGeometry:()=>ar,DodecahedronGeometry:()=>ar,DoubleSide:()=>si,DstAlphaFactor:()=>wu,DstColorFactor:()=>bu,DynamicBufferAttribute:()=>ev,DynamicCopyUsage:()=>np,DynamicDrawUsage:()=>ji,DynamicReadUsage:()=>Kf,EdgesGeometry:()=>lr,EdgesHelper:()=>dv,EllipseCurve:()=>ui,EqualDepth:()=>Ru,EqualStencilFunc:()=>qf,EquirectangularReflectionMapping:()=>Gs,EquirectangularRefractionMapping:()=>ks,Euler:()=>ri,EventDispatcher:()=>qt,ExtrudeBufferGeometry:()=>dn,ExtrudeGeometry:()=>dn,FaceColors:()=>V0,FileLoader:()=>It,FlatShading:()=>xc,Float16BufferAttribute:()=>Zo,Float32Attribute:()=>lv,Float32BufferAttribute:()=>le,Float64Attribute:()=>cv,Float64BufferAttribute:()=>$o,FloatType:()=>Wt,Fog:()=>tr,FogExp2:()=>er,Font:()=>Sv,FontLoader:()=>bv,FrontSide:()=>ii,Frustum:()=>ai,GLBufferAttribute:()=>Ca,GLSL1:()=>sp,GLSL3:()=>Hl,GammaEncoding:()=>za,GreaterDepth:()=>Pu,GreaterEqualDepth:()=>Lu,GreaterEqualStencilFunc:()=>$f,GreaterStencilFunc:()=>Jf,GridHelper:()=>Pa,Group:()=>nn,HalfFloatType:()=>Kn,HemisphereLight:()=>Fr,HemisphereLightHelper:()=>ac,HemisphereLightProbe:()=>va,IcosahedronBufferGeometry:()=>mr,IcosahedronGeometry:()=>mr,ImageBitmapLoader:()=>xa,ImageLoader:()=>yi,ImageUtils:()=>an,ImmediateRenderObject:()=>Ev,IncrementStencilOp:()=>Uf,IncrementWrapStencilOp:()=>Gf,InstancedBufferAttribute:()=>cn,InstancedBufferGeometry:()=>kr,InstancedInterleavedBuffer:()=>Aa,InstancedMesh:()=>nr,Int16Attribute:()=>sv,Int16BufferAttribute:()=>Yo,Int32Attribute:()=>ov,Int32BufferAttribute:()=>Jo,Int8Attribute:()=>tv,Int8BufferAttribute:()=>Wo,IntType:()=>ku,InterleavedBuffer:()=>ln,InterleavedBufferAttribute:()=>In,Interpolant:()=>kt,InterpolateDiscrete:()=>qs,InterpolateLinear:()=>Ys,InterpolateSmooth:()=>Oo,InvertStencilOp:()=>Vf,JSONLoader:()=>yv,KeepStencilOp:()=>Uo,KeyframeTrack:()=>At,LOD:()=>Ko,LatheBufferGeometry:()=>gr,LatheGeometry:()=>gr,Layers:()=>js,LensFlare:()=>_v,LessDepth:()=>Cu,LessEqualDepth:()=>Ho,LessEqualStencilFunc:()=>Yf,LessStencilFunc:()=>Xf,Light:()=>Ct,LightProbe:()=>vi,Line:()=>Gt,Line3:()=>Ra,LineBasicMaterial:()=>it,LineCurve:()=>di,LineCurve3:()=>sa,LineDashedMaterial:()=>Lr,LineLoop:()=>ir,LinePieces:()=>G0,LineSegments:()=>vt,LineStrip:()=>H0,LinearEncoding:()=>ft,LinearFilter:()=>st,LinearInterpolant:()=>Pr,LinearMipMapLinearFilter:()=>Ff,LinearMipMapNearestFilter:()=>Df,LinearMipmapLinearFilter:()=>Mi,LinearMipmapNearestFilter:()=>_c,LinearToneMapping:()=>Nu,Loader:()=>pt,LoaderUtils:()=>_s,LoadingManager:()=>Dr,LogLuvEncoding:()=>zd,LoopOnce:()=>Id,LoopPingPong:()=>Fd,LoopRepeat:()=>Dd,LuminanceAlphaFormat:()=>Ju,LuminanceFormat:()=>Yu,MOUSE:()=>Tf,Material:()=>nt,MaterialLoader:()=>ma,Math:()=>vp,MathUtils:()=>vp,Matrix3:()=>Ke,Matrix4:()=>he,MaxEquation:()=>Rl,Mesh:()=>Je,MeshBasicMaterial:()=>Ut,MeshDepthMaterial:()=>rs,MeshDistanceMaterial:()=>os,MeshFaceMaterial:()=>X0,MeshLambertMaterial:()=>Cr,MeshMatcapMaterial:()=>Rr,MeshNormalMaterial:()=>Ar,MeshPhongMaterial:()=>Er,MeshPhysicalMaterial:()=>Sr,MeshStandardMaterial:()=>vs,MeshToonMaterial:()=>Tr,MinEquation:()=>Cl,MirroredRepeatWrapping:()=>Ws,MixOperation:()=>Du,MultiMaterial:()=>q0,MultiplyBlending:()=>Al,MultiplyOperation:()=>Wr,NearestFilter:()=>tt,NearestMipMapLinearFilter:()=>If,NearestMipMapNearestFilter:()=>Pf,NearestMipmapLinearFilter:()=>ko,NearestMipmapNearestFilter:()=>Go,NeverDepth:()=>Tu,NeverStencilFunc:()=>Wf,NoBlending:()=>sn,NoColors:()=>k0,NoToneMapping:()=>En,NormalAnimationBlendMode:()=>Na,NormalBlending:()=>qi,NotEqualDepth:()=>Iu,NotEqualStencilFunc:()=>Zf,NumberKeyframeTrack:()=>pi,Object3D:()=>Ie,ObjectLoader:()=>Zl,ObjectSpaceNormalMap:()=>Ud,OctahedronBufferGeometry:()=>gs,OctahedronGeometry:()=>gs,OneFactor:()=>yu,OneMinusDstAlphaFactor:()=>Mu,OneMinusDstColorFactor:()=>Su,OneMinusSrcAlphaFactor:()=>vc,OneMinusSrcColorFactor:()=>_u,OrthographicCamera:()=>li,PCFShadowMap:()=>gc,PCFSoftShadowMap:()=>fu,PMREMGenerator:()=>jo,ParametricGeometry:()=>wv,Particle:()=>J0,ParticleBasicMaterial:()=>j0,ParticleSystem:()=>Z0,ParticleSystemMaterial:()=>Q0,Path:()=>fi,PerspectiveCamera:()=>et,Plane:()=>Lt,PlaneBufferGeometry:()=>is,PlaneGeometry:()=>is,PlaneHelper:()=>dc,PointCloud:()=>Y0,PointCloudMaterial:()=>$0,PointLight:()=>Br,PointLightHelper:()=>oc,Points:()=>ci,PointsMaterial:()=>hn,PolarGridHelper:()=>lc,PolyhedronBufferGeometry:()=>un,PolyhedronGeometry:()=>un,PositionalAudio:()=>Ql,PropertyBinding:()=>Ue,PropertyMixer:()=>ba,QuadraticBezierCurve:()=>fs,QuadraticBezierCurve3:()=>ps,Quaternion:()=>rt,QuaternionKeyframeTrack:()=>Fn,QuaternionLinearInterpolant:()=>la,REVISION:()=>Ef,RGBADepthPacking:()=>Od,RGBAFormat:()=>ut,RGBAIntegerFormat:()=>td,RGBA_ASTC_10x10_Format:()=>pd,RGBA_ASTC_10x5_Format:()=>ud,RGBA_ASTC_10x6_Format:()=>dd,RGBA_ASTC_10x8_Format:()=>fd,RGBA_ASTC_12x10_Format:()=>md,RGBA_ASTC_12x12_Format:()=>gd,RGBA_ASTC_4x4_Format:()=>id,RGBA_ASTC_5x4_Format:()=>sd,RGBA_ASTC_5x5_Format:()=>rd,RGBA_ASTC_6x5_Format:()=>od,RGBA_ASTC_6x6_Format:()=>ad,RGBA_ASTC_8x5_Format:()=>ld,RGBA_ASTC_8x6_Format:()=>cd,RGBA_ASTC_8x8_Format:()=>hd,RGBA_BPTC_Format:()=>xd,RGBA_ETC2_EAC_Format:()=>Ul,RGBA_PVRTC_2BPPV1_Format:()=>Bl,RGBA_PVRTC_4BPPV1_Format:()=>zl,RGBA_S3TC_DXT1_Format:()=>Pl,RGBA_S3TC_DXT3_Format:()=>Il,RGBA_S3TC_DXT5_Format:()=>Dl,RGBDEncoding:()=>Sc,RGBEEncoding:()=>Ba,RGBEFormat:()=>Zu,RGBFormat:()=>ei,RGBIntegerFormat:()=>ed,RGBM16Encoding:()=>bc,RGBM7Encoding:()=>Mc,RGB_ETC1_Format:()=>nd,RGB_ETC2_Format:()=>Ol,RGB_PVRTC_2BPPV1_Format:()=>Nl,RGB_PVRTC_4BPPV1_Format:()=>Fl,RGB_S3TC_DXT1_Format:()=>Ll,RGFormat:()=>Qu,RGIntegerFormat:()=>Ku,RawShaderMaterial:()=>Ln,Ray:()=>Jt,Raycaster:()=>tc,RectAreaLight:()=>Hr,RedFormat:()=>$u,RedIntegerFormat:()=>ju,ReinhardToneMapping:()=>zu,RepeatWrapping:()=>Vs,ReplaceStencilOp:()=>Of,ReverseSubtractEquation:()=>gu,RingBufferGeometry:()=>xr,RingGeometry:()=>xr,SRGB8_ALPHA8_ASTC_10x10_Format:()=>Rd,SRGB8_ALPHA8_ASTC_10x5_Format:()=>Td,SRGB8_ALPHA8_ASTC_10x6_Format:()=>Ad,SRGB8_ALPHA8_ASTC_10x8_Format:()=>Cd,SRGB8_ALPHA8_ASTC_12x10_Format:()=>Ld,SRGB8_ALPHA8_ASTC_12x12_Format:()=>Pd,SRGB8_ALPHA8_ASTC_4x4_Format:()=>yd,SRGB8_ALPHA8_ASTC_5x4_Format:()=>vd,SRGB8_ALPHA8_ASTC_5x5_Format:()=>_d,SRGB8_ALPHA8_ASTC_6x5_Format:()=>wd,SRGB8_ALPHA8_ASTC_6x6_Format:()=>Md,SRGB8_ALPHA8_ASTC_8x5_Format:()=>bd,SRGB8_ALPHA8_ASTC_8x6_Format:()=>Sd,SRGB8_ALPHA8_ASTC_8x8_Format:()=>Ed,Scene:()=>as,SceneUtils:()=>vv,ShaderChunk:()=>Re,ShaderLib:()=>Ot,ShaderMaterial:()=>Ht,ShadowMaterial:()=>br,Shape:()=>Pt,ShapeBufferGeometry:()=>xs,ShapeGeometry:()=>xs,ShapePath:()=>pc,ShapeUtils:()=>Xt,ShortType:()=>Gu,Skeleton:()=>ea,SkeletonHelper:()=>La,SkinnedMesh:()=>hs,SmoothShading:()=>Lf,Sphere:()=>Yt,SphereBufferGeometry:()=>ys,SphereGeometry:()=>ys,Spherical:()=>ic,SphericalHarmonics3:()=>Gr,SplineCurve:()=>ms,SpotLight:()=>zr,SpotLightHelper:()=>rc,Sprite:()=>cs,SpriteMaterial:()=>ls,SrcAlphaFactor:()=>yc,SrcAlphaSaturateFactor:()=>Eu,SrcColorFactor:()=>vu,StaticCopyUsage:()=>tp,StaticDrawUsage:()=>$i,StaticReadUsage:()=>Qf,StereoCamera:()=>$l,StreamCopyUsage:()=>ip,StreamDrawUsage:()=>jf,StreamReadUsage:()=>ep,StringKeyframeTrack:()=>pn,SubtractEquation:()=>mu,SubtractiveBlending:()=>Tl,TOUCH:()=>Af,TangentSpaceNormalMap:()=>bi,TetrahedronBufferGeometry:()=>yr,TetrahedronGeometry:()=>yr,TextGeometry:()=>Mv,Texture:()=>at,TextureLoader:()=>ua,TorusBufferGeometry:()=>vr,TorusGeometry:()=>vr,TorusKnotBufferGeometry:()=>_r,TorusKnotGeometry:()=>_r,Triangle:()=>dt,TriangleFanDrawMode:()=>zf,TriangleStripDrawMode:()=>Nf,TrianglesDrawMode:()=>Nd,TubeBufferGeometry:()=>wr,TubeGeometry:()=>wr,UVMapping:()=>Fa,Uint16Attribute:()=>rv,Uint16BufferAttribute:()=>Qi,Uint32Attribute:()=>av,Uint32BufferAttribute:()=>Ki,Uint8Attribute:()=>nv,Uint8BufferAttribute:()=>Xo,Uint8ClampedAttribute:()=>iv,Uint8ClampedBufferAttribute:()=>qo,Uniform:()=>Ta,UniformsLib:()=>te,UniformsUtils:()=>Xd,UnsignedByteType:()=>on,UnsignedInt248Type:()=>Yi,UnsignedIntType:()=>zs,UnsignedShort4444Type:()=>Vu,UnsignedShort5551Type:()=>Wu,UnsignedShort565Type:()=>Xu,UnsignedShortType:()=>Xs,VSMShadowMap:()=>Vi,Vector2:()=>X,Vector3:()=>b,Vector4:()=>Be,VectorKeyframeTrack:()=>mi,Vertex:()=>K0,VertexColors:()=>W0,VideoTexture:()=>ta,WebGL1Renderer:()=>Qo,WebGLCubeRenderTarget:()=>ns,WebGLMultipleRenderTargets:()=>Vo,WebGLMultisampleRenderTarget:()=>$s,WebGLRenderTarget:()=>Tt,WebGLRenderTargetCube:()=>gv,WebGLRenderer:()=>He,WebGLUtils:()=>sf,WireframeGeometry:()=>Mr,WireframeHelper:()=>fv,WrapAroundEnding:()=>Js,XHRLoader:()=>pv,ZeroCurvatureEnding:()=>jn,ZeroFactor:()=>xu,ZeroSlopeEnding:()=>Qn,ZeroStencilOp:()=>Bf,sRGBEncoding:()=>zn});var Ef="134",Tf={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Af={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},uu=0,Sl=1,du=2,Cf=3,Rf=0,gc=1,fu=2,Vi=3,ii=0,Qe=1,si=2,xc=1,Lf=2,sn=0,qi=1,El=2,Tl=3,Al=4,pu=5,$n=100,mu=101,gu=102,Cl=103,Rl=104,xu=200,yu=201,vu=202,_u=203,yc=204,vc=205,wu=206,Mu=207,bu=208,Su=209,Eu=210,Tu=0,Au=1,Cu=2,Ho=3,Ru=4,Lu=5,Pu=6,Iu=7,Wr=0,Du=1,Fu=2,En=0,Nu=1,zu=2,Bu=3,Ou=4,Uu=5,Fa=300,_i=301,wi=302,Gs=303,ks=304,ws=306,Xr=307,Vs=1e3,ht=1001,Ws=1002,tt=1003,Go=1004,Pf=1004,ko=1005,If=1005,st=1006,_c=1007,Df=1007,Mi=1008,Ff=1008,on=1009,Hu=1010,Gu=1011,Xs=1012,ku=1013,zs=1014,Wt=1015,Kn=1016,Vu=1017,Wu=1018,Xu=1019,Yi=1020,qu=1021,ei=1022,ut=1023,Yu=1024,Ju=1025,Zu=ut,ti=1026,Zi=1027,$u=1028,ju=1029,Qu=1030,Ku=1031,ed=1032,td=1033,Ll=33776,Pl=33777,Il=33778,Dl=33779,Fl=35840,Nl=35841,zl=35842,Bl=35843,nd=36196,Ol=37492,Ul=37496,id=37808,sd=37809,rd=37810,od=37811,ad=37812,ld=37813,cd=37814,hd=37815,ud=37816,dd=37817,fd=37818,pd=37819,md=37820,gd=37821,xd=36492,yd=37840,vd=37841,_d=37842,wd=37843,Md=37844,bd=37845,Sd=37846,Ed=37847,Td=37848,Ad=37849,Cd=37850,Rd=37851,Ld=37852,Pd=37853,Id=2200,Dd=2201,Fd=2202,qs=2300,Ys=2301,Oo=2302,jn=2400,Qn=2401,Js=2402,Na=2500,wc=2501,Nd=0,Nf=1,zf=2,ft=3e3,zn=3001,za=3007,Ba=3002,zd=3003,Mc=3004,bc=3005,Sc=3006,Bd=3200,Od=3201,bi=0,Ud=1,Bf=0,Uo=7680,Of=7681,Uf=7682,Hf=7683,Gf=34055,kf=34056,Vf=5386,Wf=512,Xf=513,qf=514,Yf=515,Jf=516,Zf=517,$f=518,Hd=519,$i=35044,ji=35048,jf=35040,Qf=35045,Kf=35049,ep=35041,tp=35046,np=35050,ip=35042,sp="100",Hl="300 es",qt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let i=this._listeners[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,e);e.target=null}}},$r=1234567,ni=Math.PI/180,Zs=180/Math.PI,lt=[];for(let r=0;r<256;r++)lt[r]=(r<16?"0":"")+r.toString(16);var rp=typeof crypto<"u"&&"randomUUID"in crypto;function Et(){if(rp)return crypto.randomUUID().toUpperCase();let r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(lt[r&255]+lt[r>>8&255]+lt[r>>16&255]+lt[r>>24&255]+"-"+lt[e&255]+lt[e>>8&255]+"-"+lt[e>>16&15|64]+lt[e>>24&255]+"-"+lt[t&63|128]+lt[t>>8&255]+"-"+lt[t>>16&255]+lt[t>>24&255]+lt[n&255]+lt[n>>8&255]+lt[n>>16&255]+lt[n>>24&255]).toUpperCase()}function ct(r,e,t){return Math.max(e,Math.min(t,r))}function Ec(r,e){return(r%e+e)%e}function op(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function ap(r,e,t){return r!==e?(t-r)/(e-r):0}function Bs(r,e,t){return(1-t)*r+t*e}function lp(r,e,t,n){return Bs(r,e,1-Math.exp(-t*n))}function cp(r,e=1){return e-Math.abs(Ec(r,e*2)-e)}function hp(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function up(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function dp(r,e){return r+Math.floor(Math.random()*(e-r+1))}function fp(r,e){return r+Math.random()*(e-r)}function pp(r){return r*(.5-Math.random())}function mp(r){return r!==void 0&&($r=r%2147483647),$r=$r*16807%2147483647,($r-1)/2147483646}function gp(r){return r*ni}function xp(r){return r*Zs}function Gl(r){return(r&r-1)===0&&r!==0}function Gd(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function kd(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function yp(r,e,t,n,i){let s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+n)/2),f=o((e+n)/2),p=s((e-n)/2),h=o((e-n)/2),u=s((n-e)/2),d=o((n-e)/2);switch(i){case"XYX":r.set(a*f,l*p,l*h,a*c);break;case"YZY":r.set(l*h,a*f,l*p,a*c);break;case"ZXZ":r.set(l*p,l*h,a*f,a*c);break;case"XZX":r.set(a*f,l*d,l*u,a*c);break;case"YXY":r.set(l*u,a*f,l*d,a*c);break;case"ZYZ":r.set(l*d,l*u,a*f,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}var vp=Object.freeze({__proto__:null,DEG2RAD:ni,RAD2DEG:Zs,generateUUID:Et,clamp:ct,euclideanModulo:Ec,mapLinear:op,inverseLerp:ap,lerp:Bs,damp:lp,pingpong:cp,smoothstep:hp,smootherstep:up,randInt:dp,randFloat:fp,randFloatSpread:pp,seededRandom:mp,degToRad:gp,radToDeg:xp,isPowerOfTwo:Gl,ceilPowerOfTwo:Gd,floorPowerOfTwo:kd,setQuaternionFromProperEuler:yp}),X=class{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this)}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this)}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector2: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*i+e.x,this.y=s*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};X.prototype.isVector2=!0;var Ke=class{constructor(){this.elements=[1,0,0,0,1,0,0,0,1],arguments.length>0&&console.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.")}set(e,t,n,i,s,o,a,l,c){let f=this.elements;return f[0]=e,f[1]=i,f[2]=a,f[3]=t,f[4]=s,f[5]=l,f[6]=n,f[7]=o,f[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],f=n[4],p=n[7],h=n[2],u=n[5],d=n[8],m=i[0],y=i[3],g=i[6],x=i[1],_=i[4],v=i[7],M=i[2],T=i[5],w=i[8];return s[0]=o*m+a*x+l*M,s[3]=o*y+a*_+l*T,s[6]=o*g+a*v+l*w,s[1]=c*m+f*x+p*M,s[4]=c*y+f*_+p*T,s[7]=c*g+f*v+p*w,s[2]=h*m+u*x+d*M,s[5]=h*y+u*_+d*T,s[8]=h*g+u*v+d*w,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],f=e[8];return t*o*f-t*a*c-n*s*f+n*a*l+i*s*c-i*o*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],f=e[8],p=f*o-a*c,h=a*l-f*s,u=c*s-o*l,d=t*p+n*h+i*u;if(d===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/d;return e[0]=p*m,e[1]=(i*c-f*n)*m,e[2]=(a*n-i*o)*m,e[3]=h*m,e[4]=(f*t-i*l)*m,e[5]=(i*s-a*t)*m,e[6]=u*m,e[7]=(n*l-c*t)*m,e[8]=(o*t-n*s)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){let n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=t,n[4]*=t,n[7]*=t,this}rotate(e){let t=Math.cos(e),n=Math.sin(e),i=this.elements,s=i[0],o=i[3],a=i[6],l=i[1],c=i[4],f=i[7];return i[0]=t*s+n*l,i[3]=t*o+n*c,i[6]=t*a+n*f,i[1]=-n*s+t*l,i[4]=-n*o+t*c,i[7]=-n*a+t*f,this}translate(e,t){let n=this.elements;return n[0]+=e*n[2],n[3]+=e*n[5],n[6]+=e*n[8],n[1]+=t*n[2],n[4]+=t*n[5],n[7]+=t*n[8],this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Ke.prototype.isMatrix3=!0;function Vd(r){if(r.length===0)return-1/0;let e=r[0];for(let t=1,n=r.length;t<n;++t)r[t]>e&&(e=r[t]);return e}var _p={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function Wi(r,e){return new _p[r](e)}function Oa(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function kc(r,e=0){let t=3735928559^e,n=1103547991^e;for(let i=0,s;i<r.length;i++)s=r.charCodeAt(i),t=Math.imul(t^s,2654435761),n=Math.imul(n^s,1597334677);return t=Math.imul(t^t>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507)^Math.imul(t^t>>>13,3266489909),4294967296*(2097151&n)+(t>>>0)}var Si,an=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Si===void 0&&(Si=Oa("canvas")),Si.width=e.width,Si.height=e.height;let n=Si.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Si}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}},wp=0,at=class r extends qt{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,n=ht,i=ht,s=st,o=Mi,a=ut,l=on,c=1,f=ft){super(),Object.defineProperty(this,"id",{value:wp++}),this.uuid=Et(),this.name="",this.image=e,this.mipmaps=[],this.mapping=t,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new X(0,0),this.repeat=new X(1,1),this.center=new X(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.encoding=f,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.image=e.image,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.encoding=e.encoding,this.userData=JSON.parse(JSON.stringify(e.userData)),this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.5,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,type:this.type,encoding:this.encoding,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(this.image!==void 0){let i=this.image;if(i.uuid===void 0&&(i.uuid=Et()),!t&&e.images[i.uuid]===void 0){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(Va(i[o].image)):s.push(Va(i[o]))}else s=Va(i);e.images[i.uuid]={uuid:i.uuid,url:s}}n.image=i.uuid}return JSON.stringify(this.userData)!=="{}"&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Fa)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Vs:e.x=e.x-Math.floor(e.x);break;case ht:e.x=e.x<0?0:1;break;case Ws:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Vs:e.y=e.y-Math.floor(e.y);break;case ht:e.y=e.y<0?0:1;break;case Ws:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&this.version++}};at.DEFAULT_IMAGE=void 0;at.DEFAULT_MAPPING=Fa;at.prototype.isTexture=!0;function Va(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?an.getDataURL(r):r.data?{data:Array.prototype.slice.call(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Be=class{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this)}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this)}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,l=e.elements,c=l[0],f=l[4],p=l[8],h=l[1],u=l[5],d=l[9],m=l[2],y=l[6],g=l[10];if(Math.abs(f-h)<.01&&Math.abs(p-m)<.01&&Math.abs(d-y)<.01){if(Math.abs(f+h)<.1&&Math.abs(p+m)<.1&&Math.abs(d+y)<.1&&Math.abs(c+u+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let _=(c+1)/2,v=(u+1)/2,M=(g+1)/2,T=(f+h)/4,w=(p+m)/4,C=(d+y)/4;return _>v&&_>M?_<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(_),i=T/n,s=w/n):v>M?v<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(v),n=T/i,s=C/i):M<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(M),n=w/s,i=C/s),this.set(n,i,s,t),this}let x=Math.sqrt((y-d)*(y-d)+(p-m)*(p-m)+(h-f)*(h-f));return Math.abs(x)<.001&&(x=1),this.x=(y-d)/x,this.y=(p-m)/x,this.z=(h-f)/x,this.w=Math.acos((c+u+g-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector4: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Be.prototype.isVector4=!0;var Tt=class extends qt{constructor(e,t,n={}){super(),this.width=e,this.height=t,this.depth=1,this.scissor=new Be(0,0,e,t),this.scissorTest=!1,this.viewport=new Be(0,0,e,t),this.texture=new at(void 0,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.encoding),this.texture.isRenderTargetTexture=!0,this.texture.image={width:e,height:t,depth:1},this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:st,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null}setTexture(e){e.image={width:this.width,height:this.height,depth:this.depth},this.texture=e}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.image={...this.texture.image},this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.depthTexture=e.depthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}};Tt.prototype.isWebGLRenderTarget=!0;var Vo=class extends Tt{constructor(e,t,n){super(e,t);let i=this.texture;this.texture=[];for(let s=0;s<n;s++)this.texture[s]=i.clone()}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.texture.length;i<s;i++)this.texture[i].image.width=e,this.texture[i].image.height=t,this.texture[i].image.depth=n;this.dispose()}return this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t),this}copy(e){this.dispose(),this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.set(0,0,this.width,this.height),this.scissor.set(0,0,this.width,this.height),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.depthTexture=e.depthTexture,this.texture.length=0;for(let t=0,n=e.texture.length;t<n;t++)this.texture[t]=e.texture[t].clone();return this}};Vo.prototype.isWebGLMultipleRenderTargets=!0;var $s=class extends Tt{constructor(e,t,n){super(e,t,n),this.samples=4}copy(e){return super.copy.call(this,e),this.samples=e.samples,this}};$s.prototype.isWebGLMultisampleRenderTarget=!0;var rt=class{constructor(e=0,t=0,n=0,i=1){this._x=e,this._y=t,this._z=n,this._w=i}static slerp(e,t,n,i){return console.warn("THREE.Quaternion: Static .slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead."),n.slerpQuaternions(e,t,i)}static slerpFlat(e,t,n,i,s,o,a){let l=n[i+0],c=n[i+1],f=n[i+2],p=n[i+3],h=s[o+0],u=s[o+1],d=s[o+2],m=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=f,e[t+3]=p;return}if(a===1){e[t+0]=h,e[t+1]=u,e[t+2]=d,e[t+3]=m;return}if(p!==m||l!==h||c!==u||f!==d){let y=1-a,g=l*h+c*u+f*d+p*m,x=g>=0?1:-1,_=1-g*g;if(_>Number.EPSILON){let M=Math.sqrt(_),T=Math.atan2(M,g*x);y=Math.sin(y*T)/M,a=Math.sin(a*T)/M}let v=a*x;if(l=l*y+h*v,c=c*y+u*v,f=f*y+d*v,p=p*y+m*v,y===1-a){let M=1/Math.sqrt(l*l+c*c+f*f+p*p);l*=M,c*=M,f*=M,p*=M}}e[t]=l,e[t+1]=c,e[t+2]=f,e[t+3]=p}static multiplyQuaternionsFlat(e,t,n,i,s,o){let a=n[i],l=n[i+1],c=n[i+2],f=n[i+3],p=s[o],h=s[o+1],u=s[o+2],d=s[o+3];return e[t]=a*d+f*p+l*u-c*h,e[t+1]=l*d+f*h+c*p-a*u,e[t+2]=c*d+f*u+a*h-l*p,e[t+3]=f*d-a*p-l*h-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){if(!(e&&e.isEuler))throw new Error("THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.");let n=e._x,i=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),f=a(i/2),p=a(s/2),h=l(n/2),u=l(i/2),d=l(s/2);switch(o){case"XYZ":this._x=h*f*p+c*u*d,this._y=c*u*p-h*f*d,this._z=c*f*d+h*u*p,this._w=c*f*p-h*u*d;break;case"YXZ":this._x=h*f*p+c*u*d,this._y=c*u*p-h*f*d,this._z=c*f*d-h*u*p,this._w=c*f*p+h*u*d;break;case"ZXY":this._x=h*f*p-c*u*d,this._y=c*u*p+h*f*d,this._z=c*f*d+h*u*p,this._w=c*f*p-h*u*d;break;case"ZYX":this._x=h*f*p-c*u*d,this._y=c*u*p+h*f*d,this._z=c*f*d-h*u*p,this._w=c*f*p+h*u*d;break;case"YZX":this._x=h*f*p+c*u*d,this._y=c*u*p+h*f*d,this._z=c*f*d-h*u*p,this._w=c*f*p-h*u*d;break;case"XZY":this._x=h*f*p-c*u*d,this._y=c*u*p-h*f*d,this._z=c*f*d+h*u*p,this._w=c*f*p+h*u*d;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],f=t[6],p=t[10],h=n+a+p;if(h>0){let u=.5/Math.sqrt(h+1);this._w=.25/u,this._x=(f-l)*u,this._y=(s-c)*u,this._z=(o-i)*u}else if(n>a&&n>p){let u=2*Math.sqrt(1+n-a-p);this._w=(f-l)/u,this._x=.25*u,this._y=(i+o)/u,this._z=(s+c)/u}else if(a>p){let u=2*Math.sqrt(1+a-n-p);this._w=(s-c)/u,this._x=(i+o)/u,this._y=.25*u,this._z=(l+f)/u}else{let u=2*Math.sqrt(1+p-n-a);this._w=(o-i)/u,this._x=(s+c)/u,this._y=(l+f)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ct(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e,t){return t!==void 0?(console.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."),this.multiplyQuaternions(e,t)):this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,f=t._w;return this._x=n*f+o*a+i*c-s*l,this._y=i*f+o*l+s*a-n*c,this._z=s*f+o*c+n*l-i*a,this._w=o*f-n*a-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,s=this._z,o=this._w,a=o*e._w+n*e._x+i*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;let l=1-a*a;if(l<=Number.EPSILON){let u=1-t;return this._w=u*o+t*this._w,this._x=u*n+t*this._x,this._y=u*i+t*this._y,this._z=u*s+t*this._z,this.normalize(),this._onChangeCallback(),this}let c=Math.sqrt(l),f=Math.atan2(c,a),p=Math.sin((1-t)*f)/c,h=Math.sin(t*f)/c;return this._w=o*p+this._w*h,this._x=n*p+this._x*h,this._y=i*p+this._y*h,this._z=s*p+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){this.copy(e).slerp(t,n)}random(){let e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(s),n*Math.cos(s),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}};rt.prototype.isQuaternion=!0;var b=class{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this)}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this)}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e,t){return t!==void 0?(console.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."),this.multiplyVectors(e,t)):(this.x*=e.x,this.y*=e.y,this.z*=e.z,this)}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return e&&e.isEuler||console.error("THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order."),this.applyQuaternion(Vc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Vc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=l*t+o*i-a*n,f=l*n+a*t-s*i,p=l*i+s*n-o*t,h=-s*t-o*n-a*i;return this.x=c*l+h*-s+f*-a-p*-o,this.y=f*l+h*-o+p*-s-c*-a,this.z=p*l+h*-a+c*-o-f*-s,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e,t){return t!==void 0?(console.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."),this.crossVectors(e,t)):this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-s*a,this.y=s*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Wa.copy(this).projectOnVector(e),this.sub(Wa)}reflect(e){return this.sub(Wa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector3: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};b.prototype.isVector3=!0;var Wa=new b,Vc=new rt,_t=class{constructor(e=new b(1/0,1/0,1/0),t=new b(-1/0,-1/0,-1/0)){this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){let t=1/0,n=1/0,i=1/0,s=-1/0,o=-1/0,a=-1/0;for(let l=0,c=e.length;l<c;l+=3){let f=e[l],p=e[l+1],h=e[l+2];f<t&&(t=f),p<n&&(n=p),h<i&&(i=h),f>s&&(s=f),p>o&&(o=p),h>a&&(a=h)}return this.min.set(t,n,i),this.max.set(s,o,a),this}setFromBufferAttribute(e){let t=1/0,n=1/0,i=1/0,s=-1/0,o=-1/0,a=-1/0;for(let l=0,c=e.count;l<c;l++){let f=e.getX(l),p=e.getY(l),h=e.getZ(l);f<t&&(t=f),p<n&&(n=p),h<i&&(i=h),f>s&&(s=f),p>o&&(o=p),h>a&&(a=h)}return this.min.set(t,n,i),this.max.set(s,o,a),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Es.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e){return this.makeEmpty(),this.expandByObject(e)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e){e.updateWorldMatrix(!1,!1);let t=e.geometry;t!==void 0&&(t.boundingBox===null&&t.computeBoundingBox(),Xa.copy(t.boundingBox),Xa.applyMatrix4(e.matrixWorld),this.union(Xa));let n=e.children;for(let i=0,s=n.length;i<s;i++)this.expandByObject(n[i]);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Es),Es.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ts),jr.subVectors(this.max,Ts),Ei.subVectors(e.a,Ts),Ti.subVectors(e.b,Ts),Ai.subVectors(e.c,Ts),xn.subVectors(Ti,Ei),yn.subVectors(Ai,Ti),kn.subVectors(Ei,Ai);let t=[0,-xn.z,xn.y,0,-yn.z,yn.y,0,-kn.z,kn.y,xn.z,0,-xn.x,yn.z,0,-yn.x,kn.z,0,-kn.x,-xn.y,xn.x,0,-yn.y,yn.x,0,-kn.y,kn.x,0];return!qa(t,Ei,Ti,Ai,jr)||(t=[1,0,0,0,1,0,0,0,1],!qa(t,Ei,Ti,Ai,jr))?!1:(Qr.crossVectors(xn,yn),t=[Qr.x,Qr.y,Qr.z],qa(t,Ei,Ti,Ai,jr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return Es.copy(e).clamp(this.min,this.max).sub(e).length()}getBoundingSphere(e){return this.getCenter(e.center),e.radius=this.getSize(Es).length()*.5,e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($t[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$t[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$t[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$t[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$t[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$t[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$t[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$t[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($t),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}};_t.prototype.isBox3=!0;var $t=[new b,new b,new b,new b,new b,new b,new b,new b],Es=new b,Xa=new _t,Ei=new b,Ti=new b,Ai=new b,xn=new b,yn=new b,kn=new b,Ts=new b,jr=new b,Qr=new b,Vn=new b;function qa(r,e,t,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){Vn.fromArray(r,s);let a=i.x*Math.abs(Vn.x)+i.y*Math.abs(Vn.y)+i.z*Math.abs(Vn.z),l=e.dot(Vn),c=t.dot(Vn),f=n.dot(Vn);if(Math.max(-Math.max(l,c,f),Math.min(l,c,f))>a)return!1}return!0}var Mp=new _t,Wc=new b,Ya=new b,Ja=new b,Yt=class{constructor(e=new b,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Mp.setFromPoints(e).getCenter(n);let i=0;for(let s=0,o=e.length;s<o;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){Ja.subVectors(e,this.center);let t=Ja.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.add(Ja.multiplyScalar(i/n)),this.radius+=i}return this}union(e){return Ya.subVectors(e.center,this.center).normalize().multiplyScalar(e.radius),this.expandByPoint(Wc.copy(e.center).add(Ya)),this.expandByPoint(Wc.copy(e.center).sub(Ya)),this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},jt=new b,Za=new b,Kr=new b,vn=new b,$a=new b,eo=new b,ja=new b,Jt=class{constructor(e=new b,t=new b(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.direction).multiplyScalar(e).add(this.origin)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,jt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.direction).multiplyScalar(n).add(this.origin)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=jt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(jt.copy(this.direction).multiplyScalar(t).add(this.origin),jt.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Za.copy(e).add(t).multiplyScalar(.5),Kr.copy(t).sub(e).normalize(),vn.copy(this.origin).sub(Za);let s=e.distanceTo(t)*.5,o=-this.direction.dot(Kr),a=vn.dot(this.direction),l=-vn.dot(Kr),c=vn.lengthSq(),f=Math.abs(1-o*o),p,h,u,d;if(f>0)if(p=o*l-a,h=o*a-l,d=s*f,p>=0)if(h>=-d)if(h<=d){let m=1/f;p*=m,h*=m,u=p*(p+o*h+2*a)+h*(o*p+h+2*l)+c}else h=s,p=Math.max(0,-(o*h+a)),u=-p*p+h*(h+2*l)+c;else h=-s,p=Math.max(0,-(o*h+a)),u=-p*p+h*(h+2*l)+c;else h<=-d?(p=Math.max(0,-(-o*s+a)),h=p>0?-s:Math.min(Math.max(-s,-l),s),u=-p*p+h*(h+2*l)+c):h<=d?(p=0,h=Math.min(Math.max(-s,-l),s),u=h*(h+2*l)+c):(p=Math.max(0,-(o*s+a)),h=p>0?s:Math.min(Math.max(-s,-l),s),u=-p*p+h*(h+2*l)+c);else h=o>0?-s:s,p=Math.max(0,-(o*h+a)),u=-p*p+h*(h+2*l)+c;return n&&n.copy(this.direction).multiplyScalar(p).add(this.origin),i&&i.copy(Kr).multiplyScalar(h).add(Za),u}intersectSphere(e,t){jt.subVectors(e.center,this.origin);let n=jt.dot(this.direction),i=jt.dot(jt)-n*n,s=e.radius*e.radius;if(i>s)return null;let o=Math.sqrt(s-i),a=n-o,l=n+o;return a<0&&l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,o,a,l,c=1/this.direction.x,f=1/this.direction.y,p=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,i=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,i=(e.min.x-h.x)*c),f>=0?(s=(e.min.y-h.y)*f,o=(e.max.y-h.y)*f):(s=(e.max.y-h.y)*f,o=(e.min.y-h.y)*f),n>o||s>i||((s>n||n!==n)&&(n=s),(o<i||i!==i)&&(i=o),p>=0?(a=(e.min.z-h.z)*p,l=(e.max.z-h.z)*p):(a=(e.max.z-h.z)*p,l=(e.min.z-h.z)*p),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,jt)!==null}intersectTriangle(e,t,n,i,s){$a.subVectors(t,e),eo.subVectors(n,e),ja.crossVectors($a,eo);let o=this.direction.dot(ja),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;vn.subVectors(this.origin,e);let l=a*this.direction.dot(eo.crossVectors(vn,eo));if(l<0)return null;let c=a*this.direction.dot($a.cross(vn));if(c<0||l+c>o)return null;let f=-a*vn.dot(ja);return f<0?null:this.at(f/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},he=class r{constructor(){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],arguments.length>0&&console.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.")}set(e,t,n,i,s,o,a,l,c,f,p,h,u,d,m,y){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=i,g[1]=s,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=f,g[10]=p,g[14]=h,g[3]=u,g[7]=d,g[11]=m,g[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/Ci.setFromMatrixColumn(e,0).length(),s=1/Ci.setFromMatrixColumn(e,1).length(),o=1/Ci.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){e&&e.isEuler||console.error("THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");let t=this.elements,n=e.x,i=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),f=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){let h=o*f,u=o*p,d=a*f,m=a*p;t[0]=l*f,t[4]=-l*p,t[8]=c,t[1]=u+d*c,t[5]=h-m*c,t[9]=-a*l,t[2]=m-h*c,t[6]=d+u*c,t[10]=o*l}else if(e.order==="YXZ"){let h=l*f,u=l*p,d=c*f,m=c*p;t[0]=h+m*a,t[4]=d*a-u,t[8]=o*c,t[1]=o*p,t[5]=o*f,t[9]=-a,t[2]=u*a-d,t[6]=m+h*a,t[10]=o*l}else if(e.order==="ZXY"){let h=l*f,u=l*p,d=c*f,m=c*p;t[0]=h-m*a,t[4]=-o*p,t[8]=d+u*a,t[1]=u+d*a,t[5]=o*f,t[9]=m-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let h=o*f,u=o*p,d=a*f,m=a*p;t[0]=l*f,t[4]=d*c-u,t[8]=h*c+m,t[1]=l*p,t[5]=m*c+h,t[9]=u*c-d,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let h=o*l,u=o*c,d=a*l,m=a*c;t[0]=l*f,t[4]=m-h*p,t[8]=d*p+u,t[1]=p,t[5]=o*f,t[9]=-a*f,t[2]=-c*f,t[6]=u*p+d,t[10]=h-m*p}else if(e.order==="XZY"){let h=o*l,u=o*c,d=a*l,m=a*c;t[0]=l*f,t[4]=-p,t[8]=c*f,t[1]=h*p+m,t[5]=o*f,t[9]=u*p-d,t[2]=d*p-u,t[6]=a*f,t[10]=m*p+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(bp,e,Sp)}lookAt(e,t,n){let i=this.elements;return bt.subVectors(e,t),bt.lengthSq()===0&&(bt.z=1),bt.normalize(),_n.crossVectors(n,bt),_n.lengthSq()===0&&(Math.abs(n.z)===1?bt.x+=1e-4:bt.z+=1e-4,bt.normalize(),_n.crossVectors(n,bt)),_n.normalize(),to.crossVectors(bt,_n),i[0]=_n.x,i[4]=to.x,i[8]=bt.x,i[1]=_n.y,i[5]=to.y,i[9]=bt.y,i[2]=_n.z,i[6]=to.z,i[10]=bt.z,this}multiply(e,t){return t!==void 0?(console.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."),this.multiplyMatrices(e,t)):this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],f=n[1],p=n[5],h=n[9],u=n[13],d=n[2],m=n[6],y=n[10],g=n[14],x=n[3],_=n[7],v=n[11],M=n[15],T=i[0],w=i[4],C=i[8],I=i[12],L=i[1],R=i[5],W=i[9],D=i[13],F=i[2],U=i[6],z=i[10],B=i[14],Q=i[3],ce=i[7],ye=i[11],re=i[15];return s[0]=o*T+a*L+l*F+c*Q,s[4]=o*w+a*R+l*U+c*ce,s[8]=o*C+a*W+l*z+c*ye,s[12]=o*I+a*D+l*B+c*re,s[1]=f*T+p*L+h*F+u*Q,s[5]=f*w+p*R+h*U+u*ce,s[9]=f*C+p*W+h*z+u*ye,s[13]=f*I+p*D+h*B+u*re,s[2]=d*T+m*L+y*F+g*Q,s[6]=d*w+m*R+y*U+g*ce,s[10]=d*C+m*W+y*z+g*ye,s[14]=d*I+m*D+y*B+g*re,s[3]=x*T+_*L+v*F+M*Q,s[7]=x*w+_*R+v*U+M*ce,s[11]=x*C+_*W+v*z+M*ye,s[15]=x*I+_*D+v*B+M*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],f=e[2],p=e[6],h=e[10],u=e[14],d=e[3],m=e[7],y=e[11],g=e[15];return d*(+s*l*p-i*c*p-s*a*h+n*c*h+i*a*u-n*l*u)+m*(+t*l*u-t*c*h+s*o*h-i*o*u+i*c*f-s*l*f)+y*(+t*c*p-t*a*u-s*o*p+n*o*u+s*a*f-n*c*f)+g*(-i*a*f-t*l*p+t*a*h+i*o*p-n*o*h+n*l*f)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],f=e[8],p=e[9],h=e[10],u=e[11],d=e[12],m=e[13],y=e[14],g=e[15],x=p*y*c-m*h*c+m*l*u-a*y*u-p*l*g+a*h*g,_=d*h*c-f*y*c-d*l*u+o*y*u+f*l*g-o*h*g,v=f*m*c-d*p*c+d*a*u-o*m*u-f*a*g+o*p*g,M=d*p*l-f*m*l-d*a*h+o*m*h+f*a*y-o*p*y,T=t*x+n*_+i*v+s*M;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let w=1/T;return e[0]=x*w,e[1]=(m*h*s-p*y*s-m*i*u+n*y*u+p*i*g-n*h*g)*w,e[2]=(a*y*s-m*l*s+m*i*c-n*y*c-a*i*g+n*l*g)*w,e[3]=(p*l*s-a*h*s-p*i*c+n*h*c+a*i*u-n*l*u)*w,e[4]=_*w,e[5]=(f*y*s-d*h*s+d*i*u-t*y*u-f*i*g+t*h*g)*w,e[6]=(d*l*s-o*y*s-d*i*c+t*y*c+o*i*g-t*l*g)*w,e[7]=(o*h*s-f*l*s+f*i*c-t*h*c-o*i*u+t*l*u)*w,e[8]=v*w,e[9]=(d*p*s-f*m*s-d*n*u+t*m*u+f*n*g-t*p*g)*w,e[10]=(o*m*s-d*a*s+d*n*c-t*m*c-o*n*g+t*a*g)*w,e[11]=(f*a*s-o*p*s-f*n*c+t*p*c+o*n*u-t*a*u)*w,e[12]=M*w,e[13]=(f*m*i-d*p*i+d*n*h-t*m*h-f*n*y+t*p*y)*w,e[14]=(d*a*i-o*m*i-d*n*l+t*m*l+o*n*y-t*a*y)*w,e[15]=(o*p*i-f*a*i+f*n*l-t*p*l-o*n*h+t*a*h)*w,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,o=e.x,a=e.y,l=e.z,c=s*o,f=s*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,f*a+n,f*l-i*o,0,c*l-i*a,f*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,o){return this.set(1,n,s,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,f=o+o,p=a+a,h=s*c,u=s*f,d=s*p,m=o*f,y=o*p,g=a*p,x=l*c,_=l*f,v=l*p,M=n.x,T=n.y,w=n.z;return i[0]=(1-(m+g))*M,i[1]=(u+v)*M,i[2]=(d-_)*M,i[3]=0,i[4]=(u-v)*T,i[5]=(1-(h+g))*T,i[6]=(y+x)*T,i[7]=0,i[8]=(d+_)*w,i[9]=(y-x)*w,i[10]=(1-(h+m))*w,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,s=Ci.set(i[0],i[1],i[2]).length(),o=Ci.set(i[4],i[5],i[6]).length(),a=Ci.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],Nt.copy(this);let c=1/s,f=1/o,p=1/a;return Nt.elements[0]*=c,Nt.elements[1]*=c,Nt.elements[2]*=c,Nt.elements[4]*=f,Nt.elements[5]*=f,Nt.elements[6]*=f,Nt.elements[8]*=p,Nt.elements[9]*=p,Nt.elements[10]*=p,t.setFromRotationMatrix(Nt),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,i,s,o){o===void 0&&console.warn("THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.");let a=this.elements,l=2*s/(t-e),c=2*s/(n-i),f=(t+e)/(t-e),p=(n+i)/(n-i),h=-(o+s)/(o-s),u=-2*o*s/(o-s);return a[0]=l,a[4]=0,a[8]=f,a[12]=0,a[1]=0,a[5]=c,a[9]=p,a[13]=0,a[2]=0,a[6]=0,a[10]=h,a[14]=u,a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this}makeOrthographic(e,t,n,i,s,o){let a=this.elements,l=1/(t-e),c=1/(n-i),f=1/(o-s),p=(t+e)*l,h=(n+i)*c,u=(o+s)*f;return a[0]=2*l,a[4]=0,a[8]=0,a[12]=-p,a[1]=0,a[5]=2*c,a[9]=0,a[13]=-h,a[2]=0,a[6]=0,a[10]=-2*f,a[14]=-u,a[3]=0,a[7]=0,a[11]=0,a[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};he.prototype.isMatrix4=!0;var Ci=new b,Nt=new he,bp=new b(0,0,0),Sp=new b(1,1,1),_n=new b,to=new b,bt=new b,Xc=new he,qc=new rt,ri=class r{constructor(e=0,t=0,n=0,i=r.DefaultOrder){this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],o=i[4],a=i[8],l=i[1],c=i[5],f=i[9],p=i[2],h=i[6],u=i[10];switch(t){case"XYZ":this._y=Math.asin(ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-f,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ct(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(a,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(ct(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ct(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,c),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(a,u));break;case"XZY":this._z=Math.asin(-ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-f,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Xc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Xc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return qc.setFromEuler(this),this.setFromQuaternion(qc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}toVector3(e){return e?e.set(this._x,this._y,this._z):new b(this._x,this._y,this._z)}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}};ri.prototype.isEuler=!0;ri.DefaultOrder="XYZ";ri.RotationOrders=["XYZ","YZX","ZXY","XZY","YXZ","ZYX"];var js=class{constructor(){this.mask=1}set(e){this.mask=1<<e|0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}},Ep=0,Yc=new b,Ri=new rt,Qt=new he,no=new b,As=new b,Tp=new b,Ap=new rt,Jc=new b(1,0,0),Zc=new b(0,1,0),$c=new b(0,0,1),Cp={type:"added"},jc={type:"removed"},Ie=class r extends qt{constructor(){super(),Object.defineProperty(this,"id",{value:Ep++}),this.uuid=Et(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DefaultUp.clone();let e=new b,t=new ri,n=new rt,i=new b(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new he},normalMatrix:{value:new Ke}}),this.matrix=new he,this.matrixWorld=new he,this.matrixAutoUpdate=r.DefaultMatrixAutoUpdate,this.matrixWorldNeedsUpdate=!1,this.layers=new js,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ri.setFromAxisAngle(e,t),this.quaternion.multiply(Ri),this}rotateOnWorldAxis(e,t){return Ri.setFromAxisAngle(e,t),this.quaternion.premultiply(Ri),this}rotateX(e){return this.rotateOnAxis(Jc,e)}rotateY(e){return this.rotateOnAxis(Zc,e)}rotateZ(e){return this.rotateOnAxis($c,e)}translateOnAxis(e,t){return Yc.copy(e).applyQuaternion(this.quaternion),this.position.add(Yc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Jc,e)}translateY(e){return this.translateOnAxis(Zc,e)}translateZ(e){return this.translateOnAxis($c,e)}localToWorld(e){return e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return e.applyMatrix4(Qt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?no.copy(e):no.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),As.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Qt.lookAt(As,no,this.up):Qt.lookAt(no,As,this.up),this.quaternion.setFromRotationMatrix(Qt),i&&(Qt.extractRotation(i.matrixWorld),Ri.setFromRotationMatrix(Qt),this.quaternion.premultiply(Ri.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Cp)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jc)),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){let t=this.children[e];t.parent=null,t.dispatchEvent(jc)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),Qt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Qt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Qt),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,e,Tp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,Ap,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{}},n.metadata={version:4.5,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),JSON.stringify(this.userData)!=="{}"&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,f=l.length;c<f;c++){let p=l[c];s(e.shapes,p)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(s(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),f=o(e.images),p=o(e.shapes),h=o(e.skeletons),u=o(e.animations);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),f.length>0&&(n.images=f),p.length>0&&(n.shapes=p),h.length>0&&(n.skeletons=h),u.length>0&&(n.animations=u)}return n.object=i,n;function o(a){let l=[];for(let c in a){let f=a[c];delete f.metadata,l.push(f)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};Ie.DefaultUp=new b(0,1,0);Ie.DefaultMatrixAutoUpdate=!0;Ie.prototype.isObject3D=!0;var zt=new b,Kt=new b,Qa=new b,en=new b,Li=new b,Pi=new b,Qc=new b,Ka=new b,el=new b,tl=new b,dt=class r{constructor(e=new b,t=new b,n=new b){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),zt.subVectors(e,t),i.cross(zt);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){zt.subVectors(i,t),Kt.subVectors(n,t),Qa.subVectors(e,t);let o=zt.dot(zt),a=zt.dot(Kt),l=zt.dot(Qa),c=Kt.dot(Kt),f=Kt.dot(Qa),p=o*c-a*a;if(p===0)return s.set(-2,-1,-1);let h=1/p,u=(c*l-a*f)*h,d=(o*f-a*l)*h;return s.set(1-u-d,d,u)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,en),en.x>=0&&en.y>=0&&en.x+en.y<=1}static getUV(e,t,n,i,s,o,a,l){return this.getBarycoord(e,t,n,i,en),l.set(0,0),l.addScaledVector(s,en.x),l.addScaledVector(o,en.y),l.addScaledVector(a,en.z),l}static isFrontFacing(e,t,n,i){return zt.subVectors(n,t),Kt.subVectors(e,t),zt.cross(Kt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zt.subVectors(this.c,this.b),Kt.subVectors(this.a,this.b),zt.cross(Kt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,s){return r.getUV(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,o,a;Li.subVectors(i,n),Pi.subVectors(s,n),Ka.subVectors(e,n);let l=Li.dot(Ka),c=Pi.dot(Ka);if(l<=0&&c<=0)return t.copy(n);el.subVectors(e,i);let f=Li.dot(el),p=Pi.dot(el);if(f>=0&&p<=f)return t.copy(i);let h=l*p-f*c;if(h<=0&&l>=0&&f<=0)return o=l/(l-f),t.copy(n).addScaledVector(Li,o);tl.subVectors(e,s);let u=Li.dot(tl),d=Pi.dot(tl);if(d>=0&&u<=d)return t.copy(s);let m=u*c-l*d;if(m<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(Pi,a);let y=f*d-u*p;if(y<=0&&p-f>=0&&u-d>=0)return Qc.subVectors(s,i),a=(p-f)/(p-f+(u-d)),t.copy(i).addScaledVector(Qc,a);let g=1/(y+m+h);return o=m*g,a=h*g,t.copy(n).addScaledVector(Li,o).addScaledVector(Pi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Rp=0,nt=class extends qt{constructor(){super(),Object.defineProperty(this,"id",{value:Rp++}),this.uuid=Et(),this.name="",this.type="Material",this.fog=!0,this.blending=qi,this.side=ii,this.vertexColors=!1,this.opacity=1,this.format=ut,this.transparent=!1,this.blendSrc=yc,this.blendDst=vc,this.blendEquation=$n,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Ho,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Uo,this.stencilZFail=Uo,this.stencilZPass=Uo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn("THREE.Material: '"+t+"' parameter is undefined.");continue}if(t==="shading"){console.warn("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead."),this.flatShading=n===xc;continue}let i=this[t];if(i===void 0){console.warn("THREE."+this.type+": '"+t+"' is not a property of this material.");continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.5,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==qi&&(n.blending=this.blending),this.side!==ii&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.format!==ut&&(n.format=this.format),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),JSON.stringify(this.userData)!=="{}"&&(n.userData=this.userData);function i(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(t){let s=i(e.textures),o=i(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.fog=e.fog,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.format=e.format,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};nt.prototype.isMaterial=!0;var Wd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bt={h:0,s:0,l:0},io={h:0,s:0,l:0};function nl(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}function il(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function sl(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}var ne=class{constructor(e,t,n){return t===void 0&&n===void 0?this.set(e):this.setRGB(e,t,n)}set(e){return e&&e.isColor?this.copy(e):typeof e=="number"?this.setHex(e):typeof e=="string"&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,this}setRGB(e,t,n){return this.r=e,this.g=t,this.b=n,this}setHSL(e,t,n){if(e=Ec(e,1),t=ct(t,0,1),n=ct(n,0,1),t===0)this.r=this.g=this.b=n;else{let i=n<=.5?n*(1+t):n+t-n*t,s=2*n-i;this.r=nl(s,i,e+1/3),this.g=nl(s,i,e),this.b=nl(s,i,e-1/3)}return this}setStyle(e){function t(i){i!==void 0&&parseFloat(i)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(e)){let i,s=n[1],o=n[2];switch(s){case"rgb":case"rgba":if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(255,parseInt(i[1],10))/255,this.g=Math.min(255,parseInt(i[2],10))/255,this.b=Math.min(255,parseInt(i[3],10))/255,t(i[4]),this;if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(100,parseInt(i[1],10))/100,this.g=Math.min(100,parseInt(i[2],10))/100,this.b=Math.min(100,parseInt(i[3],10))/100,t(i[4]),this;break;case"hsl":case"hsla":if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)){let a=parseFloat(i[1])/360,l=parseInt(i[2],10)/100,c=parseInt(i[3],10)/100;return t(i[4]),this.setHSL(a,l,c)}break}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){let i=n[1],s=i.length;if(s===3)return this.r=parseInt(i.charAt(0)+i.charAt(0),16)/255,this.g=parseInt(i.charAt(1)+i.charAt(1),16)/255,this.b=parseInt(i.charAt(2)+i.charAt(2),16)/255,this;if(s===6)return this.r=parseInt(i.charAt(0)+i.charAt(1),16)/255,this.g=parseInt(i.charAt(2)+i.charAt(3),16)/255,this.b=parseInt(i.charAt(4)+i.charAt(5),16)/255,this}return e&&e.length>0?this.setColorName(e):this}setColorName(e){let t=Wd[e.toLowerCase()];return t!==void 0?this.setHex(t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copyGammaToLinear(e,t=2){return this.r=Math.pow(e.r,t),this.g=Math.pow(e.g,t),this.b=Math.pow(e.b,t),this}copyLinearToGamma(e,t=2){let n=t>0?1/t:1;return this.r=Math.pow(e.r,n),this.g=Math.pow(e.g,n),this.b=Math.pow(e.b,n),this}convertGammaToLinear(e){return this.copyGammaToLinear(this,e),this}convertLinearToGamma(e){return this.copyLinearToGamma(this,e),this}copySRGBToLinear(e){return this.r=il(e.r),this.g=il(e.g),this.b=il(e.b),this}copyLinearToSRGB(e){return this.r=sl(e.r),this.g=sl(e.g),this.b=sl(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(){return this.r*255<<16^this.g*255<<8^this.b*255<<0}getHexString(){return("000000"+this.getHex().toString(16)).slice(-6)}getHSL(e){let t=this.r,n=this.g,i=this.b,s=Math.max(t,n,i),o=Math.min(t,n,i),a,l,c=(o+s)/2;if(o===s)a=0,l=0;else{let f=s-o;switch(l=c<=.5?f/(s+o):f/(2-s-o),s){case t:a=(n-i)/f+(n<i?6:0);break;case n:a=(i-t)/f+2;break;case i:a=(t-n)/f+4;break}a/=6}return e.h=a,e.s=l,e.l=c,e}getStyle(){return"rgb("+(this.r*255|0)+","+(this.g*255|0)+","+(this.b*255|0)+")"}offsetHSL(e,t,n){return this.getHSL(Bt),Bt.h+=e,Bt.s+=t,Bt.l+=n,this.setHSL(Bt.h,Bt.s,Bt.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Bt),e.getHSL(io);let n=Bs(Bt.h,io.h,t),i=Bs(Bt.s,io.s,t),s=Bs(Bt.l,io.l,t);return this.setHSL(n,i,s),this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),e.normalized===!0&&(this.r/=255,this.g/=255,this.b/=255),this}toJSON(){return this.getHex()}};ne.NAMES=Wd;ne.prototype.isColor=!0;ne.prototype.r=1;ne.prototype.g=1;ne.prototype.b=1;var Ut=class extends nt{constructor(e){super(),this.type="MeshBasicMaterial",this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Wr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this}};Ut.prototype.isMeshBasicMaterial=!0;var Ge=new b,so=new X,Pe=class{constructor(e,t,n){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n===!0,this.usage=$i,this.updateRange={offset:0,count:-1},this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}copyColorsArray(e){let t=this.array,n=0;for(let i=0,s=e.length;i<s;i++){let o=e[i];o===void 0&&(console.warn("THREE.BufferAttribute.copyColorsArray(): color is undefined",i),o=new ne),t[n++]=o.r,t[n++]=o.g,t[n++]=o.b}return this}copyVector2sArray(e){let t=this.array,n=0;for(let i=0,s=e.length;i<s;i++){let o=e[i];o===void 0&&(console.warn("THREE.BufferAttribute.copyVector2sArray(): vector is undefined",i),o=new X),t[n++]=o.x,t[n++]=o.y}return this}copyVector3sArray(e){let t=this.array,n=0;for(let i=0,s=e.length;i<s;i++){let o=e[i];o===void 0&&(console.warn("THREE.BufferAttribute.copyVector3sArray(): vector is undefined",i),o=new b),t[n++]=o.x,t[n++]=o.y,t[n++]=o.z}return this}copyVector4sArray(e){let t=this.array,n=0;for(let i=0,s=e.length;i<s;i++){let o=e[i];o===void 0&&(console.warn("THREE.BufferAttribute.copyVector4sArray(): vector is undefined",i),o=new Be),t[n++]=o.x,t[n++]=o.y,t[n++]=o.z,t[n++]=o.w}return this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)so.fromBufferAttribute(this,t),so.applyMatrix3(e),this.setXY(t,so.x,so.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ge.fromBufferAttribute(this,t),Ge.applyMatrix3(e),this.setXYZ(t,Ge.x,Ge.y,Ge.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ge.x=this.getX(t),Ge.y=this.getY(t),Ge.z=this.getZ(t),Ge.applyMatrix4(e),this.setXYZ(t,Ge.x,Ge.y,Ge.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ge.x=this.getX(t),Ge.y=this.getY(t),Ge.z=this.getZ(t),Ge.applyNormalMatrix(e),this.setXYZ(t,Ge.x,Ge.y,Ge.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ge.x=this.getX(t),Ge.y=this.getY(t),Ge.z=this.getZ(t),Ge.transformDirection(e),this.setXYZ(t,Ge.x,Ge.y,Ge.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){return this.array[e*this.itemSize]}setX(e,t){return this.array[e*this.itemSize]=t,this}getY(e){return this.array[e*this.itemSize+1]}setY(e,t){return this.array[e*this.itemSize+1]=t,this}getZ(e){return this.array[e*this.itemSize+2]}setZ(e,t){return this.array[e*this.itemSize+2]=t,this}getW(e){return this.array[e*this.itemSize+3]}setW(e,t){return this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.prototype.slice.call(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==$i&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}};Pe.prototype.isBufferAttribute=!0;var Wo=class extends Pe{constructor(e,t,n){super(new Int8Array(e),t,n)}},Xo=class extends Pe{constructor(e,t,n){super(new Uint8Array(e),t,n)}},qo=class extends Pe{constructor(e,t,n){super(new Uint8ClampedArray(e),t,n)}},Yo=class extends Pe{constructor(e,t,n){super(new Int16Array(e),t,n)}},Qi=class extends Pe{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Jo=class extends Pe{constructor(e,t,n){super(new Int32Array(e),t,n)}},Ki=class extends Pe{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Zo=class extends Pe{constructor(e,t,n){super(new Uint16Array(e),t,n)}};Zo.prototype.isFloat16BufferAttribute=!0;var le=class extends Pe{constructor(e,t,n){super(new Float32Array(e),t,n)}},$o=class extends Pe{constructor(e,t,n){super(new Float64Array(e),t,n)}},Lp=0,Rt=new he,rl=new Ie,Ii=new b,St=new _t,Cs=new _t,ot=new b,_e=class r extends qt{constructor(){super(),Object.defineProperty(this,"id",{value:Lp++}),this.uuid=Et(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Vd(e)>65535?Ki:Qi)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Ke().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Rt.makeRotationFromQuaternion(e),this.applyMatrix4(Rt),this}rotateX(e){return Rt.makeRotationX(e),this.applyMatrix4(Rt),this}rotateY(e){return Rt.makeRotationY(e),this.applyMatrix4(Rt),this}rotateZ(e){return Rt.makeRotationZ(e),this.applyMatrix4(Rt),this}translate(e,t,n){return Rt.makeTranslation(e,t,n),this.applyMatrix4(Rt),this}scale(e,t,n){return Rt.makeScale(e,t,n),this.applyMatrix4(Rt),this}lookAt(e){return rl.lookAt(e),rl.updateMatrix(),this.applyMatrix4(rl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ii).negate(),this.translate(Ii.x,Ii.y,Ii.z),this}setFromPoints(e){let t=[];for(let n=0,i=e.length;n<i;n++){let s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new le(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _t);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new b(-1/0,-1/0,-1/0),new b(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];St.setFromBufferAttribute(s),this.morphTargetsRelative?(ot.addVectors(this.boundingBox.min,St.min),this.boundingBox.expandByPoint(ot),ot.addVectors(this.boundingBox.max,St.max),this.boundingBox.expandByPoint(ot)):(this.boundingBox.expandByPoint(St.min),this.boundingBox.expandByPoint(St.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Yt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new b,1/0);return}if(e){let n=this.boundingSphere.center;if(St.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Cs.setFromBufferAttribute(a),this.morphTargetsRelative?(ot.addVectors(St.min,Cs.min),St.expandByPoint(ot),ot.addVectors(St.max,Cs.max),St.expandByPoint(ot)):(St.expandByPoint(Cs.min),St.expandByPoint(Cs.max))}St.getCenter(n);let i=0;for(let s=0,o=e.count;s<o;s++)ot.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(ot));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],l=this.morphTargetsRelative;for(let c=0,f=a.count;c<f;c++)ot.fromBufferAttribute(a,c),l&&(Ii.fromBufferAttribute(e,c),ot.add(Ii)),i=Math.max(i,n.distanceToSquared(ot))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.array,i=t.position.array,s=t.normal.array,o=t.uv.array,a=i.length/3;t.tangent===void 0&&this.setAttribute("tangent",new Pe(new Float32Array(4*a),4));let l=t.tangent.array,c=[],f=[];for(let L=0;L<a;L++)c[L]=new b,f[L]=new b;let p=new b,h=new b,u=new b,d=new X,m=new X,y=new X,g=new b,x=new b;function _(L,R,W){p.fromArray(i,L*3),h.fromArray(i,R*3),u.fromArray(i,W*3),d.fromArray(o,L*2),m.fromArray(o,R*2),y.fromArray(o,W*2),h.sub(p),u.sub(p),m.sub(d),y.sub(d);let D=1/(m.x*y.y-y.x*m.y);isFinite(D)&&(g.copy(h).multiplyScalar(y.y).addScaledVector(u,-m.y).multiplyScalar(D),x.copy(u).multiplyScalar(m.x).addScaledVector(h,-y.x).multiplyScalar(D),c[L].add(g),c[R].add(g),c[W].add(g),f[L].add(x),f[R].add(x),f[W].add(x))}let v=this.groups;v.length===0&&(v=[{start:0,count:n.length}]);for(let L=0,R=v.length;L<R;++L){let W=v[L],D=W.start,F=W.count;for(let U=D,z=D+F;U<z;U+=3)_(n[U+0],n[U+1],n[U+2])}let M=new b,T=new b,w=new b,C=new b;function I(L){w.fromArray(s,L*3),C.copy(w);let R=c[L];M.copy(R),M.sub(w.multiplyScalar(w.dot(R))).normalize(),T.crossVectors(C,R);let D=T.dot(f[L])<0?-1:1;l[L*4]=M.x,l[L*4+1]=M.y,l[L*4+2]=M.z,l[L*4+3]=D}for(let L=0,R=v.length;L<R;++L){let W=v[L],D=W.start,F=W.count;for(let U=D,z=D+F;U<z;U+=3)I(n[U+0]),I(n[U+1]),I(n[U+2])}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Pe(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,u=n.count;h<u;h++)n.setXYZ(h,0,0,0);let i=new b,s=new b,o=new b,a=new b,l=new b,c=new b,f=new b,p=new b;if(e)for(let h=0,u=e.count;h<u;h+=3){let d=e.getX(h+0),m=e.getX(h+1),y=e.getX(h+2);i.fromBufferAttribute(t,d),s.fromBufferAttribute(t,m),o.fromBufferAttribute(t,y),f.subVectors(o,s),p.subVectors(i,s),f.cross(p),a.fromBufferAttribute(n,d),l.fromBufferAttribute(n,m),c.fromBufferAttribute(n,y),a.add(f),l.add(f),c.add(f),n.setXYZ(d,a.x,a.y,a.z),n.setXYZ(m,l.x,l.y,l.z),n.setXYZ(y,c.x,c.y,c.z)}else for(let h=0,u=t.count;h<u;h+=3)i.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),f.subVectors(o,s),p.subVectors(i,s),f.cross(p),n.setXYZ(h+0,f.x,f.y,f.z),n.setXYZ(h+1,f.x,f.y,f.z),n.setXYZ(h+2,f.x,f.y,f.z);this.normalizeNormals(),n.needsUpdate=!0}}merge(e,t){if(!(e&&e.isBufferGeometry)){console.error("THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.",e);return}t===void 0&&(t=0,console.warn("THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge."));let n=this.attributes;for(let i in n){if(e.attributes[i]===void 0)continue;let o=n[i].array,a=e.attributes[i],l=a.array,c=a.itemSize*t,f=Math.min(l.length,o.length-c);for(let p=0,h=c;p<f;p++,h++)o[h]=l[p]}return this}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ot.fromBufferAttribute(e,t),ot.normalize(),e.setXYZ(t,ot.x,ot.y,ot.z)}toNonIndexed(){function e(a,l){let c=a.array,f=a.itemSize,p=a.normalized,h=new c.constructor(l.length*f),u=0,d=0;for(let m=0,y=l.length;m<y;m++){a.isInterleavedBufferAttribute?u=l[m]*a.data.stride+a.offset:u=l[m]*f;for(let g=0;g<f;g++)h[d++]=c[u++]}return new Pe(h,f,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=e(l,n);t.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let f=0,p=c.length;f<p;f++){let h=c[f],u=e(h,n);l.push(u)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.5,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],f=[];for(let p=0,h=c.length;p<h;p++){let u=c[p];f.push(u.toJSON(e.data))}f.length>0&&(i[l]=f,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let i=e.attributes;for(let c in i){let f=i[c];this.setAttribute(c,f.clone(t))}let s=e.morphAttributes;for(let c in s){let f=[],p=s[c];for(let h=0,u=p.length;h<u;h++)f.push(p[h].clone(t));this.morphAttributes[c]=f}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,f=o.length;c<f;c++){let p=o[c];this.addGroup(p.start,p.count,p.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,e.parameters!==void 0&&(this.parameters=Object.assign({},e.parameters)),this}dispose(){this.dispatchEvent({type:"dispose"})}};_e.prototype.isBufferGeometry=!0;var Kc=new he,Di=new Jt,ol=new Yt,wn=new b,Mn=new b,bn=new b,al=new b,ll=new b,cl=new b,ro=new b,oo=new b,ao=new b,lo=new X,co=new X,ho=new X,hl=new b,uo=new b,Je=class extends Ie{constructor(e=new _e,t=new Ut){super(),this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry;if(e.isBufferGeometry){let t=e.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}else{let t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Mesh.updateMorphTargets() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;if(i===void 0||(n.boundingSphere===null&&n.computeBoundingSphere(),ol.copy(n.boundingSphere),ol.applyMatrix4(s),e.ray.intersectsSphere(ol)===!1)||(Kc.copy(s).invert(),Di.copy(e.ray).applyMatrix4(Kc),n.boundingBox!==null&&Di.intersectsBox(n.boundingBox)===!1))return;let o;if(n.isBufferGeometry){let a=n.index,l=n.attributes.position,c=n.morphAttributes.position,f=n.morphTargetsRelative,p=n.attributes.uv,h=n.attributes.uv2,u=n.groups,d=n.drawRange;if(a!==null)if(Array.isArray(i))for(let m=0,y=u.length;m<y;m++){let g=u[m],x=i[g.materialIndex],_=Math.max(g.start,d.start),v=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let M=_,T=v;M<T;M+=3){let w=a.getX(M),C=a.getX(M+1),I=a.getX(M+2);o=fo(this,x,e,Di,l,c,f,p,h,w,C,I),o&&(o.faceIndex=Math.floor(M/3),o.face.materialIndex=g.materialIndex,t.push(o))}}else{let m=Math.max(0,d.start),y=Math.min(a.count,d.start+d.count);for(let g=m,x=y;g<x;g+=3){let _=a.getX(g),v=a.getX(g+1),M=a.getX(g+2);o=fo(this,i,e,Di,l,c,f,p,h,_,v,M),o&&(o.faceIndex=Math.floor(g/3),t.push(o))}}else if(l!==void 0)if(Array.isArray(i))for(let m=0,y=u.length;m<y;m++){let g=u[m],x=i[g.materialIndex],_=Math.max(g.start,d.start),v=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let M=_,T=v;M<T;M+=3){let w=M,C=M+1,I=M+2;o=fo(this,x,e,Di,l,c,f,p,h,w,C,I),o&&(o.faceIndex=Math.floor(M/3),o.face.materialIndex=g.materialIndex,t.push(o))}}else{let m=Math.max(0,d.start),y=Math.min(l.count,d.start+d.count);for(let g=m,x=y;g<x;g+=3){let _=g,v=g+1,M=g+2;o=fo(this,i,e,Di,l,c,f,p,h,_,v,M),o&&(o.faceIndex=Math.floor(g/3),t.push(o))}}}else n.isGeometry&&console.error("THREE.Mesh.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}};Je.prototype.isMesh=!0;function Pp(r,e,t,n,i,s,o,a){let l;if(e.side===Qe?l=n.intersectTriangle(o,s,i,!0,a):l=n.intersectTriangle(i,s,o,e.side!==si,a),l===null)return null;uo.copy(a),uo.applyMatrix4(r.matrixWorld);let c=t.ray.origin.distanceTo(uo);return c<t.near||c>t.far?null:{distance:c,point:uo.clone(),object:r}}function fo(r,e,t,n,i,s,o,a,l,c,f,p){wn.fromBufferAttribute(i,c),Mn.fromBufferAttribute(i,f),bn.fromBufferAttribute(i,p);let h=r.morphTargetInfluences;if(s&&h){ro.set(0,0,0),oo.set(0,0,0),ao.set(0,0,0);for(let d=0,m=s.length;d<m;d++){let y=h[d],g=s[d];y!==0&&(al.fromBufferAttribute(g,c),ll.fromBufferAttribute(g,f),cl.fromBufferAttribute(g,p),o?(ro.addScaledVector(al,y),oo.addScaledVector(ll,y),ao.addScaledVector(cl,y)):(ro.addScaledVector(al.sub(wn),y),oo.addScaledVector(ll.sub(Mn),y),ao.addScaledVector(cl.sub(bn),y)))}wn.add(ro),Mn.add(oo),bn.add(ao)}r.isSkinnedMesh&&(r.boneTransform(c,wn),r.boneTransform(f,Mn),r.boneTransform(p,bn));let u=Pp(r,e,t,n,wn,Mn,bn,hl);if(u){a&&(lo.fromBufferAttribute(a,c),co.fromBufferAttribute(a,f),ho.fromBufferAttribute(a,p),u.uv=dt.getUV(hl,wn,Mn,bn,lo,co,ho,new X)),l&&(lo.fromBufferAttribute(l,c),co.fromBufferAttribute(l,f),ho.fromBufferAttribute(l,p),u.uv2=dt.getUV(hl,wn,Mn,bn,lo,co,ho,new X));let d={a:c,b:f,c:p,normal:new b,materialIndex:0};dt.getNormal(wn,Mn,bn,d.normal),u.face=d}return u}var Cn=class r extends _e{constructor(e=1,t=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};let a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],f=[],p=[],h=0,u=0;d("z","y","x",-1,-1,n,t,e,o,s,0),d("z","y","x",1,-1,n,t,-e,o,s,1),d("x","z","y",1,1,e,n,t,i,o,2),d("x","z","y",1,-1,e,n,-t,i,o,3),d("x","y","z",1,-1,e,t,n,i,s,4),d("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new le(c,3)),this.setAttribute("normal",new le(f,3)),this.setAttribute("uv",new le(p,2));function d(m,y,g,x,_,v,M,T,w,C,I){let L=v/w,R=M/C,W=v/2,D=M/2,F=T/2,U=w+1,z=C+1,B=0,Q=0,ce=new b;for(let ye=0;ye<z;ye++){let re=ye*R-D;for(let Te=0;Te<U;Te++){let J=Te*L-W;ce[m]=J*x,ce[y]=re*_,ce[g]=F,c.push(ce.x,ce.y,ce.z),ce[m]=0,ce[y]=0,ce[g]=T>0?1:-1,f.push(ce.x,ce.y,ce.z),p.push(Te/w),p.push(1-ye/C),B+=1}}for(let ye=0;ye<C;ye++)for(let re=0;re<w;re++){let Te=h+re+U*ye,J=h+re+U*(ye+1),K=h+(re+1)+U*(ye+1),de=h+(re+1)+U*ye;l.push(Te,J,de),l.push(J,K,de),Q+=6}a.addGroup(u,Q,I),u+=Q,h+=B}}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function es(r){let e={};for(let t in r){e[t]={};for(let n in r[t]){let i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function xt(r){let e={};for(let t=0;t<r.length;t++){let n=es(r[t]);for(let i in n)e[i]=n[i]}return e}var Xd={clone:es,merge:xt},Ip=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Dp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ht=class extends nt{constructor(e){super(),this.type="ShaderMaterial",this.defines={},this.uniforms={},this.vertexShader=Ip,this.fragmentShader=Dp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&(e.attributes!==void 0&&console.error("THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead."),this.setValues(e))}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=es(e.uniforms),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}};Ht.prototype.isShaderMaterial=!0;var oi=class extends Ie{constructor(){super(),this.type="Camera",this.matrixWorldInverse=new he,this.projectionMatrix=new he,this.projectionMatrixInverse=new he}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}};oi.prototype.isCamera=!0;var et=class extends oi{constructor(e=50,t=1,n=.1,i=2e3){super(),this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Zs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ni*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Zs*2*Math.atan(Math.tan(ni*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ni*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};et.prototype.isPerspectiveCamera=!0;var Fi=90,Ni=1,ts=class extends Ie{constructor(e,t,n){if(super(),this.type="CubeCamera",n.isWebGLCubeRenderTarget!==!0){console.error("THREE.CubeCamera: The constructor now expects an instance of WebGLCubeRenderTarget as third parameter.");return}this.renderTarget=n;let i=new et(Fi,Ni,e,t);i.layers=this.layers,i.up.set(0,-1,0),i.lookAt(new b(1,0,0)),this.add(i);let s=new et(Fi,Ni,e,t);s.layers=this.layers,s.up.set(0,-1,0),s.lookAt(new b(-1,0,0)),this.add(s);let o=new et(Fi,Ni,e,t);o.layers=this.layers,o.up.set(0,0,1),o.lookAt(new b(0,1,0)),this.add(o);let a=new et(Fi,Ni,e,t);a.layers=this.layers,a.up.set(0,0,-1),a.lookAt(new b(0,-1,0)),this.add(a);let l=new et(Fi,Ni,e,t);l.layers=this.layers,l.up.set(0,-1,0),l.lookAt(new b(0,0,1)),this.add(l);let c=new et(Fi,Ni,e,t);c.layers=this.layers,c.up.set(0,-1,0),c.lookAt(new b(0,0,-1)),this.add(c)}update(e,t){this.parent===null&&this.updateMatrixWorld();let n=this.renderTarget,[i,s,o,a,l,c]=this.children,f=e.xr.enabled,p=e.getRenderTarget();e.xr.enabled=!1;let h=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0),e.render(t,i),e.setRenderTarget(n,1),e.render(t,s),e.setRenderTarget(n,2),e.render(t,o),e.setRenderTarget(n,3),e.render(t,a),e.setRenderTarget(n,4),e.render(t,l),n.texture.generateMipmaps=h,e.setRenderTarget(n,5),e.render(t,c),e.setRenderTarget(p),e.xr.enabled=f}},Rn=class extends at{constructor(e,t,n,i,s,o,a,l,c,f){e=e!==void 0?e:[],t=t!==void 0?t:_i,super(e,t,n,i,s,o,a,l,c,f),this.flipY=!1}get images(){return this.image}set images(e){this.image=e}};Rn.prototype.isCubeTexture=!0;var ns=class extends Tt{constructor(e,t,n){Number.isInteger(t)&&(console.warn("THREE.WebGLCubeRenderTarget: constructor signature is now WebGLCubeRenderTarget( size, options )"),t=n),super(e,e,t),t=t||{},this.texture=new Rn(void 0,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.encoding),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:st,this.texture._needsFlipEnvMap=!1}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.format=ut,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Cn(5,5,5),s=new Ht({name:"CubemapFromEquirect",uniforms:es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Qe,blending:sn});s.uniforms.tEquirect.value=t;let o=new Je(i,s),a=t.minFilter;return t.minFilter===Mi&&(t.minFilter=st),new ts(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(s)}};ns.prototype.isWebGLCubeRenderTarget=!0;var ul=new b,Fp=new b,Np=new Ke,Lt=class{constructor(e=new b(1,0,0),t=0){this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=ul.subVectors(n,t).cross(Fp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}intersectLine(e,t){let n=e.delta(ul),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(n).multiplyScalar(s).add(e.start)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Np.getNormalMatrix(e),i=this.coplanarPoint(ul).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}};Lt.prototype.isPlane=!0;var zi=new Yt,po=new b,ai=class{constructor(e=new Lt,t=new Lt,n=new Lt,i=new Lt,s=new Lt,o=new Lt){this.planes=[e,t,n,i,s,o]}set(e,t,n,i,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e){let t=this.planes,n=e.elements,i=n[0],s=n[1],o=n[2],a=n[3],l=n[4],c=n[5],f=n[6],p=n[7],h=n[8],u=n[9],d=n[10],m=n[11],y=n[12],g=n[13],x=n[14],_=n[15];return t[0].setComponents(a-i,p-l,m-h,_-y).normalize(),t[1].setComponents(a+i,p+l,m+h,_+y).normalize(),t[2].setComponents(a+s,p+c,m+u,_+g).normalize(),t[3].setComponents(a-s,p-c,m-u,_-g).normalize(),t[4].setComponents(a-o,p-f,m-d,_-x).normalize(),t[5].setComponents(a+o,p+f,m+d,_+x).normalize(),this}intersectsObject(e){let t=e.geometry;return t.boundingSphere===null&&t.computeBoundingSphere(),zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),this.intersectsSphere(zi)}intersectsSprite(e){return zi.center.set(0,0,0),zi.radius=.7071067811865476,zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(zi)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(po.x=i.normal.x>0?e.max.x:e.min.x,po.y=i.normal.y>0?e.max.y:e.min.y,po.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(po)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function qd(){let r=null,e=!1,t=null,n=null;function i(s,o){t(s,o),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function zp(r,e){let t=e.isWebGL2,n=new WeakMap;function i(c,f){let p=c.array,h=c.usage,u=r.createBuffer();r.bindBuffer(f,u),r.bufferData(f,p,h),c.onUploadCallback();let d=5126;return p instanceof Float32Array?d=5126:p instanceof Float64Array?console.warn("THREE.WebGLAttributes: Unsupported data buffer format: Float64Array."):p instanceof Uint16Array?c.isFloat16BufferAttribute?t?d=5131:console.warn("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2."):d=5123:p instanceof Int16Array?d=5122:p instanceof Uint32Array?d=5125:p instanceof Int32Array?d=5124:p instanceof Int8Array?d=5120:(p instanceof Uint8Array||p instanceof Uint8ClampedArray)&&(d=5121),{buffer:u,type:d,bytesPerElement:p.BYTES_PER_ELEMENT,version:c.version}}function s(c,f,p){let h=f.array,u=f.updateRange;r.bindBuffer(p,c),u.count===-1?r.bufferSubData(p,0,h):(t?r.bufferSubData(p,u.offset*h.BYTES_PER_ELEMENT,h,u.offset,u.count):r.bufferSubData(p,u.offset*h.BYTES_PER_ELEMENT,h.subarray(u.offset,u.offset+u.count)),u.count=-1)}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);let f=n.get(c);f&&(r.deleteBuffer(f.buffer),n.delete(c))}function l(c,f){if(c.isGLBufferAttribute){let h=n.get(c);(!h||h.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let p=n.get(c);p===void 0?n.set(c,i(c,f)):p.version<c.version&&(s(p.buffer,c,f),p.version=c.version)}return{get:o,remove:a,update:l}}var is=class r extends _e{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,f=l+1,p=e/a,h=t/l,u=[],d=[],m=[],y=[];for(let g=0;g<f;g++){let x=g*h-o;for(let _=0;_<c;_++){let v=_*p-s;d.push(v,-x,0),m.push(0,0,1),y.push(_/a),y.push(1-g/l)}}for(let g=0;g<l;g++)for(let x=0;x<a;x++){let _=x+c*g,v=x+c*(g+1),M=x+1+c*(g+1),T=x+1+c*g;u.push(_,v,T),u.push(v,M,T)}this.setIndex(u),this.setAttribute("position",new le(d,3)),this.setAttribute("normal",new le(m,3)),this.setAttribute("uv",new le(y,2))}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},Bp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif`,Op=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Up=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Hp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,kp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vp="vec3 transformed = vec3( position );",Wp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xp=`vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 f0, const in float f90, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif`,qp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vUv );
		vec2 dSTdy = dFdy( vUv );
		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );
		vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Yp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Jp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Zp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,$p=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Qp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Kp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,em=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,tm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float linearToRelativeLuminance( const in vec3 color ) {
	vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
	return dot( weights, color.rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}`,nm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_maxMipLevel 8.0
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_maxTileSize 256.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		float texelSize = 1.0 / ( 3.0 * cubeUV_maxTileSize );
		vec2 uv = getUV( direction, face ) * ( faceSize - 1.0 );
		vec2 f = fract( uv );
		uv += 0.5 - f;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		if ( mipInt < cubeUV_maxMipLevel ) {
			uv.y += 2.0 * cubeUV_maxTileSize;
		}
		uv.y += filterInt * 2.0 * cubeUV_minTileSize;
		uv.x += 3.0 * max( 0.0, cubeUV_maxTileSize - 2.0 * faceSize );
		uv *= texelSize;
		vec3 tl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.x += texelSize;
		vec3 tr = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.y += texelSize;
		vec3 br = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.x -= texelSize;
		vec3 bl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		vec3 tm = mix( tl, tr, f.x );
		vec3 bm = mix( bl, br, f.x );
		return mix( tm, bm, f.y );
	}
	#define r0 1.0
	#define v0 0.339
	#define m0 - 2.0
	#define r1 0.8
	#define v1 0.276
	#define m1 - 1.0
	#define r4 0.4
	#define v4 0.046
	#define m4 2.0
	#define r5 0.305
	#define v5 0.016
	#define m5 3.0
	#define r6 0.21
	#define v6 0.0038
	#define m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= r1 ) {
			mip = ( r0 - roughness ) * ( m1 - m0 ) / ( r0 - r1 ) + m0;
		} else if ( roughness >= r4 ) {
			mip = ( r1 - roughness ) * ( m4 - m1 ) / ( r1 - r4 ) + m1;
		} else if ( roughness >= r5 ) {
			mip = ( r4 - roughness ) * ( m5 - m4 ) / ( r4 - r5 ) + m4;
		} else if ( roughness >= r6 ) {
			mip = ( r5 - roughness ) * ( m6 - m5 ) / ( r5 - r6 ) + m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), m0, cubeUV_maxMipLevel );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,im=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,sm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,rm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
#endif`,om=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,am=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lm="gl_FragColor = linearToOutputTexel( gl_FragColor );",cm=`
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( gammaFactor ) ), value.a );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( 1.0 / gammaFactor ) ), value.a );
}
vec4 sRGBToLinear( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 RGBEToLinear( in vec4 value ) {
	return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
	float maxComponent = max( max( value.r, value.g ), value.b );
	float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
	return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * value.a * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float M = clamp( maxRGB / maxRange, 0.0, 1.0 );
	M = ceil( M * 255.0 ) / 255.0;
	return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float D = max( maxRange / maxRGB, 1.0 );
	D = clamp( floor( D ) / 255.0, 0.0, 1.0 );
	return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );
vec4 LinearToLogLuv( in vec4 value ) {
	vec3 Xp_Y_XYZp = cLogLuvM * value.rgb;
	Xp_Y_XYZp = max( Xp_Y_XYZp, vec3( 1e-6, 1e-6, 1e-6 ) );
	vec4 vResult;
	vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;
	float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;
	vResult.w = fract( Le );
	vResult.z = ( Le - ( floor( vResult.w * 255.0 ) ) / 255.0 ) / 255.0;
	return vResult;
}
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );
vec4 LogLuvToLinear( in vec4 value ) {
	float Le = value.z * 255.0 + value.w;
	vec3 Xp_Y_XYZp;
	Xp_Y_XYZp.y = exp2( ( Le - 127.0 ) / 2.0 );
	Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;
	Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;
	vec3 vRGB = cLogLuvInverseM * Xp_Y_XYZp.rgb;
	return vec4( max( vRGB, 0.0 ), 1.0 );
}`,hm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		envColor = envMapTexelToLinear( envColor );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 envColor = textureCubeUV( envMap, reflectVec, 0.0 );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,um=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform int maxMipLevel;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,dm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,fm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) ||defined( PHONG )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,mm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,xm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ym=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,vm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return texture2D( gradientMap, coord ).rgb;
	#else
		return ( coord.x < 0.7 ) ? vec3( 0.7 ) : vec3( 1.0 );
	#endif
}`,_m=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vUv2 );
	vec3 lightMapIrradiance = lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		lightMapIrradiance *= PI;
	#endif
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,wm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Mm=`vec3 diffuse = vec3( 1.0 );
GeometricContext geometry;
geometry.position = mvPosition.xyz;
geometry.normal = normalize( transformedNormal );
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( -mvPosition.xyz );
GeometricContext backGeometry;
backGeometry.position = geometry.position;
backGeometry.normal = -geometry.normal;
backGeometry.viewDir = geometry.viewDir;
vLightFront = vec3( 0.0 );
vIndirectFront = vec3( 0.0 );
#ifdef DOUBLE_SIDED
	vLightBack = vec3( 0.0 );
	vIndirectBack = vec3( 0.0 );
#endif
IncidentLight directLight;
float dotNL;
vec3 directLightColor_Diffuse;
vIndirectFront += getAmbientLightIrradiance( ambientLightColor );
vIndirectFront += getLightProbeIrradiance( lightProbe, geometry.normal );
#ifdef DOUBLE_SIDED
	vIndirectBack += getAmbientLightIrradiance( ambientLightColor );
	vIndirectBack += getLightProbeIrradiance( lightProbe, backGeometry.normal );
#endif
#if NUM_POINT_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		getPointLightInfo( pointLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_SPOT_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		getSpotLightInfo( spotLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_DIR_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		getDirectionalLightInfo( directionalLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_HEMI_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
		vIndirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
		#ifdef DOUBLE_SIDED
			vIndirectBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry.normal );
		#endif
	}
	#pragma unroll_loop_end
#endif`,bm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( PHYSICALLY_CORRECT_LIGHTS )
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#else
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometry.position;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometry.position;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Sm=`#if defined( USE_ENVMAP )
	#ifdef ENVMAP_MODE_REFRACTION
		uniform float refractionRatio;
	#endif
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 reflectVec;
			#ifdef ENVMAP_MODE_REFLECTION
				reflectVec = reflect( - viewDir, normal );
				reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			#else
				reflectVec = refract( - viewDir, normal, refractionRatio );
			#endif
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
#endif`,Em=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Tm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon
#define Material_LightProbeLOD( material )	(0)`,Am=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Cm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
#define Material_LightProbeLOD( material )	(0)`,Rm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	#ifdef SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULARINTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vUv ).a;
		#endif
		#ifdef USE_SPECULARCOLORMAP
			specularColorFactor *= specularColorMapTexelToLinear( texture2D( specularColorMap, vUv ) ).rgb;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( ior - 1.0 ) / ( ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEENCOLORMAP
		material.sheenColor *= sheenColorMapTexelToLinear( texture2D( sheenColorMap, vUv ) ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEENROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vUv ).a;
	#endif
#endif`,Lm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
};
vec3 clearcoatSpecular = vec3( 0.0 );
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	vec3 FssEss = specularColor * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = specularColor + ( 1.0 - specularColor ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecular += ccIrradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		reflectedLight.directSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.roughness );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	vec3 diffuse = material.diffuseColor * ( 1.0 - ( singleScattering + multiScattering ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Pm=`
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef USE_CLEARCOAT
	geometry.clearcoatNormal = clearcoatNormal;
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Im=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vUv2 );
		vec3 lightMapIrradiance = lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			lightMapIrradiance *= PI;
		#endif
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometry.normal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	radiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Dm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,Fm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Nm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Bm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Om=`#ifdef USE_MAP
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;
#endif`,Um=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Hm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#ifdef USE_MAP
	vec4 mapTexel = texture2D( map, uv );
	diffuseColor *= mapTexelToLinear( mapTexel );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Gm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	uniform mat3 uvTransform;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,km=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Vm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Wm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] > 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1, 2 ) * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Xm=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform vec2 morphTargetsTextureSize;
		vec3 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset, const in int stride ) {
			float texelIndex = float( vertexIndex * stride + offset );
			float y = floor( texelIndex / morphTargetsTextureSize.x );
			float x = texelIndex - y * morphTargetsTextureSize.x;
			vec3 morphUV = vec3( ( x + 0.5 ) / morphTargetsTextureSize.x, y / morphTargetsTextureSize.y, morphTargetIndex );
			return texture( morphTargetsTexture, morphUV ).xyz;
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,qm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			#ifndef USE_MORPHNORMALS
				if ( morphTargetInfluences[ i ] > 0.0 ) transformed += getMorph( gl_VertexID, i, 0, 1 ) * morphTargetInfluences[ i ];
			#else
				if ( morphTargetInfluences[ i ] > 0.0 ) transformed += getMorph( gl_VertexID, i, 0, 2 ) * morphTargetInfluences[ i ];
			#endif
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Ym=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	#ifdef USE_TANGENT
		vec3 tangent = normalize( vTangent );
		vec3 bitangent = normalize( vBitangent );
		#ifdef DOUBLE_SIDED
			tangent = tangent * faceDirection;
			bitangent = bitangent * faceDirection;
		#endif
		#if defined( TANGENTSPACE_NORMALMAP ) || defined( USE_CLEARCOAT_NORMALMAP )
			mat3 vTBN = mat3( tangent, bitangent, normal );
		#endif
	#endif
#endif
vec3 geometryNormal = normal;`,Jm=`#ifdef OBJECTSPACE_NORMALMAP
	normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( TANGENTSPACE_NORMALMAP )
	vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	#ifdef USE_TANGENT
		normal = normalize( vTBN * mapN );
	#else
		normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection );
	#endif
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Zm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$m=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Qm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef OBJECTSPACE_NORMALMAP
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( TANGENTSPACE_NORMALMAP ) || defined ( USE_CLEARCOAT_NORMALMAP ) )
	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {
		vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
		vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );
		return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );
	}
#endif`,Km=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,eg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	#ifdef USE_TANGENT
		clearcoatNormal = normalize( vTBN * clearcoatMapN );
	#else
		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );
	#endif
#endif`,tg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`,ng=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= transmissionAlpha + 0.1;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ig=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}`,sg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,rg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,og=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ag=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,lg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,hg=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
		bool inFrustum = all( inFrustumVec );
		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );
		bool frustumTest = all( frustumTestVec );
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,ug=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,dg=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SPOT_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		vec4 shadowWorldPosition;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias, 0 );
		vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
#endif`,fg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,pg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,mg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform highp sampler2D boneTexture;
		uniform int boneTextureSize;
		mat4 getBoneMatrix( const in float i ) {
			float j = i * 4.0;
			float x = mod( j, float( boneTextureSize ) );
			float y = floor( j / float( boneTextureSize ) );
			float dx = 1.0 / float( boneTextureSize );
			float dy = 1.0 / float( boneTextureSize );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix( const in float i ) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif`,gg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,xg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,yg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_g=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mg=`#ifdef USE_TRANSMISSION
	float transmissionAlpha = 1.0;
	float transmissionFactor = transmission;
	float thicknessFactor = thickness;
	#ifdef USE_TRANSMISSIONMAP
		transmissionFactor *= texture2D( transmissionMap, vUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		thicknessFactor *= texture2D( thicknessMap, vUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmission = getIBLVolumeRefraction(
		n, v, roughnessFactor, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, ior, thicknessFactor,
		attenuationColor, attenuationDistance );
	totalDiffuse = mix( totalDiffuse, transmission.rgb, transmissionFactor );
	transmissionAlpha = mix( transmissionAlpha, transmission.a, transmissionFactor );
#endif`,bg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	vec3 getVolumeTransmissionRay( vec3 n, vec3 v, float thickness, float ior, mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( float roughness, float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( vec2 fragCoord, float roughness, float ior ) {
		float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		#ifdef TEXTURE_LOD_EXT
			return texture2DLodEXT( transmissionSamplerMap, fragCoord.xy, framebufferLod );
		#else
			return texture2D( transmissionSamplerMap, fragCoord.xy, framebufferLod );
		#endif
	}
	vec3 applyVolumeAttenuation( vec3 radiance, float transmissionDistance, vec3 attenuationColor, float attenuationDistance ) {
		if ( attenuationDistance == 0.0 ) {
			return radiance;
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance * radiance;
		}
	}
	vec4 getIBLVolumeRefraction( vec3 n, vec3 v, float roughness, vec3 diffuseColor, vec3 specularColor, float specularF90,
		vec3 position, mat4 modelMatrix, mat4 viewMatrix, mat4 projMatrix, float ior, float thickness,
		vec3 attenuationColor, float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
	}
#endif`,Sg=`#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )
	varying vec2 vUv;
#endif`,Eg=`#ifdef USE_UV
	#ifdef UVS_VERTEX_ONLY
		vec2 vUv;
	#else
		varying vec2 vUv;
	#endif
	uniform mat3 uvTransform;
#endif`,Tg=`#ifdef USE_UV
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif`,Ag=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif`,Cg=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
	uniform mat3 uv2Transform;
#endif`,Rg=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
#endif`,Lg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION )
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Pg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ig=`uniform sampler2D t2D;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Dg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fg=`#include <envmap_common_pars_fragment>
uniform float opacity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>
	gl_FragColor = envColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Ng=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,zg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Bg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Og=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Hg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	vec4 texColor = texture2D( tEquirect, sampleUV );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Gg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Vg=`#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Wg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel= texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xg=`#define LAMBERT
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <bsdfs>
#include <lights_pars_begin>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <lights_lambert_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qg=`uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <fog_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <emissivemap_fragment>
	#ifdef DOUBLE_SIDED
		reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;
	#else
		reflectedLight.indirectDiffuse += vIndirectFront;
	#endif
	#include <lightmap_fragment>
	reflectedLight.indirectDiffuse *= BRDF_Lambert( diffuseColor.rgb );
	#ifdef DOUBLE_SIDED
		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;
	#else
		reflectedLight.directDiffuse = vLightFront;
	#endif
	reflectedLight.directDiffuse *= BRDF_Lambert( diffuseColor.rgb ) * getShadowMask();
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Jg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
		matcapColor = matcapTexelToLinear( matcapColor );
	#else
		vec4 matcapColor = vec4( 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	vViewPosition = - mvPosition.xyz;
#endif
}`,$g=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
}`,jg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ex=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULARINTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
	#ifdef USE_SPECULARCOLORMAP
		uniform sampler2D specularColorMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEENCOLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEENROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - clearcoat * Fcc ) + clearcoatSpecular * clearcoat;
	#endif
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tx=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ix=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,sx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rx=`#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ox=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,ax=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,lx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,Re={alphamap_fragment:Bp,alphamap_pars_fragment:Op,alphatest_fragment:Up,alphatest_pars_fragment:Hp,aomap_fragment:Gp,aomap_pars_fragment:kp,begin_vertex:Vp,beginnormal_vertex:Wp,bsdfs:Xp,bumpmap_pars_fragment:qp,clipping_planes_fragment:Yp,clipping_planes_pars_fragment:Jp,clipping_planes_pars_vertex:Zp,clipping_planes_vertex:$p,color_fragment:jp,color_pars_fragment:Qp,color_pars_vertex:Kp,color_vertex:em,common:tm,cube_uv_reflection_fragment:nm,defaultnormal_vertex:im,displacementmap_pars_vertex:sm,displacementmap_vertex:rm,emissivemap_fragment:om,emissivemap_pars_fragment:am,encodings_fragment:lm,encodings_pars_fragment:cm,envmap_fragment:hm,envmap_common_pars_fragment:um,envmap_pars_fragment:dm,envmap_pars_vertex:fm,envmap_physical_pars_fragment:Sm,envmap_vertex:pm,fog_vertex:mm,fog_pars_vertex:gm,fog_fragment:xm,fog_pars_fragment:ym,gradientmap_pars_fragment:vm,lightmap_fragment:_m,lightmap_pars_fragment:wm,lights_lambert_vertex:Mm,lights_pars_begin:bm,lights_toon_fragment:Em,lights_toon_pars_fragment:Tm,lights_phong_fragment:Am,lights_phong_pars_fragment:Cm,lights_physical_fragment:Rm,lights_physical_pars_fragment:Lm,lights_fragment_begin:Pm,lights_fragment_maps:Im,lights_fragment_end:Dm,logdepthbuf_fragment:Fm,logdepthbuf_pars_fragment:Nm,logdepthbuf_pars_vertex:zm,logdepthbuf_vertex:Bm,map_fragment:Om,map_pars_fragment:Um,map_particle_fragment:Hm,map_particle_pars_fragment:Gm,metalnessmap_fragment:km,metalnessmap_pars_fragment:Vm,morphnormal_vertex:Wm,morphtarget_pars_vertex:Xm,morphtarget_vertex:qm,normal_fragment_begin:Ym,normal_fragment_maps:Jm,normal_pars_fragment:Zm,normal_pars_vertex:$m,normal_vertex:jm,normalmap_pars_fragment:Qm,clearcoat_normal_fragment_begin:Km,clearcoat_normal_fragment_maps:eg,clearcoat_pars_fragment:tg,output_fragment:ng,packing:ig,premultiplied_alpha_fragment:sg,project_vertex:rg,dithering_fragment:og,dithering_pars_fragment:ag,roughnessmap_fragment:lg,roughnessmap_pars_fragment:cg,shadowmap_pars_fragment:hg,shadowmap_pars_vertex:ug,shadowmap_vertex:dg,shadowmask_pars_fragment:fg,skinbase_vertex:pg,skinning_pars_vertex:mg,skinning_vertex:gg,skinnormal_vertex:xg,specularmap_fragment:yg,specularmap_pars_fragment:vg,tonemapping_fragment:_g,tonemapping_pars_fragment:wg,transmission_fragment:Mg,transmission_pars_fragment:bg,uv_pars_fragment:Sg,uv_pars_vertex:Eg,uv_vertex:Tg,uv2_pars_fragment:Ag,uv2_pars_vertex:Cg,uv2_vertex:Rg,worldpos_vertex:Lg,background_vert:Pg,background_frag:Ig,cube_vert:Dg,cube_frag:Fg,depth_vert:Ng,depth_frag:zg,distanceRGBA_vert:Bg,distanceRGBA_frag:Og,equirect_vert:Ug,equirect_frag:Hg,linedashed_vert:Gg,linedashed_frag:kg,meshbasic_vert:Vg,meshbasic_frag:Wg,meshlambert_vert:Xg,meshlambert_frag:qg,meshmatcap_vert:Yg,meshmatcap_frag:Jg,meshnormal_vert:Zg,meshnormal_frag:$g,meshphong_vert:jg,meshphong_frag:Qg,meshphysical_vert:Kg,meshphysical_frag:ex,meshtoon_vert:tx,meshtoon_frag:nx,points_vert:ix,points_frag:sx,shadow_vert:rx,shadow_frag:ox,sprite_vert:ax,sprite_frag:lx},te={common:{diffuse:{value:new ne(16777215)},opacity:{value:1},map:{value:null},uvTransform:{value:new Ke},uv2Transform:{value:new Ke},alphaMap:{value:null},alphaTest:{value:0}},specularmap:{specularMap:{value:null}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},maxMipLevel:{value:0}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new X(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},metalnessmap:{metalnessMap:{value:null}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotShadowMap:{value:[]},spotShadowMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new ne(16777215)},opacity:{value:1},center:{value:new X(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new Ke}}},Ot={basic:{uniforms:xt([te.common,te.specularmap,te.envmap,te.aomap,te.lightmap,te.fog]),vertexShader:Re.meshbasic_vert,fragmentShader:Re.meshbasic_frag},lambert:{uniforms:xt([te.common,te.specularmap,te.envmap,te.aomap,te.lightmap,te.emissivemap,te.fog,te.lights,{emissive:{value:new ne(0)}}]),vertexShader:Re.meshlambert_vert,fragmentShader:Re.meshlambert_frag},phong:{uniforms:xt([te.common,te.specularmap,te.envmap,te.aomap,te.lightmap,te.emissivemap,te.bumpmap,te.normalmap,te.displacementmap,te.fog,te.lights,{emissive:{value:new ne(0)},specular:{value:new ne(1118481)},shininess:{value:30}}]),vertexShader:Re.meshphong_vert,fragmentShader:Re.meshphong_frag},standard:{uniforms:xt([te.common,te.envmap,te.aomap,te.lightmap,te.emissivemap,te.bumpmap,te.normalmap,te.displacementmap,te.roughnessmap,te.metalnessmap,te.fog,te.lights,{emissive:{value:new ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Re.meshphysical_vert,fragmentShader:Re.meshphysical_frag},toon:{uniforms:xt([te.common,te.aomap,te.lightmap,te.emissivemap,te.bumpmap,te.normalmap,te.displacementmap,te.gradientmap,te.fog,te.lights,{emissive:{value:new ne(0)}}]),vertexShader:Re.meshtoon_vert,fragmentShader:Re.meshtoon_frag},matcap:{uniforms:xt([te.common,te.bumpmap,te.normalmap,te.displacementmap,te.fog,{matcap:{value:null}}]),vertexShader:Re.meshmatcap_vert,fragmentShader:Re.meshmatcap_frag},points:{uniforms:xt([te.points,te.fog]),vertexShader:Re.points_vert,fragmentShader:Re.points_frag},dashed:{uniforms:xt([te.common,te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Re.linedashed_vert,fragmentShader:Re.linedashed_frag},depth:{uniforms:xt([te.common,te.displacementmap]),vertexShader:Re.depth_vert,fragmentShader:Re.depth_frag},normal:{uniforms:xt([te.common,te.bumpmap,te.normalmap,te.displacementmap,{opacity:{value:1}}]),vertexShader:Re.meshnormal_vert,fragmentShader:Re.meshnormal_frag},sprite:{uniforms:xt([te.sprite,te.fog]),vertexShader:Re.sprite_vert,fragmentShader:Re.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null}},vertexShader:Re.background_vert,fragmentShader:Re.background_frag},cube:{uniforms:xt([te.envmap,{opacity:{value:1}}]),vertexShader:Re.cube_vert,fragmentShader:Re.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Re.equirect_vert,fragmentShader:Re.equirect_frag},distanceRGBA:{uniforms:xt([te.common,te.displacementmap,{referencePosition:{value:new b},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Re.distanceRGBA_vert,fragmentShader:Re.distanceRGBA_frag},shadow:{uniforms:xt([te.lights,te.fog,{color:{value:new ne(0)},opacity:{value:1}}]),vertexShader:Re.shadow_vert,fragmentShader:Re.shadow_frag}};Ot.physical={uniforms:xt([Ot.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new X(1,1)},clearcoatNormalMap:{value:null},sheen:{value:0},sheenColor:{value:new ne(0)},sheenColorMap:{value:null},sheenRoughness:{value:0},sheenRoughnessMap:{value:null},transmission:{value:0},transmissionMap:{value:null},transmissionSamplerSize:{value:new X},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:0},attenuationColor:{value:new ne(0)},specularIntensity:{value:0},specularIntensityMap:{value:null},specularColor:{value:new ne(1,1,1)},specularColorMap:{value:null}}]),vertexShader:Re.meshphysical_vert,fragmentShader:Re.meshphysical_frag};function cx(r,e,t,n,i){let s=new ne(0),o=0,a,l,c=null,f=0,p=null;function h(d,m){let y=!1,g=m.isScene===!0?m.background:null;g&&g.isTexture&&(g=e.get(g));let x=r.xr,_=x.getSession&&x.getSession();_&&_.environmentBlendMode==="additive"&&(g=null),g===null?u(s,o):g&&g.isColor&&(u(g,1),y=!0),(r.autoClear||y)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil),g&&(g.isCubeTexture||g.mapping===ws)?(l===void 0&&(l=new Je(new Cn(1,1,1),new Ht({name:"BackgroundCubeMaterial",uniforms:es(Ot.cube.uniforms),vertexShader:Ot.cube.vertexShader,fragmentShader:Ot.cube.fragmentShader,side:Qe,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(v,M,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=g,l.material.uniforms.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,(c!==g||f!==g.version||p!==r.toneMapping)&&(l.material.needsUpdate=!0,c=g,f=g.version,p=r.toneMapping),d.unshift(l,l.geometry,l.material,0,0,null)):g&&g.isTexture&&(a===void 0&&(a=new Je(new is(2,2),new Ht({name:"BackgroundMaterial",uniforms:es(Ot.background.uniforms),vertexShader:Ot.background.vertexShader,fragmentShader:Ot.background.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1})),a.geometry.deleteAttribute("normal"),Object.defineProperty(a.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(a)),a.material.uniforms.t2D.value=g,g.matrixAutoUpdate===!0&&g.updateMatrix(),a.material.uniforms.uvTransform.value.copy(g.matrix),(c!==g||f!==g.version||p!==r.toneMapping)&&(a.material.needsUpdate=!0,c=g,f=g.version,p=r.toneMapping),d.unshift(a,a.geometry,a.material,0,0,null))}function u(d,m){t.buffers.color.setClear(d.r,d.g,d.b,m,i)}return{getClearColor:function(){return s},setClearColor:function(d,m=1){s.set(d),o=m,u(s,o)},getClearAlpha:function(){return o},setClearAlpha:function(d){o=d,u(s,o)},render:h}}function hx(r,e,t,n){let i=r.getParameter(34921),s=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||s!==null,a={},l=m(null),c=l;function f(D,F,U,z,B){let Q=!1;if(o){let ce=d(z,U,F);c!==ce&&(c=ce,h(c.object)),Q=y(z,B),Q&&g(z,B)}else{let ce=F.wireframe===!0;(c.geometry!==z.id||c.program!==U.id||c.wireframe!==ce)&&(c.geometry=z.id,c.program=U.id,c.wireframe=ce,Q=!0)}D.isInstancedMesh===!0&&(Q=!0),B!==null&&t.update(B,34963),Q&&(w(D,F,U,z),B!==null&&r.bindBuffer(34963,t.get(B).buffer))}function p(){return n.isWebGL2?r.createVertexArray():s.createVertexArrayOES()}function h(D){return n.isWebGL2?r.bindVertexArray(D):s.bindVertexArrayOES(D)}function u(D){return n.isWebGL2?r.deleteVertexArray(D):s.deleteVertexArrayOES(D)}function d(D,F,U){let z=U.wireframe===!0,B=a[D.id];B===void 0&&(B={},a[D.id]=B);let Q=B[F.id];Q===void 0&&(Q={},B[F.id]=Q);let ce=Q[z];return ce===void 0&&(ce=m(p()),Q[z]=ce),ce}function m(D){let F=[],U=[],z=[];for(let B=0;B<i;B++)F[B]=0,U[B]=0,z[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:U,attributeDivisors:z,object:D,attributes:{},index:null}}function y(D,F){let U=c.attributes,z=D.attributes,B=0;for(let Q in z){let ce=U[Q],ye=z[Q];if(ce===void 0||ce.attribute!==ye||ce.data!==ye.data)return!0;B++}return c.attributesNum!==B||c.index!==F}function g(D,F){let U={},z=D.attributes,B=0;for(let Q in z){let ce=z[Q],ye={};ye.attribute=ce,ce.data&&(ye.data=ce.data),U[Q]=ye,B++}c.attributes=U,c.attributesNum=B,c.index=F}function x(){let D=c.newAttributes;for(let F=0,U=D.length;F<U;F++)D[F]=0}function _(D){v(D,0)}function v(D,F){let U=c.newAttributes,z=c.enabledAttributes,B=c.attributeDivisors;U[D]=1,z[D]===0&&(r.enableVertexAttribArray(D),z[D]=1),B[D]!==F&&((n.isWebGL2?r:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](D,F),B[D]=F)}function M(){let D=c.newAttributes,F=c.enabledAttributes;for(let U=0,z=F.length;U<z;U++)F[U]!==D[U]&&(r.disableVertexAttribArray(U),F[U]=0)}function T(D,F,U,z,B,Q){n.isWebGL2===!0&&(U===5124||U===5125)?r.vertexAttribIPointer(D,F,U,B,Q):r.vertexAttribPointer(D,F,U,z,B,Q)}function w(D,F,U,z){if(n.isWebGL2===!1&&(D.isInstancedMesh||z.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;x();let B=z.attributes,Q=U.getAttributes(),ce=F.defaultAttributeValues;for(let ye in Q){let re=Q[ye];if(re.location>=0){let Te=B[ye];if(Te===void 0&&(ye==="instanceMatrix"&&D.instanceMatrix&&(Te=D.instanceMatrix),ye==="instanceColor"&&D.instanceColor&&(Te=D.instanceColor)),Te!==void 0){let J=Te.normalized,K=Te.itemSize,de=t.get(Te);if(de===void 0)continue;let k=de.buffer,ve=de.type,Se=de.bytesPerElement;if(Te.isInterleavedBufferAttribute){let oe=Te.data,fe=oe.stride,Ce=Te.offset;if(oe&&oe.isInstancedInterleavedBuffer){for(let V=0;V<re.locationSize;V++)v(re.location+V,oe.meshPerAttribute);D.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let V=0;V<re.locationSize;V++)_(re.location+V);r.bindBuffer(34962,k);for(let V=0;V<re.locationSize;V++)T(re.location+V,K/re.locationSize,ve,J,fe*Se,(Ce+K/re.locationSize*V)*Se)}else{if(Te.isInstancedBufferAttribute){for(let oe=0;oe<re.locationSize;oe++)v(re.location+oe,Te.meshPerAttribute);D.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Te.meshPerAttribute*Te.count)}else for(let oe=0;oe<re.locationSize;oe++)_(re.location+oe);r.bindBuffer(34962,k);for(let oe=0;oe<re.locationSize;oe++)T(re.location+oe,K/re.locationSize,ve,J,K*Se,K/re.locationSize*oe*Se)}}else if(ce!==void 0){let J=ce[ye];if(J!==void 0)switch(J.length){case 2:r.vertexAttrib2fv(re.location,J);break;case 3:r.vertexAttrib3fv(re.location,J);break;case 4:r.vertexAttrib4fv(re.location,J);break;default:r.vertexAttrib1fv(re.location,J)}}}}M()}function C(){R();for(let D in a){let F=a[D];for(let U in F){let z=F[U];for(let B in z)u(z[B].object),delete z[B];delete F[U]}delete a[D]}}function I(D){if(a[D.id]===void 0)return;let F=a[D.id];for(let U in F){let z=F[U];for(let B in z)u(z[B].object),delete z[B];delete F[U]}delete a[D.id]}function L(D){for(let F in a){let U=a[F];if(U[D.id]===void 0)continue;let z=U[D.id];for(let B in z)u(z[B].object),delete z[B];delete U[D.id]}}function R(){W(),c!==l&&(c=l,h(c.object))}function W(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:R,resetDefaultState:W,dispose:C,releaseStatesOfGeometry:I,releaseStatesOfProgram:L,initAttributes:x,enableAttribute:_,disableUnusedAttributes:M}}function ux(r,e,t,n){let i=n.isWebGL2,s;function o(c){s=c}function a(c,f){r.drawArrays(s,c,f),t.update(f,s,1)}function l(c,f,p){if(p===0)return;let h,u;if(i)h=r,u="drawArraysInstanced";else if(h=e.get("ANGLE_instanced_arrays"),u="drawArraysInstancedANGLE",h===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}h[u](s,c,f,p),t.update(f,s,p)}this.setMode=o,this.render=a,this.renderInstances=l}function dx(r,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){let w=e.get("EXT_texture_filter_anisotropic");n=r.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function s(w){if(w==="highp"){if(r.getShaderPrecisionFormat(35633,36338).precision>0&&r.getShaderPrecisionFormat(35632,36338).precision>0)return"highp";w="mediump"}return w==="mediump"&&r.getShaderPrecisionFormat(35633,36337).precision>0&&r.getShaderPrecisionFormat(35632,36337).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&r instanceof WebGL2RenderingContext||typeof WebGL2ComputeRenderingContext<"u"&&r instanceof WebGL2ComputeRenderingContext,a=t.precision!==void 0?t.precision:"highp",l=s(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);let c=o||e.has("WEBGL_draw_buffers"),f=t.logarithmicDepthBuffer===!0,p=r.getParameter(34930),h=r.getParameter(35660),u=r.getParameter(3379),d=r.getParameter(34076),m=r.getParameter(34921),y=r.getParameter(36347),g=r.getParameter(36348),x=r.getParameter(36349),_=h>0,v=o||e.has("OES_texture_float"),M=_&&v,T=o?r.getParameter(36183):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:f,maxTextures:p,maxVertexTextures:h,maxTextureSize:u,maxCubemapSize:d,maxAttributes:m,maxVertexUniforms:y,maxVaryings:g,maxFragmentUniforms:x,vertexTextures:_,floatFragmentTextures:v,floatVertexTextures:M,maxSamples:T}}function fx(r){let e=this,t=null,n=0,i=!1,s=!1,o=new Lt,a=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h,u){let d=p.length!==0||h||n!==0||i;return i=h,t=f(p,u,0),n=p.length,d},this.beginShadows=function(){s=!0,f(null)},this.endShadows=function(){s=!1,c()},this.setState=function(p,h,u){let d=p.clippingPlanes,m=p.clipIntersection,y=p.clipShadows,g=r.get(p);if(!i||d===null||d.length===0||s&&!y)s?f(null):c();else{let x=s?0:n,_=x*4,v=g.clippingState||null;l.value=v,v=f(d,h,_,u);for(let M=0;M!==_;++M)v[M]=t[M];g.clippingState=v,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function f(p,h,u,d){let m=p!==null?p.length:0,y=null;if(m!==0){if(y=l.value,d!==!0||y===null){let g=u+m*4,x=h.matrixWorldInverse;a.getNormalMatrix(x),(y===null||y.length<g)&&(y=new Float32Array(g));for(let _=0,v=u;_!==m;++_,v+=4)o.copy(p[_]).applyMatrix4(x,a),o.normal.toArray(y,v),y[v+3]=o.constant}l.value=y,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,y}}function px(r){let e=new WeakMap;function t(o,a){return a===Gs?o.mapping=_i:a===ks&&(o.mapping=wi),o}function n(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){let a=o.mapping;if(a===Gs||a===ks)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=r.getRenderTarget(),f=new ns(l.height/2);return f.fromEquirectangularTexture(r,o),e.set(o,f),r.setRenderTarget(c),o.addEventListener("dispose",i),t(f.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}var li=class extends oi{constructor(e=-1,t=1,n=1,i=-1,s=.1,o=2e3){super(),this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=f*this.view.offsetY,l=a-f*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};li.prototype.isOrthographicCamera=!0;var Ln=class extends Ht{constructor(e){super(e),this.type="RawShaderMaterial"}};Ln.prototype.isRawShaderMaterial=!0;var Ji=4,Tn=8,Vt=Math.pow(2,Tn),Yd=[.125,.215,.35,.446,.526,.582],Jd=Tn-Ji+1+Yd.length,Bi=20,Pn={[ft]:0,[zn]:1,[Ba]:2,[Mc]:3,[bc]:4,[Sc]:5,[za]:6},dl=new li,{_lodPlanes:Rs,_sizeLods:eh,_sigmas:mo}=gx(),th=new ne,fl=null,Zn=(1+Math.sqrt(5))/2,Oi=1/Zn,nh=[new b(1,1,1),new b(-1,1,1),new b(1,1,-1),new b(-1,1,-1),new b(0,Zn,Oi),new b(0,Zn,-Oi),new b(Oi,0,Zn),new b(-Oi,0,Zn),new b(Zn,Oi,0),new b(-Zn,Oi,0)],jo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._blurMaterial=xx(Bi),this._equirectShader=null,this._cubemapShader=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){fl=this._renderer.getRenderTarget();let s=this._allocateTargets();return this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e){return this._fromTexture(e)}fromCubemap(e){return this._fromTexture(e)}compileCubemapShader(){this._cubemapShader===null&&(this._cubemapShader=rh(),this._compileMaterial(this._cubemapShader))}compileEquirectangularShader(){this._equirectShader===null&&(this._equirectShader=sh(),this._compileMaterial(this._equirectShader))}dispose(){this._blurMaterial.dispose(),this._cubemapShader!==null&&this._cubemapShader.dispose(),this._equirectShader!==null&&this._equirectShader.dispose();for(let e=0;e<Rs.length;e++)Rs[e].dispose()}_cleanup(e){this._pingPongRenderTarget.dispose(),this._renderer.setRenderTarget(fl),e.scissorTest=!1,go(e,0,0,e.width,e.height)}_fromTexture(e){fl=this._renderer.getRenderTarget();let t=this._allocateTargets(e);return this._textureToCubeUV(e,t),this._applyPMREM(t),this._cleanup(t),t}_allocateTargets(e){let t={magFilter:tt,minFilter:tt,generateMipmaps:!1,type:on,format:Zu,encoding:mx(e)?e.encoding:Ba,depthBuffer:!1},n=ih(t);return n.depthBuffer=!e,this._pingPongRenderTarget=ih(t),n}_compileMaterial(e){let t=new Je(Rs[0],e);this._renderer.compile(t,dl)}_sceneToCubeUV(e,t,n,i){let a=new et(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],f=this._renderer,p=f.autoClear,h=f.outputEncoding,u=f.toneMapping;f.getClearColor(th),f.toneMapping=En,f.outputEncoding=ft,f.autoClear=!1;let d=new Ut({name:"PMREM.Background",side:Qe,depthWrite:!1,depthTest:!1}),m=new Je(new Cn,d),y=!1,g=e.background;g?g.isColor&&(d.color.copy(g),e.background=null,y=!0):(d.color.copy(th),y=!0);for(let x=0;x<6;x++){let _=x%3;_==0?(a.up.set(0,l[x],0),a.lookAt(c[x],0,0)):_==1?(a.up.set(0,0,l[x]),a.lookAt(0,c[x],0)):(a.up.set(0,l[x],0),a.lookAt(0,0,c[x])),go(i,_*Vt,x>2?Vt:0,Vt,Vt),f.setRenderTarget(i),y&&f.render(m,a),f.render(e,a)}m.geometry.dispose(),m.material.dispose(),f.toneMapping=u,f.outputEncoding=h,f.autoClear=p,e.background=g}_setEncoding(e,t){this._renderer.capabilities.isWebGL2===!0&&t.format===ut&&t.type===on&&t.encoding===zn?e.value=Pn[ft]:e.value=Pn[t.encoding]}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===_i||e.mapping===wi;i?this._cubemapShader==null&&(this._cubemapShader=rh()):this._equirectShader==null&&(this._equirectShader=sh());let s=i?this._cubemapShader:this._equirectShader,o=new Je(Rs[0],s),a=s.uniforms;a.envMap.value=e,i||a.texelSize.value.set(1/e.image.width,1/e.image.height),this._setEncoding(a.inputEncoding,e),this._setEncoding(a.outputEncoding,t.texture),go(t,0,0,3*Vt,2*Vt),n.setRenderTarget(t),n.render(o,dl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<Jd;i++){let s=Math.sqrt(mo[i]*mo[i]-mo[i-1]*mo[i-1]),o=nh[(i-1)%nh.length];this._blur(e,i-1,i,s,o)}t.autoClear=n}_blur(e,t,n,i,s){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",s),this._halfBlur(o,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let f=3,p=new Je(Rs[i],c),h=c.uniforms,u=eh[n]-1,d=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*Bi-1),m=s/d,y=isFinite(s)?1+Math.floor(f*m):Bi;y>Bi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${Bi}`);let g=[],x=0;for(let T=0;T<Bi;++T){let w=T/m,C=Math.exp(-w*w/2);g.push(C),T==0?x+=C:T<y&&(x+=2*C)}for(let T=0;T<g.length;T++)g[T]=g[T]/x;h.envMap.value=e.texture,h.samples.value=y,h.weights.value=g,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a),h.dTheta.value=d,h.mipInt.value=Tn-n,this._setEncoding(h.inputEncoding,e.texture),this._setEncoding(h.outputEncoding,e.texture);let _=eh[i],v=3*Math.max(0,Vt-2*_),M=(i===0?0:2*Vt)+2*_*(i>Tn-Ji?i-Tn+Ji:0);go(t,v,M,3*_,2*_),l.setRenderTarget(t),l.render(p,dl)}};function mx(r){return r===void 0||r.type!==on?!1:r.encoding===ft||r.encoding===zn||r.encoding===za}function gx(){let r=[],e=[],t=[],n=Tn;for(let i=0;i<Jd;i++){let s=Math.pow(2,n);e.push(s);let o=1/s;i>Tn-Ji?o=Yd[i-Tn+Ji-1]:i==0&&(o=0),t.push(o);let a=1/(s-1),l=-a/2,c=1+a/2,f=[l,l,c,l,c,c,l,l,c,c,l,c],p=6,h=6,u=3,d=2,m=1,y=new Float32Array(u*h*p),g=new Float32Array(d*h*p),x=new Float32Array(m*h*p);for(let v=0;v<p;v++){let M=v%3*2/3-1,T=v>2?0:-1,w=[M,T,0,M+2/3,T,0,M+2/3,T+1,0,M,T,0,M+2/3,T+1,0,M,T+1,0];y.set(w,u*h*v),g.set(f,d*h*v);let C=[v,v,v,v,v,v];x.set(C,m*h*v)}let _=new _e;_.setAttribute("position",new Pe(y,u)),_.setAttribute("uv",new Pe(g,d)),_.setAttribute("faceIndex",new Pe(x,m)),r.push(_),n>Ji&&n--}return{_lodPlanes:r,_sizeLods:e,_sigmas:t}}function ih(r){let e=new Tt(3*Vt,3*Vt,r);return e.texture.mapping=ws,e.texture.name="PMREM.cubeUv",e.scissorTest=!0,e}function go(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function xx(r){let e=new Float32Array(r),t=new b(0,1,0);return new Ln({name:"SphericalGaussianBlur",defines:{n:r},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:e},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:t},inputEncoding:{value:Pn[ft]},outputEncoding:{value:Pn[ft]}},vertexShader:Tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			${Ac()}

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:sn,depthTest:!1,depthWrite:!1})}function sh(){let r=new X(1,1);return new Ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null},texelSize:{value:r},inputEncoding:{value:Pn[ft]},outputEncoding:{value:Pn[ft]}},vertexShader:Tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform vec2 texelSize;

			${Ac()}

			#include <common>

			void main() {

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				vec2 f = fract( uv / texelSize - 0.5 );
				uv -= f * texelSize;
				vec3 tl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.x += texelSize.x;
				vec3 tr = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.y += texelSize.y;
				vec3 br = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.x -= texelSize.x;
				vec3 bl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;

				vec3 tm = mix( tl, tr, f.x );
				vec3 bm = mix( bl, br, f.x );
				gl_FragColor.rgb = mix( tm, bm, f.y );

				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:sn,depthTest:!1,depthWrite:!1})}function rh(){return new Ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},inputEncoding:{value:Pn[ft]},outputEncoding:{value:Pn[ft]}},vertexShader:Tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			${Ac()}

			void main() {

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb = envMapTexelToLinear( textureCube( envMap, vec3( - vOutputDirection.x, vOutputDirection.yz ) ) ).rgb;
				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:sn,depthTest:!1,depthWrite:!1})}function Tc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 position;
		attribute vec2 uv;
		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ac(){return`

		uniform int inputEncoding;
		uniform int outputEncoding;

		#include <encodings_pars_fragment>

		vec4 inputTexelToLinear( vec4 value ) {

			if ( inputEncoding == 0 ) {

				return value;

			} else if ( inputEncoding == 1 ) {

				return sRGBToLinear( value );

			} else if ( inputEncoding == 2 ) {

				return RGBEToLinear( value );

			} else if ( inputEncoding == 3 ) {

				return RGBMToLinear( value, 7.0 );

			} else if ( inputEncoding == 4 ) {

				return RGBMToLinear( value, 16.0 );

			} else if ( inputEncoding == 5 ) {

				return RGBDToLinear( value, 256.0 );

			} else {

				return GammaToLinear( value, 2.2 );

			}

		}

		vec4 linearToOutputTexel( vec4 value ) {

			if ( outputEncoding == 0 ) {

				return value;

			} else if ( outputEncoding == 1 ) {

				return LinearTosRGB( value );

			} else if ( outputEncoding == 2 ) {

				return LinearToRGBE( value );

			} else if ( outputEncoding == 3 ) {

				return LinearToRGBM( value, 7.0 );

			} else if ( outputEncoding == 4 ) {

				return LinearToRGBM( value, 16.0 );

			} else if ( outputEncoding == 5 ) {

				return LinearToRGBD( value, 256.0 );

			} else {

				return LinearToGamma( value, 2.2 );

			}

		}

		vec4 envMapTexelToLinear( vec4 color ) {

			return inputTexelToLinear( color );

		}
	`}function yx(r){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture&&a.isRenderTargetTexture===!1){let l=a.mapping,c=l===Gs||l===ks,f=l===_i||l===wi;if(c||f){if(e.has(a))return e.get(a).texture;{let p=a.image;if(c&&p&&p.height>0||f&&p&&i(p)){let h=r.getRenderTarget();t===null&&(t=new jo(r));let u=c?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,u),r.setRenderTarget(h),a.addEventListener("dispose",s),u.texture}else return null}}}return a}function i(a){let l=0,c=6;for(let f=0;f<c;f++)a[f]!==void 0&&l++;return l===c}function s(a){let l=a.target;l.removeEventListener("dispose",s);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function vx(r){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float")},get:function(n){let i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function _x(r,e,t,n){let i={},s=new WeakMap;function o(p){let h=p.target;h.index!==null&&e.remove(h.index);for(let d in h.attributes)e.remove(h.attributes[d]);h.removeEventListener("dispose",o),delete i[h.id];let u=s.get(h);u&&(e.remove(u),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(p,h){return i[h.id]===!0||(h.addEventListener("dispose",o),i[h.id]=!0,t.memory.geometries++),h}function l(p){let h=p.attributes;for(let d in h)e.update(h[d],34962);let u=p.morphAttributes;for(let d in u){let m=u[d];for(let y=0,g=m.length;y<g;y++)e.update(m[y],34962)}}function c(p){let h=[],u=p.index,d=p.attributes.position,m=0;if(u!==null){let x=u.array;m=u.version;for(let _=0,v=x.length;_<v;_+=3){let M=x[_+0],T=x[_+1],w=x[_+2];h.push(M,T,T,w,w,M)}}else{let x=d.array;m=d.version;for(let _=0,v=x.length/3-1;_<v;_+=3){let M=_+0,T=_+1,w=_+2;h.push(M,T,T,w,w,M)}}let y=new(Vd(h)>65535?Ki:Qi)(h,1);y.version=m;let g=s.get(p);g&&e.remove(g),s.set(p,y)}function f(p){let h=s.get(p);if(h){let u=p.index;u!==null&&h.version<u.version&&c(p)}else c(p);return s.get(p)}return{get:a,update:l,getWireframeAttribute:f}}function wx(r,e,t,n){let i=n.isWebGL2,s;function o(h){s=h}let a,l;function c(h){a=h.type,l=h.bytesPerElement}function f(h,u){r.drawElements(s,u,a,h*l),t.update(u,s,1)}function p(h,u,d){if(d===0)return;let m,y;if(i)m=r,y="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),y="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[y](s,u,a,h*l,d),t.update(u,s,d)}this.setMode=o,this.setIndex=c,this.render=f,this.renderInstances=p}function Mx(r){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case 4:t.triangles+=a*(s/3);break;case 1:t.lines+=a*(s/2);break;case 3:t.lines+=a*(s-1);break;case 2:t.lines+=a*s;break;case 0:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.frame++,t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}var ss=class extends at{constructor(e=null,t=1,n=1,i=1){super(null),this.image={data:e,width:t,height:n,depth:i},this.magFilter=tt,this.minFilter=tt,this.wrapR=ht,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}};ss.prototype.isDataTexture2DArray=!0;function bx(r,e){return r[0]-e[0]}function Sx(r,e){return Math.abs(e[1])-Math.abs(r[1])}function oh(r,e){let t=1,n=e.isInterleavedBufferAttribute?e.data.array:e.array;n instanceof Int8Array?t=127:n instanceof Int16Array?t=32767:n instanceof Int32Array?t=2147483647:console.error("THREE.WebGLMorphtargets: Unsupported morph attribute data type: ",n),r.divideScalar(t)}function Ex(r,e,t){let n={},i=new Float32Array(8),s=new WeakMap,o=new b,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,f,p,h){let u=c.morphTargetInfluences;if(e.isWebGL2===!0){let d=f.morphAttributes.position.length,m=s.get(f);if(m===void 0||m.count!==d){m!==void 0&&m.texture.dispose();let x=f.morphAttributes.normal!==void 0,_=f.morphAttributes.position,v=f.morphAttributes.normal||[],M=f.attributes.position.count,T=x===!0?2:1,w=M*T,C=1;w>e.maxTextureSize&&(C=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);let I=new Float32Array(w*C*4*d),L=new ss(I,w,C,d);L.format=ut,L.type=Wt;let R=T*4;for(let W=0;W<d;W++){let D=_[W],F=v[W],U=w*C*4*W;for(let z=0;z<D.count;z++){o.fromBufferAttribute(D,z),D.normalized===!0&&oh(o,D);let B=z*R;I[U+B+0]=o.x,I[U+B+1]=o.y,I[U+B+2]=o.z,I[U+B+3]=0,x===!0&&(o.fromBufferAttribute(F,z),F.normalized===!0&&oh(o,F),I[U+B+4]=o.x,I[U+B+5]=o.y,I[U+B+6]=o.z,I[U+B+7]=0)}}m={count:d,texture:L,size:new X(w,C)},s.set(f,m)}let y=0;for(let x=0;x<u.length;x++)y+=u[x];let g=f.morphTargetsRelative?1:1-y;h.getUniforms().setValue(r,"morphTargetBaseInfluence",g),h.getUniforms().setValue(r,"morphTargetInfluences",u),h.getUniforms().setValue(r,"morphTargetsTexture",m.texture,t),h.getUniforms().setValue(r,"morphTargetsTextureSize",m.size)}else{let d=u===void 0?0:u.length,m=n[f.id];if(m===void 0||m.length!==d){m=[];for(let v=0;v<d;v++)m[v]=[v,0];n[f.id]=m}for(let v=0;v<d;v++){let M=m[v];M[0]=v,M[1]=u[v]}m.sort(Sx);for(let v=0;v<8;v++)v<d&&m[v][1]?(a[v][0]=m[v][0],a[v][1]=m[v][1]):(a[v][0]=Number.MAX_SAFE_INTEGER,a[v][1]=0);a.sort(bx);let y=f.morphAttributes.position,g=f.morphAttributes.normal,x=0;for(let v=0;v<8;v++){let M=a[v],T=M[0],w=M[1];T!==Number.MAX_SAFE_INTEGER&&w?(y&&f.getAttribute("morphTarget"+v)!==y[T]&&f.setAttribute("morphTarget"+v,y[T]),g&&f.getAttribute("morphNormal"+v)!==g[T]&&f.setAttribute("morphNormal"+v,g[T]),i[v]=w,x+=w):(y&&f.hasAttribute("morphTarget"+v)===!0&&f.deleteAttribute("morphTarget"+v),g&&f.hasAttribute("morphNormal"+v)===!0&&f.deleteAttribute("morphNormal"+v),i[v]=0)}let _=f.morphTargetsRelative?1:1-x;h.getUniforms().setValue(r,"morphTargetBaseInfluence",_),h.getUniforms().setValue(r,"morphTargetInfluences",i)}}return{update:l}}function Tx(r,e,t,n){let i=new WeakMap;function s(l){let c=n.render.frame,f=l.geometry,p=e.get(l,f);return i.get(p)!==c&&(e.update(p),i.set(p,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),t.update(l.instanceMatrix,34962),l.instanceColor!==null&&t.update(l.instanceColor,34962)),p}function o(){i=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}var Qs=class extends at{constructor(e=null,t=1,n=1,i=1){super(null),this.image={data:e,width:t,height:n,depth:i},this.magFilter=tt,this.minFilter=tt,this.wrapR=ht,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}};Qs.prototype.isDataTexture3D=!0;var Zd=new at,Ax=new ss,Cx=new Qs,$d=new Rn,ah=[],lh=[],ch=new Float32Array(16),hh=new Float32Array(9),uh=new Float32Array(4);function Ms(r,e,t){let n=r[0];if(n<=0||n>0)return r;let i=e*t,s=ah[i];if(s===void 0&&(s=new Float32Array(i),ah[i]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,r[o].toArray(s,a)}return s}function wt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function yt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function jd(r,e){let t=lh[e];t===void 0&&(t=new Int32Array(e),lh[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function Rx(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Lx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;r.uniform2fv(this.addr,e),yt(t,e)}}function Px(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wt(t,e))return;r.uniform3fv(this.addr,e),yt(t,e)}}function Ix(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;r.uniform4fv(this.addr,e),yt(t,e)}}function Dx(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(wt(t,n))return;uh.set(n),r.uniformMatrix2fv(this.addr,!1,uh),yt(t,n)}}function Fx(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(wt(t,n))return;hh.set(n),r.uniformMatrix3fv(this.addr,!1,hh),yt(t,n)}}function Nx(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(wt(t,n))return;ch.set(n),r.uniformMatrix4fv(this.addr,!1,ch),yt(t,n)}}function zx(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Bx(r,e){let t=this.cache;wt(t,e)||(r.uniform2iv(this.addr,e),yt(t,e))}function Ox(r,e){let t=this.cache;wt(t,e)||(r.uniform3iv(this.addr,e),yt(t,e))}function Ux(r,e){let t=this.cache;wt(t,e)||(r.uniform4iv(this.addr,e),yt(t,e))}function Hx(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Gx(r,e){let t=this.cache;wt(t,e)||(r.uniform2uiv(this.addr,e),yt(t,e))}function kx(r,e){let t=this.cache;wt(t,e)||(r.uniform3uiv(this.addr,e),yt(t,e))}function Vx(r,e){let t=this.cache;wt(t,e)||(r.uniform4uiv(this.addr,e),yt(t,e))}function Wx(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.safeSetTexture2D(e||Zd,i)}function Xx(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Cx,i)}function qx(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.safeSetTextureCube(e||$d,i)}function Yx(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Ax,i)}function Jx(r){switch(r){case 5126:return Rx;case 35664:return Lx;case 35665:return Px;case 35666:return Ix;case 35674:return Dx;case 35675:return Fx;case 35676:return Nx;case 5124:case 35670:return zx;case 35667:case 35671:return Bx;case 35668:case 35672:return Ox;case 35669:case 35673:return Ux;case 5125:return Hx;case 36294:return Gx;case 36295:return kx;case 36296:return Vx;case 35678:case 36198:case 36298:case 36306:case 35682:return Wx;case 35679:case 36299:case 36307:return Xx;case 35680:case 36300:case 36308:case 36293:return qx;case 36289:case 36303:case 36311:case 36292:return Yx}}function Zx(r,e){r.uniform1fv(this.addr,e)}function $x(r,e){let t=Ms(e,this.size,2);r.uniform2fv(this.addr,t)}function jx(r,e){let t=Ms(e,this.size,3);r.uniform3fv(this.addr,t)}function Qx(r,e){let t=Ms(e,this.size,4);r.uniform4fv(this.addr,t)}function Kx(r,e){let t=Ms(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function ey(r,e){let t=Ms(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function ty(r,e){let t=Ms(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function ny(r,e){r.uniform1iv(this.addr,e)}function iy(r,e){r.uniform2iv(this.addr,e)}function sy(r,e){r.uniform3iv(this.addr,e)}function ry(r,e){r.uniform4iv(this.addr,e)}function oy(r,e){r.uniform1uiv(this.addr,e)}function ay(r,e){r.uniform2uiv(this.addr,e)}function ly(r,e){r.uniform3uiv(this.addr,e)}function cy(r,e){r.uniform4uiv(this.addr,e)}function hy(r,e,t){let n=e.length,i=jd(t,n);r.uniform1iv(this.addr,i);for(let s=0;s!==n;++s)t.safeSetTexture2D(e[s]||Zd,i[s])}function uy(r,e,t){let n=e.length,i=jd(t,n);r.uniform1iv(this.addr,i);for(let s=0;s!==n;++s)t.safeSetTextureCube(e[s]||$d,i[s])}function dy(r){switch(r){case 5126:return Zx;case 35664:return $x;case 35665:return jx;case 35666:return Qx;case 35674:return Kx;case 35675:return ey;case 35676:return ty;case 5124:case 35670:return ny;case 35667:case 35671:return iy;case 35668:case 35672:return sy;case 35669:case 35673:return ry;case 5125:return oy;case 36294:return ay;case 36295:return ly;case 36296:return cy;case 35678:case 36198:case 36298:case 36306:case 35682:return hy;case 35680:case 36300:case 36308:case 36293:return uy}}function fy(r,e,t){this.id=r,this.addr=t,this.cache=[],this.setValue=Jx(e.type)}function Qd(r,e,t){this.id=r,this.addr=t,this.cache=[],this.size=e.size,this.setValue=dy(e.type)}Qd.prototype.updateCache=function(r){let e=this.cache;r instanceof Float32Array&&e.length!==r.length&&(this.cache=new Float32Array(r.length)),yt(e,r)};function Kd(r){this.id=r,this.seq=[],this.map={}}Kd.prototype.setValue=function(r,e,t){let n=this.seq;for(let i=0,s=n.length;i!==s;++i){let o=n[i];o.setValue(r,e[o.id],t)}};var pl=/(\w+)(\])?(\[|\.)?/g;function dh(r,e){r.seq.push(e),r.map[e.id]=e}function py(r,e,t){let n=r.name,i=n.length;for(pl.lastIndex=0;;){let s=pl.exec(n),o=pl.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){dh(t,c===void 0?new fy(a,r,e):new Qd(a,r,e));break}else{let p=t.map[a];p===void 0&&(p=new Kd(a),dh(t,p)),t=p}}}function An(r,e){this.seq=[],this.map={};let t=r.getProgramParameter(e,35718);for(let n=0;n<t;++n){let i=r.getActiveUniform(e,n),s=r.getUniformLocation(e,i.name);py(i,s,this)}}An.prototype.setValue=function(r,e,t,n){let i=this.map[e];i!==void 0&&i.setValue(r,t,n)};An.prototype.setOptional=function(r,e,t){let n=e[t];n!==void 0&&this.setValue(r,t,n)};An.upload=function(r,e,t,n){for(let i=0,s=e.length;i!==s;++i){let o=e[i],a=t[o.id];a.needsUpdate!==!1&&o.setValue(r,a.value,n)}};An.seqWithValue=function(r,e){let t=[];for(let n=0,i=r.length;n!==i;++n){let s=r[n];s.id in e&&t.push(s)}return t};function fh(r,e,t){let n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}var my=0;function gy(r){let e=r.split(`
`);for(let t=0;t<e.length;t++)e[t]=t+1+": "+e[t];return e.join(`
`)}function ef(r){switch(r){case ft:return["Linear","( value )"];case zn:return["sRGB","( value )"];case Ba:return["RGBE","( value )"];case Mc:return["RGBM","( value, 7.0 )"];case bc:return["RGBM","( value, 16.0 )"];case Sc:return["RGBD","( value, 256.0 )"];case za:return["Gamma","( value, float( GAMMA_FACTOR ) )"];case zd:return["LogLuv","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported encoding:",r),["Linear","( value )"]}}function ph(r,e,t){let n=r.getShaderParameter(e,35713),i=r.getShaderInfoLog(e).trim();return n&&i===""?"":t.toUpperCase()+`

`+i+`

`+gy(r.getShaderSource(e))}function Wn(r,e){let t=ef(e);return"vec4 "+r+"( vec4 value ) { return "+t[0]+"ToLinear"+t[1]+"; }"}function xy(r,e){let t=ef(e);return"vec4 "+r+"( vec4 value ) { return LinearTo"+t[0]+t[1]+"; }"}function yy(r,e){let t;switch(e){case Nu:t="Linear";break;case zu:t="Reinhard";break;case Bu:t="OptimizedCineon";break;case Ou:t="ACESFilmic";break;case Uu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function vy(r){return[r.extensionDerivatives||r.envMapCubeUV||r.bumpMap||r.tangentSpaceNormalMap||r.clearcoatNormalMap||r.flatShading||r.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(r.extensionFragDepth||r.logarithmicDepthBuffer)&&r.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",r.extensionDrawBuffers&&r.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(r.extensionShaderTextureLOD||r.envMap||r.transmission)&&r.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ns).join(`
`)}function _y(r){let e=[];for(let t in r){let n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function wy(r,e){let t={},n=r.getProgramParameter(e,35721);for(let i=0;i<n;i++){let s=r.getActiveAttrib(e,i),o=s.name,a=1;s.type===35674&&(a=2),s.type===35675&&(a=3),s.type===35676&&(a=4),t[o]={type:s.type,location:r.getAttribLocation(e,o),locationSize:a}}return t}function Ns(r){return r!==""}function mh(r,e){return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function gh(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var My=/^[ \t]*#include +<([\w\d./]+)>/gm;function kl(r){return r.replace(My,by)}function by(r,e){let t=Re[e];if(t===void 0)throw new Error("Can not resolve #include <"+e+">");return kl(t)}var Sy=/#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g,Ey=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xh(r){return r.replace(Ey,tf).replace(Sy,Ty)}function Ty(r,e,t,n){return console.warn("WebGLProgram: #pragma unroll_loop shader syntax is deprecated. Please use #pragma unroll_loop_start syntax instead."),tf(r,e,t,n)}function tf(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function yh(r){let e="precision "+r.precision+` float;
precision `+r.precision+" int;";return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Ay(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===gc?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===fu?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Vi&&(e="SHADOWMAP_TYPE_VSM"),e}function Cy(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case _i:case wi:e="ENVMAP_TYPE_CUBE";break;case ws:case Xr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ry(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case wi:case Xr:e="ENVMAP_MODE_REFRACTION";break}return e}function Ly(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Wr:e="ENVMAP_BLENDING_MULTIPLY";break;case Du:e="ENVMAP_BLENDING_MIX";break;case Fu:e="ENVMAP_BLENDING_ADD";break}return e}function Py(r,e,t,n){let i=r.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Ay(t),c=Cy(t),f=Ry(t),p=Ly(t),h=r.gammaFactor>0?r.gammaFactor:1,u=t.isWebGL2?"":vy(t),d=_y(s),m=i.createProgram(),y,g,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=[d].filter(Ns).join(`
`),y.length>0&&(y+=`
`),g=[u,d].filter(Ns).join(`
`),g.length>0&&(g+=`
`)):(y=[yh(t),"#define SHADER_NAME "+t.shaderName,d,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.supportsVertexTextures?"#define VERTEX_TEXTURES":"","#define GAMMA_FACTOR "+h,"#define MAX_BONES "+t.maxBones,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.displacementMap&&t.supportsVertexTextures?"#define USE_DISPLACEMENTMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.useVertexTexture?"#define BONE_TEXTURE":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphTargets&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargets&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ns).join(`
`),g=[u,yh(t),"#define SHADER_NAME "+t.shaderName,d,"#define GAMMA_FACTOR "+h,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+f:"",t.envMap?"#define "+p:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.physicallyCorrectLights?"#define PHYSICALLY_CORRECT_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"",(t.extensionShaderTextureLOD||t.envMap)&&t.rendererExtensionShaderTextureLod?"#define TEXTURE_LOD_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==En?"#define TONE_MAPPING":"",t.toneMapping!==En?Re.tonemapping_pars_fragment:"",t.toneMapping!==En?yy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.format===ei?"#define OPAQUE":"",Re.encodings_pars_fragment,t.map?Wn("mapTexelToLinear",t.mapEncoding):"",t.matcap?Wn("matcapTexelToLinear",t.matcapEncoding):"",t.envMap?Wn("envMapTexelToLinear",t.envMapEncoding):"",t.emissiveMap?Wn("emissiveMapTexelToLinear",t.emissiveMapEncoding):"",t.specularColorMap?Wn("specularColorMapTexelToLinear",t.specularColorMapEncoding):"",t.sheenColorMap?Wn("sheenColorMapTexelToLinear",t.sheenColorMapEncoding):"",t.lightMap?Wn("lightMapTexelToLinear",t.lightMapEncoding):"",xy("linearToOutputTexel",t.outputEncoding),t.depthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ns).join(`
`)),o=kl(o),o=mh(o,t),o=gh(o,t),a=kl(a),a=mh(a,t),a=gh(a,t),o=xh(o),a=xh(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,y=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,g=["#define varying in",t.glslVersion===Hl?"":"out highp vec4 pc_fragColor;",t.glslVersion===Hl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let _=x+y+o,v=x+g+a,M=fh(i,35633,_),T=fh(i,35632,v);if(i.attachShader(m,M),i.attachShader(m,T),t.index0AttributeName!==void 0?i.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m),r.debug.checkShaderErrors){let I=i.getProgramInfoLog(m).trim(),L=i.getShaderInfoLog(M).trim(),R=i.getShaderInfoLog(T).trim(),W=!0,D=!0;if(i.getProgramParameter(m,35714)===!1){W=!1;let F=ph(i,M,"vertex"),U=ph(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,35715)+`

Program Info Log: `+I+`
`+F+`
`+U)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(L===""||R==="")&&(D=!1);D&&(this.diagnostics={runnable:W,programLog:I,vertexShader:{log:L,prefix:y},fragmentShader:{log:R,prefix:g}})}i.deleteShader(M),i.deleteShader(T);let w;this.getUniforms=function(){return w===void 0&&(w=new An(i,m)),w};let C;return this.getAttributes=function(){return C===void 0&&(C=wy(i,m)),C},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.name=t.shaderName,this.id=my++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=M,this.fragmentShader=T,this}function Iy(r,e,t,n,i,s,o){let a=[],l=i.isWebGL2,c=i.logarithmicDepthBuffer,f=i.floatVertexTextures,p=i.maxVertexUniforms,h=i.vertexTextures,u=i.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"},m=["precision","isWebGL2","supportsVertexTextures","outputEncoding","instancing","instancingColor","map","mapEncoding","matcap","matcapEncoding","envMap","envMapMode","envMapEncoding","envMapCubeUV","lightMap","lightMapEncoding","aoMap","emissiveMap","emissiveMapEncoding","bumpMap","normalMap","objectSpaceNormalMap","tangentSpaceNormalMap","clearcoat","clearcoatMap","clearcoatRoughnessMap","clearcoatNormalMap","displacementMap","specularMap",,"roughnessMap","metalnessMap","gradientMap","alphaMap","alphaTest","combine","vertexColors","vertexAlphas","vertexTangents","vertexUvs","uvsVertexOnly","fog","useFog","fogExp2","flatShading","sizeAttenuation","logarithmicDepthBuffer","skinning","maxBones","useVertexTexture","morphTargets","morphNormals","morphTargetsCount","premultipliedAlpha","numDirLights","numPointLights","numSpotLights","numHemiLights","numRectAreaLights","numDirLightShadows","numPointLightShadows","numSpotLightShadows","shadowMapEnabled","shadowMapType","toneMapping","physicallyCorrectLights","doubleSided","flipSided","numClippingPlanes","numClipIntersection","depthPacking","dithering","format","specularIntensityMap","specularColorMap","specularColorMapEncoding","transmission","transmissionMap","thicknessMap","sheen","sheenColorMap","sheenColorMapEncoding","sheenRoughnessMap"];function y(w){let I=w.skeleton.bones;if(f)return 1024;{let R=Math.floor((p-20)/4),W=Math.min(R,I.length);return W<I.length?(console.warn("THREE.WebGLRenderer: Skeleton has "+I.length+" bones. This GPU supports "+W+"."),0):W}}function g(w){let C;return w&&w.isTexture?C=w.encoding:w&&w.isWebGLRenderTarget?(console.warn("THREE.WebGLPrograms.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead."),C=w.texture.encoding):C=ft,l&&w&&w.isTexture&&w.format===ut&&w.type===on&&w.encoding===zn&&(C=ft),C}function x(w,C,I,L,R){let W=L.fog,D=w.isMeshStandardMaterial?L.environment:null,F=(w.isMeshStandardMaterial?t:e).get(w.envMap||D),U=d[w.type],z=R.isSkinnedMesh?y(R):0;w.precision!==null&&(u=i.getMaxPrecision(w.precision),u!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",u,"instead."));let B,Q;if(U){let J=Ot[U];B=J.vertexShader,Q=J.fragmentShader}else B=w.vertexShader,Q=w.fragmentShader;let ce=r.getRenderTarget(),ye=w.alphaTest>0,re=w.clearcoat>0;return{isWebGL2:l,shaderID:U,shaderName:w.type,vertexShader:B,fragmentShader:Q,defines:w.defines,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:u,instancing:R.isInstancedMesh===!0,instancingColor:R.isInstancedMesh===!0&&R.instanceColor!==null,supportsVertexTextures:h,outputEncoding:ce!==null?g(ce.texture):r.outputEncoding,map:!!w.map,mapEncoding:g(w.map),matcap:!!w.matcap,matcapEncoding:g(w.matcap),envMap:!!F,envMapMode:F&&F.mapping,envMapEncoding:g(F),envMapCubeUV:!!F&&(F.mapping===ws||F.mapping===Xr),lightMap:!!w.lightMap,lightMapEncoding:g(w.lightMap),aoMap:!!w.aoMap,emissiveMap:!!w.emissiveMap,emissiveMapEncoding:g(w.emissiveMap),bumpMap:!!w.bumpMap,normalMap:!!w.normalMap,objectSpaceNormalMap:w.normalMapType===Ud,tangentSpaceNormalMap:w.normalMapType===bi,clearcoat:re,clearcoatMap:re&&!!w.clearcoatMap,clearcoatRoughnessMap:re&&!!w.clearcoatRoughnessMap,clearcoatNormalMap:re&&!!w.clearcoatNormalMap,displacementMap:!!w.displacementMap,roughnessMap:!!w.roughnessMap,metalnessMap:!!w.metalnessMap,specularMap:!!w.specularMap,specularIntensityMap:!!w.specularIntensityMap,specularColorMap:!!w.specularColorMap,specularColorMapEncoding:g(w.specularColorMap),alphaMap:!!w.alphaMap,alphaTest:ye,gradientMap:!!w.gradientMap,sheen:w.sheen>0,sheenColorMap:!!w.sheenColorMap,sheenColorMapEncoding:g(w.sheenColorMap),sheenRoughnessMap:!!w.sheenRoughnessMap,transmission:w.transmission>0,transmissionMap:!!w.transmissionMap,thicknessMap:!!w.thicknessMap,combine:w.combine,vertexTangents:!!w.normalMap&&!!R.geometry&&!!R.geometry.attributes.tangent,vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!R.geometry&&!!R.geometry.attributes.color&&R.geometry.attributes.color.itemSize===4,vertexUvs:!!w.map||!!w.bumpMap||!!w.normalMap||!!w.specularMap||!!w.alphaMap||!!w.emissiveMap||!!w.roughnessMap||!!w.metalnessMap||!!w.clearcoatMap||!!w.clearcoatRoughnessMap||!!w.clearcoatNormalMap||!!w.displacementMap||!!w.transmissionMap||!!w.thicknessMap||!!w.specularIntensityMap||!!w.specularColorMap||!!w.sheenColorMap||w.sheenRoughnessMap,uvsVertexOnly:!(w.map||w.bumpMap||w.normalMap||w.specularMap||w.alphaMap||w.emissiveMap||w.roughnessMap||w.metalnessMap||w.clearcoatNormalMap||w.transmission>0||w.transmissionMap||w.thicknessMap||w.specularIntensityMap||w.specularColorMap||!!w.sheen>0||w.sheenColorMap||w.sheenRoughnessMap)&&!!w.displacementMap,fog:!!W,useFog:w.fog,fogExp2:W&&W.isFogExp2,flatShading:!!w.flatShading,sizeAttenuation:w.sizeAttenuation,logarithmicDepthBuffer:c,skinning:R.isSkinnedMesh===!0&&z>0,maxBones:z,useVertexTexture:f,morphTargets:!!R.geometry&&!!R.geometry.morphAttributes.position,morphNormals:!!R.geometry&&!!R.geometry.morphAttributes.normal,morphTargetsCount:R.geometry&&R.geometry.morphAttributes.position?R.geometry.morphAttributes.position.length:0,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,format:w.format,dithering:w.dithering,shadowMapEnabled:r.shadowMap.enabled&&I.length>0,shadowMapType:r.shadowMap.type,toneMapping:w.toneMapped?r.toneMapping:En,physicallyCorrectLights:r.physicallyCorrectLights,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===si,flipSided:w.side===Qe,depthPacking:w.depthPacking!==void 0?w.depthPacking:!1,index0AttributeName:w.index0AttributeName,extensionDerivatives:w.extensions&&w.extensions.derivatives,extensionFragDepth:w.extensions&&w.extensions.fragDepth,extensionDrawBuffers:w.extensions&&w.extensions.drawBuffers,extensionShaderTextureLOD:w.extensions&&w.extensions.shaderTextureLOD,rendererExtensionFragDepth:l||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:l||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:l||n.has("EXT_shader_texture_lod"),customProgramCacheKey:w.customProgramCacheKey()}}function _(w){let C=[];if(w.shaderID?C.push(w.shaderID):(C.push(kc(w.fragmentShader)),C.push(kc(w.vertexShader))),w.defines!==void 0)for(let I in w.defines)C.push(I),C.push(w.defines[I]);if(w.isRawShaderMaterial===!1){for(let I=0;I<m.length;I++)C.push(w[m[I]]);C.push(r.outputEncoding),C.push(r.gammaFactor)}return C.push(w.customProgramCacheKey),C.join()}function v(w){let C=d[w.type],I;if(C){let L=Ot[C];I=Xd.clone(L.uniforms)}else I=w.uniforms;return I}function M(w,C){let I;for(let L=0,R=a.length;L<R;L++){let W=a[L];if(W.cacheKey===C){I=W,++I.usedTimes;break}}return I===void 0&&(I=new Py(r,C,w,s),a.push(I)),I}function T(w){if(--w.usedTimes===0){let C=a.indexOf(w);a[C]=a[a.length-1],a.pop(),w.destroy()}}return{getParameters:x,getProgramCacheKey:_,getUniforms:v,acquireProgram:M,releaseProgram:T,programs:a}}function Dy(){let r=new WeakMap;function e(s){let o=r.get(s);return o===void 0&&(o={},r.set(s,o)),o}function t(s){r.delete(s)}function n(s,o,a){r.get(s)[o]=a}function i(){r=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function Fy(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.program!==e.program?r.program.id-e.program.id:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function vh(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function _h(r){let e=[],t=0,n=[],i=[],s=[],o={id:-1};function a(){t=0,n.length=0,i.length=0,s.length=0}function l(u,d,m,y,g,x){let _=e[t],v=r.get(m);return _===void 0?(_={id:u.id,object:u,geometry:d,material:m,program:v.program||o,groupOrder:y,renderOrder:u.renderOrder,z:g,group:x},e[t]=_):(_.id=u.id,_.object=u,_.geometry=d,_.material=m,_.program=v.program||o,_.groupOrder=y,_.renderOrder=u.renderOrder,_.z=g,_.group=x),t++,_}function c(u,d,m,y,g,x){let _=l(u,d,m,y,g,x);m.transmission>0?i.push(_):m.transparent===!0?s.push(_):n.push(_)}function f(u,d,m,y,g,x){let _=l(u,d,m,y,g,x);m.transmission>0?i.unshift(_):m.transparent===!0?s.unshift(_):n.unshift(_)}function p(u,d){n.length>1&&n.sort(u||Fy),i.length>1&&i.sort(d||vh),s.length>1&&s.sort(d||vh)}function h(){for(let u=t,d=e.length;u<d;u++){let m=e[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.program=null,m.group=null}}return{opaque:n,transmissive:i,transparent:s,init:a,push:c,unshift:f,finish:h,sort:p}}function Ny(r){let e=new WeakMap;function t(i,s){let o;return e.has(i)===!1?(o=new _h(r),e.set(i,[o])):s>=e.get(i).length?(o=new _h(r),e.get(i).push(o)):o=e.get(i)[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}function zy(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new b,color:new ne};break;case"SpotLight":t={position:new b,direction:new b,color:new ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new b,color:new ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new b,skyColor:new ne,groundColor:new ne};break;case"RectAreaLight":t={color:new ne,position:new b,halfWidth:new b,halfHeight:new b};break}return r[e.id]=t,t}}}function By(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}var Oy=0;function Uy(r,e){return(e.castShadow?1:0)-(r.castShadow?1:0)}function Hy(r,e){let t=new zy,n=By(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotShadow:[],spotShadowMap:[],spotShadowMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[]};for(let f=0;f<9;f++)i.probe.push(new b);let s=new b,o=new he,a=new he;function l(f,p){let h=0,u=0,d=0;for(let I=0;I<9;I++)i.probe[I].set(0,0,0);let m=0,y=0,g=0,x=0,_=0,v=0,M=0,T=0;f.sort(Uy);let w=p!==!0?Math.PI:1;for(let I=0,L=f.length;I<L;I++){let R=f[I],W=R.color,D=R.intensity,F=R.distance,U=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=W.r*D*w,u+=W.g*D*w,d+=W.b*D*w;else if(R.isLightProbe)for(let z=0;z<9;z++)i.probe[z].addScaledVector(R.sh.coefficients[z],D);else if(R.isDirectionalLight){let z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity*w),R.castShadow){let B=R.shadow,Q=n.get(R);Q.shadowBias=B.bias,Q.shadowNormalBias=B.normalBias,Q.shadowRadius=B.radius,Q.shadowMapSize=B.mapSize,i.directionalShadow[m]=Q,i.directionalShadowMap[m]=U,i.directionalShadowMatrix[m]=R.shadow.matrix,v++}i.directional[m]=z,m++}else if(R.isSpotLight){let z=t.get(R);if(z.position.setFromMatrixPosition(R.matrixWorld),z.color.copy(W).multiplyScalar(D*w),z.distance=F,z.coneCos=Math.cos(R.angle),z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),z.decay=R.decay,R.castShadow){let B=R.shadow,Q=n.get(R);Q.shadowBias=B.bias,Q.shadowNormalBias=B.normalBias,Q.shadowRadius=B.radius,Q.shadowMapSize=B.mapSize,i.spotShadow[g]=Q,i.spotShadowMap[g]=U,i.spotShadowMatrix[g]=R.shadow.matrix,T++}i.spot[g]=z,g++}else if(R.isRectAreaLight){let z=t.get(R);z.color.copy(W).multiplyScalar(D),z.halfWidth.set(R.width*.5,0,0),z.halfHeight.set(0,R.height*.5,0),i.rectArea[x]=z,x++}else if(R.isPointLight){let z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity*w),z.distance=R.distance,z.decay=R.decay,R.castShadow){let B=R.shadow,Q=n.get(R);Q.shadowBias=B.bias,Q.shadowNormalBias=B.normalBias,Q.shadowRadius=B.radius,Q.shadowMapSize=B.mapSize,Q.shadowCameraNear=B.camera.near,Q.shadowCameraFar=B.camera.far,i.pointShadow[y]=Q,i.pointShadowMap[y]=U,i.pointShadowMatrix[y]=R.shadow.matrix,M++}i.point[y]=z,y++}else if(R.isHemisphereLight){let z=t.get(R);z.skyColor.copy(R.color).multiplyScalar(D*w),z.groundColor.copy(R.groundColor).multiplyScalar(D*w),i.hemi[_]=z,_++}}x>0&&(e.isWebGL2||r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=te.LTC_FLOAT_1,i.rectAreaLTC2=te.LTC_FLOAT_2):r.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=te.LTC_HALF_1,i.rectAreaLTC2=te.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;let C=i.hash;(C.directionalLength!==m||C.pointLength!==y||C.spotLength!==g||C.rectAreaLength!==x||C.hemiLength!==_||C.numDirectionalShadows!==v||C.numPointShadows!==M||C.numSpotShadows!==T)&&(i.directional.length=m,i.spot.length=g,i.rectArea.length=x,i.point.length=y,i.hemi.length=_,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=T,i.spotShadowMap.length=T,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=M,i.spotShadowMatrix.length=T,C.directionalLength=m,C.pointLength=y,C.spotLength=g,C.rectAreaLength=x,C.hemiLength=_,C.numDirectionalShadows=v,C.numPointShadows=M,C.numSpotShadows=T,i.version=Oy++)}function c(f,p){let h=0,u=0,d=0,m=0,y=0,g=p.matrixWorldInverse;for(let x=0,_=f.length;x<_;x++){let v=f[x];if(v.isDirectionalLight){let M=i.directional[h];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),h++}else if(v.isSpotLight){let M=i.spot[d];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),d++}else if(v.isRectAreaLight){let M=i.rectArea[m];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),a.identity(),o.copy(v.matrixWorld),o.premultiply(g),a.extractRotation(o),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),m++}else if(v.isPointLight){let M=i.point[u];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),u++}else if(v.isHemisphereLight){let M=i.hemi[y];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(g),M.direction.normalize(),y++}}}return{setup:l,setupView:c,state:i}}function wh(r,e){let t=new Hy(r,e),n=[],i=[];function s(){n.length=0,i.length=0}function o(p){n.push(p)}function a(p){i.push(p)}function l(p){t.setup(n,p)}function c(p){t.setupView(n,p)}return{init:s,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function Gy(r,e){let t=new WeakMap;function n(s,o=0){let a;return t.has(s)===!1?(a=new wh(r,e),t.set(s,[a])):o>=t.get(s).length?(a=new wh(r,e),t.get(s).push(a)):a=t.get(s)[o],a}function i(){t=new WeakMap}return{get:n,dispose:i}}var rs=class extends nt{constructor(e){super(),this.type="MeshDepthMaterial",this.depthPacking=Bd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}};rs.prototype.isMeshDepthMaterial=!0;var os=class extends nt{constructor(e){super(),this.type="MeshDistanceMaterial",this.referencePosition=new b,this.nearDistance=1,this.farDistance=1e3,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.referencePosition.copy(e.referencePosition),this.nearDistance=e.nearDistance,this.farDistance=e.farDistance,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};os.prototype.isMeshDistanceMaterial=!0;var ky=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function nf(r,e,t){let n=new ai,i=new X,s=new X,o=new Be,a=new rs({depthPacking:Od}),l=new os,c={},f=t.maxTextureSize,p={0:Qe,1:ii,2:si},h=new Ht({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new X},radius:{value:4}},vertexShader:ky,fragmentShader:Vy}),u=h.clone();u.defines.HORIZONTAL_PASS=1;let d=new _e;d.setAttribute("position",new Pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let m=new Je(d,h),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gc,this.render=function(v,M,T){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||v.length===0)return;let w=r.getRenderTarget(),C=r.getActiveCubeFace(),I=r.getActiveMipmapLevel(),L=r.state;L.setBlending(sn),L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);for(let R=0,W=v.length;R<W;R++){let D=v[R],F=D.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",D,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;i.copy(F.mapSize);let U=F.getFrameExtents();if(i.multiply(U),s.copy(F.mapSize),(i.x>f||i.y>f)&&(i.x>f&&(s.x=Math.floor(f/U.x),i.x=s.x*U.x,F.mapSize.x=s.x),i.y>f&&(s.y=Math.floor(f/U.y),i.y=s.y*U.y,F.mapSize.y=s.y)),F.map===null&&!F.isPointLightShadow&&this.type===Vi){let B={minFilter:st,magFilter:st,format:ut};F.map=new Tt(i.x,i.y,B),F.map.texture.name=D.name+".shadowMap",F.mapPass=new Tt(i.x,i.y,B),F.camera.updateProjectionMatrix()}if(F.map===null){let B={minFilter:tt,magFilter:tt,format:ut};F.map=new Tt(i.x,i.y,B),F.map.texture.name=D.name+".shadowMap",F.camera.updateProjectionMatrix()}r.setRenderTarget(F.map),r.clear();let z=F.getViewportCount();for(let B=0;B<z;B++){let Q=F.getViewport(B);o.set(s.x*Q.x,s.y*Q.y,s.x*Q.z,s.y*Q.w),L.viewport(o),F.updateMatrices(D,B),n=F.getFrustum(),_(M,T,F.camera,D,this.type)}!F.isPointLightShadow&&this.type===Vi&&g(F,T),F.needsUpdate=!1}y.needsUpdate=!1,r.setRenderTarget(w,C,I)};function g(v,M){let T=e.update(m);h.defines.VSM_SAMPLES!==v.blurSamples&&(h.defines.VSM_SAMPLES=v.blurSamples,u.defines.VSM_SAMPLES=v.blurSamples,h.needsUpdate=!0,u.needsUpdate=!0),h.uniforms.shadow_pass.value=v.map.texture,h.uniforms.resolution.value=v.mapSize,h.uniforms.radius.value=v.radius,r.setRenderTarget(v.mapPass),r.clear(),r.renderBufferDirect(M,null,T,h,m,null),u.uniforms.shadow_pass.value=v.mapPass.texture,u.uniforms.resolution.value=v.mapSize,u.uniforms.radius.value=v.radius,r.setRenderTarget(v.map),r.clear(),r.renderBufferDirect(M,null,T,u,m,null)}function x(v,M,T,w,C,I,L){let R=null,W=w.isPointLight===!0?v.customDistanceMaterial:v.customDepthMaterial;if(W!==void 0?R=W:R=w.isPointLight===!0?l:a,r.localClippingEnabled&&T.clipShadows===!0&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0){let D=R.uuid,F=T.uuid,U=c[D];U===void 0&&(U={},c[D]=U);let z=U[F];z===void 0&&(z=R.clone(),U[F]=z),R=z}return R.visible=T.visible,R.wireframe=T.wireframe,L===Vi?R.side=T.shadowSide!==null?T.shadowSide:T.side:R.side=T.shadowSide!==null?T.shadowSide:p[T.side],R.alphaMap=T.alphaMap,R.alphaTest=T.alphaTest,R.clipShadows=T.clipShadows,R.clippingPlanes=T.clippingPlanes,R.clipIntersection=T.clipIntersection,R.displacementMap=T.displacementMap,R.displacementScale=T.displacementScale,R.displacementBias=T.displacementBias,R.wireframeLinewidth=T.wireframeLinewidth,R.linewidth=T.linewidth,w.isPointLight===!0&&R.isMeshDistanceMaterial===!0&&(R.referencePosition.setFromMatrixPosition(w.matrixWorld),R.nearDistance=C,R.farDistance=I),R}function _(v,M,T,w,C){if(v.visible===!1)return;if(v.layers.test(M.layers)&&(v.isMesh||v.isLine||v.isPoints)&&(v.castShadow||v.receiveShadow&&C===Vi)&&(!v.frustumCulled||n.intersectsObject(v))){v.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,v.matrixWorld);let R=e.update(v),W=v.material;if(Array.isArray(W)){let D=R.groups;for(let F=0,U=D.length;F<U;F++){let z=D[F],B=W[z.materialIndex];if(B&&B.visible){let Q=x(v,R,B,w,T.near,T.far,C);r.renderBufferDirect(T,null,R,Q,v,z)}}}else if(W.visible){let D=x(v,R,W,w,T.near,T.far,C);r.renderBufferDirect(T,null,R,D,v,null)}}let L=v.children;for(let R=0,W=L.length;R<W;R++)_(L[R],M,T,w,C)}}function Wy(r,e,t){let n=t.isWebGL2;function i(){let P=!1,se=new Be,Y=null,ge=new Be(0,0,0,0);return{setMask:function(ue){Y!==ue&&!P&&(r.colorMask(ue,ue,ue,ue),Y=ue)},setLocked:function(ue){P=ue},setClear:function(ue,De,mt,gt,mn){mn===!0&&(ue*=gt,De*=gt,mt*=gt),se.set(ue,De,mt,gt),ge.equals(se)===!1&&(r.clearColor(ue,De,mt,gt),ge.copy(se))},reset:function(){P=!1,Y=null,ge.set(-1,0,0,0)}}}function s(){let P=!1,se=null,Y=null,ge=null;return{setTest:function(ue){ue?K(2929):de(2929)},setMask:function(ue){se!==ue&&!P&&(r.depthMask(ue),se=ue)},setFunc:function(ue){if(Y!==ue){if(ue)switch(ue){case Tu:r.depthFunc(512);break;case Au:r.depthFunc(519);break;case Cu:r.depthFunc(513);break;case Ho:r.depthFunc(515);break;case Ru:r.depthFunc(514);break;case Lu:r.depthFunc(518);break;case Pu:r.depthFunc(516);break;case Iu:r.depthFunc(517);break;default:r.depthFunc(515)}else r.depthFunc(515);Y=ue}},setLocked:function(ue){P=ue},setClear:function(ue){ge!==ue&&(r.clearDepth(ue),ge=ue)},reset:function(){P=!1,se=null,Y=null,ge=null}}}function o(){let P=!1,se=null,Y=null,ge=null,ue=null,De=null,mt=null,gt=null,mn=null;return{setTest:function(Ze){P||(Ze?K(2960):de(2960))},setMask:function(Ze){se!==Ze&&!P&&(r.stencilMask(Ze),se=Ze)},setFunc:function(Ze,Zt,Dt){(Y!==Ze||ge!==Zt||ue!==Dt)&&(r.stencilFunc(Ze,Zt,Dt),Y=Ze,ge=Zt,ue=Dt)},setOp:function(Ze,Zt,Dt){(De!==Ze||mt!==Zt||gt!==Dt)&&(r.stencilOp(Ze,Zt,Dt),De=Ze,mt=Zt,gt=Dt)},setLocked:function(Ze){P=Ze},setClear:function(Ze){mn!==Ze&&(r.clearStencil(Ze),mn=Ze)},reset:function(){P=!1,se=null,Y=null,ge=null,ue=null,De=null,mt=null,gt=null,mn=null}}}let a=new i,l=new s,c=new o,f={},p=null,h={},u=null,d=!1,m=null,y=null,g=null,x=null,_=null,v=null,M=null,T=!1,w=null,C=null,I=null,L=null,R=null,W=r.getParameter(35661),D=!1,F=0,U=r.getParameter(7938);U.indexOf("WebGL")!==-1?(F=parseFloat(/^WebGL (\d)/.exec(U)[1]),D=F>=1):U.indexOf("OpenGL ES")!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),D=F>=2);let z=null,B={},Q=r.getParameter(3088),ce=r.getParameter(2978),ye=new Be().fromArray(Q),re=new Be().fromArray(ce);function Te(P,se,Y){let ge=new Uint8Array(4),ue=r.createTexture();r.bindTexture(P,ue),r.texParameteri(P,10241,9728),r.texParameteri(P,10240,9728);for(let De=0;De<Y;De++)r.texImage2D(se+De,0,6408,1,1,0,6408,5121,ge);return ue}let J={};J[3553]=Te(3553,3553,1),J[34067]=Te(34067,34069,6),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),K(2929),l.setFunc(Ho),Z(!1),ee(Sl),K(2884),Ce(sn);function K(P){f[P]!==!0&&(r.enable(P),f[P]=!0)}function de(P){f[P]!==!1&&(r.disable(P),f[P]=!1)}function k(P){P!==p&&(r.bindFramebuffer(36160,P),p=P)}function ve(P,se){return se===null&&p!==null&&(se=p),h[P]!==se?(r.bindFramebuffer(P,se),h[P]=se,n&&(P===36009&&(h[36160]=se),P===36160&&(h[36009]=se)),!0):!1}function Se(P){return u!==P?(r.useProgram(P),u=P,!0):!1}let oe={[$n]:32774,[mu]:32778,[gu]:32779};if(n)oe[Cl]=32775,oe[Rl]=32776;else{let P=e.get("EXT_blend_minmax");P!==null&&(oe[Cl]=P.MIN_EXT,oe[Rl]=P.MAX_EXT)}let fe={[xu]:0,[yu]:1,[vu]:768,[yc]:770,[Eu]:776,[bu]:774,[wu]:772,[_u]:769,[vc]:771,[Su]:775,[Mu]:773};function Ce(P,se,Y,ge,ue,De,mt,gt){if(P===sn){d===!0&&(de(3042),d=!1);return}if(d===!1&&(K(3042),d=!0),P!==pu){if(P!==m||gt!==T){if((y!==$n||_!==$n)&&(r.blendEquation(32774),y=$n,_=$n),gt)switch(P){case qi:r.blendFuncSeparate(1,771,1,771);break;case El:r.blendFunc(1,1);break;case Tl:r.blendFuncSeparate(0,0,769,771);break;case Al:r.blendFuncSeparate(0,768,0,770);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case qi:r.blendFuncSeparate(770,771,1,771);break;case El:r.blendFunc(770,1);break;case Tl:r.blendFunc(0,769);break;case Al:r.blendFunc(0,768);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}g=null,x=null,v=null,M=null,m=P,T=gt}return}ue=ue||se,De=De||Y,mt=mt||ge,(se!==y||ue!==_)&&(r.blendEquationSeparate(oe[se],oe[ue]),y=se,_=ue),(Y!==g||ge!==x||De!==v||mt!==M)&&(r.blendFuncSeparate(fe[Y],fe[ge],fe[De],fe[mt]),g=Y,x=ge,v=De,M=mt),m=P,T=null}function V(P,se){P.side===si?de(2884):K(2884);let Y=P.side===Qe;se&&(Y=!Y),Z(Y),P.blending===qi&&P.transparent===!1?Ce(sn):Ce(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.premultipliedAlpha),l.setFunc(P.depthFunc),l.setTest(P.depthTest),l.setMask(P.depthWrite),a.setMask(P.colorWrite);let ge=P.stencilWrite;c.setTest(ge),ge&&(c.setMask(P.stencilWriteMask),c.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),c.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),ie(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?K(32926):de(32926)}function Z(P){w!==P&&(P?r.frontFace(2304):r.frontFace(2305),w=P)}function ee(P){P!==uu?(K(2884),P!==C&&(P===Sl?r.cullFace(1029):P===du?r.cullFace(1028):r.cullFace(1032))):de(2884),C=P}function pe(P){P!==I&&(D&&r.lineWidth(P),I=P)}function ie(P,se,Y){P?(K(32823),(L!==se||R!==Y)&&(r.polygonOffset(se,Y),L=se,R=Y)):de(32823)}function A(P){P?K(3089):de(3089)}function S(P){P===void 0&&(P=33984+W-1),z!==P&&(r.activeTexture(P),z=P)}function G(P,se){z===null&&S();let Y=B[z];Y===void 0&&(Y={type:void 0,texture:void 0},B[z]=Y),(Y.type!==P||Y.texture!==se)&&(r.bindTexture(P,se||J[P]),Y.type=P,Y.texture=se)}function $(){let P=B[z];P!==void 0&&P.type!==void 0&&(r.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function j(){try{r.compressedTexImage2D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ae(){try{r.texImage2D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Me(){try{r.texImage3D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function xe(P){ye.equals(P)===!1&&(r.scissor(P.x,P.y,P.z,P.w),ye.copy(P))}function Ee(P){re.equals(P)===!1&&(r.viewport(P.x,P.y,P.z,P.w),re.copy(P))}function me(){r.disable(3042),r.disable(2884),r.disable(2929),r.disable(32823),r.disable(3089),r.disable(2960),r.disable(32926),r.blendEquation(32774),r.blendFunc(1,0),r.blendFuncSeparate(1,0,1,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(513),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(519,0,4294967295),r.stencilOp(7680,7680,7680),r.clearStencil(0),r.cullFace(1029),r.frontFace(2305),r.polygonOffset(0,0),r.activeTexture(33984),r.bindFramebuffer(36160,null),n===!0&&(r.bindFramebuffer(36009,null),r.bindFramebuffer(36008,null)),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),f={},z=null,B={},p=null,h={},u=null,d=!1,m=null,y=null,g=null,x=null,_=null,v=null,M=null,T=!1,w=null,C=null,I=null,L=null,R=null,ye.set(0,0,r.canvas.width,r.canvas.height),re.set(0,0,r.canvas.width,r.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:K,disable:de,bindFramebuffer:ve,bindXRFramebuffer:k,useProgram:Se,setBlending:Ce,setMaterial:V,setFlipSided:Z,setCullFace:ee,setLineWidth:pe,setPolygonOffset:ie,setScissorTest:A,activeTexture:S,bindTexture:G,unbindTexture:$,compressedTexImage2D:j,texImage2D:ae,texImage3D:Me,scissor:xe,viewport:Ee,reset:me}}function Xy(r,e,t,n,i,s,o){let a=i.isWebGL2,l=i.maxTextures,c=i.maxCubemapSize,f=i.maxTextureSize,p=i.maxSamples,h=new WeakMap,u,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,S){return d?new OffscreenCanvas(A,S):Oa("canvas")}function y(A,S,G,$){let j=1;if((A.width>$||A.height>$)&&(j=$/Math.max(A.width,A.height)),j<1||S===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){let ae=S?kd:Math.floor,Me=ae(j*A.width),xe=ae(j*A.height);u===void 0&&(u=m(Me,xe));let Ee=G?m(Me,xe):u;return Ee.width=Me,Ee.height=xe,Ee.getContext("2d").drawImage(A,0,0,Me,xe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+Me+"x"+xe+")."),Ee}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function g(A){return Gl(A.width)&&Gl(A.height)}function x(A){return a?!1:A.wrapS!==ht||A.wrapT!==ht||A.minFilter!==tt&&A.minFilter!==st}function _(A,S){return A.generateMipmaps&&S&&A.minFilter!==tt&&A.minFilter!==st}function v(A,S,G,$,j=1){r.generateMipmap(A);let ae=n.get(S);ae.__maxMipLevel=Math.log2(Math.max(G,$,j))}function M(A,S,G,$){if(a===!1)return S;if(A!==null){if(r[A]!==void 0)return r[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let j=S;return S===6403&&(G===5126&&(j=33326),G===5131&&(j=33325),G===5121&&(j=33321)),S===6407&&(G===5126&&(j=34837),G===5131&&(j=34843),G===5121&&(j=32849)),S===6408&&(G===5126&&(j=34836),G===5131&&(j=34842),G===5121&&(j=$===zn?35907:32856)),(j===33325||j===33326||j===34842||j===34836)&&e.get("EXT_color_buffer_float"),j}function T(A){return A===tt||A===Go||A===ko?9728:9729}function w(A){let S=A.target;S.removeEventListener("dispose",w),I(S),S.isVideoTexture&&h.delete(S),o.memory.textures--}function C(A){let S=A.target;S.removeEventListener("dispose",C),L(S)}function I(A){let S=n.get(A);S.__webglInit!==void 0&&(r.deleteTexture(S.__webglTexture),n.remove(A))}function L(A){let S=A.texture,G=n.get(A),$=n.get(S);if(A){if($.__webglTexture!==void 0&&(r.deleteTexture($.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let j=0;j<6;j++)r.deleteFramebuffer(G.__webglFramebuffer[j]),G.__webglDepthbuffer&&r.deleteRenderbuffer(G.__webglDepthbuffer[j]);else r.deleteFramebuffer(G.__webglFramebuffer),G.__webglDepthbuffer&&r.deleteRenderbuffer(G.__webglDepthbuffer),G.__webglMultisampledFramebuffer&&r.deleteFramebuffer(G.__webglMultisampledFramebuffer),G.__webglColorRenderbuffer&&r.deleteRenderbuffer(G.__webglColorRenderbuffer),G.__webglDepthRenderbuffer&&r.deleteRenderbuffer(G.__webglDepthRenderbuffer);if(A.isWebGLMultipleRenderTargets)for(let j=0,ae=S.length;j<ae;j++){let Me=n.get(S[j]);Me.__webglTexture&&(r.deleteTexture(Me.__webglTexture),o.memory.textures--),n.remove(S[j])}n.remove(S),n.remove(A)}}let R=0;function W(){R=0}function D(){let A=R;return A>=l&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+l),R+=1,A}function F(A,S){let G=n.get(A);if(A.isVideoTexture&&V(A),A.version>0&&G.__version!==A.version){let $=A.image;if($===void 0)console.warn("THREE.WebGLRenderer: Texture marked for update but image is undefined");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Te(G,A,S);return}}t.activeTexture(33984+S),t.bindTexture(3553,G.__webglTexture)}function U(A,S){let G=n.get(A);if(A.version>0&&G.__version!==A.version){Te(G,A,S);return}t.activeTexture(33984+S),t.bindTexture(35866,G.__webglTexture)}function z(A,S){let G=n.get(A);if(A.version>0&&G.__version!==A.version){Te(G,A,S);return}t.activeTexture(33984+S),t.bindTexture(32879,G.__webglTexture)}function B(A,S){let G=n.get(A);if(A.version>0&&G.__version!==A.version){J(G,A,S);return}t.activeTexture(33984+S),t.bindTexture(34067,G.__webglTexture)}let Q={[Vs]:10497,[ht]:33071,[Ws]:33648},ce={[tt]:9728,[Go]:9984,[ko]:9986,[st]:9729,[_c]:9985,[Mi]:9987};function ye(A,S,G){if(G?(r.texParameteri(A,10242,Q[S.wrapS]),r.texParameteri(A,10243,Q[S.wrapT]),(A===32879||A===35866)&&r.texParameteri(A,32882,Q[S.wrapR]),r.texParameteri(A,10240,ce[S.magFilter]),r.texParameteri(A,10241,ce[S.minFilter])):(r.texParameteri(A,10242,33071),r.texParameteri(A,10243,33071),(A===32879||A===35866)&&r.texParameteri(A,32882,33071),(S.wrapS!==ht||S.wrapT!==ht)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),r.texParameteri(A,10240,T(S.magFilter)),r.texParameteri(A,10241,T(S.minFilter)),S.minFilter!==tt&&S.minFilter!==st&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),e.has("EXT_texture_filter_anisotropic")===!0){let $=e.get("EXT_texture_filter_anisotropic");if(S.type===Wt&&e.has("OES_texture_float_linear")===!1||a===!1&&S.type===Kn&&e.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||n.get(S).__currentAnisotropy)&&(r.texParameterf(A,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy)}}function re(A,S){A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",w),A.__webglTexture=r.createTexture(),o.memory.textures++)}function Te(A,S,G){let $=3553;S.isDataTexture2DArray&&($=35866),S.isDataTexture3D&&($=32879),re(A,S),t.activeTexture(33984+G),t.bindTexture($,A.__webglTexture),r.pixelStorei(37440,S.flipY),r.pixelStorei(37441,S.premultiplyAlpha),r.pixelStorei(3317,S.unpackAlignment),r.pixelStorei(37443,0);let j=x(S)&&g(S.image)===!1,ae=y(S.image,j,!1,f),Me=g(ae)||a,xe=s.convert(S.format),Ee=s.convert(S.type),me=M(S.internalFormat,xe,Ee,S.encoding);ye($,S,Me);let P,se=S.mipmaps;if(S.isDepthTexture)me=6402,a?S.type===Wt?me=36012:S.type===zs?me=33190:S.type===Yi?me=35056:me=33189:S.type===Wt&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===ti&&me===6402&&S.type!==Xs&&S.type!==zs&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=Xs,Ee=s.convert(S.type)),S.format===Zi&&me===6402&&(me=34041,S.type!==Yi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=Yi,Ee=s.convert(S.type))),t.texImage2D(3553,0,me,ae.width,ae.height,0,xe,Ee,null);else if(S.isDataTexture)if(se.length>0&&Me){for(let Y=0,ge=se.length;Y<ge;Y++)P=se[Y],t.texImage2D(3553,Y,me,P.width,P.height,0,xe,Ee,P.data);S.generateMipmaps=!1,A.__maxMipLevel=se.length-1}else t.texImage2D(3553,0,me,ae.width,ae.height,0,xe,Ee,ae.data),A.__maxMipLevel=0;else if(S.isCompressedTexture){for(let Y=0,ge=se.length;Y<ge;Y++)P=se[Y],S.format!==ut&&S.format!==ei?xe!==null?t.compressedTexImage2D(3553,Y,me,P.width,P.height,0,P.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):t.texImage2D(3553,Y,me,P.width,P.height,0,xe,Ee,P.data);A.__maxMipLevel=se.length-1}else if(S.isDataTexture2DArray)t.texImage3D(35866,0,me,ae.width,ae.height,ae.depth,0,xe,Ee,ae.data),A.__maxMipLevel=0;else if(S.isDataTexture3D)t.texImage3D(32879,0,me,ae.width,ae.height,ae.depth,0,xe,Ee,ae.data),A.__maxMipLevel=0;else if(se.length>0&&Me){for(let Y=0,ge=se.length;Y<ge;Y++)P=se[Y],t.texImage2D(3553,Y,me,xe,Ee,P);S.generateMipmaps=!1,A.__maxMipLevel=se.length-1}else t.texImage2D(3553,0,me,xe,Ee,ae),A.__maxMipLevel=0;_(S,Me)&&v($,S,ae.width,ae.height),A.__version=S.version,S.onUpdate&&S.onUpdate(S)}function J(A,S,G){if(S.image.length!==6)return;re(A,S),t.activeTexture(33984+G),t.bindTexture(34067,A.__webglTexture),r.pixelStorei(37440,S.flipY),r.pixelStorei(37441,S.premultiplyAlpha),r.pixelStorei(3317,S.unpackAlignment),r.pixelStorei(37443,0);let $=S&&(S.isCompressedTexture||S.image[0].isCompressedTexture),j=S.image[0]&&S.image[0].isDataTexture,ae=[];for(let Y=0;Y<6;Y++)!$&&!j?ae[Y]=y(S.image[Y],!1,!0,c):ae[Y]=j?S.image[Y].image:S.image[Y];let Me=ae[0],xe=g(Me)||a,Ee=s.convert(S.format),me=s.convert(S.type),P=M(S.internalFormat,Ee,me,S.encoding);ye(34067,S,xe);let se;if($){for(let Y=0;Y<6;Y++){se=ae[Y].mipmaps;for(let ge=0;ge<se.length;ge++){let ue=se[ge];S.format!==ut&&S.format!==ei?Ee!==null?t.compressedTexImage2D(34069+Y,ge,P,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):t.texImage2D(34069+Y,ge,P,ue.width,ue.height,0,Ee,me,ue.data)}}A.__maxMipLevel=se.length-1}else{se=S.mipmaps;for(let Y=0;Y<6;Y++)if(j){t.texImage2D(34069+Y,0,P,ae[Y].width,ae[Y].height,0,Ee,me,ae[Y].data);for(let ge=0;ge<se.length;ge++){let De=se[ge].image[Y].image;t.texImage2D(34069+Y,ge+1,P,De.width,De.height,0,Ee,me,De.data)}}else{t.texImage2D(34069+Y,0,P,Ee,me,ae[Y]);for(let ge=0;ge<se.length;ge++){let ue=se[ge];t.texImage2D(34069+Y,ge+1,P,Ee,me,ue.image[Y])}}A.__maxMipLevel=se.length}_(S,xe)&&v(34067,S,Me.width,Me.height),A.__version=S.version,S.onUpdate&&S.onUpdate(S)}function K(A,S,G,$,j){let ae=s.convert(G.format),Me=s.convert(G.type),xe=M(G.internalFormat,ae,Me,G.encoding);j===32879||j===35866?t.texImage3D(j,0,xe,S.width,S.height,S.depth,0,ae,Me,null):t.texImage2D(j,0,xe,S.width,S.height,0,ae,Me,null),t.bindFramebuffer(36160,A),r.framebufferTexture2D(36160,$,j,n.get(G).__webglTexture,0),t.bindFramebuffer(36160,null)}function de(A,S,G){if(r.bindRenderbuffer(36161,A),S.depthBuffer&&!S.stencilBuffer){let $=33189;if(G){let j=S.depthTexture;j&&j.isDepthTexture&&(j.type===Wt?$=36012:j.type===zs&&($=33190));let ae=Ce(S);r.renderbufferStorageMultisample(36161,ae,$,S.width,S.height)}else r.renderbufferStorage(36161,$,S.width,S.height);r.framebufferRenderbuffer(36160,36096,36161,A)}else if(S.depthBuffer&&S.stencilBuffer){if(G){let $=Ce(S);r.renderbufferStorageMultisample(36161,$,35056,S.width,S.height)}else r.renderbufferStorage(36161,34041,S.width,S.height);r.framebufferRenderbuffer(36160,33306,36161,A)}else{let $=S.isWebGLMultipleRenderTargets===!0?S.texture[0]:S.texture,j=s.convert($.format),ae=s.convert($.type),Me=M($.internalFormat,j,ae,$.encoding);if(G){let xe=Ce(S);r.renderbufferStorageMultisample(36161,xe,Me,S.width,S.height)}else r.renderbufferStorage(36161,Me,S.width,S.height)}r.bindRenderbuffer(36161,null)}function k(A,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(36160,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),F(S.depthTexture,0);let $=n.get(S.depthTexture).__webglTexture;if(S.depthTexture.format===ti)r.framebufferTexture2D(36160,36096,3553,$,0);else if(S.depthTexture.format===Zi)r.framebufferTexture2D(36160,33306,3553,$,0);else throw new Error("Unknown depthTexture format")}function ve(A){let S=n.get(A),G=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture){if(G)throw new Error("target.depthTexture not supported in Cube render targets");k(S.__webglFramebuffer,A)}else if(G){S.__webglDepthbuffer=[];for(let $=0;$<6;$++)t.bindFramebuffer(36160,S.__webglFramebuffer[$]),S.__webglDepthbuffer[$]=r.createRenderbuffer(),de(S.__webglDepthbuffer[$],A,!1)}else t.bindFramebuffer(36160,S.__webglFramebuffer),S.__webglDepthbuffer=r.createRenderbuffer(),de(S.__webglDepthbuffer,A,!1);t.bindFramebuffer(36160,null)}function Se(A){let S=A.texture,G=n.get(A),$=n.get(S);A.addEventListener("dispose",C),A.isWebGLMultipleRenderTargets!==!0&&($.__webglTexture=r.createTexture(),$.__version=S.version,o.memory.textures++);let j=A.isWebGLCubeRenderTarget===!0,ae=A.isWebGLMultipleRenderTargets===!0,Me=A.isWebGLMultisampleRenderTarget===!0,xe=S.isDataTexture3D||S.isDataTexture2DArray,Ee=g(A)||a;if(a&&S.format===ei&&(S.type===Wt||S.type===Kn)&&(S.format=ut,console.warn("THREE.WebGLRenderer: Rendering to textures with RGB format is not supported. Using RGBA format instead.")),j){G.__webglFramebuffer=[];for(let me=0;me<6;me++)G.__webglFramebuffer[me]=r.createFramebuffer()}else if(G.__webglFramebuffer=r.createFramebuffer(),ae)if(i.drawBuffers){let me=A.texture;for(let P=0,se=me.length;P<se;P++){let Y=n.get(me[P]);Y.__webglTexture===void 0&&(Y.__webglTexture=r.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");else if(Me)if(a){G.__webglMultisampledFramebuffer=r.createFramebuffer(),G.__webglColorRenderbuffer=r.createRenderbuffer(),r.bindRenderbuffer(36161,G.__webglColorRenderbuffer);let me=s.convert(S.format),P=s.convert(S.type),se=M(S.internalFormat,me,P,S.encoding),Y=Ce(A);r.renderbufferStorageMultisample(36161,Y,se,A.width,A.height),t.bindFramebuffer(36160,G.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(36160,36064,36161,G.__webglColorRenderbuffer),r.bindRenderbuffer(36161,null),A.depthBuffer&&(G.__webglDepthRenderbuffer=r.createRenderbuffer(),de(G.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(36160,null)}else console.warn("THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.");if(j){t.bindTexture(34067,$.__webglTexture),ye(34067,S,Ee);for(let me=0;me<6;me++)K(G.__webglFramebuffer[me],A,S,36064,34069+me);_(S,Ee)&&v(34067,S,A.width,A.height),t.unbindTexture()}else if(ae){let me=A.texture;for(let P=0,se=me.length;P<se;P++){let Y=me[P],ge=n.get(Y);t.bindTexture(3553,ge.__webglTexture),ye(3553,Y,Ee),K(G.__webglFramebuffer,A,Y,36064+P,3553),_(Y,Ee)&&v(3553,Y,A.width,A.height)}t.unbindTexture()}else{let me=3553;xe&&(a?me=S.isDataTexture3D?32879:35866:console.warn("THREE.DataTexture3D and THREE.DataTexture2DArray only supported with WebGL2.")),t.bindTexture(me,$.__webglTexture),ye(me,S,Ee),K(G.__webglFramebuffer,A,S,36064,me),_(S,Ee)&&v(me,S,A.width,A.height,A.depth),t.unbindTexture()}A.depthBuffer&&ve(A)}function oe(A){let S=g(A)||a,G=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let $=0,j=G.length;$<j;$++){let ae=G[$];if(_(ae,S)){let Me=A.isWebGLCubeRenderTarget?34067:3553,xe=n.get(ae).__webglTexture;t.bindTexture(Me,xe),v(Me,ae,A.width,A.height),t.unbindTexture()}}}function fe(A){if(A.isWebGLMultisampleRenderTarget)if(a){let S=A.width,G=A.height,$=16384;A.depthBuffer&&($|=256),A.stencilBuffer&&($|=1024);let j=n.get(A);t.bindFramebuffer(36008,j.__webglMultisampledFramebuffer),t.bindFramebuffer(36009,j.__webglFramebuffer),r.blitFramebuffer(0,0,S,G,0,0,S,G,$,9728),t.bindFramebuffer(36008,null),t.bindFramebuffer(36009,j.__webglMultisampledFramebuffer)}else console.warn("THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.")}function Ce(A){return a&&A.isWebGLMultisampleRenderTarget?Math.min(p,A.samples):0}function V(A){let S=o.render.frame;h.get(A)!==S&&(h.set(A,S),A.update())}let Z=!1,ee=!1;function pe(A,S){A&&A.isWebGLRenderTarget&&(Z===!1&&(console.warn("THREE.WebGLTextures.safeSetTexture2D: don't use render targets as textures. Use their .texture property instead."),Z=!0),A=A.texture),F(A,S)}function ie(A,S){A&&A.isWebGLCubeRenderTarget&&(ee===!1&&(console.warn("THREE.WebGLTextures.safeSetTextureCube: don't use cube render targets as textures. Use their .texture property instead."),ee=!0),A=A.texture),B(A,S)}this.allocateTextureUnit=D,this.resetTextureUnits=W,this.setTexture2D=F,this.setTexture2DArray=U,this.setTexture3D=z,this.setTextureCube=B,this.setupRenderTarget=Se,this.updateRenderTargetMipmap=oe,this.updateMultisampleRenderTarget=fe,this.safeSetTexture2D=pe,this.safeSetTextureCube=ie}function sf(r,e,t){let n=t.isWebGL2;function i(s){let o;if(s===on)return 5121;if(s===Vu)return 32819;if(s===Wu)return 32820;if(s===Xu)return 33635;if(s===Hu)return 5120;if(s===Gu)return 5122;if(s===Xs)return 5123;if(s===ku)return 5124;if(s===zs)return 5125;if(s===Wt)return 5126;if(s===Kn)return n?5131:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(s===qu)return 6406;if(s===ei)return 6407;if(s===ut)return 6408;if(s===Yu)return 6409;if(s===Ju)return 6410;if(s===ti)return 6402;if(s===Zi)return 34041;if(s===$u)return 6403;if(s===ju)return 36244;if(s===Qu)return 33319;if(s===Ku)return 33320;if(s===ed)return 36248;if(s===td)return 36249;if(s===Ll||s===Pl||s===Il||s===Dl)if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(s===Ll)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Pl)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Il)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Dl)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Fl||s===Nl||s===zl||s===Bl)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(s===Fl)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Nl)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===zl)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Bl)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===nd)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if((s===Ol||s===Ul)&&(o=e.get("WEBGL_compressed_texture_etc"),o!==null)){if(s===Ol)return o.COMPRESSED_RGB8_ETC2;if(s===Ul)return o.COMPRESSED_RGBA8_ETC2_EAC}if(s===id||s===sd||s===rd||s===od||s===ad||s===ld||s===cd||s===hd||s===ud||s===dd||s===fd||s===pd||s===md||s===gd||s===yd||s===vd||s===_d||s===wd||s===Md||s===bd||s===Sd||s===Ed||s===Td||s===Ad||s===Cd||s===Rd||s===Ld||s===Pd)return o=e.get("WEBGL_compressed_texture_astc"),o!==null?s:null;if(s===xd)return o=e.get("EXT_texture_compression_bptc"),o!==null?s:null;if(s===Yi)return n?34042:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null)}return{convert:i}}var Ks=class extends et{constructor(e=[]){super(),this.cameras=e}};Ks.prototype.isArrayCamera=!0;var nn=class extends Ie{constructor(){super(),this.type="Group"}};nn.prototype.isGroup=!0;var qy={type:"move"},Os=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new b,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new b),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new b,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new b),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred")if(a!==null&&(i=t.getPose(e.targetRaySpace,n),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(qy))),c&&e.hand){o=!0;for(let m of e.hand.values()){let y=t.getJointPose(m,n);if(c.joints[m.jointName]===void 0){let x=new nn;x.matrixAutoUpdate=!1,x.visible=!1,c.joints[m.jointName]=x,c.add(x)}let g=c.joints[m.jointName];y!==null&&(g.matrix.fromArray(y.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.jointRadius=y.radius),g.visible=y!==null}let f=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],h=f.position.distanceTo(p.position),u=.02,d=.005;c.inputState.pinching&&h>u+d?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=u-d&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}},Vl=class extends qt{constructor(e,t){super();let n=this,i=e.state,s=null,o=1,a=null,l="local-floor",c=null,f=null,p=null,h=null,u=null,d=!1,m=null,y=null,g=null,x=null,_=null,v=null,M=[],T=new Map,w=new et;w.layers.enable(1),w.viewport=new Be;let C=new et;C.layers.enable(2),C.viewport=new Be;let I=[w,C],L=new Ks;L.layers.enable(1),L.layers.enable(2);let R=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let K=M[J];return K===void 0&&(K=new Os,M[J]=K),K.getTargetRaySpace()},this.getControllerGrip=function(J){let K=M[J];return K===void 0&&(K=new Os,M[J]=K),K.getGripSpace()},this.getHand=function(J){let K=M[J];return K===void 0&&(K=new Os,M[J]=K),K.getHandSpace()};function D(J){let K=T.get(J.inputSource);K&&K.dispatchEvent({type:J.type,data:J.inputSource})}function F(){T.forEach(function(J,K){J.disconnect(K)}),T.clear(),R=null,W=null,i.bindXRFramebuffer(null),e.setRenderTarget(e.getRenderTarget()),p&&t.deleteFramebuffer(p),m&&t.deleteFramebuffer(m),y&&t.deleteRenderbuffer(y),g&&t.deleteRenderbuffer(g),p=null,m=null,y=null,g=null,u=null,h=null,f=null,s=null,Te.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){l=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return a},this.getBaseLayer=function(){return h!==null?h:u},this.getBinding=function(){return f},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",F),s.addEventListener("inputsourceschange",U);let K=t.getContextAttributes();if(K.xrCompatible!==!0&&await t.makeXRCompatible(),s.renderState.layers===void 0){let de={antialias:K.antialias,alpha:K.alpha,depth:K.depth,stencil:K.stencil,framebufferScaleFactor:o};u=new XRWebGLLayer(s,t,de),s.updateRenderState({baseLayer:u})}else if(t instanceof WebGLRenderingContext){let de={antialias:!0,alpha:K.alpha,depth:K.depth,stencil:K.stencil,framebufferScaleFactor:o};u=new XRWebGLLayer(s,t,de),s.updateRenderState({layers:[u]})}else{d=K.antialias;let de=null;K.depth&&(v=256,K.stencil&&(v|=1024),_=K.stencil?33306:36096,de=K.stencil?35056:33190);let k={colorFormat:K.alpha?32856:32849,depthFormat:de,scaleFactor:o};f=new XRWebGLBinding(s,t),h=f.createProjectionLayer(k),p=t.createFramebuffer(),s.updateRenderState({layers:[h]}),d&&(m=t.createFramebuffer(),y=t.createRenderbuffer(),t.bindRenderbuffer(36161,y),t.renderbufferStorageMultisample(36161,4,32856,h.textureWidth,h.textureHeight),i.bindFramebuffer(36160,m),t.framebufferRenderbuffer(36160,36064,36161,y),t.bindRenderbuffer(36161,null),de!==null&&(g=t.createRenderbuffer(),t.bindRenderbuffer(36161,g),t.renderbufferStorageMultisample(36161,4,de,h.textureWidth,h.textureHeight),t.framebufferRenderbuffer(36160,_,36161,g),t.bindRenderbuffer(36161,null)),i.bindFramebuffer(36160,null))}a=await s.requestReferenceSpace(l),Te.setContext(s),Te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}};function U(J){let K=s.inputSources;for(let de=0;de<M.length;de++)T.set(K[de],M[de]);for(let de=0;de<J.removed.length;de++){let k=J.removed[de],ve=T.get(k);ve&&(ve.dispatchEvent({type:"disconnected",data:k}),T.delete(k))}for(let de=0;de<J.added.length;de++){let k=J.added[de],ve=T.get(k);ve&&ve.dispatchEvent({type:"connected",data:k})}}let z=new b,B=new b;function Q(J,K,de){z.setFromMatrixPosition(K.matrixWorld),B.setFromMatrixPosition(de.matrixWorld);let k=z.distanceTo(B),ve=K.projectionMatrix.elements,Se=de.projectionMatrix.elements,oe=ve[14]/(ve[10]-1),fe=ve[14]/(ve[10]+1),Ce=(ve[9]+1)/ve[5],V=(ve[9]-1)/ve[5],Z=(ve[8]-1)/ve[0],ee=(Se[8]+1)/Se[0],pe=oe*Z,ie=oe*ee,A=k/(-Z+ee),S=A*-Z;K.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(S),J.translateZ(A),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert();let G=oe+A,$=fe+A,j=pe-S,ae=ie+(k-S),Me=Ce*fe/$*G,xe=V*fe/$*G;J.projectionMatrix.makePerspective(j,ae,Me,xe,G,$)}function ce(J,K){K===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(K.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;L.near=C.near=w.near=J.near,L.far=C.far=w.far=J.far,(R!==L.near||W!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),R=L.near,W=L.far);let K=J.parent,de=L.cameras;ce(L,K);for(let ve=0;ve<de.length;ve++)ce(de[ve],K);L.matrixWorld.decompose(L.position,L.quaternion,L.scale),J.position.copy(L.position),J.quaternion.copy(L.quaternion),J.scale.copy(L.scale),J.matrix.copy(L.matrix),J.matrixWorld.copy(L.matrixWorld);let k=J.children;for(let ve=0,Se=k.length;ve<Se;ve++)k[ve].updateMatrixWorld(!0);de.length===2?Q(L,w,C):L.projectionMatrix.copy(w.projectionMatrix)},this.getCamera=function(){return L},this.getFoveation=function(){if(h!==null)return h.fixedFoveation;if(u!==null)return u.fixedFoveation},this.setFoveation=function(J){h!==null&&(h.fixedFoveation=J),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=J)};let ye=null;function re(J,K){if(c=K.getViewerPose(a),x=K,c!==null){let k=c.views;u!==null&&i.bindXRFramebuffer(u.framebuffer);let ve=!1;k.length!==L.cameras.length&&(L.cameras.length=0,ve=!0);for(let Se=0;Se<k.length;Se++){let oe=k[Se],fe=null;if(u!==null)fe=u.getViewport(oe);else{let V=f.getViewSubImage(h,oe);i.bindXRFramebuffer(p),V.depthStencilTexture!==void 0&&t.framebufferTexture2D(36160,_,3553,V.depthStencilTexture,0),t.framebufferTexture2D(36160,36064,3553,V.colorTexture,0),fe=V.viewport}let Ce=I[Se];Ce.matrix.fromArray(oe.transform.matrix),Ce.projectionMatrix.fromArray(oe.projectionMatrix),Ce.viewport.set(fe.x,fe.y,fe.width,fe.height),Se===0&&L.matrix.copy(Ce.matrix),ve===!0&&L.cameras.push(Ce)}d&&(i.bindXRFramebuffer(m),v!==null&&t.clear(v))}let de=s.inputSources;for(let k=0;k<M.length;k++){let ve=M[k],Se=de[k];ve.update(Se,K,a)}if(ye&&ye(J,K),d){let k=h.textureWidth,ve=h.textureHeight;i.bindFramebuffer(36008,m),i.bindFramebuffer(36009,p),t.invalidateFramebuffer(36008,[_]),t.invalidateFramebuffer(36009,[_]),t.blitFramebuffer(0,0,k,ve,0,0,k,ve,16384,9728),t.invalidateFramebuffer(36008,[36064]),i.bindFramebuffer(36008,null),i.bindFramebuffer(36009,null),i.bindFramebuffer(36160,m)}x=null}let Te=new qd;Te.setAnimationLoop(re),this.setAnimationLoop=function(J){ye=J},this.dispose=function(){}}};function Yy(r){function e(g,x){g.fogColor.value.copy(x.color),x.isFog?(g.fogNear.value=x.near,g.fogFar.value=x.far):x.isFogExp2&&(g.fogDensity.value=x.density)}function t(g,x,_,v,M){x.isMeshBasicMaterial?n(g,x):x.isMeshLambertMaterial?(n(g,x),l(g,x)):x.isMeshToonMaterial?(n(g,x),f(g,x)):x.isMeshPhongMaterial?(n(g,x),c(g,x)):x.isMeshStandardMaterial?(n(g,x),x.isMeshPhysicalMaterial?h(g,x,M):p(g,x)):x.isMeshMatcapMaterial?(n(g,x),u(g,x)):x.isMeshDepthMaterial?(n(g,x),d(g,x)):x.isMeshDistanceMaterial?(n(g,x),m(g,x)):x.isMeshNormalMaterial?(n(g,x),y(g,x)):x.isLineBasicMaterial?(i(g,x),x.isLineDashedMaterial&&s(g,x)):x.isPointsMaterial?o(g,x,_,v):x.isSpriteMaterial?a(g,x):x.isShadowMaterial?(g.color.value.copy(x.color),g.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function n(g,x){g.opacity.value=x.opacity,x.color&&g.diffuse.value.copy(x.color),x.emissive&&g.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(g.map.value=x.map),x.alphaMap&&(g.alphaMap.value=x.alphaMap),x.specularMap&&(g.specularMap.value=x.specularMap),x.alphaTest>0&&(g.alphaTest.value=x.alphaTest);let _=r.get(x).envMap;if(_){g.envMap.value=_,g.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=x.reflectivity,g.ior.value=x.ior,g.refractionRatio.value=x.refractionRatio;let T=r.get(_).__maxMipLevel;T!==void 0&&(g.maxMipLevel.value=T)}x.lightMap&&(g.lightMap.value=x.lightMap,g.lightMapIntensity.value=x.lightMapIntensity),x.aoMap&&(g.aoMap.value=x.aoMap,g.aoMapIntensity.value=x.aoMapIntensity);let v;x.map?v=x.map:x.specularMap?v=x.specularMap:x.displacementMap?v=x.displacementMap:x.normalMap?v=x.normalMap:x.bumpMap?v=x.bumpMap:x.roughnessMap?v=x.roughnessMap:x.metalnessMap?v=x.metalnessMap:x.alphaMap?v=x.alphaMap:x.emissiveMap?v=x.emissiveMap:x.clearcoatMap?v=x.clearcoatMap:x.clearcoatNormalMap?v=x.clearcoatNormalMap:x.clearcoatRoughnessMap?v=x.clearcoatRoughnessMap:x.specularIntensityMap?v=x.specularIntensityMap:x.specularColorMap?v=x.specularColorMap:x.transmissionMap?v=x.transmissionMap:x.thicknessMap?v=x.thicknessMap:x.sheenColorMap?v=x.sheenColorMap:x.sheenRoughnessMap&&(v=x.sheenRoughnessMap),v!==void 0&&(v.isWebGLRenderTarget&&(v=v.texture),v.matrixAutoUpdate===!0&&v.updateMatrix(),g.uvTransform.value.copy(v.matrix));let M;x.aoMap?M=x.aoMap:x.lightMap&&(M=x.lightMap),M!==void 0&&(M.isWebGLRenderTarget&&(M=M.texture),M.matrixAutoUpdate===!0&&M.updateMatrix(),g.uv2Transform.value.copy(M.matrix))}function i(g,x){g.diffuse.value.copy(x.color),g.opacity.value=x.opacity}function s(g,x){g.dashSize.value=x.dashSize,g.totalSize.value=x.dashSize+x.gapSize,g.scale.value=x.scale}function o(g,x,_,v){g.diffuse.value.copy(x.color),g.opacity.value=x.opacity,g.size.value=x.size*_,g.scale.value=v*.5,x.map&&(g.map.value=x.map),x.alphaMap&&(g.alphaMap.value=x.alphaMap),x.alphaTest>0&&(g.alphaTest.value=x.alphaTest);let M;x.map?M=x.map:x.alphaMap&&(M=x.alphaMap),M!==void 0&&(M.matrixAutoUpdate===!0&&M.updateMatrix(),g.uvTransform.value.copy(M.matrix))}function a(g,x){g.diffuse.value.copy(x.color),g.opacity.value=x.opacity,g.rotation.value=x.rotation,x.map&&(g.map.value=x.map),x.alphaMap&&(g.alphaMap.value=x.alphaMap),x.alphaTest>0&&(g.alphaTest.value=x.alphaTest);let _;x.map?_=x.map:x.alphaMap&&(_=x.alphaMap),_!==void 0&&(_.matrixAutoUpdate===!0&&_.updateMatrix(),g.uvTransform.value.copy(_.matrix))}function l(g,x){x.emissiveMap&&(g.emissiveMap.value=x.emissiveMap)}function c(g,x){g.specular.value.copy(x.specular),g.shininess.value=Math.max(x.shininess,1e-4),x.emissiveMap&&(g.emissiveMap.value=x.emissiveMap),x.bumpMap&&(g.bumpMap.value=x.bumpMap,g.bumpScale.value=x.bumpScale,x.side===Qe&&(g.bumpScale.value*=-1)),x.normalMap&&(g.normalMap.value=x.normalMap,g.normalScale.value.copy(x.normalScale),x.side===Qe&&g.normalScale.value.negate()),x.displacementMap&&(g.displacementMap.value=x.displacementMap,g.displacementScale.value=x.displacementScale,g.displacementBias.value=x.displacementBias)}function f(g,x){x.gradientMap&&(g.gradientMap.value=x.gradientMap),x.emissiveMap&&(g.emissiveMap.value=x.emissiveMap),x.bumpMap&&(g.bumpMap.value=x.bumpMap,g.bumpScale.value=x.bumpScale,x.side===Qe&&(g.bumpScale.value*=-1)),x.normalMap&&(g.normalMap.value=x.normalMap,g.normalScale.value.copy(x.normalScale),x.side===Qe&&g.normalScale.value.negate()),x.displacementMap&&(g.displacementMap.value=x.displacementMap,g.displacementScale.value=x.displacementScale,g.displacementBias.value=x.displacementBias)}function p(g,x){g.roughness.value=x.roughness,g.metalness.value=x.metalness,x.roughnessMap&&(g.roughnessMap.value=x.roughnessMap),x.metalnessMap&&(g.metalnessMap.value=x.metalnessMap),x.emissiveMap&&(g.emissiveMap.value=x.emissiveMap),x.bumpMap&&(g.bumpMap.value=x.bumpMap,g.bumpScale.value=x.bumpScale,x.side===Qe&&(g.bumpScale.value*=-1)),x.normalMap&&(g.normalMap.value=x.normalMap,g.normalScale.value.copy(x.normalScale),x.side===Qe&&g.normalScale.value.negate()),x.displacementMap&&(g.displacementMap.value=x.displacementMap,g.displacementScale.value=x.displacementScale,g.displacementBias.value=x.displacementBias),r.get(x).envMap&&(g.envMapIntensity.value=x.envMapIntensity)}function h(g,x,_){p(g,x),g.ior.value=x.ior,x.sheen>0&&(g.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),g.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(g.sheenColorMap.value=x.sheenColorMap),x.sheenRoughnessMap&&(g.sheenRoughnessMap.value=x.sheenRoughnessMap)),x.clearcoat>0&&(g.clearcoat.value=x.clearcoat,g.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(g.clearcoatMap.value=x.clearcoatMap),x.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap),x.clearcoatNormalMap&&(g.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),g.clearcoatNormalMap.value=x.clearcoatNormalMap,x.side===Qe&&g.clearcoatNormalScale.value.negate())),x.transmission>0&&(g.transmission.value=x.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),x.transmissionMap&&(g.transmissionMap.value=x.transmissionMap),g.thickness.value=x.thickness,x.thicknessMap&&(g.thicknessMap.value=x.thicknessMap),g.attenuationDistance.value=x.attenuationDistance,g.attenuationColor.value.copy(x.attenuationColor)),g.specularIntensity.value=x.specularIntensity,g.specularColor.value.copy(x.specularColor),x.specularIntensityMap&&(g.specularIntensityMap.value=x.specularIntensityMap),x.specularColorMap&&(g.specularColorMap.value=x.specularColorMap)}function u(g,x){x.matcap&&(g.matcap.value=x.matcap),x.bumpMap&&(g.bumpMap.value=x.bumpMap,g.bumpScale.value=x.bumpScale,x.side===Qe&&(g.bumpScale.value*=-1)),x.normalMap&&(g.normalMap.value=x.normalMap,g.normalScale.value.copy(x.normalScale),x.side===Qe&&g.normalScale.value.negate()),x.displacementMap&&(g.displacementMap.value=x.displacementMap,g.displacementScale.value=x.displacementScale,g.displacementBias.value=x.displacementBias)}function d(g,x){x.displacementMap&&(g.displacementMap.value=x.displacementMap,g.displacementScale.value=x.displacementScale,g.displacementBias.value=x.displacementBias)}function m(g,x){x.displacementMap&&(g.displacementMap.value=x.displacementMap,g.displacementScale.value=x.displacementScale,g.displacementBias.value=x.displacementBias),g.referencePosition.value.copy(x.referencePosition),g.nearDistance.value=x.nearDistance,g.farDistance.value=x.farDistance}function y(g,x){x.bumpMap&&(g.bumpMap.value=x.bumpMap,g.bumpScale.value=x.bumpScale,x.side===Qe&&(g.bumpScale.value*=-1)),x.normalMap&&(g.normalMap.value=x.normalMap,g.normalScale.value.copy(x.normalScale),x.side===Qe&&g.normalScale.value.negate()),x.displacementMap&&(g.displacementMap.value=x.displacementMap,g.displacementScale.value=x.displacementScale,g.displacementBias.value=x.displacementBias)}return{refreshFogUniforms:e,refreshMaterialUniforms:t}}function Jy(){let r=Oa("canvas");return r.style.display="block",r}function He(r={}){let e=r.canvas!==void 0?r.canvas:Jy(),t=r.context!==void 0?r.context:null,n=r.alpha!==void 0?r.alpha:!1,i=r.depth!==void 0?r.depth:!0,s=r.stencil!==void 0?r.stencil:!0,o=r.antialias!==void 0?r.antialias:!1,a=r.premultipliedAlpha!==void 0?r.premultipliedAlpha:!0,l=r.preserveDrawingBuffer!==void 0?r.preserveDrawingBuffer:!1,c=r.powerPreference!==void 0?r.powerPreference:"default",f=r.failIfMajorPerformanceCaveat!==void 0?r.failIfMajorPerformanceCaveat:!1,p=null,h=null,u=[],d=[];this.domElement=e,this.debug={checkShaderErrors:!0},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.gammaFactor=2,this.outputEncoding=ft,this.physicallyCorrectLights=!1,this.toneMapping=En,this.toneMappingExposure=1;let m=this,y=!1,g=0,x=0,_=null,v=-1,M=null,T=new Be,w=new Be,C=null,I=e.width,L=e.height,R=1,W=null,D=null,F=new Be(0,0,I,L),U=new Be(0,0,I,L),z=!1,B=[],Q=new ai,ce=!1,ye=!1,re=null,Te=new he,J=new b,K={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function de(){return _===null?R:1}let k=t;function ve(E,N){for(let H=0;H<E.length;H++){let O=E[H],q=e.getContext(O,N);if(q!==null)return q}return null}try{let E={alpha:n,depth:i,stencil:s,antialias:o,premultipliedAlpha:a,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:f};if(e.addEventListener("webglcontextlost",mt,!1),e.addEventListener("webglcontextrestored",gt,!1),k===null){let N=["webgl2","webgl","experimental-webgl"];if(m.isWebGL1Renderer===!0&&N.shift(),k=ve(N,E),k===null)throw ve(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}k.getShaderPrecisionFormat===void 0&&(k.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Se,oe,fe,Ce,V,Z,ee,pe,ie,A,S,G,$,j,ae,Me,xe,Ee,me,P,se,Y,ge;function ue(){Se=new vx(k),oe=new dx(k,Se,r),Se.init(oe),Y=new sf(k,Se,oe),fe=new Wy(k,Se,oe),B[0]=1029,Ce=new Mx(k),V=new Dy,Z=new Xy(k,Se,fe,V,oe,Y,Ce),ee=new px(m),pe=new yx(m),ie=new zp(k,oe),ge=new hx(k,Se,ie,oe),A=new _x(k,ie,Ce,ge),S=new Tx(k,A,ie,Ce),me=new Ex(k,oe,Z),Me=new fx(V),G=new Iy(m,ee,pe,Se,oe,ge,Me),$=new Yy(V),j=new Ny(V),ae=new Gy(Se,oe),Ee=new cx(m,ee,fe,S,a),xe=new nf(m,S,oe),P=new ux(k,Se,Ce,oe),se=new wx(k,Se,Ce,oe),Ce.programs=G.programs,m.capabilities=oe,m.extensions=Se,m.properties=V,m.renderLists=j,m.shadowMap=xe,m.state=fe,m.info=Ce}ue();let De=new Vl(m,k);this.xr=De,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){let E=Se.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Se.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return R},this.setPixelRatio=function(E){E!==void 0&&(R=E,this.setSize(I,L,!1))},this.getSize=function(E){return E.set(I,L)},this.setSize=function(E,N,H){if(De.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=E,L=N,e.width=Math.floor(E*R),e.height=Math.floor(N*R),H!==!1&&(e.style.width=E+"px",e.style.height=N+"px"),this.setViewport(0,0,E,N)},this.getDrawingBufferSize=function(E){return E.set(I*R,L*R).floor()},this.setDrawingBufferSize=function(E,N,H){I=E,L=N,R=H,e.width=Math.floor(E*H),e.height=Math.floor(N*H),this.setViewport(0,0,E,N)},this.getCurrentViewport=function(E){return E.copy(T)},this.getViewport=function(E){return E.copy(F)},this.setViewport=function(E,N,H,O){E.isVector4?F.set(E.x,E.y,E.z,E.w):F.set(E,N,H,O),fe.viewport(T.copy(F).multiplyScalar(R).floor())},this.getScissor=function(E){return E.copy(U)},this.setScissor=function(E,N,H,O){E.isVector4?U.set(E.x,E.y,E.z,E.w):U.set(E,N,H,O),fe.scissor(w.copy(U).multiplyScalar(R).floor())},this.getScissorTest=function(){return z},this.setScissorTest=function(E){fe.setScissorTest(z=E)},this.setOpaqueSort=function(E){W=E},this.setTransparentSort=function(E){D=E},this.getClearColor=function(E){return E.copy(Ee.getClearColor())},this.setClearColor=function(){Ee.setClearColor.apply(Ee,arguments)},this.getClearAlpha=function(){return Ee.getClearAlpha()},this.setClearAlpha=function(){Ee.setClearAlpha.apply(Ee,arguments)},this.clear=function(E,N,H){let O=0;(E===void 0||E)&&(O|=16384),(N===void 0||N)&&(O|=256),(H===void 0||H)&&(O|=1024),k.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",mt,!1),e.removeEventListener("webglcontextrestored",gt,!1),j.dispose(),ae.dispose(),V.dispose(),ee.dispose(),pe.dispose(),S.dispose(),ge.dispose(),De.dispose(),De.removeEventListener("sessionstart",Bc),De.removeEventListener("sessionend",Oc),re&&(re.dispose(),re=null),Bn.stop()};function mt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function gt(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;let E=Ce.autoReset,N=xe.enabled,H=xe.autoUpdate,O=xe.needsUpdate,q=xe.type;ue(),Ce.autoReset=E,xe.enabled=N,xe.autoUpdate=H,xe.needsUpdate=O,xe.type=q}function mn(E){let N=E.target;N.removeEventListener("dispose",mn),Ze(N)}function Ze(E){Zt(E),V.remove(E)}function Zt(E){let N=V.get(E).programs;N!==void 0&&N.forEach(function(H){G.releaseProgram(H)})}this.renderBufferDirect=function(E,N,H,O,q,Ae){N===null&&(N=K);let be=q.isMesh&&q.matrixWorld.determinant()<0,we=wf(E,N,H,O,q);fe.setMaterial(O,be);let Le=H.index,Oe=H.attributes.position;if(Le===null){if(Oe===void 0||Oe.count===0)return}else if(Le.count===0)return;let Fe=1;O.wireframe===!0&&(Le=A.getWireframeAttribute(H),Fe=2),ge.setup(q,O,we,H,Le);let Ne,Xe=P;Le!==null&&(Ne=ie.get(Le),Xe=se,Xe.setIndex(Ne));let On=Le!==null?Le.count:Oe.count,ze=H.drawRange.start*Fe,bs=H.drawRange.count*Fe,ke=Ae!==null?Ae.start*Fe:0,Un=Ae!==null?Ae.count*Fe:1/0,Hn=Math.max(ze,ke),Gn=Math.min(On,ze+bs,ke+Un)-1,gn=Math.max(0,Gn-Hn+1);if(gn!==0){if(q.isMesh)O.wireframe===!0?(fe.setLineWidth(O.wireframeLinewidth*de()),Xe.setMode(1)):Xe.setMode(4);else if(q.isLine){let qe=O.linewidth;qe===void 0&&(qe=1),fe.setLineWidth(qe*de()),q.isLineSegments?Xe.setMode(1):q.isLineLoop?Xe.setMode(2):Xe.setMode(3)}else q.isPoints?Xe.setMode(0):q.isSprite&&Xe.setMode(4);if(q.isInstancedMesh)Xe.renderInstances(Hn,gn,q.count);else if(H.isInstancedBufferGeometry){let qe=Math.min(H.instanceCount,H._maxInstanceCount);Xe.renderInstances(Hn,gn,qe)}else Xe.render(Hn,gn)}},this.compile=function(E,N){h=ae.get(E),h.init(),d.push(h),E.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(h.pushLight(H),H.castShadow&&h.pushShadow(H))}),h.setupLights(m.physicallyCorrectLights),E.traverse(function(H){let O=H.material;if(O)if(Array.isArray(O))for(let q=0;q<O.length;q++){let Ae=O[q];Ha(Ae,E,H)}else Ha(O,E,H)}),d.pop(),h=null};let Dt=null;function yf(E){Dt&&Dt(E)}function Bc(){Bn.stop()}function Oc(){Bn.start()}let Bn=new qd;Bn.setAnimationLoop(yf),typeof window<"u"&&Bn.setContext(window),this.setAnimationLoop=function(E){Dt=E,De.setAnimationLoop(E),E===null?Bn.stop():Bn.start()},De.addEventListener("sessionstart",Bc),De.addEventListener("sessionend",Oc),this.render=function(E,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;E.autoUpdate===!0&&E.updateMatrixWorld(),N.parent===null&&N.updateMatrixWorld(),De.enabled===!0&&De.isPresenting===!0&&(De.cameraAutoUpdate===!0&&De.updateCamera(N),N=De.getCamera()),E.isScene===!0&&E.onBeforeRender(m,E,N,_),h=ae.get(E,d.length),h.init(),d.push(h),Te.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Q.setFromProjectionMatrix(Te),ye=this.localClippingEnabled,ce=Me.init(this.clippingPlanes,ye,N),p=j.get(E,u.length),p.init(),u.push(p),Uc(E,N,0,m.sortObjects),p.finish(),m.sortObjects===!0&&p.sort(W,D),ce===!0&&Me.beginShadows();let H=h.state.shadowsArray;if(xe.render(H,E,N),ce===!0&&Me.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ee.render(p,E),h.setupLights(m.physicallyCorrectLights),N.isArrayCamera){let O=N.cameras;for(let q=0,Ae=O.length;q<Ae;q++){let be=O[q];Hc(p,E,be,be.viewport)}}else Hc(p,E,N);_!==null&&(Z.updateMultisampleRenderTarget(_),Z.updateRenderTargetMipmap(_)),E.isScene===!0&&E.onAfterRender(m,E,N),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1),ge.resetDefaultState(),v=-1,M=null,d.pop(),d.length>0?h=d[d.length-1]:h=null,u.pop(),u.length>0?p=u[u.length-1]:p=null};function Uc(E,N,H,O){if(E.visible===!1)return;if(E.layers.test(N.layers)){if(E.isGroup)H=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(N);else if(E.isLight)h.pushLight(E),E.castShadow&&h.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Q.intersectsSprite(E)){O&&J.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Te);let be=S.update(E),we=E.material;we.visible&&p.push(E,be,we,H,J.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(E.isSkinnedMesh&&E.skeleton.frame!==Ce.render.frame&&(E.skeleton.update(),E.skeleton.frame=Ce.render.frame),!E.frustumCulled||Q.intersectsObject(E))){O&&J.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Te);let be=S.update(E),we=E.material;if(Array.isArray(we)){let Le=be.groups;for(let Oe=0,Fe=Le.length;Oe<Fe;Oe++){let Ne=Le[Oe],Xe=we[Ne.materialIndex];Xe&&Xe.visible&&p.push(E,be,Xe,H,J.z,Ne)}}else we.visible&&p.push(E,be,we,H,J.z,null)}}let Ae=E.children;for(let be=0,we=Ae.length;be<we;be++)Uc(Ae[be],N,H,O)}function Hc(E,N,H,O){let q=E.opaque,Ae=E.transmissive,be=E.transparent;h.setupLightsView(H),Ae.length>0&&vf(q,N,H),O&&fe.viewport(T.copy(O)),q.length>0&&Zr(q,N,H),Ae.length>0&&Zr(Ae,N,H),be.length>0&&Zr(be,N,H)}function vf(E,N,H){if(re===null){let be=o===!0&&oe.isWebGL2===!0?$s:Tt;re=new be(1024,1024,{generateMipmaps:!0,type:Y.convert(Kn)!==null?Kn:on,minFilter:Mi,magFilter:tt,wrapS:ht,wrapT:ht})}let O=m.getRenderTarget();m.setRenderTarget(re),m.clear();let q=m.toneMapping;m.toneMapping=En,Zr(E,N,H),m.toneMapping=q,Z.updateMultisampleRenderTarget(re),Z.updateRenderTargetMipmap(re),m.setRenderTarget(O)}function Zr(E,N,H){let O=N.isScene===!0?N.overrideMaterial:null;for(let q=0,Ae=E.length;q<Ae;q++){let be=E[q],we=be.object,Le=be.geometry,Oe=O===null?be.material:O,Fe=be.group;we.layers.test(H.layers)&&_f(we,N,H,Le,Oe,Fe)}}function _f(E,N,H,O,q,Ae){E.onBeforeRender(m,N,H,O,q,Ae),E.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),q.onBeforeRender(m,N,H,O,E,Ae),q.transparent===!0&&q.side===si?(q.side=Qe,q.needsUpdate=!0,m.renderBufferDirect(H,N,O,q,E,Ae),q.side=ii,q.needsUpdate=!0,m.renderBufferDirect(H,N,O,q,E,Ae),q.side=si):m.renderBufferDirect(H,N,O,q,E,Ae),E.onAfterRender(m,N,H,O,q,Ae)}function Ha(E,N,H){N.isScene!==!0&&(N=K);let O=V.get(E),q=h.state.lights,Ae=h.state.shadowsArray,be=q.state.version,we=G.getParameters(E,q.state,Ae,N,H),Le=G.getProgramCacheKey(we),Oe=O.programs;O.environment=E.isMeshStandardMaterial?N.environment:null,O.fog=N.fog,O.envMap=(E.isMeshStandardMaterial?pe:ee).get(E.envMap||O.environment),Oe===void 0&&(E.addEventListener("dispose",mn),Oe=new Map,O.programs=Oe);let Fe=Oe.get(Le);if(Fe!==void 0){if(O.currentProgram===Fe&&O.lightsStateVersion===be)return Gc(E,we),Fe}else we.uniforms=G.getUniforms(E),E.onBuild(H,we,m),E.onBeforeCompile(we,m),Fe=G.acquireProgram(we,Le),Oe.set(Le,Fe),O.uniforms=we.uniforms;let Ne=O.uniforms;(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ne.clippingPlanes=Me.uniform),Gc(E,we),O.needsLights=bf(E),O.lightsStateVersion=be,O.needsLights&&(Ne.ambientLightColor.value=q.state.ambient,Ne.lightProbe.value=q.state.probe,Ne.directionalLights.value=q.state.directional,Ne.directionalLightShadows.value=q.state.directionalShadow,Ne.spotLights.value=q.state.spot,Ne.spotLightShadows.value=q.state.spotShadow,Ne.rectAreaLights.value=q.state.rectArea,Ne.ltc_1.value=q.state.rectAreaLTC1,Ne.ltc_2.value=q.state.rectAreaLTC2,Ne.pointLights.value=q.state.point,Ne.pointLightShadows.value=q.state.pointShadow,Ne.hemisphereLights.value=q.state.hemi,Ne.directionalShadowMap.value=q.state.directionalShadowMap,Ne.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Ne.spotShadowMap.value=q.state.spotShadowMap,Ne.spotShadowMatrix.value=q.state.spotShadowMatrix,Ne.pointShadowMap.value=q.state.pointShadowMap,Ne.pointShadowMatrix.value=q.state.pointShadowMatrix);let Xe=Fe.getUniforms(),On=An.seqWithValue(Xe.seq,Ne);return O.currentProgram=Fe,O.uniformsList=On,Fe}function Gc(E,N){let H=V.get(E);H.outputEncoding=N.outputEncoding,H.instancing=N.instancing,H.skinning=N.skinning,H.morphTargets=N.morphTargets,H.morphNormals=N.morphNormals,H.morphTargetsCount=N.morphTargetsCount,H.numClippingPlanes=N.numClippingPlanes,H.numIntersection=N.numClipIntersection,H.vertexAlphas=N.vertexAlphas,H.vertexTangents=N.vertexTangents}function wf(E,N,H,O,q){N.isScene!==!0&&(N=K),Z.resetTextureUnits();let Ae=N.fog,be=O.isMeshStandardMaterial?N.environment:null,we=_===null?m.outputEncoding:_.texture.encoding,Le=(O.isMeshStandardMaterial?pe:ee).get(O.envMap||be),Oe=O.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Fe=!!O.normalMap&&!!H.attributes.tangent,Ne=!!H.morphAttributes.position,Xe=!!H.morphAttributes.normal,On=H.morphAttributes.position?H.morphAttributes.position.length:0,ze=V.get(O),bs=h.state.lights;if(ce===!0&&(ye===!0||E!==M)){let Ft=E===M&&O.id===v;Me.setState(O,E,Ft)}let ke=!1;O.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==bs.state.version||ze.outputEncoding!==we||q.isInstancedMesh&&ze.instancing===!1||!q.isInstancedMesh&&ze.instancing===!0||q.isSkinnedMesh&&ze.skinning===!1||!q.isSkinnedMesh&&ze.skinning===!0||ze.envMap!==Le||O.fog&&ze.fog!==Ae||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==Me.numPlanes||ze.numIntersection!==Me.numIntersection)||ze.vertexAlphas!==Oe||ze.vertexTangents!==Fe||ze.morphTargets!==Ne||ze.morphNormals!==Xe||oe.isWebGL2===!0&&ze.morphTargetsCount!==On)&&(ke=!0):(ke=!0,ze.__version=O.version);let Un=ze.currentProgram;ke===!0&&(Un=Ha(O,N,q));let Hn=!1,Gn=!1,gn=!1,qe=Un.getUniforms(),Ss=ze.uniforms;if(fe.useProgram(Un.program)&&(Hn=!0,Gn=!0,gn=!0),O.id!==v&&(v=O.id,Gn=!0),Hn||M!==E){if(qe.setValue(k,"projectionMatrix",E.projectionMatrix),oe.logarithmicDepthBuffer&&qe.setValue(k,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),M!==E&&(M=E,Gn=!0,gn=!0),O.isShaderMaterial||O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshStandardMaterial||O.envMap){let Ft=qe.map.cameraPosition;Ft!==void 0&&Ft.setValue(k,J.setFromMatrixPosition(E.matrixWorld))}(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&qe.setValue(k,"isOrthographic",E.isOrthographicCamera===!0),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial||O.isShadowMaterial||q.isSkinnedMesh)&&qe.setValue(k,"viewMatrix",E.matrixWorldInverse)}if(q.isSkinnedMesh){qe.setOptional(k,q,"bindMatrix"),qe.setOptional(k,q,"bindMatrixInverse");let Ft=q.skeleton;Ft&&(oe.floatVertexTextures?(Ft.boneTexture===null&&Ft.computeBoneTexture(),qe.setValue(k,"boneTexture",Ft.boneTexture,Z),qe.setValue(k,"boneTextureSize",Ft.boneTextureSize)):qe.setOptional(k,Ft,"boneMatrices"))}return H&&(H.morphAttributes.position!==void 0||H.morphAttributes.normal!==void 0)&&me.update(q,H,O,Un),(Gn||ze.receiveShadow!==q.receiveShadow)&&(ze.receiveShadow=q.receiveShadow,qe.setValue(k,"receiveShadow",q.receiveShadow)),Gn&&(qe.setValue(k,"toneMappingExposure",m.toneMappingExposure),ze.needsLights&&Mf(Ss,gn),Ae&&O.fog&&$.refreshFogUniforms(Ss,Ae),$.refreshMaterialUniforms(Ss,O,R,L,re),An.upload(k,ze.uniformsList,Ss,Z)),O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&(An.upload(k,ze.uniformsList,Ss,Z),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&qe.setValue(k,"center",q.center),qe.setValue(k,"modelViewMatrix",q.modelViewMatrix),qe.setValue(k,"normalMatrix",q.normalMatrix),qe.setValue(k,"modelMatrix",q.matrixWorld),Un}function Mf(E,N){E.ambientLightColor.needsUpdate=N,E.lightProbe.needsUpdate=N,E.directionalLights.needsUpdate=N,E.directionalLightShadows.needsUpdate=N,E.pointLights.needsUpdate=N,E.pointLightShadows.needsUpdate=N,E.spotLights.needsUpdate=N,E.spotLightShadows.needsUpdate=N,E.rectAreaLights.needsUpdate=N,E.hemisphereLights.needsUpdate=N}function bf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return g},this.getActiveMipmapLevel=function(){return x},this.getRenderTarget=function(){return _},this.setRenderTarget=function(E,N=0,H=0){_=E,g=N,x=H,E&&V.get(E).__webglFramebuffer===void 0&&Z.setupRenderTarget(E);let O=null,q=!1,Ae=!1;if(E){let we=E.texture;(we.isDataTexture3D||we.isDataTexture2DArray)&&(Ae=!0);let Le=V.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(O=Le[N],q=!0):E.isWebGLMultisampleRenderTarget?O=V.get(E).__webglMultisampledFramebuffer:O=Le,T.copy(E.viewport),w.copy(E.scissor),C=E.scissorTest}else T.copy(F).multiplyScalar(R).floor(),w.copy(U).multiplyScalar(R).floor(),C=z;if(fe.bindFramebuffer(36160,O)&&oe.drawBuffers){let we=!1;if(E)if(E.isWebGLMultipleRenderTargets){let Le=E.texture;if(B.length!==Le.length||B[0]!==36064){for(let Oe=0,Fe=Le.length;Oe<Fe;Oe++)B[Oe]=36064+Oe;B.length=Le.length,we=!0}}else(B.length!==1||B[0]!==36064)&&(B[0]=36064,B.length=1,we=!0);else(B.length!==1||B[0]!==1029)&&(B[0]=1029,B.length=1,we=!0);we&&(oe.isWebGL2?k.drawBuffers(B):Se.get("WEBGL_draw_buffers").drawBuffersWEBGL(B))}if(fe.viewport(T),fe.scissor(w),fe.setScissorTest(C),q){let we=V.get(E.texture);k.framebufferTexture2D(36160,36064,34069+N,we.__webglTexture,H)}else if(Ae){let we=V.get(E.texture),Le=N||0;k.framebufferTextureLayer(36160,36064,we.__webglTexture,H||0,Le)}v=-1},this.readRenderTargetPixels=function(E,N,H,O,q,Ae,be){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=V.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&be!==void 0&&(we=we[be]),we){fe.bindFramebuffer(36160,we);try{let Le=E.texture,Oe=Le.format,Fe=Le.type;if(Oe!==ut&&Y.convert(Oe)!==k.getParameter(35739)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Ne=Fe===Kn&&(Se.has("EXT_color_buffer_half_float")||oe.isWebGL2&&Se.has("EXT_color_buffer_float"));if(Fe!==on&&Y.convert(Fe)!==k.getParameter(35738)&&!(Fe===Wt&&(oe.isWebGL2||Se.has("OES_texture_float")||Se.has("WEBGL_color_buffer_float")))&&!Ne){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k.checkFramebufferStatus(36160)===36053?N>=0&&N<=E.width-O&&H>=0&&H<=E.height-q&&k.readPixels(N,H,O,q,Y.convert(Oe),Y.convert(Fe),Ae):console.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.")}finally{let Le=_!==null?V.get(_).__webglFramebuffer:null;fe.bindFramebuffer(36160,Le)}}},this.copyFramebufferToTexture=function(E,N,H=0){let O=Math.pow(2,-H),q=Math.floor(N.image.width*O),Ae=Math.floor(N.image.height*O),be=Y.convert(N.format);oe.isWebGL2&&(be===6407&&(be=32849),be===6408&&(be=32856)),Z.setTexture2D(N,0),k.copyTexImage2D(3553,H,be,E.x,E.y,q,Ae,0),fe.unbindTexture()},this.copyTextureToTexture=function(E,N,H,O=0){let q=N.image.width,Ae=N.image.height,be=Y.convert(H.format),we=Y.convert(H.type);Z.setTexture2D(H,0),k.pixelStorei(37440,H.flipY),k.pixelStorei(37441,H.premultiplyAlpha),k.pixelStorei(3317,H.unpackAlignment),N.isDataTexture?k.texSubImage2D(3553,O,E.x,E.y,q,Ae,be,we,N.image.data):N.isCompressedTexture?k.compressedTexSubImage2D(3553,O,E.x,E.y,N.mipmaps[0].width,N.mipmaps[0].height,be,N.mipmaps[0].data):k.texSubImage2D(3553,O,E.x,E.y,be,we,N.image),O===0&&H.generateMipmaps&&k.generateMipmap(3553),fe.unbindTexture()},this.copyTextureToTexture3D=function(E,N,H,O,q=0){if(m.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Ae=E.max.x-E.min.x+1,be=E.max.y-E.min.y+1,we=E.max.z-E.min.z+1,Le=Y.convert(O.format),Oe=Y.convert(O.type),Fe;if(O.isDataTexture3D)Z.setTexture3D(O,0),Fe=32879;else if(O.isDataTexture2DArray)Z.setTexture2DArray(O,0),Fe=35866;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}k.pixelStorei(37440,O.flipY),k.pixelStorei(37441,O.premultiplyAlpha),k.pixelStorei(3317,O.unpackAlignment);let Ne=k.getParameter(3314),Xe=k.getParameter(32878),On=k.getParameter(3316),ze=k.getParameter(3315),bs=k.getParameter(32877),ke=H.isCompressedTexture?H.mipmaps[0]:H.image;k.pixelStorei(3314,ke.width),k.pixelStorei(32878,ke.height),k.pixelStorei(3316,E.min.x),k.pixelStorei(3315,E.min.y),k.pixelStorei(32877,E.min.z),H.isDataTexture||H.isDataTexture3D?k.texSubImage3D(Fe,q,N.x,N.y,N.z,Ae,be,we,Le,Oe,ke.data):H.isCompressedTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),k.compressedTexSubImage3D(Fe,q,N.x,N.y,N.z,Ae,be,we,Le,ke.data)):k.texSubImage3D(Fe,q,N.x,N.y,N.z,Ae,be,we,Le,Oe,ke),k.pixelStorei(3314,Ne),k.pixelStorei(32878,Xe),k.pixelStorei(3316,On),k.pixelStorei(3315,ze),k.pixelStorei(32877,bs),q===0&&O.generateMipmaps&&k.generateMipmap(Fe),fe.unbindTexture()},this.initTexture=function(E){Z.setTexture2D(E,0),fe.unbindTexture()},this.resetState=function(){g=0,x=0,_=null,fe.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}He.prototype.isWebGLRenderer=!0;var Qo=class extends He{};Qo.prototype.isWebGL1Renderer=!0;var er=class r{constructor(e,t=25e-5){this.name="",this.color=new ne(e),this.density=t}clone(){return new r(this.color,this.density)}toJSON(){return{type:"FogExp2",color:this.color.getHex(),density:this.density}}};er.prototype.isFogExp2=!0;var tr=class r{constructor(e,t=1,n=1e3){this.name="",this.color=new ne(e),this.near=t,this.far=n}clone(){return new r(this.color,this.near,this.far)}toJSON(){return{type:"Fog",color:this.color.getHex(),near:this.near,far:this.far}}};tr.prototype.isFog=!0;var as=class extends Ie{constructor(){super(),this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.overrideMaterial=null,this.autoUpdate=!0,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.autoUpdate=e.autoUpdate,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t}};as.prototype.isScene=!0;var ln=class{constructor(e,t){this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=$i,this.updateRange={offset:0,count:-1},this.version=0,this.uuid=Et()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Et()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Et()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.prototype.slice.call(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}};ln.prototype.isInterleavedBuffer=!0;var $e=new b,In=class r{constructor(e,t,n,i=!1){this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i===!0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)$e.x=this.getX(t),$e.y=this.getY(t),$e.z=this.getZ(t),$e.applyMatrix4(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$e.x=this.getX(t),$e.y=this.getY(t),$e.z=this.getZ(t),$e.applyNormalMatrix(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$e.x=this.getX(t),$e.y=this.getY(t),$e.z=this.getZ(t),$e.transformDirection(e),this.setXYZ(t,$e.x,$e.y,$e.z);return this}setX(e,t){return this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){return this.data.array[e*this.data.stride+this.offset]}getY(e){return this.data.array[e*this.data.stride+this.offset+1]}getZ(e){return this.data.array[e*this.data.stride+this.offset+2]}getW(e){return this.data.array[e*this.data.stride+this.offset+3]}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interlaved buffer attribute will deinterleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Pe(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interlaved buffer attribute will deinterleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};In.prototype.isInterleavedBufferAttribute=!0;var ls=class extends nt{constructor(e){super(),this.type="SpriteMaterial",this.color=new ne(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this}};ls.prototype.isSpriteMaterial=!0;var Ui,Ls=new b,Hi=new b,Gi=new b,ki=new X,Ps=new X,rf=new he,xo=new b,Is=new b,yo=new b,Mh=new X,ml=new X,bh=new X,cs=class extends Ie{constructor(e){if(super(),this.type="Sprite",Ui===void 0){Ui=new _e;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ln(t,5);Ui.setIndex([0,1,2,0,2,3]),Ui.setAttribute("position",new In(n,3,0,!1)),Ui.setAttribute("uv",new In(n,2,3,!1))}this.geometry=Ui,this.material=e!==void 0?e:new ls,this.center=new X(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Hi.setFromMatrixScale(this.matrixWorld),rf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Gi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Hi.multiplyScalar(-Gi.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let o=this.center;vo(xo.set(-.5,-.5,0),Gi,o,Hi,i,s),vo(Is.set(.5,-.5,0),Gi,o,Hi,i,s),vo(yo.set(.5,.5,0),Gi,o,Hi,i,s),Mh.set(0,0),ml.set(1,0),bh.set(1,1);let a=e.ray.intersectTriangle(xo,Is,yo,!1,Ls);if(a===null&&(vo(Is.set(-.5,.5,0),Gi,o,Hi,i,s),ml.set(0,1),a=e.ray.intersectTriangle(xo,yo,Is,!1,Ls),a===null))return;let l=e.ray.origin.distanceTo(Ls);l<e.near||l>e.far||t.push({distance:l,point:Ls.clone(),uv:dt.getUV(Ls,xo,Is,yo,Mh,ml,bh,new X),face:null,object:this})}copy(e){return super.copy(e),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};cs.prototype.isSprite=!0;function vo(r,e,t,n,i,s){ki.subVectors(r,t).addScalar(.5).multiply(n),i!==void 0?(Ps.x=s*ki.x-i*ki.y,Ps.y=i*ki.x+s*ki.y):Ps.copy(ki),r.copy(e),r.x+=Ps.x,r.y+=Ps.y,r.applyMatrix4(rf)}var _o=new b,Sh=new b,Ko=class extends Ie{constructor(){super(),this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);let t=e.levels;for(let n=0,i=t.length;n<i;n++){let s=t[n];this.addLevel(s.object.clone(),s.distance)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0){t=Math.abs(t);let n=this.levels,i;for(i=0;i<n.length&&!(t<n[i].distance);i++);return n.splice(i,0,{distance:t,object:e}),this.add(e),this}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){let t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i&&!(e<t[n].distance);n++);return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){_o.setFromMatrixPosition(this.matrixWorld);let i=e.ray.origin.distanceTo(_o);this.getObjectForDistance(i).raycast(e,t)}}update(e){let t=this.levels;if(t.length>1){_o.setFromMatrixPosition(e.matrixWorld),Sh.setFromMatrixPosition(this.matrixWorld);let n=_o.distanceTo(Sh)/e.zoom;t[0].object.visible=!0;let i,s;for(i=1,s=t.length;i<s&&n>=t[i].distance;i++)t[i-1].object.visible=!1,t[i].object.visible=!0;for(this._currentLevel=i-1;i<s;i++)t[i].object.visible=!1}}toJSON(e){let t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];let n=this.levels;for(let i=0,s=n.length;i<s;i++){let o=n[i];t.object.levels.push({object:o.object.uuid,distance:o.distance})}return t}},Eh=new b,Th=new Be,Ah=new Be,Zy=new b,Ch=new he,hs=class extends Je{constructor(e,t){super(e,t),this.type="SkinnedMesh",this.bindMode="attached",this.bindMatrix=new he,this.bindMatrixInverse=new he}copy(e){return super.copy(e),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Be,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.x=t.getX(n),e.y=t.getY(n),e.z=t.getZ(n),e.w=t.getW(n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode==="attached"?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode==="detached"?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}boneTransform(e,t){let n=this.skeleton,i=this.geometry;Th.fromBufferAttribute(i.attributes.skinIndex,e),Ah.fromBufferAttribute(i.attributes.skinWeight,e),Eh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){let o=Ah.getComponent(s);if(o!==0){let a=Th.getComponent(s);Ch.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Zy.copy(Eh).applyMatrix4(Ch),o)}}return t.applyMatrix4(this.bindMatrixInverse)}};hs.prototype.isSkinnedMesh=!0;var us=class extends Ie{constructor(){super(),this.type="Bone"}};us.prototype.isBone=!0;var rn=class extends at{constructor(e=null,t=1,n=1,i,s,o,a,l,c=tt,f=tt,p,h){super(null,o,a,l,c,f,i,s,p,h),this.image={data:e,width:t,height:n},this.magFilter=c,this.minFilter=f,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}};rn.prototype.isDataTexture=!0;var Rh=new he,$y=new he,ea=class r{constructor(e=[],t=[]){this.uuid=Et(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.boneTextureSize=0,this.frame=-1,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new he)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new he;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,o=e.length;s<o;s++){let a=e[s]?e[s].matrixWorld:$y;Rh.multiplyMatrices(a,t[s]),Rh.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new r(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Gd(e),e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new rn(t,e,e,ut,Wt);return this.boneMatrices=t,this.boneTexture=n,this.boneTextureSize=e,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],o=t[s];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),o=new us),this.bones.push(o),this.boneInverses.push(new he().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.5,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let o=t[i];e.bones.push(o.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}},cn=class extends Pe{constructor(e,t,n,i=1){typeof n=="number"&&(i=n,n=!1,console.error("THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument.")),super(e,t,n),this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}};cn.prototype.isInstancedBufferAttribute=!0;var Lh=new he,Ph=new he,wo=[],Ds=new Je,nr=class extends Je{constructor(e,t,n){super(e,t),this.instanceMatrix=new cn(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.frustumCulled=!1}copy(e){return super.copy(e),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Ds.geometry=this.geometry,Ds.material=this.material,Ds.material!==void 0)for(let s=0;s<i;s++){this.getMatrixAt(s,Lh),Ph.multiplyMatrices(n,Lh),Ds.matrixWorld=Ph,Ds.raycast(e,wo);for(let o=0,a=wo.length;o<a;o++){let l=wo[o];l.instanceId=s,l.object=this,t.push(l)}wo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new cn(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};nr.prototype.isInstancedMesh=!0;var it=class extends nt{constructor(e){super(),this.type="LineBasicMaterial",this.color=new ne(16777215),this.linewidth=1,this.linecap="round",this.linejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this}};it.prototype.isLineBasicMaterial=!0;var Ih=new b,Dh=new b,Fh=new he,gl=new Jt,Mo=new Yt,Gt=class extends Ie{constructor(e=new _e,t=new it){super(),this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),this.material=e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.isBufferGeometry)if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Ih.fromBufferAttribute(t,i-1),Dh.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ih.distanceTo(Dh);e.setAttribute("lineDistance",new le(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");else e.isGeometry&&console.error("THREE.Line.computeLineDistances() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.");return this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Mo.copy(n.boundingSphere),Mo.applyMatrix4(i),Mo.radius+=s,e.ray.intersectsSphere(Mo)===!1)return;Fh.copy(i).invert(),gl.copy(e.ray).applyMatrix4(Fh);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new b,f=new b,p=new b,h=new b,u=this.isLineSegments?2:1;if(n.isBufferGeometry){let d=n.index,y=n.attributes.position;if(d!==null){let g=Math.max(0,o.start),x=Math.min(d.count,o.start+o.count);for(let _=g,v=x-1;_<v;_+=u){let M=d.getX(_),T=d.getX(_+1);if(c.fromBufferAttribute(y,M),f.fromBufferAttribute(y,T),gl.distanceSqToSegment(c,f,h,p)>l)continue;h.applyMatrix4(this.matrixWorld);let C=e.ray.origin.distanceTo(h);C<e.near||C>e.far||t.push({distance:C,point:p.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}else{let g=Math.max(0,o.start),x=Math.min(y.count,o.start+o.count);for(let _=g,v=x-1;_<v;_+=u){if(c.fromBufferAttribute(y,_),f.fromBufferAttribute(y,_+1),gl.distanceSqToSegment(c,f,h,p)>l)continue;h.applyMatrix4(this.matrixWorld);let T=e.ray.origin.distanceTo(h);T<e.near||T>e.far||t.push({distance:T,point:p.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}}else n.isGeometry&&console.error("THREE.Line.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}updateMorphTargets(){let e=this.geometry;if(e.isBufferGeometry){let t=e.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}else{let t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Line.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.")}}};Gt.prototype.isLine=!0;var Nh=new b,zh=new b,vt=class extends Gt{constructor(e,t){super(e,t),this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.isBufferGeometry)if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Nh.fromBufferAttribute(t,i),zh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Nh.distanceTo(zh);e.setAttribute("lineDistance",new le(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");else e.isGeometry&&console.error("THREE.LineSegments.computeLineDistances() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.");return this}};vt.prototype.isLineSegments=!0;var ir=class extends Gt{constructor(e,t){super(e,t),this.type="LineLoop"}};ir.prototype.isLineLoop=!0;var hn=class extends nt{constructor(e){super(),this.type="PointsMaterial",this.color=new ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this}};hn.prototype.isPointsMaterial=!0;var Bh=new he,Wl=new Jt,bo=new Yt,So=new b,ci=class extends Ie{constructor(e=new _e,t=new hn){super(),this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),this.material=e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),bo.copy(n.boundingSphere),bo.applyMatrix4(i),bo.radius+=s,e.ray.intersectsSphere(bo)===!1)return;Bh.copy(i).invert(),Wl.copy(e.ray).applyMatrix4(Bh);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a;if(n.isBufferGeometry){let c=n.index,p=n.attributes.position;if(c!==null){let h=Math.max(0,o.start),u=Math.min(c.count,o.start+o.count);for(let d=h,m=u;d<m;d++){let y=c.getX(d);So.fromBufferAttribute(p,y),Oh(So,y,l,i,e,t,this)}}else{let h=Math.max(0,o.start),u=Math.min(p.count,o.start+o.count);for(let d=h,m=u;d<m;d++)So.fromBufferAttribute(p,d),Oh(So,d,l,i,e,t,this)}}else console.error("THREE.Points.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}updateMorphTargets(){let e=this.geometry;if(e.isBufferGeometry){let t=e.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}else{let t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Points.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.")}}};ci.prototype.isPoints=!0;function Oh(r,e,t,n,i,s,o){let a=Wl.distanceSqToPoint(r);if(a<t){let l=new b;Wl.closestPointToPoint(r,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,object:o})}}var ta=class extends at{constructor(e,t,n,i,s,o,a,l,c){super(e,t,n,i,s,o,a,l,c),this.format=a!==void 0?a:ei,this.minFilter=o!==void 0?o:st,this.magFilter=s!==void 0?s:st,this.generateMipmaps=!1;let f=this;function p(){f.needsUpdate=!0,e.requestVideoFrameCallback(p)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(p)}clone(){return new this.constructor(this.image).copy(this)}update(){let e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}};ta.prototype.isVideoTexture=!0;var sr=class extends at{constructor(e,t,n,i,s,o,a,l,c,f,p,h){super(null,o,a,l,c,f,i,s,p,h),this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}};sr.prototype.isCompressedTexture=!0;var na=class extends at{constructor(e,t,n,i,s,o,a,l,c){super(e,t,n,i,s,o,a,l,c),this.needsUpdate=!0}};na.prototype.isCanvasTexture=!0;var ia=class extends at{constructor(e,t,n,i,s,o,a,l,c,f){if(f=f!==void 0?f:ti,f!==ti&&f!==Zi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&f===ti&&(n=Xs),n===void 0&&f===Zi&&(n=Yi),super(null,i,s,o,a,l,f,n,c),this.image={width:e,height:t},this.magFilter=a!==void 0?a:tt,this.minFilter=l!==void 0?l:tt,this.flipY=!1,this.generateMipmaps=!1}};ia.prototype.isDepthTexture=!0;var rr=class r extends _e{constructor(e=1,t=8,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);let s=[],o=[],a=[],l=[],c=new b,f=new X;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let p=0,h=3;p<=t;p++,h+=3){let u=n+p/t*i;c.x=e*Math.cos(u),c.y=e*Math.sin(u),o.push(c.x,c.y,c.z),a.push(0,0,1),f.x=(o[h]/e+1)/2,f.y=(o[h+1]/e+1)/2,l.push(f.x,f.y)}for(let p=1;p<=t;p++)s.push(p,p+1,0);this.setIndex(s),this.setAttribute("position",new le(o,3)),this.setAttribute("normal",new le(a,3)),this.setAttribute("uv",new le(l,2))}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},hi=class r extends _e{constructor(e=1,t=1,n=1,i=8,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),s=Math.floor(s);let f=[],p=[],h=[],u=[],d=0,m=[],y=n/2,g=0;x(),o===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(f),this.setAttribute("position",new le(p,3)),this.setAttribute("normal",new le(h,3)),this.setAttribute("uv",new le(u,2));function x(){let v=new b,M=new b,T=0,w=(t-e)/n;for(let C=0;C<=s;C++){let I=[],L=C/s,R=L*(t-e)+e;for(let W=0;W<=i;W++){let D=W/i,F=D*l+a,U=Math.sin(F),z=Math.cos(F);M.x=R*U,M.y=-L*n+y,M.z=R*z,p.push(M.x,M.y,M.z),v.set(U,w,z).normalize(),h.push(v.x,v.y,v.z),u.push(D,1-L),I.push(d++)}m.push(I)}for(let C=0;C<i;C++)for(let I=0;I<s;I++){let L=m[I][C],R=m[I+1][C],W=m[I+1][C+1],D=m[I][C+1];f.push(L,R,D),f.push(R,W,D),T+=6}c.addGroup(g,T,0),g+=T}function _(v){let M=d,T=new X,w=new b,C=0,I=v===!0?e:t,L=v===!0?1:-1;for(let W=1;W<=i;W++)p.push(0,y*L,0),h.push(0,L,0),u.push(.5,.5),d++;let R=d;for(let W=0;W<=i;W++){let F=W/i*l+a,U=Math.cos(F),z=Math.sin(F);w.x=I*z,w.y=y*L,w.z=I*U,p.push(w.x,w.y,w.z),h.push(0,L,0),T.x=U*.5+.5,T.y=z*.5*L+.5,u.push(T.x,T.y),d++}for(let W=0;W<i;W++){let D=M+W,F=R+W;v===!0?f.push(F,F+1,D):f.push(F+1,F,D),C+=3}c.addGroup(g,C,v===!0?1:2),g+=C}}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},or=class r extends hi{constructor(e=1,t=1,n=8,i=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},un=class r extends _e{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};let s=[],o=[];a(i),c(n),f(),this.setAttribute("position",new le(s,3)),this.setAttribute("normal",new le(s.slice(),3)),this.setAttribute("uv",new le(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let _=new b,v=new b,M=new b;for(let T=0;T<t.length;T+=3)u(t[T+0],_),u(t[T+1],v),u(t[T+2],M),l(_,v,M,x)}function l(x,_,v,M){let T=M+1,w=[];for(let C=0;C<=T;C++){w[C]=[];let I=x.clone().lerp(v,C/T),L=_.clone().lerp(v,C/T),R=T-C;for(let W=0;W<=R;W++)W===0&&C===T?w[C][W]=I:w[C][W]=I.clone().lerp(L,W/R)}for(let C=0;C<T;C++)for(let I=0;I<2*(T-C)-1;I++){let L=Math.floor(I/2);I%2===0?(h(w[C][L+1]),h(w[C+1][L]),h(w[C][L])):(h(w[C][L+1]),h(w[C+1][L+1]),h(w[C+1][L]))}}function c(x){let _=new b;for(let v=0;v<s.length;v+=3)_.x=s[v+0],_.y=s[v+1],_.z=s[v+2],_.normalize().multiplyScalar(x),s[v+0]=_.x,s[v+1]=_.y,s[v+2]=_.z}function f(){let x=new b;for(let _=0;_<s.length;_+=3){x.x=s[_+0],x.y=s[_+1],x.z=s[_+2];let v=y(x)/2/Math.PI+.5,M=g(x)/Math.PI+.5;o.push(v,1-M)}d(),p()}function p(){for(let x=0;x<o.length;x+=6){let _=o[x+0],v=o[x+2],M=o[x+4],T=Math.max(_,v,M),w=Math.min(_,v,M);T>.9&&w<.1&&(_<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),M<.2&&(o[x+4]+=1))}}function h(x){s.push(x.x,x.y,x.z)}function u(x,_){let v=x*3;_.x=e[v+0],_.y=e[v+1],_.z=e[v+2]}function d(){let x=new b,_=new b,v=new b,M=new b,T=new X,w=new X,C=new X;for(let I=0,L=0;I<s.length;I+=9,L+=6){x.set(s[I+0],s[I+1],s[I+2]),_.set(s[I+3],s[I+4],s[I+5]),v.set(s[I+6],s[I+7],s[I+8]),T.set(o[L+0],o[L+1]),w.set(o[L+2],o[L+3]),C.set(o[L+4],o[L+5]),M.copy(x).add(_).add(v).divideScalar(3);let R=y(M);m(T,L+0,x,R),m(w,L+2,_,R),m(C,L+4,v,R)}}function m(x,_,v,M){M<0&&x.x===1&&(o[_]=x.x-1),v.x===0&&v.z===0&&(o[_]=M/2/Math.PI+.5)}function y(x){return Math.atan2(x.z,-x.x)}function g(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},ar=class r extends un{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Eo=new b,To=new b,xl=new b,Ao=new dt,lr=class extends _e{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let i=Math.pow(10,4),s=Math.cos(ni*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],f=["a","b","c"],p=new Array(3),h={},u=[];for(let d=0;d<l;d+=3){o?(c[0]=o.getX(d),c[1]=o.getX(d+1),c[2]=o.getX(d+2)):(c[0]=d,c[1]=d+1,c[2]=d+2);let{a:m,b:y,c:g}=Ao;if(m.fromBufferAttribute(a,c[0]),y.fromBufferAttribute(a,c[1]),g.fromBufferAttribute(a,c[2]),Ao.getNormal(xl),p[0]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,p[1]=`${Math.round(y.x*i)},${Math.round(y.y*i)},${Math.round(y.z*i)}`,p[2]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,!(p[0]===p[1]||p[1]===p[2]||p[2]===p[0]))for(let x=0;x<3;x++){let _=(x+1)%3,v=p[x],M=p[_],T=Ao[f[x]],w=Ao[f[_]],C=`${v}_${M}`,I=`${M}_${v}`;I in h&&h[I]?(xl.dot(h[I].normal)<=s&&(u.push(T.x,T.y,T.z),u.push(w.x,w.y,w.z)),h[I]=null):C in h||(h[C]={index0:c[x],index1:c[_],normal:xl.clone()})}}for(let d in h)if(h[d]){let{index0:m,index1:y}=h[d];Eo.fromBufferAttribute(a,m),To.fromBufferAttribute(a,y),u.push(Eo.x,Eo.y,Eo.z),u.push(To.x,To.y,To.z)}this.setAttribute("position",new le(u,3))}}},Mt=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,i=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),i=0,s=n.length,o;t?o=t:o=e*n[s-1];let a=0,l=s-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(s-1);let f=n[i],h=n[i+1]-f,u=(o-f)/h;return(i+u)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);let o=this.getPoint(i),a=this.getPoint(s),l=t||(o.isVector2?new X:new b);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new b,i=[],s=[],o=[],a=new b,l=new he;for(let u=0;u<=e;u++){let d=u/e;i[u]=this.getTangentAt(d,new b)}s[0]=new b,o[0]=new b;let c=Number.MAX_VALUE,f=Math.abs(i[0].x),p=Math.abs(i[0].y),h=Math.abs(i[0].z);f<=c&&(c=f,n.set(1,0,0)),p<=c&&(c=p,n.set(0,1,0)),h<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],a),o[0].crossVectors(i[0],s[0]);for(let u=1;u<=e;u++){if(s[u]=s[u-1].clone(),o[u]=o[u-1].clone(),a.crossVectors(i[u-1],i[u]),a.length()>Number.EPSILON){a.normalize();let d=Math.acos(ct(i[u-1].dot(i[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(a,d))}o[u].crossVectors(i[u],s[u])}if(t===!0){let u=Math.acos(ct(s[0].dot(s[e]),-1,1));u/=e,i[0].dot(a.crossVectors(s[0],s[e]))>0&&(u=-u);for(let d=1;d<=e;d++)s[d].applyMatrix4(l.makeRotationAxis(i[d],u*d)),o[d].crossVectors(i[d],s[d])}return{tangents:i,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.5,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ui=class extends Mt{constructor(e=0,t=0,n=1,i=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t){let n=t||new X,i=Math.PI*2,s=this.aEndAngle-this.aStartAngle,o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(o?s=0:s=i),this.aClockwise===!0&&!o&&(s===i?s=-i:s=s-i);let a=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let f=Math.cos(this.aRotation),p=Math.sin(this.aRotation),h=l-this.aX,u=c-this.aY;l=h*f-u*p+this.aX,c=h*p+u*f+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}};ui.prototype.isEllipseCurve=!0;var cr=class extends ui{constructor(e,t,n,i,s,o){super(e,t,n,n,i,s,o),this.type="ArcCurve"}};cr.prototype.isArcCurve=!0;function Cc(){let r=0,e=0,t=0,n=0;function i(s,o,a,l){r=s,e=a,t=-3*s+3*o-2*a-l,n=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){i(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,f,p){let h=(o-s)/c-(a-s)/(c+f)+(a-o)/f,u=(a-o)/f-(l-o)/(f+p)+(l-a)/p;h*=f,u*=f,i(o,a,h,u)},calc:function(s){let o=s*s,a=o*s;return r+e*s+t*o+n*a}}}var Co=new b,yl=new Cc,vl=new Cc,_l=new Cc,hr=class extends Mt{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new b){let n=t,i=this.points,s=i.length,o=(s-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,f;this.closed||a>0?c=i[(a-1)%s]:(Co.subVectors(i[0],i[1]).add(i[0]),c=Co);let p=i[a%s],h=i[(a+1)%s];if(this.closed||a+2<s?f=i[(a+2)%s]:(Co.subVectors(i[s-1],i[s-2]).add(i[s-1]),f=Co),this.curveType==="centripetal"||this.curveType==="chordal"){let u=this.curveType==="chordal"?.5:.25,d=Math.pow(c.distanceToSquared(p),u),m=Math.pow(p.distanceToSquared(h),u),y=Math.pow(h.distanceToSquared(f),u);m<1e-4&&(m=1),d<1e-4&&(d=m),y<1e-4&&(y=m),yl.initNonuniformCatmullRom(c.x,p.x,h.x,f.x,d,m,y),vl.initNonuniformCatmullRom(c.y,p.y,h.y,f.y,d,m,y),_l.initNonuniformCatmullRom(c.z,p.z,h.z,f.z,d,m,y)}else this.curveType==="catmullrom"&&(yl.initCatmullRom(c.x,p.x,h.x,f.x,this.tension),vl.initCatmullRom(c.y,p.y,h.y,f.y,this.tension),_l.initCatmullRom(c.z,p.z,h.z,f.z,this.tension));return n.set(yl.calc(l),vl.calc(l),_l.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new b().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};hr.prototype.isCatmullRomCurve3=!0;function Uh(r,e,t,n,i){let s=(n-e)*.5,o=(i-t)*.5,a=r*r,l=r*a;return(2*t-2*n+s+o)*l+(-3*t+3*n-2*s-o)*a+s*r+t}function jy(r,e){let t=1-r;return t*t*e}function Qy(r,e){return 2*(1-r)*r*e}function Ky(r,e){return r*r*e}function Us(r,e,t,n){return jy(r,e)+Qy(r,t)+Ky(r,n)}function e0(r,e){let t=1-r;return t*t*t*e}function t0(r,e){let t=1-r;return 3*t*t*r*e}function n0(r,e){return 3*(1-r)*r*r*e}function i0(r,e){return r*r*r*e}function Hs(r,e,t,n,i){return e0(r,e)+t0(r,t)+n0(r,n)+i0(r,i)}var ds=class extends Mt{constructor(e=new X,t=new X,n=new X,i=new X){super(),this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new X){let n=t,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Hs(e,i.x,s.x,o.x,a.x),Hs(e,i.y,s.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}};ds.prototype.isCubicBezierCurve=!0;var ur=class extends Mt{constructor(e=new b,t=new b,n=new b,i=new b){super(),this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new b){let n=t,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Hs(e,i.x,s.x,o.x,a.x),Hs(e,i.y,s.y,o.y,a.y),Hs(e,i.z,s.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}};ur.prototype.isCubicBezierCurve3=!0;var di=class extends Mt{constructor(e=new X,t=new X){super(),this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new X){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t){let n=t||new X;return n.copy(this.v2).sub(this.v1).normalize(),n}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}};di.prototype.isLineCurve=!0;var sa=class extends Mt{constructor(e=new b,t=new b){super(),this.type="LineCurve3",this.isLineCurve3=!0,this.v1=e,this.v2=t}getPoint(e,t=new b){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fs=class extends Mt{constructor(e=new X,t=new X,n=new X){super(),this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new X){let n=t,i=this.v0,s=this.v1,o=this.v2;return n.set(Us(e,i.x,s.x,o.x),Us(e,i.y,s.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}};fs.prototype.isQuadraticBezierCurve=!0;var ps=class extends Mt{constructor(e=new b,t=new b,n=new b){super(),this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new b){let n=t,i=this.v0,s=this.v1,o=this.v2;return n.set(Us(e,i.x,s.x,o.x),Us(e,i.y,s.y,o.y),Us(e,i.z,s.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}};ps.prototype.isQuadraticBezierCurve3=!0;var ms=class extends Mt{constructor(e=[]){super(),this.type="SplineCurve",this.points=e}getPoint(e,t=new X){let n=t,i=this.points,s=(i.length-1)*e,o=Math.floor(s),a=s-o,l=i[o===0?o:o-1],c=i[o],f=i[o>i.length-2?i.length-1:o+1],p=i[o>i.length-3?i.length-1:o+2];return n.set(Uh(a,l.x,c.x,f.x,p.x),Uh(a,l.y,c.y,f.y,p.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new X().fromArray(i))}return this}};ms.prototype.isSplineCurve=!0;var Rc=Object.freeze({__proto__:null,ArcCurve:cr,CatmullRomCurve3:hr,CubicBezierCurve:ds,CubicBezierCurve3:ur,EllipseCurve:ui,LineCurve:di,LineCurve3:sa,QuadraticBezierCurve:fs,QuadraticBezierCurve3:ps,SplineCurve:ms}),ra=class extends Mt{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);e.equals(t)||this.curves.push(new di(t,e))}getPoint(e,t){let n=e*this.getLength(),i=this.getCurveLengths(),s=0;for(;s<i.length;){if(i[s]>=n){let o=i[s]-n,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let i=0,s=this.curves;i<s.length;i++){let o=s[i],a=o&&o.isEllipseCurve?e*2:o&&(o.isLineCurve||o.isLineCurve3)?1:o&&o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let f=l[c];n&&n.equals(f)||(t.push(f),n=f)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(new Rc[i.type]().fromJSON(i))}return this}},fi=class extends ra{constructor(e){super(),this.type="Path",this.currentPoint=new X,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new di(this.currentPoint.clone(),new X(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){let s=new fs(this.currentPoint.clone(),new X(e,t),new X(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,o){let a=new ds(this.currentPoint.clone(),new X(e,t),new X(n,i),new X(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new ms(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,i,s,o),this}absarc(e,t,n,i,s,o){return this.absellipse(e,t,n,n,i,s,o),this}ellipse(e,t,n,i,s,o,a,l){let c=this.currentPoint.x,f=this.currentPoint.y;return this.absellipse(e+c,t+f,n,i,s,o,a,l),this}absellipse(e,t,n,i,s,o,a,l){let c=new ui(e,t,n,i,s,o,a,l);if(this.curves.length>0){let p=c.getPoint(0);p.equals(this.currentPoint)||this.lineTo(p.x,p.y)}this.curves.push(c);let f=c.getPoint(1);return this.currentPoint.copy(f),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Pt=class extends fi{constructor(e){super(e),this.uuid=Et(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(new fi().fromJSON(i))}return this}},s0={triangulate:function(r,e,t=2){let n=e&&e.length,i=n?e[0]*t:r.length,s=of(r,0,i,t,!0),o=[];if(!s||s.next===s.prev)return o;let a,l,c,f,p,h,u;if(n&&(s=c0(r,e,s,t)),r.length>80*t){a=c=r[0],l=f=r[1];for(let d=t;d<i;d+=t)p=r[d],h=r[d+1],p<a&&(a=p),h<l&&(l=h),p>c&&(c=p),h>f&&(f=h);u=Math.max(c-a,f-l),u=u!==0?1/u:0}return dr(s,o,t,a,l,u),o}};function of(r,e,t,n,i){let s,o;if(i===_0(r,e,t,n)>0)for(s=e;s<t;s+=n)o=Hh(s,r[s],r[s+1],o);else for(s=t-n;s>=e;s-=n)o=Hh(s,r[s],r[s+1],o);return o&&Ua(o,o.next)&&(pr(o),o=o.next),o}function Dn(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(Ua(t,t.next)||We(t.prev,t,t.next)===0)){if(pr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function dr(r,e,t,n,i,s,o){if(!r)return;!o&&s&&p0(r,n,i,s);let a=r,l,c;for(;r.prev!==r.next;){if(l=r.prev,c=r.next,s?o0(r,n,i,s):r0(r)){e.push(l.i/t),e.push(r.i/t),e.push(c.i/t),pr(r),r=c.next,a=c.next;continue}if(r=c,r===a){o?o===1?(r=a0(Dn(r),e,t),dr(r,e,t,n,i,s,2)):o===2&&l0(r,e,t,n,i,s):dr(Dn(r),e,t,n,i,s,1);break}}}function r0(r){let e=r.prev,t=r,n=r.next;if(We(e,t,n)>=0)return!1;let i=r.next.next;for(;i!==r.prev;){if(Xi(e.x,e.y,t.x,t.y,n.x,n.y,i.x,i.y)&&We(i.prev,i,i.next)>=0)return!1;i=i.next}return!0}function o0(r,e,t,n){let i=r.prev,s=r,o=r.next;if(We(i,s,o)>=0)return!1;let a=i.x<s.x?i.x<o.x?i.x:o.x:s.x<o.x?s.x:o.x,l=i.y<s.y?i.y<o.y?i.y:o.y:s.y<o.y?s.y:o.y,c=i.x>s.x?i.x>o.x?i.x:o.x:s.x>o.x?s.x:o.x,f=i.y>s.y?i.y>o.y?i.y:o.y:s.y>o.y?s.y:o.y,p=Xl(a,l,e,t,n),h=Xl(c,f,e,t,n),u=r.prevZ,d=r.nextZ;for(;u&&u.z>=p&&d&&d.z<=h;){if(u!==r.prev&&u!==r.next&&Xi(i.x,i.y,s.x,s.y,o.x,o.y,u.x,u.y)&&We(u.prev,u,u.next)>=0||(u=u.prevZ,d!==r.prev&&d!==r.next&&Xi(i.x,i.y,s.x,s.y,o.x,o.y,d.x,d.y)&&We(d.prev,d,d.next)>=0))return!1;d=d.nextZ}for(;u&&u.z>=p;){if(u!==r.prev&&u!==r.next&&Xi(i.x,i.y,s.x,s.y,o.x,o.y,u.x,u.y)&&We(u.prev,u,u.next)>=0)return!1;u=u.prevZ}for(;d&&d.z<=h;){if(d!==r.prev&&d!==r.next&&Xi(i.x,i.y,s.x,s.y,o.x,o.y,d.x,d.y)&&We(d.prev,d,d.next)>=0)return!1;d=d.nextZ}return!0}function a0(r,e,t){let n=r;do{let i=n.prev,s=n.next.next;!Ua(i,s)&&af(i,n,n.next,s)&&fr(i,s)&&fr(s,i)&&(e.push(i.i/t),e.push(n.i/t),e.push(s.i/t),pr(n),pr(n.next),n=r=s),n=n.next}while(n!==r);return Dn(n)}function l0(r,e,t,n,i,s){let o=r;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&x0(o,a)){let l=lf(o,a);o=Dn(o,o.next),l=Dn(l,l.next),dr(o,e,t,n,i,s),dr(l,e,t,n,i,s);return}a=a.next}o=o.next}while(o!==r)}function c0(r,e,t,n){let i=[],s,o,a,l,c;for(s=0,o=e.length;s<o;s++)a=e[s]*n,l=s<o-1?e[s+1]*n:r.length,c=of(r,a,l,n,!1),c===c.next&&(c.steiner=!0),i.push(g0(c));for(i.sort(h0),s=0;s<i.length;s++)u0(i[s],t),t=Dn(t,t.next);return t}function h0(r,e){return r.x-e.x}function u0(r,e){if(e=d0(r,e),e){let t=lf(e,r);Dn(e,e.next),Dn(t,t.next)}}function d0(r,e){let t=e,n=r.x,i=r.y,s=-1/0,o;do{if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){let h=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=n&&h>s){if(s=h,h===n){if(i===t.y)return t;if(i===t.next.y)return t.next}o=t.x<t.next.x?t:t.next}}t=t.next}while(t!==e);if(!o)return null;if(n===s)return o;let a=o,l=o.x,c=o.y,f=1/0,p;t=o;do n>=t.x&&t.x>=l&&n!==t.x&&Xi(i<c?n:s,i,l,c,i<c?s:n,i,t.x,t.y)&&(p=Math.abs(i-t.y)/(n-t.x),fr(t,r)&&(p<f||p===f&&(t.x>o.x||t.x===o.x&&f0(o,t)))&&(o=t,f=p)),t=t.next;while(t!==a);return o}function f0(r,e){return We(r.prev,r,e.prev)<0&&We(e.next,r,r.next)<0}function p0(r,e,t,n){let i=r;do i.z===null&&(i.z=Xl(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,m0(i)}function m0(r){let e,t,n,i,s,o,a,l,c=1;do{for(t=r,r=null,s=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,a--):(i=n,n=n.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;t=n}s.nextZ=null,c*=2}while(o>1);return r}function Xl(r,e,t,n,i){return r=32767*(r-t)*i,e=32767*(e-n)*i,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function g0(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function Xi(r,e,t,n,i,s,o,a){return(i-o)*(e-a)-(r-o)*(s-a)>=0&&(r-o)*(n-a)-(t-o)*(e-a)>=0&&(t-o)*(s-a)-(i-o)*(n-a)>=0}function x0(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!y0(r,e)&&(fr(r,e)&&fr(e,r)&&v0(r,e)&&(We(r.prev,r,e.prev)||We(r,e.prev,e))||Ua(r,e)&&We(r.prev,r,r.next)>0&&We(e.prev,e,e.next)>0)}function We(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function Ua(r,e){return r.x===e.x&&r.y===e.y}function af(r,e,t,n){let i=Lo(We(r,e,t)),s=Lo(We(r,e,n)),o=Lo(We(t,n,r)),a=Lo(We(t,n,e));return!!(i!==s&&o!==a||i===0&&Ro(r,t,e)||s===0&&Ro(r,n,e)||o===0&&Ro(t,r,n)||a===0&&Ro(t,e,n))}function Ro(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Lo(r){return r>0?1:r<0?-1:0}function y0(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&af(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function fr(r,e){return We(r.prev,r,r.next)<0?We(r,e,r.next)>=0&&We(r,r.prev,e)>=0:We(r,e,r.prev)<0||We(r,r.next,e)<0}function v0(r,e){let t=r,n=!1,i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function lf(r,e){let t=new ql(r.i,r.x,r.y),n=new ql(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Hh(r,e,t,n){let i=new ql(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function pr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function ql(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function _0(r,e,t,n){let i=0;for(let s=e,o=t-n;s<t;s+=n)i+=(r[o]-r[s])*(r[s+1]+r[o+1]),o=s;return i}var Xt=class r{static area(e){let t=e.length,n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let n=[],i=[],s=[];Gh(e),kh(n,e);let o=e.length;t.forEach(Gh);for(let l=0;l<t.length;l++)i.push(o),o+=t[l].length,kh(n,t[l]);let a=s0.triangulate(n,i);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}};function Gh(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function kh(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}var dn=class r extends _e{constructor(e=new Pt([new X(.5,.5),new X(-.5,.5),new X(-.5,-.5),new X(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,i=[],s=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new le(i,3)),this.setAttribute("uv",new le(s,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,f=t.steps!==void 0?t.steps:1,p=t.depth!==void 0?t.depth:1,h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,u=t.bevelThickness!==void 0?t.bevelThickness:.2,d=t.bevelSize!==void 0?t.bevelSize:u-.1,m=t.bevelOffset!==void 0?t.bevelOffset:0,y=t.bevelSegments!==void 0?t.bevelSegments:3,g=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:w0;t.amount!==void 0&&(console.warn("THREE.ExtrudeBufferGeometry: amount has been renamed to depth."),p=t.amount);let _,v=!1,M,T,w,C;g&&(_=g.getSpacedPoints(f),v=!0,h=!1,M=g.computeFrenetFrames(f,!1),T=new b,w=new b,C=new b),h||(y=0,u=0,d=0,m=0);let I=a.extractPoints(c),L=I.shape,R=I.holes;if(!Xt.isClockWise(L)){L=L.reverse();for(let V=0,Z=R.length;V<Z;V++){let ee=R[V];Xt.isClockWise(ee)&&(R[V]=ee.reverse())}}let D=Xt.triangulateShape(L,R),F=L;for(let V=0,Z=R.length;V<Z;V++){let ee=R[V];L=L.concat(ee)}function U(V,Z,ee){return Z||console.error("THREE.ExtrudeGeometry: vec does not exist"),Z.clone().multiplyScalar(ee).add(V)}let z=L.length,B=D.length;function Q(V,Z,ee){let pe,ie,A,S=V.x-Z.x,G=V.y-Z.y,$=ee.x-V.x,j=ee.y-V.y,ae=S*S+G*G,Me=S*j-G*$;if(Math.abs(Me)>Number.EPSILON){let xe=Math.sqrt(ae),Ee=Math.sqrt($*$+j*j),me=Z.x-G/xe,P=Z.y+S/xe,se=ee.x-j/Ee,Y=ee.y+$/Ee,ge=((se-me)*j-(Y-P)*$)/(S*j-G*$);pe=me+S*ge-V.x,ie=P+G*ge-V.y;let ue=pe*pe+ie*ie;if(ue<=2)return new X(pe,ie);A=Math.sqrt(ue/2)}else{let xe=!1;S>Number.EPSILON?$>Number.EPSILON&&(xe=!0):S<-Number.EPSILON?$<-Number.EPSILON&&(xe=!0):Math.sign(G)===Math.sign(j)&&(xe=!0),xe?(pe=-G,ie=S,A=Math.sqrt(ae)):(pe=S,ie=G,A=Math.sqrt(ae/2))}return new X(pe/A,ie/A)}let ce=[];for(let V=0,Z=F.length,ee=Z-1,pe=V+1;V<Z;V++,ee++,pe++)ee===Z&&(ee=0),pe===Z&&(pe=0),ce[V]=Q(F[V],F[ee],F[pe]);let ye=[],re,Te=ce.concat();for(let V=0,Z=R.length;V<Z;V++){let ee=R[V];re=[];for(let pe=0,ie=ee.length,A=ie-1,S=pe+1;pe<ie;pe++,A++,S++)A===ie&&(A=0),S===ie&&(S=0),re[pe]=Q(ee[pe],ee[A],ee[S]);ye.push(re),Te=Te.concat(re)}for(let V=0;V<y;V++){let Z=V/y,ee=u*Math.cos(Z*Math.PI/2),pe=d*Math.sin(Z*Math.PI/2)+m;for(let ie=0,A=F.length;ie<A;ie++){let S=U(F[ie],ce[ie],pe);ve(S.x,S.y,-ee)}for(let ie=0,A=R.length;ie<A;ie++){let S=R[ie];re=ye[ie];for(let G=0,$=S.length;G<$;G++){let j=U(S[G],re[G],pe);ve(j.x,j.y,-ee)}}}let J=d+m;for(let V=0;V<z;V++){let Z=h?U(L[V],Te[V],J):L[V];v?(w.copy(M.normals[0]).multiplyScalar(Z.x),T.copy(M.binormals[0]).multiplyScalar(Z.y),C.copy(_[0]).add(w).add(T),ve(C.x,C.y,C.z)):ve(Z.x,Z.y,0)}for(let V=1;V<=f;V++)for(let Z=0;Z<z;Z++){let ee=h?U(L[Z],Te[Z],J):L[Z];v?(w.copy(M.normals[V]).multiplyScalar(ee.x),T.copy(M.binormals[V]).multiplyScalar(ee.y),C.copy(_[V]).add(w).add(T),ve(C.x,C.y,C.z)):ve(ee.x,ee.y,p/f*V)}for(let V=y-1;V>=0;V--){let Z=V/y,ee=u*Math.cos(Z*Math.PI/2),pe=d*Math.sin(Z*Math.PI/2)+m;for(let ie=0,A=F.length;ie<A;ie++){let S=U(F[ie],ce[ie],pe);ve(S.x,S.y,p+ee)}for(let ie=0,A=R.length;ie<A;ie++){let S=R[ie];re=ye[ie];for(let G=0,$=S.length;G<$;G++){let j=U(S[G],re[G],pe);v?ve(j.x,j.y+_[f-1].y,_[f-1].x+ee):ve(j.x,j.y,p+ee)}}}K(),de();function K(){let V=i.length/3;if(h){let Z=0,ee=z*Z;for(let pe=0;pe<B;pe++){let ie=D[pe];Se(ie[2]+ee,ie[1]+ee,ie[0]+ee)}Z=f+y*2,ee=z*Z;for(let pe=0;pe<B;pe++){let ie=D[pe];Se(ie[0]+ee,ie[1]+ee,ie[2]+ee)}}else{for(let Z=0;Z<B;Z++){let ee=D[Z];Se(ee[2],ee[1],ee[0])}for(let Z=0;Z<B;Z++){let ee=D[Z];Se(ee[0]+z*f,ee[1]+z*f,ee[2]+z*f)}}n.addGroup(V,i.length/3-V,0)}function de(){let V=i.length/3,Z=0;k(F,Z),Z+=F.length;for(let ee=0,pe=R.length;ee<pe;ee++){let ie=R[ee];k(ie,Z),Z+=ie.length}n.addGroup(V,i.length/3-V,1)}function k(V,Z){let ee=V.length;for(;--ee>=0;){let pe=ee,ie=ee-1;ie<0&&(ie=V.length-1);for(let A=0,S=f+y*2;A<S;A++){let G=z*A,$=z*(A+1),j=Z+pe+G,ae=Z+ie+G,Me=Z+ie+$,xe=Z+pe+$;oe(j,ae,Me,xe)}}}function ve(V,Z,ee){l.push(V),l.push(Z),l.push(ee)}function Se(V,Z,ee){fe(V),fe(Z),fe(ee);let pe=i.length/3,ie=x.generateTopUV(n,i,pe-3,pe-2,pe-1);Ce(ie[0]),Ce(ie[1]),Ce(ie[2])}function oe(V,Z,ee,pe){fe(V),fe(Z),fe(pe),fe(Z),fe(ee),fe(pe);let ie=i.length/3,A=x.generateSideWallUV(n,i,ie-6,ie-3,ie-2,ie-1);Ce(A[0]),Ce(A[1]),Ce(A[3]),Ce(A[1]),Ce(A[2]),Ce(A[3])}function fe(V){i.push(l[V*3+0]),i.push(l[V*3+1]),i.push(l[V*3+2])}function Ce(V){s.push(V.x),s.push(V.y)}}}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return M0(t,n,e)}static fromJSON(e,t){let n=[];for(let s=0,o=e.shapes.length;s<o;s++){let a=t[e.shapes[s]];n.push(a)}let i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Rc[i.type]().fromJSON(i)),new r(n,e.options)}},w0={generateTopUV:function(r,e,t,n,i){let s=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[i*3],f=e[i*3+1];return[new X(s,o),new X(a,l),new X(c,f)]},generateSideWallUV:function(r,e,t,n,i,s){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],f=e[n*3+1],p=e[n*3+2],h=e[i*3],u=e[i*3+1],d=e[i*3+2],m=e[s*3],y=e[s*3+1],g=e[s*3+2];return Math.abs(a-f)<Math.abs(o-c)?[new X(o,1-l),new X(c,1-p),new X(h,1-d),new X(m,1-g)]:[new X(a,1-l),new X(f,1-p),new X(u,1-d),new X(y,1-g)]}};function M0(r,e,t){if(t.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){let s=r[n];t.shapes.push(s.uuid)}else t.shapes.push(r.uuid);return e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var mr=class r extends un{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},gr=class r extends _e{constructor(e=[new X(0,.5),new X(.5,0),new X(0,-.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=ct(i,0,Math.PI*2);let s=[],o=[],a=[],l=1/t,c=new b,f=new X;for(let p=0;p<=t;p++){let h=n+p*l*i,u=Math.sin(h),d=Math.cos(h);for(let m=0;m<=e.length-1;m++)c.x=e[m].x*u,c.y=e[m].y,c.z=e[m].x*d,o.push(c.x,c.y,c.z),f.x=p/t,f.y=m/(e.length-1),a.push(f.x,f.y)}for(let p=0;p<t;p++)for(let h=0;h<e.length-1;h++){let u=h+p*e.length,d=u,m=u+e.length,y=u+e.length+1,g=u+1;s.push(d,m,g),s.push(m,y,g)}if(this.setIndex(s),this.setAttribute("position",new le(o,3)),this.setAttribute("uv",new le(a,2)),this.computeVertexNormals(),i===Math.PI*2){let p=this.attributes.normal.array,h=new b,u=new b,d=new b,m=t*e.length*3;for(let y=0,g=0;y<e.length;y++,g+=3)h.x=p[g+0],h.y=p[g+1],h.z=p[g+2],u.x=p[m+g+0],u.y=p[m+g+1],u.z=p[m+g+2],d.addVectors(h,u).normalize(),p[g+0]=p[m+g+0]=d.x,p[g+1]=p[m+g+1]=d.y,p[g+2]=p[m+g+2]=d.z}}static fromJSON(e){return new r(e.points,e.segments,e.phiStart,e.phiLength)}},gs=class r extends un{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},xr=class r extends _e{constructor(e=.5,t=1,n=8,i=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);let a=[],l=[],c=[],f=[],p=e,h=(t-e)/i,u=new b,d=new X;for(let m=0;m<=i;m++){for(let y=0;y<=n;y++){let g=s+y/n*o;u.x=p*Math.cos(g),u.y=p*Math.sin(g),l.push(u.x,u.y,u.z),c.push(0,0,1),d.x=(u.x/t+1)/2,d.y=(u.y/t+1)/2,f.push(d.x,d.y)}p+=h}for(let m=0;m<i;m++){let y=m*(n+1);for(let g=0;g<n;g++){let x=g+y,_=x,v=x+n+1,M=x+n+2,T=x+1;a.push(_,v,T),a.push(v,M,T)}}this.setIndex(a),this.setAttribute("position",new le(l,3)),this.setAttribute("normal",new le(c,3)),this.setAttribute("uv",new le(f,2))}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},xs=class r extends _e{constructor(e=new Pt([new X(0,.5),new X(-.5,-.5),new X(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],i=[],s=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let f=0;f<e.length;f++)c(e[f]),this.addGroup(a,l,f),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new le(i,3)),this.setAttribute("normal",new le(s,3)),this.setAttribute("uv",new le(o,2));function c(f){let p=i.length/3,h=f.extractPoints(t),u=h.shape,d=h.holes;Xt.isClockWise(u)===!1&&(u=u.reverse());for(let y=0,g=d.length;y<g;y++){let x=d[y];Xt.isClockWise(x)===!0&&(d[y]=x.reverse())}let m=Xt.triangulateShape(u,d);for(let y=0,g=d.length;y<g;y++){let x=d[y];u=u.concat(x)}for(let y=0,g=u.length;y<g;y++){let x=u[y];i.push(x.x,x.y,0),s.push(0,0,1),o.push(x.x,x.y)}for(let y=0,g=m.length;y<g;y++){let x=m[y],_=x[0]+p,v=x[1]+p,M=x[2]+p;n.push(_,v,M),l+=3}}}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return b0(t,e)}static fromJSON(e,t){let n=[];for(let i=0,s=e.shapes.length;i<s;i++){let o=t[e.shapes[i]];n.push(o)}return new r(n,e.curveSegments)}};function b0(r,e){if(e.shapes=[],Array.isArray(r))for(let t=0,n=r.length;t<n;t++){let i=r[t];e.shapes.push(i.uuid)}else e.shapes.push(r.uuid);return e}var ys=class r extends _e{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,f=[],p=new b,h=new b,u=[],d=[],m=[],y=[];for(let g=0;g<=n;g++){let x=[],_=g/n,v=0;g==0&&o==0?v=.5/t:g==n&&l==Math.PI&&(v=-.5/t);for(let M=0;M<=t;M++){let T=M/t;p.x=-e*Math.cos(i+T*s)*Math.sin(o+_*a),p.y=e*Math.cos(o+_*a),p.z=e*Math.sin(i+T*s)*Math.sin(o+_*a),d.push(p.x,p.y,p.z),h.copy(p).normalize(),m.push(h.x,h.y,h.z),y.push(T+v,1-_),x.push(c++)}f.push(x)}for(let g=0;g<n;g++)for(let x=0;x<t;x++){let _=f[g][x+1],v=f[g][x],M=f[g+1][x],T=f[g+1][x+1];(g!==0||o>0)&&u.push(_,v,T),(g!==n-1||l<Math.PI)&&u.push(v,M,T)}this.setIndex(u),this.setAttribute("position",new le(d,3)),this.setAttribute("normal",new le(m,3)),this.setAttribute("uv",new le(y,2))}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},yr=class r extends un{constructor(e=1,t=0){let n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},vr=class r extends _e{constructor(e=1,t=.4,n=8,i=6,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],l=[],c=[],f=new b,p=new b,h=new b;for(let u=0;u<=n;u++)for(let d=0;d<=i;d++){let m=d/i*s,y=u/n*Math.PI*2;p.x=(e+t*Math.cos(y))*Math.cos(m),p.y=(e+t*Math.cos(y))*Math.sin(m),p.z=t*Math.sin(y),a.push(p.x,p.y,p.z),f.x=e*Math.cos(m),f.y=e*Math.sin(m),h.subVectors(p,f).normalize(),l.push(h.x,h.y,h.z),c.push(d/i),c.push(u/n)}for(let u=1;u<=n;u++)for(let d=1;d<=i;d++){let m=(i+1)*u+d-1,y=(i+1)*(u-1)+d-1,g=(i+1)*(u-1)+d,x=(i+1)*u+d;o.push(m,y,x),o.push(y,g,x)}this.setIndex(o),this.setAttribute("position",new le(a,3)),this.setAttribute("normal",new le(l,3)),this.setAttribute("uv",new le(c,2))}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},_r=class r extends _e{constructor(e=1,t=.4,n=64,i=8,s=2,o=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:s,q:o},n=Math.floor(n),i=Math.floor(i);let a=[],l=[],c=[],f=[],p=new b,h=new b,u=new b,d=new b,m=new b,y=new b,g=new b;for(let _=0;_<=n;++_){let v=_/n*s*Math.PI*2;x(v,s,o,e,u),x(v+.01,s,o,e,d),y.subVectors(d,u),g.addVectors(d,u),m.crossVectors(y,g),g.crossVectors(m,y),m.normalize(),g.normalize();for(let M=0;M<=i;++M){let T=M/i*Math.PI*2,w=-t*Math.cos(T),C=t*Math.sin(T);p.x=u.x+(w*g.x+C*m.x),p.y=u.y+(w*g.y+C*m.y),p.z=u.z+(w*g.z+C*m.z),l.push(p.x,p.y,p.z),h.subVectors(p,u).normalize(),c.push(h.x,h.y,h.z),f.push(_/n),f.push(M/i)}}for(let _=1;_<=n;_++)for(let v=1;v<=i;v++){let M=(i+1)*(_-1)+(v-1),T=(i+1)*_+(v-1),w=(i+1)*_+v,C=(i+1)*(_-1)+v;a.push(M,T,C),a.push(T,w,C)}this.setIndex(a),this.setAttribute("position",new le(l,3)),this.setAttribute("normal",new le(c,3)),this.setAttribute("uv",new le(f,2));function x(_,v,M,T,w){let C=Math.cos(_),I=Math.sin(_),L=M/v*_,R=Math.cos(L);w.x=T*(2+R)*.5*C,w.y=T*(2+R)*I*.5,w.z=T*Math.sin(L)*.5}}static fromJSON(e){return new r(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},wr=class r extends _e{constructor(e=new ps(new b(-1,-1,0),new b(-1,1,0),new b(1,1,0)),t=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:s};let o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new b,l=new b,c=new X,f=new b,p=[],h=[],u=[],d=[];m(),this.setIndex(d),this.setAttribute("position",new le(p,3)),this.setAttribute("normal",new le(h,3)),this.setAttribute("uv",new le(u,2));function m(){for(let _=0;_<t;_++)y(_);y(s===!1?t:0),x(),g()}function y(_){f=e.getPointAt(_/t,f);let v=o.normals[_],M=o.binormals[_];for(let T=0;T<=i;T++){let w=T/i*Math.PI*2,C=Math.sin(w),I=-Math.cos(w);l.x=I*v.x+C*M.x,l.y=I*v.y+C*M.y,l.z=I*v.z+C*M.z,l.normalize(),h.push(l.x,l.y,l.z),a.x=f.x+n*l.x,a.y=f.y+n*l.y,a.z=f.z+n*l.z,p.push(a.x,a.y,a.z)}}function g(){for(let _=1;_<=t;_++)for(let v=1;v<=i;v++){let M=(i+1)*(_-1)+(v-1),T=(i+1)*_+(v-1),w=(i+1)*_+v,C=(i+1)*(_-1)+v;d.push(M,T,C),d.push(T,w,C)}}function x(){for(let _=0;_<=t;_++)for(let v=0;v<=i;v++)c.x=_/t,c.y=v/i,u.push(c.x,c.y)}}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new r(new Rc[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Mr=class extends _e{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],n=new Set,i=new b,s=new b;if(e.index!==null){let o=e.attributes.position,a=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,f=l.length;c<f;++c){let p=l[c],h=p.start,u=p.count;for(let d=h,m=h+u;d<m;d+=3)for(let y=0;y<3;y++){let g=a.getX(d+y),x=a.getX(d+(y+1)%3);i.fromBufferAttribute(o,g),s.fromBufferAttribute(o,x),Vh(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}}else{let o=e.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){let f=3*a+c,p=3*a+(c+1)%3;i.fromBufferAttribute(o,f),s.fromBufferAttribute(o,p),Vh(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new le(t,3))}}};function Vh(r,e,t){let n=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(n)===!0||t.has(i)===!0?!1:(t.add(n,i),!0)}var Wh=Object.freeze({__proto__:null,BoxGeometry:Cn,BoxBufferGeometry:Cn,CircleGeometry:rr,CircleBufferGeometry:rr,ConeGeometry:or,ConeBufferGeometry:or,CylinderGeometry:hi,CylinderBufferGeometry:hi,DodecahedronGeometry:ar,DodecahedronBufferGeometry:ar,EdgesGeometry:lr,ExtrudeGeometry:dn,ExtrudeBufferGeometry:dn,IcosahedronGeometry:mr,IcosahedronBufferGeometry:mr,LatheGeometry:gr,LatheBufferGeometry:gr,OctahedronGeometry:gs,OctahedronBufferGeometry:gs,PlaneGeometry:is,PlaneBufferGeometry:is,PolyhedronGeometry:un,PolyhedronBufferGeometry:un,RingGeometry:xr,RingBufferGeometry:xr,ShapeGeometry:xs,ShapeBufferGeometry:xs,SphereGeometry:ys,SphereBufferGeometry:ys,TetrahedronGeometry:yr,TetrahedronBufferGeometry:yr,TorusGeometry:vr,TorusBufferGeometry:vr,TorusKnotGeometry:_r,TorusKnotBufferGeometry:_r,TubeGeometry:wr,TubeBufferGeometry:wr,WireframeGeometry:Mr}),br=class extends nt{constructor(e){super(),this.type="ShadowMaterial",this.color=new ne(0),this.transparent=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this}};br.prototype.isShadowMaterial=!0;var vs=class extends nt{constructor(e){super(),this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this}};vs.prototype.isMeshStandardMaterial=!0;var Sr=class extends vs{constructor(e){super(),this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new X(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ct(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.sheenColor=new ne(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=.01,this.thicknessMap=null,this.attenuationDistance=0,this.attenuationColor=new ne(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ne(1,1,1),this.specularColorMap=null,this._sheen=0,this._clearcoat=0,this._transmission=0,this.setValues(e)}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};Sr.prototype.isMeshPhysicalMaterial=!0;var Er=class extends nt{constructor(e){super(),this.type="MeshPhongMaterial",this.color=new ne(16777215),this.specular=new ne(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Wr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this}};Er.prototype.isMeshPhongMaterial=!0;var Tr=class extends nt{constructor(e){super(),this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ne(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this}};Tr.prototype.isMeshToonMaterial=!0;var Ar=class extends nt{constructor(e){super(),this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}};Ar.prototype.isMeshNormalMaterial=!0;var Cr=class extends nt{constructor(e){super(),this.type="MeshLambertMaterial",this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Wr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this}};Cr.prototype.isMeshLambertMaterial=!0;var Rr=class extends nt{constructor(e){super(),this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new ne(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.flatShading=e.flatShading,this}};Rr.prototype.isMeshMatcapMaterial=!0;var Lr=class extends it{constructor(e){super(),this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};Lr.prototype.isLineDashedMaterial=!0;var S0=Object.freeze({__proto__:null,ShadowMaterial:br,SpriteMaterial:ls,RawShaderMaterial:Ln,ShaderMaterial:Ht,PointsMaterial:hn,MeshPhysicalMaterial:Sr,MeshStandardMaterial:vs,MeshPhongMaterial:Er,MeshToonMaterial:Tr,MeshNormalMaterial:Ar,MeshLambertMaterial:Cr,MeshDepthMaterial:rs,MeshDistanceMaterial:os,MeshBasicMaterial:Ut,MeshMatcapMaterial:Rr,LineDashedMaterial:Lr,LineBasicMaterial:it,Material:nt}),Ve={arraySlice:function(r,e,t){return Ve.isTypedArray(r)?new r.constructor(r.subarray(e,t!==void 0?t:r.length)):r.slice(e,t)},convertArray:function(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)},isTypedArray:function(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)},getKeyframeOrder:function(r){function e(i,s){return r[i]-r[s]}let t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n},sortedArray:function(r,e,t){let n=r.length,i=new r.constructor(n);for(let s=0,o=0;o!==n;++s){let a=t[s]*e;for(let l=0;l!==e;++l)i[o++]=r[a+l]}return i},flattenJSON:function(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(e.push(s.time),t.push.apply(t,o)),s=r[i++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do o=s[n],o!==void 0&&(e.push(s.time),t.push(o)),s=r[i++];while(s!==void 0)},subclip:function(r,e,t,n,i=30){let s=r.clone();s.name=e;let o=[];for(let l=0;l<s.tracks.length;++l){let c=s.tracks[l],f=c.getValueSize(),p=[],h=[];for(let u=0;u<c.times.length;++u){let d=c.times[u]*i;if(!(d<t||d>=n)){p.push(c.times[u]);for(let m=0;m<f;++m)h.push(c.values[u*f+m])}}p.length!==0&&(c.times=Ve.convertArray(p,c.times.constructor),c.values=Ve.convertArray(h,c.values.constructor),o.push(c))}s.tracks=o;let a=1/0;for(let l=0;l<s.tracks.length;++l)a>s.tracks[l].times[0]&&(a=s.tracks[l].times[0]);for(let l=0;l<s.tracks.length;++l)s.tracks[l].shift(-1*a);return s.resetDuration(),s},makeClipAdditive:function(r,e=0,t=r,n=30){n<=0&&(n=30);let i=t.tracks.length,s=e/n;for(let o=0;o<i;++o){let a=t.tracks[o],l=a.ValueTypeName;if(l==="bool"||l==="string")continue;let c=r.tracks.find(function(g){return g.name===a.name&&g.ValueTypeName===l});if(c===void 0)continue;let f=0,p=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(f=p/3);let h=0,u=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=u/3);let d=a.times.length-1,m;if(s<=a.times[0]){let g=f,x=p-f;m=Ve.arraySlice(a.values,g,x)}else if(s>=a.times[d]){let g=d*p+f,x=g+p-f;m=Ve.arraySlice(a.values,g,x)}else{let g=a.createInterpolant(),x=f,_=p-f;g.evaluate(s),m=Ve.arraySlice(g.resultBuffer,x,_)}l==="quaternion"&&new rt().fromArray(m).normalize().conjugate().toArray(m);let y=c.times.length;for(let g=0;g<y;++g){let x=g*u+h;if(l==="quaternion")rt.multiplyQuaternionsFlat(c.values,x,m,0,c.values,x);else{let _=u-h*2;for(let v=0;v<_;++v)c.values[x+v]-=m[v]}}}return r.blendMode=wc,r}},kt=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let o;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.afterEnd_(n-1,e,s)}if(n===a)break;if(s=i,i=t[++n],e<i)break t}o=t.length;break n}if(!(e>=s)){let a=t[1];e<a&&(n=2,s=a);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.beforeStart_(0,e,i);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break t}o=n,n=0;break n}break e}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.beforeStart_(0,e,i);if(i===void 0)return n=t.length,this._cachedIndex=n,this.afterEnd_(n-1,s,e)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let o=0;o!==i;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}};kt.prototype.beforeStart_=kt.prototype.copySampleValue_;kt.prototype.afterEnd_=kt.prototype.copySampleValue_;var oa=class extends kt{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:jn,endingEnd:jn}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,o=e+1,a=i[s],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Qn:s=e,a=2*t-n;break;case Js:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Qn:o=e,l=2*n-t;break;case Js:o=1,l=n+i[1]-i[0];break;default:o=e-1,l=t}let c=(n-t)*.5,f=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=s*f,this._offsetNext=o*f}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,f=this._offsetPrev,p=this._offsetNext,h=this._weightPrev,u=this._weightNext,d=(n-t)/(i-t),m=d*d,y=m*d,g=-h*y+2*h*m-h*d,x=(1+h)*y+(-1.5-2*h)*m+(-.5+h)*d+1,_=(-1-u)*y+(1.5+u)*m+.5*d,v=u*y-u*m;for(let M=0;M!==a;++M)s[M]=g*o[f+M]+x*o[c+M]+_*o[l+M]+v*o[p+M];return s}},Pr=class extends kt{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,f=(n-t)/(i-t),p=1-f;for(let h=0;h!==a;++h)s[h]=o[c+h]*p+o[l+h]*f;return s}},aa=class extends kt{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},At=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ve.convertArray(t,this.TimeBufferType),this.values=Ve.convertArray(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ve.convertArray(e.times,Array),values:Ve.convertArray(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new aa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Pr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new oa(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case qs:t=this.InterpolantFactoryMethodDiscrete;break;case Ys:t=this.InterpolantFactoryMethodLinear;break;case Oo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return qs;case this.InterpolantFactoryMethodLinear:return Ys;case this.InterpolantFactoryMethodSmooth:return Oo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,s=0,o=i-1;for(;s!==i&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==i){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=Ve.arraySlice(n,s,o),this.values=Ve.arraySlice(this.values,s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(i!==void 0&&Ve.isTypedArray(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=Ve.arraySlice(this.times),t=Ve.arraySlice(this.values),n=this.getValueSize(),i=this.getInterpolation()===Oo,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],f=e[a+1];if(c!==f&&(a!==1||c!==e[0]))if(i)l=!0;else{let p=a*n,h=p-n,u=p+n;for(let d=0;d!==n;++d){let m=t[p+d];if(m!==t[h+d]||m!==t[u+d]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let p=a*n,h=o*n;for(let u=0;u!==n;++u)t[h+u]=t[p+u]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=Ve.arraySlice(e,0,o),this.values=Ve.arraySlice(t,0,o*n)):(this.times=e,this.values=t),this}clone(){let e=Ve.arraySlice(this.times,0),t=Ve.arraySlice(this.values,0),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};At.prototype.TimeBufferType=Float32Array;At.prototype.ValueBufferType=Float32Array;At.prototype.DefaultInterpolation=Ys;var fn=class extends At{};fn.prototype.ValueTypeName="bool";fn.prototype.ValueBufferType=Array;fn.prototype.DefaultInterpolation=qs;fn.prototype.InterpolantFactoryMethodLinear=void 0;fn.prototype.InterpolantFactoryMethodSmooth=void 0;var Ir=class extends At{};Ir.prototype.ValueTypeName="color";var pi=class extends At{};pi.prototype.ValueTypeName="number";var la=class extends kt{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t),c=e*a;for(let f=c+a;c!==f;c+=4)rt.slerpFlat(s,0,o,c-a,o,c,l);return s}},Fn=class extends At{InterpolantFactoryMethodLinear(e){return new la(this.times,this.values,this.getValueSize(),e)}};Fn.prototype.ValueTypeName="quaternion";Fn.prototype.DefaultInterpolation=Ys;Fn.prototype.InterpolantFactoryMethodSmooth=void 0;var pn=class extends At{};pn.prototype.ValueTypeName="string";pn.prototype.ValueBufferType=Array;pn.prototype.DefaultInterpolation=qs;pn.prototype.InterpolantFactoryMethodLinear=void 0;pn.prototype.InterpolantFactoryMethodSmooth=void 0;var mi=class extends At{};mi.prototype.ValueTypeName="vector";var gi=class{constructor(e,t=-1,n,i=Na){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Et(),this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(T0(n[o]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,o=n.length;s!==o;++s)t.push(At.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,o=[];for(let a=0;a<s;a++){let l=[],c=[];l.push((a+s-1)%s,a,(a+1)%s),c.push(0,1,0);let f=Ve.getKeyframeOrder(l);l=Ve.sortedArray(l,1,f),c=Ve.sortedArray(c,1,f),!i&&l[0]===0&&(l.push(s),c.push(c[0])),o.push(new pi(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],f=c.name.match(s);if(f&&f.length>1){let p=f[1],h=i[p];h||(i[p]=h=[]),h.push(c)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(p,h,u,d,m){if(u.length!==0){let y=[],g=[];Ve.flattenJSON(u,y,g,d),y.length!==0&&m.push(new p(h,y,g))}},i=[],s=e.name||"default",o=e.fps||30,a=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let p=0;p<c.length;p++){let h=c[p].keys;if(!(!h||h.length===0))if(h[0].morphTargets){let u={},d;for(d=0;d<h.length;d++)if(h[d].morphTargets)for(let m=0;m<h[d].morphTargets.length;m++)u[h[d].morphTargets[m]]=-1;for(let m in u){let y=[],g=[];for(let x=0;x!==h[d].morphTargets.length;++x){let _=h[d];y.push(_.time),g.push(_.morphTarget===m?1:0)}i.push(new pi(".morphTargetInfluence["+m+"]",y,g))}l=u.length*(o||1)}else{let u=".bones["+t[p].name+"]";n(mi,u+".position",h,"pos",i),n(Fn,u+".quaternion",h,"rot",i),n(mi,u+".scale",h,"scl",i)}}return i.length===0?null:new this(s,l,i,a)}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function E0(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return pi;case"vector":case"vector2":case"vector3":case"vector4":return mi;case"color":return Ir;case"quaternion":return Fn;case"bool":case"boolean":return fn;case"string":return pn}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function T0(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=E0(r.type);if(r.times===void 0){let t=[],n=[];Ve.flattenJSON(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}var xi={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}},Dr=class{constructor(e,t,n){let i=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(f){a++,s===!1&&i.onStart!==void 0&&i.onStart(f,o,a),s=!0},this.itemEnd=function(f){o++,i.onProgress!==void 0&&i.onProgress(f,o,a),o===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(f){i.onError!==void 0&&i.onError(f)},this.resolveURL=function(f){return l?l(f):f},this.setURLModifier=function(f){return l=f,this},this.addHandler=function(f,p){return c.push(f,p),this},this.removeHandler=function(f){let p=c.indexOf(f);return p!==-1&&c.splice(p,2),this},this.getHandler=function(f){for(let p=0,h=c.length;p<h;p+=2){let u=c[p],d=c[p+1];if(u.global&&(u.lastIndex=0),u.test(f))return d}return null}}},cf=new Dr,pt=class{constructor(e){this.manager=e!==void 0?e:cf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}},tn={},It=class extends pt{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=xi.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(tn[e]!==void 0){tn[e].push({onLoad:t,onProgress:n,onError:i});return}tn[e]=[],tn[e].push({onLoad:t,onProgress:n,onError:i});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"});fetch(o).then(a=>{if(a.status===200||a.status===0){a.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received.");let l=tn[e],c=a.body.getReader(),f=a.headers.get("Content-Length"),p=f?parseInt(f):0,h=p!==0,u=0;return new ReadableStream({start(d){m();function m(){c.read().then(({done:y,value:g})=>{if(y)d.close();else{u+=g.byteLength;let x=new ProgressEvent("progress",{lengthComputable:h,loaded:u,total:p});for(let _=0,v=l.length;_<v;_++){let M=l[_];M.onProgress&&M.onProgress(x)}d.enqueue(g),m()}})}}})}else throw Error(`fetch for "${a.url}" responded with ${a.status}: ${a.statusText}`)}).then(a=>{let l=new Response(a);switch(this.responseType){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(c=>new DOMParser().parseFromString(c,this.mimeType));case"json":return l.json();default:return l.text()}}).then(a=>{xi.add(e,a);let l=tn[e];delete tn[e];for(let c=0,f=l.length;c<f;c++){let p=l[c];p.onLoad&&p.onLoad(a)}this.manager.itemEnd(e)}).catch(a=>{let l=tn[e];delete tn[e];for(let c=0,f=l.length;c<f;c++){let p=l[c];p.onError&&p.onError(a)}this.manager.itemError(e),this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}},Yl=class extends pt{constructor(e){super(e)}load(e,t,n,i){let s=this,o=new It(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(a){try{t(s.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),s.manager.itemError(e)}},n,i)}parse(e){let t=[];for(let n=0;n<e.length;n++){let i=gi.parse(e[n]);t.push(i)}return t}},Jl=class extends pt{constructor(e){super(e)}load(e,t,n,i){let s=this,o=[],a=new sr,l=new It(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(s.withCredentials);let c=0;function f(p){l.load(e[p],function(h){let u=s.parse(h,!0);o[p]={width:u.width,height:u.height,format:u.format,mipmaps:u.mipmaps},c+=1,c===6&&(u.mipmapCount===1&&(a.minFilter=st),a.image=o,a.format=u.format,a.needsUpdate=!0,t&&t(a))},n,i)}if(Array.isArray(e))for(let p=0,h=e.length;p<h;++p)f(p);else l.load(e,function(p){let h=s.parse(p,!0);if(h.isCubemap){let u=h.mipmaps.length/h.mipmapCount;for(let d=0;d<u;d++){o[d]={mipmaps:[]};for(let m=0;m<h.mipmapCount;m++)o[d].mipmaps.push(h.mipmaps[d*h.mipmapCount+m]),o[d].format=h.format,o[d].width=h.width,o[d].height=h.height}a.image=o}else a.image.width=h.width,a.image.height=h.height,a.mipmaps=h.mipmaps;h.mipmapCount===1&&(a.minFilter=st),a.format=h.format,a.needsUpdate=!0,t&&t(a)},n,i);return a}},yi=class extends pt{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=xi.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o;let a=Oa("img");function l(){f(),xi.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(p){f(),i&&i(p),s.manager.itemError(e),s.manager.itemEnd(e)}function f(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.substr(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}},ca=class extends pt{constructor(e){super(e)}load(e,t,n,i){let s=new Rn,o=new yi(this.manager);o.setCrossOrigin(this.crossOrigin),o.setPath(this.path);let a=0;function l(c){o.load(e[c],function(f){s.images[c]=f,a++,a===6&&(s.needsUpdate=!0,t&&t(s))},void 0,i)}for(let c=0;c<e.length;++c)l(c);return s}},ha=class extends pt{constructor(e){super(e)}load(e,t,n,i){let s=this,o=new rn,a=new It(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(s.withCredentials),a.load(e,function(l){let c=s.parse(l);c&&(c.image!==void 0?o.image=c.image:c.data!==void 0&&(o.image.width=c.width,o.image.height=c.height,o.image.data=c.data),o.wrapS=c.wrapS!==void 0?c.wrapS:ht,o.wrapT=c.wrapT!==void 0?c.wrapT:ht,o.magFilter=c.magFilter!==void 0?c.magFilter:st,o.minFilter=c.minFilter!==void 0?c.minFilter:st,o.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.encoding!==void 0&&(o.encoding=c.encoding),c.flipY!==void 0&&(o.flipY=c.flipY),c.format!==void 0&&(o.format=c.format),c.type!==void 0&&(o.type=c.type),c.mipmaps!==void 0&&(o.mipmaps=c.mipmaps,o.minFilter=Mi),c.mipmapCount===1&&(o.minFilter=st),c.generateMipmaps!==void 0&&(o.generateMipmaps=c.generateMipmaps),o.needsUpdate=!0,t&&t(o,c))},n,i),o}},ua=class extends pt{constructor(e){super(e)}load(e,t,n,i){let s=new at,o=new yi(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}},Ct=class extends Ie{constructor(e,t=1){super(),this.type="Light",this.color=new ne(e),this.intensity=t}dispose(){}copy(e){return super.copy(e),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}};Ct.prototype.isLight=!0;var Fr=class extends Ct{constructor(e,t,n){super(e,n),this.type="HemisphereLight",this.position.copy(Ie.DefaultUp),this.updateMatrix(),this.groundColor=new ne(t)}copy(e){return Ct.prototype.copy.call(this,e),this.groundColor.copy(e.groundColor),this}};Fr.prototype.isHemisphereLight=!0;var Xh=new he,qh=new b,Yh=new b,Nr=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new X(512,512),this.map=null,this.mapPass=null,this.matrix=new he,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ai,this._frameExtents=new X(1,1),this._viewportCount=1,this._viewports=[new Be(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;qh.setFromMatrixPosition(e.matrixWorld),t.position.copy(qh),Yh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Yh),t.updateMatrixWorld(),Xh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xh),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(t.projectionMatrix),n.multiply(t.matrixWorldInverse)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},da=class extends Nr{constructor(){super(new et(50,1,.5,500)),this.focus=1}updateMatrices(e){let t=this.camera,n=Zs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}};da.prototype.isSpotLightShadow=!0;var zr=class extends Ct{constructor(e,t,n=0,i=Math.PI/3,s=0,o=1){super(e,t),this.type="SpotLight",this.position.copy(Ie.DefaultUp),this.updateMatrix(),this.target=new Ie,this.distance=n,this.angle=i,this.penumbra=s,this.decay=o,this.shadow=new da}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};zr.prototype.isSpotLight=!0;var Jh=new he,Fs=new b,wl=new b,fa=class extends Nr{constructor(){super(new et(90,1,.5,500)),this._frameExtents=new X(4,2),this._viewportCount=6,this._viewports=[new Be(2,1,1,1),new Be(0,1,1,1),new Be(3,1,1,1),new Be(1,1,1,1),new Be(3,0,1,1),new Be(1,0,1,1)],this._cubeDirections=[new b(1,0,0),new b(-1,0,0),new b(0,0,1),new b(0,0,-1),new b(0,1,0),new b(0,-1,0)],this._cubeUps=[new b(0,1,0),new b(0,1,0),new b(0,1,0),new b(0,1,0),new b(0,0,1),new b(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Fs.setFromMatrixPosition(e.matrixWorld),n.position.copy(Fs),wl.copy(n.position),wl.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(wl),n.updateMatrixWorld(),i.makeTranslation(-Fs.x,-Fs.y,-Fs.z),Jh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jh)}};fa.prototype.isPointLightShadow=!0;var Br=class extends Ct{constructor(e,t,n=0,i=1){super(e,t),this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new fa}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}};Br.prototype.isPointLight=!0;var pa=class extends Nr{constructor(){super(new li(-5,5,5,-5,.5,500))}};pa.prototype.isDirectionalLightShadow=!0;var Or=class extends Ct{constructor(e,t){super(e,t),this.type="DirectionalLight",this.position.copy(Ie.DefaultUp),this.updateMatrix(),this.target=new Ie,this.shadow=new pa}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};Or.prototype.isDirectionalLight=!0;var Ur=class extends Ct{constructor(e,t){super(e,t),this.type="AmbientLight"}};Ur.prototype.isAmbientLight=!0;var Hr=class extends Ct{constructor(e,t,n=10,i=10){super(e,t),this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){let t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}};Hr.prototype.isRectAreaLight=!0;var Gr=class{constructor(){this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new b)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){let n=e.x,i=e.y,s=e.z,o=this.coefficients;return t.copy(o[0]).multiplyScalar(.282095),t.addScaledVector(o[1],.488603*i),t.addScaledVector(o[2],.488603*s),t.addScaledVector(o[3],.488603*n),t.addScaledVector(o[4],1.092548*(n*i)),t.addScaledVector(o[5],1.092548*(i*s)),t.addScaledVector(o[6],.315392*(3*s*s-1)),t.addScaledVector(o[7],1.092548*(n*s)),t.addScaledVector(o[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){let n=e.x,i=e.y,s=e.z,o=this.coefficients;return t.copy(o[0]).multiplyScalar(.886227),t.addScaledVector(o[1],2*.511664*i),t.addScaledVector(o[2],2*.511664*s),t.addScaledVector(o[3],2*.511664*n),t.addScaledVector(o[4],2*.429043*n*i),t.addScaledVector(o[5],2*.429043*i*s),t.addScaledVector(o[6],.743125*s*s-.247708),t.addScaledVector(o[7],2*.429043*n*s),t.addScaledVector(o[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){let n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){let n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){let n=e.x,i=e.y,s=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*s,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*s,t[6]=.315392*(3*s*s-1),t[7]=1.092548*n*s,t[8]=.546274*(n*n-i*i)}};Gr.prototype.isSphericalHarmonics3=!0;var vi=class extends Ct{constructor(e=new Gr,t=1){super(void 0,t),this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){let t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}};vi.prototype.isLightProbe=!0;var ma=class extends pt{constructor(e){super(e),this.textures={}}load(e,t,n,i){let s=this,o=new It(s.manager);o.setPath(s.path),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(e,function(a){try{t(s.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),s.manager.itemError(e)}},n,i)}parse(e){let t=this.textures;function n(s){return t[s]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",s),t[s]}let i=new S0[e.type];if(e.uuid!==void 0&&(i.uuid=e.uuid),e.name!==void 0&&(i.name=e.name),e.color!==void 0&&i.color!==void 0&&i.color.setHex(e.color),e.roughness!==void 0&&(i.roughness=e.roughness),e.metalness!==void 0&&(i.metalness=e.metalness),e.sheen!==void 0&&(i.sheen=e.sheen),e.sheenColor!==void 0&&(i.sheenColor=new ne().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(i.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&i.emissive!==void 0&&i.emissive.setHex(e.emissive),e.specular!==void 0&&i.specular!==void 0&&i.specular.setHex(e.specular),e.specularIntensity!==void 0&&(i.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&i.specularColor!==void 0&&i.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(i.shininess=e.shininess),e.clearcoat!==void 0&&(i.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=e.clearcoatRoughness),e.transmission!==void 0&&(i.transmission=e.transmission),e.thickness!==void 0&&(i.thickness=e.thickness),e.attenuationDistance!==void 0&&(i.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&i.attenuationColor!==void 0&&i.attenuationColor.setHex(e.attenuationColor),e.fog!==void 0&&(i.fog=e.fog),e.flatShading!==void 0&&(i.flatShading=e.flatShading),e.blending!==void 0&&(i.blending=e.blending),e.combine!==void 0&&(i.combine=e.combine),e.side!==void 0&&(i.side=e.side),e.shadowSide!==void 0&&(i.shadowSide=e.shadowSide),e.opacity!==void 0&&(i.opacity=e.opacity),e.format!==void 0&&(i.format=e.format),e.transparent!==void 0&&(i.transparent=e.transparent),e.alphaTest!==void 0&&(i.alphaTest=e.alphaTest),e.depthTest!==void 0&&(i.depthTest=e.depthTest),e.depthWrite!==void 0&&(i.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(i.colorWrite=e.colorWrite),e.stencilWrite!==void 0&&(i.stencilWrite=e.stencilWrite),e.stencilWriteMask!==void 0&&(i.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(i.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(i.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(i.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(i.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(i.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(i.stencilZPass=e.stencilZPass),e.wireframe!==void 0&&(i.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(i.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(i.rotation=e.rotation),e.linewidth!==1&&(i.linewidth=e.linewidth),e.dashSize!==void 0&&(i.dashSize=e.dashSize),e.gapSize!==void 0&&(i.gapSize=e.gapSize),e.scale!==void 0&&(i.scale=e.scale),e.polygonOffset!==void 0&&(i.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(i.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(i.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(i.dithering=e.dithering),e.alphaToCoverage!==void 0&&(i.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(i.premultipliedAlpha=e.premultipliedAlpha),e.visible!==void 0&&(i.visible=e.visible),e.toneMapped!==void 0&&(i.toneMapped=e.toneMapped),e.userData!==void 0&&(i.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?i.vertexColors=e.vertexColors>0:i.vertexColors=e.vertexColors),e.uniforms!==void 0)for(let s in e.uniforms){let o=e.uniforms[s];switch(i.uniforms[s]={},o.type){case"t":i.uniforms[s].value=n(o.value);break;case"c":i.uniforms[s].value=new ne().setHex(o.value);break;case"v2":i.uniforms[s].value=new X().fromArray(o.value);break;case"v3":i.uniforms[s].value=new b().fromArray(o.value);break;case"v4":i.uniforms[s].value=new Be().fromArray(o.value);break;case"m3":i.uniforms[s].value=new Ke().fromArray(o.value);break;case"m4":i.uniforms[s].value=new he().fromArray(o.value);break;default:i.uniforms[s].value=o.value}}if(e.defines!==void 0&&(i.defines=e.defines),e.vertexShader!==void 0&&(i.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(i.fragmentShader=e.fragmentShader),e.extensions!==void 0)for(let s in e.extensions)i.extensions[s]=e.extensions[s];if(e.shading!==void 0&&(i.flatShading=e.shading===1),e.size!==void 0&&(i.size=e.size),e.sizeAttenuation!==void 0&&(i.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(i.map=n(e.map)),e.matcap!==void 0&&(i.matcap=n(e.matcap)),e.alphaMap!==void 0&&(i.alphaMap=n(e.alphaMap)),e.bumpMap!==void 0&&(i.bumpMap=n(e.bumpMap)),e.bumpScale!==void 0&&(i.bumpScale=e.bumpScale),e.normalMap!==void 0&&(i.normalMap=n(e.normalMap)),e.normalMapType!==void 0&&(i.normalMapType=e.normalMapType),e.normalScale!==void 0){let s=e.normalScale;Array.isArray(s)===!1&&(s=[s,s]),i.normalScale=new X().fromArray(s)}return e.displacementMap!==void 0&&(i.displacementMap=n(e.displacementMap)),e.displacementScale!==void 0&&(i.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(i.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(i.roughnessMap=n(e.roughnessMap)),e.metalnessMap!==void 0&&(i.metalnessMap=n(e.metalnessMap)),e.emissiveMap!==void 0&&(i.emissiveMap=n(e.emissiveMap)),e.emissiveIntensity!==void 0&&(i.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(i.specularMap=n(e.specularMap)),e.specularIntensityMap!==void 0&&(i.specularIntensityMap=n(e.specularIntensityMap)),e.specularColorMap!==void 0&&(i.specularColorMap=n(e.specularColorMap)),e.envMap!==void 0&&(i.envMap=n(e.envMap)),e.envMapIntensity!==void 0&&(i.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(i.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(i.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(i.lightMap=n(e.lightMap)),e.lightMapIntensity!==void 0&&(i.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(i.aoMap=n(e.aoMap)),e.aoMapIntensity!==void 0&&(i.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(i.gradientMap=n(e.gradientMap)),e.clearcoatMap!==void 0&&(i.clearcoatMap=n(e.clearcoatMap)),e.clearcoatRoughnessMap!==void 0&&(i.clearcoatRoughnessMap=n(e.clearcoatRoughnessMap)),e.clearcoatNormalMap!==void 0&&(i.clearcoatNormalMap=n(e.clearcoatNormalMap)),e.clearcoatNormalScale!==void 0&&(i.clearcoatNormalScale=new X().fromArray(e.clearcoatNormalScale)),e.transmissionMap!==void 0&&(i.transmissionMap=n(e.transmissionMap)),e.thicknessMap!==void 0&&(i.thicknessMap=n(e.thicknessMap)),e.sheenColorMap!==void 0&&(i.sheenColorMap=n(e.sheenColorMap)),e.sheenRoughnessMap!==void 0&&(i.sheenRoughnessMap=n(e.sheenRoughnessMap)),i}setTextures(e){return this.textures=e,this}},_s=class{static decodeText(e){if(typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.substr(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},kr=class extends _e{constructor(){super(),this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}clone(){return new this.constructor().copy(this)}toJSON(){let e=super.toJSON(this);return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};kr.prototype.isInstancedBufferGeometry=!0;var ga=class extends pt{constructor(e){super(e)}load(e,t,n,i){let s=this,o=new It(s.manager);o.setPath(s.path),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(e,function(a){try{t(s.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),s.manager.itemError(e)}},n,i)}parse(e){let t={},n={};function i(u,d){if(t[d]!==void 0)return t[d];let y=u.interleavedBuffers[d],g=s(u,y.buffer),x=Wi(y.type,g),_=new ln(x,y.stride);return _.uuid=y.uuid,t[d]=_,_}function s(u,d){if(n[d]!==void 0)return n[d];let y=u.arrayBuffers[d],g=new Uint32Array(y).buffer;return n[d]=g,g}let o=e.isInstancedBufferGeometry?new kr:new _e,a=e.data.index;if(a!==void 0){let u=Wi(a.type,a.array);o.setIndex(new Pe(u,1))}let l=e.data.attributes;for(let u in l){let d=l[u],m;if(d.isInterleavedBufferAttribute){let y=i(e.data,d.data);m=new In(y,d.itemSize,d.offset,d.normalized)}else{let y=Wi(d.type,d.array),g=d.isInstancedBufferAttribute?cn:Pe;m=new g(y,d.itemSize,d.normalized)}d.name!==void 0&&(m.name=d.name),d.usage!==void 0&&m.setUsage(d.usage),d.updateRange!==void 0&&(m.updateRange.offset=d.updateRange.offset,m.updateRange.count=d.updateRange.count),o.setAttribute(u,m)}let c=e.data.morphAttributes;if(c)for(let u in c){let d=c[u],m=[];for(let y=0,g=d.length;y<g;y++){let x=d[y],_;if(x.isInterleavedBufferAttribute){let v=i(e.data,x.data);_=new In(v,x.itemSize,x.offset,x.normalized)}else{let v=Wi(x.type,x.array);_=new Pe(v,x.itemSize,x.normalized)}x.name!==void 0&&(_.name=x.name),m.push(_)}o.morphAttributes[u]=m}e.data.morphTargetsRelative&&(o.morphTargetsRelative=!0);let p=e.data.groups||e.data.drawcalls||e.data.offsets;if(p!==void 0)for(let u=0,d=p.length;u!==d;++u){let m=p[u];o.addGroup(m.start,m.count,m.materialIndex)}let h=e.data.boundingSphere;if(h!==void 0){let u=new b;h.center!==void 0&&u.fromArray(h.center),o.boundingSphere=new Yt(u,h.radius)}return e.name&&(o.name=e.name),e.userData&&(o.userData=e.userData),o}},Zl=class extends pt{constructor(e){super(e)}load(e,t,n,i){let s=this,o=this.path===""?_s.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||o;let a=new It(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(l){let c=null;try{c=JSON.parse(l)}catch(p){i!==void 0&&i(p),console.error("THREE:ObjectLoader: Can't parse "+e+".",p.message);return}let f=c.metadata;if(f===void 0||f.type===void 0||f.type.toLowerCase()==="geometry"){console.error("THREE.ObjectLoader: Can't load "+e);return}s.parse(c,t)},n,i)}async loadAsync(e,t){let n=this,i=this.path===""?_s.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||i;let s=new It(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials);let o=await s.loadAsync(e,t),a=JSON.parse(o),l=a.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await n.parseAsync(a)}parse(e,t){let n=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),s=this.parseGeometries(e.geometries,i),o=this.parseImages(e.images,function(){t!==void 0&&t(c)}),a=this.parseTextures(e.textures,o),l=this.parseMaterials(e.materials,a),c=this.parseObject(e.object,s,l,a,n),f=this.parseSkeletons(e.skeletons,c);if(this.bindSkeletons(c,f),t!==void 0){let p=!1;for(let h in o)if(o[h]instanceof HTMLImageElement){p=!0;break}p===!1&&t(c)}return c}async parseAsync(e){let t=this.parseAnimations(e.animations),n=this.parseShapes(e.shapes),i=this.parseGeometries(e.geometries,n),s=await this.parseImagesAsync(e.images),o=this.parseTextures(e.textures,s),a=this.parseMaterials(e.materials,o),l=this.parseObject(e.object,i,a,o,t),c=this.parseSkeletons(e.skeletons,l);return this.bindSkeletons(l,c),l}parseShapes(e){let t={};if(e!==void 0)for(let n=0,i=e.length;n<i;n++){let s=new Pt().fromJSON(e[n]);t[s.uuid]=s}return t}parseSkeletons(e,t){let n={},i={};if(t.traverse(function(s){s.isBone&&(i[s.uuid]=s)}),e!==void 0)for(let s=0,o=e.length;s<o;s++){let a=new ea().fromJSON(e[s],i);n[a.uuid]=a}return n}parseGeometries(e,t){let n={};if(e!==void 0){let i=new ga;for(let s=0,o=e.length;s<o;s++){let a,l=e[s];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":a=i.parse(l);break;case"Geometry":console.error("THREE.ObjectLoader: The legacy Geometry type is no longer supported.");break;default:l.type in Wh?a=Wh[l.type].fromJSON(l,t):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${l.type}"`)}a.uuid=l.uuid,l.name!==void 0&&(a.name=l.name),a.isBufferGeometry===!0&&l.userData!==void 0&&(a.userData=l.userData),n[l.uuid]=a}}return n}parseMaterials(e,t){let n={},i={};if(e!==void 0){let s=new ma;s.setTextures(t);for(let o=0,a=e.length;o<a;o++){let l=e[o];if(l.type==="MultiMaterial"){let c=[];for(let f=0;f<l.materials.length;f++){let p=l.materials[f];n[p.uuid]===void 0&&(n[p.uuid]=s.parse(p)),c.push(n[p.uuid])}i[l.uuid]=c}else n[l.uuid]===void 0&&(n[l.uuid]=s.parse(l)),i[l.uuid]=n[l.uuid]}}return i}parseAnimations(e){let t={};if(e!==void 0)for(let n=0;n<e.length;n++){let i=e[n],s=gi.parse(i);t[s.uuid]=s}return t}parseImages(e,t){let n=this,i={},s;function o(l){return n.manager.itemStart(l),s.load(l,function(){n.manager.itemEnd(l)},void 0,function(){n.manager.itemError(l),n.manager.itemEnd(l)})}function a(l){if(typeof l=="string"){let c=l,f=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:n.resourcePath+c;return o(f)}else return l.data?{data:Wi(l.type,l.data),width:l.width,height:l.height}:null}if(e!==void 0&&e.length>0){let l=new Dr(t);s=new yi(l),s.setCrossOrigin(this.crossOrigin);for(let c=0,f=e.length;c<f;c++){let p=e[c],h=p.url;if(Array.isArray(h)){i[p.uuid]=[];for(let u=0,d=h.length;u<d;u++){let m=h[u],y=a(m);y!==null&&(y instanceof HTMLImageElement?i[p.uuid].push(y):i[p.uuid].push(new rn(y.data,y.width,y.height)))}}else{let u=a(p.url);u!==null&&(i[p.uuid]=u)}}}return i}async parseImagesAsync(e){let t=this,n={},i;async function s(o){if(typeof o=="string"){let a=o,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(a)?a:t.resourcePath+a;return await i.loadAsync(l)}else return o.data?{data:Wi(o.type,o.data),width:o.width,height:o.height}:null}if(e!==void 0&&e.length>0){i=new yi(this.manager),i.setCrossOrigin(this.crossOrigin);for(let o=0,a=e.length;o<a;o++){let l=e[o],c=l.url;if(Array.isArray(c)){n[l.uuid]=[];for(let f=0,p=c.length;f<p;f++){let h=c[f],u=await s(h);u!==null&&(u instanceof HTMLImageElement?n[l.uuid].push(u):n[l.uuid].push(new rn(u.data,u.width,u.height)))}}else{let f=await s(l.url);f!==null&&(n[l.uuid]=f)}}}return n}parseTextures(e,t){function n(s,o){return typeof s=="number"?s:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",s),o[s])}let i={};if(e!==void 0)for(let s=0,o=e.length;s<o;s++){let a=e[s];a.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',a.uuid),t[a.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",a.image);let l,c=t[a.image];Array.isArray(c)?(l=new Rn(c),c.length===6&&(l.needsUpdate=!0)):(c&&c.data?l=new rn(c.data,c.width,c.height):l=new at(c),c&&(l.needsUpdate=!0)),l.uuid=a.uuid,a.name!==void 0&&(l.name=a.name),a.mapping!==void 0&&(l.mapping=n(a.mapping,A0)),a.offset!==void 0&&l.offset.fromArray(a.offset),a.repeat!==void 0&&l.repeat.fromArray(a.repeat),a.center!==void 0&&l.center.fromArray(a.center),a.rotation!==void 0&&(l.rotation=a.rotation),a.wrap!==void 0&&(l.wrapS=n(a.wrap[0],Zh),l.wrapT=n(a.wrap[1],Zh)),a.format!==void 0&&(l.format=a.format),a.type!==void 0&&(l.type=a.type),a.encoding!==void 0&&(l.encoding=a.encoding),a.minFilter!==void 0&&(l.minFilter=n(a.minFilter,$h)),a.magFilter!==void 0&&(l.magFilter=n(a.magFilter,$h)),a.anisotropy!==void 0&&(l.anisotropy=a.anisotropy),a.flipY!==void 0&&(l.flipY=a.flipY),a.premultiplyAlpha!==void 0&&(l.premultiplyAlpha=a.premultiplyAlpha),a.unpackAlignment!==void 0&&(l.unpackAlignment=a.unpackAlignment),a.userData!==void 0&&(l.userData=a.userData),i[a.uuid]=l}return i}parseObject(e,t,n,i,s){let o;function a(h){return t[h]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",h),t[h]}function l(h){if(h!==void 0){if(Array.isArray(h)){let u=[];for(let d=0,m=h.length;d<m;d++){let y=h[d];n[y]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",y),u.push(n[y])}return u}return n[h]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",h),n[h]}}function c(h){return i[h]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",h),i[h]}let f,p;switch(e.type){case"Scene":o=new as,e.background!==void 0&&(Number.isInteger(e.background)?o.background=new ne(e.background):o.background=c(e.background)),e.environment!==void 0&&(o.environment=c(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?o.fog=new tr(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(o.fog=new er(e.fog.color,e.fog.density)));break;case"PerspectiveCamera":o=new et(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(o.focus=e.focus),e.zoom!==void 0&&(o.zoom=e.zoom),e.filmGauge!==void 0&&(o.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(o.filmOffset=e.filmOffset),e.view!==void 0&&(o.view=Object.assign({},e.view));break;case"OrthographicCamera":o=new li(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(o.zoom=e.zoom),e.view!==void 0&&(o.view=Object.assign({},e.view));break;case"AmbientLight":o=new Ur(e.color,e.intensity);break;case"DirectionalLight":o=new Or(e.color,e.intensity);break;case"PointLight":o=new Br(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":o=new Hr(e.color,e.intensity,e.width,e.height);break;case"SpotLight":o=new zr(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay);break;case"HemisphereLight":o=new Fr(e.color,e.groundColor,e.intensity);break;case"LightProbe":o=new vi().fromJSON(e);break;case"SkinnedMesh":f=a(e.geometry),p=l(e.material),o=new hs(f,p),e.bindMode!==void 0&&(o.bindMode=e.bindMode),e.bindMatrix!==void 0&&o.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(o.skeleton=e.skeleton);break;case"Mesh":f=a(e.geometry),p=l(e.material),o=new Je(f,p);break;case"InstancedMesh":f=a(e.geometry),p=l(e.material);let h=e.count,u=e.instanceMatrix,d=e.instanceColor;o=new nr(f,p,h),o.instanceMatrix=new cn(new Float32Array(u.array),16),d!==void 0&&(o.instanceColor=new cn(new Float32Array(d.array),d.itemSize));break;case"LOD":o=new Ko;break;case"Line":o=new Gt(a(e.geometry),l(e.material));break;case"LineLoop":o=new ir(a(e.geometry),l(e.material));break;case"LineSegments":o=new vt(a(e.geometry),l(e.material));break;case"PointCloud":case"Points":o=new ci(a(e.geometry),l(e.material));break;case"Sprite":o=new cs(l(e.material));break;case"Group":o=new nn;break;case"Bone":o=new us;break;default:o=new Ie}if(o.uuid=e.uuid,e.name!==void 0&&(o.name=e.name),e.matrix!==void 0?(o.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(o.matrixAutoUpdate=e.matrixAutoUpdate),o.matrixAutoUpdate&&o.matrix.decompose(o.position,o.quaternion,o.scale)):(e.position!==void 0&&o.position.fromArray(e.position),e.rotation!==void 0&&o.rotation.fromArray(e.rotation),e.quaternion!==void 0&&o.quaternion.fromArray(e.quaternion),e.scale!==void 0&&o.scale.fromArray(e.scale)),e.castShadow!==void 0&&(o.castShadow=e.castShadow),e.receiveShadow!==void 0&&(o.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.bias!==void 0&&(o.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(o.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(o.shadow.radius=e.shadow.radius),e.shadow.mapSize!==void 0&&o.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.camera!==void 0&&(o.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(o.visible=e.visible),e.frustumCulled!==void 0&&(o.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(o.renderOrder=e.renderOrder),e.userData!==void 0&&(o.userData=e.userData),e.layers!==void 0&&(o.layers.mask=e.layers),e.children!==void 0){let h=e.children;for(let u=0;u<h.length;u++)o.add(this.parseObject(h[u],t,n,i,s))}if(e.animations!==void 0){let h=e.animations;for(let u=0;u<h.length;u++){let d=h[u];o.animations.push(s[d])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(o.autoUpdate=e.autoUpdate);let h=e.levels;for(let u=0;u<h.length;u++){let d=h[u],m=o.getObjectByProperty("uuid",d.object);m!==void 0&&o.addLevel(m,d.distance)}}return o}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){let i=t[n.skeleton];i===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}setTexturePath(e){return console.warn("THREE.ObjectLoader: .setTexturePath() has been renamed to .setResourcePath()."),this.setResourcePath(e)}},A0={UVMapping:Fa,CubeReflectionMapping:_i,CubeRefractionMapping:wi,EquirectangularReflectionMapping:Gs,EquirectangularRefractionMapping:ks,CubeUVReflectionMapping:ws,CubeUVRefractionMapping:Xr},Zh={RepeatWrapping:Vs,ClampToEdgeWrapping:ht,MirroredRepeatWrapping:Ws},$h={NearestFilter:tt,NearestMipmapNearestFilter:Go,NearestMipmapLinearFilter:ko,LinearFilter:st,LinearMipmapNearestFilter:_c,LinearMipmapLinearFilter:Mi},xa=class extends pt{constructor(e){super(e),typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=xi.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o;let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){xi.add(e,l),t&&t(l),s.manager.itemEnd(e)}).catch(function(l){i&&i(l),s.manager.itemError(e),s.manager.itemEnd(e)}),s.manager.itemStart(e)}};xa.prototype.isImageBitmapLoader=!0;var Po,Lc={getContext:function(){return Po===void 0&&(Po=new(window.AudioContext||window.webkitAudioContext)),Po},setContext:function(r){Po=r}},ya=class extends pt{constructor(e){super(e)}load(e,t,n,i){let s=this,o=new It(this.manager);o.setResponseType("arraybuffer"),o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(a){try{let l=a.slice(0);Lc.getContext().decodeAudioData(l,function(f){t(f)})}catch(l){i?i(l):console.error(l),s.manager.itemError(e)}},n,i)}},va=class extends vi{constructor(e,t,n=1){super(void 0,n);let i=new ne().set(e),s=new ne().set(t),o=new b(i.r,i.g,i.b),a=new b(s.r,s.g,s.b),l=Math.sqrt(Math.PI),c=l*Math.sqrt(.75);this.sh.coefficients[0].copy(o).add(a).multiplyScalar(l),this.sh.coefficients[1].copy(o).sub(a).multiplyScalar(c)}};va.prototype.isHemisphereLightProbe=!0;var _a=class extends vi{constructor(e,t=1){super(void 0,t);let n=new ne().set(e);this.sh.coefficients[0].set(n.r,n.g,n.b).multiplyScalar(2*Math.sqrt(Math.PI))}};_a.prototype.isAmbientLightProbe=!0;var jh=new he,Qh=new he,$l=class{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new et,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new et,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){let t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep;let i=e.projectionMatrix.clone(),s=t.eyeSep/2,o=s*t.near/t.focus,a=t.near*Math.tan(ni*t.fov*.5)/t.zoom,l,c;Qh.elements[12]=-s,jh.elements[12]=s,l=-a*t.aspect+o,c=a*t.aspect+o,i.elements[0]=2*t.near/(c-l),i.elements[8]=(c+l)/(c-l),this.cameraL.projectionMatrix.copy(i),l=-a*t.aspect-o,c=a*t.aspect-o,i.elements[0]=2*t.near/(c-l),i.elements[8]=(c+l)/(c-l),this.cameraR.projectionMatrix.copy(i)}this.cameraL.matrixWorld.copy(e.matrixWorld).multiply(Qh),this.cameraR.matrixWorld.copy(e.matrixWorld).multiply(jh)}},wa=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Kh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=Kh();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function Kh(){return(typeof performance>"u"?Date:performance).now()}var Xn=new b,eu=new rt,C0=new b,qn=new b,jl=class extends Ie{constructor(){super(),this.type="AudioListener",this.context=Lc.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new wa}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e);let t=this.context.listener,n=this.up;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(Xn,eu,C0),qn.set(0,0,-1).applyQuaternion(eu),t.positionX){let i=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(Xn.x,i),t.positionY.linearRampToValueAtTime(Xn.y,i),t.positionZ.linearRampToValueAtTime(Xn.z,i),t.forwardX.linearRampToValueAtTime(qn.x,i),t.forwardY.linearRampToValueAtTime(qn.y,i),t.forwardZ.linearRampToValueAtTime(qn.z,i),t.upX.linearRampToValueAtTime(n.x,i),t.upY.linearRampToValueAtTime(n.y,i),t.upZ.linearRampToValueAtTime(n.z,i)}else t.setPosition(Xn.x,Xn.y,Xn.z),t.setOrientation(qn.x,qn.y,qn.z,n.x,n.y,n.z)}},Vr=class extends Ie{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;let t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source.stop(),this.source.onended=null,this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){if(this.detune=e,this.source.detune!==void 0)return this.isPlaying===!0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}},Yn=new b,tu=new rt,R0=new b,Jn=new b,Ql=class extends Vr{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,n){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=n,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(Yn,tu,R0),Jn.set(0,0,1).applyQuaternion(tu);let t=this.panner;if(t.positionX){let n=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(Yn.x,n),t.positionY.linearRampToValueAtTime(Yn.y,n),t.positionZ.linearRampToValueAtTime(Yn.z,n),t.orientationX.linearRampToValueAtTime(Jn.x,n),t.orientationY.linearRampToValueAtTime(Jn.y,n),t.orientationZ.linearRampToValueAtTime(Jn.z,n)}else t.setPosition(Yn.x,Yn.y,Yn.z),t.setOrientation(Jn.x,Jn.y,Jn.z)}},Ma=class{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0,t=this.getFrequencyData();for(let n=0;n<t.length;n++)e+=t[n];return e/t.length}},ba=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,o;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,s=e*i+i,o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[s+a]=n[a];o=t}else{o+=t;let a=t/o;this._mixBufferRegion(n,s,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-s,t)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){a.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,o=i;s!==o;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let o=0;o!==s;++o)e[t+o]=e[n+o]}_slerp(e,t,n,i){rt.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){let o=this._workIndex*s;rt.multiplyQuaternionsFlat(e,o,e,t,e,n),rt.slerpFlat(e,t,e,t,e,o,i)}_lerp(e,t,n,i,s){let o=1-i;for(let a=0;a!==s;++a){let l=t+a;e[l]=e[l]*o+e[n+a]*i}}_lerpAdditive(e,t,n,i,s){for(let o=0;o!==s;++o){let a=t+o;e[a]=e[a]+e[n+o]*i}}},Pc="\\[\\]\\.:\\/",L0=new RegExp("["+Pc+"]","g"),Ic="[^"+Pc+"]",P0="[^"+Pc.replace("\\.","")+"]",I0=/((?:WC+[\/:])*)/.source.replace("WC",Ic),D0=/(WCOD+)?/.source.replace("WCOD",P0),F0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ic),N0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ic),z0=new RegExp("^"+I0+D0+F0+N0+"$"),B0=["material","materials","bones"],Kl=class{constructor(e,t,n){let i=n||Ue.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ue=class r{constructor(e,t,n){this.path=t,this.parsedPath=n||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName)||e,this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,n):new r(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(L0,"")}static parseTrackName(e){let t=z0.exec(e);if(!t)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);B0.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(!t||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName)||this.rootNode,this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.error("THREE.PropertyBinding: Trying to update node for track: "+this.path+" but it wasn't found.");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let f=0;f<e.length;f++)if(e[f].name===c){c=f;break}break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[i];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(e.geometry.isBufferGeometry){if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}else{console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences on THREE.Geometry. Use THREE.BufferGeometry instead.",this);return}}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ue.Composite=Kl;Ue.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ue.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ue.prototype.GetterByBindingType=[Ue.prototype._getValue_direct,Ue.prototype._getValue_array,Ue.prototype._getValue_arrayElement,Ue.prototype._getValue_toArray];Ue.prototype.SetterByBindingTypeAndVersioning=[[Ue.prototype._setValue_direct,Ue.prototype._setValue_direct_setNeedsUpdate,Ue.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ue.prototype._setValue_array,Ue.prototype._setValue_array_setNeedsUpdate,Ue.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ue.prototype._setValue_arrayElement,Ue.prototype._setValue_arrayElement_setNeedsUpdate,Ue.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ue.prototype._setValue_fromArray,Ue.prototype._setValue_fromArray_setNeedsUpdate,Ue.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Sa=class{constructor(){this.uuid=Et(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;let e={};this._indicesByUUID=e;for(let n=0,i=arguments.length;n!==i;++n)e[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};let t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){let e=this._objects,t=this._indicesByUUID,n=this._paths,i=this._parsedPaths,s=this._bindings,o=s.length,a,l=e.length,c=this.nCachedObjects_;for(let f=0,p=arguments.length;f!==p;++f){let h=arguments[f],u=h.uuid,d=t[u];if(d===void 0){d=l++,t[u]=d,e.push(h);for(let m=0,y=o;m!==y;++m)s[m].push(new Ue(h,n[m],i[m]))}else if(d<c){a=e[d];let m=--c,y=e[m];t[y.uuid]=d,e[d]=y,t[u]=m,e[m]=h;for(let g=0,x=o;g!==x;++g){let _=s[g],v=_[m],M=_[d];_[d]=v,M===void 0&&(M=new Ue(h,n[g],i[g])),_[m]=M}}else e[d]!==a&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){let e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length,s=this.nCachedObjects_;for(let o=0,a=arguments.length;o!==a;++o){let l=arguments[o],c=l.uuid,f=t[c];if(f!==void 0&&f>=s){let p=s++,h=e[p];t[h.uuid]=f,e[f]=h,t[c]=p,e[p]=l;for(let u=0,d=i;u!==d;++u){let m=n[u],y=m[p],g=m[f];m[f]=y,m[p]=g}}}this.nCachedObjects_=s}uncache(){let e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length,s=this.nCachedObjects_,o=e.length;for(let a=0,l=arguments.length;a!==l;++a){let c=arguments[a],f=c.uuid,p=t[f];if(p!==void 0)if(delete t[f],p<s){let h=--s,u=e[h],d=--o,m=e[d];t[u.uuid]=p,e[p]=u,t[m.uuid]=h,e[h]=m,e.pop();for(let y=0,g=i;y!==g;++y){let x=n[y],_=x[h],v=x[d];x[p]=_,x[h]=v,x.pop()}}else{let h=--o,u=e[h];h>0&&(t[u.uuid]=p),e[p]=u,e.pop();for(let d=0,m=i;d!==m;++d){let y=n[d];y[p]=y[h],y.pop()}}}this.nCachedObjects_=s}subscribe_(e,t){let n=this._bindingsIndicesByPath,i=n[e],s=this._bindings;if(i!==void 0)return s[i];let o=this._paths,a=this._parsedPaths,l=this._objects,c=l.length,f=this.nCachedObjects_,p=new Array(c);i=s.length,n[e]=i,o.push(e),a.push(t),s.push(p);for(let h=f,u=l.length;h!==u;++h){let d=l[h];p[h]=new Ue(d,e,t)}return p}unsubscribe_(e){let t=this._bindingsIndicesByPath,n=t[e];if(n!==void 0){let i=this._paths,s=this._parsedPaths,o=this._bindings,a=o.length-1,l=o[a],c=e[a];t[c]=n,o[n]=l,o.pop(),s[n]=s[a],s.pop(),i[n]=i[a],i.pop()}}};Sa.prototype.isAnimationObjectGroup=!0;var ec=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let s=t.tracks,o=s.length,a=new Array(o),l={endingStart:jn,endingEnd:jn};for(let c=0;c!==o;++c){let f=s[c].createInterpolant(null);a[c]=f,f.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Dd,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){let i=this._clip.duration,s=e._clip.duration,o=s/i,a=i/s;e.warp(1,o,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,s=i.time,o=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let l=a.parameterPositions,c=a.sampleValues;return l[0]=s,l[1]=s+n,c[0]=e/o,c[1]=t/o,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let l=(e-s)*n;if(l<0||n===0)return;this._startTime=null,t=n*l}t*=this._updateTimeScale(e);let o=this._updateTime(t),a=this._updateWeight(e);if(a>0){let l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case wc:for(let f=0,p=l.length;f!==p;++f)l[f].evaluate(o),c[f].accumulateAdditive(a);break;case Na:default:for(let f=0,p=l.length;f!==p;++f)l[f].evaluate(o),c[f].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,s=this._loopCount,o=n===Fd;if(e===0)return s===-1?i:o&&(s&1)===1?t-i:i;if(n===Id){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=t||i<0){let a=Math.floor(i/t);i-=t*a,s+=Math.abs(a);let l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){let c=e<0;this._setEndings(c,!c,o)}else this._setEndings(!1,!1,o);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=Qn,i.endingEnd=Qn):(e?i.endingStart=this.zeroSlopeAtStart?Qn:jn:i.endingStart=Js,t?i.endingEnd=this.zeroSlopeAtEnd?Qn:jn:i.endingEnd=Js)}_scheduleFading(e,t,n){let i=this._mixer,s=i.time,o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);let a=o.parameterPositions,l=o.sampleValues;return a[0]=s,l[0]=t,a[1]=s+e,l[1]=n,this}},Ea=class extends qt{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,o=e._propertyBindings,a=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName,f=c[l];f===void 0&&(f={},c[l]=f);for(let p=0;p!==s;++p){let h=i[p],u=h.name,d=f[u];if(d!==void 0)o[p]=d;else{if(d=o[p],d!==void 0){d._cacheIndex===null&&(++d.referenceCount,this._addInactiveBinding(d,l,u));continue}let m=t&&t._propertyBindings[p].binding.parsedPath;d=new ba(Ue.create(n,u,m),h.ValueTypeName,h.getValueSize()),++d.referenceCount,this._addInactiveBinding(d,l,u),o[p]=d}a[p].resultBuffer=d.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,s=this._actionsByClip,o=s[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=o;else{let a=o.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,o=this._actionsByClip,a=o[s],l=a.knownActions,c=l[l.length-1],f=e._byClipCacheIndex;c._byClipCacheIndex=f,l[f]=c,l.pop(),e._byClipCacheIndex=null;let p=a.actionByRoot,h=(e._localRoot||this._root).uuid;delete p[h],l.length===0&&delete o[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,s=this._bindings,o=i[t];o===void 0&&(o={},i[t]=o),o[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,o=this._bindingsByRootAndName,a=o[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete a[s],Object.keys(a).length===0&&delete o[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new Pr(new Float32Array(2),new Float32Array(2),1,this._controlInterpolantsResultBuffer),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){let i=t||this._root,s=i.uuid,o=typeof e=="string"?gi.findByName(i,e):e,a=o!==null?o.uuid:e,l=this._actionsByClip[a],c=null;if(n===void 0&&(o!==null?n=o.blendMode:n=Na),l!==void 0){let p=l.actionByRoot[s];if(p!==void 0&&p.blendMode===n)return p;c=l.knownActions[0],o===null&&(o=c._clip)}if(o===null)return null;let f=new ec(this,o,t,n);return this._bindAction(f,c),this._addInactiveAction(f,a,s),f}existingAction(e,t){let n=t||this._root,i=n.uuid,s=typeof e=="string"?gi.findByName(n,e):e,o=s?s.uuid:e,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),o=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,s,o);let a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let o=s.knownActions;for(let a=0,l=o.length;a!==l;++a){let c=o[a];this._deactivateAction(c);let f=c._cacheIndex,p=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,p._cacheIndex=f,t[f]=p,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let o in n){let a=n[o].actionByRoot,l=a[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}let i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(let o in s){let a=s[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};Ea.prototype._controlInterpolantsResultBuffer=new Float32Array(1);var Ta=class r{constructor(e){typeof e=="string"&&(console.warn("THREE.Uniform: Type parameter is no longer needed."),e=arguments[1]),this.value=e}clone(){return new r(this.value.clone===void 0?this.value:this.value.clone())}},Aa=class extends ln{constructor(e,t,n=1){super(e,t),this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}};Aa.prototype.isInstancedInterleavedBuffer=!0;var Ca=class{constructor(e,t,n,i,s){this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=i,this.count=s,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}};Ca.prototype.isGLBufferAttribute=!0;var tc=class{constructor(e,t,n=0,i=1/0){this.ray=new Jt(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new js,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t&&t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t&&t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return nc(e,this,n,t),n.sort(nu),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)nc(e[i],this,n,t);return n.sort(nu),n}};function nu(r,e){return r.distance-e.distance}function nc(r,e,t,n){if(r.layers.test(e.layers)&&r.raycast(e,t),n===!0){let i=r.children;for(let s=0,o=i.length;s<o;s++)nc(i[s],e,t,!0)}}var ic=class{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(ct(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},sc=class{constructor(e=1,t=0,n=0){return this.radius=e,this.theta=t,this.y=n,this}set(e,t,n){return this.radius=e,this.theta=t,this.y=n,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+n*n),this.theta=Math.atan2(e,n),this.y=t,this}clone(){return new this.constructor().copy(this)}},iu=new X,Nn=class{constructor(e=new X(1/0,1/0),t=new X(-1/0,-1/0)){this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=iu.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y)}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return iu.copy(e).clamp(this.min,this.max).sub(e).length()}intersect(e){return this.min.max(e.min),this.max.min(e.max),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}};Nn.prototype.isBox2=!0;var su=new b,Io=new b,Ra=class{constructor(e=new b,t=new b){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){su.subVectors(e,this.start),Io.subVectors(this.end,this.start);let n=Io.dot(Io),s=Io.dot(su)/n;return t&&(s=ct(s,0,1)),s}closestPointToPoint(e,t,n){let i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}},ru=new b,rc=class extends Ie{constructor(e,t){super(),this.light=e,this.light.updateMatrixWorld(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=t;let n=new _e,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let o=0,a=1,l=32;o<l;o++,a++){let c=o/l*Math.PI*2,f=a/l*Math.PI*2;i.push(Math.cos(c),Math.sin(c),1,Math.cos(f),Math.sin(f),1)}n.setAttribute("position",new le(i,3));let s=new it({fog:!1,toneMapped:!1});this.cone=new vt(n,s),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateMatrixWorld();let e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),ru.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(ru),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}},Sn=new b,Do=new he,Ml=new he,La=class extends vt{constructor(e){let t=hf(e),n=new _e,i=[],s=[],o=new ne(0,0,1),a=new ne(0,1,0);for(let c=0;c<t.length;c++){let f=t[c];f.parent&&f.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(o.r,o.g,o.b),s.push(a.r,a.g,a.b))}n.setAttribute("position",new le(i,3)),n.setAttribute("color",new le(s,3));let l=new it({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,l),this.type="SkeletonHelper",this.isSkeletonHelper=!0,this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){let t=this.bones,n=this.geometry,i=n.getAttribute("position");Ml.copy(this.root.matrixWorld).invert();for(let s=0,o=0;s<t.length;s++){let a=t[s];a.parent&&a.parent.isBone&&(Do.multiplyMatrices(Ml,a.matrixWorld),Sn.setFromMatrixPosition(Do),i.setXYZ(o,Sn.x,Sn.y,Sn.z),Do.multiplyMatrices(Ml,a.parent.matrixWorld),Sn.setFromMatrixPosition(Do),i.setXYZ(o+1,Sn.x,Sn.y,Sn.z),o+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}};function hf(r){let e=[];r&&r.isBone&&e.push(r);for(let t=0;t<r.children.length;t++)e.push.apply(e,hf(r.children[t]));return e}var oc=class extends Je{constructor(e,t,n){let i=new ys(t,4,2),s=new Ut({wireframe:!0,fog:!1,toneMapped:!1});super(i,s),this.light=e,this.light.updateMatrixWorld(),this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}},O0=new b,ou=new ne,au=new ne,ac=class extends Ie{constructor(e,t,n){super(),this.light=e,this.light.updateMatrixWorld(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n;let i=new gs(t);i.rotateY(Math.PI*.5),this.material=new Ut({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);let s=i.getAttribute("position"),o=new Float32Array(s.count*3);i.setAttribute("color",new Pe(o,3)),this.add(new Je(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){let e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{let t=e.geometry.getAttribute("color");ou.copy(this.light.color),au.copy(this.light.groundColor);for(let n=0,i=t.count;n<i;n++){let s=n<i/2?ou:au;t.setXYZ(n,s.r,s.g,s.b)}t.needsUpdate=!0}e.lookAt(O0.setFromMatrixPosition(this.light.matrixWorld).negate())}},Pa=class extends vt{constructor(e=10,t=10,n=4473924,i=8947848){n=new ne(n),i=new ne(i);let s=t/2,o=e/t,a=e/2,l=[],c=[];for(let h=0,u=0,d=-a;h<=t;h++,d+=o){l.push(-a,0,d,a,0,d),l.push(d,0,-a,d,0,a);let m=h===s?n:i;m.toArray(c,u),u+=3,m.toArray(c,u),u+=3,m.toArray(c,u),u+=3,m.toArray(c,u),u+=3}let f=new _e;f.setAttribute("position",new le(l,3)),f.setAttribute("color",new le(c,3));let p=new it({vertexColors:!0,toneMapped:!1});super(f,p),this.type="GridHelper"}},lc=class extends vt{constructor(e=10,t=16,n=8,i=64,s=4473924,o=8947848){s=new ne(s),o=new ne(o);let a=[],l=[];for(let p=0;p<=t;p++){let h=p/t*(Math.PI*2),u=Math.sin(h)*e,d=Math.cos(h)*e;a.push(0,0,0),a.push(u,0,d);let m=p&1?s:o;l.push(m.r,m.g,m.b),l.push(m.r,m.g,m.b)}for(let p=0;p<=n;p++){let h=p&1?s:o,u=e-e/n*p;for(let d=0;d<i;d++){let m=d/i*(Math.PI*2),y=Math.sin(m)*u,g=Math.cos(m)*u;a.push(y,0,g),l.push(h.r,h.g,h.b),m=(d+1)/i*(Math.PI*2),y=Math.sin(m)*u,g=Math.cos(m)*u,a.push(y,0,g),l.push(h.r,h.g,h.b)}}let c=new _e;c.setAttribute("position",new le(a,3)),c.setAttribute("color",new le(l,3));let f=new it({vertexColors:!0,toneMapped:!1});super(c,f),this.type="PolarGridHelper"}},lu=new b,Fo=new b,cu=new b,cc=class extends Ie{constructor(e,t,n){super(),this.light=e,this.light.updateMatrixWorld(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,t===void 0&&(t=1);let i=new _e;i.setAttribute("position",new le([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));let s=new it({fog:!1,toneMapped:!1});this.lightPlane=new Gt(i,s),this.add(this.lightPlane),i=new _e,i.setAttribute("position",new le([0,0,0,0,0,1],3)),this.targetLine=new Gt(i,s),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){lu.setFromMatrixPosition(this.light.matrixWorld),Fo.setFromMatrixPosition(this.light.target.matrixWorld),cu.subVectors(Fo,lu),this.lightPlane.lookAt(Fo),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(Fo),this.targetLine.scale.z=cu.length()}},No=new b,Ye=new oi,hc=class extends vt{constructor(e){let t=new _e,n=new it({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],s=[],o={},a=new ne(16755200),l=new ne(16711680),c=new ne(43775),f=new ne(16777215),p=new ne(3355443);h("n1","n2",a),h("n2","n4",a),h("n4","n3",a),h("n3","n1",a),h("f1","f2",a),h("f2","f4",a),h("f4","f3",a),h("f3","f1",a),h("n1","f1",a),h("n2","f2",a),h("n3","f3",a),h("n4","f4",a),h("p","n1",l),h("p","n2",l),h("p","n3",l),h("p","n4",l),h("u1","u2",c),h("u2","u3",c),h("u3","u1",c),h("c","t",f),h("p","c",p),h("cn1","cn2",p),h("cn3","cn4",p),h("cf1","cf2",p),h("cf3","cf4",p);function h(d,m,y){u(d,y),u(m,y)}function u(d,m){i.push(0,0,0),s.push(m.r,m.g,m.b),o[d]===void 0&&(o[d]=[]),o[d].push(i.length/3-1)}t.setAttribute("position",new le(i,3)),t.setAttribute("color",new le(s,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=o,this.update()}update(){let e=this.geometry,t=this.pointMap,n=1,i=1;Ye.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),je("c",t,e,Ye,0,0,-1),je("t",t,e,Ye,0,0,1),je("n1",t,e,Ye,-n,-i,-1),je("n2",t,e,Ye,n,-i,-1),je("n3",t,e,Ye,-n,i,-1),je("n4",t,e,Ye,n,i,-1),je("f1",t,e,Ye,-n,-i,1),je("f2",t,e,Ye,n,-i,1),je("f3",t,e,Ye,-n,i,1),je("f4",t,e,Ye,n,i,1),je("u1",t,e,Ye,n*.7,i*1.1,-1),je("u2",t,e,Ye,-n*.7,i*1.1,-1),je("u3",t,e,Ye,0,i*2,-1),je("cf1",t,e,Ye,-n,0,1),je("cf2",t,e,Ye,n,0,1),je("cf3",t,e,Ye,0,-i,1),je("cf4",t,e,Ye,0,i,1),je("cn1",t,e,Ye,-n,0,-1),je("cn2",t,e,Ye,n,0,-1),je("cn3",t,e,Ye,0,-i,-1),je("cn4",t,e,Ye,0,i,-1),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}};function je(r,e,t,n,i,s,o){No.set(i,s,o).unproject(n);let a=e[r];if(a!==void 0){let l=t.getAttribute("position");for(let c=0,f=a.length;c<f;c++)l.setXYZ(a[c],No.x,No.y,No.z)}}var zo=new _t,Ia=class extends vt{constructor(e,t=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(24),s=new _e;s.setIndex(new Pe(n,1)),s.setAttribute("position",new Pe(i,3)),super(s,new it({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(e){if(e!==void 0&&console.warn("THREE.BoxHelper: .update() has no longer arguments."),this.object!==void 0&&zo.setFromObject(this.object),zo.isEmpty())return;let t=zo.min,n=zo.max,i=this.geometry.attributes.position,s=i.array;s[0]=n.x,s[1]=n.y,s[2]=n.z,s[3]=t.x,s[4]=n.y,s[5]=n.z,s[6]=t.x,s[7]=t.y,s[8]=n.z,s[9]=n.x,s[10]=t.y,s[11]=n.z,s[12]=n.x,s[13]=n.y,s[14]=t.z,s[15]=t.x,s[16]=n.y,s[17]=t.z,s[18]=t.x,s[19]=t.y,s[20]=t.z,s[21]=n.x,s[22]=t.y,s[23]=t.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e){return vt.prototype.copy.call(this,e),this.object=e.object,this}},uc=class extends vt{constructor(e,t=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],s=new _e;s.setIndex(new Pe(n,1)),s.setAttribute("position",new le(i,3)),super(s,new it({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){let t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}},dc=class extends Gt{constructor(e,t=1,n=16776960){let i=n,s=[1,-1,1,-1,1,1,-1,-1,1,1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,0,0,1,0,0,0],o=new _e;o.setAttribute("position",new le(s,3)),o.computeBoundingSphere(),super(o,new it({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;let a=[1,1,1,-1,1,1,-1,-1,1,1,1,1,-1,-1,1,1,-1,1],l=new _e;l.setAttribute("position",new le(a,3)),l.computeBoundingSphere(),this.add(new Je(l,new Ut({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){let t=-this.plane.constant;Math.abs(t)<1e-8&&(t=1e-8),this.scale.set(.5*this.size,.5*this.size,t),this.children[0].material.side=t<0?Qe:ii,this.lookAt(this.plane.normal),super.updateMatrixWorld(e)}},hu=new b,Bo,bl,fc=class extends Ie{constructor(e=new b(0,0,1),t=new b(0,0,0),n=1,i=16776960,s=n*.2,o=s*.2){super(),this.type="ArrowHelper",Bo===void 0&&(Bo=new _e,Bo.setAttribute("position",new le([0,0,0,0,1,0],3)),bl=new hi(0,.5,1,5,1),bl.translate(0,-.5,0)),this.position.copy(t),this.line=new Gt(Bo,new it({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Je(bl,new Ut({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,s,o)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{hu.set(e.z,0,-e.x).normalize();let t=Math.acos(e.y);this.quaternion.setFromAxisAngle(hu,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}},Da=class extends vt{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new _e;i.setAttribute("position",new le(t,3)),i.setAttribute("color",new le(n,3));let s=new it({vertexColors:!0,toneMapped:!1});super(i,s),this.type="AxesHelper"}setColors(e,t,n){let i=new ne,s=this.geometry.attributes.color.array;return i.set(e),i.toArray(s,0),i.toArray(s,3),i.set(t),i.toArray(s,6),i.toArray(s,9),i.set(n),i.toArray(s,12),i.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}},pc=class{constructor(){this.type="ShapePath",this.color=new ne,this.subPaths=[],this.currentPath=null}moveTo(e,t){return this.currentPath=new fi,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,s,o){return this.currentPath.bezierCurveTo(e,t,n,i,s,o),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(e,t){function n(x){let _=[];for(let v=0,M=x.length;v<M;v++){let T=x[v],w=new Pt;w.curves=T.curves,_.push(w)}return _}function i(x,_){let v=_.length,M=!1;for(let T=v-1,w=0;w<v;T=w++){let C=_[T],I=_[w],L=I.x-C.x,R=I.y-C.y;if(Math.abs(R)>Number.EPSILON){if(R<0&&(C=_[w],L=-L,I=_[T],R=-R),x.y<C.y||x.y>I.y)continue;if(x.y===C.y){if(x.x===C.x)return!0}else{let W=R*(x.x-C.x)-L*(x.y-C.y);if(W===0)return!0;if(W<0)continue;M=!M}}else{if(x.y!==C.y)continue;if(I.x<=x.x&&x.x<=C.x||C.x<=x.x&&x.x<=I.x)return!0}}return M}let s=Xt.isClockWise,o=this.subPaths;if(o.length===0)return[];if(t===!0)return n(o);let a,l,c,f=[];if(o.length===1)return l=o[0],c=new Pt,c.curves=l.curves,f.push(c),f;let p=!s(o[0].getPoints());p=e?!p:p;let h=[],u=[],d=[],m=0,y;u[m]=void 0,d[m]=[];for(let x=0,_=o.length;x<_;x++)l=o[x],y=l.getPoints(),a=s(y),a=e?!a:a,a?(!p&&u[m]&&m++,u[m]={s:new Pt,p:y},u[m].s.curves=l.curves,p&&m++,d[m]=[]):d[m].push({h:l,p:y[0]});if(!u[0])return n(o);if(u.length>1){let x=!1,_=[];for(let v=0,M=u.length;v<M;v++)h[v]=[];for(let v=0,M=u.length;v<M;v++){let T=d[v];for(let w=0;w<T.length;w++){let C=T[w],I=!0;for(let L=0;L<u.length;L++)i(C.p,u[L].p)&&(v!==L&&_.push({froms:v,tos:L,hole:w}),I?(I=!1,h[L].push(C)):x=!0);I&&h[v].push(C)}}_.length>0&&(x||(d=h))}let g;for(let x=0,_=u.length;x<_;x++){c=u[x].s,f.push(c),g=d[x];for(let v=0,M=g.length;v<M;v++)c.holes.push(g[v].h)}return f}},uf=new Float32Array(1),U0=new Int32Array(uf.buffer),mc=class{static toHalfFloat(e){e>65504&&(console.warn("THREE.DataUtils.toHalfFloat(): value exceeds 65504."),e=65504),uf[0]=e;let t=U0[0],n=t>>16&32768,i=t>>12&2047,s=t>>23&255;return s<103?n:s>142?(n|=31744,n|=(s==255?0:1)&&t&8388607,n):s<113?(i|=2048,n|=(i>>114-s)+(i>>113-s&1),n):(n|=s-112<<10|i>>1,n+=i&1,n)}},H0=0,G0=1,k0=0,V0=1,W0=2;function X0(r){return console.warn("THREE.MeshFaceMaterial has been removed. Use an Array instead."),r}function q0(r=[]){return console.warn("THREE.MultiMaterial has been removed. Use an Array instead."),r.isMultiMaterial=!0,r.materials=r,r.clone=function(){return r.slice()},r}function Y0(r,e){return console.warn("THREE.PointCloud has been renamed to THREE.Points."),new ci(r,e)}function J0(r){return console.warn("THREE.Particle has been renamed to THREE.Sprite."),new cs(r)}function Z0(r,e){return console.warn("THREE.ParticleSystem has been renamed to THREE.Points."),new ci(r,e)}function $0(r){return console.warn("THREE.PointCloudMaterial has been renamed to THREE.PointsMaterial."),new hn(r)}function j0(r){return console.warn("THREE.ParticleBasicMaterial has been renamed to THREE.PointsMaterial."),new hn(r)}function Q0(r){return console.warn("THREE.ParticleSystemMaterial has been renamed to THREE.PointsMaterial."),new hn(r)}function K0(r,e,t){return console.warn("THREE.Vertex has been removed. Use THREE.Vector3 instead."),new b(r,e,t)}function ev(r,e){return console.warn("THREE.DynamicBufferAttribute has been removed. Use new THREE.BufferAttribute().setUsage( THREE.DynamicDrawUsage ) instead."),new Pe(r,e).setUsage(ji)}function tv(r,e){return console.warn("THREE.Int8Attribute has been removed. Use new THREE.Int8BufferAttribute() instead."),new Wo(r,e)}function nv(r,e){return console.warn("THREE.Uint8Attribute has been removed. Use new THREE.Uint8BufferAttribute() instead."),new Xo(r,e)}function iv(r,e){return console.warn("THREE.Uint8ClampedAttribute has been removed. Use new THREE.Uint8ClampedBufferAttribute() instead."),new qo(r,e)}function sv(r,e){return console.warn("THREE.Int16Attribute has been removed. Use new THREE.Int16BufferAttribute() instead."),new Yo(r,e)}function rv(r,e){return console.warn("THREE.Uint16Attribute has been removed. Use new THREE.Uint16BufferAttribute() instead."),new Qi(r,e)}function ov(r,e){return console.warn("THREE.Int32Attribute has been removed. Use new THREE.Int32BufferAttribute() instead."),new Jo(r,e)}function av(r,e){return console.warn("THREE.Uint32Attribute has been removed. Use new THREE.Uint32BufferAttribute() instead."),new Ki(r,e)}function lv(r,e){return console.warn("THREE.Float32Attribute has been removed. Use new THREE.Float32BufferAttribute() instead."),new le(r,e)}function cv(r,e){return console.warn("THREE.Float64Attribute has been removed. Use new THREE.Float64BufferAttribute() instead."),new $o(r,e)}Mt.create=function(r,e){return console.log("THREE.Curve.create() has been deprecated"),r.prototype=Object.create(Mt.prototype),r.prototype.constructor=r,r.prototype.getPoint=e,r};fi.prototype.fromPoints=function(r){return console.warn("THREE.Path: .fromPoints() has been renamed to .setFromPoints()."),this.setFromPoints(r)};function hv(r){return console.warn("THREE.AxisHelper has been renamed to THREE.AxesHelper."),new Da(r)}function uv(r,e){return console.warn("THREE.BoundingBoxHelper has been deprecated. Creating a THREE.BoxHelper instead."),new Ia(r,e)}function dv(r,e){return console.warn("THREE.EdgesHelper has been removed. Use THREE.EdgesGeometry instead."),new vt(new lr(r.geometry),new it({color:e!==void 0?e:16777215}))}Pa.prototype.setColors=function(){console.error("THREE.GridHelper: setColors() has been deprecated, pass them in the constructor instead.")};La.prototype.update=function(){console.error("THREE.SkeletonHelper: update() no longer needs to be called.")};function fv(r,e){return console.warn("THREE.WireframeHelper has been removed. Use THREE.WireframeGeometry instead."),new vt(new Mr(r.geometry),new it({color:e!==void 0?e:16777215}))}pt.prototype.extractUrlBase=function(r){return console.warn("THREE.Loader: .extractUrlBase() has been deprecated. Use THREE.LoaderUtils.extractUrlBase() instead."),_s.extractUrlBase(r)};pt.Handlers={add:function(){console.error("THREE.Loader: Handlers.add() has been removed. Use LoadingManager.addHandler() instead.")},get:function(){console.error("THREE.Loader: Handlers.get() has been removed. Use LoadingManager.getHandler() instead.")}};function pv(r){return console.warn("THREE.XHRLoader has been renamed to THREE.FileLoader."),new It(r)}function mv(r){return console.warn("THREE.BinaryTextureLoader has been renamed to THREE.DataTextureLoader."),new ha(r)}Nn.prototype.center=function(r){return console.warn("THREE.Box2: .center() has been renamed to .getCenter()."),this.getCenter(r)};Nn.prototype.empty=function(){return console.warn("THREE.Box2: .empty() has been renamed to .isEmpty()."),this.isEmpty()};Nn.prototype.isIntersectionBox=function(r){return console.warn("THREE.Box2: .isIntersectionBox() has been renamed to .intersectsBox()."),this.intersectsBox(r)};Nn.prototype.size=function(r){return console.warn("THREE.Box2: .size() has been renamed to .getSize()."),this.getSize(r)};_t.prototype.center=function(r){return console.warn("THREE.Box3: .center() has been renamed to .getCenter()."),this.getCenter(r)};_t.prototype.empty=function(){return console.warn("THREE.Box3: .empty() has been renamed to .isEmpty()."),this.isEmpty()};_t.prototype.isIntersectionBox=function(r){return console.warn("THREE.Box3: .isIntersectionBox() has been renamed to .intersectsBox()."),this.intersectsBox(r)};_t.prototype.isIntersectionSphere=function(r){return console.warn("THREE.Box3: .isIntersectionSphere() has been renamed to .intersectsSphere()."),this.intersectsSphere(r)};_t.prototype.size=function(r){return console.warn("THREE.Box3: .size() has been renamed to .getSize()."),this.getSize(r)};Yt.prototype.empty=function(){return console.warn("THREE.Sphere: .empty() has been renamed to .isEmpty()."),this.isEmpty()};ai.prototype.setFromMatrix=function(r){return console.warn("THREE.Frustum: .setFromMatrix() has been renamed to .setFromProjectionMatrix()."),this.setFromProjectionMatrix(r)};Ra.prototype.center=function(r){return console.warn("THREE.Line3: .center() has been renamed to .getCenter()."),this.getCenter(r)};Ke.prototype.flattenToArrayOffset=function(r,e){return console.warn("THREE.Matrix3: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."),this.toArray(r,e)};Ke.prototype.multiplyVector3=function(r){return console.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."),r.applyMatrix3(this)};Ke.prototype.multiplyVector3Array=function(){console.error("THREE.Matrix3: .multiplyVector3Array() has been removed.")};Ke.prototype.applyToBufferAttribute=function(r){return console.warn("THREE.Matrix3: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix3( matrix ) instead."),r.applyMatrix3(this)};Ke.prototype.applyToVector3Array=function(){console.error("THREE.Matrix3: .applyToVector3Array() has been removed.")};Ke.prototype.getInverse=function(r){return console.warn("THREE.Matrix3: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead."),this.copy(r).invert()};he.prototype.extractPosition=function(r){return console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."),this.copyPosition(r)};he.prototype.flattenToArrayOffset=function(r,e){return console.warn("THREE.Matrix4: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."),this.toArray(r,e)};he.prototype.getPosition=function(){return console.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead."),new b().setFromMatrixColumn(this,3)};he.prototype.setRotationFromQuaternion=function(r){return console.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion()."),this.makeRotationFromQuaternion(r)};he.prototype.multiplyToArray=function(){console.warn("THREE.Matrix4: .multiplyToArray() has been removed.")};he.prototype.multiplyVector3=function(r){return console.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};he.prototype.multiplyVector4=function(r){return console.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};he.prototype.multiplyVector3Array=function(){console.error("THREE.Matrix4: .multiplyVector3Array() has been removed.")};he.prototype.rotateAxis=function(r){console.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead."),r.transformDirection(this)};he.prototype.crossVector=function(r){return console.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};he.prototype.translate=function(){console.error("THREE.Matrix4: .translate() has been removed.")};he.prototype.rotateX=function(){console.error("THREE.Matrix4: .rotateX() has been removed.")};he.prototype.rotateY=function(){console.error("THREE.Matrix4: .rotateY() has been removed.")};he.prototype.rotateZ=function(){console.error("THREE.Matrix4: .rotateZ() has been removed.")};he.prototype.rotateByAxis=function(){console.error("THREE.Matrix4: .rotateByAxis() has been removed.")};he.prototype.applyToBufferAttribute=function(r){return console.warn("THREE.Matrix4: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};he.prototype.applyToVector3Array=function(){console.error("THREE.Matrix4: .applyToVector3Array() has been removed.")};he.prototype.makeFrustum=function(r,e,t,n,i,s){return console.warn("THREE.Matrix4: .makeFrustum() has been removed. Use .makePerspective( left, right, top, bottom, near, far ) instead."),this.makePerspective(r,e,n,t,i,s)};he.prototype.getInverse=function(r){return console.warn("THREE.Matrix4: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead."),this.copy(r).invert()};Lt.prototype.isIntersectionLine=function(r){return console.warn("THREE.Plane: .isIntersectionLine() has been renamed to .intersectsLine()."),this.intersectsLine(r)};rt.prototype.multiplyVector3=function(r){return console.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead."),r.applyQuaternion(this)};rt.prototype.inverse=function(){return console.warn("THREE.Quaternion: .inverse() has been renamed to invert()."),this.invert()};Jt.prototype.isIntersectionBox=function(r){return console.warn("THREE.Ray: .isIntersectionBox() has been renamed to .intersectsBox()."),this.intersectsBox(r)};Jt.prototype.isIntersectionPlane=function(r){return console.warn("THREE.Ray: .isIntersectionPlane() has been renamed to .intersectsPlane()."),this.intersectsPlane(r)};Jt.prototype.isIntersectionSphere=function(r){return console.warn("THREE.Ray: .isIntersectionSphere() has been renamed to .intersectsSphere()."),this.intersectsSphere(r)};dt.prototype.area=function(){return console.warn("THREE.Triangle: .area() has been renamed to .getArea()."),this.getArea()};dt.prototype.barycoordFromPoint=function(r,e){return console.warn("THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."),this.getBarycoord(r,e)};dt.prototype.midpoint=function(r){return console.warn("THREE.Triangle: .midpoint() has been renamed to .getMidpoint()."),this.getMidpoint(r)};dt.prototypenormal=function(r){return console.warn("THREE.Triangle: .normal() has been renamed to .getNormal()."),this.getNormal(r)};dt.prototype.plane=function(r){return console.warn("THREE.Triangle: .plane() has been renamed to .getPlane()."),this.getPlane(r)};dt.barycoordFromPoint=function(r,e,t,n,i){return console.warn("THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."),dt.getBarycoord(r,e,t,n,i)};dt.normal=function(r,e,t,n){return console.warn("THREE.Triangle: .normal() has been renamed to .getNormal()."),dt.getNormal(r,e,t,n)};Pt.prototype.extractAllPoints=function(r){return console.warn("THREE.Shape: .extractAllPoints() has been removed. Use .extractPoints() instead."),this.extractPoints(r)};Pt.prototype.extrude=function(r){return console.warn("THREE.Shape: .extrude() has been removed. Use ExtrudeGeometry() instead."),new dn(this,r)};Pt.prototype.makeGeometry=function(r){return console.warn("THREE.Shape: .makeGeometry() has been removed. Use ShapeGeometry() instead."),new xs(this,r)};X.prototype.fromAttribute=function(r,e,t){return console.warn("THREE.Vector2: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(r,e,t)};X.prototype.distanceToManhattan=function(r){return console.warn("THREE.Vector2: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."),this.manhattanDistanceTo(r)};X.prototype.lengthManhattan=function(){return console.warn("THREE.Vector2: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};b.prototype.setEulerFromRotationMatrix=function(){console.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.")};b.prototype.setEulerFromQuaternion=function(){console.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.")};b.prototype.getPositionFromMatrix=function(r){return console.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition()."),this.setFromMatrixPosition(r)};b.prototype.getScaleFromMatrix=function(r){return console.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale()."),this.setFromMatrixScale(r)};b.prototype.getColumnFromMatrix=function(r,e){return console.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn()."),this.setFromMatrixColumn(e,r)};b.prototype.applyProjection=function(r){return console.warn("THREE.Vector3: .applyProjection() has been removed. Use .applyMatrix4( m ) instead."),this.applyMatrix4(r)};b.prototype.fromAttribute=function(r,e,t){return console.warn("THREE.Vector3: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(r,e,t)};b.prototype.distanceToManhattan=function(r){return console.warn("THREE.Vector3: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."),this.manhattanDistanceTo(r)};b.prototype.lengthManhattan=function(){return console.warn("THREE.Vector3: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};Be.prototype.fromAttribute=function(r,e,t){return console.warn("THREE.Vector4: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(r,e,t)};Be.prototype.lengthManhattan=function(){return console.warn("THREE.Vector4: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};Ie.prototype.getChildByName=function(r){return console.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."),this.getObjectByName(r)};Ie.prototype.renderDepth=function(){console.warn("THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead.")};Ie.prototype.translate=function(r,e){return console.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead."),this.translateOnAxis(e,r)};Ie.prototype.getWorldRotation=function(){console.error("THREE.Object3D: .getWorldRotation() has been removed. Use THREE.Object3D.getWorldQuaternion( target ) instead.")};Ie.prototype.applyMatrix=function(r){return console.warn("THREE.Object3D: .applyMatrix() has been renamed to .applyMatrix4()."),this.applyMatrix4(r)};Object.defineProperties(Ie.prototype,{eulerOrder:{get:function(){return console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."),this.rotation.order},set:function(r){console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."),this.rotation.order=r}},useQuaternion:{get:function(){console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")},set:function(){console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")}}});Je.prototype.setDrawMode=function(){console.error("THREE.Mesh: .setDrawMode() has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.")};Object.defineProperties(Je.prototype,{drawMode:{get:function(){return console.error("THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode."),Nd},set:function(){console.error("THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.")}}});hs.prototype.initBones=function(){console.error("THREE.SkinnedMesh: initBones() has been removed.")};et.prototype.setLens=function(r,e){console.warn("THREE.PerspectiveCamera.setLens is deprecated. Use .setFocalLength and .filmGauge for a photographic setup."),e!==void 0&&(this.filmGauge=e),this.setFocalLength(r)};Object.defineProperties(Ct.prototype,{onlyShadow:{set:function(){console.warn("THREE.Light: .onlyShadow has been removed.")}},shadowCameraFov:{set:function(r){console.warn("THREE.Light: .shadowCameraFov is now .shadow.camera.fov."),this.shadow.camera.fov=r}},shadowCameraLeft:{set:function(r){console.warn("THREE.Light: .shadowCameraLeft is now .shadow.camera.left."),this.shadow.camera.left=r}},shadowCameraRight:{set:function(r){console.warn("THREE.Light: .shadowCameraRight is now .shadow.camera.right."),this.shadow.camera.right=r}},shadowCameraTop:{set:function(r){console.warn("THREE.Light: .shadowCameraTop is now .shadow.camera.top."),this.shadow.camera.top=r}},shadowCameraBottom:{set:function(r){console.warn("THREE.Light: .shadowCameraBottom is now .shadow.camera.bottom."),this.shadow.camera.bottom=r}},shadowCameraNear:{set:function(r){console.warn("THREE.Light: .shadowCameraNear is now .shadow.camera.near."),this.shadow.camera.near=r}},shadowCameraFar:{set:function(r){console.warn("THREE.Light: .shadowCameraFar is now .shadow.camera.far."),this.shadow.camera.far=r}},shadowCameraVisible:{set:function(){console.warn("THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow.camera ) instead.")}},shadowBias:{set:function(r){console.warn("THREE.Light: .shadowBias is now .shadow.bias."),this.shadow.bias=r}},shadowDarkness:{set:function(){console.warn("THREE.Light: .shadowDarkness has been removed.")}},shadowMapWidth:{set:function(r){console.warn("THREE.Light: .shadowMapWidth is now .shadow.mapSize.width."),this.shadow.mapSize.width=r}},shadowMapHeight:{set:function(r){console.warn("THREE.Light: .shadowMapHeight is now .shadow.mapSize.height."),this.shadow.mapSize.height=r}}});Object.defineProperties(Pe.prototype,{length:{get:function(){return console.warn("THREE.BufferAttribute: .length has been deprecated. Use .count instead."),this.array.length}},dynamic:{get:function(){return console.warn("THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."),this.usage===ji},set:function(){console.warn("THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."),this.setUsage(ji)}}});Pe.prototype.setDynamic=function(r){return console.warn("THREE.BufferAttribute: .setDynamic() has been deprecated. Use .setUsage() instead."),this.setUsage(r===!0?ji:$i),this};Pe.prototype.copyIndicesArray=function(){console.error("THREE.BufferAttribute: .copyIndicesArray() has been removed.")},Pe.prototype.setArray=function(){console.error("THREE.BufferAttribute: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers")};_e.prototype.addIndex=function(r){console.warn("THREE.BufferGeometry: .addIndex() has been renamed to .setIndex()."),this.setIndex(r)};_e.prototype.addAttribute=function(r,e){return console.warn("THREE.BufferGeometry: .addAttribute() has been renamed to .setAttribute()."),!(e&&e.isBufferAttribute)&&!(e&&e.isInterleavedBufferAttribute)?(console.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."),this.setAttribute(r,new Pe(arguments[1],arguments[2]))):r==="index"?(console.warn("THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute."),this.setIndex(e),this):this.setAttribute(r,e)};_e.prototype.addDrawCall=function(r,e,t){t!==void 0&&console.warn("THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset."),console.warn("THREE.BufferGeometry: .addDrawCall() is now .addGroup()."),this.addGroup(r,e)};_e.prototype.clearDrawCalls=function(){console.warn("THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups()."),this.clearGroups()};_e.prototype.computeOffsets=function(){console.warn("THREE.BufferGeometry: .computeOffsets() has been removed.")};_e.prototype.removeAttribute=function(r){return console.warn("THREE.BufferGeometry: .removeAttribute() has been renamed to .deleteAttribute()."),this.deleteAttribute(r)};_e.prototype.applyMatrix=function(r){return console.warn("THREE.BufferGeometry: .applyMatrix() has been renamed to .applyMatrix4()."),this.applyMatrix4(r)};Object.defineProperties(_e.prototype,{drawcalls:{get:function(){return console.error("THREE.BufferGeometry: .drawcalls has been renamed to .groups."),this.groups}},offsets:{get:function(){return console.warn("THREE.BufferGeometry: .offsets has been renamed to .groups."),this.groups}}});ln.prototype.setDynamic=function(r){return console.warn("THREE.InterleavedBuffer: .setDynamic() has been deprecated. Use .setUsage() instead."),this.setUsage(r===!0?ji:$i),this};ln.prototype.setArray=function(){console.error("THREE.InterleavedBuffer: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers")};dn.prototype.getArrays=function(){console.error("THREE.ExtrudeGeometry: .getArrays() has been removed.")};dn.prototype.addShapeList=function(){console.error("THREE.ExtrudeGeometry: .addShapeList() has been removed.")};dn.prototype.addShape=function(){console.error("THREE.ExtrudeGeometry: .addShape() has been removed.")};as.prototype.dispose=function(){console.error("THREE.Scene: .dispose() has been removed.")};Ta.prototype.onUpdate=function(){return console.warn("THREE.Uniform: .onUpdate() has been removed. Use object.onBeforeRender() instead."),this};Object.defineProperties(nt.prototype,{wrapAround:{get:function(){console.warn("THREE.Material: .wrapAround has been removed.")},set:function(){console.warn("THREE.Material: .wrapAround has been removed.")}},overdraw:{get:function(){console.warn("THREE.Material: .overdraw has been removed.")},set:function(){console.warn("THREE.Material: .overdraw has been removed.")}},wrapRGB:{get:function(){return console.warn("THREE.Material: .wrapRGB has been removed."),new ne}},shading:{get:function(){console.error("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead.")},set:function(r){console.warn("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead."),this.flatShading=r===xc}},stencilMask:{get:function(){return console.warn("THREE."+this.type+": .stencilMask has been removed. Use .stencilFuncMask instead."),this.stencilFuncMask},set:function(r){console.warn("THREE."+this.type+": .stencilMask has been removed. Use .stencilFuncMask instead."),this.stencilFuncMask=r}},vertexTangents:{get:function(){console.warn("THREE."+this.type+": .vertexTangents has been removed.")},set:function(){console.warn("THREE."+this.type+": .vertexTangents has been removed.")}}});Object.defineProperties(Ht.prototype,{derivatives:{get:function(){return console.warn("THREE.ShaderMaterial: .derivatives has been moved to .extensions.derivatives."),this.extensions.derivatives},set:function(r){console.warn("THREE. ShaderMaterial: .derivatives has been moved to .extensions.derivatives."),this.extensions.derivatives=r}}});He.prototype.clearTarget=function(r,e,t,n){console.warn("THREE.WebGLRenderer: .clearTarget() has been deprecated. Use .setRenderTarget() and .clear() instead."),this.setRenderTarget(r),this.clear(e,t,n)};He.prototype.animate=function(r){console.warn("THREE.WebGLRenderer: .animate() is now .setAnimationLoop()."),this.setAnimationLoop(r)};He.prototype.getCurrentRenderTarget=function(){return console.warn("THREE.WebGLRenderer: .getCurrentRenderTarget() is now .getRenderTarget()."),this.getRenderTarget()};He.prototype.getMaxAnisotropy=function(){return console.warn("THREE.WebGLRenderer: .getMaxAnisotropy() is now .capabilities.getMaxAnisotropy()."),this.capabilities.getMaxAnisotropy()};He.prototype.getPrecision=function(){return console.warn("THREE.WebGLRenderer: .getPrecision() is now .capabilities.precision."),this.capabilities.precision};He.prototype.resetGLState=function(){return console.warn("THREE.WebGLRenderer: .resetGLState() is now .state.reset()."),this.state.reset()};He.prototype.supportsFloatTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( 'OES_texture_float' )."),this.extensions.get("OES_texture_float")};He.prototype.supportsHalfFloatTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( 'OES_texture_half_float' )."),this.extensions.get("OES_texture_half_float")};He.prototype.supportsStandardDerivatives=function(){return console.warn("THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( 'OES_standard_derivatives' )."),this.extensions.get("OES_standard_derivatives")};He.prototype.supportsCompressedTextureS3TC=function(){return console.warn("THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( 'WEBGL_compressed_texture_s3tc' )."),this.extensions.get("WEBGL_compressed_texture_s3tc")};He.prototype.supportsCompressedTexturePVRTC=function(){return console.warn("THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( 'WEBGL_compressed_texture_pvrtc' )."),this.extensions.get("WEBGL_compressed_texture_pvrtc")};He.prototype.supportsBlendMinMax=function(){return console.warn("THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( 'EXT_blend_minmax' )."),this.extensions.get("EXT_blend_minmax")};He.prototype.supportsVertexTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsVertexTextures() is now .capabilities.vertexTextures."),this.capabilities.vertexTextures};He.prototype.supportsInstancedArrays=function(){return console.warn("THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( 'ANGLE_instanced_arrays' )."),this.extensions.get("ANGLE_instanced_arrays")};He.prototype.enableScissorTest=function(r){console.warn("THREE.WebGLRenderer: .enableScissorTest() is now .setScissorTest()."),this.setScissorTest(r)};He.prototype.initMaterial=function(){console.warn("THREE.WebGLRenderer: .initMaterial() has been removed.")};He.prototype.addPrePlugin=function(){console.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.")};He.prototype.addPostPlugin=function(){console.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.")};He.prototype.updateShadowMap=function(){console.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.")};He.prototype.setFaceCulling=function(){console.warn("THREE.WebGLRenderer: .setFaceCulling() has been removed.")};He.prototype.allocTextureUnit=function(){console.warn("THREE.WebGLRenderer: .allocTextureUnit() has been removed.")};He.prototype.setTexture=function(){console.warn("THREE.WebGLRenderer: .setTexture() has been removed.")};He.prototype.setTexture2D=function(){console.warn("THREE.WebGLRenderer: .setTexture2D() has been removed.")};He.prototype.setTextureCube=function(){console.warn("THREE.WebGLRenderer: .setTextureCube() has been removed.")};He.prototype.getActiveMipMapLevel=function(){return console.warn("THREE.WebGLRenderer: .getActiveMipMapLevel() is now .getActiveMipmapLevel()."),this.getActiveMipmapLevel()};Object.defineProperties(He.prototype,{shadowMapEnabled:{get:function(){return this.shadowMap.enabled},set:function(r){console.warn("THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled."),this.shadowMap.enabled=r}},shadowMapType:{get:function(){return this.shadowMap.type},set:function(r){console.warn("THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type."),this.shadowMap.type=r}},shadowMapCullFace:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.")}},context:{get:function(){return console.warn("THREE.WebGLRenderer: .context has been removed. Use .getContext() instead."),this.getContext()}},vr:{get:function(){return console.warn("THREE.WebGLRenderer: .vr has been renamed to .xr"),this.xr}},gammaInput:{get:function(){return console.warn("THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead."),!1},set:function(){console.warn("THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead.")}},gammaOutput:{get:function(){return console.warn("THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."),!1},set:function(r){console.warn("THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."),this.outputEncoding=r===!0?zn:ft}},toneMappingWhitePoint:{get:function(){return console.warn("THREE.WebGLRenderer: .toneMappingWhitePoint has been removed."),1},set:function(){console.warn("THREE.WebGLRenderer: .toneMappingWhitePoint has been removed.")}}});Object.defineProperties(nf.prototype,{cullFace:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.")}},renderReverseSided:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.")}},renderSingleSided:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.")}}});function gv(r,e,t){return console.warn("THREE.WebGLRenderTargetCube( width, height, options ) is now WebGLCubeRenderTarget( size, options )."),new ns(r,t)}Object.defineProperties(Tt.prototype,{wrapS:{get:function(){return console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."),this.texture.wrapS},set:function(r){console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."),this.texture.wrapS=r}},wrapT:{get:function(){return console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."),this.texture.wrapT},set:function(r){console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."),this.texture.wrapT=r}},magFilter:{get:function(){return console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."),this.texture.magFilter},set:function(r){console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."),this.texture.magFilter=r}},minFilter:{get:function(){return console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."),this.texture.minFilter},set:function(r){console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."),this.texture.minFilter=r}},anisotropy:{get:function(){return console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."),this.texture.anisotropy},set:function(r){console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."),this.texture.anisotropy=r}},offset:{get:function(){return console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."),this.texture.offset},set:function(r){console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."),this.texture.offset=r}},repeat:{get:function(){return console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."),this.texture.repeat},set:function(r){console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."),this.texture.repeat=r}},format:{get:function(){return console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."),this.texture.format},set:function(r){console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."),this.texture.format=r}},type:{get:function(){return console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."),this.texture.type},set:function(r){console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."),this.texture.type=r}},generateMipmaps:{get:function(){return console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."),this.texture.generateMipmaps},set:function(r){console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."),this.texture.generateMipmaps=r}}});Vr.prototype.load=function(r){console.warn("THREE.Audio: .load has been deprecated. Use THREE.AudioLoader instead.");let e=this;return new ya().load(r,function(n){e.setBuffer(n)}),this};Ma.prototype.getData=function(){return console.warn("THREE.AudioAnalyser: .getData() is now .getFrequencyData()."),this.getFrequencyData()};ts.prototype.updateCubeMap=function(r,e){return console.warn("THREE.CubeCamera: .updateCubeMap() is now .update()."),this.update(r,e)};ts.prototype.clear=function(r,e,t,n){return console.warn("THREE.CubeCamera: .clear() is now .renderTarget.clear()."),this.renderTarget.clear(r,e,t,n)};an.crossOrigin=void 0;an.loadTexture=function(r,e,t,n){console.warn("THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.");let i=new ua;i.setCrossOrigin(this.crossOrigin);let s=i.load(r,t,void 0,n);return e&&(s.mapping=e),s};an.loadTextureCube=function(r,e,t,n){console.warn("THREE.ImageUtils.loadTextureCube has been deprecated. Use THREE.CubeTextureLoader() instead.");let i=new ca;i.setCrossOrigin(this.crossOrigin);let s=i.load(r,t,void 0,n);return e&&(s.mapping=e),s};an.loadCompressedTexture=function(){console.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.")};an.loadCompressedTextureCube=function(){console.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.")};function xv(){console.error("THREE.CanvasRenderer has been removed")}function yv(){console.error("THREE.JSONLoader has been removed.")}var vv={createMultiMaterialObject:function(){console.error("THREE.SceneUtils has been moved to /examples/jsm/utils/SceneUtils.js")},detach:function(){console.error("THREE.SceneUtils has been moved to /examples/jsm/utils/SceneUtils.js")},attach:function(){console.error("THREE.SceneUtils has been moved to /examples/jsm/utils/SceneUtils.js")}};function _v(){console.error("THREE.LensFlare has been moved to /examples/jsm/objects/Lensflare.js")}function wv(){return console.error("THREE.ParametricGeometry has been moved to /examples/jsm/geometries/ParametricGeometry.js"),new _e}function Mv(){return console.error("THREE.TextGeometry has been moved to /examples/jsm/geometries/TextGeometry.js"),new _e}function bv(){console.error("THREE.FontLoader has been moved to /examples/jsm/loaders/FontLoader.js")}function Sv(){console.error("THREE.Font has been moved to /examples/jsm/loaders/FontLoader.js")}function Ev(){console.error("THREE.ImmediateRenderObject has been removed.")}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"134"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="134");var mf=ka(df()),gf=ka(ff()),xf=ka(pf()),Tv={fog:[mf.default,{highlightColor:15115105,midtoneColor:9781318,lowlightColor:6235701,baseColor:10184025,speed:1.05,zoom:.95,blurFactor:.55}],net:[gf.default,{backgroundColor:3153963,color:13667191,points:8,maxDistance:22,spacing:17,showDots:!0}],waves:[xf.default,{color:7680573,shininess:38,waveHeight:16,waveSpeed:.73,zoom:.82}]};function Lv(r){let[e,t]=Tv[r.dataset.light],n=e({el:r,THREE:Dc,mouseControls:!0,touchControls:!1,gyroControls:!1,minWidth:40,minHeight:40,scale:1.45,scaleMobile:2.5,...t});if(n.renderer?.domElement?.isConnected)return r.dataset.rendered=r.dataset.light,()=>{let i=n.renderer;n.destroy(),i?.dispose(),i?.forceContextLoss(),delete r.dataset.rendered}}export{Lv as lightSurface};
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2021 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
