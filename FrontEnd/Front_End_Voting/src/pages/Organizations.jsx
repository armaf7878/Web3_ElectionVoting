import React, { useState, useEffect } from 'react';
import { GetOrganizations, CreateOrganizations, JoinOrganizations } from '../app/api';
import { jwtDecode } from "jwt-decode"; 
import { Link, useNavigate } from 'react-router-dom';

const Organizations = () => {
  const navigate = useNavigate();
  const [myOrgs, setMyOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); 
  const [isAuth, setIsAuth] = useState(true);

  // States cho Modal và Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createData, setCreateData] = useState({ 
    name: '', 
    description: '', 
    memberLimit: 100, 
    approvalType: 'auto' 
  });
  const [joinCode, setJoinCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Kiểm tra sự tồn tại của Token
    if (!token) {
      setIsAuth(false);
      return; 
    }

    try {
      const decoded = jwtDecode(token);
      
      // Kiểm tra token hết hạn (Optional nhưng nên có)
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        setIsAuth(false);
        return;
      }

      setUserId(decoded.id || decoded._id || decoded.sub);
      fetchMyOrgs();
    } catch (error) {
      console.error("Token không hợp lệ hoặc đã hết hạn");
      setIsAuth(false);
    }
  }, []);

  const fetchMyOrgs = async () => {
    setLoading(true);
    try {
      const response = await GetOrganizations();
      // Giả định response trả về trực tiếp mảng các tổ chức
      setMyOrgs(response); 
    } catch (err) {
      console.error("Lỗi lấy danh sách tổ chức:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMemberStatus = (org) => {
    if (!userId || !org.members) return null;
    const member = org.members.find(m => m.user_id === userId);
    return member ? member.status : null; 
  };

  // LOGIC XỬ LÝ: TẠO TỔ CHỨC
  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await CreateOrganizations(
        createData.name, 
        createData.description, 
        createData.memberLimit, 
        createData.approvalType
      );
      setShowCreateModal(false);
      setCreateData({ name: '', description: '', memberLimit: 100, approvalType: 'auto' });
      fetchMyOrgs(); 
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi tạo tổ chức!");
    } finally {
      setActionLoading(false);
    }
  };

  // LOGIC XỬ LÝ: THAM GIA BẰNG MÃ CODE
  const handleJoin = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await JoinOrganizations(joinCode);
      setShowJoinModal(false);
      setJoinCode('');
      fetchMyOrgs(); 
    } catch (err) {
      alert(err.response?.data?.message || "Mã code không hợp lệ hoặc bạn đã tham gia tổ chức này!");
    } finally {
      setActionLoading(false);
    }
  };

  // GIAO DIỆN NẾU CHƯA ĐĂNG NHẬP
  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-n-800 text-n-50 font-grostek">
        <div className="p-10 text-center border bg-n-900/50 border-n-700 rounded-[2.5rem] shadow-2xl max-w-sm w-full mx-4">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 border rounded-3xl bg-p-500/10 text-p-500 border-p-500/20">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-6V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="mb-3 text-2xl font-bold">Yêu cầu xác thực</h2>
          <p className="mb-8 text-sm leading-relaxed text-n-500">Vui lòng đăng nhập vào tài khoản của bạn để truy cập danh sách tổ chức và quyền bầu cử.</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-4 font-bold text-white transition-all shadow-lg bg-p-500 rounded-2xl hover:bg-p-600 active:scale-95 shadow-p-500/20"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-16 pb-20 bg-n-800 text-n-50 font-grostek">
      <div className="container px-4 mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-6 mb-12 md:flex-row">
          <header>
            <h1 className="text-4xl font-bold">Tổ chức của tôi</h1>
            <p className="mt-2 text-n-500">Nơi quản lý quyền bầu cử Blockchain của bạn.</p>
          </header>
          <div className="flex w-full gap-4 md:w-auto">
            <button onClick={() => setShowJoinModal(true)} className="flex-1 px-6 py-3 text-sm font-bold transition-colors border md:flex-none border-n-600 rounded-xl hover:border-n-400">Tham gia bằng mã</button>
            <button onClick={() => setShowCreateModal(true)} className="flex-1 px-6 py-3 text-sm font-bold text-white transition-all shadow-lg md:flex-none bg-p-500 rounded-xl shadow-p-500/20 hover:bg-p-600 active:scale-95">Tạo tổ chức</button>
          </div>
        </div>

        {/* List Organizations */}
        {loading ? (
            <div className="flex items-center justify-center py-20 text-p-500">
                <div className="w-8 h-8 mr-3 border-4 rounded-full border-p-500 border-t-transparent animate-spin"></div>
                Đang tải dữ liệu...
            </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myOrgs.map((org) => {
              const status = getMemberStatus(org);
              const isApproved = status === 'approved';

              return (
                <div key={org._id} className={`relative bg-n-700/30 border p-6 rounded-3xl transition-all ${isApproved ? 'border-n-700 hover:border-p-500' : 'border-p-500/30 opacity-80'}`}>
                  
                  {/* Badge trạng thái */}
                  <div className="absolute top-4 right-4">
                    {!isApproved ? (
                      <span className="bg-p-500/20 text-p-400 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider border border-p-500/30">
                        Chờ duyệt
                      </span>
                    ) : (
                      <span className="bg-green-500/20 text-green-500 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider border border-green-500/30 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                        Đã tham gia
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center w-12 h-12 mb-4 text-xl font-bold border shadow-inner bg-n-800 rounded-xl text-p-500 border-n-700">
                    {org.name.charAt(0)}
                  </div>

                  <h3 className="mb-1 text-xl font-bold">{org.name}</h3>
                  <p className="mb-4 font-mono text-xs text-n-500">Mã code: <span className="text-n-300">{org.code}</span></p>
                  <p className="mb-6 text-sm text-n-400 line-clamp-2">{org.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-n-700/50">
                    <div className="flex -space-x-2">
                      {org.members && org.members.slice(0, 3).map((_, idx) => (
                        <div key={idx} className="w-6 h-6 rounded-full bg-n-600 border-2 border-n-800 flex items-center justify-center text-[8px]">
                          {idx + 1}
                        </div>
                      ))}
                      {org.members && org.members.length > 3 && <div className="text-[10px] text-n-500 pl-3">+{org.members.length - 3}</div>}
                    </div>

                    {isApproved ? (
                      <Link to={`/organizations/${org._id}`} className="text-xs font-bold transition-all text-p-400 hover:text-p-300">
                        Xem chi tiết →
                      </Link>
                    ) : (
                      <span className="text-xs font-bold cursor-not-allowed text-n-600">
                        Đang chờ duyệt...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {!loading && myOrgs.length === 0 && (
              <div className="py-20 text-center border border-dashed col-span-full border-n-700 rounded-3xl bg-n-900/50">
                <p className="text-n-500">Bạn chưa tham gia tổ chức nào.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* MODAL THAM GIA TỔ CHỨC */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-n-900/90 backdrop-blur-sm">
          <div className="relative w-full max-w-sm p-8 overflow-hidden border shadow-2xl bg-n-800 border-n-700 rounded-3xl">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-p-500/10 blur-[40px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="mb-2 text-2xl font-bold">Tham gia tổ chức</h2>
              <p className="mb-6 text-xs text-n-500">Nhập mã định danh (Code) được cấp bởi ban quản trị tổ chức.</p>
              
              <form onSubmit={handleJoin}>
                <input 
                  type="text" 
                  required 
                  placeholder="Ví dụ: a1b2c3d4"
                  className="w-full px-4 py-4 font-mono text-lg text-center transition-colors border outline-none bg-n-700/50 border-n-600 rounded-xl focus:border-p-500 text-n-50"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value)}
                />
                
                <div className="flex gap-3 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowJoinModal(false)} 
                    className="flex-1 py-3 font-bold transition-colors text-n-400 hover:text-n-200"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    disabled={actionLoading || joinCode.trim() === ''} 
                    className="flex-1 py-3 font-bold text-white transition-all shadow-lg bg-p-500 hover:bg-p-600 rounded-xl shadow-p-500/20 disabled:bg-n-600 disabled:shadow-none active:scale-95"
                  >
                    {actionLoading ? "Đang xử lý..." : "Tham gia ngay"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TẠO TỔ CHỨC */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-n-900/90 backdrop-blur-sm">
          <div className="w-full max-w-lg p-8 overflow-hidden border shadow-2xl bg-n-800 border-n-700 rounded-3xl">
            <h2 className="mb-6 text-2xl font-bold text-p-500">Tạo tổ chức mới</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-n-400 uppercase tracking-widest mb-2">Tên tổ chức</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Công ty TNHH..."
                  className="w-full px-4 py-3 text-sm border outline-none bg-n-700/50 border-n-600 rounded-xl focus:border-p-500 text-n-50"
                  value={createData.name}
                  onChange={e => setCreateData({...createData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-n-400 uppercase tracking-widest mb-2">Mô tả</label>
                <textarea 
                  placeholder="Mục đích hoạt động của tổ chức..."
                  className="w-full h-24 px-4 py-3 text-sm border outline-none resize-none bg-n-700/50 border-n-600 rounded-xl focus:border-p-500 text-n-50"
                  value={createData.description}
                  onChange={e => setCreateData({...createData, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-n-400 uppercase tracking-widest mb-2">Giới hạn TV</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full px-4 py-3 text-sm border outline-none bg-n-700/50 border-n-600 rounded-xl focus:border-p-500 text-n-50"
                    value={createData.memberLimit}
                    onChange={e => setCreateData({...createData, memberLimit: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-n-400 uppercase tracking-widest mb-2">Cơ chế duyệt</label>
                  <select 
                    className="w-full px-4 py-3 text-sm border outline-none appearance-none bg-n-700/50 border-n-600 rounded-xl focus:border-p-500 text-n-50"
                    value={createData.approvalType}
                    onChange={e => setCreateData({...createData, approvalType: e.target.value})}
                  >
                    <option value="auto">Tự động (Auto)</option>
                    <option value="manual">Thủ công (Manual)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 mt-8 border-t border-n-700">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)} 
                  className="flex-1 py-3 font-bold transition-colors text-n-400 hover:text-n-200"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={actionLoading} 
                  className="flex-1 py-3 font-bold text-white transition-all shadow-lg bg-p-500 hover:bg-p-600 rounded-xl shadow-p-500/20 disabled:bg-n-600 disabled:shadow-none active:scale-95"
                >
                  {actionLoading ? "Đang xử lý..." : "Khởi tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organizations;