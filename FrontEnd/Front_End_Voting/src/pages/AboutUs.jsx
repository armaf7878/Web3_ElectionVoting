import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const workflow = [
    {
      step: "01",
      title: "Khởi tạo Tổ chức",
      desc: "Người quản trị tạo tổ chức và thiết lập quy chế phê duyệt thành viên (Tự động hoặc Thủ công)."
    },
    {
      step: "02",
      title: "Định danh Blockchain",
      desc: "Thành viên tham gia bằng mã Code và liên kết ví điện tử để xác thực danh tính duy nhất trên chuỗi."
    },
    {
      step: "03",
      title: "Bỏ phiếu Minh bạch",
      desc: "Mỗi phiếu bầu được đóng gói thành một giao dịch (Transaction) và ghi trực tiếp vào Ledger của Blockchain."
    },
    {
      step: "04",
      title: "Truy xuất & Xác thực",
      desc: "Bất kỳ ai cũng có thể sử dụng TxHash để kiểm tra tính toàn vẹn của phiếu bầu thông qua Explorer."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-n-800 text-n-50 font-grostek">
      <div className="container max-w-6xl px-4 mx-auto">
        
        {/* Section 1: Giới thiệu dự án */}
        <section className="mb-24">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-sm font-bold tracking-widest uppercase text-p-500">Về dự án VoteChain</h2>
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
                Giải pháp Bỏ phiếu <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-p-400 to-p-600">
                  Dựa trên Blockchain
                </span>
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-n-400">
                <strong>VOTECHAIN</strong> là một nền tảng quản lý bỏ phiếu phi tập trung, được thiết kế để giải quyết bài toán về niềm tin và sự minh bạch trong các tổ chức. Bằng cách ứng dụng công nghệ sổ cái blockchain, chúng tôi đảm bảo mỗi phiếu bầu là duy nhất, không thể sửa đổi và có thể kiểm chứng bởi cộng đồng.
              </p>
              <div className="flex gap-4">
                <Link to="/organizations" className="px-6 py-3 font-bold transition-all bg-p-500 rounded-xl hover:bg-p-600">Bắt đầu ngay</Link>
                <a href="https://github.com/armaf7878" target="_blank" className="px-6 py-3 font-bold transition-all border border-n-600 rounded-xl hover:bg-n-700">Xem GitHub</a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute rounded-full -inset-4 bg-p-500/20 blur-3xl"></div>
              <div className="relative p-8 border shadow-2xl bg-n-900 border-n-700 rounded-3xl">
                <h3 className="flex items-center gap-2 mb-4 text-xl font-bold">
                  <div className="w-2 h-2 rounded-full bg-p-500"></div>
                  Giá trị cốt lõi
                </h3>
                <ul className="space-y-4">
                  {[
                    "Bảo mật tuyệt đối qua mật mã học.",
                    "Tính minh bạch công khai (Public Auditable).",
                    "Loại bỏ sự can thiệp từ bên thứ ba.",
                    "Quy trình tham gia tinh gọn, hiện đại."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-n-300">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Workflow trực quan */}
        <section className="mb-24">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Quy trình vận hành</h2>
            <p className="text-n-500">Cách thức VoteChain hoạt động để đảm bảo quyền lợi của bạn.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((item, index) => (
              <div key={index} className="relative group">
                <div className="h-full p-8 transition-all border bg-n-900 border-n-700 rounded-3xl group-hover:border-p-500/50 group-hover:-translate-y-2">
                  <span className="absolute text-5xl font-black transition-colors text-n-800 top-4 right-6 group-hover:text-p-500/10">
                    {item.step}
                  </span>
                  <h4 className="relative z-10 mb-4 text-lg font-bold">{item.title}</h4>
                  <p className="relative z-10 text-sm leading-relaxed text-n-500">{item.desc}</p>
                </div>
                {index < workflow.length - 1 && (
                  <div className="absolute z-20 hidden translate-x-1/2 -translate-y-1/2 lg:block top-1/2 -right-4 text-n-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Bản quyền & Đóng góp */}
        <section className="bg-gradient-to-b from-n-900 to-n-800 border border-n-700 rounded-[3rem] p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-p-500/5 blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Thông tin Tác giả</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center font-bold border w-14 h-14 bg-n-700 rounded-2xl text-p-500 border-n-600">NTD</div>
                  <div>
                    <p className="text-xl font-bold">Ngô Thành Danh</p>
                    <p className="text-sm text-n-500">Fullstack Developer & Blockchain Enthusiast</p>
                  </div>
                </div>
                <p className="text-n-400">
                  Mọi bản quyền nội dung và mã nguồn thuộc về tác giả <strong>Ngô Thành Danh</strong>. 
                  Nếu bạn yêu thích dự án hoặc muốn đóng góp mã nguồn (Contribution), vui lòng liên hệ qua GitHub hoặc các kênh liên lạc cá nhân.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="mailto:tinhoc7649@gmail.com" className="px-4 py-2 text-sm font-semibold transition-colors rounded-lg bg-n-700 hover:text-p-400">Email Contact</a>
                  <a href="https://github.com/armaf7878" target="_blank" className="px-4 py-2 text-sm font-semibold transition-colors rounded-lg bg-n-700 hover:text-p-400">GitHub Profile</a>
                </div>
              </div>
            </div>

            <div className="p-8 border bg-n-800 border-n-600 rounded-3xl">
              <h3 className="flex items-center gap-2 mb-6 text-lg font-bold text-yellow-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                Ủng hộ dự án (Donations)
              </h3>
              <div className="space-y-4">
                <div className="p-4 border bg-n-900 rounded-2xl border-n-700">
                  <p className="text-[10px] text-n-500 uppercase font-bold mb-1 tracking-wider">Ngân hàng Bản Việt (BVB Bank)</p>
                  <p className="font-mono text-xl font-bold tracking-wider text-p-400">9021629432217</p>
                  <p className="mt-2 text-sm text-n-300">Chủ tài khoản: <span className="font-bold">NGO THANH DANH</span></p>
                  <p className="mt-2 text-sm text-n-300">Nội dụng CK: <span className="font-bold"> Donations for VoteChain Project !</span></p>
                </div>
                <p className="text-xs italic text-n-500">
                  * Khoản đóng góp của bạn sẽ được sử dụng để duy trì Server và phát triển các tính năng Blockchain mới. Cảm ơn bạn!
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-sm italic text-center text-n-600">
          &copy; 2024 Ngô Thành Danh. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;