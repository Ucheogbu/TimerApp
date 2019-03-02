import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import './uuid.js';
import './client.js';
import './helpers.js';
// import './server.js'
// import './fetch.js';





class TimerDashboard extends Component {
  state = { 
     timers : [],
  }

  componentDidMount() {
    this.loadTimersfromserver();
    setInterval(this.loadTimersfromserver,5000)
  }

  loadTimersfromserver = () => {
    window.client.getTimers((serverTimers) => {
      this.setState({timers : serverTimers})
    })
  }

  handleEditForm = (timer) => {
    this.editForm(timer);
  }


  editForm = (attr = {}) => {
   this.setState({
    timers:  this.state.timers.map((timer) =>{
    if (attr.id === timer.id){
      return Object.assign({},timer,{
        title:attr.title,
        project: attr.project
      });
    }else{
      return timer
    }
  })
  });
  window.client.updateTime(attr);
  }

  handleDeleteTimer = (timer) => {
    this.deleteTimer(timer);
  }

  handleStartTimer = (timer) => {
    this.startTimer(timer);
  }

  startTimer  = (timerId) => {
    const now = Date.now();
    this.setState({
      timers:this.state.timers.map((timer) => {
        if (timerId === timer.id){
          return Object.assign({},timer,{
            runningSince: now
          })
        }else{
          return timer
        }
      })
    });
    window.client.startTimer(
      {id: timerId, start: now}
    );
  }

  

  handleStopTimer = (timer) => {
    this.stopTimer(timer);
  }

  stopTimer  = (timerId) => {
    const now = Date.now();
    this.setState({
      timers:this.state.timers.map((timer) => {
        const finalElapsed = now - timer.runningSince;
        if (timerId === timer.id){
         return Object.assign({},timer,{
            elapsed: finalElapsed,
            runningSince: null
          })
        }else{
          return timer
        }
      })
    });
    window.client.stopTimer(
      {id: timerId, stop: now}
    );
  }

  deleteTimer = (timerId) => {
    const array = this.state.timers
      array.map((timer) => {
      if (timerId === timer.id){
      var index = (array.indexOf(timer)-1);
      array.splice(index,1);
      return this.setState({timers:array});
      }else{
        return timer
      }
    })
    window.client.deleteTimer({id: timerId});    
  };

  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer)
  }

createTimer = (timer) => {
const t = window.helpers.newTimer(timer);
this.setState({timers:this.state.timers.concat(t)});
window.client.createTimer(t);
}
  render() {

    return (
      <div className="ui three column centered grid">
        <div className = "column">
        <EditableTimerList
        timers = {this.state.timers}
        handleEditFormSubmit = {this.handleEditForm}
        handleDeleteClick = {this.handleDeleteTimer}
        onStartClick = {this.handleStartTimer}
        onStopClick = {this.handleStopTimer}
        />
        <ToggleableTimerForm 
        handleFormSubmit = {this.handleCreateFormSubmit}/>
        </div>
      </div>
    );
  }
}






class EditableTimerList extends Component {
  
  render() { 
    const timers = this.props.timers.map((timer) => (
        <EditableTimer
        key = {timer.id}
        id = {timer.id}
        title = {timer.title}
        project = {timer.project}
        elapsed = {timer.elapsed}
        runningSince = {timer.runningSince}
        handleEditFormSubmit = {this.props.handleEditFormSubmit}   
        handleDeleteClick = {this.props.handleDeleteClick} 
        onStartClick ={this.props.onStartClick}
        onStopClick ={this.props.onStopClick}
        />
    ));
    return ( 
      <div className="timers">
      {timers}      
      </div>           
     );
  }
}




class EditableTimer extends Component {
  state = {
    editFormOpen : false
  }

  handleEditFormClose = () => {
    if (this.state.editFormOpen === false){
      this.setState({editFormOpen: true})
    }else{
      this.setState({editFormOpen: false})
    }
  };

  handleEditClick = () => {
    this.openform();
  };

  handleFormSubmit = (timer) => {
    this.props.handleEditFormSubmit(timer)
    this.setState({editFormOpen:false});
   };

  openform = () => {
    this.setState({editFormOpen: true});
  };

  render() { 
    if (this.state.editFormOpen) {
      return (           
          <TimerForm 
            id = {this.props.id}
            title = {this.props.title}
            project = {this.props.project}
            editFormClose = {this.handleEditFormClose}
            handleEditFormSubmit = {this.handleFormSubmit}
          />
        );
      }else{
        return(
          <Timer
          id = {this.props.id}
          title = {this.props.title}
          project = {this.props.project}
          elapsed = {this.props.elapsed}
          runningSince = {this.props.runningSince}
          editClick = {this.handleEditClick}
          deleteClick = {this.props.handleDeleteClick}
          onStartClick ={this.props.onStartClick}
          onStopClick ={this.props.onStopClick}
          />
          );
      }
  }
}





