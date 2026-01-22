import {
  Button,
  Card,
  Grid,
  MenuItem,
  Modal,
  Typography,
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  makeStyles,
  Backdrop,
  CircularProgress,
  IconButton,
  InputAdornment,
  Collapse,
  Radio,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Delete, Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { saveQuoteApi } from "../../../services/api/quote.api";
import {
  masterDataCategory,
  masterDataSwr,
} from "../../../services/swr/master-data.swr";
import { masterUserSwr } from "../../../services/swr/user.swr";
import { getListCustomerSwr } from "../../../services/swr/customer.swr";
import { getListProductSwr } from "../../../services/swr/product.swr";
import { getListContainerStockSwr } from "../../../services/swr/container-stock.swr";
import { currency } from "../../../helpers/general";
import Moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 250,
    height: 300,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  company: {
    margin: "auto",
    border: "1px solid black",
    padding: 10,
  },
  choiceUnselect: {
    margin: "auto",
    border: "1px solid black",
    padding: 10,
    opacity: 0.4,
  },
  choiceSelect: {
    margin: "auto",
    border: "1px solid black",
    padding: 10,
    opacity: 1,
  },
}));

export default function QuoteForm(props) {
  const classes = useStyles();

  const [sizeList, setSizeList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [conditionList, setConditionList] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [input2List, setInput2List] = useState([{container_size_id:null,container_type_id:null,condition_id:null,qty:null,price:null,remark:null}]);
  const [inputList, setInputList] = useState([{product_id:null,qty:null,unit:null,price:null,remark:null }]);
  const [productList, setProductList] = useState([]);
  const [priceList, setPriceList] = useState([{ price: null }]);
  const [optionProduct, setOptionProduct] = useState([]);
  const [selectedList, setSelectedList] = useState([{selectedProduct:null}]);
  const [salesList, setSalesList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [customerDetail, setCustomerDetail] = useState({name:null,address:null,company:null,phone:null,email:null});
  const [openDetail, setOpenDetail] = useState(false);
  const [input3List, setInput3List] = useState([{stock_id:null,serial_number:null,price:null,remark:null}]);
  const [optionStock, setOptionStock] = useState([]);
  const [selected2List, setSelected2List] = useState([{ selectedStock: null }]);
  const [choiceContainer, setChoiceContainer] = useState(0);
  const [choiceClass, setChoiceClass] = useState([classes.choiceUnselect,classes.choiceUnselect]);

  const [errorText, setErrorText] = useState({name:null,customer_id:null,remark:null,containers:null,container_stocks:null,products:null});
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({id:null,name:null,sales_id:null,customer_id:null,remark:null,containers:[],container_stocks:[],status:null,products:[]});
  const [quoteDate, setQuoteDate] = useState(null);
  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  const onInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
    if (event.target.name == "customer_id") {
      if (event.target.value != null) {
        for (var i = 0; i < customerList.length; i++) {
          if (customerList[i].id == event.target.value) {
            setCustomerDetail({name:customerList[i].name, address:customerList[i].address, company:customerList[i].company_type + " " + customerList[i].company, phone:customerList[i].phone_number, email:customerList[i].email});
            setOpenDetail(true);
          }
        }
      } else {
        setCustomerDetail({name:null,address:null,company:null,phone:null,email:null});
        setOpenDetail(false);
      }
    }
  };

  const onContainerChange = (event, i) => {
    var list = [...input2List];
    if (event.target.name == "qty") {
      list[i][event.target.name] = parseInt(event.target.value);
    } else if (event.target.name == "price") {
      list[i][event.target.name] = parseFloat(event.target.value);
    } else {
      list[i][event.target.name] = event.target.value;
    }
    setInput2List(list);
    setData({ ...data, containers: list });
  };

  const clickAddRow2 = () => {
    setInput2List([...input2List, {container_size_id:null, container_type_id:null, condition_id:null, qty:null, price:null, remark:null}]);
  };

  const clickRemoveRow2 = (i) => {
    var list = [...input2List];
    list.splice(i, 1);
    setInput2List(list);
    setData({ ...data, containers:list});
  };

  const onProductChange = (event, value, i, extra) => {
    var list = [...inputList];
    var selected = [...selectedList];
    var price = [...priceList];
    if (value != null) {
      list[i]["product_id"] = value.id;
    } else {
      list[i][event.target.name] = event.target.name == "qty" ? parseInt(event.target.value) : event.target.value;
    }
    if (extra) {
      if (event.target.value == null || value == null) {
        list[i]["unit"] = null;
        list[i]["price"] = null;
        selected[i]["selectedProduct"] = null;
      } else {
        for (var j = 0; j < productList.length; j++) {
          if (
            productList[j].id == event.target.value ||
            productList[j].id == value.id
          ) {
            //list[i]["unit"] = productList[j].unit
            list[i]["price"] = productList[j].price;
            price[i]["price"] = productList[j].price;
            var pos = j + 1;
            selected[i]["selectedProduct"] = optionProduct[pos];
          }
        }
      }
    }
    setInputList(list);
    setPriceList(price);
    setSelectedList(selected);
    setData({ ...data, products: list });
  };

  const clickAddRow = () => {
    setInputList([...inputList, {product_id:null, qty:null, unit:null, price:null, remark:null}]);
    setPriceList([...priceList, {price:null}]);
    setSelectedList([...selectedList, {selectedProduct:null}]);
  };

  const clickRemoveRow = (i) => {
    var list = [...inputList];
    list.splice(i, 1);
    setInputList(list);
    var price = [...priceList];
    price.splice(i, 1);
    setPriceList(price);
    var selected = [...selectedList];
    selected.splice(i, 1);
    setSelectedList(selected);
    setData({ ...data, products:list});
  };

  const onStockChange = (event, i, value) => {
    var list = [...input3List];
    var selected = [...selected2List];
    if (value != null) {
      list[i]["stock_id"] = value.id;
      var found = false;
      for (var j = 0; j < stockList.length; j++) {
        if (
          stockList[j].id == event.target.value ||
          stockList[j].id == value.id
        ) {
          list[i]["price"] = stockList[j].selling_price;
          list[i]["serial_number"] = stockList[j].serial_number;
          var pos = j + 1;
          selected[i]["selectedStock"] = optionStock[pos];
          found = true;
        }
      }
      if (!found) {
        list[i]["price"] = null;
        list[i]["serial_number"] = null;
        selected[i]["selectedStock"] = null;
      }
    } else {
      list[i][event.target.name] = event.target.value;
    }
    setInput3List(list);
    setSelected2List(selected);
    setData({ ...data, container_stocks:list});
  };

  const clickAddRow3 = () => {
    setInput3List([...input3List, {stock_id:null, serial_number:null, price:null, remark:null }]);
    setSelected2List([...selected2List, {selectedStock:null}]);
  };

  const clickRemoveRow3 = (i) => {
    var list = [...input3List];
    list.splice(i, 1);
    setInput3List(list);
    var selected = [...selected2List];
    selected.splice(i, 1);
    setSelected2List(selected);
    setData({ ...data, container_stocks:list});
  };

  const handleChoice = (event) => {
    setChoiceContainer(event.target.value);
    if (event.target.value == 1) {
      // setInput2List([])
      // setInput3List([{stock_id:null,serial_number:null,price:null,remark:null}])
      // setData({ ...data, containers: []})
      setChoiceClass([classes.choiceSelect, classes.choiceUnselect]);
    } else if (event.target.value == 2) {
      // setInput2List([{container_size_id:null,qty:null,price:null,remark:null}])
      // setInput3List([])
      // setData({ ...data, container_stocks: []})
      setChoiceClass([classes.choiceUnselect, classes.choiceSelect]);
    }
  };

  var masterSwr = masterDataSwr();
  var userSwr = masterUserSwr({limit:999});
  var customerSwr = getListCustomerSwr({limit:999});

  var listContainerStockSwr = getListContainerStockSwr({limit: 999,status:1005});

  useEffect(() => {
    if (masterSwr?.data) {
      setSizeList(masterSwr?.data?.filter((val) => val?.category == "container_size") ?? []);
      setTypeList(masterSwr?.data?.filter((val) => val?.category == "container_type") ?? []);
      setConditionList(masterSwr?.data?.filter((val) => val?.category == "condition") ?? []);
    }
  }, [masterSwr?.data]);

  useEffect(() => {
    if (userSwr?.data?.result) {
      setSalesList(userSwr?.data?.result ?? []);
    }
  }, [userSwr]);

  useEffect(() => {
    if (customerSwr?.data?.result) {
      setCustomerList(customerSwr?.data?.result ?? []);
    }
  }, [customerSwr]);

  useEffect(() => {
    if (listContainerStockSwr?.data?.result.length > 0) {
      setStockList(listContainerStockSwr?.data?.result);
    }
  }, [listContainerStockSwr]);

  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    stockList.map((item, i) => {
      list.push({id:item.id, label:item.type.name + " " + item.size.name + " ft (" + item.serial_number + ") "});
    });
    setOptionStock(list);
  }, [stockList]);

  let param = {limit:999};
  var productSwr = getListProductSwr(param);

  useEffect(() => {
    if (productSwr?.data) {
      setProductList(productSwr?.data.result ?? []);
    }
  }, [productSwr]);

  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    productList.map((item, i) => {
      list.push({id:item.id, label:item.code + " - " + item.name});
    });
    setOptionProduct(list);
  }, [productList]);

  useEffect(() => {
    if (props.quote != null) {
      setData({id:props.quote.id, name:props.quote.name, sales_id:props.quote.sales_id, customer_id:props.quote.customer_id, remark:props.quote.remark, containers:props.quote.containers, container_stocks:props.quote.container_stocks, status:props.quote.status, products:props.quote.products});
      setInputList(props.quote.products);
      setInput2List(props.quote.containers);
      setInput3List(props.quote.container_stocks);
      setQuoteDate(Moment(props.quote.quote_date).format("LL"));
      if (props.quote.customer_id != null) {
        for (var i = 0; i < customerList.length; i++) {
          if (customerList[i].id == props.quote.customer_id) {
            setCustomerDetail({
              name: customerList[i].name,
              address: customerList[i].address,
              company:
                customerList[i].company_type + " " + customerList[i].company,
              phone: customerList[i].phone_number,
              email: customerList[i].email,
            });
            setOpenDetail(true);
          }
        }
      } else {
        setOpenDetail(false);
      }
      var selected = [];
      var price = [];
      if (props.quote.products != null) {
        for (var i = 0; i < props.quote.products.length; i++) {
          for (var j = 0; j < productList.length; j++) {
            if (productList[j].id == props.quote.products[i].product_id) {
              var pos = j + 1;
              selected.push({ selectedProduct: optionProduct[pos] });
            }
          }
          price.push({ price: props.quote.products[i].price });
        }
      }
      setSelectedList(selected);
      setPriceList(price);
      if (props.quote.container_stocks != null) {
        var selected2 = [];
        for (var i = 0; i < props.quote.container_stocks.length; i++) {
          for (var j = 0; j < stockList.length; j++) {
            if (stockList[j].id == props.quote.container_stocks[i].stock_id) {
              var pos = j + 1;
              selected2.push({ selectedStock: optionStock[pos] });
            }
          }
        }
        setSelected2List(selected2);
        setInput2List([{container_size_id:null,qty:null,price:null,remark:null}]);
        setChoiceContainer(1);
        setChoiceClass([classes.choiceSelect, classes.choiceUnselect]);
      } else {
        setSelected2List([{selectedStock:null}]);
        setInput3List([{stock_id:null,serial_number:null,price:null,remark:null}]);
        setChoiceContainer(2);
        setChoiceClass([classes.choiceUnselect, classes.choiceSelect]);
      }
      setTitle({formTitle:"Edit Quotation",buttonTitle:"Save"});
    } else {
      setData({id:null,name:null,sales_id:null,customer_id:null,remark:null,containers:[],container_stocks:[],status:null,products:[]});
      // setInputList([{product_id:null,qty:null,unit:null,price:null,remark:null}])
      setInputList([]);
      setInput2List([{container_size_id:null,qty:null,price:null,remark:null}]);
      setInput3List([{stock_id:null,serial_number:null,price:null,remark:null}]);
      setPriceList([{price:null}]);
      setQuoteDate(Moment().format("LL"));
      setOpenDetail(false);
      setChoiceContainer(0);
      setChoiceClass([classes.choiceUnselect, classes.choiceUnselect]);
      setTitle({formTitle:"Add Quotation",buttonTitle:"Create"});
    }
  }, [props.open]);

  function checkValidation() {
    var isValid = true;
    var eName = "", eSales = "", eCustomer = "", eContainers = "", eStocks = "", eProducts = "";
    if (data.name == "" || data.name == null) {
      isValid = false;
      eName = "Name can not be empty";
    }
    if (data.sales_id == "" || data.sales_id == null) {
      isValid = false;
      eSales = "Sales can not be empty";
    }
    if (data.customer_id == "" || data.customer_id == null) {
      isValid = false;
      eCustomer = "Customer can not be empty";
    }
    if (data.containers.length == 0 && data.container_stocks.length == 0) {
      isValid = false;
      eContainers = "Containers can not be empty";
      eStocks = "Containers can not be empty";
    }
    // if(data.products.length == 0) {
    //     isValid = false
    //     eProducts = "Product can not be empty"
    // }
    setErrorText({...errorText, name:eName, sales_id:eSales, customer_id:eCustomer, containers:eContainers, container_stocks:eStocks, products:eProducts});
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);
      var paket = { ...data };
      if (choiceContainer == 1) {
        setInput2List([]);
        setData({ ...data, containers: [] });
        paket.containers = [];
      } else if (choiceContainer == 2) {
        setInput3List([]);
        setData({ ...data, container_stocks: [] });
        paket.container_stocks = [];
      }
      saveQuoteApi(paket)
        .then((res) => {
          setData({id:null, name:null, sales_id:null, customer_id:null, remark:null, containers:[], container_stocks:[], status:null, products:[]});
          setLoading(false);
          props?.closeModal();
        })
        .catch((err) => {
          console.log(err);
          //setErrorText(err)
          setLoading(false);
        });
    }
  };

  const closeForm = () => {
    setData({id:null, name:null, sales_id:null, customer_id:null, remark:null, containers:[], container_stocks:[], status:null, products:[]});
    props?.closeModal();
  };

    return ( <Modal
        open={props?.open}
        onClose={closeForm}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Box className="modal-wrapper" style={{width: "1200px"}}>
            <Card className="modal">
                <Box className="modal-header">
                    <h3>{title.formTitle}</h3>
                </Box>
                <Box className="modal-content">
                    <h2 className="mb-3">Details</h2>
                    <Box className="mb-3">
                        <TextField 
                            name="name" 
                            label="Project Name" 
                            variant="outlined" 
                            defaultValue={data.name} 
                            required 
                            error={errorText.name? true : false} 
                            helperText={errorText.name} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="wo_date" 
                            label="Quote Date"
                            variant="outlined" 
                            defaultValue={quoteDate} 
                            disabled={true}
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="sales_id" 
                            select
                            label="Sales"
                            variant="outlined" 
                            value={data.sales_id} 
                            required 
                            error={errorText.sales_id? true : false} 
                            helperText={errorText.sales_id} 
                            onChange={onInputChange} 
                            fullWidth 
                        >
                            <MenuItem value={null}><em>None</em></MenuItem>
                            {salesList?.map((row, key) => {
                                return <MenuItem value={row.id}>{row?.name}</MenuItem>
                            })}
                        </TextField>
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="customer_id" 
                            select
                            label="Customer"
                            variant="outlined" 
                            value={data.customer_id} 
                            required 
                            error={errorText.customer_id? true : false} 
                            helperText={errorText.customer_id} 
                            onChange={onInputChange} 
                            fullWidth 
                        >
                            <MenuItem value={null}><em>None</em></MenuItem>
                            {customerList?.map((row, key) => {
                                return <MenuItem value={row.id}>{row?.company_type} {row?.company} ({row?.name})</MenuItem>
                            })}
                        </TextField>
                    </Box>
                    <Box className="mb-3">
                        <Collapse in={openDetail} timeout="auto" unmountOnExit>
                            <Grid container spacing={2} justify="center" alignItems="center" className={classes.company}>
                                <Grid item xs={2} sm={2}><Typography variant="h5">Company Name</Typography></Grid>
                                <Grid item xs={4} sm={4}>{customerDetail.company}</Grid>
                                <Grid item xs={2} sm={2}><Typography variant="h5">Contact Person</Typography></Grid>
                                <Grid item xs={4} sm={4}>{customerDetail.name}</Grid>
                                <Grid item xs={2} sm={2}><Typography variant="h5">Phone</Typography></Grid>
                                <Grid item xs={4} sm={4}>{customerDetail.phone}</Grid>
                                <Grid item xs={2} sm={2}><Typography variant="h5">Email</Typography></Grid>
                                <Grid item xs={4} sm={4}>{customerDetail.email}</Grid>
                                <Grid item xs={2} sm={2}><Typography variant="h5">Address</Typography></Grid>
                                <Grid item xs={10} sm={10}>{customerDetail.address}</Grid>
                            </Grid>
                        </Collapse>
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="remark" 
                            label="Remark" 
                            variant="outlined" 
                            defaultValue={data.remark} 
                            error={errorText.remark? true : false} 
                            helperText={errorText.remark} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <h2 className="mb-3 mt-5">Container</h2>
                    <Box className="mb-3">
                        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                            <Grid item xs={6} sm={6}>
                                <Grid item xs={12} sm={12} className={choiceClass[0]}>
                                    <Grid container>
                                        <Grid item xs={2} sm={2}>
                                            <Radio
                                                checked={choiceContainer == 1}
                                                onChange={handleChoice}
                                                value={1}
                                                name="choice_container"
                                            />
                                        </Grid>
                                        <Grid item xs={10} sm={10}>
                                            <Typography variant="h2">From stock</Typography>
                                            <Typography variant="body1">Choose container from stock</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Grid item xs={12} sm={12} className={choiceClass[1]}>
                                    <Grid container>
                                        <Grid item xs={2} sm={2}>
                                            <Radio
                                                checked={choiceContainer == 2}
                                                onChange={handleChoice}
                                                value={2}
                                                name="choice_container"
                                            />
                                        </Grid>
                                        <Grid item xs={10} sm={10}>
                                            <Typography variant="h2">From type</Typography>
                                            <Typography variant="body1">Select container size</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className="mb-3">
                        <Collapse in={choiceContainer == 1} timeout="auto" unmountOnExit>
                            <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                                <Grid item xs={5} sm={5}><Typography variant="h4">Container</Typography></Grid>
                                <Grid item xs={2} sm={2}><Typography variant="h4">Price</Typography></Grid>
                                <Grid item xs={4} sm={4}><Typography variant="h4">Remark</Typography></Grid>
                                <Grid item xs={1} sm={1}></Grid>
                                {input3List?.map((row,key) => (
                                    <React.Fragment>
                                        <Grid item xs={5} sm={5}>
                                            <Autocomplete
                                                options={optionStock}
                                                autoHighlight
                                                value={selected2List[key]?.selectedStock}
                                                getOptionLabel={(option) => option?.label}
                                                renderOption={(option) => (
                                                    <React.Fragment>{option?.label}</React.Fragment>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField 
                                                        {...params}
                                                        name="stock_id"
                                                        variant="outlined"
                                                        error={errorText.container_stocks? true : false} 
                                                        helperText={errorText.container_stocks}
                                                        fullWidth
                                                    />
                                                )}
                                                onChange={(e,v) => onStockChange(e,key,v)} 
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            {currency(row.price)}
                                        </Grid>
                                        <Grid item xs={4} sm={4}>
                                            <TextField 
                                                name="remark"
                                                variant="outlined" 
                                                defaultValue={row.remark} 
                                                value={row.remark} 
                                                error={errorText.container_stocks? true : false} 
                                                helperText={errorText.container_stocks} 
                                                onChange={(e) => onStockChange(e,key,null)} 
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={1} sm={1}>
                                            {input3List.length > 1 &&
                                            <IconButton>
                                                <Delete onClick={() => clickRemoveRow3(key)} />
                                            </IconButton>}
                                        </Grid>
                                    </React.Fragment>
                                ))}
                                <Grid item xs={12} sm={12}>
                                    <IconButton>
                                        <Add onClick={() => clickAddRow3()} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            </Collapse>
                    </Box>
                    <Box className="mb-3">
                        <Collapse in={choiceContainer == 2} timeout="auto" unmountOnExit>
                            <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                                <Grid item xs={1} sm={1}><Typography variant="h4">Size</Typography></Grid>
                                <Grid item xs={3} sm={3}><Typography variant="h4">Type</Typography></Grid>
                                <Grid item xs={2} sm={2}><Typography variant="h4">Condition</Typography></Grid>
                                <Grid item xs={2} sm={2}><Typography variant="h4">Price</Typography></Grid>
                                <Grid item xs={1} sm={1}><Typography variant="h4">Quantity</Typography></Grid>
                                <Grid item xs={2} sm={2}><Typography variant="h4">Remark</Typography></Grid>
                                <Grid item xs={1} sm={1}></Grid>
                                {input2List?.map((row,key) => (
                                    <React.Fragment>
                                        <Grid item xs={1} sm={1}>
                                            <TextField 
                                                name="container_size_id" 
                                                select 
                                                variant="outlined" 
                                                value={row.container_size_id} 
                                                error={errorText.containers? true : false} 
                                                helperText={errorText.containers} 
                                                onChange={(e) => onContainerChange(e,key)} 
                                                fullWidth 
                                            >
                                            <MenuItem value={null}><em>None</em></MenuItem>
                                            {sizeList?.map((row, key) => {
                                                return <MenuItem value={row.id}>{row?.name}</MenuItem>
                                            })}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={3} sm={3}>
                                            <TextField 
                                                name="container_type_id" 
                                                select 
                                                variant="outlined" 
                                                value={row.container_type_id} 
                                                error={errorText.containers? true : false} 
                                                helperText={errorText.containers} 
                                                onChange={(e) => onContainerChange(e,key)} 
                                                fullWidth 
                                            >
                                            <MenuItem value={null}><em>None</em></MenuItem>
                                            {typeList?.map((row, key) => {
                                                return <MenuItem value={row.id}>{row?.name}</MenuItem>
                                            })}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <TextField 
                                                name="condition_id" 
                                                select 
                                                variant="outlined" 
                                                value={row.condition_id} 
                                                error={errorText.containers? true : false} 
                                                helperText={errorText.containers} 
                                                onChange={(e) => onContainerChange(e,key)} 
                                                fullWidth 
                                            >
                                            <MenuItem value={null}><em>None</em></MenuItem>
                                            {conditionList?.map((row, key) => {
                                                return <MenuItem value={row.id}>{row?.name}</MenuItem>
                                            })}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <TextField 
                                                name="price" 
                                                type="number" 
                                                variant="outlined" 
                                                defaultValue={row.price} 
                                                value={row.price} 
                                                InputProps={{inputProps: {min:0}}}
                                                error={errorText.containers? true : false} 
                                                helperText={errorText.containers} 
                                                onChange={(e) => onContainerChange(e,key)} 
                                            />
                                        </Grid>
                                        <Grid item xs={1} sm={1}>
                                            <TextField 
                                                name="qty" 
                                                type="number" 
                                                variant="outlined" 
                                                defaultValue={row.qty} 
                                                value={row.qty} 
                                                InputProps={{inputProps: {min:0}}}
                                                error={errorText.containers? true : false} 
                                                helperText={errorText.containers} 
                                                onChange={(e) => onContainerChange(e,key)} 
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <TextField 
                                                name="remark"
                                                variant="outlined" 
                                                defaultValue={row.remark} 
                                                value={row.remark} 
                                                error={errorText.containers? true : false} 
                                                helperText={errorText.containers} 
                                                onChange={(e) => onContainerChange(e,key)} 
                                            />
                                        </Grid>
                                        <Grid item xs={1} sm={1}>
                                            {input2List.length > 1 &&
                                            <IconButton>
                                                <Delete onClick={() => clickRemoveRow2(key)} />
                                            </IconButton>}
                                        </Grid>
                                    </React.Fragment>
                                ))}
                                <Grid item xs={12} sm={12}>
                                    <IconButton>
                                        <Add onClick={() => clickAddRow2()} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Box>
                    <h2 className="mb-3 mt-5">Products</h2>
                    <Box className="mb-3">
                        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                            <Grid item xs={5} sm={5}><Typography variant="h4">Product</Typography></Grid>
                            <Grid item xs={2} sm={2}><Typography variant="h4">Price</Typography></Grid>
                            <Grid item xs={2} sm={2}><Typography variant="h4">Quantity</Typography></Grid>
                            <Grid item xs={2} sm={2}><Typography variant="h4">Remark</Typography></Grid>
                            <Grid item xs={1} sm={1}></Grid>
                            {inputList?.map((row,key) => (
                                    <React.Fragment>
                                        <Grid item xs={5} sm={5}>
                                            <Autocomplete
                                                options={optionProduct}
                                                autoHighlight
                                                value={selectedList[key]?.selectedProduct}
                                                getOptionLabel={(option) => option?.label}
                                                renderOption={(option) => (
                                                    <React.Fragment>{option?.label}</React.Fragment>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField 
                                                        {...params}
                                                        name="product_id"
                                                        variant="outlined"
                                                        error={errorText.products? true : false} 
                                                        helperText={errorText.products}
                                                        fullWidth
                                                    />
                                                )}
                                                onChange={(e,v) => onProductChange(e,v,key,true)} 
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <TextField 
                                                name="price" 
                                                type="number" 
                                                variant="outlined" 
                                                defaultValue={row.price} 
                                                value={priceList[key].price}
                                                error={errorText.products? true : false} 
                                                helperText={errorText.products} 
                                                onChange={(e) => onProductChange(e,null,key,false)} 
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <TextField 
                                                name="qty" 
                                                type="number" 
                                                variant="outlined" 
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">{row.unit}</InputAdornment>
                                                }}
                                                defaultValue={row.qty} 
                                                value={row.qty} 
                                                error={errorText.products? true : false} 
                                                helperText={errorText.products} 
                                                onChange={(e) => onProductChange(e,null,key,false)} 
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <TextField 
                                                name="remark" 
                                                variant="outlined" 
                                                defaultValue={row.remark} 
                                                value={row.remark} 
                                                onChange={(e) => onProductChange(e,null,key,false)} 
                                                fullWidth 
                                            />
                                        </Grid>
                                        <Grid item xs={1} sm={1}>
                                            <IconButton>
                                                <Delete onClick={() => clickRemoveRow(key)} />
                                            </IconButton>
                                        </Grid>
                                    </React.Fragment>
                            ))}
                            <Grid item xs={12} sm={12}>
                                <IconButton>
                                    <Add onClick={() => clickAddRow()} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Box className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={sendData}
                        disableElevation>
                        {title.buttonTitle}
                    </Button>
                </Box>
            </Card>
            <Backdrop className={classes.backdrop} open={isLoading}>
                    <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    </Modal> )
}
