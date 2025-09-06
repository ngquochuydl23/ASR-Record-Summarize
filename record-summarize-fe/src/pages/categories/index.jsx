import AdminHeader from "@/components/AdminHeader";
import DashboardCard from "@/components/card/DashboardCard";
import { useImportExcelDialog } from "@/contexts/ImportExcelDialogContext";
import { getCategories } from "@/repositories/category.repository";
import { CategoryTable } from "@/sections/category/CategoryTable";
import CreateUpdateCategoryDrawer from "@/sections/category/CreateUpdateCategoryDrawer";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAsync, useAsyncFn, useAsyncRetry, useEffectOnce } from "react-use";

const Page = () => {
  const importExcelDialog = useImportExcelDialog();
  const [rowsPerPageChange, setRowsPerPageChange] = useState();
  const [open, setOpen] = useState(false);

  const [{ loading, value, error }, getAll] = useAsyncFn(async () => {
    const data = await getCategories({ mode: "hierachy" });
    return data;
  }, [open]);

  const handleImportExcel = async () => {
    const file = await importExcelDialog({});
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
        <AdminHeader title="Danh mục">
          <Button variant="outlined" onClick={handleImportExcel}>Nhập</Button>
          <Button variant="outlined">Xuất</Button>
          <Button variant="outlined" onClick={handleOpenDrawer}>
            Tạo danh mục
          </Button>
        </AdminHeader>
        {!error && !loading && value && (
          <CategoryTable
            labels={["Tên", "Loại sản phẩm", "Trạng thái", "Số sản phẩm", "..."]}
            totalCount={value.totalCount || 0}
            onRowsPerPageChange={setRowsPerPageChange}
            onReload={() => getAll()}
            onDeselectAll={() => {
              console.log();
            }}
            onDeselectOne={() => {
              console.log();
            }}
            onPageChange={(page) => {
              console.log(page);
            }}
            categories={value.categories}
            isLoading={loading}
          />
        )}
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
