/**
 * Generic React Table - By WSINTRA
 *
 *  In order to use this component as intended there are some caveats
 *  for any collection of data [{id:1, name:'joe bloggs'},{id:2, name:'steve o'}]
 *  The headers must contain an accessor that matches the data property and a Header title
 *  eg..
 *  const headers = [{ accessor: "id", Header: "ID" },{ accessor: "name", Header: "Name" }]
 *  If you need to do any additional processing on a cell value you can use the following method
 *  const headers = [{ accessor: (d: any) => doSomething(d["name"]), Header: "Name" }]
 *  This will run the doSomething function on each cell under the Name column
 *
 *  If you pass in an edit action that uses a form, make sure the form is passed as a child of the GenericReactTable
 *  and that the parent component creates a useState hook for the updating cell, also pass in the setUpdatingCell hook if using headerActions
 *  eg..
 *  const [updatingCell, setUpdatingCell] = useState<any>() //This should be in the parent of GenericReactTable
 *  You can then pass a tableActions object like so..
 *  eg..
 *  const EditToolbar: React.FC = (params: any) => {
 *       return (
 *           <Button startIcon={<Edit />} onClick={(e) => { setUpdatingCell(params.row); params.tableForm(true) }}></Button>
 *       )
 *   }
 *   const tableActions = [{ 'edit': EditToolbar }]
 *
 *  The params for the EditToolbar come from line 185 action.edit({ ...cell, tableForm: setTableForm })
 *
 *  hiddenCols is a collection of strings that match the accessor except when additional processing is needed, in that case pass the Header value in.
 *
 *  headerOptions is a string array that can show different header Actions such as create, hide ...
 *
 *  For pagination, pass a pageSize/setPageSize and pageNumber/setPageNumber and a refetch function from GraphQL as fetchdata
 *
 *  For search/filter, pass a search and setSearch from the parent and use the parents data fetching to update the table
 */

import React, {
  useMemo,
  useState,
  useEffect,
  ReactElement,
  JSXElementConstructor,
  Fragment,
} from "react";
import {
  Column,
  useTable,
  useResizeColumns,
  useBlockLayout,
  usePagination,
  useSortBy,
  useFilters,
  TableState,
  SortingRule,
} from "react-table";
import { GridSeparatorIcon } from "@mui/x-data-grid/components/icons";
import Add from "@mui/icons-material/Add";
import ArrowBack from "@mui/icons-material/ArrowBack";
import FirstPage from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPage from "@mui/icons-material/LastPage";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ViewColumn from "@mui/icons-material/ViewColumn";
import { TablePaginationActionsProps } from "@mui/material/TablePagination/TablePaginationActions";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

interface GRTprops {
  data: Record<string, unknown>[];
  headers: readonly Column<Record<string, unknown>>[];
  hiddenCols?: string[] | any;
  tableActions?: Record<string, any>[];
  title?: string;
  searchTitle?: string;
  headerOptions?: string[];
  setUpdatingCell?: React.Dispatch<any>;
  pageSize?: number;
  setPageSize?: React.Dispatch<number>;
  pageNumber?: number;
  totalCount?: number;
  setPageNumber?: React.Dispatch<number>;
  sortBy?: boolean;
  manualSort?: boolean;
  sortingFunc?: (options: any) => void;
  initialSort?: SortingRule<Record<string, unknown>>[];
  searchTerm?: string;
  setSearchTerm?: React.Dispatch<string>;
  fetchData?: (
    variables?: Partial<Record<string, any>> | undefined
  ) => Promise<any>;
  children?: React.ReactNode;
  topPageination?: boolean;
  setCreateMode?: React.Dispatch<boolean>;
}

