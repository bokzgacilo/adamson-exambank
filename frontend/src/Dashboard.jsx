import { Outlet } from "react-router-dom";
import { Container, SimpleGrid, Stack } from "@chakra-ui/react";
import SidebarComponent from "./components/Sidebar";

export default function Dashboard() {
  return (
    <Stack height="100vh" spacing={0}>
      <SimpleGrid templateColumns="18% 82%" flex={1} >
        <SidebarComponent />
        <Container
          p={0}
          maxW="none"
          w="100%"
          backgroundColor="#e2e2e2"
        >
          <Outlet />
        </Container>
      </SimpleGrid>
    </Stack>
  );
}
