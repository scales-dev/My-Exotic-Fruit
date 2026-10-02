

/* ============================================================
   INLINE SCRIPT
   ============================================================ */

(window.dataLayer = window.dataLayer || []).push({'Username': 'b940b1'}) ;


/* ============================================================
   INLINE SCRIPT
   ============================================================ */

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'}) ;var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'' ;j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f) ;})(window,document,'script','dataLayer','GTM-KF9VMP') ;


/* ============================================================
   INLINE SCRIPT
   ============================================================ */

{"short_country_code";"GB"}


/* ============================================================
   INLINE SCRIPT
   ============================================================ */


document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu > li > a');
    const submenuItems = document.querySelectorAll('.submenu > li > a');
    const nav = document.querySelector('.mob-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navClose = document.querySelector('.nav-close');

    function addHasNext(items) {
        items.forEach(item => {
            if (item.nextElementSibling && item.nextElementSibling.tagName === "UL") {
                const hasNextEl = document.createElement('span');
                hasNextEl.classList.add('has-next');
                item.appendChild(hasNextEl);
            }
        });
    }

    function adjustNavHeight() {
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        nav.style.height = `${vh}px`;
    }

    addHasNext(menuItems);
    addHasNext(submenuItems);

    function handleClick(event, subClass, activeClass) {
        const target = event.target.classList.contains('has-next') ? event.target.parentElement : event.target;
        const submenu = target.nextElementSibling;

        if (submenu && submenu.tagName === "UL") {
            event.preventDefault(); // Prevent only if there’s a dropdown
            submenu.classList.toggle(subClass);
            target.classList.toggle(activeClass);

            // Close other open submenus
            document.querySelectorAll(`.${subClass}`).forEach(openSubmenu => {
                if (openSubmenu !== submenu) {
                    openSubmenu.classList.remove(subClass);
                    openSubmenu.previousElementSibling.classList.remove(activeClass);
                }
            });
        }
    }

    menuItems.forEach(item => {
        item.addEventListener('click', event => handleClick(event, 'menuactive', 'active'));
    });

    submenuItems.forEach(item => {
        item.addEventListener('click', event => handleClick(event, 'submenuactive', 'active'));
    });

    navToggle.addEventListener('click', () => {
        nav.classList.add('navactive');
        document.body.classList.add('no-scroll');
        adjustNavHeight();
    });

    navClose.addEventListener('click', () => {
        nav.classList.remove('navactive');
        document.body.classList.remove('no-scroll');
        adjustNavHeight();
    });

    adjustNavHeight();
    window.addEventListener('resize', adjustNavHeight);
});



/* ============================================================
   INLINE SCRIPT
   ============================================================ */



document.addEventListener('DOMContentLoaded', function () {
  // Initialises the USP slider
  new Splide('.usp-slider', {
    type: 'slide',
    perPage: 3,
    perMove: 1,
    gap: 20,
    pagination: true,
    arrows: true,
    trimSpace: false,
    rewind: true,
    autoplay: true,
    interval: 4000,
    drag: Splide.isTouch ? true : false,
    breakpoints: {
      1200: {
        perPage: 3,
      },
      992: {
        perPage: 2,
      },
      768: {
        perPage: 1,
      },
    },
  }).mount();
  
  // Initialises the category promo slider
  new Splide('.category-splider', {
    type: 'loop',
    perPage: 6,
	gap:20,
	pagination: false,
    breakpoints: {
      768: {
        perPage: 3,
      },
      480: {
        perPage: 1,
      }
    },
  }).mount();

  // Initialises the category splider boxes
  new Splide('.category-splider-boxes', {
    type: 'slide',
    perPage: 3,
    perMove: 1,
    gap: 20,
    pagination: false,
    arrows: true,
    trimSpace: false,
    rewind: true,
    autoplay: false,
    interval: 4000,
    drag: true,
    breakpoints: {
      1200: {
        perPage: 3,
      },
      992: {
        perPage: 2,
      },
      768: {
        perPage: 1,
      },
    },
  }).mount();

  new Splide('.product-splider-home', {
    type: 'slide',
    perPage: 4,
    perMove: 1,
    gap: 20,
    pagination: false,
    arrows: true,
    trimSpace: false,
    rewind: true,
    autoplay: false,
    interval: 4000,
    drag: true,
    breakpoints: {
      1200: {
        perPage: 3,
      },
      992: {
        perPage: 2,
      },
      768: {
        perPage: 2,
      },
    },
  }).mount();

  new Splide('.product-splider-special', {
    type: 'slide',
    perPage: 4,
    perMove: 1,
    gap: 20,
    pagination: false,
    arrows: true,
    trimSpace: false,
    rewind: true,
    autoplay: false,
    interval: 4000,
    drag: true,
    breakpoints: {
      1200: {
        perPage: 3,
      },
      992: {
        perPage: 2,
      },
      768: {
        perPage: 2,
      },
    },
  }).mount();

//   new Splide('.ig-splider', {
//     type: 'slide',
//     perPage: 4,
//     perMove: 1,
//     gap: 20,
//     pagination: false,
//     arrows: true,
//     trimSpace: false,
//     rewind: false,
//     autoplay: false,
//     interval: 4000,
//     drag: true,
// 	loop: false,
//     breakpoints: {
//       1200: {
//         perPage: 3,
//       },
//       992: {
//         perPage: 2,
//       },
//       768: {
//         perPage: 2,
//       },
//     },
//   }).mount();

  new Splide('.testimonials-slider', {
      type: 'slide',
      perPage: 1,
      perMove: 1,
      gap: 0,
      pagination: true,
      arrows: false,
      trimSpace: false,
      rewind: true, // Enable rewind
      autoplay: true,
      interval: 5000,
      breakpoints: {
        1200: {
          perPage: 1,
        },
        992: {
          perPage: 1,
        },
        768: {
          perPage: 1,
        },
      },
    }).mount();

});
        


