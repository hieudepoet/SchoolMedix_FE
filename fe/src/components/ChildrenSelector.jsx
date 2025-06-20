// import { useState, useCallback, useEffect } from "react";
// import axiosClient from "../config/axiosClient";
// import { getUser } from "../service/authService";

// const ChildrenSelector = ({ onChildSelect, selectedChild }) => {
//   const [children, setChildren] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchChildren = async () => {
//       const user = getUser();
//       if (!user?.id) {
//         setError("Vui lòng đăng nhập để xem thông tin");
//         return;
//       }

//       setIsLoading(true);
//       try {
//         const res = await axiosClient.get(`/parent/${user?.user_metadata.id}/student`);
//         console.log("Children data: ", res.data.data);
//         const childrenData = res.data.data || [];
//         setChildren(childrenData);
        
//         // Nếu có selectedChild từ localStorage nhưng không có trong onChildSelect, 
//         // tự động chọn child đầu tiên hoặc child đã lưu
//         if (childrenData.length > 0 && !selectedChild) {
//           const savedChild = localStorage.getItem("selectedChild");
//           if (savedChild) {
//             try {
//               const parsedChild = JSON.parse(savedChild);
//               const foundChild = childrenData.find(child => child.id === parsedChild.id);
//               if (foundChild) {
//                 onChildSelect(foundChild);
//               } else {
//                 onChildSelect(childrenData[0]);
//               }
//             } catch (e) {
//               onChildSelect(childrenData[0]);
//             }
//           } else {
//             onChildSelect(childrenData[0]);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching children:", error);
//         setError("Không thể tải thông tin học sinh. Vui lòng thử lại sau.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchChildren();
//   }, [onChildSelect, selectedChild]);

//   const handleSelectChild = useCallback((child) => {
//     onChildSelect(child);
//     localStorage.setItem("selectedChild", JSON.stringify(child));
//   }, [onChildSelect]);

//   const getInitials = (name) => {
//     return name?.charAt(0)?.toUpperCase() || "?";
//   };

//   if (isLoading) {
//     return (
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           Danh sách con của bạn
//         </h2>
//         <div className="text-center py-4 bg-white rounded-lg shadow-sm">
//           <p className="text-gray-500">Đang tải thông tin...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           Danh sách con của bạn
//         </h2>
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   if (children.length === 0) {
//     return (
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           Danh sách con của bạn
//         </h2>
//         <div className="text-center py-4 bg-white rounded-lg shadow-sm">
//           <p className="text-gray-500">Không có thông tin trẻ em.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mb-6">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">
//         Danh sách con của bạn
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//         {children.map((child) => (
//           <div
//             key={child.id}
//             onClick={() => handleSelectChild(child)}
//             className={`
//               bg-white p-3 rounded-lg shadow-sm border-2 cursor-pointer
//               hover:shadow-md transition-all duration-200
//               ${
//                 selectedChild?.id === child.id
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-200 hover:border-gray-300"
//               }
//             `}
//             aria-label={`Chọn ${child.profile.name}`}
//           >
//             <div className="flex items-center gap-3">
//               <div
//                 className={`
//                   w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm
//                   ${selectedChild?.id === child.id ? "bg-blue-500" : "bg-gray-400"}
//                 `}
//               >
//                 {getInitials(child.profile.name)}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-medium text-gray-800 truncate">
//                   {child.profile.name}
//                 </h3>
//                 <p className="text-xs text-gray-600 truncate">
//                   {child.class || "Chưa có thông tin lớp"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChildrenSelector;