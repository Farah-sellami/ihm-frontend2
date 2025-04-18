import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Title, Body, Caption, Container } from "../../router";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { commonClassNameOfInput } from "../../components/common/Design";
import Swal from 'sweetalert2';
import axios from 'axios';

export const ProductsDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [auctionHistory, setAuctionHistory] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [offerTitle, setOfferTitle] = useState(""); // State for the offer title
  const [offerDescription, setOfferDescription] = useState(""); // State for the offer description

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/postes/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du produit");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAuctionHistory = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/offres/poste/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement de l'historique des enchères");
        const data = await res.json();
        setAuctionHistory(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductDetails();
    fetchAuctionHistory();
  }, [id]);

  useEffect(() => {
    if (!product?.duree) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const end = new Date(product.duree);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      } 

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimeLeft(); // init
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [product?.duree]);

  const deleteProduct = async (productId) => {
    try {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Ce produit sera définitivement supprimé.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8000/api/offres/${productId}`);
        
        Swal.fire(
          'Supprimé !',
          'Le produit a été supprimé avec succès.',
          'success'
        );
      }

    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      Swal.fire(
        'Erreur',
        "Une erreur s'est produite lors de la suppression.",
        'error'
      );
    }
  };

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleSubmitBid = async (e) => {
    e.preventDefault();

    if (bidAmount <= 0) {
      alert("Le montant de l'enchère doit être supérieur à 0");
      return;
    }

    const currentDate = new Date().toISOString();

    try {
      const response = await fetch(`http://localhost:8000/api/offres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          montant: bidAmount,
          poste_id: product.id,
          
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission de l'offre");
      }

      const newBid = await response.json();
      setAuctionHistory((prev) => [...prev, newBid]);
      setBidAmount("");
    } catch (err) {
      console.error("Erreur lors de la soumission de l'offre:", err);
    }
  };

 
  
const handleSubmitOffer = async (e) => {
  e.preventDefault();
  if (!bidAmount || !offerDescription) {
    alert("Veuillez remplir tous les champs pour l'offre.");
    return;
  }

  try {
    const response = await axios.post(`http://localhost:8000/api/offres`, {
      montant: bidAmount,
      poste_id: product.id,
    });

    if (response.data) {
      Swal.fire("Offre ajoutée !", "Votre offre a été ajoutée avec succès.", "success");
      setBidAmount(""); // Réinitialiser le champ montant
      setOfferDescription(""); // Réinitialiser la date
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'offre:", error);
    Swal.fire("Erreur", "Une erreur s'est produite lors de l'ajout de l'offre.", "error");
  }
};

const handleDeleteBid = async (bidId) => {
  try {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette offre sera supprimée.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      await axios.delete(`http://localhost:8000/api/offres/${bidId}`);
      setAuctionHistory((prev) => prev.filter((bid) => bid.id !== bidId));
      Swal.fire('Supprimé !', 'L\'offre a été supprimée.', 'success');
    }
  } catch (error) {
    console.error("Erreur suppression:", error);
    Swal.fire('Erreur', 'Suppression échouée.', 'error');
  }
};

