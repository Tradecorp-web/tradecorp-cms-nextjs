  import { Button, Card, Grid, MenuItem, Modal, Typography, Box, TextField, Paper, List, ListItem, ListItemText, ListItemIcon, Checkbox, makeStyles, Backdrop, CircularProgress, IconButton, InputAdornment, Collapse, Radio, FormControlLabel } from "@material-ui/core";
  import Autocomplete from '@material-ui/lab/Autocomplete'
  import { Delete, Add } from "@material-ui/icons";
  import React, { useEffect, useState } from "react";
  import { saveSchedularApi } from "../../../../services/api/schedular.api";
  import { getContainerColumnApi } from "../../../../services/api/container-stocks.api";
  import { masterDataCategory, masterDataSwr } from "../../../../services/swr/master-data.swr"
  import { masterUserSwr } from "../../../../services/swr/user.swr"
  import Moment from "moment";
  import { SignalCellularNullOutlined } from "@mui/icons-material";
  
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
  
  export default function SchedularForm(props) {
    const classes = useStyles();
  
    const [teamList, setTeamList] = useState([])
    const [userList, setUserList] = useState([])
    const [optionTeam, setOptionTeam] = useState([])
    const [optionUser, setOptionUser] = useState([])
    const [teamInput, setTeamInput] = useState([])
    const [userInput, setUserInput] = useState([])

    // const [inputList, setInputList] = useState([{email:null}])
    const [monthList, setMonthList] = useState(["","January","February","March","April","May","June","July","August","September","October","November","December"])
    const [weekList, setWeekList] = useState(["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"])
    const [dayList, setDayList] = useState([])
    const [hourList, setHourList] = useState([])
    const [minuteList, setMinuteList] = useState([])
    const [disable, setDisable] = useState({month:false,day_of_week:false,day:false,hour:false,minute:false})
    const [columnList, setColumnList] = useState([])
    const [columnCheck, setColumnCheck] = useState([])
  
    const [errorText, setErrorText] = useState({recurring:null,filters:null,active:null,month:null,day_of_week:null,day:null,hour:null,minute:null,timezone:null,columns:null,teams:null,users:null})
    const [isLoading, setLoading] = useState(false)
  
    const [data, setData] = useState({id:null,module:"inventory_report",recurring:null,filters:[],active:null,month:null,day_of_week:null,day:null,hour:null,minute:null,timezone:"Asia/Jakarta",columns:[],teams:[],users:[]})
    const [idData, setIdData] = useState(null)
    const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" })
  
    const onInputChange = (event) => {
      if (event.target.name == "recurring") {
        if (event.target.value == "daily") {
          setData({ ...data, [event.target.name]: event.target.value, month:null, day_of_week:null, day:null })
          setDisable({...disable,month:true,day_of_week:true,day:true})
        } else if (event.target.value == "weekly") {
          setData({ ...data, [event.target.name]: event.target.value, month:null, day:null })
          setDisable({...disable,month:true,day_of_week:false,day:true})
        } else if (event.target.value == "monthly") {
          setData({ ...data, [event.target.name]: event.target.value, month:null, day_of_week:null })
          setDisable({...disable,month:true,day_of_week:true,day:false})
        } else if (event.target.value == "yearly") {
          setData({ ...data, [event.target.name]: event.target.value, day_of_week:null })
          setDisable({...disable,month:false,day_of_week:true,day:false})
        }
      } else {
        setData({ ...data, [event.target.name]: event.target.value })
      }
    };

    // const onEmailChange = (event, i) => {
    //     var list = [...inputList]
    //     list[i][event.target.name] = event.target.value
    //     var email = []
    //     for (var i = 0; i < list.length; i++) {
    //         email.push(list[i].email)
    //     }
    //     setInputList(list)
    //     setData({ ...data, emails: email })
    //   };

    const onTeamChange = (event,value) => {
      setTeamInput(value)
      var list = []
      for (var i=0; i<value.length; i++) {
          list.push(value[i].id)
      }
      setData({ ...data, teams:list})
  }

  const onUserChange = (event,value) => {
      setUserInput(value)
      var list = []
      for (var i=0; i<value.length; i++) {
          list.push(value[i].id)
      }
      setData({ ...data, users:list})
  }

    const onChecked = (i) => {
      var list = [...columnCheck]
      list[i] = !list[i]
      var columns = []
      list.map((val,key) => {
        if (val) {
          columns.push(columnList[key])
        }
      })
      setColumnCheck(list)
      setData({ ...data, columns: columns })
    }
  
    // const clickAddRow = () => {
    //   setInputList([...inputList, {email:null}])
    // };
  
    // const clickRemoveRow = (i) => {
    //   var list = [...inputList]
    //   var emails = []
    //   list.splice(i, 1)
    //   for (var i=0; i<list.length; i++) {
    //     emails.push(list[i].email)
    //   }
    //   setInputList(list)
    //   setData({ ...data, emails:emails})
    // };

    var teamSwr = masterDataSwr(masterDataCategory.team,"id")
    var userSwr = masterUserSwr({limit:999})

    useEffect(() => {
        if (teamSwr?.data) {
            setTeamList(teamSwr?.data ?? [])
        }
    }, [teamSwr])

    useEffect(() => {
        var list = []
        list.push({id:"",label:""})
        teamList.map((item,i) => {
          if (item.id != 8999) {
            list.push({id:item.id,label:item.name})
          }
        })
        setOptionTeam(list)
    }, [teamList])

    useEffect(() => {
        if (userSwr?.data?.result) {
            setUserList(userSwr?.data?.result ?? [])
        }
    }, [userSwr])

    useEffect(() => {
        var list = []
        list.push({id:"",label:""})
        userList.map((item,i) => {
            list.push({id:item.id,label:item.name})
        })
        setOptionUser(list)
    }, [userList])

    useEffect(() => {
      getContainerColumnApi()
      .then(res => {
        var ccheck = []
        res?.map((row,i) => {
          ccheck[i] = false
        })
        setColumnCheck(ccheck)
        setColumnList(res ?? [])
      })
    }, [])
  
    useEffect(() => {
        var day = []
        var hour = []
        var minute = []
        for (var i=0; i<=31; i++) {
            day.push(i)
        }
        for (var i=0; i<=23; i++) {
            hour.push(i)
        }
        for (var i=0; i<=59; i++) {
            minute.push(i)
        }
        setDayList(day)
        setHourList(hour)
        setMinuteList(minute)
        if (props.schedule != null) {
            setData({id:props.schedule.id, module:"inventory_report", recurring:props.schedule.recurring, filters:[], active:props.schedule.active, month:props.schedule.month, day_of_week:props.schedule.day_of_week, day:props.schedule.day, hour:props.schedule.hour, minute:props.schedule.minute, timezone:"Asia/Jakarta", columns:props.schedule.columns, teams:props.schedule.teams, users:props.schedule.users})
            // if (props.schedule.emails != null) {
            //     var list = [];
            //     for (var i = 0; i < props.schedule.emails.length; i++) {
            //         list.push({email:props.schedule.emails[i]})
            //     }
            //     setInputList(list)
            // } else {
            //     setInputList([{email:null}])
            // }
            var team = []
            teamList?.map((item,key) => {
                props.schedule.teams?.map((i,k) => {
                    if (item.id == i) {
                        team.push({id:item.id,label:item.name})
                    }
                })
            })
            setTeamInput(team)
            var user = []
            userList?.map((item,key) => {
                props.schedule.users?.map((i,k) => {
                    if (item.id == i) {
                        user.push({id:item.id,label:item.name})
                    }
                })
            })
            setUserInput(user)
            setIdData(props.schedule.id)
            if (props.schedule.recurring == "daily") {
              setDisable({month:true,day_of_week:true,day:true,hour:false,minute:false})
            } else if (props.schedule.recurring == "weekly") {
              setDisable({month:true,day_of_week:false,day:true,hour:false,minute:false})
            } else if (props.schedule.recurring == "monthly") {
              setDisable({month:true,day_of_week:true,day:false,hour:false,minute:false})
            } else if (props.schedule.recurring == "yearly") {
              setDisable({month:false,day_of_week:true,day:false,hour:false,minute:false})
            } else {
              setDisable({month:false,day_of_week:false,day:false,hour:false,minute:false})
            }
            var ccheck = [...columnCheck]
            columnList?.map((row,i) => {
              ccheck[i] = false
              if (props.schedule.columns != null) {
                for (var j=0; j<props.schedule.columns.length; j++) {
                  if (props.schedule.columns[j].field == row.field) {
                    ccheck[i] = true
                  }
                }
              }
            })
            setColumnCheck(ccheck)
            setTitle({formTitle:"Edit Schedule",buttonTitle:"Save"})
        } else {
            setData({id:null,module:"inventory_report",recurring:null,filters:[],active:null,month:null,day_of_week:null,day:null,hour:null,minute:null,timezone:"Asia/Jakarta",columns:[],teams:[],users:[]})
            // setInputList([{email:null}])
            setTeamInput([])
            setUserInput([])
            setIdData(null)
            setDisable({month:false,day_of_week:false,day:false,hour:false,minute:false})
            var ccheck = []
            columnList?.map((row,i) => {
              ccheck[i] = false
            })
            setColumnCheck(ccheck)
            setTitle({formTitle:"Add Schedule",buttonTitle:"Create"})
        }
    }, [props.open]);
  
    function checkValidation() {
      var isValid = true
      var eRecurring = "", eActive = "", eMonth = "", eWeek="", eDay = "", eHour = "", eMinute = "", eColumns = "", eTeams = "", eUsers = ""
      if (data.recurring == "" || data.recurring == null) {
        isValid = false
        eRecurring = "Please choose Recurring"
      }
      // if (data.emails.length == 0) {
      //   isValid = false
      //   eEmails = "Emails can not be empty"
      // }
      setErrorText({...errorText, recurring:eRecurring, active:eActive, month:eMonth, day_of_week:eWeek, day:eDay, hour:eHour, minute:eMinute, columns:eColumns, teams:eTeams, users:eUsers})
      return isValid
    }
  
    const sendData = () => {
      if (checkValidation()) {
        setLoading(true)
        saveSchedularApi(data,idData)
          .then((res) => {
            setData({id:null,module:"inventory_report",recurring:null,filters:[],active:null,month:null,day_of_week:null,day:null,hour:null,minute:null,timezone:"Asia/Jakarta",columns:[],teams:[],users:[]})
            setLoading(false)
            props?.closeModal()
          })
          .catch((err) => {
            console.log(err)
            //setErrorText(err)
            setLoading(false)
          });
      }
    };
  
    const closeForm = () => {
      setData({id:null,module:"inventory_report",recurring:null,filters:[],active:null,month:null,day_of_week:null,day:null,hour:null,minute:null,timezone:"Asia/Jakarta",columns:[],teams:[],users:[]})
      props?.closeModal()
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
                              name="recurring" 
                              select
                              label="Recurring"
                              variant="outlined" 
                              value={data.recurring} 
                              required 
                              error={errorText.recurring? true : false} 
                              helperText={errorText.recurring} 
                              onChange={onInputChange} 
                              fullWidth 
                          >
                              <MenuItem value={null}><em>None</em></MenuItem>
                              <MenuItem value="daily">Daily</MenuItem>
                              <MenuItem value="weekly">Weekly</MenuItem>
                              <MenuItem value="monthly">Monthly</MenuItem>
                              <MenuItem value="yearly">Yearly</MenuItem>
                          </TextField>
                      </Box>
                      <Box className="mb-3">
                        <Grid container spacing={2} justify="center" alignItems="center">
                              <Grid item xs={12} sm={3}>
                                <TextField 
                                    name="month" 
                                    select
                                    label="Month"
                                    variant="outlined" 
                                    value={data.month} 
                                    error={errorText.month? true : false} 
                                    helperText={errorText.month} 
                                    onChange={onInputChange} 
                                    disabled={disable.month}
                                    fullWidth 
                                >
                                  <MenuItem value={null}><em>None</em></MenuItem>
                                  {monthList?.map((val, i) => {
                                      if (i > 0) {
                                          return <MenuItem key={i} value={i}>{val}</MenuItem>
                                      }
                                  })}
                                </TextField>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <TextField 
                                    name="day_of_week" 
                                    select
                                    label="Day of Week"
                                    variant="outlined" 
                                    value={data.day_of_week} 
                                    error={errorText.day_of_week? true : false} 
                                    helperText={errorText.day_of_week} 
                                    onChange={onInputChange}
                                    disabled={disable.day_of_week}
                                    fullWidth 
                                >
                                      <MenuItem value={null}><em>None</em></MenuItem>
                                      {weekList?.map((val, i) => {
                                          return <MenuItem key={val} value={val}>{val}</MenuItem>
                                      })}
                                </TextField>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <TextField 
                                    name="day" 
                                    select
                                    label="Day"
                                    variant="outlined" 
                                    value={data.day} 
                                    error={errorText.day? true : false} 
                                    helperText={errorText.day} 
                                    onChange={onInputChange}
                                    disabled={disable.day}
                                    fullWidth 
                                >
                                      <MenuItem value={null}><em>None</em></MenuItem>
                                      {dayList?.map((val, i) => {
                                          if (i > 0) {
                                              return <MenuItem key={val} value={val}>{val}</MenuItem>
                                          }
                                      })}
                                </TextField>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <TextField 
                                    name="hour" 
                                    select
                                    label="Hour"
                                    variant="outlined" 
                                    value={data.hour} 
                                    required 
                                    error={errorText.hour? true : false} 
                                    helperText={errorText.hour} 
                                    onChange={onInputChange}
                                    disabled={disable.hour}
                                    fullWidth 
                                >
                                    <MenuItem value={null}><em>None</em></MenuItem>
                                    {hourList?.map((val, i) => {
                                          return <MenuItem key={val} value={val}>{val}</MenuItem>
                                      })}
                                </TextField>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <TextField 
                                    name="minute" 
                                    select
                                    label="Minute"
                                    variant="outlined" 
                                    value={data.minute} 
                                    required 
                                    error={errorText.minute? true : false} 
                                    helperText={errorText.minute} 
                                    onChange={onInputChange}
                                    disabled={disable.minute}
                                    fullWidth 
                                >
                                    <MenuItem value={null}><em>None</em></MenuItem>
                                    {minuteList?.map((val, i) => {
                                          return <MenuItem key={val} value={val}>{val}</MenuItem>
                                      })}
                                </TextField>
                              </Grid>
                        </Grid>
                      </Box>
                      <h2 className="mb-3 mt-5">Columns</h2>
                      <Box className="mb-3">
                        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                          {columnList?.map((row,key) => (
                            <Grid item xs={12} sm={3}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={columnCheck[key]}
                                    onChange={() => onChecked(key)}
                                    name={row.field}
                                  />
                                }
                                label={row.label}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                      {/* <h2 className="mb-3 mt-5">Emails</h2>
                      <Box className="mb-3">
                          <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                              <Grid item xs={11} sm={11}><Typography variant="h4">E-mail Address</Typography></Grid>
                              <Grid item xs={1} sm={1}></Grid>
                              {inputList?.map((row,key) => (
                                      <React.Fragment>
                                          <Grid item xs={11} sm={11}>
                                              <TextField 
                                                  name="email" 
                                                  variant="outlined" 
                                                  defaultValue={row.email} 
                                                  value={row.email} 
                                                  onChange={(e) => onEmailChange(e,key)} 
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
                      </Box> */}
                      <h2 className="mb-3 mt-5">Send to</h2>
                      <Box className="mb-3">
                        <Autocomplete
                          multiple
                          options={optionTeam}
                          value={teamInput}
                          getOptionLabel={(option) => option?.label}
                          renderInput={(params) => (
                              <TextField 
                                  {...params}
                                  name="teams"
                                  variant="outlined"
                                  label="Teams"
                                  error={errorText.teams} 
                                  helperText={errorText.teams}
                              />
                          )}
                          onChange={(e,v) => onTeamChange(e,v)} 
                        />
                      </Box>
                      <Box className="mb-3">
                        <Autocomplete
                          multiple
                          options={optionUser}
                          value={userInput}
                          getOptionLabel={(option) => option?.label}
                          renderInput={(params) => (
                              <TextField 
                                  {...params}
                                  name="users"
                                  variant="outlined"
                                  label="Users"
                                  error={errorText.users} 
                                  helperText={errorText.users}
                              />
                          )}
                          onChange={(e,v) => onUserChange(e,v)} 
                        />
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
  