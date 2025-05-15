import {
  Button,
  Heading,
  Stack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
  ModalCloseButton,
} from "@chakra-ui/react";
import Swal from "sweetalert2"
import { TbDownload, TbUpload } from "react-icons/tb";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../../helper/useUserStore";

export default function BatchQuestionModal({ isOpen, onClose, onOpen, refreshTable }){
  const { user } = useUserStore();
  const parsedSubjects = JSON.parse(user.user_assigned_subject)
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [File, SetFile] = useState(null);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "http://localhost/exam-bank/BATCH_QUESTION.xlsx";
    link.download = "BATCH_QUESTION.xlsx";
    link.click();
  };

  const HandeFileChange = (e) => {
    SetFile(e.target.files[0]);
  };

  useEffect(() => {
    if (user.usertype === "Admin") {
      axios.get("http://localhost/exam-bank/api/SubjectRoute.php", { params: { action: "GetAllSubjects", type: user.usertype } })
        .then(({ data }) => {
          setSubjects(data);
          setSelectedSubject(data[0].name);
        })
        .catch(console.error);
    } else {
      setSubjects(parsedSubjects);
      setSelectedSubject(parsedSubjects[0]);
    }
  }, [])

  const HandleCreate = async () => {
    if (!File) {
      alert("Please select a file first.");
      return;
    }

    await axios.post("http://localhost/exam-bank/api/ServicesRoute.php?action=ProcessQuestionBatch", {
      subject: selectedSubject,
      excel_data: File,
      creator: user.fullname
    }, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(response => {
        console.log(response)

        if (response.data.status === "not-found") {
          Swal.fire({
            title: response.data.message,
            text: response.data.description,
            icon: "error",
            confirmButtonColor: "#e53e3e", // Chakra's red.500
            confirmButtonText: "OK"
          });
        } else {
          Swal.fire({
            title: "Batch Uploaded!",
            text: `${response.data.data.length} questions successfully created`,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
            position: "center",
            toast: false // you can set this to true if you want a top-right mini-alert
          });
        }

        onClose()
        SetFile(null)
      })
  };

  return (
    <Modal size="xl"  isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Heading size="lg">Batch Create Question</Heading>
          </ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject.name || subject}>{subject.name || subject}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Select File To Upload</FormLabel>
                <Input size="sm" type="file" accept=".csv, .xlsx" onChange={HandeFileChange} />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              rightIcon={<TbDownload />}
              mr={4}
              onClick={handleDownload}
            >
              Template
            </Button>
            <Button
              colorScheme="green"
              rightIcon={<TbUpload />}
              onClick={HandleCreate}
            >
              Upload File
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}