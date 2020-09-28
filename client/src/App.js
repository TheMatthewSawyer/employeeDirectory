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

function App() {

  const [currentDepartment, setCurrentDepartment] = React.useState(-1);

  React.useEffect(() => {

    checkDB();

  }, []);


  
  function checkDB() {
    get('employeeDB').then(function (DB) {

      if (DB === undefined) {
        console.log('new');
        document.getElementById('topRight').innerHTML = `<div style='width: 100%; text-align: center;'>Empty!</div>`;
      } else {
        console.log('exists');
        console.log(DB);
        let departmentList = document.getElementById('departmentList');
        let lengthAll = 0;
        let buttonList = document.querySelectorAll("button.list-group-item");
        for(var i = 1; i < buttonList.length; i++) {
          buttonList[i].remove();
        }
        for (let i = 0; i < DB.length; i++) {
          departmentList.innerHTML +=
            `<button class="list-group-item list-group-item-action" value="${i}">
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
    console.log('exit');
  }

  const clippyClick = () => {
    console.log('clippy');
  }

  function renderDepartments(DB = fetchDB()) {
    let table = `<table><tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Address</th></tr>`;
    console.log(DB)
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
  }

  function fetchDB() {
    var DB = get('employeeDB').then(function (DB) {
      return DB;
    });
    console.log(DB);
    return DB;
  }

  function addDepartmentEventListeners() {
    let buttonList = document.querySelectorAll("button.list-group-item");
    console.log(buttonList);
    for(var i = 1; i < buttonList.length; i++) {
      buttonList[i].addEventListener('click', function (e) {
        console.log(parseInt(e.target.getAttribute('value')));
        setCurrentDepartment(parseInt(e.target.getAttribute('value')));
        console.log(currentDepartment)
      });
    }
  }

  createDatabase();
  /*
  `<button class="list-group-item list-group-item-action">
            Name
            <span style="float: right;">0</span>
          </button>`
  */
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
        return;
      })
      .catch(err => (alert('ERROR: ' + err)));
  }





  return (
    <div>
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
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle className='optionButton' id="menuEdit" data-toggle="dropdown">
                Edit
              </Dropdown.Toggle>
              <Dropdown.Menu className='dropdownMenuList'>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item className='dropdownMenuListItem' href="#/action-3">Something else</Dropdown.Item>
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
                  <ListGroup.Item action onClick={clippyClick} active>
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
                    [ Loading ]
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

export default App;
