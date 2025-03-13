import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";

import axios from "axios";

export default function Home() {
  let emptyProduct = {
    id: null,
    name: "",
    dept: "",
  };

  const [studentDetails, setStudentDetails] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [submitted, setSubmitted] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    // axios.get("/readStudentData").then((studentDetailsResp) => {
    //   setStudentDetails(studentDetailsResp.data);
    // });
    setIsLoading(true);
    fetchGridData();
  }, []);

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Student Details</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </IconField>
    </div>
  );

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const fetchGridData = () => {
    axios.get("/readStudentData").then((studentDetailsResp) => {
      setStudentDetails(studentDetailsResp.data);
      setIsLoading(false);
    });
  };

  const saveProduct = () => {
    setSubmitted(true);
    if (product.id != null) {
      if (product.name.length > 0 && product.dept.length > 0) {
        setIsLoading(true);
        axios.post("/updateStudent", product).then((response) => {
          if (response.data) {
            fetchGridData();
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Student Data Updated",
              life: 3000,
            });
            setProductDialog(false);
          }
        });
      }
    } else {
      if (product.name.length > 0 && product.dept.length > 0) {
        setIsLoading(true);
        axios.post("/createStudentData", product).then((response) => {
          if (response.data) {
            fetchGridData();
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "New Student Data Inserted",
              life: 3000,
            });
            setProductDialog(false);
          }
        });
      }
    }
  };

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
        disabled={isLoading ? true : false}
      />
      {isLoading ? (
        <ProgressSpinner
          style={{ width: "50px", height: "30px" }}
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      ) : (
        <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
      )}
    </React.Fragment>
  );

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const deleteProduct = () => {
    let _products = studentDetails.filter((val) => val.id !== product.id);

    setStudentDetails(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);

    axios
      .delete("/deleteStudentData?id=" + product.id)
      .then((deleteStudentResp) => {
        if (deleteStudentResp.data) {
          //   toast.current.show({
          //     severity: "success",
          //     summary: "Successful",
          //     detail: "Student Deleted",
          //     life: 3000,
          //   });
        }
      });
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Student Deleted",
      life: 3000,
    });
  };

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
      </div>
    );
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={studentDetails}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id"
          paginator
          rows={5}
          //   rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
          loading={isLoading}
        >
          <Column field="id" header="Id" style={{ width: "20%" }}></Column>
          <Column
            field="name"
            header="Name"
            editor={(options) => textEditor(options)}
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="dept"
            header="Department"
            editor={(options) => textEditor(options)}
            style={{ width: "20%" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Product Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <label htmlFor="name" className="font-bold">
          Name
        </label>
        <InputText
          id="name"
          value={product.name}
          onChange={(e) => onInputChange(e, "name")}
          required
          autoFocus
          className={classNames({ "p-invalid": submitted && !product.name })}
        />
        {submitted && !product.name && (
          <small className="p-error">Name is required.</small>
        )}

        <br />
        <br />
        <label htmlFor="name" className="font-bold">
          Department
        </label>
        <InputText
          id="name"
          value={product.dept}
          onChange={(e) => onInputChange(e, "dept")}
          required
          autoFocus
          className={classNames({ "p-invalid": submitted && !product.dept })}
        />
        {submitted && !product.dept && (
          <small className="p-error">Department is required.</small>
        )}
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
