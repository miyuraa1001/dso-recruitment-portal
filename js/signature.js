/**
 * Module: Signature Pad (HTML5 Canvas)
 * Menangani tanda tangan digital peserta (mouse & touch screen)
 */

let sigCanvas = null;
let sigCtx = null;
let isDrawing = false;
let hasSigned = false;

function initSignature() {
  sigCanvas = document.getElementById('sig-canvas');
  if (!sigCanvas) return;

  sigCtx = sigCanvas.getContext('2d');
  sigCtx.strokeStyle = '#0f172a';
  sigCtx.lineWidth = 2.2;
  sigCtx.lineCap = 'round';
  sigCtx.lineJoin = 'round';

  const getPos = (e) => {
    const rect = sigCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (sigCanvas.width / rect.width),
      y: (clientY - rect.top) * (sigCanvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    isDrawing = true;
    hasSigned = true;
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
    if (e.type === 'touchstart') e.preventDefault();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
    if (e.type === 'touchmove') e.preventDefault();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      sigCtx.closePath();
      isDrawing = false;
    }
  };

  // Mouse Listeners
  sigCanvas.addEventListener('mousedown', startDrawing);
  sigCanvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDrawing);

  // Touch Listeners
  sigCanvas.addEventListener('touchstart', startDrawing, { passive: false });
  sigCanvas.addEventListener('touchmove', draw, { passive: false });
  window.addEventListener('touchend', stopDrawing);
}

function clearSig() {
  if (!sigCanvas || !sigCtx) return;
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  hasSigned = false;
}

function getSignatureDataUrl() {
  if (!sigCanvas || !hasSigned) return '';
  return sigCanvas.toDataURL('image/png');
}

