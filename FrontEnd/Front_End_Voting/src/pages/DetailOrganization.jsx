import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  GetDetailedOrganizations, 
  ApproveMember, 
  RejectMember, 
  GetElections, 
  CreateElection 
} from '../app/api';

const DetailOrganization = () => {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal tạo bầu cử
  const [showElectionModal, setShowElectionModal] = useState(false);
  const [electionData, setElectionData] = useState({
    name: '',
    description: '',
    candidates: [''], 
    voters: [], // Danh sách ID người bỏ phiếu
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orgRes, electRes] = await Promise.all([
        GetDetailedOrganizations(id),
        GetElections(id)
      ]);
      setOrg(orgRes);
      setElections(electRes);
    } catch (err) {
      console.error("Lỗi tải chi tiết:", err );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Duyệt/Từ chối
  const handleMemberAction = async (memberId, action) => {
    try {
      if (action === 'approve') await ApproveMember(id, memberId);
      else await RejectMember(id, memberId);
      loadData(); 
    } catch (err) {
      console.error(`Lỗi khi ${action} thành viên:${memberId}`, err);
      alert("Thao tác thất bại");
    }
  };

  // Xử lý chọn/bỏ chọn Voter
  const handleVoterCheckbox = (userId) => {
    setElectionData(prev => {
      const isSelected = prev.voters.includes(userId);
      if (isSelected) {
        return { ...prev, voters: prev.voters.filter(vId => vId !== userId) };
      } else {
        return { ...prev, voters: [...prev.voters, userId] };
      }
    });
  };

  const handleSelectAllVoters = () => {
    const allApprovedIds = org.members
      ?.filter(m => m.status === 'approved')
      .map(m => m.user_id._id);
    
    if (electionData.voters.length === allApprovedIds.length) {
      setElectionData({ ...electionData, voters: [] });
    } else {
      setElectionData({ ...electionData, voters: allApprovedIds });
    }
  };

  // Xử lý tạo cuộc bầu cử
  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const finalCandidates = electionData.candidates.filter(c => c.trim() !== '');
      
      if (electionData.voters.length === 0) {
        return alert("Vui lòng chọn ít nhất một cử tri (voter)");
      }

      await CreateElection(
        id,
        electionData.name,
        electionData.description,
        finalCandidates,
        electionData.voters, // Thêm voters vào API call
        electionData.startTime,
        electionData.endTime
      );
      setShowElectionModal(false);
      loadData();
    } catch (err) {
      console.log("Lỗi khi tạo cuộc bầu cử", err.response);
      alert(`Lỗi khi tạo cuộc bầu cử: ${err.response.data.error}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-n-800 text-p-500 font-grostek">Đang tải dữ liệu Blockchain...</div>;
  if (!org) return <div className="min-h-screen p-10 text-white bg-n-800">Không tìm thấy tổ chức.</div>;

  return (
    <div className="min-h-screen pt-16 pb-20 bg-n-800 text-n-50">
      {/* 1. Header & Banner */}
      <div className="pt-10 pb-12 border-b bg-n-900 border-n-700">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 text-xs font-bold text-white uppercase rounded-md bg-p-500">Organization</span>
                <span className="font-mono text-sm text-n-500">Code: {org.code}</span>
              </div>
              <h1 className="mb-2 text-4xl font-bold font-grostek">{org.name}</h1>
              <p className="max-w-2xl text-n-400">{org.description}</p>
            </div>
            <button 
              onClick={() => setShowElectionModal(true)}
              className="px-6 py-3 font-bold text-white transition-all shadow-lg bg-p-500 hover:bg-p-600 rounded-xl shadow-p-500/20"
            >
              + Tạo cuộc bầu cử mới
            </button>
          </div>
        </div>
      </div>

      <div className="container grid grid-cols-1 gap-10 px-4 mx-auto mt-12 lg:grid-cols-3">
        
        {/* CỘT TRÁI: THÀNH VIÊN */}
        <div className="space-y-10 lg:col-span-1">
          {/* Section: Phê duyệt */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold font-grostek text-p-400">
              Yêu cầu tham gia
              <span className="bg-n-700 text-p-400 text-xs px-2 py-0.5 rounded-full">
                {org.members?.filter(m => m.status === 'pending').length}
              </span>
            </h2>
            <div className="overflow-hidden border bg-n-900 border-n-700 rounded-3xl">
              {org.members?.filter(m => m.status === 'pending').length > 0 ? (
                org.members.filter(m => m.status === 'pending').map((m) => (
                  <div key={m._id} className="flex items-center justify-between p-4 border-b border-n-700 last:border-0">
                    <div>
                      <p className="font-mono text-[10px] text-n-400">{m.user_id._id}</p>
                      <p className="text-sm font-bold text-n-100">{m.user_id.name}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleMemberAction(m.user_id._id, 'reject')} className="p-2 transition-colors rounded-lg hover:bg-p-500/10 text-p-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <button onClick={() => handleMemberAction(m.user_id._id, 'approve')} className="p-2 text-green-500 transition-colors rounded-lg hover:bg-green-500/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-8 text-xs italic text-center text-n-500">Không có yêu cầu chờ duyệt</p>
              )}
            </div>
          </section>

          {/* Section: Thành viên chính thức */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold font-grostek text-n-100">
              Thành viên chính thức
              <span className="bg-n-700 text-n-400 text-xs px-2 py-0.5 rounded-full">
                {org.members?.filter(m => m.status === 'approved').length}
              </span>
            </h2>
            <div className="overflow-hidden border bg-n-900 border-n-700 rounded-3xl">
              {org.members?.filter(m => m.status === 'approved').map((m) => {
                const isOwner = m.user_id._id === org.owner;
                return (
                  <div key={m._id} className={`flex items-center justify-between p-4 border-b border-n-700 last:border-0 ${isOwner ? 'bg-p-500/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${isOwner ? 'bg-p-500 border-p-400 text-white shadow-lg shadow-p-500/20' : 'bg-n-700 border-n-600 text-n-400'}`}>
                        {isOwner ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold ${isOwner ? 'text-p-400' : 'text-n-100'}`}>{m.user_id.name}</p>
                          {isOwner && <span className="text-[9px] bg-p-500 text-white px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">Owner</span>}
                        </div>
                        <p className="font-mono text-[9px] text-n-500 italic">{m.user_id._id}</p>
                      </div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* CỘT PHẢI: BẦU CỬ */}
        <div className="space-y-6 lg:col-span-2">
          <h2 className="text-xl font-bold font-grostek text-n-100">Cuộc bầu cử đang diễn ra</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {elections.length > 0 ? (
              elections.map((el) => (
                <div key={el._id} className="p-6 transition-all border cursor-pointer bg-n-700/20 border-n-700 rounded-3xl hover:border-p-500/40 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-inner bg-n-800 text-p-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-[9px] font-bold text-n-500 border border-n-600 px-2 py-1 rounded-full uppercase tracking-widest">Active</span>
                  </div>
                  <Link to={`/elections/${el._id}`} className="block">
                    <h3 className="mb-2 text-lg font-bold transition-colors group-hover:text-p-400 font-grostek">{el.name}</h3>
                  </Link>
                  <p className="mb-4 text-xs italic text-n-500 line-clamp-2">{el.description}</p>
                  <div className="text-[10px] text-n-400 font-mono bg-n-800/50 p-2 rounded-lg">
                    Hết hạn: {new Date(el.endTime).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border border-dashed col-span-full bg-n-900/50 rounded-3xl border-n-700 text-n-500">
                Chưa có cuộc bầu cử nào được thiết lập.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Modal: Tạo cuộc bầu cử */}
      {showElectionModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-n-900/95 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl p-8 my-10 border shadow-2xl bg-n-800 border-n-700 rounded-3xl">
            <h2 className="mb-6 text-2xl font-bold font-grostek text-p-500">Thiết lập bầu cử mới</h2>
            <form onSubmit={handleCreateElection} className="space-y-6">
              
              <div className="space-y-3">
                <input 
                  type="text" placeholder="Tên cuộc bầu cử" required
                  className="w-full px-4 py-3 border outline-none bg-n-700 border-n-600 rounded-xl focus:border-p-500 text-n-50"
                  value={electionData.name}
                  onChange={e => setElectionData({...electionData, name: e.target.value})}
                />
                <textarea 
                  placeholder="Mô tả mục đích cuộc bầu cử..."
                  className="w-full h-24 px-4 py-3 text-sm border outline-none bg-n-700 border-n-600 rounded-xl focus:border-p-500 text-n-50"
                  value={electionData.description}
                  onChange={e => setElectionData({...electionData, description: e.target.value})}
                />
              </div>

              {/* Danh sách ứng cử viên */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-n-400 tracking-wider">Ứng cử viên (Candidates)</label>
                {electionData.candidates.map((c, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      required
                      className="w-full px-4 py-3 text-xs border outline-none appearance-none bg-n-700 border-n-600 rounded-xl focus:border-p-500 text-n-50"
                      value={c}
                      onChange={(e) => {
                        const newCaps = [...electionData.candidates];
                        newCaps[index] = e.target.value;
                        setElectionData({ ...electionData, candidates: newCaps });
                      }}
                    >
                      <option value="">-- Chọn ứng cử viên #{index + 1} --</option>
                      {org.members?.filter(m => m.status === 'approved').map((member) => (
                        <option 
                          key={member.user_id._id} 
                          value={member.user_id._id}
                          disabled={electionData.candidates.includes(member.user_id._id) && electionData.candidates[index] !== member.user_id._id}
                        >
                          {member.user_id._id === org.owner ? "[Owner] " : ""}
                          {member.user_id.name} [{member.user_id._id.substring(0, 15)}...]
                        </option>
                      ))}
                    </select>
                    {electionData.candidates.length > 1 && (
                      <button type="button" onClick={() => setElectionData({...electionData, candidates: electionData.candidates.filter((_, i) => i !== index)})} className="p-2 text-p-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setElectionData({...electionData, candidates: [...electionData.candidates, ""]})} className="text-[10px] font-bold text-p-400 hover:underline">+ THÊM ỨNG CỬ VIÊN</button>
              </div>

              {/* Danh sách người bỏ phiếu (Voters) */}
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <label className="text-[11px] font-black uppercase text-n-400 tracking-wider">Danh sách cử tri (Voters)</label>
                  <button type="button" onClick={handleSelectAllVoters} className="text-[9px] bg-n-700 px-2 py-1 rounded hover:bg-n-600 transition-colors text-n-300">
                    {electionData.voters.length === org.members?.filter(m => m.status === 'approved').length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </button>
                </div>
                <div className="p-3 space-y-1 overflow-y-auto border max-h-40 bg-n-900/50 border-n-700 rounded-xl custom-scrollbar">
                  {org.members?.filter(m => m.status === 'approved').map((member) => (
                    <label key={member.user_id._id} className="flex items-center gap-3 p-2 transition-colors border border-transparent rounded-lg cursor-pointer hover:bg-n-700/50 hover:border-n-600">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 rounded accent-p-500 border-n-600 bg-n-700"
                        checked={electionData.voters.includes(member.user_id._id)}
                        onChange={() => handleVoterCheckbox(member.user_id._id)}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-n-100">{member.user_id.name}</span>
                        <span className="text-[9px] text-n-500 font-mono">{member.user_id._id}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-n-500 italic">Đã chọn: {electionData.voters.length} người có quyền bỏ phiếu</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-n-500 uppercase font-bold">Ngày bắt đầu</label>
                  <input type="datetime-local" required className="w-full px-4 py-3 mt-1 text-sm border outline-none bg-n-700 border-n-600 rounded-xl focus:border-p-500 text-n-50" onChange={e => setElectionData({...electionData, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] text-n-500 uppercase font-bold">Ngày kết thúc</label>
                  <input type="datetime-local" required className="w-full px-4 py-3 mt-1 text-sm border outline-none bg-n-700 border-n-600 rounded-xl focus:border-p-500 text-n-50" onChange={e => setElectionData({...electionData, endTime: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowElectionModal(false)} className="flex-1 py-4 font-bold transition-colors text-n-400 hover:text-n-200">Hủy bỏ</button>
                <button type="submit" className="flex-1 py-4 font-bold text-white transition-all shadow-lg bg-p-500 hover:bg-p-600 rounded-xl shadow-p-500/20">Xác nhận tạo bầu cử</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailOrganization;