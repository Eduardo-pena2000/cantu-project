import { NextResponse } from "next/server";
import { auth } from "@/auth";
import crypto from "crypto";

function generateSignature(params, apiSecret) {
    const sortedKeys = Object.keys(params).sort();
    const stringToSign = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
    return crypto.createHash("sha1").update(stringToSign + apiSecret).digest("hex");
}

export const POST = auth(async function POST(request) {
    try {
        if (!request.auth) {
            return new NextResponse(
                JSON.stringify({ status: 401, error: { message: "No autenticado" } }),
                { status: 401 }
            );
        }

        if (!request.auth.store) {
            return new NextResponse(
                JSON.stringify({ status: 403, error: { message: "No autorizado. Requiere estar asignado a una tienda." } }),
                { status: 403 }
            );
        }

        const contentType = request.headers.get("content-type") || "";
        let payload;

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            const title = formData.get("title");
            const description = formData.get("description");
            const category = formData.get("category");
            const priority = formData.get("priority");
            const storeId = Number(formData.get("storeId"));
            const imageFile = formData.get("image");

            let imageUrl = null;

            // Upload image to Cloudinary if provided (signed upload)
            if (imageFile && imageFile.size > 0) {
                try {
                    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
                    const apiKey = process.env.CLOUDINARY_API_KEY;
                    const apiSecret = process.env.CLOUDINARY_SECRET;

                    const timestamp = Math.round(Date.now() / 1000);
                    const paramsToSign = { folder: "incidents", timestamp };
                    const signature = generateSignature(paramsToSign, apiSecret);

                    const bytes = await imageFile.arrayBuffer();
                    const buffer = Buffer.from(bytes);

                    const uploadForm = new FormData();
                    uploadForm.append("file", new Blob([buffer], { type: imageFile.type }), imageFile.name);
                    uploadForm.append("folder", "incidents");
                    uploadForm.append("timestamp", String(timestamp));
                    uploadForm.append("api_key", apiKey);
                    uploadForm.append("signature", signature);

                    const cloudRes = await fetch(
                        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                        {
                            method: "POST",
                            body: uploadForm,
                        }
                    );

                    if (cloudRes.ok) {
                        const cloudData = await cloudRes.json();
                        imageUrl = cloudData.secure_url;
                    } else {
                        const errText = await cloudRes.text();
                        console.error("Cloudinary upload failed:", cloudRes.status, errText);
                    }
                } catch (uploadErr) {
                    console.error("Error uploading image to Cloudinary:", uploadErr);
                }
            }

            payload = { title, description, category, priority, storeId, imageUrl };
        } else {
            payload = await request.json();
        }

        const res = await fetch(`${process.env.API_URL}/api/incidents`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${request.auth.accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return new NextResponse(
                JSON.stringify({
                    status: res.status,
                    error: { message: errorData.error || "Hubo un error al registrar la incidencia." },
                }),
                { status: res.status }
            );
        }

        const json = await res.json();

        return new NextResponse(
            JSON.stringify({ status: res.status, body: json.body || json }),
            { status: res.status }
        );
    } catch (error) {
        console.error("Incident proxy error:", error);
        return new NextResponse(
            JSON.stringify({ error: { message: "Hubo un error interno al registrar la incidencia." } }),
            { status: 500 }
        );
    }
});
