import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen font-sans bg-n-800 text-n-50 selection:bg-p-500/30">
      
      {/* 1. HERO SECTION: Giới thiệu & Thử ngay */}
      <section className="relative pt-20 pb-16 overflow-hidden md:pt-32 md:pb-24">
        {/* Trang trí nền */}
        <div className="absolute top-0 w-full h-full -translate-x-1/2 pointer-events-none left-1/2">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-p-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-p-900/20 blur-[100px] rounded-full"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight font-grostek md:text-7xl">
            Bầu Cử Minh Bạch Trên <br />
            <span className="text-p-500">Nền Tảng Blockchain</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-10 text-lg text-n-200 md:text-xl">
            Giải pháp bỏ phiếu an toàn, không thể thay đổi và hoàn toàn minh bạch. 
            Mọi phiếu bầu đều được mã hóa và ghi lại vĩnh viễn trên sổ cái.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="bg-p-500 hover:bg-p-600 text-white px-8 py-4 rounded-full font-grostek font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(189,33,47,0.4)] active:scale-95">
              <Link to="/organizations"> Thử ngay bây giờ </Link>
            </button>
            <button className="px-8 py-4 text-lg font-bold transition-all border rounded-full border-n-500 hover:border-n-200 text-n-50 font-grostek">
              <Link to="/about_us"> Tìm hiểu thêm </Link>
            </button>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION: Cách thức hoạt động */}
      <section className="py-20 bg-n-700/30">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold font-grostek md:text-4xl">Cách thức hoạt động</h2>
            <div className="w-20 h-1.5 bg-p-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Kết nối Ví",
                desc: "Sử dụng ví điện tử để xác thực danh tính một cách ẩn danh và bảo mật tuyệt đối."
              },
              {
                step: "02",
                title: "Bỏ phiếu mã hóa",
                desc: "Phiếu bầu của bạn được mã hóa và gửi vào mạng lưới Blockchain, không ai có thể can thiệp."
              },
              {
                step: "03",
                title: "Xác thực kết quả",
                desc: "Kết quả được tổng hợp tự động bằng Smart Contract và có thể kiểm chứng bởi bất kỳ ai."
              }
            ].map((item, index) => (
              <div key={index} className="p-8 transition-colors border bg-n-800 rounded-2xl border-n-700 hover:border-p-500/50 group">
                <span className="text-5xl font-black transition-colors font-grostek text-p-500/20 group-hover:text-p-500/40">
                  {item.step}
                </span>
                <h3 className="mt-4 mb-3 text-xl font-bold font-grostek text-n-50">{item.title}</h3>
                <p className="leading-relaxed text-n-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIALS SECTION: Đánh giá người dùng */}
      <section className="py-20 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-end justify-between gap-6 mb-12 md:flex-row">
            <div className="max-w-xl text-left">
              <h2 className="mb-4 text-3xl font-bold font-grostek md:text-4xl text-p-100">Cộng đồng nói gì?</h2>
              <p className="text-n-500">Hàng ngàn cử tri đã tin tưởng sử dụng hệ thống của chúng tôi để thực hiện quyền dân chủ của mình.</p>
            </div>
            <div className="flex gap-2">
               {/* Nút điều hướng giả định */}
               <div className="flex items-center justify-center w-10 h-10 transition-colors border rounded-full cursor-pointer border-n-700 text-n-500 hover:text-p-500">←</div>
               <div className="flex items-center justify-center w-10 h-10 transition-colors border rounded-full cursor-pointer border-n-700 text-n-500 hover:text-p-500">→</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Lê Minh Tuấn", role: "Trưởng dự án TechVibe", text: "Hệ thống cực kỳ trực quan. Việc ứng dụng Blockchain giúp tôi hoàn toàn yên tâm về tính công bằng của cuộc bầu cử nội bộ." },
              { name: "Trần Thị Lan", role: "Cử tri tự do", text: "Lần đầu tiên tôi thấy việc bầu cử đơn giản như vậy. Giao diện đẹp, mượt mà và cảm giác rất chuyên nghiệp." },
              { name: "Phạm Hoàng Nam", role: "Chuyên gia bảo mật", text: "Kiến trúc mã hóa của các bạn rất ấn tượng. Đây chính là tương lai của các hệ thống quản trị hiện đại." }
            ].map((user, index) => (
              <div key={index} className="relative p-8 border bg-gradient-to-br from-n-700 to-n-800 rounded-3xl border-n-700">
                <div className="absolute top-6 right-8 text-p-500 opacity-20">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V4C14.017 3.44772 14.4647 3 15.017 3H20.017C21.1216 3 22.017 3.89543 22.017 5V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM2.01697 21L2.01697 18C2.01697 16.8954 2.9124 16 4.01697 16H7.01697C7.56925 16 8.01697 15.5523 8.01697 15V9C8.01697 8.44772 7.56925 8 7.01697 8H3.01697C2.46468 8 2.01697 7.55228 2.01697 7V4C2.01697 3.44772 2.46468 3 3.01697 3H8.01697C9.12154 3 10.017 3.89543 10.017 5V15C10.017 18.3137 7.33068 21 4.01697 21H2.01697Z" /></svg>
                </div>
                <p className="relative z-10 mb-8 italic text-n-200">"{user.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 font-bold border rounded-full bg-p-500/20 border-p-500/40 text-p-500">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold font-grostek text-n-50">{user.name}</h4>
                    <p className="text-xs tracking-widest uppercase text-n-500">{user.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;