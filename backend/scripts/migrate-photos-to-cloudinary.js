/**
 * Script one-shot: Descarga fotos de Google Docs y las sube a Cloudinary.
 * Genera employees-cloudinary.json con URLs permanentes.
 * 
 * Uso: node scripts/migrate-photos-to-cloudinary.js
 */

const { v2: cloudinary } = require("cloudinary");
const https = require("https");
const http = require("http");
const path = require("path");

// Cloudinary config
cloudinary.config({
  cloud_name: "dz1oqypua",
  api_key: "651551494185749",
  api_secret: "hfaD_eagljFyJWszeR4vXoQiFGM",
});

const employeesData = require("../src/infraestructure/database/seeders/employees.json");

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, { 
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/*"
      } 
    }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function uploadToCloudinary(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "cantu/employees",
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 50);
}

async function main() {
  // Filter out GENERAL store
  const realEmployees = employeesData.filter(e => e.sucursal !== "GENERAL");
  
  console.log(`\n📋 Total empleados reales (sin GENERAL): ${realEmployees.length}`);
  const withPhoto = realEmployees.filter(e => e.photoUrl);
  console.log(`📷 Con foto de Google Docs: ${withPhoto.length}`);
  console.log(`🚫 Sin foto: ${realEmployees.length - withPhoto.length}\n`);

  const results = [];
  let success = 0;
  let failed = 0;

  for (let i = 0; i < realEmployees.length; i++) {
    const emp = realEmployees[i];
    const label = `[${i + 1}/${realEmployees.length}] ${emp.nombre}`;

    if (!emp.photoUrl) {
      console.log(`⏭️  ${label} — sin foto, se omite`);
      results.push({ ...emp, cloudinaryUrl: null });
      continue;
    }

    try {
      process.stdout.write(`⬇️  ${label} — descargando...`);
      const buffer = await downloadImage(emp.photoUrl);
      
      process.stdout.write(` ${(buffer.length / 1024).toFixed(0)}KB, subiendo...`);
      const publicId = sanitizeName(emp.nombre);
      const result = await uploadToCloudinary(buffer, publicId);
      
      console.log(` ✅ ${result.secure_url.substring(0, 60)}...`);
      results.push({ ...emp, cloudinaryUrl: result.secure_url });
      success++;
    } catch (error) {
      console.log(` ❌ Error: ${error.message}`);
      results.push({ ...emp, cloudinaryUrl: null });
      failed++;
    }
  }

  // Write output
  const outputPath = path.join(__dirname, "..", "src", "infraestructure", "database", "seeders", "employees-cloudinary.json");
  const fs = require("fs");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n✅ Migración completada:`);
  console.log(`   📷 Fotos subidas: ${success}`);
  console.log(`   ❌ Fallidas: ${failed}`);
  console.log(`   📁 Archivo generado: ${outputPath}\n`);
}

main().catch(console.error);
