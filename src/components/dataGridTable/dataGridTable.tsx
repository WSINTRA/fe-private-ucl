import { DataGrid, GridColumns,} from "@mui/x-data-grid";

const DataGridTable = (props: {rows:{}[], columns:GridColumns}) => {
    const {rows, columns} = props

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};
export default DataGridTable;
