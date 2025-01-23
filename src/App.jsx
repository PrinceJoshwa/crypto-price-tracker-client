// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { TrendingUp, TrendingDown, Search, RefreshCcw, Bell, Star, LogIn, LogOut, UserPlus } from 'lucide-react';

// const API_URL = 'http://localhost:5000/api';

// function App() {
//   const [cryptoData, setCryptoData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [watchlist, setWatchlist] = useState([]);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [authMode, setAuthMode] = useState('login');
//   const [authForm, setAuthForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   // Authentication
//   const handleAuth = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_URL}/auth/${authMode}`, authForm);
//       const { token, ...userData } = response.data;
//       localStorage.setItem('token', token);
//       setUser(userData);
//       setShowAuthModal(false);
//       setError('');
//       fetchWatchlist();
//     } catch (error) {
//       setError(error.response?.data?.message || 'Authentication failed');
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     setWatchlist([]);
//   };

//   // Fetch crypto data
//   const fetchCryptoData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/crypto/prices`);
//       setCryptoData(response.data);
//     } catch (error) {
//       console.error('Error fetching crypto data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user's watchlist
//   const fetchWatchlist = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     try {
//       const response = await axios.get(`${API_URL}/crypto/watchlist`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setWatchlist(response.data.map(crypto => crypto.cryptoId));
//     } catch (error) {
//       console.error('Error fetching watchlist:', error);
//     }
//   };

//   // Toggle watchlist
//   const toggleWatchlist = async (cryptoId) => {
//     if (!user) {
//       setShowAuthModal(true);
//       return;
//     }

//     const token = localStorage.getItem('token');
//     try {
//       if (watchlist.includes(cryptoId)) {
//         await axios.delete(`${API_URL}/crypto/watchlist/${cryptoId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       } else {
//         await axios.post(`${API_URL}/crypto/watchlist`, 
//           { cryptoId },
//           { headers: { Authorization: `Bearer ${token}` }}
//         );
//       }
//       fetchWatchlist();
//     } catch (error) {
//       console.error('Error updating watchlist:', error);
//     }
//   };

//   // Set price alert
//   const setPriceAlert = async (cryptoId, price, condition) => {
//     if (!user) {
//       setShowAuthModal(true);
//       return;
//     }

//     const token = localStorage.getItem('token');
//     try {
//       await axios.post(`${API_URL}/crypto/alerts`,
//         { cryptoId, price, condition },
//         { headers: { Authorization: `Bearer ${token}` }}
//       );
//     } catch (error) {
//       console.error('Error setting price alert:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCryptoData();
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Fetch user profile
//       axios.get(`${API_URL}/auth/profile`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//         .then(response => {
//           setUser(response.data);
//           fetchWatchlist();
//         })
//         .catch(() => {
//           localStorage.removeItem('token');
//         });
//     }
//     const interval = setInterval(fetchCryptoData, 60000); // Refresh every minute
//     return () => clearInterval(interval);
//   }, []);

//   const filteredCryptos = cryptoData.filter(crypto =>
//     crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <header className="bg-gray-800 shadow-lg">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <TrendingUp className="text-green-400" />
//               Crypto Price Tracker
//             </h1>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={fetchCryptoData}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
//               >
//                 <RefreshCcw size={18} />
//                 Refresh
//               </button>
//               {user ? (
//                 <div className="flex items-center gap-4">
//                   <span className="text-gray-300">{user.email}</span>
//                   <button
//                     onClick={logout}
//                     className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
//                   >
//                     <LogOut size={18} />
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setShowAuthModal(true)}
//                   className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
//                 >
//                   <LogIn size={18} />
//                   Login
//                 </button>
//               )}
//             </div>
//           </div>
          
