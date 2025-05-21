import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, ModalFooter, Input, FormControl, FormLabel } from "@chakra-ui/react";
import axios from 'axios';
import { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {format} from 'date-fns'

export default function HistoryPage() {
  const [Logs, setLogs] = useState([])

  const fetchLogs = async () => {
    await axios.get(`${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=get_all_logs`)
      .then(response => {
        setLogs(response.data.data)
      });
  };

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <PrimeReactProvider>

      <Stack p={0}>
        <Card height="100dvh">
          <CardHeader backgroundColor="#141414" color="#fff">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Heading>History</Heading>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={0}>
            <DataTable
              value={Logs}
              paginator
              rows={10}
              rowsPerPageOptions={[10, 15, 30]}
              showGridlines
              size="small"
            >
              <Column field="id" header="ID" />
              <Column
                field="who_trigger"
                header="Triggered by"
                sortable
              />
              <Column
                field="message"
                header="Message"
              />
              <Column
                sortable
                field="datetime_created"
                header="Datetime"
                body={(rowData) => format(new Date(rowData.datetime_created), 'MMMM d, yyyy h:mmaaa')}
              />
            </DataTable>
          </CardBody>
        </Card>
      </Stack>
    </PrimeReactProvider>

  );
}
