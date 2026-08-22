import { uploadProductImage } from "../services/upload.service.js";

export async function uploadImage(request, response) {
  if (!request.file) return response.status(400).json({ error: { message: "Choose an image to upload" } });
  const url = await uploadProductImage(request.file);
  response.status(201).json({ data: { url } });
}

