// The home hero's 3D room. Ported from portfolio_website/Experience: the model, its dark-theme
// lighting and the end state of its intro animation, without the intro, scroll timelines or GSAP.
// Loaded lazily by RoomHero.astro once the page is idle; the poster <img> stays underneath.
import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import roomUrl from '@/assets/room/room.glb?url';
import videoUrl from '@/assets/room/screen.mp4?url';
import stillUrl from '@/assets/room/screen-still.webp?url';

/** Height of the orthographic view in world units; sized so the room fills the square frame. */
const FRUSTUM = 4.1;
/** Drag rotates the room about its vertical axis, up to this far either way. */
const MAX_YAW = THREE.MathUtils.degToRad(5);
/** Pixels of horizontal drag that reach MAX_YAW. */
const DRAG_FULL = 120;
/** Fraction of the remaining rotation covered per 60fps frame, as in the old site's mouse lerp. */
const EASE = 0.1;
/** The monitor video starts on the frame the poster and the still show. */
const VIDEO_START = 5;

// Dark theme of Environment.ts, with the lamps on (World.enableLights).
const NIGHT = new THREE.Color(0.17254901960784313, 0.23137254901960785, 0.6862745098039216);
const NIGHT_INTENSITY = 0.78 * Math.PI;
const WINDOW_COLOR = new THREE.Color(193 / 255, 186 / 255, 232 / 255);
const WINDOW_INTENSITY = 9;

export interface RoomOptions {
  /** Play the monitor video; otherwise the monitor shows a still frame and the mp4 isn't fetched. */
  video: boolean;
}

/** Builds the scene into `canvas`, wires drag rotation on `frame`, and resolves after the first frame. */
export async function mountRoom(frame: HTMLElement, canvas: HTMLCanvasElement, opts: RoomOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.debug.checkShaderErrors = import.meta.env.DEV;
  const coarse = matchMedia('(pointer: coarse)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.5 : 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -50, 50);
  // The old site's camera after its intro, nudged right so the room sits centered in the frame.
  camera.position.set(0.25, 4, 5.5);
  camera.rotation.x = -Math.PI / 6;

  addLights(scene);
  addFloor(scene);

  // DRACOLoader bundles its own decoder (hashed under /_astro/); preload fetches it alongside the model.
  const draco = new DRACOLoader().preload();
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const [gltf, still] = await Promise.all([
    loader.loadAsync(roomUrl),
    new THREE.TextureLoader().loadAsync(stillUrl),
  ]);
  draco.dispose();
  const room = gltf.scene;
  const screen = new THREE.MeshBasicMaterial({ map: screenTexture(still) });
  setUpRoom(room, screen);
  scene.add(room);

  // Render on demand: only while the room is easing, on resize, and on new video frames.
  let yaw = 0;
  let target = 0;
  let last = 0;
  let raf = 0;
  let visible = true;
  const tick = (now: number) => {
    raf = 0;
    const delta = last ? Math.min(now - last, 100) : 1000 / 60;
    last = now;
    yaw += (target - yaw) * (1 - Math.pow(1 - EASE, delta / (1000 / 60)));
    if (Math.abs(target - yaw) < 1e-4) yaw = target;
    room.rotation.y = yaw;
    renderer.render(scene, camera);
    if (yaw !== target) requestRender();
    else last = 0;
  };
  const requestRender = () => {
    if (!raf && visible) raf = requestAnimationFrame(tick);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    const aspect = w / h;
    camera.left = (-aspect * FRUSTUM) / 2;
    camera.right = (aspect * FRUSTUM) / 2;
    camera.top = FRUSTUM / 2;
    camera.bottom = -FRUSTUM / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    requestRender();
  };
  resize();
  new ResizeObserver(resize).observe(canvas);

  // Drag by mouse or touch. `touch-action: pan-y` on the frame leaves vertical swipes to the page,
  // which then cancels the pointer and lets the room ease back.
  let startX: number | undefined;
  frame.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    startX = e.clientX;
    frame.setPointerCapture(e.pointerId);
  });
  frame.addEventListener('pointermove', (e) => {
    if (startX === undefined) return;
    target = THREE.MathUtils.clamp(((e.clientX - startX) / DRAG_FULL) * MAX_YAW, -MAX_YAW, MAX_YAW);
    requestRender();
  });
  const release = () => {
    if (startX === undefined) return;
    startX = undefined;
    target = 0;
    requestRender();
  };
  frame.addEventListener('pointerup', release);
  frame.addEventListener('pointercancel', release);

  const video = opts.video ? playVideo(screen, requestRender) : undefined;
  let isOnScreen = true;
  const sync = () => {
    visible = isOnScreen && document.visibilityState === 'visible';
    if (visible) requestRender();
    if (!video) return;
    if (visible) video.play().catch(() => {});
    else video.pause();
  };
  new IntersectionObserver(([entry]) => {
    isOnScreen = entry?.isIntersecting ?? true;
    sync();
  }).observe(frame);
  document.addEventListener('visibilitychange', sync);

  // Compile every shader before the first frame instead of stalling on it.
  await renderer.compileAsync(scene, camera);
  renderer.render(scene, camera);
}

