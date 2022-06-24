 
import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import configData from "./config.json";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state= {
     formLogin:"",
     formPassword:"" ,
     message: '',
     users:[]
    }
  }
  
  componentDidMount() {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
    } else {
    this.getUsers();  
    const intervalId = setInterval(() => {
      this.setState({message: "" } ) } ,9000);
    }
   }

  updateInput(key,value){
    value=value.trim();
    this.setState ({
      [key] : value
    }) }

  getUsers() {
    const token = localStorage.getItem('token');
    fetch(configData.SERVER_URL+'/api/v1/users',
    {method: 'GET'  ,
    headers: {
      Authorization: `Bearer ${token}` }
  })
.then(res =>  {
  //console.log('done fetch');
  if (token && res.status==401) {
  localStorage.removeItem('token') //delete expired token  
  throw Error(res.statusText);
  }
  if (!res.ok) {
     
    throw Error(res.statusText);
  }
  return res.json()
})
.then( (result)=> {
  
  
    this.setState({users: result.data
        })
    
    })
.catch(err=> console.log('getUsers error: ' +err))
  }

  deleteUser(name) {
    const deleteUrl=configData.SERVER_URL+'/api/v1/users/'+name;
    const token = localStorage.getItem('token');
    fetch( deleteUrl,
   {method: 'DELETE' ,
   headers: {
     Authorization: `Bearer ${token}` } })
.then(res =>  { 
 //console.log('done delete');
 if (!res.ok) {
   throw Error(res.statusText);
 }
 this.setState({message: "User deleted" })
 this.getUsers();  

 })
.catch(err=>  {
  this.setState({message: "Error happened. Try later" })
  console.log('deleteEvent error: '+err) })

    }

    createUser() {
      //console.log(this.state.formLogin)
      //console.log(this.state.formPassword)
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username: this.state.formLogin,
        password: this.state.formPassword
        })
      };
      fetch(configData.SERVER_URL+'/api/v1/users/', requestOptions)
        .then(response =>  {
          console.log(response)
          if (response.status==500) {
            this.setState({message: "Error happened. Enter required fields."
            })  
          }else { 
            this.setState({message: "User created",
            formLogin:"",
            formPassword:"" 
           })
            this.getUsers()
          }
           })
        .catch(err=>  this.setState({message: "Error happened"})  )
     }
  render() {
     
     
    
    return (<div>
        { this.state.message && <div class="alert alert-info" role="alert">
  {this.state.message}
</div> }
<p class="p-users">Calendar user list:</p>
      <div class="list-group2">
      
      
    <ul class="list-group3">
    {this.state.users.map( item => {
              return (
                
                <li class="list-group-item">{item.username} <button type="button" class="btn btn-outline-danger"
                onClick={() => this.deleteUser(item.username)}
                >Delete</button></li>
             
                )
            })
          }
   

  </ul>
  
  </div>
  <div class="containeradd">
     
     <div class="row">
     
 
       
 
       <div class="col">
      
       <h2 >Create new user</h2>
       
 
         <input type="text" name="username" placeholder="Username" 
        value={this.state.formLogin}  
        onChange={e => this.updateInput("formLogin", e.target.value)}
         
        required />
         <input type="password" name="user password" placeholder="Password" 
         value={this.state.formPassword}  
         onChange={e => this.updateInput("formPassword", e.target.value)}
          
         required />
         <input type="submit" 
         onClick={() => this.createUser()}   value="Create" />
       </div>
       
     </div>
   
 </div>
  </div>
 
  
    );
  }
}

export default Login;