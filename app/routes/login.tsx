import { GoogleLogin } from "@react-oauth/google";
import { type ActionFunction, useSubmit } from "remix";
import { login } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const credential = formData.get("credential") as string;
  return login({ request, jwt: credential });
};

const Login = () => {
  const submit = useSubmit();

  return (
    <div className="pt-20">
      <div className="mx-auto w-[204px]">
        <GoogleLogin
          auto_select
          onSuccess={async (credentialResponse) => {
            const { credential = "" } = credentialResponse;
            submit({ credential }, { method: "post" });
          }}
        />
      </div>
    </div>
  );
};

export default Login;
