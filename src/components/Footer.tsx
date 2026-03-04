import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-secondary-bg/30 border-t border-white/5 pt-16 pb-8 px-4 md:px-8 mt-20">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex flex-col items-start">
            <span className="text-3xl font-black text-accent tracking-tighter">MET39</span>
            <span className="text-xs text-text-muted uppercase tracking-widest font-medium -mt-1">
              Điện ảnh – nơi phản chiếu những ước mơ
            </span>
          </Link>
          <p className="text-sm text-text-muted leading-relaxed mt-2">
            MET39 là nền tảng xem phim miễn phí, cập nhật liên tục những bộ phim mới nhất, 
            chất lượng cao và trải nghiệm người dùng tối ưu.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Khám phá</h4>
          <ul className="flex flex-col gap-3 text-sm text-text-muted">
            <li><Link to="/type/phim-moi" className="hover:text-accent transition-colors">Phim mới cập nhật</Link></li>
            <li><Link to="/type/phim-le" className="hover:text-accent transition-colors">Phim lẻ</Link></li>
            <li><Link to="/type/phim-bo" className="hover:text-accent transition-colors">Phim bộ</Link></li>
            <li><Link to="/type/hoat-hinh" className="hover:text-accent transition-colors">Phim hoạt hình</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Hỗ trợ</h4>
          <ul className="flex flex-col gap-3 text-sm text-text-muted">
            <li><Link to="#" className="hover:text-accent transition-colors">Câu hỏi thường gặp</Link></li>
            <li><Link to="#" className="hover:text-accent transition-colors">Liên hệ chúng tôi</Link></li>
            <li><Link to="#" className="hover:text-accent transition-colors">Khiếu nại bản quyền</Link></li>
            <li><Link to="#" className="hover:text-accent transition-colors">Yêu cầu phim</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Pháp lý</h4>
          <ul className="flex flex-col gap-3 text-sm text-text-muted">
            <li><Link to="#" className="hover:text-accent transition-colors">Điều khoản sử dụng</Link></li>
            <li><Link to="#" className="hover:text-accent transition-colors">Chính sách bảo mật</Link></li>
            <li><Link to="#" className="hover:text-accent transition-colors">Chính sách cookie</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
        <p>© 2024 MET39. All rights reserved.</p>
        <p>Developed with ❤️ for movie lovers.</p>
      </div>
    </footer>
  );
};
