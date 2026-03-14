export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`http://localhost:8000/articles/${id}`);
    if (!res.ok) throw new Error('Failed to fetch article');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('Article detail API error:', error);
    return Response.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}
