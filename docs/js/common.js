var profilesKey = 'darksouls3_profiles';

// Language metadata — mirrors LANGUAGE_META in generate.py.
// Add new entries here (and in generate.py) to support more languages.
window.LANGUAGE_META = {
    'en': { flag: '🇬🇧', name: 'EN' },
    'it': { flag: '🇮🇹', name: 'IT' },
    'es': { flag: '🇪🇸', name: 'ES' },
    'fr': { flag: '🇫🇷', name: 'FR' },
    'de': { flag: '🇩🇪', name: 'DE' },
    'pt': { flag: '🇵🇹', name: 'PT' },
};

window.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

var themes = {
    "Standard": "/css/bootstrap.min.css",
    "LightMode": "/css/themes/lightmode/bootstrap.min.css",
    "Ceruleon": "/css/themes/cerulean/bootstrap.min.css",
    "Cosmo": "/css/themes/cosmo/bootstrap.min.css",
    "Cyborg": "/css/themes/cyborg/bootstrap.min.css",
    "Darkly": "/css/themes/darkly/bootstrap.min.css",
    "Flatly": "/css/themes/flatly/bootstrap.min.css",
    "Journal": "/css/themes/journal/bootstrap.min.css",
    "Litera": "/css/themes/litera/bootstrap.min.css",
    "Lumen": "/css/themes/lumen/bootstrap.min.css",
    "Lux": "/css/themes/lux/bootstrap.min.css",
    "Materia": "/css/themes/materia/bootstrap.min.css",
    "Minty": "/css/themes/minty/bootstrap.min.css",
    "Morph": "/css/themes/Morph/bootstrap.min.css",
    "Pulse": "/css/themes/pulse/bootstrap.min.css",
    "Quartz": "/css/themes/quartz/bootstrap.min.css",
    "Regent": "/css/themes/regent/bootstrap.min.css",
    "Sandstone": "/css/themes/sandstone/bootstrap.min.css",
    "Simplex": "/css/themes/simplex/bootstrap.min.css",
    "Sketchy": "/css/themes/sketchy/bootstrap.min.css",
    "Slate": "/css/themes/slate/bootstrap.min.css",
    "Solar": "/css/themes/solar/bootstrap.min.css",
    "Spacelab": "/css/themes/spacelab/bootstrap.min.css",
    "Superhero": "/css/themes/superhero/bootstrap.min.css",
    "United": "/css/themes/united/bootstrap.min.css",
    "Vapor": "/css/themes/vapor/bootstrap.min.css",
    "Yeti": "/css/themes/yeti/bootstrap.min.css",
    "Zephyr": "/css/themes/zephyr/bootstrap.min.css",
};


