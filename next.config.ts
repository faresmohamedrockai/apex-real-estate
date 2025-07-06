import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
     images: {
    domains: ['res.cloudinary.com','example.com','unpkg.com']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);