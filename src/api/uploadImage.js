import axios from 'axios';

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "my_image_preset"); // 👈 Doit exister dans Cloudinary

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/defx74d1x/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Erreur lors de l’upload Cloudinary :", error);
    throw new Error("L’image n’a pas pu être téléversée.");
  }
};
