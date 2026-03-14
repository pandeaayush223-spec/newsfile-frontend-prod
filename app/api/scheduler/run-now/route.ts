export async function POST() {
  try {
    const res = await fetch('http://localhost:8000/scheduler/run-now', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to run scheduler');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('Scheduler API error:', error);
    return Response.json({ error: 'Failed to run scheduler' }, { status: 500 });
  }
}
