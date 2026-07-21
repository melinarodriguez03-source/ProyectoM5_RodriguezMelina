export async function uploadImageToS3(file: File): Promise<string> {
  // 1. Pedimos la presigned URL a nuestra Serverless Function
  const response = await fetch("/api/get-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la URL de subida");
  }

  const { uploadUrl, publicUrl } = await response.json();

  // 2. Subimos el archivo DIRECTO a S3 usando esa URL firmada
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("No se pudo subir la imagen a S3");
  }

  // 3. Devolvemos la URL pública final, para guardar en Firestore
  return publicUrl;
}