import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Alert from "../../components/ui/alert/Alert";
import PageMeta from "../../components/common/PageMeta";

export default function Alerts() {
  return (
    <>
      <PageMeta
        title="Alerta"
        description="Alertas"
      />
      <PageBreadcrumb pageTitle="Alerts" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Registro no BichoFull">
          <Alert
            variant="success"
            title="Sucesso"
            message="Usuário registrado com sucesso."
          />
        </ComponentCard>

        <ComponentCard title="Warning Alert">
          <Alert
            variant="warning"
            title="Aviso"
            message="Tenha cautela ao realizar esta ação."
          />
        </ComponentCard>

        <ComponentCard title="Error Alert">
          <Alert
            variant="error"
            title="Erro no registro"
            message="Erro ao se registrar na plataforma BichoFull."
            showLink={false}
          />
        </ComponentCard>

        <ComponentCard title="Info Alert">
          <Alert
            variant="info"
            title="Informação"
            message="Esta é uma mensagem informativa."
            showLink={true}
            linkHref="/"
            linkText="Saiba mais"
          />
        </ComponentCard>
      </div>
    </>
  );
}
