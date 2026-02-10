import { colors } from "@/theme/theme.global";
import { SvgIcon } from "@mui/material";

const IcStoreSign = () => (
  <SvgIcon sx={{ height: '24px', width: '24px' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.2943 17.1768H3.70605" stroke={colors.primaryColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M21 20L17.3787 5.51493C17.2706 5.08222 17.0208 4.69808 16.6693 4.42359C16.3177 4.1491 15.8845 4 15.4384 4H8.56155C8.11552 4 7.68229 4.1491 7.33073 4.42359C6.97917 4.69808 6.72945 5.08222 6.62127 5.51493L3 20" stroke={colors.primaryColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8.56152 4H15.0788C15.3068 4 15.5317 4.05195 15.7366 4.15191C15.9414 4.25187 16.1208 4.39721 16.2611 4.57688C16.4014 4.75655 16.4989 4.96584 16.5462 5.18883C16.5935 5.41182 16.5893 5.64266 16.534 5.8638L13 20" stroke={colors.primaryColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10 9H12" stroke={colors.primaryColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 12H12" stroke={colors.primaryColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </SvgIcon>
)

export default IcStoreSign;