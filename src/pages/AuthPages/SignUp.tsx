import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Registrar"
        description="Página de registro do BichoFull"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
