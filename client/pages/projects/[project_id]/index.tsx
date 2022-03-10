import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { getLocalStorageKey } from "@utils/api_client";
import { Container } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  reset,
  setData,
  mergeData,
  selectData,
} from "src/redux/slices/projectSlice";
import Layout from "@layouts/Layout";
import { NextPageWithLayout } from "types/next";
import ProjectDeprecated from "@components/projects/ProjectDeprecated";
import ProjectEditor from "@components/projects/ProjectEditor";
import ProjectEditorLayout from "@layouts/ProjectEditorLayout";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { project_id } = router?.query;
  const dispatch = useDispatch();

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
