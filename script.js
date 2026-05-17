'use strict';

// ========================================
// ナビゲーション：スクロールで背景を変化
// ========================================
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// ========================================
// ハンバーガーメニュー
// ========================================
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// メニュー外をクリックしたら閉じる
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('open') && !navbar.contains(e.target)) {
    closeMenu();
  }
});

// メニュー内のリンクをクリックしたら閉じる
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-label', 'メニューを開く');
  document.body.style.overflow = '';
}


// ========================================
// スクロールフェードイン（Intersection Observer）
// ========================================
const fadeTargets = [
  ...document.querySelectorAll('.video-card'),
  ...document.querySelectorAll('.instrument-item'),
  ...document.querySelectorAll('.news-item'),
  ...document.querySelectorAll('.link-card'),
  document.querySelector('.about-text'),
  document.querySelector('.instruments'),
].filter(Boolean);

// 各要素にフェードクラスを付与
fadeTargets.forEach(el => el.classList.add('fade-in'));

// グリッド内の要素にスタッガー（時差）遅延を設定
[
  '.videos-grid',
  '.instrument-grid',
  '.links-grid',
  '.news-list',
].forEach(selector => {
  const container = document.querySelector(selector);
  if (!container) return;
  container.querySelectorAll('.fade-in').forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.07}s`;
  });
});

// 画面内に入ったらアニメーション発火
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
});

fadeTargets.forEach(el => observer.observe(el));


// ========================================
// スムーズスクロール（ナビゲーション固定分の補正）
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar.getBoundingClientRect().height;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
