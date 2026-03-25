function getPagePath() {
    return window.location.pathname || '';
}

function pushToDataLayer(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: eventName,
        page_path: getPagePath(),
        timestamp: Date.now(),
        ...(params || {})
    });
}

function isPricingPage() {
    const path = (window.location.pathname || '').toLowerCase();
    return path.endsWith('/pricing.html') || path === 'pricing.html';
}

function setupScroll75Event() {
    let fired = false;
    let ticking = false;

    function check() {
        ticking = false;
        if (fired) return;

        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop || 0;
        const scrollHeight = doc.scrollHeight || 0;
        const clientHeight = doc.clientHeight || 0;
        const scrollable = Math.max(1, scrollHeight - clientHeight);
        const progress = scrollTop / scrollable;

        if (progress >= 0.75) {
            fired = true;
            pushToDataLayer('scroll_75');
        }
    }

    window.addEventListener('scroll', function() {
        if (fired || ticking) return;
        ticking = true;
        window.requestAnimationFrame(check);
    }, { passive: true });

    check();
}

function setupCtaClicks() {
    const ctas = document.querySelectorAll('a.cta-button');
    ctas.forEach(function(el) {
        el.addEventListener('click', function() {
            const ctaId = el.getAttribute('data-cta-id') || el.id || '';
            const ctaLocation = el.getAttribute('data-cta-location') || '';

            pushToDataLayer('cta_click', {
                cta_id: ctaId,
                cta_location: ctaLocation
            });
        });
    });
}

function setupFormSubmit() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailEl = document.getElementById('email');
        const roleEl = document.getElementById('role');

        const email = (emailEl && emailEl.value ? emailEl.value : '').trim();
        const role = roleEl && roleEl.value ? roleEl.value : '';

        pushToDataLayer('form_submit', {
            role: role,
            consent: 0,
            has_email: email ? 1 : 0
        });

        alert('Dziękujemy za zgłoszenie! \nEmail: ' + email + '\nRola: ' + role);
        console.log('Formularz wysłany pomyślnie dla:', email);

        form.reset();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (isPricingPage()) {
        pushToDataLayer('pricing_view');
    }

    setupScroll75Event();
    setupCtaClicks();
    setupFormSubmit();
});