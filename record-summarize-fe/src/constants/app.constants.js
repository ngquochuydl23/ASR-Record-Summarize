export const AppRoute = {
  RECORDS: "/records",
  PLAY_RECORDS: "/records/:recordId/play",
  COLLECTIONS: "/collections",
  HISTORY: "/history",
  DASHBOARD: "/dashboard",
  INIT_STORE: "/init-store",
  ORDERS: "/orders",
  PERSONAL_INFO: "/settings/personal-info",
  STORE_SETTING: "/settings/store-setting",
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

export const RecordContentTypes = [
  {
    id: "Meeting",
    label: "Cuộc họp",
  },
  {
    id: "Lecture-Class",
    label: "Bài giảng / Lớp học",
  },
  {
    id: "Tutorial-Training",
    label: "Hướng dẫn / Đào tạo",
  },
  {
    id: "Interview",
    label: "Phỏng vấn",
  },
  {
    id: "Talkshow",
    label: "Talkshow",
  },
  {
    id: "News",
    label: "Tin tức",
  },
  {
    id: "Documentary",
    label: "Phim tài liệu",
  },
  {
    id: "Entertainment",
    label: "Giải trí",
  },
];

export const VideoLanguages = [
  {
    id: "en",
    label: "Tiếng Anh",
  },
  {
    id: "vie",
    label: "Tiếng Việt",
  },
];

export const SourceTypes = [
  {
    id: "local",
    label: "Từ máy cá nhân",
  },
  {
    id: "youtube",
    label: "Từ Youtube",
  },
];

export const PipelineItemTypeEnum = {
  CREATE_RECORD: 0,
  TRANSCRIBE: 1,
  GENERATE_SUM: 2,
  CHATBOT_PREPARATION: 4,
};

export const SourceTypeEnum = {
  LOCAL: "local",
  YOUTUBE: "youtube",
};

export const ChatbotPreparingStateEnum = {
  PREPARING: "preparing",
  DONE: "done",
  FAILED: "failed",
};

export const PipelineItemStatusEnum = {
  Success: "Success",
  Failed: "Failed",
  Pending: "Pending",
  Running: "Running",
  Cancelled: "Cancelled"
};

export const PipelineStepTitle = [
  "Đang tạo record",
  "Đang xử lý video và sinh phụ đề",
  "Đang tóm tắt video",
  "Chatbot đang chuẩn bị",
];


export const NotFoundKnowledge = "Thông tin này không có trong bản ghi. Bạn có muốn tôi tìm trong tri thức bên ngoài không?\n"