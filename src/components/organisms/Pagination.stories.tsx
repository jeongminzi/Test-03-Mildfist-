import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Organisms/Pagination",
  component: Pagination,
};
export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [page, setPage] = useState(2);
      return <Pagination page={page} totalPages={10} onChange={setPage} />;
    };
    return <Demo />;
  },
};
