import "./Attendees.scss";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { Fieldset } from "primereact/fieldset";
import { Button } from "react-bootstrap";

const Attendees = ({ attendees }: any) => {
  const exportCSV = (e: any, date: any) => {
    const tbody = e.target.parentNode.querySelector(".p-datatable-tbody");

    if (tbody !== null) {
      const rows = tbody.querySelectorAll("tr");

      if (rows.length > 0) {
        const csvData = ["Імя, Прізвище, Приєднався, Залишив"];
        rows.forEach((row: any) => {
          const rowData: any = [];
          const cells = row.querySelectorAll("td");

          cells.forEach((cell: any) => {
            if (cell.textContent !== "Профіль") {
              rowData.push(cell.textContent);
            }
          });

          csvData.push(rowData.join(","));
        });

        const csvContent = csvData.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${date}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <div className="attendees">
      {attendees.map((attendees: any) => (
        <Fieldset
          legend={attendees.date}
          toggleable
          key={attendees.date}
          className="fieldset"
        >
          <DataTable
            value={attendees.list}
            header={""}
            stripedRows
            tableStyle={{ minWidth: "50rem" }}
            emptyMessage="Нічого не знайдено :("
          >
            <Column
              field="userId"
              header="Профіль"
              body={(rowData) => (
                <Link to={`/info-user/${rowData.userId}`}>Профіль</Link>
              )}
              style={{
                borderBottom: "1px solid #f3e8ff",
                borderTop: "1px solid #f3e8ff",
              }}
            ></Column>
            <Column
              field="username"
              header="Ім'я"
              style={{
                borderBottom: "1px solid #f3e8ff",
                borderTop: "1px solid #f3e8ff",
              }}
            ></Column>
            <Column
              field="surname"
              header="Прізвище"
              style={{
                borderBottom: "1px solid #f3e8ff",
                borderTop: "1px solid #f3e8ff",
              }}
            ></Column>
            <Column
              field="joinTime"
              header="Приєднався"
              style={{
                borderBottom: "1px solid #f3e8ff",
                borderTop: "1px solid #f3e8ff",
              }}
            ></Column>
            <Column
              field="leaveTime"
              header="Залишив"
              style={{
                borderBottom: "1px solid #f3e8ff",
                borderTop: "1px solid #f3e8ff",
              }}
            ></Column>
          </DataTable>

          <Button
            className="btn btn-success"
            onClick={(e) => exportCSV(e, attendees.date)}
            style={{ marginTop: "14px" }}
          >
            Експорт
          </Button>
        </Fieldset>
      ))}
    </div>
  );
};

export default Attendees;
