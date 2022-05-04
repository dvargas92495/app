import React from "react";
import Table from "~/package/components/Table";
import type { LoaderFunction } from "@remix-run/server-runtime";
import remixAppLoader from "~/package/utils/remixAppLoader.server";
import searchTransfers from "~/data/searchTransfers.server";

const UserTransfersPage = () => {
  return <Table />;
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, searchTransfers);
};

export default UserTransfersPage;