(function ($) {
    'use strict';

    window.profiles = $.jStorage.get(profilesKey, {});

    window.initializeProfile = function (profile_name) {
        if (!(profile_name in profiles[profilesKey])) profiles[profilesKey][profile_name] = {};
        if (!('checklistData' in profiles[profilesKey][profile_name]))
            profiles[profilesKey][profile_name].checklistData = {};
        if (!('collapsed' in profiles[profilesKey][profile_name]))
            profiles[profilesKey][profile_name].collapsed = {};
        if (!('hide_completed' in profiles[profilesKey][profile_name]))
            profiles[profilesKey][profile_name].hide_completed = false;
        if (!('journey' in profiles[profilesKey][profile_name]))
            profiles[profilesKey][profile_name].journey = 1;
        if (!('style' in profiles[profilesKey][profile_name]))
            profiles[profilesKey][profile_name].style = 'Standard';
        if (!('map_settings' in profiles[profilesKey][profile_name]))
            profiles[profilesKey][profile_name].map_settings = {};
        if (!('checklistTimestamps' in profiles[profilesKey][profile_name]))
            profiles[profilesKey][profile_name].checklistTimestamps = {};
        if (!('dlc_filter' in profiles[profilesKey][profile_name]))
            profiles[profilesKey][profile_name].dlc_filter = 'both';
        $.jStorage.set(profilesKey, profiles);
    }

    window.themeSetup = function (stylesheet) {
        if (stylesheet === null || stylesheet === undefined) { // if we didn't get a param, then
            stylesheet = profiles[profilesKey][profiles.current].style; // fall back on "light" if cookie not set
        }
        $("#bootstrap").attr("href", themes[stylesheet]);
    }

    /// assure default values are set
    /// necessary 'cause we're abusing local storage to store JSON data
    /// done in a more verbose way to be easier to understand
    if (!('current' in profiles)) profiles.current = 'Default Profile';
    if (!(profilesKey in profiles)) profiles[profilesKey] = {};
    initializeProfile(profiles.current);
    window.themeSetup(profiles[profilesKey][profiles.current].style);


    if ('loading' in HTMLImageElement.prototype) {
        $('img[loading="lazy"]').each(function () {
            $(this).attr('src', this.dataset.src);
        });
    } else {
        const lazyScript = document.createElement('script');
        lazyScript.src = '/js/lazysizes.min.js';
        document.body.appendChild(lazyScript);
    }

    var anchor = window.location.hash.substr(1);
    if (anchor) {
        var t = $('li#' + anchor)
        console.log(t)
        t.addClass('border border-primary border-3');
    }

    function setCheckbox(id, checked) {
        if ($('#' + id).length === 1) {
            var el = $('#' + id).get(0);
            $(el).prop('checked', checked)
            if (checked) {
                $(el).closest('li').addClass('completed')
                if (window.current_page_id) {
                    window.progress[window.current_page_id]['total'][0] += 1;
                    const section_idx = parseInt($(el).attr('data-section-idx'));
                    window.progress[window.current_page_id]['sections'][section_idx][0] += 1;
                }
            } else {
                $(el).closest('li').removeClass('completed')
                if (window.current_page_id) {
                    window.progress[window.current_page_id]['total'][0] -= 1;
                    const section_idx = parseInt($(el).attr('data-section-idx'));
                    window.progress[window.current_page_id]['sections'][section_idx][0] -= 1;
                }
            }
        }
    }
    window.setItem = function (id, checked, startup = false) {
        if (startup && !checked) {
            return;
        }
        profiles = $.jStorage.get(profilesKey, {});
        profiles[profilesKey][profiles.current].checklistData[id] = !!checked;
        setCheckbox(id, checked);
        $.jStorage.set(profilesKey, profiles);

        if (id in item_links) {
            var links = item_links[id];
            if ('targets' in links) {
                for (const t of links['targets']) {
                    if (profiles[profilesKey][profiles.current].checklistData[t] != checked) {
                        setItem(t, checked, startup);
                    }
                }
            }
            if ('orsources' in links) {
                var b = checked;
                for (const s of links['orsources']) {
                    b |= profiles[profilesKey][profiles.current].checklistData[s];
                }
                for (const t of links['ortargets']) {
                    if (profiles[profilesKey][profiles.current].checklistData[t] != b) {
                        setItem(t, b, startup);
                    }
                }
            }
            if ('andsources' in links) {
                var b = checked;
                for (const s of links['andsources']) {
                    b &= profiles[profilesKey][profiles.current].checklistData[s];
                }
                for (const t of links['andtargets']) {
                    if (!profiles[profilesKey][profiles.current].checklistData[t] && b) {
                        setItem(t, b, startup);
                    }
                }
            }
        }
    }

    // ── Language support ───────────────────────────────────────────────────────

    function applyLanguageCss(lang) {
        if (lang === 'en') {
            $('.lang-text').addClass('d-none');
            $('.lang-text.lang-en').removeClass('d-none');
        } else {
            $('.lang-text').addClass('d-none');
            // Show the target-language spans
            $('.lang-text.lang-' + lang).removeClass('d-none');
            // Fallback: for lang-pair elements that have no target-language child,
            // fall back to showing the English span.
            $('.lang-pair').each(function () {
                if (!$(this).children('.lang-text.lang-' + lang).length) {
                    $(this).children('.lang-text.lang-en').removeClass('d-none');
                }
            });
        }
        var fix = document.getElementById('language-fouc-fix');
        if (fix) fix.remove();
    }

    function updateLangDisplay(lang) {
        var meta = window.LANGUAGE_META[lang] || { flag: '🌐', name: lang.toUpperCase() };
        $('#lang-display').html(meta.flag + ' ' + meta.name);
        $('.lang-option').removeClass('active');
        $('.lang-option[data-lang="' + lang + '"]').addClass('active');
    }

    window.setLanguage = function (lang) {
        window.currentLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);
        applyLanguageCss(lang);
        updateLangDisplay(lang);
    };

    // Initialise language on page load
    updateLangDisplay(window.currentLanguage);
    applyLanguageCss(window.currentLanguage);

    // Language selector click handler
    $(document).on('click', '.lang-option', function (e) {
        e.preventDefault();
        window.setLanguage($(this).data('lang'));
    });

    $(window).on('load', function () {
        var themeFix = document.getElementById('theme-fouc-fix');
        if (themeFix) themeFix.remove();
    });

})(jQuery);
