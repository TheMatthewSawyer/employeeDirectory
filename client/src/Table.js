import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

import { set } from 'idb-keyval';
import { get } from 'idb-keyval';
import { clear } from 'idb-keyval';

import blue from './images/blue.gif';
import error from './audio/error.mp3'

function Table(props) {
  const currentDepartment = props.currentDepartment;
  const setCurrentDepartment = props.setCurrentDepartment;

  // React.useEffect(() => {
  //   addDepartment();
  // },[]);

  checkDB();

  function checkDB() {
    get('employeeDB').then(function (DB) {

      if (DB === undefined) {
        console.log('new');
        document.getElementById('topRight').innerHTML = `<div style='width: 100%; text-align: center;'>Empty!</div>`;
      } else {
        console.log('exists');
        let departmentList = document.getElementById('departmentList');
        let lengthAll = 0;
        let buttonList = document.querySelectorAll("button.list-group-item");
        for (var i = 1; i < buttonList.length; i++) {
          buttonList[i].remove();
        }
        for (let i = 0; i < DB.length; i++) {
          departmentList.innerHTML +=
            `<button  value="${i}" class="list-group-item list-group-item-action">
          <div class='row' value="${i}">
          <div value="${i}" class='col-10' style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
         ${DB[i].description.departmentName}
          </div>
          <span value="${i}"> ${DB[i].data.length}</span>
          </div>

      </button>
          `;
          lengthAll += DB[i].data.length;
        }
        document.getElementById('allLength').innerHTML = lengthAll;
        addDepartmentEventListeners();
        renderDepartments(DB);
      }
      return;
    });
    return;
  }

  function setCurrentActive() {
    let buttonListForActive = document.querySelectorAll("button.list-group-item");
    let number = currentDepartment+1;
    for(let x = 0; x < buttonListForActive.length; x++) {
      if(buttonListForActive[x].classList.contains('active')){
        buttonListForActive[x].classList.remove('active');
      }
    }
    buttonListForActive[number].classList.add('active');
    return;
  }

  function copyText(textToCopy) {
    var textAreaForCopy = document.createElement('textarea');
    document.body.appendChild(textAreaForCopy);
    textAreaForCopy.value = `${textToCopy}`;
    textAreaForCopy.select();
    document.execCommand("copy");
    document.body.removeChild(textAreaForCopy);
    return;
  }

  const exitClick = () => {
    document.getElementById("error").play();
    var blueScreenContainer = document.getElementById('blueScreenContainer');
    var backingBlue = document.getElementById('backingBlue');
    blueScreenContainer.classList.toggle('displayNone');
    backingBlue.classList.toggle('displayNone');
    return;
  }

  const exitExitClick = () => {
    var blueScreenContainer = document.getElementById('blueScreenContainer');
    var backingBlue = document.getElementById('backingBlue');
    blueScreenContainer.classList.toggle('displayNone');
    backingBlue.classList.toggle('displayNone');
    return;
  }

  const clippyClick = () => {
    console.log('clippy');
  }

  const addDepartment = () => {
    console.log('working');
    let bottomRight = document.getElementById('bottomRight');
    bottomRight.innerHTML =
    `
    <button class='closeAddButton' id='closeAddBtn'>x</button>
    <div class="input-group mb-3 addDepartmentContainer">
      <input id='newDepartmentInput' type="text" class="form-control" placeholder="New Department Name" aria-label="Recipient's username" aria-describedby="basic-addon2">
      <div class="input-group-append">
        <button class="btn btn-primary" type="button" id='newDepartmentBtn'>Add!</button>
      </div>
    </div>
    `;

    if(bottomRight.classList.contains('disabled')){
      bottomRight.classList.remove('disabled');
    }

    document.getElementById('closeAddBtn').addEventListener('click', ()=> {
      console.log('111');
      let bottomRight = document.getElementById('bottomRight');
      bottomRight.innerHTML = `Click 'File' and select what you'd like to add!`;
      bottomRight.classList.add('disabled');
    });
    document.getElementById('newDepartmentBtn').addEventListener('click', async ()=> {
      var newDepartmentInput = document.getElementById('newDepartmentInput');
      if(newDepartmentInput.value === '') {return;}
      bottomRight.innerHTML = ``;
      var DB = await fetchDB();
      var newDepartment =
      {
        description:
        {
          departmentName: `${newDepartmentInput.value.substring(0, 1).toUpperCase() + newDepartmentInput.value.substring(1).toLowerCase()}`
        },
        data: []
      };
      DB.push(newDepartment);
      console.log(DB);
      set('employeeDB', DB)
      .then(() => {
        checkDB();
        addDepartment();
        return;
      })
      .catch(err => (alert('ERROR: ' + err)));
    });
  }

  const clearAll = () => {
    if (!window.confirm('Are you sure you want to clear? This cannot be undone')) {
      return;
    } else {
      clear();
      let buttonListForRemoval = document.querySelectorAll("button.list-group-item");
      for (let i = 1; i < buttonListForRemoval.length; i++) {
        buttonListForRemoval[i].remove();
      }
      document.getElementById('allLength').innerHTML = 0;
      checkDB();
      setCurrentDepartment(-1);
      return;
    }
  }
  
  function renderDepartments(DB) {
    if(!DB) {
      DB = fetchDB();
    }
    let table = `<div class="accordion" id="accordionExample">`;
    //if on ALL
    if (currentDepartment === -1) {
      for (let x = 0; x < DB.length; x++) {
        for (let y = 0; y < DB[x].data.length; y++) {
          table += `
            <div class="card empNameBtnContainer">
              <div class="card-header" id="heading${x + '' + y}" onclick="document.getElementById('collapse${x + '' + y}').classList.toggle('collapse')">
                <h2 class="mb-0">
                  <button class="empNameBtn btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${x + '' + y}" aria-expanded="false" aria-controls="collapse${x + '' + y}">
                    ${DB[x].data[y].firstName + " " + DB[x].data[y].lastName}
                  </button>
                </h2>
              </div>
          
              <div id="collapse${x + '' + y}" class="collapse employeeContent" aria-labelledby="heading${x + '' + y}" data-parent="#accordionExample">
                <div class="card-body empInner">
                  <div class='editButtonContainer'>
                    <button class='editButton' value='edit'>Edit</button>
                    <button class='deleteButton' value='delete'>Delete</button>
                  </div>
                  Email: <br/>
                  <div class='textCenter empData'>
                    ${DB[x].data[y].email} 
                    <div class='copyButtonContainer'>
                      <button class='copyButton' value='${DB[x].data[y].email}'>Copy!</button>
                    </div>
                    <br/>
                  </div>
                  Address: <br/>
                  <div class='textCenter empData'>
                    ${DB[x].data[y].address}
                    <div class='copyButtonContainer'>
                      <button class='copyButton' value='${DB[x].data[y].address}'>Copy!</button>
                    </div>
                    <br/>
                  </div>
                  Birthday: <br/>
                  <div class='textCenter empData'>
                    ${DB[x].data[y].birthday}
                    <div class='copyButtonContainer'>
                      <button class='copyButton' value='${DB[x].data[y].birthday}'>Copy!</button>
                    </div>
                    <br/>
                  </div>
                  Notes: <br/>
                  <div class='empData' style='display: inline-block;'>
                    <div class='selectNone' style='display: inline-block;color:white;opacity:0;'>
                      12345
                    </div>
                    ${DB[x].data[y].notes}
                    <div class='copyButtonContainer'>
                      <button class='copyButton' style='bottom: 5px;' value='${DB[x].data[y].notes}'>Copy!</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      }
      
    } else {
      //for any specific department
      if(DB[currentDepartment].data.length === 0) {
        table += `<div style='width: 100%; text-align: center;'>Empty!</div><br/></div>`;
        if (document) {
          document.getElementById('topRight').innerHTML = table;
        }
      }

      for (let z = 0; z < DB[currentDepartment].data.length; z++) {
        table += `
          <div class="card empNameBtnContainer">
            <div class="card-header" id="heading${currentDepartment + '' + z}" onclick="document.getElementById('collapse${currentDepartment + '' + z}').classList.toggle('collapse')">
              <h2 class="mb-0">
                <button class="empNameBtn btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${currentDepartment + '' + z}" aria-expanded="false" aria-controls="collapse${currentDepartment + '' + z}">
                  ${DB[currentDepartment].data[z].firstName + " " + DB[currentDepartment].data[z].lastName}
            </button>
          </h2>
        </div>
    
        <div id="collapse${currentDepartment + '' + z}" class="collapse" aria-labelledby="heading${currentDepartment + '' + z}" data-parent="#accordionExample">
          <div class='editButtonContainer'>
            <button class='editButton' value='edit' style='bottom:47px;'>Edit</button>
            <button class='deleteButton' value='delete' style='bottom:47px;'>Delete</button>
          </div>
          <div class="card-body empInner">
            Email: <br/>
            <div class='textCenter empData'>
            ${DB[currentDepartment].data[z].email}
            <div class='copyButtonContainer'>
              <button class='copyButton' value='${DB[currentDepartment].data[z].email}'>Copy!</button>
            </div>
            <br/>
            </div>
            Address: <br/>
            <div class='textCenter empData'>
            ${DB[currentDepartment].data[z].address}
            <div class='copyButtonContainer'>
              <button class='copyButton' value='${DB[currentDepartment].data[z].address}'>Copy!</button>
            </div>
            <br/>
            </div>
            Birthday: <br/>
            <div class='textCenter empData'>
            ${DB[currentDepartment].data[z].birthday}
            <div class='copyButtonContainer'>
              <button class='copyButton' value='${DB[currentDepartment].data[z].birthday}'>Copy!</button>
            </div>
            <br/>
            </div>
            Notes: <br/>
            <div class='textCenter empData'>
              <div class='selectNone' style='display: inline-block;color:white;opacity:0;'>
                12345
              </div>
              ${DB[currentDepartment].data[z].notes}
              <div class='copyButtonContainer'>
                <button class='copyButton' style='bottom: 5px;' value='${DB[currentDepartment].data[z].notes}'>Copy!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
        `;
      }
    }

    table += '</div>';
    if (document) {
      document.getElementById('topRight').innerHTML = table;
    }
    setCurrentActive();
    addCopyEventListeners();
    return;
  }

  function addCopyEventListeners() {
    for(let i = 0; i < document.getElementsByClassName("copyButton").length; i++) {
      document.getElementsByClassName("copyButton")[i].addEventListener('click',()=>{
        copyText(document.getElementsByClassName("copyButton")[i].value);
      });
    }
    return;
  }

  function fetchDB() {
    let DB = get('employeeDB').then(function (DB) {
      return DB;
    });
    return DB;
  }

  function addDepartmentEventListeners() {
    let buttonList = document.querySelectorAll("button.list-group-item");
    for (var i = 0; i < buttonList.length; i++) {
      buttonList[i].addEventListener('click', function (e) {
        let clickedDepartment = parseInt(e.target.getAttribute('value'));
        setCurrentDepartment(clickedDepartment);
      });
    }
    return;
  }

  function createDatabase() {
    var defaultDB =
      [
        {
          description:
          {
            departmentName: "Management"
          },
          data:
            [
              {
                firstName: 'Bob',
                lastName: 'Bobb',
                email: 'bob@bob.bob',
                birthday: '1964-06-30',
                address: '1234 bob lane',
                notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In id elementum metus. Mauris tempor felis nulla, ac placerat urna mattis a. Suspendisse in libero in libero iaculis dapibus eu ac arcu. Donec tellus lorem, molestie a varius in, fringilla eu dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi at dictum dui. Vivamus eleifend gravida auctor. Praesent ut nibh nec dolor auctor faucibus vel sed tellus. Phasellus ut pellentesque orci. In tincidunt, lorem convallis auctor suscipit, nibh lorem vehicula massa, vitae laoreet augue massa et erat. Fusce ac aliquam enim. Nam in justo nibh. Curabitur id nibh et est mollis ultricies.'
              }
            ]
        },
        {
          description:
          {
            departmentName: "Cleaning"
          },
          data:
            [
              {
                firstName: 'Bobby',
                lastName: 'Bobbyb',
                email: 'bobasdf@bob.bob',
                birthday: '1961-06-05',
                address: '1asd234 bob lane',
                notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur purus tortor, quis placerat purus viverra vitae. Nunc a convallis ligula. Praesent nec finibus leo. Aliquam imperdiet orci ac tristique imperdiet. Etiam eget posuere massa, at gravida ex. Vivamus mollis dolor risus, eget luctus eros maximus sed. Donec posuere, lorem volutpat lacinia eleifend, elit urna semper ligula, sit amet congue tortor quam at ligula. Proin et lacinia lacus. Aliquam congue urna convallis massa placerat, non porttitor neque aliquam. Proin suscipit pretium leo et euismod.'
              }
            ]
        },
      ];
    set('employeeDB', defaultDB)
      .then(() => {
        checkDB();
        return;
      })
      .catch(err => (alert('ERROR: ' + err)));
  }

  return (
    <div>
      <div id='blueScreenContainer' className='displayNone selectNone' onClick={exitExitClick}><img src={blue} id='blueScreen' alt=''></img></div>
      <div id='backingBlue' className='displayNone' onClick={exitExitClick}></div>
      <header id='header' className='selectNone'>
        <Row>
          <Col>
            <FontAwesomeIcon icon={faFolderOpen} style={{ color: 'rgb(255, 242, 140)' }} /> EmployeeDirectory:\
            <div onClick={exitClick} className='headerButton'><span className='exitButton headerButtonInner'>X</span></div>
            <div onClick={clippyClick} className='headerButton'><span className='helpButton headerButtonInner'>?</span></div>
          </Col>
        </Row>
      </header>
      <div id='containerPadding'>
        <Container fluid id='main'>
          <Nav className='navUnderline'>
            <Dropdown>
              <Dropdown.Toggle className='optionButton' id="menuFile" data-toggle="dropdown">
                File
              </Dropdown.Toggle>
              <Dropdown.Menu className='dropdownMenuList'>
                <Dropdown.Item className='dropdownMenuListItem' onClick={addDepartment}>Add Department</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-2">Add Employee</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' onClick={createDatabase}>Use a Data Seed</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle className='optionButton' id="menuEdit" data-toggle="dropdown">
                Edit
              </Dropdown.Toggle>
              <Dropdown.Menu className='dropdownMenuList'>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-1">Departments</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' onClick={clearAll}>Clear All</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle className='optionButton' id="menuAbout" data-toggle="dropdown">
                About
              </Dropdown.Toggle>
              <Dropdown.Menu className='dropdownMenuList'>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-1">Project's Github</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-2">Github</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-3">LinkedIn</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          <Row>

            <Col md={4}>
              <div className='middleInner leftInner'>
                <ListGroup variant="flush" id='departmentList'>

                  <ListGroup.Item action value='-1'>
                    <FontAwesomeIcon icon={faUsers} /> All
                    <span id='allLength' style={{ float: 'right' }}>0</span>
                  </ListGroup.Item>

                </ListGroup>

              </div>
            </Col>

            <Col md={8}>
              <Row>
                <Col>
                  <div className='middleInner' id='topRight'>
                    [ Loading ]
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='middleInner bottomRight disabled' id='bottomRight'>
                    Click 'File' and select what you'd like to add!
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <audio id="error">
          <source src={error}></source>
        </audio>
      </div>
    </div>
  );
}

export default Table;
