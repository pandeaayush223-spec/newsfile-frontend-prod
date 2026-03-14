export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    if (!q) {
      return Response.json({ error: 'Search query required' }, { status: 400 });
    }
    
    const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Failed to search');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return Response.json({ error: 'Failed to search' }, { status: 500 });
  }
}