class ToggleableTimerForm extends Component {
  state = { 
    isOpen : false
   }
   handleFormOpen = () => {
     if (this.state.isOpen === false){
       this.setState({isOpen: true});
     }else{
       this.setState({isOpen: false});
     }
   };
   handleFormSubmit = (timer) => {
    this.props.handleFormSubmit(timer)
    this.setState({isOpen:false});
   };
  render() { 
    if (this.state.isOpen){
      return(
       <TimerForm       
       onFormCreateSubmit = {this.handleFormSubmit}
       form = {this.handleFormOpen}       
       />         
      );
    }else{
      return(
       <PlusButton        
       form = {this.handleFormOpen}
       />
       
      );
    }
  }
}





class PlusButton extends Component {
  state = {  }
  handleFormOpen = () => {
    this.props.form();
  };
  render() { 
    return (
     <div className="ui centered card">
       <div className="ui basic content center aligned segment">
         <button onClick={this.handleFormOpen} className="ui basic button icon">
         <i className="plus icon"></i>
         </button>
       </div>
     </div>
      );
  }
}
 




 class TimerForm extends Component {
   state = { 
     title: this.props.title || '',
     project : this.props.project || '',
    }

   handleFormClose = () => {
    if (this.submitText === ('Create')){
      this.props.form()
    }else {     
      this.props.editFormClose()    
  }    
  };  

  handleSubmit = () => {
    if (this.submitText === ('Create')){
      this.handleCreateSubmit()
    }else {     
      this.handleEditFormSubmit() 
    }
  };

  handleEditFormSubmit = () => {
    this.props.handleEditFormSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project
    })
  }
  
  handleCreateSubmit = () => {
    this.props.onFormCreateSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project
    })
  };

  handleTitleChange = (e) => {
    this.setState({title: e.target.value})
  };

  handleProjectChange = (e) => {
    this.setState({project: e.target.value})
  };

  submitText = this.props.title ? 'Update': 'Create';

   render() {  
     return ( 
       <div className="ui centered card">
        <div className="content">
          <div className="ui form">
          <div className="field">
            <label>Title</label>
            <input type='text' onChange={this.handleTitleChange} value={this.state.title} />      
          </div>
          <div className="field">
            <label>Project</label>
            <input type="text" onChange={this.handleProjectChange}value={this.state.project} />      
          </div>
          <div className="ui two bottom attached buttons">
            <button onClick={this.handleSubmit} className="ui basic blue button">{this.submitText}</button>
            <button onClick={this.handleFormClose} className="ui basic red button">Cancel</button>
          </div>
          </div>
        </div>       
       </div>

      );
   }
 }  





 class TimerActionButton extends Component {
  state = {  }
  render() { 
    if (this.props.timerIsRunning){
      return (
        <div
        className="ui bottom attached red basic button "
        onClick = {this.props.onStopClick}
        >Stop</div>
        );
    }else{
      return (
        <div
        className="ui bottom attached green basic button "
        onClick = {this.props.onStartClick}
        >Start</div>
      );
    }
    
  }
}




 class Timer extends Component {
   state = {  }

   componentDidMount(){
     this.forceUpdateinterval = setInterval(()=> this.forceUpdate(),60);
   }

   componentWillMount(){
     clearInterval(this.forceUpdateinterval);
   }

   handleStartClick = () => {
     this.props.onStartClick(this.props.id)
   }

   handleStopClick = () => {
    this.props.onStopClick(this.props.id)
  }

   onEditClick = () => {
    this.props.editClick()
  };

  onDeleteClick = () => {
    this.props.deleteClick(this.props.id);    
  }

   render() { 
     const elapsedString = window.helpers.renderElapsedString(
       this.props.elapsed,
       this.props.runningSince
       );
     return (
       <div className="ui centered card">
        <div className="content">
          <div className="header">
              {this.props.title}
          </div>
            <div className="meta">
              {this.props.project}
            </div>
            <div className="centered aligned description">
              <h2>{elapsedString}</h2>
            </div>
            <div className="extra content">
            <span 
            className="right floated edit icon" 
            onClick={this.onEditClick}>
              <i className="edit icon "></i>
            </span>
            <span className="right floated trash icon" onClick={this.onDeleteClick}>
              <i className="trash icon "></i>
            </span>
            </div>
        </div>
        <div>
          <TimerActionButton
          onStartClick = {this.handleStartClick}
          onStopClick = {this.handleStopClick}
          timerIsRunning = {!!this.props.runningSince}
          />
         </div>
       </div>
       );
   }
 }
  

  

export default TimerDashboard;
