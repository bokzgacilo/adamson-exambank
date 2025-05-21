import { Stack, Text, Flex, Select, Button, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TbPlus, TbX } from "react-icons/tb";
import axios from "axios"

export default function AssignDepartmentSelector({data}) {
  const { user_departments, set_user_department } = data;
  const [availableDepartments, setAvailableDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState([])

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=get_all_departments`)
      .then((response) => {
        const firstDepartment = response.data[0]?.name || "";
        setAvailableDepartments(response.data.map(department => department.name));
        setSelectedDepartment(firstDepartment)
      })
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  const HandleAddDepartment = () => {
    if (selectedDepartment && !user_departments.includes(selectedDepartment)) {
      set_user_department((prev) => [...prev, selectedDepartment]);
      setAvailableDepartments((prev) => {
        const filtered = prev.filter((departmentName) => departmentName !== selectedDepartment);
        setSelectedDepartment(filtered[0] || "");
        return filtered;``
      });
    }
  };

  const HandleRemoveSubject = (item) => {
    set_user_department((prev) => prev.filter((department) => department !== item));
    setSelectedDepartment(item)
    setAvailableDepartments((prev) => {
      if (!prev.includes(item)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  return (
    <Stack>
      <Text fontWeight="semibold">Assigned Departments</Text>
      
      <Flex direction="row" gap={4}>
        {availableDepartments.length > 0 && (
          <>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            mb={4}
          >
            {availableDepartments
              .filter(department => !user_departments.includes(department))
              .map((department, index) => (
                <option key={index} value={department}>
                  {department}
                </option>
              ))}
          </Select>
          <Button
            colorScheme="green"
            onClick={HandleAddDepartment}
          >
            <Icon as={TbPlus} />
          </Button>
          </>
        )}
        
      </Flex>
      {user_departments.length === 0 ? (
        <Text>No Selected Subject</Text>
      ) : (
        <Stack mb={4}>
          {user_departments.map((subject, index) => (
            <Flex index={index} direction="row" alignItems="center" justifyContent="space-between">
              <Text >
                {index + 1}. {subject}
              </Text>
              <Button onClick={() => HandleRemoveSubject(subject)} size="xs"><Icon as={TbX} /></Button>
            </Flex>

          ))}
        </Stack>
      )}
    </Stack>
  )
}