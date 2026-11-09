window.__ModuleLoader__.load({
  id: '@local/7lamp-harness',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const namespace = 'sevenlamp-harness';
    const pair = (light, dark = light) => ({ light, dark });

    // Layer over the selected built-in theme, rather than changing user preferences.
    // Removing this package removes the layer and reveals the preceding theme.
    const tokens = {
      '--dsw-alias-bg-base': pair('#f6f7f9', '#19172c'),
      '--dsw-alias-bg-layer-1': pair('#ffffff', '#272446'),
      '--dsw-alias-bg-layer-2': pair('#eef1f4', '#322e54'),
      '--dsw-alias-bg-overlay': pair('#ffffff', '#322e54'),
      '--dsw-alias-border-l1': pair('rgba(39,36,70,.16)', 'rgba(223,228,232,.16)'),
      '--dsw-alias-border-l2': pair('rgba(39,36,70,.24)', 'rgba(223,228,232,.24)'),
      '--dsw-alias-brand-primary': pair('#c61938', '#c61938'),
      // Solid action fills and their foreground are a pair, independent of link accents.
      '--dsw-alias-button-primary-fill': pair('#c61938'),
      '--dsw-alias-button-primary-hover': pair('#a9142e'),
      '--dsw-alias-button-info-fill': pair('#c61938'),
      '--dsw-alias-button-info-hover': pair('#a9142e'),
      '--dsw-alias-button-primary-dimmed': pair('#dfe4e8', '#48435f'),
      '--dsw-alias-label-primary-foreground': pair('#ffffff'),
      '--dsw-alias-switch-thumb': pair('#ffffff', '#cdd4df'),
      '--dsw-alias-button-elevated-fill': pair('#ffffff', '#3a355b'),
      '--dsw-alias-button-floating-fill': pair('#ffffff', '#322e54'),
      '--dsw-alias-button-floating-hover': pair('#e5e8ef', '#484264'),
      '--dsw-alias-button-ghost-active-fill': pair('#e5e8ef', '#3a355b'),
      '--dsw-alias-button-ghost-active-hover': pair('#dfe4e8', '#484264'),
      '--dsw-alias-button-ghost-active-border': pair('#8c99af', '#8c99af'),
      '--dsw-alias-button-contrast-fill': pair('#272446', '#dfe4e8'),
      '--dsw-alias-border-l3': pair('rgba(39,36,70,.22)', '#514b6d'),
      '--dsw-alias-border-l4': pair('rgba(39,36,70,.30)', '#625b7d'),
      '--dsw-alias-border-l2-darkmode-thin': pair('rgba(39,36,70,.16)', 'rgba(223,228,232,.18)'),
      '--dsw-alias-bg-layer-3': pair('#e5e8ef', '#3a355b'),
      '--dsw-alias-bg-multi-select': pair('#e5e8ef', '#3a355b'),
      '--dsw-alias-interactive-bg-active': pair('rgba(39,36,70,.12)', '#484264'),
      '--dsw-alias-interactive-bg-hover-accent': pair('rgba(39,36,70,.12)', '#484264'),
      '--dsw-alias-interactive-bg-hover-solid': pair('#e5e8ef', '#3a355b'),
      '--dsw-alias-label-primary-dimmed': pair('#272446', '#dfe4e8'),
      '--dsw-alias-label-primary-bluish': pair('#272446', '#dfe4e8'),
      '--dsw-alias-label-dimmed': pair('#8c99af', '#8c99af'),
      '--dsw-alias-label-primary-inverted': pair('#ffffff', '#19172c'),
      '--dsw-alias-link': pair('#a9142e', '#ff8ca1'),
      '--dsw-alias-state-business-tertiary': pair('#f7e4e9', '#432a45'),
      '--dsw-specific-selector': pair('#eef1f4', '#3a355b'),
      '--dsw-specific-bubble': pair('#e9eaf1', '#322e54'),
      '--dsw-specific-bubble-highlight': pair('#d9dbe7', '#484264'),
      '--dsw-specific-sidebar-nav-item-active': pair('#dfe4e8', '#3a355b'),
      '--dsw-specific-sidebar-nav-item-active-accent': pair('#e9eaf1', '#3a355b'),
      '--dsw-specific-tip': pair('#eef1f4', '#322e54'),
      '--dsw-alias-markdown-code-block-banner': pair('#e9eaf1', '#272446'),
      '--dsw-alias-markdown-inline-code': pair('#eef1f4', '#322e54'),
      '--dsw-alias-turn-trigger-bg': pair('#eef1f4', '#272446'),
      '--dsw-alias-turn-trigger-bg-hover': pair('#e5e8ef', '#322e54'),
      '--dsw-alias-label-primary': pair('#171622', '#f6f7f9'),
      '--dsw-alias-label-secondary': pair('#5f6472', '#cdd4df'),
      '--dsw-alias-state-error-primary': pair('#c61938', '#f46a82'),
      '--dsw-alias-state-idle-primary': pair('#616a7a', '#8c99af'),
      '--dsw-alias-state-success-primary': pair('#1a7a52', '#60d5a3'),
      '--dsw-alias-state-warn-primary': pair('#96620e', '#efba6b'),
      '--dsw-specific-sidebar-fill': pair('#eef1f4', '#272446'),
      // Additional consumers confirmed in the installed theme/composer styles.
      '--dsw-specific-input-major': pair('#ffffff', '#272446'),
      '--dsw-alias-interactive-bg-hover': pair('#e9eaf1', '#322e54'),
      // Some shipped surfaces bypass aliases. Rebind their shared palette steps,
      // not hashed component selectors: guide compass and changed-file headers.
      '--dsw-static-neutral-50': pair('#f6f7f9', '#211e38'),
      '--dsw-static-neutral-100': pair('#eef1f4', '#272446'),
      '--dsw-static-neutral-200': pair('#dfe4e8', '#484264'),
      '--dsw-static-neutral-700': pair('#616a7a', '#8c99af'),
      '--dsw-static-neutral-800': pair('#272446', '#322e54'),
      '--dsw-static-neutral-850': pair('#211e38', '#211e38'),
      '--dsw-alias-state-business-primary': pair('#c61938', '#f46a82'),
      '--dsw-focus-ring-color': pair('#c61938', '#f46a82'),
      '--dsw-alias-bg-module-platform': pair('#eef1f4', '#322e54'),
      '--dsw-alias-label-tertiary': pair('#616a7a', '#aeb8c9'),
      '--dsw-alias-label-caption': pair('#616a7a', '#aeb8c9'),
      '--dsw-alias-markdown-code-block': pair('#eef1f4', '#211e38'),
      '--dsw-alias-settings-card-fill': pair('#ffffff', '#272446'),
      '--dsw-alias-settings-card-stroke': pair('rgba(39,36,70,.16)', 'rgba(223,228,232,.16)'),
      '--dsw-menu-surface-fill': pair('rgba(255,255,255,.96)', 'rgba(50,46,84,.96)'),
      '--dsw-specific-menu': pair('rgba(255,255,255,.96)', 'rgba(50,46,84,.96)'),
      '--dsw-alias-menu-group-header-fill': pair('rgba(255,255,255,.96)', 'rgba(50,46,84,.96)'),
      '--dsw-alias-menu-icon': pair('#272446', '#dfe4e8'),
      '--dsw-alias-toast-bg': pair('#272446', '#eef1f4'),
      '--dsw-alias-toast-label': pair('#ffffff', '#272446'),
      '--dsw-radius-sm': pair('12px'),
      '--dsw-radius-md': pair('12px'),
      '--dsw-radius-lg': pair('16px'),
      '--dsw-radius-xl': pair('22px'),
      '--dsw-radius-panel': pair('32px'),
      // Change only the fallback stack; explicit user fonts and code fonts survive.
      '--dsh-font-family-text-default': pair('"Noto Sans", Arial, sans-serif'),
      '--dsw-font-family-brand': pair('"Noto Sans", Arial, sans-serif'),
    };

    // Keep an explicit occupant: removing it would restore the host whale fallback.
    // A hidden element also prevents null-result fallback in the hero seat.
    function BrandMark() {
      return h('span', { hidden: true, 'aria-hidden': true });
    }

    function BrandName({ t }) {
      return h('span', {
        'aria-label': t('brand.full'),
        style: {
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: 'var(--dsw-alias-label-primary)', whiteSpace: 'nowrap',
          fontFamily: '"Noto Sans", Arial, sans-serif', lineHeight: 1,
        },
      },
      h('span', { style: { fontSize: 25, fontWeight: 800, letterSpacing: '-.055em' } },
        h('span', { style: { color: 'var(--dsw-alias-button-primary-fill)' } }, t('brand.name').slice(0, 1)),
        t('brand.name').slice(1)),
      h('span', {
        style: {
          padding: '5px 6px', borderRadius: 6,
          background: 'var(--dsw-alias-button-primary-fill)',
          color: 'var(--dsw-alias-label-primary-foreground)',
          fontSize: 9, fontWeight: 800, letterSpacing: '.08em',
        },
      }, t('brand.product')));
    }

    return {
      inject: ['slots', 'theme', 'locale'],
      apply(ctx) {
        for (const language of ['en', 'ru', 'zh']) {
          ctx.effect(() => ctx.locale.register(namespace, language, {
            'brand.full': '7LAMP HARNESS',
            'brand.name': '7LAMP',
            'brand.product': 'HARNESS',
          }));
        }
        ctx.effect(() => ctx.theme.overrideTokens('@local/7lamp-harness', tokens));
        for (const [name, component] of [
          ['sidebar.brand.mark', BrandMark],
          ['sidebar.brand.name', BrandName],
          ['conversation.hero.brand.mark', BrandMark],
        ]) {
          ctx.slots.inject(name, () => ctx.slots.register({
            name, priority: -100, locale: namespace,
          }, component));
        }
      },
    };
  },
});
