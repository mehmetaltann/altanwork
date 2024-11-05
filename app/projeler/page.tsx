import Header from "@/components/Layouts/Header";
import PrjTableContainer from "@/features/Projeler/PrjTableContainer";
import { PageWrapper } from "@/components/Layouts/Wrappers";

export default async function page() {
  return (
    <>
      <Header />
      <PageWrapper>
        <PrjTableContainer />
      </PageWrapper>
    </>
  );
}
