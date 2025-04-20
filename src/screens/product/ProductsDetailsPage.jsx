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
  const [editBid, setEditBid] = useState(null);
  const [editMontant, setEditMontant] = useState("");

  // Fetch product and auction history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, historyRes] = await Promise.all([
          fetch(`http://localhost:8000/api/postes/${id}`),
          fetch(`http://localhost:8000/api/offres/poste/${id}`)
        ]);

        if (!productRes.ok || !historyRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [productData, historyData] = await Promise.all([
          productRes.json(),
          historyRes.json()
        ]);

        setProduct(productData);
        setAuctionHistory(historyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!product?.endDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const updateTimeLeft = () => {
      try {
        const now = new Date();
        const end = new Date(product.endDate);
        const diff = end - now;

        if (diff <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } catch (err) {
        console.error("Error calculating time:", err);
      }
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [product?.endDate]);

  const handleSubmitBid = async (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      Swal.fire("Error", "You must be logged in to place a bid", "error");
      return;
    }

    if (!bidAmount || bidAmount <= 0) {
      Swal.fire("Error", "Please enter a valid bid amount", "error");
      return;
    }

    try {
      // Submit new bid
      const response = await axios.post(`http://localhost:8000/api/offres`, {
        montant: parseFloat(bidAmount),
        poste_id: id,
        user_id: userId
      });

      // OPTION 1: Update state immediately with the response
      setAuctionHistory(prev => [...prev, response.data]);
      setBidAmount("");
      Swal.fire("Success", "Your bid has been placed!", "success");

      // OPTION 2: Or refresh the entire auction history
      // const historyRes = await fetch(`http://localhost:8000/api/offres/poste/${id}`);
      // if (historyRes.ok) {
      //   const historyData = await historyRes.json();
      //   setAuctionHistory(historyData);
      //   setBidAmount("");
      //   Swal.fire("Success", "Your bid has been placed!", "success");
      // }

    } catch (error) {
      console.error("Bid submission error:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to place bid", "error");
    }
  };
  const handleDeleteBid = async (bidId) => {
    try {
      const result = await Swal.fire({
        title: 'Confirm Delete',
        text: 'Are you sure you want to delete this bid?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8000/api/offres/${bidId}`);
        setAuctionHistory(prev => prev.filter(bid => bid.id !== bidId));
        Swal.fire("Deleted!", "Your bid has been removed", "success");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error", "Failed to delete bid", "error");
    }
  };

  const handleUpdateBid = async (bidId) => {
    try {
      await axios.put(`http://localhost:8000/api/offres/${bidId}`, {
        montant: parseFloat(editMontant)
      });

      setAuctionHistory(prev =>
        prev.map(bid => bid.id === bidId ? { ...bid, montant: editMontant } : bid)
      );
      setEditBid(null);
      Swal.fire("Updated!", "Your bid has been updated", "success");
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update bid", "error");
    }
  };

  const getCurrentBid = () => {
    if (!product) return product?.prixIniale || 0;

    // Find the highest bid amount
    const highestBid = auctionHistory.reduce((max, bid) =>
      bid.montant > max ? bid.montant : max,
      product.prixIniale || 0
    );

    return highestBid;
  };
  if (loading) return <div className="text-center py-20">Loading product details...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <section className="pt-24 px-8 pb-12">
              <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
          <Container>
            <div>
              <Title level={3} className="text-white">Details</Title>
              <div className="flex items-center gap-3">
                <Title level={5} className="text-white font-normal text-xl">Home</Title>
                <Title level={5} className="text-white font-normal text-xl">/</Title>
                <Title level={5} className="text-white font-normal text-xl">Auctions In</Title>
                <Title level={5} className="text-white font-normal text-xl">/</Title>
                <Title level={5} className="text-white font-normal text-xl">Details</Title>

              </div>
            </div>
          </Container>
        </div>
        <br />
      <Container>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="h-[60vh] rounded-xl overflow-hidden bg-gray-100">
              <img
                src={product.photos || "https://via.placeholder.com/600x800"}
                alt={product.titre}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 space-y-6">
            <Title level={2} className="capitalize">{product.titre}</Title>

            <div className="flex items-center gap-4">
              <div className="flex text-yellow-400">
                <IoIosStar size={20} />
                <IoIosStar size={20} />
                <IoIosStar size={20} />
                <IoIosStarHalf size={20} />
                <IoIosStarOutline size={20} />
              </div>
              <Caption>(2 customer reviews)</Caption>
            </div>

            <Body>{product.description}</Body>

            {/* Auction Timer */}
            {product.endDate ? (
              <>
                <div className="grid grid-cols-4 gap-4 my-6">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center p-4 shadow-md rounded-lg">
                      <Title level={3}>{value}</Title>
                      <Caption className="capitalize">{unit}</Caption>
                    </div>
                  ))}
                </div>
                <Title level={4}>
                  Auction ends: <span className="font-normal">{new Date(product.endDate).toLocaleString()}</span>
                </Title>
              </>
            ) : (
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
                <Title level={4}>No auction end date specified</Title>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-2">
              <Title level={4}>
                Starting Price: <span className="font-normal">${product.prixIniale}</span>
              </Title>
              <Title level={3} className="text-green-600">
                Current Highest Bid: <span className="font-normal">${getCurrentBid()}</span>
              </Title>
              {auctionHistory.length > 0 && (
                <Caption className="text-gray-500">
                  {auctionHistory.length} bids placed
                </Caption>
              )}
            </div>

            {/* Bid Form */}
            <form onSubmit={handleSubmitBid} className="mt-6 space-y-4">
              <div>
                <label htmlFor="bidAmount" className="block mb-2 font-medium">
                  Enter Your Bid ($)
                </label>
                <input
                  type="number"
                  id="bidAmount"
                  min={getCurrentBid() + 1}
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className={`${commonClassNameOfInput} w-full`}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition w-full"
              >
                Place Bid
              </button>
            </form>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
            {["description", "auctionHistory", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-md whitespace-nowrap ${activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 shadow-sm"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "description" && "Description"}
                {tab === "auctionHistory" && "Bid History"}
                {tab === "reviews" && "Reviews"}
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            {activeTab === "description" && (
              <div>
                <Title level={4} className="mb-4">Product Description</Title>
                <Body>{product.description}</Body>
              </div>
            )}

            {activeTab === "auctionHistory" && (
              <div>
                <Title level={4} className="mb-4">Bid History</Title>
                {auctionHistory.length === 0 ? (
                  <Caption>No bids have been placed yet</Caption>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left border-b">Date</th>
                          <th className="px-4 py-3 text-left border-b">Bidder</th>
                          <th className="px-4 py-3 text-left border-b">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auctionHistory.map((bid) => (
                          <tr key={bid.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700">
                              {new Date(bid.dateEnchere).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              Anonymous
                            </td>
                            <td className="px-4 py-3 font-medium text-green-600">
                              ${bid.montant}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {activeTab === "reviews" && (
  <div className="space-y-6">
    {/* Rating Summary */}
    <div className="flex items-center mb-4">
      <div className="flex text-yellow-400 mr-2">
        <IoIosStar size={20} />
        <IoIosStar size={20} />
        <IoIosStar size={20} />
        <IoIosStarHalf size={20} />
        <IoIosStarOutline size={20} />
      </div>
      <Caption>4.2 stars (12 reviews)</Caption>
    </div>

    {/* Static Reviews */}
    <div className="space-y-4">
      {/* Review 1 */}
      <div className="border-b pb-4">
        <div className="flex justify-between">
          <div className="flex text-yellow-400 mb-1">
            <IoIosStar size={16} />
            <IoIosStar size={16} />
            <IoIosStar size={16} />
            <IoIosStar size={16} />
            <IoIosStar size={16} />
          </div>
          <Caption className="text-gray-500">May 15, 2023</Caption>
        </div>
        <Body className="text-gray-700 mb-1">"Perfect product, exceeded my expectations!"</Body>
        <Caption className="text-gray-500">- Alex</Caption>
      </div>

      {/* Review 2 */}
      <div className="border-b pb-4">
        <div className="flex justify-between">
          <div className="flex text-yellow-400 mb-1">
            <IoIosStar size={16} />
            <IoIosStar size={16} />
            <IoIosStar size={16} />
            <IoIosStar size={16} />
            <IoIosStarOutline size={16} />
          </div>
          <Caption className="text-gray-500">April 28, 2023</Caption>
        </div>
        <Body className="text-gray-700 mb-1">"Good value for the price, works well"</Body>
        <Caption className="text-gray-500">- Sarah</Caption>
      </div>

{/* Review 3 */}
<div className="border-b pb-4">
        <div className="flex justify-between">
          <div className="flex text-yellow-400 mb-1">
            <IoIosStar size={16} />
            <IoIosStar size={16} />
            <IoIosStar size={16} />
            <IoIosStarHalf size={16} />
            <IoIosStarOutline size={16} />
          </div>
          <Caption className="text-gray-500">April 10, 2023</Caption>
        </div>
        <Body className="text-gray-700 mb-1">"Does what it needs to do"</Body>
        <Caption className="text-gray-500">- Michael</Caption>
      </div>
    </div>

    {/* Static "Your Review" - Appears after clicking stars */}
    <div className="border-t pt-4">
      <div className="flex justify-between">
        <div className="flex text-yellow-400 mb-1">
          <IoIosStar size={16} />
          <IoIosStar size={16} />
          <IoIosStar size={16} />
          <IoIosStar size={16} />
          <IoIosStarOutline size={16} />
        </div>
        <Caption className="text-gray-500">Just now</Caption>
      </div>
      <Body className="text-gray-700 mb-1">"I love this product! Works perfectly for my needs."</Body>
      <Caption className="text-gray-500">- You</Caption>
    </div>

    {/* Static Add Comment UI */}
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <Title level={5} className="mb-2">Click stars to rate</Title>
      <div className="flex text-gray-300 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <IoIosStarOutline 
            key={star} 
            size={24} 
            className="cursor-pointer hover:text-yellow-400" 
            onClick={() => {
              // This would be interactive in a real app
              Swal.fire({
                title: 'Review Submitted!',
                text: 'Your review would be saved in a real application',
                icon: 'success',
                confirmButtonText: 'OK'
              });
            }}
          />
        ))}
      </div>
      <Caption>Add your  comment below</Caption>
    </div>
  </div>
)}
          </div>
        </div>
      </Container>
    </section>
  );
};