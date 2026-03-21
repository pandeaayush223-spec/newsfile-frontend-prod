const mockFullArticles: Record<string, any> = {
  '1': {
    id: 1,
    title: 'New AI Model Achieves Breakthrough Results',
    source: 'TechNews',
    topic: 'Technology',
    url: '#',
    word_count: 850,
    full_text: 'Researchers have announced a groundbreaking new AI model that achieves state-of-the-art results across multiple benchmarks. The model demonstrates unprecedented capabilities in natural language understanding and reasoning. This breakthrough could have significant implications for various industries including healthcare, finance, and software development.',
  },
  '2': {
    id: 2,
    title: 'Market Analysis: Q1 Performance Review',
    source: 'BusinessToday',
    topic: 'Business',
    url: '#',
    word_count: 720,
    full_text: 'Markets showed strong performance in the first quarter with major indices reaching record highs. Analysts attribute this to strong corporate earnings and positive economic indicators. The technology sector led gains, followed by healthcare and consumer discretionary stocks.',
  },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`https://newsfile-backend.fly.dev/articles/${id}`);
    if (!res.ok) throw new Error('Failed to fetch article');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    // Return mock article or default mock
    const { id } = await params;
    const mockArticle = mockFullArticles[id] || {
      id,
      title: 'Article',
      source: 'Unknown',
      topic: 'General',
      url: '#',
      word_count: 0,
      full_text: 'This is a sample article. Please ensure your FastAPI backend is running at https://newsfile-backend.fly.dev to see real content.',
    };
    return Response.json(mockArticle);
  }
}
