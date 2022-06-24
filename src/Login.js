 
import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import './login.css'
class Login extends Component {
  constructor(props) {
    super(props);
    this.state= {
     formLogin:"",
     formPassword:"" ,
     errorMessage: ''
    }
  }
  componentDidMount() {
     
   }
  updateInput(key,value){
    value=value.trim();
    this.setState ({
      [key] : value
    }) }

  login() {
    //console.log('login with:',this.state.formLogin,this.state.formPassword)
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: this.state.formLogin,
        password: this.state.formPassword
        })
      };
      fetch('http://localhost:5000/api/v1/login', requestOptions  )
  .then(res =>  {
    //console.log('done fetch');
    if (!res.ok) {
      throw Error(res.statusText);
       }
       return res.json()
   
  })
  .then(res =>  {
    //console.log(res) 
    localStorage.setItem('token', res)
    if (this.state.formLogin==='superadmin') { //redirect superadmin to  user management page
      window.location.href = '/manage'
    }else {
    window.location.href = '/'
    }
  })
  .catch(err =>  {
    console.log('POST Authorization error: '+err)
    this.setState({errorMessage: err.message,
      formLogin:"",
     formPassword:""
    });
  })

    }
  render() {
     
     
    
    return ( <div class="container">
     
      <div class="row">
      
  
        
  
        <div class="col">
        <h2 >Login page</h2>
       
        { this.state.errorMessage &&   <div class="alert alert-primary" role="alert">
        Please enter correct login and password </div>
  }
  
          <input type="text" name="username" placeholder="Username" 
         value={this.state.formLogin}  
         onChange={e => this.updateInput("formLogin", e.target.value)}
         required />
          <input type="password" name="password" placeholder="Password" 
          value={this.state.formPassword}
          onChange={e => this.updateInput("formPassword", e.target.value)}
          required />
          <input type="submit"  onClick={() => this.login()} value="Login" />
        </div>
        
      </div>
    
  </div>
    );
  }
}

export default Login;