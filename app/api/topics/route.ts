const mockTopics = [
  { topic: 'Technology', count: 45 },
  { topic: 'Business', count: 32 },
  { topic: 'Science', count: 28 },
  { topic: 'Health', count: 24 },
  { topic: 'Politics', count: 19 },
];

export async function GET() {
  try {
    const res = await fetch('http://localhost:8000/topics');
    if (!res.ok) throw new Error('Failed to fetch topics');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    // Return mock data if backend is unavailable
    return Response.json(mockTopics);
  }
}
