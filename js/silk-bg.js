// silk-bg.js
// 在页面中为指定的容器注入丝绸背景效果（基于 three.js ShaderMaterial）
// 使用方法：在页面包含 three.min.js 之后引入本脚本，页面加载后会自动初始化背景

console.log('开始加载 silk-bg...');

(function () {
  // 统一配置管理系统 - 这里是调整所有参数的核心位置
  const SilkConfig = {
    // 默认配置 - 修改这里可以改变全局默认值
    speed: 0.9,           // 动画速度：数值越大动画越快 (推荐范围: 0.5-5.0)
    scale: 1.0,           // 图案尺度：数值越大图案越大 (推荐范围: 0.5-2.0)
    color: [115, 32, 32],  // 主色调：RGB数组 [r, g, b] 范围0-255
    noiseIntensity: 0.2,  // 噪声强度：控制纹理粗糙程度 (推荐范围: 0.0-2.0)
    rotation: 0.2,        // 旋转角度：弧度制，控制图案旋转 (推荐范围: -0.5-0.5)
    roughness: 2.0,       // 表面粗糙度：控制表面质感 (推荐范围: 0.5-2.0)
    
    // 更新配置方法
    update(newConfig) {
      Object.assign(this, newConfig);
    },
    
    // 设置颜色 - 接受RGB数组
    setColor(r, g, b) {
      this.color = [r, g, b];
    },
    
    // 设置速度
    setSpeed(value) {
      this.speed = value;
    },
    
    // 设置尺度
    setScale(value) {
      this.scale = value;
    },
    
    // 设置噪声强度
    setNoiseIntensity(value) {
      this.noiseIntensity = value;
    },
    
    // 设置旋转
    setRotation(value) {
      this.rotation = value;
    },
    
    // 设置表面粗糙度
    setRoughness(value) {
      this.roughness = value;
    }
  };

  // GLSL着色器代码
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

    uniform float uTime;           // 时间变量
    uniform vec3  uColor;          // 颜色变量
    uniform float uSpeed;          // 速度变量
    uniform float uScale;          // 尺度变量
    uniform float uRotation;       // 旋转变量
    uniform float uNoiseIntensity; // 噪声强度变量
    uniform float uRoughness;      // 表面粗糙度变量

    const float e = 2.71828182845904523536;

    // 噪声函数
    float noise(vec2 texCoord) {
      float G = e;
      vec2  r = (G * sin(G * texCoord));
      return fract(r.x * r.y * (1.0 + texCoord.x));
    }

    // UV旋转函数
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

      // 应用表面粗糙度效果
      float roughnessEffect = 1.0 + (uRoughness - 1.0) * 0.3;
      pattern *= roughnessEffect;
      
      vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
      col.a = 1.0;
      gl_FragColor = col;
    }
  `;

  // 为DOM元素初始化丝绸背景
  function initSilkBackground(container, opts) {
    console.log('初始化丝绸背景，容器:', container);
    
    if (!container) {
      console.error('容器为空');
      return null;
    }
    
    // 使用配置
    const options = Object.assign({}, SilkConfig, opts || {});
    console.log('使用配置:', options);

    try {
      // 确保容器定位正确，使画布可以在内容后面分层
      const computed = window.getComputedStyle(container);
      if (computed.position === 'static' || !computed.position) {
        container.style.position = 'relative';
      }
      container.style.overflow = 'hidden';

      // 创建渲染器和画布
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      renderer.setClearColor(0x000000, 0); // 透明背景
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.zIndex = '0';
      renderer.domElement.style.pointerEvents = 'none';

      // 将画布插入为第一个子元素，使内容位于其上方
      container.insertBefore(renderer.domElement, container.firstChild);
      console.log('渲染器创建成功');

      // 场景和相机
      const scene = new THREE.Scene();

      // 使用正交相机，尺寸匹配元素像素尺寸
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

      // 平面网格
      const geometry = new THREE.PlaneGeometry(1, 1);

      // Uniform变量 - 这些是着色器中实际使用的参数
      const uniforms = {
        uTime: { value: 0 },
        uColor: { value: new THREE.Vector3(options.color[0]/255, options.color[1]/255, options.color[2]/255) },
        uSpeed: { value: options.speed },
        uScale: { value: options.scale },
        uRotation: { value: options.rotation },
        uNoiseIntensity: { value: options.noiseIntensity },
        uRoughness: { value: options.roughness },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      console.log('网格创建成功');

      // 窗口大小调整处理器
      function resize() {
        width = Math.max(1, container.clientWidth);
        height = Math.max(1, container.clientHeight);
        renderer.setSize(width, height, false);

        // 更新相机
        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();

        // 缩放网格以匹配像素（平面是1x1，所以缩放到宽度、高度）
        mesh.scale.set(width, height, 1);

        // 确保画布CSS尺寸正确
        renderer.domElement.style.width = width + 'px';
        renderer.domElement.style.height = height + 'px';
      }

      // 动画循环
      let last = performance.now();
      let rafId = null;

      function animate(now) {
        const delta = (now - last) / 1000; // 秒
        last = now;
        uniforms.uTime.value += delta;
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      }

      // 开始
      resize();
      rafId = requestAnimationFrame(animate);
      console.log('动画循环启动');

      // 处理窗口/容器大小调整
      const ro = new ResizeObserver(resize);
      ro.observe(container);

      // 返回实例对象
      const instance = {
        // 销毁方法
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
        
        // 更新颜色 - 接受RGB数组
        updateColor(r, g, b) {
          uniforms.uColor.value.set(r/255, g/255, b/255);
          SilkConfig.setColor(r, g, b);
        },
        
        // 更新速度
        updateSpeed(value) {
          uniforms.uSpeed.value = value;
          SilkConfig.setSpeed(value);
        },
        
        // 更新尺度
        updateScale(value) {
          uniforms.uScale.value = value;
          SilkConfig.setScale(value);
        },
        
        // 更新噪声强度
        updateNoiseIntensity(value) {
          uniforms.uNoiseIntensity.value = value;
          SilkConfig.setNoiseIntensity(value);
        },
        
        // 更新旋转
        updateRotation(value) {
          uniforms.uRotation.value = value;
          SilkConfig.setRotation(value);
        },
        
        // 更新表面粗糙度
        updateRoughness(value) {
          uniforms.uRoughness.value = value;
          SilkConfig.setRoughness(value);
        },
        
        // 批量更新属性
        updateProperties(properties) {
          if (properties.color) this.updateColor(properties.color[0], properties.color[1], properties.color[2]);
          if (properties.speed !== undefined) this.updateSpeed(properties.speed);
          if (properties.scale !== undefined) this.updateScale(properties.scale);
          if (properties.noiseIntensity !== undefined) this.updateNoiseIntensity(properties.noiseIntensity);
          if (properties.rotation !== undefined) this.updateRotation(properties.rotation);
          if (properties.roughness !== undefined) this.updateRoughness(properties.roughness);
        },
        
        // 获取当前配置
        getConfig() {
          return { ...SilkConfig };
        }
      };

      console.log('丝绸背景实例创建成功');
      return instance;

    } catch (error) {
      console.error('初始化丝绸背景失败:', error);
      return null;
    }
  }

  // 初始化单个全页面丝绸背景（覆盖整个文档主体）
  function initFullPageSilkBackground(opts) {
    console.log('初始化全页面丝绸背景');
    
    const options = Object.assign({}, SilkConfig, opts || {});

    // 创建覆盖整个页面并位于内容后面的容器
    const container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '0';
    container.style.pointerEvents = 'none';

    // 作为body的第一个子元素插入，使页面内容覆盖在其上
    document.body.insertBefore(container, document.body.firstChild);

    const instance = initSilkBackground(container, options);

    // 存储实例以供后续控制
    window.__SilkBackground = window.__SilkBackground || {};
    window.__SilkBackground.fullPageInstance = instance;

    return instance;
  }

  // 自动初始化函数
  function autoInit() {
    console.log('开始自动初始化...');
    
    if (typeof THREE === 'undefined') {
      console.error('未找到Three.js。请在silk-bg.js之前包含three.min.js');
      return;
    }
    console.log('Three.js 已加载');

    // 创建单个全页面丝绸背景，使效果在各部分之间连续
    try {
      const silkInstance = initFullPageSilkBackground();
      
      if (silkInstance) {
        console.log('全页面丝绸背景初始化成功！');
      } else {
        console.error('丝绸实例创建失败');
      }
    } catch (e) {
      console.error('初始化全页面丝绸背景失败:', e);
    }
  }

  // 暴露API
  window.__SilkBackground = {
    init: initSilkBackground,        // 初始化方法
    config: SilkConfig,              // 配置对象
  };

  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  console.log('silk-bg 加载完成');
})();

/* 
使用说明：

调整参数的方法：

1. 修改默认值：
   直接修改 SilkConfig 中的对应参数

2. 运行时调整：
   // 单个参数
   window.__SilkBackground.fullPageInstance.updateColor(255, 102, 102); // RGB值 0-255
   window.__SilkBackground.fullPageInstance.updateSpeed(3.0);
   window.__SilkBackground.fullPageInstance.updateScale(1.5);
   
   // 批量参数
   window.__SilkBackground.fullPageInstance.updateProperties({
     color: [153, 51, 204],  // 紫色
     speed: 3.0,
     scale: 1.5,
     roughness: 1.2
   });
   
   // 直接修改配置
   window.__SilkBackground.config.setColor(0.2, 0.8, 0.4); // 绿色
   window.__SilkBackground.config.setSpeed(4.0);

参数说明：
- speed (速度): 控制动画播放速度，数值越大越快
- scale (尺度): 控制图案大小，数值越大图案越大
- color (颜色): RGB数组 [r, g, b]，范围0-255，如 [255, 0, 0] 表示红色
- noiseIntensity (噪声强度): 控制纹理粗糙程度
- rotation (旋转): 弧度制角度，控制图案旋转
- roughness (表面粗糙度): 控制表面质感效果
*/