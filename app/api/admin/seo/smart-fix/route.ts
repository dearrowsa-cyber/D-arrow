import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MODEL = 'glm-4-flash';

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function askAI(prompt: string, apiKey: string) {
  const response = await fetchWithTimeout(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: 'You are an expert SEO Agent. You output ONLY valid JSON without any markdown formatting or comments.' }, { role: 'user', content: prompt }],
      temperature: 0.3
    })
  }, 60000);

  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  try {
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse AI response as JSON:', text);
    throw new Error('AI did not return valid JSON');
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return NextResponse.json({ success: false, error: 'ZAI_API_KEY is missing.' }, { status: 400 });
    }

    // Find up to 5 SeoMeta records that need fixing based on missing fields OR existing audit log errors
    const targets = await prisma.seoMeta.findMany({
      where: {
        OR: [
          { title: null }, { title: '' },
          { description: null }, { description: '' },
          { focusKeyword: null }, { focusKeyword: '' },
          { auditLogs: { some: { issuesCount: { gt: 0 } } } }
        ]
      },
      take: 5
    });

    if (targets.length === 0) {
      return NextResponse.json({ success: true, stats: { fixedPosts: 0, fixedProducts: 0, fixedPages: 0 }, message: 'لا توجد صفحات تحتاج لإصلاح حالياً.' });
    }

    let fixedPosts = 0;
    let fixedProducts = 0;
    let fixedPages = 0;

    for (const target of targets) {
      let pageType = 'static';
      let contentToAnalyze = '';
      let recordId = null;

      if (target.slug.startsWith('/blog/')) {
        pageType = 'blog';
        const slug = target.slug.replace('/blog/', '');
        const post = await prisma.blogPost.findUnique({ where: { slug } });
        if (post) {
          contentToAnalyze = post.content;
          recordId = post.id;
        }
      } else if (target.slug.startsWith('/store/')) {
        pageType = 'product';
        const slug = target.slug.replace('/store/', '').replace('products/', '');
        const product = await prisma.product.findUnique({ where: { slug } });
        if (product) {
          contentToAnalyze = product.description || product.name;
          recordId = product.id;
        }
      } else {
        pageType = 'static';
        contentToAnalyze = `This is the ${target.slug} page of D-Arrow digital marketing agency.`;
      }

      // Prepare AI Prompt
      const prompt = `Analyze the following content for the page "${target.slug}".
Page Type: ${pageType}
Content Preview: ${contentToAnalyze.substring(0, 1500)}...

Your task:
1. Generate an SEO-optimized Arabic Title (40-60 chars).
2. Generate an SEO-optimized Arabic Meta Description (120-160 chars) using marketing copywriting.
3. Suggest the single most important Focus Keyword in Arabic.
${pageType !== 'static' ? `4. Fix the HTML content: Add descriptive 'alt' attributes to any <img> tags that lack them, ensure there is exactly one <h1>, and weave the focus keyword naturally into the text.` : ''}

Output strictly as JSON in the following format:
{
  "title": "...",
  "description": "...",
  "focusKeyword": "...",
  "fixedContent": "..." // Only if pageType is not static. If static, return empty string.
}`;

      try {
        const aiResult = await askAI(prompt, apiKey);

        // Update SeoMeta
        await prisma.seoMeta.update({
          where: { id: target.id },
          data: {
            title: aiResult.title || target.title,
            description: aiResult.description || target.description,
            focusKeyword: aiResult.focusKeyword || target.focusKeyword
          }
        });

        // Update Content if applicable
        if (pageType === 'blog' && recordId && aiResult.fixedContent) {
          await prisma.blogPost.update({
            where: { id: recordId },
            data: { content: aiResult.fixedContent }
          });
          fixedPosts++;
        } else if (pageType === 'product' && recordId && aiResult.fixedContent) {
          await prisma.product.update({
            where: { id: recordId },
            data: { description: aiResult.fixedContent }
          });
          fixedProducts++;
        } else {
          fixedPages++;
        }

      } catch (aiErr) {
        console.error(`Failed to auto-fix ${target.slug}:`, aiErr);
      }
    }

    return NextResponse.json({
      success: true,
      stats: { fixedPosts, fixedProducts, fixedPages }
    });

  } catch (error: any) {
    console.error('Smart Auto-Fix API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error', debug: error.message }, { status: 500 });
  }
}
