

import React, {Component} from 'react';
import './App.css'
import Calendar from 'react-awesome-calendar';
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom';
import configData from "./config.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.calendar = React.createRef();
   
    this.state= {
       
      events: [],
      newEventName:"",
      newFieldTo:"",
      newFieldFrom:"",
      newFieldColor:"",
      errorFieldModal:"", 
      modalButtonDisable:"disabled",
      lastDbID:1,
      showData:null 
      
    }
  }
 
  getEvents() {
    
    const token = localStorage.getItem('token');
    console.log('getEvents req')
    fetch(configData.SERVER_URL+'/api/v1/events',
    {method: 'GET'  ,
    headers: {
      Authorization: `Bearer ${token}` }
  })
.then(res =>  {
  console.log('fetch done');
  //need refactor
  if (!res.ok) {
    if (res.statusText==='Unauthorized' && localStorage.getItem('token') ){
      //delete expired or wrong token and redirect to login page
      
      localStorage.removeItem('token') 
      window.location.href = '/login'
    }
    throw Error(res.statusText);
  }
  return res.json()
})
.then( (result)=> {
  
    this.setState({events: result.data,
      lastDbID:result.lastid })
    //console.log(this.state.events)
    
    })
.catch(err=> console.log('getEvents error: ' +err))
     }

  deleteEvent(id) {
    
     const deleteUrl=configData.SERVER_URL+'/api/v1/events/'+id;
     const token = localStorage.getItem('token');
     fetch( deleteUrl,
    {method: 'DELETE' ,
    headers: {
      Authorization: `Bearer ${token}` } })
.then(res =>  { 
  //console.log('deleteEvent done ');
  if (!res.ok) {
    throw Error(res.statusText);
  }
  this.getEvents()
  })
.catch(err=> console.log('deleteEvent error: '+err))
}


updateInput(key,value){
  //console.log('updating input field var')
  value=value.trim();
  this.setState ({
    [key] : value
  })
 if (!this.state.newEventName  || !this.state.newFieldFrom || !this.state.newFieldTo ) {
   
   this.setState ({errorFieldModal: "Введите название и даты" })
   this.setState({ modalButtonDisable: "disabled" })
 }else {
  this.setState({ modalButtonDisable: "" })
 }
}
addEvent() {
  
console.log('adding  event start')
 

let colour=this.state.newFieldColor
if (!colour) {
  colour='#8B0000'
}

const newID=this.state.lastDbID+1;
const token = localStorage.getItem('token');
const toDate=this.state.newFieldTo+'Z'
const fromDate=this.state.newFieldFrom+'Z'
const requestOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json',
  Authorization: `Bearer ${token}` },
  body: JSON.stringify({ title: this.state.newEventName,
  color: colour,
  id: newID,
  to: toDate,
  from: fromDate
  })
};
fetch(configData.SERVER_URL+'/api/v1/events/', requestOptions)
  .then(response => this.getEvents() )
  .catch(err=> console.log('AddEvent error: ' + err))
this.setState({ newEventName: "",
newFieldFrom: "",
newFieldTo: "" })
this.setState({ modalButtonDisable: "disabled" }) //disable button to add event
}
  
componentDidMount() {
  
  const token = localStorage.getItem('token')
    
  if (token) {
    this.setState({ showData: 1 } )
    this.getEvents();  
  } else {
   
   window.location.href = '/login'
  }
  }


   render() {
     
    
    return (
      <div>
    


{this.state.showData && (
  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Создать событие</button>
             )} 
      
      
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content"  >
      <div class="modal-header" >
        <h5 class="modal-title" id="exampleModalLabel">Новое событие</h5>
      
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
          <label for="recipient-name" class="col-form-label">{this.state.errorFieldModal}</label>
          <br/>
            <label for="recipient-name" class="col-form-label">Название:</label>
            <input type="text" class="form-control" id="recipient-name"
            value={this.state.newEventName}
            onChange={e => this.updateInput("newEventName", e.target.value)}
            >

            </input>
          </div>
		  <div class="form-group">
            <label for="recipient-name" class="col-form-label">Дата,время начала:</label>
             </div>
          <input id="party" type="datetime-local" name="partydate" 
           onChange={e => this.updateInput("newFieldFrom", e.target.value)}
           value={this.state.newFieldFrom}
           ></input>
		  <div class="form-group">
            <label for="recipient-name" class="col-form-label">Дата,время конца:</label>
            </div>
            <input id="party" type="datetime-local" name="partydate" 
           onChange={e => this.updateInput("newFieldTo", e.target.value)}
           value={this.state.newFieldTo}
           ></input>
           <br/>
           <br/>
         <label>
          Цвет события:
          <select value={this.state.newFieldColor} 
          onChange={e => this.updateInput("newFieldColor", e.target.value)}
          >            
            <option value="#8B0000">Red</option>
            <option value="#ADFF2F">Green</option>
            <option value="#00FFFF">Aqua</option>
            <option value="#EE82EE">Violet</option>
          </select>
        </label> 
          
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
        <button type="button" class="btn btn-primary"  data-dismiss="modal"  onClick={() => this.addEvent()}
         disabled={this.state.modalButtonDisable}
        >Создать событие</button>
      </div>
    </div>
  </div>
</div>
      <Calendar
      ref={this.calendar}
      //onClickEvent -   click on an event ,argument- event_id
        onClickEvent={(event) => {console.log('onclick', event)
        const result = window.confirm('Удалить запись календаря?');
        if (result)
        this.deleteEvent(event)
      }} 
        onChange={(dates) => console.log('on change', dates)}
        onClickTimeLine={(date) => console.log('onlick timeline', date)}
        events={this.state.events} //pass the events
        />  
        </div>
    );
  }
}

export default App;
