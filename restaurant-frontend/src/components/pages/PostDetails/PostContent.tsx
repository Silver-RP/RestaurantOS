import ButtonComponents from "../../../components/common/ButtonComponents";
import {
  FaShareAlt,
  FaFacebookF,
  FaTwitter,
  FaUser,
  FaHeart,
} from 'react-icons/fa';
import { IoList } from 'react-icons/io5';
import { MdOutlineAccessTime, MdComment } from 'react-icons/md';

const PostContent = () => {
  return (
    <section className="bg-[#012B40] text-white lg:py-16 px-6">
      <div className="max-w-full lg:max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Món Beef Stack của nhà hàng chúng tôi
        </h1>

        {/* Chia sẻ */}
        <div className="flex gap-4 mt-6 flex-wrap justify-start">
          <button className="bg-white text-black px-3 py-1.5 text-xs flex items-center gap-1">
            <FaShareAlt /> Chia sẻ
          </button>
          <button className="bg-white text-black px-3 py-1.5 text-xs flex items-center gap-1">
            <FaFacebookF /> Facebook
          </button>
          <button className="bg-white text-black px-3 py-1.5 text-xs flex items-center gap-1">
            <FaTwitter /> Twitter
          </button>
        </div>

        {/* Thông tin */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6 mt-4">
          <span className="flex items-center gap-2">
            <FaUser /> Đăng bởi: <strong>Tin Tức</strong>
          </span>
          <span className="flex items-center gap-2">
            <IoList /> Chủ đề: Thực phẩm lành mạnh
          </span>
          <span className="flex items-center gap-2">
            <MdOutlineAccessTime /> Ngày: Thứ Sáu, 18 Tháng 2, 2022
          </span>
          <span className="flex items-center gap-2">
            <MdComment /> Bình luận: 0
          </span>
          <span className="flex items-center gap-2">
            <FaHeart /> Lượt xem: 1405
          </span>
        </div>

        {/* Hình ảnh */}
        <div className="mb-6 flex justify-center">
          <img
            src="/assets/images/posts/Post.jpg"
            alt="Người phụ nữ đang ăn"
            className="rounded-lg shadow-lg w-full h-auto max-w-[393.94px] max-h-[480.61px] object-cover"
          />
        </div>

        {/* Nội dung */}
        <div className="space-y-4 leading-relaxed text-gray-200 mb-12">
          <p>
            Món Beef Stack tại nhà hàng chúng tôi là một tác phẩm nghệ thuật ẩm thực, được chế biến từ những miếng bò thượng hạng,
            chọn lọc kỹ càng từ những phần thịt tươi ngon nhất.
          </p>
          <p>
            Thịt bò được nướng vừa chín tới, giữ trọn vẹn độ mềm mại, mọng nước và hương vị đậm đà,
            khiến mỗi miếng cắn vào là một trải nghiệm tuyệt vời.
          </p>
          <p>
            Đặc biệt, món ăn này được kết hợp hoàn hảo với lớp phô mai béo ngậy tan chảy trên bề mặt,
            cùng với rau củ tươi ngon được chế biến khéo léo, mang đến một hương vị hài hòa, tươi mới.
          </p>
          <p>
            Để tăng thêm phần hấp dẫn, Beef Stack còn được gia giảm với những gia vị đặc trưng,
            mang lại sự cân bằng giữa sự thơm ngon và một chút cay nồng nhẹ nhàng, tạo nên một món ăn đầy mê hoặc.
          </p>
          <p>
            Không chỉ đẹp mắt trong cách bày trí, món Beef Stack còn là sự lựa chọn hoàn hảo
            cho những thực khách yêu thích món ăn nướng, đậm đà mà vẫn đầy đủ dinh dưỡng.
          </p>
          <p>
            Món ăn này không chỉ mang lại cảm giác thỏa mãn về mặt vị giác mà còn là một bữa tiệc màu sắc và hương thơm,
            khiến cho mỗi bữa ăn tại nhà hàng của chúng tôi trở nên đặc biệt và khó quên.
          </p>
        </div>

        {/* Thẻ tags */}
        <div className="mb-10 text-right">
          <span className="font-semibold mr-2 text-sm">Thẻ:</span>
          <button className="bg-gray-100 text-black px-2 py-0.5 text-xs rounded mr-2">leotheme</button>
          <button className="bg-gray-100 text-black px-2 py-0.5 text-xs rounded mr-2">prestashop</button>
          <button className="bg-gray-100 text-black px-2 py-0.5 text-xs rounded mr-2">magento</button>
          <button className="bg-gray-100 text-black px-2 py-0.5 text-xs rounded">opencart</button>
        </div>

        {/* Danh mục liên quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300 pt-6 mb-10">
          <div>
            <h3 className="font-semibold text-white mb-2">Trong cùng danh mục</h3>
            <ul className="space-y-1">
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">Giá trị tuyệt vời với phong cách đẳng cấp, hãy thử ngay hôm nay</li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">Thưởng thức món ăn tại không gian đậm chất Á Đông</li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">Ẩm thực tinh tế, phong phú và hấp dẫn</li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">Khám phá món mới mỗi tuần với đầu bếp 5 sao</li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">Không gian ấm cúng, món ăn giàu dinh dưỡng</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Liên quan theo thẻ</h3>
            <ul className="space-y-1">
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">Không gian ấm cúng, món ăn giàu dinh dưỡng</li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">Thưởng thức món ăn tại không gian đậm chất Á Đông</li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">Hương vị độc đáo, phong cách ẩm thực hiện đại</li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">Giá trị tuyệt vời với phong cách đẳng cấp, hãy thử ngay hôm nay</li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">Ẩm thực tinh tế, phong phú và hấp dẫn</li>
            </ul>
          </div>
        </div>

        {/* Không có bình luận */}
        <div className="bg-green-100 text-green-800 text-sm px-4 py-3 rounded mb-6">
          ✓ Không có bình luận nào vào lúc này!
        </div>

        {/* Tiêu đề form */}
        <h3 className="text-xl font-semibold text-white mb-6">Để lại bình luận của bạn</h3>

        {/* Form bình luận mới */}
        <div className="flex justify-end">
          <div className="bg-[#012B40] p-6 rounded-lg w-full max-w-2xl">
            <form className="space-y-4">
              {[{ label: "Họ và tên", type: "text", placeholder: "Nhập họ và tên của bạn" },
                { label: "Email", type: "email", placeholder: "Nhập email của bạn" },
              ].map((field, index) => (
                <div key={index} className="flex items-center justify-end">
                  <label className="w-32 text-sm text-white">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full max-w-[537.73px] px-3 py-2 text-white rounded border border-gray-600 bg-[#012B40] focus:outline-none"
                  />
                </div>
              ))}

              <div className="flex items-start justify-end">
                <label className="w-32 text-sm pt-2 text-white">Bình luận</label>
                <textarea
                  placeholder="Nhập bình luận của bạn"
                  className="w-full max-w-[537.73px] px-3 py-2 text-white rounded border border-gray-600 bg-[#012B40] h-32 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end">
                <label className="w-32 text-sm text-white">Captcha</label>
                <div className="flex items-center gap-2 w-full max-w-[537.73px]">
                  <img
                    src="/assets/images/posts/morbi-condimentum-molestie-nam-enim-odio-sodales-b7.html.svg"
                    alt="Captcha"
                    className="h-10"
                  />
                  <input
                    type="text"
                    placeholder="Nhập Captcha"
                    className="flex-1 px-3 py-2 text-white rounded border border-gray-600 bg-[#012B40] focus:outline-none"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex justify-start mt-4">
          <ButtonComponents variant="outline" size="medium">
            Gửi bình luận
          </ButtonComponents>
        </div>
      </div>
    </section>
  );
};

export default PostContent;
