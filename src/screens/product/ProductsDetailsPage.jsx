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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  // Submit Bid
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');
    const numericBid = parseFloat(bidAmount);

    if (!userId) {
      return Swal.fire("Error", "You must be logged in to place a bid", "error");
    }

    if (!bidAmount || numericBid <= 0) {
      return Swal.fire("Error", "Please enter a valid bid amount", "error");
    }

    const minBid = calculateMinimumBid();
    if (numericBid < minBid) {
      return Swal.fire("Bid Too Low", `Your bid must be at least 10% higher than current ($${minBid.toFixed(2)})`, "error");
    }

    try {
      const res = await axios.post(`http://localhost:8000/api/offres`, {
        montant: numericBid,
        poste_id: id,
        user_id: userId
      });
      setAuctionHistory(prev => [...prev, res.data]);
      setBidAmount("");
      Swal.fire("Success", "Your bid has been placed!", "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to place bid", "error");
    }
  };


  // const getCurrentBid = () => {
  //   if (!product) return product?.prixIniale || 0;

  //   // Find the highest bid amount
  //   const highestBid = auctionHistory.reduce((max, bid) =>
  //     bid.montant > max ? bid.montant : max,
  //     product.prixIniale || 0
  //   );

  //   return highestBid;
  // };
  const getCurrentBid = () => {
    if (!product) return 0;
    return auctionHistory.reduce((max, bid) => bid.montant > max ? bid.montant : max, product.prixIniale || 0);
  };

  const calculateMinimumBid = () => {
    const current = getCurrentBid();
    return current * 1.1; // 10% increase
  };

  if (loading) return <div className="text-center py-20">Loading product details...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <>
    <div className="bg-[#20354c] pt-8 min-h-[200px] relative">
            
    <Container className="px-4 sm:px-6 lg:px-8">
    <br />   <br />   <br />
    <div className="space-y-4">
        <Title level={3} className="text-white text-2xl sm:text-3xl">
          Details
        </Title>
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <Title level={5} className="text-white font-normal">
            Home
          </Title>
          <span className="text-white">/</span>
          <Title level={5} className="text-white font-normal">
            Auctions
          </Title>
          <span className="text-white">/</span>
          <Title level={5} className="text-white font-normal">
            Details
          </Title>
        </div>
      </div>

    </Container>
  </div>
    <section className="pt-24 px-8 pb-12">
   
      <Container>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
 {/* Image Carousel */}
 <div className="lg:w-1/2">
            <div className="h-[60vh] rounded-xl overflow-hidden bg-gray-100 relative">
              {/* Main Image */}
              <img
                src={product.photos[currentImageIndex] || "https://via.placeholder.com/600x800"}
                alt={product.titre}
                className="w-full h-full object-contain"
              />

              {/* Navigation Arrows (only show if multiple images exist) */}
              {product.photos.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev =>
                      prev === 0 ? product.photos.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev =>
                      prev === product.photos.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    &gt;
                  </button>
                </>
              )}

              {/* Image Indicator Dots */}
              {product.photos.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {product.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Preview (optional) */}
            {product.photos.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto py-2">
                {product.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
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
              <Title level={4} className="minimum-bid-title">
                Minimum Next Bid: <span className="minimum-bid-value">${calculateMinimumBid().toFixed(2)}</span>
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
                  min={calculateMinimumBid().toFixed(2)}
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className={`${commonClassNameOfInput} w-full`}
                  placeholder={`Minimum $${calculateMinimumBid().toFixed(2)}`}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Must be at least 10% higher than current highest bid
                </p>
              </div>
              <button
                type="submit"
                className="text-white font-semibold px-6 py-3 rounded-md shadow transition duration-300 hover:opacity-90"
                style={{ backgroundColor: 'rgba(32, 53, 76, 1)' }}
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
    </>
  );
};