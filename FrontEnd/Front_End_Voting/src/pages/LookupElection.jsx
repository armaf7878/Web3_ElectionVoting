import React, { useState } from 'react';
import { Election_LookUp } from '../app/api';

const LookupElection = () => {
  const [txHash, setTxHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!txHash.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await Election_LookUp(txHash.trim());
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Không tìm thấy giao dịch này trên Blockchain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-n-800 text-n-50 font-grostek">
      <div className="container max-w-4xl px-4 mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Blockchain Explorer</h1>
          <p className="max-w-lg mx-auto text-n-400">
            Truy vấn và xác thực tính minh bạch của các phiếu bầu trực tiếp từ sổ cái Blockchain thông qua mã giao dịch (TxHash).
          </p>
        </div>

        {/* Search Bar Area */}
        <div className="p-2 mb-10 transition-colors border shadow-2xl bg-n-900 border-n-700 rounded-2xl focus-within:border-p-500">
          <form onSubmit={handleLookup} className="flex flex-col gap-2 md:flex-row">
            <input 
              type="text" 
              placeholder="Nhập mã giao dịch (Tx Hash): 0x..."
              className="flex-1 px-6 py-4 font-mono text-sm bg-transparent outline-none text-p-400"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-4 font-bold text-white transition-all bg-p-500 hover:bg-p-600 rounded-xl active:scale-95 disabled:bg-n-700 disabled:text-n-500"
            >
              {loading ? "Đang truy vấn..." : "Kiểm tra"}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 mb-10 text-sm text-center text-red-500 border bg-red-500/10 border-red-500/50 rounded-xl">
            {error}
          </div>
        )}

        {/* Result Area */}
        {result && (
          <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
            
            {/* 1. Tổng quan Giao dịch */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-5 border bg-n-900 border-n-700 rounded-2xl">
                <p className="text-[10px] text-n-500 uppercase font-bold mb-2">Trạng thái</p>
                <div className="flex items-center gap-2 text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                  <span className="text-sm font-bold uppercase">{result.status === 1 ? "Thành công" : "Thất bại"}</span>
                </div>
              </div>
              <div className="p-5 border bg-n-900 border-n-700 rounded-2xl">
                <p className="text-[10px] text-n-500 uppercase font-bold mb-2">Block Number</p>
                <span className="text-xl font-bold text-p-400">#{result.block}</span>
              </div>
              <div className="p-5 border bg-n-900 border-n-700 rounded-2xl">
                <p className="text-[10px] text-n-500 uppercase font-bold mb-2">Gas Used</p>
                <span className="text-xl font-bold text-n-200">{result.gas.used} units</span>
              </div>
            </div>

            {/* 2. Chi tiết kỹ thuật */}
            <div className="overflow-hidden border bg-n-900 border-n-700 rounded-3xl">
              <div className="p-6 border-b border-n-700">
                <h2 className="flex items-center gap-2 font-bold">
                  <svg className="w-5 h-5 text-p-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Chi tiết giao dịch
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col justify-between gap-2 pb-4 border-b md:flex-row md:items-center border-n-800">
                  <span className="text-xs font-bold uppercase text-n-500">Transaction Hash</span>
                  <span className="font-mono text-sm text-right break-all text-p-400">{result.txHash}</span>
                </div>
                <div className="flex flex-col justify-between gap-2 pb-4 border-b md:flex-row md:items-center border-n-800">
                  <span className="text-xs font-bold uppercase text-n-500">Địa chỉ ví thực hiện</span>
                  <span className="font-mono text-sm text-right break-all text-n-200">{result.from}</span>
                </div>
                <div className="flex flex-col justify-between gap-2 pb-4 border-b md:flex-row md:items-center border-n-800">
                  <span className="text-xs font-bold uppercase text-n-500">Smart Contract</span>
                  <span className="font-mono text-sm text-right break-all text-n-200">{result.contact}</span>
                </div>
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <span className="text-xs font-bold uppercase text-n-500">Hành động thực thi</span>
                  <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase border rounded-lg bg-p-500/10 text-p-500 border-p-500/20">
                    {result.action.function}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Dữ liệu bầu cử (Voter vs Candidate) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Voter Info */}
              <div className="relative p-6 overflow-hidden border bg-n-900 border-n-700 rounded-3xl group">
                <div className="absolute top-0 right-0 w-24 h-24 -mt-10 -mr-10 transition-transform duration-700 rounded-full bg-p-500/5 group-hover:scale-150"></div>
                <h3 className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest uppercase text-n-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-p-500"></div>
                  Người bỏ phiếu (Voter)
                </h3>
                <div className="relative z-10 space-y-3">
                  <p className="text-xl font-bold">{result.action.params.voter_info.name}</p>
                  <p className="text-sm text-n-400">{result.action.params.voter_info.email}</p>
                  <div className="pt-2">
                    <p className="text-[10px] text-n-500 font-mono uppercase mb-1">Ví Blockchain</p>
                    <p className="text-[11px] font-mono text-n-300 break-all bg-n-800 p-2 rounded-lg border border-n-700">
                      {result.action.params.voter_info.walletAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="relative p-6 overflow-hidden border bg-n-900 border-n-700 rounded-3xl group">
                <div className="absolute top-0 right-0 w-24 h-24 -mt-10 -mr-10 transition-transform duration-700 rounded-full bg-green-500/5 group-hover:scale-150"></div>
                <h3 className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest uppercase text-n-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  Bình chọn cho (Candidate)
                </h3>
                <div className="relative z-10 space-y-3">
                  <p className="text-xl font-bold text-green-400">{result.action.params.candidate_info.name}</p>
                  <p className="text-sm text-n-400">{result.action.params.candidate_info.email}</p>
                  <div className="pt-2">
                    <p className="text-[10px] text-n-500 font-mono uppercase mb-1">Ví Blockchain</p>
                    <p className="text-[11px] font-mono text-n-300 break-all bg-n-800 p-2 rounded-lg border border-n-700">
                      {result.action.params.candidate_info.walletAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer verification tag */}
            <div className="pt-6 text-center">
              <p className="text-[10px] text-n-500 uppercase tracking-[0.2em] font-bold">Verified by VoteChain Ledger Protocol</p>
            </div>

          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="flex flex-col items-center mt-20 opacity-20">
             <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             <p className="italic font-bold">Vui lòng nhập mã giao dịch để bắt đầu kiểm tra</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LookupElection;