import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('predictionId');

    if (!predictionId) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      );
    }

    const prediction = await replicate.predictions.get(predictionId);

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Error checking prediction status:', error);
    return NextResponse.json(
      { error: 'Failed to check prediction status' },
      { status: 500 }
    );
  }
} 