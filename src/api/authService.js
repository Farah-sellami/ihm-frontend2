import axiosInstance from './axiosInstance';

const authService = {
  // Enregistrer un nouvel utilisateur
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/register', userData, 
        {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
       }
    );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  },


 // Connecter un utilisateur
login: async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);
    console.log("response of login :", response.data);

    const { token, user } = response.data;

    // 👉 Stocker le token et éventuellement l'utilisateur dans le localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;

  } catch (error) {
    throw new Error(error.response?.data?.error || 'Identifiants invalides');
  }
},

// Vérifier si l'utilisateur est authentifié
isAuthenticated: () => {
  const token = localStorage.getItem('token');
  console.log("response of is authenticated :", token);
  return !!token; // Retourne true si un token est présent
},

getAuthenticatedUser: () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
},

// Déconnecter l'utilisateur
logout: () => {
  localStorage.removeItem('token'); // Supprimer le token du localStorage
},
};

export default authService;
