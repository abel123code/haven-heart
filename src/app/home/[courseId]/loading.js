import {Spinner} from "@heroui/spinner";
import React from "react";

export default function LoadingComponent() {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <Spinner color="default" label="Loading..." />;
    </div>
  );
}