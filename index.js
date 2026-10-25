(function () {
    function initNav() {
        var map = { product: 'features', solutions: 'solutions', pricing: 'pricing', resources: 'contact', features: 'features', testimonials: 'testimonials', contact: 'contact', hero: 'hero', cta: 'cta', content: 'content', gallery: 'gallery', header: 'header' };
        var sectionIds = ['hero', 'features', 'solutions', 'testimonials', 'pricing', 'contact'];
        var sections = document.querySelectorAll('body > section');
        var nav = document.querySelector('header nav');

        if (nav) {
            [
                { label: 'Builder', href: 'builder.html' },
                { label: 'Components', href: 'components.html' }
            ].forEach(function (item) {
                var alreadyPresent = Array.prototype.some.call(nav.querySelectorAll('a'), function (link) {
                    return link.getAttribute('href') === item.href || link.textContent.trim().toLowerCase() === item.label.toLowerCase();
                });
                if (alreadyPresent) return;
                var link = document.createElement('a');
                link.href = item.href;
                link.textContent = item.label;
                nav.appendChild(link);
            });
        }

        document.querySelectorAll('a[href="#"]').forEach(function (link) {
            var label = link.textContent.toLowerCase().trim();
            if (label === 'get started' || label === 'start building' || label === 'see how it works' || label === 'export your site') {
                link.href = 'builder.html';
            }
        });

        sections.forEach(function (section, index) {
            if (sectionIds[index] && !section.id) section.id = sectionIds[index];
        });

        function scrollToId(id) {
            var el = document.getElementById(id) || document.querySelector('[data-canonical="' + id + '"]');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return true;
            }
            return false;
        }

        function handleClick(e) {
            var link = e.currentTarget;
            var href = link.getAttribute('href');
            if (href && href !== '#' && href.charAt(0) !== '#') return;

            var raw = (link.getAttribute('data-nav') || link.textContent || '').toLowerCase().trim();
            if (!raw) return;

            e.preventDefault();
            var target = map[raw] || raw;
            if (!scrollToId(target)) {
                if (raw === 'product') scrollToId('features');
                else if (raw === 'solutions') scrollToId('features');
                else if (raw === 'pricing') scrollToId('pricing');
                else if (raw === 'resources') scrollToId('contact');
            }
        }

        var links = document.querySelectorAll('.nav-link, header nav a, header nav span, [data-nav]');
        links.forEach(function (link) {
            link.addEventListener('click', handleClick);
            if (link.tagName === 'SPAN') {
                link.setAttribute('role', 'link');
                link.setAttribute('tabindex', '0');
                link.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        link.click();
                    }
                });
            }
        });
    }

    function initContactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var formData = new FormData(form);
            var name = formData.get('name');
            var email = formData.get('email');
            var message = formData.get('message');
            var subject = 'Website contact from ' + name;
            var body = 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message;
            var status = document.getElementById('contactStatus');
            status.textContent = 'Opening your email app to send this message to arico@morninglightsolutions.com.';
            window.location.href = 'mailto:arico@morninglightsolutions.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        });
    }

    function initComponentsPage() {
        if (!window.location.pathname.endsWith('/components.html')) return;

        var componentTypes = {
            'Header - Nav': 'header',
            'Hero - Hero': 'hero',
            'Text - Rich Text': 'text',
            'Image+Text - Media Split': 'split',
            'Features - 3-col benefits': 'features',
            'Testimonial - Quote': 'testimonial',
            'Pricing - 3-tier pricing': 'pricing',
            'Contact - Form + info': 'contact',
            'CTA - Centered CTA': 'cta',
            'Footer - Footer links': 'footer'
        };

        function wirePageLinks() {
            document.querySelectorAll('a').forEach(function (link) {
                var label = link.textContent.trim().toLowerCase();
                if (label === 'builder' || label === 'open builder' || label === 'get started' || label === 'start building free') {
                    link.href = 'builder.html';
                } else if (label === 'components') {
                    link.href = 'components.html';
                }
            });
        }

        function getComponentType(button) {
            var card = button.closest('.group');
            var heading = card && card.querySelector('h3');
            var title = heading ? heading.textContent.trim() : '';

            if (!title) {
                var dialog = button.closest('div[class*="fixed"]');
                var dialogText = dialog ? dialog.textContent : '';
                title = Object.keys(componentTypes).find(function (componentTitle) {
                    return dialogText.includes(componentTitle);
                }) || '';
            }

            return componentTypes[title] || '';
        }

        document.addEventListener('click', function (event) {
            var button = event.target.closest('button');
            if (!button || !button.textContent.includes('Add to Builder')) return;

            var type = getComponentType(button);
            if (!type) return;

            event.preventDefault();
            event.stopImmediatePropagation();

            try {
                var pending = JSON.parse(localStorage.getItem('pending_blocks') || '[]');
                if (!Array.isArray(pending)) pending = [];
                pending.push(type);
                localStorage.setItem('pending_blocks', JSON.stringify(pending));
                window.location.href = 'builder.html?added=' + encodeURIComponent(type);
            } catch (error) {
                window.alert('Could not save this component. Enable browser storage and try again.');
            }
        }, true);

        wirePageLinks();
        var root = document.getElementById('root');
        if (root && window.MutationObserver) {
            new MutationObserver(wirePageLinks).observe(root, { childList: true, subtree: true });
        }
    }

    function initPage() {
        initNav();
        initContactForm();
        initComponentsPage();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPage, { once: true });
    } else {
        initPage();
    }
    // Smooth scrolling for preview anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    if (id && id !== '#') {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
})();