import { NextResponse } from 'next/server';

// Mock user credentials for demo evaluation
const DEMO_USER = {
  email: 'test@example.com',
  password: '123456',
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Small delay to simulate network latency and test loading spinners
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      return NextResponse.json({
        user: { 
          email: DEMO_USER.email,
          name: 'Demo Admin',
        },
        token: 'eyego-session-token-demo-xyz987',
      });
    }

    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Invalid request payload' },
      { status: 400 }
    );
  }
}
