import { onMounted } from "vue";

const GPU_ATTRIBUTE = "data-uixy-gpu";
const IDLE_TIMEOUT_MS = 2000;
const FALLBACK_DELAY_MS = 200;

const SOFTWARE_RENDERER_PATTERN =
  /swiftshader|llvmpipe|softpipe|software|basic render/i;

let cachedResult: boolean | null = null;
let isDetectionScheduled = false;

const createWebGlContext = (): WebGLRenderingContext | null => {
  const canvas = document.createElement("canvas");
  const options = { failIfMajorPerformanceCaveat: true };

  return (canvas.getContext("webgl2", options) ??
    canvas.getContext("webgl", options)) as WebGLRenderingContext | null;
};

const getRendererName = (gl: WebGLRenderingContext): string => {
  const info = gl.getExtension("WEBGL_debug_renderer_info");

  return info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
};

const checkGpuAcceleration = (): boolean => {
  try {
    const gl = createWebGlContext();

    if (!gl) return false;

    const isHardwareRenderer = !SOFTWARE_RENDERER_PATTERN.test(
      getRendererName(gl),
    );

    gl.getExtension("WEBGL_lose_context")?.loseContext();

    return isHardwareRenderer;
  } catch {
    return false;
  }
};

export const detectGpuAcceleration = (): boolean => {
  if (typeof document === "undefined") return false;

  cachedResult ??= checkGpuAcceleration();

  return cachedResult;
};

const applyGpuAttribute = () => {
  const value = detectGpuAcceleration() ? "on" : "off";

  document.documentElement.setAttribute(GPU_ATTRIBUTE, value);
};

const runWhenIdle = (callback: () => void) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS });
    return;
  }

  setTimeout(callback, FALLBACK_DELAY_MS);
};

export function useGpuAcceleration() {
  onMounted(() => {
    if (
      isDetectionScheduled ||
      document.documentElement.hasAttribute(GPU_ATTRIBUTE)
    )
      return;

    isDetectionScheduled = true;
    runWhenIdle(applyGpuAttribute);
  });
}
