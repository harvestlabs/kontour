import { useRouter } from "next/router";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { NextPageWithLayout } from "types/next";
import ProjectEditor, {
  EDITOR_PAGE,
} from "@components/projects/editor/ProjectEditor";
import ProjectEditorLayout from "@layouts/ProjectEditorLayout";

const ProjectVersionLogsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { version_id } = router?.query;

  return (
    <>
      <Head>
        <title>Project</title>
      </Head>
      {/* data ? <ProjectDeprecated id={data.project?.id as string} /> : null */}
      {version_id ? (
        <ProjectEditor
          version_id={version_id as string}
          page={EDITOR_PAGE.LOGS}
        />
      ) : (
        "no version"
      )}
    </>
  );
};

ProjectVersionLogsPage.getLayout = function getLayout(page) {
  return <ProjectEditorLayout>{page}</ProjectEditorLayout>;
};
export default ProjectVersionLogsPage;
