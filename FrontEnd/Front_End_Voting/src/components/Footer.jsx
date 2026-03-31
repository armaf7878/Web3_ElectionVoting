import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="font-sans border-t bg-n-800 border-n-700 text-n-200">
      <div className="container px-4 py-12 mx-auto md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          
          {/* Cột 1: Logo & Mô tả ngắn */}
          <div className="space-y-4 md:col-span-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-8 h-8 transition-transform rounded-lg bg-p-500 group-hover:rotate-12">
                <span className="text-xl font-bold text-white">V</span>
              </div>
              <span className="text-xl font-bold tracking-tight font-grostek text-n-50">
                VOTE<span className="text-p-500">CHAIN</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-n-500">
              Nền tảng bỏ phiếu phi tập trung mang tính minh bạch, bảo mật và toàn vẹn tuyệt đối đến cho mọi tổ chức.
            </p>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-bold tracking-wider uppercase font-grostek text-n-50">Hệ thống</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="transition-colors hover:text-p-400">Trang chủ</Link></li>
              <li><Link to="/elections" className="transition-colors hover:text-p-400">Bầu cử</Link></li>
              <li><Link to="/results" className="transition-colors hover:text-p-400">Kết quả</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-p-400">Về chúng tôi</Link></li>
            </ul>
          </div>

          {/* Cột 3: Tài nguyên Blockchain */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-bold tracking-wider uppercase font-grostek text-n-50">Tài nguyên</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="transition-colors hover:text-p-400">Smart Contracts</a></li>
              <li><a href="#" className="transition-colors hover:text-p-400">Whitepaper</a></li>
              <li><a href="#" className="transition-colors hover:text-p-400">Mã nguồn mở</a></li>
              <li><a href="#" className="transition-colors hover:text-p-400">FAQ</a></li>
            </ul>
          </div>

          {/* Cột 4: Newsletter */}
          <div className="space-y-4 md:col-span-4">
            <h3 className="text-sm font-bold tracking-wider uppercase font-grostek text-n-50">Nhận bản tin</h3>
            <p className="text-sm text-n-500">Cập nhật các tính năng và cuộc bầu cử mới nhất từ mạng lưới.</p>
            <form className="flex flex-col gap-2 mt-2 sm:flex-row">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="flex-1 px-4 py-2 text-sm transition-colors border rounded-lg bg-n-700 border-n-600 text-n-50 placeholder-n-500 focus:outline-none focus:border-p-500"
              />
              <button className="px-4 py-2 text-sm font-semibold text-white transition-colors rounded-lg bg-p-500 hover:bg-p-600 font-grostek whitespace-nowrap active:scale-95">
                Đăng ký
              </button>
            </form>
          </div>

        </div>

        <hr className="my-10 border-n-700" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-n-500">
            © {currentYear} VoteChain. Không có bản quyền nào bị can thiệp trên chuỗi. Bản quyền source code thuộc về Ngô Thành Danh
          </div>
          
          {/* Social icons giả định bằng text */}
          <div className="flex items-center gap-6 text-sm text-n-500">
            <a href="#" className="transition-colors hover:text-p-500">Twitter (X)</a>
            <a href="https://github.com/armaf7878/" className="transition-colors hover:text-p-500">GitHub</a>
            <a href="#" className="transition-colors hover:text-p-400">Discord</a>
            <a href="#" className="transition-colors hover:text-p-400">Telegram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;