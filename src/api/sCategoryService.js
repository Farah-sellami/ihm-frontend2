import axiosInstance from './axiosInstance';

const sCategoryService = {
  // Récupérer toutes les sous-catégories avec les catégories associées
  getAllSubcategories: async () => {
    const response = await axiosInstance.get('/scategories');
    return response.data;
  },

  // Récupérer une sous-catégorie par ID avec la catégorie associée
  getSubcategoryById: async (id) => {
    const response = await axiosInstance.get(`/scategories/${id}`);
    return response.data;
  },

  // Créer une nouvelle sous-catégorie
  createSubcategory: async (subcategoryData) => {
    const response = await axiosInstance.post('/scategories', subcategoryData);
    return response.data;
  },

  // Mettre à jour une sous-catégorie existante
  updateSubcategory: async (id, updatedData) => {
    const response = await axiosInstance.put(`/scategories/${id}`, updatedData);
    return response.data;
  },

  // Supprimer une sous-catégorie
  deleteSubcategory: async (id) => {
    const response = await axiosInstance.delete(`/scategories/${id}`);
    return response.data;
  },

   // Récupérer les sous-catégories d'une catégorie spécifique
  getSubcategoriesByCategoryId: async (categorieID) => {
    const response = await axiosInstance.get(`/categories/${categorieID}/subcategories`);
    return response.data;
  }
};

export default sCategoryService;
