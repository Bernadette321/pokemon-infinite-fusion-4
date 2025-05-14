/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PokeAPI/sprites/master/sprites/pokemon/**',
      }
    ],
    unoptimized: true, // 禁用图片优化以支持大量精灵图片
  },
  output: 'standalone', // 生成独立构建，包含所有所需资产
};

module.exports = nextConfig; 