const handleUpdateBid = async (bidId) => {
  try {
    await axios.put(`http://localhost:8000/api/offres/${bidId}`, {
      montant: editMontant,
    });

    setAuctionHistory((prev) =>
      prev.map((bid) =>
        bid.id === bidId ? { ...bid, montant: editMontant } : bid
      )
    );
    setEditBid(null);
    Swal.fire('Modifié !', 'L\'offre a été mise à jour.', 'success');
  } catch (error) {
    console.error("Erreur modification:", error);
    Swal.fire('Erreur', 'Modification échouée.', 'error');
  }
};
const [editBid, setEditBid] = useState(null);
const [editMontant, setEditMontant] = useState("");
  const getCurrentBid = () => {
    if (auctionHistory.length > 0) {
      return auctionHistory[auctionHistory.length - 1].montant;
    }
    return product?.prixIniale ?? 0;
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!product) return <div>Aucun produit trouvé.</div>;

  return (
    <section className="pt-24 px-8">
      <Container>
        <div className="flex justify-between gap-8">
          <div className="w-1/2">
            <div className="h-[70vh]">
              <img
                src={product.photos || "https://via.placeholder.com/300"}
                alt={product.titre}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          <div className="w-1/2">
            <Title level={2} className="capitalize">{product.titre}</Title>

            <div className="flex gap-5 my-2">
              <div className="flex text-green">
                <IoIosStar size={20} />
                <IoIosStar size={20} />
                <IoIosStar size={20} />
                <IoIosStarHalf size={20} />
                <IoIosStarOutline size={20} />
              </div>
              <Caption>(2 customer reviews)</Caption>
            </div>

            <Body>{product.description}</Body>

            <div className="mt-4 space-y-2">
              <Caption>Item condition: New</Caption>
              <Caption>Item Verified: Yes</Caption>
            </div>

            <div className="flex gap-8 text-center my-4">
              {[timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((val, i) => (
                <div key={i} className="p-5 px-10 shadow-s1">
                  <Title level={4}>{val}</Title>
                  <Caption>{["Days", "Hours", "Minutes", "Seconds"][i]}</Caption>
                </div>
              ))}
            </div>

            <Title className="my-2">
              Auction ends: <Caption>{new Date(product.duree).toLocaleString()}</Caption>
            </Title>

            <Title className="my-2">Price: <Caption>${product.prixIniale}</Caption></Title>
            <Title className="my-2 text-3xl">Current bid: <Caption>${getCurrentBid()}</Caption></Title>
            
          </div>
        </div>

        {/* Tabs */}
        <div className="details mt-10">
          <div className="flex items-center gap-5 mb-6">
            {["description", "auctionHistory", "reviews", "moreProducts"].map((tab) => (
              <button
                key={tab}
                className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === tab ? "bg-green text-white" : "bg-white"}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab === "description"
                  ? "Description"
                  : tab === "auctionHistory"
                  ? "Auction History"
                  : tab === "reviews"
                  ? "Reviews (2)"
                  : "More Products"}
              </button>
            ))}
          </div>

          <div className="tab-content shadow-s3 p-8 rounded-md">
            {activeTab === "description" && (
              <>
                <Title level={4}>Description</Title>
                <br />
                <Caption>{product.description}</Caption>
              </>
            )}

            {activeTab === "auctionHistory" && (
              <>
                <Title level={4} className="mb-4">Auction History</Title>
                {auctionHistory.length === 0 ? (
                  <Caption>No history available.</Caption>
                ) : (
                  <table className="w-full border border-gray-200 text-left text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Bid Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
  {auctionHistory.map((bid, index) => (
    <tr key={index}>
      <td className="px-4 py-2 border">{bid.dateEnchere}</td>
      <td className="px-4 py-2 border">
        {editBid === bid.id ? (
          <input
            type="number"
            value={editMontant}
            onChange={(e) => setEditMontant(e.target.value)}
            className="border p-1 rounded"
          />
        ) : (
          `$${bid.montant}`
        )}
      </td>
      <td className="px-4 py-2 border space-x-2">
        {editBid === bid.id ? (
          <>
            <button
              onClick={() => handleUpdateBid(bid.id)}
              className="bg-green text-white px-6 py-2 rounded-md hover:bg-darkGreen transition"
            >
              Sauvegarder
            </button>
            <button
              onClick={() => setEditBid(null)}
              className="bg-green text-white px-6 py-2 rounded-md hover:bg-darkGreen transition"
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setEditBid(bid.id);
                setEditMontant(bid.montant);
              }}
              className="bg-green text-white px-6 py-2 rounded-md hover:bg-darkGreen transition"
            >
              Update
            </button>
            <button
              onClick={() => handleDeleteBid(bid.id)}
              className="bg-green text-white px-6 py-2 rounded-md hover:bg-darkGreen transition"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>

                  </table>
                )}
              </>
            )}

            {activeTab === "reviews" && (
              <>
                <Title level={4}>Customer Reviews</Title>
                <Caption>★★★★☆ (4/5)</Caption>
                <p>Good product overall. Would recommend!</p>
              </>
            )}

            {activeTab === "moreProducts" && (
              <>
                <Title level={4}>More Products</Title>
                <Caption>Other similar products go here.</Caption>
              </>
            )}
          </div>
        </div>

        {/* Bid Form */}
        {product.enchere && (
          <div className="mt-8">
             <form onSubmit={handleSubmitOffer} className="mt-4 space-y-4">
    <div>
      <label htmlFor="montant" className="block mb-1 font-medium text-gray-700">
        Montant de l’offre ($)
      </label>
      <input
        type="number"
        id="montant"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        className={commonClassNameOfInput}
        required
      />
    </div>
    
    <button
      type="submit"
      className="bg-green text-white px-6 py-2 rounded hover:bg-darkGreen transition"
    >
      Soumettre l'offre
    </button>
  </form>
          </div>
        )}

        {/* Offer Form */}
        <div className="mt-8">
          {/* Formulaire pour soumettre une nouvelle offre */}
<form onSubmit={handleSubmitOffer} className="mt-6 space-y-4">
  <div>
    <label htmlFor="montant" className="block text-sm font-medium text-gray-700">Montant de l'offre (USD)</label>
    <input
      type="number"
      id="montant"
      value={bidAmount}
      onChange={(e) => setBidAmount(e.target.value)}
      className={commonClassNameOfInput}
      required
    />
  </div>

  

  <button
    type="submit"
    className="bg-green text-white px-6 py-2 rounded-md hover:bg-darkGreen transition"
  >
    Soumettre l'offre
  </button>
</form>

        </div>
      </Container>
    </section>
  );
};