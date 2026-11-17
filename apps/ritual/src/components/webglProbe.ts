/**
 * Capability check that must stay free of Three.js.
 * The scene chunk is imported only after this returns true.
 */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|swrast|microsoft basic render|software rasterizer/i;

export function isSoftwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  if (!info) return false;
  const vendor = String(gl.getParameter(info.UNMASKED_VENDOR_WEBGL) ?? '');
  const renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? '');
  return SOFTWARE_RENDERER.test(`${vendor} ${renderer}`);
}

function release(canvas: HTMLCanvasElement, gl: WebGLRenderingContext | WebGL2RenderingContext) {
  canvas.addEventListener('webglcontextlost', (event) => event.preventDefault(), { once: true });
  gl.getExtension('WEBGL_lose_context')?.loseContext();
}

export function canMountWebGLScene(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      failIfMajorPerformanceCaveat: true,
      powerPreference: 'low-power',
    });
    if (!gl) return false;
    const software = isSoftwareRenderer(gl);
    release(canvas, gl);
    return !software;
  } catch {
    return false;
  }
}
