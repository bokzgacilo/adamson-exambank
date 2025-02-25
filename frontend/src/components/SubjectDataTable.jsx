import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Divider, Heading, Input, Stack } from "@chakra-ui/react";

import PropTypes from "prop-types";
SubjectDataTable.propTypes = {
  data: PropTypes.any.isRequired,
};

export default function SubjectDataTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");


  return (
    <PrimeReactProvider>
      <Stack>
        <Heading size="md">SEARCH</Heading>
        <Input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          mb={4}
        />
      </Stack>
      <Divider mb={4} />
      <DataTable
        value={data}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 15, 30]}
        showGridlines
        size="small"
        globalFilter={globalFilter} // 🔍 Enable global search
      >
        <Column field="id" header="ID" sortable></Column>
        <Column
          field="name"
          header="Subject Name"
          filter
          sortable
        ></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}