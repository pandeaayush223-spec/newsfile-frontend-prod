export async function POST() {
  try {
    const res = await fetch('${process.env.NEXT_PUBLIC_API_URL ?? "https://newsfile-backend.fly.dev"}/scheduler/run-now', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to run scheduler');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { 
        error: 'Backend server is not running',
        message: 'Please ensure your FastAPI server is running at ${process.env.NEXT_PUBLIC_API_URL ?? "https://newsfile-backend.fly.dev"}',
      }, 
      { status: 503 }
    );
  }
}
