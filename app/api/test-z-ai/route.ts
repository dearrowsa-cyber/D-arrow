import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: '✅ Test API route working',
    timestamp: new Date().toISOString(),
    apiKey: process.env.ZAI_API_KEY ? '✅ Configured' : '❌ Not found',
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log('\n🧪 ========== Z.ai API TEST START ==========');
    console.log('📋 Testing Z.ai API Connection...');

    const apiKey = process.env.ZAI_API_KEY;
    const apiBase = process.env.ZAI_API_BASE || 'https://api.z.ai/v1';
    const model = process.env.ZAI_MODEL || 'glm-4.5-air';

    console.log(`📌 API Key: ${apiKey ? apiKey.substring(0, 20) + '...' : 'NOT CONFIGURED'}`);
    console.log(`📌 Base URL: ${apiBase}`);
    console.log(`📌 Model: ${model}`);

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'ZAI_API_KEY not configured in .env.local',
          details: 'Please add ZAI_API_KEY to your .env.local file',
        },
        { status: 400 }
      );
    }

    const testMessage = 'Hello, what services does D-Arrow offer?';
    const endpointUrl = `${apiBase}/chat/completions`;

    console.log(`\n🔄 Sending test request to: ${endpointUrl}`);
    console.log(`📝 Test message: "${testMessage}"`);
    console.log(`🎯 Model: ${model}`);

    const startTime = Date.now();

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: testMessage,
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
      }),
    });

    const elapsedTime = Date.now() - startTime;

    console.log(`\n📊 Response Status: ${response.status}`);
    console.log(`⏱️ Response Time: ${elapsedTime}ms`);

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw: responseText.substring(0, 500) };
    }

    console.log(`📦 Response Data:`, JSON.stringify(responseData, null, 2));

    if (response.ok) {
      const reply = responseData.choices?.[0]?.message?.content || responseData.choices?.[0]?.text;
      console.log(`\n✅ SUCCESS! AI Response: ${reply?.substring(0, 100)}...`);
      console.log('🧪 ========== Z.ai API TEST PASSED ==========\n');

      return NextResponse.json(
        {
          success: true,
          message: 'Z.ai API is working correctly',
          details: {
            endpoint: endpointUrl,
            model: model,
            responseTime: `${elapsedTime}ms`,
            aiReply: reply,
            fullResponse: responseData,
          },
        },
        { status: 200 }
      );
    } else {
      console.error(`\n❌ FAILED! Status: ${response.status}`);
      console.error(`Response:`, responseData);
      console.log('🧪 ========== Z.ai API TEST FAILED ==========\n');

      return NextResponse.json(
        {
          success: false,
          error: `Z.ai API returned status ${response.status}`,
          details: {
            endpoint: endpointUrl,
            status: response.status,
            responseTime: `${elapsedTime}ms`,
            errorResponse: responseData,
          },
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('\n💥 Test Error:', error);
    console.log('🧪 ========== Z.ai API TEST ERROR ==========\n');

    return NextResponse.json(
      {
        success: false,
        error: 'Test request failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
