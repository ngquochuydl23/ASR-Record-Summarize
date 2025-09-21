import AdminHeader from "@/components/AdminHeader";
import DashboardCard from "@/components/card/DashboardCard";
import { getProducts } from "@/repositories/conversation.repository";
import { getRecords } from "@/repositories/record.repository";
import CreateUpdateObjectiveDrawer from "@/sections/records/CreateUpdateObjectiveDrawer";
import { RecordTable } from "@/sections/records/RecordTable";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAsync, useAsyncFn } from "react-use";
import AddIcon from '@mui/icons-material/Add';

const Page = () => {

  const [openDrawer, setOpenDrawer] = useState(false);

  const [{ loading, value, error }, doFetch] = useAsyncFn(getRecords, []);

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  }

  useEffect(() => {
    doFetch();
  }, [])
  
  return (
    <DashboardCard>
      <div className="flex flex-col">
        <AdminHeader title={"Video được tóm tắt"}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined" onClick={() => setOpenDrawer(true)}>
            Tạo tóm tắt
          </Button>
        </AdminHeader>
        <RecordTable
          onRowsPerPageChange={() => { }}
          onPageChange={() => { }}
          onRefresh={doFetch}
          totalCount={2}
          records={value}
          isLoading={false}
        />
      </div>
      <CreateUpdateObjectiveDrawer open={openDrawer} onClose={handleDrawerClose} />
    </DashboardCard>
  );
};

export default Page;
