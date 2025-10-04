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
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CardActions,
  TextField,
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
  ArrowForward,
  PlayCircle,
  Summarize,
} from "@mui/icons-material";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_ENDPOINT}/auth/google/login-redirect`;
  };

  const features = [
    {
      icon: <Mic sx={{ fontSize: 48, color: "#7C3AED" }} />,
      title: "Nhận Dạng Giọng Nói",
      description:
        "Chuyển đổi âm thanh bài giảng video thành văn bản chính xác với AI tiên tiến",
    },
    {
      icon: <Description sx={{ fontSize: 48, color: "#7C3AED" }} />,
      title: "Tổng Hợp Nội Dung",
      description:
        "Tóm tắt các điểm chính từ bài giảng video một cách thông minh và ngắn gọn",
    },
    {
      icon: <Psychology sx={{ fontSize: 48, color: "#7C3AED" }} />,
      title: "Hỗ Trợ Học Tập",
      description:
        "Hỗ trợ tương tác với nội dung bài giảng qua mô hình ngôn ngữ lớn",
    },
  ];

  const benefits = [
    {
      icon: <AccessTime sx={{ fontSize: 32, color: "#FFFFFF" }} />,
      title: "Tiết Kiệm Thời Gian Học Tập",
    },
    {
      icon: <Star sx={{ fontSize: 32, color: "#FFFFFF" }} />,
      title: "Tăng Cường Hiểu Biết",
    },
    {
      icon: <Group sx={{ fontSize: 32, color: "#FFFFFF" }} />,
      title: "Hợp Tác Nhóm Học",
    },
    {
      icon: <Security sx={{ fontSize: 32, color: "#FFFFFF" }} />,
      title: "Bảo Mật Dữ Liệu Cá Nhân",
    },
  ];

  const pricingPlans = [
    {
      title: "Miễn Phí",
      price: "0$",
      period: "Mỗi tháng",
      features: ["1 Giờ Xử Lý Video", "Tóm Tắt Cơ Bản", "Hỗ Trợ Văn Bản"],
      buttonText: "Đăng ký miễn phí",
      variant: "outlined",
    },
    {
      title: "Pro",
      price: "8$",
      period: "Mỗi năm",
      features: [
        "10 Giờ Xử Lý Video",
        "Tóm Tắt AI Nâng Cao",
        "Hỗ Trợ Ngôn Ngữ Lớn",
      ],
      buttonText: "Nâng cấp Pro",
      variant: "contained",
    },
    {
      title: "Business",
      price: "16$",
      period: "Mỗi năm",
      features: [
        "Không Giới Hạn Xử Lý",
        "Tích Hợp Đội Nhóm",
        "Phân Tích Chi Tiết",
      ],
      buttonText: "Đi Business",
      variant: "contained",
    },
  ];

  const testimonials = [
    {
      name: "_ Nguyễn Văn A",
      comment:
        "Ứng dụng này giúp tôi tổng hợp bài giảng nhanh chóng, tiết kiệm hàng giờ học tập.",
    },
    {
      name: "_ Trần Thị B",
      comment:
        "Nhận dạng giọng nói chính xác cao, rất hữu ích cho sinh viên như tôi.",
    },
    {
      name: "_ Lê Văn C",
      comment:
        "Mô hình ngôn ngữ lớn hỗ trợ trả lời câu hỏi từ bài giảng tuyệt vời.",
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
        background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
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
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="./chatbot2.png"
              alt="EasySUM Icon"
              style={{ width: 32, height: 32, marginRight: 8 }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "white", flexGrow: 1 }}
            >
              EasySUM
            </Typography>
          </Box>
          <List sx={{ display: "flex" }}>
            <ListItem button sx={{ color: "white" }}>
              <ListItemText primary="Trang chủ" />
            </ListItem>
            <ListItem button sx={{ color: "white" }}>
              <ListItemText primary="Câu hỏi thường gặp" />
            </ListItem>
            <ListItem button sx={{ color: "white" }}>
              <ListItemText primary="Về chúng tôi" />
            </ListItem>
          </List>
          <Button
            variant="outlined"
            sx={{ color: "white", borderColor: "white", ml: 2 }}
            onClick={handleGoogleLogin}
            type="button"
          >
            Đăng nhập
          </Button>
        </Toolbar>
      </AppBar>

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
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    mb: 2,
                  }}
                >
                  Chúng tôi ở đây để
                </Typography>
                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    mb: 2,
                  }}
                >
                  Hỗ Trợ Học Tập Của Bạn
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Sử dụng nhận dạng giọng nói và mô hình ngôn ngữ lớn để tổng
                  hợp nội dung bài giảng video một cách dễ dàng
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                    }}
                    type="button"
                  >
                    Thử miễn phí
                  </Button>
                  <Button
                    onClick={handleGoogleLogin}
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: "white",
                      color: "white",
                    }}
                  >
                    Xem Demo
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src="./chatbot.png"
                    alt="AI Lecture Summarization Illustration"
                    style={{
                      width: "100%",
                      maxWidth: 600,
                      height: "auto",
                      borderRadius: 16,
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div variants={fadeInUp}>
          <Typography
            variant="h5"
            align="center"
            sx={{ color: "white", mb: 2, fontWeight: 600 }}
          >
            Hơn 10.000 sinh viên và giảng viên sử dụng EasySUM
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Box sx={{ textAlign: "center", px: 2 }}>
                <img
                  src="./Coursera.png"
                  alt="Coursera"
                  style={{ height: 40 }}
                />
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ textAlign: "center", px: 2 }}>
                <img src="./edx.png" alt="edX" style={{ height: 40 }} />
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ textAlign: "center", px: 2 }}>
                <img
                  src="./KhanAcademy.png"
                  alt="Khan Academy"
                  style={{ height: 40 }}
                />
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ textAlign: "center", px: 2 }}>
                <img src="./zoom.png" alt="Zoom" style={{ height: 40 }} />
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ textAlign: "center", px: 2 }}>
                <img
                  src="./google-meet.png"
                  alt="Google Meet"
                  style={{ height: 40 }}
                />
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Partners Section */}
      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div variants={staggerContainer}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{ color: "white", mb: 2, fontWeight: 700 }}
                >
                  Chúng tôi hỗ trợ học tập trên toàn thế giới
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ color: "rgba(255,255,255,0.8)", mb: 4 }}
                >
                  Tích hợp với các nền tảng giáo dục, công cụ ghi hình video và
                  hệ thống quản lý học tập
                </Typography>
              </motion.div>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        p: 2,
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ color: "white", mb: 1 }}>
                        4.8
                      </Typography>
                      <Typography variant="body2" sx={{ color: "white" }}>
                        ★★★★★
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        p: 2,
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ color: "white", mb: 1 }}>
                        4.9
                      </Typography>
                      <Typography variant="body2" sx={{ color: "white" }}>
                        ★★★★★
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid> */}
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
              align="center"
              sx={{
                fontWeight: 700,
                color: "white",
                mb: 2,
              }}
            >
              Tính Năng Của Chúng Tôi
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mb: 6,
              }}
            >
              Sử dụng AI để nhận dạng giọng nói và tổng hợp nội dung bài giảng
              video một cách hiệu quả
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card
                    sx={{
                      height: "100%",
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#333", mb: 1.5 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              onClick={handleGoogleLogin}
              variant="contained"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                background: "white",
                color: "#333",
              }}
            >
              Bắt đầu
            </Button>
          </Box>
        </motion.div>
      </Container>

      {/* Benefits Section */}
      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div variants={staggerContainer}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h4"
                  sx={{ color: "white", mb: 2, fontWeight: 700 }}
                >
                  Lợi Ích Bạn Sẽ Nhận Được
                </Typography>
                <img
                  src="./chatbot1.jpg"
                  alt="Lecture Benefits Illustration"
                  style={{ width: "100%", borderRadius: 16 }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <List sx={{ pl: 0 }}>
                  {benefits.map((benefit, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        {benefit.icon}
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#FFFFFF",
                            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                            fontWeight: 500,
                          }}
                        >
                          {benefit.title}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Pricing Section */}
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
              align="center"
              sx={{
                fontWeight: 700,
                color: "white",
                mb: 2,
              }}
            >
              Chọn Gói Phù Hợp Với Bạn
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mb: 6,
              }}
            >
              Chọn gói phù hợp nhất cho nhu cầu học tập và tổng hợp bài giảng
              của bạn
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card
                    sx={{
                      height: "100%",
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      textAlign: "center",
                      p: 3,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#333", mb: 1 }}
                      >
                        {plan.title}
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 700, color: "#7C3AED", mb: 0.5 }}
                      >
                        {plan.price}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                        {plan.period}
                      </Typography>
                      <List sx={{ pl: 0, mb: 3 }}>
                        {plan.features.map((feature, fIndex) => (
                          <ListItem
                            key={fIndex}
                            sx={{ justifyContent: "center", py: 0.5 }}
                          >
                            <ListItemText
                              primary={feature}
                              sx={{ textAlign: "center" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button
                        variant={plan.variant}
                        onClick={handleGoogleLogin}
                        sx={{
                          width: "100%",
                          borderRadius: 2,
                          ...(plan.variant === "contained" && {
                            background: "#7C3AED",
                            color: "white",
                          }),
                        }}
                        type="button"
                      >
                        {plan.buttonText}
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Testimonials Section */}
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
              align="center"
              sx={{
                fontWeight: 700,
                color: "white",
                mb: 2,
              }}
            >
              Mọi Người Đang Nói
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mb: 6,
              }}
            >
              Về EasySUM và hỗ trợ tổng hợp bài giảng
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card
                    sx={{
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      p: 3,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="body1"
                        sx={{ color: "#333", mb: 2, fontWeight: "bold" }}
                      >
                        "{testimonial.comment}"
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ color: "#7C3AED", fontStyle: "italic" }}
                          >
                            {testimonial.name}
                          </Typography>
                        </Box>
                      </Box>
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
        <motion.div variants={fadeInUp}>
          <Box
            sx={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              p: 6,
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "white",
                mb: 2,
              }}
            >
              Bắt Đầu Tổng Hợp Bài Giảng
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 4,
              }}
            >
              Nhập email để nhận hướng dẫn sử dụng
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                justifyContent: "center",
              }}
            >
              <TextField
                placeholder="Email của bạn"
                variant="outlined"
                sx={{
                  width: { xs: "100%", md: 300 },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: 3,
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255,255,255,0.7)",
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                }}
                InputProps={{
                  style: { color: "white" },
                }}
              />
              <Button
                onClick={handleGoogleLogin}
                variant="contained"
                sx={{
                  width: { xs: "100%", md: 300 },
                  px: 4,
                  py: 1.5,
                  background: "white",
                  color: "#333",
                  borderRadius: 3,
                  padding: "26px !important",
                }}
              >
                Bắt Đầu Thử Nghiệm Miễn Phí
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          background: "rgba(0,0,0,0.8)",
          py: 6,
          mt: 4,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <motion.div variants={fadeInUp}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <img
                    src="./chatbot2.png"
                    alt="EasySUM Icon"
                    style={{ width: 32, height: 32, marginRight: 8 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    EasySUM
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.8)" }}
                >
                  © 2025 EasySUM. Tất cả quyền được bảo lưu.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={3}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h6"
                  sx={{ color: "white", mb: 2, fontWeight: 600 }}
                >
                  Sản phẩm
                </Typography>
                <List sx={{ pl: 0 }}>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText
                      primary="Nhận Dạng Giọng Nói"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText
                      primary="Tổng Hợp Bài Giảng"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText
                      primary="Hỗ Trợ AI"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    />
                  </ListItem>
                </List>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={3}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h6"
                  sx={{ color: "white", mb: 2, fontWeight: 600 }}
                >
                  Hỗ trợ
                </Typography>
                <List sx={{ pl: 0 }}>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText
                      primary="Trung tâm trợ giúp"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText
                      primary="Liên hệ hỗ trợ"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText
                      primary="Hướng dẫn sử dụng"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    />
                  </ListItem>
                </List>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={3}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h6"
                  sx={{ color: "white", mb: 2, fontWeight: 600 }}
                >
                  Liên hệ
                </Typography>
                <List sx={{ pl: 0 }}>
                  <ListItem sx={{ py: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Email
                        sx={{ color: "rgba(255,255,255,0.8)", fontSize: 20 }}
                      />
                      <ListItemText
                        primary="Liên hệ với chúng tôi"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      />
                    </Box>
                  </ListItem>
                </List>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.8)", mt: 2 }}
                >
                  Điều khoản và Điều kiện | Chính sách bảo mật
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
