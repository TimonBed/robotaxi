import { NextResponse } from 'next/server'

function isAllowedUrl(u: string) {
  try {
    const parsed = new URL(u)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url || !isAllowedUrl(url)) {
    return new NextResponse('Invalid url', { status: 400 })
  }
  try {
    const upstream = await fetch(url, {
      headers: {
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store',
      redirect: 'follow'
    })
    if (!upstream.ok) {
      return new NextResponse(`Upstream ${upstream.status}`, { status: 502 })
    }
    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    if (!contentType.startsWith('image/')) {
      return new NextResponse('Not an image', { status: 400 })
    }
    const buf = await upstream.arrayBuffer()
    return new NextResponse(buf, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store'
      }
    })
  } catch (e) {
    return new NextResponse('Fetch failed', { status: 500 })
  }
}


