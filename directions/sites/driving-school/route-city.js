// Moscow driving lesson. All scene dimensions are in metres.
function buildDistrict() {
  const vertices = [];
  let target = vertices;
  let seed = 7311;
  function random() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }
  const colors = new Map();
  function rgb(hex) {
    if (!colors.has(hex)) {
      const n = parseInt(hex.slice(1), 16);
      colors.set(hex, [n >> 16, (n >> 8) & 255, n & 255].map(v => v / 255));
    }
    return colors.get(hex);
  }
  // Light the model in world space so facade detail holds up at every camera angle.
  function face(points, color, glow = 0) {
    const [a,b,c] = points;
    const ux=b[0]-a[0], uy=b[1]-a[1], uz=b[2]-a[2];
    const vx=c[0]-a[0], vy=c[1]-a[1], vz=c[2]-a[2];
    const nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx;
    const inv=1/(Math.hypot(nx,ny,nz)||1);
    const sun=Math.max(0,(-.53*nx+.77*ny+.36*nz)*inv);
    const k=glow ? 1 : .75 + .26*sun + .055*Math.max(0,ny*inv);
    const [r,g,bv]=rgb(color);
    const emit=p=>target.push(p[0],p[1],p[2],r*k,g*k,bv*k,glow);
    for(let i=1;i<points.length-1;i++){emit(a);emit(points[i]);emit(points[i+1]);}
  }
  function paving(x1,z1,x2,z2,y,color,kind=0) {
    face([[x1,y,z2],[x2,y,z2],[x2,y,z1],[x1,y,z1]],color,kind);
  }
  function box(x,z,w,d,bottom,top,color,topColor=color) {
    const x0=x-w/2,x1=x+w/2,z0=z-d/2,z1=z+d/2;
    face([[x0,bottom,z1],[x1,bottom,z1],[x1,top,z1],[x0,top,z1]],color);
    face([[x1,bottom,z1],[x1,bottom,z0],[x1,top,z0],[x1,top,z1]],color);
    face([[x1,bottom,z0],[x0,bottom,z0],[x0,top,z0],[x1,top,z0]],color);
    face([[x0,bottom,z0],[x0,bottom,z1],[x0,top,z1],[x0,top,z0]],color);
    paving(x0,z0,x1,z1,top,topColor);
  }
  function hipRoof(x,z,w,d,y,h,col) {
    const a=x-w/2,b=x+w/2,c=z-d/2,e=z+d/2;
    const inset=Math.min(w*.32,d*.46);
    const left=[a+inset,y+h,z],right=[b-inset,y+h,z];
    face([[a,y,e],[b,y,e],right,left],col);
    face([[b,y,e],[b,y,c],right],col);
    face([[b,y,c],[a,y,c],left,right],col);
    face([[a,y,c],[a,y,e],left],col);
  }
  const asphalt='#65696a', stone='#dbd3bf', darkRoof='#626664', trim='#e9e0cf';
  const plaster=['#c9a786','#dbcfb8','#c29a82','#e0c3a0','#d2c9b4','#c0b09b','#e4d8bd'];
  const roofs=['#707976','#8c7469','#6b7274','#926c58','#757e79'];
  const glazing=['#697a7a','#627170','#84908b','#9caaa1','#596b6a'];
  function house(x,z,w,d,floors,style) {
    const base=.48, h=base+2.65+floors*2.48;
    const wall=plaster[Math.floor(random()*plaster.length)];
    const roof=roofs[Math.floor(random()*roofs.length)];
    box(x,z,w,d,base,h,wall);
    box(x,z,w+.27,d+.27,base,base+.83,'#a99f8e');
    box(x,z,w+.38,d+.38,2.95,3.19,trim);
    box(x,z,w+.54,d+.54,h-.18,h+.16,trim);
    if(style===0) {
      box(x,z,w-.42,d-.42,h+.16,h+.67,wall,roof);
      box(x+w*.19,z,w*.32,d*.36,h+.68,h+1.5,'#b8b8aa',darkRoof);
    } else {
      hipRoof(x,z,w+.5,d+.5,h+.16,Math.min(d*.31,2.9),roof);
      if(w>12) for(const dx of [-w*.27,w*.27]){
        box(x+dx,z+.2,.68,.75,h+.3,h+3.35,'#b29276','#746c63');
      }
    }
    // Windows are flush planes; continuous cornices keep the elevation legible at a distance.
    for (let side=0;side<4;side++) {
      const front=side<2;
      const sign=side%2===0 ? 1 : -1;
      const length=front?w:d, depth=front?d:w;
      const bays=Math.max(2,Math.round(length/2.75));
      const surface=sign*(depth/2+.024);
      function opening(pos,y,width,height,col,extra=0) {
        const u=pos-width/2,v=pos+width/2,k=surface+sign*extra;
        if(front) face([[x+u,y,z+k],[x+v,y,z+k],[x+v,y+height,z+k],[x+u,y+height,z+k]],col,0.01);
        else face([[x+k,y,z+v],[x+k,y,z+u],[x+k,y+height,z+u],[x+k,y+height,z+v]],col,0.01);
      }
      for(let bay=0;bay<bays;bay++){
        const pos=(bay+.5)*length/bays-length/2;
        opening(pos,.83,bay===0?1.27:1.46,1.77,bay===0?'#564f44':'#72807a');
        for(let f=0;f<floors;f++){
          const y=3.56+2.48*f;
          opening(pos,y,1.05,1.48,glazing[Math.floor(random()*glazing.length)]);
          opening(pos,y-.1,1.32,.14,'#ded7c2',.035);
        }
      }
      if(front && sign===1 && style===1 && w>10) {
        const y=3.53;
        for(const k of [-1,1]) {
          const px=x+k*w*.25,pz=z+d/2+.47;
          box(px,pz,2.08,.83,y-.18,y,'#c5bda9');
          box(px,pz+.36,2.04,.08,y+.52,y+.60,'#696f64');
          for(const rail of [-.91,-.47,0,.47,.91])box(px+rail,pz+.36,.055,.07,y,y+.52,'#71766a');
        }
      }
    }
    if(style===2 && w>10) {
      const n=Math.floor(w/4);
      for(let i=0;i<n;i++){
        const px=x-w/2+(i+.5)*w/n, pz=z+d/2-1.08;
        box(px,pz,1.46,1.45,h+.55,h+1.63,trim);
        box(px,pz+.74,.86,.06,h+.75,h+1.45,'#667876');
        hipRoof(px,pz,1.75,1.65,h+1.63,.48,roof);
      }
    }
  }
  function turret(x,z,r,y) {
    const angles=Array.from({length:12},(_,k)=>k*Math.PI/6);
    const ring=(rad,h)=>angles.map(a=>[x+Math.cos(a)*rad,h,z+Math.sin(a)*rad]);
    const join=(a,b,col)=>{for(let i=0;i<a.length;i++){const j=(i+1)%a.length;face([a[j],a[i],b[i],b[j]],col);}};
    join(ring(r,1),ring(r,y),'#d3bf9f');
    join(ring(r+.12,y-.36),ring(r+.12,y),'#eadfc8');
    join(ring(r+.22,y),ring(r*.88,y+.7),'#778780');
    join(ring(r*.88,y+.7),ring(r*.62,y+2.08),'#7a9187');
    join(ring(r*.62,y+2.08),ring(r*.16,y+2.83),'#86988d');
    box(x,z,.12,.12,y+2.8,y+3.65,'#666b5c');
    for(const a of angles.filter((_,i)=>i%2===0)) {
      const rad=r+.02, dx=-Math.sin(a)*.32,dz=Math.cos(a)*.32;
      const px=x+Math.cos(a)*rad,pz=z+Math.sin(a)*rad;
      face([[px-dx,y-2.3,pz-dz],[px+dx,y-2.3,pz+dz],[px+dx,y-.79,pz+dz],[px-dx,y-.79,pz-dz]],'#7e8b82',.01);
    }
  }
  function awning(x,z,width) {
    const count=Math.ceil(width/.55);
    for(let i=0;i<count;i++){
      const a=x-width/2+i*width/count,b=a+width/count;
      const tone=i%2?'#e0d0ae':'#845b4c';
      face([[a,2.68,z+1.3],[b,2.68,z+1.3],[b,3.15,z],[a,3.15,z]],tone);
      face([[a,2.48,z+1.3],[b,2.48,z+1.3],[b,2.68,z+1.3],[a,2.68,z+1.3]],tone);
    }
  }
  function crown(x,y,z,rx,ry,rz,col) {
    const slices=7, offset=random()*Math.PI;
    const radii=[0,.74,1,.77,0], elev=[-1,-.56,0,.58,1];
    const rings=radii.map((r,i)=>Array.from({length:slices},(_,j)=>{
      const a=offset+j*2*Math.PI/slices+(i%2)*.21;
      const jitter=1+(random()-.5)*.16;
      return [x+Math.cos(a)*rx*r*jitter,y+ry*elev[i],z+Math.sin(a)*rz*r*jitter];
    }));
    for(let i=0;i<4;i++)for(let j=0;j<slices;j++){
      const k=(j+1)%slices;
      if(i===0)face([rings[i][j],rings[i+1][j],rings[i+1][k]],col);
      else if(i===3)face([rings[i][j],rings[i+1][j],rings[i][k]],col);
      else face([rings[i][j],rings[i+1][j],rings[i+1][k],rings[i][k]],col);
    }
  }
  function tree(x,z,size=1) {
    const palette=['#8e9c73','#80926d','#a2ac7e','#7b8f6b','#96a276'];
    box(x,z,.35*size,.37*size,.4,3.3*size,'#837662');
    const color=palette[Math.floor(random()*palette.length)];
    crown(x,3.85*size,z,2.04*size,2.66*size,1.94*size,color);
    crown(x+.69*size,3.55*size,z+.54*size,1.47*size,1.81*size,1.45*size,color);
  }
  function streetLamp(x,z) {
    box(x,z,.15,.15,.3,3.85,'#626b62');
    box(x,z,.76,.65,3.84,4.02,'#746e60','#d6cbb3');
  }
  function zebra(x,z,alongX) {
    for(let i=-3;i<=3;i++) {
      if(alongX)paving(x-1.2,z+i*.88-.21,x+1.2,z+i*.88+.21,.19,'#d6d4c5');
      else paving(x+i*.88-.21,z-1.2,x+i*.88+.21,z+1.2,.19,'#d6d4c5');
    }
  }
  function bench(x,z) {
    box(x-.68,z,.19,.58,.72,1.08,'#686e61');box(x+.68,z,.19,.58,.72,1.08,'#686e61');
    box(x,z,2.05,.62,1.08,1.21,'#a48864');box(x,z+.22,2.05,.14,1.21,1.62,'#9c805d');
  }

  // The river follows the southern edge of the teaching district.
  paving(-190,-165,190,37,.02,'#abae93');
  paving(-190,36.9,190,134,-1.55,'#7caaa6',2);
  paving(-190,132,190,163,.1,'#94a289');
  box(0,36.2,380,2.05,-1.75,.68,'#a6a799',stone);
  paving(-190,29.65,190,35.45,.52,'#d3cbb8');
  for(let x=-122;x<124;x+=5) {
    box(x,36.78,.2,.2,.7,1.62,'#777f75');
    box(x+2.5,36.78,5,.10,1.51,1.61,'#76837a');
  }
  for(let x=-95;x<111;x+=12){tree(x,32.4,.74+random()*.1);streetLamp(x+3,34.2);}
  for(let x=-75;x<90;x+=18)bench(x,34.1);
  const roadsX=[-90,-52,5,56,94], roadsZ=[-80,-43,-4,25];
  function near(value,list,r){return list.some(p=>Math.abs(p-value)<r);}
  for(const z of roadsZ) {
    paving(-155,z-4.2,155,z+4.2,.12,asphalt);
    for(let x=-150;x<150;x+=5.7)if(!near(x,roadsX,5.7))
      paving(x,z-.07,x+2.45,z+.07,.18,'#cfccbb');
  }
  for(const x of roadsX) {
    paving(x-3.8,-132,x+3.8,29.2,.14,asphalt);
    for(let z=-128;z<22;z+=5.3)if(!near(z,roadsZ,5.7))
      paving(x-.07,z,x+.07,z+2.15,.18,'#cfcbbc');
  }
  zebra(-1.6,-4,true);zebra(5,2.7,false);zebra(11.5,-4,true);zebra(5,-10.65,false);
  zebra(-45.6,25,true);zebra(49.5,25,true);
  for(const [x,z] of [[.3,.8],[9.7,-8.8]]) {
    box(x,z,.22,.22,.15,3.1,'#636961');box(x,z,.45,.48,2.77,3.42,'#3e4d48');
    box(x,z+.25,.23,.06,3.08,3.31,'#d49b6b');
  }
  // An internal courtyard lane and the kerbside bays at the final stop.
  paving(-31.8,-29,-26.4,-7.85,.55,'#93948a');
  for(let x=23;x<51;x+=4) {
    paving(x,28.45,x+.13,31.08,.6,'#e6deca');
  }
  const rows=[[-117,-80],[-80,-43],[-43,-4],[-4,25]];
  const cols=[[-128,-90],[-90,-52],[-52,5],[5,56],[56,94],[94,129]];
  for(const [x0,x1] of cols)for(const [z0,z1] of rows) {
    const left=x0+4.02,right=x1-4.02,back=z0+4.45,front=z1-4.45;
    box((left+right)/2,(back+front)/2,right-left,front-back,.12,.45,'#b8b6a7','#d0c9b7');
    paving(left+1.55,back+1.5,right-1.55,front-1.5,.48,'#adb392');
    const key=x0===-52&&z0===-43;
    if(key) {
      house(-41,-22,9.8,14.5,3,2);house(-24,-31.1,20,7.1,3,1);
      house(-10.4,-22.4,10.4,17.4,3,0);
      paving(-31.8,-28,-26.4,-7.85,.58,'#999a8d');
      tree(-33.8,-13,.74);tree(-20,-15,.83);bench(-21,-22);
    } else {
      const width=right-left,depth=front-back;
      const n=width>42?3:2;
      for(let i=0;i<n;i++) {
        const bay=(width-3)/n, px=left+1.5+(i+.5)*bay;
        const w=bay-1.5-random()*1.3, d=Math.min(depth*.57,8+random()*2.7);
        const frontRow=z0===-4;
        if(frontRow && x0===-52 && i===1) {
          const gardenZ=back+9;
          paving(px-bay*.44,back+1,px+bay*.44,front-1,.51,'#c5c7a3');
          paving(px-.74,back+1,px+.74,front-1,.53,'#d6c8ad');
          paving(px-bay*.43,gardenZ-.7,px+bay*.43,gardenZ+.7,.53,'#d6c8ad');
          const circle=(r,y)=>Array.from({length:24},(_,j)=>[px+Math.cos(j*Math.PI/12)*r,y,gardenZ+Math.sin(j*Math.PI/12)*r]);
          face(circle(2.80,.56),'#c0b69e'); face(circle(2.36,.79),'#e0d6bf');face(circle(1.96,.81),'#88aaa0',2);
          box(px,gardenZ,.65,.65,.81,1.62,'#d6cbb2');
          face(circle(.81,1.62),'#c9c0a7');bench(px-3,gardenZ+2.6);bench(px+3,gardenZ+2.6);
          tree(px-4.6,back+2,.64);tree(px+4.9,front-3,.72);
        } else if(frontRow && x0===-52 && i===2) {
          house(px,back+5.8+d/2,w*.84,d*.74,1,2);
          awning(px,back+5.8+d/2+d*.37,w*.61);
        } else {
          house(px,back+2+d/2,w,d,frontRow?1+Math.floor(random()*2):2+Math.floor(random()*3),Math.floor(random()*3));
        }
        if(depth>25 && !frontRow && i!==1) {
          house(px,front-5.3,w*.87,7.6,2+Math.floor(random()*2),Math.floor(random()*3));
        } else tree(px+(random()-.5)*2.4,front-3,.74+random()*.25);
      }
    }
    if(z0===-4 || z0===-43) streetLamp(right-1,front-.65);
  }
  turret(-14.5,-14.6,1.88,11.15);
  turret(16,-32.25,1.62,9.45);
  for(const x of [-38,-21,-4,17,34]) {
    // Place small cafe terraces on the riverside pavement.
    if(x===-4||x===-38)continue;
    for(const shift of [-1.45,1.45]){
      const px=x+shift,pz=33.75;
      box(px,pz,.14,.14,.53,1.19,'#75715e');
      box(px,pz,.92,.76,1.19,1.29,'#dbcaab');
      box(px-.66,pz,.32,.38,.53,1.04,'#987e5f');
    }
  }
  awning(-40,-14.72,6.2);awning(-9.8,-13.66,6.3);
  // A glazed pavilion and timber pergola articulate the public quay.
  box(-3,32.25,6.6,2.55,.53,2.85,'#8b9c93');
  for(const dx of [-3.15,-1.60,0,1.60,3.15])box(-3+dx,33.54,.16,.16,.53,2.94,'#ded0b3');
  box(-3,32.25,7.35,3.15,2.91,3.15,'#897e69','#cebda2');
  // Three concrete arches connect the district to the opposite bank.
  function bridge(x) {
    const half=4.1, level=4.3, start=35, span=18.0;
    for(let arch=0;arch<6;arch++) {
      const origin=start+arch*span;
      for(let i=0;i<12;i++) {
        const f=i/12,t=(i+1)/12,za=origin+span*f,zb=origin+span*t;
        const archY=v=>-1.9+4.65*Math.sqrt(Math.max(0,1-((v-.5)/.48)**2));
        const ya=archY(f),yb=archY(t);
        face([[x-half,ya,za],[x-half,yb,zb],[x-half,level,zb],[x-half,level,za]],'#cbbea5');
        face([[x+half,yb,zb],[x+half,ya,za],[x+half,level,za],[x+half,level,zb]],'#cbbea5');
        face([[x-half,ya,za],[x+half,ya,za],[x+half,yb,zb],[x-half,yb,zb]],'#9c9d8d');
      }
    }
    box(x,87.7,8.8,106,-.1+level,level+.28,'#c5b9a2',asphalt);
    for(const side of [-1,1])box(x+side*4.36,87.7,.27,106,level+.28,level+1.0,'#cbbda4');
    for(let i=0;i<6;i++)streetLamp(x+3.5,38+18*i);
    for(let z=35;z<141;z+=5.4)paving(x-.08,z,x+.08,z+2.2,level+.31,'#e0d8c0');
    // Grade the road up from the junction.
    face([[x-half,.17,28.9],[x-half,level+.29,35],[x+half,level+.29,35],[x+half,.17,28.9]],asphalt);
  }
  bridge(56);
  // Short pontoons and mooring posts between the promenade and the river.
  for(const x of [-59,20]) {
    box(x,40.4,2.35,7.3,-.48,-.16,'#8e7d66','#ae9677');
    box(x+3.4,43.5,9.1,1.8,-.49,-.13,'#97816b','#c0a58a');
  }
  const stops=[[-29.15,-17.4],[5,-3.05],[38.58,29.75]];
  const route=[stops[0],[-29.15,-5.35],[-28.55,-3.8],[-26.7,-3.05],[3.3,-3.05],
    [5,-3.05],[6.1,-2.45],[6.67,-.8],[6.67,22.6],[7.45,24.12],[9.2,25.85],
    [37.2,25.85],[38.58,26.8],stops[2]];
  const lineHeight=.665;
  function ribbon(points,width,color,height) {
    for(let i=1;i<points.length;i++){
      const [ax,az]=points[i-1],[bx,bz]=points[i];
      const length=Math.hypot(bx-ax,bz-az), nx=(bz-az)/length*width/2,nz=(ax-bx)/length*width/2;
      face([[ax+nx,height,az+nz],[bx+nx,height,bz+nz],[bx-nx,height,bz-nz],[ax-nx,height,az-nz]],color,1);
    }
    for(const [x,z] of points) {
      const ring=Array.from({length:10},(_,j)=>[x+Math.cos(j*.6283)*width/2,height+.001,z+Math.sin(j*.6283)*width/2]);
      face(ring,color,1);
    }
  }
  ribbon(route,1.20,'#f2dcc0',lineHeight);
  ribbon(route,.73,'#a64a48',lineHeight+.03);
  for(const [x,z] of stops) {
    const disk=(r,h,col)=>face(Array.from({length:32},(_,j)=>[x+r*Math.cos(j*Math.PI/16),h,z+r*Math.sin(j*Math.PI/16)]),col,1);
    disk(1.24,.71,'#f1ddc4');disk(.84,.72,'#94403e');
  }
  const city=new Float32Array(vertices);
  function model(draw) {target=[];draw();const v=new Float32Array(target);target=vertices;return v;}
  function car(color) {
    return model(()=>{
      box(0,0,1.72,3.92,.15,.33,'#424a48');
      box(0,.03,1.86,3.92,.32,.87,color);
      box(0,-.16,1.53,2.04,.87,1.39,'#657778',color);
      box(0,-.18,1.48,1.19,1.39,1.45,color);
      for(const side of [-1,1])for(const end of [-1,1]){
        box(side*.89,end*1.18,.19,.65,.08,.51,'#3b4543');
        box(side*.59,end*1.97,.39,.06,.53,.73,end>0?'#e6dbab':'#944a46');
      }
    });
  }
  const ferry=model(()=>{
    box(0,0,2.65,8.6,-.12,.48,'#a89176','#ded6bf');
    box(0,-.4,1.97,4.66,.48,1.49,'#657c7b','#e6ddbf');
    face([[-1.05,-.04,-4.2],[-1.36,-.04,-4.1],[-2.25,-.04,-8.7]],'#c9d9c8',1);
    face([[1.05,-.04,-4.2],[1.36,-.04,-4.1],[2.25,-.04,-8.7]],'#c9d9c8',1);
    box(0,-1.65,1.98,.22,.5,1.02,'#d4c4a6');
    for(const x of [-.7,0,.7])box(x,2.72,.39,.78,.48,.76,'#b88a69');
  });
  return {city,stops,route,cars:['#9c4244','#b9b9aa','#677e83','#cdab7d'].map(car),ferry};
}

