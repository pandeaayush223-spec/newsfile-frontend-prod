const mockArticles = [
  { id: 1, title: 'New AI Model Achieves Breakthrough Results', source: 'TechNews', topic: 'Technology', url: '#', word_count: 850 },
  { id: 2, title: 'Market Analysis: Q1 Performance Review', source: 'BusinessToday', topic: 'Business', url: '#', word_count: 720 },
  { id: 3, title: 'Scientists Discover Novel Protein Structure', source: 'ScienceDaily', topic: 'Science', url: '#', word_count: 620 },
  { id: 4, title: 'Health Experts Release New Guidelines', source: 'HealthWatch', topic: 'Health', url: '#', word_count: 580 },
  { id: 5, title: 'Tech Giants Report Strong Earnings', source: 'TechNews', topic: 'Technology', url: '#', word_count: 890 },
  { id: 6, title: 'New Climate Policy Takes Effect', source: 'Politics', topic: 'Politics', url: '#', word_count: 920 },
  { id: 7, title: 'Breakthrough in Quantum Computing', source: 'TechNews', topic: 'Technology', url: '#', word_count: 750 },
  { id: 8, title: 'Healthcare Innovation Trends 2024', source: 'HealthWatch', topic: 'Health', url: '#', word_count: 640 },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    if (!q) {
      return Response.json({ error: 'Search query required' }, { status: 400 });
    }
    
    const res = await fetch(`https://newsfile-backend.fly.dev/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Failed to search');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    // Return mock search results filtered by query
    const q = new URL(request.url).searchParams.get('q') || '';
    const filtered = mockArticles.filter(a => 
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      a.source.toLowerCase().includes(q.toLowerCase())
    );
    return Response.json(filtered);
  }
}
