import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


const MenuSettingitem = ({ title, subtitle, icon, href, disabled }) => {
  return (
    <Box component={Link} to={href}>
      <div className="flex border-[1px] border-borderColor rounded-lg p-4 items-center gap-3">
        <div className="h-[45px] w-[45px] aspect-square rounded-full bg-trans02Primary flex items-center justify-center">
          {icon}
        </div>
        <div className="flex flex-col w-full">
          <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>{title}</Typography>
          <p className="text-[14px] text-textSecondaryColor">{subtitle}</p>
        </div>
        <IconButton>
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>
    </Box>
  )
}

export default MenuSettingitem;