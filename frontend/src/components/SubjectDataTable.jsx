import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Button, Divider, Heading, Input, Stack, useToast } from "@chakra-ui/react";

import PropTypes from "prop-types";
import { TbTrash } from "react-icons/tb";
import axios from "axios";
import { database } from "../helper/Firebase";
import { ref, set } from "firebase/database";
import useUserStore from "../helper/useUserStore";
SubjectDataTable.propTypes = {
  data: PropTypes.any.isRequired,
};

export default function SubjectDataTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const {user} = useUserStore();
  const toast = useToast();

  const RenderActionButtons = (rowData) => (
    <Button colorScheme="red" size="sm" leftIcon={<TbTrash />} onClick={() => HandleDeleteSubject(rowData.name)}>
      Delete
    </Button>
  );

  const HandleDeleteSubject = (subject_name) => {
    axios
    .post("http://localhost/exam-bank/api/SubjectRoute.php?action=delete", {
      subject_name: subject_name,
    })
    .then((response) => {
      if (response) {
        set(ref(database, `logs/${Date.now()}`), { action: "Subject Deleted", timestamp: Date.now(), target: subject_name, actor: user.fullname });
      }
    });
  }

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
        globalFilter={globalFilter}
      >
        <Column field="id" header="ID" sortable></Column>
        <Column
          field="name"
          header="Subject Name"
          filter
          sortable
        ></Column>
        <Column
          field="name"
          header="Action"
          body={RenderActionButtons}
        ></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}