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

import blue from './images/blue.jpg';

function Table(props) {
    const currentDepartment = props.currentDepartment;
    const setCurrentDepartment = props.setCurrentDepartment;

  React.useEffect(() => {

    // console.log(currentDepartment);
    // let buttonListForInitialActive = document.querySelectorAll("button.list-group-item");
    // if(currentDepartment === -1) {
    //   buttonListForInitialActive[0].classList.add('active');
    // } else {
    //   buttonListForInitialActive[currentDepartment].classList.add('active');
    //   console.log('here')
    // }


  }, []);


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
        for(var i = 1; i < buttonList.length; i++) {
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
          `
          lengthAll++;
        }
        document.getElementById('allLength').innerHTML = lengthAll;
        addDepartmentEventListeners();
        renderDepartments(DB);
      }
      return;
    });
    return;
  }



  const exitClick = () => {
    var blueScreenContainer = document.getElementById('blueScreenContainer');
    blueScreenContainer.classList.toggle('displayNone');
  }

  const clippyClick = () => {
    console.log('clippy');
  }

  const clearAll = () => {
    if(!window.confirm('Are you sure you want to clear? This cannot be undone')) {
      return;
    } else {
      clear();
      let buttonListForInitialActive = document.querySelectorAll("button.list-group-item");
      for(let i = 1; i < buttonListForInitialActive.length; i++) {
        buttonListForInitialActive[i].remove();
      }
      document.getElementById('allLength').innerHTML = 0;
      checkDB();
      return;
    }
  }

  function renderDepartments(DB = fetchDB()) {
    let table = `<table><tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Address</th></tr>`;
    // console.log(DB)
    if (currentDepartment === -1) {
      for (let x = 0; x < DB.length; x++) {
        for (let y = 0; y < DB[x].data.length; y++) {
          table += `
          <tr>
          <td>${DB[x].data[y].firstName}</td>
          <td>${DB[x].data[y].firstName}</td>
          <td>${DB[x].data[y].email}</td>
          <td>${DB[x].data[y].address}</td>
          </tr>
          `;
        }
      }
    } else {
      for (let z = 0; z < DB[currentDepartment].data.length; z++) {
        table += `
          <tr>
          <td>${DB[currentDepartment].data[z].firstName}</td>
          <td>${DB[currentDepartment].data[z].firstName}</td>
          <td>${DB[currentDepartment].data[z].email}</td>
          <td>${DB[currentDepartment].data[z].address}</td>
          </tr>
          `;
      }
    }
      
    table += '</table>'
    if(document) {
      document.getElementById('topRight').innerHTML = table;
    }
    let buttonList = document.querySelectorAll("button.list-group-item");
    buttonList[currentDepartment + 1].classList.add('active');
  }

  function fetchDB() {
    var DB = get('employeeDB').then(function (DB) {
      return DB;
    });
    // console.log(DB);
    return DB;
  }

  function addDepartmentEventListeners() {
    let buttonList = document.querySelectorAll("button.list-group-item");
    // console.log(buttonList);
    for(var i = 0; i < buttonList.length; i++) {
      buttonList[i].addEventListener('click', function (e) {
        let clickedDepartment = parseInt(e.target.getAttribute('value'));
        let position = clickedDepartment + 1;
        let buttonListForClick = document.querySelectorAll("button.list-group-item");
        console.log('clickedDepartment: ' + clickedDepartment + ' position: ' + position + ' currentDepartment: ' + currentDepartment)
        buttonListForClick[currentDepartment + 1].classList.remove('active');
        // buttonListForClick[position].classList.add('active');
        console.log(buttonListForClick[position])
        setCurrentDepartment(clickedDepartment);
        // let department = targetedButton - 1;
        // console.log(targetedButton + ' td ' + department + ' cd ' + currentDepartment);
        // setCurrentDepartment(department);
        // let buttonListForClick = document.querySelectorAll("button.list-group-item");
        // buttonListForClick[currentDepartment + 1].classList.remove('active');
        // console.log(buttonListForClick);
        // buttonListForClick[targetedButton + 1].classList.add('active');
        // console.log(currentDepartment);

      });
    }
    return;
  }

  // createDatabase();

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
                address: '1234 bob lane'
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
                address: '1asd234 bob lane'
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
      <div id='blueScreenContainer' className='displayNone selectNone'  onClick={exitClick}><img src={blue} id='blueScreen' alt=''></img></div>
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
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-1">Add Department</Dropdown.Item>
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
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-2">Employees</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' onClick={clearAll}>Clear All</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle className='optionButton' id="menuAbout" data-toggle="dropdown">
                About
              </Dropdown.Toggle>
              <Dropdown.Menu className='dropdownMenuList'>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          <Row>

            <Col md={4}>
              <div className='middleInner leftInner'>
                <ListGroup variant="flush" id='departmentList'>

                  <ListGroup.Item action value='-1' active>
                    <FontAwesomeIcon icon={faUsers} /> All
                    <span id='allLength' style={{ float: 'right' }}>0</span>
                  </ListGroup.Item>

                </ListGroup>

              </div>
            </Col>

            <Col md={8}>
              <Row>
                <Col>
                  <div className='middleInner rightInner' id='topRight'>
                    [ Loading ]
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='middleInner rightInner' id='bottomRight'>
                    asdf
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Table;
