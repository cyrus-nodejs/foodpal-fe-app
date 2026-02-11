export const uploadToCloudinary = async (file: File) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

  const res = await fetch(url, {
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Cloudinary error → ", err);
    throw new Error("Failed to upload image");
  }

  return (await res.json()).secure_url;
};
