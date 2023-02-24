import React, { useRef, useState } from "react";
import "./Table.css";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Loading from "../Loader/Loading";

const Table = ({
  columns,
  rows,
  detailedData,
  onEdit,
  deleteFunc,
  loading,
  deleteWarning = "Confirm Delete?",
  bulkActions = (
    <button className="bulk-action-button">
      <DeleteIcon />
    </button>
  ),
}) => {
  const [selected, setSelected] = useState(0);
  const [showWarning, setShowWarning] = useState(null);
  const selectedItems = useRef([]);

  let keys = [];

  if (rows[0]) {
    keys = Object.keys(rows[0]);
  }

  const selectOrUnselectAll = () => {
    let parent = document.getElementById("parent-ck");

    if (parent.checked) {
      let all = document.getElementsByName("ck");
      all.forEach((checkbox) => {
        checkbox.checked = true;
      });

      setSelected(all.length);
      rows.forEach((row) => {
        selectedItems.current.push(row.id);
      });
    } else {
      let all = document.getElementsByName("ck");
      all.forEach((checkbox) => {
        checkbox.checked = false;
      });

      setSelected(0);
      selectedItems.current = [];
    }
  };

  const selectUnselect = (id) => () => {
    let item = document.getElementById(id);

    if (selectedItems.current.length > 0) {
      let index = selectedItems.current.indexOf(id);
      if (index !== -1) {
        if (!item.checked) {
          selectedItems.current.splice(index, 1);
        }
      }

      if (index === -1) {
        if (item.checked) {
          selectedItems.current.push(id);
        }
      }
    } else {
      if (item.checked) {
        selectedItems.current.push(id);
      }
      if (!item.checked) {
        let index = selectedItems.current.indexOf(id);
        selectedItems.current.splice(index, 1);
      }
    }

    setSelected(selectedItems.current.length);
  };

  const handleDltClick = (id) => (e) => {
    e.preventDefault();
    if (showWarning !== id) {
      setShowWarning(id);
    } else {
      setShowWarning(null);
    }
  };

  return (
    <div className="table-container">
      {loading ? (
        <Loading />
      ) : (
        <>
          {selected > 0 ? (
            <div className="table-footer">
              <p>Selected: {selected} </p>
              <div>
                {bulkActions}
                {/* <button>
                  <EditIcon />
                </button> */}
              </div>
            </div>
          ) : null}

          <div className="table-overflow">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "5%", textAlign: "center" }}>
                    <input
                      type={"checkbox"}
                      onClick={selectOrUnselectAll}
                      id={"parent-ck"}
                    />
                  </th>
                  {columns.map((value, index) => (
                    <th key={index}>{value}</th>
                  ))}
                  <th>{""}</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((row, index) => (
                    <>
                      <tr key={index}>
                        <td style={{ textAlign: "center" }}>
                          <input
                            type={"checkbox"}
                            name={"ck"}
                            onClick={selectUnselect(row.id)}
                            id={row.id}
                          />
                        </td>
                        {keys.map((item, index) => (
                          <td key={index}>{row[item]}</td>
                        ))}
                        <td style={{ width: "5%" }}>
                          <div>
                            <Link
                              to={`/admin/${onEdit}/details/${row.id}`}
                              state={detailedData.filter(
                                (d) => d._id === row.id
                              )}
                            >
                              <EditIcon sx={{ fontSize: 17 }} />
                            </Link>
                            <button onClick={handleDltClick(row.id)}>
                              <DeleteIcon sx={{ fontSize: 17 }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {showWarning === row.id ? (
                        <tr className="hidden-row" key={index + "warning"}>
                          <td colSpan={1 + 1 + keys.length}>
                            <div className="hidden-row-content">
                              <span>
                                {deleteWarning} {row.name || row.id}
                              </span>
                              <button onClick={deleteFunc(row.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </>
                  ))
                ) : (

                  // Empty table component in case if there are no rows
                  <tr>
                    <td colSpan={1 + 1 + columns.length}>
                      <div className="table-empty-container">
                        <div>
                          <p>No products. Add one now</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
