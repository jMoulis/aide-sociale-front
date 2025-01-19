import { NextResponse } from 'next/server'
// import { del } from '@vercel/blob';

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const _urlToDelete = searchParams.get('url') as string;
  // await del(urlToDelete);

  return NextResponse.json({ message: 'success' });
}