//           {/* Search Bar */}
//           <div className="mt-6 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search cryptocurrencies..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {filteredCryptos.map(crypto => (
//               <div key={crypto.cryptoId} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-4">
//                     <img src={crypto.image} alt={crypto.name} className="w-12 h-12" />
//                     <div>
//                       <h2 className="text-xl font-semibold">{crypto.name}</h2>
//                       <p className="text-gray-400 uppercase">{crypto.symbol}</p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => toggleWatchlist(crypto.cryptoId)}
//                       className={`p-2 rounded-full transition-colors ${
//                         watchlist.includes(crypto.cryptoId)
//                           ? 'bg-yellow-500 hover:bg-yellow-600'
//                           : 'bg-gray-700 hover:bg-gray-600'
//                       }`}
//                     >
//                       <Star size={20} />
//                     </button>
//                     <button
//                       onClick={() => setPriceAlert(crypto.cryptoId, crypto.currentPrice, 'above')}
//                       className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
//                     >
//                       <Bell size={20} />
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Price:</span>
//                     <span className="font-medium">${crypto.currentPrice.toLocaleString()}</span>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">24h Change:</span>
//                     <span className={`flex items-center gap-1 ${
//                       crypto.priceChangePercentage24h > 0 ? 'text-green-400' : 'text-red-400'
//                     }`}>
//                       {crypto.priceChangePercentage24h > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//                       {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Market Cap:</span>
//                     <span className="font-medium">${crypto.marketCap.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Auth Modal */}
//       {showAuthModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
//             <h2 className="text-2xl font-bold mb-6">
//               {authMode === 'login' ? 'Login' : 'Register'}
//             </h2>
//             {error && (
//               <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
//                 {error}
//               </div>
//             )}
//             <form onSubmit={handleAuth} className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={authForm.email}
//                   onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
//                   className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={authForm.password}
//                   onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
//                   className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors"
//               >
//                 {authMode === 'login' ? 'Login' : 'Register'}
//               </button>
//             </form>
//             <div className="mt-4 text-center">
//               <button
//                 onClick={() => {
//                   setAuthMode(authMode === 'login' ? 'register' : 'login');
//                   setError('');
//                 }}
//                 className="text-blue-400 hover:text-blue-300"
//               >
//                 {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
//               </button>
//             </div>
//             <button
//               onClick={() => {
//                 setShowAuthModal(false);
//                 setError('');
//               }}
//               className="absolute top-4 right-4 text-gray-400 hover:text-white"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { TrendingUp, TrendingDown, Search, RefreshCcw, Bell, Star, LogIn, LogOut } from 'lucide-react';

// // Use environment variable for API URL if available
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// function App() {
//   const [cryptoData, setCryptoData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [watchlist, setWatchlist] = useState([]);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [authMode, setAuthMode] = useState('login');
//   const [authForm, setAuthForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   // Authentication
//   const handleAuth = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_URL}/auth/${authMode}`, authForm);
//       const { token, ...userData } = response.data;
//       localStorage.setItem('token', token);
//       setUser(userData);
//       setShowAuthModal(false);
//       setError('');
//       fetchWatchlist();
//     } catch (error) {
//       setError(error.response?.data?.message || 'Authentication failed');
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     setWatchlist([]);
//   };

//   // Fetch crypto data
//   const fetchCryptoData = async () => {
//     try {
//       setLoading(true);
//       // First try the backend API
//       const response = await axios.get(`${API_URL}/crypto/prices`);
//       setCryptoData(response.data);
//     } catch (error) {
//       console.error('Error fetching from backend, falling back to CoinGecko:', error);
//       // Fallback to CoinGecko API if backend fails
//       try {
//         const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
//           params: {
//             vs_currency: 'usd',
//             order: 'market_cap_desc',
//             per_page: 20,
//             sparkline: false
//           }
//         });
//         // Transform CoinGecko data to match our backend format
//         const transformedData = response.data.map(coin => ({
//           cryptoId: coin.id,
//           name: coin.name,
//           symbol: coin.symbol,
//           currentPrice: coin.current_price,
//           image: coin.image,
//           marketCap: coin.market_cap,
//           priceChangePercentage24h: coin.price_change_percentage_24h
//         }));
//         setCryptoData(transformedData);
//       } catch (fallbackError) {
//         console.error('Error fetching from CoinGecko:', fallbackError);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user's watchlist
//   const fetchWatchlist = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     try {
//       const response = await axios.get(`${API_URL}/crypto/watchlist`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setWatchlist(response.data.map(crypto => crypto.cryptoId));
//     } catch (error) {
//       console.error('Error fetching watchlist:', error);
//     }
//   };

