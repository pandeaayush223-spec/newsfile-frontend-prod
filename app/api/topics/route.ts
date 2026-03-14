export async function GET() {
  try {
    const res = await fetch('http://localhost:8000/topics');
    if (!res.ok) throw new Error('Failed to fetch topics');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('Topics API error:', error);
    return Response.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}
