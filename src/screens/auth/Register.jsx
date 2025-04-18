import { Caption, Container, CustomNavLink, PrimaryButton, Title } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import { useState } from "react";
import authService from "../../api/authService";
import { useNavigate } from "react-router-dom";  // Importer useNavigate

export const Register = () => {
  const [photo, setPhoto] = useState(null);
  const [formValues, setFormValues] = useState({
    CIN: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    ville: "",
    motDePasse: "",
    role: "1",
  });
  const [showModal, setShowModal] = useState(false); 
  
  const navigate = useNavigate();  // Initialiser useNavigate

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    for (const key in formValues) {
      formData.append(key, formValues[key]);
    }
    if (photo) {
      formData.append("photoProfil", photo);
    }
  
    try {
      const res = await authService.register(formData);
      console.log("Success:", res);
      setShowModal(true);
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err.response?.data || err.message);
    }
  };

  // Fonction pour fermer la modal et rediriger vers login
  const closeModal = () => {
    setShowModal(false);
    navigate("/login");  // Redirection vers la page de login
  };

  return (
    <>
      {/* Reste de votre code */}
      
      {/* Modal de succès */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-1/3">
            <h2 className="text-green-500 text-2xl font-semibold">Account Created Successfully!</h2>
            <p className="mt-4">Your account has been created successfully. You can now log in.</p>
            <div className="mt-5 flex justify-end">
              <button onClick={closeModal} className="w-auto">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
        <div className="text-center">
          <Title level={5}>Sign Up</Title>
          <p className="mt-2 text-lg">
            Do you already have an account? <CustomNavLink href="/login">Log In Here</CustomNavLink>
          </p>
        </div>

        {/* CIN */}
        <div className="py-5">
          <Caption className="mb-2">CIN *</Caption>
          <input
            type="text"
            name="CIN"
            className={commonClassNameOfInput}
            placeholder="Enter your CIN"
            required
            onChange={handleChange}
          />
        </div>

        {/* Nom */}
        <div className="py-5">
          <Caption className="mb-2">Nom *</Caption>
          <input
            type="text"
            name="nom"
            className={commonClassNameOfInput}
            placeholder="Last name"
            required
            onChange={handleChange}
          />
        </div>

        {/* Prénom */}
        <div className="py-5">
          <Caption className="mb-2">Prénom *</Caption>
          <input
            type="text"
            name="prenom"
            className={commonClassNameOfInput}
            placeholder="First name"
            required
            onChange={handleChange}
          />
        </div>

        {/* Date de naissance */}
        <div className="py-5">
          <Caption className="mb-2">Date de naissance *</Caption>
          <input
            type="date"
            name="dateNaissance"
            className={commonClassNameOfInput}
            required
            onChange={handleChange}
          />
        </div>

        {/* Ville */}
        <div className="py-5">
          <Caption className="mb-2">Ville *</Caption>
          <input
            type="text"
            name="ville"
            className={commonClassNameOfInput}
            placeholder="Ville"
            required
            onChange={handleChange}
          />
        </div>

        {/* Photo Profil (nullable) */}
        <div className="py-5">
          <Caption className="mb-2">Photo de profil *</Caption>
          <input
            type="file"
            name="photoProfil"
            accept="image/*"
            className={commonClassNameOfInput}
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        {/* Mot de passe */}
        <div className="py-5">
          <Caption className="mb-2">Mot de passe *</Caption>
          <input
            type="password"
            name="motDePasse"
            className={commonClassNameOfInput}
            placeholder="Mot de passe"
            required
            onChange={handleChange}
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 py-4">
          <input type="checkbox" required />
          <Caption>I agree to the Terms & Policy</Caption>
        </div>

        <PrimaryButton className="w-full rounded-none my-5">CREATE ACCOUNT</PrimaryButton>

        <p className="text-center mt-5">
          By clicking the signup button, you create a Cobiro account, and you agree to Cobiro's <span className="text-green underline">Terms & Conditions</span> & 
          <span className="text-green underline"> Privacy Policy </span>.
        </p>
      </form>

      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
    </>
  );
};
