(() => {
  const cfg = window.PUPU_RELEASE_LINKS || {};

  const icons = {
    windows: `<svg class="pupu-download-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5.2 10.7 4v7.2H3V5.2Zm8.7-1.4L21 2.4v8.8h-9.3V3.8ZM3 12.2h7.7v7.2L3 18.2v-6Zm8.7 0H21v8.8l-9.3-1.4v-7.4Z"/></svg>`,
    mac: `<svg class="pupu-download-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.8 12.7c0-2.1 1.7-3.1 1.8-3.2a4 4 0 0 0-3.1-1.7c-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.9-3.5 2.2-1.5 2.7-.4 6.7 1.1 8.8.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.2-2.4 1.2-2.5-.1 0-2.4-1-2.4-3.7ZM14.6 6.4c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.3-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.7-1.2Z"/></svg>`,
    quark: `<svg class="pupu-download-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M7.2 17.5h9.7a3.6 3.6 0 0 0 .4-7.2A5.5 5.5 0 0 0 7 9.2a4.2 4.2 0 0 0 .2 8.3Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 10.5v5m-2.5-2.5h5"/></svg>`,
    xhs: `<svg class="pupu-social-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="5" fill="#ff2442"/><path d="M6 7.1h3.1v2.2H6V7.1Zm4.5 0h3v2.2h-3V7.1Zm4.4 0H18v2.2h-3.1V7.1ZM6 10.7h12v2H6v-2Zm1 3.4h2.5v2.8H7v-2.8Zm3.8 0h2.5v2.8h-2.5v-2.8Zm3.8 0H17v2.8h-2.4v-2.8Z" fill="#fff"/></svg>`,
    weibo: `<svg class="pupu-social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="#e6162d" d="M14.7 10.1c-.6-.2-.4-.6-.2-1.1.2-.6.2-1.1-.1-1.4-.6-.7-2.3-.3-4.2.9-1.7 1.1-3.2 2.7-3.2 4.1 0 2.1 3 3.5 6.1 3.5 4 0 6.7-1.9 6.7-4.2 0-1.4-1.3-2.1-2.8-2.1-.7 0-1.4.1-2.3.3Zm-1.9 4.3c-1.9 0-3.5-.9-3.5-2 0-1 .9-1.7 2-1.9 1.8-.4 3.8.4 4.2 1.4.4 1.1-.8 2.5-2.7 2.5Z"/><circle cx="12.2" cy="12.4" r="1.1" fill="#000"/><path d="M17.2 6.8a4.3 4.3 0 0 1 3.8 3.7" fill="none" stroke="#f5a623" stroke-width="1.7" stroke-linecap="round"/><path d="M17.6 4.3a6.7 6.7 0 0 1 5.8 5.6" fill="none" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round"/></svg>`
  };

  function makeDownload(label, url, icon, wide = false) {
    const el = document.createElement(url ? 'a' : 'span');
    el.className = `pupu-download-btn${wide ? ' pupu-download-wide' : ''}${url ? '' : ' is-pending'}`;
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.setAttribute('aria-label', `下载 ${label}`);
    }
    el.innerHTML = `${icon}<span>${url ? label : `${label} · 待发布`}</span>`;
    return el;
  }

  function makeSocial(url, label, icon) {
    if (!url) return null;
    const a = document.createElement('a');
    a.className = 'pupu-social-icon-link';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', label);
    a.title = label;
    a.innerHTML = icon;
    return a;
  }

  function patchInstallGuide() {
    const steps = [...document.querySelectorAll('.step')];
    const installStep = steps.find((step) => step.querySelector('strong')?.textContent.includes('1.'));
    const launchStep = steps.find((step) => step.querySelector('strong')?.textContent.includes('2.'));
    const installText = installStep?.querySelector('p');
    const launchText = launchStep?.querySelector('p');

    if (installText) {
      installText.textContent = 'Windows：下载安装包后正常安装即可。如果出现“Windows 已保护你的电脑”或未知开发者提示，请点击“更多信息” → “仍要运行”。';
    }
    if (launchText) {
      launchText.textContent = 'macOS：打开 DMG 后先将 Pupu 拖入 Applications / 应用程序，弹出 DMG，再从 Applications 启动。版本已完成 Apple 签名与公证；不要直接在 DMG 中运行，否则自动更新无法安装。';
    }
  }

  function mountFeedback() {
    const install = document.querySelector('.install');
    if (!install || install.querySelector('.pupu-install-feedback')) return;

    const block = document.createElement('div');
    block.className = 'pupu-install-feedback';

    const label = document.createElement('span');
    label.className = 'pupu-feedback-label';
    label.textContent = '问题 / 建议 / Bug 反馈';

    const handle = document.createElement('span');
    handle.className = 'pupu-feedback-handle';
    handle.textContent = '@十一十';

    block.append(label, handle);
    const xhs = makeSocial(cfg.xiaohongshu, '小红书 @十一十', icons.xhs);
    const weibo = makeSocial(cfg.weibo, '微博 @十一十', icons.weibo);
    if (xhs) block.appendChild(xhs);
    if (weibo) block.appendChild(weibo);
    install.appendChild(block);
  }

  function findPupuCard() {
    return [...document.querySelectorAll('.card')]
      .find((item) => item.querySelector('.card-title')?.textContent.trim() === 'Pupu');
  }

  function mountDownloads() {
    const card = findPupuCard();
    if (!card || card.querySelector('.pupu-release-panel')) return;

    card.querySelector('.download-hit')?.remove();

    const panel = document.createElement('div');
    panel.className = 'pupu-release-panel';

    const label = document.createElement('p');
    label.className = 'pupu-release-label';
    label.textContent = 'Download';

    const downloads = document.createElement('div');
    downloads.className = 'pupu-download-row';
    downloads.append(
      makeDownload('Windows', cfg.windows, icons.windows),
      makeDownload('Mac', cfg.mac, icons.mac),
      makeDownload('夸克网盘', cfg.mirror, icons.quark, true)
    );

    panel.append(label, downloads);

    const body = card.querySelector('.card-body');
    if (body) body.insertAdjacentElement('afterend', panel);
    else card.appendChild(panel);
  }

  function mount() {
    patchInstallGuide();
    mountDownloads();
    mountFeedback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
