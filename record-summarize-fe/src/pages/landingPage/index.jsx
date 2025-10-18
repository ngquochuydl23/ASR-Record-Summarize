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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import React, { useRef } from "react";
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
  ExpandMore,
} from "@mui/icons-material";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const homeRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_ENDPOINT}/auth/google/login-redirect`;
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Mic sx={{ fontSize: 48, color: "#9C27B0" }} />,
      title: "Nhận Dạng Giọng Nói",
      description:
        "Chuyển đổi âm thanh bài giảng video thành văn bản chính xác với AI tiên tiến",
    },
    {
      icon: <Description sx={{ fontSize: 48, color: "#9C27B0" }} />,
      title: "Tổng Hợp Nội Dung",
      description:
        "Tóm tắt các điểm chính từ bài giảng video một cách thông minh và ngắn gọn",
    },
    {
      icon: <Psychology sx={{ fontSize: 48, color: "#9C27B0" }} />,
      title: "Hỗ Trợ Học Tập",
      description:
        "Hỗ trợ tương tác với nội dung bài giảng qua mô hình ngôn ngữ lớn",
    },
  ];

  const benefits = [
    {
      icon: <AccessTime sx={{ fontSize: 32, color: "#9C27B0" }} />,
      title: "Tiết Kiệm Thời Gian Học Tập",
    },
    {
      icon: <Star sx={{ fontSize: 32, color: "#9C27B0" }} />,
      title: "Tăng Cường Hiểu Biết",
    },
    {
      icon: <Group sx={{ fontSize: 32, color: "#9C27B0" }} />,
      title: "Hợp Tác Nhóm Học",
    },
    {
      icon: <Security sx={{ fontSize: 32, color: "#9C27B0" }} />,
      title: "Bảo Mật Dữ Liệu Cá Nhân",
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

  const faqs = [
    {
      question: "EasySUM hỗ trợ những loại video bài giảng nào?",
      answer:
        "EasySUM hỗ trợ hầu hết các định dạng video phổ biến như MP4, AVI, MOV từ các nền tảng như Zoom, Google Meet, Coursera, edX và Khan Academy. Bạn chỉ cần tải lên video và ứng dụng sẽ tự động xử lý.",
    },
    {
      question: "Nhận dạng giọng nói có chính xác không?",
      answer:
        "Có, EasySUM sử dụng công nghệ AI tiên tiến để đạt độ chính xác lên đến 95% trong nhận dạng giọng nói tiếng Việt và tiếng Anh. Độ chính xác có thể thay đổi tùy thuộc vào chất lượng âm thanh.",
    },
    {
      question: "Tổng hợp nội dung mất bao lâu?",
      answer:
        "Thời gian tổng hợp phụ thuộc vào độ dài video, nhưng thường chỉ mất từ 1-5 phút cho một bài giảng 30 phút. Bạn có thể theo dõi tiến trình trong ứng dụng.",
    },
    {
      question: "Dữ liệu của tôi có an toàn không?",
      answer:
        "Chúng tôi cam kết bảo mật dữ liệu với mã hóa end-to-end và không lưu trữ video sau khi xử lý. Tất cả dữ liệu tuân thủ GDPR và các tiêu chuẩn bảo mật quốc tế.",
    },
    {
      question: "Làm thế nào để liên hệ hỗ trợ?",
      answer:
        "Bạn có thể liên hệ qua email tranngoc26082018@gmail.com hoặc chat trực tiếp trong ứng dụng. Đội ngũ hỗ trợ phản hồi trong vòng 24 giờ.",
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
        background: "linear-gradient(135deg, #F3E5F5 0%, #E8DAEF 100%)",
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
          background: "#F3E5F5",
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
              sx={{ fontWeight: 700, color: "#4A148C", flexGrow: 1 }}
            >
              EasySUM
            </Typography>
          </Box>
          <List sx={{ display: "flex", gap: { xs: 1, sm: 3 } }}>
            <ListItem 
              button 
              sx={{ 
                color: "#4A148C", 
                px: 2,
                whiteSpace: 'nowrap' 
              }} 
              onClick={() => scrollToSection(homeRef)}
            >
              <ListItemText primary="Trang chủ" />
            </ListItem>
            <ListItem 
              button 
              sx={{ 
                color: "#4A148C", 
                px: 2,
                whiteSpace: 'nowrap' 
              }} 
              onClick={() => scrollToSection(faqRef)}
            >
              <ListItemText primary="Câu hỏi thường gặp" />
            </ListItem>
            <ListItem 
              button 
              sx={{ 
                color: "#4A148C", 
                px: 2,
                whiteSpace: 'nowrap' 
              }} 
              onClick={() => scrollToSection(contactRef)}
            >
              <ListItemText primary="Về chúng tôi" />
            </ListItem>
          </List>
          <Button
            variant="contained"
            sx={{ 
              background: "#9C27B0",
              color: "white", 
              ml: 2,
              borderRadius: 50,
              "&:hover": {
                background: "#7B1FA2",
              }
            }}
            onClick={handleGoogleLogin}
            type="button"
          >
            Tiếp tục với Google
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container
        ref={homeRef}
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
                    color: "#4A148C",
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
                    color: "#4A148C",
                    mb: 2,
                  }}
                >
                  Hỗ Trợ Học Tập Của Bạn
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(74, 20, 140, 0.8)",
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
                      borderRadius: 50,
                      background: "#9C27B0",
                      color: "white",
                      "&:hover": {
                        background: "#7B1FA2",
                      }
                    }}
                    type="button"
                  >
                    Tiếp tục với Google
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
            sx={{ color: "#4A148C", mb: 2, fontWeight: 600 }}
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
                <img src="./zoom.webp" alt="Zoom" style={{ height: 40 }} />
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
                  sx={{ color: "#4A148C", mb: 2, fontWeight: 700 }}
                >
                  Chúng tôi hỗ trợ học tập trên toàn thế giới
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ color: "rgba(74, 20, 140, 0.8)", mb: 4 }}
                >
                  Tích hợp với các nền tảng giáo dục, công cụ ghi hình video và
                  hệ thống quản lý học tập
                </Typography>
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
              align="center"
              sx={{
                fontWeight: 700,
                color: "#4A148C",
                mb: 2,
              }}
            >
              Tính Năng Của Chúng Tôi
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                color: "rgba(74, 20, 140, 0.8)",
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
                borderRadius: 50,
                background: "#9C27B0",
                color: "white",
                "&:hover": {
                  background: "#7B1FA2",
                }
              }}
            >
              Tiếp tục với Google
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
                  sx={{ color: "#4A148C", mb: 2, fontWeight: 700 }}
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
                            color: "#4A148C",
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
                color: "#4A148C",
                mb: 2,
              }}
            >
              Mọi Người Đang Nói
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                color: "rgba(74, 20, 140, 0.8)",
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
                            sx={{ color: "#9C27B0", fontStyle: "italic" }}
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

      {/* FAQ Section */}
      <Container ref={faqRef} maxWidth="xl" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 } }}>
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
              color: "#4A148C",
              mb: 2,
              whiteSpace: "nowrap",
            }}
          >
            Câu Hỏi Thường Gặp
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: "rgba(74, 20, 140, 0.8)",
              mb: 6,
            }}
          >
            Tìm câu trả lời cho những thắc mắc phổ biến về EasySUM
          </Typography>
        </motion.div>

        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          {faqs.map((faq, index) => (
            <motion.div variants={fadeInUp} key={index}>
              <Box sx={{ position: "relative", mb: 4 }}>
                <Accordion
                  disableGutters
                  sx={{
                    background: "rgba(255,255,255,0.95)",
                    borderRadius: 3,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    overflow: "visible",
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: "#9C27B0" }} />}
                    sx={{
                      px: 3,
                      py: 2,
                      "& .MuiAccordionSummary-content": {
                        m: 0,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#333" }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      px: 3,
                      py: 3,
                      top: "100%",
                      left: 0,
                      width: "100%",
                      zIndex: 1,
                      background: "#fff",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: "#666", lineHeight: 1.5 }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Container>

      {/* Footer */}
      <Box
        ref={contactRef}
        sx={{
          background: "#311B92",
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
                    <ListItemText
                      primary="Nguyễn Quốc Huy _ 21112801"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText
                      primary="Trần Bảo Ngọc _ 21118081"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    />
                  </ListItem>
                </List>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;