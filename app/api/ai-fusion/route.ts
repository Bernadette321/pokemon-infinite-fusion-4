import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// 验证环境变量
console.log('Environment check:', {
  hasReplicateToken: !!process.env.REPLICATE_API_TOKEN,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
});

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('REPLICATE_API_TOKEN is not set in environment variables');
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// 新的目标模型标识符
const TARGET_MODEL_IDENTIFIER = "recraft-ai/recraft-v3"; 

export async function POST(request: Request) {
  try {
    // 记录请求开始
    console.log(`Starting AI fusion request (using ${TARGET_MODEL_IDENTIFIER} with predictions.create())...`);

    // 解析请求体
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed successfully:', { 
        headId: body.headId, 
        bodyId: body.bodyId, 
        promptLength: body.prompt?.length || 0 
      });
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { headId, bodyId, prompt } = body;

    // 验证必要的参数
    if (!headId || !bodyId) {
      console.error('Missing required parameters:', { headId, bodyId });
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 获取宝可梦数据 (仅用于构建prompt)
    let baseUrl = 'http://localhost:3000'; // Default for local development
    if (process.env.VERCEL_URL) { // VERCEL_URL is set by Vercel for the deployment URL (without protocol)
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) { // Fallback to user-defined NEXT_PUBLIC_BASE_URL
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    }
    const pokedexUrl = `${baseUrl}/pokedex_with_fusion_stats.json`;
    
    let pokedexData;
    try {
      const pokedexResponse = await fetch(pokedexUrl);
      if (!pokedexResponse.ok) throw new Error(`Pokedex fetch failed: ${pokedexResponse.status}`);
      pokedexData = await pokedexResponse.json();
    } catch (e) {
      console.error('Failed to fetch or parse pokedex data:', e);
      // Fallback, or decide if this is critical enough to stop
      // For now, we will proceed and the prompt will be less specific if data is missing
    }

    let generatedPrompt = `Pokemon fusion`; // Default prompt
    if (pokedexData && headId && bodyId) {
        const headPokemon = pokedexData.find((p: any) => p.id === headId);
        const bodyPokemon = pokedexData.find((p: any) => p.id === bodyId);
        if (headPokemon && bodyPokemon) {
            // Updated prompt to be more specific about head and body
            generatedPrompt = `A Pokémon with the head of ${headPokemon.name.english} (head component) and the body of ${bodyPokemon.name.english} (body component), digital art, detailed. ${prompt || ''}`;
        }
    }
    console.log('Generated prompt for recraft-ai/recraft-v3:', generatedPrompt);

    // 使用 predictions.create() 调用 recraft-ai/recraft-v3 模型
    // 注意：recraft-v3 可能不需要 version 哈希，可以直接用 model 标识符
    // 它的输入参数也可能不同，这里我们先尝试只用 prompt
    console.log('Creating prediction with model identifier:', {
      model: TARGET_MODEL_IDENTIFIER,
      prompt: generatedPrompt
    });

    let prediction;
    try {
      prediction = await replicate.predictions.create({
        model: TARGET_MODEL_IDENTIFIER, 
        input: { prompt: generatedPrompt }
        // 如果 recraft-v3 需要特定的版本哈希，或者其他输入参数，这里需要调整
      });
      
      console.log('Prediction creation initiated successfully with recraft-ai/recraft-v3:', {
        id: prediction.id,
        status: prediction.status,
        modelUsed: prediction.model 
      });
      
      return NextResponse.json({ predictionId: prediction.id });

    } catch (e) {
      console.error('Failed to create prediction with recraft-ai/recraft-v3:', {
        error: e,
        model: TARGET_MODEL_IDENTIFIER,
        prompt: generatedPrompt
      });
      return NextResponse.json(
        { 
          error: `Failed to create prediction with Replicate using ${TARGET_MODEL_IDENTIFIER}`,
          details: e instanceof Error ? e.message : String(e)
        },
        { status: 500 }
      );
    }

  } catch (error) {
    // 详细的错误日志
    console.error('Error in /api/ai-fusion:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    // 返回更具体的错误信息
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate image',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 