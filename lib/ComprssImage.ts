const CLOUDINARY_CLOUD_NAME = "dxkau0eb3";
const CLOUDINARY_UPLOAD_PRESET = "Warta_pos";

// تحويل base64 إلى Blob
function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// رفع الصورة إلى Cloudinary بعد الضغط
export const compressAndUploadToCloudinary = async (file: File) => {
  try {
    const base64: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const scale = Math.min(800 / img.width, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL("image/jpeg", 0.5);
          resolve(compressed);
        };
        img.onerror = () => reject("Image load error");
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject("FileReader error");
      reader.readAsDataURL(file);
    });

    const blob = dataURLtoBlob(base64);
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      console.error("Cloudinary upload failed:", data);
      return "";
    }

    return data.secure_url;
  } catch (err) {
    console.error("Compression or upload error:", err);
    return "";
  }
};
