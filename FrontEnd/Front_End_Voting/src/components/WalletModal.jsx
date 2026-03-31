import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ethers } from 'ethers';
import { ConnectWallet, UpdateProfile } from '../app/api';

const WalletModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    message: 'Xác nhận danh tính để tham gia bầu cử tại VoteChain.',
    privateKey: '',
    name: '',
    email: ''
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  if (!isOpen) return null;

  // Xử lý Bước 1: Ký và Connect
  const handleSignAndConnect = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const formattedKey = formData.privateKey.startsWith('0x') ? formData.privateKey : `0x${formData.privateKey}`;
      const wallet = new ethers.Wallet(formattedKey);
      const signature = await wallet.signMessage(formData.message);

      const response = await ConnectWallet(formData.message, signature);
      
      // Lưu token
      localStorage.setItem("token", response.token);

      // Kiểm tra xem có phải user mới không
      if (!response.user.name || response.user.name.trim() === "") {
        setStep(2); // Chuyển sang form nhập profile
        setStatus({ loading: false, error: null, success: false });
      } else {
        window.location.href = "/organizations"; // Redirect về trang chủ nếu đã có profile
        setStatus({ loading: false, error: null, success: true });
        setTimeout(() => {
          onClose();
          resetModal();
        }, 1500);
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        error: err.response?.data?.message || 'Lỗi xác thực. Vui lòng kiểm tra lại Key.', 
        success: false 
      });
    }
  };

  // Xử lý Bước 2: Update Profile
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      await UpdateProfile({
        name: formData.name,
        email: formData.email
      });

      setStatus({ loading: false, error: null, success: true });
      setTimeout(() => {
        onClose();
        resetModal();
      }, 1500);
    } catch (err) {
      console.error("Update Profile Error:", err.response || err);        
      setStatus({ 
        loading: false, 
        error: err.response?.data?.message || 'Không thể cập nhật thông tin.', 
        success: false 
      });
    }
  };

  const resetModal = () => {
    setStep(1);
    setFormData({ message: 'Xác nhận danh tính để tham gia bầu cử tại VoteChain.', privateKey: '', name: '', email: '' });
    setStatus({ loading: false, error: null, success: false });
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-n-900/90 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-md p-8 overflow-hidden duration-300 border shadow-2xl bg-n-800 border-n-700 rounded-3xl animate-in fade-in zoom-in">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-p-500/10 blur-[50px] rounded-full"></div>

        <div className="relative z-10">
          {/* STEP 1: SIGN MESSAGE */}
          {step === 1 && (
            <>
              <h2 className="mb-1 text-2xl font-bold font-grostek text-n-50">Xác thực ví</h2>
              <p className="mb-6 text-sm text-n-500">Ký thông điệp để đăng nhập hệ thống.</p>
              
              <form onSubmit={handleSignAndConnect} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-n-400 uppercase mb-1.5 block tracking-widest">Thông điệp</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full h-20 px-4 py-3 text-sm border outline-none resize-none bg-n-700/50 border-n-700 rounded-xl text-n-50 focus:border-p-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-n-400 uppercase mb-1.5 block tracking-widest">Private Key</label>
                  <input
                    type="password"
                    required
                    value={formData.privateKey}
                    onChange={(e) => setFormData({...formData, privateKey: e.target.value})}
                    placeholder="0x..."
                    className="w-full px-4 py-3 text-sm border outline-none bg-n-700/50 border-n-700 rounded-xl text-n-50 focus:border-p-500"
                  />
                </div>

                {status.error && <p className="text-xs italic text-center text-p-400">{status.error}</p>}
                
                <button 
                  disabled={status.loading} 
                  className="w-full py-4 mt-2 font-bold text-white transition-all shadow-lg bg-p-500 hover:bg-p-600 font-grostek rounded-xl shadow-p-500/20 active:scale-95"
                >
                  {status.loading ? "Đang kiểm tra..." : "Ký & Tiếp tục"}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: UPDATE NEW USER INFO */}
          {step === 2 && (
            <>
              <h2 className="mb-1 text-2xl font-bold font-grostek text-n-50">Cập nhật hồ sơ</h2>
              <p className="mb-6 text-sm text-n-500">Chúng tôi cần một vài thông tin để định danh bạn.</p>
              
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-n-400 uppercase mb-1.5 block tracking-widest">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ngô Thành Danh"
                    className="w-full px-4 py-3 text-sm border outline-none bg-n-700/50 border-n-700 rounded-xl text-n-50 focus:border-p-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-n-400 uppercase mb-1.5 block tracking-widest">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="it_staff@hustle.tech"
                    className="w-full px-4 py-3 text-sm border outline-none bg-n-700/50 border-n-700 rounded-xl text-n-50 focus:border-p-500"
                  />
                </div>

                {status.error && <p className="text-xs italic text-center text-p-400">{status.error}</p>}
                {status.success && <p className="text-xs font-bold text-center text-green-500">Thành công! Đang vào hệ thống...</p>}

                <button 
                  disabled={status.loading || status.success} 
                  className="w-full py-4 mt-2 font-bold text-white transition-all shadow-lg bg-p-500 hover:bg-p-600 font-grostek rounded-xl shadow-p-500/20 active:scale-95"
                >
                  {status.loading ? "Đang lưu..." : "Hoàn tất đăng ký"}
                </button>
              </form>
            </>
          )}

          <button 
            onClick={onClose}
            className="w-full mt-4 text-xs transition-colors text-n-500 hover:text-n-200"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WalletModal;