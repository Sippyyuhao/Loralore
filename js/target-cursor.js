/**
 * Target Cursor Effect - Pure JavaScript Implementation
 * Based on React TargetCursor component
 */

class TargetCursor {
    constructor(options = {}) {
        this.options = {
            targetSelector: options.targetSelector || '.cursor-target',
            spinDuration: options.spinDuration || 2,
            hideDefaultCursor: options.hideDefaultCursor !== false,
            borderWidth: 3,
            cornerSize: 12,
            parallaxStrength: 0.00005
        };

        this.cursorElement = null;
        this.cornersElements = null;
        this.dotElement = null;
        this.spinAnimation = null;
        this.activeTarget = null;
        this.currentTargetMove = null;
        this.currentLeaveHandler = null;
        this.isAnimatingToTarget = false;
        this.resumeTimeout = null;
        this.originalCursor = null;

        this.init();
    }

    init() {
        // 检查是否已经存在cursor元素
        if (document.querySelector('.target-cursor-wrapper')) {
            return;
        }

        this.createCursorElement();
        this.setupEventListeners();
        this.startSpinAnimation();
    }

    createCursorElement() {
        // 创建cursor包装器
        this.cursorElement = document.createElement('div');
        this.cursorElement.className = 'target-cursor-wrapper';
        
        // 创建中心点
        this.dotElement = document.createElement('div');
        this.dotElement.className = 'target-cursor-dot';
        this.cursorElement.appendChild(this.dotElement);

        // 创建四个角
        const corners = ['tl', 'tr', 'br', 'bl'];
        corners.forEach(corner => {
            const cornerElement = document.createElement('div');
            cornerElement.className = `target-cursor-corner corner-${corner}`;
            this.cursorElement.appendChild(cornerElement);
        });

        document.body.appendChild(this.cursorElement);
        this.cornersElements = this.cursorElement.querySelectorAll('.target-cursor-corner');

        // 隐藏默认鼠标指针
        if (this.options.hideDefaultCursor) {
            this.originalCursor = document.body.style.cursor;
            document.body.style.cursor = 'none';
        }

        // 初始位置
        this.setCursorPosition(window.innerWidth / 2, window.innerHeight / 2);
    }

    setCursorPosition(x, y) {
        if (!this.cursorElement) return;
        
        this.cursorElement.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }

    moveCursor(x, y) {
        if (!this.cursorElement) return;
        
        // 使用requestAnimationFrame进行平滑动画
        if (this.moveFrame) {
            cancelAnimationFrame(this.moveFrame);
        }
        
        this.moveFrame = requestAnimationFrame(() => {
            this.setCursorPosition(x, y);
        });
    }

    startSpinAnimation() {
        if (!this.cursorElement) return;

        this.stopSpinAnimation();
        
        const spin = () => {
            if (!this.cursorElement || this.activeTarget) return;
            
            this.cursorElement.style.transition = 'transform 0.1s ease-out';
            const currentRotation = this.getCurrentRotation();
            const newRotation = currentRotation + 360;
            
            this.cursorElement.style.transform += ` rotate(${newRotation}deg)`;
            
            this.spinTimeout = setTimeout(spin, this.options.spinDuration * 1000);
        };

        this.spinTimeout = setTimeout(spin, 100);
    }

    stopSpinAnimation() {
        if (this.spinTimeout) {
            clearTimeout(this.spinTimeout);
            this.spinTimeout = null;
        }
    }

    getCurrentRotation() {
        if (!this.cursorElement) return 0;
        
        const transform = window.getComputedStyle(this.cursorElement).transform;
        if (transform === 'none') return 0;
        
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (!matrix) return 0;
        
        const values = matrix[1].split(',').map(parseFloat);
        const angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
        return angle;
    }