function viewMatrix(cx,cz,yaw,pitch,width,aspect) {
  const cs=Math.cos(yaw),sn=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  const sx=2/width,sy=sx*aspect,sz=-1/260;
  return new Float32Array([
    cs*sx,-sp*sn*sy,cp*sn*sz,0, 0,cp*sy,sp*sz,0,
    -sn*sx,-sp*cs*sy,cp*cs*sz,0,
    (-cs*cx+sn*cz)*sx,(sn*cx+cs*cz)*sp*sy,-(sn*cx+cs*cz)*cp*sz,1
  ]);
}
const sunlight=viewMatrix(0,-4,-.975,.88,310,1.0);
const overview={x:8,z:10,yaw:-.46,pitch:.70,zoom:1};
function sceneWidth(aspect,zoom) { return Math.max(112,70*aspect)/zoom; }
function pathSample(points,distance) {
  let total=0;
  const lengths=[];
  for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];const l=Math.hypot(b[0]-a[0],b[1]-a[1]);lengths.push(l);total+=l;}
  let t=((distance%total)+total)%total;
  for(let i=0;i<lengths.length;i++){
    if(t<=lengths[i]||i===lengths.length-1){
      const a=points[i],b=points[i+1],u=t/lengths[i];
      return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,Math.atan2(b[0]-a[0],b[1]-a[1])];
    }
    t-=lengths[i];
  }
}
function vehicles(scene,seconds) {
  // Let the school car wait at the kerb before starting the lesson again.
  const routeLength=scene.route.slice(1).reduce((n,b,i)=>n+Math.hypot(b[0]-scene.route[i][0],b[1]-scene.route[i][1]),0);
  const travel=(seconds*2.1+4)%(routeLength+9);
  const school=travel<routeLength?pathSample(scene.route,travel):[...scene.stops[2],0];
  const street=(v,a,b)=>a+(((v-a)%(b-a))+(b-a))%(b-a);
  return [
    [scene.cars[0],school[0],.77,school[1],school[2]],
    [scene.cars[1],street(seconds*2.9-13,-120,120),.2,-5.85,Math.PI/2],
    [scene.cars[2],street(34-seconds*3.6,-120,120),.2,-41.5,-Math.PI/2],
    [scene.cars[3],-53.65,.2,street(12-seconds*2.1,-108,21),Math.PI],
    [scene.cars[1],21.2,.61,29.65,.15],[scene.cars[2],46.8,.61,29.65,.11],
    [scene.cars[3],-14.5,.18,23.25,-Math.PI/2],
    [scene.ferry,street(12+seconds*1.35,-125,125),-1.44,48.8,Math.PI/2]
  ];
}

