export async function GET() {
  try {
    const res = await fetch('http://localhost:8000/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('Stats API error:', error);
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
