export async function POST() {
  try {
    const res = await fetch('http://localhost:8000/scheduler/run-now', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to run scheduler');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { 
        error: 'Backend server is not running',
        message: 'Please ensure your FastAPI server is running at http://localhost:8000',
      }, 
      { status: 503 }
    );
  }
}