/* ============================================================
   INLINE SCRIPT
   ============================================================ */


  function markSoldOutOptions() {
    const select = document.getElementById('variant_Option');
    if (!select || !window.ekmProductVariantData) return;

    const soldOutMap = new Map();

    ekmProductVariantData.forEach(group => {
      group.items.forEach(item => {
        const value = item.selector?.[0]?.value;
        const html = item.properties?.item0?.innerHTML || '';
        const availability = item.properties?.availability?.value || '';
        const isSoldOut =
          html.includes('oo-stock') ||
          html.includes('out-of-stock') ||
          availability.toLowerCase().includes('out of stock');

        if (value) {
          soldOutMap.set(value, soldOutMap.get(value) || isSoldOut);
        }
      });
    });

    const currentValue = select.value;
    const currentIsSoldOut = soldOutMap.get(currentValue);

    // If current selection is sold out, try to auto-select a valid one
    if (currentIsSoldOut) {
      const fallback = [...select.options].find(opt => !soldOutMap.get(opt.value));
      if (fallback) select.value = fallback.value;
    }

    [...select.options].forEach(option => {
      const isSoldOut = soldOutMap.get(option.value);

      if (option.value !== select.value && isSoldOut) {
        option.disabled = true;
        option.style.color = '#888';
        if (!option.textContent.includes('(Sold Out)')) {
          option.textContent += ' (Sold Out)';
        }
      } else {
        option.disabled = false;
        option.style.color = '';
        option.textContent = option.textContent.replace(/\s*\(Sold Out\)/, '');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      markSoldOutOptions();

      const select = document.getElementById('variant_Option');
      if (select) {
        select.addEventListener('change', markSoldOutOptions);
      }
    }, 500);
  });



/* ============================================================
   INLINE SCRIPT
   ============================================================ */


  document.addEventListener("DOMContentLoaded", function () {
    const messageEl = document.getElementById('_EKM_PRODUCTADDCARTMESSAGE');
    const qtyEl = document.querySelector('.prod-page-qty');

    if (!messageEl || !qtyEl) return;

    const checkAndHideQty = () => {
      if (messageEl.textContent.includes('Sorry, this item is out of stock')) {
        qtyEl.style.display = 'none';
      } else {
        qtyEl.style.display = '';
      }
    };

    // Initial check
    checkAndHideQty();

    // Watch for changes in the message element
    const observer = new MutationObserver(checkAndHideQty);

    observer.observe(messageEl, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });



/* ============================================================
   INLINE SCRIPT
   ============================================================ */


  document.addEventListener("DOMContentLoaded", function () {
    const descriptionEl = document.querySelector('[itemprop="description"]');
    const wordLimit = 50; // Set your desired word limit here

    if (!descriptionEl) return;

    const fullText = descriptionEl.textContent.trim();
    const words = fullText.split(/\s+/);

    if (words.length <= wordLimit) return; // No need for Read More

    const visibleText = words.slice(0, wordLimit).join(" ");
    const hiddenText = words.slice(wordLimit).join(" ");

    // Clear existing text and build the truncated + hidden + button
    descriptionEl.innerHTML = `
      <span class="visible-part">${visibleText}...</span>
      <span class="hidden-part" style="display: none;"> ${hiddenText}</span>
      <button class="read-more-btn" style="display: inline-block; background: none; border: none; color: #222; text-decoration: underline; cursor: pointer; padding: 0; font: inherit;">Read More</button>
    `;

    // Add toggle functionality
    const btn = descriptionEl.querySelector(".read-more-btn");
    btn.addEventListener("click", function () {
      descriptionEl.querySelector(".hidden-part").style.display = "inline";
      descriptionEl.querySelector(".visible-part").style.display = "none";
      btn.style.display = "none";
    });
  });



/* ============================================================
   INLINE SCRIPT
   ============================================================ */


document.addEventListener("DOMContentLoaded", function() {

  var path = window.location.pathname.toLowerCase();
  var mainContent = document.querySelector(".main-content-webpage");

  if (!mainContent) return;

  if (path.includes("shop") || path.includes("trade")) {
    mainContent.classList.add("full-width");
  }

});



/* ============================================================
   INLINE SCRIPT
   ============================================================ */


(function(fn, a){
	var epp = window._ekmpinpoint || (window._ekmpinpoint = {}) ;
	var called = false;
	var callOnce = function(){
		if (called) return;
		epp[fn].apply(epp, a) ;
		called = true;
	};
	if (epp && epp[fn]) return callOnce() ;
	var pfn;
	Object.defineProperty(epp, fn, {
		'enumerable': true,
		'configurable': false,
		'set': function(x) {
			pfn = x;
			callOnce() ;
		},
		'get': function() {
			return pfn;
		}
	}) ;
})("getStatsGlobal", ["b940b1","28"]) ;

