import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Caption, Container, CustomNavLink, PrimaryButton, Title } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import authService from "../../api/authService";
import { Link } from "react-router-dom";



export const Login = () => {
  const [formValues, setFormValues] = useState({
    CIN: "",
    motDePasse: "",
  });

  const [error, setError] = useState(null);  // Pour gérer les erreurs
  const navigate = useNavigate();  // Pour rediriger l'utilisateur

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await authService.login(formValues);
      console.log("Success:", data);

      // Récupérer les infos utilisateur (par exemple depuis localStorage ou authService)
      const currentUser = authService.getAuthenticatedUser();

      if (currentUser.role === 0) {
        navigate("/dashboard");
      } else {
        navigate("/Auctions");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <>
      <section className="regsiter pt-16 relative">
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
        <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
          <Container>
            <div>
              <Title level={3} className="text-white">
                Log In
              </Title>
              <div className="flex items-center gap-3">
              <Link to="/" className="text-white font-normal text-xl" onClick={() => console.log("clicked")}>
  Home
</Link>


                <Title level={5} className="text-white font-normal text-xl">
                  /
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  Log In
                </Title>
              </div>
            </div>
          </Container>
        </div>
        <form onSubmit={handleSubmit} className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>New Member</Title>
            <p className="mt-2 text-lg">
              Do you already have an account? <CustomNavLink href="/register">Signup Here</CustomNavLink>
            </p>
          </div>

          {/* Affichage des erreurs si elles existent */}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <div className="py-5 mt-8">
            <Caption className="mb-2">Enter Your CIN *</Caption>
            <input
              type="text"
              name="CIN"
              className={commonClassNameOfInput}
              placeholder="Enter Your CIN"
              required
              value={formValues.CIN}
              onChange={handleChange}
            />
          </div>

          <div>
            <Caption className="mb-2">Password *</Caption>
            <input
              type="password"
              name="motDePasse"
              className={commonClassNameOfInput}
              placeholder="Enter Your Password"
              required
              value={formValues.motDePasse}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2 py-4">
            {/* <input type="checkbox" /> */}
            {/* <Caption>I agree to the Terms & Policy</Caption> */}
          </div>

          <PrimaryButton className="w-full rounded-none my-5">LOGIN</PrimaryButton>

          <p className="text-center mt-5">
            {/* By clicking the signup button, you create a Cobiro account, and you agree to Cobiro's{" "} */}
            {/* <span className="text-green underline">Terms & Conditions</span> &{" "} */}
            {/* <span className="text-green underline">Privacy Policy</span>. */}
          </p>
        </form>

        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
      </section>
    </>
  );
};
