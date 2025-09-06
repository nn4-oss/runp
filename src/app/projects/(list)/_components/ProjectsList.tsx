"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import ProjectListActions from "./ProjectListActions";
import ProjectsTable from "./ProjectsTable";

import { AppContainer, FixedHeader } from "@/components";
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
  const { data: projects } = useSuspenseQuery(
    trpc.projects.getMany.queryOptions(),
  );

  const searchParams = useSearchParams();
  const sortOption = searchParams.get("sortBy");

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const deferredSearchQuery = React.useDeferredValue<string>(searchQuery);

  const sortedData = React.useMemo(() => {
    return [...projects].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();

      const asc = aTime - bTime;
      const desc = bTime - aTime;

      if (sortOption === "desc") return desc;
      else return asc;
    });
  }, [projects, sortOption]);

  const tableData = React.useMemo(() => {
    return sortedData.filter(
      (item) =>
        item.id.includes(deferredSearchQuery) ||
        item.name.includes(deferredSearchQuery),
    );
  }, [sortedData, deferredSearchQuery]);

  const hasData = tableData.length !== 0;

  return (
    <AppContainer
      className="h-100 w-100 "
      scrollbar
      style={{ position: "relative" }}
    >
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">
            All projects&nbsp;
            <span className="opacity-default-30">
              ({tableData.length}/{projects.length})
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
