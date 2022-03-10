import { useRouter } from "next/router";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { NextPageWithLayout } from "types/next";
import ProjectEditor from "@components/projects/ProjectEditor";
import ProjectEditorLayout from "@layouts/ProjectEditorLayout";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { project_id } = router?.query;

  return (
    <>
      <Head>
        <title>Project</title>
      </Head>
      {/* data ? <ProjectDeprecated id={data.project?.id as string} /> : null */}
      {project_id ? <ProjectEditor id={project_id as string} /> : "no project"}
    </>
  );
};

ProjectPage.getLayout = function getLayout(page) {
  return <ProjectEditorLayout>{page}</ProjectEditorLayout>;
};
export default ProjectPage;