    setupEventListeners() {
        // 鼠标移动
        this.mouseMoveHandler = (e) => {
            this.moveCursor(e.clientX, e.clientY);
        };
        window.addEventListener('mousemove', this.mouseMoveHandler);

        // 鼠标按下/释放动画
        this.mouseDownHandler = () => {
            if (this.dotElement) {
                this.dotElement.style.transform = 'translate(-50%, -50%) scale(0.7)';
                this.dotElement.style.transition = 'transform 0.3s ease';
            }
            if (this.cursorElement) {
                this.cursorElement.style.transform += ' scale(0.9)';
            }
        };

        this.mouseUpHandler = () => {
            if (this.dotElement) {
                this.dotElement.style.transform = 'translate(-50%, -50%) scale(1)';
            }
            if (this.cursorElement) {
                this.cursorElement.style.transform = this.cursorElement.style.transform.replace(' scale(0.9)', '');
            }
        };

        window.addEventListener('mousedown', this.mouseDownHandler);
        window.addEventListener('mouseup', this.mouseUpHandler);

        // 目标元素悬停
        this.mouseOverHandler = (e) => {
            this.handleTargetEnter(e);
        };
        window.addEventListener('mouseover', this.mouseOverHandler);

        // 滚动处理
        this.scrollHandler = () => {
            if (!this.activeTarget || !this.cursorElement) return;

            const rect = this.cursorElement.getBoundingClientRect();
            const mouseX = rect.left + rect.width / 2;
            const mouseY = rect.top + rect.height / 2;

            const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
            const isStillOverTarget = elementUnderMouse && 
                (elementUnderMouse === this.activeTarget || 
                 elementUnderMouse.closest(this.options.targetSelector) === this.activeTarget);

            if (!isStillOverTarget && this.currentLeaveHandler) {
                this.currentLeaveHandler();
            }
        };
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }

    handleTargetEnter(e) {
        const directTarget = e.target;
        
        // 查找匹配的目标元素
        let target = null;
        let current = directTarget;
        while (current && current !== document.body) {
            if (current.matches(this.options.targetSelector)) {
                target = current;
                break;
            }
            current = current.parentElement;
        }

        if (!target || !this.cursorElement || !this.cornersElements) return;
        if (this.activeTarget === target) return;

        // 清理之前的目标
        if (this.activeTarget) {
            this.cleanupTarget(this.activeTarget);
        }

        if (this.resumeTimeout) {
            clearTimeout(this.resumeTimeout);
            this.resumeTimeout = null;
        }

        this.activeTarget = target;
        this.stopSpinAnimation();

        // 重置旋转
        this.cursorElement.style.transform = this.cursorElement.style.transform.replace(/rotate\([^)]*\)/g, '');

        // 更新角落位置
        this.updateCorners(target);

        // 设置目标移动监听器
        this.currentTargetMove = (ev) => {
            if (this.isAnimatingToTarget) return;
            this.updateCorners(target, ev.clientX, ev.clientY);
        };

        this.currentLeaveHandler = () => {
            this.handleTargetLeave(target);
        };

