import type mysql from "mysql2";

let singleton: mysql.Connection | undefined = undefined;

const createConnection = () => {
  const DATABASE_URL_REGEX =
    /^mysql:\/\/([a-z0-9_]+):([^@]{8,32})@([a-z0-9.-]+):(\d{3,5})\/([a-z_]+)$/;
  const matches = DATABASE_URL_REGEX.exec(process.env.DATABASE_URL || "");
  if (!matches) return Promise.reject(`Error parsing Database URL`);
  return import("mysql2").then(
    (mysql) =>
      (singleton = mysql.createConnection({
        host: matches[3],
        user: matches[1],
        port: Number(matches[4]),
        database: matches[5],
        password: matches[2],
      }))
  );
};

const getMysqlConnection = (mysql = singleton) => {
  const inherited = !!mysql;
  const promise = inherited ? Promise.resolve(mysql) : createConnection();
  return promise.then((connection) => ({
    connection,
    execute: <
      T extends
        | mysql.RowDataPacket[][]
        | mysql.RowDataPacket[]
        | mysql.OkPacket
        | mysql.OkPacket[]
        | mysql.ResultSetHeader
    >(
      s: string,
      args: (string | number | Date | boolean | null)[] = []
    ): Promise<T> =>
      new Promise((resolve, reject) => {
        return connection.execute<T>(s, args, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      }),
    destroy: (force?: true) => {
      if (!inherited || force) {
        singleton = undefined;
        connection.destroy();
      }
    },
  }));
};

export type Execute = Awaited<ReturnType<typeof getMysqlConnection>>["execute"];

export default getMysqlConnection;
