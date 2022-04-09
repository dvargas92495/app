import remixAppAction from "@dvargas92495/ui/utils/remixAppAction.server";
import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import React from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
} from "remix";
import deleteMigrationRecord from "~/data/deleteMigrationRecord.server";

const UserMysqlUuid = () => {
  return (
    <>
      <Form method={"delete"}>
        <button type="submit">DELETE</button>
      </Form>
    </>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ params }) => {
      // fetch source Id
    return params;
  });
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ userId, method, params }) => {
    if (userId !== "user_21WUZXJqWrD2UpiymzkSd5uBB5k")
      throw new Response(`User not authorized to access this endpoint`, {
        status: 403,
      });
    if (!params.uuid)
      throw new Response(`Missing Record uuid`, { status: 400 });
    if (method === "DELETE") {
      return deleteMigrationRecord(params.uuid).then(() =>
        redirect("/user/mysql")
      );
    } else throw new Response(`Unsupported method: ${method}`, { status: 404 });
  });
};

export default UserMysqlUuid;