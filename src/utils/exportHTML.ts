import { SectionProps } from "../types";

export function exportToHTML(sections: SectionProps[]): string {
  const css = `
    :root {
      --color-wine: #6B1A2A;
      --color-wine-light: #8C2236;
      --color-wine-muted: #F5EEF0;
      --color-cream: #FDFAF8;
      --color-charcoal: #2A2228;
      --color-stone: #7A6E72;
      --color-gold: #C49A4A;
      --color-divider: #E8DDE0;
      
      --font-cormorant: 'Cormorant Garamond', serif;
      --font-dm-sans: 'DM Sans', sans-serif;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: var(--font-dm-sans);
      background-color: var(--color-cream);
      color: var(--color-charcoal);
      -webkit-font-smoothing: antialiased;
      line-height: 1.7;
    }
    
    /* Hero */
    .forma-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 92vh;
      text-align: center;
      padding: 80px 20px;
      position: relative;
    }
    .forma-hero-label {
      font-family: var(--font-dm-sans);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--color-stone);
      margin-bottom: 24px;
    }
    .forma-hero h1 {
      font-family: var(--font-cormorant);
      font-size: 72px;
      font-weight: 700;
      color: var(--color-charcoal);
      max-width: 720px;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 20px;
    }
    .forma-hero p {
      font-size: 18px;
      color: var(--color-stone);
      max-width: 540px;
      line-height: 1.7;
      margin-bottom: 40px;
    }
    .forma-cta {
      display: inline-block;
      background-color: var(--color-wine);
      color: #fff;
      font-weight: 500;
      font-size: 14px;
      padding: 14px 36px;
      border-radius: 2px;
      text-decoration: none;
      transition: background-color 0.2s ease;
    }
    .forma-cta:hover {
      background-color: var(--color-wine-light);
    }
    .forma-hero-divider {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: 40px;
      background-color: var(--color-divider);
    }

    /* Features */
    .forma-features {
      padding: 120px 20px;
    }
    .forma-features .container {
      max-width: 1120px;
      margin: 0 auto;
    }
    .forma-features-header {
      text-align: center;
      margin-bottom: 80px;
    }
    .forma-features-subtitle {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--color-gold);
      margin-bottom: 16px;
    }
    .forma-features h2 {
      font-family: var(--font-cormorant);
      font-size: 48px;
      color: var(--color-charcoal);
      line-height: 1.15;
    }
    .forma-features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 60px;
      list-style: none;
    }
    .forma-feature-item {
      padding-top: 24px;
      border-top: 1px solid var(--color-divider);
    }
    .forma-feature-title {
      font-size: 20px;
      color: var(--color-charcoal);
      margin-bottom: 12px;
    }
    .forma-feature-desc {
      font-size: 16px;
      color: var(--color-stone);
    }

    /* Testimonials */
    .forma-testimonials {
      padding: 120px 20px;
    }
    .forma-test-header {
      text-align: center;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--color-stone);
      margin-bottom: 60px;
    }
    .forma-test-grid {
      max-width: 1120px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
    }
    .forma-test-card {
      background-color: #fff;
      padding: 40px;
      border: 1px solid var(--color-divider);
    }
    .forma-test-card blockquote {
      font-family: var(--font-cormorant);
      font-size: 24px;
      line-height: 1.4;
      color: var(--color-charcoal);
      margin-bottom: 24px;
      font-style: italic;
    }
    .forma-test-author {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-stone);
      display: flex;
      align-items: center;
    }
    .forma-test-author::before {
      content: '';
      display: inline-block;
      width: 20px;
      height: 1px;
      background-color: var(--color-wine);
      margin-right: 12px;
    }

    /* Pricing */
    .forma-pricing {
      padding: 120px 20px;
    }
    .forma-pricing-header {
      text-align: center;
      font-family: var(--font-cormorant);
      font-size: 48px;
      margin-bottom: 80px;
    }
    .forma-pricing-grid {
      max-width: 900px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2px;
      background-color: var(--color-divider);
      border: 1px solid var(--color-divider);
    }
    .forma-pricing .tier {
      background-color: #fff;
      padding: 60px 40px;
      text-align: center;
    }
    .forma-pricing .tier-name {
      font-size: 18px;
      font-weight: 500;
      color: var(--color-charcoal);
      margin-bottom: 16px;
    }
    .forma-pricing .tier-price {
      font-family: var(--font-cormorant);
      font-size: 56px;
      color: var(--color-charcoal);
      margin-bottom: 32px;
      line-height: 1;
    }
    .forma-pricing .tier-btn {
      display: inline-block;
      width: 100%;
      border: 1px solid var(--color-wine);
      color: var(--color-wine);
      padding: 12px 0;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    .forma-pricing .tier-btn:hover {
      background-color: var(--color-wine-muted);
    }

    /* Footer */
    .forma-footer {
      padding: 80px 20px;
      text-align: center;
    }
    .forma-footer-brand {
      font-family: var(--font-cormorant);
      font-size: 24px;
      font-weight: 700;
      color: var(--color-cream);
      margin-bottom: 16px;
    }
    .forma-footer-tagline {
      font-size: 14px;
      color: rgba(253, 250, 248, 0.6);
    }
  `;

  let bodyHtml = "";

  sections.forEach((section) => {
    const p = section.props;
    switch (section.type) {
      case "hero":
        bodyHtml += `
          <section class="forma-hero" style="background-color: ${p.bgColor || 'var(--color-cream)'};">
            <div class="forma-hero-label">FORMA — Landing Page Builder</div>
            <h1>${p.headline || 'Headline'}</h1>
            <p>${p.subheadline || 'Subheadline text'}</p>
            <a href="${p.ctaHref || '#'}" class="forma-cta">${p.ctaText || 'Click Here'}</a>
            <div class="forma-hero-divider"></div>
          </section>
        `;
        break;
      case "features":
        const feats = p.features || [];
        bodyHtml += `
          <section class="forma-features" style="background-color: ${p.bgColor || 'var(--color-cream)'};">
            <div class="container">
              <div class="forma-features-header">
                <div class="forma-features-subtitle">${p.subtitle || 'FEATURES'}</div>
                <h2>${p.title || 'Why Choose Us'}</h2>
              </div>
              <ul class="forma-features-grid">
                ${feats.map((f: any) => `
                  <li class="forma-feature-item">
                    <h3 class="forma-feature-title">${f.title || 'Feature'}</h3>
                    <p class="forma-feature-desc">${f.description || 'Description goes here'}</p>
                  </li>
                `).join('')}
              </ul>
            </div>
          </section>
        `;
        break;
      case "testimonials":
        const tests = p.testimonials || [];
        bodyHtml += `
          <section class="forma-testimonials" style="background-color: ${p.bgColor || 'var(--color-cream)'};">
            <div class="forma-test-header">${p.title || 'TESTIMONIALS'}</div>
            <div class="forma-test-grid">
              ${tests.map((t: any) => `
                <div class="forma-test-card">
                  <blockquote>"${t.quote || 'Great service!'}"</blockquote>
                  <div class="forma-test-author">${t.author || 'User'}</div>
                </div>
              `).join('')}
            </div>
          </section>
        `;
        break;
      case "pricing":
        const tiers = p.tiers || [];
        bodyHtml += `
          <section class="forma-pricing" style="background-color: ${p.bgColor || 'var(--color-cream)'};">
            <h2 class="forma-pricing-header">${p.title || 'Pricing'}</h2>
            <div class="forma-pricing-grid">
              ${tiers.map((t: any) => `
                <div class="tier">
                  <div class="tier-name">${t.name || 'Plan'}</div>
                  <div class="tier-price">${t.price || '$0'}</div>
                  <a href="#" class="tier-btn">${t.buttonText || 'Select'}</a>
                </div>
              `).join('')}
            </div>
          </section>
        `;
        break;
      case "footer":
        bodyHtml += `
          <footer class="forma-footer" style="background-color: ${p.bgColor || 'var(--color-charcoal)'};">
            <div class="forma-footer-brand">${p.companyName || 'Brand'}</div>
            <div class="forma-footer-tagline">${p.tagline || 'Built with FORMA.'}</div>
          </footer>
        `;
        break;
      default:
        break;
    }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FORMA Export</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
  <style>
${css}
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}
