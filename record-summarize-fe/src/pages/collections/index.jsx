import AdminHeader from "@/components/AdminHeader";
import DashboardCard from "@/components/card/DashboardCard";
import { getCategories, updateCategory } from "@/repositories/category.repository";
import { CollectionTable } from "@/sections/collections/CollectionTable";
import CreateUpdateCategoryDrawer from "@/sections/collections/CreateUpdateCategoryDrawer";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import _ from "lodash";

const Page = () => {
  const [rowsPerPageChange, setRowsPerPageChange] = useState();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ orderBy: null, order: "asc" });
  const [editing, setEditing] = useState(null);
  const [localFilter, setLocalFilter] = useState({ title: "", creator: "" });

  const [{ loading, value, error }, getAll] = useAsyncFn(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const data = await getCategories({
      mode: "hierachy",
      page: page + 1,
      limit: limit,
      s: search || undefined,
      order_by: sort.orderBy || undefined,
      order: sort.orderBy ? sort.order : undefined
    });
    // Apply client-side filter for title and creator on hierarchical categories list
    const categories = (data?.categories || []).filter((c) => {
      const okTitle = localFilter.title ? (c.title || "").toLowerCase().includes(localFilter.title.toLowerCase()) : true;
      const okCreator = localFilter.creator ? (c?.creator?.full_name || "").toLowerCase().includes(localFilter.creator.toLowerCase()) : true;
      return okTitle && okCreator;
    });
    return { ...data, categories };
  }, [page, limit, search, open, sort, localFilter]);

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(0);
  };

  const handleRefresh = () => {
    getAll();
  };

  const handleSearchChange = (searchValue) => {
    setSearch(searchValue);
    setPage(0);
  };

  const handleRequestEdit = (item) => {
    setEditing(item);
    setOpen(true);
  };

  const handleSortChange = (orderBy) => {
    setSort((prev) => {
      const order = prev.orderBy === orderBy && prev.order === "asc" ? "desc" : "asc";
      return { orderBy, order };
    });
  };

  const handleFilterChange = (f) => {
    setLocalFilter(f);
    setPage(0);
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
            onRowsPerPageChange={handleRowsPerPageChange}
            onPageChange={handlePageChange}
            onRefresh={handleRefresh}
            totalCount={value.total || 0}
            collections={value.categories || []}
            isLoading={loading}
            page={page}
            limit={limit}
            onSearchChange={handleSearchChange}
            onRequestEdit={handleRequestEdit}
            onSortChange={handleSortChange}
            sort={sort}
            onChangeFilter={handleFilterChange}
          />
        )}
        <CreateUpdateCategoryDrawer
          open={open}
          onCreate={handleRefresh}
          onClose={handleDrawerClose}
          category={editing}
        />
      </div>
    </DashboardCard>
  );
};

export default Page;
