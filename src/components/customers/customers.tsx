import Box from "@mui/material/Box";
import Edit from "@mui/icons-material/Edit";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import Button from "@mui/material/Button";
import Delete from "@mui/icons-material/Delete";
import { useState } from "react";
import { customer } from "../../types/dataTypes";
import GenericReactTable from "../genericReactTable/GenericReactTable";
import { CustomerForm } from "./customerForm";
import moment from "moment";

const Customers = ({ customers }: { customers: customer[] }) => {
  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [updatingCell, setUpdatingCell] = useState<any>();

  const EditButton: React.FC = (params: any) => {
    return (
      <Button
        startIcon={<Edit />}
        onClick={() => {
          setCreateMode(false);
          setEditMode(true);
          setUpdatingCell(params.row);
          params.tableForm(true);
        }}
      />
    );
  };
  const PreviewButton: React.FC = (params: any) => {
    return (
      <Button
        startIcon={<VisibilityOutlined />}
        onClick={() => {
          setEditMode(false);
          setCreateMode(false);
          setUpdatingCell(params.row);
          params.tableForm(true);
        }}
      />
    );
  };

  const DeleteButton: React.FC = (params: any) => {
    return (
      <>
        <Button
          startIcon={<Delete />}
          onClick={() => {
            console.log(params);
          }}
        />
      </>
    );
  };

  const headers = [
    {
      accessor: "actions",
      Header: "Actions",
      width: 250,
      disableFilters: true,
      disableSortBy: true,
    },
    {
      accessor: (d: any) =>
        moment(d["next_service_date"]).format("hh:mm:a DD MMMM YYYY"),
      Header: "Next Service Due",
      width: 130,
    },
    { accessor: "first_name", Header: "First Name", width: 130 },
    { accessor: "last_name", Header: "Last Name", width: 130 },
    { accessor: "contact_number", Header: "Contact", width: 130 },
    { accessor: "address", Header: "Address", width: 130 },
  ];

  const tableActions = [
    {
      edit: EditButton,
      preview: PreviewButton,
      delete: DeleteButton,
    },
  ];

  const headerOptions = ["columns", "create"];

  return (
    <Box sx={{ margin: "auto" }}>
      <GenericReactTable
        title="Customers"
        data={customers || []}
        headers={headers}
        headerOptions={headerOptions}
        tableActions={tableActions}
        sortBy={true}
        setUpdatingCell={setUpdatingCell}
        setCreateMode={setCreateMode}
      >
        {updatingCell && (
          <CustomerForm
            editM={editMode}
            createM={createMode}
            customer={updatingCell.original}
            tableCell={updatingCell}
          />
        )}
      </GenericReactTable>
    </Box>
  );
};
export default Customers;
