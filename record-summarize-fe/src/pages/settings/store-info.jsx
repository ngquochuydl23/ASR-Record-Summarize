import AdminHeader from "@/components/AdminHeader";
import DashboardCard from "@/components/card/DashboardCard";
import { BootstrapAutocomplete } from "@/components/fields/BootstrapAutocomplete";
import { BootstrapInput } from "@/components/fields/BootstrapField";
import StoreInfoSection from "@/sections/settings/store/StoreInfoSection";
import { DashboardCustomize } from "@mui/icons-material";
import { FormControl, InputLabel } from "@mui/material";
import { Field, Formik } from "formik";
import { useSelector } from "react-redux";

const Page = () => {
  const { store } = useSelector((state) => state.store);
  return (
    <div className="flex flex-col">
      <AdminHeader title={"Thông tin cửa hàng"} />

      <div className="grid grid-cols-12 gap-3">
        <div className="flex flex-col col-span-6">
          <DashboardCard>
            Avatar zone
          </DashboardCard>
        </div>
        <div className="flex flex-col col-span-6">
          <StoreInfoSection />
        </div>
      </div>
    </div>
  )
}

export default Page;