function addLights(scene: THREE.Scene) {
  const sun = new THREE.DirectionalLight(NIGHT, NIGHT_INTENSITY);
  sun.castShadow = true;
  sun.shadow.camera.far = 20;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.normalBias = 0.01;
  sun.position.set(2, 6, 4);
  scene.add(sun, new THREE.AmbientLight(NIGHT, NIGHT_INTENSITY));

  const windowLight = new THREE.SpotLight(WINDOW_COLOR, WINDOW_INTENSITY, 2.7, Math.PI / 5, 0.9, 2);
  windowLight.position.set(1.3, 1.3, -0.7);
  windowLight.target.position.set(0.5, 0, 0);
  windowLight.castShadow = true;
  windowLight.shadow.mapSize.set(2048, 2048);
  windowLight.shadow.normalBias = 0.001;
  scene.add(windowLight, windowLight.target);
}

function addFloor(scene: THREE.Scene) {
  // Also the backdrop: it fills the whole view.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0xf7f0e1 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.31;
  floor.receiveShadow = true;
  scene.add(floor);
}

function setUpRoom(room: THREE.Group, screen: THREE.Material) {
  room.scale.setScalar(0.1);
  room.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.castShadow = true;
    object.receiveShadow = true;
    // The glass's transmission is barely visible but costs an extra scene render per frame.
    if (object.material instanceof THREE.MeshPhysicalMaterial) object.material.transmission = 0;
  });

  const lampOn = new THREE.MeshStandardMaterial({ emissive: 0xffffff, emissiveIntensity: 0.6 });
  const child = (name: string) => room.children.find((c) => c.name.toLowerCase() === name);
  for (const lamp of ['lamp1', 'lamp2_3']) {
    const mesh = child(lamp);
    if (mesh instanceof THREE.Mesh) mesh.material = lampOn;
  }
  const monitor = child('computer')?.children[1];
  if (monitor instanceof THREE.Mesh) monitor.material = screen;

  // Where the intro leaves things: helper pieces hidden, shelves and frame slid into place.
  for (const helper of ['cube', 'fake__wall', 'fake_frame']) {
    const object = child(helper);
    if (object) object.visible = false;
  }
  for (const shelf of ['shelf1', 'shelf2'])
    child(shelf)?.position.setX(-7.833316326141357).setZ(2.8565711975097656);
  child('frame')?.position.setX(8.823111534118652).setZ(-3.392366647720337);

  const lamp1 = new THREE.PointLight(0xffffff, 0.35, 1, 1);
  lamp1.position.set(10.278803825378418, 8.356810569763184, 5.399413108825684);
  const lamp2 = new THREE.PointLight(0xffffff, 0.25, 1, 1);
  lamp2.position.set(-2.903419017791748, 5.227436256408691, -0.7773137092590332);
  room.add(lamp1, lamp2);
}

/** Monitor textures match the model's UVs: not flipped, nearest filtering, no mipmaps. */
function screenTexture<T extends THREE.Texture>(texture: T): T {
  texture.flipY = false;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Streams the monitor video, keeping the still on screen until the first frame is ready. */
function playVideo(screen: THREE.MeshBasicMaterial, onFrame: () => void) {
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  video.src = `${videoUrl}#t=${VIDEO_START}`;
  const texture = screenTexture(new THREE.VideoTexture(video));
  const nextFrame = () => {
    onFrame();
    video.requestVideoFrameCallback(nextFrame);
  };
  video.addEventListener(
    'playing',
    () => {
      screen.map = texture;
      video.requestVideoFrameCallback(nextFrame);
    },
    { once: true },
  );
  return video;
}
