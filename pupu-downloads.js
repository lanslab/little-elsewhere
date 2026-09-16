(() => {
  const cfg = window.PUPU_RELEASE_LINKS || {};

  function makeDownload(label, url, primary = false) {
    const el = document.createElement(url ? 'a' : 'span');
    el.className = `pupu-download-btn${primary ? ' primary' : ''}${url ? '' : ' is-pending'}`;
    el.textContent = url ? label : `${label} · 待发布`;
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
    return el;
  }

  function makeSocial(label, url) {
    if (!url) return null;
    const a = document.createElement('a');
    a.className = 'pupu-social-link';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = label;
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

  function mount() {
    const card = [...document.querySelectorAll('.companion-card')]
      .find((item) => item.querySelector('h3')?.textContent.trim() === 'Pupu');
    if (!card) return;

    const bio = card.querySelector('.bio');
    if (!bio || bio.querySelector('.pupu-release-panel')) {
      patchInstallGuide();
      return;
    }

    // Replace the original single Download Pupu link with platform-specific entry points.
    bio.querySelector('.download-hit')?.remove();

    const panel = document.createElement('div');
    panel.className = 'pupu-release-panel';

    const label = document.createElement('p');
    label.className = 'pupu-release-label';
    label.textContent = 'Download';

    const downloads = document.createElement('div');
    downloads.className = 'pupu-download-row';
    downloads.append(
      makeDownload('Windows', cfg.windows, true),
      makeDownload('macOS', cfg.mac),
      makeDownload('夸克网盘', cfg.mirror)
    );

    const note = document.createElement('p');
    note.className = 'pupu-release-note';
    note.textContent = 'Windows / macOS 使用 GitHub 官方发布包；国内下载较慢时可使用夸克网盘。';

    panel.append(label, downloads, note);

    const socials = [
      makeSocial('微博 · @十一十', cfg.weibo),
      makeSocial('小红书 · @十一十', cfg.xiaohongshu)
    ].filter(Boolean);

    if (socials.length) {
      const socialBlock = document.createElement('div');
      socialBlock.className = 'pupu-social-block';

      const socialLabel = document.createElement('p');
      socialLabel.className = 'pupu-release-label';
      socialLabel.textContent = '问题 / 建议 / Bug 反馈';

      const socialNote = document.createElement('p');
      socialNote.className = 'pupu-release-note pupu-feedback-note';
      socialNote.textContent = '可以在微博或小红书找到我：@十一十';

      const socialRow = document.createElement('div');
      socialRow.className = 'pupu-social-row';
      socials.forEach((item) => socialRow.appendChild(item));

      socialBlock.append(socialLabel, socialNote, socialRow);
      panel.appendChild(socialBlock);
    }

    bio.appendChild(panel);
    patchInstallGuide();
  }

  const tryMount = () => {
    mount();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryMount, { once: true });
  } else {
    tryMount();
  }

  // The generated page can hydrate after DOMContentLoaded, so retry briefly without changing the base layout.
  const observer = new MutationObserver(() => {
    const card = [...document.querySelectorAll('.companion-card')]
      .find((item) => item.querySelector('h3')?.textContent.trim() === 'Pupu');
    if (card) {
      mount();
      if (card.querySelector('.pupu-release-panel')) observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