const GenericReactTable: React.FC<GRTprops> = (props) => {
  const {
    data,
    headers,
    hiddenCols,
    tableActions,
    title,
    searchTitle = "Search",
    setUpdatingCell,
    headerOptions,
    pageNumber = 1,
    setPageNumber,
    pageSize = 1000,
    totalCount,
    setPageSize,
    fetchData,
    sortBy,
    searchTerm,
    initialSort = [],
    setSearchTerm,
    sortingFunc,
    manualSort,
    topPageination = false,
    setCreateMode,
  } = props;
  //Anchor for Column Menu
  const [anchorCM, setAnchorCM] = useState<null | HTMLElement>(null);
  const [tableForm, setTableForm] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [searchString, setSearchString] = useState(searchTerm || "");
  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (
    rowIndex: string | number,
    columnId: any,
    value: any,
    createRow?: boolean
  ) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    if (createRow) {
      setTableData((old: any[]) => {
        return [value, ...old];
      });
    } else
      setTableData((old: any[]) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: value,
            };
          }
          return row;
        })
      );
  };

  const deleteRow = (columnId: any) => {
    setSkipPageReset(true);
    const updateData = tableData.filter((item) => item.id !== columnId);
    setTableData(updateData);
  };

  // TODO - Update this with MUI components library search input
  function DefaultColumnFilter() {
    return <></>;
  }

  const defaultColumn = useMemo(
    () => ({
      minWidth: 170,
      width: 200,
      maxWidth: 800,
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const columns: readonly Column<Record<string, unknown>>[] = useMemo(
    () => headers,
    [headers]
  );

  const tableOptions = {
    pageCount: -1,
    useControlledState: (state: TableState<Record<string, unknown>>) => {
      return React.useMemo(
        () => ({
          ...state,
          pageIndex: pageNumber,
          pageSize,
        }),
        [state]
      );
    },
    initialState: {
      hiddenColumns: hiddenCols || [],
      sortBy: initialSort,
    },
    manualPagination: true,
    manualSortBy: manualSort ? manualSort : false,
    disableMultiSort: true,
    columns,
    data: tableData,
    defaultColumn,
    autoResetPage: !skipPageReset,
    updateMyData,
  };
  const tableInstance = useTable(
    tableOptions,
    useResizeColumns,
    useBlockLayout,
    useFilters,
    useSortBy,
    usePagination
  );

  const {
    headerGroups,
    allColumns,
    getTableProps,
    page,
    prepareRow,
    setHiddenColumns,
    toggleSortBy,
  } = tableInstance;

  const columnMenuOpen = Boolean(anchorCM);
  // Handlers for Menu open and close
  const handleShowColMenu = (event: any) => {
    setAnchorCM(event.currentTarget);
  };
  const closeColMenu = () => {
    setAnchorCM(null);
  };

  const headerActions = [
    { component: <ViewColumn />, name: "columns", onClick: handleShowColMenu },
    {
      component: <Add />,
      name: "create",
      onClick: () => {
        if (setUpdatingCell && setCreateMode) {
          setUpdatingCell(true);
          setCreateMode(true);
        }
        setTableForm(true);
      },
    },
  ];
  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  useEffect(() => {
    setSkipPageReset(false);
  }, [tableData]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (fetchData) {
      fetchData({ pageSize, pageNumber });
    }
  }, [fetchData, pageSize, pageNumber]);

  useEffect(() => {
    if (hiddenCols) {
      setHiddenColumns(hiddenCols);
    }
  }, [tableData, tableForm, hiddenCols, setHiddenColumns]);

  function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
        </IconButton>
      </Box>
    );
  }

  const handleChangePage = (_e: any, newPage: number) => {
    //Add the 1 because page is zero indexed and backend API page index starts from 1
    if (setPageNumber) {
      setPageNumber(newPage + 1);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (setPageSize) {
      setPageSize(parseInt(event.target.value, 10));
    }

    if (setPageNumber) {
      setPageNumber(1);
    }
  };

  const handleSearch = () => {
    if (setSearchTerm) {
      setSearchTerm(searchString);
    }
  };

  return (
    <>
      {!tableForm ? (
        <TableContainer
          sx={{ height: "85vh", border: "1px solid rgb(233,233,233)" }}
          data-id="table"
        >
          <Table {...getTableProps()}>
            <TableHead>
              <Box
                component={"tr"}
                sx={{
                  height: "60px",
                  paddingLeft: 2,
                  paddingRight: 2,
                  display: "inline-flex",
                  flexDirection: "row",
                }}
              >
                <Typography
                  component={"th"}
                  sx={{
                    paddingRight: "24",
                    marginRight: "2rem",
                    alignSelf: "center",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {title}
                </Typography>
                {headerActions.map((action, i) => {
                  if (headerOptions && headerOptions.includes(action.name)) {
                    return (
                      <Box
                        component={"th"}
                        sx={{
                          display: "flex",
                          cursor: "pointer",
                          alignItems: "center",
                          marginRight: "1rem",
                        }}
                        key={i}
                        onClick={action.onClick}
                      >
                        {action.component}
                        <Typography
                          component={"p"}
                          sx={{
                            opacity: 0.6,
                            textTransform: "uppercase",
                            alignSelf: "center",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            marginLeft: "0.5rem",
                          }}
                        >
                          {action.name}
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                })}
                <Menu
                  anchorEl={anchorCM}
                  open={columnMenuOpen}
                  onClose={closeColMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  {allColumns.map((column) => (
                    <MenuItem key={column.id}>
                      <FormGroup sx={{ width: "100%" }}>
                        <FormControlLabel
                          control={
                            <Switch {...column.getToggleHiddenProps()} />
                          }
                          label={column.Header as string}
                        />
                      </FormGroup>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              {setSearchTerm && (
                <Box
                  component="tr"
                  sx={{ display: "flex", alignItems: "center", paddingLeft: 2 }}
                >
                  <Box component="td">
                    <TextField
                      id="search-input"
                      label={searchTitle}
                      variant="outlined"
                      value={searchString}
                      onChange={(e) => setSearchString(e.target.value)}
                      onKeyDown={(e) => e.code === "Enter" && handleSearch()}
                      sx={{ width: "30vw" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchOutlined
                              onClick={handleSearch}
                              sx={{ cursor: "pointer" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              )}
              {topPageination && (
                <TableRow>
                  {setPageSize && setPageNumber && (
                    <TablePagination
                      //If no total count then -1 will count all items
                      count={totalCount || -1}
                      // pageNumber minus one because page is zero indexed and our backend page numbers start at 1
                      page={pageNumber - 1}
                      rowsPerPage={pageSize}
                      rowsPerPageOptions={[5, 10, 20, 50, 100]}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      onPageChange={handleChangePage}
                      ActionsComponent={TablePaginationActions}
                    />
                  )}
                </TableRow>
              )}
              {headerGroups.map((headerGroup) => (
                // eslint-disable-next-line react/jsx-key
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    // eslint-disable-next-line react/jsx-key
                    <TableCell
                      {...column.getHeaderProps([
                        {
                          style: {
                            display: "flex",
                            paddingLeft: "14px",
                            paddingRight: "14px",
                            paddingTop: "8px",
                            paddingBottom: "8px",
                          },
                        },
                      ])}
                      sx={{
                        height: "60px",
                        border: "solid rgba(233,233,233,0.1)",
                      }}
                    >
                      {sortBy ? (
                        <>
                          {manualSort ? (
                            <>
                              {!column.disableSortBy ? (
                                <Typography
                                  variant="h6"
                                  sx={{ overflow: "hidden" }}
                                  {...column.getHeaderProps(
                                    column.getSortByToggleProps()
                                  )}
                                  onClick={() => {
                                    if (sortingFunc) {
                                      sortingFunc({
                                        column: column.id,
                                        //@ts-ignore
                                        desc_sort: column.isSortedDesc,
                                      });
                                    }
                                    toggleSortBy(
                                      column.id,
                                      column.isSortedDesc
                                    );
                                  }}
                                >
                                  {column.render("Header")}
                                  {column.Header !== "Actions" && (
                                    <TableSortLabel
                                      active={column.isSorted}
                                      direction={
                                        //@ts-ignore
                                        column.sortDirection === "ASC"
                                          ? "asc"
                                          : "desc"
                                      }
                                    />
                                  )}
                                </Typography>
                              ) : (
                                <Typography
                                  variant="h6"
                                  sx={{ overflow: "hidden" }}
                                  {...column.getHeaderProps(
                                    column.getSortByToggleProps()
                                  )}
                                >
                                  {column.render("Header")}
                                </Typography>
                              )}
                            </>
                          ) : (
                            <Typography
                              variant="h6"
                              sx={{ overflow: "hidden" }}
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              {column.render("Header")}
                              {column.Header !== "Actions" && (
                                <TableSortLabel
                                  active={column.isSorted}
                                  direction={
                                    column.isSortedDesc ? "desc" : "asc"
                                  }
                                />
                              )}
                            </Typography>
                          )}

                          {column.canFilter ? column.render("Filter") : null}
                        </>
                      ) : (
                        <Typography
                          {...column.getHeaderProps()}
                          sx={{ overflow: "hidden" }}
                          variant="h6"
                        >
                          {column.render("Header")}
                          {column.canFilter ? column.render("Filter") : null}
                        </Typography>
                      )}
                      <Box>
                        <GridSeparatorIcon
                          color="disabled"
                          sx={{
                            marginRight: "-28px",
                            "&:hover": {
                              background: "rgba(233,233,233,0.4)",
                              opacity: 0.4,
                            },
                          }}
                          {...column.getResizerProps()}
                        />
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <Fragment key={i}>
                    <TableRow
                      {...row.getRowProps()}
                      sx={{
                        border: "1px solid rgba(233,233,233,0.4)",
                        overflow: "hidden",
                        "&:hover": {
                          backgroundColor: "rgba(233,233,233,0.5)",
                        },
                      }}
                    >
                      {row.cells.map((cell, i) => {
                        return (
                          <Fragment key={i}>
                            <TableCell
                              sx={{ alignSelf: "center", border: "none" }}
                              {...cell.getCellProps()}
                            >
                              {
                                // eslint-disable-next-line array-callback-return
                                cell.column.Header !== "Actions"
                                  ? cell.render("Cell")
                                  : tableActions &&
                                    tableActions.map((action, i) => {
                                      return (
                                        <Fragment key={i}>
                                          {/* {Update here for more specific uses of actions, this order also affects UI} */}
                                          {action["preview"] &&
                                            action["preview"]({
                                              ...cell,
                                              tableForm: setTableForm,
                                            })}
                                          {action["edit"] &&
                                            action["edit"]({
                                              ...cell,
                                              tableForm: setTableForm,
                                            })}
                                          {action["create"] &&
                                            action["create"]({
                                              ...cell,
                                              tableForm: setTableForm,
                                            })}
                                          {action["delete"] &&
                                            action["delete"]({
                                              ...cell,
                                              deleteRow,
                                            })}
                                        </Fragment>
                                      );
                                    })
                              }
                            </TableCell>
                          </Fragment>
                        );
                      })}
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
            <TableFooter
              sx={{
                position: "absolute",
                bottom: "6vh",
                zIndex: 1,
                right: 0,
                width: "100%",
              }}
            >
              <TableRow>
                {!topPageination && setPageSize && setPageNumber && (
                  <TablePagination
                    sx={{ position: "absolute", right: "0" }}
                    //If no total count then -1 will count all items
                    count={totalCount || -1}
                    // pageNumber minus one because page is zero indexed and our backend page numbers start at 1
                    page={pageNumber - 1}
                    rowsPerPage={pageSize}
                    rowsPerPageOptions={[5, 10, 20, 50, 100]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                  />
                )}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        <>
          <Box sx={{ display: "flex", width: "80vw" }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => {
                setTableForm(false);
                // If the tableActions array has an action of reset form, make sure we set this when going back
                if (
                  tableActions &&
                  tableActions[0] &&
                  tableActions[0].reset_form
                ) {
                  tableActions[0]["reset_form"](false);
                }
              }}
            >
              Back
            </Button>
          </Box>
          {React.cloneElement(
            props.children as ReactElement<
              any,
              string | JSXElementConstructor<any>
            >,
            { updateCell: updateMyData }
          )}
        </>
      )}
    </>
  );
};

export default GenericReactTable;
