import AdminHeader from "@/components/AdminHeader";
import DashboardCard from "@/components/card/DashboardCard";
import { getRecords } from "@/repositories/record.repository";
import CreateRecordDrawer from "@/sections/records/CreateRecordDrawer";
import { RecordTable } from "@/sections/records/RecordTable";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { useDebounce } from "use-debounce";
import AddIcon from '@mui/icons-material/Add';
import { useFormik } from "formik";

const Page = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const formik = useFormik({
    initialValues: {
      unpublished: null,
      page: 1,
      limit: 10,
      s: "",
      record_content_type: [],
      source_type: null,
      lang: null
    },
    onSubmit: () => { },
  });
  const [debouncedValues] = useDebounce(formik.values, 500);
  const [{ loading, value, error }, doFetch] = useAsyncFn(async () => {
    const {
      unpublished,
      page,
      limit,
      s,
      source_type,
      lang,
      record_content_type
    } = debouncedValues;
    const recordContentTypeIds = Array.isArray(record_content_type)
      ? record_content_type.map((x) => x.id)
      : [];

    return await getRecords({
      unpublished, page, limit, s, record_content_type: recordContentTypeIds, source_type, lang
    });
  }, [debouncedValues]);

  useEffect(() => {
    doFetch();
  }, [debouncedValues, doFetch]);


  const handleDrawerClose = () => {
    setOpenDrawer(false);
  }

  return (
    <DashboardCard>
      <div className="flex flex-col">
        <AdminHeader title={"Video được tóm tắt"}>
          <Button startIcon={<AddIcon />} variant="outlined" onClick={() => setOpenDrawer(true)}>
            Tạo tóm tắt
          </Button>
        </AdminHeader>
        <RecordTable
          filter={formik.values}
          onChangeFilter={formik.setValues}
          onRefresh={doFetch}
          page={value?.page}
          limit={value?.limit}
          totalCount={value?.total}
          records={value?.items}
          isLoading={loading}
        />
      </div>
      <CreateRecordDrawer open={openDrawer} onClose={handleDrawerClose} />
    </DashboardCard>
  );
};

export default Page;
