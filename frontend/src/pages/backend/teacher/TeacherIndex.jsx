import { Link } from "react-router-dom";
import Table from "../../../components/common/Table";
import Button from "../../../components/common/Button";
import { useState } from "react";

const TeacherIndex = () => {
  const [teacher, setTeacher] = useState([]);
  const columns = [
    { header: "Sr.No", accessor: "id" },
    {
      header: "Teacher Name",
      accessor: "teacher_name",
    },
    {
      header: "Teacher Subject",
      accessor: "teacher_subject",
    },
    {
      header: "Teacher Image",
      accessor: "teacher_image",
    },
    {
      header: "Action",
      render: (val) => <Button variant="primary">Edit</Button>,
    },
  ];

  return (
    <>
      <div>
        <h1>Teacher List</h1>
        <Link to={"/admin/teacher/create"}>Add Techer</Link>
        <Table columns={columns} data={teacher} hoverable />
      </div>
    </>
  );
};

export default TeacherIndex;
