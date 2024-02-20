import "./CreateMeet.scss";
import { Container } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import uploadImg from "../../assets/picture.png";
import { useState } from "react";
import { Loading } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import { IErrorResponse } from "../../types/authTypes";
import { useCreateMeetMutation } from "../../features/meet/meetApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const CreateMeet = () => {
  const [selectedName, setSelectedName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [files, setFiles] = useState();
  const userId = useSelector(selectCurrentUserId);
  const navigate = useNavigate();

  //fn API
  const [createMeet] = useCreateMeetMutation();

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFiles(e.target.files);

    if (file) {
      setSelectedName(file.name);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
    }
  };

  const handleCreateMeet = async (values: any) => {
    const file = files;
    const formData = new FormData();

    // console.log(file);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    for (const item of file) {
      formData.append("image", item);
    }

    formData.append("values", JSON.stringify({ ...values, adminID: userId }));

    Loading.hourglass("Створюємо зустріч");

    try {
      const response = await createMeet({ formData });

      if ("error" in response) {
        const errorResponse = response as IErrorResponse;

        Report.failure(
          `Помилка створення зустрічі ${errorResponse.error.status.toString()}`,
          errorResponse.error.data.message,
          "OK"
        );
      } else {
        Report.success(`Успішно створено`, "", "OK");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    } finally {
      Loading.remove();
    }
  };

  return (
    <div className="meet-link-create-meet">
      <Container>
        <h1 className="title">Створити зустріч</h1>
        <Formik
          initialValues={{
            meetName: "",
            description: "",
            date: "",
            time: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            handleCreateMeet(values);
            setSubmitting(false);
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
                    maxLength="15"
                  />
                  <ErrorMessage name="meetName" component="div" />
                </label>

                <label className="form-label">
                  Короткий опис
                  <Field
                    type="textarea"
                    name="description"
                    className="form-control textarea"
                    required
                    maxLength="30"
                  />
                  <ErrorMessage name="description" component="div" />
                </label>

                <label className="form-label">
                  День проведення зустріч
                  <Field type="date" name="date" className="form-control" />
                  <Field
                    as="select"
                    type="date"
                    name="date"
                    className="form-control"
                  >
                    <option value="">
                      Оберіть день для щотижневої зустрічі
                    </option>
                    <option value="Щодня">Щодня</option>
                    <option value="Понеділок">Понеділок</option>
                    <option value="Вівторок">Вівторок</option>
                    <option value="Середа">Середа</option>
                    <option value="Четвер">Четвер</option>
                    <option value="П'ятниця">П'ятниця</option>
                    <option value="Субота">Субота</option>
                    <option value="Неділя">Неділя</option>
                  </Field>
                  <ErrorMessage name="date" component="div" />
                </label>

                <label className="form-label">
                  Час проведення зустріч
                  <Field
                    type="time"
                    name="time"
                    className="form-control"
                    required
                  />
                  <ErrorMessage name="time" component="div" />
                </label>
              </div>

              <div className="img-content">
                <div className="parent">
                  <div className="file-upload">
                    <img src={previewUrl || uploadImg} alt="upload" />
                    <h5> {selectedName || "Додайте зображення"}</h5>
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
