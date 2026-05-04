const BASE = process.env.MUAPI_BASE_URL || 'https://api.muapi.ai';

async function pollResult(id: string, key: string): Promise<string> {
  for (let i = 0; i < 900; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const r = await fetch(`${BASE}/api/v1/status/${id}`, { headers: { 'x-api-key': key } });
    const d = await r.json();
    if (d.status === 'completed' && d.output) return d.output as string;
    if (d.status === 'failed') throw new Error(d.error || 'Generation failed');
  }
  throw new Error('Timed out');
}

async function submit(endpoint: string, payload: Record<string, unknown>, key: string): Promise<string> {
  const r = await fetch(`${BASE}/api/v1/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`muapi ${r.status}`);
  const d = await r.json();
  return pollResult(d.request_id || d.id, key);
}

export class SynthiaMediaClient {
  constructor(private key: string) {}

  image(params: { model: string; prompt: string; aspect_ratio?: string; image_url?: string }) {
    return submit(params.model, params, this.key);
  }

  video(params: { model: string; prompt: string; duration?: number; aspect_ratio?: string; image_url?: string }) {
    return submit(params.model, params, this.key);
  }

  cinema(params: { prompt: string; camera: string; lens: string; focal?: number; aperture?: string }) {
    const CAMERAS: Record<string, string> = {
      'Full-Frame Cine Digital': 'full-frame digital cinema camera',
      'Studio Digital S35': 'Super 35 studio digital camera',
      'Premium Large Format Digital': 'premium large-format digital cinema camera',
    };
    const LENSES: Record<string, string> = {
      'Compact Anamorphic': 'compact anamorphic lens',
      'Warm Cinema Prime': 'warm-toned cinema prime lens',
      'Halation Diffusion': 'halation diffusion filter',
    };
    const APERTURES: Record<string, string> = {
      'f/1.4': 'shallow depth of field, creamy bokeh',
      'f/4': 'balanced depth of field',
      'f/11': 'deep focus clarity',
    };
    const full = [
      params.prompt,
      CAMERAS[params.camera] ? `shot on ${CAMERAS[params.camera]}` : '',
      LENSES[params.lens] ? `with ${LENSES[params.lens]}` : '',
      params.focal ? `${params.focal}mm` : '',
      params.aperture ? APERTURES[params.aperture] || '' : '',
      'cinematic, professional color grade, 4K',
    ].filter(Boolean).join(', ');
    return submit('flux-dev', { prompt: full, aspect_ratio: '16:9' }, this.key);
  }

  lipSync(video_url: string, audio_url: string) {
    return submit('lip-sync', { video_url, audio_url }, this.key);
  }

  marketing(params: { product_image_url: string; style: string; prompt: string }) {
    return submit('marketing-studio', params, this.key);
  }
}
