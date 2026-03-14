export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    
    const url = new URL('http://localhost:8000/articles');
    if (topic) url.searchParams.append('topic', topic);
    
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch articles');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('Articles API error:', error);
    return Response.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
