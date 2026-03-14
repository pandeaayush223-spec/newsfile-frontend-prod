const mockStats = {
  total_articles: 148,
  total_topics: 5,
  last_updated: new Date().toISOString(),
  articles_today: 12,
};

export async function GET() {
  try {
    const res = await fetch('http://localhost:8000/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(mockStats);
  }
}
