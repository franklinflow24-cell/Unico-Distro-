let submissions: any[] = [];

export async function GET() {
  return Response.json(submissions);
}

export async function POST(req: Request) {
  const data = await req.json();
  const nuevo = {
    id: Date.now(),
    title: data.title,
    artist: data.artist,
    email: data.email,
    whatsapp: data.whatsapp,
    genre: data.genre,
    fecha: new Date().toISOString(),
  };
  submissions.unshift(nuevo);
  return Response.json({ ok: true, id: nuevo.id });
}
