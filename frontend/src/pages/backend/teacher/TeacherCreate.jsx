import { Link } from "react-router-dom";
import Input from "../../../components/common/Input";
import FileUpload from "../../../components/common/FileUpload";
import { useState } from "react";
import Button from "../../../components/common/Button";

const TeacherCreate = () => {
  const [teacher, setTeacher] = useState({});

  const inputHandler = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(teacher);
  };
  return (
    <div className="p-12">
      <h1>Create Teacher</h1>
      <form onSubmit={(e) => submitHandler(e)}>
        <Input
          type="text"
          label={"Teacher Name"}
          name={"teacher_name"}
          onChange={inputHandler}
        ></Input>
        <Input
          type="text"
          label={"Subject"}
          name={"teacher_subject"}
          onChange={inputHandler}
        ></Input>

        <FileUpload
          label="Upload Profile Picture"
          name="teacher_image"
          onChange={inputHandler}
          accept="image/*"
        />
        <Button variant="primary" type="submit">
          Create Teacher
        </Button>
      </form>
    </div>
  );
};

export default TeacherCreate;
