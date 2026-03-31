import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import thư viện decode token
import WalletModal from './WalletModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openConnectWalletModal, setConnectWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null); // State lưu địa chỉ ví/ID

  // Hàm kiểm tra và decode token
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Tùy thuộc vào payload của bạn, lấy walletAddress hoặc id
        const address = decoded.walletAddress || decoded.id || decoded._id;
        setWalletAddress(address);
      } catch (error) {
        console.error("Token không hợp lệ");
        handleLogout();
      }
    } else {
      setWalletAddress(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setWalletAddress(null);
    setIsMenuOpen(false);
  };

  // Format địa chỉ ví ngắn gọn (VD: 0x1234...5678)
  const formatAddress = (address) => {
    if (!address) return "";
    if (address.length < 12) return address; // Nếu là ID ngắn thì giữ nguyên
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const navLinkClass = ({ isActive }) => 
    `text-sm font-medium transition-colors duration-200 hover:text-p-400 ${
      isActive ? 'text-p-500' : 'text-n-200'
    }`;
  return (
    <header className="fixed top-0 z-50 w-full border-b border-n-700 bg-n-800/95 backdrop-blur supports-[backdrop-filter]:bg-n-800/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 transition-transform rounded-lg bg-p-500 group-hover:rotate-12">
            <span className="text-xl font-bold text-white">V</span>
          </div>
          <span className="text-xl font-bold tracking-tight font-grostek text-n-50">
            VOTE<span className="text-p-500">CHAIN</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="items-center hidden gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>Trang chủ</NavLink>
          <NavLink to="/organizations" className={navLinkClass}>Tổ chức</NavLink>
          <NavLink to="/elections/lookup" className={navLinkClass}>Tra cứu</NavLink>
          <NavLink to="/about_us" className={navLinkClass}>Về chúng tôi</NavLink>
        </nav>

        {/* Desktop Action Button / Profile */}
        <div className="items-center hidden gap-4 md:flex">
          {walletAddress ? (
            // Nếu đã đăng nhập: Hiển thị ví + Hover Đăng xuất
            <div className="relative group">
              <button className="flex items-center gap-2 px-5 py-2 font-mono text-sm font-semibold transition-all border rounded-full text-n-200 border-n-600 bg-n-700/50 hover:bg-n-700">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                {formatAddress(walletAddress)}
              </button>

              {/* Dropdown Menu (Chỉ hiện khi hover) */}
              <div className="absolute right-0 invisible w-40 px-1 pt-3 transition-all duration-200 opacity-0 top-full group-hover:visible group-hover:opacity-100">
                <div className="p-2 border shadow-xl bg-n-800 border-n-700 rounded-xl">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-bold text-left transition-colors rounded-lg text-p-400 hover:bg-p-500/10"
                  >
                    Đăng xuất
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Nếu CHƯA đăng nhập: Hiển thị nút Kết nối ví
            <button 
              className="px-5 py-2 text-sm font-semibold text-white transition-all rounded-full shadow-lg bg-p-500 hover:bg-p-600 font-grostek shadow-p-500/20 active:scale-95"
              onClick={() => setConnectWalletModal(true)}
            >
              Kết nối ví
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-n-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Area */}
      {isMenuOpen && (
        <div className="px-4 py-4 space-y-4 border-t md:hidden border-n-700 bg-n-800">
          <nav className="flex flex-col gap-4">
            <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Trang chủ</NavLink>
            <NavLink to="/organizations" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Tổ chức</NavLink>
            <NavLink to="/about" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Về chúng tôi</NavLink>
          </nav>
          
          <div className="flex flex-col gap-3 pt-4 border-t border-n-700">
            {walletAddress ? (
              <>
                <div className="flex items-center justify-center gap-2 py-2 font-mono text-sm border rounded-lg bg-n-700/30 border-n-600 text-n-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {formatAddress(walletAddress)}
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full py-2 font-semibold transition-colors border rounded-lg text-p-400 border-p-500/30 bg-p-500/10 hover:bg-p-500/20"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <button 
                className="w-full py-2 font-semibold text-white rounded-lg bg-p-500 font-grostek"
                onClick={() => {
                  setConnectWalletModal(true);
                  setIsMenuOpen(false);
                }}
              >
                Kết nối ví
              </button>
            )}
          </div>
        </div>
      )}

      {/* Render Modal */}
      <WalletModal 
        isOpen={openConnectWalletModal} 
        onClose={() => {
          setConnectWalletModal(false);
          checkAuth(); // Kiểm tra lại token ngay khi Modal đóng (vì có thể user vừa đăng nhập thành công)
        }} 
      />
    </header>
  );
};

export default Header;