(function () {
    function initNav() {
        var map = { product: 'features', solutions: 'solutions', pricing: 'pricing', resources: 'contact', features: 'features', testimonials: 'testimonials', contact: 'contact', hero: 'hero', cta: 'cta', content: 'content', gallery: 'gallery', header: 'header' };
        var sectionIds = ['hero', 'features', 'solutions', 'testimonials', 'pricing', 'contact'];
        var sections = document.querySelectorAll('body > section');

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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNav, { once: true });
    } else {
        initNav();
    }
})();