function createRenderer(canvas,scene) {
  const gl=canvas.getContext('webgl',{alpha:false,antialias:true,preserveDrawingBuffer:false,powerPreference:'low-power'});
  if(!gl) return null;
  function shader(type,source) {
    const s=gl.createShader(type); gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;
  }
  function program(vertex,fragment) {
    const p=gl.createProgram();const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
    gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;
  }
  const depthProgram=program(
    'attribute vec3 aPos; uniform mat4 uSun; void main(){gl_Position=uSun*vec4(aPos,1.);}',
    'precision highp float; void main(){float d=gl_FragCoord.z;gl_FragColor=vec4(floor(d*255.)/255., fract(d*255.),0.,1.);}'
  );
  const paint=program(`
    attribute vec3 aPos,aColor;attribute float aKind;
    uniform mat4 uView,uSun;uniform vec3 uOffset;uniform vec2 uTurn;
    varying vec3 vColor,vShadow,vWorld;varying float vKind;
    void main(){
      vec3 world=vec3(dot(aPos.xz,uTurn),aPos.y,dot(aPos.xz,vec2(-uTurn.y,uTurn.x)))+uOffset;
      vWorld=world;vColor=aColor;vKind=aKind;
      vShadow=(uSun*vec4(world,1.)).xyz*.5+.5;
      gl_Position=uView*vec4(world,1.);
    }`,`
    precision highp float;
    varying vec3 vColor,vShadow,vWorld;varying float vKind;
    uniform sampler2D uDepth;uniform float uTexel,uTime;
    void main(){
      float shade=0.;
      if(uTexel>0. && vShadow.x>0. && vShadow.x<1. && vShadow.y>0. && vShadow.y<1.){
        for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){
          vec2 d=texture2D(uDepth,vShadow.xy+vec2(float(x),float(y))*uTexel).rg;
          shade+=step(d.x+d.y/255.+.0012,vShadow.z);
        }
      }
      vec3 col=mix(vColor,vColor*.75+vec3(.011,.015,.019),shade/9.);
      if(vKind>1.5){
        float t=uTime*.46;
        float wave=sin(vWorld.z*3.2+vWorld.x*.21+t+1.32*sin(vWorld.x*.53+vWorld.z*.33-t*.66));
        col+=pow(max(wave,0.),12.)*.040+sin(vWorld.z*.67+t*.5)*.010;
      }
      gl_FragColor=vec4(col,1.);
    }`);
  const positions=gl.getAttribLocation(depthProgram,'aPos');
  const loc=Object.fromEntries(['aPos','aColor','aKind'].map(n=>[n,gl.getAttribLocation(paint,n)]));
  const uniforms=Object.fromEntries(['uView','uSun','uOffset','uTurn','uTime','uDepth','uTexel'].map(n=>[n,gl.getUniformLocation(paint,n)]));
  const buffers=new Map();
  for(const data of [scene.city,...scene.cars,scene.ferry]){
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);buffers.set(data,buffer);
  }
  const shadowSize=Math.min(1024,gl.getParameter(gl.MAX_TEXTURE_SIZE),gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,shadowSize,shadowSize,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  for(const k of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,k,gl.NEAREST);
  for(const k of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE);
  const fb=gl.createFramebuffer(),depth=gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER,depth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,shadowSize,shadowSize);
  gl.bindFramebuffer(gl.FRAMEBUFFER,fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depth);
  const hasShadow=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  if(hasShadow){
    gl.useProgram(depthProgram);gl.viewport(0,0,shadowSize,shadowSize);
    gl.clearColor(1,1,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(gl.getUniformLocation(depthProgram,'uSun'),false,sunlight);
    gl.bindBuffer(gl.ARRAY_BUFFER,buffers.get(scene.city));
    gl.enableVertexAttribArray(positions);gl.vertexAttribPointer(positions,3,gl.FLOAT,false,28,0);
    gl.drawArrays(gl.TRIANGLES,0,scene.city.length/7);gl.disableVertexAttribArray(positions);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  gl.deleteFramebuffer(fb);gl.deleteRenderbuffer(depth);gl.deleteProgram(depthProgram);
  gl.useProgram(paint);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.uniform1i(uniforms.uDepth,0);gl.uniform1f(uniforms.uTexel,hasShadow?1/shadowSize:0);
  gl.uniformMatrix4fv(uniforms.uSun,false,sunlight);
  for(const attrib of Object.values(loc))gl.enableVertexAttribArray(attrib);
  gl.clearColor(.857,.84,.792,1);
  function mesh(data,x=0,y=0,z=0,yaw=0) {
    gl.bindBuffer(gl.ARRAY_BUFFER,buffers.get(data));
    gl.vertexAttribPointer(loc.aPos,3,gl.FLOAT,false,28,0);
    gl.vertexAttribPointer(loc.aColor,3,gl.FLOAT,false,28,12);
    gl.vertexAttribPointer(loc.aKind,1,gl.FLOAT,false,28,24);
    gl.uniform3f(uniforms.uOffset,x,y,z);gl.uniform2f(uniforms.uTurn,Math.cos(yaw),Math.sin(yaw));
    gl.drawArrays(gl.TRIANGLES,0,data.length/7);
  }
  return function draw(view,time){
    gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uniforms.uView,false,view);gl.uniform1f(uniforms.uTime,time);
    mesh(scene.city);for(const actor of vehicles(scene,time))mesh(...actor);
  };
}
// A depth-buffer renderer for browsers without a WebGL context. Reuse the
// static district between camera moves; at rest only eight small meshes change.
function createCanvasRenderer(canvas,scene) {
  const ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx)return null;
  const channel=v=>Math.max(0,Math.min(255,Math.round(v*255)));
  const rgba=(r,g,b)=>((255<<24)|(b<<16)|(g<<8)|r)>>>0;
  const background=rgba(219,214,199);
  let frame,base,baseDepth,liveDepth,output,lastView=null;
  const lightSize=512,lightDepth=new Float32Array(lightSize*lightSize).fill(2);
  const xs=new Float64Array(3),ys=new Float64Array(3),zs=new Float64Array(3);
  const lights=new Float64Array(9);
  // Both passes use the same triangle coverage and world-space depth convention.
  function raster(data,view,w,h,depth,colors,ox=0,oy=0,oz=0,yaw=0) {
    const cs=Math.cos(yaw),sn=Math.sin(yaw),halfW=w*.5,halfH=h*.5;
    for(let j=0;j<data.length;j+=21) {
      for(let k=0;k<3;k++){
        const i=j+k*7,px=data[i],pz=data[i+2];
        const x=ox+px*cs+pz*sn,y=oy+data[i+1],z=oz-px*sn+pz*cs;
        xs[k]=(view[0]*x+view[8]*z+view[12]+1)*halfW;
        ys[k]=(1-view[1]*x-view[5]*y-view[9]*z-view[13])*halfH;
        zs[k]=view[2]*x+view[6]*y+view[10]*z+view[14];
        if(colors){
          lights[k]=(sunlight[0]*x+sunlight[8]*z+sunlight[12]+1)*lightSize*.5;
          lights[3+k]=(1-sunlight[1]*x-sunlight[5]*y-sunlight[9]*z-sunlight[13])*lightSize*.5;
          lights[6+k]=sunlight[2]*x+sunlight[6]*y+sunlight[10]*z+sunlight[14];
        }
      }
      const ax=xs[0],ay=ys[0],bx=xs[1]-ax,by=ys[1]-ay,cx=xs[2]-ax,cy=ys[2]-ay;
      const det=bx*cy-by*cx;if(Math.abs(det)<.00001)continue;
      const left=Math.max(0,Math.ceil(Math.min(ax,xs[1],xs[2])-.5)),right=Math.min(w-1,Math.floor(Math.max(ax,xs[1],xs[2])-.5));
      const top=Math.max(0,Math.ceil(Math.min(ay,ys[1],ys[2])-.5)),bottom=Math.min(h-1,Math.floor(Math.max(ay,ys[1],ys[2])-.5));
      if(left>right||top>bottom)continue;
      const dxB=cy/det,dyB=-cx/det,dxC=-by/det,dyC=bx/det;
      const startB=(left+.5-ax)*dxB+(top+.5-ay)*dyB, startC=(left+.5-ax)*dxC+(top+.5-ay)*dyC;
      const db=zs[1]-zs[0],dc=zs[2]-zs[0];
      const r=data[j+3],g=data[j+4],b=data[j+5];
      const lit=colors?rgba(channel(r),channel(g),channel(b)):0;
      const shade=colors?rgba(channel(r*.77+.011),channel(g*.77+.015),channel(b*.77+.019)):0;
      for(let row=top;row<=bottom;row++){
        let u=startB+(row-top)*dyB,v=startC+(row-top)*dyC;
        let index=row*w+left;
        for(let col=left;col<=right;col++,index++,u+=dxB,v+=dxC){
          if(u<-.000001||v<-.000001||u+v>1.000001)continue;
          const d=zs[0]+db*u+dc*v;
          if(d>depth[index]+.00000015)continue;
          depth[index]=d;
          if(!colors)continue;
          const lx=(lights[0]+u*(lights[1]-lights[0])+v*(lights[2]-lights[0]))|0;
          const ly=(lights[3]+u*(lights[4]-lights[3])+v*(lights[5]-lights[3]))|0;
          const lz=lights[6]+u*(lights[7]-lights[6])+v*(lights[8]-lights[6]);
          colors[index]=lx>=0&&ly>=0&&lx<lightSize&&ly<lightSize&&lightDepth[ly*lightSize+lx]+.0034<lz?shade:lit;
        }
      }
    }
  }
  raster(scene.city,sunlight,lightSize,lightSize,lightDepth,null);
  return function draw(view,time) {
    const w=canvas.width,h=canvas.height;
    if(!frame||frame.width!==w||frame.height!==h){
      frame=ctx.createImageData(w,h);output=new Uint32Array(frame.data.buffer);
      base=new Uint32Array(w*h);baseDepth=new Float32Array(w*h);liveDepth=new Float32Array(w*h);lastView=null;
    }
    if(!lastView||view.some((value,i)=>Math.abs(lastView[i]-value)>.0000003)){
      base.fill(background);baseDepth.fill(2);raster(scene.city,view,w,h,baseDepth,base);lastView=view.slice();
    }
    output.set(base);liveDepth.set(baseDepth);
    for(const [data,x,y,z,yaw] of vehicles(scene,time))raster(data,view,w,h,liveDepth,output,x,y,z,yaw);
    ctx.putImageData(frame,0,0);
  };
}
export function mountCity(atlas,onReady) {
  const canvas=atlas.querySelector('canvas'), pins=Array.from(atlas.querySelectorAll('.journey__pin'));
  const controls=atlas.querySelector('.city-tools'), pause=controls.querySelector('[data-pause]');
  const motion=matchMedia('(prefers-reduced-motion: reduce)'), scene=buildDistrict();
  const presets=[{x:-1,z:5,yaw:-.36,pitch:.66,zoom:1.055},{x:5,z:5,yaw:-.18,pitch:.83,zoom:1.07},{x:8,z:12,yaw:-.56,pitch:.67,zoom:1.065}];
  let camera={...overview},goal={...overview},draw=null,visible=false,frame=0,time=0,previous=0,lastPaint=0;
  let backup=null;
  let paused=motion.matches,drag=null,width=1,height=1,manualPause=false;
  function pinPositions(matrix) {
    for(let i=0;i<pins.length;i++){
      const [x,z]=scene.stops[i];
      const px=matrix[0]*x+matrix[8]*z+matrix[12];
      const py=matrix[1]*x+matrix[5]*.76+matrix[9]*z+matrix[13];
      pins[i].style.left=(50+50*px)+'%';pins[i].style.top=(50-50*py)+'%';
    }
  }
  function posterPins(){
    const mobile=matchMedia('(max-width: 760px)').matches;
    const pw=mobile?560:850,ph=mobile?420:510,base=pw/ph,scale=Math.max(width/pw,height/ph);
    const m=viewMatrix(overview.x,overview.z,overview.yaw,overview.pitch,sceneWidth(base,1),base);
    const xScale=pw*scale/width,yScale=ph*scale/height;
    for(const i of [0,4,8,12])m[i]*=xScale;
    for(const i of [1,5,9,13])m[i]*=yScale;
    pinPositions(m);
  }
  function invalidate(){if(draw&&visible&&!document.hidden&&!frame)frame=requestAnimationFrame(tick);}
  function tick(now){
    frame=0;
    if(!visible||document.hidden||!draw)return;
    const moving=Object.keys(goal).some(k=>Math.abs(goal[k]-camera[k])>.00015);
    if(now-lastPaint<(backup?45:30)&&!motion.matches){invalidate();return;}
    const dt=previous?Math.min((now-previous)/1000,.10):0;
    previous=lastPaint=now;
    if(!paused)time+=dt;
    const factor=motion.matches?1:1-Math.exp(-6.1*dt);
    for(const key of Object.keys(goal)) camera[key]=moving?camera[key]+(goal[key]-camera[key])*factor:goal[key];
    const ratio=width/height, m=viewMatrix(camera.x,camera.z,camera.yaw,camera.pitch,sceneWidth(ratio,camera.zoom),ratio);
    // Keep the outer markers tappable even after a rotation on a narrow phone.
    const limits=scene.stops.map(([x,z])=>m[0]*x+m[8]*z+m[12]);
    const low=Math.min(...limits),high=Math.max(...limits),edge=1-48/width;
    const fit=Math.min(1,2*edge/Math.max(.01,high-low));
    for(const i of [0,1,4,5,8,9,12,13])m[i]*=fit;
    m[12]+=Math.max(0,-edge-low*fit)-Math.max(0,high*fit-edge);
    draw(m,time);pinPositions(m);
    if(!atlas.classList.contains('city-ready')){atlas.classList.add('city-ready');controls.hidden=false;onReady();}
    if(moving||!paused)invalidate();
  }
  function resize(){
    width=atlas.clientWidth||1;height=atlas.clientHeight||1;
    const density=Math.min(devicePixelRatio||1,1.75,1600/width);
    const w=Math.max(1,Math.round(width*density)),h=Math.max(1,Math.round(height*density));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    if(backup){
      const scale=Math.min(1.18,900/width,Math.sqrt(490000/(width*height)));
      const bw=Math.max(1,Math.round(width*scale)),bh=Math.max(1,Math.round(height*scale));
      if(backup.width!==bw||backup.height!==bh){backup.width=bw;backup.height=bh;}
    }
    if(!draw)posterPins();invalidate();
  }
  function updatePause(){
    pause.setAttribute('aria-pressed',String(paused));
    pause.setAttribute('aria-label',paused?'Включить движение':'Приостановить движение');
    pause.title=pause.getAttribute('aria-label');invalidate();
  }
  pause.addEventListener('click',()=>{manualPause=true;paused=!paused;updatePause();});
  motion.addEventListener('change',()=>{if(!manualPause)paused=motion.matches;updatePause();});
  const turn=delta=>{goal.yaw=Math.min(.44,Math.max(-1.16,goal.yaw+delta));invalidate();};
  controls.querySelector('[data-left]').addEventListener('click',()=>turn(-.22));
  controls.querySelector('[data-right]').addEventListener('click',()=>turn(.22));
  canvas.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0)return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw:goal.yaw,active:false};
  });
  canvas.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.active){
      if(Math.abs(dy)>9&&Math.abs(dy)>Math.abs(dx)){drag=null;return;}
      if(Math.abs(dx)<5)return;
      drag.active=true;canvas.setPointerCapture(event.pointerId);atlas.classList.add('city-turning');
    }
    goal.yaw=Math.min(.44,Math.max(-1.16,drag.yaw+dx/width*1.8));invalidate();
  });
  function release(){drag=null;atlas.classList.remove('city-turning');}
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,release);
  canvas.addEventListener('pointerleave',()=>{if(drag&&!drag.active)release();});
  function software(){
    if(backup)return;
    backup=document.createElement('canvas');
    backup.className='city-viewport';backup.setAttribute('aria-hidden','true');
    atlas.insertBefore(backup,canvas);canvas.style.opacity='0';
    draw=createCanvasRenderer(backup,scene);
  }
  function start(){
    if(backup){backup.remove();backup=null;canvas.style.removeProperty('opacity');}
    try{draw=createRenderer(canvas,scene);}catch{draw=null;}
    if(!draw)software();
    if(!draw){controls.hidden=true;atlas.classList.remove('city-ready');posterPins();return;}
    resize();invalidate();
  }
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();draw=null;controls.hidden=true;atlas.classList.remove('city-ready');
    if(frame)cancelAnimationFrame(frame);frame=0;software();resize();invalidate();
  });
  canvas.addEventListener('webglcontextrestored',start);
  atlas.addEventListener('route-select',event=>{const next=presets[event.detail];if(next){goal={...next};invalidate();}});
  new ResizeObserver(resize).observe(atlas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;previous=0;
    if(visible)invalidate();else if(frame){cancelAnimationFrame(frame);frame=0;}
  }).observe(atlas);
  document.addEventListener('visibilitychange',()=>{previous=0;invalidate();});
  updatePause();resize();start();
}