        target.addEventListener('mousemove', this.currentTargetMove);
        target.addEventListener('mouseleave', this.currentLeaveHandler);
    }

    updateCorners(target, mouseX, mouseY) {
        if (!this.cornersElements || !this.cursorElement) return;

        const rect = target.getBoundingClientRect();
        const cursorRect = this.cursorElement.getBoundingClientRect();
        
        const cursorCenterX = cursorRect.left + cursorRect.width / 2;
        const cursorCenterY = cursorRect.top + cursorRect.height / 2;

        const corners = Array.from(this.cornersElements);
        const { borderWidth, cornerSize, parallaxStrength } = this.options;

        let offsets = [
            { // top-left
                x: rect.left - cursorCenterX - borderWidth,
                y: rect.top - cursorCenterY - borderWidth
            },
            { // top-right
                x: rect.right - cursorCenterX + borderWidth - cornerSize,
                y: rect.top - cursorCenterY - borderWidth
            },
            { // bottom-right
                x: rect.right - cursorCenterX + borderWidth - cornerSize,
                y: rect.bottom - cursorCenterY + borderWidth - cornerSize
            },
            { // bottom-left
                x: rect.left - cursorCenterX - borderWidth,
                y: rect.bottom - cursorCenterY + borderWidth - cornerSize
            }
        ];

        // 视差效果
        if (mouseX !== undefined && mouseY !== undefined) {
            const targetCenterX = rect.left + rect.width / 2;
            const targetCenterY = rect.top + rect.height / 2;
            const mouseOffsetX = (mouseX - targetCenterX) * parallaxStrength;
            const mouseOffsetY = (mouseY - targetCenterY) * parallaxStrength;

            offsets.forEach(offset => {
                offset.x += mouseOffsetX;
                offset.y += mouseOffsetY;
            });
        }

        // 应用变换
        corners.forEach((corner, index) => {
            corner.style.transition = 'transform 0.2s ease-out';
            corner.style.transform = `translate(${offsets[index].x}px, ${offsets[index].y}px)`;
        });
    }

    handleTargetLeave(target) {
        this.activeTarget = null;
        this.isAnimatingToTarget = false;

        // 重置角落位置
        if (this.cornersElements) {
            const corners = Array.from(this.cornersElements);
            const { cornerSize } = this.options;
            
            const positions = [
                { x: -cornerSize * 1.5, y: -cornerSize * 1.5 }, // top-left
                { x: cornerSize * 0.5, y: -cornerSize * 1.5 },  // top-right
                { x: cornerSize * 0.5, y: cornerSize * 0.5 },   // bottom-right
                { x: -cornerSize * 1.5, y: cornerSize * 0.5 }   // bottom-left
            ];

            corners.forEach((corner, index) => {
                corner.style.transition = 'transform 0.3s ease-out';
                corner.style.transform = `translate(${positions[index].x}px, ${positions[index].y}px)`;
            });
        }

        // 恢复旋转动画
        this.resumeTimeout = setTimeout(() => {
            if (!this.activeTarget) {
                this.startSpinAnimation();
            }
            this.resumeTimeout = null;
        }, 50);

        this.cleanupTarget(target);
    }

    cleanupTarget(target) {
        if (this.currentTargetMove) {
            target.removeEventListener('mousemove', this.currentTargetMove);
        }
        if (this.currentLeaveHandler) {
            target.removeEventListener('mouseleave', this.currentLeaveHandler);
        }
        this.currentTargetMove = null;
        this.currentLeaveHandler = null;
    }

    destroy() {
        // 移除事件监听器
        if (this.mouseMoveHandler) {
            window.removeEventListener('mousemove', this.mouseMoveHandler);
        }
        if (this.mouseDownHandler) {
            window.removeEventListener('mousedown', this.mouseDownHandler);
        }
        if (this.mouseUpHandler) {
            window.removeEventListener('mouseup', this.mouseUpHandler);
        }
        if (this.mouseOverHandler) {
            window.removeEventListener('mouseover', this.mouseOverHandler);
        }
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }

        // 清理目标
        if (this.activeTarget) {
            this.cleanupTarget(this.activeTarget);
        }

        // 停止动画
        this.stopSpinAnimation();
        if (this.moveFrame) {
            cancelAnimationFrame(this.moveFrame);
        }

        // 恢复默认鼠标指针
        if (this.originalCursor !== null) {
            document.body.style.cursor = this.originalCursor;
        }

        // 移除DOM元素
        if (this.cursorElement && this.cursorElement.parentNode) {
            this.cursorElement.parentNode.removeChild(this.cursorElement);
        }

        console.log('TargetCursor destroyed');
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    // 创建全局实例
    window.targetCursor = new TargetCursor({
        targetSelector: '.cursor-target, .btn, .social-link, .nav-link, .project-card, .service-card, .template-item, .gallery-row img',
        spinDuration: 2,
        hideDefaultCursor: true
    });
});

// 导出类以供手动使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TargetCursor;
}