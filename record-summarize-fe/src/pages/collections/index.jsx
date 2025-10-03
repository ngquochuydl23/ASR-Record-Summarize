import AdminHeader from "@/components/AdminHeader";
import DashboardCard from "@/components/card/DashboardCard";
import { getCategories } from "@/repositories/category.repository";
import { CollectionTable } from "@/sections/collections/CollectionTable";
import CreateUpdateCategoryDrawer from "@/sections/collections/CreateUpdateCategoryDrawer";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAsync, useAsyncFn, useAsyncRetry, useEffectOnce } from "react-use";

const Page = () => {

  const [rowsPerPageChange, setRowsPerPageChange] = useState();
  const [open, setOpen] = useState(false);

  const [{ loading, value, error }, getAll] = useAsyncFn(async () => {
    const data = await getCategories({ mode: "hierachy" });
    return data;
  }, [open]);

  const handleImportExcel = async () => {
    //const file = await importExcelDialog({});
  }

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <DashboardCard>
      <div className="flex flex-col">
        <AdminHeader title="Bộ sưu tập">
          <Button variant="outlined" onClick={handleOpenDrawer}>
            Tạo bộ sưu tập
          </Button>
        </AdminHeader>
        {!error && !loading && value && (
          <CollectionTable
            onRowsPerPageChange={() => { }}
            onPageChange={() => { }}
            onRefresh={() => {}}
            totalCount={2}
            collections={[
              {
                title: "Xử lý ảnh"
              }
            ]}
            isLoading={false}
          />
        )}
        <CollectionTable
            onRowsPerPageChange={() => { }}
            onPageChange={() => { }}
            onRefresh={() => {}}
            totalCount={2}
            collections={[
              {
                title: "Xử lý ảnh"
              }
            ]}
            isLoading={false}
          />
        <CreateUpdateCategoryDrawer
          open={open}
          onCreate={getAll}
          onClose={handleDrawerClose}
        />
      </div>
    </DashboardCard>
  );
};

export default Page;
