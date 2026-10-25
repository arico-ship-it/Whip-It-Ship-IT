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
                if (nav.querySelector('a[href="' + item.href + '"]')) return;
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

    function initPage() {
        initNav();
        initContactForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPage, { once: true });
    } else {
        initPage();
    }
})();