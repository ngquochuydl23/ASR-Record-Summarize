import IcDelivery from "@/assets/icons/IcDelivery";
import IcPersonal from "@/assets/icons/IcPersonal";
import IcReturn from "@/assets/icons/IcReturn";
import IcStoreSign from "@/assets/icons/IcStoreSign";
import AdminHeader from "@/components/AdminHeader";
import DashboardCard from "@/components/card/DashboardCard";
import { AppRoute } from "@/constants/app.constants";
import MenuSettingitem from "@/sections/settings/MenuSettingItem";

const Page = () => {
  return (
    <DashboardCard>
      <div className="flex flex-col">
        <AdminHeader title={"Cài đặt"} />
        <div className="grid grid-cols-12 w-full gap-4 mt-4">
          <div className="col-span-6">
            <MenuSettingitem
              icon={<IcStoreSign />}
              href={AppRoute.STORE_SETTING}
              title={"Thông tin cửa hàng"}
              subtitle={"Quản lí thông tin cửa hàng của bạn"}
            />
          </div>
          <div className="col-span-6">
            <MenuSettingitem
              icon={<IcPersonal />}
              href={AppRoute.PERSONAL_INFO}
              title={"Thông tin cá nhân"}
              subtitle={`Quản lí thông tin cá nhân của bạn trên ${(
                <span className="font-bold">PG One</span>
              )}`}
            />
          </div>
          <div className="col-span-6">
            <MenuSettingitem
              icon={<IcDelivery />}
              href={`/settings/delivery`}
              title={"Quản lí đơn vị vận chuyển"}
              subtitle={`Liên kết các đơn vị vận chuyển GiaoHangNhanh`}
            />
          </div>
          <div className="col-span-6">
            <MenuSettingitem
              icon={<IcReturn />}
              title={"Chính sách đổi trả"}
              subtitle={`Liên kết các đơn vị vận chuyển GiaoHangNhanh`}
            />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default Page;
