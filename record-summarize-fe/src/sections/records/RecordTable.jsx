import {
  Avatar,
  Button,
  CircularProgress,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  MenuItem,
  Popover,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { useCallback, useMemo, useState } from "react";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { colors } from "@/theme/theme.global";
import {
  PipelineItemTypeEnum,
  PipelineStepTitle,
  RecordContentType,
  SourceTypeEnum,
  RecordContentTypes,
  SourceTypes,
} from "@/constants/app.constants";
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "./record-table.module.scss";
import { readUrl } from "@/utils/readUrl";
import moment from "moment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import {
  deteleRecord,
  publishLastVRecord,
} from "@/repositories/record.repository";
import _, { debounce } from "lodash";
import { useSnackbar } from "notistack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";

const ActionTableCell = ({ item, onRefresh, publishable }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [publishing, setPublishing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlePublishLastRecord = (e) => {
    e.preventDefault();
    setPublishing(true);
    publishLastVRecord(item.id)
      .then(() => {
        onRefresh();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setPublishing(false));
  };
  const handleEditRecord = (e) => {
    handleClose();
    e.preventDefault();
  };
  const handleDeleteRecord = (e) => {
    handleClose();
    e.preventDefault();
    deteleRecord(item.id)
      .then(() => {
        enqueueSnackbar("Xóa tóm tắt thành công", {
          variant: "success",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        onRefresh();
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Xóa tóm tắt thất bại", {
          variant: "error",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      });
  };
  return (
    <TableCell align="right" width="10%">
      <div className="flex">
        {item?.published ? (
          <IconButton
            onClick={(e) => {
              navigate("/records/" + item.id + "/play");
              e.preventDefault();
            }}
          >
            <Tooltip title="Xem">
              <PlayArrowRoundedIcon sx={{ width: "30px", height: "30px" }} />
            </Tooltip>
          </IconButton>
        ) : (
          <div>
            {!publishing ? (
              <Tooltip
                title={
                  publishable
                    ? "Xuất bản"
                    : "Bạn không thể xuất bản vì chưa hoàn thành"
                }
              >
                <IconButton
                  onClick={handlePublishLastRecord}
                  disabled={!publishable}
                >
                  <PublishOutlinedIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <div className={styles.loadingContainer}>
                <CircularProgress size="20px" />
              </div>
            )}
          </div>
        )}
        <IconButton onClick={handleClick}>
          <Tooltip title="Thêm">
            <MoreVertIcon sx={{ width: "30px" }} />
          </Tooltip>
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <div className="inside-popover">
            <ul className="menu-list">
              <li className="menu-list-item" onClick={handleEditRecord}>
                <DriveFileRenameOutlineIcon className="mr-3" />
                {"Sửa"}
              </li>
              <Divider className="my-[2px]" />
              <li className="menu-list-item red" onClick={handleDeleteRecord}>
                <DeleteOutlineIcon className="mr-3" />
                {"Xóa"}
              </li>
            </ul>
          </div>
        </Popover>
      </div>
    </TableCell>
  );
};

export const RecordTable = ({
  filter,
  totalCount = 0,
  records = [],
  onPageChange = () => {},
  onRowsPerPageChange,
  page = 0,
  limit = 10,
  isLoading,
  onRefresh,
  onChangeFilter = (filter) => {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [draftFilter, setDraftFilter] = useState({});

  const handleSort = useCallback(
    (property) => {
      if (filter.sort_by === property) {
        const newDir = filter.sort_dir === "asc" ? "desc" : "asc";
        onChangeFilter({
          ...filter,
          sort_by: property,
          sort_dir: newDir,
          page: 1,
        });
      } else {
        onChangeFilter({
          ...filter,
          sort_by: property,
          sort_dir: "desc",
          page: 1,
        });
      }
    },
    [filter, onChangeFilter]
  );

  const handleChangePage = (event, newPage) => {
    onPageChange(event, newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange(event.target.value);
  };

  const handleSearchChange = useCallback(
    debounce((value) => {
      onChangeFilter({ ...filter, s: value, page: 1 });
    }, 300),
    [filter]
  );

  const handleUnpublishedToggle = () => {
    onChangeFilter({ ...filter, unpublished: !filter?.unpublished, page: 1 });
  };

  const handleToggleFilter = useCallback((field, value) => {
    setDraftFilter((prev) => {
      const current = prev[field] || [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: newValues };
    });
  }, []);

  const handleDateFromChange = useCallback((e) => {
    const from = e.target.value;
    setDraftFilter((prev) => {
      const to = prev.created_to || "";
      if (to && moment(to).isBefore(moment(from))) {
        return { ...prev, created_from: from, created_to: from };
      }
      return { ...prev, created_from: from };
    });
  }, []);

  const handleDateToChange = useCallback((e) => {
    const to = e.target.value;
    setDraftFilter((prev) => {
      const from = prev.created_from || "";
      if (from && moment(to).isBefore(moment(from))) {
        return prev; // Không cho phép, giữ nguyên
      }
      return { ...prev, created_to: to };
    });
  }, []);

  const handleApplyFilter = useCallback(() => {
    const { created_from, created_to } = draftFilter;
    if (
      created_from &&
      created_to &&
      moment(created_to).isBefore(moment(created_from))
    ) {
      // Có thể thêm snackbar warning, nhưng ở đây chỉ không apply
      return;
    }
    onChangeFilter({ ...filter, ...draftFilter, page: 1 });
    setAnchorEl(null);
  }, [draftFilter, filter, onChangeFilter]);

  const handleClearFilter = useCallback(() => {
    setDraftFilter({
      title: "",
      collection: "",
      record_content_type: [],
      source_type: [],
      published_state: [],
      creator: "",
      created_from: "",
      created_to: "",
    });
  }, []);

  const filteredSortedRecords = useMemo(() => {
    let data = [...(records || [])];
    if (filter?.s) {
      const query = filter.s.toLowerCase();
      data = data.filter((r) => {
        const title = r.title?.toLowerCase() || "";
        const collection = r.collection?.title?.toLowerCase() || "";
        const type = r.record_content_type
          ? RecordContentType[r.record_content_type]?.toLowerCase()
          : "";
        const creator = r?.creator?.full_name?.toLowerCase() || "";
        const source = r?.source_type || "";
        const status = r?.published ? "đã xuất bản" : "lưu nháp";
        const createdAt = moment(r.created_at).format("DD/MM/YYYY");
        return [
          title,
          collection,
          type,
          source,
          status,
          creator,
          createdAt,
        ].some((x) => x?.includes(query));
      });
    }
    if (filter?.title) {
      const q = filter.title.toLowerCase();
      data = data.filter((r) => (r.title || "").toLowerCase().includes(q));
    }
    if (filter?.collection) {
      const q = filter.collection.toLowerCase();
      data = data.filter((r) =>
        (r.collection?.title || "").toLowerCase().includes(q)
      );
    }
    if (filter?.record_content_type?.length > 0) {
      data = data.filter((r) =>
        filter.record_content_type.includes(r.record_content_type)
      );
    }
    if (filter?.source_type?.length > 0) {
      data = data.filter((r) => filter.source_type.includes(r.source_type));
    }
    if (filter?.published_state?.length > 0) {
      const isPublished = filter.published_state.includes("published");
      const isDraft = filter.published_state.includes("draft");
      if (isPublished && !isDraft) data = data.filter((r) => !!r.published);
      if (!isPublished && isDraft) data = data.filter((r) => !r.published);
      // Nếu cả hai, không filter
    }
    if (filter?.creator) {
      const q = filter.creator.toLowerCase();
      data = data.filter((r) =>
        (r.creator?.full_name || "").toLowerCase().includes(q)
      );
    }
    if (filter?.created_from) {
      const from = moment(filter.created_from, "YYYY-MM-DD");
      data = data.filter((r) => moment(r.created_at).isSameOrAfter(from));
    }
    if (filter?.created_to) {
      const to = moment(filter.created_to, "YYYY-MM-DD").endOf("day");
      data = data.filter((r) => moment(r.created_at).isSameOrBefore(to));
    }
    const sortBy = filter?.sort_by || "created_at";
    const dir = (filter?.sort_dir || "desc") === "asc" ? 1 : -1;
    data.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case "title":
          va = a.title || "";
          vb = b.title || "";
          break;
        case "collection":
          va = a.collection?.title || "";
          vb = b.collection?.title || "";
          break;
        case "record_content_type":
          va = RecordContentType[a.record_content_type] || "";
          vb = RecordContentType[b.record_content_type] || "";
          break;
        case "source_type":
          va = SourceTypeEnum[a.source_type] || "";
          vb = SourceTypeEnum[b.source_type] || "";
          break;
        case "published":
          va = a.published ? 1 : 0;
          vb = b.published ? 1 : 0;
          break;
        case "creator":
          va = a.creator?.full_name || "";
          vb = b.creator?.full_name || "";
          break;
        default:
          va = new Date(a.created_at).getTime();
          vb = new Date(b.created_at).getTime();
          break;
      }
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    return data;
  }, [records, filter]);

  const getProgressRecord = (record) => {
    const pipelines = record.pipeline_items.filter(
      (x) => x.type !== PipelineItemTypeEnum.CHATBOT_PREPARATION
    );
    if (_.isEmpty(pipelines)) return false;
    const errorItems = _.filter(pipelines, (x) => x.status === "Failed");
    const count = _.filter(pipelines, (x) => x.status === "Success").length;
    return {
      percentage: (count / pipelines.length) * 100,
      isCompleted: count === pipelines.length,
      isFailed: !_.isEmpty(errorItems),
    };
  };

  const initializeDraftFilter = useCallback(
    () => ({
      title: filter.title || "",
      collection: filter.collection || "",
      record_content_type: Array.isArray(filter.record_content_type)
        ? filter.record_content_type
        : filter.record_content_type
        ? [filter.record_content_type]
        : [],
      source_type: Array.isArray(filter.source_type)
        ? filter.source_type
        : filter.source_type
        ? [filter.source_type]
        : [],
      published_state: Array.isArray(filter.published_state)
        ? filter.published_state
        : filter.published_state
        ? [filter.published_state]
        : [],
      creator: filter.creator || "",
      created_from: filter.created_from || "",
      created_to: filter.created_to || "",
    }),
    [filter]
  );

  return (
    <div className="flex flex-col">
      <div className="flex my-[15px] justify-between">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <div className="flex items-center gap-2">
            <Button
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
                setDraftFilter(initializeDraftFilter());
              }}
              size="small"
              variant="outlined"
              startIcon={<TuneIcon />}
              fullWidth={false}
            >
              Lọc
            </Button>
            <Button
              onClick={handleUnpublishedToggle}
              sx={{
                ...(filter.unpublished && {
                  color: "white",
                  backgroundColor: colors.primaryColor,
                  "&:hover": { borderColor: "gray", backgroundColor: "gray" },
                }),
              }}
              variant={filter.unpublished ? "contained" : "outlined"}
              size="small"
              fullWidth={false}
            >
              Sản phẩm chưa phát hành
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <TextField
              size="small"
              value={filter.s}
              placeholder="Tìm kiếm..."
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    sx={{
                      backgroundColor: (theme) => theme.palette.divider,
                      borderTopLeftRadius: (theme) =>
                        theme.shape.borderRadius + "px",
                      borderBottomLeftRadius: (theme) =>
                        theme.shape.borderRadius + "px",
                    }}
                    position="start"
                  >
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                height: "30px",
                input: {
                  fontWeight: 400,
                  color: "black",
                  "&::placeholder": { color: "gray" },
                },
              }}
              hiddenLabel
              variant="outlined"
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </Stack>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          sx: {
            width: "350px",
            padding: "16px",
            maxHeight: "80vh",
            overflow: "auto",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
          },
        }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Stack sx={{ width: "100%", backgroundColor: "white" }} spacing={2}>
          <Stack spacing={1}>
            <TextField
              size="small"
              label="Tiêu đề"
              value={draftFilter.title || ""}
              onChange={(e) =>
                setDraftFilter({ ...draftFilter, title: e.target.value })
              }
              sx={{ mb: 0 }}
            />
            <TextField
              size="small"
              label="Bộ sưu tập"
              value={draftFilter.collection || ""}
              onChange={(e) =>
                setDraftFilter({ ...draftFilter, collection: e.target.value })
              }
              sx={{ mb: 0 }}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Thể loại
            </Typography>
            <Divider sx={{ borderColor: "divider" }} />
            <FormControl size="small" sx={{ mb: 0 }}>
              <FormGroup>
                {RecordContentTypes.map((opt) => (
                  <FormControlLabel
                    key={opt.id}
                    control={
                      <Checkbox
                        checked={(
                          draftFilter.record_content_type || []
                        ).includes(opt.id)}
                        onChange={() =>
                          handleToggleFilter("record_content_type", opt.id)
                        }
                        size="small"
                        sx={{ padding: "4px" }}
                      />
                    }
                    label={opt.label}
                    sx={{ margin: 0, minHeight: "auto" }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Stack>

          <Stack spacing={1}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Nguồn
            </Typography>
            <Divider sx={{ borderColor: "divider" }} />
            <FormControl size="small" sx={{ mb: 0 }}>
              <FormGroup>
                {SourceTypes.map((opt) => (
                  <FormControlLabel
                    key={opt.id}
                    control={
                      <Checkbox
                        checked={(draftFilter.source_type || []).includes(
                          opt.id
                        )}
                        onChange={() =>
                          handleToggleFilter("source_type", opt.id)
                        }
                        size="small"
                        sx={{ padding: "4px" }}
                      />
                    }
                    label={opt.label}
                    sx={{ margin: 0, minHeight: "auto" }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Stack>

          <Stack spacing={1}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Trạng thái
            </Typography>
            <Divider sx={{ borderColor: "divider" }} />
            <FormControl size="small" sx={{ mb: 0 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={(draftFilter.published_state || []).includes(
                        "published"
                      )}
                      onChange={() =>
                        handleToggleFilter("published_state", "published")
                      }
                      size="small"
                      sx={{ padding: "4px" }}
                    />
                  }
                  label="Đã xuất bản"
                  sx={{ margin: 0, minHeight: "auto" }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={(draftFilter.published_state || []).includes(
                        "draft"
                      )}
                      onChange={() =>
                        handleToggleFilter("published_state", "draft")
                      }
                      size="small"
                      sx={{ padding: "4px" }}
                    />
                  }
                  label="Lưu nháp"
                  sx={{ margin: 0, minHeight: "auto" }}
                />
              </FormGroup>
            </FormControl>
          </Stack>

          <Stack spacing={1}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Người tạo & Ngày tạo
            </Typography>
            <Divider sx={{ borderColor: "divider" }} />
            <TextField
              size="small"
              label="Người tạo"
              value={draftFilter.creator || ""}
              onChange={(e) =>
                setDraftFilter({ ...draftFilter, creator: e.target.value })
              }
              sx={{ mb: 0 }}
            />
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                type="date"
                label="Từ ngày"
                InputLabelProps={{ shrink: true }}
                value={draftFilter.created_from || ""}
                onChange={handleDateFromChange}
                inputProps={{
                  max: draftFilter.created_to || undefined,
                }}
                sx={{ flex: 1, mb: 0 }}
              />
              <TextField
                size="small"
                type="date"
                label="Đến ngày"
                InputLabelProps={{ shrink: true }}
                value={draftFilter.created_to || ""}
                onChange={handleDateToChange}
                inputProps={{
                  min: draftFilter.created_from || undefined,
                }}
                sx={{ flex: 1, mb: 0 }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ my: 1, borderColor: "divider" }} />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" variant="outlined" onClick={handleClearFilter}>
              Bỏ lọc
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleApplyFilter}
            >
              Áp dụng
            </Button>
          </Stack>
        </Stack>
      </Popover>
      <div className="min-w-[800] min-h-[65vh]">
        <Table>
          <TableHead className="bg-white">
            <TableRow
              sx={{
                borderTop: `1px solid ${colors.borderColor}`,
                borderBottom: `1px solid ${colors.borderColor}`,
              }}
            >
              <TableCell
                sortDirection={
                  filter.sort_by === "title" ? filter.sort_dir : false
                }
              >
                <TableSortLabel
                  active={filter.sort_by === "title"}
                  direction={
                    filter.sort_by === "title" ? filter.sort_dir : "desc"
                  }
                  onClick={() => handleSort("title")}
                >
                  Tiêu đề
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  filter.sort_by === "collection" ? filter.sort_dir : false
                }
              >
                <TableSortLabel
                  active={filter.sort_by === "collection"}
                  direction={
                    filter.sort_by === "collection" ? filter.sort_dir : "desc"
                  }
                  onClick={() => handleSort("collection")}
                >
                  Bộ sưu tập
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  filter.sort_by === "record_content_type"
                    ? filter.sort_dir
                    : false
                }
              >
                <TableSortLabel
                  active={filter.sort_by === "record_content_type"}
                  direction={
                    filter.sort_by === "record_content_type"
                      ? filter.sort_dir
                      : "desc"
                  }
                  onClick={() => handleSort("record_content_type")}
                >
                  Thể loại
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  filter.sort_by === "source_type" ? filter.sort_dir : false
                }
              >
                <TableSortLabel
                  active={filter.sort_by === "source_type"}
                  direction={
                    filter.sort_by === "source_type" ? filter.sort_dir : "desc"
                  }
                  onClick={() => handleSort("source_type")}
                >
                  Nguồn
                </TableSortLabel>
              </TableCell>
              <TableCell>Tiến trình</TableCell>
              <TableCell
                align="center"
                sortDirection={
                  filter.sort_by === "published" ? filter.sort_dir : false
                }
              >
                <TableSortLabel
                  active={filter.sort_by === "published"}
                  direction={
                    filter.sort_by === "published" ? filter.sort_dir : "desc"
                  }
                  onClick={() => handleSort("published")}
                >
                  Trạng thái
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  filter.sort_by === "creator" ? filter.sort_dir : false
                }
              >
                <TableSortLabel
                  active={filter.sort_by === "creator"}
                  direction={
                    filter.sort_by === "creator" ? filter.sort_dir : "desc"
                  }
                  onClick={() => handleSort("creator")}
                >
                  Người tạo
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  filter.sort_by === "created_at" ? filter.sort_dir : false
                }
              >
                <TableSortLabel
                  active={filter.sort_by === "created_at"}
                  direction={
                    filter.sort_by === "created_at" ? filter.sort_dir : "desc"
                  }
                  onClick={() => handleSort("created_at")}
                >
                  Ngày tạo
                </TableSortLabel>
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <TableBody>
              {[...Array(Math.min(limit, 10))].map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell width="15%">
                    <Skeleton variant="text" width={160} />
                  </TableCell>
                  <TableCell width="10%">
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell width="10%">
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="circular" width={24} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" height={18} />
                  </TableCell>
                  <TableCell align="center" width="10%">
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width={120} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={90} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="text" width={40} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {filteredSortedRecords.map((item) => {
                const runningStep = item.pipeline_items.find(
                  (x) => x.status === "Running"
                );
                const { isCompleted, percentage, isFailed } =
                  getProgressRecord(item);
                return (
                  <TableRow hover key={item.id}>
                    <TableCell width="15%">
                      <Tooltip title={item.title}>
                        <Typography
                          sx={{
                            maxWidth: "200px",
                            fontWeight: 600,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                          variant="subtitle2"
                        >
                          {item.title}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell width="10%">
                      {item.collection ? item.collection.title : `-`}
                    </TableCell>
                    <TableCell width="10%">
                      {item.record_content_type
                        ? RecordContentType[item.record_content_type]
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.source_type === SourceTypeEnum.LOCAL ? (
                        <Tooltip title="Tải lên">
                          <CloudUploadOutlinedIcon />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Từ youtube">
                          <YouTubeIcon />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          isCompleted
                            ? "Hoàn thành"
                            : PipelineStepTitle[runningStep?.type]
                        }
                      >
                        <ProgressBar
                          barContainerClassName={styles.container}
                          bgColor={
                            isCompleted
                              ? "#10b981"
                              : isFailed
                              ? colors.errorColor
                              : "#EED202"
                          }
                          labelClassName={styles.label}
                          borderRadius="0px"
                          completed={Math.round(percentage)}
                          customLabel={`${Math.round(percentage)}%`}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" width="10%">
                      {item.published ? `Đã xuất bản` : `Lưu nháp`}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Avatar
                          sx={{ width: "24px", height: "24px" }}
                          alt="avatar"
                          src={readUrl(item?.creator?.avatar, true)}
                        />
                        <Typography fontSize="13px" fontWeight="500">
                          {item?.creator?.full_name}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      {moment(item.created_at).format("DD/MM/YYYY")}
                    </TableCell>
                    <ActionTableCell
                      publishable={isCompleted}
                      onRefresh={onRefresh}
                      item={item}
                    />
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </div>
      <TablePagination
        component="div"
        count={totalCount ?? 0}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 20, 50, 100, { value: -1, label: "Tất cả" }]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={"Số dòng mỗi trang:"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trong số ${count}`
        }
        sx={{
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            { marginBottom: 0 },
          "& .MuiTablePagination-actions": { marginTop: 0 },
        }}
      />
    </div>
  );
};
