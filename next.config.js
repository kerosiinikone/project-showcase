/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