//   // Toggle watchlist
//   const toggleWatchlist = async (cryptoId) => {
//     if (!user) {
//       setShowAuthModal(true);
//       return;
//     }

//     const token = localStorage.getItem('token');
//     try {
//       if (watchlist.includes(cryptoId)) {
//         await axios.delete(`${API_URL}/crypto/watchlist/${cryptoId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       } else {
//         await axios.post(`${API_URL}/crypto/watchlist`, 
//           { cryptoId },
//           { headers: { Authorization: `Bearer ${token}` }}
//         );
//       }
//       fetchWatchlist();
//     } catch (error) {
//       console.error('Error updating watchlist:', error);
//     }
//   };

//   // Set price alert
//   const setPriceAlert = async (cryptoId, price, condition) => {
//     if (!user) {
//       setShowAuthModal(true);
//       return;
//     }

//     const token = localStorage.getItem('token');
//     try {
//       await axios.post(`${API_URL}/crypto/alerts`,
//         { cryptoId, price, condition },
//         { headers: { Authorization: `Bearer ${token}` }}
//       );
//     } catch (error) {
//       console.error('Error setting price alert:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCryptoData();
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Fetch user profile
//       axios.get(`${API_URL}/auth/profile`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//         .then(response => {
//           setUser(response.data);
//           fetchWatchlist();
//         })
//         .catch(() => {
//           localStorage.removeItem('token');
//         });
//     }
//     const interval = setInterval(fetchCryptoData, 60000); // Refresh every minute
//     return () => clearInterval(interval);
//   }, []);

//   const filteredCryptos = cryptoData.filter(crypto =>
//     crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <header className="bg-gray-800 shadow-lg">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <TrendingUp className="text-green-400" />
//               Crypto Price Tracker
//             </h1>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={fetchCryptoData}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
//               >
//                 <RefreshCcw size={18} />
//                 Refresh
//               </button>
//               {user ? (
//                 <div className="flex items-center gap-4">
//                   <span className="text-gray-300">{user.email}</span>
//                   <button
//                     onClick={logout}
//                     className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
//                   >
//                     <LogOut size={18} />
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setShowAuthModal(true)}
//                   className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
//                 >
//                   <LogIn size={18} />
//                   Login
//                 </button>
//               )}
//             </div>
//           </div>
          
