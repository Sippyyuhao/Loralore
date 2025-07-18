// Debounce function to limit how often a function gets called
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function applyFuzzyEffect(
  targetElement,
  {
    enableHover = true,
    baseIntensity = 0.18,
    hoverIntensity = 0.5,
  } = {}
) {
  if (!targetElement) {
    console.error("FuzzyText: Target element not provided.");
    return;
  }
  
  // Store original text and then hide it visually, but keep it for screen readers
  const originalText = targetElement.textContent.trim();
  targetElement.style.color = 'transparent'; 
  targetElement.style.textShadow = 'none';

  // Make the container positionable for the canvas
  const originalPosition = window.getComputedStyle(targetElement).position;
  if (originalPosition === 'static') {
      targetElement.style.position = 'relative';
  }
  
  const canvas = document.createElement("canvas");
  // Position canvas to fill the container
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none'; // Allow clicks to pass through

  targetElement.appendChild(canvas);
  
  let animationFrameId;
  let isCancelled = false;
  let isHovering = false;
  const fuzzRange = 30;

  const redraw = async () => {
    // Stop any previous animation loop
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }
    if (isCancelled) return;

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    if (isCancelled) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get current styles and dimensions from the container element
    const computedStyle = window.getComputedStyle(targetElement);
    const rect = targetElement.getBoundingClientRect();
    
    // Set canvas resolution to match its CSS-defined size
    canvas.width = rect.width;
    canvas.height = rect.height;

    const text = originalText;
    const finalFontFamily = computedStyle.fontFamily;
    const finalFontWeight = computedStyle.fontWeight;
    // We get the color from the original element before we made it transparent
    const finalColor = window.getComputedStyle(targetElement).getPropertyValue('color');
    const fontSizeStr = computedStyle.fontSize;
    const numericFontSize = parseFloat(fontSizeStr);

    // Use a temporary color for the offscreen canvas render
    const offscreenCanvasColor = "white";

    // Offscreen canvas for pre-rendering the text
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    offCtx.font = `${finalFontWeight} ${fontSizeStr} ${finalFontFamily}`;
    offCtx.textBaseline = "alphabetic";
    const metrics = offCtx.measureText(text);

    const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
    const actualRight = metrics.actualBoundingBoxRight ?? metrics.width;
    const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
    const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

    const textBoundingWidth = Math.ceil(actualLeft + actualRight);
    const tightHeight = Math.ceil(actualAscent + actualDescent);

    const extraWidthBuffer = 10;
    const offscreenWidth = textBoundingWidth + extraWidthBuffer;

    offscreen.width = offscreenWidth;
    offscreen.height = tightHeight;

    offCtx.font = `${finalFontWeight} ${fontSizeStr} ${finalFontFamily}`;
    offCtx.textBaseline = "alphabetic";
    offCtx.fillStyle = offscreenCanvasColor;
    offCtx.fillText(text, (extraWidthBuffer / 2) - actualLeft, actualAscent);

    // --- Animation Loop ---
    const run = () => {
      if (isCancelled) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const intensity = isHovering ? hoverIntensity : baseIntensity;
      
      const centeredXStart = (canvas.width - textBoundingWidth) / 2;
      const centeredYStart = (canvas.height - tightHeight) / 2;

      for (let j = 0; j < tightHeight; j++) {
        const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
        ctx.drawImage(
          offscreen,
          0, j, offscreenWidth, 1,
          centeredXStart - (extraWidthBuffer / 2) + dx, centeredYStart + j, offscreenWidth, 1
        );
      }
      animationFrameId = window.requestAnimationFrame(run);
    };

    run();
  };
  
  // --- Event Handlers ---
  const handleHover = (hoverState) => {
      if (!enableHover) return;
      isHovering = hoverState;
  }

  targetElement.addEventListener("mouseenter", () => handleHover(true));
  targetElement.addEventListener("mouseleave", () => handleHover(false));
  targetElement.addEventListener("touchstart", () => handleHover(true), { passive: true });
  targetElement.addEventListener("touchend", () => handleHover(false));
  
  // Debounced redraw on window resize
  const debouncedRedraw = debounce(redraw, 100);
  window.addEventListener('resize', debouncedRedraw);

  // Initial draw
  redraw().catch(console.error);

  // Return a cleanup function to restore the element
  return () => {
    isCancelled = true;
    window.cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', debouncedRedraw);
    if(targetElement && canvas.parentNode === targetElement) {
        targetElement.removeChild(canvas);
    }
    // Restore original styles
    targetElement.style.color = '';
    targetElement.style.textShadow = '';
    if (originalPosition === 'static') {
        targetElement.style.position = '';
    }
  };
} 