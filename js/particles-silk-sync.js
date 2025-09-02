/**
 * 粒子与丝绸背景颜色同步脚本
 * 让粒子效果的颜色与丝绸背景保持同步
 */

(function() {
    'use strict';
    
    // 统一的红色主题
    const unifiedRedColor = '#b23f3f';
    let particlesInstance = null;
    
    // 颜色转换函数
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // 更新粒子颜色
    function updateParticlesColor(color) {
        if (!window.pJSDom || !window.pJSDom[0]) return;
        
        const pJS = window.pJSDom[0].pJS;
        if (!pJS) return;
        
        // 更新粒子颜色
        pJS.particles.color.value = color;
        pJS.particles.line_linked.color = color;
        
        // 转换为RGB用于连线
        const rgb = hexToRgb(color);
        if (rgb) {
            pJS.particles.line_linked.color_rgb_line = rgb;
        }
        
        // 更新现有粒子的颜色
        if (pJS.particles.array) {
            pJS.particles.array.forEach(particle => {
                particle.color.value = color;
                particle.color.rgb = rgb;
            });
        }
    }
    
    // 获取统一的红色主题
    function getCurrentSilkColor() {
        return unifiedRedColor;
    }
    
    // 同步颜色（设置为统一红色）
    function syncColors() {
        updateParticlesColor(unifiedRedColor);
    }
    
    // 初始化同步
    function initSync() {
        // 等待粒子系统初始化
        const checkParticles = setInterval(() => {
            if (window.pJSDom && window.pJSDom[0]) {
                clearInterval(checkParticles);
                
                // 立即同步一次，设置为红色主题
                syncColors();
                
                console.log('粒子与丝绸背景颜色同步已启动');
            }
        }, 100);
    }
    
    // 监听丝绸背景颜色变化（如果有相关事件）
    function listenToSilkColorChanges() {
        // 如果丝绸背景提供了颜色变化事件，可以在这里监听
        if (window.__SilkBackground && window.__SilkBackground.fullPageInstance) {
            // 创建一个观察者来监听颜色变化
            const observer = new MutationObserver(() => {
                syncColors();
            });
            
            // 可以观察相关DOM变化或使用其他方式
        }
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSync);
    } else {
        initSync();
    }
    
    // 暴露API供外部调用
    window.ParticlesSilkSync = {
        updateColor: updateParticlesColor,
        syncColors: syncColors,
        getCurrentColor: getCurrentSilkColor
    };
    
})();