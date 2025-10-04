import { PipelineItemTypeEnum } from "@/constants/app.constants";

export const PipelineSteps = {
  [PipelineItemTypeEnum.CREATE_RECORD]: {
    index: 0,
    stepName: "Xử lý audio",
    stepDescription:
      "Hệ thống đang chuẩn bị và phân tích file để bắt đầu quá trình.",
  },
  [PipelineItemTypeEnum.TRANSCRIBE]: {
    index: 1,
    stepName: "Nhận dạng giọng nói",
    stepDescription: "Chuyển phần âm thanh thành văn bản để bạn dễ theo dõi.",
  },
  [PipelineItemTypeEnum.GENERATE_SUM]: {
    index: 2,
    stepName: "Sinh tóm tắt",
    stepDescription:
      "Tạo bản tóm lược ngắn gọn giúp bạn nắm nhanh nội dung chính.",
  },
  [PipelineItemTypeEnum.CHATBOT_PREPARATION]: {
    index: 3,
    stepName: "Chuẩn bị chatbot",
    stepDescription:
      "Sắp xếp và chia nhỏ nội dung để chatbot có thể trả lời câu hỏi của bạn.",
  },
};

export const StatusMapStrings = {
  Done: "Hoàn thành",
  Running: "Đang chạy",
  Success: "Thành công",
  Pending: "Đang chờ",
  Failed: "Thất bại",
  Cancelled: "Đã hủy",
};
