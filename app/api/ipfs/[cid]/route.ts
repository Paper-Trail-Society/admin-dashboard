import { NextRequest, NextResponse } from "next/server";

const PINATA_GATEWAY_URL = process.env.PINATA_GATEWAY_URL;
const PINATA_GATEWAY_KEY = process.env.PINATA_GATEWAY_KEY;

export const GET = async (_: NextRequest, { params }: { params: Promise<{ cid: string }>}) => {
  const { cid } = await params;

  if (!cid || typeof cid !== "string") {
    return NextResponse.json({ error: "CID is required" }, { status: 400});
  }

  if (!PINATA_GATEWAY_KEY || !PINATA_GATEWAY_URL) {
    throw new Error("Environment variables [PINATA_GATEWAY_KEY] or [PINATA_GATEWAY_URL] is not defined");
  }

  try {
    const response = await fetch(`${PINATA_GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${PINATA_GATEWAY_KEY}`, {
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Pinata: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();

    return new Response(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/octet-stream",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
