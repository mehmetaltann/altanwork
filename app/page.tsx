import Header from "@/components/Layouts/Header";
import HomeMain from "@/features/Home/HomeMain";
import { PageWrapper } from "@/components/Layouts/Wrappers";

export default function Home() {
  return (
    <>
      <Header />
      <PageWrapper>
        <HomeMain />
      </PageWrapper>
    </>
  );
}
