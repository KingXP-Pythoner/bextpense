import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// experimental: {
	// 	useCache: true,
	// 	dynamicIO: true,
	// },
	/* config options here */
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
