const mockStats: Record<string, any> = {
  '1': {
    summary: 'This AI breakthrough article has strong engagement metrics with high readership across tech communities.',
    stats: [
      { label: 'Views', value: 2450 },
      { label: 'Shares', value: 380 },
      { label: 'Comments', value: 156 },
      { label: 'Read Time (min)', value: 8 },
    ],
    chart_data: [
      { name: 'Mon', value: 240 },
      { name: 'Tue', value: 380 },
      { name: 'Wed', value: 220 },
      { name: 'Thu', value: 290 },
      { name: 'Fri', value: 380 },
      { name: 'Sat', value: 200 },
      { name: 'Sun', value: 340 },
    ],
    key_facts: [
      'Featured in 3 major tech publications',
      'Trending in AI and Machine Learning communities',
      'Average read time: 8 minutes',
      '92% completion rate',
      'Shared 380 times across social media',
    ],
  },
  '2': {
    summary: 'Market analysis article with strong financial sector interest.',
    stats: [
      { label: 'Views', value: 1850 },
      { label: 'Shares', value: 290 },
      { label: 'Comments', value: 98 },
      { label: 'Read Time (min)', value: 6 },
    ],
    chart_data: [
      { name: 'Mon', value: 180 },
      { name: 'Tue', value: 290 },
      { name: 'Wed', value: 165 },
      { name: 'Thu', value: 220 },
      { name: 'Fri', value: 290 },
      { name: 'Sat', value: 150 },
      { name: 'Sun', value: 260 },
    ],
    key_facts: [
      'Popular among finance professionals',
      'Linked in 47 financial blogs',
      'High engagement from institutional traders',
      'Average read time: 6 minutes',
      '88% completion rate',
    ],
  },
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "https://newsfile-backend.fly.dev"}/articles/${id}/stats`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    // Return mock stats or default mock
    const { id } = await params;
    const mockData = mockStats[id] || {
      summary: 'Article statistics are not available.',
      stats: [
        { label: 'Views', value: 0 },
        { label: 'Shares', value: 0 },
      ],
      chart_data: [],
      key_facts: ['Please ensure your FastAPI backend is running at ${process.env.NEXT_PUBLIC_API_URL ?? "https://newsfile-backend.fly.dev"}'],
    };
    return Response.json(mockData);
  }
}
