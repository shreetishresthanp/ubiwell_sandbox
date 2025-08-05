import fs from 'fs';
import path from 'path';

export async function POST(req, { params }) {
    const { uid } = params;
  const data = await req.json();

  const filePath = path.join(process.cwd(), 'public', 'settings', `${uid}.json`);

  try {
    // Write updated JSON to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return new Response(JSON.stringify({ message: 'Settings updated' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error writing JSON:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update settings' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
