// import React, { useState } from "react";
// import Tabs from "./Tabs";
// const BestOffers: React.FC = () => {
//     const tabs = ["Morning", "Weekday Lunch", "Dinner", "Wines"];
//     const menuData = [
//       // Dữ liệu tương ứng từng tab
//       [
//         {
//           imageUrl: "/assets/images/menu/spaghetti.jpg",
//           name: "Spaghetti Pasta",
//           price: 19.12,
//           description: "Regular fit, round neckline, short sleeves.",
//         },
//         {
//           imageUrl: "/assets/images/menu/steak.jpg",
//           name: "Beef Meat Steak",
//           price: 28.72,
//           description: "100% cotton, brushed inner side for extra comfort.",
//         },
//       ],
//       // Tương tự cho các tab khác
//     ];
  
//     const [activeTab, setActiveTab] = useState(0);
  
//     return (
//       <section className="bg-bodyBackground text-white py-16 px-6 lg:px-20">
//         <div className="w-mainContainer mx-auto">
//           <h2 className="text-3xl text-center sm:text-4xl md:text-5xl font-restora font-extralight mb-4">Best Offers</h2>
//           <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
//           <hr className="border-t border-gray-700 mt-8" />
//           {/* <MenuList items={menuData[activeTab]} />
//           <div className="text-center mt-8">
//             <button className="px-6 py-3 border border-secondaryColor text-secondaryColor hover:bg-secondaryColor hover:text-bodyBackground transition">
//               View Our Menu
//             </button>
//           </div> */}
//         </div>
//       </section>
//     );
//   };

// export default BestOffers;