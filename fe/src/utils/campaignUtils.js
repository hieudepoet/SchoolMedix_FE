export const getCardBorderColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "border-l-green-500";
    case "ONGOING":
      return "border-l-blue-500";
    case "PREPARING":
      return "border-l-amber-500";
    case "CANCELLED":
      return "border-l-red-500";
    case "UPCOMING":
      return "border-l-purple-500";
    default:
      return "border-l-gray-500";
  }
};

export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "text-green-700 bg-green-100 border-green-200";
    case "ONGOING":
      return "text-blue-700 bg-blue-100 border-blue-200";
    case "PREPARING":
      return "text-amber-700 bg-amber-100 border-amber-200";
    case "CANCELLED":
      return "text-red-700 bg-red-100 border-red-200";
    case "UPCOMING":
      return "text-purple-700 bg-purple-100 border-purple-200";
    default:
      return "text-gray-700 bg-gray-100 border-gray-200";
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case "COMPLETED":
      return "Đã hoàn thành";
    case "DONE":
      return "Đã hoàn thành";
    case "ONGOING":
      return "Đang diễn ra";
    case "PREPARING":
      return "Đang chuẩn bị";
    case "CANCELLED":
      return "Đã hủy";
    case "UPCOMING":
      return "Sắp diễn ra";
    default:
      return "Không xác định";
  }
};
