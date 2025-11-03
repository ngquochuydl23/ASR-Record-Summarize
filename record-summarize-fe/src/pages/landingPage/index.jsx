import React from "react";
import './styles.scss';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_ENDPOINT}/auth/google/login-redirect`;
  };

  return (
    <div className="hero-section">
      <div className="container">
        <img
          src="./chatbot2.png"
          loading="lazy"
          width="90"
          alt=""
          className="image-3"
        />
        <div className="hero-content">
          <div className="flex-center-text">
            <a
              data-w-id="9ddaef7e-92c6-48d1-6e3b-de93cb95297f"
              className="hero-link w-inline-block"
            >
              <div className="hero-link-gradient">
                <div>New</div>
              </div>
              <div className="label">Nhận dạng giọng nói</div>
              <div className="hero-link-arrow" />
            </a>

            <a data-w-id="67f7d081-e774-b538-0f4e-7ccf8180a82d" className="hero-link w-inline-block">
              <div className="hero-link-gradient"><div>New</div></div>
              <div className="label">Chatbot AI & Mô hình ngôn ngữ lớn</div>
              <div className="hero-link-arrow" />
            </a>
            <h1 data-w-id="775cac5c-1aa2-262a-db52-01cc6bff5d4b" className="hero-text">
              <strong>Nhận dạng giọng nói và </strong>
              <span className="text-span-2">Tổng hợp bài giảng thông minh</span>
            </h1>
            <div data-w-id="94ad1a15-a764-a1ee-f194-0bd3f8dcd9ce" className="subscribe-form-holder">
              <div
                onClick={handleGoogleLogin}
                className="google-login-button"
                tabIndex={0}
                role="button"
                aria-label="Tiếp tục với Google">
                <svg className="google-icon" width="20" height="20" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.85-6.85C36.3 2.7 30.65 0 24 0 14.6 0 6.4 5.4 2.45 13.2l7.98 6.2C12.2 13.55 17.6 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.1 24.55c0-1.57-.14-3.09-.39-4.55H24v9.02h12.4c-.54 2.93-2.12 5.41-4.52 7.1l7.05 5.48C43.9 37.07 46.1 31.27 46.1 24.55z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M9.43 28.02A14.46 14.46 0 0 1 8 24c0-1.39.24-2.73.66-4l-7.98-6.2A23.8 23.8 0 0 0 0 24c0 3.83.9 7.46 2.45 10.67l7.98-6.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 48c6.48 0 11.9-2.13 15.86-5.8l-7.05-5.48c-2.05 1.4-4.67 2.23-7.55 2.23-6.4 0-11.8-4.05-13.57-9.7l-7.98 6.65C6.4 42.6 14.6 48 24 48z"
                  />
                </svg>

                <span className="google-text">Tiếp tục với Google</span>
              </div>
            </div>

            <div
              data-w-id="b043cab7-b293-8915-b3e5-69e971017d2c"
              className="hero-description"
            >
              Ứng dụng kết hợp nhận dạng giọng nói và mô hình ngôn ngữ lớn giúp chuyển đổi nội dung bài giảng video thành văn bản, tự động tóm tắt và tổng hợp kiến thức, mang đến trải nghiệm học tập nhanh chóng và tiện lợi cho giảng viên và sinh viên.
            </div>
          </div>
        </div>

        <div
          data-w-id="fb4bc833-1ed5-26d2-d6d8-631c2c09a613"
          className="trusted-by-container"
        >
          <div className="trusted-grid-holder" />
          <div className="trusted-by-text">GVHD: Võ Quang Hoàng Khang</div>
          <div className="trusted-by-text">Nguyễn Quốc Huy_21112801</div>
          <div className="trusted-by-text">Trần Bảo Ngọc_21118081</div>
        </div>
      </div>

      <div className="gradient-center-holder">
        <div className="gradient-center" />
      </div>
    </div>
  );
};

export default Login;