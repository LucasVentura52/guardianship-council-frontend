import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveRemoteImageUrl } from '../../lib/image-url';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const src = Array.isArray(req.query.src) ? req.query.src[0] : req.query.src;

  if (!src) {
    res.status(400).json({ message: 'Parâmetro src é obrigatório.' });
    return;
  }

  const targetUrl = resolveRemoteImageUrl(src);

  if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
    res.status(400).json({ message: 'URL de imagem inválida.' });
    return;
  }

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      res.status(response.status).json({ message: 'Imagem não encontrada.' });
      return;
    }

    const contentType = response.headers.get('content-type');
    const cacheControl = response.headers.get('cache-control');
    const buffer = Buffer.from(await response.arrayBuffer());

    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    res.setHeader('Cache-Control', cacheControl || 'public, s-maxage=86400, stale-while-revalidate=604800');
    res.status(200).send(buffer);
  } catch {
    res.status(502).json({ message: 'Não foi possível carregar a imagem.' });
  }
}
