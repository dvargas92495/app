import getMeta from "~/package/utils/getMeta";
import { SignUp } from "@clerk/remix";
import remixAuthedLoader from "~/package/utils/remixAuthedLoader.server";

export const loader = remixAuthedLoader;
export const meta = getMeta({ title: "Sign up" });
export default SignUp;
