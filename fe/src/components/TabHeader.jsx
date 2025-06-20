import { NavLink } from "react-router-dom";

const TabHeader = () => {
  const menu = [
    {
      label: "Hồ sơ sức khỏe",
      to: `/parent/edit/${JSON.parse(localStorage.getItem("selectedChild"))?.id}/health-profile`,
    },
    {
      label: "Thông tin tiêm chủng",
      to: `/parent/edit/${JSON.parse(localStorage.getItem("selectedChild"))?.id}/vaccine-info`,
    },
    {
      label: "Quản lý bệnh",
      to: `/parent/edit/${JSON.parse(localStorage.getItem("selectedChild"))?.id}/disease-record`,
    },
    {
      label: "Khám sức khỏe định kỳ",
      to: `/parent/edit/${JSON.parse(localStorage.getItem("selectedChild"))?.id}/regular-checkup`,
    },
    {
      label: "Gửi thuốc cho nhà trường",
      to: `/parent/edit/${JSON.parse(localStorage.getItem("selectedChild"))?.id}/drug-table`,
    },
    {
      label: "Sức khỏe hằng ngày",
      to: `/parent/edit/${JSON.parse(localStorage.getItem("selectedChild"))?.id}/health-record`,
    }
    
  ];
  return (
    <nav className="w-full bg-white text-[14px] pt-5 sticky top-14 z-40">
      <div className="max-w-7xl mx-auto flex gap-2 px-2 sm:px-4">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-4 py-3 rounded-t transition font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                  : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
export default TabHeader;

// import { NavLink } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axiosClient from "../config/axiosClient";
// import { getUser } from "../service/authService";

// const TabHeader = () => {
//   const [selectedChild, setSelectedChild] = useState(() => {
//     try {
//       const saved = localStorage.getItem("selectedChild");
//       if (!saved || saved === "undefined" || saved === "null") return null;
//       return JSON.parse(saved);
//     } catch (e) {
//       console.warn("⚠️ Invalid selectedChild in localStorage:", e);
//       return null;
//     }
//   });

//   const [children, setChildren] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchChildren = async () => {
//       const user = getUser();
//       if (!user?.user_metadata?.id) {
//         setError("Vui lòng đăng nhập để xem thông tin");
//         return;
//       }
//       setIsLoading(true);
//       try {
//         const res = await axiosClient.get(`/parent/${user.user_metadata.id}/student`);
//         const list = res.data.data || [];
//         setChildren(list);

//         // Nếu chưa chọn con hoặc con đã chọn không còn trong danh sách, set mặc định là đứa đầu
//         const savedChild = localStorage.getItem("selectedChild");
//         let parsedChild = null;
//         try {
//           if (savedChild && savedChild !== "undefined" && savedChild !== "null") {
//             parsedChild = JSON.parse(savedChild);
//           }
//         } catch {
//           parsedChild = null;
//         }
//         const exist = list.find(c => c.id === parsedChild?.id);
//         if (!exist && list.length > 0) {
//           setSelectedChild(list[0]);
//           localStorage.setItem("selectedChild", JSON.stringify(list[0]));
//         } else if (exist) {
//           setSelectedChild(parsedChild);
//         }
//       } catch (error) {
//         setChildren([]);
//         setError("Không thể tải thông tin học sinh. Vui lòng thử lại sau.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchChildren();
//   }, []);

//   const handleSelectChild = (e) => {
//     const child = children.find((c) => c.id === e.target.value);
//     setSelectedChild(child);
//     localStorage.setItem("selectedChild", JSON.stringify(child));
//     window.location.reload(); // Nếu muốn reload để cập nhật tab
//   };

//   const getInitials = (name) => {
//     return name?.charAt(0)?.toUpperCase() || "?";
//   };

//   const menu = [
//     {
//       label: "Hồ sơ sức khỏe",
//       to: `/parent/edit/${selectedChild?.id}/health-profile`,
//     },
//     {
//       label: "Thông tin tiêm chủng",
//       to: `/parent/edit/${selectedChild?.id}/vaccine-info`,
//     },
//     {
//       label: "Quản lý bệnh",
//       to: `/parent/edit/${selectedChild?.id}/disease-record`,
//     },
//     {
//       label: "Khám sức khỏe định kỳ",
//       to: `/parent/edit/${selectedChild?.id}/regular-checkup`,
//     },
//     {
//       label: "Gửi thuốc cho nhà trường",
//       to: `/parent/edit/${selectedChild?.id}/drug-table`,
//     },
//     {
//       label: "Sức khỏe hằng ngày",
//       to: `/parent/edit/${selectedChild?.id}/health-record`,
//     }
//   ];

//   return (
//     <nav className="w-full bg-white text-[14px] pt-5 sticky top-14 z-40">
//       <div className="max-w-7xl mx-auto flex gap-2 px-2 sm:px-4 items-center justify-between">
//         <div className="flex gap-2">
//           {menu.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               className={({ isActive }) =>
//                 `px-4 py-3 rounded-t transition font-medium ${
//                   isActive
//                     ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
//                     : "text-gray-700 hover:bg-blue-50"
//                 }`
//               }
//             >
//               {item.label}
//             </NavLink>
//           ))}
//         </div>
//         <div>
//           <select
//             className="border rounded px-3 py-2 bg-white"
//             value={selectedChild?.id || ""}
//             onChange={handleSelectChild}
//           >
//             <option value="" disabled>
//               Chọn con
//             </option>
//             {children.map((child) => (
//               <option key={child.id} value={child.id}>
//                 {child.profile?.name || "Không tên"}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default TabHeader;