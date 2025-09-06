import AdminHeader from "@/components/AdminHeader";
import DashboardCard from "@/components/card/DashboardCard";

const Page = () => {
  return (
    <div className="flex flex-col">
      <AdminHeader title={"Trang chủ"} />
      <div class="grid grid-cols-12 gap-4 w-full">
        <div className="col-span-7">
          <DashboardCard>Chart1</DashboardCard>
        </div>
        <div className="col-span-4">
          <DashboardCard>Chart2</DashboardCard>
        </div>
        <div className="col-span-7">
          <DashboardCard>Chart1</DashboardCard>
        </div>
        <div className="col-span-4">
          <DashboardCard>Chart2</DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Page;
