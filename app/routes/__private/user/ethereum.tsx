import remixAppLoader from "~/package/backend/remixAppLoader.server";
import { Outlet, useActionData, useNavigate } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import Table from "~/package/components/Table";
import { useState } from "react";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import listEthereumRecords from "~/data/listEthereumRecords.server";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";

type Row = Awaited<ReturnType<typeof listEthereumRecords>>["data"][number];

const UserEthereum = () => {
  const actionData = useActionData();
  const navigate = useNavigate();
  const [recordSelected, setRecordSelected] = useState<Row>();
  return (
    <>
      <Table
        onRowClick={(row) => {
          setRecordSelected(row as Row);
          navigate(`/user/ethereum/${row.hash}`);
        }}
      />
      {actionData && (
        <div className="flex-grow border-2 border-gray-500 border-opacity-50 border-dashed rounded-lg p-4">
          <h1 className="text-2xl font-bold mb-6">Response</h1>
          <pre className="p-8 bg-green-800 bg-opacity-10 text-green-900 border-green-900 border-2 rounded-sm overflow-auto">
            {JSON.stringify(actionData.data, null, 4)}
          </pre>
        </div>
      )}
      <Outlet context={recordSelected} />
    </>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ userId, searchParams }) =>
    listEthereumRecords(userId, !!searchParams["smart"])
  );
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default UserEthereum;
