import { colors } from "@/theme/theme.global";
import { CircularProgress } from "@mui/material";

const TableLoading = () => {
  <div className="flex w-full h-[100px]">
    <CircularProgress sx={{ color: colors.primaryColor }} />
  </div>
}

export default TableLoading;