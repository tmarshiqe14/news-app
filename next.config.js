/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      // Real article image domains
      {
        protocol: 'https',
        hostname: 'www.cnx-software.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'biztoc.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.etimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.global.news.samsung.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.snopes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mediaproxy.snopes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sportshub.cbsistatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static-www.elastic.co',
        port: '',
        pathname: '/**',
      },
      // Allow any subdomain for common news sites
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.digitalcommerce360.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.wired.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sixcolors.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.salon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bleedingcool.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gizmodo.com',
        port: '',
        pathname: '/**',
      },
      // Flexible patterns for major news publishers
      {
        protocol: 'https',
        hostname: '*.techcrunch.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wired.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.theverge.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.arstechnica.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.venturebeat.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.fastly.com',
        port: '',
        pathname: '/**',
      },
      // News site image domains
      {
        protocol: 'https',
        hostname: 'www.pymnts.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.casinoreports.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.fairobserver.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.insurancejournal.com',
        port: '',
        pathname: '/**',
      },
      // Catch-all for common image CDNs
      {
        protocol: 'https',
        hostname: '*.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.giphy.com',
        port: '',
        pathname: '/**',
      },
      // Generic patterns for common domains
      {
        protocol: 'https',
        hostname: '*.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '*.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig
