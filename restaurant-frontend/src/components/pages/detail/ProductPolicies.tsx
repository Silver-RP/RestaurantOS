import React from "react";
import { FaShieldAlt, FaTruck, FaUndo } from "react-icons/fa";

const policies = [
    {
      icon: <FaShieldAlt className="text-white mt-1" />,
      title: "Chính sách bảo mật",
      description: "Thông tin khách hàng được bảo mật tuyệt đối theo chính sách bảo mật của chúng tôi.",
    },
    {
      icon: <FaTruck className="text-white mt-1" />,
      title: "Chính sách giao hàng",
      description: "Giao hàng trong vòng 30 phút làm việc.",
    },
    {
      icon: <FaUndo className="text-white mt-1" />,
      title: "Chính sách hoàn trả",
      description: "Hỗ trợ đổi/trả sản phẩm trong vòng ngay nếu có lỗi từ nhà hàng.",
    },
 ]; 
  

const ProductPolicies: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {policies.map((policy, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-4 border border-hr w-full"
        >
          {policy.icon}
          <div>
            <h4 className="text-white mb-1">{policy.title}</h4>
            <p className="text-sm text-gray-400">{policy.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductPolicies;
