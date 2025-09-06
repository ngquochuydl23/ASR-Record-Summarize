import { Typography } from "@mui/material";

const AdminHeader = ({ title, children, className, stackClassName }) => {
  return (
    <div className={`flex flex-row justify-between ${className}`}>
      <Typography variant="h4">{title}</Typography>
      <div className={`flex flex-row gap-2 ${stackClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default AdminHeader;
