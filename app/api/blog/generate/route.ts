import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getBlogDataPath = () => {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'blog-posts.json');
};

// Blog topics for D-Arrow - Digital Marketing Agency
const blogTopics = [
  'Latest trends in digital marketing',
  'How AI is transforming digital marketing',
  'Social media marketing best practices',
  'SEO strategies for 2024',
  'Content marketing that converts',
  'Email marketing automation tips',
  'Influencer marketing ROI',
  'Video marketing strategies',
  'Mobile-first marketing approach',
  'Data-driven decision making in marketing',
  'Customer relationship management tips',
  'Growth hacking techniques',
  'Brand positioning strategies',
  'Marketing automation tools review',
  'Real estate digital marketing trends',
  'E-commerce optimization strategies',
  'Customer experience in digital age',
  'Marketing analytics and metrics',
  'Omnichannel marketing strategy',
  'Personalization in digital marketing',
];

const categories = ['Digital Marketing', 'AI & Technology', 'Innovation', 'Business', 'Strategy', 'Tips & Tricks'];

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Starting blog post generation with ZAI API...');

    const apiKey = process.env.ZAI_API_KEY;
    const apiBase = process.env.ZAI_API_BASE || 'https://api.z.ai/v1';
    const model = process.env.ZAI_MODEL || 'glm-4.5-air';

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'ZAI_API_KEY is not configured',
      }, { status: 400 });
    }

    // Select random topic and category
    const topic = blogTopics[Math.floor(Math.random() * blogTopics.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const prompt = `Generate a professional blog post for a digital marketing agency called D-Arrow. 

Topic: ${topic}
Category: ${category}

Please create BOTH English and Arabic versions:

ENGLISH VERSION:
1. A compelling title (max 100 characters)
2. A brief excerpt (2-3 sentences)
3. Main content (300-400 words) in professional tone

ARABIC VERSION (الإصدار العربي):
1. عنوان جذاب (100 حرف كحد أقصى)
2. ملخص قصير (جملتان إلى 3 جمل)
3. محتوى رئيسي (300-400 كلمة) بنبرة احترافية

Format the response as JSON with keys: 
{
  "title": "English Title",
  "titleAr": "العنوان بالعربية",
  "excerpt": "English excerpt",
  "excerptAr": "الملخص بالعربية",
  "content": "English content",
  "contentAr": "المحتوى بالعربية"
}

Make it informative, engaging, and optimized for web readers in BOTH languages.`;

    console.log(`📝 Topic: ${topic}`);
    console.log(`🏷️ Category: ${category}`);
    console.log(`🔗 API Base: ${apiBase}`);

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional blog writer for a digital marketing agency. Generate high-quality, SEO-optimized blog content.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ API Error:', response.status, errorData);
      return NextResponse.json({
        success: false,
        error: `API error: ${response.status}`,
        details: errorData,
      }, { status: 500 });
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No content generated from AI');
    }

    console.log('✅ AI Response received');

    // Parse JSON from AI response
    let parsedContent = { 
      title: '', 
      titleAr: '',
      excerpt: '', 
      excerptAr: '',
      content: '',
      contentAr: ''
    };
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if AI didn't format as JSON
        parsedContent = {
          title: topic,
          titleAr: topic,
          excerpt: aiContent.substring(0, 150),
          excerptAr: aiContent.substring(0, 150),
          content: aiContent,
          contentAr: aiContent,
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON, using raw content');
      parsedContent = {
        title: topic,
        titleAr: topic,
        excerpt: aiContent.substring(0, 150),
        excerptAr: aiContent.substring(0, 150),
        content: aiContent,
        contentAr: aiContent,
      };
    }

    // Create blog post
    const blogPost = {
      id: `post-${Date.now()}`,
      title: parsedContent.title || topic,
      titleAr: parsedContent.titleAr || topic,
      content: parsedContent.content || aiContent,
      contentAr: parsedContent.contentAr || aiContent,
      excerpt: parsedContent.excerpt || aiContent.substring(0, 150),
      excerptAr: parsedContent.excerptAr || aiContent.substring(0, 150),
      author: 'D-Arrow AI',
      category: category,
      imageUrl: null,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      readTime: Math.ceil((parsedContent.content || aiContent).split(' ').length / 200),
    };

    // Save to blog posts file
    const filePath = getBlogDataPath();
    let fileData: { posts: any[], lastGenerated: string | null } = { posts: [], lastGenerated: null };

    if (fs.existsSync(filePath)) {
      try {
        fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {
        console.warn('Failed to parse existing blog data, creating new');
      }
    }

    if (!fileData.posts) {
      fileData.posts = [];
    }
    fileData.posts.push(blogPost);
    fileData.lastGenerated = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

    console.log(`✅ Blog post saved: ${blogPost.id}`);

    return NextResponse.json({
      success: true,
      message: 'Blog post generated successfully',
      post: blogPost,
    });
  } catch (error) {
    console.error('❌ Error generating blog post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate blog post',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
