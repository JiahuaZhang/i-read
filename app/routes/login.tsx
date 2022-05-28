import { GoogleLogin } from "@react-oauth/google";
import { type ActionFunction, useSubmit, useSearchParams } from "remix";
import { login } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const credential = formData.get("credential") as string;
  const redirectTo = formData.get("redirectTo") as string;

  return login({ request, jwt: credential, redirectTo });
};

const Login = () => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  return (
    <div className="pt-20">
      <div className="mx-auto w-[204px]">
        <GoogleLogin
          auto_select
          onSuccess={async (credentialResponse) => {
            const { credential = "" } = credentialResponse;
            submit({ redirectTo, credential }, { method: "post" });
          }}
        />
      </div>
    </div>
  );
};

export default Login;
