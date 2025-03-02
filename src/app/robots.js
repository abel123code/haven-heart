export default function robots() {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/home', 'admin'],
        },
      ],
      sitemap: 'https://www.havenheartsg.org/sitemap.xml',
    };
}
  