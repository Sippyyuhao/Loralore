// silk-bg.js
// 在页面中为指定的容器注入 silk 背景（基于 three.js ShaderMaterial）
// 使用方法：在页面包含 three.min.js 之后引入本脚本，页面加载后会自动在
// #projects、#services、#equipment 上初始化背景。也可调用 initSilkBackground(selector, options)

(function () {
  // Helper: convert #RRGGBB to normalized RGB array
  function hexToNormalizedRGB(hex) {
    hex = (hex || '#7B7481').replace('#', '');
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }

  // GLSL shaders (adapted from provided code)
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vPosition;

    uniform float uTime;
    uniform vec3  uColor;
    uniform float uSpeed;
    uniform float uScale;
    uniform float uRotation;
    uniform float uNoiseIntensity;

    const float e = 2.71828182845904523536;

    float noise(vec2 texCoord) {
      float G = e;
      vec2  r = (G * sin(G * texCoord));
      return fract(r.x * r.y * (1.0 + texCoord.x));
    }

    vec2 rotateUvs(vec2 uv, float angle) {
      float c = cos(angle);
      float s = sin(angle);
      mat2  rot = mat2(c, -s, s, c);
      return rot * uv;
    }

    void main() {
      float rnd        = noise(gl_FragCoord.xy);
      vec2  uv         = rotateUvs(vUv * uScale, uRotation);
      vec2  tex        = uv * uScale;
      float tOffset    = uSpeed * uTime;

      tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

      float pattern = 0.6 +
                      0.4 * sin(5.0 * (tex.x + tex.y +
                                       cos(3.0 * tex.x + 5.0 * tex.y) +
                                       0.02 * tOffset) +
                               sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

      vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
      col.a = 1.0;
      gl_FragColor = col;
    }
  `;

  // Initialize a silk background on a DOM element
  function initSilkBackground(container, opts) {
    if (!container) return null;
    // apply defaults
    const options = Object.assign(
      {
        speed: 5,
        scale: 1,
        color: '#7B7481',
        noiseIntensity: 1.5,
        rotation: 0,
      },
      opts || {}
    );

    // Ensure container is positioned so absolute canvas can layer behind content
    const computed = window.getComputedStyle(container);
    if (computed.position === 'static' || !computed.position) {
      container.style.position = 'relative';
    }
    container.style.overflow = 'hidden';

    // Create renderer & canvas
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0); // transparent
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.pointerEvents = 'none';

    // Insert canvas as first child so content sits above
    container.insertBefore(renderer.domElement, container.firstChild);

    // Scene / Camera
    const scene = new THREE.Scene();

    // We'll use an Orthographic camera sized to element pixel dimensions
    let width = Math.max(1, container.clientWidth);
    let height = Math.max(1, container.clientHeight);

    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      -1000,
      1000
    );
    camera.position.z = 1;

    // Plane mesh
    const geometry = new THREE.PlaneGeometry(1, 1);

    const colorArr = hexToNormalizedRGB(options.color);

    const uniforms = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Vector3(colorArr[0], colorArr[1], colorArr[2]) },
      uSpeed: { value: options.speed },
      uScale: { value: options.scale },
      uRotation: { value: options.rotation },
      uNoiseIntensity: { value: options.noiseIntensity },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // resize handler
    function resize() {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);

      // update camera
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();

      // scale mesh to match pixels (plane is 1x1 so scale to width,height)
      mesh.scale.set(width, height, 1);

      // ensure canvas CSS size correct
      renderer.domElement.style.width = width + 'px';
      renderer.domElement.style.height = height + 'px';
    }

    // animation loop
    let last = performance.now();
    let rafId = null;

    function animate(now) {
      const delta = (now - last) / 1000; // seconds
      last = now;
      uniforms.uTime.value += delta;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    // start
    resize();
    rafId = requestAnimationFrame(animate);

    // handle window/container resize
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return {
      dispose() {
        cancelAnimationFrame(rafId);
        ro.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      },
      setColor(hex) {
        const c = hexToNormalizedRGB(hex);
        uniforms.uColor.value.set(c[0], c[1], c[2]);
      },
      setSpeed(v) {
        uniforms.uSpeed.value = v;
      },
      setScale(v) {
        uniforms.uScale.value = v;
      },
      setNoiseIntensity(v) {
        uniforms.uNoiseIntensity.value = v;
      },
      setRotation(v) {
        uniforms.uRotation.value = v;
      },
    };
  }

  // Auto-init three sections on DOMContentLoaded
  function autoInit() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not found. Please include three.min.js before silk-bg.js');
      return;
    }

    // Create a single full-page silk background so the effect is continuous across sections.
    try {
      const silkInstance = initFullPageSilkBackground({
        speed: 2.5,
        scale: 1,
        color: '#b23f3fff',
        noiseIntensity: 0,
        rotation: 0.0,
      });
      
      // 设置统一红色主题
      setUnifiedRedTheme(silkInstance);
    } catch (e) {
      console.error('Failed to init full-page silk background', e);
    }
  }

  // Initialize a single full-page silk background (covers entire document body)
  function initFullPageSilkBackground(opts) {
    const options = Object.assign({
      speed: 5,
      scale: 1,
      color: '#7B7481',
      noiseIntensity: 1.2,
      rotation: 0,
    }, opts || {});

    // Create a container that covers the whole page and sits behind content
    const container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '0';
    container.style.pointerEvents = 'none';

    // insert as first child of body so page content overlays it
    document.body.insertBefore(container, document.body.firstChild);

    const instance = initSilkBackground(container, options);

    // ensure body content is above canvas
    // 不修改body的position，保持flexbox布局
    if (!document.body.style.position || document.body.style.position === 'static') {
      // 只在必要时设置relative，但保持flexbox布局
      // document.body.style.position = 'relative';
    }

    // store instance for later control
    window.__SilkBackground = window.__SilkBackground || {};
    window.__SilkBackground.fullPageInstance = instance;

    return instance;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  // 设置统一红色主题
  function setUnifiedRedTheme(silkInstance) {
    if (!silkInstance) return;
    
    const redColor = '#b23f3f'; // 统一的红色主题
    
    // 设置丝绸背景颜色
    silkInstance.setColor(redColor);
    
    // 通知粒子系统使用相同颜色
    if (window.ParticlesSilkSync) {
      window.ParticlesSilkSync.updateColor(redColor);
    }
  }

  // expose API
  window.__SilkBackground = {
    init: initSilkBackground,
    setUnifiedRedTheme: setUnifiedRedTheme,
  };
})();
