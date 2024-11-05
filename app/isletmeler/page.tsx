import Header from "@/components/Layouts/Header";
import IslTableContainer from "@/features/Isletmeler/IslTableContainer";
import { PageWrapper } from "@/components/Layouts/Wrappers";

export default async function page() {
  return (
    <>
      <Header />
      <PageWrapper>
        <IslTableContainer />
      </PageWrapper>
    </>
  );
}
