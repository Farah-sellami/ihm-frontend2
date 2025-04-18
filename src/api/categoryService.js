import axiosInstance from './axiosInstance';

const categoryService = {
  // Récupérer toutes les catégories
  getAllCategories: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  // Récupérer une catégorie par ID
  getCategoryById: async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  // Créer une nouvelle catégorie (avec ou sans image)
  createCategory: async (categoryData) => {
    const formData = new FormData();
    formData.append('titre', categoryData.titre);
    if (categoryData.description) {
      formData.append('description', categoryData.description);
    }
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    const response = await axiosInstance.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour une catégorie existante
  updateCategory: async (id, updatedData) => {
    const formData = new FormData();
    formData.append('titre', updatedData.titre);
    if (updatedData.description) {
      formData.append('description', updatedData.description);
    }
    if (updatedData.image) {
      formData.append('image', updatedData.image);
    }

    const response = await axiosInstance.post(`/categories/${id}?_method=PUT`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Supprimer une catégorie
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },

  // Récupérer les sous-catégories par ID de catégorie
  getSubcategoriesByCategoryId: async (id) => {
    try {
      const response = await axiosInstance.get(`/categories/${id}/scategories`);
      return response.data;
    } catch (error) {
      console.error('Error loading subcategories:', error);
      throw new Error('Could not load subcategories');
    }
  },
};

export default categoryService;
