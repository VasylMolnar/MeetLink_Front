import "./CreateMeet.scss";
import { Container } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import uploadImg from "../../assets/picture.png";
import { useState } from "react";

const CreateMeet = () => {
  const [selectedName, setSelectedName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      setSelectedName(file.name);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
    }
  };

  return (
    <div className="meet-link-create-meet">
      <Container>
        <h1 className="title">Створити зустріч</h1>
        <Formik
          initialValues={{
            meetName: "",
            meetDescription: "",
            meetDate: "",
            meetTime: "",
            meetListEmail: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {() => (
            <Form className="form">
              <div className="content">
                <label className="form-label">
                  Назва зустрічі
                  <Field
                    type="text"
                    name="meetName"
                    className="form-control"
                    required
                  />
                  <ErrorMessage name="meetName" component="div" />
                </label>

                <label className="form-label">
                  Короткий опис
                  <Field
                    type="textarea"
                    name="meetDescription"
                    className="form-control textarea"
                    required
                  />
                  <ErrorMessage name="meetDescription" component="div" />
                </label>

                <label className="form-label">
                  День проведення зустріч
                  <Field type="date" name="meetDate" className="form-control" />
                  <ErrorMessage name="meetDate" component="div" />
                </label>

                <label className="form-label">
                  Час проведення зустріч
                  <Field
                    type="time"
                    name="meetTime"
                    className="form-control"
                    required
                  />
                  <ErrorMessage name="meetTime" component="div" />
                </label>

                <label className="form-label">
                  Електронні пошти користувачів
                  <Field
                    as="textarea"
                    placeholder="test@gmail.com , test2@gmail.com"
                    rows={5}
                    cols={5}
                    name="meetListEmail"
                    className="form-control textarea-list-email"
                    required
                  />
                </label>
              </div>

              <div className="img-content">
                <div className="parent">
                  <div className="file-upload">
                    <img src={previewUrl || uploadImg} alt="upload" />
                    <h3> {selectedName || "Додайте зображення"}</h3>
                    <p>Мах розмір до 10mb</p>
                    <Field
                      type="file"
                      name="meetImg"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="create-btn">
                  Створити
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default CreateMeet;
