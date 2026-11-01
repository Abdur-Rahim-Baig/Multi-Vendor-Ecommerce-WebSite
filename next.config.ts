import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {},
};

const payloadConfig = withPayload(nextConfig);
const experimental = {
  ...(payloadConfig.experimental ?? {}),
} as Record<string, unknown>;

delete experimental.turbo;

export default {
  ...payloadConfig,
  experimental,
} satisfies NextConfig;
