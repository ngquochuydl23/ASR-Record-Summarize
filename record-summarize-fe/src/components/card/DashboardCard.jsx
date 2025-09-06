const DashboardCard = ({ children, sx }) => {
  return (
    <div className="flex flex-col h-full rounded-xl bg-white p-6 border-[1px] border-[#E5E7EB]">
      {children}
    </div>
  );
};


export default DashboardCard;