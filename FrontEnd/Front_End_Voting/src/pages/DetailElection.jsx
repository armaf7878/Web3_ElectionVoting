import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { 
  GetDetailedElections, 
  GetVoteTransactions, 
  VoteElection, 
  GetElectionResults 
} from '../app/api';

const DetailElection = () => {
  const { electionId } = useParams();
  
  // States dữ liệu
  const [election, setElection] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [results, setResults] = useState(null); // Lưu kết quả sau khi unlock
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // States thao tác (Modals)
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Forms
  const [voteForm, setVoteForm] = useState({ candidate_id: '', private_key: '' });
  const [resultKey, setResultKey] = useState('');

  useEffect(() => {
    // Lấy ID user hiện tại từ token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id || decoded._id || decoded.sub);
      } catch (err) {
        console.error("Lỗi decode token");
      }
    }
    loadElectionData();
  }, [electionId]);

  const loadElectionData = async () => {
    setLoading(true);
    try {
      
      const [elecData, txData] = await Promise.all([
        GetDetailedElections(electionId),
        GetVoteTransactions(electionId)
      ]);
      setElection(elecData);
      setTransactions(txData);
    } catch (err) {
      console.error("Lỗi tải chi tiết bầu cử:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logic kiểm tra trạng thái của user
  const votedUserIds = transactions.map(tx => tx.voter_id._id);
  const hasVoted = votedUserIds.includes(userId);
  const isEligibleVoter = election?.voters.some(v => v._id === userId);

  // Xử lý Bỏ phiếu
  const handleVote = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formattedKey = voteForm.private_key.startsWith('0x') ? voteForm.private_key : `0x${voteForm.private_key}`;
      await VoteElection(electionId, voteForm.candidate_id, formattedKey);
      
      alert("Bỏ phiếu thành công! Giao dịch đã được ghi vào Blockchain.");
      setShowVoteModal(false);
      loadElectionData(); // Refresh data để lấy transaction mới
    } catch (err) {
      console.log("Lỗi khi bỏ phiếu:", err.response)
      if(err.response.data.error == "Election not active"){
        return alert(`Cuộc bầu cử chưa đến thời gian bắt đầu`);
      }
      alert(`Lỗi khi bỏ phiếu`);
    } finally {
      setActionLoading(false);
    }
  };

  // Xử lý Lấy kết quả (Unlock Results)
  const handleUnlockResults = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formattedKey = resultKey.startsWith('0x') ? resultKey : `0x${resultKey}`;
      const res = await GetElectionResults(electionId, formattedKey);
      
      // Chuyển mảng kết quả thành Object lookup { "Tên Ứng Viên": "Số vote" }
      const resultsMap = res.results.reduce((acc, curr) => {
        acc[curr.name] = curr.voteCount;
        return acc;
      }, {});
      
      setResults(resultsMap);
      setShowResultModal(false);
    } catch (err) {
      console.error("Lỗi khi mở khóa kết quả:", err.response?.data?.error || err.message);
      alert(`Không thể mở khóa kết quả. Key có thể không có quyền. ${err.response?.data?.error}` || "Lỗi không xác định");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-n-800 font-grostek text-p-500">Đang đồng bộ Sổ cái...</div>;
  if (!election) return <div className="min-h-screen p-10 bg-n-800 text-n-50">Không tìm thấy dữ liệu bầu cử.</div>;

  return (
    <div className="min-h-screen pt-16 pb-20 bg-n-800 text-n-50">
      
      {/* 1. Header Bầu cử */}
      <div className="relative pt-8 pb-10 overflow-hidden border-b bg-n-900 border-n-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-p-500/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="container relative z-10 px-4 mx-auto">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex gap-3 mb-3">
                <span className="bg-p-500/20 text-p-500 border border-p-500/30 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">
                  {election.status === 'active' ? 'Đang diễn ra' : 'Đã kết thúc'}
                </span>
                <span className="bg-n-800 text-n-400 border border-n-700 px-3 py-1 rounded-md text-[10px] font-mono">
                  {election.organization.name}
                </span>
              </div>
              <h1 className="mb-2 text-3xl font-bold md:text-4xl font-grostek">{election.name}</h1>
              <p className="font-mono text-xs text-n-400">Contract: <span className="text-p-400">{election.contractAddress}</span></p>
              <div className="text-[11px] text-n-500 mt-4 flex gap-6">
                <p>Bắt đầu: <span className="text-n-200">{new Date(election.startTime).toLocaleString()}</span></p>
                <p>Kết thúc: <span className="text-n-200">{new Date(election.endTime).toLocaleString()}</span></p>
              </div>
            </div>

            {/* Cụm Nút Hành Động */}
            <div className="flex w-full gap-4 md:w-auto">
              {results === null ? (
                <button 
                  onClick={() => setShowResultModal(true)}
                  className="flex-1 px-6 py-3 text-sm font-bold transition-all border md:flex-none border-n-600 hover:border-p-500 hover:text-p-400 text-n-200 rounded-xl"
                >
                  Mở khóa Kết quả
                </button>
              ) : (
                <button className="flex-1 px-6 py-3 text-sm font-bold text-green-500 border cursor-default md:flex-none border-green-500/50 bg-green-500/10 rounded-xl">
                  Kết quả đã mở khóa
                </button>
              )}

              {election.status === 'active' && (
                <button 
                  onClick={() => setShowVoteModal(true)}
                  disabled={hasVoted || !isEligibleVoter}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                    hasVoted || !isEligibleVoter 
                      ? 'bg-n-700 text-n-500 cursor-not-allowed border border-n-600'
                      : 'bg-p-500 hover:bg-p-600 text-white shadow-p-500/20'
                  }`}
                >
                  {!isEligibleVoter ? 'Không có quyền' : hasVoted ? 'Đã bỏ phiếu' : 'Bỏ phiếu ngay'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container grid grid-cols-1 gap-10 px-4 mx-auto mt-10 lg:grid-cols-2">
        
        {/* 2. Danh sách Ứng cử viên (Candidates) */}
        <section className="space-y-4">
          <h2 className="flex items-center justify-between text-xl font-bold font-grostek text-n-100">
            Ứng cử viên
            <span className="px-2 py-1 text-xs border rounded-lg bg-n-700 text-n-400 border-n-600">
              Tổng số: {election.candidates.length}
            </span>
          </h2>
          <div className="space-y-3">
            {election.candidates.map((cand) => (
              <div key={cand._id} className="flex items-center justify-between p-5 transition-colors border bg-n-900 border-n-700 rounded-3xl hover:border-n-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 text-xl font-bold border bg-n-800 border-n-600 rounded-xl text-n-200">
                    {cand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-n-50">{cand.name}</h3>
                    <p className="text-[10px] text-n-500 font-mono mt-0.5">ID: {cand._id}</p>
                    <p className="text-[10px] text-n-500 font-mono">Ví: {cand.walletAddress.substring(0,15)}...</p>
                  </div>
                </div>

                {/* Hiển thị số vote nếu đã mở khóa kết quả */}
                {results && (
                  <div className="text-right">
                    <p className="text-3xl font-black font-grostek text-p-400">{results[cand.name] || 0}</p>
                    <p className="text-[10px] text-n-500 uppercase tracking-widest">Votes</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. Danh sách Cử tri (Voters) */}
        <section className="space-y-4">
          <h2 className="flex items-center justify-between text-xl font-bold font-grostek text-n-100">
            Cử tri có quyền bỏ phiếu
            <span className="px-2 py-1 text-xs border rounded-lg bg-n-700 text-n-400 border-n-600">
              Đã vote: {votedUserIds.length}/{election.voters.length}
            </span>
          </h2>
          <div className="overflow-hidden border bg-n-900 border-n-700 rounded-3xl">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {election.voters.map((voter) => {
                const isVoted = votedUserIds.includes(voter._id);
                return (
                  <div key={voter._id} className="flex items-center justify-between p-4 transition-colors border-b border-n-700/50 last:border-0 hover:bg-n-800/50">
                    <div>
                      <p className={`text-sm font-bold ${isVoted ? 'text-n-50' : 'text-n-300'}`}>{voter.name}</p>
                      <p className="font-mono text-[10px] text-n-500 mt-0.5">{voter._id}</p>
                    </div>
                    {/* Badge trạng thái bỏ phiếu */}
                    {isVoted ? (
                      <span className="flex items-center gap-1 bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                        Đã vote
                      </span>
                    ) : (
                      <span className="text-n-500 text-[10px] px-2 py-1 uppercase tracking-widest">Chưa vote</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      {/* 4. Sổ cái Blockchain (Ledger Slider) */}
      <div className="container px-4 mx-auto mt-16">
        <h2 className="flex items-center gap-2 mb-6 text-xl font-bold font-grostek text-n-100">
          <svg className="w-5 h-5 text-p-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          Sổ cái Blockchain
        </h2>
        
        {transactions.length === 0 ? (
          <div className="p-10 text-sm text-center border border-dashed bg-n-900 border-n-700 rounded-3xl text-n-500">
            Chưa có giao dịch nào được ghi nhận trên mạng lưới.
          </div>
        ) : (
          <div className="relative">
            {/* Đường dây kết nối (chạy ngang ở giữa slider) */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-n-700 -translate-y-1/2 z-0"></div>
            
            {/* Slider container */}
            <div className="relative z-10 flex gap-6 px-2 pt-2 pb-6 overflow-x-auto no-scrollbar snap-x">
              {transactions.map((tx) => (
                <div key={tx._id} className="min-w-[280px] bg-n-800 border-2 border-n-600 rounded-2xl p-5 shadow-xl snap-start relative group hover:border-p-500 transition-colors">
                  
                  {/* Điểm nối với dây */}
                  <div className="absolute w-2 h-2 transition-colors -translate-y-1/2 rounded-full -left-3 top-1/2 bg-n-500 group-hover:bg-p-500"></div>
                  <div className="absolute w-2 h-2 transition-colors -translate-y-1/2 rounded-full -right-3 top-1/2 bg-n-500 group-hover:bg-p-500"></div>

                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-black uppercase text-p-400 bg-p-500/10 px-2 py-0.5 rounded">Block #{tx.blockNumber}</span>
                    <span className="text-[10px] text-n-500">{new Date(tx.createdAt).toLocaleTimeString()}</span>
                  </div>
                  
                  <div className="mb-4 space-y-1">
                    <p className="text-[10px] text-n-400 uppercase tracking-widest font-bold">Tx Hash</p>
                    <p className="text-[11px] font-mono text-green-400 bg-green-500/10 p-1.5 rounded truncate border border-green-500/20" title={tx.transactionHash}>
                      {tx.transactionHash}
                    </p>
                  </div>

                  <div className="text-[10px] border-t border-n-700 pt-3 flex justify-between">
                    <div className="w-[45%]">
                      <p className="text-n-500 mb-0.5">Từ (Voter)</p>
                      <p className="font-bold truncate text-n-200">{tx.voter_id.name}</p>
                    </div>
                    <div className="w-[10%] flex items-center justify-center text-n-600">→</div>
                    <div className="w-[45%] text-right">
                      <p className="text-n-500 mb-0.5">Tới (Candidate)</p>
                      <p className="font-bold truncate text-n-200">{tx.candidate_id.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: BỎ PHIẾU */}
      {showVoteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-n-900/95 backdrop-blur-md">
          <div className="relative w-full max-w-md p-8 overflow-hidden border shadow-2xl bg-n-800 border-n-700 rounded-3xl">
            <h2 className="mb-2 text-2xl font-bold font-grostek text-n-50">Thực hiện quyền Bỏ phiếu</h2>
            <p className="mb-6 text-xs text-n-400">Phiếu bầu sẽ được mã hóa bằng Private Key và lưu trữ vĩnh viễn.</p>
            
            <form onSubmit={handleVote} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase text-n-400 mb-2 block">Chọn Ứng cử viên</label>
                <select 
                  required
                  className="w-full px-4 py-3 text-sm border outline-none appearance-none bg-n-700 border-n-600 rounded-xl focus:border-p-500"
                  value={voteForm.candidate_id}
                  onChange={e => setVoteForm({...voteForm, candidate_id: e.target.value})}
                >
                  <option value="">-- Lựa chọn của bạn --</option>
                  {election.candidates.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-n-400 mb-2 block text-p-400">Private Key xác thực</label>
                <input 
                  type="password" required placeholder="0x..."
                  className="w-full px-4 py-3 text-sm border outline-none bg-n-700 border-n-600 rounded-xl focus:border-p-500"
                  value={voteForm.private_key}
                  onChange={e => setVoteForm({...voteForm, private_key: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowVoteModal(false)} className="w-1/3 py-3 font-bold text-n-400 hover:text-n-200">Hủy</button>
                <button type="submit" disabled={actionLoading} className="w-2/3 py-3 font-bold text-white shadow-lg bg-p-500 hover:bg-p-600 rounded-xl shadow-p-500/20 disabled:bg-n-600 disabled:shadow-none">
                  {actionLoading ? 'Đang tạo Block...' : 'Xác nhận Bỏ phiếu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MỞ KHÓA KẾT QUẢ */}
      {showResultModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-n-900/95 backdrop-blur-md">
          <div className="w-full max-w-sm p-8 border shadow-2xl bg-n-800 border-n-700 rounded-3xl">
            <h2 className="mb-2 text-xl font-bold font-grostek text-p-400">Giải mã Kết quả</h2>
            <p className="text-[11px] text-n-400 mb-6">Yêu cầu Private Key (Thường là của Admin/Owner) để giải mã dữ liệu kiểm phiếu.</p>
            
            <form onSubmit={handleUnlockResults} className="space-y-5">
              <input 
                type="password" required placeholder="Nhập Private Key..."
                className="w-full px-4 py-3 text-sm text-center border outline-none bg-n-700 border-n-600 rounded-xl focus:border-p-500"
                value={resultKey}
                onChange={e => setResultKey(e.target.value)}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowResultModal(false)} className="flex-1 py-3 font-bold text-n-400">Đóng</button>
                <button type="submit" disabled={actionLoading} className="flex-1 py-3 font-bold transition-colors bg-n-200 text-n-800 rounded-xl hover:bg-white">
                  {actionLoading ? 'Đang giải mã...' : 'Mở khóa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailElection;