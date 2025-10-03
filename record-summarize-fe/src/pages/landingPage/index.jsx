import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Description,
  Psychology,
  Security,
  AccessTime,
  Group,
  Star,
  Email,
  Phone,
} from "@mui/icons-material";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_ENDPOINT}/auth/google/login-redirect`;
  };

  const features = [
    {
      icon: <Mic sx={{ fontSize: 32 }} />,
      title: "Nhận dạng giọng nói",
      description:
        "Nhận dạng lại âm thanh chất lượng cao với công nghệ khử tiếng ồn tiên tiến và thu âm rõ nét.",
    },
    {
      icon: <Psychology sx={{ fontSize: 32 }} />,
      title: "Chuyển Đổi Thành Văn Bản Bằng AI",
      description:
        "Chuyển đổi bản ghi âm thành văn bản chính xác với công nghệ nhận diện giọng nói hiện đại.",
    },
    {
      icon: <Description sx={{ fontSize: 32 }} />,
      title: "Tóm Tắt Thông Minh",
      description:
        "Nhận tóm tắt thông minh từ bản ghi âm với các điểm chính và thông tin hữu ích.",
    },
    {
      icon: <AccessTime sx={{ fontSize: 32 }} />,
      title: "Tiết Kiệm Thời Gian",
      description:
        "Tiết kiệm hàng giờ làm việc thủ công với tính năng chuyển đổi và tóm tắt tự động.",
    },
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: "An Toàn & Riêng Tư",
      description:
        "Bản ghi và dữ liệu của bạn được mã hóa và bảo vệ với tiêu chuẩn bảo mật cấp doanh nghiệp.",
    },
    {
      icon: <Group sx={{ fontSize: 32 }} />,
      title: "Hợp Tác Nhóm",
      description:
        "Chia sẻ bản ghi và tóm tắt với nhóm của bạn để tăng cường hợp tác và năng suất.",
    },
  ];

  const userComments = [
    {
      name: "Nguyễn Văn A",
      role: "Giám đốc Marketing",
      comment:
        "Ứng dụng này đã thay đổi hoàn toàn cách chúng tôi ghi chép cuộc họp. Độ chính xác cao và tiết kiệm thời gian đáng kể.",
      rating: 5,
    },
    {
      name: "Trần Thị B",
      role: "Sinh viên",
      comment:
        "Tính năng tóm tắt AI thực sự hữu ích cho việc học tập. Tôi có thể nắm bắt nội dung bài giảng một cách nhanh chóng.",
      rating: 5,
    },
    {
      name: "Lê Văn C",
      role: "Nhà báo",
      comment:
        "Tính năng nhận dạng giọng nói rất tốt, ngay cả trong môi trường ồn ào. Tính năng chuyển đổi văn bản rất chính xác.",
      rating: 4,
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #6441a5 0%, #5a3a93 100%)",
        margin: 0,
        padding: 0,
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        overflowX: "hidden",
      }}
    >
      {/* Hero Section */}
      <Container
        maxWidth="xl"
        sx={{ pt: 8, pb: 4, px: { xs: 2, sm: 3, md: 4 } }}
      >
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  component="h1"
                  align="center"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    mb: 2,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Nhận dạng Giọng Nói
                </Typography>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  align="center"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    mb: 4,
                    maxWidth: "600px",
                    mx: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  Nhận dạng giọng nói, chuyển đổi thành văn bản và tóm tắt các
                  cuộc họp, bài giảng và cuộc trò chuyện với độ chính xác cao
                  nhờ AI
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Button
                    onClick={handleGoogleLogin}
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 3,
                      background: "white",
                      color: "#333",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      "&:hover": {
                        background: "#f5f5f5",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Đăng nhập
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src="https://emandai.net/wp-content/uploads/2024/05/AI-Voicebot-EMandAI.png"
                    alt="AI Chatbot Illustration"
                    style={{
                      width: "100%",
                      maxWidth: 400,
                      height: "auto",
                      borderRadius: 16,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              sx={{
                fontWeight: 700,
                color: "white",
                mb: 2,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Tính Năng Nổi Bật
            </Typography>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Typography
              variant="h6"
              align="center"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mb: 6,
                maxWidth: "500px",
                mx: "auto",
              }}
            >
              Mọi thứ bạn cần để ghi lại, xử lý và hiểu nội dung âm thanh của
              bạn
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card
                    sx={{
                      height: "100%",
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <Box
                        sx={{
                          color: "#6441a5",
                          mb: 2,
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          color: "#333",
                          mb: 1.5,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <motion.div variants={fadeInUp}>
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src="https://vnptai.io/storage/thumbnail/09012025-170118-57d76ab3-255b-4d44-81d6-ee05b9781adb.jpg"
                    alt="Chatbot AI"
                    style={{
                      width: "100%",
                      maxWidth: 300,
                      height: "auto",
                      borderRadius: 16,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={8}>
              <motion.div variants={fadeInUp}>
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 4,
                    p: 6,
                    textAlign: isMobile ? "center" : "left",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      mb: 2,
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    Sẵn Sàng Bắt Đầu?
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "rgba(255,255,255,0.9)",
                      mb: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    Tham gia cùng hàng ngàn người dùng đã thay đổi quy trình làm việc
                    của họ với nền tảng AI của chúng tôi
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: isMobile ? "center" : "flex-start" }}>
                    <Button
                      onClick={handleGoogleLogin}
                      variant="contained"
                      size="large"
                      sx={{
                        px: 6,
                        py: 2,
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        borderRadius: 3,
                        background: "white",
                        color: "#333",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        "&:hover": {
                          background: "#f5f5f5",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* User Comments Section */}
      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              sx={{
                fontWeight: 700,
                color: "white",
                mb: 2,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Đánh Giá Từ Người Dùng
            </Typography>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Typography
              variant="h6"
              align="center"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mb: 6,
                maxWidth: "500px",
                mx: "auto",
              }}
            >
              Những gì khách hàng nói về chúng tôi
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {userComments.map((comment, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card
                    sx={{
                      height: "100%",
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", mb: 2 }}>
                        {[...Array(comment.rating)].map((_, i) => (
                          <Star
                            key={i}
                            sx={{ color: "#ffd700", fontSize: 20 }}
                          />
                        ))}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#333",
                          mb: 2,
                          fontStyle: "italic",
                          lineHeight: 1.6,
                        }}
                      >
                        "{comment.comment}"
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#6441a5",
                          mb: 0.5,
                        }}
                      >
                        {comment.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                        }}
                      >
                        {comment.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Footer Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
          py: 6,
          mt: 4,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    mb: 2,
                  }}
                >
                  Nhận dạng Giọng Nói
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.6,
                  }}
                >
                  Ứng dụng thông minh cho việc Nhận dạng Giọng nói và Tóm tắt
                  Bài giảng.
                </Typography>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} md={4}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    color: "white",
                    mb: 2,
                  }}
                >
                  Liên Kết Nhanh
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      cursor: "pointer",
                      "&:hover": { color: "white" },
                    }}
                  >
                    Về Chúng Tôi
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      cursor: "pointer",
                      "&:hover": { color: "white" },
                    }}
                  >
                    Điều Khoản Dịch Vụ
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      cursor: "pointer",
                      "&:hover": { color: "white" },
                    }}
                  >
                    Chính Sách Bảo Mật
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={4}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    color: "white",
                    mb: 2,
                  }}
                >
                  Liên Hệ
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email
                      sx={{ color: "rgba(255,255,255,0.8)", fontSize: 20 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      support@abc.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone
                      sx={{ color: "rgba(255,255,255,0.8)", fontSize: 20 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      Hotline: 0123 456 789
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.2)" }} />

          <motion.div variants={fadeInUp}>
            <Typography
              variant="body2"
              align="center"
              sx={{
                color: "rgba(255,255,255,0.6)",
              }}
            >
              © 2025 Nhận dạng giọng nói và Tóm tắt bài giảng. Mọi quyền được
              bảo lưu.
            </Typography>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};
export default Login;