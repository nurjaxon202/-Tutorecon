const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an internal path with the deploy base and keep the trailing slash on the path part. */
export function url(path = '/'): string {
  const [beforeHash, hash] = path.split('#');
  const [pathname, query] = beforeHash.split('?');
  let p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
  return `${base}${p}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}
