import Header from "@/components/Layouts/Header";
import OdmTableContainer from "@/features/Odemeler/OdmTableContainer";
import { PageWrapper } from "@/components/Layouts/Wrappers";

export default async function page() {
  return (
    <>
      <Header />
      <PageWrapper>
        <OdmTableContainer />
      </PageWrapper>
    </>
  );
}
