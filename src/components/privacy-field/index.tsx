"use client";

import React from "react";
import styled from "styled-components";

import { Button, Field } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

const Wrapper = styled(Field.Wrapper)`
  position: relative;
`;
const Trigger = styled(Button)`
  position: absolute !important;
  right: var(--measurement-medium-50);
  top: calc(var(--measurement-medium-50));
`;

function PrivacyField({ ...restProps }) {
  const [type, setType] = React.useState<"password" | "text">("password");

  const handleChangeType = React.useCallback(() => {
    if (type === "text") setType("password");
    if (type === "password") setType("text");
  }, [type, setType]);

  return (
    <Wrapper className="flex">
      <Field
        autoComplete="off"
        type={type}
        {...restProps}
        style={{ width: "100%" }}
      />
      <Trigger variant="ghost" sizing="small" onClick={handleChangeType}>
        <Icon>
          {type === "text" && <PixelIcon.Eye />}
          {type === "password" && <PixelIcon.EyeClosed />}
        </Icon>
      </Trigger>
    </Wrapper>
  );
}

export default PrivacyField;
