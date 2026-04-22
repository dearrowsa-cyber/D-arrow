export interface SeoAnalysisResult {
  score: number;
  checks: {
    id: string;
    label: string;
    passed: boolean;
    points: number;
    maxPoints: number;
    category: string;
  }[];
  suggestions: string[];
}

/**
 * Advanced SEO Content Analyzer
 * Based on modern SEO best practices including:
 * - Google Helpful Content Update (content quality)
 * - E-E-A-T signals (Experience, Expertise, Authoritativeness, Trust)
 * - On-Page SEO (title, meta, headings, URL)
 * - Mobile-First considerations
 * - Search Intent alignment
 * - Penalty avoidance (keyword stuffing, duplicate content)
 */
export function analyzeContent(
  content: string,
  title: string,
  description: string,
  focusKeyword: string,
  slug: string
): SeoAnalysisResult {
  let score = 0;
  const checks: SeoAnalysisResult['checks'] = [];
  const suggestions: string[] = [];

  const lowerContent = content.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const lowerKeyword = focusKeyword.toLowerCase().trim();
  const lowerSlug = slug.toLowerCase();

  // Strip HTML tags for text analysis
  const plainText = lowerContent.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  const words = plainText.split(/\s+/).filter(w => w.length > 2);
  const wordCount = words.length;

  // ═══════════════════════════════════════════════════
  // 🔑 1. KEYWORD OPTIMIZATION (max 25 points)
  // ═══════════════════════════════════════════════════
  if (lowerKeyword) {
    // Keyword in Title
    if (lowerTitle.includes(lowerKeyword)) {
      score += 6;
      checks.push({ id: 'kw-title', label: 'Keyword in Title', passed: true, points: 6, maxPoints: 6, category: 'Keyword' });
    } else {
      checks.push({ id: 'kw-title', label: 'Keyword in Title', passed: false, points: 0, maxPoints: 6, category: 'Keyword' });
      suggestions.push('Add your focus keyword to the SEO Title.');
    }

    // Keyword in Meta Description
    if (lowerDesc.includes(lowerKeyword)) {
      score += 5;
      checks.push({ id: 'kw-desc', label: 'Keyword in Meta Description', passed: true, points: 5, maxPoints: 5, category: 'Keyword' });
    } else {
      checks.push({ id: 'kw-desc', label: 'Keyword in Meta Description', passed: false, points: 0, maxPoints: 5, category: 'Keyword' });
      suggestions.push('Add your focus keyword to the Meta Description.');
    }

    // Keyword in URL Slug
    if (lowerSlug.includes(lowerKeyword.replace(/\s+/g, '-'))) {
      score += 4;
      checks.push({ id: 'kw-slug', label: 'Keyword in URL Slug', passed: true, points: 4, maxPoints: 4, category: 'Keyword' });
    } else {
      checks.push({ id: 'kw-slug', label: 'Keyword in URL Slug', passed: false, points: 0, maxPoints: 4, category: 'Keyword' });
      suggestions.push('Consider adding your focus keyword to the URL slug (clean URL structure).');
    }

    // Keyword in first 150 chars of content (search intent signal)
    const firstParagraph = plainText.substring(0, 150);
    if (firstParagraph.includes(lowerKeyword)) {
      score += 4;
      checks.push({ id: 'kw-intro', label: 'Keyword in Introduction', passed: true, points: 4, maxPoints: 4, category: 'Keyword' });
    } else {
      checks.push({ id: 'kw-intro', label: 'Keyword in Introduction', passed: false, points: 0, maxPoints: 4, category: 'Keyword' });
      suggestions.push('Use your focus keyword in the opening paragraph to match search intent.');
    }

    // Keyword Density (0.5–2.5% ideal) — penalize stuffing per Google guidelines
    const kwCount = (plainText.match(new RegExp(lowerKeyword, 'g')) || []).length;
    const density = wordCount > 0 ? (kwCount / wordCount) * 100 : 0;

    if (density >= 0.5 && density <= 2.5) {
      score += 6;
      checks.push({ id: 'kw-density', label: `Keyword Density (${density.toFixed(1)}%)`, passed: true, points: 6, maxPoints: 6, category: 'Keyword' });
    } else if (density > 2.5) {
      score += 2;
      checks.push({ id: 'kw-density', label: `Keyword Density TOO HIGH (${density.toFixed(1)}%)`, passed: false, points: 2, maxPoints: 6, category: 'Keyword' });
      suggestions.push(`⚠️ Keyword stuffing detected (${density.toFixed(1)}%). Google penalizes this. Reduce to under 2.5%.`);
    } else {
      checks.push({ id: 'kw-density', label: `Keyword Density TOO LOW (${density.toFixed(1)}%)`, passed: false, points: 0, maxPoints: 6, category: 'Keyword' });
      suggestions.push('Use your focus keyword more naturally in the content (aim for 0.5–2.5%).');
    }
  } else {
    suggestions.push('Set a focus keyword to get keyword-level analysis.');
  }

  // ═══════════════════════════════════════════════════
  // 🏗️ 2. ON-PAGE SEO (max 25 points)
  // ═══════════════════════════════════════════════════

  // Title Length (40-60 chars optimal)
  if (title.length >= 40 && title.length <= 60) {
    score += 6;
    checks.push({ id: 'title-len', label: 'Title Length (40-60 chars)', passed: true, points: 6, maxPoints: 6, category: 'On-Page' });
  } else {
    checks.push({ id: 'title-len', label: `Title Length (${title.length} chars)`, passed: false, points: 0, maxPoints: 6, category: 'On-Page' });
    suggestions.push(`SEO Title is ${title.length} chars. Aim for 40-60 characters for optimal display in search results.`);
  }

  // Description Length (120-160 chars optimal)
  if (description.length >= 120 && description.length <= 160) {
    score += 6;
    checks.push({ id: 'desc-len', label: 'Description Length (120-160 chars)', passed: true, points: 6, maxPoints: 6, category: 'On-Page' });
  } else {
    checks.push({ id: 'desc-len', label: `Description Length (${description.length} chars)`, passed: false, points: 0, maxPoints: 6, category: 'On-Page' });
    suggestions.push(`Meta Description is ${description.length} chars. Aim for 120-160 characters.`);
  }

  // Heading structure (H1, H2 usage)
  const hasH1 = /<h1[\s>]/i.test(content);
  const h1Count = (content.match(/<h1[\s>]/gi) || []).length;
  const hasH2 = /<h2[\s>]/i.test(content);

  if (hasH1 && h1Count === 1) {
    score += 5;
    checks.push({ id: 'heading-h1', label: 'Single H1 Tag', passed: true, points: 5, maxPoints: 5, category: 'On-Page' });
  } else if (h1Count > 1) {
    score += 2;
    checks.push({ id: 'heading-h1', label: `Multiple H1 Tags (${h1Count})`, passed: false, points: 2, maxPoints: 5, category: 'On-Page' });
    suggestions.push(`Found ${h1Count} H1 tags. Use only one H1 per page with proper heading hierarchy.`);
  } else {
    checks.push({ id: 'heading-h1', label: 'Missing H1 Tag', passed: false, points: 0, maxPoints: 5, category: 'On-Page' });
    suggestions.push('Add an H1 heading tag to define the primary topic of the page.');
  }

  if (hasH2) {
    score += 3;
    checks.push({ id: 'heading-h2', label: 'Uses H2 Subheadings', passed: true, points: 3, maxPoints: 3, category: 'On-Page' });
  } else {
    checks.push({ id: 'heading-h2', label: 'Missing H2 Subheadings', passed: false, points: 0, maxPoints: 3, category: 'On-Page' });
    suggestions.push('Add H2 subheadings to break up content and improve readability.');
  }

  // Clean URL check
  const hasCleanUrl = !slug.includes('?') && !slug.includes('&') && slug.length < 80;
  if (hasCleanUrl) {
    score += 5;
    checks.push({ id: 'clean-url', label: 'Clean URL Structure', passed: true, points: 5, maxPoints: 5, category: 'On-Page' });
  } else {
    checks.push({ id: 'clean-url', label: 'URL Could Be Cleaner', passed: false, points: 0, maxPoints: 5, category: 'On-Page' });
    suggestions.push('Keep URLs short, descriptive, and free of special characters.');
  }

  // ═══════════════════════════════════════════════════
  // 🔑 3. CONTENT QUALITY (max 25 points)
  // Google Helpful Content Update criteria
  // ═══════════════════════════════════════════════════

  // Content Length
  if (wordCount >= 600) {
    score += 8;
    checks.push({ id: 'content-len', label: `Content Length (${wordCount} words)`, passed: true, points: 8, maxPoints: 8, category: 'Content' });
  } else if (wordCount >= 300) {
    const pts = 4;
    score += pts;
    checks.push({ id: 'content-len', label: `Content Length (${wordCount} words)`, passed: false, points: pts, maxPoints: 8, category: 'Content' });
    suggestions.push(`Content is ${wordCount} words. Add more valuable, helpful content (aim for >600 words).`);
  } else {
    checks.push({ id: 'content-len', label: `Content Too Short (${wordCount} words)`, passed: false, points: 0, maxPoints: 8, category: 'Content' });
    suggestions.push(`Content is very short (${wordCount} words). Google Helpful Content Update favors comprehensive, in-depth pages.`);
  }

  // Internal/External Links
  const linkMatches = content.match(/<a\s[^>]*href=/gi) || [];
  const hasInternalLinks = linkMatches.some(l => !l.includes('http') || l.includes('d-arrow.com'));
  const hasExternalLinks = linkMatches.some(l => l.includes('http') && !l.includes('d-arrow.com'));

  if (hasInternalLinks && hasExternalLinks) {
    score += 6;
    checks.push({ id: 'links', label: 'Internal & External Links', passed: true, points: 6, maxPoints: 6, category: 'Content' });
  } else if (hasInternalLinks || hasExternalLinks) {
    score += 3;
    checks.push({ id: 'links', label: 'Has Some Links', passed: false, points: 3, maxPoints: 6, category: 'Content' });
    suggestions.push('Add both internal links (to your own pages) and authoritative external links for E-E-A-T signals.');
  } else {
    checks.push({ id: 'links', label: 'No Links Found', passed: false, points: 0, maxPoints: 6, category: 'Content' });
    suggestions.push('Add internal and external links. Internal links improve crawlability; external links to authoritative sources boost trust.');
  }

  // Image Alt Text (accessibility + SEO)
  const imgTags = content.match(/<img\s[^>]*>/gi) || [];
  const imgsWithAlt = imgTags.filter(img => /alt="[^"]+"/i.test(img) || /alt='[^']+'/i.test(img));

  if (imgTags.length > 0 && imgsWithAlt.length === imgTags.length) {
    score += 5;
    checks.push({ id: 'img-alt', label: 'All Images Have Alt Text', passed: true, points: 5, maxPoints: 5, category: 'Content' });
  } else if (imgTags.length > 0) {
    const ratio = imgsWithAlt.length / imgTags.length;
    const pts = Math.round(ratio * 5);
    score += pts;
    checks.push({ id: 'img-alt', label: `${imgsWithAlt.length}/${imgTags.length} Images Have Alt Text`, passed: false, points: pts, maxPoints: 5, category: 'Content' });
    suggestions.push(`${imgTags.length - imgsWithAlt.length} image(s) missing descriptive alt text. Required for accessibility and image SEO.`);
  } else {
    score += 2;
    checks.push({ id: 'img-alt', label: 'No Images on Page', passed: false, points: 2, maxPoints: 5, category: 'Content' });
    suggestions.push('Consider adding relevant images with descriptive alt text to make content more engaging.');
  }

  // Readability (sentence length heuristic)
  const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;

  if (avgSentenceLength > 0 && avgSentenceLength <= 25) {
    score += 6;
    checks.push({ id: 'readability', label: 'Good Readability', passed: true, points: 6, maxPoints: 6, category: 'Content' });
  } else if (avgSentenceLength > 25) {
    score += 3;
    checks.push({ id: 'readability', label: 'Sentences Too Long', passed: false, points: 3, maxPoints: 6, category: 'Content' });
    suggestions.push('Average sentence length is high. Write shorter, clearer sentences for better readability and user experience.');
  } else {
    checks.push({ id: 'readability', label: 'Cannot Assess Readability', passed: false, points: 0, maxPoints: 6, category: 'Content' });
  }

  // ═══════════════════════════════════════════════════
  // 🧠 4. E-E-A-T & TRUST SIGNALS (max 15 points)
  // ═══════════════════════════════════════════════════

  // Schema/Structured Data
  const hasSchema = content.includes('application/ld+json');
  if (hasSchema) {
    score += 5;
    checks.push({ id: 'schema', label: 'Has Structured Data (JSON-LD)', passed: true, points: 5, maxPoints: 5, category: 'E-E-A-T' });
  } else {
    checks.push({ id: 'schema', label: 'No Structured Data', passed: false, points: 0, maxPoints: 5, category: 'E-E-A-T' });
    suggestions.push('Add JSON-LD structured data (Schema.org) for rich snippets in search results.');
  }

  // Contact / Trust indicators
  const hasTrustSignals = /phone|email|contact|whatsapp|اتصل|تواصل/i.test(plainText);
  if (hasTrustSignals) {
    score += 5;
    checks.push({ id: 'trust', label: 'Trust Signals Present', passed: true, points: 5, maxPoints: 5, category: 'E-E-A-T' });
  } else {
    checks.push({ id: 'trust', label: 'No Trust Signals', passed: false, points: 0, maxPoints: 5, category: 'E-E-A-T' });
    suggestions.push('Include contact info, phone numbers, or trust indicators to boost E-E-A-T (Trust).');
  }

  // Social proof / Reviews
  const hasSocialProof = /review|testimonial|شهادة|عميل|تقييم|client|partner/i.test(plainText);
  if (hasSocialProof) {
    score += 5;
    checks.push({ id: 'social-proof', label: 'Social Proof / Reviews', passed: true, points: 5, maxPoints: 5, category: 'E-E-A-T' });
  } else {
    checks.push({ id: 'social-proof', label: 'No Social Proof', passed: false, points: 0, maxPoints: 5, category: 'E-E-A-T' });
    suggestions.push('Add testimonials, reviews, or partner logos to demonstrate Experience and Authoritativeness.');
  }

  // ═══════════════════════════════════════════════════
  // 📱 5. TECHNICAL / MOBILE (max 10 points)
  // ═══════════════════════════════════════════════════

  // Viewport meta tag (Mobile First Indexing)
  const hasViewport = /viewport/.test(content);
  if (hasViewport) {
    score += 5;
    checks.push({ id: 'mobile-viewport', label: 'Mobile Viewport Meta', passed: true, points: 5, maxPoints: 5, category: 'Technical' });
  } else {
    checks.push({ id: 'mobile-viewport', label: 'Missing Mobile Viewport', passed: false, points: 0, maxPoints: 5, category: 'Technical' });
    suggestions.push('Ensure the page has a viewport meta tag for Mobile First Indexing.');
  }

  // Canonical URL
  const hasCanonical = /rel="canonical"/i.test(content) || /rel='canonical'/i.test(content);
  if (hasCanonical) {
    score += 5;
    checks.push({ id: 'canonical', label: 'Canonical URL Set', passed: true, points: 5, maxPoints: 5, category: 'Technical' });
  } else {
    checks.push({ id: 'canonical', label: 'Missing Canonical URL', passed: false, points: 0, maxPoints: 5, category: 'Technical' });
    suggestions.push('Set a canonical URL to avoid duplicate content penalties.');
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    checks,
    suggestions
  };
}