//           {/* Search Bar */}
//           <div className="mt-6 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search cryptocurrencies..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {filteredCryptos.map(crypto => (
//               <div key={crypto.cryptoId} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-4">
//                     <img src={crypto.image} alt={crypto.name} className="w-12 h-12" />
//                     <div>
//                       <h2 className="text-xl font-semibold">{crypto.name}</h2>
//                       <p className="text-gray-400 uppercase">{crypto.symbol}</p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => toggleWatchlist(crypto.cryptoId)}
//                       className={`p-2 rounded-full transition-colors ${
//                         watchlist.includes(crypto.cryptoId)
//                           ? 'bg-yellow-500 hover:bg-yellow-600'
//                           : 'bg-gray-700 hover:bg-gray-600'
//                       }`}
//                     >
//                       <Star size={20} />
//                     </button>
//                     <button
//                       onClick={() => setPriceAlert(crypto.cryptoId, crypto.currentPrice, 'above')}
//                       className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
//                     >
//                       <Bell size={20} />
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Price:</span>
//                     <span className="font-medium">${crypto.currentPrice.toLocaleString()}</span>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">24h Change:</span>
//                     <span className={`flex items-center gap-1 ${
//                       crypto.priceChangePercentage24h > 0 ? 'text-green-400' : 'text-red-400'
//                     }`}>
//                       {crypto.priceChangePercentage24h > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//                       {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Market Cap:</span>
//                     <span className="font-medium">${crypto.marketCap.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Auth Modal */}
//       {showAuthModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
//             <h2 className="text-2xl font-bold mb-6">
//               {authMode === 'login' ? 'Login' : 'Register'}
//             </h2>
//             {error && (
//               <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
//                 {error}
//               </div>
//             )}
//             <form onSubmit={handleAuth} className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={authForm.email}
//                   onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
//                   className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={authForm.password}
//                   onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
//                   className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors"
//               >
//                 {authMode === 'login' ? 'Login' : 'Register'}
//               </button>
//             </form>
//             <div className="mt-4 text-center">
//               <button
//                 onClick={() => {
//                   setAuthMode(authMode === 'login' ? 'register' : 'login');
//                   setError('');
//                 }}
//                 className="text-blue-400 hover:text-blue-300"
//               >
//                 {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
//               </button>
//             </div>
//             <button
//               onClick={() => {
//                 setShowAuthModal(false);
//                 setError('');
//               }}
//               className="absolute top-4 right-4 text-gray-400 hover:text-white"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { TrendingUp, TrendingDown, Search, RefreshCcw } from 'lucide-react';

// function App() {
//   const [cryptoData, setCryptoData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);

//   const fetchCryptoData = async () => {
//     try {
//       setLoading(true);
//       // Directly use CoinGecko API
//       const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
//         params: {
//           vs_currency: 'usd',
//           order: 'market_cap_desc',
//           per_page: 20,
//           sparkline: false
//         }
//       });
//       const transformedData = response.data.map(coin => ({
//         cryptoId: coin.id,
//         name: coin.name,
//         symbol: coin.symbol,
//         currentPrice: coin.current_price,
//         image: coin.image,
//         marketCap: coin.market_cap,
//         priceChangePercentage24h: coin.price_change_percentage_24h
//       }));
//       setCryptoData(transformedData);
//     } catch (error) {
//       console.error('Error fetching crypto data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCryptoData();
//     const interval = setInterval(fetchCryptoData, 60000); // Refresh every minute
//     return () => clearInterval(interval);
//   }, []);

//   const filteredCryptos = cryptoData.filter(crypto =>
//     crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <header className="bg-gray-800 shadow-lg">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <TrendingUp className="text-green-400" />
//               Crypto Price Tracker
//             </h1>
//             <button
//               onClick={fetchCryptoData}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
//             >
//               <RefreshCcw size={18} />
//               Refresh
//             </button>
//           </div>
          
//           {/* Search Bar */}
//           <div className="mt-6 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search cryptocurrencies..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {filteredCryptos.map(crypto => (
//               <div key={crypto.cryptoId} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
//                 <div className="flex items-center gap-4 mb-4">
//                   <img src={crypto.image} alt={crypto.name} className="w-12 h-12" />
//                   <div>
//                     <h2 className="text-xl font-semibold">{crypto.name}</h2>
//                     <p className="text-gray-400 uppercase">{crypto.symbol}</p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Price:</span>
//                     <span className="font-medium">${crypto.currentPrice.toLocaleString()}</span>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">24h Change:</span>
//                     <span className={`flex items-center gap-1 ${
//                       crypto.priceChangePercentage24h > 0 ? 'text-green-400' : 'text-red-400'
//                     }`}>
//                       {crypto.priceChangePercentage24h > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//                       {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Market Cap:</span>
//                     <span className="font-medium">${crypto.marketCap.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { TrendingUp, TrendingDown, Search, RefreshCcw } from 'lucide-react';

// // Use environment variable for API URL if available
// const API_URL = import.meta.env.VITE_API_URL || 'https://crypto-price-tracker-server.vercel.app/api';

// function App() {
//   const [cryptoData, setCryptoData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);

