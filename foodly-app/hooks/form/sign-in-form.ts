import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import yup from "@/shared/validate-helper";

export type SignInSchemaType = {
  email: string;
  password: string;
  organization_id?: string;
};

const SignInSchema = yup.object().shape({
  email: yup.string().label("email").required().email().trim(),
  password: yup.string().label("password").required().trim(),
});

const useSignInForm = () => {
  const form = useForm<SignInSchemaType>({
    mode: "onChange",
    resolver: yupResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      organization_id: localStorage.getItem("ORGANIZATION_ID") || "",
    },
  });

  return form;
};

export default useSignInForm;
