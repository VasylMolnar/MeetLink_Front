import "./CreateMeet.scss";
import { Container } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

const CreateMeet = () => {
  //   const handleCreate = async file => {
  //     const title = window.prompt('Введіть назву до зображення.');
  //     const formData = new FormData();

  //     for (let item of file) {
  //       formData.append('image', item);
  //     }
  //     formData.append('values', JSON.stringify({ userID, userName, title }));

  //     Loading.dots('Створення Готелю');
  //     //send data

  //     await createImage({ formData, userID })
  //       .then(response => {
  //         Loading.remove();
  //         Report.success('Фото було додано', '');
  //       })
  //       .catch(error => {
  //         Loading.remove();
  //         Report.failure(error, '');
  //       });
  //   };
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
            meetImg: "",
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
                  Дата проведення зустріч
                  <Field
                    type="date"
                    name="meetDate"
                    className="form-control"
                    required
                  />
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

                <button type="submit" className="create-btn">
                  Створити
                </button>
              </div>

              <div className="img-content">
                <label className="form-label-meetImg">
                  Додайте зображення
                  <Field
                    type="file"
                    name="meetImg"
                    className="form-meetImg"
                    required
                  />
                  <ErrorMessage name="meetImg" component="div" />
                </label>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default CreateMeet;