//   const fetchCryptoData = async () => {
//     try {
//       setLoading(true);
//       // First, attempt to fetch data from the backend
//       const response = await axios.get(`${API_URL}/crypto/prices`);
//       setCryptoData(response.data);
//     } catch (error) {
//       console.error('Error fetching from backend, falling back to CoinGecko API:', error);
//       // Fallback to CoinGecko API if backend fails
//       try {
//         const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
//           params: {
//             vs_currency: 'usd',
//             order: 'market_cap_desc',
//             per_page: 20,
//             sparkline: false
//           }
//         });
//         // Transform CoinGecko data to match backend format
//         const transformedData = response.data.map(coin => ({
//           cryptoId: coin.id,
//           name: coin.name,
//           symbol: coin.symbol,
//           currentPrice: coin.current_price,
//           image: coin.image,
//           marketCap: coin.market_cap,
//           priceChangePercentage24h: coin.price_change_percentage_24h
//         }));
//         setCryptoData(transformedData);
//       } catch (fallbackError) {
//         console.error('Error fetching from CoinGecko:', fallbackError);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCryptoData();
//     const interval = setInterval(fetchCryptoData, 5000); // Refresh every minute
//     return () => clearInterval(interval);
//   }, []);

//   const filteredCryptos = cryptoData.filter(crypto =>
//     crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <header className="bg-gray-800 shadow-lg">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <TrendingUp className="text-green-400" />
//               Crypto Price Bot
//             </h1>
//             <button
//               onClick={fetchCryptoData}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
//             >
//               <RefreshCcw size={18} />
//               Refresh
//             </button>
//           </div>

//           {/* Search Bar */}
//           <div className="mt-6 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search cryptocurrencies..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {filteredCryptos.map(crypto => (
//               <div key={crypto.cryptoId} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
//                 <div className="flex items-center gap-4 mb-4">
//                   <img src={crypto.image} alt={crypto.name} className="w-12 h-12" />
//                   <div>
//                     <h2 className="text-xl font-semibold">{crypto.name}</h2>
//                     <p className="text-gray-400 uppercase">{crypto.symbol}</p>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Price:</span>
//                     <span className="font-medium">${crypto.currentPrice.toLocaleString()}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-gray-400">24h Change:</span>
//                     <span className={`flex items-center gap-1 ${
//                       crypto.priceChangePercentage24h > 0 ? 'text-green-400' : 'text-red-400'
//                     }`}>
//                       {crypto.priceChangePercentage24h > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//                       {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Market Cap:</span>
//                     <span className="font-medium">${crypto.marketCap.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Search, RefreshCcw, Sun, Moon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://crypto-price-tracker-server.vercel.app/api';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [nextRefresh, setNextRefresh] = useState(5);
  const [theme, setTheme] = useState('dark');

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/crypto/prices`);
      setCryptoData(response.data);
    } catch (error) {
      console.error('Error fetching from backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();

    const interval = setInterval(() => {
      setNextRefresh((prev) => (prev === 1 ? 5 : prev - 1));
      if (nextRefresh === 5) fetchCryptoData();
    }, 10000);

    return () => clearInterval(interval);
  }, [nextRefresh]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('dark');
  };

  const filteredCryptos = cryptoData.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'} shadow-lg`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="text-green-400" />
              Crypto Price Bot
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">{`Next refresh in ${nextRefresh}s`}</span>
              <button
                onClick={fetchCryptoData}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCcw size={18} />
                Refresh
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCryptos.map((crypto) => (
              <div key={crypto.cryptoId} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow`}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={crypto.image} alt={crypto.name} className="w-12 h-12" />
                  <div>
                    <h2 className="text-xl font-semibold">{crypto.name}</h2>
                    <p className="uppercase">{crypto.symbol}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-medium">${crypto.currentPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change:</span>
                    <span className={`flex items-center gap-1 ${crypto.priceChangePercentage24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.priceChangePercentage24h > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap:</span>
                    <span className="font-medium">${crypto.marketCap.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
