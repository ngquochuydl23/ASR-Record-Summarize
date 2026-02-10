import { colors } from "@/theme/theme.global";
import { SvgIcon } from "@mui/material";

const IcPersonal = () => (
    <SvgIcon sx={{ height: '24px', width: '24px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke={colors.primaryColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke={colors.primaryColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 9H9.01" stroke={colors.primaryColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15 9H15.01" stroke={colors.primaryColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>


    </SvgIcon>
)

export default IcPersonal;
