export const AppRoute = {
  RECORDS: "/records",
  PLAY_RECORDS: '/records/:recordId/play',
  CATEGORY: "/category",
  BILLBOARD: "/billboard",
  DASHBOARD: "/dashboard",
  INIT_STORE: "/init-store",
  ORDERS: "/orders",
  PERSONAL_INFO: "/settings/personal-info",
  STORE_SETTING: "/settings/store-setting",
  AUTH_LOGIN: "/auth/login",
};


export const HttpCommonMsg = {
  EXISTED: "Existed.",
  NOT_FOUND: "Not found.",
};

export const PipelineItemStatus = {
  Pending: "Đang chờ",
  Running: "Đang chạy",
  Success: "Thành công",
  Failed: "Thất bại",
  Cancelled: "Đã hủy",
};

export const PipelineItemStep = [
  "Khởi tạo",
  "Xử lý âm thanh",
  "Lập chỉ mục RAG",
  "Sinh tóm tắt",
];

export const RecordContentType = {
  Meeting: "Cuộc họp",
  "Lecture-Class": "Bài giảng / Lớp học",
  "Tutorial-Training": "Hướng dẫn / Đào tạo",
  Interview: "Phỏng vấn",
  Talkshow: "Talkshow",
  News: "Tin tức",
  Documentary: "Phim tài liệu",
  Entertainment: "Giải trí",
};
