import PaperSearchInput from "@/components/shared/paper-search-input";
import PublicNav from "@/components/shared/public-nav";
import ViewPaperContent from "@/domains/paper/components/view-paper-content";
import { composeMetadata } from "@/lib/utils/metadata";
import { Metadata, ResolvingMetadata } from "next";

// TODO: Make this a server component and prefetch the paper data on the server
type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const paperId = (await params).id
 
  // fetch post information
  const paper = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/papers/${paperId}`).then((res) =>
    res.json()
  )
 
  return {
    title: paper.title,
    description: paper.abstract,
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div>
      <PublicNav />

      <div className="items-center justify-items-center  pt-10 pb-20 w-full">
        <section className="flex flex-col gap-14 items-center pt-10 pb-20 w-full">
          <div className="space-y-4 lg:w-3/5 md:w-4/5 w-full px-8">
            <PaperSearchInput className="w-full" />
          </div>

          <ViewPaperContent paperId={parseInt(id, 10)}/>
        </section>
      </div>
    </div>
  );
};

export default Page;
