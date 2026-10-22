/**
 * SÁNG TẠO ECOPANEL - NGUYỄN THANH TUYỀN
 * JavaScript tương tác cho giao diện Trang chủ
 */

// 0. CLIENT-SIDE INCLUDE LOADER (Dành cho trường hợp chạy qua Live Server hoặc server tĩnh khác)
async function loadIncludes() {
  const includes = document.querySelectorAll('include[src]');
  if (includes.length === 0) return;

  await Promise.all(
    Array.from(includes).map(async (el) => {
      const src = el.getAttribute('src');
      try {
        const res = await fetch(src);
        if (res.ok) {
          const html = await res.text();
          const temp = document.createElement('div');
          temp.innerHTML = html;
          el.replaceWith(...temp.childNodes);
        }
      } catch (err) {
        console.warn('Lỗi load component:', src, err);
      }
    })
  );
}

document.addEventListener('DOMContentLoaded', async () => {
  // Nạp component nếu chưa được server render
  await loadIncludes();

  // Khởi tạo giao diện
  initUI();
});

function initUI() {
  // 1. HERO SLIDER LOGIC
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const btnPrev = document.querySelector('.slider-prev');
  const btnNext = document.querySelector('.slider-next');
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 5500;

  function showSlide(index) {
    slides.forEach((s) => s.classList.remove('active'));
    dots.forEach((d) => d.classList.remove('active'));

    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startSlideTimer() {
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopSlideTimer() {
    clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        stopSlideTimer();
        nextSlide();
        startSlideTimer();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        stopSlideTimer();
        prevSlide();
        startSlideTimer();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        stopSlideTimer();
        showSlide(idx);
        startSlideTimer();
      });
    });

    const heroContainer = document.querySelector('.hero-slider-container');
    if (heroContainer) {
      heroContainer.addEventListener('mouseenter', stopSlideTimer);
      heroContainer.addEventListener('mouseleave', startSlideTimer);
    }

    startSlideTimer();
  }

  // 2. STICKY HEADER & SCROLL TO TOP
  const header = document.querySelector('.header-main');
  const btnBackToTop = document.getElementById('btnBackToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header shadow on scroll
    if (header) {
      if (scrollY > 50) {
        header.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
      }
    }

    // Back to top button
    if (btnBackToTop) {
      if (scrollY > 400) {
        btnBackToTop.classList.add('show');
      } else {
        btnBackToTop.classList.remove('show');
      }
    }
  });

  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. TAB FILTER FOR PRODUCTS (PANEL SECTION)
  const productTabs = document.querySelectorAll('#panel .tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  productTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      productTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      productCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. TAB FILTER FOR PROJECTS (DỰ ÁN SECTION)
  const projectTabs = document.querySelectorAll('#du-an .tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      projectTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. LIGHTBOX MODAL FOR GALLERY (HÌNH ẢNH THỰC TẾ)
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal) {
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          if (lightboxCaption && caption) {
            lightboxCaption.textContent = caption.textContent;
          }
          lightboxModal.classList.add('active');
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
      });
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 6. QUOTATION MODAL
  const quoteModal = document.getElementById('quoteModal');
  const quoteBtns = document.querySelectorAll('.open-quote-modal');
  const quoteClose = document.getElementById('quoteModalClose');
  const quoteForm = document.getElementById('quoteForm');

  if (quoteModal) {
    quoteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        quoteModal.classList.add('active');
      });
    });

    if (quoteClose) {
      quoteClose.addEventListener('click', () => {
        quoteModal.classList.remove('active');
      });
    }

    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        quoteModal.classList.remove('active');
      }
    });

    if (quoteForm) {
      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('quoteName').value;
        const phone = document.getElementById('quotePhone').value;
        const service = document.getElementById('quoteService').value;

        alert(
          `Cảm ơn Quý khách ${name} (${phone})!\nSáng Tạo EcoPanel - Nguyễn Thanh Tuyền đã tiếp nhận yêu cầu báo giá cho dịch vụ [${service}]. Kỹ sư của chúng tôi sẽ liên hệ tư vấn trong 15 phút!`
        );
        quoteForm.reset();
        quoteModal.classList.remove('active');
      });
    }
  }

  // 7. FOOTER NEWSLETTER / CONSULTATION FORM
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = newsletterForm.querySelector('input[type="tel"]');
      if (phoneInput && phoneInput.value.trim() !== '') {
        alert(
          `Cảm ơn Quý khách! Số điện thoại ${phoneInput.value} đã được ghi nhận. Chúng tôi sẽ gửi bảng báo giá & catalogue mới nhất qua Zalo ngay!`
        );
        newsletterForm.reset();
      }
    });
  }

  // 8. MOBILE DRAWER NAVIGATION
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileBackdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileClose = document.getElementById('mobileDrawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (mobileBackdrop) mobileBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // 9. ACTIVE NAV STATE MANAGEMENT & SMOOTH SCROLLING
  const navItems = document.querySelectorAll('.header-nav .nav-item');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function setActiveNavItem(targetHref) {
    if (!targetHref) return;

    // 1. Cập nhật Menu Desktop
    navItems.forEach((item) => {
      const mainLink = item.querySelector('.nav-link');
      const subLinks = item.querySelectorAll('.dropdown-link');
      let isMatch = false;

      if (mainLink && mainLink.getAttribute('href') === targetHref) {
        isMatch = true;
      }

      subLinks.forEach((sub) => {
        if (sub.getAttribute('href') === targetHref) {
          isMatch = true;
          sub.classList.add('active');
        } else {
          sub.classList.remove('active');
        }
      });

      if (isMatch) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 2. Cập nhật Menu Di Động
    mobileNavLinks.forEach((mLink) => {
      if (mLink.getAttribute('href') === targetHref) {
        mLink.classList.add('active');
      } else {
        mLink.classList.remove('active');
      }
    });
  }

  // Xử lý sự kiện click trên các liên kết điều hướng
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          setActiveNavItem(targetId);

          const headerOffset = 85;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // 10. SCROLLSPY - TỰ ĐỘNG ĐỔI MÀU MENU KHI CUỘN ĐẾN SECTION TƯƠNG ỨNG
  const trackedSections = [
    { id: '#trang-chu', el: document.querySelector('#trang-chu') },
    { id: '#gioi-thieu', el: document.querySelector('#gioi-thieu') },
    { id: '#panel', el: document.querySelector('#panel') },
    { id: '#thi-cong', el: document.querySelector('#thi-cong') },
    { id: '#du-an', el: document.querySelector('#du-an') },
    { id: '#tin-tuc', el: document.querySelector('#tin-tuc') },
    { id: '#lien-he', el: document.querySelector('#lien-he') },
  ];

  let isScrollTimeout;
  window.addEventListener(
    'scroll',
    () => {
      if (isScrollTimeout) clearTimeout(isScrollTimeout);
      isScrollTimeout = setTimeout(() => {
        const scrollPosition = window.pageYOffset + 120;

        // Nếu ở đầu trang
        if (window.pageYOffset < 200) {
          setActiveNavItem('#trang-chu');
          return;
        }

        // Nếu chạm đáy trang (Footer)
        if (
          window.innerHeight + window.pageYOffset >=
          document.documentElement.scrollHeight - 100
        ) {
          setActiveNavItem('#lien-he');
          return;
        }

        // Kiểm tra vị trí từng section
        for (let i = trackedSections.length - 1; i >= 0; i--) {
          const sec = trackedSections[i];
          if (sec.el) {
            const top = sec.el.offsetTop - 120;
            if (scrollPosition >= top) {
              setActiveNavItem(sec.id);
              break;
            }
          }
        }
      }, 50);
    },
    { passive: true }
  );
}
