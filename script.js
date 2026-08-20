/**
 * CYBERSPACE // 交互引擎与特效系统
 * 包含：动态粒子、3D视差、数字雨彩蛋、打字机、极客终端、WebAudio音效合成及主题管理器
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Web Audio API 音效合成引擎 (无需依赖外部音效文件)
     ========================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.init();
    }

    init() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        // 用户首次互动时解锁 AudioContext
        const unlock = () => {
          if (!this.ctx) {
            this.ctx = new AudioContext();
          }
          if (this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
          document.removeEventListener('click', unlock);
          document.removeEventListener('keydown', unlock);
        };
        document.addEventListener('click', unlock);
        document.addEventListener('keydown', unlock);
      }
    }

    playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.04) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // 静默处理音频异常
      }
    }

    click() {
      this.playTone(880, 'sine', 0.05, 0.03);
    }

    hover() {
      this.playTone(440, 'triangle', 0.03, 0.015);
    }

    terminalEnter() {
      this.playTone(520, 'square', 0.08, 0.025);
    }

    themeSwitch() {
      if (!this.enabled || !this.ctx) return;
      [440, 554.37, 659.25].forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sine', 0.12, 0.03), idx * 60);
      });
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  }

  const sound = new SoundEngine();

  // 音效切换按钮
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      soundToggleBtn.innerHTML = isEnabled 
        ? '<i class="fa-solid fa-volume-high"></i>' 
        : '<i class="fa-solid fa-volume-xmark"></i>';
      soundToggleBtn.classList.toggle('muted', !isEnabled);
      showToast(isEnabled ? '🔊 极客音效已开启' : '🔇 极客音效已静音');
      if (isEnabled) sound.click();
    });
  }

  // 给所有按钮及交互链接添加微音效
  document.querySelectorAll('button, .btn, .nav-item, .social-icon, .filter-btn, .p-link').forEach(el => {
    el.addEventListener('mouseenter', () => sound.hover());
    el.addEventListener('click', () => sound.click());
  });

  /* ==========================================================================
     2. Canvas 动态星空与光子引力网络 (Particle Net)
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor(x, y) {
      this.x = x || Math.random() * canvas.width;
      this.y = y || Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.8;
      this.baseX = this.x;
      this.baseY = this.y;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.speedY = (Math.random() - 0.5) * 0.7;
      this.density = Math.random() * 20 + 1;
    }

    draw() {
      ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      // 基础漂移
      this.x += this.speedX;
      this.y += this.speedY;

      // 边界反弹
      if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

      // 鼠标引力与斥力物理模型
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;
          this.x -= directionX * 0.6;
          this.y -= directionY * 0.6;
        }
      }
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          let opacity = 1 - dist / 110;
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resizeCanvas();
  animateParticles();

  /* ==========================================================================
     3. Matrix 黑客帝国数字雨引擎 (彩蛋)
     ========================================================================== */
  const mCanvas = document.getElementById('matrix-canvas');
  const mCtx = mCanvas.getContext('2d');
  let mColumns, mDrops = [];
  let matrixActive = false;
  let matrixInterval = null;

  function initMatrix() {
    mCanvas.width = window.innerWidth;
    mCanvas.height = window.innerHeight;
    const fontSize = 16;
    mColumns = Math.floor(mCanvas.width / fontSize);
    mDrops = Array(mColumns).fill(1);
  }

  function drawMatrix() {
    mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);

    mCtx.fillStyle = '#00ff66';
    mCtx.font = '15px monospace';

    const chars = '0123456789ABCDEF@#$%&*+-/<>~';
    for (let i = 0; i < mDrops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      mCtx.fillText(text, i * 16, mDrops[i] * 16);

      if (mDrops[i] * 16 > mCanvas.height && Math.random() > 0.975) {
        mDrops[i] = 0;
      }
      mDrops[i]++;
    }
  }

  function toggleMatrix(forceState) {
    matrixActive = typeof forceState === 'boolean' ? forceState : !matrixActive;
    if (matrixActive) {
      initMatrix();
      mCanvas.classList.add('active');
      if (!matrixInterval) matrixInterval = setInterval(drawMatrix, 35);
      showToast('🟢 MATRIX 数字雨已启动');
    } else {
      mCanvas.classList.remove('active');
      if (matrixInterval) {
        clearInterval(matrixInterval);
        matrixInterval = null;
      }
      mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);
      showToast('⚪ MATRIX 数字雨已关闭');
    }
    return matrixActive;
  }

  window.addEventListener('resize', () => {
    if (matrixActive) initMatrix();
  });

  /* ==========================================================================
     4. 3D Tilt 卡片视差倾斜与动态反光
     ========================================================================== */
  const tiltElements = document.querySelectorAll('.tilt-element');
  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* ==========================================================================
     5. 打字机循环动画 (Typewriter)
     ========================================================================== */
  const typewriterEl = document.getElementById('typewriter');
  const titles = [
    '全栈架构师 (Full-Stack Architect)',
    'UI / UX 视觉极客 (Creative Coder)',
    '生成式 AI & Agent 开发者',
    '3D 空间图形探索者 (WebGL Enthusiast)'
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterEl.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      isDeleting = true;
      typingSpeed = 1800; // 停留时间
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }
  typeEffect();

  /* ==========================================================================
     6. 视口滚动观察器 (数字滚动 + 技能条渐进点亮)
     ========================================================================== */
  const observerOptions = { threshold: 0.25 };

  // 数字动画
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const duration = 1500;
        const step = target / (duration / 25);

        const updateCounter = () => {
          count += step;
          if (count < target) {
            counter.innerText = Math.ceil(count);
            setTimeout(updateCounter, 25);
          } else {
            counter.innerText = target;
          }
        };
        updateCounter();
        countObserver.unobserve(counter);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.counter').forEach(el => countObserver.observe(el));

  // 技能条宽度加载
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
        skillObserver.unobserve(bar);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.skill-progress-bar').forEach(el => skillObserver.observe(el));

  /* ==========================================================================
     7. 极客交互终端 (CLI Console)
     ========================================================================== */
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');

  const commandMap = {
    help: `
      <div class="t-line text-cyan">== 可用指令列表 (AVAILABLE COMMANDS) ==</div>
      <div class="t-line"><span class="text-green">about</span>     - 打印个人开发者信息与背景</div>
      <div class="t-line"><span class="text-green">skills</span>    - 打印掌握的技术栈与框架</div>
      <div class="t-line"><span class="text-green">projects</span>  - 打印精选实战项目一览</div>
      <div class="t-line"><span class="text-green">matrix</span>    - 开启/关闭全屏黑客帝国数字雨</div>
      <div class="t-line"><span class="text-green">theme [x]</span> - 切换主题 [cyber / abyss / matrix]</div>
      <div class="t-line"><span class="text-green">sound</span>     - 切换 Web Audio 交互音效</div>
      <div class="t-line"><span class="text-green">contact</span>   - 显示快捷联系方式与邮箱</div>
      <div class="t-line"><span class="text-green">date</span>      - 打印当前系统时间</div>
      <div class="t-line"><span class="text-green">clear</span>     - 清空当前控制台屏幕</div>
    `,
    about: `
      <div class="t-line text-cyan">[BIO] Alex Shen</div>
      <div class="t-line">全栈架构师 & 3D 视觉交互工程师，致力于创造具有生命力的数字化产品。</div>
    `,
    skills: `
      <div class="t-line text-cyan">[TECH STACK]</div>
      <div class="t-line">• Frontend: TypeScript, React, Next.js, Vue 3, Three.js, WebGL</div>
      <div class="t-line">• Backend: Node.js, Python, FastAPI, Go, Docker, Redis</div>
      <div class="t-line">• AI Engineering: LLM Agents, LangChain, RAG, Web Audio</div>
    `,
    projects: `
      <div class="t-line text-cyan">[FEATURED PROJECTS]</div>
      <div class="t-line">1. <b>NeuroFlow</b> - 多智能体协同工作流引擎</div>
      <div class="t-line">2. <b>CyberVerse 3D</b> - 赛博空间元宇宙沙盒</div>
      <div class="t-line">3. <b>PulseMetrics</b> - 实时微服务 APM 监控大盘</div>
      <div class="t-line">4. <b>OmniSynthetix</b> - 跨模态知识图谱挖掘器</div>
    `,
    date: () => `<div class="t-line text-muted">当前系统时间: ${new Date().toLocaleString()}</div>`,
    contact: `
      <div class="t-line text-cyan">[CONTACT]</div>
      <div class="t-line">Email: alex.shen@cyberpace.dev | 坐标: 上海 / Remote Worldwide</div>
    `,
    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    }
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawVal = terminalInput.value.trim();
        if (!rawVal) return;

        sound.terminalEnter();

        // 打印用户输入的命令行
        const userLine = document.createElement('div');
        userLine.className = 't-line';
        userLine.innerHTML = `<span class="text-green">guest@cyber-os:~$</span> ${rawVal}`;
        terminalOutput.appendChild(userLine);

        const [cmd, arg] = rawVal.toLowerCase().split(' ');

        if (cmd === 'clear') {
          commandMap.clear();
        } else if (cmd === 'matrix') {
          const state = toggleMatrix();
          const line = document.createElement('div');
          line.className = 't-line text-green';
          line.textContent = `[SYSTEM] Matrix 数字雨已${state ? '激活' : '停用'}。`;
          terminalOutput.appendChild(line);
        } else if (cmd === 'sound') {
          const isEnabled = sound.toggle();
          const line = document.createElement('div');
          line.className = 't-line text-cyan';
          line.textContent = `[SYSTEM] 音效引擎已${isEnabled ? '开启' : '关闭'}。`;
          terminalOutput.appendChild(line);
        } else if (cmd === 'theme') {
          if (['cyber', 'abyss', 'matrix'].includes(arg)) {
            setTheme(arg);
            const line = document.createElement('div');
            line.className = 't-line text-cyan';
            line.textContent = `[SYSTEM] 主题已切换至: ${arg.toUpperCase()}`;
            terminalOutput.appendChild(line);
          } else {
            const line = document.createElement('div');
            line.className = 't-line text-pink';
            line.textContent = `[ERROR] 未知主题。可选主题: cyber, abyss, matrix`;
            terminalOutput.appendChild(line);
          }
        } else if (cmd === 'sudo') {
          const line = document.createElement('div');
          line.className = 't-line text-pink';
          line.textContent = `[ACCESS DENIED] 用户 guest 不在 sudoers 列表中。此事件将被记录上报。`;
          terminalOutput.appendChild(line);
        } else if (commandMap[cmd]) {
          const out = typeof commandMap[cmd] === 'function' ? commandMap[cmd]() : commandMap[cmd];
          if (out) {
            const resultDiv = document.createElement('div');
            resultDiv.innerHTML = out;
            terminalOutput.appendChild(resultDiv);
          }
        } else {
          const errLine = document.createElement('div');
          errLine.className = 't-line text-pink';
          errLine.textContent = `zsh: command not found: ${cmd}。输入 'help' 获取所有支持的指令。`;
          terminalOutput.appendChild(errLine);
        }

        terminalInput.value = '';
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    });

    // 点击终端任意区域自动聚焦输入框
    terminalBody.addEventListener('click', () => terminalInput.focus());
  }

  // 终端最小化与最大化控制
  const termClose = document.getElementById('term-close');
  if (termClose) {
    termClose.addEventListener('click', () => {
      showToast('终端控制台已重置');
      terminalOutput.innerHTML = '<div class="t-line text-cyan">CYBER_OS Kernel v4.2.0-release (x86_64-apple-darwin)</div>';
    });
  }

  /* ==========================================================================
     8. 主题管理系统 (Theme Manager)
     ========================================================================== */
  const themeMenuBtn = document.getElementById('theme-menu-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeOptions = document.querySelectorAll('.theme-option');

  function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('cyber_theme', themeName);
    sound.themeSwitch();

    themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-set-theme') === themeName);
    });

    showToast(`🎨 界面风格已切换: ${themeName.toUpperCase()}`);
  }

  if (themeMenuBtn && themeMenu) {
    themeMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      themeMenu.classList.remove('show');
    });

    themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const chosen = opt.getAttribute('data-set-theme');
        setTheme(chosen);
        themeMenu.classList.remove('show');
      });
    });
  }

  // 读取本地存储主题
  const savedTheme = localStorage.getItem('cyber_theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }

  /* ==========================================================================
     9. 项目分类筛选 (Project Filter)
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInDown 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 项目在线演示弹窗响应
  document.querySelectorAll('.demo-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const demoName = trigger.getAttribute('data-demo');
      showToast(`🚀 [${demoName}] 演示沙盒加载中...`);
    });
  });

  /* ==========================================================================
     10. 联系表单提交交互
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>传输加密数据中...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>信号发送成功</span>';
        formFeedback.innerHTML = '<span class="text-green">✓ 讯号已成功送达！Alex 将在 24 小时内与你联络。</span>';
        showToast('✉️ 留言加密传输成功！');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>发送加密信息</span>';
          formFeedback.innerHTML = '';
        }, 4000);
      }, 1200);
    });
  }

  /* ==========================================================================
     11. 移动端菜单与导航高亮
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }

  // 滚动监听高亮导航
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  });

  /* ==========================================================================
     12. 全局 Toast 提示组件
     ========================================================================== */
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
});
