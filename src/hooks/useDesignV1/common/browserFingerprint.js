export default class BrowserFingerprint {

  // 唯一标识key
  #identificationKey = '';

  #shortIdentificationKey = '';

  constructor() {
    this.#identificationKey = this.#sha256(this.#getBrowserFingerprint());
    this.#shortIdentificationKey = this.#identificationKey.slice(0, 16);
  }

  getIdentificationKey() {
    return this.#identificationKey;
  }

  getShortIdentificationKey() {
    return this.#shortIdentificationKey;
  }

  #getCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Browser Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Browser Fingerprint', 4, 17);
    return canvas.toDataURL();
  }

  #getWebGLFingerprint() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) { return null; }
    const extension = gl.getExtension('WEBGL_debug_renderer_info');
    if (extension) {
      const renderer = gl.getParameter(extension.UNMASKED_RENDERER_WEBGL);
      const vendor = gl.getParameter(extension.UNMASKED_VENDOR_WEBGL);
      return `${renderer} ${vendor}`;
    }
    return null;
  }

  #getPlugins() {
    const plugins = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
      plugins.push(navigator.plugins[i].name);
    }
    return plugins.join(',');
  }

  #getMimeTypes() {
    const mimeTypes = [];
    for (let i = 0; i < navigator.mimeTypes.length; i++) {
      mimeTypes.push(navigator.mimeTypes[i].type);
    }
    return mimeTypes.join(',');
  }

  #getUserAgent() { return navigator.userAgent; }

  #getTimeZone() { return Intl.DateTimeFormat().resolvedOptions().timeZone; }

  #getScreenResolution() { return `${screen.width}x${screen.height}`; }

  #getBrowserFingerprint() {
    const fingerprint = {
      canvas: this.#getCanvasFingerprint(),
      webgl: this.#getWebGLFingerprint(),
      plugins: this.#getPlugins(),
      mimeTypes: this.#getMimeTypes(),
      userAgent: this.#getUserAgent(),
      timeZone: this.#getTimeZone(),
      screenResolution: this.#getScreenResolution()
    };

    return JSON.stringify(fingerprint);
  }

  // SHA-256 实现 (简化版)
  #sha256(ascii) {
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));

    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const lengthProperty = 'length';
    let result = '';

    const words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;

    // 缓存结果是可选的 - 删除/添加斜杠
    // 初始哈希值：前8个素数2..19的平方根的小数部分的前32位
    let hash = (this.#sha256.h = this.#sha256.h || []);
    // 轮常数：前64个素数2..311的立方根的小数部分的前32位
    const k = (this.#sha256.k = this.#sha256.k || []);
    let primeCounter = k[lengthProperty];

    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += '\x80'; // 附加 '1' 位（加上零填充）
    while ((ascii[lengthProperty] % 64) - 56) { ascii += '\x00'; } // 更多零填充
    for (let i = 0; i < ascii[lengthProperty]; i++) {
      const j = ascii.charCodeAt(i);
      if (j >> 8) { return; } // ASCII 检查：只接受0-255范围内的字符
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;

    // 处理每个块
    for (let j = 0; j < words[lengthProperty];) {
      const w = words.slice(j, (j += 16)); // 消息扩展为64个字
      const oldHash = hash.slice(0);
      hash = hash.slice(0, 8);

      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];

        const a = hash[0], e = hash[4];
        const temp1 = hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] = (i < 16 ? w[i] : (
            w[i - 16] +
            (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
            w[i - 7] +
            (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0));

        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }

      for (let i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }
}
