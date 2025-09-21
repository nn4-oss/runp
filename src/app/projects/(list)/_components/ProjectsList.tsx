"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import ProjectListActions from "./ProjectListActions";
import ProjectsTable from "./ProjectsTable";

import { AppContainer, FixedHeader, Spinner } from "@/components";
import { Field } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

const SearchContainer = styled.div`
  width: 100%;
  border-top: var(--measurement-small-30) solid var(--font-color-alpha-10);

  input {
    font-size: var(--fontsize-medium-20) !important;
    width: 100% !important;
  }
`;

function ProjectsList() {
  const trpc = useTRPC();
  const { data: projects, isPending } = useQuery(
    trpc.projects.getMany.queryOptions(),
  );

  const searchParams = useSearchParams();
  const sortOption = searchParams.get("sortBy");

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const deferredSearchQuery = React.useDeferredValue<string>(searchQuery);

  const sortedData = React.useMemo(() => {
    if (!projects) return;

    return [...projects].sort((a, b) => {
      const aTime = new Date(a.updatedAt).getTime();
      const bTime = new Date(b.updatedAt).getTime();

      const asc = aTime - bTime;
      const desc = bTime - aTime;

      if (sortOption === "desc") return desc;
      else return asc;
    });
  }, [projects, sortOption]);

  const tableData = React.useMemo(() => {
    if (!sortedData) return;
    return sortedData.filter(
      (item) =>
        item.id.includes(deferredSearchQuery) ||
        item.name.includes(deferredSearchQuery),
    );
  }, [sortedData, deferredSearchQuery]);

  if (isPending) {
    return (
      <AppContainer className="w-100 h-100 flex align-center justify-center">
        <Spinner />
      </AppContainer>
    );
  }

  const hasData = projects && tableData && Number(tableData?.length) !== 0;

  return (
    <AppContainer className="w-100 h-100" scrollbar>
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">
            All projects&nbsp;
            <span className="opacity-default-30">
              ({Number(tableData?.length)}/{Number(projects?.length)})
            </span>
          </p>

          <ProjectListActions />
        </div>

        <SearchContainer className="flex align-center p-y-medium-30 p-x-medium-60">
          <Field.Root>
            <Icon>
              <PixelIcon.Search />
            </Icon>
            <Field
              variant="ghost"
              sizing="small"
              className="w-100"
              placeholder="Search for a project.."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </Field.Root>
        </SearchContainer>
      </FixedHeader>

      <div className="p-medium-30 grid w-100 ">
        {!hasData && (
          <div className="flex align-center justify-center w-100 p-y-large-10">
            <p className="fs-medium-10 opacity-default-30">No project found</p>
          </div>
        )}
        {hasData && <ProjectsTable data={tableData} />}
      </div>
    </AppContainer>
  );
}

export default ProjectsList;
